"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Lock, 
  Sparkles,
  Zap,
  Cpu,
  Fingerprint,
  ChevronRight,
  ExternalLink,
  RotateCcw
} from "lucide-react";
import { useRole, DEMO_USERS } from "@/components/layout/RoleContext";
import { Role } from "@/types";
import { InteractivePreflightDemo } from "@/components/landing/InteractivePreflightDemo";
import { IntroPreloader } from "@/components/landing/IntroPreloader";

export default function HomePage() {
  const { currentRole, setRole } = useRole();
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // If intro was already seen in session, mark ready immediately
    if (typeof window !== "undefined" && sessionStorage.getItem("cg_intro_seen")) {
      setPageReady(true);
    }
  }, []);

  const handleSelectRoleAndGo = (role: Role) => {
    setRole(role);
  };

  const handleReplayIntro = () => {
    sessionStorage.removeItem("cg_intro_seen");
    window.location.reload();
  };

  return (
    <>
      {/* Starting 0-100% Intro Preloader with Catchy Lines & Gliding Up Reveal */}
      <IntroPreloader onComplete={() => setPageReady(true)} />

      {/* Main Home Page with Smooth Fade-in */}
      <div 
        className={`space-y-20 py-4 transition-all duration-1000 ease-out ${
          pageReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4 animate-fade-in">
          {/* Animated Beacon Badge with Replay Option */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-pill bg-paper border border-mist shadow-sm text-xs font-mono text-charcoal">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-blue"></span>
            </span>
            <span className="font-semibold text-ink">CampaignGuard v0.2</span>
            <span className="text-mist">•</span>
            <span className="text-ash">Automated Multimodal Campaign Governance</span>
            <span className="text-mist hidden sm:inline">•</span>
            <button
              onClick={handleReplayIntro}
              className="text-[11px] text-signal-blue hover:text-cerulean underline hidden sm:inline"
              title="Replay intro animation"
            >
              Replay Intro
            </button>
          </div>

          {/* Master Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-ink font-normal tracking-tight leading-[1.1]">
            The automated spell-checker for{" "}
            <span className="italic bg-gradient-to-r from-twilight via-cerulean to-signal-blue bg-clip-text text-transparent font-medium">
              brand facts
            </span>{" "}
            and campaign consistency.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-charcoal/90 font-sans leading-relaxed max-w-3xl mx-auto">
            When marketing teams launch cross-channel campaigns, social captions claim 20% off while banner graphics announce 30%. 
            CampaignGuard establishes a single human-verified truth contract, reconciles assets across four automated inspection layers, and enforces cryptographic version-locked approvals.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              href="/dashboard"
              className="px-7 py-3.5 rounded-xl bg-twilight text-paper hover:bg-ink transition-all duration-200 text-sm sm:text-base font-medium shadow-md hover:shadow-twilight/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group"
            >
              <span>Launch Live Console</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/demo-guide"
              className="px-7 py-3.5 rounded-xl bg-paper border border-mist hover:border-twilight/40 text-ink transition-all duration-200 text-sm sm:text-base font-medium shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>Judge Demo Walkthrough</span>
              <ExternalLink className="w-3.5 h-3.5 text-ash" />
            </Link>
          </div>
        </section>

        {/* Proof / Value Metrics Bar */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-xl bg-paper/80 border border-mist shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-serif text-ink font-semibold">4 Layers</span>
            <span className="text-xs font-mono text-ash mt-1">Multi-Tier Inspection</span>
          </div>
          <div className="p-4 rounded-xl bg-paper/80 border border-mist shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-serif text-status-pass font-semibold">100%</span>
            <span className="text-xs font-mono text-ash mt-1">Deterministic Facts</span>
          </div>
          <div className="p-4 rounded-xl bg-paper/80 border border-mist shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-serif text-signal-blue font-semibold">SHA-256</span>
            <span className="text-xs font-mono text-ash mt-1">Cryptographic Binding</span>
          </div>
          <div className="p-4 rounded-xl bg-paper/80 border border-mist shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-serif text-ink font-semibold">&lt; 400ms</span>
            <span className="text-xs font-mono text-ash mt-1">Preflight Audit Speed</span>
          </div>
        </section>

        {/* Featured Interactive Sandbox Widget */}
        <section className="space-y-3 max-w-5xl mx-auto">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-signal-blue" />
              <h2 className="font-serif text-2xl text-ink font-normal">Interactive Preflight Engine</h2>
            </div>
            <span className="text-xs font-mono text-ash hidden sm:inline">Try live scenarios without login</span>
          </div>
          <InteractivePreflightDemo />
        </section>

        {/* Role Personas Interactive Switcher */}
        <section className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-signal-blue font-semibold">
              Role-Based Access Governance
            </span>
            <h2 className="font-serif text-3xl text-ink font-normal">Experience the 3 Personas</h2>
            <p className="text-sm text-charcoal font-sans">
              CampaignGuard enforces separation of duties. Click any persona to switch your active session role instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(["BRAND_MANAGER", "CREATOR", "REVIEWER"] as Role[]).map((role) => {
              const user = DEMO_USERS[role];
              const isCurrent = currentRole === role;

              return (
                <div
                  key={role}
                  onClick={() => handleSelectRoleAndGo(role)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                    isCurrent
                      ? "bg-paper border-twilight shadow-glow-card ring-2 ring-twilight/20 -translate-y-1"
                      : "bg-paper/70 border-mist hover:border-twilight/50 hover:bg-paper hover:-translate-y-1 hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-mono uppercase text-ash tracking-wider font-semibold">
                        {role.replace("_", " ")}
                      </span>
                      {isCurrent ? (
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-pill bg-twilight text-paper font-semibold shadow-sm">
                          Active Role
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-ash group-hover:text-ink transition-colors">
                          Click to activate
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl text-ink font-medium">{user.name}</h3>
                    <span className="text-xs text-signal-blue block font-mono mt-1 font-semibold">
                      {user.title}
                    </span>
                    <p className="text-xs sm:text-sm text-ash font-sans mt-3 leading-relaxed">
                      {user.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-mist/70 flex items-center justify-between text-xs font-mono">
                    <span className="text-twilight font-semibold group-hover:text-signal-blue transition-colors flex items-center gap-1">
                      Enter Workspace as {user.name.split(" ")[0]}
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* The 4 Inspection Layers Architecture */}
        <section className="p-6 sm:p-8 bg-paper/85 backdrop-blur-md rounded-2xl border border-mist shadow-glow-card space-y-8 max-w-5xl mx-auto">
          <div className="border-b border-mist pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-signal-blue" />
                <span className="text-xs font-mono uppercase tracking-widest text-ash font-semibold">
                  Architecture Blueprint
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-1">
                Deterministic Facts vs. Bounded Multimodal AI
              </h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-pill bg-linen border border-mist text-ash">
              Sequential Preflight Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-4 bg-linen rounded-xl border border-mist/80 space-y-2.5 transition-all hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex items-center gap-2 text-ink font-semibold font-mono text-xs">
                <CheckCircle2 className="w-4 h-4 text-status-pass" />
                1. Campaign Facts
              </div>
              <p className="text-charcoal/90 leading-relaxed">
                Numerical discounts, end dates, and eligibility scopes are verified through direct relational lookups—never hallucinated by vector embeddings.
              </p>
            </div>

            <div className="p-4 bg-linen rounded-xl border border-mist/80 space-y-2.5 transition-all hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex items-center gap-2 text-ink font-semibold font-mono text-xs">
                <Layers className="w-4 h-4 text-signal-blue" />
                2. Cross-Asset Match
              </div>
              <p className="text-charcoal/90 leading-relaxed">
                Compares social caption copy against banner graphic text and PDF spec sheets to catch contradictory specifications across channels.
              </p>
            </div>

            <div className="p-4 bg-linen rounded-xl border border-mist/80 space-y-2.5 transition-all hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex items-center gap-2 text-ink font-semibold font-mono text-xs">
                <AlertTriangle className="w-4 h-4 text-status-warn" />
                3. Brand Rules
              </div>
              <p className="text-charcoal/90 leading-relaxed">
                Detects prohibited superlatives ("Miracle", "guaranteed"), flags missing mandatory disclaimers, and guards legal safety guardrails.
              </p>
            </div>

            <div className="p-4 bg-linen rounded-xl border border-mist/80 space-y-2.5 transition-all hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex items-center gap-2 text-ink font-semibold font-mono text-xs">
                <Sparkles className="w-4 h-4 text-cerulean" />
                4. Accessibility
              </div>
              <p className="text-charcoal/90 leading-relaxed">
                Performs basic visual contrast sanity checks and verifies presence of descriptive screen-reader alt text for visual assets.
              </p>
            </div>
          </div>

          {/* Cryptographic revision security callout */}
          <div className="p-4 sm:p-5 bg-linen/90 rounded-xl border border-mist text-xs sm:text-sm font-mono text-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Fingerprint className="w-5 h-5 text-twilight flex-shrink-0" />
              <span>Cryptographic Revision Binding: Any asset edit automatically invalidates approval status.</span>
            </div>
            <Link 
              href="/dashboard" 
              className="text-signal-blue font-semibold hover:underline flex items-center gap-1 sm:self-center self-start"
            >
              <span>Live Workspace Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}