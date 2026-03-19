"use client";

export function InputPanel({ text, setText, onAnalyze, isAnalyzing }: { text: string, setText: (val: string) => void, onAnalyze: () => void, isAnalyzing: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to analyze..."
        className="w-full h-48 bg-transparent text-white placeholder-slate-500 resize-none outline-none"
      />
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing || !text.trim()}
        className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Request"}
      </button>
    </div>
  );
}
