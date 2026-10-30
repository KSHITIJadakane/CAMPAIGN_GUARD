"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  RefreshCw,
  Filter,
  ArrowRight,
} from "lucide-react";
import { GovernanceAnalyticsData, CheckLayer } from "@/types";

interface GovernanceAnalyticsViewProps {
  onSelectCampaign?: (campaignId: string) => void;
}

export function GovernanceAnalyticsView({ onSelectCampaign }: GovernanceAnalyticsViewProps) {
  const [data, setData] = useState<GovernanceAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [timeframe, setTimeframe] = useState<string>("ALL");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load governance analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div className="p-12 text-center space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-twilight mx-auto" />
        <p className="text-xs font-mono text-ash">Compiling Cross-Campaign Analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 bg-paper rounded-2xl border border-mist text-center space-y-2">
        <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
        <p className="text-sm font-medium text-ink">No analytics data available</p>
      </div>
    );
  }

  const { kpis, violationsByCategory, campaignsComparison, bottlenecks } = data;

  const filteredViolations =
    selectedCategory === "ALL"
      ? violationsByCategory
      : violationsByCategory.filter((v) => v.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-mist pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ash flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-twilight" /> Round 3 Feature 3 • Operational Visibility
          </span>
          <h2 className="font-serif text-2xl text-ink font-semibold">
            Cross-Campaign Governance Analytics
          </h2>
          <p className="text-xs text-charcoal font-sans mt-0.5">
            Real-time compliance telemetry aggregated across all active campaigns and audit logs.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-paper rounded-xl border border-mist text-xs font-mono text-charcoal">
            <Filter className="w-3.5 h-3.5 text-ash" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none text-ink text-xs font-mono cursor-pointer"
            >
              <option value="ALL">All Rule Categories</option>
              <option value="FACTS">Campaign Facts & Math</option>
              <option value="BRAND_RULES">Brand Rules & Terms</option>
              <option value="CROSS_ASSET">Cross-Asset Consistency</option>
              <option value="ACCESSIBILITY">Accessibility</option>
            </select>
          </div>

          <button
            onClick={fetchAnalytics}
            className="p-2 bg-paper rounded-xl border border-mist text-ash hover:text-ink hover:bg-mist/30 transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 High-Impact KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* KPI 1 */}
        <div className="p-4 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ash flex items-center gap-1">
            <Layers className="w-3 h-3 text-twilight" /> Audited Campaigns
          </span>
          <div className="font-serif text-2xl text-ink font-bold">{kpis.totalCampaignsAudited}</div>
          <span className="text-[10px] text-charcoal font-mono block">Active brief checks</span>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ash flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-status-error" /> Confirmed Violations
          </span>
          <div className="font-serif text-2xl text-status-error font-bold">{kpis.confirmedViolations}</div>
          <span className="text-[10px] text-charcoal font-mono block">Pre-publication flags</span>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ash flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-status-pass" /> First-Pass Rate
          </span>
          <div className="font-serif text-2xl text-status-pass font-bold">
            {kpis.firstPassApprovalRate}%
          </div>
          <span className="text-[10px] text-charcoal font-mono block">Approved at Rev 1</span>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ash flex items-center gap-1">
            <Clock className="w-3 h-3 text-signal-blue" /> Avg Revision Rounds
          </span>
          <div className="font-serif text-2xl text-signal-blue font-bold">
            {kpis.averageCorrectionRounds}x
          </div>
          <span className="text-[10px] text-charcoal font-mono block">Cycles to sign-off</span>
        </div>

        {/* KPI 5 */}
        <div className="p-4 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ash flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-twilight" /> Sealed Vault
          </span>
          <div className="font-serif text-2xl text-twilight font-bold">{kpis.sealedCampaignsCount}</div>
          <span className="text-[10px] text-charcoal font-mono block">SHA-256 locked briefs</span>
        </div>
      </div>

      {/* Main Grid: Violations Distribution & Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Violations by Category */}
        <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-4">
          <div>
            <h3 className="font-serif text-lg text-ink font-semibold">Violations by Governance Layer</h3>
            <p className="text-xs text-charcoal font-sans">
              Distribution of contradictions caught by the 4-layer preflight engine.
            </p>
          </div>

          <div className="space-y-3.5">
            {filteredViolations.map((v) => (
              <div key={v.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">{v.label}</span>
                  <span className="font-mono text-ash">
                    {v.count} violations ({v.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-linen rounded-full overflow-hidden border border-mist/40">
                  <div
                    style={{ width: `${Math.max(v.percentage, 5)}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      v.category === "FACTS"
                        ? "bg-red-500"
                        : v.category === "BRAND_RULES"
                        ? "bg-amber-500"
                        : v.category === "CROSS_ASSET"
                        ? "bg-twilight"
                        : "bg-signal-blue"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Bottleneck Intelligence */}
        <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-4">
          <div>
            <h3 className="font-serif text-lg text-ink font-semibold">Workflow Bottleneck Intelligence</h3>
            <p className="text-xs text-charcoal font-sans">
              Live status tracking where campaigns are waiting across team roles.
            </p>
          </div>

          <div className="space-y-3">
            {bottlenecks.map((b) => (
              <div
                key={b.role}
                className="p-3 bg-linen/50 rounded-xl border border-mist/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink">{b.role}</span>
                    <span className="text-[10px] font-mono text-ash">
                      ({b.waitingCount} item{b.waitingCount !== 1 ? "s" : ""} waiting)
                    </span>
                  </div>
                  <span className="text-[11px] text-charcoal font-sans block mt-0.5">
                    Oldest: <em>{b.oldestItemTitle}</em>
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-semibold text-twilight text-sm block">
                    ~{b.avgWaitHours}h
                  </span>
                  <span className="text-[10px] font-mono text-ash">Avg turnaround</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-charcoal font-sans italic bg-linen/30 p-2.5 rounded-lg border border-mist/60">
            Bottlenecks auto-resolve when Creators upload Revision v2 or Reviewers sign cryptographic locks.
          </p>
        </div>
      </div>

      {/* Cross-Campaign Compliance Comparison Matrix */}
      <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-4">
        <div>
          <h3 className="font-serif text-lg text-ink font-semibold">
            Campaign Compliance Comparison Matrix
          </h3>
          <p className="text-xs text-charcoal font-sans">
            Authoritative cross-campaign audit state across active marketing workflows.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-mist text-ash font-mono uppercase text-[10px]">
                <th className="pb-2">Campaign Title</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Violations</th>
                <th className="pb-2">Asset Revision</th>
                <th className="pb-2">Contract Ver</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/60">
              {campaignsComparison.map((row) => (
                <tr key={row.campaignId} className="hover:bg-linen/40 transition-colors">
                  <td className="py-3 font-medium text-ink font-serif">{row.title}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        row.status === "APPROVED"
                          ? "bg-status-pass/10 text-status-pass"
                          : row.status === "NEEDS_REVIEW"
                          ? "bg-amber-100 text-amber-800"
                          : row.status === "INVALIDATED"
                          ? "bg-status-error/10 text-status-error"
                          : "bg-mist/30 text-charcoal"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-semibold text-charcoal">
                    {row.violationsCount} flag{row.violationsCount !== 1 ? "s" : ""}
                  </td>
                  <td className="py-3 font-mono text-charcoal">Rev {row.revision || 1}</td>
                  <td className="py-3 font-mono text-charcoal">v{row.contractVersion}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectCampaign?.(row.campaignId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-linen border border-mist rounded-lg text-twilight font-mono text-[11px] hover:bg-twilight hover:text-paper transition-colors"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
