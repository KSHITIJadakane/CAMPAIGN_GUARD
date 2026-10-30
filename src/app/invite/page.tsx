"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight, Shield, UserCheck, Sparkles } from "lucide-react";
import { Role } from "@/types";
import { useRole } from "@/components/layout/RoleContext";

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setRole } = useRole();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!token) {
      setError("No invitation token provided. Please use a valid invite link.");
      setLoading(false);
      return;
    }

    async function verifyInvite() {
      try {
        const res = await fetch(`/api/invites/${token}/accept`);
        const json = await res.json();
        if (json.success) {
          setInviteData(json.data);
          // Set sensible default name
          setUserName(
            json.data.invite.role === "CREATOR" ? "Alex Chen" : "Marcus Vance"
          );
        } else {
          setError(json.error || "Invalid or expired invitation token.");
        }
      } catch (err) {
        setError("Network error while verifying invitation.");
      } finally {
        setLoading(false);
      }
    }

    verifyInvite();
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);

    try {
      const res = await fetch(`/api/invites/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName }),
      });
      const json = await res.json();

      if (json.success) {
        // Update local session & role context
        const role: Role = json.data.role;
        const campaignId = json.data.campaignId;
        setRole(role);
        localStorage.setItem("cg_demo_role", role);
        localStorage.setItem("cg_active_campaign", campaignId);

        // Redirect to dashboard with targeted tab for the role
        const targetTab = role === "CREATOR" ? "creator" : "approval";
        router.push(`/dashboard?campaign=${encodeURIComponent(campaignId)}&tab=${targetTab}`);
      } else {
        setError(json.error || "Failed to accept invitation.");
        setAccepting(false);
      }
    } catch (err) {
      setError("Network error while accepting invitation.");
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-twilight border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-sm text-ash">Verifying invitation token...</p>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-paper rounded-2xl border border-status-error/30 shadow-subtle-card space-y-5 text-center">
        <div className="w-12 h-12 rounded-full bg-status-error/10 text-status-error flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-2xl text-ink">Invitation Unavailable</h2>
          <p className="text-sm text-charcoal">{error || "This invitation link is expired or invalid."}</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-twilight text-paper rounded-lg text-sm font-medium hover:bg-twilight/90 transition-colors"
        >
          Return to Campaigns Hub
        </Link>
      </div>
    );
  }

  const { invite, campaign } = inviteData;
  const isCreator = invite.role === "CREATOR";

  return (
    <div className="max-w-lg mx-auto my-8 p-6 sm:p-8 bg-paper rounded-3xl border border-mist shadow-subtle-card space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linen border border-mist flex items-center justify-center text-twilight">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
            Campaign Collaboration Invite
          </span>
          <h1 className="font-serif text-2xl text-ink">Join Campaign Workspace</h1>
        </div>
      </div>

      <div className="p-4 bg-linen/70 rounded-xl border border-mist/80 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono text-ash uppercase">Campaign</span>
            <h3 className="font-serif text-lg text-ink font-semibold">{campaign.title}</h3>
            <p className="text-xs text-charcoal">{campaign.product} • {campaign.brand}</p>
          </div>
          <span className="px-2.5 py-1 bg-signal-blue/10 text-signal-blue text-[11px] font-mono rounded font-semibold">
            {invite.role}
          </span>
        </div>

        <div className="border-t border-mist/60 pt-3 text-xs text-charcoal space-y-1">
          <p>
            <strong>Invited Email:</strong> <span className="font-mono text-ink">{invite.email}</span>
          </p>
          <p>
            <strong>Permissions:</strong>{" "}
            {isCreator
              ? "View preflight findings, inspect visual OCR bounding boxes, and upload revised assets."
              : "Verify evidence, review Change Orders, and execute cryptographic version-locks."}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-mono text-charcoal">
          Your Display Name in Audit Trail:
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="e.g. Alex Chen"
          className="w-full px-4 py-2.5 bg-paper rounded-lg border border-mist text-ink text-sm focus:outline-none focus:border-twilight font-sans"
        />
      </div>

      <button
        onClick={handleAccept}
        disabled={accepting || !userName.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-twilight text-paper rounded-xl font-medium text-sm hover:bg-twilight/90 transition-all shadow-sm disabled:opacity-50"
      >
        {accepting ? (
          <>
            <span className="w-4 h-4 border-2 border-paper border-t-transparent rounded-full animate-spin" />
            <span>Joining Workspace...</span>
          </>
        ) : (
          <>
            <UserCheck className="w-4 h-4" />
            <span>Accept Invitation & Enter Campaign</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-[11px] font-mono text-center text-ash">
        Campaign-Scoped Role-Based Access Control • Cryptographically Verified Token
      </p>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="font-mono text-sm text-ash">Loading Invitation Portal...</p>
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}
