"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Sparkles, 
  Lock, 
  RotateCcw, 
  Play, 
  FileText, 
  Eye, 
  ArrowRight,
  Zap,
  Check,
  Target,
  Crosshair
} from "lucide-react";

type ScenarioKey = "discount_conflict" | "superlative_claim" | "clean_pack";

interface Scenario {
  title: string;
  badge: string;
  badgeColor: string;
  contract: {
    discount: string;
    validUntil: string;
    forbidden: string[];
    disclaimer: string;
  };
  asset: {
    bannerText: string;
    caption: string;
    mediaAlt: string;
  };
  expectedFindings: {
    layer: string;
    type: "error" | "warn" | "pass";
    title: string;
    detail: string;
  }[];
  sha256: string;
}

const SCENARIOS: Record<ScenarioKey, Scenario> = {
  discount_conflict: {
    title: "Contradictory Discount",
    badge: "Layer 1 & 2 Critical Failure",
    badgeColor: "bg-status-error-bg text-status-error border-status-error-border",
    contract: {
      discount: "20% OFF",
      validUntil: "Nov 30, 2026",
      forbidden: ["Miracle", "Guaranteed", "Permanent"],
      disclaimer: "T&Cs apply. While stocks last.",
    },
    asset: {
      bannerText: "SUMMER SALE: 30% OFF EVERYTHING",
      caption: "Hurry! Get 20% off all EcoSip bottles this week only with code SUMMER20.",
      mediaAlt: "Promotional banner graphic",
    },
    expectedFindings: [
      {
        layer: "Layer 1: Campaign Facts",
        type: "error",
        title: "Deterministic Mismatch",
        detail: "Banner graphic claims 30% OFF; Contract strictly mandates 20% OFF.",
      },
      {
        layer: "Layer 2: Cross-Asset Match",
        type: "error",
        title: "Caption vs Graphic Collision",
        detail: "Caption specifies 20% discount while banner specifies 30%. Contradictory customer offer.",
      },
      {
        layer: "Layer 3: Brand Rules",
        type: "pass",
        title: "Vocabulary Compliant",
        detail: "No forbidden superlatives or blacklisted keywords detected.",
      },
      {
        layer: "Layer 4: Accessibility",
        type: "warn",
        title: "Low Alt-Text Specificity",
        detail: "Alt-text is generic. Recommend including brand name and key offer for screen readers.",
      },
    ],
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  superlative_claim: {
    title: "Unsubstantiated Brand Claim",
    badge: "Layer 3 Policy Breach",
    badgeColor: "bg-status-warn-bg text-status-warn border-status-warn-border",
    contract: {
      discount: "15% OFF",
      validUntil: "Dec 15, 2026",
      forbidden: ["Miracle", "Guaranteed", "Never Leaks"],
      disclaimer: "Laboratory tested under ISO standards.",
    },
    asset: {
      bannerText: "The Miracle Hydration Bottle — Guaranteed to Keep Cool Forever",
      caption: "Meet the miracle bottle! 15% off with code PURE15. Guaranteed quality.",
      mediaAlt: "EcoSip insulated steel bottle with cold mist",
    },
    expectedFindings: [
      {
        layer: "Layer 1: Campaign Facts",
        type: "pass",
        title: "Numerical Discounts Match",
        detail: "Discount matches 15% canonical specification.",
      },
      {
        layer: "Layer 2: Cross-Asset Match",
        type: "pass",
        title: "Cross-Channel Harmony",
        detail: "Social caption and banner copy describe the same product scope.",
      },
      {
        layer: "Layer 3: Brand Rules",
        type: "error",
        title: "Prohibited Superlatives",
        detail: "Detected banned legal terms: 'Miracle' (2x) and 'Guaranteed' (2x). Requires medical substantiation.",
      },
      {
        layer: "Layer 4: Accessibility",
        type: "pass",
        title: "Sufficient Contrast & Alt",
        detail: "Contrast ratio 7.4:1 meets WCAG AA standards. Alt text is descriptive.",
      },
    ],
    sha256: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
  },
  clean_pack: {
    title: "Verified Compliant Campaign",
    badge: "Cryptographically Approved",
    badgeColor: "bg-status-pass-bg text-status-pass border-status-pass-border",
    contract: {
      discount: "25% OFF",
      validUntil: "Oct 31, 2026",
      forbidden: ["Miracle", "Guaranteed", "Cheapest"],
      disclaimer: "Valid on orders over $50. Terms apply.",
    },
    asset: {
      bannerText: "Autumn Refresh: 25% OFF EcoSip Essentials",
      caption: "Enjoy 25% off all EcoSip reusable gear with code AUTUMN25. Valid on orders over $50. T&Cs apply.",
      mediaAlt: "EcoSip Autumn Collection bottles arranged on wooden surface",
    },
    expectedFindings: [
      {
        layer: "Layer 1: Campaign Facts",
        type: "pass",
        title: "Contract Specifications Matched",
        detail: "25% discount verified against human truth contract.",
      },
      {
        layer: "Layer 2: Cross-Asset Match",
        type: "pass",
        title: "Copy & Asset Synchronized",
        detail: "Banner text, promo codes, and caption offer are 100% consistent.",
      },
      {
        layer: "Layer 3: Brand Rules",
        type: "pass",
        title: "Strict Brand Guard Verified",
        detail: "No blacklisted terms found. Mandatory order threshold disclaimer present.",
      },
      {
        layer: "Layer 4: Accessibility",
        type: "pass",
        title: "WCAG AAA Compliance",
        detail: "High contrast visuals, descriptive multi-word alt text detected.",
      },
    ],
    sha256: "4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
  },
};

export function InteractivePreflightDemo() {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>("discount_conflict");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(true);
  const [isFixed, setIsFixed] = useState(false);

  const scenario = SCENARIOS[activeScenario];

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditComplete(false);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 650);
  };

  const handleSwitchScenario = (key: ScenarioKey) => {
    setActiveScenario(key);
    setIsFixed(false);
    setIsAuditing(true);
    setAuditComplete(false);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 450);
  };

  const handleAutoFix = () => {
    setIsFixed(true);
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 500);
  };

  const hasErrors = !isFixed && scenario.expectedFindings.some(f => f.type === "error");

  return (
    <div className="w-full bg-paper/90 backdrop-blur-md rounded-2xl border border-mist shadow-glow-card overflow-hidden transition-all duration-300">
      {/* Top Demo Interactive Header */}
      <div className="p-4 sm:p-6 bg-linen/80 border-b border-mist flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-signal-blue"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-charcoal font-semibold">
              Live Sandbox • Interactive Engine
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal mt-1">
            Test Campaign Preflight Verification
          </h3>
          <p className="text-xs sm:text-sm text-ash font-sans mt-0.5">
            Switch scenarios below or click <strong className="text-ink">Run Preflight</strong> to see deterministic fact-checking catch contradictions in real-time.
          </p>
        </div>

        {/* Scenario Switcher Tabs (Responsive Grid on Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:flex items-center gap-1.5 p-1 bg-paper rounded-xl border border-mist/90 shadow-sm w-full md:w-auto">
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => {
            const sc = SCENARIOS[key];
            const isActive = activeScenario === key;
            return (
              <button
                key={key}
                onClick={() => handleSwitchScenario(key)}
                className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 text-center cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-twilight text-paper shadow-sm scale-100 font-semibold"
                    : "text-charcoal hover:text-ink hover:bg-linen"
                }`}
              >
                <span>{sc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Inspection Canvas (Responsive padding for mobile) */}
      <div className="p-3.5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Col: Human Truth Contract */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-signal-blue" />
              <span className="font-serif text-lg text-ink font-medium">Brand Truth Contract</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-linen border border-mist text-ash">
              Canonical Source
            </span>
          </div>

          <div className="p-4 rounded-xl bg-linen/60 border border-mist space-y-3 text-xs font-sans">
            <div>
              <span className="text-[10px] font-mono text-ash uppercase block">Mandated Discount</span>
              <span className="font-mono text-base font-semibold text-ink">
                {scenario.contract.discount}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-ash uppercase block">Campaign End Date</span>
              <span className="font-mono text-ink">{scenario.contract.validUntil}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-ash uppercase block">Blacklisted Superlatives</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {scenario.contract.forbidden.map((word) => (
                  <span
                    key={word}
                    className="px-2 py-0.5 rounded bg-status-error-bg text-status-error border border-status-error-border font-mono text-[11px]"
                  >
                    "{word}"
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-ash uppercase block">Mandatory Disclaimer</span>
              <span className="text-charcoal italic">{scenario.contract.disclaimer}</span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="w-full py-2.5 px-4 rounded-xl bg-signal-blue hover:bg-cerulean text-paper font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isAuditing ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-paper" />
                  <span>Analyzing All 4 Layers...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Preflight Audit</span>
                </>
              )}
            </button>

            {hasErrors && !isFixed && (
              <button
                onClick={handleAutoFix}
                className="w-full py-2 px-3 rounded-xl border border-status-pass text-status-pass hover:bg-status-pass-bg transition-colors text-xs font-mono font-medium flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Auto-Fix Identified Violations</span>
              </button>
            )}

            {isFixed && (
              <button
                onClick={() => handleSwitchScenario(activeScenario)}
                className="w-full py-2 px-3 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal hover:text-ink transition-colors text-xs font-mono font-medium flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                title="Reset this scenario back to its initial contradiction state"
              >
                <RotateCcw className="w-3.5 h-3.5 text-ash" />
                <span>Reset to Original Contradictions</span>
              </button>
            )}
          </div>
        </div>

        {/* Center / Right: Submitted Creative Asset & Scan Results */}
        <div className="lg:col-span-8 space-y-4">
          {/* Creative Asset Mock Card */}
          <div className="p-4 rounded-xl bg-paper border border-mist shadow-sm space-y-3 relative overflow-hidden">
            {isAuditing && (
              <div className="absolute inset-0 bg-signal-blue/10 backdrop-blur-[1px] flex items-center justify-center z-10 animate-pulse">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-paper shadow-lg border border-signal-blue text-xs font-mono text-signal-blue font-bold">
                  <Zap className="w-4 h-4 animate-bounce" />
                  OCR & Cross-Asset Multi-Layer Scan In Progress...
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-mist/80 pb-2">
              <span className="text-xs font-mono text-charcoal font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-ash" />
                Submitted Creative Asset Pack
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-pill border ${
                  isFixed ? "bg-status-pass-bg text-status-pass border-status-pass-border" : scenario.badgeColor
                }`}
              >
                {isFixed ? "Auto-Fixed & Synchronized" : scenario.badge}
              </span>
            </div>

            {/* Visual OCR Spatial Hotspot Banner Preview */}
            <div className="relative rounded-xl border border-mist/80 bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950 text-paper p-4 sm:p-5 overflow-hidden shadow-inner">
              <div className="flex items-center justify-between border-b border-paper/10 pb-2.5 mb-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
                  <Eye className="w-3.5 h-3.5 text-teal-400" />
                  VISUAL OCR SPATIAL INSPECTION • ASSET BANNER
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isFixed 
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                    : hasErrors 
                    ? "bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse" 
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                }`}>
                  {isFixed ? "✓ ALL HOTSPOTS RECONCILED" : hasErrors ? "⚠ FAULT BOXES PINPOINTED" : "✓ PASSING AUDIT"}
                </span>
              </div>

              {/* Graphic Banner Simulation with Overlaid Bounding Boxes */}
              <div className="relative p-4 sm:p-5 rounded-lg bg-paper/5 backdrop-blur-sm border border-paper/10 space-y-3">
                {/* Brand Header */}
                <div className="flex items-center justify-between text-xs font-mono text-paper/60">
                  <span className="tracking-widest uppercase font-bold text-teal-200">ECOSIP BOTANICALS</span>
                  <span className="text-[10px]">SPRING/SUMMER 2026</span>
                </div>

                {/* Scenario 1: Discount Contradiction */}
                {activeScenario === "discount_conflict" && (
                  <div className="space-y-2">
                    <p className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Summer Hydration Festival
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Bounding Box Pinpointing Fault */}
                      <div className="relative inline-block my-1">
                        <div
                          className={`absolute -inset-2 border-2 rounded-lg transition-all duration-300 z-10 pointer-events-none ${
                            isFixed
                              ? "border-emerald-400 bg-emerald-500/15 ring-2 ring-emerald-400/30"
                              : "border-red-500 bg-red-500/20 animate-pulse ring-4 ring-red-500/30 shadow-lg"
                          }`}
                        >
                          {/* Corner crosshairs */}
                          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
                          
                          {/* Pin Tag */}
                          <div
                            className={`absolute -top-4 left-1.5 px-2 py-0.5 font-mono text-[9px] font-bold rounded shadow-md flex items-center gap-1 ${
                              isFixed ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                            }`}
                          >
                            {isFixed ? (
                              <>
                                <Check className="w-2.5 h-2.5" /> #1 RECONCILED: 20% OFF (Matches Contract)
                              </>
                            ) : (
                              <>
                                <Target className="w-2.5 h-2.5" /> #1 OCR FAULT: 30% OFF (Exceeds Max 20%)
                              </>
                            )}
                          </div>
                        </div>

                        <span
                          className={`px-3.5 py-1.5 font-serif text-lg sm:text-xl font-extrabold rounded block tracking-tight ${
                            isFixed ? "bg-emerald-600/90 text-white" : "bg-red-600/90 text-white"
                          }`}
                        >
                          {isFixed ? "20% OFF EVERYTHING" : "30% OFF EVERYTHING"}
                        </span>
                      </div>

                      <span className="text-xs text-paper/70 font-sans">
                        Applied automatically at checkout with valid seasonal promo code.
                      </span>
                    </div>
                  </div>
                )}

                {/* Scenario 2: Prohibited Superlative Claims */}
                {activeScenario === "superlative_claim" && (
                  <div className="space-y-2">
                    <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white leading-relaxed">
                      <span>The </span>
                      {/* Bounding Box 1: "Miracle" */}
                      <span className="relative inline-block mx-1">
                        <span
                          className={`absolute -inset-1 border-2 rounded transition-all duration-300 z-10 pointer-events-none ${
                            isFixed
                              ? "border-emerald-400 bg-emerald-500/15"
                              : "border-red-500 bg-red-500/20 animate-pulse ring-2 ring-red-400/50"
                          }`}
                        >
                          <span
                            className={`absolute -top-3.5 left-0 px-1.5 py-0.2 font-mono text-[8px] font-bold rounded shadow-xs flex items-center gap-0.5 ${
                              isFixed ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                            }`}
                          >
                            {isFixed ? <Check className="w-2 h-2" /> : <Target className="w-2 h-2" />}
                            {isFixed ? "#1 PASS" : "#1 PROHIBITED"}
                          </span>
                        </span>
                        <span className={`px-1 py-0.5 font-semibold ${isFixed ? "text-emerald-300" : "text-red-300 underline decoration-wavy decoration-red-500"}`}>
                          {isFixed ? "Pure" : "Miracle"}
                        </span>
                      </span>

                      <span>Hydration Bottle — </span>

                      {/* Bounding Box 2: "Guaranteed" */}
                      <span className="relative inline-block mx-1">
                        <span
                          className={`absolute -inset-1 border-2 rounded transition-all duration-300 z-10 pointer-events-none ${
                            isFixed
                              ? "border-emerald-400 bg-emerald-500/15"
                              : "border-red-500 bg-red-500/20 animate-pulse ring-2 ring-red-400/50"
                          }`}
                        >
                          <span
                            className={`absolute -top-3.5 left-0 px-1.5 py-0.2 font-mono text-[8px] font-bold rounded shadow-xs flex items-center gap-0.5 ${
                              isFixed ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                            }`}
                          >
                            {isFixed ? <Check className="w-2 h-2" /> : <Target className="w-2 h-2" />}
                            {isFixed ? "#2 VERIFIED" : "#2 UNVERIFIED"}
                          </span>
                        </span>
                        <span className={`px-1 py-0.5 font-semibold ${isFixed ? "text-emerald-300" : "text-red-300 underline decoration-wavy decoration-red-500"}`}>
                          {isFixed ? "Laboratory Tested" : "Guaranteed"}
                        </span>
                      </span>

                      <span>to Keep Cool</span>
                    </div>
                  </div>
                )}

                {/* Scenario 3: Clean Pack */}
                {activeScenario === "clean_pack" && (
                  <div className="space-y-2">
                    <p className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Autumn Refresh Campaign
                    </p>
                    <div className="relative inline-block my-1">
                      <div className="absolute -inset-1.5 border-2 border-emerald-400 bg-emerald-500/15 rounded-lg ring-2 ring-emerald-400/30 z-10 pointer-events-none">
                        <div className="absolute -top-3.5 left-1.5 px-2 py-0.5 bg-emerald-600 text-white font-mono text-[9px] font-bold rounded shadow-md flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> #1 OCR MATCH: 25% OFF (Verified Canonical)
                        </div>
                      </div>
                      <span className="px-3 py-1 font-serif text-lg font-bold bg-emerald-600/80 text-white rounded block">
                        25% OFF EcoSip Essentials
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer Legal Disclaimer Bar */}
                <div className="pt-2 border-t border-paper/10 flex items-center justify-between text-[11px] font-mono text-paper/80">
                  <div className="relative">
                    <span className="italic">{scenario.contract.disclaimer}</span>
                  </div>
                  <span className="text-[10px] text-teal-300 font-mono">
                    Valid: {scenario.contract.validUntil}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Caption Copy */}
            <div className="p-3 rounded-lg bg-linen border border-mist space-y-1 text-xs">
              <span className="text-[10px] font-mono text-ash uppercase block">[SOCIAL POST CAPTION]</span>
              <p className="text-charcoal leading-relaxed font-sans">
                {isFixed
                  ? `Get ${scenario.contract.discount} this season. ${scenario.contract.disclaimer}`
                  : scenario.asset.caption}
              </p>
            </div>
          </div>

          {/* Inspection Results Panel */}
          <div className="p-4 rounded-xl bg-linen/50 border border-mist space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-ink flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-signal-blue" />
                Automated Verification Findings ({isFixed ? "4 Passed" : `${scenario.expectedFindings.length} Evaluated`})
              </span>
              <span className="text-[11px] font-mono text-ash">Deterministic Checks</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scenario.expectedFindings.map((finding, idx) => {
                const effectiveType = isFixed ? "pass" : finding.type;
                const isPass = effectiveType === "pass";
                const isWarn = effectiveType === "warn";
                const isError = effectiveType === "error";

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border transition-all ${
                      isPass
                        ? "bg-status-pass-bg/60 border-status-pass-border text-charcoal"
                        : isWarn
                        ? "bg-status-warn-bg/70 border-status-warn-border text-charcoal"
                        : "bg-status-error-bg/70 border-status-error-border text-charcoal"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-semibold uppercase text-ash">
                        {finding.layer}
                      </span>
                      {isPass && <CheckCircle2 className="w-3.5 h-3.5 text-status-pass" />}
                      {isWarn && <AlertTriangle className="w-3.5 h-3.5 text-status-warn" />}
                      {isError && <XCircle className="w-3.5 h-3.5 text-status-error" />}
                    </div>
                    <h4 className="font-serif text-sm font-medium text-ink">
                      {isFixed ? "Verified & Reconciled" : finding.title}
                    </h4>
                    <p className="text-[11px] text-charcoal/80 mt-1 leading-normal font-sans">
                      {isFixed ? "Specification matches contract exactly." : finding.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Cryptographic SHA-256 Lock status */}
            <div className="pt-2 border-t border-mist/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-ash">
              <div className="flex items-center gap-1.5">
                <Lock className={`w-3.5 h-3.5 ${isFixed || !hasErrors ? "text-status-pass" : "text-status-error"}`} />
                <span>
                  {isFixed || !hasErrors
                    ? "Cryptographic Revision Seal: VALID & LOCKED"
                    : "Cryptographic Seal: INVALIDATED (Needs Re-Check)"}
                </span>
              </div>
              <span className="truncate max-w-[240px] text-graphite bg-paper px-2 py-0.5 rounded border border-mist">
                sha256:{scenario.sha256 ? scenario.sha256.substring(0, 16) : "pending"}...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
