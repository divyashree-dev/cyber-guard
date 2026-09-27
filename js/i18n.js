/**
 * CyberShield Internationalization (i18n) Module
 * Supports English, Hindi (हिंदी), and Marathi (मराठी)
 */

const I18N_STRINGS = {
    en: {
        appName: "CyberShield",
        tagline: "Your AI Guardian for Cyber Safety & Fraud Prevention",
        emergencyWarningTitle: "Emergency Cyber Warning",
        emergencyWarningText: "Never share OTP, UPI PIN, Bank CVV, or Screen-Sharing Access with anyone over phone or SMS.",
        callHelpline: "Call 1930 Helpline",
        safetyScoreLabel: "Cyber Safety Score",
        scoreStatusHigh: "Strong Shield active. You are practicing safe cyber habits.",
        scoreStatusMed: "Moderate Shield. Review recent security alerts and run a scan.",
        scoreStatusLow: "Action Required! High risk of fraud exposure.",
        scanLinkBtn: "Scan Link",
        scanQrBtn: "Scan QR",
        checkMessageBtn: "Check SMS",
        reportScamBtn: "Report Scam",
        learnSafetyBtn: "Cyber Academy",
        phoneLookupBtn: "Phone Search",
        paymentSafetyBtn: "Payment Safety",
        recentAlertsTitle: "Live Scam Trends & Alerts",
        phishingDetectorTitle: "Link & Website Scanner",
        smsCheckerTitle: "SMS / Message Scam Checker",
        scamCallTitle: "Scam Call & Phone Number Directory",
        paymentChecklistTitle: "Before You Pay Checklist",
        reportFormTitle: "Report a Fraud / Cyber Crime",
        academyTitle: "Cyber Safety Academy & Quizzes",
        familyModeTitle: "Family Protection Shield",
        privacyDashboardTitle: "Privacy & Permissions Center",
        adminTitle: "Admin & Intelligence Portal"
    },
    hi: {
        appName: "साइबर शील्ड (CyberShield)",
        tagline: "डिजिटल धोखाधड़ी और साइबर सुरक्षा का आपका रक्षक",
        emergencyWarningTitle: "आपातकालीन साइबर चेतावनी",
        emergencyWarningText: "किसी को भी फोन या मैसेज पर OTP, UPI PIN, बैंक CVV, या स्क्रीन-शेयरिंग एक्सेस न दें।",
        callHelpline: "1930 हेल्पलाइन पर कॉल करें",
        safetyScoreLabel: "साइबर सुरक्षा स्कोर",
        scoreStatusHigh: "मजबूत सुरक्षा सक्रिय है। आप सुरक्षित डिजिटल आदतों का पालन कर रहे हैं।",
        scoreStatusMed: "मध्यम सुरक्षा। हाल की सुरक्षा चेतावनियों की समीक्षा करें।",
        scoreStatusLow: "कार्रवाई आवश्यक! धोखाधड़ी के संपर्क में आने का उच्च जोखिम।",
        scanLinkBtn: "लिंक जांचें",
        scanQrBtn: "QR स्कैन करें",
        checkMessageBtn: "SMS जांचें",
        reportScamBtn: "स्कैम रिपोर्ट करें",
        learnSafetyBtn: "साइबर सीखें",
        phoneLookupBtn: "नंबर खोजें",
        paymentSafetyBtn: "भुगतान सुरक्षा",
        recentAlertsTitle: "लाइव स्कैम अलर्ट और ट्रेंड्स",
        phishingDetectorTitle: "लिंक और वेबसाइट स्कैनर",
        smsCheckerTitle: "SMS / मैसेज धोखाधड़ी जांचकर्ता",
        scamCallTitle: "स्कैम कॉल और फोन नंबर डायरेक्टरी",
        paymentChecklistTitle: "भुगतान करने से पहले चेकलिस्ट",
        reportFormTitle: "धोखाधड़ी की रिपोर्ट दर्ज करें",
        academyTitle: "साइबर सुरक्षा अकादमी और क्विज़",
        familyModeTitle: "परिवार सुरक्षा शील्ड",
        privacyDashboardTitle: "गोपनीयता और अनुमति डैशबोर्ड",
        adminTitle: "एडमिन और इंटेलिजेंस पोर्टल"
    },
    mr: {
        appName: "सायबर शील्ड (CyberShield)",
        tagline: "डिजिटल फसवणूक आणि सायबर सुरक्षेचा तुमचा संरक्षक",
        emergencyWarningTitle: "तातडीची सायबर चेतावणी",
        emergencyWarningText: "फोन किंवा मेसेजवर कोणालाही OTP, UPI PIN, बँक CVV किंवा स्क्रीन-शेअरिंग ॲक्सेस देऊ नका.",
        callHelpline: "1930 हेल्पलाइनवर कॉल करा",
        safetyScoreLabel: "सायबर सुरक्षा स्कोर",
        scoreStatusHigh: "मजबूत संरक्षण सक्रिय आहे.",
        scoreStatusMed: "मध्यम संरक्षण. नवीनतम सायबर सूचना तपासा.",
        scoreStatusLow: "तातडीने कारवाई आवश्यक! फसवणुकीचा उच्च धोका.",
        scanLinkBtn: "लिंक तपासा",
        scanQrBtn: "QR स्कॅन करा",
        checkMessageBtn: "SMS तपासा",
        reportScamBtn: "स्कॅम रिपोर्ट करा",
        learnSafetyBtn: "सायबर शिका",
        phoneLookupBtn: "नंबर शोधा",
        paymentSafetyBtn: "पेमेंट सुरक्षा",
        recentAlertsTitle: "लाइव्ह स्कॅम अलर्ट आणि ट्रेंड्स",
        phishingDetectorTitle: "लिंक आणि वेबसाइट स्कॅनर",
        smsCheckerTitle: "SMS / मेसेज फसवणूक तपासणी",
        scamCallTitle: "स्कॅम कॉल आणि फोन नंबर निर्देशिका",
        paymentChecklistTitle: "पेमेंट करण्यापूर्वी चेकलिस्ट",
        reportFormTitle: "फसवणुकीची तक्रार नोंदवा",
        academyTitle: "सायबर सुरक्षा अकादमी आणि क्विझ",
        familyModeTitle: "कुटुंब संरक्षण शील्ड",
        privacyDashboardTitle: "गोपनीयता आणि परवानगी केंद्र",
        adminTitle: "ॲडमिन आणि इंटेलिजन्स पोर्टल"
    }
};

let currentLang = "en";

function setLanguage(lang) {
    if (I18N_STRINGS[lang]) {
        currentLang = lang;
        const stats = db.getUserStats();
        stats.language = lang;
        db.saveUserStats(stats);
        updatePageTranslations();
    }
}

function t(key) {
    return I18N_STRINGS[currentLang][key] || I18N_STRINGS['en'][key] || key;
}

function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (I18N_STRINGS[currentLang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = I18N_STRINGS[currentLang][key];
            } else {
                el.textContent = I18N_STRINGS[currentLang][key];
            }
        }
    });
}
