import React from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, Calendar, ExternalLink, Sparkles, PlusCircle } from 'lucide-react';

export const CommunityAds: React.FC = () => {
  const { communityAds, language, setIsAdminOpen, isAdsEnabled } = useApp();

  if (!isAdsEnabled) return null;

  const activeAds = communityAds.filter((ad) => ad.isActive);

  if (activeAds.length === 0) return null;

  return (
    <section id="ads-section" className="py-16 bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-2 border border-amber-500/30">
              <Megaphone className="w-3.5 h-3.5 text-amber-400" />
              <span>प्रायोजित वधू-वर मेळावे व जाहिराती (Premium Advertisements)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {language === 'mr' ? 'वंजारी समाज मेळावे व उपक्रम' : 'Vanjari Community Meetups & Notices'}
            </h2>
          </div>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>जाहिरात जोडा (Admin)</span>
          </button>
        </div>

        {/* Banner Area Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl hover:border-amber-400 transition-all group flex flex-col justify-between"
            >
              <div className="relative h-52 sm:h-60 overflow-hidden bg-slate-950">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{ad.type === 'meetup' ? 'वधू-वर मेळावा' : 'विशेष प्रायोजित जाहिरात'}</span>
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-amber-300 group-hover:text-amber-200 transition-colors">
                  {ad.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {ad.description}
                </p>

                {ad.linkUrl && (
                  <div className="pt-3">
                    <a
                      href={ad.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                    >
                      <span>अधिक माहिती पहा</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
