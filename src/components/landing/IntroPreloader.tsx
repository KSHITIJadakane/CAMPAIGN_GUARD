"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  FileCheck2, 
  Lock, 
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
    phase: "PHASE 01 / INITIALIZATION", 
    line: "Connecting to CampaignGuard Distributed Governance Mesh...",
    activeLayerIndex: 0
  },
  { 
    threshold: 12, 
    phase: "PHASE 02 / CONTRACT SYNC", 
    line: "Establishing single human-verified canonical truth contract...",
    activeLayerIndex: 0
  },
  { 
    threshold: 25, 
    phase: "PHASE 03 / DETERMINISTIC FACTS", 
    line: "Calibrating Layer 1: Numerical discounts, expiry dates & scopes...",
    activeLayerIndex: 1
  },
  { 
    threshold: 40, 
    phase: "PHASE 04 / MULTIMODAL INGESTION", 
    line: "Extracting high-fidelity OCR text from submitted banner graphics...",
    activeLayerIndex: 2
  },
  { 
    threshold: 54, 
    phase: "PHASE 05 / CROSS-ASSET RECONCILER", 
    line: "Cross-referencing social caption copy against promotional visual text...",
    activeLayerIndex: 2
  },
  { 
    threshold: 68, 
    phase: "PHASE 06 / BRAND VOCABULARY GUARD", 
    line: "Enforcing Layer 3: Scanning prohibited superlatives & missing disclaimers...",
    activeLayerIndex: 3
  },
  { 
    threshold: 82, 
    phase: "PHASE 07 / ACCESSIBILITY AUDIT", 
    line: "Auditing Layer 4: Screen-reader alt text & WCAG contrast compliance...",
    activeLayerIndex: 3
  },
  { 
    threshold: 92, 
    phase: "PHASE 08 / CRYPTOGRAPHIC BINDING", 
    line: "Generating SHA-256 revision hash and sealing version-locked approval...",
    activeLayerIndex: 4
  },
  { 
    threshold: 99, 
    phase: "SYSTEM READY", 
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

    // Paced smoothly over ~6.5 seconds:
    // interval fires every 55ms, incrementing smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Smooth gradual pacing with deliberate pauses at milestones
        let delta = 0.75;
        if (prev > 20 && prev < 30) delta = 0.65;
        if (prev > 50 && prev < 60) delta = 0.60;
        if (prev > 80 && prev < 90) delta = 0.55;
        if (prev >= 95) delta = 0.45;

        const next = Math.min(100, Math.round((prev + delta) * 10) / 10);
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress >= 100) {
      // Hold on 100% for 650ms so user comfortably reads the final state
      const glideTimer = setTimeout(() => {
        setIsGlidingUp(true);
      }, 650);

      // Transition complete, reveal home page
      const doneTimer = setTimeout(() => {
        setIsDone(true);
        sessionStorage.setItem("cg_intro_seen", "true");
        if (onComplete) onComplete();
      }, 1450);

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
    }, 450);
  };

  if (isDone) return null;

  // Active stage configuration
  const currentStage =
    [...STAGE_LINES].reverse().find((item) => progress >= item.threshold) ||
    STAGE_LINES[0];

  const intProgress = Math.floor(progress);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-parchment select-none p-6 sm:p-12 transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isGlidingUp ? "-translate-y-full opacity-90 shadow-2xl scale-[0.98]" : "translate-y-0 opacity-100 scale-100"
      }`}
      style={{
        backgroundImage: `
          radial-gradient(at 15% 15%, rgba(65, 161, 207, 0.12) 0px, transparent 45%),
          radial-gradient(at 85% 15%, rgba(40, 40, 52, 0.08) 0px, transparent 50%),
          radial-gradient(at 50% 85%, rgba(65, 161, 207, 0.09) 0px, transparent 60%),
          radial-gradient(at 50% 50%, rgba(249, 250, 247, 0.9) 0px, transparent 80%)
        `,
      }}
    >
      {/* Top Bar: Brand Identifier + Skip Control */}
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto pt-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-twilight flex items-center justify-center text-paper border border-twilight/40 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-signal-blue" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold text-ink leading-tight">
              CampaignGuard
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-ash font-medium">
              cg.kshitijpro.xyz
            </span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="group flex items-center gap-2 px-4 py-2 rounded-pill border border-mist bg-paper/90 text-xs font-mono text-charcoal hover:text-ink hover:border-twilight hover:shadow-sm transition-all"
        >
          <span>Skip Protocol Intro</span>
          <ArrowRight className="w-3.5 h-3.5 text-ash transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Main Center Stage (Expansive, Full-Screen, Cinema-Sized) */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl w-full mx-auto my-auto space-y-10 py-6">
        {/* Large Brand Emblem with Pulsing Concentric Rings */}
        <div className="relative flex items-center justify-center">
          {/* Orbital Wave 1 */}
          <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-signal-blue/10 animate-ping opacity-60" />
          {/* Orbital Wave 2 */}
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-signal-blue/20 animate-pulse-slow" />
          {/* Orbital Wave 3 */}
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-twilight/10 border-dashed" />

          {/* Central Squircle Crest */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-twilight shadow-glow-blue flex items-center justify-center text-paper border-2 border-signal-blue/40 transform transition-transform duration-500 hover:scale-105">
            <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 text-signal-blue" />
            <Sparkles className="w-5 h-5 text-cerulean absolute -top-1.5 -right-1.5 animate-bounce" />
          </div>
        </div>

        {/* Brand Protocol Titles */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-linen border border-mist text-xs font-mono text-ash font-medium">
            <span className="w-2 h-2 rounded-full bg-signal-blue animate-pulse" />
            <span>{currentStage.phase}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink font-normal tracking-tight">
            Automated Campaign Governance
          </h1>
        </div>

        {/* Smooth Dynamic Catchy Line Box */}
        <div className="w-full max-w-2xl px-6 py-4 rounded-2xl bg-paper/80 backdrop-blur-md border border-mist/90 shadow-subtle-card min-h-[76px] flex items-center justify-center transition-all duration-300">
          <p
            key={currentStage.line}
            className="text-sm sm:text-lg font-sans text-charcoal/95 leading-relaxed italic animate-fade-in transition-all text-center"
          >
            "{currentStage.line}"
          </p>
        </div>

        {/* Master Progress Display & Wide Loading Track */}
        <div className="w-full max-w-2xl sm:max-w-3xl space-y-4">
          {/* Massive, Prominent Percentage Readout */}
          <div className="flex items-baseline justify-between px-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-ash">
              <span className="inline-block w-2 h-2 rounded-full bg-signal-blue animate-ping" />
              <span className="uppercase tracking-wider">
                {intProgress >= 100 ? "Telemetry Locked • Verification Complete" : "Calibrating Multi-Layer Checks"}
              </span>
            </div>

            <div className="flex items-baseline gap-1 font-mono font-bold tracking-tight text-ink">
              <span className="text-5xl sm:text-7xl lg:text-8xl">
                {intProgress.toString().padStart(3, "0")}
              </span>
              <span className="text-2xl sm:text-3xl text-signal-blue">%</span>
            </div>
          </div>

          {/* Wide Gradient Progress Bar */}
          <div className="w-full h-3 sm:h-4 bg-mist/50 rounded-full p-0.5 sm:p-1 border border-mist shadow-inner overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-signal-blue via-cerulean to-twilight rounded-full transition-all duration-100 ease-out shadow-sm relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing leader dot */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full opacity-75 shadow-glow-blue animate-pulse" />
            </div>
          </div>

          {/* Sequential 4-Layer Telemetry Activation Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {INSPECTION_LAYERS.map((layer, idx) => {
              const Icon = layer.icon;
              const isLayerActive = currentStage.activeLayerIndex >= idx + 1 || intProgress >= 100;
              return (
                <div
                  key={layer.name}
                  className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all duration-300 ${
                    isLayerActive
                      ? "bg-paper border-signal-blue text-ink shadow-sm"
                      : "bg-linen/60 border-mist/80 text-ash/70"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isLayerActive ? "text-status-pass" : "text-ash/50"
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
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-ash w-full max-w-6xl mx-auto border-t border-mist/80 pt-4 gap-2">
        <span>Deterministic Fact Verification • Zero Embedding Hallucination</span>
        <span className="text-signal-blue font-semibold">SHA-256 Revision Lock • Round 2 MVP</span>
      </div>
    </div>
  );
}
