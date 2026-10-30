"use client";

import { useState } from "react";
import { X, UserPlus, Copy, Check, Shield, Trash2, Mail, ExternalLink } from "lucide-react";
import { CampaignMember, CampaignInvite, Role } from "@/types";

interface TeamInviteModalProps {
  campaignId: string;
  campaignTitle: string;
  members: CampaignMember[];
  invites: CampaignInvite[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function TeamInviteModal({
  campaignId,
  campaignTitle,
  members,
  invites,
  isOpen,
  onClose,
  onRefresh,
}: TeamInviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"CREATOR" | "REVIEWER">("CREATOR");
  const [generating, setGenerating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newInviteLink, setNewInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setGenerating(true);
    setError(null);
    setNewInviteLink(null);

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, actorName: "Priya Sharma" }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const fullUrl = `${window.location.origin}/invite?token=${json.data.token}`;
        setNewInviteLink(fullUrl);
        setEmail("");
        onRefresh();
      } else {
        setError(json.error || "Failed to generate invite.");
      }
    } catch (err) {
      setError("Network error while generating invite.");
    } finally {
      setGenerating(false);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    } catch (e) {
      console.warn("Fallback copy failed", e);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleRevoke = async (inviteId: string) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/invites/${inviteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorName: "Priya Sharma" }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to revoke invite:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-paper border border-mist rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-mist flex items-center justify-between bg-linen/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-twilight text-paper flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-ink font-semibold">Team & Scoped Invites</h3>
              <p className="text-xs text-ash font-mono">{campaignTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ash hover:text-ink hover:bg-mist/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Generate Invite Form */}
          <div className="p-4 bg-linen/60 rounded-xl border border-mist/80 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-charcoal font-semibold flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-twilight" />
              Invite Collaborator
            </h4>

            <form onSubmit={handleGenerateInvite} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@agency.com"
                    className="w-full px-3 py-2 bg-paper rounded-lg border border-mist text-ink text-xs focus:outline-none focus:border-twilight font-sans"
                  />
                </div>
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-paper rounded-lg border border-mist text-ink text-xs focus:outline-none focus:border-twilight font-mono"
                  >
                    <option value="CREATOR">Creator</option>
                    <option value="REVIEWER">Reviewer</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-[11px] text-status-error font-mono">{error}</p>}

              <button
                type="submit"
                disabled={generating}
                className="w-full py-2 px-3 bg-twilight text-paper text-xs font-medium rounded-lg hover:bg-twilight/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {generating ? "Generating Token..." : "Generate Secure Invite Link"}
              </button>
            </form>

            {newInviteLink && (
              <div className="mt-3 p-3 bg-status-pass/10 border border-status-pass/30 rounded-lg space-y-1.5">
                <span className="text-[11px] font-mono text-status-pass font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Token Created Successfully
                </span>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={newInviteLink}
                    className="w-full px-2.5 py-1.5 bg-paper rounded border border-status-pass/30 text-xs font-mono text-charcoal truncate"
                  />
                  <button
                    onClick={() => handleCopy(newInviteLink, "new")}
                    className="px-3 py-1.5 bg-twilight text-paper rounded text-xs font-mono flex items-center gap-1 hover:bg-twilight/90 shrink-0"
                  >
                    {copiedToken === "new" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedToken === "new" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Members */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-charcoal font-semibold">
              Active Workspace Members ({members.length})
            </h4>
            <div className="divide-y divide-mist/60 border border-mist rounded-xl overflow-hidden bg-paper">
              {members.map((m) => (
                <div key={m.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-ink">{m.name}</span>
                    <span className="text-ash font-mono ml-2">({m.email})</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      m.role === "BRAND_MANAGER"
                        ? "bg-twilight/10 text-twilight"
                        : m.role === "CREATOR"
                        ? "bg-signal-blue/10 text-signal-blue"
                        : "bg-status-pass/10 text-status-pass"
                    }`}
                  >
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invites */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-charcoal font-semibold">
              Pending Invitations ({invites.length})
            </h4>
            {invites.length === 0 ? (
              <p className="text-xs text-ash font-mono p-3 bg-linen/30 rounded-lg text-center">
                No active pending invitation tokens.
              </p>
            ) : (
              <div className="space-y-2">
                {invites.map((inv) => {
                  const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invite?token=${inv.token}`;
                  return (
                    <div
                      key={inv.id}
                      className="p-3 bg-linen/40 border border-mist/80 rounded-xl flex items-center justify-between text-xs gap-2"
                    >
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-ink font-semibold">{inv.email}</span>
                          <span className="px-1.5 py-0.5 bg-signal-blue/10 text-signal-blue rounded text-[10px] font-mono">
                            {inv.role}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              inv.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : inv.status === "ACCEPTED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-ash font-mono">Token: {inv.token}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {inv.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleCopy(inviteUrl, inv.id)}
                              className="p-1.5 text-ash hover:text-twilight hover:bg-mist/30 rounded transition-colors"
                              title="Copy Link"
                            >
                              {copiedToken === inv.id ? (
                                <Check className="w-3.5 h-3.5 text-status-pass" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRevoke(inv.id)}
                              className="p-1.5 text-ash hover:text-status-error hover:bg-mist/30 rounded transition-colors"
                              title="Revoke Token"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-linen/50 border-t border-mist flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-paper border border-mist rounded-lg text-xs font-mono text-charcoal hover:bg-mist/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
