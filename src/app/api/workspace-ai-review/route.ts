import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import dbConnect from "@/lib/mongodb";
import FounderProfile from "@/models/FounderProfile";
import PublicStats from "@/models/PublicStats";
import GuestIpLimit from "@/models/GuestIpLimit";
import { estimateGeminiVertexUsdCost } from "@/lib/ai/gemini-token-cost";

// Initialize AI Client based on active environment credentials.
function getAiClient() {
  const hasVertex =
    Boolean(process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID) &&
    (Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_KEY_FILE) ||
     Boolean(process.env.K_SERVICE));

  console.log("[WORKSPACE_AI_REVIEW_API] Checking AI Credentials...");
  console.log("[WORKSPACE_AI_REVIEW_API] hasVertex:", hasVertex, {
    GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT || "undefined",
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS || "undefined",
    GEMINI_API_KEY_DEFINED: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY)
  });

  if (hasVertex) {
    // Support either env naming pattern for service account file
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_CLOUD_KEY_FILE) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_CLOUD_KEY_FILE;
    }

    const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || "global";
    const model = process.env.GEMINI_VERTEX_MODEL || "gemini-2.5-flash-lite";

    console.log(`[WORKSPACE_AI_REVIEW_API] Using Vertex AI provider. Project: "${project}", Location: "${location}", Model: "${model}"`);
    
    return {
      ai: new GoogleGenAI({
        vertexai: true,
        project,
        location,
      }),
      model,
      provider: "Vertex AI"
    };
  }

  // Fallback: AI Studio
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
  const model = process.env.GEMINI_STUDIO_MODEL || "gemini-2.5-flash-lite";

  console.log(`[WORKSPACE_AI_REVIEW_API] Using Google AI Studio provider. Key defined: ${Boolean(apiKey)}, Model: "${model}"`);

  return {
    ai: new GoogleGenAI({
      apiKey,
    }),
    model,
    provider: "AI Studio"
  };
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    overallSummary: {
      type: "STRING",
      description: "A highly organized, comprehensive 3-5 sentence summary and interpretation of the user's business, highlighting what they create, their operational core, and business model."
    },
    tagline: {
      type: "STRING",
      description: "A highly creative, inspirational, and professional 1-sentence tagline (under 10 words) that captures the unique identity of this business, e.g., 'Handweaving Heritage Linens for Modern Homes'."
    },
    cardSuggestions: {
      type: "OBJECT",
      description: "Personalized, high-vibe suggestions or highlights for each of the other workspace cards based on the user's business, written as positive 1-sentence remarks.",
      properties: {
        experienceProfile: {
          type: "STRING",
          description: "A highly personalized 1-sentence supportive remark about their unique heritage/experience, e.g., 'Your 12 years of hands-on expertise forms a resilient local knowledge node.'"
        },
        validationMetrics: {
          type: "STRING",
          description: "A highly personalized 1-sentence supportive remark about their core validation metrics, e.g., 'Your hand-crafting strategy shows exceptional operational clarity.'"
        },
        ecoGuidelines: {
          type: "STRING",
          description: "A highly personalized 1-sentence supportive remark about their ecological stewardship/materials, e.g., 'Weaving with local organic flax minimizes your regional carbon path.'"
        },
        registrationStatus: {
          type: "STRING",
          description: "A highly personalized 1-sentence supportive remark about their registration readiness, e.g., 'You are fully primed to register and anchor your artisanal node onchain.'"
        }
      },
      required: ["experienceProfile", "validationMetrics", "ecoGuidelines", "registrationStatus"]
    },
    qualificationStatus: {
      type: "STRING",
      description: "Detailed evaluation of qualification. Must consist of exactly ONE introductory paragraph of 1-2 sentences explaining their status, followed by a newline and 3-4 structured bullet points (each starting with '- ') highlighting key qualifications, primary strengths, or gaps to address."
    },
    industryExperience: {
      type: "OBJECT",
      properties: {
        inferredYearsOfExperience: {
          type: "INTEGER",
          description: "Inferred number of years of experience in the specific industry or craft. Set to 0 if not mentioned or too vague to estimate."
        },
        inferredMasteryTier: {
          type: "STRING",
          enum: ["Apprentice", "Professional", "Master", "Unknown"],
          description: "Inferred mastery level based on tenure and mentorship: Apprentice (<3 years), Professional (3-10 years), Master (10+ years, mentoring others), or Unknown."
        },
        missingExperienceDetail: {
          type: "BOOLEAN",
          description: "Set to true if the narrative lacks explicit background detail about their training, years of practice, or active history."
        }
      },
      required: ["inferredYearsOfExperience", "inferredMasteryTier", "missingExperienceDetail"]
    },
    overallQualified: { type: "BOOLEAN" },
    keyConcepts: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "A list of 4-6 highly specific, positive, and high-vibe key terms or short concepts/tags (1-3 words each) extracted from the narrative that highlight the project's unique strengths, e.g., 'Regenerative Agriculture', 'Artisanal Weaving', 'Hyper-Local Sourcing', 'Zero Waste Circularity'."
    },
    analysis: {
      type: "OBJECT",
      properties: {
        operationalStrategy: {
          type: "OBJECT",
          properties: {
            extractedText: { type: "STRING", description: "Extracted text about core creation strategy" },
            sufficient: { type: "BOOLEAN" },
            grade: { type: "STRING", enum: ["High", "Medium", "Low"], description: "Quality grade of the provided context for this category" },
            feedback: { type: "STRING", description: "Actionable suggestion on how the user can improve this specific section, especially if insufficient or low grade" },
            score: { type: "INTEGER", description: "Quality score from 1 to 5 based on standard rubrics. 1 is low, 5 is master/excellent." }
          },
          required: ["extractedText", "sufficient", "grade", "feedback", "score"]
        },
        sustainabilityProcess: {
          type: "OBJECT",
          properties: {
            extractedText: { type: "STRING", description: "Extracted text about process sustainability" },
            sufficient: { type: "BOOLEAN" },
            grade: { type: "STRING", enum: ["High", "Medium", "Low"], description: "Quality grade of the provided context for this category" },
            feedback: { type: "STRING", description: "Actionable suggestion on how the user can improve this specific section, especially if insufficient or low grade" },
            score: { type: "INTEGER", description: "Sustainability index / overall sustainability score from 1 to 5 based on SUSTAINABILITY_EDUCATION.md guidelines. 1 = initial/high-impact, 3 = established/eco-standard, 5 = master/regenerative." },
            resourceEfficiency: { type: "INTEGER", description: "Resource efficiency score from 1 to 5 based on guidelines." },
            circularityUpcycling: { type: "INTEGER", description: "Circularity and upcycling score from 1 to 5 based on guidelines." },
            ecosystemHarmony: { type: "INTEGER", description: "Ecosystem harmony score from 1 to 5 based on guidelines." }
          },
          required: ["extractedText", "sufficient", "grade", "feedback", "score", "resourceEfficiency", "circularityUpcycling", "ecosystemHarmony"]
        },
        worldBetterment: {
          type: "OBJECT",
          properties: {
            extractedText: { type: "STRING", description: "Extracted text about real-world community impact" },
            sufficient: { type: "BOOLEAN" },
            grade: { type: "STRING", enum: ["High", "Medium", "Low"], description: "Quality grade of the provided context for this category" },
            feedback: { type: "STRING", description: "Actionable suggestion on how the user can improve this specific section, especially if insufficient or low grade" },
            score: { type: "INTEGER", description: "Quality score from 1 to 5 based on standard rubrics. 1 is low, 5 is master/excellent." }
          },
          required: ["extractedText", "sufficient", "grade", "feedback", "score"]
        },
        expertiseOrigin: {
          type: "OBJECT",
          properties: {
            extractedText: { type: "STRING", description: "Extracted text about craft mastery and background" },
            sufficient: { type: "BOOLEAN" },
            grade: { type: "STRING", enum: ["High", "Medium", "Low"], description: "Quality grade of the provided context for this category" },
            feedback: { type: "STRING", description: "Actionable suggestion on how the user can improve this specific section, especially if insufficient or low grade" },
            score: { type: "INTEGER", description: "Quality score from 1 to 5 based on standard rubrics. 1 is low, 5 is master/excellent." }
          },
          required: ["extractedText", "sufficient", "grade", "feedback", "score"]
        }
      },
      required: ["operationalStrategy", "sustainabilityProcess", "worldBetterment", "expertiseOrigin"]
    }
  },
  required: ["overallSummary", "qualificationStatus", "industryExperience", "overallQualified", "keyConcepts", "analysis", "tagline", "cardSuggestions"]
};

export async function POST(req: Request) {
  let rawNarrative = "";
  let address = "";
  let updatedChatCount = 0;
  try {
    try {
      const body = await req.json();
      rawNarrative = body?.rawNarrative || body?.storyText || "";
      address = body?.address || "";
    } catch {
      console.warn("[WORKSPACE_AI_REVIEW_API] Failed to parse request body JSON");
    }

    console.log("[WORKSPACE_AI_REVIEW_API] Received narrative analysis request. Length:", rawNarrative?.length || 0, "Address:", address);

    if (!rawNarrative || typeof rawNarrative !== 'string' || !rawNarrative.trim()) {
      console.warn("[WORKSPACE_AI_REVIEW_API] Request rejected: missing or empty rawNarrative");
      return NextResponse.json({ error: "Missing narrative" }, { status: 400 });
    }

    let ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    if (!address) {
      const cookieHeader = req.headers.get('cookie') || '';
      const hasGuestCookie = cookieHeader.includes('guest_eval_limit=1');
      if (hasGuestCookie) {
        console.warn("[WORKSPACE_AI_REVIEW_API] Guest Cookie rate limit exceeded");
        return NextResponse.json({ error: "Guest rate limit exceeded. Please connect your wallet to continue." }, { status: 429 });
      }

      await dbConnect();
      const now = new Date();
      const limitRecord = await GuestIpLimit.findById(ip);
      
      if (limitRecord) {
        if (limitRecord.count >= 1 && limitRecord.resetAt > now) {
          console.warn(`[WORKSPACE_AI_REVIEW_API] Guest IP rate limit exceeded for IP: ${ip}`);
          return NextResponse.json({ error: "Guest rate limit exceeded. Please connect your wallet to continue." }, { status: 429 });
        }
        
        if (limitRecord.resetAt <= now) {
          limitRecord.count = 1;
          limitRecord.resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        } else {
          limitRecord.count += 1;
        }
        await limitRecord.save();
      } else {
        await GuestIpLimit.create({
          _id: ip,
          count: 1,
          resetAt: new Date(now.getTime() + 24 * 60 * 60 * 1000)
        });
      }
    }

    if (address) {
      await dbConnect();
      const normalizedAddress = address.toLowerCase();
      const profile = await FounderProfile.findById(normalizedAddress);
      
      let currentChatCount = profile?.chatCount || profile?.geminiEvaluation?.chatCount || 0;
      const now = new Date();
      if (profile && profile.updatedAt) {
        const lastUpdated = new Date(profile.updatedAt);
        const diffTime = Math.abs(now.getTime() - lastUpdated.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays >= 1) {
          currentChatCount = 0;
        }
      }

      if (currentChatCount >= 100) {
        return NextResponse.json({ error: "You have reached your daily limit of 100 narrative evaluations. Please try again tomorrow." }, { status: 403 });
      }
      
      updatedChatCount = currentChatCount + 1;
    }

    // Attempt to load guidelines dynamically from markdown file to inject into the system prompt
    let guidelinesText = "";
    let sustainabilityText = "";
    try {
      const filepath = path.join(process.cwd(), 'src', 'app', 'api', 'workspace-ai-review', 'FOUNDER_NARRATIVE_GUIDELINES.md');
      if (fs.existsSync(filepath)) {
        guidelinesText = fs.readFileSync(filepath, 'utf8');
        console.log("[WORKSPACE_AI_REVIEW_API] Successfully loaded FOUNDER_NARRATIVE_GUIDELINES.md criteria.");
      } else {
        console.log("[WORKSPACE_AI_REVIEW_API] FOUNDER_NARRATIVE_GUIDELINES.md not found. Falling back to default system instructions.");
      }
    } catch (e) {
      console.warn("[WORKSPACE_AI_REVIEW_API] Error reading FOUNDER_NARRATIVE_GUIDELINES.md:", e);
    }

    try {
      const sustFilepath = path.join(process.cwd(), 'src', 'app', 'api', 'workspace-ai-review', 'SUSTAINABILITY_EDUCATION.md');
      if (fs.existsSync(sustFilepath)) {
        sustainabilityText = fs.readFileSync(sustFilepath, 'utf8');
        console.log("[WORKSPACE_AI_REVIEW_API] Successfully loaded SUSTAINABILITY_EDUCATION.md guidelines.");
      }
    } catch (e) {
      console.warn("[WORKSPACE_AI_REVIEW_API] Error reading SUSTAINABILITY_EDUCATION.md:", e);
    }

    const systemInstructions = `You evaluate founder project narratives for a startup validation platform.
Refer closely to the following founder narrative validation guidelines when performing your evaluation:

${guidelinesText || "Evaluate the core creation strategy, sustainability process, real-world community impact, and craft mastery/background."}

Additionally, refer closely to the following detailed sustainability education and grading standard to compute scores and indexes from 1 to 5:

${sustainabilityText || "Evaluate and grade sustainability from 1 to 5."}

Perform the following tasks:
1. Extract and summarize what the founder creates and their operational core. Return this in 'overallSummary'.
2. Provide a detailed assessment of their qualifications based on our standards, returning this in 'qualificationStatus'. The text MUST start with exactly ONE concise introductory paragraph (1-2 sentences) summarizing their overall qualification, followed by a double-newline and exactly 3-4 structured bullet points (each starting with '- ') highlighting key primary strengths, compliance points, or specific gaps they need to resolve. Do not use more than one paragraph of prose.
3. Estimate their industry experience tenure ('inferredYearsOfExperience' as integer, and 'inferredMasteryTier' as Apprentice, Professional, Master, or Unknown). Set 'missingExperienceDetail' to true if their story is too vague or lacks clear professional timeline context.
4. Extract the four pillars (operationalStrategy, sustainabilityProcess, worldBetterment, expertiseOrigin) as detailed in the schema. Check if details are sufficient (true/false), grade each as High/Medium/Low, score each from 1 to 5 (assigning integer), and write actionable feedback to help them improve.
5. For the 'sustainabilityProcess' pillar, also assess the three sub-metrics: resourceEfficiency (1-5), circularityUpcycling (1-5), and ecosystemHarmony (1-5) according to the SUSTAINABILITY_EDUCATION.md guidelines and assign appropriate integer scores.
6. Extract 4-6 highly positive, high-vibe key concepts or short phrases (1-3 words each) from the narrative and return them in 'keyConcepts'.
7. Create a highly inspirational, beautiful and catchy tagline of under 10 words capturing the absolute essence of this business (under the 'tagline' key).
8. Generate highly personalized, positive, and supportive 1-sentence card highlights for each of the other workspace cards based on the business details, avoiding generic or repetitive phrases (under the 'cardSuggestions' key with 'experienceProfile', 'validationMetrics', 'ecoGuidelines', and 'registrationStatus' properties).`;

    const { ai, model, provider } = getAiClient();
    console.log(`[WORKSPACE_AI_REVIEW_API] Initiating generateContent API call via ${provider}...`);

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Narrative to evaluate:\n"${rawNarrative}"`
            }
          ]
        }
      ],
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json",
        responseSchema: responseSchema as Record<string, unknown>,
        temperature: 0.15,
      }
    });

    console.log("[WORKSPACE_AI_REVIEW_API] generateContent call completed successfully.");
    
    // Detailed logs for Backend process status, Guidelines loaded, active Model, and exact Expense in USD
    const usage = response.usageMetadata;
    const cost = estimateGeminiVertexUsdCost(model, usage);
    
    console.log("==================== [AI ENGINE EXECUTION REPORT] ====================");
    console.log(`| Model Executed:     "${model}" (${provider})`);
    console.log(`| Guidelines Read:    FOUNDER_NARRATIVE_GUIDELINES.md (${guidelinesText ? `Loaded, ${guidelinesText.length} chars` : "FAILED/Empty fallback"})`);
    console.log(`| Sustainability:     SUSTAINABILITY_EDUCATION.md (${sustainabilityText ? `Loaded, ${sustainabilityText.length} chars` : "FAILED/Empty fallback"})`);
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
    console.log("======================================================================");
    
    if (!response.text) {
      throw new Error("Empty response text returned from Gemini API");
    }

    const structuredObject = JSON.parse(response.text);
    console.log("[WORKSPACE_AI_REVIEW_API] Parsed structured response object successfully.", {
      overallQualified: structuredObject?.overallQualified,
      inferredYears: structuredObject?.industryExperience?.inferredYearsOfExperience,
      inferredTier: structuredObject?.industryExperience?.inferredMasteryTier,
      missingDetail: structuredObject?.industryExperience?.missingExperienceDetail
    });

    // Update global public stats
    try {
      await PublicStats.findByIdAndUpdate(
        "global",
        {
          $inc: {
            totalChats: 1,
            totalInputTokens: usage?.promptTokenCount || 0,
            totalOutputTokens: usage?.candidatesTokenCount || 0,
            totalTotalTokens: usage?.totalTokenCount || 0,
            totalCostUsd: cost.total || 0,
          }
        },
        { upsert: true }
      );
      console.log("[WORKSPACE_AI_REVIEW_API] Public stats successfully accumulated.");
    } catch (statsErr) {
      console.error("[WORKSPACE_AI_REVIEW_API] Failed to update global stats:", statsErr);
    }

    let finalPayload = { ...structuredObject };

    if (address) {
      structuredObject.chatCount = updatedChatCount;

      // Auto-save the complete evaluation and narrative in MongoDB so they never lose progress!
      try {
        const updatedProfile = await FounderProfile.findByIdAndUpdate(
          address.toLowerCase(),
          { 
            $set: { 
              chatCount: updatedChatCount,
              narrative: rawNarrative,
              geminiEvaluation: structuredObject
            },
            $inc: {
              lvl1InputTokens: usage?.promptTokenCount || 0,
              lvl1OutputTokens: usage?.candidatesTokenCount || 0,
              lvl1TotalTokens: usage?.totalTokenCount || 0,
              lvl1CostUsd: cost.total || 0
            },
            $setOnInsert: { isQualified: false }
          },
          { upsert: true, new: true }
        );
        console.log("[WORKSPACE_AI_REVIEW_API] Auto-saved evaluation result and updated chatCount/lvl1Tokens successfully.");
        
        finalPayload = {
          ...structuredObject,
          lvl1InputTokens: updatedProfile?.lvl1InputTokens || 0,
          lvl1OutputTokens: updatedProfile?.lvl1OutputTokens || 0,
          lvl1TotalTokens: updatedProfile?.lvl1TotalTokens || 0,
          lvl1CostUsd: updatedProfile?.lvl1CostUsd || 0,
        };
      } catch (dbErr) {
        console.error("[WORKSPACE_AI_REVIEW_API] Database write error on success path:", dbErr);
      }
    }

    const res = NextResponse.json(finalPayload);
    if (!address) {
      res.headers.set('Set-Cookie', 'guest_eval_limit=1; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict');
    }
    return res;
  } catch (error) {
    const err = error as Error & { statusCode?: number; responseBody?: string };
    console.error("[WORKSPACE_AI_REVIEW_API] CRITICAL AI Review API Error:", err);
    
    // Provide diagnostic breakdown of the error
    if (err.statusCode) {
      console.error(`[WORKSPACE_AI_REVIEW_API] HTTP Status Code: ${err.statusCode}`);
    }
    if (err.responseBody) {
      console.error(`[WORKSPACE_AI_REVIEW_API] Remote Response Body: ${err.responseBody}`);
    }

    console.log("[WORKSPACE_AI_REVIEW_API] Triggering fallback JSON configuration for user continuity.");
    
    // Fallback if AI fails or no API key is provided
    const fallbackResponse: Record<string, unknown> = {
      overallSummary: "We received your narrative description. Your project involves sustainable, local craftsmanship and community-driven production.",
      tagline: "Sustainable local craft and community production.",
      cardSuggestions: {
        experienceProfile: "Provide more details about your years of craft practice to calibrate tenure.",
        validationMetrics: "Establish complete viability guidelines under all core pillars.",
        ecoGuidelines: "Examine resource efficiency and circular upcycling channels.",
        registrationStatus: "Complete missing details to verify onchain eligibility."
      },
      qualificationStatus: "Your narrative displays strong local grounding. Please provide additional concrete parameters about your active timeline and operational tools to satisfy complete validation:\n- Outline specific tool or machinery models used in daily production.\n- Highlight circular upcycling channels for leftover waste materials.\n- Clarify educational training or formal apprenticeship tenure background.",
      industryExperience: {
        inferredYearsOfExperience: 0,
        inferredMasteryTier: "Unknown",
        missingExperienceDetail: true
      },
      overallQualified: true,
      keyConcepts: ["Sustainable Craft", "Local Sourcing", "Circular Design", "Community Impact"],
      analysis: {
        operationalStrategy: { 
          extractedText: "Core creation strategy details here.", 
          sufficient: true, 
          grade: "Medium", 
          feedback: "Provide more details about specific tools and workspace layout.",
          score: 3
        },
        sustainabilityProcess: { 
          extractedText: "Sustainability processes here.", 
          sufficient: true, 
          grade: "Medium", 
          feedback: "Detail material sourcing and recycling/upcycling channels.",
          score: 3,
          resourceEfficiency: 3,
          circularityUpcycling: 3,
          ecosystemHarmony: 3
        },
        worldBetterment: { 
          extractedText: "Community impact details here.", 
          sufficient: true, 
          grade: "Medium", 
          feedback: "Specify community workshop schedules or employment initiatives.",
          score: 3
        },
        expertiseOrigin: { 
          extractedText: "Expertise background here.", 
          sufficient: false, 
          grade: "Low", 
          feedback: "Highlight any training programs, apprenticeships, or years active.",
          score: 2
        }
      }
    };

    if (address) {
      fallbackResponse.chatCount = updatedChatCount;

      // Auto-save fallback state in MongoDB so they never lose progress!
      try {
        await FounderProfile.findByIdAndUpdate(
          address.toLowerCase(),
          { 
            $set: { 
              chatCount: updatedChatCount,
              narrative: rawNarrative,
              geminiEvaluation: fallbackResponse
            },
            $setOnInsert: { isQualified: false }
          },
          { upsert: true }
        );
        console.log("[WORKSPACE_AI_REVIEW_API] Auto-saved fallback evaluation result and updated chatCount successfully.");
      } catch (dbErr) {
        console.error("[WORKSPACE_AI_REVIEW_API] Database write error on fallback path:", dbErr);
      }
    }

    const res = NextResponse.json(fallbackResponse);
    if (!address) {
      res.headers.set('Set-Cookie', 'guest_eval_limit=1; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict');
    }
    return res;
  }
}
