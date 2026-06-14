"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";

export default function AddNote({ leadId }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitNote() {
    if (!note.trim()) return;
    setLoading(true);

    try {
      await supabase.from("notes").insert([
        {
          lead_id: leadId,
          content: note,
        },
      ]);
      setNote("");
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          className="bg-gray-50/50 border border-gray-200 rounded-2xl p-4 w-full text-xs text-ink focus:bg-white focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust shadow-inner transition-all duration-200 placeholder-gray-400"
          rows={3}
          value={note}
          placeholder="Type call notes, meeting log, or status updates here..."
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={submitNote}
          disabled={loading || !note.trim()}
          className="flex items-center gap-1.5 bg-ink hover:bg-ink/90 text-white py-2 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 disabled:opacity-40 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Adding log...</span>
            </>
          ) : (
            <>
              <Plus size={14} />
              <span>Add to Call Log</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
