import { z } from "zod";

export const toneEnum = z.enum([
  "polite",
  "rude",
  "angry",
  "commanding",
  "friendly",
  "neutral",
  "sarcastic",
  "frustrated",
]);

export const intentEnum = z.enum([
  "request",
  "command",
  "question",
  "complaint",
  "appreciation",
  "greeting",
  "information",
]);

export const voiceAnalysisSchema = z.object({
  original_text: z.string().describe("The original input text, returned verbatim"),
  tone: toneEnum,
  intent: intentEnum,
  politeness_score: z.number().int().min(0).max(100),
  emotion: z.string().describe("Concise emotion label e.g. 'calm', 'urgent', 'angry', 'neutral'"),
  emotion_intensity: z.number().int().min(0).max(100),
  confidence_score: z.number().int().min(0).max(100),
  improved_text: z.string().describe("A rewritten, improved version of the original message"),
});

export type VoiceAnalysisResult = z.infer<typeof voiceAnalysisSchema>;
