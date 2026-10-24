const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getImageBase64(filename) {
  const filePath = path.join(__dirname, 'public', 'shots', filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

const shotHub = getImageBase64('shot_hub.png');
const shotContract = getImageBase64('shot_contract.png');
const shotCreator = getImageBase64('shot_creator.png');
const shotFindings = getImageBase64('shot_findings.png');
const shotLock = getImageBase64('shot_lock.png');
const shotAudit = getImageBase64('shot_audit.png');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CampaignGuard - Executive Technical Brief & Architecture Dossier</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 14mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #FFFFFF;
      color: #1E293B;
      line-height: 1.45;
      font-size: 11px;
    }

    /* Page container */
    .page {
      page-break-after: always;
      position: relative;
      height: 100%;
      min-height: 260mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .page:last-child {
      page-break-after: avoid;
    }

    /* Header & Footer */
    .doc-header {
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .doc-logo {
      font-size: 14px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .doc-logo-badge {
      background: #1E56A0;
      color: #FFFFFF;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-family: ui-monospace, monospace;
      font-weight: 700;
    }
    .doc-meta {
      font-size: 9px;
      font-family: ui-monospace, monospace;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .doc-footer {
      border-top: 1px solid #E2E8F0;
      padding-top: 6px;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5px;
      font-family: ui-monospace, monospace;
      color: #94A3B8;
    }

    /* Headings & Badges */
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.8px;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    h2 {
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
      letter-spacing: -0.3px;
      margin-bottom: 6px;
      border-left: 3px solid #1E56A0;
      padding-left: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    h3 {
      font-size: 11.5px;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 4px;
    }
    .subtitle {
      font-size: 11px;
      color: #475569;
      margin-bottom: 12px;
    }

    /* Metric Badges & Pills */
    .badge {
      display: inline-block;
      font-size: 8.5px;
      font-family: ui-monospace, monospace;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.4px;
    }
    .badge-blue { background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; }
    .badge-red { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }
    .badge-green { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
    .badge-amber { background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; }
    .badge-dark { background: #0F172A; color: #F8FAFC; }

    /* Grid Layouts */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }

    /* Cards */
    .card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 8px;
    }
    .card-critical {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-left: 4px solid #DC2626;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .card-success {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-left: 4px solid #16A34A;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .card-highlight {
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      border-left: 4px solid #2563EB;
      border-radius: 6px;
      padding: 8px 10px;
    }

    /* Stat Boxes */
    .stat-box {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 8px;
      text-align: center;
    }
    .stat-val {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      font-family: ui-monospace, monospace;
      line-height: 1.1;
    }
    .stat-label {
      font-size: 8.5px;
      color: #64748B;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-top: 2px;
    }

    /* Lists (No Paragraphs) */
    ul.bullet-list {
      list-style: none;
      padding-left: 0;
    }
    ul.bullet-list li {
      position: relative;
      padding-left: 14px;
      margin-bottom: 5px;
      font-size: 10.5px;
      color: #334155;
    }
    ul.bullet-list li::before {
      content: "•";
      position: absolute;
      left: 2px;
      color: #1E56A0;
      font-weight: 900;
      font-size: 14px;
      line-height: 1;
    }
    ul.bullet-list li strong {
      color: #0F172A;
    }

    /* Key-Value Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-top: 4px;
      margin-bottom: 8px;
    }
    table.data-table th {
      background: #0F172A;
      color: #FFFFFF;
      text-align: left;
      padding: 5px 8px;
      font-weight: 700;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      border: 1px solid #0F172A;
    }
    table.data-table td {
      padding: 5px 8px;
      border: 1px solid #CBD5E1;
      vertical-align: top;
    }
    table.data-table tr:nth-child(even) {
      background: #F8FAFC;
    }

    /* Snapshots / Images */
    .snapshot-frame {
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      background: #0F172A;
      margin-top: 4px;
    }
    .snapshot-frame img {
      width: 100%;
      height: auto;
      display: block;
    }
    .snapshot-caption {
      background: #F1F5F9;
      border-top: 1px solid #CBD5E1;
      padding: 4px 8px;
      font-size: 8.5px;
      font-family: ui-monospace, monospace;
      color: #475569;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>
</head>
<body>

  <!-- ========================================================================= -->
  <!-- PAGE 1: EXECUTIVE OVERVIEW & THE EXISTING PROBLEM                        -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-header">
        <div class="doc-logo">
          <span class="doc-logo-badge">SHIELD-CORE</span>
          CampaignGuard Preflight Protocol
        </div>
        <div class="doc-meta">EXECUTIVE BRIEF • SEC-01 • DEPLOYMENT CONFIDENTIAL</div>
      </div>

      <div style="margin-bottom: 12px;">
        <span class="badge badge-red">CRITICAL COMPLIANCE GAP</span>
        <h1 style="margin-top: 4px;">Deceptive Ad Vulnerabilities & Multi-Asset Contradictions</h1>
        <div class="subtitle">
          How unverified marketing creative leaks non-compliant discounts, uncertified claims, and invalidates brand truth.
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="stat-box">
          <div class="stat-val" style="color: #DC2626;">$50,120</div>
          <div class="stat-label">FTC Max Fine / Violation</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="color: #D97706;">87%</div>
          <div class="stat-label">Ad Asset Drift Rate</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="color: #2563EB;">5.4 Days</div>
          <div class="stat-label">Avg Legal Bottleneck</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="color: #059669;">100%</div>
          <div class="stat-label">SHA-256 Tamper Proof</div>
        </div>
      </div>

      <h2>Existing Industry Problems (The Broken Status Quo)</h2>
      <div class="grid-2">
        <div class="card-critical">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <h3>1. Multi-Asset Contradiction Leaks</h3>
            <span class="badge badge-red">CRITICAL RISK</span>
          </div>
          <ul class="bullet-list">
            <li><strong>Desynchronized Channels:</strong> Instagram caption claims 20% OFF while banner graphic declares 30% OFF.</li>
            <li><strong>Channel Leaks:</strong> Tiered subscriber discounts mistakenly broadcast to general public ad feeds.</li>
            <li><strong>Silent Contradictions:</strong> Disclaimers tucked away in terms PDFs contradict headline social ad copy.</li>
          </ul>
        </div>

        <div class="card-critical">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <h3>2. Unsubstantiated Scientific Claims</h3>
            <span class="badge badge-red">REGULATORY FINE</span>
          </div>
          <ul class="bullet-list">
            <li><strong>Engineering Drift:</strong> Copywriters state "24-hr cold retention" when lab certs only validate 12 hours.</li>
            <li><strong>Superlative Violations:</strong> Unapproved words like "Miracle", "Cure", or "Guaranteed" evade manual eye checks.</li>
            <li><strong>Omission of Mandatory Qualifiers:</strong> Missing required caveats ("While supplies last", "T&C Apply").</li>
          </ul>
        </div>
      </div>

      <div class="grid-2" style="margin-top: 6px;">
        <div class="card-critical">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <h3>3. Velocity vs Legal Friction Bottleneck</h3>
            <span class="badge badge-amber">OPERATIONAL LOSS</span>
          </div>
          <ul class="bullet-list">
            <li><strong>Review Gridlock:</strong> Creative teams generate 50+ ad variants weekly; legal takes 4–7 days per audit.</li>
            <li><strong>Rushed Sign-offs:</strong> 64% of brands bypass formal legal clearance under tight campaign launch deadlines.</li>
            <li><strong>Manual Fatigue:</strong> High error rates when human reviewers manually cross-check PDF terms against images.</li>
          </ul>
        </div>

        <div class="card-critical">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <h3>4. Post-Approval Silent Tampering</h3>
            <span class="badge badge-red">LEGAL LIABILITY</span>
          </div>
          <ul class="bullet-list">
            <li><strong>Out-of-Band Mod:</strong> Creators edit approved copy or swap banner PNGs at 11 PM directly before go-live.</li>
            <li><strong>Lost Traceability:</strong> Zero immutable record showing what was legally approved vs what was actually aired.</li>
            <li><strong>No Revocation Engine:</strong> No system detects when an approved asset hash is modified post-sign-off.</li>
          </ul>
        </div>
      </div>

      <div style="margin-top: 10px;">
        <h2>The Core Governance Breakdown</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 25%;">Failure Vector</th>
              <th style="width: 35%;">What Happens in Current Workflow</th>
              <th style="width: 40%;">Regulatory & Business Damage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Discrepant Discounts</strong></td>
              <td>Banner says 30%, checkout allows 20%, PDF says 15%</td>
              <td>Consumer fraud complaints, chargebacks, brand trust erosion</td>
            </tr>
            <tr>
              <td><strong>Uncertified Claims</strong></td>
              <td>Marketing claims 24-hr vacuum lock without certified lab data</td>
              <td>ASCI / FTC deceptive advertising investigations, mandatory recall</td>
            </tr>
            <tr>
              <td><strong>Banned Superlatives</strong></td>
              <td>Use of words like "Miracle Guaranteed" without qualification</td>
              <td>Misleading advertising penalties, platform ad account bans</td>
            </tr>
            <tr>
              <td><strong>Last-Mile Edits</strong></td>
              <td>Asset modified in Canva after legal review approval</td>
              <td>Brand counsel held legally liable for unauthorized creator copy</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="doc-footer">
      <span>CampaignGuard Architecture Dossier • Section 01: Problem Statement</span>
      <span>Page 1 of 6</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 2: WHAT WE FIX & HOW (THE 4-LAYER ENGINE ARCHITECTURE)               -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-header">
        <div class="doc-logo">
          <span class="doc-logo-badge">SHIELD-CORE</span>
          CampaignGuard Preflight Protocol
        </div>
        <div class="doc-meta">EXECUTIVE BRIEF • SEC-02 • SOLUTION ARCHITECTURE</div>
      </div>

      <div style="margin-bottom: 12px;">
        <span class="badge badge-green">SYSTEM ARCHITECTURE</span>
        <h1 style="margin-top: 4px;">What We Fix: The 4-Layer Automated Trust Loop</h1>
        <div class="subtitle">
          Transforming subjective, manual ad reviews into deterministic mathematical compliance and cryptographic locks.
        </div>
      </div>

      <!-- Core Pillars -->
      <div class="grid-3" style="margin-bottom: 12px;">
        <div class="card-highlight">
          <span class="badge badge-blue">PILLAR 01</span>
          <h3 style="margin-top: 4px;">Single Source of Truth</h3>
          <ul class="bullet-list">
            <li><strong>Campaign Contract:</strong> Canonical baseline of discount %, dates, approved claims, and banned terms.</li>
            <li><strong>Versioned Truth:</strong> Immutable contract revisions (v1, v2) with audit provenance.</li>
          </ul>
        </div>

        <div class="card-highlight">
          <span class="badge badge-blue">PILLAR 02</span>
          <h3 style="margin-top: 4px;">4-Layer AI Preflight</h3>
          <ul class="bullet-list">
            <li><strong>Automated Scan:</strong> Audits social copy, banner images, and spec sheets simultaneously.</li>
            <li><strong>Contradiction Flags:</strong> Instant grounding against active contract parameters.</li>
          </ul>
        </div>

        <div class="card-highlight">
          <span class="badge badge-blue">PILLAR 03</span>
          <h3 style="margin-top: 4px;">Cryptographic Locking</h3>
          <ul class="bullet-list">
            <li><strong>SHA-256 Hash Seal:</strong> Binds approved assets to contract version cryptographically.</li>
            <li><strong>Auto-Revocation:</strong> Any post-approval tamper instantly revokes the seal to INVALIDATED.</li>
          </ul>
        </div>
      </div>

      <h2>The 4-Layer Inspection Protocol Breakdown</h2>
      <div class="grid-2">
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="color: #1E56A0;">Layer 1: Deterministic Campaign Facts & Math</h3>
            <span class="badge badge-blue">DETERMINISTIC</span>
          </div>
          <ul class="bullet-list" style="margin-top: 4px;">
            <li><strong>Discount Verification:</strong> Matches caption and graphic numbers to contract offer % (e.g. 20% vs 30%).</li>
            <li><strong>Date & Expiry Alignment:</strong> Flags expired end dates or mismatches between graphic and calendar.</li>
            <li><strong>Channel Variant Protection:</strong> Checks if an exclusive VIP discount is leaking into public channels.</li>
          </ul>
        </div>

        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="color: #1E56A0;">Layer 2: Cross-Asset Consistency Engine</h3>
            <span class="badge badge-blue">MULTIMODAL AI</span>
          </div>
          <ul class="bullet-list" style="margin-top: 4px;">
            <li><strong>Caption vs Banner vs PDF:</strong> Compares Instagram text with embedded banner text and PDF sheets.</li>
            <li><strong>Specification Verification:</strong> Verifies advertised claims against technical engineering limits.</li>
            <li><strong>Desynchronization Prevention:</strong> Flags when banner graphics say one thing and captions say another.</li>
          </ul>
        </div>
      </div>

      <div class="grid-2" style="margin-top: 6px;">
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="color: #1E56A0;">Layer 3: Brand Rules & Superlatives</h3>
            <span class="badge badge-blue">LEGAL NLP</span>
          </div>
          <ul class="bullet-list" style="margin-top: 4px;">
            <li><strong>Prohibited Terms Detection:</strong> Traps regulatory trigger words ("Miracle", "Cure", "Unbeatable").</li>
            <li><strong>Approved Claim Enforcement:</strong> Ensures pre-approved marketing claims are used verbatim.</li>
            <li><strong>Required Disclaimers:</strong> Enforces mandatory qualifiers ("While supplies last", "Selected models only").</li>
          </ul>
        </div>

        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="color: #1E56A0;">Layer 4: Multimodal Vision & Accessibility</h3>
            <span class="badge badge-blue">OCR & VISION</span>
          </div>
          <ul class="bullet-list" style="margin-top: 4px;">
            <li><strong>OCR Banner Extraction:</strong> Extracts burned-in text and numbers inside PNG/JPEG graphics.</li>
            <li><strong>Visual Contrast Verification:</strong> Tests text legibility against background brightness (WCAG AA).</li>
            <li><strong>Alt-Text & Transparency:</strong> Generates semantic compliance tags for accessibility compliance.</li>
          </ul>
        </div>
      </div>

      <div style="margin-top: 10px;">
        <h2>How We Fix Issues in Real-Time: 1-Click Harmonization</h2>
        <div class="card-success">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <h3 style="color: #065F46;">Automated Reconciliation Engine</h3>
            <span class="badge badge-green">1-CLICK REMEDIATION</span>
          </div>
          <ul class="bullet-list">
            <li><strong>Evidence Grounding:</strong> Shows exact ground truth rule from contract alongside contradictory creative text.</li>
            <li><strong>Suggested Replacements:</strong> System suggests verified copy (e.g. rewrites "24hr cold" to "12hr lab-tested cold").</li>
            <li><strong>1-Click Accept:</strong> Creator or reviewer accepts fixes with one click, immediately recalculating pack hash.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <span>CampaignGuard Architecture Dossier • Section 02: Solution Architecture</span>
      <span>Page 2 of 6</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 3: PROJECT SNAPSHOTS - CAMPAIGNS HUB & TRUTH CONTRACT BUILDER        -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-header">
        <div class="doc-logo">
          <span class="doc-logo-badge">SHIELD-CORE</span>
          CampaignGuard Preflight Protocol
        </div>
        <div class="doc-meta">EXECUTIVE BRIEF • SEC-03 • INTERFACE SNAPSHOTS (PART 1)</div>
      </div>

      <div style="margin-bottom: 10px;">
        <span class="badge badge-blue">UI IMPLEMENTATION SNAPSHOTS</span>
        <h1 style="margin-top: 4px;">Production Interfaces: Hub & Contract Truth</h1>
        <div class="subtitle">
          Real system screen captures demonstrating modular topic segregation and baseline truth establishment.
        </div>
      </div>

      <!-- Snapshot 1: Campaigns Hub -->
      <div style="margin-bottom: 12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
          <h2>1. The Campaigns Hub Directory (/dashboard)</h2>
          <span class="badge badge-dark">LIVE SYSTEM VIEW</span>
        </div>
        <ul class="bullet-list" style="margin-bottom: 4px;">
          <li><strong>Topic Segregation:</strong> Disassembles bloated single-page apps into clean directory cards with status pills.</li>
          <li><strong>Real vs Demo Separation:</strong> Live client campaigns separated from pre-seeded benchmark demo scenario.</li>
        </ul>
        <div class="snapshot-frame">
          <img src="${shotHub}" alt="Campaigns Hub Interface" style="max-height: 190px; object-fit: cover; object-position: top;" />
          <div class="snapshot-caption">
            <span>FIGURE 1.1: CampaignGuard Multi-Campaign Directory & Pre-Seeded Benchmark Hub</span>
            <span>cg.kshitijpro.xyz/dashboard</span>
          </div>
        </div>
      </div>

      <!-- Snapshot 2: Truth Contract Builder -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
          <h2>2. Step 1 • Truth Contract Builder (Brand Lead Persona)</h2>
          <span class="badge badge-blue">STEP 1 • TRUTH BASELINE</span>
        </div>
        <ul class="bullet-list" style="margin-bottom: 4px;">
          <li><strong>Canonical Rules Definition:</strong> Brand Lead sets discount %, expiry dates, approved claims, and prohibited terms.</li>
          <li><strong>Tiered Variants:</strong> Sets channel-specific permissions (e.g. VIP subscribers allowed 30% discount).</li>
        </ul>
        <div class="snapshot-frame">
          <img src="${shotContract}" alt="Truth Contract Builder" style="max-height: 190px; object-fit: cover; object-position: top;" />
          <div class="snapshot-caption">
            <span>FIGURE 1.2: Campaign Contract Editor showing parameters, channel rules & version control</span>
            <span>cg.kshitijpro.xyz/dashboard?tab=contract</span>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <span>CampaignGuard Architecture Dossier • Section 03: Production Snapshots (1/2)</span>
      <span>Page 3 of 6</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 4: PROJECT SNAPSHOTS - CREATIVE STUDIO & 4-LAYER PREFLIGHT REPORT    -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-header">
        <div class="doc-logo">
          <span class="doc-logo-badge">SHIELD-CORE</span>
          CampaignGuard Preflight Protocol
        </div>
        <div class="doc-meta">EXECUTIVE BRIEF • SEC-04 • INTERFACE SNAPSHOTS (PART 2)</div>
      </div>

      <div style="margin-bottom: 10px;">
        <span class="badge badge-blue">UI IMPLEMENTATION SNAPSHOTS</span>
        <h1 style="margin-top: 4px;">Production Interfaces: Creative Studio & AI Audit</h1>
        <div class="subtitle">
          Real system screen captures showing asset submission, automated detection, and cryptographic locking.
        </div>
      </div>

      <!-- Snapshot 3: Creative Studio -->
      <div style="margin-bottom: 12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
          <h2>3. Step 2 • Creative Studio Pack Uploader (Creator Persona)</h2>
          <span class="badge badge-blue">STEP 2 • CREATOR UPLOAD</span>
        </div>
        <ul class="bullet-list" style="margin-bottom: 4px;">
          <li><strong>Multimodal Ingestion:</strong> Ingests social captions, banner graphic assets (PNG/JPEG), and PDF spec sheets.</li>
          <li><strong>Dynamic Hash Computation:</strong> Generates unique cryptographic pack hash upon submission.</li>
        </ul>
        <div class="snapshot-frame">
          <img src="${shotCreator}" alt="Creative Studio Pack Uploader" style="max-height: 185px; object-fit: cover; object-position: top;" />
          <div class="snapshot-caption">
            <span>FIGURE 2.1: Creator Studio with caption input, banner uploader, and spec document ingestion</span>
            <span>cg.kshitijpro.xyz/dashboard?tab=creator</span>
          </div>
        </div>
      </div>

      <!-- Snapshot 4: Findings Report -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
          <h2>4. Step 3 • 4-Layer Preflight Inspection Findings Report</h2>
          <span class="badge badge-red">STEP 3 • AI CONTRADICTION SCAN</span>
        </div>
        <ul class="bullet-list" style="margin-bottom: 4px;">
          <li><strong>Clear Issue Cards:</strong> Discloses contradiction headline, contract ground truth, and suggested replacement.</li>
          <li><strong>1-Click Remediation:</strong> Single click accepts all recommendations and prepares campaign for reviewer lock.</li>
        </ul>
        <div class="snapshot-frame">
          <img src="${shotFindings}" alt="Preflight Inspection Report" style="max-height: 185px; object-fit: cover; object-position: top;" />
          <div class="snapshot-caption">
            <span>FIGURE 2.2: 4-Layer automated findings flagged across Facts, Cross-Asset & Brand Rules</span>
            <span>cg.kshitijpro.xyz/dashboard?tab=findings</span>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <span>CampaignGuard Architecture Dossier • Section 04: Production Snapshots (2/2)</span>
      <span>Page 4 of 6</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 5: MULTIPLE REAL-WORLD TEST SCENARIOS                               -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-header">
        <div class="doc-logo">
          <span class="doc-logo-badge">SHIELD-CORE</span>
          CampaignGuard Preflight Protocol
        </div>
        <div class="doc-meta">EXECUTIVE BRIEF • SEC-05 • ATTACK VECTORS & SCENARIOS</div>
      </div>

      <div style="margin-bottom: 12px;">
        <span class="badge badge-amber">TEST BENCHMARKS</span>
        <h1 style="margin-top: 4px;">Multiple Real-World Scenarios Tested</h1>
        <div class="subtitle">
          Real compliance failure simulations demonstrating CampaignGuard's automated detection and resolution.
        </div>
      </div>

      <!-- Scenario 1 -->
      <div class="card" style="margin-bottom: 8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span class="badge badge-blue">SCENARIO 01</span>
          <h3 style="margin:0; font-size:12px;">Flash Sale Discount Discrepancy & Channel Leak</h3>
          <span class="badge badge-red">LAYER 1: FACTS</span>
        </div>
        <table class="data-table">
          <tr>
            <td style="width: 25%;"><strong>Creative Input</strong></td>
            <td>Creator uploads banner stating "30% OFF Flash Sale" and caption stating "20% OFF".</td>
          </tr>
          <tr>
            <td><strong>Contract Truth</strong></td>
            <td>Contract v1 allows 20% discount for Public, and 30% ONLY for VIP Email Subscribers.</td>
          </tr>
          <tr>
            <td><strong>Engine Finding</strong></td>
            <td><strong>CONTRADICTION:</strong> Banner claims 30% discount on public Instagram feed, exceeding 20% limit.</td>
          </tr>
          <tr>
            <td><strong>Remediation</strong></td>
            <td>System auto-corrects banner reference to 20% or suggests re-routing post to VIP channel.</td>
          </tr>
        </table>
      </div>

      <!-- Scenario 2 -->
      <div class="card" style="margin-bottom: 8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span class="badge badge-blue">SCENARIO 02</span>
          <h3 style="margin:0; font-size:12px;">Scientific Exaggeration vs Engineering Spec Sheet</h3>
          <span class="badge badge-red">LAYER 2: CROSS-ASSET</span>
        </div>
        <table class="data-table">
          <tr>
            <td style="width: 25%;"><strong>Creative Input</strong></td>
            <td>Ad copy claims: "Miracle thermal lock guarantees 24 hours ice cold drinks for everyone!"</td>
          </tr>
          <tr>
            <td><strong>Contract Truth</strong></td>
            <td>Lab spec document certifies cold retention for up to 12 hours under laboratory conditions.</td>
          </tr>
          <tr>
            <td><strong>Engine Finding</strong></td>
            <td><strong>INSUFFICIENT EVIDENCE:</strong> 24-hr claim lacks scientific basis; conflicts with 12-hr spec sheet.</td>
          </tr>
          <tr>
            <td><strong>Remediation</strong></td>
            <td>Copy rewritten to: "Keeps drinks cold for up to 12 hours based on certified thermal tests."</td>
          </tr>
        </table>
      </div>

      <!-- Scenario 3 -->
      <div class="card" style="margin-bottom: 8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span class="badge badge-blue">SCENARIO 03</span>
          <h3 style="margin:0; font-size:12px;">Prohibited Superlatives & Omitted Legal Disclaimers</h3>
          <span class="badge badge-amber">LAYER 3: BRAND RULES</span>
        </div>
        <table class="data-table">
          <tr>
            <td style="width: 25%;"><strong>Creative Input</strong></td>
            <td>Caption uses the prohibited word "Miracle" and lacks mandatory qualification disclaimer.</td>
          </tr>
          <tr>
            <td><strong>Contract Truth</strong></td>
            <td>Contract explicitly forbids "Miracle", "guaranteed", "cure-all"; requires "While stocks last".</td>
          </tr>
          <tr>
            <td><strong>Engine Finding</strong></td>
            <td><strong>PROHIBITED TERM DETECTED:</strong> Word "Miracle" violates Section 43(a) trademark/ad regulations.</td>
          </tr>
          <tr>
            <td><strong>Remediation</strong></td>
            <td>Word "Miracle" stripped; mandatory qualifier "While supplies last on selected items" appended.</td>
          </tr>
        </table>
      </div>

      <!-- Scenario 4 -->
      <div class="card" style="margin-bottom: 4px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span class="badge badge-blue">SCENARIO 04</span>
          <h3 style="margin:0; font-size:12px;">Post-Approval Out-of-Band Asset Tampering</h3>
          <span class="badge badge-red">LAYER 4: CRYPTO REVOCATION</span>
        </div>
        <table class="data-table">
          <tr>
            <td style="width: 25%;"><strong>Attack Simulation</strong></td>
            <td>After Marcus Vance (Reviewer) locks pack with SHA-256 seal, creator edits text to 35% discount.</td>
          </tr>
          <tr>
            <td><strong>Crypto Engine</strong></td>
            <td>Recalculates SHA-256 payload hash of modified assets; compares with registered signature.</td>
          </tr>
          <tr>
            <td><strong>System Action</strong></td>
            <td><strong>INSTANT REVOCATION:</strong> Campaign status switches from APPROVED to INVALIDATED.</td>
          </tr>
          <tr>
            <td><strong>Result</strong></td>
            <td>Distribution blocked, audit log records actor name, timestamp, and unauthorized payload.</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="doc-footer">
      <span>CampaignGuard Architecture Dossier • Section 05: Benchmark Scenarios</span>
      <span>Page 5 of 6</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- PAGE 6: TARGET MARKETS, ROLES & GO-TO-MARKET APPROACH                    -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-header">
        <div class="doc-logo">
          <span class="doc-logo-badge">SHIELD-CORE</span>
          CampaignGuard Preflight Protocol
        </div>
        <div class="doc-meta">EXECUTIVE BRIEF • SEC-06 • TARGET MARKETS & GTM</div>
      </div>

      <div style="margin-bottom: 12px;">
        <span class="badge badge-green">GO-TO-MARKET STRATEGY</span>
        <h1 style="margin-top: 4px;">Target Markets, Stakeholder Personas & Approach</h1>
        <div class="subtitle">
          Defining who buys CampaignGuard, who uses it, and our frictionless enterprise land-and-expand strategy.
        </div>
      </div>

      <!-- Target Markets -->
      <h2>1. Targeted High-Stakes Market Segments</h2>
      <div class="grid-2" style="margin-bottom: 10px;">
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
            <h3 style="color: #1E56A0;">D2C & FMCG Consumer Brands</h3>
            <span class="badge badge-blue">PRIMARY BUYER</span>
          </div>
          <ul class="bullet-list">
            <li><strong>Pain:</strong> High-volume ad creative churn across Meta/TikTok with frequent discount desyncs.</li>
            <li><strong>Value:</strong> Eliminates checkout discount errors, customer churn, and false advertising complaints.</li>
          </ul>
        </div>

        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
            <h3 style="color: #1E56A0;">Regulated Health, Wellness & Cosmetics</h3>
            <span class="badge badge-red">HIGH REGULATORY RISK</span>
          </div>
          <ul class="bullet-list">
            <li><strong>Pain:</strong> Strict FDA, FTC, and ASCI guidelines regarding health claims and product superlatives.</li>
            <li><strong>Value:</strong> Guaranteed adherence to lab-certified claims; prevents multi-million dollar class-actions.</li>
          </ul>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom: 10px;">
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
            <h3 style="color: #1E56A0;">FinTech, Banking & Credit Cards</h3>
            <span class="badge badge-amber">MANDATORY DISCLOSURE</span>
          </div>
          <ul class="bullet-list">
            <li><strong>Pain:</strong> Complex APR rates, cashback caps, and required statutory qualification disclaimers.</li>
            <li><strong>Value:</strong> Ensures mandatory qualifiers are legally compliant across all visual formats.</li>
          </ul>
        </div>

        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
            <h3 style="color: #1E56A0;">Creator Agencies & Influencer Networks</h3>
            <span class="badge badge-green">HIGH VELOCITY</span>
          </div>
          <ul class="bullet-list">
            <li><strong>Pain:</strong> Managing 200+ influencers who write their own rogue copy ignoring brand briefs.</li>
            <li><strong>Value:</strong> Preflight verification tool given to creators before posts go live.</li>
          </ul>
        </div>
      </div>

      <!-- User Roles -->
      <h2>2. Key Stakeholder Personas & Value Delivered</h2>
      <table class="data-table" style="margin-bottom: 10px;">
        <thead>
          <tr>
            <th style="width: 25%;">User Role</th>
            <th style="width: 35%;">Day-to-Day Responsibilities</th>
            <th style="width: 40%;">How CampaignGuard Empowers Them</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Brand Governance Lead</strong><br/><em>(e.g. Priya Sharma)</em></td>
            <td>Sets campaign claims, pricing tiers, legal qualifications, and channel variants.</td>
            <td>Defines canonical Truth Contract once; rules automatically enforce across 1,000s of downstream assets.</td>
          </tr>
          <tr>
            <td><strong>Creative Copywriter / Agency</strong><br/><em>(e.g. Alex Chen)</em></td>
            <td>Drafts ad captions, designs banners, compiles promotional assets.</td>
            <td>Gets instant AI preflight feedback; fixes issues in 1 click without waiting 5 days for legal email back-and-forth.</td>
          </tr>
          <tr>
            <td><strong>Authorised Reviewer / Legal</strong><br/><em>(e.g. Marcus Vance)</em></td>
            <td>Final gatekeeper signing off on promotional material.</td>
            <td>Reviews verifiable evidence; seals approved assets with SHA-256 lock; auto-notified if copy is modified post-sign-off.</td>
          </tr>
        </tbody>
      </table>

      <!-- GTM Strategy -->
      <h2>3. Enterprise Go-to-Market & Approach Strategy</h2>
      <div class="grid-3">
        <div class="card-highlight">
          <span class="badge badge-blue">PHASE 1: LAND</span>
          <h3 style="margin-top:4px;">Agency Sandbox Entry</h3>
          <ul class="bullet-list">
            <li>Offer free preflight audits to top 50 influencer marketing agencies.</li>
            <li>Catch 10+ live compliance contradictions in their client campaigns to prove immediate ROI.</li>
          </ul>
        </div>

        <div class="card-highlight">
          <span class="badge badge-blue">PHASE 2: INTEGRATE</span>
          <h3 style="margin-top:4px;">Workflow Integrations</h3>
          <ul class="bullet-list">
            <li>Direct plugins for <strong>Figma</strong>, <strong>Adobe Creative Cloud</strong>, and <strong>Canva</strong>.</li>
            <li>Slack & Asana webhooks alerting legal teams only when unresolved contradictions exist.</li>
          </ul>
        </div>

        <div class="card-highlight">
          <span class="badge badge-blue">PHASE 3: EXPAND</span>
          <h3 style="margin-top:4px;">Enterprise Governance</h3>
          <ul class="bullet-list">
            <li>Annual software license sold to Brand VPs and Chief Legal Officers as regulatory insurance.</li>
            <li>Cryptographic audit ledger provided to corporate compliance officers during external audits.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <span>CampaignGuard Architecture Dossier • Section 06: Target Markets & GTM</span>
      <span>Page 6 of 6</span>
    </div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'campaign_guard_executive_dossier.html');
const pdfFilePath = path.join(__dirname, 'CampaignGuard_Executive_Dossier.pdf');
const publicPdfPath = path.join(__dirname, 'public', 'CampaignGuard_Executive_Dossier.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML dossier generated successfully at:', htmlFilePath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const executable = fs.existsSync(edgePath) ? edgePath : chromePath;

console.log('Generating vector PDF via browser:', executable);

const cmd = `"${executable}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "file:///${htmlFilePath.replace(/\\\\/g, '/')}"`;
execSync(cmd);

if (fs.existsSync(pdfFilePath)) {
  const stats = fs.statSync(pdfFilePath);
  console.log(`PDF successfully created: ${pdfFilePath} (${stats.size} bytes)`);
  fs.copyFileSync(pdfFilePath, publicPdfPath);
  console.log(`Copied to public directory: ${publicPdfPath}`);
} else {
  console.error('Failed to generate PDF');
  process.exit(1);
}
