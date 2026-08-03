import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, Sparkles, Zap, Crown, ShieldCheck } from 'lucide-react';
import { Plan } from '../types';

export const PremiumPlans: React.FC = () => {
  const {
    t,
    language,
    plansList,
    setSelectedPlanForPayment,
    setIsPaymentOpen,
    currentUser,
    setIsLoginOpen,
    isPaidPlansEnabled
  } = useApp();

  // Hidden by default. Only visible when Admin enables it.
  if (!isPaidPlansEnabled) return null;

  const handleSelectPlan = (plan: Plan) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    setSelectedPlanForPayment(plan);
    setIsPaymentOpen(true);
  };

  return (
    <section id="membership-section" className="py-20 bg-slate-950 text-white border-t border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30 uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 fill-amber-400" />
            <span>प्रीमियम सदस्यत्व योजना (Premium Plans)</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t('plans_title')}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {t('plans_subtitle')}
          </p>
        </div>

        {/* PAID PRICING CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plansList.map((plan) => {
            const isRecommended = plan.recommended;

            return (
              <div
                key={plan.id}
                className={`relative bg-slate-900 border rounded-3xl p-8 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-2xl ${
                  isRecommended
                    ? 'border-amber-400 shadow-amber-900/40 ring-2 ring-amber-500/50 bg-slate-900/95'
                    : 'border-slate-800 hover:border-amber-500/30'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>सर्वोत्तम लोकप्रिय प्लॅन</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {language === 'mr' ? plan.nameMr : plan.name}
                    </h3>
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-amber-300">₹{plan.price}</span>
                      <span className="text-xs text-slate-400 font-medium">
                        / {plan.durationMonths} {language === 'mr' ? 'महिने' : 'Months'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {language === 'mr' ? 'कालावधी:' : 'Validity:'} {plan.durationMonths} Months Access
                    </p>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-300 mb-8">
                    {(language === 'mr' ? plan.featuresMr : plan.features).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/40">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isRecommended
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {language === 'mr' ? 'हा प्लॅन निवडा' : 'Choose Plan'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* TRUST GUARANTEE BANNER IN PAID SECTION */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/30 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>१००% विश्वासार्हता व समाधान ग्वाही (100% Satisfaction Guarantee)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-300">
            संत भगवान बाबा यांच्या आशीर्वादाने स्थापित वंजारी विवाह व्यासपीठ
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            प्रत्येक बायोडाटाची वैयक्तिक पातळीवर पडताळणी करूनच मंजुरी दिली जाते. तुमची कोणतीही अडचण असल्यास आमची २४/७ सहाय्यता टीम सदैव तुमच्या सेवेत आहे.
          </p>
        </div>

      </div>
    </section>
  );
};
