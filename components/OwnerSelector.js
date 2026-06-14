"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, Check, ChevronDown, Plus, X } from "lucide-react";

export default function OwnerSelector({ leadId, currentOwner, uniqueOwners = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const dropdownRef = useRef(null);

  async function updateOwner(email) {
    await supabase
      .from("leads")
      .update({ owner_email: email })
      .eq("id", leadId);

    window.location.reload();
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsAddingNew(false);
        setNewEmail("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    if (newEmail.trim() && newEmail.includes("@")) {
      updateOwner(newEmail.trim().toLowerCase());
      setIsAddingNew(false);
      setNewEmail("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 bg-white text-xs font-semibold text-gray-700 transition-all duration-200 focus:outline-none hover:shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <User size={13} className="text-gray-400" />
          <span>{currentOwner || "Unassigned"}</span>
        </div>
        <ChevronDown size={14} className="opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-56 rounded-xl bg-white border border-gray-150 shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          <span className="block px-3 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
            Assign Owner
          </span>

          <div className="max-h-40 overflow-y-auto mt-1 border-b border-gray-50 pb-1.5">
            {/* Unassigned Option */}
            <button
              onClick={() => {
                updateOwner(null);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-gray-50 font-medium text-gray-500 cursor-pointer"
            >
              <span>Unassigned</span>
              {!currentOwner && <Check size={12} className="text-rust" />}
            </button>

            {/* List existing owners */}
            {uniqueOwners.map((owner) => {
              const isCurrent = owner === currentOwner;
              return (
                <button
                  key={owner}
                  onClick={() => {
                    updateOwner(owner);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-gray-50 font-medium cursor-pointer ${
                    isCurrent ? "text-rust bg-gray-50/50" : "text-[#1C1B1A]"
                  }`}
                >
                  <span className="truncate">{owner}</span>
                  {isCurrent && <Check size={12} className="text-rust" />}
                </button>
              );
            })}
          </div>

          {/* Add custom owner */}
          <div className="px-3 pt-2">
            {!isAddingNew ? (
              <button
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-1 text-[10px] font-bold text-rust hover:underline uppercase tracking-wider cursor-pointer"
              >
                <Plus size={10} /> Assign New Owner
              </button>
            ) : (
              <form onSubmit={handleAddNewSubmit} className="space-y-1.5">
                <input
                  type="email"
                  placeholder="Enter email..."
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-rust"
                  autoFocus
                />
                <div className="flex justify-between items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewEmail("");
                    }}
                    className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <X size={10} /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-[10px] font-bold text-rust hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    Assign
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
