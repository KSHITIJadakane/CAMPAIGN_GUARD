"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Menu, X, ArrowRight, UserCheck } from "lucide-react";
import { useRole, DEMO_USERS } from "./RoleContext";
import { Role } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const { currentRole, currentUser, setRole } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleLabels: Record<Role, { full: string; short: string }> = {
    BRAND_MANAGER: { full: "Brand Manager", short: "Brand" },
    CREATOR: { full: "Creator", short: "Creator" },
    REVIEWER: { full: "Reviewer", short: "Review" },
  };

  return (
    <header className="sticky top-2 sm:top-4 z-50 flex justify-center px-2 sm:px-4 w-full">
      <nav className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 bg-paper/95 backdrop-blur-md rounded-2xl sm:rounded-pill border border-mist shadow-nav-pill max-w-5xl w-full transition-all">
        {/* Brand Logo & Name */}
        <Link 
          href="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 group pl-0.5 sm:pl-1 shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-twilight flex items-center justify-center text-paper transition-transform group-hover:scale-105 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-signal-blue" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base sm:text-lg tracking-tight font-normal text-ink leading-none">
              CampaignGuard
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ash font-mono font-medium">
              Preflight Protocol
            </span>
          </div>
        </Link>

        {/* Center Links (Desktop / Tablet) */}
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

        {/* Right Role Switcher (Responsive) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Role selector pill */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-linen p-0.5 sm:px-2 sm:py-1 rounded-xl sm:rounded-pill border border-mist/80">
            <span className="text-[11px] font-mono text-ash hidden lg:inline pl-1">Role:</span>
            {(["BRAND_MANAGER", "CREATOR", "REVIEWER"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`text-[11px] sm:text-[12px] px-2 sm:px-2.5 py-1 rounded-lg sm:rounded-pill transition-all font-medium ${
                  currentRole === r
                    ? "bg-twilight text-paper shadow-sm"
                    : "text-charcoal hover:text-ink hover:bg-paper"
                }`}
                title={DEMO_USERS[r].description}
              >
                <span className="inline sm:hidden">{roleLabels[r].short}</span>
                <span className="hidden sm:inline">{roleLabels[r].full}</span>
              </button>
            ))}
          </div>

          {/* User badge (Desktop) */}
          <div className="hidden xl:flex flex-col text-right pr-1">
            <span className="text-[12px] font-semibold text-ink leading-tight">{currentUser.name}</span>
            <span className="text-[10px] text-ash font-mono">{currentUser.title}</span>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl border border-mist bg-linen text-charcoal hover:text-ink hover:bg-paper transition-colors"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-2 right-2 p-4 bg-paper/95 backdrop-blur-xl rounded-2xl border border-mist shadow-xl space-y-4 animate-fade-in z-50">
          <div className="space-y-1 pb-3 border-b border-mist/70">
            <span className="text-[10px] font-mono uppercase text-ash tracking-wider font-semibold">
              Current Session Persona
            </span>
            <p className="text-sm font-serif font-medium text-ink">{currentUser.name}</p>
            <p className="text-xs text-signal-blue font-mono">{currentUser.title}</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1.5 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl transition-colors flex items-center justify-between ${
                pathname === "/" ? "bg-linen text-ink font-semibold" : "text-charcoal hover:bg-linen/60"
              }`}
            >
              <span>Home Overview</span>
              <ArrowRight className="w-3.5 h-3.5 text-ash" />
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl transition-colors flex items-center justify-between ${
                pathname === "/dashboard" ? "bg-linen text-ink font-semibold" : "text-charcoal hover:bg-linen/60"
              }`}
            >
              <span>Campaign Workspace Console</span>
              <ArrowRight className="w-3.5 h-3.5 text-ash" />
            </Link>
            <Link
              href="/demo-guide"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl transition-colors flex items-center justify-between ${
                pathname === "/demo-guide" ? "bg-linen text-ink font-semibold" : "text-charcoal hover:bg-linen/60"
              }`}
            >
              <span>Judge Demonstration Guide</span>
              <ArrowRight className="w-3.5 h-3.5 text-ash" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}