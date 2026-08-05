import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Users,
  Search,
  Crown,
  User,
  Sparkles,
  Heart,
  UserCheck,
  LogIn
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsFilterOpen,
    setIsPaymentOpen,
    setIsLoginOpen,
    currentUser,
    unreadCount,
    setLoginModalMode
  } = useApp();

  // Hide bottom navigation if user is not logged in
  if (!currentUser) {
    return null;
  }

  // Scroll to top smooth helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tabId: string) => {
    if (tabId === 'home') {
      setCurrentView('home');
      scrollToTop();
    } else if (tabId === 'profiles') {
      setCurrentView('profiles');
      scrollToTop();
    } else if (tabId === 'search') {
      setIsFilterOpen(true);
    } else if (tabId === 'premium') {
      setIsPaymentOpen(true);
    } else if (tabId === 'profile') {
      if (currentUser) {
        setCurrentView('dashboard');
        scrollToTop();
      } else {
        setLoginModalMode('member_otp');
        setIsLoginOpen(true);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden pb-safe">
      {/* Sleek Dark/Gold Glassmorphism Navigation Bar */}
      <div className="bg-[#1A0307]/95 backdrop-blur-xl border-t border-amber-500/30 px-2 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          
          {/* 1. Home Button */}
          <button
            onClick={() => handleNavClick('home')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
              currentView === 'home'
                ? 'bg-gradient-to-r from-[#A71930] to-[#800C1E] text-amber-200 shadow-lg border border-amber-400/40 font-black'
                : 'text-amber-100/70 hover:text-amber-200 hover:bg-amber-900/20 font-bold'
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 transition-transform ${currentView === 'home' ? 'scale-110 text-amber-300' : ''}`} />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate w-full text-center">
              होम
            </span>
            {currentView === 'home' && (
              <span className="absolute -top-1 w-2 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
            )}
          </button>

          {/* 2. Profiles Button */}
          <button
            onClick={() => handleNavClick('profiles')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
              currentView === 'profiles'
                ? 'bg-gradient-to-r from-[#A71930] to-[#800C1E] text-amber-200 shadow-lg border border-amber-400/40 font-black'
                : 'text-amber-100/70 hover:text-amber-200 hover:bg-amber-900/20 font-bold'
            }`}
          >
            <div className="relative">
              <Users className={`w-5 h-5 transition-transform ${currentView === 'profiles' ? 'scale-110 text-amber-300' : ''}`} />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate w-full text-center">
              बायोडाटा
            </span>
            {currentView === 'profiles' && (
              <span className="absolute -top-1 w-2 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
            )}
          </button>

          {/* 3. Search Filter Button */}
          <button
            onClick={() => handleNavClick('search')}
            className="relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-amber-100/70 hover:text-amber-200 hover:bg-amber-900/20 font-bold transition-all duration-200 cursor-pointer active:scale-95"
          >
            <div className="relative">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate w-full text-center">
              शोधा
            </span>
          </button>

          {/* 4. Premium VIP Plan Button (With PRO Badge like screenshot!) */}
          <button
            onClick={() => handleNavClick('premium')}
            className="relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-amber-100/80 hover:text-amber-200 hover:bg-amber-900/20 font-bold transition-all duration-200 cursor-pointer active:scale-95"
          >
            <div className="relative">
              <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
              {/* Vibrant Gold PRO Badge */}
              <span className="absolute -top-2 -right-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-[8px] px-1.5 py-0.2 rounded-full shadow-md border border-amber-200 uppercase tracking-wider">
                PRO
              </span>
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate w-full text-center text-amber-300 font-extrabold">
              प्रीमियम
            </span>
          </button>

          {/* 5. Profile / Dashboard Button */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-[#A71930] to-[#800C1E] text-amber-200 shadow-lg border border-amber-400/40 font-black'
                : 'text-amber-100/70 hover:text-amber-200 hover:bg-amber-900/20 font-bold'
            }`}
          >
            <div className="relative">
              {currentUser ? (
                <UserCheck className={`w-5 h-5 transition-transform ${currentView === 'dashboard' ? 'scale-110 text-amber-300' : 'text-emerald-400'}`} />
              ) : (
                <User className="w-5 h-5" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate w-full text-center">
              {currentUser ? 'प्रोफाईल' : 'लॉगिन'}
            </span>
            {currentView === 'dashboard' && (
              <span className="absolute -top-1 w-2 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
