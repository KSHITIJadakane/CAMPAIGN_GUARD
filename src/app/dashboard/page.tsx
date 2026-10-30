"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  ArrowLeft,
  Lock, 
  AlertTriangle, 
  Zap, 
  Info, 
  Check, 
  RotateCcw, 
  Compass, 
  Upload,
  ArrowUpRight,
  FolderOpen,
  LayoutGrid,
  UserPlus,
  BarChart3,
  Users
} from "lucide-react";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { ContractBuilder } from "@/components/contract/ContractBuilder";
import { PackUploader } from "@/components/campaign/PackUploader";
import { FindingsReport } from "@/components/findings/FindingsReport";
import { ApprovalPanel } from "@/components/approval/ApprovalPanel";
import { AuditTimeline } from "@/components/campaign/AuditTimeline";
import { TeamInviteModal } from "@/components/campaign/TeamInviteModal";
import { GovernanceAnalyticsView } from "@/components/analytics/GovernanceAnalyticsView";
import { useRole } from "@/components/layout/RoleContext";
import { StatusBadge } from "@/components/campaign/StatusBadge";
import { Role } from "@/types";

type WorkspaceTab = "contract" | "creator" | "findings" | "approval" | "audit";

const TAB_CONFIG: { id: WorkspaceTab; stepNum: string; title: string; owner: string }[] = [
  { id: "contract", stepNum: "1", title: "Truth Contract", owner: "Brand Lead" },
  { id: "creator", stepNum: "2", title: "Creative Studio", owner: "Creator" },
  { id: "findings", stepNum: "3", title: "Preflight Scan", owner: "Automated AI" },
  { id: "approval", stepNum: "4", title: "Gatekeeper Lock", owner: "Reviewer" },
  { id: "audit", stepNum: "5", title: "Audit Trail", owner: "System Ledger" },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentRole, currentUser, setRole } = useRole();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New campaign modal state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newBrand, setNewBrand] = useState("");

  const campaignParam = searchParams.get("campaign") || searchParams.get("campaignId");
  const tabParam = (searchParams.get("tab") as WorkspaceTab) || "contract";
  const viewParam = searchParams.get("view");

  const [hubView, setHubView] = useState<"CAMPAIGNS" | "ANALYTICS">(
    viewParam === "analytics" ? "ANALYTICS" : "CAMPAIGNS"
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (viewParam === "analytics") {
      setHubView("ANALYTICS");
    } else if (!viewParam && !campaignParam) {
      setHubView("CAMPAIGNS");
    }
  }, [viewParam, campaignParam]);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (data.success && data.campaigns) {
        setCampaigns(data.campaigns);
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

  const selectedCampaign = campaigns.find((c) => c.id === campaignParam) || null;
  const activeTab: WorkspaceTab = tabParam;

  const navigateToCampaign = (campId: string, tab?: WorkspaceTab) => {
    const targetTab = tab || (campaigns.find(c => c.id === campId)?.packs?.[0] ? "findings" : "contract");
    router.push(`/dashboard?campaign=${encodeURIComponent(campId)}&tab=${targetTab}`);
  };

  const navigateToTab = (tab: WorkspaceTab) => {
    if (!selectedCampaign) return;
    router.push(`/dashboard?campaign=${encodeURIComponent(selectedCampaign.id)}&tab=${tab}`);
  };

  const navigateBackToHub = () => {
    router.push("/dashboard");
  };

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
        navigateToCampaign(data.campaign.id, "contract");
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
        navigateToTab("approval");
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
        navigateToTab("approval");
        setActionNotice("🚨 Invalidation triggered! Cryptographic lock instantly revoked.");
        setTimeout(() => setActionNotice(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDemo = async () => {
    setLoading(true);
    setActionNotice("Resetting EcoSip demo benchmark to initial pre-seeded state...");
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchCampaigns();
        navigateToCampaign("camp_ecosip_01", "findings");
        setRole("BRAND_MANAGER");
        setActionNotice("✓ EcoSip demo benchmark restored with initial preflight contradictions.");
        setTimeout(() => setActionNotice(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Group campaigns into Live vs Demo
  const demoCampaigns = campaigns.filter((c) => c.id === "camp_ecosip_01" || c.title.includes("EcoSip"));
  const liveCampaigns = campaigns.filter((c) => c.id !== "camp_ecosip_01" && !c.title.includes("EcoSip"));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Floating Action Notice Banner */}
      {actionNotice && (
        <div className="p-3 bg-status-pass-bg border border-status-pass-border text-status-pass rounded-xl text-xs font-mono flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-status-pass" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Modal: New Campaign */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-twilight/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
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
                  placeholder="e.g. Summer Hydration Launch"
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
                  placeholder="e.g. 750ml Vacuum Flask"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  className="w-full bg-linen border-b border-mist px-3 py-2 text-[14px] text-ink outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-mono text-ash mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. AquaPure Living"
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
                  Create & Open Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guide Card (30-Sec Guide) */}
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
            <div className="p-3.5 rounded-xl bg-linen border border-mist space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-twilight">STEP 1 • Set Truth</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-paper border border-mist">Brand Lead</span>
              </div>
              <p className="text-charcoal leading-relaxed">
                Brand managers set canonical truth parameters in the <strong>Truth Contract</strong> (discounts, valid dates, required legal disclaimers, and prohibited superlatives).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-linen border border-mist space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-signal-blue">STEP 2 • Preflight Audit</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-paper border border-mist">Automated AI</span>
              </div>
              <p className="text-charcoal leading-relaxed">
                Creators submit copy and banners in <strong>Creative Studio</strong>. The automated 4-layer scanner checks facts, cross-asset alignment, brand rules, and accessibility.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-linen border border-mist space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-status-pass">STEP 3 • Lock & Guard</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-paper border border-mist">Reviewer</span>
              </div>
              <p className="text-charcoal leading-relaxed">
                Once contradictions are resolved, an Authorised Reviewer signs off and freezes the pack with a <strong>SHA-256 seal</strong>. Any subsequent edit immediately revokes the lock.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW A: CAMPAIGN HUB (When no campaign is selected)                     */}
      {/* ========================================================================= */}
      {!selectedCampaign && (
        <div className="space-y-8 animate-fade-in">
          {/* Hub View Switcher (Round 3 Feature 3: Cross-Campaign Governance Analytics) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-mist/80 pb-4">
            <div className="flex items-center gap-2 p-1 bg-paper border border-mist rounded-2xl shadow-xs">
              <button
                onClick={() => {
                  setHubView("CAMPAIGNS");
                  router.push("/dashboard");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  hubView === "CAMPAIGNS"
                    ? "bg-twilight text-paper shadow-sm"
                    : "text-charcoal hover:text-ink hover:bg-linen"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Campaigns Directory</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  hubView === "CAMPAIGNS" ? "bg-white/20 text-paper" : "bg-linen text-ash"
                }`}>
                  {campaigns.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setHubView("ANALYTICS");
                  router.push("/dashboard?view=analytics");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  hubView === "ANALYTICS"
                    ? "bg-twilight text-paper shadow-sm"
                    : "text-charcoal hover:text-ink hover:bg-linen"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-signal-blue" />
                <span>Governance Analytics</span>
                <span className="px-1.5 py-0.5 rounded-full bg-signal-blue/20 text-signal-blue text-[10px] font-bold">
                  NEW (R3)
                </span>
              </button>
            </div>

            <div className="text-xs font-mono text-ash flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-pass" />
              <span>{hubView === "CAMPAIGNS" ? "Live Workspace Directory" : "Live Cross-Campaign Compliance Ledger"}</span>
            </div>
          </div>

          {/* Conditional Sub-View: ANALYTICS vs CAMPAIGNS DIRECTORY */}
          {hubView === "ANALYTICS" ? (
            <GovernanceAnalyticsView onSelectCampaign={(id) => navigateToCampaign(id)} />
          ) : (
            <>
              {/* Hub Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-mist pb-6">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
                  Campaign Governance
                </span>
                <span className="text-mist">•</span>
                <span className="text-[11px] font-mono text-signal-blue font-semibold">
                  Hub Directory
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">Campaigns Hub</h1>
              <p className="text-[13px] sm:text-[14px] text-charcoal font-sans mt-0.5">
                Select an active campaign to enter its dedicated workspace, or explore the pre-configured benchmark scenario.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  showGuide ? "bg-twilight text-paper border-twilight" : "bg-paper hover:bg-linen border-mist text-charcoal"
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-signal-blue" />
                <span>{showGuide ? "Hide Guide" : "💡 How It Works"}</span>
              </button>

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
                <span>New Campaign</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-paper rounded-2xl border border-mist">
              <span className="text-[11px] font-mono uppercase text-ash block">Total Campaigns</span>
              <span className="font-serif text-2xl text-ink font-normal">{campaigns.length}</span>
            </div>
            <div className="p-4 bg-paper rounded-2xl border border-mist">
              <span className="text-[11px] font-mono uppercase text-ash block">Active Truth Rules</span>
              <span className="font-serif text-2xl text-signal-blue font-normal">
                {campaigns.reduce((acc, c) => acc + (c.contracts?.length || 1), 0)}
              </span>
            </div>
            <div className="p-4 bg-paper rounded-2xl border border-mist">
              <span className="text-[11px] font-mono uppercase text-ash block">Packs Under Audit</span>
              <span className="font-serif text-2xl text-status-warn font-normal">
                {campaigns.filter((c) => c.status === "NEEDS_REVIEW" || c.status === "DRAFT").length}
              </span>
            </div>
            <div className="p-4 bg-paper rounded-2xl border border-mist">
              <span className="text-[11px] font-mono uppercase text-ash block">Cryptographically Sealed</span>
              <span className="font-serif text-2xl text-status-pass font-normal">
                {campaigns.filter((c) => c.status === "APPROVED").length}
              </span>
            </div>
          </div>

          {/* SECTION 1: LIVE USER CAMPAIGNS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-status-pass" />
                <h2 className="font-serif text-xl text-ink font-normal">Live Campaigns (Your Work)</h2>
                <span className="text-xs font-mono text-ash px-2 py-0.5 rounded-pill bg-linen border border-mist">
                  {liveCampaigns.length} Active
                </span>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="text-xs font-mono text-signal-blue hover:text-twilight font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Campaign</span>
              </button>
            </div>

            {liveCampaigns.length === 0 ? (
              <div className="p-8 text-center bg-paper rounded-2xl border border-dashed border-mist text-ash space-y-3">
                <FolderOpen className="w-8 h-8 text-charcoal mx-auto" />
                <div>
                  <h3 className="font-serif text-lg text-ink font-normal">No live campaigns created yet</h3>
                  <p className="text-xs text-charcoal font-sans mt-0.5 max-w-sm mx-auto">
                    Create a fresh campaign brief to establish your own contract truth parameters, or explore the pre-seeded benchmark below.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 rounded-xl bg-twilight hover:bg-ink text-paper text-xs font-mono font-medium transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-signal-blue" />
                  <span>Create First Live Campaign</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveCampaigns.map((camp) => (
                  <CampaignCard
                    key={camp.id}
                    campaign={camp}
                    onSelect={(c) => navigateToCampaign(c.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: PRE-SEEDED BENCHMARK DEMO SCENARIO */}
          <div className="space-y-4 pt-4 border-t border-mist/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-signal-blue" />
              <h2 className="font-serif text-xl text-ink font-normal">Interactive Demo Benchmark</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-signal-blue/15 text-signal-blue font-bold border border-signal-blue/30">
                SAMPLE WALKTHROUGH
              </span>
            </div>

            {demoCampaigns.map((demo) => (
              <div 
                key={demo.id}
                className="p-6 bg-paper rounded-2xl border border-signal-blue/40 shadow-subtle-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-signal-blue transition-all"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
                      {demo.brand}
                    </span>
                    <span className="text-mist">•</span>
                    <span className="text-[11px] font-mono text-signal-blue font-semibold">
                      Pre-Seeded with 3 Contradictions
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-ink font-normal">{demo.title}</h3>
                  <p className="text-[13px] text-charcoal font-sans leading-relaxed">
                    A test case created specifically for evaluation. Includes an intentional <strong>30% vs 20% discount mismatch</strong>, <strong>24h vs 12h cold retention claim</strong>, and the forbidden superlative <strong>"Miracle"</strong>. Test AI detection, 1-click auto-fixes, and cryptographic sealing without uploading any files.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigateToCampaign(demo.id, "findings")}
                    className="px-5 py-3 rounded-xl bg-signal-blue hover:bg-cerulean text-paper font-medium text-xs font-mono shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Enter Demo Scenario →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: DEDICATED CAMPAIGN WORKSPACE (When a campaign is selected)       */}
      {/* ========================================================================= */}
      {selectedCampaign && (() => {
        const latestPack = selectedCampaign.packs?.[0];
        const activeContract = selectedCampaign.contracts?.find((c: any) => c.isActive) || selectedCampaign.contracts?.[0];
        const totalFindings = latestPack?.findings?.length || 0;
        const pendingCount = latestPack?.findings?.filter((f: any) => f.resolution === "PENDING").length || 0;
        const isApproved = selectedCampaign.status === "APPROVED";
        const isInvalidated = selectedCampaign.status === "INVALIDATED";
        const isClean = totalFindings > 0 && pendingCount === 0;
        const isDemo = selectedCampaign.id === "camp_ecosip_01" || selectedCampaign.title.includes("EcoSip");

        const pipelineSteps = [
          {
            id: "contract" as WorkspaceTab,
            stepNum: "1",
            title: "Truth Contract",
            owner: "Brand Lead",
            badge: `v${activeContract?.version || 1}`,
            badgeColor: "bg-linen text-charcoal",
            isCurrent: activeTab === "contract",
          },
          {
            id: "creator" as WorkspaceTab,
            stepNum: "2",
            title: "Creative Studio",
            owner: "Creator",
            badge: latestPack ? `Rev ${latestPack.revision}` : "Awaiting Upload",
            badgeColor: latestPack ? "bg-signal-blue/15 text-signal-blue" : "bg-linen text-ash",
            isCurrent: activeTab === "creator",
          },
          {
            id: "findings" as WorkspaceTab,
            stepNum: "3",
            title: "Preflight Scan",
            owner: "Automated 4-Layer",
            badge: !latestPack ? "Pending Upload" : pendingCount > 0 ? `${pendingCount} Issues` : isClean ? "Reconciled" : "Verified",
            badgeColor: !latestPack ? "bg-linen text-ash" : pendingCount > 0 ? "bg-status-error-bg text-status-error" : "bg-status-pass-bg text-status-pass",
            isCurrent: activeTab === "findings",
          },
          {
            id: "approval" as WorkspaceTab,
            stepNum: "4",
            title: "Gatekeeper Lock",
            owner: "Reviewer",
            badge: !latestPack ? "Pending" : isApproved ? "Locked" : isInvalidated ? "Revoked" : "Pending",
            badgeColor: isApproved ? "bg-status-pass-bg text-status-pass" : isInvalidated ? "bg-status-error-bg text-status-error" : "bg-linen text-ash",
            isCurrent: activeTab === "approval",
          },
          {
            id: "audit" as WorkspaceTab,
            stepNum: "5",
            title: "Audit Trail",
            owner: "System Ledger",
            badge: `${selectedCampaign.auditLogs?.length || 0} Events`,
            badgeColor: "bg-linen text-charcoal",
            isCurrent: activeTab === "audit",
          },
        ];

        // Current step index
        const currentStepIndex = pipelineSteps.findIndex(s => s.id === activeTab);
        const prevStep = currentStepIndex > 0 ? pipelineSteps[currentStepIndex - 1] : null;
        const nextStep = currentStepIndex < pipelineSteps.length - 1 ? pipelineSteps[currentStepIndex + 1] : null;

        return (
          <div className="space-y-6 animate-fade-in">
            {/* Top Navigation & Breadcrumbs Bar with CLEAR BACK BUTTON */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mist pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={navigateBackToHub}
                  className="px-3.5 py-1.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  title="Return to Campaigns Hub"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-ash" />
                  <span>← Back to Campaigns Hub</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-ash">
                  <span>/</span>
                  <span className="text-ink font-semibold truncate max-w-[200px]">
                    {selectedCampaign.title}
                  </span>
                  <span>/</span>
                  <span className="text-signal-blue font-medium">
                    {pipelineSteps.find(s => s.id === activeTab)?.title}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Round 3 Feature 1: Team & Invites Button */}
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  title="Manage Campaign Members & Invites"
                >
                  <UserPlus className="w-3.5 h-3.5 text-signal-blue" />
                  <span>Team & Invites</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-signal-blue/15 text-signal-blue text-[10px] font-bold">
                    {(selectedCampaign.members?.length || 0) + (selectedCampaign.invites?.filter((i: any) => i.status === "PENDING").length || 0)}
                  </span>
                </button>

                {/* Persona Switcher */}
                <div className="flex items-center gap-1 p-1 bg-paper border border-mist rounded-xl text-xs font-mono shadow-xs">
                  <span className="text-ash px-2 hidden lg:inline">Persona:</span>
                  {(["BRAND_MANAGER", "CREATOR", "REVIEWER"] as Role[]).map((r) => {
                    const isActive = currentRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r);
                          if (r === "CREATOR") navigateToTab("creator");
                          else if (r === "REVIEWER") navigateToTab("approval");
                          else navigateToTab("contract");
                        }}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium text-[11px] ${
                          isActive ? "bg-twilight text-paper shadow-sm" : "text-charcoal hover:text-ink hover:bg-linen"
                        }`}
                      >
                        {r === "BRAND_MANAGER" ? "Brand" : r === "CREATOR" ? "Creator" : "Reviewer"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Scoped Role Guidance Banners (Round 3 Feature 1) */}
            {currentRole === "CREATOR" && (
              <div className="p-3 bg-linen/90 border border-signal-blue/30 rounded-xl text-xs font-sans text-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-signal-blue shrink-0" />
                  <span>
                    <strong>Creator Scoped Workspace:</strong> Upload creative assets in <strong>Step 2 (Creative Studio)</strong> and resolve visual change orders in <strong>Step 3</strong>. (Truth Contract & Gatekeeper Lock are protected).
                  </span>
                </div>
                <button
                  onClick={() => navigateToTab("creator")}
                  className="text-signal-blue hover:text-twilight font-mono text-[11px] font-semibold underline shrink-0 cursor-pointer"
                >
                  Go to Creative Studio →
                </button>
              </div>
            )}

            {currentRole === "REVIEWER" && (
              <div className="p-3 bg-linen/90 border border-status-pass/40 rounded-xl text-xs font-sans text-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-pass shrink-0" />
                  <span>
                    <strong>Gatekeeper Scoped Workspace:</strong> Authorized to execute SHA-256 cryptographic signatures in <strong>Step 4 (Gatekeeper Lock)</strong> and inspect tamper logs in <strong>Step 5</strong>.
                  </span>
                </div>
                <button
                  onClick={() => navigateToTab("approval")}
                  className="text-status-pass hover:text-ink font-mono text-[11px] font-semibold underline shrink-0 cursor-pointer"
                >
                  Go to Gatekeeper Terminal →
                </button>
              </div>
            )}

            {/* Demo Benchmark Banner if active */}
            {isDemo && (
              <div className="p-4 bg-paper rounded-2xl border border-signal-blue/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-sans animate-fade-in">
                <div className="flex items-start md:items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-pill bg-signal-blue/15 text-signal-blue text-[11px] font-mono font-bold shrink-0 border border-signal-blue/30">
                    🧪 PRE-SEEDED DEMO BENCHMARK
                  </span>
                  <span className="text-charcoal leading-relaxed">
                    You are viewing the <strong>EcoSip Flash Sale</strong> benchmark scenario. It contains 3 pre-seeded contradictions so judges can test preflight detection, 1-click fixes, and SHA-256 sealing without uploading files.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleResetDemo}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal text-xs font-mono font-medium transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                    title="Reset benchmark scenario back to initial state with pre-seeded contradictions"
                  >
                    <RotateCcw className={`w-3 h-3 text-ash ${loading ? "animate-spin" : ""}`} />
                    <span>Reset Benchmark</span>
                  </button>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-3 py-1.5 rounded-xl bg-twilight hover:bg-ink text-paper text-xs font-mono font-medium transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-signal-blue" />
                    <span>Start Blank Live Campaign</span>
                  </button>
                </div>
              </div>
            )}

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
                    {latestPack ? `Asset Rev ${latestPack.revision}` : "No Assets Uploaded Yet"}
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

            {/* 1. VISUAL 5-STAGE LIFECYCLE STEPPER */}
            <div className="bg-linen/70 p-3 sm:p-4 rounded-2xl border border-mist space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-ash font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-signal-blue" />
                  Dedicated Workflow Stages
                </span>
                <span className="text-[10px] font-mono text-ash hidden sm:inline">
                  Click any stage to enter its dedicated page
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
                {pipelineSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      navigateToTab(step.id);
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

            {/* 2. DYNAMIC RECOMMENDED NEXT ACTION CARD */}
            <div className="p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm bg-paper flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* State 0: No assets uploaded yet */}
              {!latestPack && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-linen flex items-center justify-center shrink-0 mt-0.5 border border-mist">
                      <Upload className="w-5 h-5 text-signal-blue" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-pill bg-linen border border-mist text-charcoal font-semibold">
                          Next Step • Step 2
                        </span>
                        <span className="text-xs font-mono text-ash">
                          Awaiting Creative Submission
                        </span>
                      </div>
                      <h3 className="font-serif text-lg text-ink font-normal mt-0.5">
                        Upload Assets in Creative Studio to Begin Audit
                      </h3>
                      <p className="text-xs text-charcoal font-sans mt-0.5 leading-relaxed max-w-xl">
                        Baseline Contract v{activeContract?.version || 1} is established. No creative assets have been submitted for inspection yet. Upload your social copy, banner image, or spec sheet to execute the automated 4-layer preflight scan.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        navigateToTab("creator");
                        setRole("CREATOR");
                      }}
                      className="px-4 py-2.5 rounded-xl bg-signal-blue hover:bg-cerulean text-paper font-medium text-xs font-mono shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Go to Creative Studio (Step 2) →</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateToTab("contract");
                        setRole("BRAND_MANAGER");
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal text-xs font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>Review Contract Truth</span>
                    </button>
                  </div>
                </>
              )}

              {/* State D: Post-Approval Modification / Invalidation (Takes Priority) */}
              {latestPack && isInvalidated && (
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
                        {pendingCount > 0 ? (
                          <span className="text-xs font-mono text-status-error font-bold">
                            {pendingCount} new contradiction{pendingCount > 1 ? "s" : ""} introduced
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-status-pass font-bold">
                            All contradictions reconciled
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg text-ink font-normal mt-0.5">
                        {pendingCount > 0
                          ? "Post-Approval Asset Tamper Detected — Contradictions Introduced"
                          : "Contradictions Reconciled Post-Invalidation — Ready to Re-Lock"}
                      </h3>
                      <p className="text-xs text-charcoal font-sans mt-0.5 leading-relaxed max-w-xl">
                        {pendingCount > 0
                          ? `An out-of-band modification was detected post-approval. CampaignGuard revoked the cryptographic lock. Click below to 1-click auto-fix all contradictions, or review findings.`
                          : `All tampered copy claims have been reconciled with Contract v${activeContract?.version || 1}. Marcus Vance (Authorised Reviewer) can now re-execute the cryptographic lock.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    {pendingCount > 0 ? (
                      <>
                        <button
                          onClick={handleQuickAcceptAll}
                          disabled={loading}
                          className="px-4 py-2.5 rounded-xl bg-signal-blue hover:bg-cerulean text-paper font-medium text-xs font-mono shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                          title="1-Click Reconcile all pending contradictions with Contract truth"
                        >
                          <Zap className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                          <span>1-Click Auto-Fix & Reconcile</span>
                        </button>
                        <button
                          onClick={() => navigateToTab("findings")}
                          className="px-3.5 py-2.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal text-xs font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                        >
                          <span>Review Issues</span>
                          <ArrowRight className="w-3.5 h-3.5 text-ash" />
                        </button>
                        {isDemo && (
                          <button
                            onClick={handleResetDemo}
                            disabled={loading}
                            className="px-3 py-2.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal text-xs font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            title="Reset demo benchmark to pristine initial state"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-ash" />
                            <span>Reset Demo</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={handleQuickLock}
                        disabled={loading}
                        className="px-4 py-2.5 rounded-xl bg-twilight hover:bg-ink text-paper font-medium text-xs font-mono shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        <Lock className="w-3.5 h-3.5 text-signal-blue" />
                        <span>Switch to Reviewer & Re-Lock →</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* State C: Cryptographically Approved */}
              {latestPack && isApproved && (
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

              {/* State A: Contradictions pending (Baseline, not invalidated, not approved) */}
              {latestPack && !isInvalidated && !isApproved && pendingCount > 0 && (
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
                        The submitted creative pack contains claims that contradict Contract v{activeContract?.version || 1}. Accept the suggested fixes to harmonize the campaign.
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
                      onClick={() => navigateToTab("findings")}
                      className="px-3.5 py-2.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal text-xs font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>Review Issues</span>
                      <ArrowRight className="w-3.5 h-3.5 text-ash" />
                    </button>
                  </div>
                </>
              )}

              {/* State B: Clean & ready for gatekeeper lock (Baseline, not invalidated, not approved) */}
              {latestPack && !isInvalidated && !isApproved && isClean && (
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
            </div>

            {/* 3. DEDICATED STAGE VIEW (Clean, Spacious, Uncluttered) */}
            <div className="space-y-4">
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

              {/* Dedicated Content Box */}
              <div className="pt-1">
                {activeTab === "contract" && (
                  <ContractBuilder campaign={selectedCampaign} onSaved={fetchCampaigns} />
                )}

                {activeTab === "creator" && (
                  <PackUploader 
                    campaign={selectedCampaign} 
                    onInspectionComplete={fetchCampaigns} 
                    onViewFindings={() => navigateToTab("findings")} 
                  />
                )}

                {activeTab === "findings" && (
                  <FindingsReport 
                    campaign={selectedCampaign} 
                    onRefresh={fetchCampaigns} 
                    onGoToApproval={() => {
                      navigateToTab("approval");
                      setRole("REVIEWER");
                    }}
                    onGoToUpload={() => {
                      navigateToTab("creator");
                      setRole("CREATOR");
                    }}
                  />
                )}

                {activeTab === "approval" && (
                  <ApprovalPanel 
                    campaign={selectedCampaign} 
                    onApproved={fetchCampaigns}
                    onNavigateTab={navigateToTab}
                    onResetDemo={handleResetDemo}
                  />
                )}

                {activeTab === "audit" && (
                  <AuditTimeline logs={selectedCampaign.auditLogs || []} />
                )}
              </div>
            </div>

            {/* 4. BOTTOM STEP NAVIGATION BAR (Back & Forward Option) */}
            <div className="pt-6 border-t border-mist/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div>
                {prevStep ? (
                  <button
                    onClick={() => {
                      navigateToTab(prevStep.id);
                      if (prevStep.id === "contract") setRole("BRAND_MANAGER");
                      else if (prevStep.id === "creator") setRole("CREATOR");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Step {prevStep.stepNum}: {prevStep.title}</span>
                  </button>
                ) : (
                  <button
                    onClick={navigateBackToHub}
                    className="px-4 py-2.5 rounded-xl border border-mist bg-paper hover:bg-linen text-charcoal font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>← Return to Campaigns Hub</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={navigateBackToHub}
                  className="text-ash hover:text-ink underline cursor-pointer text-[11px]"
                >
                  All Campaigns
                </button>

                {nextStep && (
                  <button
                    onClick={() => {
                      navigateToTab(nextStep.id);
                      if (nextStep.id === "creator") setRole("CREATOR");
                      else if (nextStep.id === "approval") setRole("REVIEWER");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-twilight hover:bg-ink text-paper font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>Proceed to Step {nextStep.stepNum}: {nextStep.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-signal-blue" />
                  </button>
                )}
              </div>
            </div>

            {/* Team Invite & RBAC Modal (Round 3 Feature 1) */}
            <TeamInviteModal
              campaignId={selectedCampaign.id}
              campaignTitle={selectedCampaign.title}
              members={selectedCampaign.members || []}
              invites={selectedCampaign.invites || []}
              isOpen={isInviteModalOpen}
              onClose={() => setIsInviteModalOpen(false)}
              onRefresh={fetchCampaigns}
            />
          </div>
        );
      })()}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center font-mono text-[13px] text-ash animate-pulse">
        Loading campaign workspace protocols...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}