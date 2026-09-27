/**
 * CyberShield Academy & Gamified Cyber Safety Learning System
 */

const ACADEMY_LESSONS = [
    {
        id: "lesson-1",
        title: "Fake Links & Phishing Scams",
        category: "Web Safety",
        icon: "🔗",
        time: "3 min read",
        overview: "Learn how scammers clone bank portals and government websites to steal your credentials.",
        content: `
            <h4>What is Phishing?</h4>
            <p>Phishing is a fraudulent attempt to obtain sensitive information such as usernames, passwords, and credit card details by disguising as a trustworthy entity in electronic communications.</p>
            
            <div class="rule-box danger">
                <strong>Golden Rules to Spot Fake Links:</strong>
                <ul>
                    <li>Check domain spelling: Look for <code>g00gle.com</code> or <code>sbi-kyc-verify.online</code> instead of <code>sbi.co.in</code>.</li>
                    <li>Verify HTTPS: Never enter sensitive passwords on HTTP (insecure) sites.</li>
                    <li>Beware of URL Shorteners: Shortened links like <code>bit.ly</code> mask the true destination.</li>
                </ul>
            </div>
        `,
        quiz: [
            {
                question: "Which of the following domain names is the official SBI bank domain?",
                options: [
                    "http://sbi-kyc-verification-update.xyz",
                    "https://www.sbi.co.in",
                    "http://statebankofindia-netbanking.online",
                    "https://sbi-login.bit.ly"
                ],
                correct: 1,
                explanation: "https://www.sbi.co.in is the official domain. Scammers create misleading names with extra words like 'kyc-update' or '.xyz' TLDs."
            },
            {
                question: "What should you do if an SMS demands you update KYC immediately on a web link?",
                options: [
                    "Click the link and fill details quickly to avoid account blockage.",
                    "Forward the link to friends to check if it's real.",
                    "Ignore the link and contact your bank through official branch/app.",
                    "Reply to the SMS asking if it's fake."
                ],
                correct: 2,
                explanation: "Banks NEVER send SMS links for KYC updates. Always use official bank apps or visit your local branch."
            }
        ]
    },
    {
        id: "lesson-2",
        title: "OTP & KYC Update Fraud",
        category: "Banking Safety",
        icon: "🔐",
        time: "4 min read",
        overview: "Understand why sharing OTPs and UPI PINs leads to instant financial loss.",
        content: `
            <h4>The OTP & PIN Rule</h4>
            <p>An OTP (One-Time Password) acts as your digital signature for authorizing payments and account transfers.</p>

            <div class="rule-box danger">
                <strong>CRITICAL FACT:</strong>
                <p>No Bank official, Police officer, or Customer Care representative will EVER ask you for your OTP, UPI PIN, or ATM PIN.</p>
            </div>
        `,
        quiz: [
            {
                question: "When receiving money via UPI, when do you need to enter your UPI PIN?",
                options: [
                    "Always enter PIN to receive money.",
                    "Only when receiving amounts greater than ₹1,000.",
                    "NEVER! Entering a UPI PIN ALWAYS deducts money from your bank account.",
                    "Only if scanning a QR code."
                ],
                correct: 2,
                explanation: "Remember: You NEVER enter a UPI PIN to receive money. Entering your PIN ALWAYS authorizes a deduction from your account!"
            }
        ]
    },
    {
        id: "lesson-3",
        title: "Digital Arrest & Fake Police Scams",
        category: "Coercion & Impersonation",
        icon: "⚖️",
        time: "4 min read",
        overview: "Scammers pretend to be CBI/Customs/Police officers threatening immediate arrest via video call.",
        content: `
            <h4>What is a 'Digital Arrest' Scam?</h4>
            <p>Frauds call victims claiming a suspicious parcel containing drugs/fake passports was seized in their name. They force victims into Skype/WhatsApp video calls wearing fake uniforms and demand 'security deposits'.</p>

            <div class="rule-box info">
                <strong>Government Reality Check:</strong>
                <p>There is NO concept of 'Digital Arrest' in Indian law or global policing. Police will NEVER demand money via online video calls.</p>
            </div>
        `,
        quiz: [
            {
                question: "If a caller claims to be a CBI officer on WhatsApp video call threatening arrest over a courier, what should you do?",
                options: [
                    "Pay the demanded settlement fee immediately.",
                    "Disconnect the call, do not panic, and report to 1930 / local police.",
                    "Show them your bank account balance to prove innocence.",
                    "Stay on the call for 5 hours without telling family."
                ],
                correct: 1,
                explanation: "Law enforcement does not conduct video call arrests or demand money. Disconnect immediately and call 1930."
            }
        ]
    },
    {
        id: "lesson-4",
        title: "Screen Sharing & Remote Access Hijacking",
        category: "Device Security",
        icon: "📱",
        time: "3 min read",
        overview: "How apps like AnyDesk & TeamViewer allow fraudsters to view your banking PINs.",
        content: `
            <h4>Remote Access Apps Threat</h4>
            <p>Scammers pose as gas, electricity, or customer support helpline agents and instruct victims to install apps like AnyDesk or QuickSupport under the pretext of 'refunding ₹10'.</p>
        `,
        quiz: [
            {
                question: "What happens when you grant remote screen access to an unknown caller?",
                options: [
                    "They can view everything on your screen, including banking apps, OTPs, and passwords.",
                    "It speeds up your internet connection.",
                    "It securely refunds your money.",
                    "It protects your phone from viruses."
                ],
                correct: 0,
                explanation: "Screen sharing gives remote callers complete visibility and control over your device and banking apps!"
            }
        ]
    }
];

const BADGES = [
    { name: "Shield Cadet", reqXP: 100, icon: "🛡️", desc: "Started your cyber safety journey" },
    { name: "Link Checker", reqXP: 250, icon: "🔍", desc: "Mastered phishing URL detection" },
    { name: "Scam Hunter", reqXP: 500, icon: "🎯", desc: "Reported threats & helped the community" },
    { name: "Fraud Guardian", reqXP: 750, icon: "⚔️", desc: "Completed 3 Cyber Safety Academy lessons" },
    { name: "Cyber Master", reqXP: 1000, icon: "👑", desc: "Achieved top cyber resilience score" }
];

function checkAndAwardBadges(userStats) {
    let updatedBadges = [...userStats.badges];
    let newBadgeAwarded = null;

    BADGES.forEach(b => {
        if (userStats.xpPoints >= b.reqXP && !updatedBadges.includes(b.name)) {
            updatedBadges.push(b.name);
            newBadgeAwarded = b;
        }
    });

    if (newBadgeAwarded) {
        userStats.badges = updatedBadges;
        db.saveUserStats(userStats);
    }

    return newBadgeAwarded;
}
