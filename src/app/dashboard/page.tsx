"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  FileEdit, 
  CheckCircle2, 
  History, 
  AlertCircle, 
  Sparkles,
  HelpCircle,
  ArrowRight,
  Lock,
  AlertTriangle,
  Zap,
  Info,
  Check,
  RotateCcw,
  Compass
} from "lucide-react";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { ContractBuilder } from "@/components/contract/ContractBuilder";
import { PackUploader } from "@/components/campaign/PackUploader";
import { FindingsReport } from "@/components/findings/FindingsReport";
import { ApprovalPanel } from "@/components/approval/ApprovalPanel";
import { AuditTimeline } from "@/components/campaign/AuditTimeline";
import { useRole } from "@/components/layout/RoleContext";
import { StatusBadge } from "@/components/campaign/StatusBadge";
import { Role } from "@/types";

export default function DashboardPage() {
  const { currentRole, currentUser, setRole } = useRole();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"contract" | "creator" | "findings" | "approval" | "audit">("findings");
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New campaign modal state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newBrand, setNewBrand] = useState("");

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (data.success && data.campaigns) {
        setCampaigns(data.campaigns);
        if (selectedCampaign) {
          const updated = data.campaigns.find((c: any) => c.id === selectedCampaign.id);
          if (updated) setSelectedCampaign(updated);
        } else if (data.campaigns.length > 0) {
          setSelectedCampaign(data.campaigns[0]);
        }
      }
    } catch (e) {
      console.error("Error fetching campaigns:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProduct.trim()) return;

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          product: newProduct.trim(),
          brand: newBrand.trim() || "Brand Co.",
          role: currentUser.role,
          actorName: currentUser.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreating(false);
        setNewTitle("");
        setNewProduct("");
        setNewBrand("");
        await fetchCampaigns();
        setSelectedCampaign(data.campaign);
        setActiveTab("contract");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1-Click Action Handlers
  const handleQuickAcceptAll = async () => {
    const latestPack = selectedCampaign?.packs?.[0];
    const pending = latestPack?.findings?.filter((f: any) => f.resolution === "PENDING") || [];
    if (pending.length === 0) return;
    setLoading(true);
    setActionNotice("Reconciling all contradictions with Contract truth...");
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
      await fetchCampaigns();
      setActionNotice("✓ All contradictions reconciled! Ready for Gatekeeper signature.");
      setTimeout(() => setActionNotice(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLock = async () => {
    const latestPack = selectedCampaign?.packs?.[0];
    if (!latestPack) return;
    setRole("REVIEWER");
    setLoading(true);
    setActionNotice("Executing cryptographic version lock (Marcus Vance)...");
    try {
      const res = await fetch("/api/packs/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          packId: latestPack.id,
          reviewerName: "Marcus Vance",
          reviewerRole: "REVIEWER",
          notes: "Approved via Guided Action — All preflight findings reconciled.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCampaigns();
        setActiveTab("approval");
        setActionNotice("🔒 Cryptographic seal bound! Status: APPROVED & LOCKED.");
        setTimeout(() => setActionNotice(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSimulateTamper = async () => {
    const latestPack = selectedCampaign?.packs?.[0];
    if (!latestPack) return;
    setLoading(true);
    setActionNotice("Simulating out-of-band asset edit post-approval...");
    try {
      const res = await fetch("/api/packs/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          caption: "Tampered copy: Claiming 35% discount unauthorized without sign-off!",
          bannerBase64: latestPack.bannerBase64,
          bannerName: latestPack.bannerName,
          pdfText: latestPack.pdfText,
          actorName: "External Modifier",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCampaigns();
        setActiveTab("approval");
        setActionNotice("🚨 Invalidation triggered! Cryptographic lock instantly revoked.");
        setTimeout(() => setActionNotice(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-mist pb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
              Preflight Governance Console
            </span>
            <span className="text-mist">•</span>
            <span className="text-[11px] font-mono text-signal-blue font-semibold">
              3-Step Workflow
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">Campaign Workspace</h1>
          <p className="text-[13px] sm:text-[14px] text-charcoal font-sans mt-0.5">
            Active persona: <strong className="text-ink">{currentUser.name}</strong> ({currentUser.title})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick 30-Second Guide Toggle Button */}
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              showGuide
                ? "bg-twilight text-paper border-twilight"
                : "bg-paper hover:bg-linen border-mist text-charcoal"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-signal-blue" />
            <span>{showGuide ? "Hide Guide" : "💡 How It Works"}</span>
          </button>

          {/* Quick Persona Switcher */}
          <div className="flex items-center gap-1 p-1 bg-paper border border-mist rounded-xl text-xs font-mono shadow-xs">
            <span className="text-ash px-2 hidden lg:inline">Persona:</span>
            {(["BRAND_MANAGER", "CREATOR", "REVIEWER"] as Role[]).map((r) => {
              const isActive = currentRole === r;
              return (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    if (r === "CREATOR") setActiveTab("creator");
                    else if (r === "REVIEWER") setActiveTab("approval");
                    else setActiveTab("contract");
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium text-[11px] ${
                    isActive
                      ? "bg-twilight text-paper shadow-sm"
                      : "text-charcoal hover:text-ink hover:bg-linen"
                  }`}
                  title={`Switch to ${r.replace("_", " ")}`}
                >
                  {r === "BRAND_MANAGER" ? "Brand" : r === "CREATOR" ? "Creator" : "Reviewer"}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchCampaigns();
            }}
            className="p-2.5 rounded-lg border border-mist text-charcoal hover:bg-paper transition-colors cursor-pointer active:scale-95"
            title="Refresh database state"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-signal-blue" : ""}`} />
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2.5 rounded-lg border border-twilight text-paper bg-dusk hover:bg-twilight transition-colors text-[13px] font-medium flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Guide Card (Explain the 3 Simple Steps) */}
      {showGuide && (
        <div className="p-5 sm:p-6 bg-paper/95 rounded-2xl border border-signal-blue/40 shadow-glow-card space-y-4 animate-fade-in relative">
          <div className="flex items-center justify-between border-b border-mist/80 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-signal-blue" />
              <h3 className="font-serif text-xl text-ink font-normal">
                How CampaignGuard Works in 30 Seconds
              </h3>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-xs font-mono text-ash hover:text-ink px-2 py-1 rounded-lg hover:bg-linen"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div 
              onClick={() => { setActiveTab("contract"); setRole("BRAND_MANAGER"); }}
              className="p-3.5 rounded-xl bg-linen hover:bg-mist/40 transition-colors border border-mist cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-twilight">STEP 1 • Set Truth</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-paper border border-mist">Brand Lead</span>
              </div>
              <p className="text-charcoal leading-relaxed">
                Priya sets the verified truth in <strong>Campaign Contract</strong> (e.g. 20% discount, 12hr cold claim, forbidden words like "Miracle").
              </p>
              <span className="text-[11px] text-signal-blue font-medium block pt-1">Click to view Contract →</span>
            </div>

            <div 
              onClick={() => { setActiveTab("findings"); }}
              className="p-3.5 rounded-xl bg-linen hover:bg-mist/40 transition-colors border border-mist cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-signal-blue">STEP 2 • Preflight Audit</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-paper border border-mist">Automated AI</span>
              </div>
              <p className="text-charcoal leading-relaxed">
                Alex uploads social copy and banner. CampaignGuard's 4-layer engine detects contradictions (e.g. banner says 30%, caption claims 24hrs).
              </p>
              <span className="text-[11px] text-signal-blue font-medium block pt-1">Click to view Findings →</span>
            </div>

            <div 
              onClick={() => { setActiveTab("approval"); setRole("REVIEWER"); }}
              className="p-3.5 rounded-xl bg-linen hover:bg-mist/40 transition-colors border border-mist cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-status-pass">STEP 3 • Lock & Guard</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-paper border border-mist">Reviewer</span>
              </div>
              <p className="text-charcoal leading-relaxed">
                Once fixes are accepted, Marcus locks the campaign with a cryptographic SHA-256 seal. Any later edits immediately invalidate the lock.
              </p>
              <span className="text-[11px] text-signal-blue font-medium block pt-1">Click to view Lock Panel →</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Notice Banner if action occurred */}
      {actionNotice && (
        <div className="p-3 bg-status-pass-bg border border-status-pass-border text-status-pass rounded-xl text-xs font-mono flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-status-pass" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Modal: New Campaign */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-twilight/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl border border-mist p-6 max-w-md w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-mist pb-3">
              <h3 className="font-serif text-xl text-ink font-normal">Create Campaign Brief</h3>
              <button onClick={() => setIsCreating(false)} className="text-ash hover:text-ink text-sm">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-mono text-ash mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EcoSip Summer Refresh"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-linen border-b border-mist px-3 py-2 text-[14px] text-ink outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-mono text-ash mb-1">Target Product</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EcoSip 750ml Vacuum Bottle"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  className="w-full bg-linen border-b border-mist px-3 py-2 text-[14px] text-ink outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-mono text-ash mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. EcoSip Living"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full bg-linen border-b border-mist px-3 py-2 text-[14px] text-ink outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg border border-mist text-charcoal text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg border border-signal-blue text-signal-blue hover:bg-signal-blue/5 text-[13px] font-medium"
                >
                  Create & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid: Campaign List & Console Details */}
      {loading ? (
        <div className="py-20 text-center font-mono text-[13px] text-ash animate-pulse">
          Loading campaign truth protocols...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Campaign Selector Pills if multiple */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-ash mr-1">Select Campaign:</span>
            {campaigns.map((camp) => (
              <button
                key={camp.id}
                onClick={() => setSelectedCampaign(camp)}
                className={`px-3 py-1.5 rounded-pill text-[13px] font-medium transition-all border ${
                  selectedCampaign?.id === camp.id
                    ? "bg-twilight text-paper border-twilight shadow-sm"
                    : "bg-paper text-charcoal border-mist hover:border-twilight/50"
                }`}
              >
                {camp.title}
              </button>
            ))}
          </div>

          {selectedCampaign && (() => {
            const latestPack = selectedCampaign.packs?.[0];
            const activeContract = selectedCampaign.contracts?.find((c: any) => c.isActive) || selectedCampaign.contracts?.[0];
            const totalFindings = latestPack?.findings?.length || 0;
            const pendingCount = latestPack?.findings?.filter((f: any) => f.resolution === "PENDING").length || 0;
            const isApproved = selectedCampaign.status === "APPROVED";
            const isInvalidated = selectedCampaign.status === "INVALIDATED";
            const isClean = totalFindings > 0 && pendingCount === 0;

            const pipelineSteps = [
              {
                id: "contract",
                stepNum: "1",
                title: "Truth Contract",
                owner: "Brand Lead",
                badge: `v${activeContract?.version || 1}`,
                badgeColor: "bg-linen text-charcoal",
                isCurrent: activeTab === "contract",
              },
              {
                id: "creator",
                stepNum: "2",
                title: "Creative Studio",
                owner: "Creator",
                badge: latestPack ? `Rev ${latestPack.revision}` : "Pending",
                badgeColor: latestPack ? "bg-signal-blue/15 text-signal-blue" : "bg-linen text-ash",
                isCurrent: activeTab === "creator",
              },
              {
                id: "findings",
                stepNum: "3",
                title: "Preflight Scan",
                owner: "Automated 4-Layer",
                badge: pendingCount > 0 ? `${pendingCount} Issues` : isClean ? "Reconciled" : "Verified",
                badgeColor: pendingCount > 0 ? "bg-status-error-bg text-status-error" : "bg-status-pass-bg text-status-pass",
                isCurrent: activeTab === "findings",
              },
              {
                id: "approval",
                stepNum: "4",
                title: "Gatekeeper Lock",
                owner: "Reviewer",
                badge: isApproved ? "Locked" : isInvalidated ? "Revoked" : "Pending",
                badgeColor: isApproved ? "bg-status-pass-bg text-status-pass" : isInvalidated ? "bg-status-error-bg text-status-error" : "bg-linen text-ash",
                isCurrent: activeTab === "approval",
              },
            ];

            return (
              <div className="space-y-6">
                {/* Campaign Header Details */}
                <div className="p-5 sm:p-6 bg-paper rounded-2xl border border-mist flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-subtle-card">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
                        {selectedCampaign.brand}
                      </span>
                      <span className="text-mist">•</span>
                      <span className="text-[11px] font-mono text-charcoal">
                        Contract v{activeContract?.version || 1} ({activeContract?.offerPercent}% off)
                      </span>
                      <span className="text-mist">•</span>
                      <span className="text-[11px] font-mono text-charcoal">
                        Asset Rev {latestPack?.revision || 1}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">{selectedCampaign.title}</h2>
                    <p className="text-[13px] text-charcoal font-sans mt-0.5">
                      Product Focus: <strong className="text-ink">{selectedCampaign.product}</strong>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <StatusBadge status={selectedCampaign.status} />
                  </div>
                </div>

                {/* 1. VISUAL 4-STAGE LIFECYCLE STEPPER (Makes workflow immediately obvious) */}
                <div className="bg-linen/70 p-3 sm:p-4 rounded-2xl border border-mist space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-ash font-semibold flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-signal-blue" />
                      Campaign Governance Lifecycle
                    </span>
                    <span className="text-[10px] font-mono text-ash hidden sm:inline">
                      Click any step to inspect or edit
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    {pipelineSteps.map((step) => (
                      <button
                        key={step.id}
                        onClick={() => {
                          setActiveTab(step.id as any);
                          if (step.id === "contract") setRole("BRAND_MANAGER");
                          else if (step.id === "creator") setRole("CREATOR");
                          else if (step.id === "approval") setRole("REVIEWER");
                        }}
                        className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 ${
                          step.isCurrent
                            ? "bg-paper border-twilight shadow-sm ring-2 ring-twilight/20"
                            : "bg-paper/70 border-mist hover:border-twilight/40 hover:bg-paper"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="w-5 h-5 rounded-full bg-twilight text-paper text-[10px] font-mono font-semibold flex items-center justify-center">
                            {step.stepNum}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-pill font-medium ${step.badgeColor}`}>
                            {step.badge}
                          </span>
                        </div>
                        <div>
                          <p className="font-serif text-sm text-ink font-medium leading-tight">
                            {step.title}
                          </p>
                          <p className="text-[10px] font-mono text-ash mt-0.5">
                            {step.owner}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. SMART RECOMMENDED NEXT ACTION CARD (Eliminates confusion on what to do) */}
                <div className="p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm bg-paper flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* State A: Contradictions pending */}
                  {pendingCount > 0 && !isApproved && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-status-error-bg flex items-center justify-center shrink-0 mt-0.5 border border-status-error-border">
                          <AlertTriangle className="w-5 h-5 text-status-error" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-pill bg-status-error-bg text-status-error font-semibold">
                              Action Required • Step 3
                            </span>
                            <span className="text-xs font-mono text-ash">
                              {pendingCount} contradictions detected
                            </span>
                          </div>
                          <h3 className="font-serif text-lg text-ink font-normal mt-0.5">
                            Reconcile Creative Copy with Contract Truth
                          </h3>
                          <p className="text-xs text-charcoal font-sans mt-0.5 leading-relaxed max-w-xl">
                            The submitted creative pack contains claims (e.g. 24-hr cold retention, 30% discount, or "Miracle") that contradict Contract v{activeContract?.version || 1}. Accept the suggested fixes to harmonize the campaign.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                        <button
                          onClick={handleQuickAcceptAll}
                          disabled={loading}
                          className="px-4 py-2.5 rounded-xl bg-signal-blue hover:bg-cerulean text-paper font-medium text-xs font-mono shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <Zap className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                          <span>1-Click Accept All Fixes</span>
                        </button>
                        <button
                          onClick={() => setActiveTab("findings")}
                          className="px-3.5 py-2.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal text-xs font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                        >
                          <span>Review Issues</span>
                          <ArrowRight className="w-3.5 h-3.5 text-ash" />
                        </button>
                      </div>
                    </>
                  )}

                  {/* State B: Clean & ready for gatekeeper lock */}
                  {isClean && !isApproved && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-status-pass-bg flex items-center justify-center shrink-0 mt-0.5 border border-status-pass-border">
                          <CheckCircle2 className="w-5 h-5 text-status-pass" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-pill bg-status-pass-bg text-status-pass font-semibold">
                              Ready for Sign-Off • Step 4
                            </span>
                            <span className="text-xs font-mono text-ash">All checks harmonized</span>
                          </div>
                          <h3 className="font-serif text-lg text-ink font-normal mt-0.5">
                            All Inconsistencies Resolved — Ready for Gatekeeper Lock
                          </h3>
                          <p className="text-xs text-charcoal font-sans mt-0.5 leading-relaxed max-w-xl">
                            All preflight findings have been reconciled with Contract v{activeContract?.version || 1}. Marcus Vance (Authorised Reviewer) can now bind the cryptographic SHA-256 seal.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                        <button
                          onClick={handleQuickLock}
                          disabled={loading}
                          className="px-4 py-2.5 rounded-xl bg-twilight hover:bg-ink text-paper font-medium text-xs font-mono shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <Lock className="w-3.5 h-3.5 text-signal-blue" />
                          <span>Switch to Reviewer & Execute Lock →</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* State C: Cryptographically Approved */}
                  {isApproved && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-status-pass-bg flex items-center justify-center shrink-0 mt-0.5 border border-status-pass-border">
                          <Lock className="w-5 h-5 text-status-pass" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-pill bg-status-pass-bg text-status-pass font-semibold">
                              Cryptographically Sealed
                            </span>
                            <span className="text-xs font-mono text-ash">
                              SHA256: [{latestPack?.packHash ? latestPack.packHash.slice(0, 8) : "none"}]
                            </span>
                          </div>
                          <h3 className="font-serif text-lg text-ink font-normal mt-0.5">
                            Campaign is Approved & Version-Locked
                          </h3>
                          <p className="text-xs text-charcoal font-sans mt-0.5 leading-relaxed max-w-xl">
                            The asset pack is cryptographically bound to Contract v{activeContract?.version || 1}. Any subsequent modification to copy or rules will instantly revoke this approval.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                        <button
                          onClick={handleQuickSimulateTamper}
                          disabled={loading}
                          className="px-3.5 py-2.5 rounded-xl border border-status-error text-status-error hover:bg-status-error-bg font-medium text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                          title="Simulate an out-of-band edit to test the instant invalidation protocol"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>⚡ Simulate Asset Tamper (Test Invalidation)</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* State D: Approval Invalidated */}
                  {isInvalidated && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-status-error-bg flex items-center justify-center shrink-0 mt-0.5 border border-status-error-border">
                          <AlertTriangle className="w-5 h-5 text-status-error" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-pill bg-status-error-bg text-status-error font-semibold">
                              Approval Revoked • Signature Invalidation
                            </span>
                          </div>
                          <h3 className="font-serif text-lg text-ink font-normal mt-0.5">
                            Post-Approval Modification Detected
                          </h3>
                          <p className="text-xs text-charcoal font-sans mt-0.5 leading-relaxed max-w-xl">
                            A creator modified copy or a brand lead changed contract rules after approval. CampaignGuard immediately invalidated the lock to prevent non-compliant distribution.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                        <button
                          onClick={() => setActiveTab("findings")}
                          className="px-4 py-2.5 rounded-xl bg-status-error text-paper hover:opacity-90 font-medium text-xs font-mono shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>Review Inconsistencies & Re-Approve →</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* 3. CHRONOLOGICALLY ORDERED TABS WITH STEP NUMBERS & PERSONA ROLES */}
                <div className="flex border-b border-mist overflow-x-auto gap-2">
                  <button
                    onClick={() => setActiveTab("contract")}
                    className={`pb-3 px-3 text-[13px] sm:text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                      activeTab === "contract"
                        ? "border-twilight text-ink font-semibold"
                        : "border-transparent text-charcoal hover:text-ink"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-charcoal" />
                    <span>1. Contract Truth</span>
                    <span className="text-[10px] font-mono text-ash font-normal hidden sm:inline">
                      (Brand Lead)
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("creator")}
                    className={`pb-3 px-3 text-[13px] sm:text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                      activeTab === "creator"
                        ? "border-twilight text-ink font-semibold"
                        : "border-transparent text-charcoal hover:text-ink"
                    }`}
                  >
                    <FileEdit className="w-4 h-4 text-charcoal" />
                    <span>2. Creative Studio</span>
                    <span className="text-[10px] font-mono text-ash font-normal hidden sm:inline">
                      (Creator)
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("findings")}
                    className={`pb-3 px-3 text-[13px] sm:text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                      activeTab === "findings"
                        ? "border-twilight text-ink font-semibold"
                        : "border-transparent text-charcoal hover:text-ink"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-signal-blue" />
                    <span>3. Preflight Scan</span>
                    {totalFindings > 0 && (
                      pendingCount > 0 ? (
                        <span className="text-[11px] font-mono px-2 py-0.2 rounded-pill bg-status-error-bg text-status-error font-semibold">
                          {pendingCount} Flagged
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono px-2 py-0.2 rounded-pill bg-status-pass-bg text-status-pass font-semibold">
                          ✓ Reconciled
                        </span>
                      )
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("approval")}
                    className={`pb-3 px-3 text-[13px] sm:text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                      activeTab === "approval"
                        ? "border-twilight text-ink font-semibold"
                        : "border-transparent text-charcoal hover:text-ink"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-signal-blue" />
                    <span>4. Review & Lock</span>
                    <span className="text-[10px] font-mono text-ash font-normal hidden sm:inline">
                      (Gatekeeper)
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("audit")}
                    className={`pb-3 px-3 text-[13px] sm:text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                      activeTab === "audit"
                        ? "border-twilight text-ink font-semibold"
                        : "border-transparent text-charcoal hover:text-ink"
                    }`}
                  >
                    <History className="w-4 h-4 text-ash" />
                    <span>5. Audit Trail</span>
                  </button>
                </div>

                {/* 4. Tab Context Helper (Explains who owns this screen) */}
                <div className="px-1 text-[11px] font-mono text-ash flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-signal-blue shrink-0" />
                  {activeTab === "contract" && (
                    <span>Step 1: Canonical Truth Rules set by Brand Lead (Priya Sharma). Changes establish a new version.</span>
                  )}
                  {activeTab === "creator" && (
                    <span>Step 2: Submission Studio used by Creator (Alex Chen) to upload visual and copy assets.</span>
                  )}
                  {activeTab === "findings" && (
                    <span>Step 3: Automated 4-Layer Inspection comparing creative assets against contract rules.</span>
                  )}
                  {activeTab === "approval" && (
                    <span>Step 4: Gatekeeper Terminal used by Authorised Reviewer (Marcus Vance) to execute cryptographic locking.</span>
                  )}
                  {activeTab === "audit" && (
                    <span>Step 5: Immutable, chronological ledger of all contracts, pack uploads, and approvals.</span>
                  )}
                </div>

                {/* Tab Contents */}
                <div className="pt-1">
                  {activeTab === "contract" && (
                    <ContractBuilder campaign={selectedCampaign} onSaved={fetchCampaigns} />
                  )}

                  {activeTab === "creator" && (
                    <PackUploader 
                      campaign={selectedCampaign} 
                      onInspectionComplete={fetchCampaigns} 
                      onViewFindings={() => setActiveTab("findings")} 
                    />
                  )}

                  {activeTab === "findings" && (
                    <FindingsReport 
                      campaign={selectedCampaign} 
                      onRefresh={fetchCampaigns} 
                      onGoToApproval={() => setActiveTab("approval")}
                    />
                  )}

                  {activeTab === "approval" && (
                    <ApprovalPanel campaign={selectedCampaign} onApproved={fetchCampaigns} />
                  )}

                  {activeTab === "audit" && (
                    <AuditTimeline logs={selectedCampaign.auditLogs || []} />
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}