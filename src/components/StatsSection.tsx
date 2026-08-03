import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Heart, MapPin, ShieldCheck, Sparkles, Award } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { counters, isCountersEnabled } = useApp();

  if (!isCountersEnabled) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Users':
        return <Users className="w-8 h-8 text-amber-400" />;
      case 'Heart':
        return <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />;
      case 'MapPin':
        return <MapPin className="w-8 h-8 text-orange-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
      default:
        return <Sparkles className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <section className="py-16 bg-slate-900 border-t border-b border-amber-500/20 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {counters.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-2xl hover:border-amber-400 transition-all hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {getIcon(item.iconName)}
              </div>
              <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent mb-2">
                {item.value}
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-300">
                {item.labelMr}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
