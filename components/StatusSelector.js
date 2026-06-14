"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronDown, Check } from "lucide-react";

const statuses = [
  { value: "NEW", label: "New", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "CONTACTED", label: "Contacted", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "QUALIFIED", label: "Qualified", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "VIBE CHECK SENT", label: "Vibe Checked", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "NOT A FIT", label: "Not a Fit", color: "bg-gray-50 text-gray-600 border-gray-200" },
];

export default function StatusSelector({ leadId, currentStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedStatus = statuses.find((s) => s.value === currentStatus) || statuses[0];

  async function updateStatus(status) {
    await supabase
      .from("leads")
      .update({ status })
      .eq("id", leadId);

    window.location.reload();
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase transition-all duration-200 focus:outline-none hover:shadow-sm cursor-pointer ${selectedStatus.color}`}
      >
        <span>{selectedStatus.label}</span>
        <ChevronDown size={14} className="opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-white border border-gray-150 shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          <span className="block px-3 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
            Change Status
          </span>
          {statuses.map((status) => {
            const isCurrent = status.value === currentStatus;
            return (
              <button
                key={status.value}
                onClick={() => {
                  updateStatus(status.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors hover:bg-gray-50 text-left cursor-pointer ${
                  isCurrent ? "text-rust bg-gray-50/50" : "text-[#1C1B1A]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${status.color.split(" ")[0]}`} />
                  {status.label}
                </span>
                {isCurrent && <Check size={12} className="text-rust" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
