/**
 * CyberShield Main Application Controller
 * Handles router navigation, UI rendering, canvas gauge animations, modal windows,
 * sample presets, emergency actions, and active screen management.
 */

let activeScreen = "home";
let isMobileFrameMode = false;

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    setupNavigation();
    setupThemeAndLayout();
    updateDashboardScoreGauge();
    loadRecentTrendsFeed();
    bindSampleButtons();
    bindFormListeners();
    updateUserBadgesUI();

    // Check language preference
    const stats = db.getUserStats();
    if (stats.language) {
        setLanguage(stats.language);
        document.getElementById("languageSelect").value = stats.language;
    }
}

// Router Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll("[data-target]");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetScreen = link.getAttribute("data-target");
            switchScreen(targetScreen);
        });
    });

    document.getElementById("languageSelect")?.addEventListener("change", (e) => {
        setLanguage(e.target.value);
    });
}

function switchScreen(screenId) {
    const screens = document.querySelectorAll(".app-screen");
    screens.forEach(s => s.classList.remove("active"));

    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
        target.classList.add("active");
        activeScreen = screenId;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Highlight active nav item
        document.querySelectorAll(".nav-item").forEach(item => {
            if (item.getAttribute("data-target") === screenId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        // Trigger screen-specific refresh
        if (screenId === "home") {
            updateDashboardScoreGauge();
            loadRecentTrendsFeed();
        } else if (screenId === "reports") {
            renderReportsList();
        } else if (screenId === "admin") {
            renderAdminPortal();
        }
    }
}

// Layout & Frame Mode Switcher
function setupThemeAndLayout() {
    const toggleBtn = document.getElementById("toggleLayoutBtn");
    const appWrapper = document.getElementById("appContainer");

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            isMobileFrameMode = !isMobileFrameMode;
            if (isMobileFrameMode) {
                appWrapper.classList.add("mobile-frame-view");
                toggleBtn.innerHTML = `<span>🖥️</span> Desktop View`;
            } else {
                appWrapper.classList.remove("mobile-frame-view");
                toggleBtn.innerHTML = `<span>📱</span> Mobile View`;
            }
        });
    }
}

// Safety Gauge Drawing Function
function updateDashboardScoreGauge() {
    const stats = db.getUserStats();
    const score = stats.safetyScore || 88;

    const scoreDisplay = document.getElementById("scoreValueDisplay");
    const scoreBadge = document.getElementById("scoreBadgeTag");
    const canvas = document.getElementById("scoreGaugeCanvas");

    if (scoreDisplay) scoreDisplay.textContent = score;

    if (scoreBadge) {
        if (score >= 80) {
            scoreBadge.textContent = "STRONG PROTECTION";
            scoreBadge.className = "score-badge safe";
        } else if (score >= 50) {
            scoreBadge.textContent = "MODERATE CAUTION";
            scoreBadge.className = "score-badge caution";
        } else {
            scoreBadge.textContent = "HIGH RISK EXPOSURE";
            scoreBadge.className = "score-badge danger";
        }
    }

    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext("2d");
        const cx = canvas.width / 2;
        const cy = canvas.height / 2 + 10;
        const radius = 65;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Track Background
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI * 0.8, Math.PI * 2.2, false);
        ctx.lineWidth = 12;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineCap = "round";
        ctx.stroke();

        // Progress Arc
        const endAngle = Math.PI * 0.8 + (score / 100) * (Math.PI * 1.4);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI * 0.8, endAngle, false);
        ctx.lineWidth = 12;

        let strokeColor = "#10b981"; // Safe Green
        if (score < 50) strokeColor = "#ef4444"; // Danger Red
        else if (score < 80) strokeColor = "#f59e0b"; // Caution Yellow

        ctx.strokeStyle = strokeColor;
        ctx.lineCap = "round";
        ctx.stroke();
    }
}

// Load Trends Feed
function loadRecentTrendsFeed() {
    const container = document.getElementById("recentTrendsContainer");
    if (!container) return;

    const trends = db.getTrends();
    container.innerHTML = trends.map(t => `
        <div class="trend-card">
            <div class="trend-header">
                <span class="badge ${t.badge === 'DANGER' || t.badge === 'CRITICAL' ? 'badge-danger' : 'badge-caution'}">${t.badge}</span>
                <span class="trend-date">${t.date}</span>
            </div>
            <h4 class="trend-title">${t.title}</h4>
            <p class="trend-desc">${t.description}</p>
            <div class="trend-advice">
                <strong>💡 Safety Advice:</strong> ${t.advice}
            </div>
        </div>
    `).join('');
}

// Preset Action Binding
function bindSampleButtons() {
    // URL Presets
    document.querySelectorAll(".preset-url-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const url = btn.getAttribute("data-url");
            const input = document.getElementById("urlInput");
            if (input) input.value = url;
            runURLScanner();
        });
    });

    // SMS Presets
    document.querySelectorAll(".preset-sms-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const text = btn.getAttribute("data-text");
            const input = document.getElementById("smsInput");
            if (input) input.value = text;
            runSMSChecker();
        });
    });

    // Scanner Submit
    document.getElementById("scanUrlBtn")?.addEventListener("click", runURLScanner);
    document.getElementById("checkSmsBtn")?.addEventListener("click", runSMSChecker);
    document.getElementById("searchPhoneBtn")?.addEventListener("click", runPhoneLookup);
}

// Run URL Scanner
function runURLScanner() {
    const input = document.getElementById("urlInput");
    const resultBox = document.getElementById("urlResultContainer");
    if (!input || !resultBox) return;

    const url = input.value;
    if (!url.trim()) {
        showToast("Please enter a link or URL to analyze.", "warning");
        return;
    }

    const result = analyzeURL(url);
    db.incrementScan(result.isThreat);

    resultBox.style.display = "block";
    resultBox.innerHTML = `
        <div class="result-card ${result.verdict.toLowerCase()}">
            <div class="result-header">
                <span class="verdict-tag ${result.verdict.toLowerCase()}">${result.verdict}</span>
                <span class="risk-score-num">Threat Score: ${result.riskScore}%</span>
            </div>
            <h3 class="result-title">${result.explanation}</h3>
            
            <div class="reasons-list">
                <h4>Analyzed Threat Factors:</h4>
                <ul>
                    ${result.reasons.map(r => `<li>⚠️ ${r}</li>`).join('')}
                </ul>
            </div>

            <div class="action-btn-row">
                <button class="btn btn-outline" onclick="openSafePreviewModal('${encodeURIComponent(result.url)}')">🔍 Open Safely (Sandboxed)</button>
                <button class="btn btn-outline" onclick="copyToClipboard('${encodeURIComponent(result.url)}')">📋 Copy Link</button>
                <button class="btn btn-danger" onclick="triggerFraudAlertModal('${result.verdict}', '${encodeURIComponent(result.explanation)}')">🚨 Trigger Warning Modal</button>
                <button class="btn btn-primary" onclick="quickReportUrl('${encodeURIComponent(result.url)}')">🚩 Report Threat</button>
            </div>
        </div>
    `;

    if (result.isThreat) {
        triggerFraudAlertModal("Phishing Link Detected", result.explanation, "Do not enter your password, PIN, or personal info on this site. Close the browser tab immediately.");
    }
}

// Run SMS Checker
function runSMSChecker() {
    const input = document.getElementById("smsInput");
    const resultBox = document.getElementById("smsResultContainer");
    if (!input || !resultBox) return;

    const text = input.value;
    if (!text.trim()) {
        showToast("Please paste SMS or chat text to analyze.", "warning");
        return;
    }

    const result = analyzeSMSMessage(text);
    db.incrementScan(result.verdict === "DANGEROUS");

    resultBox.style.display = "block";
    resultBox.innerHTML = `
        <div class="result-card ${result.verdict.toLowerCase()}">
            <div class="result-header">
                <span class="verdict-tag ${result.verdict.toLowerCase()}">${result.verdict}</span>
                <span class="risk-score-num">Fraud Probability: ${result.fraudProbability}%</span>
            </div>

            <div class="highlighted-text-box">
                <h4>Text Analysis & Flagged Keywords:</h4>
                <div class="message-content-preview">${result.highlightedText}</div>
            </div>

            <div class="reasons-list">
                <h4>Risk Breakdown:</h4>
                <ul>
                    ${result.detectedRiskPhrases.map(p => `<li>🚨 ${p}</li>`).join('')}
                </ul>
            </div>

            <div class="safety-advice-box">
                <strong>💡 Actionable Safety Guidance:</strong>
                <p>${result.safetyAdvice}</p>
            </div>

            <div class="action-btn-row">
                <button class="btn btn-secondary" onclick="copyToClipboard('${encodeURIComponent(text)}')">📋 Copy Text</button>
                <button class="btn btn-danger" onclick="triggerFraudAlertModal('SMS Scam Warning', '${encodeURIComponent(result.safetyAdvice)}')">🚨 View Alert Card</button>
            </div>
        </div>
    `;

    if (result.verdict === "DANGEROUS") {
        triggerFraudAlertModal("Dangerous Message Alert", "Warning: This message asks for your OTP, PIN, or urgent payment. Banks never ask for OTP or PIN over SMS.", "Do not reply, click any link, or share any verification code.");
    }
}

// Phone Lookup Handler
function runPhoneLookup() {
    const input = document.getElementById("phoneSearchInput");
    const resultBox = document.getElementById("phoneSearchResult");
    if (!input || !resultBox) return;

    const query = input.value;
    const res = searchPhoneNumber(query);

    resultBox.style.display = "block";
    if (res.found) {
        const p = res.record;
        resultBox.innerHTML = `
            <div class="result-card danger">
                <div class="result-header">
                    <span class="verdict-tag danger">${p.risk}</span>
                    <span class="risk-score-num">${p.reportsCount} Community Reports</span>
                </div>
                <h3 class="result-title">Category: ${p.category}</h3>
                <p><strong>Last Reported:</strong> ${p.lastReported}</p>
                <p><strong>Victim Incident Details:</strong> ${p.details}</p>

                <div class="safety-advice-box">
                    <strong>💡 Safety Action:</strong> Block this number immediately. Do not pick up or respond to WhatsApp messages from this sender.
                </div>
            </div>
        `;
    } else {
        resultBox.innerHTML = `
            <div class="result-card safe">
                <div class="result-header">
                    <span class="verdict-tag safe">NO HIGH-RISK REPORTS</span>
                </div>
                <p>${res.message}</p>
                <p><em>${res.suggestion}</em></p>
                <button class="btn btn-primary" style="margin-top: 10px;" onclick="switchScreen('reports')">➕ Report This Phone Number</button>
            </div>
        `;
    }
}

// Fraud Alert Modal Trigger
function triggerFraudAlertModal(title, reason, advice = "Banks & Police NEVER ask for OTP, UPI PIN, or Screen Access.") {
    const modal = document.getElementById("fraudAlertModal");
    if (!modal) return;

    document.getElementById("alertModalTitle").textContent = title;
    document.getElementById("alertModalReason").textContent = decodeURIComponent(reason);
    document.getElementById("alertModalAdvice").textContent = advice;

    modal.style.display = "flex";
}

function closeFraudAlertModal() {
    const modal = document.getElementById("fraudAlertModal");
    if (modal) modal.style.display = "none";
}

// Sandboxed Safe Preview Modal
function openSafePreviewModal(encodedUrl) {
    const url = decodeURIComponent(encodedUrl);
    const modal = document.getElementById("safePreviewModal");
    if (!modal) return;

    document.getElementById("previewUrlText").textContent = url;
    document.getElementById("previewUrlDomain").textContent = new URL(url.startsWith('http') ? url : 'http://' + url).hostname;
    modal.style.display = "flex";
}

function closeSafePreviewModal() {
    const modal = document.getElementById("safePreviewModal");
    if (modal) modal.style.display = "none";
}

// Form Handlers
function bindFormListeners() {
    // Scam Report Form
    const reportForm = document.getElementById("scamReportForm");
    if (reportForm) {
        reportForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const scamType = document.getElementById("reportTypeSelect").value;
            const target = document.getElementById("reportTargetInput").value;
            const desc = document.getElementById("reportDescInput").value;
            const contact = document.getElementById("reportContactInput").value || "Anonymous";

            const newRep = {
                id: "REP-" + Math.floor(100000 + Math.random() * 900000),
                scamType,
                target,
                description: desc,
                date: new Date().toLocaleString(),
                status: "UNDER REVIEW",
                upvotes: 1,
                contact
            };

            db.addReport(newRep);
            showToast("Scam Report successfully submitted to community database! +50 XP Earned.", "success");
            reportForm.reset();
            renderReportsList();
            updateUserBadgesUI();
        });
    }

    // Post-Call Checklist Submit
    document.getElementById("submitChecklistBtn")?.addEventListener("click", () => {
        const answers = {
            q1: document.getElementById("chk_q1")?.checked || false,
            q2: document.getElementById("chk_q2")?.checked || false,
            q3: document.getElementById("chk_q3")?.checked || false,
            q4: document.getElementById("chk_q4")?.checked || false,
            q5: document.getElementById("chk_q5")?.checked || false
        };

        const res = evaluateChecklist(answers);
        const container = document.getElementById("checklistResultContainer");
        if (!container) return;

        container.style.display = "block";
        if (res.countYes > 0) {
            container.innerHTML = `
                <div class="result-card danger">
                    <div class="result-header">
                        <span class="verdict-tag danger">${res.resultTag}</span>
                    </div>
                    <h3>Warning: ${res.countYes} High-Risk Coercion Indicator(s) Detected!</h3>
                    <ul>
                        ${res.dangerTriggers.map(t => `<li><strong>${t.question}</strong><br><span style="color: #ef4444;">${t.warning}</span></li>`).join('')}
                    </ul>
                    <div class="action-btn-row">
                        <a href="tel:1930" class="btn btn-danger">📞 Call 1930 Cyber Crime Helpline Immediately</a>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="result-card safe">
                    <div class="result-header">
                        <span class="verdict-tag safe">NO COERCION DETECTED</span>
                    </div>
                    <p>Great! You did not identify any typical scam phone tactics. Continue maintaining general caution.</p>
                </div>
            `;
        }
    });
}

// Render Reports List
function renderReportsList() {
    const listContainer = document.getElementById("communityReportsList");
    if (!listContainer) return;

    const reports = db.getReports();
    listContainer.innerHTML = reports.map(r => `
        <div class="report-card">
            <div class="report-meta">
                <span class="badge badge-warning">${r.scamType}</span>
                <span class="report-date">${r.date}</span>
            </div>
            <h4 class="report-target">Target: <code>${r.target}</code></h4>
            <p class="report-desc">${r.description}</p>
            <div class="report-footer">
                <span>Reporter: ${r.contact}</span>
                <span class="badge ${r.status.includes('DANGER') ? 'badge-danger' : 'badge-info'}">${r.status}</span>
            </div>
        </div>
    `).join('');
}

// Admin Portal Renderer
function renderAdminPortal() {
    const adminContainer = document.getElementById("adminPortalContent");
    if (!adminContainer) return;

    const reports = db.getReports();
    adminContainer.innerHTML = `
        <div class="admin-dashboard-grid">
            <div class="admin-stat-card">
                <h3>Total Reports</h3>
                <div class="stat-number">${reports.length}</div>
            </div>
            <div class="admin-stat-card">
                <h3>Verified Blacklisted Handles</h3>
                <div class="stat-number">${db.getBlackUpi().length}</div>
            </div>
        </div>
        <h3 style="margin-top:20px;">Moderate Community Submissions</h3>
        <div class="reports-moderation-list">
            ${reports.map(r => `
                <div class="admin-moderation-row">
                    <div>
                        <strong>${r.scamType}: ${r.target}</strong>
                        <p>${r.description}</p>
                    </div>
                    <div>
                        <button class="btn btn-outline" onclick="showToast('Report verified and added to global threat feed.', 'success')">Approve & Publish</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Update User XP & Badges UI
function updateUserBadgesUI() {
    const stats = db.getUserStats();
    const newBadge = checkAndAwardBadges(stats);

    const xpDisplay = document.getElementById("userXpDisplay");
    if (xpDisplay) xpDisplay.textContent = `${stats.xpPoints} XP`;

    const badgesContainer = document.getElementById("userBadgesList");
    if (badgesContainer) {
        badgesContainer.innerHTML = stats.badges.map(bName => `
            <span class="badge-item" title="Earned Badge">🏅 ${bName}</span>
        `).join('');
    }

    if (newBadge) {
        showToast(`🎉 Congratulations! You unlocked the '${newBadge.name}' badge!`, "success");
    }
}

// Helper Utilities
function showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("show");
    }, 50);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function copyToClipboard(encodedText) {
    const text = decodeURIComponent(encodedText);
    navigator.clipboard.writeText(text).then(() => {
        showToast("Copied to clipboard!", "success");
    }).catch(() => {
        showToast("Copied!", "success");
    });
}

function quickReportUrl(encodedUrl) {
    const url = decodeURIComponent(encodedUrl);
    switchScreen("reports");
    const targetInput = document.getElementById("reportTargetInput");
    if (targetInput) targetInput.value = url;
}
