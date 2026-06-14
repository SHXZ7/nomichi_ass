"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Users, Map, LogOut } from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
      } else {
        router.push("/admin/login");
      }
    }
    getUser();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Leads",
      href: "/admin/leads",
      icon: Users,
    },
    {
      name: "Trips",
      href: "/admin/trips",
      icon: Map,
    },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Column: occupies space and aligns left (flex-1) */}
        <div className="flex-1 flex justify-start items-baseline shrink-0">
          <span className="font-serif font-extrabold text-xl tracking-tight text-[#1C1B1A]">nomichi</span>
          <span className="font-sans text-[8px] font-bold tracking-[0.25em] text-gray-400 ml-2 uppercase">
            Trip Desk
          </span>
        </div>

        {/* Center Column: perfectly centered (flex-none) */}
        <div className="flex-none flex justify-center">
          <nav className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-full border border-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.name === "Leads"
                ? pathname.startsWith("/admin/leads")
                : pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#1C1B1A] text-white shadow-sm"
                      : "text-gray-500 hover:text-[#1C1B1A] hover:bg-gray-100/50"
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Column: occupies equal space and aligns right (flex-1) */}
        <div className="flex-1 flex justify-end items-center gap-4 shrink-0">
          {email && (
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              {email}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>

      </div>
    </header>
  );
}
