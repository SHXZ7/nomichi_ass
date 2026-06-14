"use client";

import { useState } from "react";
import { Sparkles, Clipboard, Check, Send, MessageSquare } from "lucide-react";

export default function WhatsAppDraft({ lead }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch("/api/generate-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: lead.name,
          trip: lead.trips?.name,
          expectations: lead.expectations,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!message) return;
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Format phone number for WhatsApp Link (e.g. only numbers, prefix is important)
  const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : "";
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">WhatsApp Assistant</h3>
            <p className="text-[10px] text-gray-400 font-medium">Create a personalized message</p>
          </div>
        </div>
        {!message && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FFFBF5] text-rust border border-rust/10 uppercase tracking-wider">
            <Sparkles size={8} /> AI Draft
          </span>
        )}
      </div>

      {!message ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            Generate a warm, custom first-contact draft for {lead.name} based on their trip preferences and expectations.
          </p>
          <button
            onClick={generate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-ink/90 text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Drafting message...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-[#FFFE00]" />
                <span>Generate WhatsApp Draft</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-[#FFFBF5] border border-gray-100 rounded-xl p-4 text-xs text-ink leading-relaxed whitespace-pre-wrap select-all shadow-inner">
            {message}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-ink hover:bg-gray-50 transition-all rounded-xl py-2 px-3 text-xs font-semibold text-gray-600 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-600" />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <Clipboard size={14} />
                  <span>Copy Message</span>
                </>
              )}
            </button>

            {lead.phone && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-all rounded-xl py-2 px-3 text-xs font-semibold text-white cursor-pointer"
              >
                <Send size={14} />
                <span>Send Chat</span>
              </a>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={generate}
              disabled={loading}
              className="text-[10px] font-bold text-rust hover:underline uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Regenerating..." : "Regenerate Message"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
