/**
 * CyberShield Scam Call Lookup & Post-Call Safety Checklist Module
 */

function searchPhoneNumber(phoneInput) {
    if (!phoneInput || phoneInput.trim().length < 5) {
        return {
            searched: phoneInput,
            found: false,
            message: "Please enter a valid phone number (e.g. +91 98765 43210 or 9876543210)."
        };
    }

    const record = db.lookupPhone(phoneInput);
    if (record) {
        return {
            searched: phoneInput,
            found: true,
            record: record
        };
    } else {
        return {
            searched: phoneInput,
            found: false,
            message: "No negative community reports found for this specific number yet. Exercise standard caution.",
            suggestion: "If this caller asked for OTP, PIN, money, or screen access, report it now to protect others."
        };
    }
}

// Post-Call Safety Checklist Logic
const POST_CALL_QUESTIONS = [
    {
        id: "q1",
        question: "Did the caller ask for your OTP, Banking Password, or UPI PIN?",
        riskIfYes: "CRITICAL DANGER: Banks and Police NEVER ask for OTP or PIN. If shared, immediately block your bank card and call 1930."
    },
    {
        id: "q2",
        question: "Did the caller instruct you to download AnyDesk, TeamViewer, or QuickSupport?",
        riskIfYes: "HIGH RISK: Screen sharing apps grant scammers full remote control of your phone and bank apps."
    },
    {
        id: "q3",
        question: "Did they claim you are under 'Digital Arrest' or threaten legal police action if you disconnect?",
        riskIfYes: "DANGER: Law enforcement agencies DO NOT conduct 'Digital Arrests' over video calls or phone."
    },
    {
        id: "q4",
        question: "Did they request you to transfer money to a 'Safety Locker' or 'Verification Account'?",
        riskIfYes: "FRAUD ALERT: Government agencies never ask citizens to transfer money for verification."
    },
    {
        id: "q5",
        question: "Did they tell you NOT to inform your family members or local police?",
        riskIfYes: "ISOLATION TACTIC: Scammers create urgency and isolation to prevent victim double-checking."
    }
];

function evaluateChecklist(answers) {
    // answers is an object { q1: true/false, q2: true/false, ... }
    let dangerTriggers = [];
    let countYes = 0;

    POST_CALL_QUESTIONS.forEach(q => {
        if (answers[q.id] === true) {
            countYes++;
            dangerTriggers.push({
                question: q.question,
                warning: q.riskIfYes
            });
        }
    });

    let resultTag = "SAFE";
    let score = 100;
    if (countYes >= 2) {
        resultTag = "CRITICAL DANGER";
        score = 10;
    } else if (countYes === 1) {
        resultTag = "HIGH RISK";
        score = 35;
    }

    return {
        countYes,
        resultTag,
        score,
        dangerTriggers
    };
}
