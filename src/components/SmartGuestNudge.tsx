import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, Sparkles, X, ChevronRight, Heart, PhoneCall } from 'lucide-react';

export const SmartGuestNudge: React.FC = () => {
  const { currentUser, setIsRegisterOpen, siteConfig } = useApp();
  const [dismissed, setDismissed] = useState(false);

  // Check if current user is guest or not logged in
  const isGuest = !currentUser || currentUser.id.startsWith('guest');

  if (!isGuest || dismissed || siteConfig.enableGuestBannerTrigger === false) {
    return null;
  }

  const handleNudgeClick = () => {
    setIsRegisterOpen(true);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-2 sm:p-4 animate-in slide-in-from-bottom duration-300 pointer-events-auto">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#A71930] via-[#800C1E] to-[#A71930] text-amber-100 p-3.5 sm:p-4 rounded-2xl shadow-2xl border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
        
        {/* Glowing Decorative Background */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-300/40 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 mb-0.5">
              <Heart className="w-3.5 h-3.5 fill-amber-300" />
              <span>{siteConfig.guestBannerTitle || 'वंजारी जोडी - मोफत नोंदणी'}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-amber-50 leading-snug line-clamp-2">
              "तुमचा योग्य जीवनसाथी शोधण्यासाठी आजच मोफत नोंदणी करा! संपूर्ण प्रोफाईल आणि संपर्क क्रमांक पाहण्यासाठी येथे क्लिक करा."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={handleNudgeClick}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 text-xs sm:text-sm border border-amber-200 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>मोफत नोंदणी करा</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl text-amber-200/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="लपवा"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
