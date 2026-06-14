"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const groupOptions = ["Solo", "Couple", "Friends", "Family"];

export default function HomepageEnquiryForm({ trips }) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    trip_id: "",
    group_type: "",
    preferred_month: "",
    expectations: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    // Phone validation
    const digitsOnly = form.phone.replace(/[^0-9]/g, "");
    if (digitsOnly.length < 10) {
      setErrorMsg("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("leads").insert([form]);
    setLoading(false);
    
    if (error) {
      setErrorMsg(error.message || "Failed to submit enquiry. Please try again.");
      return;
    }
    
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-[420px] shadow-sm border border-gray-100">
        <div className="w-12 h-12 rounded-full bg-rust/10 flex items-center justify-center mb-5">
          <svg className="w-6 h-6 text-rust" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif font-bold text-2xl mb-2 text-ink">Thanks for reaching out</h3>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed font-light">
          We've received your enquiry. A real person will write back soon.
        </p>
      </div>
    );
  }

  const inputCls = "w-full bg-[#F7F6F3] rounded-xl px-4 py-3 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rust/20 focus:bg-white border border-transparent focus:border-rust/30 transition-all duration-200";
  const labelCls = "block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1.5";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-50">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Step 1 of 1</p>
        <h3 className="font-serif text-xl font-bold text-ink mt-1">Your enquiry</h3>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
        {/* Name + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Your Name</label>
            <input
              type="text" required placeholder="Ananya Rao"
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              type="tel" required placeholder="+91 98765 43210"
              className={inputCls}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email" required placeholder="you@email.com"
            className={inputCls}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Which Trip */}
        <div>
          <label className={labelCls}>Which Trip</label>
          <div className="relative">
            <select
              required
              className={`${inputCls} appearance-none pr-10 cursor-pointer`}
              value={form.trip_id}
              onChange={(e) => setForm({ ...form, trip_id: e.target.value })}
            >
              <option value="">Pick a trip…</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>{trip.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Travelling As + Preferred Month */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Travelling As</label>
            <div className="relative">
              <select
                required
                className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                value={form.group_type}
                onChange={(e) => setForm({ ...form, group_type: e.target.value })}
              >
                <option value="">Select…</option>
                {groupOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelCls}>Preferred Month</label>
            <input
              type="text" required placeholder="e.g. August"
              className={inputCls}
              value={form.preferred_month}
              onChange={(e) => setForm({ ...form, preferred_month: e.target.value })}
            />
          </div>
        </div>

        {/* Expectations */}
        <div>
          <label className={labelCls}>What are you hoping this trip feels like</label>
          <textarea
            required
            placeholder="One line is enough. The honest version."
            rows={4}
            className={`${inputCls} resize-none`}
            value={form.expectations}
            onChange={(e) => setForm({ ...form, expectations: e.target.value })}
          />
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-150 rounded-xl p-3.5 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-150">
            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-ink text-white hover:bg-rust transition-all duration-300 rounded-2xl py-4 text-sm font-semibold flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Sending…
              </>
            ) : (
              <>
                Send enquiry
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </>
            )}
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-3">
            By sending this, you're saying we can write back. Nothing more.
          </p>
        </div>
      </form>
    </div>
  );
}
