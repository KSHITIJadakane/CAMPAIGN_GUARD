"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

const CATCHY_LINES = [
  { threshold: 0, text: "Establishing single human-verified truth contract..." },
  { threshold: 22, text: "Calibrating 4 deterministic inspection layers..." },
  { threshold: 46, text: "Scanning banners, captions & multimodal creative..." },
  { threshold: 70, text: "Guarding against hallucinated brand claims..." },
  { threshold: 88, text: "Locking SHA-256 cryptographic revision seal..." },
  { threshold: 98, text: "CampaignGuard Preflight Protocol Ready." },
];

interface IntroPreloaderProps {
  onComplete?: () => void;
}

export function IntroPreloader({ onComplete }: IntroPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isGlidingUp, setIsGlidingUp] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw the intro in this browser tab session
    const hasSeenIntro = sessionStorage.getItem("cg_intro_seen");
    if (hasSeenIntro) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    // Smooth counter from 0 to 100 in ~2.3 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Organic step increments
        const remaining = 100 - prev;
        const step = Math.max(1, Math.min(Math.floor(remaining * 0.12) + Math.floor(Math.random() * 3) + 1, 8));
        const next = Math.min(100, prev + step);
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress === 100) {
      // Hold for 350ms so user sees 100%, then glide up
      const glideTimer = setTimeout(() => {
        setIsGlidingUp(true);
      }, 350);

      // Remove from DOM after glide animation completes (750ms)
      const doneTimer = setTimeout(() => {
        setIsDone(true);
        sessionStorage.setItem("cg_intro_seen", "true");
        if (onComplete) onComplete();
      }, 1100);

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
    }, 400);
  };

  if (isDone) return null;

  // Find active catchy line based on current progress
  const currentLine =
    [...CATCHY_LINES].reverse().find((line) => progress >= line.threshold)?.text ||
    CATCHY_LINES[0].text;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-parchment select-none transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isGlidingUp ? "-translate-y-full opacity-90 shadow-2xl" : "translate-y-0 opacity-100"
      }`}
      style={{
        backgroundImage: `
          radial-gradient(at 15% 15%, rgba(65, 161, 207, 0.08) 0px, transparent 50%),
          radial-gradient(at 85% 85%, rgba(40, 40, 52, 0.05) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(249, 250, 247, 0.8) 0px, transparent 80%)
        `,
      }}
    >
      {/* Top subtle skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-3.5 py-1.5 rounded-pill border border-mist bg-paper/80 text-xs font-mono text-ash hover:text-ink hover:border-twilight transition-colors"
      >
        Skip Intro →
      </button>

      <div className="flex flex-col items-center text-center max-w-md px-6 space-y-8 animate-fade-in">
        {/* Sweet Logo with pulsing glowing halo */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring aura */}
          <div className="absolute w-24 h-24 rounded-full bg-signal-blue/15 animate-ping opacity-70" />
          <div className="absolute w-28 h-28 rounded-full border border-signal-blue/30 animate-pulse-slow" />
          
          {/* Main Logo Crest */}
          <div className="relative w-16 h-16 rounded-2xl bg-twilight shadow-glow-blue flex items-center justify-center text-paper border border-twilight/50 transform transition-transform hover:scale-105 duration-300">
            <ShieldCheck className="w-8 h-8 text-signal-blue" />
            <Sparkles className="w-3.5 h-3.5 text-cerulean absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
            CampaignGuard
          </h1>
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-ash font-medium">
            Automated Preflight Protocol
          </p>
        </div>

        {/* Dynamic Catchy Line (animates smoothly on change) */}
        <div className="h-10 flex items-center justify-center">
          <p
            key={currentLine}
            className="text-xs sm:text-sm font-sans text-charcoal/90 italic animate-fade-in-quick transition-all max-w-sm"
          >
            "{currentLine}"
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-64 sm:w-80 space-y-3">
          {/* Bar track */}
          <div className="h-1.5 w-full bg-mist/60 rounded-pill overflow-hidden p-0.5 border border-mist/80">
            <div
              className="h-full bg-gradient-to-r from-signal-blue via-cerulean to-twilight rounded-pill transition-all duration-150 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Numerical status */}
          <div className="flex items-center justify-between text-xs font-mono text-ash px-0.5">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal-blue animate-pulse" />
              <span>{progress === 100 ? "System Ready" : "Initializing"}</span>
            </span>
            <span className="font-semibold text-ink text-sm tracking-wider">
              {progress.toString().padStart(3, "0")}%
            </span>
          </div>
        </div>

        {/* Soft Footer Caption */}
        <p className="text-[11px] font-mono text-fog pt-4">
          Deterministic Facts • Cryptographic Revision Lock
        </p>
      </div>
    </div>
  );
}
