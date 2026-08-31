import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, ArrowRight, X, Sparkles } from 'lucide-react';

export const NoticeBanner: React.FC = () => {
  const { siteConfig, setIsRegisterOpen, language, currentUser } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (!siteConfig?.isNoticeBannerEnabled || !siteConfig?.noticeBannerText || dismissed || currentUser) {
    return null;
  }

  const noticeText = language === 'en'
    ? (siteConfig.noticeBannerTextEn || siteConfig.noticeBannerText)
    : siteConfig.noticeBannerText;

  const bgStyles: Record<string, string> = {
    crimson: 'bg-gradient-to-r from-[#660714] via-[#850D1E] to-[#660714] text-amber-50 border-amber-400/30',
    saffron: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 border-amber-300/50',
    emerald: 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-emerald-50 border-emerald-400/40',
    maroon: 'bg-gradient-to-r from-[#4A0510] via-[#660714] to-[#4A0510] text-amber-100 border-amber-300/40'
  };

  const activeBg = bgStyles[siteConfig.noticeBannerBg || 'crimson'] || bgStyles['crimson'];

  return (
    <div className={`w-full py-1.5 px-2.5 sm:px-4 border-b text-xs font-semibold shadow-xs relative z-40 flex items-center justify-between gap-2.5 min-h-[34px] sm:min-h-[36px] select-none ${activeBg}`}>
      <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-7xl mx-auto min-w-0">
        
        {/* Live Badge / Icon */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-xs border border-white/20 text-amber-300 text-[10px] font-black shrink-0 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <Megaphone className="w-3 h-3 text-amber-300 shrink-0" />
          <span className="hidden xs:inline uppercase tracking-wider">{language === 'en' ? 'Notice' : 'महत्त्वाचे'}</span>
        </div>

        {/* Scrolling Marquee text */}
        <div className="overflow-hidden whitespace-nowrap flex-1 min-w-0 mask-linear">
          <div className="inline-block animate-marquee pl-3 hover:pause">
            <span className="font-bold tracking-normal text-[11px] sm:text-xs text-shadow-xs">
              {noticeText}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="hidden sm:inline-flex px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 hover:text-white rounded-full text-[10px] font-black transition cursor-pointer items-center gap-1 border border-amber-300/40 shrink-0 active:scale-95"
        >
          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          <span>{language === 'en' ? 'Register Free' : 'मोफत नोंदणी'}</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-black/25 rounded-full transition cursor-pointer text-current opacity-75 hover:opacity-100 shrink-0 active:scale-90"
          title={language === 'en' ? 'Close notice' : 'सूचना बंद करा'}
          aria-label="Close notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};



