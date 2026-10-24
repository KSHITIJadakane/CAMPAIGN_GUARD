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
  onGoToApproval?: () => void;
  onGoToUpload?: () => void;
}

export function FindingsReport({ campaign, onRefresh, onGoToApproval, onGoToUpload }: FindingsReportProps) {
  const { currentUser } = useRole();
  const latestPack = campaign?.packs?.[0];
  const findings: FindingItem[] = latestPack?.findings || [];
  const pendingFindings = findings.filter((f) => f.resolution === "PENDING");
  const allResolved = findings.length > 0 && pendingFindings.length === 0;

  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [isBatchResolving, setIsBatchResolving] = useState(false);

  // Group counts by layer
  const layers: CheckLayer[] = ["FACTS", "CROSS_ASSET", "BRAND_RULES", "ACCESSIBILITY"];
  const layerMeta: Record<CheckLayer, { title: string; subtitle: string }> = {
    FACTS: { title: "Campaign Facts", subtitle: "Discounts, dates, numbers" },
    CROSS_ASSET: { title: "Cross-Asset", subtitle: "Caption vs Banner vs PDF" },
    BRAND_RULES: { title: "Brand Rules", subtitle: "Superlatives & disclaimers" },
    ACCESSIBILITY: { title: "Accessibility", subtitle: "Visual contrast & alt-text" },
  };

  const handleResolve = async (findingId: string, resolution: "ACCEPTED" | "ESCALATED" | "PENDING") => {
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

  const handleResolveAll = async () => {
    const pending = findings.filter((f) => f.resolution === "PENDING");
    if (pending.length === 0) return;
    setIsBatchResolving(true);
    try {
      for (const f of pending) {
        await fetch("/api/findings/resolve", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            findingId: f.id,
            resolution: "ACCEPTED",
            actorName: currentUser.name,
            actorRole: currentUser.role,
          }),
        });
      }
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsBatchResolving(false);
    }
  };

  // If no pack has been submitted yet for this campaign
  if (!latestPack) {
    return (
      <div className="p-8 sm:p-12 text-center bg-paper rounded-2xl border border-mist space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-linen flex items-center justify-center mx-auto border border-mist text-charcoal">
          <Layers className="w-7 h-7 text-signal-blue" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-pill bg-linen border border-mist text-ash">
            Step 3 • Preflight Inspection
          </span>
          <h4 className="font-serif text-2xl text-ink font-normal pt-1">No Creative Assets Uploaded Yet</h4>
          <p className="text-[13px] text-charcoal font-sans leading-relaxed">
            The automated 4-layer inspection engine requires promotional copy, banner images, or specification sheets to evaluate against Contract truth.
          </p>
        </div>
        {onGoToUpload && (
          <div className="pt-2">
            <button
              onClick={onGoToUpload}
              className="px-5 py-2.5 rounded-xl bg-signal-blue hover:bg-cerulean text-paper text-xs font-mono font-medium transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Go to Creative Studio (Step 2) & Upload Assets →</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* All Fixes Accepted Banner */}
      {allResolved && (
        <div className="p-4 sm:p-5 bg-status-pass-bg border border-status-pass-border rounded-2xl text-status-pass flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-status-pass/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-status-pass" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-ink font-normal">
                All Contradictions Reconciled & Accepted
              </h4>
              <p className="text-xs text-charcoal font-sans mt-0.5">
                Every preflight issue has been addressed. The creative pack now harmonizes with Contract v{campaign.contracts?.[0]?.version || 1} truth.
              </p>
            </div>
          </div>
          {onGoToApproval && (
            <button
              onClick={onGoToApproval}
              className="px-4 py-2.5 rounded-xl bg-twilight text-paper hover:bg-ink text-xs font-mono font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
            >
              <span>Proceed to Gatekeeper Lock →</span>
            </button>
          )}
        </div>
      )}

      {/* 4-Layer Inspection Summary Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {layers.map((layer) => {
          const layerFindings = findings.filter((f) => f.layer === layer);
          const unresolved = layerFindings.filter((f) => f.resolution === "PENDING");
          const hasError = unresolved.some((f) => f.status === "CONTRADICTED");
          const hasWarning = unresolved.some((f) => f.status === "INSUFFICIENT_EVIDENCE");
          const layerAllResolved = layerFindings.length > 0 && unresolved.length === 0;

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
                  ? `${unresolved.length} issue flagged`
                  : hasWarning
                  ? "1 notice flagged"
                  : layerAllResolved
                  ? "Fix Accepted & Reconciled"
                  : "All checks verified"}
              </div>
              <div className="text-[11px] text-ash font-sans mt-0.5">{layerMeta[layer].subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Findings List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl text-ink font-normal">
              Preflight Inspection Findings ({findings.length})
            </h3>
            <span className="text-[12px] font-mono text-ash">
              Rev {latestPack?.revision || 1} • SHA256: [{latestPack?.packHash ? latestPack.packHash.slice(0, 8) : "none"}]
            </span>
          </div>

          {findings.some((f: any) => f.resolution === "PENDING") && (
            <button
              onClick={handleResolveAll}
              disabled={isBatchResolving}
              className="px-4 py-2 rounded-xl bg-signal-blue hover:bg-cerulean text-paper text-xs font-mono font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Check className={`w-3.5 h-3.5 ${isBatchResolving ? "animate-spin" : ""}`} />
              <span>{isBatchResolving ? "Accepting All..." : "Accept All Suggested Fixes"}</span>
            </button>
          )}
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
                  {!isResolved ? (
                    <div className="mt-4 pt-3 border-t border-mist/80 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResolve(finding.id, "ESCALATED")}
                        disabled={resolvingId === finding.id}
                        className="text-[12px] font-medium px-3.5 py-1.5 rounded-lg border border-twilight text-twilight hover:bg-linen transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {resolvingId === finding.id ? "Updating..." : "Escalate"}
                      </button>
                      <button
                        onClick={() => handleResolve(finding.id, "ACCEPTED")}
                        disabled={resolvingId === finding.id}
                        className="text-[12px] font-medium px-3.5 py-1.5 rounded-lg border border-signal-blue text-signal-blue hover:bg-signal-blue/5 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        <Check className={`w-3.5 h-3.5 ${resolvingId === finding.id ? "animate-spin" : ""}`} />
                        <span>{resolvingId === finding.id ? "Resolving..." : "Accept Suggested Fix"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2 border-t border-mist/50 flex items-center justify-end">
                      <button
                        onClick={() => handleResolve(finding.id, "PENDING")}
                        disabled={resolvingId === finding.id}
                        className="text-[11px] font-mono text-ash hover:text-ink underline transition-colors cursor-pointer"
                        title="Re-open this finding for review"
                      >
                        Re-open finding
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