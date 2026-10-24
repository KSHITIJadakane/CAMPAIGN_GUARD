"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Check,
  AlertCircle
} from "lucide-react";
import { CheckLayer, FindingItem } from "@/types";
import { useRole } from "@/components/layout/RoleContext";

interface FindingsReportProps {
  campaign: any;
  onRefresh: () => void;
}

export function FindingsReport({ campaign, onRefresh }: FindingsReportProps) {
  const { currentUser } = useRole();
  const latestPack = campaign.packs?.[0];
  const findings: FindingItem[] = latestPack?.findings || [];

  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Group counts by layer
  const layers: CheckLayer[] = ["FACTS", "CROSS_ASSET", "BRAND_RULES", "ACCESSIBILITY"];
  const layerMeta: Record<CheckLayer, { title: string; subtitle: string }> = {
    FACTS: { title: "Campaign Facts", subtitle: "Discounts, dates, numbers" },
    CROSS_ASSET: { title: "Cross-Asset", subtitle: "Caption vs Banner vs PDF" },
    BRAND_RULES: { title: "Brand Rules", subtitle: "Superlatives & disclaimers" },
    ACCESSIBILITY: { title: "Accessibility", subtitle: "Visual contrast & alt-text" },
  };

  const handleResolve = async (findingId: string, resolution: "ACCEPTED" | "ESCALATED") => {
    setResolvingId(findingId);
    try {
      const res = await fetch("/api/findings/resolve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          findingId,
          resolution,
          actorName: currentUser.name,
          actorRole: currentUser.role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-Layer Inspection Summary Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {layers.map((layer) => {
          const layerFindings = findings.filter((f) => f.layer === layer);
          const hasError = layerFindings.some((f) => f.status === "CONTRADICTED");
          const hasWarning = layerFindings.some((f) => f.status === "INSUFFICIENT_EVIDENCE");
          const isPassed = layerFindings.length === 0;

          return (
            <div
              key={layer}
              className={`p-4 rounded-xl border transition-all ${
                hasError
                  ? "bg-status-error-bg/60 border-status-error-border text-status-error"
                  : hasWarning
                  ? "bg-status-warn-bg/60 border-status-warn-border text-status-warn"
                  : "bg-status-pass-bg/60 border-status-pass-border text-status-pass"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
                  {layerMeta[layer].title}
                </span>
                {hasError ? (
                  <XCircle className="w-4 h-4 text-status-error" />
                ) : hasWarning ? (
                  <AlertTriangle className="w-4 h-4 text-status-warn" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-status-pass" />
                )}
              </div>
              <div className="text-[13px] font-medium text-ink">
                {hasError
                  ? `${layerFindings.length} issue flagged`
                  : hasWarning
                  ? "1 notice flagged"
                  : "All checks verified"}
              </div>
              <div className="text-[11px] text-ash font-sans mt-0.5">{layerMeta[layer].subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Findings List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink font-normal">
            Preflight Inspection Findings ({findings.length})
          </h3>
          <span className="text-[12px] font-mono text-ash">
            Rev {latestPack?.revision || 1} • SHA256: [{latestPack?.packHash ? latestPack.packHash.slice(0, 8) : "none"}]
          </span>
        </div>

        {findings.length === 0 ? (
          <div className="p-8 text-center bg-paper rounded-2xl border border-mist text-ash">
            <CheckCircle2 className="w-8 h-8 text-status-pass mx-auto mb-2" />
            <h4 className="font-serif text-xl text-ink font-normal">Zero Contradictions Found</h4>
            <p className="text-[13px] text-charcoal font-sans max-w-md mx-auto mt-1">
              All promotional copy, banner text, and PDF claims perfectly align with the approved Campaign Contract. This revision is clean and ready for cryptographic locking.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {findings.map((finding: any) => {
              const isContradicted = finding.status === "CONTRADICTED";
              const isResolved = finding.resolution === "ACCEPTED";
              const isEscalated = finding.resolution === "ESCALATED";

              return (
                <div
                  key={finding.id}
                  className={`bg-paper rounded-2xl border p-5 transition-all shadow-subtle-card ${
                    isResolved
                      ? "border-mist opacity-70"
                      : isContradicted
                      ? "border-status-error-border/80"
                      : "border-mist"
                  }`}
                >
                  {/* Top Bar of Finding */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-mist/80">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-pill bg-linen border border-mist text-charcoal font-medium">
                        {finding.layer.replace("_", " ")}
                      </span>
                      <span className="text-[12px] font-mono text-ash">Location: {finding.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isResolved && (
                        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-pill bg-status-pass-bg text-status-pass border border-status-pass-border">
                          Fix Accepted
                        </span>
                      )}
                      {isEscalated && (
                        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-pill bg-status-warn-bg text-status-warn border border-status-warn-border">
                          Escalated to Brand Lead
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-pill ${
                          isContradicted
                            ? "bg-status-error-bg text-status-error border border-status-error-border"
                            : "bg-status-warn-bg text-status-warn border border-status-warn-border"
                        }`}
                      >
                        {finding.status}
                      </span>
                    </div>
                  </div>

                  {/* Issue headline */}
                  <div className="mb-2">
                    <h4 className="text-[15px] font-semibold text-ink font-sans">{finding.issue}</h4>
                  </div>

                  {/* Evidence Box */}
                  <div className="p-3 bg-linen rounded-xl border border-mist/80 text-[12px] font-mono text-charcoal my-3 space-y-1">
                    <span className="text-ash block text-[10px] uppercase font-bold tracking-wider">
                      Ground Truth Evidence:
                    </span>
                    <p className="leading-relaxed">{finding.evidence}</p>
                  </div>

                  {/* Suggested Fix */}
                  <div className="p-3 bg-paper rounded-xl border border-mist text-[13px] text-ink font-sans flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-signal-blue shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-charcoal">Suggested Correction: </span>
                      <span className="text-ink">{finding.suggestedFix}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!isResolved && (
                    <div className="mt-4 pt-3 border-t border-mist/80 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResolve(finding.id, "ESCALATED")}
                        disabled={resolvingId === finding.id}
                        className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-twilight text-twilight hover:bg-linen transition-colors"
                      >
                        Escalate
                      </button>
                      <button
                        onClick={() => handleResolve(finding.id, "ACCEPTED")}
                        disabled={resolvingId === finding.id}
                        className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-signal-blue text-signal-blue hover:bg-signal-blue/5 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept Suggested Fix
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}