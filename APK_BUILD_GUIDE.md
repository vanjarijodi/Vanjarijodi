# 📱 Android APK डाउनलोड आणि इन्स्टॉलेशन मार्गदर्शक (Play Protect & Install Guide)

हा प्रोजेक्ट **GitHub Actions** द्वारे आपोआप APK तयार करण्यासाठी कॉन्फिगर केला आहे.

---

## 🛡️ Play Protect स्कॅनिंग व वॉर्निंग कशी बंद करावी? (How to Bypass Play Protect Scanning)

गुगल प्ले स्टोअरबाहेरून (Direct APK) ॲप इन्स्टॉल करताना Google Play Protect चे "Unrecognized App" किंवा "Send app for scanning" चे पॉपअप येते. ते कायमचे किंवा इन्स्टॉलेशन वेळी बंद करण्यासाठी:

### पर्याय १: ॲप इन्स्टॉल करताना (सर्वात सोपा पर्याय)
1. ॲप इन्स्टॉल करताना **"Blocked by Play Protect"** किंवा **"Unrecognized app"** असा मेसेज आल्यास घाबरू नका.
2. खालील बाजूस असलेल्या **"More details" (अधिक माहिती)** किंवा खाली दिशेचा छोटा बाण `⌵` यावर क्लिक करा.
3. तिथे **"Install anyway" (तरीही इन्स्टॉल करा)** वर क्लिक करा.
4. जर **"Send app for scanning"** विचारले, तर **"Don't send" (पाठवू नका)** निवडा.

### पर्याय २: मोबाईलमधील Play Protect स्कॅनिंग तात्पुरते बंद करा
1. मोबाईलमध्ये **Google Play Store** ॲप उघडा.
2. वर उजव्या कोपऱ्यात तुमच्या **Profile Photo (प्रोफाईल)** वर क्लिक करा.
3. **Play Protect** हा पर्याय निवडा.
4. वर उजव्या कोपऱ्यातील **Settings (⚙️ आयकॉन)** वर क्लिक करा.
5. **"Scan apps with Play Protect"** आणि **"Improve harmful app detection"** हे दोन्ही पर्याय **OFF (बंद)** करा.
6. आता तुमचे ॲप कोणत्याही अडथळ्याविना, स्कॅनिंगशिवाय एका सेकंदात इन्स्टॉल होईल!

---

## 🚀 १. गिटहबवर कोड कसा एक्सपोर्ट करावा? (How to Export to GitHub)

1. AI Studio मध्ये उजव्या बाजूला असलेल्या **Settings / Export** ऑप्शनवर क्लिक करा.
2. **Export to GitHub** (किंवा Download ZIP) पर्याय निवडा आणि तुमचा गिटहब अकाउंट जोडून रिपॉझिटरी तयार करा.

---

## 📦 २. गिटहबवरून APK फाईल कशी डाउनलोड करावी? (How to Download APK from GitHub)

1. तुमच्या गिटहब रिपॉझिटरीमध्ये जा (उदा. `https://github.com/your-username/your-repo-name`).
2. वरील मेनूमध्ये **"Actions"** या टॅबवर क्लिक करा.
3. तिथे सर्वात वर दिसणाऱ्या **"Build Android APK"** (हिरवी टिक लागलेल्या) रनवर क्लिक करा.
4. खाली स्क्रोल करून **"Artifacts"** सेक्शन शोधा.
5. तिथे **`VanjariJodi-Android-APK`** नाव दिसेल, त्यावर क्लिक करून ZIP डाउनलोड करा.

---

## ⚠️ इन्स्टॉलेशनच्या महत्वाच्या पायऱ्या:

1. **ZIP फाईल नेहमी Extract (अनझिप) करा:**
   - मोबाईलमध्ये डाउनलोड झालेली ZIP थेट ओपन करू नका.
   - **File Manager** ➔ **Downloads** मध्ये जाऊन ZIP वर क्लिक करा आणि **"Extract All"** किंवा **"अनझिप करा"** निवडा.
2. **`VanjariJodi-Universal-Install.apk` किंवा `VanjariJodi-Release.apk` फाईल निवडा:**
   - अनझिप केलेल्या फोल्डरमधील **`VanjariJodi-Universal-Install.apk`** निवडा.
3. **जुने ॲप आधी अनइन्स्टॉल करा:**
   - मोबाईलमधील जुने ॲप आधी डिलीट करा आणि मगच नवीन फाईल इन्स्टॉल करा.

