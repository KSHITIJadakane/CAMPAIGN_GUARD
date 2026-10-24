"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Layers, FileText, Lock, Sparkles } from "lucide-react";
import { useRole, DEMO_USERS } from "@/components/layout/RoleContext";
import { Role } from "@/types";

export default function HomePage() {
  const { currentRole, setRole } = useRole();

  const handleSelectRoleAndGo = (role: Role) => {
    setRole(role);
  };

  return (
    <div className="space-y-16 py-6">
      {/* Editorial Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-linen border border-mist text-[12px] font-mono text-charcoal">
          <span className="w-2 h-2 rounded-full bg-signal-blue" />
          <span>Round 2 Functional MVP • Automated Campaign Governance</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink font-normal tracking-tight leading-[1.1]">
          The automated spell-checker for <span className="italic">brand facts</span> and campaign consistency.
        </h1>

        <p className="text-[16px] sm:text-[18px] text-charcoal font-sans leading-relaxed max-w-2xl mx-auto">
          When teams launch product campaigns, captions claim 20% off while banner graphics say 30%.
          CampaignGuard establishes a single human-verified truth contract, reconciles assets across four automated layers, and enforces cryptographic version-locked approvals.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg border border-signal-blue text-signal-blue hover:bg-signal-blue/5 transition-all text-[15px] font-medium flex items-center gap-2"
          >
            Launch Interactive Console
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/demo-guide"
            className="px-6 py-3 rounded-lg border border-twilight text-twilight hover:bg-linen transition-all text-[15px] font-medium"
          >
            Judge Demonstration Walkthrough
          </Link>
        </div>
      </section>

      {/* Role Selection Interactive Grid */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
            Experience the 3 Target Personas
          </span>
          <h2 className="font-serif text-2xl text-ink font-normal">Choose a Role to Test</h2>
          <p className="text-[13px] text-charcoal font-sans">
            Click any persona to immediately switch context and explore their tailored workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["BRAND_MANAGER", "CREATOR", "REVIEWER"] as Role[]).map((role) => {
            const user = DEMO_USERS[role];
            const isCurrent = currentRole === role;

            return (
              <div
                key={role}
                onClick={() => handleSelectRoleAndGo(role)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? "bg-paper border-twilight shadow-subtle-card ring-1 ring-twilight/20"
                    : "bg-paper/70 border-mist hover:border-twilight/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase text-ash font-medium">
                      {role.replace("_", " ")}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-twilight text-paper font-medium">
                        Active Role
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl text-ink font-normal">{user.name}</h3>
                  <span className="text-[12px] text-charcoal block font-mono mt-0.5">{user.title}</span>
                  <p className="text-[13px] text-ash font-sans mt-3 leading-relaxed">{user.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-mist/80 flex items-center justify-between text-[12px] font-mono">
                  <span className="text-signal-blue font-medium">Select & Go to Console →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The 4 Inspection Layers Blueprint */}
      <section className="p-8 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-6">
        <div className="border-b border-mist pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
              System Architecture
            </span>
            <h2 className="font-serif text-2xl text-ink font-normal">
              Deterministic Facts vs. Bounded Multimodal AI
            </h2>
          </div>
          <span className="text-[12px] font-mono text-ash">4 Inspection Layers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[13px] font-sans">
          <div className="p-4 bg-linen rounded-xl border border-mist/80 space-y-2">
            <div className="flex items-center gap-2 text-ink font-semibold font-mono text-[12px]">
              <CheckCircle2 className="w-4 h-4 text-status-pass" />
              1. Campaign Facts
            </div>
            <p className="text-charcoal leading-relaxed">
              Numerical discounts, end dates, and eligibility scopes are verified through direct relational lookups—never hallucinated by vector embeddings.
            </p>
          </div>

          <div className="p-4 bg-linen rounded-xl border border-mist/80 space-y-2">
            <div className="flex items-center gap-2 text-ink font-semibold font-mono text-[12px]">
              <Layers className="w-4 h-4 text-signal-blue" />
              2. Cross-Asset Match
            </div>
            <p className="text-charcoal leading-relaxed">
              Compares social caption copy against banner graphic text and PDF spec sheets to catch contradictory specifications.
            </p>
          </div>

          <div className="p-4 bg-linen rounded-xl border border-mist/80 space-y-2">
            <div className="flex items-center gap-2 text-ink font-semibold font-mono text-[12px]">
              <AlertTriangle className="w-4 h-4 text-status-warn" />
              3. Brand Rules
            </div>
            <p className="text-charcoal leading-relaxed">
              Detects prohibited superlatives ("Miracle", "guaranteed"), flags missing mandatory disclaimers, and guards voice consistency.
            </p>
          </div>

          <div className="p-4 bg-linen rounded-xl border border-mist/80 space-y-2">
            <div className="flex items-center gap-2 text-ink font-semibold font-mono text-[12px]">
              <Sparkles className="w-4 h-4 text-cerulean" />
              4. Accessibility
            </div>
            <p className="text-charcoal leading-relaxed">
              Performs basic visual contrast sanity checks and verifies presence of descriptive screen-reader alt text for visual assets.
            </p>
          </div>
        </div>

        <div className="p-4 bg-parchment rounded-xl border border-mist text-[13px] font-mono text-charcoal flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-twilight" />
            <span>Cryptographic Revision Binding: Editing any asset invalidates approval automatically.</span>
          </div>
          <Link href="/dashboard" className="text-signal-blue font-semibold hover:underline">
            Test Live Invalidation →
          </Link>
        </div>
      </section>
    </div>
  );
}