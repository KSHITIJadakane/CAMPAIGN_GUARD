"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Menu, X, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
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
    <header className="sticky top-2 sm:top-4 z-50 flex justify-center px-2 sm:px-4 w-full max-w-full">
      <nav className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-paper/95 backdrop-blur-md rounded-2xl sm:rounded-pill border border-mist shadow-nav-pill max-w-5xl w-full">
        {/* Brand Logo & Name */}
        <Link 
          href="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 group pl-0.5 sm:pl-1 shrink min-w-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-twilight flex items-center justify-center text-paper transition-transform group-hover:scale-105 shadow-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-signal-blue" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-sm sm:text-lg tracking-tight font-normal text-ink leading-none truncate">
              CampaignGuard
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-ash font-mono font-medium truncate">
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

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mobile Single Active Role Pill (Taps to open menu & switch) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="sm:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-linen hover:bg-mist/60 border border-mist text-ink text-[11px] font-mono font-medium transition-colors"
            title="Active role. Tap to switch."
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-blue" />
            <span>{roleLabels[currentRole].short}</span>
            <span className="text-[9px] text-ash">▼</span>
          </button>

          {/* Desktop/Tablet 3-Button Role Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-linen px-2 py-1 rounded-pill border border-mist/80">
            <span className="text-[11px] font-mono text-ash hidden lg:inline pl-1">Role:</span>
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
                {roleLabels[r].full}
              </button>
            ))}
          </div>

          {/* User badge (Desktop large screens) */}
          <div className="hidden xl:flex flex-col text-right pr-1">
            <span className="text-[12px] font-semibold text-ink leading-tight">{currentUser.name}</span>
            <span className="text-[10px] text-ash font-mono">{currentUser.title}</span>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl border border-mist bg-linen text-charcoal hover:text-ink hover:bg-paper transition-colors shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-2 right-2 p-4 bg-paper/98 backdrop-blur-2xl rounded-2xl border border-mist shadow-2xl space-y-4 animate-fade-in z-50 max-h-[85vh] overflow-y-auto">
          {/* Active Role Card & Switcher Header */}
          <div className="space-y-2 pb-3 border-b border-mist/70">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-ash tracking-wider font-semibold">
                Active Session Persona
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-signal-blue/15 text-signal-blue font-semibold">
                Active: {roleLabels[currentRole].short}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-linen border border-mist/70 space-y-0.5">
              <p className="text-sm font-serif font-medium text-ink">{currentUser.name}</p>
              <p className="text-xs text-charcoal font-mono">{currentUser.title}</p>
              <p className="text-[11px] text-ash font-sans pt-1 leading-snug">{currentUser.description}</p>
            </div>
          </div>

          {/* Switch Role Section in Mobile Drawer */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-ash tracking-wider font-semibold block">
              Switch Persona
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {(["BRAND_MANAGER", "CREATOR", "REVIEWER"] as Role[]).map((r) => {
                const isSelected = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-twilight text-paper border-twilight shadow-sm"
                        : "bg-paper hover:bg-linen border-mist text-charcoal"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold">{roleLabels[r].full}</p>
                      <p className={`text-[10px] font-mono ${isSelected ? "text-fog" : "text-ash"}`}>
                        {DEMO_USERS[r].name}
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-signal-blue" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Navigation Links */}
          <div className="pt-2 border-t border-mist/70 space-y-1 text-sm font-medium">
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