import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, UserCheck, UserPlus, LogIn } from 'lucide-react';
import { VanjariJodiLogo } from './VanjariJodiLogo';

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
              <VanjariJodiLogo variant="emblem" size={60} />

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

        {/* 3 Primary Entry Options - Distinct, Premium Royal Color Palette */}
        <div className="pt-2 flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-sm sm:max-w-md mx-auto relative z-20">
          
          {/* Option 1: New Free Registration (Shimmering Golden Emerald) */}
          <button
            type="button"
            onClick={handleOpenRegister}
            className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 border-2 border-amber-300 flex items-center justify-between transition-all transform hover:-translate-y-0.5 active:scale-98 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-[#800C1E] text-amber-300 shadow group-hover:scale-110 transition-transform shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <span className="tracking-wide">१. नवीन मोफत नोंदणी करा</span>
            </div>
            <span className="text-[10px] bg-[#800C1E] text-amber-200 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
              Free
            </span>
          </button>

          {/* Option 2: Existing Member Login (Deep Royal Crimson Maroon) */}
          <button
            type="button"
            onClick={handleOpenLogin}
            className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#800C1E] via-[#A71930] to-[#800C1E] hover:from-[#A71930] hover:to-[#800C1E] text-amber-100 text-xs sm:text-sm font-black shadow-lg shadow-red-950/30 border-2 border-amber-400 flex items-center justify-between transition-all transform hover:-translate-y-0.5 active:scale-98 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-amber-400 text-[#800C1E] shadow group-hover:scale-110 transition-transform shrink-0">
                <LogIn className="w-4 h-4" />
              </div>
              <span className="tracking-wide text-amber-100">२. विद्यमान सदस्य लॉगिन</span>
            </div>
            <span className="text-[10px] bg-amber-400/20 border border-amber-300/40 text-amber-200 px-2 py-0.5 rounded-full font-extrabold">
              लॉगिन
            </span>
          </button>

          {/* Option 3: Guest Entry (Deep Royal Sapphire Dark Velvet) */}
          <button
            type="button"
            onClick={handleOpenGuest}
            className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-indigo-900 text-amber-200 text-xs sm:text-sm font-black shadow-lg shadow-indigo-950/40 border-2 border-indigo-400/60 hover:border-amber-400 flex items-center justify-between transition-all transform hover:-translate-y-0.5 active:scale-98 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-indigo-600/80 border border-indigo-300/40 text-amber-200 shadow group-hover:scale-110 transition-transform shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="tracking-wide">३. पाहुणे / गेस्ट प्रवेश (Guest)</span>
            </div>
            <span className="text-[10px] bg-indigo-500/20 border border-indigo-300/30 text-indigo-200 px-2 py-0.5 rounded-full font-extrabold">
              प्रवेश
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
