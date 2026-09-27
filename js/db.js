/**
 * CyberShield Database & State Management
 * Handles localStorage persistence, initial seed data, community threat intelligence,
 * report submission, user progress, and system notifications.
 */

const SEED_TRENDS = [
    {
        id: "trend-1",
        title: "Digital Arrest Fraud",
        badge: "DANGER",
        type: "Police Impersonation",
        date: "Today, 10:15 AM",
        description: "Scammers pose as CBI/Customs officials on video call, threatening fake legal warrants & demanding money transfer to 'clear' charges.",
        advice: "Police or CBI NEVER conduct video call interrogations or demand money online. Hang up immediately!",
        victimCount: 1420
    },
    {
        id: "trend-2",
        title: "APK File Electricity Bill Scam",
        badge: "HIGH RISK",
        type: "Malware SMS",
        date: "Yesterday",
        description: "SMS warning 'Electricity will be disconnected tonight at 9:30 PM due to unpaid bill. Download update.apk'.",
        advice: "Never download .apk files sent via SMS or WhatsApp. Pay utility bills only via official apps.",
        victimCount: 890
    },
    {
        id: "trend-3",
        title: "Part-Time Telegram Like & Earn Scam",
        badge: "DANGER",
        type: "Job Scam",
        date: "2 days ago",
        description: "Offers ₹2,000/day for liking YouTube videos. Later demands deposit money in crypto/fake investment tasks.",
        advice: "Legitimate companies never ask you to pay money to get work or earn commissions.",
        victimCount: 2310
    },
    {
        id: "trend-4",
        title: "Fake Bank KYC Verification SMS",
        badge: "CRITICAL",
        type: "Phishing Link",
        date: "3 days ago",
        description: "SMS claiming bank account is suspended until you complete KYC on fake bank domain link.",
        advice: "Banks never send external web links for KYC verification. Visit your official bank branch or official app.",
        victimCount: 3100
    }
];

const SEED_PHONE_DATABASE = [
    {
        number: "+919876543210",
        risk: "DANGER",
        category: "Digital Arrest / CBI Impersonation",
        reportsCount: 89,
        lastReported: "10 mins ago",
        details: "Caller claimed to be Senior Inspector from Delhi Police. Demanded ₹50,000 via UPI to prevent arrest over fake illegal parcel.",
        upvotes: 74
    },
    {
        number: "+919123456789",
        risk: "DANGER",
        category: "Bank KYC Freeze Scam",
        reportsCount: 145,
        lastReported: "1 hour ago",
        details: "Posed as SBI customer support agent. Urged victim to download AnyDesk app to fix blocked netbanking.",
        upvotes: 120
    },
    {
        number: "+918800112233",
        risk: "SUSPICIOUS",
        category: "Part-Time Telegram Job Offer",
        reportsCount: 24,
        lastReported: "3 hours ago",
        details: "Automated WhatsApp call offering high salary for rating Google Maps locations. Redirects to scam Telegram group.",
        upvotes: 19
    },
    {
        number: "+917001122334",
        risk: "DANGER",
        category: "Courier / Customs Duty Trap",
        reportsCount: 62,
        lastReported: "5 hours ago",
        details: "FedEx impersonation claiming passport/drugs found in package sent to Taiwan. Asks for screen share.",
        upvotes: 52
    }
];

const SEED_REPORTS = [
    {
        id: "REP-2026-8801",
        scamType: "Phishing Link",
        target: "http://sbi-kyc-verification-online.xyz",
        description: "Received SMS stating SBI debit card will be blocked by midnight unless verified at this link.",
        date: "2026-09-26 14:30",
        status: "VERIFIED DANGER",
        upvotes: 42,
        contact: "Anonymous"
    },
    {
        id: "REP-2026-8802",
        scamType: "UPI Payment Scam",
        target: "paytm-refund-desk@upi",
        description: "OLX buyer asked me to scan QR code to RECEIVE advance payment of ₹5,000 for my old sofa. ₹5,000 got deducted instead!",
        date: "2026-09-25 18:10",
        status: "VERIFIED DANGER",
        upvotes: 89,
        contact: "Rahul S."
    },
    {
        id: "REP-2026-8803",
        scamType: "Screen Sharing Fraud",
        target: "+919988776655",
        description: "Gas pipeline customer care scam. Asked me to download TeamViewer QuickSupport to refund ₹10. Lost ₹45,000 from savings account.",
        date: "2026-09-24 11:20",
        status: "VERIFIED DANGER",
        upvotes: 115,
        contact: "Priya M."
    }
];

const SEED_BLACK_UPI = [
    "paytm-refund-desk@upi",
    "sbi-kyc-dept@ybl",
    "cbi-investigation-fine@icici",
    "customs-clearance-official@upi",
    "reward-claim-2026@axl",
    "electricity-bill-pay@okaxis"
];

class CyberShieldDB {
    constructor() {
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem("cybershield_trends")) {
            localStorage.setItem("cybershield_trends", JSON.stringify(SEED_TRENDS));
        }
        if (!localStorage.getItem("cybershield_phones")) {
            localStorage.setItem("cybershield_phones", JSON.stringify(SEED_PHONE_DATABASE));
        }
        if (!localStorage.getItem("cybershield_reports")) {
            localStorage.setItem("cybershield_reports", JSON.stringify(SEED_REPORTS));
        }
        if (!localStorage.getItem("cybershield_black_upi")) {
            localStorage.setItem("cybershield_black_upi", JSON.stringify(SEED_BLACK_UPI));
        }
        if (!localStorage.getItem("cybershield_user_stats")) {
            const initialStats = {
                safetyScore: 88,
                scansPerformed: 12,
                threatsBlocked: 4,
                reportsSubmitted: 1,
                xpPoints: 350,
                badges: ["Shield Cadet", "Link Checker"],
                familyModeEnabled: false,
                familyContacts: [
                    { name: "Father", phone: "+919811223344", status: "Active" }
                ],
                permissions: {
                    camera: true,
                    notifications: true,
                    storage: true,
                    location: false
                },
                language: "en"
            };
            localStorage.setItem("cybershield_user_stats", JSON.stringify(initialStats));
        }
    }

    getTrends() {
        return JSON.parse(localStorage.getItem("cybershield_trends")) || SEED_TRENDS;
    }

    addTrend(trend) {
        const trends = this.getTrends();
        trends.unshift(trend);
        localStorage.setItem("cybershield_trends", JSON.stringify(trends));
    }

    getPhones() {
        return JSON.parse(localStorage.getItem("cybershield_phones")) || SEED_PHONE_DATABASE;
    }

    lookupPhone(number) {
        const clean = number.replace(/\s+/g, '').replace(/-/g, '');
        const phones = this.getPhones();
        return phones.find(p => p.number.replace(/\s+/g, '').includes(clean) || clean.includes(p.number.replace(/\s+/g, '')));
    }

    addPhoneReport(phoneObj) {
        const phones = this.getPhones();
        phones.unshift(phoneObj);
        localStorage.setItem("cybershield_phones", JSON.stringify(phones));
    }

    getReports() {
        return JSON.parse(localStorage.getItem("cybershield_reports")) || SEED_REPORTS;
    }

    addReport(report) {
        const reports = this.getReports();
        reports.unshift(report);
        localStorage.setItem("cybershield_reports", JSON.stringify(reports));

        // Update user stats
        const stats = this.getUserStats();
        stats.reportsSubmitted += 1;
        stats.xpPoints += 50;
        this.saveUserStats(stats);
    }

    getBlackUpi() {
        return JSON.parse(localStorage.getItem("cybershield_black_upi")) || SEED_BLACK_UPI;
    }

    getUserStats() {
        return JSON.parse(localStorage.getItem("cybershield_user_stats"));
    }

    saveUserStats(stats) {
        localStorage.setItem("cybershield_user_stats", JSON.stringify(stats));
    }

    incrementScan(isThreat = false) {
        const stats = this.getUserStats();
        stats.scansPerformed += 1;
        if (isThreat) {
            stats.threatsBlocked += 1;
        } else {
            stats.safetyScore = Math.min(100, stats.safetyScore + 1);
        }
        this.saveUserStats(stats);
    }
}

const db = new CyberShieldDB();
