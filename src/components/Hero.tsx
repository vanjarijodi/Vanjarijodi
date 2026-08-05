import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, UserCheck, UserPlus, LogIn } from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    heroSlides,
    siteConfig,
    setIsRegisterOpen,
    setIsLoginOpen,
    setLoginModalMode
  } = useApp();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const handleOpenRegister = () => {
    setIsRegisterOpen(true);
  };

  const handleOpenLogin = () => {
    setLoginModalMode('member_otp');
    setIsLoginOpen(true);
  };

  const handleOpenGuest = () => {
    setLoginModalMode('guest');
    setIsLoginOpen(true);
  };

  return (
    <div className="relative py-4 sm:py-8 lg:py-12 overflow-hidden bg-gradient-to-b from-[#FFFDFB] via-[#FFF9F2] to-[#FFFDFB] text-slate-800 border-b border-amber-200">
      
      {/* BACKGROUND DECORATIVE ORNATE ACCENTS */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-rose-200/50 blur-3xl" />
      </div>

      {/* HERO CONTENT AREA */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-3.5 sm:space-y-6">
        
        {/* ELEGANT VANJARI JODI BRAND HEADER CARD */}
        <div className="w-full bg-gradient-to-r from-[#800C1E] via-[#A71930] to-[#800C1E] text-amber-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-xl border border-amber-400 relative overflow-hidden transition-all duration-300">
          
          {/* ROYAL ORNATE INNER BORDER */}
          <div className="absolute inset-1.5 sm:inset-3 border border-amber-400/40 rounded-xl sm:rounded-2xl pointer-events-none z-0" />
          <div className="absolute inset-2.5 sm:inset-4 border border-dashed border-amber-400/20 rounded-xl sm:rounded-2xl pointer-events-none z-0" />
          
          {/* ORNATE CORNER CORNERS - TRADITIONAL LOOK */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-300 pointer-events-none z-0 hidden sm:block" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-300 pointer-events-none z-0 hidden sm:block" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-300 pointer-events-none z-0 hidden sm:block" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-300 pointer-events-none z-0 hidden sm:block" />

          {/* Subtle ornate background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2 sm:gap-3.5">
            
            {/* Top Blessing Badge */}
            <div className="inline-flex items-center gap-1 px-3 py-0.5 sm:px-4 sm:py-1.5 rounded-full bg-black/40 border border-amber-300/60 text-amber-200 text-[10px] sm:text-xs font-black shadow-inner">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 fill-amber-300 shrink-0" />
              <span className="tracking-wide">॥ संत भगवान बाबा प्रसन्न ॥</span>
            </div>

            {/* Logo + Vanjari Jodi Title */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-4">
              {siteConfig?.logoUrl ? (
                <div className="p-0.5 sm:p-1 rounded-lg sm:rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-lg shrink-0 ring-2 ring-amber-400/30">
                  <img
                    src={siteConfig.logoUrl}
                    alt={siteConfig?.logoTitle || 'वंजारी जोडी'}
                    className="w-10 h-10 sm:w-16 sm:h-16 object-contain rounded-md sm:rounded-lg bg-white p-0.5"
                  />
                </div>
              ) : (
                <div className="p-0.5 sm:p-1 rounded-lg sm:rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-lg shrink-0 ring-2 ring-amber-400/30">
                  <img
                    src="/logo.png"
                    alt="वंजारी जोडी"
                    className="w-10 h-10 sm:w-16 sm:h-16 object-contain rounded-md sm:rounded-lg bg-white p-0.5"
                  />
                </div>
              )}

              <div className="flex flex-col items-start text-left justify-center space-y-0.5">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-amber-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] leading-tight">
                  {siteConfig?.logoTitle || 'वंजारी जोडी'}
                </h1>
                <p className="text-[10px] sm:text-sm md:text-lg font-extrabold text-amber-100/95 tracking-wide">
                  {siteConfig?.logoSubtitle || 'पवित्र नात्यांची सुंदर सुरुवात'}
                </p>
              </div>
            </div>

            {/* Description & Blessing tagline */}
            <p className="hidden sm:block text-xs sm:text-sm font-bold text-amber-100/90 max-w-xl mx-auto leading-relaxed border-t border-amber-400/30 pt-2.5 mt-1">
              {siteConfig?.heroSubheading || 'संत भगवान बाबा यांच्या आशीर्वादाने स्थापित – वंजारी समाजातील वधू-वर आणि त्यांच्या कुटुंबांना परस्परांशी सुरक्षितपणे जोडणारे अधिकृत व्यासपीठ.'}
            </p>

            {/* Key Trust Highlights */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap text-[9px] sm:text-xs font-black text-amber-200 pt-0.5">
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 border border-amber-400/40 shadow-sm backdrop-blur-sm">
                सुरक्षित नोंदणी
              </span>
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 border border-amber-400/40 shadow-sm backdrop-blur-sm">
                सुरक्षित व गोपनीय
              </span>
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 border border-amber-400/40 shadow-sm backdrop-blur-sm">
                महाराष्ट्रातील नंबर १ विवाह मंच
              </span>
            </div>

          </div>
        </div>

        {/* 3 Primary Entry Options - Beautifully Compact & Centered */}
        <div className="pt-1 flex flex-col items-center justify-center gap-2 sm:gap-3 w-full max-w-sm sm:max-w-md mx-auto relative z-20">
          
          {/* Option 1: New Free Registration */}
          <button
            type="button"
            onClick={handleOpenRegister}
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-600 text-[#800C1E] text-xs sm:text-sm font-black shadow-md border border-amber-300 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#800C1E] group-hover:scale-110 transition-transform shrink-0" />
            <span>१. नवीन नोंदणी करा</span>
          </button>

          {/* Option 2: Existing Member Login */}
          <button
            type="button"
            onClick={handleOpenLogin}
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#FFFDF5] hover:bg-amber-50 text-[#800C1E] text-xs sm:text-sm font-black shadow-md border border-amber-400/80 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#800C1E] group-hover:scale-110 transition-transform shrink-0" />
            <span>२. विद्यमान सदस्य लॉगिन</span>
          </button>

          {/* Option 3: Guest Entry */}
          <button
            type="button"
            onClick={handleOpenGuest}
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#A71930] via-[#800C1E] to-[#A71930] hover:from-[#800C1E] hover:to-[#A71930] text-amber-100 text-xs sm:text-sm font-black shadow-md border border-amber-300/60 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform shrink-0" />
            <span>३. पाहुणे / गेस्ट प्रवेश (Guest Login)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
