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
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 sm:pt-14 text-center flex-1 flex flex-col items-center justify-center space-y-6">
        
        {/* Blessing Crest Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFF9E6] border-2 border-amber-300/90 text-[#A71930] text-xs sm:text-sm font-black shadow-sm max-w-3xl">
          <Sparkles className="w-4 h-4 text-[#A71930] fill-amber-400 shrink-0" />
          <span className="leading-snug">
            {siteConfig?.heroSubheading || 'संत भगवान बाबा यांच्या आशीर्वादाने स्थापित मनपसंत आणि विश्वासू वंजारी विवाह मंच'}
          </span>
        </div>

        {/* Big Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-[#800C1E] drop-shadow-sm max-w-5xl mx-auto">
          {siteConfig?.heroHeading || 'वंजारी समाजातील वधू-वर शोधा'}
        </h1>

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
