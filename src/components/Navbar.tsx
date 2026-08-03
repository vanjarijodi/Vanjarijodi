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

const VanjariJodiLogoEmblem: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="vjGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="vjOrange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B00" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="vjBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>

    {/* Shield Base */}
    <path
      d="M100 10 L175 45 V115 C175 160 100 190 100 190 C100 190 25 160 25 115 V45 L100 10 Z"
      fill="url(#vjBlue)"
      stroke="url(#vjGold)"
      strokeWidth="4"
    />

    {/* Crown Motif */}
    <path
      d="M85 30 L92 40 L100 26 L108 40 L115 30 L112 46 H88 L85 30 Z"
      fill="url(#vjGold)"
      stroke="#FFF"
      strokeWidth="1"
    />
    <circle cx="100" cy="23" r="3" fill="#FFE082" />
    <circle cx="85" cy="27" r="2" fill="#FFE082" />
    <circle cx="115" cy="27" r="2" fill="#FFE082" />

    {/* Traditional Vanjari Turban / Headgear */}
    <path
      d="M68 52 C78 42 122 42 132 52 C140 60 136 68 100 68 C64 68 60 60 68 52 Z"
      fill="url(#vjOrange)"
      stroke="url(#vjGold)"
      strokeWidth="2"
    />
    <path
      d="M74 56 C88 48 112 48 126 56"
      stroke="#FFE082"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Curved Bull Horns */}
    <path
      d="M58 70 C38 58 22 32 28 18 C40 32 54 56 70 72 Z"
      fill="url(#vjGold)"
      stroke="#FFF"
      strokeWidth="1.5"
    />
    <path
      d="M142 70 C162 58 178 32 172 18 C160 32 146 56 130 72 Z"
      fill="url(#vjGold)"
      stroke="#FFF"
      strokeWidth="1.5"
    />

    {/* Charging Bull Muzzle & Head */}
    <path
      d="M70 72 C78 68 122 68 130 72 C138 88 132 118 100 133 C68 118 62 88 70 72 Z"
      fill="url(#vjOrange)"
      stroke="url(#vjGold)"
      strokeWidth="2"
    />

    {/* Eyes & Forehead */}
    <path
      d="M78 80 C88 76 112 76 122 80 C117 93 83 93 78 80 Z"
      fill="url(#vjBlue)"
    />
    <polygon points="80,84 90,86 84,90" fill="#FFE082" />
    <polygon points="120,84 110,86 116,90" fill="#FFE082" />

    {/* Bull Nose Ring */}
    <path
      d="M86 114 C86 124 114 124 114 114"
      fill="none"
      stroke="url(#vjGold)"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Matrimony Heart Accent */}
    <path
      d="M100 146 C95 140 88 143 88 148 C88 153 100 160 100 160 C100 160 112 153 112 148 C112 143 105 140 100 146 Z"
      fill="#EF4444"
    />
  </svg>
);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          
          {/* 2. LOGO & BRANDING */}
          <div
            className="flex items-center gap-3 cursor-pointer group py-1"
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="relative group-hover:scale-105 transition-transform duration-300">
              {siteConfig?.logoUrl ? (
                <img
                  src={siteConfig.logoUrl}
                  alt={siteConfig?.logoTitle || 'वंजारी जोडी'}
                  style={{ height: `${siteConfig?.logoHeight || 52}px`, width: 'auto' }}
                  className="object-contain rounded-xl border border-amber-300 shadow-sm bg-white p-0.5"
                />
              ) : (
                <VanjariJodiLogoEmblem
                  style={{ height: `${siteConfig?.logoHeight || 52}px`, width: 'auto' }}
                  className="drop-shadow-[0_2px_8px_rgba(167,25,48,0.25)]"
                />
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#A71930]">
                  {siteConfig?.logoTitle || 'वंजारी जोडी'}
                </span>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-[#A71930] border border-amber-300 font-bold uppercase tracking-widest hidden sm:inline-block shadow-sm">
                  अधिकृत
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-700 leading-tight">
                {siteConfig?.logoSubtitle || 'विश्वासू वंजारी विवाह मंच'}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE CONTROLS: Registration, Login, APK Download, Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* DIRECT APK DOWNLOAD BUTTON */}
            {siteConfig?.apkSettings?.isEnabled && (
              <button
                onClick={handleApkDownload}
                title="एंड्रॉइड ॲप (APK) डाउनलोड करा"
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-transform active:scale-95 border border-emerald-400"
              >
                <Smartphone className="w-4 h-4 text-emerald-200" />
                <span className="hidden md:inline">ॲप डाउनलोड करा</span>
                <span className="md:hidden">APK</span>
                <Download className="w-3.5 h-3.5 text-emerald-200" />
              </button>
            )}

            {/* REGISTRATION BUTTON */}
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#A71930] to-[#C82333] hover:from-[#800C1E] hover:to-[#A71930] text-amber-100 text-xs sm:text-sm font-black shadow-md border border-amber-300/40 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>मोफत नोंदणी</span>
            </button>

            {/* LOGIN / DASHBOARD BUTTONS */}
            {currentUser ? (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2.5 sm:py-3 rounded-full bg-amber-50 hover:bg-amber-100 text-[#A71930] text-xs sm:text-sm font-bold border border-amber-300 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-[#A71930]" />
                <span className="hidden sm:inline flex items-center gap-1">
                  <span>{currentUser.fullName.split(' ')[0]}</span>
                  <VerifiedBadge isVerified={currentUser.isVerified} isFaceVerified={currentUser.isFaceVerified} size="sm" />
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* EXISTING MEMBER LOGIN BUTTON */}
                <button
                  onClick={() => setIsLoginOpen(true)}
                  title="हयात नोंदणीकृत सदस्यांसाठी लॉगिन"
                  className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-extrabold border border-slate-300 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#A71930]" />
                  <span>लॉगिन</span>
                </button>

                {/* GUEST LOGIN BUTTON NEXT TO EXISTING MEMBER LOGIN */}
                {siteConfig?.enableGuestLogin !== false && (
                  <button
                    onClick={() => {
                      setIsLoginOpen(true);
                    }}
                    title="मोबाईल नंबर + OTP पडताळणीसह पाहुणे / गेस्ट प्रवेश"
                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-[#800C1E] text-xs sm:text-sm font-black border border-amber-300/90 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-[#A71930]" />
                    <span className="whitespace-nowrap">👤 गेस्ट प्रवेश</span>
                  </button>
                )}
              </div>
            )}

            {/* MENU TRIGGER & DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2.5 sm:p-3 rounded-full bg-amber-50 hover:bg-amber-100 text-slate-800 border border-amber-300 transition-all flex items-center gap-1"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5 text-[#A71930]" /> : <Menu className="w-5 h-5 text-[#A71930]" />}
              </button>

              {/* Menu Dropdown Modal / Popup */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-amber-300 rounded-2xl shadow-2xl p-4 text-xs space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2 border-b border-amber-100 flex justify-between items-center">
                    <span className="font-bold text-[#A71930] text-xs uppercase tracking-wider">पर्याय व भाषा</span>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Language Selector */}
                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-500 font-semibold">भाषा निवडा (Language):</p>
                    <button
                      onClick={() => setLanguage(language === 'mr' ? 'en' : 'mr')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[#A71930] font-bold transition-all hover:bg-amber-100"
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

