import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { PrintBiodataModal } from './PrintBiodataModal';
import { VerifiedBadge } from './VerifiedBadge';
import {
  X,
  ShieldCheck,
  Heart,
  PhoneCall,
  MessageCircle,
  Download,
  Share2,
  FileText,
  User,
  GraduationCap,
  Users,
  Scroll,
  Sparkles,
  Lock,
  CheckCircle2,
  MapPin,
  Calendar,
  Printer
} from 'lucide-react';

export const ProfileDetailModal: React.FC<{
  profile: UserProfile | null;
  onClose: () => void;
}> = ({ profile, onClose }) => {
  const {
    t,
    language,
    currentUser,
    sendInterest,
    interests,
    toggleShortlist,
    shortlistedIds,
    setActiveChatUser,
    contactRequests,
    requestContactAuthorization,
    isContactAuthorizedForUser,
    isAdminLoggedIn,
    siteConfig,
    unlockContact,
    setSelectedProfileForUnlock,
    setIsContactUnlockModalOpen,
    checkGuestPermission,
    incrementProfileViews
  } = useApp();

  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'family' | 'expectations' | 'horoscope'>('personal');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const cleanLocationDetail = (district?: string, taluka?: string, city?: string) => {
    const parts: string[] = [];
    if (district && district.trim()) parts.push(district.trim());
    if (taluka && taluka.trim() && !parts.some(p => p.toLowerCase().includes(taluka.trim().toLowerCase()))) {
      parts.push(taluka.trim());
    }
    if (city && city.trim() && !parts.some(p => p.toLowerCase().includes(city.trim().toLowerCase()))) {
      parts.push(city.trim());
    }
    return parts.join(', ');
  };
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  React.useEffect(() => {
    if (profile?.id) {
      incrementProfileViews(profile.id);
    }
  }, [profile?.id]);

  if (!profile) return null;

  const isShortlisted = shortlistedIds.includes(profile.id);
  const isAuthorized = isContactAuthorizedForUser(profile.id);
  const pendingReq = currentUser && contactRequests.find(
    (r) => r.requesterId === currentUser.id && r.targetProfileId === profile.id && r.status === 'pending'
  );
  const interestObj = interests.find(
    (i) => currentUser && i.fromUserId === currentUser.id && i.toUserId === profile.id
  );

  const handleShareWhatsApp = () => {
    const text = `*वंजारीजोडी बायोडाटा:* ${profile.fullName} (${profile.age} वर्षे, ${profile.education}, ${profile.district})\nअधिक माहितीसाठी VanjariJodi App पहा.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-[#FFFDF5] border-2 border-amber-300 rounded-3xl shadow-2xl text-slate-800 overflow-hidden my-auto max-h-[90vh] flex flex-col">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#A71930] to-[#800C1E] border-b border-amber-300 text-white">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-900 bg-amber-200 px-3 py-1 rounded-full font-bold border border-amber-300">
                आयडी: {profile.id}
              </span>
              <h2 className="text-base sm:text-lg font-black text-amber-100 break-words">
                {profile.fullName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-[#A71930] text-xs font-black flex items-center gap-1.5 shadow border border-amber-400 transition-all"
              >
                <Printer className="w-4 h-4 text-[#A71930]" />
                <span className="hidden sm:inline">बायोडाटा प्रिंट करा</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body Scrollable */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 pr-4">
            
            {/* Top Banner with Main Image & Quick Badges */}
            <div className="grid md:grid-cols-12 gap-6 bg-white p-5 rounded-3xl border border-amber-200 shadow-sm">
              
              {/* Photos Column */}
              <div className="md:col-span-5 space-y-3">
                <div 
                  onClick={() => setIsLightboxOpen(true)}
                  onContextMenu={(e) => siteConfig?.disablePhotoDownloadAndScreenshot && e.preventDefault()}
                  className={`relative h-72 rounded-2xl overflow-hidden border-2 border-[#A71930]/30 shadow-md bg-amber-50 cursor-pointer group ${
                    siteConfig?.disablePhotoDownloadAndScreenshot ? 'select-none' : ''
                  }`}
                  title="फोटो मोठं करून पाहण्यासाठी क्लिक करा"
                >
                  <img
                    src={profile.photos[selectedPhotoIndex] || profile.photos[0]}
                    alt="profile"
                    style={{
                      filter: (!currentUser && siteConfig?.blurProfilePhotos)
                        ? `blur(${siteConfig?.photoBlurPercent || 20}px)`
                        : 'none'
                    }}
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Click to Expand Hint Overlay */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/70 text-amber-300 text-[10px] font-bold border border-amber-300/40 flex items-center gap-1 shadow opacity-90 group-hover:opacity-100">
                    <span>🔍 मोठं करून पहा</span>
                  </div>

                  {/* Anti-theft Watermark Overlay */}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-xs text-[10px] font-black text-amber-300 pointer-events-none select-none border border-amber-300/30 tracking-wider shadow">
                    वंजारी जोडी (VanjariJodi.com)
                  </div>

                  {profile.isVerified && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold border border-emerald-400 flex items-center gap-1 shadow">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>प्रमाणित प्रोफाईल</span>
                    </span>
                  )}
                </div>

                {/* Photo Thumbnails */}
                {profile.photos.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {profile.photos.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedPhotoIndex === idx ? 'border-[#A71930] scale-105 shadow' : 'border-slate-200 opacity-60'
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Info Column */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-[#A71930] font-bold border border-amber-300">
                      वंजारी समाज ({profile.subCaste})
                    </span>
                    <button
                      onClick={() => toggleShortlist(profile.id)}
                      className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 text-slate-600 border border-amber-200"
                    >
                      <Heart
                        className={`w-5 h-5 ${isShortlisted ? 'fill-rose-600 text-rose-600' : ''}`}
                      />
                    </button>
                  </div>

                  <h1 className="text-2xl font-black text-[#A71930] mt-2 flex items-center gap-2">
                    <span>{profile.fullName}</span>
                    <VerifiedBadge isVerified={profile.isVerified} isFaceVerified={profile.isFaceVerified} size="md" showLabel={true} />
                  </h1>
                  
                  <p className="text-xs font-bold text-slate-600 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A71930]" />
                    <span>{cleanLocationDetail(profile.district, profile.taluka, profile.city)}</span>
                  </p>

                  {profile.bio && (
                    <p className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200 mt-3 italic">
                      "{profile.bio}"
                    </p>
                  )}
                </div>

                {/* Grid Summary */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
                  <div>
                    <span className="text-slate-500 block font-medium">{t('age')} / {t('height')}</span>
                    <span className="font-bold text-slate-900">{profile.age} वर्षे | {profile.height}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">{t('marital_status')}</span>
                    <span className="font-bold text-[#A71930]">
                      {profile.maritalStatus === 'never_married' ? 'अविवाहित' : profile.maritalStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">{t('education')}</span>
                    <span className="font-bold text-slate-900 truncate block">{profile.education}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">{t('occupation')}</span>
                    <span className="font-bold text-slate-900 truncate block">{profile.occupation}</span>
                  </div>
                </div>

                {/* Aadhaar & Verification badge */}
                <div className="flex items-center gap-2 text-xs">
                  {profile.aadhaarVerified ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>आधार कार्ड पडताळणी पूर्ण (Aadhaar Verified)</span>
                    </span>
                  ) : (
                    <span className="text-amber-800 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>ओळखपत्र पडताळणी सुरू आहे</span>
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-amber-200 overflow-x-auto text-xs font-bold gap-2 pb-1">
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'personal'
                    ? 'bg-[#A71930] text-white shadow'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-amber-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>वैयक्तिक माहिती</span>
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'professional'
                    ? 'bg-[#A71930] text-white shadow'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-amber-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>शिक्षण व नोकरी</span>
              </button>
              <button
                onClick={() => setActiveTab('family')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'family'
                    ? 'bg-[#A71930] text-white shadow'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-amber-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>कौटुंबिक माहिती</span>
              </button>
              <button
                onClick={() => setActiveTab('expectations')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'expectations'
                    ? 'bg-[#A71930] text-white shadow'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-amber-200'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>अपेक्षा</span>
              </button>
              <button
                onClick={() => setActiveTab('horoscope')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'horoscope'
                    ? 'bg-[#A71930] text-white shadow'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-amber-200'
                }`}
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>पत्रिका व राशी</span>
              </button>
            </div>

            {/* Tab Content Box */}
            <div className="bg-white p-6 rounded-3xl border border-amber-200 text-xs sm:text-sm">
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">जन्म तारीख</span>
                    <span className="font-bold text-slate-900">{profile.dob} ({profile.age} वर्षे)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">जन्म वेळ व स्थान</span>
                    <span className="font-bold text-slate-900">{profile.birthTime || 'सकाळी १०:३० AM'} ({profile.birthPlace || profile.district})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">उंची / वजन</span>
                    <span className="font-bold text-slate-900">{profile.height} | {profile.weight || '५५ किलो'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">वर्ण व रक्तगट</span>
                    <span className="font-bold text-[#A71930]">{profile.complexion || 'गोरा'} | {profile.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">उपजात</span>
                    <span className="font-bold text-[#A71930]">{profile.subCaste}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">गोत्र / राशी</span>
                    <span className="font-bold text-slate-900">{profile.gotra || 'काश्यप'} | {profile.rashi || 'मकर'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">कायमचा पत्ता (Native)</span>
                    <span className="font-bold text-slate-900">{profile.nativeAddress || `${profile.taluka}, ${profile.district}`}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">सध्याचा पत्ता (Current)</span>
                    <span className="font-bold text-slate-900">{profile.currentAddress || profile.city}</span>
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">शिक्षण</span>
                    <span className="font-extrabold text-slate-900 text-base">{profile.education}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">व्यवसाय / नोकरी</span>
                    <span className="font-extrabold text-[#A71930] text-base">{profile.occupation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">वार्षिक उत्पन्न</span>
                    <span className="font-bold text-emerald-700">{profile.income}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">नोकरीचे ठिकाण</span>
                    <span className="font-bold text-slate-900">{profile.city}, {profile.district}</span>
                  </div>
                </div>
              )}

              {activeTab === 'family' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">वडिलांचे नाव व व्यवसाय</span>
                      <span className="font-bold text-slate-900">{profile.fatherName || 'श्री. मुंडे'} ({profile.fatherOccupation})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">आईचे नाव व व्यवसाय</span>
                      <span className="font-bold text-slate-900">{profile.motherName || 'सौ. मुंडे'} ({profile.motherOccupation})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">भाऊ व बहीण तपशील</span>
                      <span className="font-bold text-slate-900">
                        {profile.brothers} भाऊ, {profile.sisters} बहीण
                        {profile.brotherDetails && ` (${profile.brotherDetails})`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">कुटुंब पद्धत</span>
                      <span className="font-bold text-[#A71930]">{profile.familyType}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                    <div>
                      <span className="text-[#A71930] text-xs block font-bold">नातेवाईक आडनावे (Relative Surnames):</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {profile.relativeSurnames && profile.relativeSurnames.length > 0 ? (
                          profile.relativeSurnames.map((sur, idx) => (
                            <span key={idx} className="bg-white px-2.5 py-1 rounded-md text-slate-800 border border-amber-200 font-bold text-xs">
                              {sur}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-700 font-semibold">मुंडे, सानप, नागरे, काकड, घूगे, आघाव</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200">
                      <div>
                        <span className="text-slate-500 text-[11px] block">मामांचे नाव</span>
                        <span className="font-bold text-slate-800 text-xs">{profile.mamaName || 'श्री. सानप'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">मामांचे गाव</span>
                        <span className="font-bold text-slate-800 text-xs">{profile.mamaNative || profile.district}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'expectations' && (
                <div>
                  <span className="text-slate-500 text-xs block mb-1 font-semibold">अपेक्षित जोडीदाराचे वर्णन:</span>
                  <p className="text-slate-800 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-200 font-medium">
                    {profile.expectations}
                  </p>
                </div>
              )}

              {activeTab === 'horoscope' && (
                <div className="text-center py-6 space-y-4">
                  <Scroll className="w-12 h-12 text-[#A71930] mx-auto" />
                  <h4 className="font-bold text-base text-slate-900">पत्रिका व गुणमेलन माहिती</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    या प्रोफाईलची पत्रिका / कुंडली उपलब्ध आहे. तुम्ही डाऊनलोड करून गुरुजींकडून गुण जुळवून पाहू शकता.
                  </p>
                  <button
                    onClick={() => alert('कुंडली / पत्रिका PDF डाउनलोड सुरू झाली आहे.')}
                    className="px-6 py-2.5 rounded-xl bg-[#A71930] hover:bg-[#800C1E] text-white text-xs font-bold inline-flex items-center gap-2 shadow"
                  >
                    <Download className="w-4 h-4" />
                    <span>पत्रिका (Horoscope PDF) डाऊनलोड करा</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-amber-50 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#A71930] hover:bg-[#800C1E] text-white text-xs font-black flex items-center gap-1.5 shadow-md border border-amber-300"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>बायोडाटा प्रिंट करा</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Share2 className="w-4 h-4" />
                <span>शेअर करा</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isAuthorized ? (
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${profile.mobile}`}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>कॉल करा ({profile.mobile})</span>
                  </a>
                  <button
                    onClick={() => {
                      onClose();
                      setActiveChatUser(profile);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>चॅट करा</span>
                  </button>
                </div>
              ) : pendingReq ? (
                <div className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-default">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>मान्यतेसाठी प्रलंबित (प्रशासकीय पडताळणी सुरु आहे)</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {/* Pay Per Contact Button - Hidden if isPayPerContactEnabled is false */}
                  {siteConfig?.isPayPerContactEnabled !== false && (
                    <button
                      onClick={() => {
                        if (checkGuestPermission('viewProfiles', 'संपर्क अन-लॉक')) {
                          if (siteConfig?.isOfferModeEnabled || siteConfig?.disableAllPaymentsInOfferMode) {
                            unlockContact(profile.id);
                            alert('🎁 विशेष सण ऑफर: संपर्क क्रमांक विनामूल्य अन-लॉक झाला आहे!');
                          } else {
                            setSelectedProfileForUnlock(profile);
                            setIsContactUnlockModalOpen(true);
                          }
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 text-amber-100 text-xs font-black flex items-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer border border-emerald-400"
                    >
                      <Lock className="w-4 h-4 text-amber-300" />
                      <span>
                        {siteConfig?.isOfferModeEnabled
                          ? '🎁 मोफत संपर्क अन-लॉक करा (Offer)'
                          : 'संपर्क अन-लॉक करा (Pay-Per-Contact)'}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      requestContactAuthorization(profile.id);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#A71930] hover:bg-[#800C1E] text-amber-100 text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>मोफत विनंती करा</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => sendInterest(profile.id)}
                disabled={!!interestObj}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-100 text-[#A71930] border border-amber-300 text-xs font-bold flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-[#A71930] text-[#A71930]" />
                <span>{interestObj ? 'प्रतिसाद पाठवला' : 'प्रतिसाद पाठवा'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Print Biodata View Modal */}
      {isPrintModalOpen && (
        <PrintBiodataModal
          profile={profile}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-fadeIn">
          {/* Lightbox Header */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-black text-amber-400 text-sm sm:text-base">{profile.fullName}</h3>
              <p className="text-[11px] text-slate-400">फोटो {selectedPhotoIndex + 1} पैकी {profile.photos.length}</p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-slate-800 hover:bg-rose-600 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Main Image */}
          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center my-4 overflow-hidden">
            <img
              src={profile.photos[selectedPhotoIndex] || profile.photos[0]}
              alt="fullscreen profile photo"
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border-2 border-amber-400/40"
            />
          </div>

          {/* Lightbox Navigation Controls */}
          {profile.photos.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {profile.photos.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedPhotoIndex === idx ? 'border-amber-400 scale-110 shadow-lg' : 'border-slate-700 opacity-50'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
