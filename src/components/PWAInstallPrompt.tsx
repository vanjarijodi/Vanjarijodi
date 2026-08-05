import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  X,
  Share,
  PlusSquare,
  Sparkles,
  CheckCircle2,
  Zap,
  Star,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { downloadApkFile } from '../utils/apkDownloader';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const { siteConfig, incrementApkDownloadCount } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isInstalledSuccess, setIsInstalledSuccess] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed as PWA)
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isNavigatorStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
      if (isStandaloneMedia || isNavigatorStandalone) {
        setIsStandalone(true);
      }
    };

    checkStandalone();

    // 2. Check if device is iOS (iPhone/iPad/iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIosDevice);

    // 3. Listen for browser 'beforeinstallprompt' event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default mini-infobar from appearing on mobile Chrome
      e.preventDefault();
      // Save event so prompt can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalledSuccess(true);
      setTimeout(() => {
        setIsDismissed(true);
      }, 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if dismissed in session
    const sessionDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (sessionDismissed === 'true') {
      setIsDismissed(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle Install Action
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native browser install prompt
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalledSuccess(true);
        setDeferredPrompt(null);
      } else {
        console.log('User dismissed PWA install prompt');
      }
    } else if (isIOS) {
      // Show iOS step-by-step instructions
      setShowIOSGuide(true);
    } else {
      // Fallback: Trigger direct APK Download or direct browser install instruction
      const apk = siteConfig?.apkSettings;
      downloadApkFile(
        apk?.apkUrl || '/download-apk',
        apk?.appVersion || 'v2.4.0',
        incrementApkDownloadCount
      );
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  // If already running as standalone PWA or user dismissed, don't show floating banner
  if (isStandalone || isDismissed) {
    return null;
  }

  // Show banner if:
  // - deferredPrompt is available (Chrome/Android/Edge) OR
  // - device is iOS (needs instructions) OR
  // - site allows mobile PWA prompt
  return (
    <>
      {/* Floating Call-to-Action Install Banner (Fixed at Bottom for Mobile & Desktop) */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md w-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="bg-gradient-to-r from-[#800C1E] via-[#A71930] to-[#5C0815] text-white rounded-2xl p-4 shadow-2xl border-2 border-amber-400/80 backdrop-blur-md relative overflow-hidden">
          
          {/* Close / Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-amber-200 transition-colors"
            title="पॉप-अप बंद करा"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Background Ambient Glow */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Installed Success Message */}
          {isInstalledSuccess ? (
            <div className="flex items-center gap-3 py-1">
              <div className="p-2.5 bg-emerald-500 rounded-xl text-white shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-amber-200 text-sm">
                  अभिनंदन! ॲप इन्स्टॉल झाले आहे 🎉
                </h4>
                <p className="text-xs text-amber-100/90 font-medium">
                  आता तुमच्या मोबाईल होम स्क्रीनवरून थेट 'वंजारी जोडी' वापरा.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Top Title & App Badge */}
              <div className="flex items-center gap-3 pr-6">
                <div className="relative shrink-0">
                  <img
                    src="/logo.png"
                    alt="VanjariJodi Logo"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-300 shadow-md bg-white p-0.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/icon-192.png';
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 text-white rounded-full border border-white">
                    <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-amber-300 text-[#800C1E] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      मोबाईल ॲप
                    </span>
                    <span className="flex items-center text-amber-300 text-[11px] font-extrabold gap-0.5">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>४.९★</span>
                    </span>
                  </div>
                  <h3 className="font-black text-amber-100 text-sm sm:text-base leading-snug">
                    वंजारीजोडी ॲप होम स्क्रीनवर जोडा!
                  </h3>
                  <p className="text-[11px] text-amber-100/90 font-medium leading-tight">
                    {deferredPrompt
                      ? 'एक क्लिकमध्ये ॲप इन्स्टॉल करा. जलद, सुरक्षित व वापरण्यास सोपे!'
                      : isIOS
                      ? 'iPhone / Safari वर इन्स्टॉल करण्यासाठी खालील बटण दाबा.'
                      : 'थेट तुमच्या मोबाईलवर इन्स्टॉल करा आणि सुपरफास्ट वापरा.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-amber-300/20">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-300 text-[#800C1E] font-black text-xs sm:text-sm rounded-xl shadow-lg border border-white/50 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Smartphone className="w-4 h-4 fill-[#800C1E]" />
                  <span>इन्स्टॉल करा (Install App)</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#800C1E] animate-pulse" />
                </button>

                <button
                  onClick={handleDismiss}
                  className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-amber-100 text-xs font-bold rounded-xl border border-amber-300/30 transition-colors shrink-0"
                >
                  नंतर
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* iOS Safari Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border-2 border-amber-400 shadow-2xl text-slate-800 relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-[#A71930] shadow-md border border-amber-300">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-[#800C1E]">
                iPhone / iPad वर इन्स्टॉल कसे करावे?
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Safari ब्राउझरमध्ये 'वंजारी जोडी' ॲप २ स्टेप्समध्ये होम स्क्रीनवर जोडा:
              </p>
            </div>

            <div className="space-y-3 bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs font-bold text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#A71930] text-amber-100 flex items-center justify-center font-black text-xs shrink-0">
                  १
                </div>
                <p className="pt-0.5">
                  Safari च्या खालील मेनूबारमधील <strong className="text-[#A71930] font-black inline-flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border"><Share className="w-3.5 h-3.5 text-blue-600 inline" /> शेयर (Share)</strong> बटणावर दाबा.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#A71930] text-amber-100 flex items-center justify-center font-black text-xs shrink-0">
                  २
                </div>
                <p className="pt-0.5">
                  खाली स्क्रोल करून <strong className="text-[#A71930] font-black inline-flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border"><PlusSquare className="w-3.5 h-3.5 text-slate-800 inline" /> 'Add to Home Screen' (होम स्क्रीनवर जोडा)</strong> या पर्यायावर टॅप करा.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 bg-[#A71930] hover:bg-[#800C1E] text-white font-black text-sm rounded-xl shadow-md border border-amber-300 flex items-center justify-center gap-2"
            >
              <span>समजले (Got it)</span>
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
