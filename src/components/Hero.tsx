import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MAHARASHTRA_DISTRICTS } from '../data/initialData';
import { Search, Heart, Sparkles, UserCheck, ChevronRight, MapPin, User, UserPlus, LogIn } from 'lucide-react';
import { Gender } from '../types';

export const Hero: React.FC<{ onSearchSubmit?: () => void }> = ({ onSearchSubmit }) => {
  const {
    heroSlides,
    siteConfig,
    setIsRegisterOpen,
    setIsLoginOpen,
    setSearchFilters,
    setCurrentView
  } = useApp();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>('bride');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(45);

  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const handleSearchExecute = () => {
    setSearchFilters((prev) => ({
      ...prev,
      gender: selectedGender,
      district: selectedDistrict,
      minAge: minAge,
      maxAge: maxAge
    }));
    setCurrentView('profiles');
    setTimeout(() => {
      const el = document.getElementById('profiles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FFFDFB] via-[#FFF9F2] to-[#FFFDFB] text-slate-800 border-b border-amber-200">
      
      {/* BACKGROUND DECORATIVE ORNATE ACCENTS */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-rose-200/50 blur-3xl" />
      </div>

      {/* HERO CONTENT AREA */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 sm:pt-10 text-center flex-1 flex flex-col items-center justify-center space-y-6">
        
        {/* GRAND ATTRACTIVE VANJARI JODI BRAND HEADER CARD */}
        <div className="w-full bg-gradient-to-r from-[#800C1E] via-[#A71930] to-[#800C1E] text-amber-100 rounded-3xl p-5 sm:p-8 shadow-2xl border-2 border-amber-400/90 relative overflow-hidden transform hover:scale-[1.005] transition-all">
          {/* Subtle ornate background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
            
            {/* Top Blessing Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/40 border border-amber-300/60 text-amber-200 text-xs sm:text-sm font-black shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              <span>॥ संत भगवान बाबा प्रसन्न ॥</span>
            </div>

            {/* Logo + Giant Vanjari Jodi Title */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
              {siteConfig?.logoUrl && (
                <div className="p-1 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-xl shrink-0">
                  <img
                    src={siteConfig.logoUrl}
                    alt={siteConfig?.logoTitle || 'वंजारी जोडी'}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-white p-1"
                  />
                </div>
              )}

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-amber-200 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
                  {siteConfig?.logoTitle || 'वंजारी जोडी'}
                </h1>
                <p className="text-sm sm:text-lg md:text-xl font-bold text-amber-100/95 mt-1 tracking-wide">
                  {siteConfig?.logoSubtitle || 'विश्वासार्ह वंजारी विवाह मंच'}
                </p>
              </div>
            </div>

            {/* Description & Blessing tagline */}
            <p className="text-xs sm:text-sm md:text-base font-extrabold text-amber-100/90 max-w-2xl mx-auto leading-relaxed border-t border-amber-400/30 pt-3">
              {siteConfig?.heroSubheading || 'संत भगवान बाबा यांच्या आशीर्वादाने स्थापित – वंजारी समाजातील वधू-वर आणि त्यांच्या कुटुंबांना परस्परांशी सुरक्षितपणे जोडणारे अधिकृत व्यासपीठ.'}
            </p>

            {/* Key Trust Highlights */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap pt-1 text-[11px] sm:text-xs font-black text-amber-200">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 shadow-sm">
                १००% मोफत नोंदणी
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 shadow-sm">
                सुरक्षित व गोपनीय
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 shadow-sm">
                महाराष्ट्रातील नं. १ मॅट्रिमोनी
              </span>
            </div>

          </div>
        </div>

        {/* Big Main Heading */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#800C1E] drop-shadow-sm max-w-4xl mx-auto pt-2">
          {siteConfig?.heroHeading || 'वंजारी समाजातील वधू-वर शोधा'}
        </h2>

        {/* Sub Heading */}
        <p className="text-base sm:text-xl text-[#1E293B] font-extrabold max-w-3xl mx-auto leading-relaxed">
          हजारो विश्वासू वंजारी कुटुंब जोडणारा महाराष्ट्रातील नंबर १ विवाह मंच
        </p>

        {/* 3 Primary Entry Options */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3 w-full max-w-md mx-auto">
          {/* Option 1: New Free Registration */}
          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-600 text-[#800C1E] text-base sm:text-lg font-black shadow-lg border-2 border-amber-300 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
          >
            <UserPlus className="w-5 h-5 text-[#800C1E] group-hover:scale-110 transition-transform" />
            <span>१. नवीन मोफत नोंदणी करा</span>
          </button>

          {/* Option 2: Existing Member Login */}
          <button
            type="button"
            onClick={() => setIsLoginOpen(true)}
            className="w-full px-6 py-3.5 rounded-full bg-[#FFFDF5] hover:bg-amber-50 text-[#800C1E] text-base sm:text-lg font-black shadow-lg border-2 border-amber-400 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
          >
            <LogIn className="w-5 h-5 text-[#800C1E] group-hover:scale-110 transition-transform" />
            <span>२. विद्यमान सदस्य लॉगिन</span>
          </button>

          {/* Option 3: Guest Entry */}
          <button
            type="button"
            onClick={() => setIsLoginOpen(true)}
            className="w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-[#A71930] via-[#800C1E] to-[#A71930] hover:from-[#800C1E] hover:to-[#A71930] text-amber-100 text-base sm:text-lg font-black shadow-lg border-2 border-amber-300 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
          >
            <UserCheck className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>३. पाहुणे / गेस्ट प्रवेश (Guest Login)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
