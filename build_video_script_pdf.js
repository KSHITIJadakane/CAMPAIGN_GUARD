const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Building CampaignGuard Video Presentation Script PDF ===');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CampaignGuard — Official Video Presentation Script for Judges</title>
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #17202a;
      background: #f8fafc;
      -webkit-font-smoothing: antialiased;
      line-height: 1.45;
    }
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 14mm 16mm 12mm 16mm;
      position: relative;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #0f766e;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .title-area h1 {
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .title-area p {
      font-size: 11px;
      color: #475569;
      font-weight: 500;
      margin-top: 2px;
    }
    .meta-badge {
      text-align: right;
    }
    .meta-badge .badge {
      display: inline-block;
      background: #0f766e;
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .meta-badge .sub {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 2px;
      font-family: monospace;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #64748b;
      font-family: monospace;
    }

    /* Cards & Layout */
    .overview-box {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 12px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .overview-item {
      font-size: 10.5px;
    }
    .overview-item .label {
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .overview-item .val {
      font-weight: 700;
      color: #0f172a;
      margin-top: 1px;
    }

    .scene-card {
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      margin-bottom: 11px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .scene-header {
      background: #0f172a;
      color: #ffffff;
      padding: 5px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .scene-title {
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .scene-timing {
      font-size: 10px;
      font-family: monospace;
      background: #1e293b;
      padding: 2px 7px;
      border-radius: 3px;
      color: #38bdf8;
      font-weight: 700;
    }
    .scene-grid {
      display: grid;
      grid-template-columns: 42% 58%;
      border-top: 1px solid #e2e8f0;
    }
    .screen-col {
      padding: 9px 11px;
      background: #f8fafc;
      border-right: 1px solid #e2e8f0;
      font-size: 10.5px;
    }
    .voice-col {
      padding: 9px 12px;
      background: #ffffff;
      font-size: 10.5px;
    }
    .col-label {
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .label-screen { color: #0284c7; }
    .label-voice { color: #0f766e; }

    .action-step {
      margin-bottom: 5px;
      line-height: 1.35;
    }
    .action-step strong {
      color: #0f172a;
    }
    .click-target {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 1px 5px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 9.5px;
      font-weight: 700;
      border: 1px solid #bae6fd;
    }
    .spoken-text {
      color: #1e293b;
      line-height: 1.45;
      font-size: 10.5px;
    }
    .spoken-text strong {
      color: #0f766e;
      font-weight: 700;
    }
    .pro-tip {
      margin-top: 6px;
      padding: 4px 8px;
      background: #fef3c7;
      border-left: 3px solid #f59e0b;
      border-radius: 2px;
      font-size: 9.5px;
      color: #92400e;
    }

    .key-takeaway {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 6px;
      font-size: 10px;
      color: #166534;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .key-takeaway strong {
      color: #15803d;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: TITLE, PREPARATION & SCENES 1-2 -->
  <div class="page">
    <div>
      <div class="header">
        <div class="title-area">
          <h1>🛡️ CampaignGuard — 2 to 3-Min Video Pitch Script</h1>
          <p>Presenter Guide for Roopam • Clean, Natural, Catchy Delivery for Hackathon Judges</p>
        </div>
        <div class="meta-badge">
          <span class="badge">Official Demo Script</span>
          <div class="sub">TARGET DURATION: 2:45 MIN</div>
        </div>
      </div>

      <!-- Quick Briefing Box -->
      <div class="overview-box">
        <div class="overview-item">
          <div class="label">Primary Speaker</div>
          <div class="val">Roopam (Presenting)</div>
        </div>
        <div class="overview-item">
          <div class="label">Live URL</div>
          <div class="val">cg.kshitijpro.xyz</div>
        </div>
        <div class="overview-item">
          <div class="label">Video Style</div>
          <div class="val">Screen Share + Voiceover</div>
        </div>
        <div class="overview-item">
          <div class="label">Tone & Energy</div>
          <div class="val">Confident, Clear, Engaging</div>
        </div>
      </div>

      <!-- Preparation Checklist -->
      <div style="background: #e0f2fe; border: 1px solid #7dd3fc; border-radius: 6px; padding: 7px 11px; margin-bottom: 11px; font-size: 10px; color: #0369a1;">
        <strong>Quick Setup for Roopam Before Recording:</strong> 
        1. Open Chrome at <span class="click-target">https://cg.kshitijpro.xyz</span>. 
        2. Set browser zoom to 100% or 110% for crisp readability. 
        3. Keep this script handy on a second screen or side window. 
        4. Move the mouse cursor smoothly — no fast jerking.
      </div>

      <!-- SCENE 1 -->
      <div class="scene-card">
        <div class="scene-header">
          <div class="scene-title">🎬 Scene 1: The Problem & The Solution (The Hook)</div>
          <div class="scene-timing">0:00 – 0:25 (25s)</div>
        </div>
        <div class="scene-grid">
          <div class="screen-col">
            <div class="col-label label-screen">🖥️ Screen Action (Where to look & click)</div>
            <div class="action-step">
              1. Start on the homepage at <span class="click-target">https://cg.kshitijpro.xyz</span>.
            </div>
            <div class="action-step">
              2. Keep cursor over the headline: <em>"Automated Pre-Publication Preflight Review"</em>.
            </div>
            <div class="action-step">
              3. Slowly scroll down past the three feature pills to show the clean UI.
            </div>
            <div class="pro-tip">
              💡 <strong>Roopam's Cue:</strong> Start with a warm, energetic voice. Hook the judges immediately with the real-world pain point.
            </div>
          </div>
          <div class="voice-col">
            <div class="col-label label-voice">🎙️ Spoken Voiceover (What to say)</div>
            <p class="spoken-text">
              "Hi judges! Every marketing team knows this nightmare: a Brand Manager approves a <strong>20% seasonal discount</strong>, but the creator uploads a banner claiming <strong>50% off</strong>, or uses illegal superlatives like <em>'miracle cure'</em>. By the time legal catches it, thousands in revenue and customer trust are already lost."
              <br><br>
              "Meet <strong>CampaignGuard</strong> — an enterprise-grade preflight verification system that automatically audits marketing campaigns against human-truth contracts <strong>before anything goes live</strong>."
            </p>
          </div>
        </div>
      </div>

      <!-- SCENE 2 -->
      <div class="scene-card">
        <div class="scene-header">
          <div class="scene-title">🎯 Scene 2: Live Visual OCR Sandbox & 1-Click Auto-Fix</div>
          <div class="scene-timing">0:25 – 0:55 (30s)</div>
        </div>
        <div class="scene-grid">
          <div class="screen-col">
            <div class="col-label label-screen">🖥️ Screen Action (Where to look & click)</div>
            <div class="action-step">
              1. Scroll down smoothly to the section titled: <span class="click-target">#demo Test Campaign Preflight</span>.
            </div>
            <div class="action-step">
              2. Point cursor to the left box: <strong>"Mandated Discount: 20% OFF"</strong>.
            </div>
            <div class="action-step">
              3. Point to the middle graphic banner: highlight the <strong>pulsing red bounding box with target crosshairs</strong> framing <span class="click-target">30% OFF EVERYTHING</span>.
            </div>
            <div class="action-step">
              4. Click <span class="click-target">Auto-Fix Identified Violations</span>.
            </div>
            <div class="action-step">
              5. Watch the red box turn into a green checkmark: <span class="click-target">✓ #1 RECONCILED: 20% OFF</span>.
            </div>
          </div>
          <div class="voice-col">
            <div class="col-label label-voice">🎙️ Spoken Voiceover (What to say)</div>
            <p class="spoken-text">
              "Let’s see it in action right on our homepage sandbox. On the left is our canonical <strong>Brand Truth Contract</strong> — mandating a strict 20% discount. In the center is the submitted creative."
              <br><br>
              "Notice how our <strong>Visual OCR engine</strong> doesn't just read the text — it spatially pinpoints the fault with <strong>target bounding crosshairs</strong> framing <em>'30% OFF'</em>! No guessing where the error is."
              <br><br>
              "Now watch this: I click <strong>'Auto-Fix'</strong>. In less than half a second, the contradiction is reconciled, the banner copy is corrected to 20%, and the bounding box turns <strong>emerald green</strong>. Zero manual back-and-forth."
            </p>
          </div>
        </div>
      </div>

    </div>

    <div class="footer">
      <span>CampaignGuard • Hackathon Round 3 Video Script</span>
      <span>Page 1 of 3</span>
      <span>Live URL: https://cg.kshitijpro.xyz</span>
    </div>
  </div>

  <!-- PAGE 2: SCENES 3 & 4 -->
  <div class="page">
    <div>
      <div class="header">
        <div class="title-area">
          <h1>🛡️ CampaignGuard — Video Pitch Script (Continued)</h1>
          <p>Core Round 3 Features: Multi-Role RBAC & Visual Change Orders</p>
        </div>
        <div class="meta-badge">
          <span class="badge">Scenes 3 & 4</span>
          <div class="sub">ELAPSED: 0:55 – 2:05</div>
        </div>
      </div>

      <!-- SCENE 3 -->
      <div class="scene-card">
        <div class="scene-header">
          <div class="scene-title">👥 Scene 3: Enterprise RBAC & Tokenized Invite Links</div>
          <div class="scene-timing">0:55 – 1:30 (35s)</div>
        </div>
        <div class="scene-grid">
          <div class="screen-col">
            <div class="col-label label-screen">🖥️ Screen Action (Where to look & click)</div>
            <div class="action-step">
              1. Scroll to top navbar and click <span class="click-target">Go to Dashboard</span>.
            </div>
            <div class="action-step">
              2. On <span class="click-target">/dashboard</span>, click the first campaign card: <strong>"EcoSip Spring Launch"</strong>.
            </div>
            <div class="action-step">
              3. Scroll down to the <strong>Campaign Team & Invites</strong> card.
            </div>
            <div class="action-step">
              4. Click <span class="click-target">+ Invite Member</span> button.
            </div>
            <div class="action-step">
              5. Select Role: <span class="click-target">Reviewer</span>, enter an email, and click <strong>Generate</strong>.
            </div>
            <div class="action-step">
              6. Show the generated tokenized invite link with its 7-day expiration.
            </div>
          </div>
          <div class="voice-col">
            <div class="col-label label-voice">🎙️ Spoken Voiceover (What to say)</div>
            <p class="spoken-text">
              "Now let’s jump into our <strong>Campaign Governance Hub</strong>. In enterprise production, you cannot have creators approving their own work or visitors impersonating executives."
              <br><br>
              "Here in <strong>EcoSip Spring Launch</strong>, as a Brand Manager, I can generate a <strong>cryptographically tokenized invitation link</strong> for a Reviewer. Each token is single-use, expires in 7 days, and is strictly bound to the campaign."
              <br><br>
              "Even better: our server enforces <strong>Membership Roster Verification</strong>. Even if a malicious user alters their request payload to say 'Reviewer', the server checks the roster and rejects them with an HTTP 403 Forbidden. Total security."
            </p>
          </div>
        </div>
      </div>

      <!-- SCENE 4 -->
      <div class="scene-card">
        <div class="scene-header">
          <div class="scene-title">📋 Scene 4: Evidence-Linked Change Orders & Creator Revision</div>
          <div class="scene-timing">1:30 – 2:05 (35s)</div>
        </div>
        <div class="scene-grid">
          <div class="screen-col">
            <div class="col-label label-screen">🖥️ Screen Action (Where to look & click)</div>
            <div class="action-step">
              1. In the campaign view, scroll to the <strong>Visual Creative Asset Annotations</strong> section.
            </div>
            <div class="action-step">
              2. Point to the visual hotspot boxes: <strong>#1 (50% vs 20%)</strong> and <strong>#2 (Missing Disclaimer)</strong>.
            </div>
            <div class="action-step">
              3. Click on Hotspot Box #1 — watch the screen smoothly scroll and highlight the exact finding!
            </div>
            <div class="action-step">
              4. Scroll down to the <strong>Grouped Change Order Panel</strong> assigned to Marcus Vance.
            </div>
            <div class="action-step">
              5. Point out the 4 issues and click <span class="click-target">Auto-Fix & Submit Revision 2</span>.
            </div>
          </div>
          <div class="voice-col">
            <div class="col-label label-voice">🎙️ Spoken Voiceover (What to say)</div>
            <p class="spoken-text">
              "When an asset fails preflight, CampaignGuard doesn't leave you with a generic error list. It automatically generates an <strong>interactive visual annotation overlay</strong>."
              <br><br>
              "Clicking any red hotspot immediately jumps to the exact contract evidence citation. The system groups all detected issues into a formal <strong>Creative Change Order</strong> assigned directly to the creator."
              <br><br>
              "When the creator uploads their revision, our automated re-analysis runs instantly — marking all four issues as <strong>RESOLVED</strong> and moving the campaign into <strong>Revision 2</strong>, ready for review."
            </p>
          </div>
        </div>
      </div>

      <!-- Mini Takeaway Box -->
      <div class="key-takeaway">
        <span>💡</span>
        <div>
          <strong>Judges' Key Takeaway:</strong> CampaignGuard turns messy Slack and email feedback into a structured, trackable, audit-backed creative revision lifecycle.
        </div>
      </div>

    </div>

    <div class="footer">
      <span>CampaignGuard • Hackathon Round 3 Video Script</span>
      <span>Page 2 of 3</span>
      <span>Live URL: https://cg.kshitijpro.xyz</span>
    </div>
  </div>

  <!-- PAGE 3: SCENES 5, 6 & CLOSING -->
  <div class="page">
    <div>
      <div class="header">
        <div class="title-area">
          <h1>🛡️ CampaignGuard — Video Pitch Script (Conclusion)</h1>
          <p>Cryptographic Sealing, Tamper Invalidation & Executive Analytics</p>
        </div>
        <div class="meta-badge">
          <span class="badge">Scenes 5 & 6</span>
          <div class="sub">ELAPSED: 2:05 – 2:45</div>
        </div>
      </div>

      <!-- SCENE 5 -->
      <div class="scene-card">
        <div class="scene-header">
          <div class="scene-title">🔒 Scene 5: Authorized Reviewer Seal (SHA-256) & Tamper Demo</div>
          <div class="scene-timing">2:05 – 2:30 (25s)</div>
        </div>
        <div class="scene-grid">
          <div class="screen-col">
            <div class="col-label label-screen">🖥️ Screen Action (Where to look & click)</div>
            <div class="action-step">
              1. In the top role switcher, switch to <span class="click-target">Reviewer (Taylor Morgan)</span>.
            </div>
            <div class="action-step">
              2. Scroll down to the <strong>Reviewer Approval Panel</strong>.
            </div>
            <div class="action-step">
              3. Click <span class="click-target">Authorize & Seal Revision 2</span> -> point out the <strong>SHA-256 hash</strong> (e.g. <code>803f336a...</code>).
            </div>
            <div class="action-step">
              4. Click <span class="click-target">Simulate Tamper</span> -> point out the red alert: <strong>TAMPER_DETECTED / INVALIDATED</strong>!
            </div>
            <div class="action-step">
              5. Click <span class="click-target">1-Click Auto-Fix</span> to restore the valid sealed state.
            </div>
          </div>
          <div class="voice-col">
            <div class="col-label label-voice">🎙️ Spoken Voiceover (What to say)</div>
            <p class="spoken-text">
              "Now for the ultimate security gate. Only an authorized Reviewer can lock an asset. I switch to Taylor Morgan, our Reviewer, and click <strong>'Authorize & Seal'</strong>."
              <br><br>
              "CampaignGuard generates an immutable <strong>SHA-256 cryptographic seal</strong>. But what happens if someone modifies the asset copy after legal approval? Let's click <strong>'Simulate Tamper'</strong>."
              <br><br>
              "Boom! The cryptographic hash mismatches immediately! The status flashes <strong>INVALIDATED</strong>, and the tamper attempt is logged to the audit trail. With our <strong>1-Click Fix</strong>, we instantly restore compliance."
            </p>
          </div>
        </div>
      </div>

      <!-- SCENE 6 -->
      <div class="scene-card">
        <div class="scene-header">
          <div class="scene-title">📊 Scene 6: Cross-Campaign Governance Analytics & Pitch Close</div>
          <div class="scene-timing">2:30 – 2:45 (15s)</div>
        </div>
        <div class="scene-grid">
          <div class="screen-col">
            <div class="col-label label-screen">🖥️ Screen Action (Where to look & click)</div>
            <div class="action-step">
              1. Click on the <strong>Analytics</strong> tab or scroll to the top of <span class="click-target">/dashboard</span>.
            </div>
            <div class="action-step">
              2. Point cursor over the <strong>5 Standardized KPI Cards</strong>:
                • <em>Campaigns Audited: 3</em>
                • <em>Confirmed Violations: 7</em>
                • <em>First-Pass Compliance: 100%</em>
                • <em>Avg Revision Velocity: 1.3 Rounds</em>
                • <em>Sealed Vaults: 1</em>
            </div>
            <div class="action-step">
              3. Scroll up to show the live URL: <span class="click-target">cg.kshitijpro.xyz</span>.
            </div>
          </div>
          <div class="voice-col">
            <div class="col-label label-voice">🎙️ Spoken Voiceover (What to say)</div>
            <p class="spoken-text">
              "Finally, executives get real-time compliance oversight through our <strong>Governance Analytics Dashboard</strong> — tracking 5 unified KPIs across all brand campaigns."
              <br><br>
              "CampaignGuard transforms marketing from stressful manual reviews into a <strong>provable, tamper-evident, automated pipeline</strong>."
              <br><br>
              "With <strong>31 automated test assertions passing</strong>, zero cold starts, and full mobile responsiveness, CampaignGuard is enterprise-ready and live today at <strong>cg.kshitijpro.xyz</strong>. Thank you!"
            </p>
          </div>
        </div>
      </div>

      <!-- Final Winning Checklist -->
      <div style="background: #0f172a; color: #ffffff; border-radius: 6px; padding: 10px 14px; margin-top: 6px; font-size: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: #38bdf8;">Roopam's Winning Sign-off Checklist:</strong>
          <span style="color: #94a3b8; margin-left: 8px;">Keep total time under 3:00 • Clear mic audio • Smile at the end!</span>
        </div>
        <div style="background: #0f766e; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-family: monospace;">
          END OF SCRIPT • ~2:45 MIN
        </div>
      </div>

    </div>

    <div class="footer">
      <span>CampaignGuard • Hackathon Round 3 Video Script</span>
      <span>Page 3 of 3</span>
      <span>Live URL: https://cg.kshitijpro.xyz</span>
    </div>
  </div>

</body>
</html>
`;

// Write HTML file
const htmlPath = path.resolve('CampaignGuard_Video_Script_For_Judges.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log(`✓ Wrote HTML file: ${htmlPath} (${htmlContent.length} bytes)`);

// Convert HTML to PDF using headless Chrome
const pdfPath = path.resolve('CampaignGuard_Video_Script_For_Judges.pdf');
const publicPdfPath = path.resolve('public/CampaignGuard_Video_Script_For_Judges.pdf');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const printCmd = `"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
console.log('Generating PDF via headless Chrome...');
try {
  execSync(printCmd, { stdio: 'inherit' });
  if (fs.existsSync(pdfPath)) {
    const size = fs.statSync(pdfPath).size;
    console.log(`✓ Generated PDF: ${pdfPath} (${size} bytes)`);
    // Copy to public directory so it can be viewed directly online
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

console.log('=== Video Script PDF Build Complete ===');
