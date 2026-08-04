import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { downloadApkFile } from '../utils/apkDownloader';
import {
  Heart,
  Globe,
  LogIn,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  UserCheck,
  LayoutDashboard,
  Download,
  Smartphone
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { NoticeBanner } from './NoticeBanner';
import { VanjariJodiLogo } from './VanjariJodiLogo';

export const Navbar: React.FC<{
  onOpenSearch?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}> = () => {
  const {
    language,
    setLanguage,
    currentUser,
    setIsLoginOpen,
    setIsRegisterOpen,
    setIsAdminOpen,
    siteConfig,
    setCurrentView,
    incrementApkDownloadCount
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleApkDownload = () => {
    downloadApkFile(
      siteConfig?.apkSettings?.apkUrl,
      siteConfig?.apkSettings?.appVersion || 'v2.4.0',
      incrementApkDownloadCount
    );
  };

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white border-b border-amber-200 text-slate-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* 2. LOGO & BRANDING */}
          <div
            className="flex items-center cursor-pointer group py-1 min-w-0 shrink"
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <VanjariJodiLogo variant="full" size={54} />
          </div>

          {/* RIGHT SIDE CONTROLS: Registration, Login, APK Download, Menu */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            
            {/* DIRECT APK DOWNLOAD BUTTON */}
            {siteConfig?.apkSettings?.isEnabled && (
              <button
                onClick={handleApkDownload}
                title="एंड्रॉइड ॲप (APK) डाउनलोड करा"
                className="px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-xs font-bold shadow-sm flex items-center gap-1 transition-transform active:scale-95 border border-emerald-400 cursor-pointer shrink-0"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline">ॲप डाउनलोड</span>
                <span className="sm:hidden">APK</span>
                <Download className="w-3 h-3 text-emerald-200 hidden sm:inline" />
              </button>
            )}

            {/* REGISTRATION BUTTON */}
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#A71930] to-[#C82333] hover:from-[#800C1E] hover:to-[#A71930] text-amber-100 text-[11px] sm:text-xs md:text-sm font-black shadow-md border border-amber-300/40 flex items-center gap-1 sm:gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
              <span className="hidden xs:inline sm:inline">मोफत नोंदणी</span>
              <span className="xs:hidden sm:hidden">नोंदणी</span>
            </button>

            {/* LOGIN / DASHBOARD BUTTONS */}
            {currentUser ? (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-[#A71930] text-[11px] sm:text-xs font-bold border border-amber-300 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#A71930]" />
                <span className="flex items-center gap-1">
                  <span>{currentUser.fullName.split(' ')[0]}</span>
                  <VerifiedBadge isVerified={currentUser.isVerified} isFaceVerified={currentUser.isFaceVerified} size="sm" />
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* EXISTING MEMBER LOGIN BUTTON */}
                <button
                  onClick={() => setIsLoginOpen(true)}
                  title="हयात नोंदणीकृत सदस्यांसाठी लॉगिन"
                  className="px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] sm:text-xs font-extrabold border border-slate-300 flex items-center gap-1 transition-all shadow-sm cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#A71930]" />
                  <span>लॉगिन</span>
                </button>

                {/* GUEST LOGIN BUTTON NEXT TO EXISTING MEMBER LOGIN */}
                {siteConfig?.enableGuestLogin !== false && (
                  <button
                    onClick={() => {
                      setIsLoginOpen(true);
                    }}
                    title="मोबाईल नंबर + OTP पडताळणीसह पाहुणे / गेस्ट प्रवेश"
                    className="px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-[#800C1E] text-[11px] sm:text-xs font-black border border-amber-300/90 flex items-center gap-1 transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#A71930] shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">👤 गेस्ट प्रवेश</span>
                    <span className="sm:hidden whitespace-nowrap">गेस्ट</span>
                  </button>
                )}
              </div>
            )}

            {/* MENU TRIGGER & DROPDOWN */}
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 sm:p-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-slate-800 border border-amber-300 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#A71930]" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[#A71930]" />}
              </button>

              {/* Menu Dropdown Modal / Popup */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-amber-300 rounded-2xl shadow-2xl p-4 text-xs space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2 border-b border-amber-100 flex justify-between items-center">
                    <span className="font-bold text-[#A71930] text-xs uppercase tracking-wider">नेव्हिगेशन व पर्याय</span>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Action Links inside Dropdown Menu */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => { setIsRegisterOpen(true); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-[#A71930] to-[#800C1E] text-amber-100 font-extrabold cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>मोफत नोंदणी करा</span>
                    </button>

                    {!currentUser && (
                      <>
                        <button
                          onClick={() => { setIsLoginOpen(true); setMenuOpen(false); }}
                          className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold cursor-pointer"
                        >
                          <LogIn className="w-4 h-4 text-[#A71930]" />
                          <span>सदस्य लॉगिन</span>
                        </button>

                        {siteConfig?.enableGuestLogin !== false && (
                          <button
                            onClick={() => { setIsLoginOpen(true); setMenuOpen(false); }}
                            className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#800C1E] font-extrabold cursor-pointer border border-amber-300"
                          >
                            <UserCheck className="w-4 h-4 text-[#A71930]" />
                            <span>👤 गेस्ट प्रवेश</span>
                          </button>
                        )}
                      </>
                    )}

                    {siteConfig?.apkSettings?.isEnabled && (
                      <button
                        onClick={() => { handleApkDownload(); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold cursor-pointer border border-emerald-200"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>एंड्रॉइड ॲप (APK) डाउनलोड</span>
                      </button>
                    )}
                  </div>

                  {/* Language Selector */}
                  <div className="space-y-1 pt-2 border-t border-amber-100">
                    <p className="text-[11px] text-slate-500 font-semibold">भाषा निवडा (Language):</p>
                    <button
                      onClick={() => setLanguage(language === 'mr' ? 'en' : 'mr')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[#A71930] font-bold transition-all hover:bg-amber-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#A71930]" />
                        <span>{language === 'mr' ? 'मराठी' : 'English'}</span>
                      </div>
                      <span className="text-[10px] bg-[#A71930] text-amber-100 px-2 py-0.5 rounded-full font-bold">
                        {language === 'mr' ? 'मराठी चालू' : 'Active'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Notice Banner strip rendered directly below the main white logo bar */}
      <NoticeBanner />
    </header>
  );
};

