import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Search,
  Sparkles,
  MessageCircle,
  User,
  Crown
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsLeftDrawerOpen,
    setIsRightDrawerOpen,
    currentUser,
    setIsLoginOpen,
    setLoginModalMode,
    unreadCount,
    siteConfig
  } = useApp();

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === 'home') {
      setCurrentView('home');
      scrollToTop();
    } else if (tabId === 'search') {
      setIsRightDrawerOpen(true);
    } else if (tabId === 'matches') {
      setCurrentView('profiles');
      scrollToTop();
    } else if (tabId === 'messages') {
      // Direct Support Chat trigger for all users (guests and logged-in members)
      const supportBtn = document.getElementById('support-chat-trigger-btn');
      if (supportBtn) {
        supportBtn.click();
      } else {
        alert('कृपया थेट मदतीसाठी स्क्रीनवरील ॲडमिन चॅट आयकॉनवर क्लिक करा.');
      }
    } else if (tabId === 'profile') {
      setIsLeftDrawerOpen(true);
    }
  };

  // Dynamically filter tabs
  const showSearchTab = !!(currentUser && siteConfig?.enableSearchFilters);
  const showMatchesTab = !!currentUser;

  let colsCount = 3; // Home, Chat, Profile are always visible
  if (showSearchTab) colsCount++;
  if (showMatchesTab) colsCount++;

  const gridColsClass = 
    colsCount === 3 ? 'grid-cols-3' : 
    colsCount === 4 ? 'grid-cols-4' : 
    'grid-cols-5';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden pb-safe">
      {/* Sleek Royal Maharashtrian Maroon & Gold Glassmorphism Bottom Nav */}
      <div className="bg-[#800C1E]/95 backdrop-blur-md border-t border-[#F99C00]/40 px-3 py-2 shadow-[0_-10px_35px_rgba(128,12,30,0.3)] rounded-t-3xl">
        <div className={`grid ${gridColsClass} gap-1 items-center max-w-md mx-auto`}>
          
          {/* 1. Home / Explore */}
          <button
            onClick={() => handleTabClick('home')}
            className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 cursor-pointer active:scale-90 ${
              currentView === 'home'
                ? 'bg-gradient-to-br from-[#A71930] to-[#800C1E] text-amber-300 shadow-inner border border-[#F99C00]/30 font-black scale-105'
                : 'text-amber-100/70 hover:text-amber-200'
            }`}
          >
            <Home className={`w-5 h-5 transition-transform ${currentView === 'home' ? 'scale-110 text-[#F99C00]' : ''}`} />
            <span className="text-[10px] tracking-tight mt-1 font-bold">होम</span>
            {currentView === 'home' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#F99C00] rounded-full shadow-[0_0_8px_#F99C00]" />
            )}
          </button>

          {/* 2. Search (Right Drawer Filter) */}
          {showSearchTab && (
            <button
              onClick={() => handleTabClick('search')}
              className="relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-amber-100/70 hover:text-amber-200 transition-all duration-300 cursor-pointer active:scale-90"
            >
              <Search className="w-5 h-5 text-amber-200" />
              <span className="text-[10px] tracking-tight mt-1 font-bold">शोध</span>
            </button>
          )}

          {/* 3. Smart Matches */}
          {showMatchesTab && (
            <button
              onClick={() => handleTabClick('matches')}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 cursor-pointer active:scale-90 ${
                currentView === 'profiles'
                  ? 'bg-gradient-to-br from-[#A71930] to-[#800C1E] text-amber-300 shadow-inner border border-[#F99C00]/30 font-black scale-105'
                  : 'text-amber-100/70 hover:text-amber-200'
              }`}
            >
              <div className="relative">
                <Sparkles className={`w-5 h-5 transition-transform ${currentView === 'profiles' ? 'scale-110 text-amber-300' : 'text-[#F99C00] animate-pulse'}`} />
                <span className="absolute -top-1.5 -right-2 bg-rose-600 text-[8px] font-black px-1 py-0.2 rounded-full text-white border border-amber-300 scale-90">AI</span>
              </div>
              <span className="text-[10px] tracking-tight mt-1 font-bold">स्मार्ट मॅच</span>
              {currentView === 'profiles' && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#F99C00] rounded-full shadow-[0_0_8px_#F99C00]" />
              )}
            </button>
          )}

          {/* 4. Messages / Requests */}
          <button
            onClick={() => handleTabClick('messages')}
            className="relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-amber-100/70 hover:text-amber-200 transition-all duration-300 cursor-pointer active:scale-90"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#F99C00] text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce border border-[#800C1E]">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1 font-bold">संपर्क</span>
          </button>

          {/* 5. Profile (Triggers Left Drawer Menu) */}
          <button
            onClick={() => handleTabClick('profile')}
            className="relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-amber-100/70 hover:text-amber-200 transition-all duration-300 cursor-pointer active:scale-90"
          >
            <div className="w-6 h-6 rounded-full border border-amber-400 overflow-hidden bg-amber-50 shadow-sm flex items-center justify-center mx-auto">
              {currentUser && currentUser.photos && currentUser.photos.length > 0 ? (
                <img
                  src={currentUser.photos[0]}
                  alt={currentUser.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-3.5 h-3.5 text-[#800C1E]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-bold">प्रोफाईल</span>
          </button>

        </div>
      </div>
    </div>
  );
};
