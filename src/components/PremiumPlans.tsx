import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, Sparkles, Zap, Crown, ShieldCheck, Flame, Users, AlertTriangle } from 'lucide-react';
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
    isPaidPlansEnabled,
    siteConfig
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
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
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
        {(() => {
          const showOnlyWelcome = siteConfig?.showOnlyWelcomePlan !== false;
          const customerPlans = showOnlyWelcome
            ? plansList.filter((p) => p.id === 'welcome_offer' && p.isActive !== false)
            : plansList.filter((p) => p.isActive !== false);

          return (
            <div className={`grid grid-cols-1 ${customerPlans.length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-3'} gap-8 items-stretch`}>
              {customerPlans.map((plan) => {
                const isRecommended = plan.recommended;
                const isWelcome = plan.id === 'welcome_offer';
                const isDisabled = plan.isActive === false;
                const isLimited = !!plan.isLimitedSlotsPlan;
                const maxLimit = plan.maxMemberLimit || 100;
                const currentCount = plan.currentMemberCount || 0;
                const remaining = Math.max(0, maxLimit - currentCount);
                const isSoldOut = isLimited && currentCount >= maxLimit;

                return (
              <div
                key={plan.id}
                className={`relative bg-slate-900 border rounded-3xl p-8 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-2xl ${
                  isDisabled || isSoldOut
                    ? 'opacity-70 border-slate-800 grayscale-30'
                    : isWelcome
                    ? 'border-amber-400 shadow-amber-900/50 ring-2 ring-amber-400/80 bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900'
                    : isRecommended
                    ? 'border-amber-400 shadow-amber-900/40 ring-2 ring-amber-500/50 bg-slate-900/95'
                    : 'border-slate-800 hover:border-amber-500/30'
                }`}
              >
                {isWelcome ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-amber-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1 border border-amber-300">
                    <Flame className="w-3.5 h-3.5 fill-amber-950" />
                    <span>वेलकम स्पेशल ऑफर</span>
                  </div>
                ) : isRecommended ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>सर्वोत्तम लोकप्रिय प्लॅन</span>
                  </div>
                ) : null}

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
                      <span className="text-sm font-bold text-amber-300/80">INR</span>
                      <span className="text-xs text-slate-400 font-medium ml-1">
                        / {plan.durationLabelMr || `${plan.durationMonths} महिने`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                      (Inclusive of applicable taxes)
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {language === 'mr' ? 'कालावधी:' : 'Validity:'} {plan.durationLabelMr || `${plan.durationMonths} महिने वैध`}
                    </p>

                    {/* RELAUNCH ANNOUNCEMENT BANNER */}
                    {plan.relaunchBannerText && (
                      <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 text-amber-300 font-extrabold text-xs text-center animate-pulse">
                        📢 {plan.relaunchBannerText}
                      </div>
                    )}

                    {/* LIMITED SLOT BADGE AND PROGRESS BAR */}
                    {isLimited && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-amber-500/20 text-xs space-y-1.5">
                        {plan.showRemainingSeatsToPublic !== false ? (
                          <>
                            <div className="flex justify-between font-extrabold text-[11px]">
                              <span className="text-slate-300">लिमिटेड मेम्बर्स quota:</span>
                              <span className="text-amber-400">{currentCount} / {maxLimit} मेम्बर्स</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${isSoldOut ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-emerald-400'}`}
                                style={{ width: `${Math.min(100, Math.round((currentCount / maxLimit) * 100))}%` }}
                              />
                            </div>
                            <p className={`text-[10px] font-black ${isSoldOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {isSoldOut ? '⚠️ ऑफर मर्यादा पूर्ण भरली आहे' : `🔥 केवळ ${remaining} जागा शिल्लक!`}
                            </p>
                          </>
                        ) : (
                          <div className="py-1 px-2 text-center text-amber-300 font-extrabold text-xs">
                            🔥 मर्यादित जागा सवलत ऑफर - घाई करा!
                          </div>
                        )}
                      </div>
                    )}
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
                  disabled={isDisabled || isSoldOut}
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    isDisabled || isSoldOut
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : isWelcome || isRecommended
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                  }`}
                >
                  {isDisabled || isSoldOut ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>{isSoldOut ? 'सीट फुल (Sold Out)' : 'सध्या अनुपलब्ध'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {language === 'mr' ? 'हा प्लॅन निवडा' : 'Choose Plan'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            );
              })}
            </div>
          );
        })()}

        {/* Trust Guarantee Banner removed per user request */}
      </div>
    </section>
  );
};

