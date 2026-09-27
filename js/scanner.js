/**
 * CyberShield Link & QR Code Threat Intelligence Engine
 * Performs heuristics analysis on URLs, domain patterns, TLDs, IP links,
 * typosquatting, URL shorteners, and HTTPS protocols.
 */

const SUSPICIOUS_KEYWORDS = [
    "kyc", "update", "verify", "verification", "bank", "account-freeze",
    "lottery", "reward", "prize", "claim", "crypto", "free", "gift", "apk",
    "login-secure", "netbanking", "pan-link", "refund", "support-desk"
];

const SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".live", ".online", ".site", ".club", ".tk", ".ml", ".ga", ".cf", ".gq", ".cc", ".work", ".buzz"
];

const URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly", "goo.gl", "rb.gy", "shorturl.at"
];

const KNOWN_SAFE_DOMAINS = [
    "google.com", "google.co.in", "sbi.co.in", "hdfcbank.com", "icicibank.com", 
    "axisbank.com", "paytm.com", "amazon.in", "amazon.com", "flipkart.com",
    "cybercrime.gov.in", "gov.in", "nic.in", "rbi.org.in"
];

const TYPOSQUAT_PATTERNS = [
    { target: "google", fakes: ["g00gle", "googel", "gogle", "googl"] },
    { target: "sbi", fakes: ["sbii", "sbi-kyc", "statebank-online", "sbi-update"] },
    { target: "hdfc", fakes: ["hdfc-bank", "hdfcc", "hdfc-netbanking"] },
    { target: "icici", fakes: ["icicibank-kyc", "icici-update"] },
    { target: "paytm", fakes: ["paytm-refund", "paytm-kyc", "paytm-cash"] }
];

function analyzeURL(urlString) {
    let url = urlString.trim();
    if (!url) return null;

    // Add protocol if missing for parsing
    let hasExplicitProtocol = true;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        hasExplicitProtocol = false;
        url = "http://" + url;
    }

    let parsed = null;
    try {
        parsed = new URL(url);
    } catch (e) {
        return {
            url: urlString,
            isThreat: true,
            riskScore: 90,
            verdict: "DANGEROUS",
            reasons: ["Malformed or invalid URL structure which often masks malicious destinations."],
            explanation: "Danger: This web link has an invalid or disguised format commonly used to bypass security filters."
        };
    }

    const hostname = parsed.hostname.toLowerCase();
    const fullPath = (parsed.hostname + parsed.pathname + parsed.search).toLowerCase();
    const protocol = parsed.protocol;

    let riskPoints = 0;
    let reasons = [];

    // 1. Check Known Safe Domains
    const isWhitelisted = KNOWN_SAFE_DOMAINS.some(safe => hostname === safe || hostname.endsWith("." + safe));
    if (isWhitelisted && protocol === "https:") {
        return {
            url: urlString,
            isThreat: false,
            riskScore: 5,
            verdict: "SAFE",
            reasons: ["Verified domain belonging to a recognized official organization.", "Secure HTTPS encryption enabled."],
            explanation: "Safe: This website domain is verified and protected by standard HTTPS encryption."
        };
    }

    // 2. Check for Insecure HTTP
    if (protocol === "http:") {
        riskPoints += 25;
        reasons.push("Insecure connection (HTTP instead of HTTPS). Web traffic can be intercepted.");
    }

    // 3. Raw IP Address as Hostname
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipRegex.test(hostname)) {
        riskPoints += 45;
        reasons.push("Uses a numerical IP address instead of a standard domain name. Highly characteristic of phishing servers.");
    }

    // 4. Check Typosquatting & Impersonation
    TYPOSQUAT_PATTERNS.forEach(pat => {
        if (hostname.includes(pat.target) && !isWhitelisted) {
            riskPoints += 35;
            reasons.push(`Contains '${pat.target}' keywords on an unofficial domain, indicating potential brand impersonation.`);
        }
        pat.fakes.forEach(fake => {
            if (hostname.includes(fake)) {
                riskPoints += 40;
                reasons.push(`Detected suspicious brand misspelling pattern ('${fake}').`);
            }
        });
    });

    // 5. Suspicious TLD check
    SUSPICIOUS_TLDS.forEach(tld => {
        if (hostname.endsWith(tld)) {
            riskPoints += 25;
            reasons.push(`Uses a high-risk top-level domain ('${tld}') frequently associated with spam and fraudulent links.`);
        }
    });

    // 6. URL Shortener check
    const isShortener = URL_SHORTENERS.some(short => hostname.includes(short));
    if (isShortener) {
        riskPoints += 20;
        reasons.push("Shortened URL link hides the actual final destination website.");
    }

    // 7. Suspicious Phishing Keywords in URL path
    let matchedKeywords = [];
    SUSPICIOUS_KEYWORDS.forEach(kw => {
        if (fullPath.includes(kw)) {
            matchedKeywords.push(kw);
        }
    });
    if (matchedKeywords.length > 0) {
        riskPoints += (matchedKeywords.length * 15);
        reasons.push(`Contains high-risk scam urgency keywords: ${matchedKeywords.join(", ")}.`);
    }

    // 8. Excessive Subdomains (e.g., sbi.bank.login.verify.domain.com)
    const domainParts = hostname.split('.');
    if (domainParts.length > 3 && !isWhitelisted) {
        riskPoints += 20;
        reasons.push("Contains multiple subdomains used to confuse users into believing it is a legitimate portal.");
    }

    // Final Score Calculation
    const riskScore = Math.min(99, Math.max(10, riskPoints));
    let verdict = "SAFE";
    let explanation = "This link appears to be clean and presents no immediate high-risk threat factors.";

    if (riskScore >= 60) {
        verdict = "DANGEROUS";
        explanation = `Danger: This website exhibits strong signs of phishing. It may be impersonating a bank or company to steal your login credentials or money.`;
    } else if (riskScore >= 30) {
        verdict = "SUSPICIOUS";
        explanation = `Caution: This link has multiple suspicious attributes (e.g. non-standard domain or missing HTTPS). Exercise extreme care before entering details.`;
    }

    return {
        url: urlString,
        isThreat: verdict !== "SAFE",
        riskScore,
        verdict,
        reasons,
        explanation
    };
}
