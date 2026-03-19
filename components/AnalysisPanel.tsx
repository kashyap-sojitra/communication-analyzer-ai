"use client";

import { VoiceAnalysisResult } from "@/lib/voice-analyzer";

export function AnalysisPanel({ result, isAnalyzing, error }: { result: VoiceAnalysisResult | null, isAnalyzing: boolean, error: string | null }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full min-h-75 flex flex-col">
      {isAnalyzing ? (
        <div className="flex-1 flex items-center justify-center text-indigo-400 animate-pulse font-medium">Processing subtext...</div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-400 font-medium">{error}</div>
      ) : result ? (
        <div className="space-y-4 text-slate-300">
          <h3 className="text-xl font-bold text-white mb-2">Analysis Complete</h3>
          <p><strong className="text-indigo-400">Tone:</strong> {result.tone}</p>
          <p><strong className="text-indigo-400">Intent:</strong> {result.intent}</p>
          <p><strong className="text-indigo-400">Emotion:</strong> {result.emotion} (Intensity: {result.emotion_intensity}/100)</p>
          <p><strong className="text-indigo-400">Politeness:</strong> {result.politeness_score}/100</p>
          <p><strong className="text-indigo-400">Confidence:</strong> {result.confidence_score}%</p>
          <div className="mt-4 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <strong className="text-indigo-300 block mb-1">Improved Text:</strong>
            <span className="text-white italic">{result.improved_text}</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 italic">Analysis results will appear here...</div>
      )}
    </div>
  );
}
