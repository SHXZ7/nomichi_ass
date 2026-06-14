"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function VibeAdvisor({ name, expectations, tripName }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function analyze() {
    setLoading(true);
    try {
      const res = await fetch("/api/vibe-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, expectations, tripName }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#FFFBF5] rounded-xl border border-gray-150 p-4 space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <Sparkles size={10} className="text-rust" /> AI Vibe Analysis
        </span>
        {result && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            result.fit ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}>
            Match: {result.matchPercentage}%
          </span>
        )}
      </div>

      {!result ? (
        <button
          onClick={analyze}
          disabled={loading}
          className="w-full flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:border-rust hover:text-rust text-xs font-semibold py-2 px-3 rounded-xl transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-rust" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Evaluating traveler profile...</span>
            </>
          ) : (
            <>
              <Sparkles size={12} className="text-[#D55D27]" />
              <span>Evaluate Traveler Vibe</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs">
            {result.fit ? (
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            )}
            <p className="text-ink leading-relaxed font-medium">
              {result.reason}
            </p>
          </div>
          <button
            onClick={() => setResult(null)}
            className="text-[9px] font-bold text-gray-400 hover:text-ink uppercase tracking-wider cursor-pointer"
          >
            Clear Analysis
          </button>
        </div>
      )}
    </div>
  );
}
