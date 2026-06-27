import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { estimateGeminiVertexUsdCost } from "./gemini-token-cost.js";

const USAGE_LOG_FILE = path.join(process.cwd(), "ai", "logs", "usage.jsonl");

interface GeminiResponse {
  text?: string;
  response?: {
    text?: string;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
      totalTokenCount?: number;
    };
    usage?: unknown;
    candidates?: {
      content?: {
        parts?: {
          text?: string;
        }[];
      };
    }[];
  };
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  usage?: unknown;
}

function logUsageToFile(logEntry: Record<string, unknown>) {
  try {
    const dir = path.dirname(USAGE_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(USAGE_LOG_FILE, JSON.stringify(logEntry) + "\n");
  } catch (error) {
    console.error("Failed to write to usage log:", error);
  }
}

/**
 * Vertex `generateContent` treats bare ids as `publishers/google/models/...`.
 */
function normalizeVertexGenerateContentModel(modelName: string): string {
  const m = modelName.trim();
  if (!m) return m;
  const lower = m.toLowerCase();
  if (lower.startsWith("publishers/") || lower.startsWith("projects/")) return m;
  if (/^(google|meta)\//i.test(m)) return m;
  return m;
}

/** Gemini 3 preview models are served from the `global` Vertex endpoint, not regional. */
function resolveVertexLocation(modelName: string): string {
  if (/gemini-3/i.test(modelName)) {
    return process.env.GEMINI_3_VERTEX_LOCATION?.trim() || "global";
  }
  return process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
}

function getVertexClientForModel(modelName: string) {
  const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID;
  if (!project) throw new Error("GOOGLE_CLOUD_PROJECT is not set");
  const location = resolveVertexLocation(modelName);
  return {
    client: new GoogleGenAI({
      vertexai: true,
      project,
      location,
    }),
    location,
  };
}

function getAiStudioModel(modelId: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: modelId });
}

function vertexGenerationConfig(modelName: string, maxOutputTokens: number) {
  const base = {
    temperature: 0.2 as const,
    maxOutputTokens,
  };
  if (/gemini-(2\.5|3)/i.test(modelName)) {
    return {
      ...base,
      thinkingConfig: { thinkingBudget: 0 },
    };
  }
  return base;
}

export type GenerateTextOptions = {
  maxOutputTokens?: number;
  /** Vertex / AI Studio model id (e.g. gemini-2.5-flash). When omitted, uses defaults (lite on Vertex, 2.5-flash on Studio). */
  model?: string;
};

export async function generateText(
  prompt: string,
  options?: GenerateTextOptions,
): Promise<string> {
  const maxOutputTokens = options?.maxOutputTokens ?? 2048;
  const vertexDefaultModel = process.env.GEMINI_VERTEX_MODEL?.trim() || "gemini-2.5-flash-lite";
  const studioDefaultModel = process.env.GEMINI_STUDIO_MODEL?.trim() || "gemini-2.5-flash";
  try {
    const requestId = randomUUID();
    // Prefer Vertex AI (GCP billing/credits) when configured; fallback to AI Studio key.
    const hasVertex =
      Boolean(process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID) &&
      (Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_KEY_FILE) ||
       Boolean(process.env.K_SERVICE));

    if (hasVertex) {
      // Support existing env naming used elsewhere in the app.
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_CLOUD_KEY_FILE) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_CLOUD_KEY_FILE;
      }

      const project =
        process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID || "";
      const modelName = options?.model?.trim() || vertexDefaultModel;
      const vertexModel = normalizeVertexGenerateContentModel(modelName);
      const { client: ai, location } = getVertexClientForModel(modelName);

      const started = Date.now();
      console.log(`[ai:${requestId}] vertex start`, {
        project,
        location,
        model: modelName,
        ...(vertexModel !== modelName ? { vertexModel } : {}),
        promptChars: prompt.length,
      });
      // Vertex: use models/* with `vertexai: true`
      const timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS || 45_000);
      const resp = await Promise.race([
        ai.models.generateContent({
          model: vertexModel,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: vertexGenerationConfig(modelName, maxOutputTokens),
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`AI request timed out after ${timeoutMs}ms`)), timeoutMs),
        ),
      ]);
      // SDK returns `text` helper on response in many cases; fall back to candidates.
      const r = resp as unknown as GeminiResponse;
      const text =
        r?.text ??
        r?.response?.text ??
        r?.candidates?.[0]?.content?.parts?.[0]?.text ??
        r?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "";
      const out = String(text || "").trim();
      const usage =
        r?.usageMetadata ??
        r?.response?.usageMetadata ??
        r?.usage ??
        r?.response?.usage ??
        null;
      const costUsd = estimateGeminiVertexUsdCost(modelName, usage);
      console.log(`[ai:${requestId}] vertex done`, {
        ms: Date.now() - started,
        outChars: out.length,
        usage,
        costUsd,
      });

      logUsageToFile({
        timestamp: new Date().toISOString(),
        model: modelName,
        requestedModel: options?.model || "default",
        promptLength: prompt.length,
        usage: {
          inputTokens: (usage as Record<string, number> | null)?.promptTokenCount || 0,
          outputTokens: (usage as Record<string, number> | null)?.candidatesTokenCount || 0,
          totalTokens: (usage as Record<string, number> | null)?.totalTokenCount || 0,
        },
        cost: costUsd,
      });

      return out;
    }

    const studioModel = options?.model?.trim() || studioDefaultModel;
    console.log(`[ai:${requestId}] ai-studio start`, { promptChars: prompt.length, model: studioModel });
    const model = getAiStudioModel(studioModel);
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: maxOutputTokens,
      },
    });
    const response = await result.response;
    const out = response.text();
    const rStudio = response as unknown as GeminiResponse;
    const usage =
      rStudio?.usageMetadata ??
      rStudio?.usage ??
      null;
    
    console.log(`[ai:${requestId}] ai-studio done`, { outChars: out.length, usage });

    logUsageToFile({
      timestamp: new Date().toISOString(),
      model: studioModel,
      requestedModel: options?.model || "default",
      promptLength: prompt.length,
      usage: {
        inputTokens: (usage as Record<string, number> | null)?.promptTokenCount || 0,
        outputTokens: (usage as Record<string, number> | null)?.candidatesTokenCount || 0,
        totalTokens: (usage as Record<string, number> | null)?.totalTokenCount || 0,
      },
      cost: { input: 0, output: 0, total: 0, currency: "USD" }, // Note: Add studio cost estimation later if needed
    });

    return out;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate text");
  }
}
