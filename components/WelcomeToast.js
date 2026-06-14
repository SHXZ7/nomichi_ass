"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function WelcomeToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show only once per browser session when they enter the dashboard
    const hasShown = sessionStorage.getItem("welcome_shown");
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShow(true);
        sessionStorage.setItem("welcome_shown", "true");
      }, 500);

      // Auto-hide after 5 seconds
      const hideTimer = setTimeout(() => {
        setShow(false);
      }, 5500);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out transform translate-y-0 opacity-100">
      <div className="bg-[#1C1B1A] text-white border border-white/10 rounded-2xl p-5 shadow-2xl flex items-start gap-4 max-w-sm">
        <div className="w-2 h-2 rounded-full bg-rust mt-2 shrink-0 animate-pulse" />
        <div className="flex-1 space-y-1">
          <h4 className="font-serif font-bold text-base text-white">Welcome back!</h4>
          <p className="text-xs text-[#FFFBF5]/75 leading-relaxed">
            Ready for Monday morning? Let's review the new leads.
          </p>
          <span className="text-[10px] italic text-[#FFFBF5]/40 block pt-1">
            Travel that finds you.
          </span>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
