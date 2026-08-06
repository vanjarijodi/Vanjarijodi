import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, Gender } from '../types';
import { VerifiedBadge } from './VerifiedBadge';
import {
  ShieldCheck,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  MessageCircle,
  PhoneCall,
  Sparkles,
  Lock,
  CheckCircle,
  FileText,
  Clock,
  User,
  ShieldAlert
} from 'lucide-react';

export const ProfilesGrid: React.FC<{
  onOpenSearchFilter?: () => void;
}> = () => {
  const {
    t,
    language,
    filteredProfiles,
    shortlistedIds,
    toggleShortlist,
    sendInterest,
    interests,
    currentUser,
    setSelectedProfileForModal,
    setActiveChatUser,
    contactRequests,
    requestContactAuthorization,
    isContactAuthorizedForUser,
    siteConfig
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'bride' | 'groom' | 'shortlisted'>('all');

  const cleanLocation = (district?: string, city?: string) => {
    if (!district && !city) return '';
    if (!district) return city || '';
    if (!city) return district;
    const dLower = district.trim().toLowerCase();
    const cLower = city.trim().toLowerCase();
    if (dLower === cLower || dLower.includes(cLower) || cLower.includes(dLower)) {
      return district;
    }
    return `${district}, ${city}`;
  };

  // Check Admin Settings: Hide entire section if disabled by admin
  if (siteConfig?.showProfilesOnIndexPage === false) {
    return null;
  }

  // Hide empty section if admin configured hideEmptyProfilesSection and there are 0 profiles
  if (siteConfig?.hideEmptyProfilesSection && filteredProfiles.length === 0) {
    return null;
  }

  const displayedProfiles = filteredProfiles.filter((p) => {
    if (activeTab === 'bride') return p.gender === 'bride';
    if (activeTab === 'groom') return p.gender === 'groom';
    if (activeTab === 'shortlisted') return shortlistedIds.includes(p.id);
    return true;
  });

  return (
    <section id="profiles-section" className="py-16 bg-[#FFFDFB] text-slate-800 min-h-[600px] border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-amber-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#A71930] text-xs font-bold mb-2 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-[#A71930]" />
              <span>नवीन नोंदणीकृत वधू-वर</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#A71930]">
              {language === 'mr' ? 'वंजारी वधू-वर यादी (Recent Profiles)' : 'Vanjari Matrimonial Members'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
              {language === 'mr'
                ? 'बीड, नाशिक, अहमदनगर, छत्रपती संभाजीनगर, पुणे, मुंबई आणि इतर सर्व जिल्ह्यातील उच्चशिक्षित बायोडाटा'
                : 'Recent matrimonial listings from all districts of Maharashtra'}
            </p>
          </div>

          {/* Clean Category Filter Tabs Only */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#A71930] text-amber-100 shadow'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              {language === 'mr' ? 'सर्व सदस्य' : 'All Members'} ({filteredProfiles.length})
            </button>
            <button
              onClick={() => setActiveTab('bride')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'bride'
                  ? 'bg-[#A71930] text-amber-100 shadow'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              👰 {t('bride')} ({filteredProfiles.filter((p) => p.gender === 'bride').length})
            </button>
            <button
              onClick={() => setActiveTab('groom')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'groom'
                  ? 'bg-[#A71930] text-amber-100 shadow'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              🤵 {t('groom')} ({filteredProfiles.filter((p) => p.gender === 'groom').length})
            </button>
            <button
              onClick={() => setActiveTab('shortlisted')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'shortlisted'
                  ? 'bg-[#A71930] text-amber-100 shadow'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>{language === 'mr' ? 'माझे आवडते' : 'Shortlisted'}</span>
              <span>({shortlistedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Profiles Grid */}
        {displayedProfiles.length === 0 ? (
          <div className="text-center py-12 px-6 bg-gradient-to-b from-amber-50/50 to-white rounded-3xl border-2 border-amber-200 p-8 shadow-sm max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-[#A71930] border border-amber-300">
              <User className="w-8 h-8 text-[#A71930]" />
            </div>
            <h3 className="text-lg font-black text-[#A71930]">
              {language === 'mr' ? 'कोणतेही जुळणारे प्रोफाईल आढळले नाहीत' : 'No matching profiles found.'}
            </h3>
            <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed">
              {language === 'mr'
                ? 'सध्या प्रणालीत या श्रेणीमध्ये कोणतेही बायोडाटा उपलब्ध नाहीत किंवा सर्च फिल्टरनुसार शोध लागला नाही.'
                : 'Currently there are no profiles available in this category or matching your search filter.'}
            </p>
            <div className="p-3 bg-amber-100/70 rounded-2xl border border-amber-300 text-xs text-amber-900 font-bold flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#A71930] shrink-0" />
                <span>
                  {language === 'mr'
                    ? 'ॲडमिन टीप: मुख्य पानावरून हा विभाग दाखवणे/लपवणे ॲडमिन पॅनेलमध्ये शक्य आहे.'
                    : 'Admin Note: Show/hide this section on index page via Admin Panel settings.'}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProfiles.map((profile) => {
              const isShortlisted = shortlistedIds.includes(profile.id);
              const isAuthorized = isContactAuthorizedForUser(profile.id);
              const pendingReq = currentUser && contactRequests.find(
                (r) => r.requesterId === currentUser.id && r.targetProfileId === profile.id && r.status === 'pending'
              );
              const interestObj = interests.find(
                (i) => currentUser && i.fromUserId === currentUser.id && i.toUserId === profile.id
              );

              return (
                <div
                  key={profile.id}
                  className="bg-white border-2 border-amber-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-amber-400 transition-all hover:-translate-y-1 group flex flex-col justify-between"
                >
                  {/* Card Header Area */}
                  <div className="relative p-5 bg-gradient-to-b from-amber-50/80 via-amber-50/30 to-white flex flex-col items-center justify-center text-center border-b border-amber-100">
                    
                    {/* Top Right Shortlist Button */}
                    <button
                      type="button"
                      onClick={() => toggleShortlist(profile.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md border border-amber-200 hover:scale-110 active:scale-95 transition-transform z-10 cursor-pointer"
                      title={isShortlisted ? 'पसंती यादीतून काढा' : 'पसंती यादीत जोडा'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isShortlisted ? 'fill-rose-600 text-rose-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Clear High-Res Photo Avatar Container */}
                    {profile.photos && profile.photos.length > 0 && profile.photos[0] ? (
                      <div 
                        onClick={() => setSelectedProfileForModal(profile)}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400 ring-4 ring-amber-100/90 mb-3 relative group-hover:scale-105 transition-transform bg-amber-50 cursor-pointer shrink-0"
                      >
                        <img
                          src={profile.photos[0]}
                          alt={profile.fullName}
                          className={`w-full h-full object-cover object-top ${(!currentUser && siteConfig?.blurProfilePhotos) ? 'blur-md scale-110' : ''}`}
                        />
                        {(!currentUser && siteConfig?.blurProfilePhotos) && (
                          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
                            <Lock className="w-5 h-5 text-amber-200" />
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/60 text-[9px] text-amber-200 font-medium backdrop-blur-xs">
                          {profile.photos.length} 📷
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setSelectedProfileForModal(profile)}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-tr from-[#800C1E] via-[#A71930] to-[#C82333] text-amber-100 flex items-center justify-center text-4xl shadow-lg border-2 border-amber-400 ring-4 ring-amber-100/90 mb-3 cursor-pointer"
                      >
                        {profile.gender === 'bride' ? '👰' : '🤵'}
                      </div>
                    )}

                    <div className="w-full text-center space-y-2">
                      <span className="inline-block text-[10px] uppercase font-mono font-extrabold tracking-wider text-[#800C1E] bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 shadow-xs">
                        आयडी: {profile.id}
                      </span>

                      {/* Name Display - 100% Privacy for Non-Logged-In/Guest Users */}
                      <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug px-1 text-center flex items-center justify-center gap-1.5 flex-wrap">
                        {(!currentUser && (siteConfig?.blurProfileNames ?? true)) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100/90 text-[#800C1E] text-xs font-black border border-amber-300 shadow-2xs select-none">
                            <Lock className="w-3.5 h-3.5 text-[#A71930] shrink-0" />
                            <span>🔒 नाव गुप्त (लॉगिन करा)</span>
                          </span>
                        ) : (
                          <>
                            <span>{profile.fullName}</span>
                            <VerifiedBadge isVerified={profile.isVerified} isFaceVerified={profile.isFaceVerified} size="sm" />
                          </>
                        )}
                      </h3>

                      {/* PROMINENT TOP QUALIFICATION & DISTRICT HIGHLIGHT BOX */}
                      <div className="w-full bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/90 p-2.5 rounded-2xl border-2 border-amber-300 shadow-sm text-center space-y-1.5">
                        <div className="flex items-center justify-center gap-2 text-xs font-black">
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 text-slate-900 shadow-2xs">
                            <MapPin className="w-3.5 h-3.5 text-[#A71930] shrink-0" />
                            <span>जिल्हा: <strong className="text-[#A71930] font-black">{profile.district || 'महाराष्ट्र'}</strong></span>
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded-lg border border-amber-300 text-slate-800 font-extrabold">
                            {profile.age} वर्षे
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#800C1E] bg-white p-2 rounded-xl border border-amber-300 shadow-2xs">
                          <GraduationCap className="w-4 h-4 text-[#A71930] shrink-0" />
                          <span className="truncate max-w-[230px] font-black text-slate-900" title={profile.education}>
                            {profile.education || 'उच्चशिक्षित'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-4 sm:p-5 space-y-3 text-xs text-slate-700 flex-1">
                    
                    <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-amber-100">
                      <div>
                        <span className="text-slate-500 text-[11px] block font-semibold">{t('height')}</span>
                        <span className="font-bold text-slate-800">{profile.height}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block font-semibold">{t('sub_caste')}</span>
                        <span className="font-bold text-[#A71930]">{profile.subCaste}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-[#A71930] shrink-0" />
                        <span className="truncate">{profile.occupation}</span>
                      </div>
                    </div>

                    {/* Contact Phone Status */}
                    <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px]">
                      {isAuthorized ? (
                        <div className="flex items-center justify-between font-bold text-emerald-700">
                          <span className="flex items-center gap-1">
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>संपर्क:</span>
                          </span>
                          <span>{profile.mobile}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-slate-600 font-medium">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-[#A71930]" />
                            <span>मोबाईल नंबर:</span>
                          </span>
                          <span className="font-mono font-bold text-amber-900">+91 98*****234</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 bg-amber-50/30 border-t border-amber-100 space-y-2">
                    
                    {/* View Complete Biodata Button */}
                    <button
                      onClick={() => setSelectedProfileForModal(profile)}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-amber-100 text-[#A71930] font-bold text-xs border border-amber-300 shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t('view_full_biodata')}</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Send Interest Button */}
                      <button
                        onClick={() => sendInterest(profile.id)}
                        disabled={!!interestObj}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          interestObj
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                            : 'bg-gradient-to-r from-[#A71930] to-[#C82333] hover:from-[#800C1E] text-amber-100 shadow'
                        }`}
                      >
                        {interestObj ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{language === 'mr' ? 'प्रतिसाद पाठवला' : 'Sent'}</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3.5 h-3.5 fill-amber-200" />
                            <span>{language === 'mr' ? 'प्रतिसाद' : 'Interest'}</span>
                          </>
                        )}
                      </button>

                      {/* Contact Number Request / View Button */}
                      {isAuthorized ? (
                        <button
                          onClick={() => setActiveChatUser(profile)}
                          className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{t('chat_now')}</span>
                        </button>
                      ) : pendingReq ? (
                        <button
                          disabled
                          className="py-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1 cursor-default"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                          <span>प्रलंबित</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => requestContactAuthorization(profile.id)}
                          className="py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#A71930] border border-amber-300 text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-[#A71930]" />
                          <span>नंबर मागा</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

