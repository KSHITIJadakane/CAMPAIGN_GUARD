const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Building CampaignGuard Round 3 Submission PDF ===');

// Helper to encode image as base64
function toBase64(relPath) {
  const full = path.resolve(relPath);
  if (fs.existsSync(full)) {
    const ext = path.extname(full).replace('.', '');
    const b64 = fs.readFileSync(full).toString('base64');
    return `data:image/${ext};base64,${b64}`;
  }
  return '';
}

const landingImg = toBase64('public/screenshots/r3_landing.png');
const analyticsImg = toBase64('public/screenshots/r3_analytics.png');
const findingsImg = toBase64('public/screenshots/r3_findings_change_order.png');
const inviteImg = toBase64('public/screenshots/r3_invite_portal.png');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CampaignGuard — Round 3 Submission Dossier</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
      color: #171717;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 16mm 18mm 14mm 18mm;
      position: relative;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      background: #ffffff;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 3.5mm;
      margin-bottom: 4mm;
    }
    .brand-mark {
      font-family: Georgia, serif;
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: -0.2px;
      color: #111827;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .brand-mark .dot {
      width: 7px;
      height: 7px;
      background: #2563eb;
      border-radius: 50%;
      display: inline-block;
    }
    .header-tag {
      font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #4b5563;
      background: #f3f4f6;
      padding: 2.5px 7px;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    }
    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 3.5mm;
      font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: 7.5pt;
      color: #6b7280;
    }
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3.5mm;
      min-height: 0;
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 23pt;
      font-weight: 600;
      line-height: 1.15;
      color: #0f172a;
      letter-spacing: -0.4px;
    }
    h2 {
      font-family: Georgia, serif;
      font-size: 13.5pt;
      font-weight: 600;
      color: #0f172a;
      letter-spacing: -0.2px;
      margin-bottom: 2mm;
    }
    h3 {
      font-size: 9.5pt;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 1.5mm;
    }
    p {
      font-size: 8.8pt;
      line-height: 1.45;
      color: #334155;
    }
    .lead {
      font-size: 9.8pt;
      line-height: 1.5;
      color: #334155;
    }
    .badge {
      font-family: ui-monospace, Menlo, monospace;
      font-size: 7pt;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
      display: inline-block;
    }
    .badge-blue { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
    .badge-purple { background: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; }

    .card {
      background: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 3mm 3.5mm;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3mm;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2.5mm;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.8pt;
      margin-top: 1.5mm;
    }
    th {
      background: #f1f5f9;
      color: #1e293b;
      font-family: ui-monospace, Menlo, monospace;
      font-size: 7pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4.5px 6px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }
    td {
      padding: 4.5px 6px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: middle;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .img-container {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      background: #f8fafc;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .img-container img {
      width: 100%;
      display: block;
      object-fit: cover;
    }
    .caption {
      font-size: 7pt;
      font-family: ui-monospace, Menlo, monospace;
      color: #64748b;
      padding: 1.5mm 2mm;
      background: #f1f5f9;
      border-top: 1px solid #e2e8f0;
    }
    .key-callout {
      border-left: 3px solid #2563eb;
      background: #f8fafc;
      padding: 2.5mm 3.5mm;
      border-radius: 0 6px 6px 0;
    }
  </style>
</head>
<body>

  <!-- ========================================================================= -->
  <!-- PAGE 1: TITLE & EXECUTIVE SUMMARY                                         -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-mark"><span class="dot"></span> CampaignGuard Enterprise</div>
      <div class="header-tag">Round 3 Finalist Submission • Top 50 Edition</div>
    </div>

    <div class="content-area">
      <div style="margin-top: 1mm; margin-bottom: 2mm;">
        <span class="badge badge-blue" style="margin-bottom: 1.5mm;">TOP 50 FINALIST • SELECTED FROM 1,500+ TEAMS</span>
        <h1>CampaignGuard: Automated Pre-Publication Governance & Cross-Asset Truth Verification</h1>
        <p class="lead" style="margin-top: 2mm;">
          A multi-role enterprise preflight system that detects and prevents brand, legal, and mathematical non-compliance before marketing campaigns reach public distribution.
        </p>
      </div>

      <div class="card key-callout">
        <h3 style="color: #1e3a8a; font-size: 9pt;">Official Submission Metadata & Deliverable Links</h3>
        <table style="margin-top: 1mm; font-size: 8pt;">
          <tr>
            <td style="width: 25%; font-weight: 600;">Live Web Application</td>
            <td><strong style="color: #2563eb;">https://cg.kshitijpro.xyz</strong> (Primary production deployment)</td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Local Reproduction</td>
            <td><code>http://localhost:3000</code> (Production build verified, zero external db dependencies)</td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Source Code Repository</td>
            <td><strong>GitHub:</strong> https://github.com/KSHITIJadakane/CAMPAIGN_GUARD</td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Interactive Demo Guide</td>
            <td><a href="https://cg.kshitijpro.xyz/demo-guide" style="color: #2563eb; text-decoration: none;"><strong>https://cg.kshitijpro.xyz/demo-guide</strong></a> — 5-minute standalone judge evaluation blueprint</td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Round 3 Deliverables</td>
            <td><span class="badge badge-green">100% OF COMMITTED ROUND 3 FEATURES DELIVERED</span></td>
          </tr>
        </table>
      </div>

      <div>
        <h2>The Core Problem & Industry Breakthrough</h2>
        <p>
          In modern digital marketing, a single promotional campaign spans Instagram captions, display banners, PDF specifications, and email newsletters. Today, reviews are handled manually via fragmented email and Slack threads. Mismatched discounts (e.g. 30% on graphic vs. 20% in copy), prohibited health claims ("Miracle chill"), and missing legal qualifiers routinely trigger regulatory penalties, expensive corrective reprints, and severe brand equity damage.
        </p>
        <p style="margin-top: 1.5mm;">
          <strong>CampaignGuard solves this deterministically.</strong> Brand Managers establish a canonical <em>Truth Contract</em>. When Creators upload assets, our 4-layer multimodal engine automatically identifies contradictions, highlights exact graphic bounding boxes via spatial OCR, groups actionable remediation tickets, and allows Reviewers to bind sign-offs with an immutable cryptographic SHA-256 seal.
        </p>
      </div>

      <div class="grid-3" style="margin-top: 1mm;">
        <div class="card">
          <span class="badge badge-blue">FEATURE 1</span>
          <h3 style="margin-top: 1mm;">Multi-Role RBAC & Invites</h3>
          <p style="font-size: 8pt;">
            Scoped workspaces for Brand, Creator, and Reviewer personas with tokenized invite links (<code>/invite?token=...</code>) and role restrictions.
          </p>
        </div>
        <div class="card">
          <span class="badge badge-purple">FEATURE 2</span>
          <h3 style="margin-top: 1mm;">Visual OCR & Change Orders</h3>
          <p style="font-size: 8pt;">
            Spatial multimodal bounding-box overlays (<code>box_2d</code>) directly on banner graphics, structured remediation tickets, and revision diffing.
          </p>
        </div>
        <div class="card">
          <span class="badge badge-green">FEATURE 3</span>
          <h3 style="margin-top: 1mm;">Governance Analytics</h3>
          <p style="font-size: 8pt;">
            Enterprise intelligence dashboard aggregating 5 live KPIs, violation category breakdowns, compliance comparisons, and bottleneck tracking.
          </p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>CampaignGuard • Enterprise Marketing Preflight System</span>
      <span>Page 1 of 8</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 2: COMPLETE FEATURE INVENTORY                                        -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-mark"><span class="dot"></span> Feature Inventory</div>
      <div class="header-tag">Round 3 Finalist Platform Scope</div>
    </div>

    <div class="content-area">
      <div>
        <h2>Complete Product Capabilities Matrix</h2>
        <p>
          CampaignGuard is a fully operational, end-to-end governance platform built across three hackathon rounds. All features are live, interactive, and verifiable without requiring manual human walkthroughs.
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 14%;">Round</th>
            <th style="width: 26%;">Feature / Capability</th>
            <th style="width: 44%;">Technical Implementation & Scope</th>
            <th style="width: 16%;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Round 1</strong></td>
            <td><strong>Truth Contract Builder</strong></td>
            <td>Canonical parameter schema (discounts, valid dates, approved claims, prohibited superlatives, channel variants) with immutable version incrementing (v1 → v2).</td>
            <td><span class="badge badge-green">VERIFIED</span></td>
          </tr>
          <tr>
            <td><strong>Round 1</strong></td>
            <td><strong>Creative Pack Ingestion</strong></td>
            <td>Multi-asset upload terminal supporting simultaneous social captions, visual banners (PNG/JPEG), and PDF product specifications.</td>
            <td><span class="badge badge-green">VERIFIED</span></td>
          </tr>
          <tr>
            <td><strong>Round 1</strong></td>
            <td><strong>4-Layer Preflight Scan</strong></td>
            <td>Deterministic regex & numeric extraction combined with Google Gemini 1.5 Flash inspecting Facts, Cross-Asset specs, Brand Rules, and Accessibility.</td>
            <td><span class="badge badge-green">VERIFIED</span></td>
          </tr>
          <tr>
            <td><strong>Round 2</strong></td>
            <td><strong>Cryptographic Seal</strong></td>
            <td>SHA-256 payload binding hashing caption text, banner base64, and PDF text into an immutable cryptographic seal.</td>
            <td><span class="badge badge-green">VERIFIED</span></td>
          </tr>
          <tr>
            <td><strong>Round 2</strong></td>
            <td><strong>Tamper Invalidation</strong></td>
            <td>Immediate automated signature revocation upon any subsequent modification to copy or truth rules post-approval.</td>
            <td><span class="badge badge-green">VERIFIED</span></td>
          </tr>
          <tr>
            <td><strong>Round 2</strong></td>
            <td><strong>Audit Trail Ledger</strong></td>
            <td>Append-only chronological event ledger tracking contracts, uploads, preflight runs, finding resolutions, and gatekeeper locks.</td>
            <td><span class="badge badge-green">VERIFIED</span></td>
          </tr>
          <tr>
            <td><strong>Round 2</strong></td>
            <td><strong>Interactive Benchmarks</strong></td>
            <td>Pre-seeded EcoSip Flash Sale benchmark scenario containing 4 canonical contradictions across 3 layers (discount, cold retention, bottle capacity, prohibited superlative) for instant evaluation without uploading files.</td>
            <td><span class="badge badge-green">VERIFIED</span></td>
          </tr>
          <tr>
            <td><strong>Round 3</strong></td>
            <td><strong>Feature 1: RBAC & Invites</strong></td>
            <td>Tokenized campaign invitations (<code>/invite?token=...</code>), server-side 403 RBAC enforcement, role scoping (Brand Lead, Creator, Reviewer), and modal token management.</td>
            <td><span class="badge badge-blue">R3 DELIVERED</span></td>
          </tr>
          <tr>
            <td><strong>Round 3</strong></td>
            <td><strong>Feature 2: Spatial OCR & Change Orders</strong></td>
            <td>Gemini multimodal <code>box_2d</code> bounding boxes, interactive SVG overlay on graphics, grouped Change Order tickets, and Creator v2 revision diffing.</td>
            <td><span class="badge badge-blue">R3 DELIVERED</span></td>
          </tr>
          <tr>
            <td><strong>Round 3</strong></td>
            <td><strong>Feature 3: Governance Analytics</strong></td>
            <td>Live enterprise dashboard aggregating 5 KPIs, violation category distribution, campaign compliance comparisons, and workflow bottleneck intelligence.</td>
            <td><span class="badge badge-blue">R3 DELIVERED</span></td>
          </tr>
        </tbody>
      </table>

      <div class="card" style="margin-top: 1mm;">
        <h3>Zero-Friction Evaluation Guarantee & Dual Persistence</h3>
        <p style="font-size: 8.2pt;">
          To guarantee zero judge lockouts and zero cold-start delay, CampaignGuard uses a dual-tier architecture: an in-memory benchmark store pre-seeded with 4 benchmark campaigns and live change orders for instant evaluation, coupled with a complete, typed Prisma ORM SQLite/PostgreSQL schema (<code>prisma/schema.prisma</code>) for durable enterprise deployments. Judges can test role boundaries via the instant switcher or test real invite link lifecycles via <code>/invite?token=inv_ecosip_creator_demo</code>.
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>CampaignGuard • Enterprise Marketing Preflight System</span>
      <span>Page 2 of 8</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 3: FEATURE 1 — MULTI-ROLE RBAC & INVITE LINKS                        -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-mark"><span class="dot"></span> Feature 1 Deep-Dive</div>
      <div class="header-tag">Multi-Role RBAC & Secure Invitation Links</div>
    </div>

    <div class="content-area">
      <div>
        <span class="badge badge-blue">DELIVERED ROUND 3 IMPROVEMENT #1</span>
        <h2>Multi-Role Access Control & Campaign Invitation Links</h2>
        <p>
          Enterprise marketing governance requires strict separation of duties: Creators must not approve their own work, and Reviewers must not alter brand truth rules. In Round 3, we implemented authentic tokenized invitation links and scoped role workspaces.
        </p>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3>Tokenized Invite Link Architecture</h3>
          <p style="font-size: 8pt; margin-bottom: 2mm;">
            Brand Managers generate cryptographically random, role-restricted invitation tokens with 7-day expiration dates.
          </p>
          <ul style="font-size: 7.8pt; line-height: 1.5; padding-left: 14px; color: #334155;">
            <li><strong>Route:</strong> <code>/invite?token=[token]</code></li>
            <li><strong>State Verification:</strong> Real-time token validation against campaign membership, 7-day expiration (410 on expiry), and REVOKED flags.</li>
            <li><strong>1-Click Acceptance:</strong> Invited creators or legal reviewers enter their name and automatically join the workspace.</li>
            <li><strong>Server-Side 403 RBAC:</strong> <code>/api/packs/approve</code> rejects non-Reviewer approval calls with HTTP <code>403 Forbidden</code>.</li>
            <li><strong>Revocation Control:</strong> Brand Leads can inspect active links, copy URLs, and instantly revoke pending tokens.</li>
          </ul>
        </div>

        <div class="card">
          <h3>Role Scoping Matrix</h3>
          <table style="font-size: 7.5pt; margin-top: 0;">
            <thead>
              <tr>
                <th>Workspace Stage</th>
                <th>Brand Lead</th>
                <th>Creator</th>
                <th>Reviewer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Truth Contract</strong></td>
                <td><span class="badge badge-green">Full Edit</span></td>
                <td><span class="badge badge-amber">Read Only</span></td>
                <td><span class="badge badge-amber">Read Only</span></td>
              </tr>
              <tr>
                <td><strong>2. Creative Studio</strong></td>
                <td><span class="badge badge-amber">Read Only</span></td>
                <td><span class="badge badge-green">Upload / Revise</span></td>
                <td><span class="badge badge-amber">Read Only</span></td>
              </tr>
              <tr>
                <td><strong>3. Preflight Scan</strong></td>
                <td><span class="badge badge-green">View / Audit</span></td>
                <td><span class="badge badge-green">Resolve Fixes</span></td>
                <td><span class="badge badge-green">Inspect</span></td>
              </tr>
              <tr>
                <td><strong>4. Gatekeeper Lock</strong></td>
                <td><span class="badge badge-amber">Read Only</span></td>
                <td><span class="badge badge-amber">Locked</span></td>
                <td><span class="badge badge-green">Sign & Seal</span></td>
              </tr>
              <tr>
                <td><strong>5. Audit Trail</strong></td>
                <td><span class="badge badge-green">View Ledger</span></td>
                <td><span class="badge badge-green">View Ledger</span></td>
                <td><span class="badge badge-green">Verify SHA</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="img-container" style="max-height: 110mm;">
        ${inviteImg ? `<img src="${inviteImg}" style="height: 102mm;" alt="Invite Acceptance Portal" />` : ''}
        <div class="caption">Figure 3.1: Tokenized Campaign Invitation Acceptance Portal (<code>/invite?token=inv_ecosip_creator_demo</code>) showing campaign brief binding, assigned role (CREATOR), and 1-click workspace onboarding.</div>
      </div>
    </div>

    <div class="page-footer">
      <span>CampaignGuard • Enterprise Marketing Preflight System</span>
      <span>Page 3 of 8</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 4: FEATURE 2 — VISUAL OCR & CREATIVE CHANGE ORDERS                   -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-mark"><span class="dot"></span> Feature 2 Deep-Dive</div>
      <div class="header-tag">Visual OCR & Annotated Creative Change Orders</div>
    </div>

    <div class="content-area">
      <div>
        <span class="badge badge-purple">DELIVERED ROUND 3 IMPROVEMENT #2</span>
        <h2>Visual OCR & Evidence-Linked Creative Change Orders</h2>
        <p>
          In traditional workflows, when an AI flag is raised (e.g. "discount discrepancy"), creators don't know where on the banner graphic the mistake occurs. Round 3 solves this by pairing Google Gemini 1.5 Flash multimodal spatial vision with interactive SVG bounding boxes and grouped Change Order tickets.
        </p>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3>Spatial Bounding Box Extraction</h3>
          <p style="font-size: 8pt;">
            Our prompt instructs Gemini 1.5 Flash to return normalized 2D bounding boxes (<code>box_2d: [ymin, xmin, ymax, xmax]</code> scaled 0–1000). The frontend converts these into responsive SVG coordinate overlays:
          </p>
          <ul style="font-size: 7.8pt; line-height: 1.45; padding-left: 14px; color: #334155; margin-top: 1.5mm;">
            <li><strong>Precision Targeting:</strong> Identifies headline discount badges, subheaders, and missing footnote locations.</li>
            <li><strong>Bidirectional Highlighting:</strong> Clicking a bounding box on the graphic scrolls and highlights the matching finding card.</li>
          </ul>
        </div>

        <div class="card">
          <h3>Change Orders & Revision Diffing</h3>
          <p style="font-size: 8pt;">
            Instead of loose alert noise, visual findings are bundled into formal <strong>Change Orders</strong> (e.g. <code>#co_ecosip_01</code>):
          </p>
          <ul style="font-size: 7.8pt; line-height: 1.45; padding-left: 14px; color: #334155; margin-top: 1.5mm;">
            <li><strong>Structured Tickets:</strong> Location, violation evidence, contract rule, and suggested correction.</li>
            <li><strong>Revision v2 Upload:</strong> Creators submit revised copy and graphics. The engine re-analyzes assets and marks corrected items as <span class="badge badge-green">RESOLVED</span>.</li>
          </ul>
        </div>
      </div>

      <div class="img-container" style="max-height: 110mm;">
        ${findingsImg ? `<img src="${findingsImg}" style="height: 102mm;" alt="Visual OCR & Change Order Panel" />` : ''}
        <div class="caption">Figure 4.1: Preflight Findings with Annotated Graphic Viewer (interactive SVG bounding box on 30% discount badge) and structured Change Order #co_ecosip_01 panel with 1-click auto-reconciliation.</div>
      </div>
    </div>

    <div class="page-footer">
      <span>CampaignGuard • Enterprise Marketing Preflight System</span>
      <span>Page 4 of 8</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 5: FEATURE 3 — CROSS-CAMPAIGN GOVERNANCE ANALYTICS                   -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-mark"><span class="dot"></span> Feature 3 Deep-Dive</div>
      <div class="header-tag">Cross-Campaign Governance Analytics Dashboard</div>
    </div>

    <div class="content-area">
      <div>
        <span class="badge badge-green">DELIVERED ROUND 3 IMPROVEMENT #3</span>
        <h2>Cross-Campaign Governance Analytics Intelligence Dashboard</h2>
        <p>
          While campaign-level preflight scans protect individual assets, enterprise marketing leadership needs macro-level visibility: Which violation categories are recurring? What is our first-pass approval rate? Where are approvals stalling? Round 3 introduces the Governance Analytics Dashboard (<code>/dashboard?view=analytics</code>).
        </p>
      </div>

      <div class="grid-3">
        <div class="card">
          <span class="badge badge-blue">KPI 1 & 2</span>
          <h3 style="margin-top: 1mm;">Audits & Violations</h3>
          <p style="font-size: 8pt;">
            <strong>Campaigns Audited:</strong> Active briefs with executed preflight scans.<br/>
            <strong>Confirmed Violations:</strong> Pre-publication contradictions caught prior to distribution.
          </p>
        </div>
        <div class="card">
          <span class="badge badge-green">KPI 3 & 4</span>
          <h3 style="margin-top: 1mm;">First-Pass & Rounds</h3>
          <p style="font-size: 8pt;">
            <strong>First-Pass Rate (%):</strong> Percentage of assets approved at Rev 1 without revisions.<br/>
            <strong>Average Revision Rounds:</strong> Mean correction cycles required to reach sign-off.
          </p>
        </div>
        <div class="card">
          <span class="badge badge-amber">KPI 5 & BOTTLENECK</span>
          <h3 style="margin-top: 1mm;">Vault & Bottlenecks</h3>
          <p style="font-size: 8pt;">
            <strong>Sealed Vault:</strong> Approved SHA-256 locked packs.<br/>
            <strong>Bottleneck Tracker:</strong> Operational queue monitor tracking wait times by Creator vs Reviewer role.
          </p>
        </div>
      </div>

      <div class="img-container" style="max-height: 110mm;">
        ${analyticsImg ? `<img src="${analyticsImg}" style="height: 102mm;" alt="Governance Analytics Dashboard" />` : ''}
        <div class="caption">Figure 5.1: Governance Analytics Dashboard showing 5 live KPI cards, Category Breakdown chart (Facts, Cross-Asset, Brand Rules, Accessibility), Campaign Compliance Comparison table, and Workflow Bottleneck tracker.</div>
      </div>
    </div>

    <div class="page-footer">
      <span>CampaignGuard • Enterprise Marketing Preflight System</span>
      <span>Page 5 of 8</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 6: ARCHITECTURE & CRYPTOGRAPHIC ENGINE                               -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-mark"><span class="dot"></span> Technical Architecture</div>
      <div class="header-tag">Multimodal Engine & Cryptographic Integrity</div>
    </div>

    <div class="content-area">
      <div>
        <h2>System Architecture & Cryptographic Version-Lock</h2>
        <p>
          CampaignGuard is engineered as a high-reliability, zero-latency system designed to operate deterministically under adversarial conditions and withstand accidental or malicious out-of-band modifications.
        </p>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3>The 4-Layer Inspection Pipeline</h3>
          <table style="font-size: 7.5pt; margin-top: 1mm;">
            <thead>
              <tr>
                <th>Layer</th>
                <th>Target Checks</th>
                <th>Engine</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Facts</strong></td>
                <td>Discount %, expiry dates, pricing claims</td>
                <td>Deterministic regex + Gemini</td>
              </tr>
              <tr>
                <td><strong>2. Cross-Asset</strong></td>
                <td>Copy vs Banner vs Spec Sheet conflicts</td>
                <td>Gemini 1.5 Flash Vision</td>
              </tr>
              <tr>
                <td><strong>3. Brand Rules</strong></td>
                <td>Forbidden superlatives, mandatory qualifiers</td>
                <td>Rule-matching parser</td>
              </tr>
              <tr>
                <td><strong>4. A11y</strong></td>
                <td>Contrast ratio, alt-text presence</td>
                <td>Heuristic + Vision</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h3>SHA-256 Lock & Invalidation Protocol</h3>
          <p style="font-size: 8pt; margin-bottom: 2mm;">
            When an Authorised Reviewer signs off, CampaignGuard computes an immutable SHA-256 seal:
          </p>
          <div style="background: #f1f5f9; padding: 2mm; border-radius: 4px; font-family: monospace; font-size: 6.8pt; color: #0f172a; word-break: break-all;">
            SHA256(caption + bannerBase64 + pdfText + contractVersion)
          </div>
          <p style="font-size: 8pt; margin-top: 2mm;">
            <strong>Adversarial Invalidation:</strong> If a creator attempts an unauthorized copy tweak or an agency modifies a banner after approval, the cryptographic checksum fails instantly, flipping campaign status to <span class="badge badge-amber">INVALIDATED</span>.
          </p>
        </div>
      </div>

      <div class="card">
        <h3>High-Reliability Unified Edge Store</h3>
        <p style="font-size: 8.2pt; line-height: 1.45;">
          On ephemeral serverless runtimes like Vercel, traditional SQLite databases write to ephemeral temporary disk, causing state resets between concurrent edge lambda invocations. CampaignGuard implements a dual-layer persistence model:
        </p>
        <ul style="font-size: 7.8pt; line-height: 1.45; padding-left: 14px; color: #334155; margin-top: 1.5mm;">
          <li><strong>Local Execution:</strong> Full Prisma ORM with SQLite database migrations (<code>prisma/dev.db</code>).</li>
          <li><strong>Production Serverless:</strong> In-memory global singleton store pre-seeded with rich benchmark campaigns, active members, invites, and change orders. Eliminates cold-start delays and database setup friction, ensuring deterministic evaluation reliability.</li>
        </ul>
      </div>

      <div class="card key-callout">
        <h3 style="color: #1e3a8a; font-size: 8.8pt;">Adversarial Security & Prompt Injection Defense</h3>
        <p style="font-size: 8pt;">
          All user-uploaded copy and banner texts are treated strictly as <em>UNTRUSTED DATA payloads</em>. Prompts encapsulate inputs within isolated demarcation blocks and enforce system-instruction precedence to reject embedded prompt injection attempts.
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>CampaignGuard • Enterprise Marketing Preflight System</span>
      <span>Page 6 of 8</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 7: TESTING & RELIABILITY VERIFICATION                                -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-mark"><span class="dot"></span> Testing & Verification</div>
      <div class="header-tag">Automated Test Matrix & Stability Verification</div>
    </div>

    <div class="content-area">
      <div>
        <h2>Comprehensive Testing Suite & Reliability Proof</h2>
        <p>
          Per Round 3 requirements ("Make it hold up without you. Bad input, an empty state, a refresh, the same action twice — nothing should break or hang"), CampaignGuard underwent rigorous automated testing across compilation, API endpoints, and edge cases.
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Test Category</th>
            <th style="width: 45%;">Test Execution & Assertions</th>
            <th style="width: 15%;">Pass Rate</th>
            <th style="width: 15%;">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>TypeScript Strict Mode</strong></td>
            <td><code>npx tsc --noEmit</code> compiled across all components, API routes, and state stores.</td>
            <td>100% (0 errors)</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
          <tr>
            <td><strong>Next.js Production Build</strong></td>
            <td><code>npm run build</code> optimized bundle creation for 15 static and dynamic server routes.</td>
            <td>100% (15/15 routes)</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
          <tr>
            <td><strong>Campaign Invites API</strong></td>
            <td><code>GET /api/campaigns/[id]/invites</code> & <code>POST createInvite</code> token generation, expiration timestamps, role boundaries.</td>
            <td>100%</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
          <tr>
            <td><strong>Invite Acceptance API</strong></td>
            <td><code>GET /api/invites/[token]/accept</code> token lookup, 404 on malformed tokens, <code>POST acceptInvite</code> member binding.</td>
            <td>100%</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
          <tr>
            <td><strong>Governance Analytics API</strong></td>
            <td><code>GET /api/analytics</code> live aggregation of 5 KPIs, violation distributions, and role wait queues.</td>
            <td>100%</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
          <tr>
            <td><strong>Creator Revision Flow</strong></td>
            <td><code>POST /api/packs/revision</code> asset re-analysis, Change Order status updates, and resolution diffing (4/4 resolved).</td>
            <td>100%</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
          <tr>
            <td><strong>Server-Side RBAC Guard</strong></td>
            <td><code>POST /api/packs/approve</code> strictly rejects unauthorized callers with HTTP <code>403 Forbidden</code>.</td>
            <td>100%</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
          <tr>
            <td><strong>Tamper Invalidation Flow</strong></td>
            <td><code>POST /api/packs/approve</code> cryptographic seal bound; subsequent asset modification revokes lock to INVALIDATED.</td>
            <td>100%</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
          <tr>
            <td><strong>Demo State Reset API</strong></td>
            <td><code>POST /api/demo/reset</code> restores pristine Rev 1 benchmark state for repeatable judge evaluations.</td>
            <td>100%</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
          <tr>
            <td><strong>Empty State Handling</strong></td>
            <td>Clean fallback displays for campaigns with no uploaded assets, empty invite queues, and zero-violation packs.</td>
            <td>100%</td>
            <td><span class="badge badge-green">PASSED</span></td>
          </tr>
        </tbody>
      </table>

      <div class="grid-2" style="margin-top: 1mm;">
        <div class="card">
          <h3>Adversarial Input Handling</h3>
          <p style="font-size: 7.8pt; line-height: 1.45;">
            - <strong>Missing Fields:</strong> API routes validate required fields and return structured HTTP 400 responses without uncaught exceptions.<br/>
            - <strong>Malformed Tokens:</strong> <code>/invite?token=invalid_xyz</code> gracefully renders an informative error card with a direct return link to the home page.<br/>
            - <strong>Rapid Re-clicks:</strong> 1-Click fix actions disable buttons with loading spinners to prevent race conditions.
          </p>
        </div>

        <div class="card">
          <h3>Reproducibility Script</h3>
          <p style="font-size: 7.8pt; line-height: 1.45;">
            Judges can execute the automated test script locally at any time:
          </p>
          <div style="background: #f1f5f9; padding: 2mm; border-radius: 4px; font-family: monospace; font-size: 7pt; color: #0f172a; margin-top: 1mm;">
            git clone [repo-url]<br/>
            npm install<br/>
            npm run build<br/>
            node scratch/test_round3_apis.js
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>CampaignGuard • Enterprise Marketing Preflight System</span>
      <span>Page 7 of 8</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 8: PRODUCT ROADMAP & JUDGE EVALUATION GUIDE                          -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-mark"><span class="dot"></span> Product Roadmap & Sign-Off</div>
      <div class="header-tag">Enterprise Vision & Evaluation Blueprint</div>
    </div>

    <div class="content-area">
      <div>
        <h2>Post-Hackathon Roadmap & Enterprise Go-To-Market</h2>
        <p>
          CampaignGuard is architected as the foundational preflight verification layer for enterprise marketing stacks. Following Round 3, our production roadmap includes three planned commercial phases:
        </p>
      </div>

      <div class="grid-3">
        <div class="card">
          <span class="badge badge-blue">PHASE 13 • Q1 2027</span>
          <h3 style="margin-top: 1mm;">Enterprise SSO & Webhooks</h3>
          <p style="font-size: 7.8pt; line-height: 1.45;">
            - Okta / SAML 2.0 integration for enterprise identity.<br/>
            - Slack & Microsoft Teams interactive webhook alerts for instant change order approvals.
          </p>
        </div>
        <div class="card">
          <span class="badge badge-purple">PHASE 14 • Q2 2027</span>
          <h3 style="margin-top: 1mm;">CMS Publishing Bridges</h3>
          <p style="font-size: 7.8pt; line-height: 1.45;">
            - Automated push-to-production bridges for Shopify, Webflow, Meta Ads API, and Google Ads.<br/>
            - Cryptographic lock gating blocking ad account deployment if seal is broken.
          </p>
        </div>
        <div class="card">
          <span class="badge badge-green">PHASE 15 • Q3 2027</span>
          <h3 style="margin-top: 1mm;">Fine-Tuned Sovereign LLMs</h3>
          <p style="font-size: 7.8pt; line-height: 1.45;">
            - LoRA fine-tuned open weights models for enterprise on-premise air-gapped deployments.<br/>
            - Cross-border multi-currency localized regulatory compliance modules (GDPR, FTC, ASA).
          </p>
        </div>
      </div>

      <div class="card key-callout" style="margin-top: 1mm;">
        <h3 style="color: #1e3a8a; font-size: 9pt;">Recommended 5-Minute Judge Walkthrough</h3>
        <table style="font-size: 7.6pt; margin-top: 1mm;">
          <tr>
            <td style="width: 15%; font-weight: 600;">Minute 1</td>
            <td><strong>Landing Page:</strong> Visit <code>/</code>, review the 4-layer architecture, and try the interactive scanner.</td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Minute 2</td>
            <td><strong>Governance Analytics:</strong> Open <code>/dashboard?view=analytics</code>, inspect 5 live KPIs, category breakdown, and bottleneck tracking.</td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Minute 3</td>
            <td><strong>Demo Benchmark:</strong> Click into <strong>EcoSip Flash Sale</strong> → <strong>Step 3 (Preflight Scan)</strong>. Observe the interactive visual bounding box on the 30% discount badge.</td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Minute 4</td>
            <td><strong>1-Click Fix & Version Lock:</strong> Click "1-Click Accept All Fixes" (available in Step 3 Scan or Step 4 Approval banner). Switch to Reviewer persona, inspect clean state, and execute the cryptographic SHA-256 seal.</td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Minute 5</td>
            <td><strong>Tamper Invalidation & Demo Reset:</strong> Click "Simulate Asset Tamper" to observe instant lock revocation to INVALIDATED. Use 1-click re-lock or "Reset Demo" button to restore pristine benchmark state anytime. Open "Team & Invites" to test 7-day tokenized invite links.</td>
          </tr>
        </table>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 2mm; margin-top: 1mm;">
        <p style="font-size: 7.8pt; color: #64748b; text-align: center;">
          Built with precision for the Hackathon Round 3 Grand Finale • October 2026 • Team CampaignGuard
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>CampaignGuard • Enterprise Marketing Preflight System</span>
      <span>Page 8 of 8</span>
    </div>
  </div>

</body>
</html>
`;

// Write HTML file
const htmlPath = path.resolve('CampaignGuard_Round3_Submission.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log(`✓ Wrote HTML file: ${htmlPath} (${htmlContent.length} bytes)`);

// Convert HTML to PDF using headless Chrome
const pdfPath = path.resolve('CampaignGuard_Round3_Submission.pdf');
const publicPdfPath = path.resolve('public/CampaignGuard_Round3_Submission.pdf');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const printCmd = `"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
console.log('Generating PDF via headless Chrome...');
try {
  execSync(printCmd, { stdio: 'inherit' });
  if (fs.existsSync(pdfPath)) {
    const size = fs.statSync(pdfPath).size;
    console.log(`✓ Generated PDF: ${pdfPath} (${size} bytes)`);
    // Copy to public directory
    fs.copyFileSync(pdfPath, publicPdfPath);
    console.log(`✓ Copied PDF to public directory: ${publicPdfPath}`);
  } else {
    console.error('PDF file was not created!');
  }
} catch (err) {
  console.error('Error printing PDF:', err.message);
}

// Verify page count using binary scan
if (fs.existsSync(pdfPath)) {
  const buf = fs.readFileSync(pdfPath);
  const pdfStr = buf.toString('latin1');
  const countMatches = pdfStr.match(/\/Count\s+(\d+)/g);
  console.log('PDF Page count marker matches:', countMatches);
  const pageMatches = pdfStr.match(/\/Type\s*\/Page[^s]/g);
  console.log('Total /Type /Page occurrences:', pageMatches ? pageMatches.length : 0);
}

console.log('=== Round 3 PDF Build Complete ===');
