"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, UserCheck, Sparkles, History, Layers } from "lucide-react";
import { useRole, DEMO_USERS } from "./RoleContext";
import { Role } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const { currentRole, currentUser, setRole } = useRole();

  const roleLabels: Record<Role, string> = {
    BRAND_MANAGER: "Brand Manager",
    CREATOR: "Creator",
    REVIEWER: "Reviewer",
  };

  return (
    <header className="sticky top-4 z-50 flex justify-center px-4 w-full">
      <nav className="flex items-center justify-between gap-4 px-4 py-2 bg-paper/90 backdrop-blur-md rounded-pill border border-mist shadow-nav-pill max-w-5xl w-full">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 group pl-1">
          <div className="w-7 h-7 rounded-full bg-twilight flex items-center justify-center text-paper transition-transform group-hover:scale-105">
            <ShieldCheck className="w-4 h-4 text-signal-blue" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-tight font-normal text-ink leading-none">
              CampaignGuard
            </span>
            <span className="text-[10px] uppercase tracking-widest text-ash font-mono font-medium">
              Preflight Protocol
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-1 text-[13px] text-charcoal font-medium">
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/dashboard" ? "bg-linen text-ink font-semibold" : "hover:text-ink hover:bg-linen/60"
            }`}
          >
            Campaigns
          </Link>
          <Link
            href="/demo-guide"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/demo-guide" ? "bg-linen text-ink font-semibold" : "hover:text-ink hover:bg-linen/60"
            }`}
          >
            Judge Guide
          </Link>
        </div>

        {/* Right Role Switcher Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-linen px-2 py-1 rounded-pill border border-mist/80">
            <span className="text-[11px] font-mono text-ash hidden sm:inline pl-1">Role:</span>
            {(["BRAND_MANAGER", "CREATOR", "REVIEWER"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`text-[12px] px-2.5 py-1 rounded-pill transition-all font-medium ${
                  currentRole === r
                    ? "bg-twilight text-paper shadow-sm"
                    : "text-charcoal hover:text-ink hover:bg-paper"
                }`}
                title={DEMO_USERS[r].description}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>

          {/* User badge */}
          <div className="hidden lg:flex flex-col text-right pr-1">
            <span className="text-[12px] font-semibold text-ink leading-tight">{currentUser.name}</span>
            <span className="text-[10px] text-ash font-mono">{currentUser.title}</span>
          </div>
        </div>
      </nav>
    </header>
  );
}