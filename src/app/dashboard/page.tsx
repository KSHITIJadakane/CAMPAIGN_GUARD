"use client";

import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, Layers, ShieldCheck, FileEdit, CheckCircle2, History, AlertCircle, Sparkles } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"findings" | "creator" | "contract" | "approval" | "audit">("findings");
  const [loading, setLoading] = useState(true);

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
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-mist pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
            Preflight Review Console
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">Campaign Workspace</h1>
          <p className="text-[14px] text-charcoal font-sans mt-0.5">
            Active session: <strong className="text-ink">{currentUser.name}</strong> ({currentUser.title})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Persona Switcher */}
          <div className="flex items-center gap-1 p-1 bg-paper border border-mist rounded-xl text-xs font-mono shadow-xs">
            <span className="text-ash px-2 hidden lg:inline">Role:</span>
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

          {selectedCampaign && (
            <div className="space-y-6">
              {/* Campaign Header Details */}
              <div className="p-6 bg-paper rounded-2xl border border-mist flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-subtle-card">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
                      {selectedCampaign.brand}
                    </span>
                    <span className="text-mist">•</span>
                    <span className="text-[11px] font-mono text-charcoal">
                      Contract v{selectedCampaign.contracts?.[0]?.version || 1}
                    </span>
                    <span className="text-mist">•</span>
                    <span className="text-[11px] font-mono text-charcoal">
                      Rev {selectedCampaign.packs?.[0]?.revision || 1}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl text-ink font-normal">{selectedCampaign.title}</h2>
                  <p className="text-[13px] text-charcoal font-sans mt-0.5">
                    Product Focus: <strong className="text-ink">{selectedCampaign.product}</strong>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <StatusBadge status={selectedCampaign.status} />
                </div>
              </div>

              {/* Navigation Tabs for Active Campaign */}
              {(() => {
                const latestPack = selectedCampaign.packs?.[0];
                const totalFindings = latestPack?.findings?.length || 0;
                const pendingCount = latestPack?.findings?.filter((f: any) => f.resolution === "PENDING").length || 0;

                return (
                  <div className="flex border-b border-mist overflow-x-auto gap-2">
                    <button
                      onClick={() => setActiveTab("findings")}
                      className={`pb-3 px-3 text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                        activeTab === "findings"
                          ? "border-twilight text-ink font-semibold"
                          : "border-transparent text-charcoal hover:text-ink"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-signal-blue" />
                      Preflight Inspection Findings
                      {totalFindings > 0 && (
                        pendingCount > 0 ? (
                          <span className="text-[11px] font-mono px-2 py-0.2 rounded-pill bg-status-error-bg text-status-error font-semibold">
                            {pendingCount}
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono px-2 py-0.2 rounded-pill bg-status-pass-bg text-status-pass font-semibold">
                            ✓ Reconciled
                          </span>
                        )
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab("creator")}
                      className={`pb-3 px-3 text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                        activeTab === "creator"
                          ? "border-twilight text-ink font-semibold"
                          : "border-transparent text-charcoal hover:text-ink"
                      }`}
                    >
                      <FileEdit className="w-4 h-4 text-charcoal" />
                      Creator Pack Uploader
                    </button>

                    <button
                      onClick={() => setActiveTab("contract")}
                      className={`pb-3 px-3 text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                        activeTab === "contract"
                          ? "border-twilight text-ink font-semibold"
                          : "border-transparent text-charcoal hover:text-ink"
                      }`}
                    >
                      <Layers className="w-4 h-4 text-charcoal" />
                      Campaign Contract Truth
                    </button>

                    <button
                      onClick={() => setActiveTab("approval")}
                      className={`pb-3 px-3 text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                        activeTab === "approval"
                          ? "border-twilight text-ink font-semibold"
                          : "border-transparent text-charcoal hover:text-ink"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-signal-blue" />
                      Authorised Review & Lock
                    </button>

                    <button
                      onClick={() => setActiveTab("audit")}
                      className={`pb-3 px-3 text-[14px] font-medium transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                        activeTab === "audit"
                          ? "border-twilight text-ink font-semibold"
                          : "border-transparent text-charcoal hover:text-ink"
                      }`}
                    >
                      <History className="w-4 h-4 text-ash" />
                      Audit Trail
                    </button>
                  </div>
                );
              })()}

              {/* Tab Contents */}
              <div className="pt-2">
                {activeTab === "findings" && (
                  <FindingsReport 
                    campaign={selectedCampaign} 
                    onRefresh={fetchCampaigns} 
                    onGoToApproval={() => setActiveTab("approval")}
                  />
                )}

                {activeTab === "creator" && (
                  <PackUploader 
                    campaign={selectedCampaign} 
                    onInspectionComplete={fetchCampaigns} 
                    onViewFindings={() => setActiveTab("findings")} 
                  />
                )}

                {activeTab === "contract" && (
                  <ContractBuilder campaign={selectedCampaign} onSaved={fetchCampaigns} />
                )}

                {activeTab === "approval" && (
                  <ApprovalPanel campaign={selectedCampaign} onApproved={fetchCampaigns} />
                )}

                {activeTab === "audit" && (
                  <AuditTimeline logs={selectedCampaign.auditLogs || []} />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}