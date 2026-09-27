/**
 * CyberShield SMS / Chat Scam Detector Engine
 * Analyzes text messages for fraud patterns, phishing keywords, urgent psychological triggers,
 * remote access requests, and credential stealing phrases.
 */

const SCAM_PATTERNS = [
    {
        category: "Banking & KYC Scam",
        regex: /(kyc|pan\s*card|account\s*(blocked|suspended|deactivated)|verify\s*your|update\s*kyc|sbi|hdfc|icici|axis|bank|debit\s*card|credit\s*card)/i,
        weight: 25,
        riskPhrase: "KYC / Account Suspend Threat"
    },
    {
        category: "OTP & PIN Theft",
        regex: /(otp|one\s*time\s*password|upi\s*pin|cvv|atm\s*pin|share\s*otp|forward\s*sms|verification\s*code)/i,
        weight: 35,
        riskPhrase: "OTP / PIN Theft Attempt"
    },
    {
        category: "Remote Access Hijack",
        regex: /(anydesk|teamviewer|quicksupport|rustdesk|screen\s*share|download\s*app|install\s*apk|remote\s*access)/i,
        weight: 40,
        riskPhrase: "Remote Access / Malware Trap"
    },
    {
        category: "Digital Arrest & Fake Authority",
        regex: /(cbi|customs|delhi\s*police|trai|illegal\s*parcel|narcotics|digital\s*arrest|court\s*notice|arrest\s*warrant|1930)/i,
        weight: 35,
        riskPhrase: "Digital Arrest / Fake Police Coercion"
    },
    {
        category: "Fake Job & Income Scam",
        regex: /(part-time|work\s*from\s*home|daily\s*income|like\s*youtube|telegram\s*group|earned?\s*₹|commission|earn\s*5000)/i,
        weight: 25,
        riskPhrase: "Fake Part-Time Job Offer"
    },
    {
        category: "Lottery & Reward Trap",
        regex: /(congratulations|you\s*won|lucky\s*draw|lottery|claim\s*reward|gift\s*card|kbc|cashback|bonus)/i,
        weight: 30,
        riskPhrase: "Fake Lottery / Reward Claim"
    },
    {
        category: "Utility Bill Disconnection",
        regex: /(electricity|power\s*cut|bill\s*unpaid|disconnected\s*tonight|update\.apk|officer\s*number)/i,
        weight: 30,
        riskPhrase: "Utility Cut-Off SMS Scam"
    },
    {
        category: "Parcel & Customs Trap",
        regex: /(parcel\s*pending|delivery\s*failed|fedex|customs\s*duty|address\s*confirm|package\s*held)/i,
        weight: 25,
        riskPhrase: "Courier / Customs Scam"
    },
    {
        category: "Urgency & Psychological Pressure",
        regex: /(urgent|immediately|within\s*24\s*hours|tonight|final\s*notice|last\s*chance|act\s*now)/i,
        weight: 15,
        riskPhrase: "Artificial Time Urgency"
    }
];

const SUSPICIOUS_WORDS_HIGHLIGHT = [
    "KYC", "blocked", "suspended", "deactivated", "OTP", "PIN", "UPI PIN", "CVV", 
    "AnyDesk", "TeamViewer", "QuickSupport", "update.apk", "lottery", "won", 
    "congratulations", "urgent", "CBI", "Customs", "digital arrest", "refund",
    "earn 5000", "Telegram", "work from home", "electricity disconnected"
];

function analyzeSMSMessage(text) {
    if (!text || !text.trim()) return null;

    let totalScore = 0;
    let detectedCategories = [];
    let detectedRiskPhrases = [];

    SCAM_PATTERNS.forEach(pattern => {
        if (pattern.regex.test(text)) {
            totalScore += pattern.weight;
            if (!detectedCategories.includes(pattern.category)) {
                detectedCategories.push(pattern.category);
            }
            detectedRiskPhrases.push(pattern.riskPhrase);
        }
    });

    // Check for web links inside the message
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(xyz|top|online|site|live|apk|tk|ml))/gi;
    const linksFound = text.match(urlPattern);
    if (linksFound && linksFound.length > 0) {
        totalScore += 25;
        detectedRiskPhrases.push("Contains External Link / APK Download Link");
    }

    const fraudProbability = Math.min(99, Math.max(5, totalScore));
    let verdict = "SAFE";
    let safetyAdvice = "This message appears normal. However, always remain cautious about sharing sensitive data.";

    if (fraudProbability >= 65) {
        verdict = "DANGEROUS";
        safetyAdvice = "DANGER! High probability of scam. Never click links in this message, never share your OTP or UPI PIN, and do not call back the sender.";
    } else if (fraudProbability >= 30) {
        verdict = "SUSPICIOUS";
        safetyAdvice = "CAUTION: This message displays typical scam indicators (urgent demands or suspicious promises). Verify independently with your bank or service provider.";
    }

    // Generate highlighted text HTML
    let highlightedText = escapeHTML(text);
    SUSPICIOUS_WORDS_HIGHLIGHT.forEach(word => {
        const regex = new RegExp(`(${escapeRegExp(word)})`, "gi");
        highlightedText = highlightedText.replace(regex, `<mark class="scam-highlight">$1</mark>`);
    });

    return {
        originalText: text,
        highlightedText: highlightedText,
        fraudProbability,
        verdict,
        detectedCategories,
        detectedRiskPhrases,
        safetyAdvice,
        linksFound: linksFound || []
    };
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
