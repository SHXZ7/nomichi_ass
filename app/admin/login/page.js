"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/admin/dashboard");
      }
    }
    checkUser();
  }, [router]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel: Brand Info */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1C1B1A] text-white p-16">
        {/* Header */}
        <div className="flex items-baseline">
          <span className="font-serif font-extrabold text-2xl tracking-tight text-white">nomichi</span>
          <span className="font-sans text-[9px] font-bold tracking-[0.25em] text-white/50 ml-2 uppercase">
            Trip Desk
          </span>
        </div>

        {/* Content */}
        <div className="space-y-6 max-w-lg">
          <div className="text-[10px] tracking-[0.2em] font-semibold text-brand-yellow uppercase">
            For the team
          </div>
          <h1 className="font-serif font-extrabold text-5xl leading-[1.1] text-white">
            The Trip Desk. <br />
            Built for Monday morning.
          </h1>
          <p className="text-[#FFFBF5]/70 text-base leading-relaxed font-light">
            One place for every lead, every call note, every trip. No more Google sheets crossing wires.
          </p>
        </div>

        {/* Footer */}
        <div className="text-white/40 text-xs font-medium tracking-wide">
          Travel that finds you
        </div>
      </div>

      {/* Right Panel: Sign In Form */}
      <div className="bg-[#FFFBF5] flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Back link */}
          <div>
            <Link
              href="/"
              className="text-[10px] tracking-[0.2em] font-bold text-gray-400 hover:text-rust transition-colors uppercase inline-flex items-center gap-1.5"
            >
              ← Back to site
            </Link>
          </div>

          <div>
            <h2 className="font-serif font-bold text-4xl text-ink">Sign in</h2>
            <p className="text-sm text-gray-500 mt-1">Trip desk for Nomichi team.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="border border-gray-200 rounded-xl px-4 py-3 bg-white w-full text-sm focus:outline-none focus:border-rust shadow-sm transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="border border-gray-200 rounded-xl px-4 py-3 bg-white w-full text-sm focus:outline-none focus:border-rust shadow-sm transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1C1B1A] text-white hover:bg-rust transition-colors rounded-xl py-3.5 w-full font-semibold text-sm cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}