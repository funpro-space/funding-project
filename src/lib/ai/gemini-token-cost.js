/**
 * Approximate Vertex list pricing (USD per 1M tokens). Verify against current
 * https://cloud.google.com/vertex-ai/generative-ai/pricing — rates change.
 */
export const VERTEX_GEMINI_USD_PER_MTOKENS = {
  "gemini-1.5-pro": { input: 1.25, output: 5.0 },
  "gemini-1.5-flash": { input: 0.075, output: 0.3 },
  "gemini-2.5-flash-lite": { input: 0.075, output: 0.3 },
  "gemini-3.5-flash": { input: 0.075, output: 0.3 },
  "gemini-3.5-pro": { input: 1.25, output: 5.0 },
};

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

/**
 * @param {string} model
 * @param {{ promptTokenCount?: number; candidatesTokenCount?: number } | null | undefined} usage
 */
export function estimateGeminiVertexUsdCost(model, usage) {
  const u = usage ?? {};
  const pricing =
    VERTEX_GEMINI_USD_PER_MTOKENS[model] ?? VERTEX_GEMINI_USD_PER_MTOKENS[DEFAULT_MODEL];
  const inputCost = (u.promptTokenCount ?? 0) * (pricing.input / 1_000_000);
  const outputCost = (u.candidatesTokenCount ?? 0) * (pricing.output / 1_000_000);
  return {
    input: Number(inputCost.toFixed(6)),
    output: Number(outputCost.toFixed(6)),
    total: Number((inputCost + outputCost).toFixed(6)),
    currency: "USD",
  };
}
