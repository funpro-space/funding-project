import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import dbConnect from "@/lib/mongodb";
import FounderProfile from "@/models/FounderProfile";
import { estimateGeminiVertexUsdCost } from "@/lib/ai/gemini-token-cost";

function getAiClient() {
  const hasVertex =
    Boolean(process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID) &&
    (Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_KEY_FILE) ||
     Boolean(process.env.K_SERVICE));

  console.log("[WORKSPACE_AI_POLISH_API] Checking AI Credentials...");

  if (hasVertex) {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_CLOUD_KEY_FILE) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_CLOUD_KEY_FILE;
    }

    const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || "global";
    const model = process.env.GEMINI_VERTEX_MODEL || "gemini-2.5-flash-lite";

    console.log(`[WORKSPACE_AI_POLISH_API] Using Vertex AI provider. Model: "${model}"`);
    
    return {
      ai: new GoogleGenAI({
        vertexai: true,
        project,
        location,
      }),
      model,
    };
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
  const model = process.env.GEMINI_STUDIO_MODEL || "gemini-2.5-flash-lite";

  console.log(`[WORKSPACE_AI_POLISH_API] Using Google AI Studio provider. Model: "${model}"`);

  return {
    ai: new GoogleGenAI({
      apiKey,
    }),
    model,
  };
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    polishedText: {
      type: "STRING",
      description: "The grammatically and logically optimized version of the user's input. It MUST be structured into 3-4 logical, high-impact sections (e.g., Core Craft, Community, Sustainability) as a markdown list. It MUST NOT be a continuous paragraph. Under each section, provide clear, punchy bullet points. Do NOT include any emojis, icons, unicode symbols, or HTML icon/character codes (such as 🪚, ✦, 🪵, or other symbols). Start each bullet point directly with a bold key phrase title (e.g., '* **Handcrafted Timber:** ...')."
    },
    rationale: {
      type: "STRING",
      description: "A short one-sentence note explaining what was sharpened."
    }
  },
  required: ["polishedText", "rationale"]
};

export async function POST(req: Request) {
  let guidelinesText = "";
  try {
    const filepath = path.join(process.cwd(), "src", "app", "api", "workspace-ai-review", "FOUNDER_NARRATIVE_GUIDELINES.md");
    if (fs.existsSync(filepath)) {
      guidelinesText = fs.readFileSync(filepath, "utf8");
      console.log("[WORKSPACE_AI_POLISH_API] Successfully loaded FOUNDER_NARRATIVE_GUIDELINES.md criteria dynamically.");
    } else {
      console.log("[WORKSPACE_AI_POLISH_API] FOUNDER_NARRATIVE_GUIDELINES.md not found.");
    }
  } catch (e) {
    console.warn("[WORKSPACE_AI_POLISH_API] Error reading FOUNDER_NARRATIVE_GUIDELINES.md:", e);
  }

  try {
    const body = await req.json();
    const rawNarrative = body?.rawNarrative || "";
    const address = body?.address || "";

    if (!rawNarrative || typeof rawNarrative !== "string" || !rawNarrative.trim()) {
      return NextResponse.json({ error: "Missing rawNarrative" }, { status: 400 });
    }

    const systemInstructions = `You are a supportive human editor optimizing and sharpening business narratives.
Your task is to grammatically and logically optimize the user's input, making it sound professional, structured, high-vibe, and aligned with standard business storytelling guidelines.

Refer closely to the following founder narrative validation guidelines to ensure your polish matches our tone, format, and strict diversity rules:

${guidelinesText || "Ensure focus on craft, community, and sustainability."}

Output Structure Rules:
- Format: Do not return a continuous paragraph. Break the user's input down into 3-4 logical, high-impact sections (e.g., Core Craft, Community, Sustainability).
- Bullets: Under each section, provide clear, punchy bullet points. Each bullet point MUST NOT contain any emojis, icons, unicode symbols, or HTML codes. Start each bullet point directly with a bold key phrase title (e.g., "* **Handcrafted Timber:** ...").

Tone Guardrails:
- Keep the language simple, direct, and grounded.
- Fix all typos (like "organicc" or "Ourwood"), but do not inject corporate buzzwords like "meticulously", "bespoke", "actively fosters", "enhance", "utilize", "transform", "navigate", "delve".
- Keep it feeling authentic to a real human maker.
- **No Emojis or Icons:** Absolutely do NOT output any emojis, unicode symbols, icons, or HTML icon codes (like 🪚, ✦, 🪵, etc.) in the polished text. Start bullets directly with the bold title.
- **No HTML Code or Entities:** Never output raw HTML tags, HTML codes, or HTML character entity escapes (like "&amp;", "&quot;", "&lt;", "&gt;") in the polished text. Always use standard plain text characters (e.g., use "&" instead of "&amp;").

Do not invent facts or add external claims that are not present in the original narrative.

Return a JSON object with 'polishedText' and 'rationale' as structured in the response schema.`;

    const { ai, model } = getAiClient();
    console.log(`[WORKSPACE_AI_POLISH_API] Initiating generateContent API call...`);

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: `Narrative to polish:\n"${rawNarrative}"` }]
        }
      ],
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json",
        responseSchema: responseSchema as Record<string, unknown>,
        temperature: 0.2,
      }
    });

    console.log("[WORKSPACE_AI_POLISH_API] generateContent call completed successfully.");

    // Detailed logs for Backend process status, Guidelines loaded, active Model, and exact Expense in USD
    const usage = response.usageMetadata;
    const cost = estimateGeminiVertexUsdCost(model, usage);
    
    console.log("==================== [AI ENGINE EXECUTION REPORT - POLISH] ====================");
    console.log(`| Model Executed:     "${model}"`);
    console.log(`| Guidelines Read:    FOUNDER_NARRATIVE_GUIDELINES.md (${guidelinesText ? `Loaded, ${guidelinesText.length} chars` : "FAILED/Empty fallback"})`);
    console.log(`| User Narrative:     "${rawNarrative.substring(0, 80).replace(/\n/g, " ")}..." (${rawNarrative.length} chars)`);
    console.log("|---------------------------------------------------------------------");
    if (usage) {
      console.log(`| Token Usage:        Input: ${usage.promptTokenCount} | Output: ${usage.candidatesTokenCount} | Total: ${usage.totalTokenCount}`);
      console.log(`| Total Expense:      $${cost.total.toFixed(6)} USD`);
      console.log(`| Cost Breakdown:     Input: $${cost.input.toFixed(6)} USD | Output: $${cost.output.toFixed(6)} USD`);
    } else {
      console.log("| Token Usage:        Unavailable in response metadata.");
      console.log("| Total Expense:      $0.000000 USD (Metadata missing)");
    }
    console.log("===============================================================================");

    if (!response.text) {
      throw new Error("Empty response text returned from Gemini API");
    }

    const structuredObject = JSON.parse(response.text);
    let finalPayload = { ...structuredObject };

    if (address) {
      try {
        await dbConnect();
        const updatedProfile = await FounderProfile.findByIdAndUpdate(
          address.toLowerCase(),
          {
            $inc: {
              lvl1InputTokens: usage?.promptTokenCount || 0,
              lvl1OutputTokens: usage?.candidatesTokenCount || 0,
              lvl1TotalTokens: usage?.totalTokenCount || 0,
              lvl1CostUsd: cost.total || 0,
            },
          },
          { upsert: true, new: true }
        );
        console.log("[WORKSPACE_AI_POLISH_API] Auto-saved polish token usage successfully.");
        
        finalPayload = {
          ...structuredObject,
          lvl1InputTokens: updatedProfile?.lvl1InputTokens || 0,
          lvl1OutputTokens: updatedProfile?.lvl1OutputTokens || 0,
          lvl1TotalTokens: updatedProfile?.lvl1TotalTokens || 0,
          lvl1CostUsd: updatedProfile?.lvl1CostUsd || 0,
        };
      } catch (dbErr) {
        console.error("[WORKSPACE_AI_POLISH_API] Database write error:", dbErr);
      }
    }

    return NextResponse.json(finalPayload);
  } catch (error) {
    console.error("[WORKSPACE_AI_POLISH_API] CRITICAL Error:", error);
    // Safe fallback if API fails or credentials missing
    const fallbackText = "Narrative polished. Ready for review.";
    return NextResponse.json({
      polishedText: "Polished narrative placeholder: " + fallbackText,
      rationale: "There was an error connecting to the AI polishing service. Showing placeholder."
    }, { status: 500 });
  }
}
