"use client";

import { useState } from "react";
import { Eye, AlertCircle, Sparkles, Tag, Check, ZoomIn } from "lucide-react";
import { FindingItem } from "@/types";

interface AnnotatedCreativeViewerProps {
  bannerBase64?: string | null;
  bannerName?: string | null;
  findings: FindingItem[];
  selectedFindingId?: string | null;
  onSelectFinding: (findingId: string) => void;
}

export function AnnotatedCreativeViewer({
  bannerBase64,
  bannerName,
  findings,
  selectedFindingId,
  onSelectFinding,
}: AnnotatedCreativeViewerProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Filter findings with valid box2d coordinates
  const visualFindings = findings.filter(
    (f) =>
      Array.isArray(f.box2d) &&
      f.box2d.length === 4 &&
      f.box2d.every((n) => typeof n === "number" && !isNaN(n))
  );

  const unanchoredFindings = findings.filter(
    (f) => !f.box2d && (f.location.toLowerCase().includes("banner") || f.location.toLowerCase().includes("visual"))
  );

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-mist pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ash flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-twilight" /> Feature 2: Visual OCR & Spatial Inspection
          </span>
          <h3 className="font-serif text-lg text-ink font-semibold">
            Interactive Creative Asset Annotations
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-1 bg-status-error/10 text-status-error rounded-md font-semibold">
            {visualFindings.length} Anchored Hotspots
          </span>
          {unanchoredFindings.length > 0 && (
            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
              {unanchoredFindings.length} Unanchored Visual
            </span>
          )}
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="relative rounded-2xl border border-mist overflow-hidden bg-linen/50 shadow-subtle-card">
        {bannerBase64 ? (
          <div className="relative w-full overflow-hidden flex items-center justify-center p-2 bg-paper/60">
            {/* The Image */}
            <div className="relative max-w-2xl w-full">
              <img
                src={bannerBase64}
                alt={bannerName || "Uploaded Campaign Graphic"}
                className="w-full h-auto rounded-xl shadow-sm block select-none"
              />

              {/* Overlaid Spatial Bounding Boxes */}
              {visualFindings.map((f, idx) => {
                const [ymin, xmin, ymax, xmax] = f.box2d!;
                const top = `${ymin / 10}%`;
                const left = `${xmin / 10}%`;
                const width = `${(xmax - xmin) / 10}%`;
                const height = `${(ymax - ymin) / 10}%`;

                const isSelected = selectedFindingId === f.id;
                const isHovered = hoveredId === f.id;

                return (
                  <div
                    key={f.id || idx}
                    onClick={() => f.id && onSelectFinding(f.id)}
                    onMouseEnter={() => f.id && setHoveredId(f.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ top, left, width, height }}
                    className={`absolute cursor-pointer rounded transition-all duration-150 z-20 ${
                      isSelected
                        ? "border-2 border-red-600 bg-red-600/20 ring-4 ring-red-400/30 shadow-lg"
                        : isHovered
                        ? "border-2 border-red-500 bg-red-500/15 ring-2 ring-red-300"
                        : "border-2 border-red-500/80 bg-red-500/10 animate-pulse"
                    }`}
                  >
                    <span className="absolute -top-3 -left-2 px-1.5 py-0.5 bg-red-600 text-paper font-mono text-[10px] font-bold rounded shadow-md flex items-center gap-1">
                      #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Pre-Seeded Realistic Demo Canvas when no custom image was uploaded */
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-ash border-b border-mist/80 pb-2">
              <span>DEMO GRAPHIC CANVAS: ECOSIP_WEEKEND_BANNER.PNG (1080x1080)</span>
              <span className="text-signal-blue font-semibold">Gemini 1.5 Flash Vision Mapped</span>
            </div>

            {/* Simulated Graphic Frame */}
            <div className="relative mx-auto max-w-xl aspect-[16/10] bg-gradient-to-br from-emerald-900 via-teal-950 to-twilight rounded-2xl p-6 text-paper shadow-md flex flex-col justify-between overflow-hidden border border-mist/40">
              {/* Box 1 (Discount Badge Contradiction) */}
              <div
                onClick={() => findings[0]?.id && onSelectFinding(findings[0].id)}
                className={`relative self-start p-3 bg-red-600/90 text-paper rounded-xl cursor-pointer border-2 transition-all ${
                  selectedFindingId === findings[0]?.id
                    ? "border-paper ring-4 ring-red-300 scale-105"
                    : "border-paper/80 hover:scale-102"
                }`}
              >
                <span className="absolute -top-3 -right-2 px-2 py-0.5 bg-red-800 text-paper text-[10px] font-mono font-bold rounded-full border border-paper">
                  #1 50% vs 20%
                </span>
                <span className="font-serif text-2xl font-bold tracking-tight block">50% OFF</span>
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-90">FLASH SALE</span>
              </div>

              {/* Poster Body */}
              <div className="space-y-1">
                <h4 className="font-serif text-3xl font-bold tracking-tight">EcoSip Thermal Flask</h4>
                <p className="text-xs text-paper/80 font-sans max-w-sm">
                  100% BPA-Free Triple-Wall Insulated Bottle for Active Lifestyles.
                </p>
              </div>

              {/* Box 2 (Missing Disclaimer Footer) */}
              <div
                onClick={() => findings[3]?.id && onSelectFinding(findings[3].id)}
                className={`p-2 bg-paper/10 backdrop-blur-sm rounded-lg border-2 border-dashed transition-all cursor-pointer flex items-center justify-between text-[11px] font-mono ${
                  selectedFindingId === findings[3]?.id
                    ? "border-red-400 bg-red-950/40 text-red-200 ring-2 ring-red-400"
                    : "border-red-400/60 text-red-300 hover:bg-red-950/20"
                }`}
              >
                <span>[Missing Disclaimer: *On selected bottles. While stocks last.]</span>
                <span className="px-1.5 py-0.5 bg-red-600/80 text-paper text-[9px] font-bold rounded">
                  #2 MISSING
                </span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-center text-charcoal">
              Click any red bounding box above to automatically navigate to its ground-truth contract evidence.
            </p>
          </div>
        )}
      </div>

      {/* Visual Findings List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visualFindings.map((f, idx) => {
          const isSelected = selectedFindingId === f.id;
          return (
            <div
              key={f.id || idx}
              onClick={() => f.id && onSelectFinding(f.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                isSelected
                  ? "bg-red-50 border-red-500 shadow-sm ring-1 ring-red-400"
                  : "bg-paper border-mist hover:border-twilight/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-red-600">
                  Annotation #{idx + 1} • {f.location}
                </span>
                <span className="text-[10px] font-mono text-ash">
                  box: [{f.box2d?.join(", ")}]
                </span>
              </div>
              <p className="font-medium text-ink">{f.issue}</p>
              <p className="text-charcoal text-[11px] leading-relaxed">
                <strong>Fix:</strong> {f.suggestedFix}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
