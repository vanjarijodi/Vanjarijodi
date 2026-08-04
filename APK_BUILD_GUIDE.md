# 📱 Android APK डाउनलोड आणि गिटहब बिल्ड मार्गदर्शक (APK Build & Download Guide)

हा प्रोजेक्ट **GitHub Actions** द्वारे आपोआप APK तयार करण्यासाठी कॉन्फिगर केला आहे.

---

## 🚀 १. गिटहबवर कोड कसा एक्सपोर्ट करावा? (How to Export to GitHub)

1. AI Studio मध्ये उजव्या बाजूला असलेल्या **Settings / Export (सेटिंग्ज किंवा एक्सपोर्ट)** ऑप्शनवर क्लिक करा.
2. **Export to GitHub** (किंवा Download ZIP) पर्याय निवडा आणि तुमचा गिटहब अकाउंट जोडून रिपॉझिटरी तयार करा.

---

## 📦 २. गिटहबवरून APK फाईल कशी डाउनलोड करावी? (How to Download APK from GitHub)

1. तुमच्या गिटहब रिपॉझिटरीमध्ये जा (e.g., `https://github.com/your-username/your-repo-name`).
2. वरील मेनूमध्ये **"Actions"** या टॅबवर क्लिक करा.
3. तिथे सर्वात वर दिसणाऱ्या **"Build Android APK"** (हिरवी टिक लागलेल्या) रनवर क्लिक करा.
4. खाली स्क्रोल करून **"Artifacts"** सेक्शन शोधा.
5. तिथे **`VanjariJodi-Android-APK`** नाव दिसेल, त्यावर क्लिक करा.
6. एक ZIP फाईल डाउनलोड होईल, ती अनझिप (Extract) केल्यानंतर तुम्हाला **`app-debug.apk`** फाईल मिळेल!

---

## 📱 ३. मोबाईलमध्ये ॲप कसे इंस्टॉल करावे? (How to Install on Mobile)

1. ती `app-debug.apk` फाईल तुमच्या अँड्रॉइड मोबाईलमध्ये टाका किंवा व्हॉट्सॲप/ड्राइव्हवरून ओपन करा.
2. इंस्टॉल करताना *"Install from Unknown Sources"* किंवा *"Allow from this source"* अशी परवानगी मागितल्यास ती चालू (Allow) करा.
3. तुमचे ॲप यशस्वीरित्या मोबाईलमध्ये चालू होईल! 🎉

---

## ⚡ GitHub Action Workflow Details
The automated build file is placed at: `.github/workflows/android.yml`
- Node.js 20 & Java JDK 17
- Automated `npm run build` + `npx cap sync android`
- Gradle build output: `android/app/build/outputs/apk/debug/app-debug.apk`
