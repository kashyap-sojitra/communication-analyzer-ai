import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { voiceAnalysisSchema } from "@/lib/voice-analyzer";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "";
}

function getStatusCode(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof (error as { statusCode?: unknown }).statusCode === "number"
  ) {
    return (error as { statusCode: number }).statusCode;
  }

  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (typeof text !== "string") {
      return NextResponse.json(
        { error: true, message: "Input must be a string", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();

    if (!trimmedText) {
      return NextResponse.json({
        original_text: "",
        tone: "neutral",
        intent: "information",
        politeness_score: 50,
        emotion: "neutral",
        emotion_intensity: 0,
        confidence_score: 0,
        improved_text: "Please provide a voice input so I can help you.",
      });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: true, message: "API Key missing. Please check .env", code: "MISSING_KEY" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a composite of three roles:
1. Communication Expert: understands pragmatics, register, and linguistic etiquette
2. Behavioral Psychologist: reads emotional subtext, motivation, and confidence levels
3. Polite Conversation Assistant: rewrites messages with empathy and clarity

Analyze the provided transcribed speech text and return structural analysis.
Behavioral Rules:
- Detect subtle cues like sarcasm, passive-aggression, or understatement.
- Handle short inputs (1-3 words) without defaulting to "neutral" unless truly warranted.
- For ambiguous inputs, tone hierarchy: sarcastic > angry > frustrated > rude > commanding > neutral > friendly > polite
- Ensure scoring consistency (politeness, emotion_intensity, confidence) on a 0-100 integer scale.
- Generate an 'improved_text' version based on the detected tone (e.g., soften an angry message, politely reframe a command, clarify a sarcastic remark). The improved message MUST preserve original intent and topic, be approximately the same length, and contain NO caveats or meta-commentary (like "improved version").
`;

    let result;
    try {
      try {
        result = await generateObject({
          model: google("gemini-2.5-flash"), 
          schema: voiceAnalysisSchema,
          system: systemPrompt,
          prompt: `Analyze the following text: "${trimmedText}"`,
        });
      } catch (firstError: unknown) {
        const errorMsg = getErrorMessage(firstError).toLowerCase();
        const isQuota = errorMsg.includes("quota") || getStatusCode(firstError) === 429;
        
        if (isQuota) {
          throw firstError; 
        }

        console.warn("Primary model (2.5-flash) failed, trying fallback (2.0-flash-lite)...", getErrorMessage(firstError));
        
        result = await generateObject({
          model: google("gemini-2.0-flash-lite"), 
          schema: voiceAnalysisSchema,
          system: systemPrompt,
          prompt: `Analyze the following text: "${trimmedText}"`,
        });
      }
    } catch (e: unknown) {
      const errorMsg = getErrorMessage(e).toLowerCase();
      const isQuota = errorMsg.includes("quota") || getStatusCode(e) === 429;

      if (isQuota) {
        return NextResponse.json(
          { 
            error: true, 
            message: "Google Gemini API Quota Exceeded. The free tier has a limit of 15 requests per minute. Please wait 60 seconds and try again.", 
            code: "QUOTA_EXCEEDED" 
          },
          { status: 429 }
        );
      }

      throw e;
    }

    return NextResponse.json(result.object);
  } catch (error: unknown) {
    console.error("Critical Error in Voice Analysis API:", error);
    const statusCode = getStatusCode(error);
    const message = getErrorMessage(error);
    
    return NextResponse.json(
      { 
        error: true, 
        message: message || "An unexpected error occurred during analysis.", 
        code: statusCode === 404 ? "MODEL_NOT_FOUND" : "PROCESSING_ERROR" 
      },
      { status: statusCode || 500 }
    );
  }
}
