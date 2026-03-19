"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BrainCircuit, Layers
} from "lucide-react";
import { VoiceAnalysisResult } from "@/lib/voice-analyzer";
import { InputPanel } from "@/components/InputPanel";
import { AnalysisPanel } from "@/components/AnalysisPanel";

export default function Home() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze text");
      }

      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-160 h-160 bg-indigo-500/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[10%] right-[10%] w-140 h-140 bg-purple-500/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-350 mx-auto px-6 py-12 md:py-20 lg:py-24">

        <header className="flex justify-between items-center mb-24 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
              <BrainCircuit className="text-white w-7 h-7" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">Vocalist <span className="text-indigo-500">AI</span></h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Core L-2 Stable</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-10">
              <NavLink label="System Stats" active />
            </nav>
            <div className="h-6 w-px bg-white/10 hidden md:block" />
          </div>
        </header>

        {/* Hero Headline */}
        <section className="text-center mb-32 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 mx-auto shadow-xl">
            <Layers size={12} />
            Unified Sentiment Infrastructure
          </div>
          <h2 className="text-6xl md:text-8xl font-black mb-10 heading-gradient tracking-tighter leading-[0.9]">
            Decrypt the <span className="text-indigo-500 text-glow">Spoken word.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto px-4 italic">
            Our intelligence engine extracts tonal subtext and emotional intensity from transcribed speech, providing empathy-driven reframing in milliseconds.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <InputPanel
              text={text}
              setText={setText}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 xl:col-span-8"
          >
            <AnalysisPanel
              result={result}
              isAnalyzing={isAnalyzing}
              error={error}
            />
          </motion.div>
        </div>

        <footer className="mt-48 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:items-start items-center gap-2 text-slate-600">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Vocalist AI Dashboard v1.2</p>
            <p className="text-[10px]">&copy; 2026 Intelligence Systems Group. No transcription data is stored on external servers.</p>
          </div>

          <div className="flex gap-10">
            <FooterLink label="System Status" dot />
          </div>
        </footer>

      </div>
    </div>
  );
}

function NavLink({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <a href="#" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-white ${active ? 'text-white' : 'text-slate-500'}`}>
      {label}
    </a>
  );
}

function FooterLink({ label, dot = false }: { label: string, dot?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">
      {dot && <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />}
      {label}
    </Link>
  );
}
