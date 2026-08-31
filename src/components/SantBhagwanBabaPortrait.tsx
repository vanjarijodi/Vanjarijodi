import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

interface PortraitProps {
  className?: string;
}

export const SantBhagwanBabaPortrait: React.FC<PortraitProps> = ({ className = '' }) => {
  // Authentic photographic portrait of Shri Sant Bhagwan Baba seated at Bhagwangad
  const bhagwanBabaStatueImg = "https://upload.wikimedia.org/wikipedia/commons/5/50/Bhagawanbaba.png";

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      
      {/* ROYAL ORNATE TEMPLE ARCH FRAME (कमानीदार सुवर्ण चौकट) */}
      <div className="relative w-full max-w-[290px] sm:max-w-[340px] rounded-t-full rounded-b-3xl p-3.5 sm:p-4 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 border-4 border-amber-400 shadow-2xl overflow-hidden group">
        
        {/* Decorative Golden Outer Borders */}
        <div className="absolute inset-1 rounded-t-full rounded-b-2xl border-2 border-amber-600/60 pointer-events-none z-20" />
        <div className="absolute inset-2 rounded-t-full rounded-b-xl border stroke-dashed border-amber-100/70 pointer-events-none z-20" />

        {/* Top Decorative Shrine Crest / Crown */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30 bg-[#800C1E] text-amber-200 text-[10px] sm:text-xs font-black px-4 py-0.5 rounded-full border border-amber-300 shadow-md whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
          <span>॥ राष्ट्रसंत श्री संत भगवान बाबा ॥</span>
        </div>

        {/* Inner Shrine Canvas with Statue Photo */}
        <div className="relative w-full aspect-[3/4] rounded-t-full rounded-b-2xl overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center">
          
          {/* Background Aura Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(251,191,36,0.35)_0%,rgba(128,12,30,0.8)_65%,rgba(15,23,42,0.95)_100%)] pointer-events-none" />

          {/* Seated Statue Image */}
          <img
            src={bhagwanBabaStatueImg}
            alt="Shri Sant Bhagwan Baba Seated at Bhagwangad"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700 relative z-10"
          />

          {/* Vignette Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none z-20" />

          {/* Diyas (दीपक) in Corners */}
          <div className="absolute top-3 left-3 text-amber-300 z-30 bg-black/40 p-1 rounded-full border border-amber-400/40">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
          <div className="absolute top-3 right-3 text-amber-300 z-30 bg-black/40 p-1 rounded-full border border-amber-400/40">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          </div>

          {/* Title overlay inside portrait */}
          <div className="absolute bottom-2.5 inset-x-2.5 text-center bg-black/75 backdrop-blur-md p-2 rounded-xl border border-amber-400/60 z-30">
            <p className="text-xs sm:text-sm font-black text-amber-200 tracking-tight">
              राष्ट्रसंत भगवान बाबा
            </p>
            <p className="text-[10px] text-amber-100 font-extrabold mt-0.5">
              (१८९६ - १९६५ • भगवानगड संस्थापक)
            </p>
          </div>
        </div>

        {/* Bottom Garland / Devotional Footer */}
        <div className="mt-2.5 bg-gradient-to-r from-[#800C1E] via-[#A71930] to-[#800C1E] rounded-2xl p-2.5 border border-amber-300 text-center shadow-lg">
          <p className="text-xs sm:text-sm font-black text-amber-200 tracking-wide">
            ॥ श्री संत भगवान बाबा प्रसन्न ॥
          </p>
          <p className="text-[10px] sm:text-xs text-amber-100 font-extrabold italic mt-0.5">
            "बैसोनी पाण्यावरी वाचली ज्ञानेश्वरी"
          </p>
        </div>

      </div>

    </div>
  );
};
