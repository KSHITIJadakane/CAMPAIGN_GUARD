"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Fingerprint,
  ArrowRight
} from "lucide-react";

interface StageLine {
  threshold: number;
  phase: string;
  line: string;
  activeLayerIndex: number;
}

const STAGE_LINES: StageLine[] = [
  { 
    threshold: 0, 
    phase: "PHASE 01 / INIT", 
    line: "Connecting to CampaignGuard Distributed Governance Mesh...",
    activeLayerIndex: 0
  },
  { 
    threshold: 14, 
    phase: "PHASE 02 / CONTRACT", 
    line: "Establishing single human-verified canonical truth contract...",
    activeLayerIndex: 0
  },
  { 
    threshold: 28, 
    phase: "PHASE 03 / FACTS", 
    line: "Calibrating Layer 1: Numerical discounts, expiry dates & scopes...",
    activeLayerIndex: 1
  },
  { 
    threshold: 44, 
    phase: "PHASE 04 / OCR", 
    line: "Extracting high-fidelity OCR text from submitted banner graphics...",
    activeLayerIndex: 2
  },
  { 
    threshold: 58, 
    phase: "PHASE 05 / RECONCILE", 
    line: "Cross-referencing social caption copy against promotional visual text...",
    activeLayerIndex: 2
  },
  { 
    threshold: 72, 
    phase: "PHASE 06 / POLICY", 
    line: "Enforcing Layer 3: Scanning prohibited superlatives & claim guardrails...",
    activeLayerIndex: 3
  },
  { 
    threshold: 84, 
    phase: "PHASE 07 / A11Y", 
    line: "Auditing Layer 4: Screen-reader alt text & WCAG contrast compliance...",
    activeLayerIndex: 3
  },
  { 
    threshold: 93, 
    phase: "PHASE 08 / CRYPTO", 
    line: "Generating SHA-256 revision hash and sealing version-locked approval...",
    activeLayerIndex: 4
  },
  { 
    threshold: 99, 
    phase: "PROTOCOL READY", 
    line: "CampaignGuard Preflight Protocol Initialized. Welcome.",
    activeLayerIndex: 4
  },
];

const INSPECTION_LAYERS = [
  { name: "1. Campaign Facts", icon: CheckCircle2 },
  { name: "2. Cross-Asset Match", icon: Layers },
  { name: "3. Brand Rules", icon: Cpu },
  { name: "4. Cryptographic Lock", icon: Fingerprint },
];

interface IntroPreloaderProps {
  onComplete?: () => void;
}

export function IntroPreloader({ onComplete }: IntroPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isGlidingUp, setIsGlidingUp] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw the intro in this tab session
    const hasSeenIntro = sessionStorage.getItem("cg_intro_seen");
    if (hasSeenIntro) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    // Paced to 4 seconds total:
    // 0 to 100% takes ~3.55 seconds (88 ticks * 40ms)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Smooth organic increments averaging ~1.15% per tick
        let delta = 1.15;
        if (prev > 30 && prev < 45) delta = 1.05;
        if (prev > 70 && prev < 85) delta = 1.1;
        if (prev >= 95) delta = 0.9;

        const next = Math.min(100, Math.round((prev + delta) * 10) / 10);
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress >= 100) {
      // Hold on 100% for 450ms (~4.0s total mark), then glide up
      const glideTimer = setTimeout(() => {
        setIsGlidingUp(true);
      }, 450);

      // Transition completes at ~4.8s, reveal home page
      const doneTimer = setTimeout(() => {
        setIsDone(true);
        sessionStorage.setItem("cg_intro_seen", "true");
        if (onComplete) onComplete();
      }, 1150);

      return () => {
        clearTimeout(glideTimer);
        clearTimeout(doneTimer);
      };
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setIsGlidingUp(true);
    setTimeout(() => {
      setIsDone(true);
      sessionStorage.setItem("cg_intro_seen", "true");
      if (onComplete) onComplete();
    }, 350);
  };

  if (isDone) return null;

  // Active stage configuration
  const currentStage =
    [...STAGE_LINES].reverse().find((item) => progress >= item.threshold) ||
    STAGE_LINES[0];

  const intProgress = Math.floor(progress);

  return (
    <div
      className={`fixed inset-0 z-[100] h-screen h-[100dvh] w-screen overflow-hidden flex flex-col justify-between bg-parchment select-none p-4 sm:p-6 md:p-8 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isGlidingUp ? "-translate-y-full opacity-90 shadow-2xl scale-[0.99]" : "translate-y-0 opacity-100 scale-100"
      }`}
      style={{
        backgroundImage: `
          radial-gradient(at 15% 15%, rgba(65, 161, 207, 0.12) 0px, transparent 40%),
          radial-gradient(at 85% 15%, rgba(40, 40, 52, 0.08) 0px, transparent 45%),
          radial-gradient(at 50% 85%, rgba(65, 161, 207, 0.09) 0px, transparent 55%),
          radial-gradient(at 50% 50%, rgba(249, 250, 247, 0.9) 0px, transparent 80%)
        `,
      }}
    >
      {/* Top Bar: Brand Identifier + Skip Control */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-twilight flex items-center justify-center text-paper border border-twilight/40 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-signal-blue" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base font-semibold text-ink leading-tight">
              CampaignGuard
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-ash font-medium">
              cg.kshitijpro.xyz
            </span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-pill border border-mist bg-paper/90 text-xs font-mono text-charcoal hover:text-ink hover:border-twilight transition-all shadow-sm"
        >
          <span>Skip</span>
          <ArrowRight className="w-3 h-3 text-ash transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Main Center Stage (Fit perfectly within viewport, no overflow) */}
      <div className="flex flex-col items-center justify-center text-center max-w-3xl w-full mx-auto my-auto space-y-4 sm:space-y-6 py-2 shrink">
        {/* Brand Emblem with Contained Ambient Glow */}
        <div className="relative flex items-center justify-center">
          {/* Subtle Ambient Ring */}
          <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-signal-blue/15 animate-ping opacity-60 pointer-events-none" />
          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-signal-blue/25 animate-pulse-slow pointer-events-none" />

          {/* Central Logo Squircle */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-twilight shadow-glow-blue flex items-center justify-center text-paper border border-signal-blue/40">
            <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11 text-signal-blue" />
            <Sparkles className="w-4 h-4 text-cerulean absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>

        {/* Protocol Title & Phase Badge */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-pill bg-linen border border-mist text-[11px] font-mono text-ash font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-blue animate-pulse" />
            <span>{currentStage.phase}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink font-normal tracking-tight">
            Automated Campaign Governance
          </h1>
        </div>

        {/* Smooth Dynamic Catchy Line Box */}
        <div className="w-full max-w-xl px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-paper/85 backdrop-blur-md border border-mist/90 shadow-subtle-card min-h-[56px] flex items-center justify-center transition-all duration-200">
          <p
            key={currentStage.line}
            className="text-xs sm:text-sm md:text-base font-sans text-charcoal/95 leading-relaxed italic animate-fade-in transition-all text-center"
          >
            "{currentStage.line}"
          </p>
        </div>

        {/* Master Progress Display & Track */}
        <div className="w-full max-w-xl space-y-3">
          {/* Percentage & Telemetry State */}
          <div className="flex items-baseline justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-ash">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal-blue animate-ping" />
              <span className="uppercase tracking-wider text-[11px]">
                {intProgress >= 100 ? "Ready • Protocol Sealed" : "Calibrating 4 Layers"}
              </span>
            </div>

            <div className="flex items-baseline gap-1 font-mono font-bold tracking-tight text-ink">
              <span className="text-4xl sm:text-5xl md:text-6xl">
                {intProgress.toString().padStart(3, "0")}
              </span>
              <span className="text-lg sm:text-xl text-signal-blue">%</span>
            </div>
          </div>

          {/* Slim Gradient Progress Bar */}
          <div className="w-full h-2.5 sm:h-3 bg-mist/50 rounded-full p-0.5 border border-mist shadow-inner overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-signal-blue via-cerulean to-twilight rounded-full transition-all duration-75 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white rounded-full opacity-80 shadow-glow-blue animate-pulse" />
            </div>
          </div>

          {/* Sequential 4-Layer Telemetry Activation Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
            {INSPECTION_LAYERS.map((layer, idx) => {
              const Icon = layer.icon;
              const isLayerActive = currentStage.activeLayerIndex >= idx + 1 || intProgress >= 100;
              return (
                <div
                  key={layer.name}
                  className={`px-2 py-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all duration-200 ${
                    isLayerActive
                      ? "bg-paper border-signal-blue text-ink shadow-xs"
                      : "bg-linen/50 border-mist/70 text-ash/60"
                  }`}
                >
                  <Icon
                    className={`w-3 h-3 ${
                      isLayerActive ? "text-status-pass" : "text-ash/40"
                    }`}
                  />
                  <span className="truncate">{layer.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-ash w-full max-w-5xl mx-auto border-t border-mist/70 pt-2.5 shrink-0 gap-1">
        <span>Deterministic Fact Verification • Zero Hallucinations</span>
        <span className="text-signal-blue font-semibold">SHA-256 Revision Lock</span>
      </div>
    </div>
  );
}
