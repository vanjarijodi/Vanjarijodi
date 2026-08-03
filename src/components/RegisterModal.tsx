import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MAHARASHTRA_DISTRICTS } from '../data/initialData';
import { UserProfile, Gender, MaritalStatus } from '../types';
import { AIBioDataExtractor } from './AIBioDataExtractor';
import { uploadToCloudinary } from '../utils/cloudinary';
import {
  X,
  UserCheck,
  CheckCircle,
  Sparkles,
  Camera,
  Bot,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';

export const RegisterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    t,
    language,
    addProfile,
    siteConfig,
    registrationStep,
    setRegistrationStep
  } = useApp();

  // Selected registration mode: 'manual' | 'ocr_photo'
  const [activeMode, setActiveMode] = useState<'manual' | 'ocr_photo'>(
    registrationStep === 'ocr_photo' ? 'ocr_photo' : 'manual'
  );
  const [showSelector, setShowSelector] = useState<boolean>(true);

  // Form Steps for Manual Mode
  const [step, setStep] = useState<number>(1);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('bride');
  const [dob, setDob] = useState('2000-01-01');
  const [birthTime, setBirthTime] = useState('१०:३० AM');
  const [birthPlace, setBirthPlace] = useState('बीड (Beed)');
  const [mobile, setMobile] = useState('');
  const [secondaryMobile, setSecondaryMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [district, setDistrict] = useState('बीड (Beed)');
  const [taluka, setTaluka] = useState('परळी वैजनाथ');
  const [city, setCity] = useState('परळी');
  const [currentAddress, setCurrentAddress] = useState('बाणेर, पुणे');
  const [nativeAddress, setNativeAddress] = useState('मु. पो. धर्मापुरी, ता. परळी, जि. बीड');
  const [subCaste, setSubCaste] = useState('वंजारी (NT-D)');
  const [gotra, setGotra] = useState('काश्यप');
  const [rashi, setRashi] = useState('धनु');
  const [nakshatra, setNakshatra] = useState('मूळ');
  const [gan, setGan] = useState('देव');
  const [nadi, setNadi] = useState('आद्य');

  const [education, setEducation] = useState('M.Tech (Computer Science)');
  const [occupation, setOccupation] = useState('Senior Software Engineer');
  const [companyName, setCompanyName] = useState('TCS Pune');
  const [income, setIncome] = useState('₹ 12 - 20 लाख वार्षिक');
  const [height, setHeight] = useState("5'5\"");
  const [weight, setWeight] = useState('58 kg');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [complexion, setComplexion] = useState('गोरा (Fair)');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('never_married');

  const [fatherName, setFatherName] = useState('');
  const [fatherOcc, setFatherOcc] = useState('सेवानिवृत्त शिक्षक');
  const [motherName, setMotherName] = useState('');
  const [motherOcc, setMotherOcc] = useState('गृहिणी');
  const [brothers, setBrothers] = useState(1);
  const [brotherDetails, setBrotherDetails] = useState('१ लहान भाऊ (B.E. Mechanical)');
  const [sisters, setSisters] = useState(1);
  const [sisterDetails, setSisterDetails] = useState('१ मोठी बहीण (विवाहित)');
  const [relativeSurnames, setRelativeSurnames] = useState('मुंडे, सानप, नागरे, काकड, घूगे, फड');
  const [mamaName, setMamaName] = useState('श्री. रामभाऊ काकड');
  const [mamaNative, setMamaNative] = useState('पाथर्डी, जि. अहिल्यानगर');
  const [familyType, setFamilyType] = useState('एकत्र कुटुंब');
  const [expectations, setExpectations] = useState('पुणे किंवा छत्रपती संभाजीनगर येथे नोकरी करणारी सुशिक्षित, सुसंस्कृत वंजारी कन्या.');

  const [photoUrls, setPhotoUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  ]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [extractedSuccessBadge, setExtractedSuccessBadge] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate age
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 24;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? age : 24;
  };

  const currentAge = calculateAge(dob);

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) {
      alert(language === 'mr' ? 'कृपया १० अंकी वैध मुख्य मोबाईल नंबर टाका.' : 'Enter valid 10-digit primary mobile number.');
      return;
    }
    setOtpSent(true);
    alert(language === 'mr' ? 'तुमचा पडताळणी कोड: 123456 मोबाईलवर पाठवला आहे.' : 'Verification code sent: 123456');
  };

  const handleVerifyOtp = () => {
    if (otpInput === '123456' || otpInput.length === 6) {
      setIsOtpVerified(true);
    } else {
      alert(language === 'mr' ? 'चुकीचा OTP. कृपया 123456 टाका.' : 'Invalid OTP. Use 123456');
    }
  };

  const handlePhotoUploadSim = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 600 * 1024) {
        setPhotoError(`फोटोचा आकार ${(file.size / 1024).toFixed(0)} KB आहे! फोटो ६०० KB पेक्षा कमी असावा. (Max 600 KB Limit)`);
        return;
      }
      if (photoUrls.length >= 5) {
        setPhotoError('आपण जास्तीत जास्त ५ फोटो जोडलेले आहेत.');
        return;
      }

      setIsUploadingPhoto(true);
      const res = await uploadToCloudinary(file, 'vanjarijodi_candidates');
      setIsUploadingPhoto(false);

      if (res.success && res.url) {
        setPhotoUrls((prev) => [...prev, res.url]);
      } else {
        setPhotoError(res.error || 'क्लाउडवर फोटो अपलोड करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.');
      }
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotoUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      alert('कृपया संपूर्ण नाव टाका.');
      return;
    }
    if (!mobile) {
      alert('कृपया मुख्य मोबाईल नंबर टाका.');
      return;
    }

    const newProfile: UserProfile = {
      id: 'vj-' + Math.floor(100 + Math.random() * 900),
      fullName,
      gender,
      dob,
      age: currentAge,
      birthTime,
      birthPlace,
      mobile,
      secondaryMobile,
      email: email || 'user@vanjarijodi.com',
      district,
      taluka: taluka || 'मुख्य तालुका',
      city: city || 'शहर',
      currentAddress,
      nativeAddress,
      education: education || 'पदवीधर (Graduate)',
      occupation: occupation || 'व्यवसाय / नोकरी',
      companyName,
      income,
      height,
      weight,
      bloodGroup,
      complexion,
      maritalStatus,
      religion: 'हिंदू (Hindu)',
      subCaste,
      gotra,
      rashi,
      nakshatra,
      gan,
      nadi,
      fatherName,
      fatherOccupation: fatherOcc,
      motherName,
      motherOccupation: motherOcc,
      brothers,
      brotherDetails,
      sisters,
      sisterDetails,
      relativeSurnames: relativeSurnames ? relativeSurnames.split(',').map((s) => s.trim()) : [],
      mamaName,
      mamaNative,
      familyType,
      expectations: expectations || 'सुशिक्षित आणि सुसंस्कृत वंजारी जोडीदार.',
      photos: photoUrls,
      aadhaarVerified: true,
      isVerified: true,
      isFeatured: false,
      isApproved: true,
      membership: 'free',
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'आत्ताच नोंदणी',
      bio: `नोंदणी प्रकार: ${activeMode === 'ocr_photo' ? 'फोटो/PDF एआय स्कॅन' : 'मॅन्युअल नोंदणी'}.`,
      privacy: { hideContact: false, hidePhoto: false },
      registrationType: activeMode === 'ocr_photo' ? 'ocr_ai' : 'manual',
    };

    addProfile(newProfile);
    alert(
      language === 'mr'
        ? 'अभिनंदन! वंजारीजोडी वर तुमची नोंदणी यशस्वी झाली आहे.'
        : 'Congratulations! Registration successful on VanjariJodi.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FFFDF5] border-2 border-amber-400 rounded-3xl shadow-2xl text-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#800C1E] via-[#A71930] to-[#800C1E] border-b border-amber-300 text-amber-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-400/20 text-amber-200 border border-amber-300/40">
              <Sparkles className="w-6 h-6 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-100 tracking-tight">
                वंजारी वधू-वर नोंदणी केंद्र (Registration)
              </h2>
              <p className="text-xs text-amber-200/90 font-medium">
                {siteConfig?.logoSubtitle || 'वंजारी समाजाचे हक्काचे व विश्वासाचे सुवर्ण व्यासपीठ'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-amber-100/10 hover:bg-amber-100/20 text-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VOLUNTARY FORM GUIDANCE NOTICE */}
        <div className="bg-amber-100 border-b border-amber-300 px-6 py-2.5 text-xs text-amber-950 font-bold flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#A71930] shrink-0" />
            <span>
              <strong className="text-[#A71930]">महत्त्वाची सूचना:</strong> या अर्जामधील कोणतेही रकाने अनिवार्य (Compulsory) नाहीत. आपल्याकडे जेवढी माहिती उपलब्ध असेल तेवढीच भरून सोयीस्कर नोंदणी पूर्ण करावी.
            </span>
          </div>
        </div>

        {/* STEP 1: CLEAN SELECTOR POPUP (If showSelector is true) */}
        {showSelector ? (
          <div className="p-8 space-y-6 text-center overflow-y-auto">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-[#A71930] font-black text-xs border border-amber-300 uppercase tracking-wider">
                पसंतीचा नोंदणी पर्याय निवडा
              </span>
              <h3 className="text-2xl font-black text-[#A71930]">
                तुम्हाला नोंदणी कशी करायची आहे?
              </h3>
              <p className="text-xs text-slate-600 max-w-lg mx-auto font-medium">
                खालील दोन पर्यायांपैकी एक बटण निवडा. फोटो किंवा बायोडाटा कागदपत्र अपलोड करून अवघ्या १० सेकंदांत माहिती ऑटो-फिल करा किंवा मॅन्युअली फॉर्म भरा.
              </p>
            </div>

            {/* 2 PROMINENT BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto pt-2">
              
              {/* Option 1: Manual Form Registration */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode('manual');
                  setShowSelector(false);
                }}
                className="group relative p-6 rounded-2xl bg-white border-2 border-amber-300 hover:border-[#A71930] hover:shadow-2xl transition-all text-left space-y-3 cursor-pointer overflow-hidden active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#A71930] flex items-center justify-center text-2xl border border-amber-300 group-hover:bg-[#A71930] group-hover:text-white transition-colors">
                  {siteConfig?.regOption1Icon || '📝'}
                </div>
                <div>
                  <h4 className="text-base font-black text-[#A71930] group-hover:text-[#800C1E]">
                    {siteConfig?.regOption1Title || '१. मॅन्युअल नोंदणी / फॉर्म भरा'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    वैयक्तिक, शैक्षणिक, कौटुंबिक व संपर्क माहिती स्वतः ५ सोप्या टप्प्यांत भरा.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-[#A71930] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>फॉर्म भरण्यास सुरुवात करा</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* Option 2: Photo / PDF BioData Upload (AI Scan) */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode('ocr_photo');
                  setShowSelector(false);
                }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/80 border-2 border-amber-400 hover:border-[#A71930] hover:shadow-2xl transition-all text-left space-y-3 cursor-pointer overflow-hidden active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#A71930] text-amber-200 flex items-center justify-center text-2xl border border-amber-300 shadow">
                  {siteConfig?.regOption2Icon || '📁'}
                </div>
                <div>
                  <h4 className="text-base font-black text-[#800C1E]">
                    {siteConfig?.regOption2Title || '२. फोटो किंवा PDF द्वारे नोंदणी'}
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 font-medium leading-relaxed">
                    तुमच्या व्हॉट्सॲप किंवा कागदी बायोडाटाचा फोटो अपलोड करा. आमचे एआय तंत्रज्ञान स्वयंचलित वाचन करेल.
                  </p>
                </div>
                <div className="pt-2 text-xs font-bold text-[#A71930] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>बायोडाटा फोटो अपलोड करा</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

            </div>

            <p className="text-[11px] text-slate-500 pt-4">
              टीप: वंजारी समाजातील सदस्यांसाठी मोफत नोंदणी सुविधा उपलब्ध आहे.
            </p>
          </div>
        ) : (
          /* STEP 2: SPECIFIC REGISTRATION FORM (NO NESTED DUPLICATES) */
          <div className="flex-1 overflow-y-auto flex flex-col">
            
            {/* Top Toolbar to change mode back to selector */}
            <div className="px-6 py-2.5 bg-amber-100/90 border-b border-amber-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <button
                type="button"
                onClick={() => setShowSelector(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-200 text-[#A71930] border border-amber-300 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← नोंदणी पर्याय बदला (Change Option)</span>
              </button>

              <span className="px-3 py-1 rounded-full bg-amber-200 text-[#800C1E] font-black">
                {activeMode === 'ocr_photo' ? 'स्कॅन पर्याय: बायोडाटा फोटो/PDF' : 'मॅन्युअल पर्याय: ५-टप्पे फॉर्म'}
              </span>
            </div>

            {/* AI OCR PHOTO UPLOAD VIEW */}
            {activeMode === 'ocr_photo' ? (
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <AIBioDataExtractor
                  onExtracted={(ext) => {
                    if (ext.fullName) setFullName(ext.fullName);
                    if (ext.gender) setGender(ext.gender);
                    if (ext.dob) setDob(ext.dob);
                    if (ext.birthTime) setBirthTime(ext.birthTime);
                    if (ext.birthPlace) setBirthPlace(ext.birthPlace);
                    if (ext.subCaste) setSubCaste(ext.subCaste);
                    if (ext.gotra) setGotra(ext.gotra);
                    if (ext.rashi) setRashi(ext.rashi);
                    if (ext.nakshatra) setNakshatra(ext.nakshatra);
                    if (ext.gan) setGan(ext.gan);
                    if (ext.nadi) setNadi(ext.nadi);
                    if (ext.height) setHeight(ext.height);
                    if (ext.weight) setWeight(ext.weight);
                    if (ext.bloodGroup) setBloodGroup(ext.bloodGroup);
                    if (ext.complexion) setComplexion(ext.complexion);
                    if (ext.education) setEducation(ext.education);
                    if (ext.occupation) setOccupation(ext.occupation);
                    if (ext.companyName) setCompanyName(ext.companyName);
                    if (ext.income) setIncome(ext.income);
                    if (ext.fatherName) setFatherName(ext.fatherName);
                    if (ext.fatherOccupation) setFatherOcc(ext.fatherOccupation);
                    if (ext.motherName) setMotherName(ext.motherName);
                    if (ext.motherOccupation) setMotherOcc(ext.motherOccupation);
                    if (typeof ext.brothers === 'number') setBrothers(ext.brothers);
                    if (ext.brotherDetails) setBrotherDetails(ext.brotherDetails);
                    if (typeof ext.sisters === 'number') setSisters(ext.sisters);
                    if (ext.sisterDetails) setSisterDetails(ext.sisterDetails);
                    if (Array.isArray(ext.relativeSurnames)) setRelativeSurnames(ext.relativeSurnames.join(', '));
                    if (ext.mamaName) setMamaName(ext.mamaName);
                    if (ext.mamaNative) setMamaNative(ext.mamaNative);
                    if (ext.mobile) setMobile(ext.mobile);
                    if (ext.email) setEmail(ext.email);
                    if (ext.currentAddress) setCurrentAddress(ext.currentAddress);
                    if (ext.nativeAddress) setNativeAddress(ext.nativeAddress);
                    if (ext.district) setDistrict(ext.district);
                    if (ext.taluka) setTaluka(ext.taluka);
                    if (ext.city) setCity(ext.city);
                    if (ext.expectations) setExpectations(ext.expectations);

                    if (ext.candidatePhotoUrl) {
                      setPhotoUrls((prev) => Array.from(new Set([ext.candidatePhotoUrl!, ...prev])));
                    }

                    setExtractedSuccessBadge(
                      ext.candidatePhotoUrl
                        ? '✨ एआय वाचन व फोटो डिटेक्शन यशस्वी! सर्व माहिती आणि वधू/वराचा फोटो स्वयंचलित डिटेक्ट करून प्रोफाईलला लिंक केला आहे.'
                        : 'एआय वाचन यशस्वी! १९ रकाने स्वयंचलित भरले गेले आहेत. खाली तपासून जतन करा.'
                    );
                    setActiveMode('manual');
                    setStep(1);
                  }}
                />
              </div>
            ) : (
              /* MANUAL MULTI-STEP FORM VIEW */
              <form onSubmit={handleSubmitRegistration} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
                
                {/* Step Progress Bar */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 pb-3 border-b border-amber-200 overflow-x-auto gap-2">
                  <span className={`px-3 py-1.5 rounded-xl transition-all ${step === 1 ? 'bg-[#A71930] text-amber-100 shadow' : 'bg-amber-100 text-slate-700'}`}>
                    १. वैयक्तिक माहिती
                  </span>
                  <span className={`px-3 py-1.5 rounded-xl transition-all ${step === 2 ? 'bg-[#A71930] text-amber-100 shadow' : 'bg-amber-100 text-slate-700'}`}>
                    २. शिक्षण व नोकरी
                  </span>
                  <span className={`px-3 py-1.5 rounded-xl transition-all ${step === 3 ? 'bg-[#A71930] text-amber-100 shadow' : 'bg-amber-100 text-slate-700'}`}>
                    ३. कौटुंबिक तपशील
                  </span>
                  <span className={`px-3 py-1.5 rounded-xl transition-all ${step === 4 ? 'bg-[#A71930] text-amber-100 shadow' : 'bg-amber-100 text-slate-700'}`}>
                    ४. संपर्क व फोटो
                  </span>
                </div>

                {/* STEP 1: Personal Details */}
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-800 font-bold mb-1">
                          संपूर्ण नाव (Full Name) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. ज्ञानेश्वर भगवान सानप / पूजा रामदास मुंडे"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">लिंग (Gender) *</label>
                        <div className="grid grid-cols-2 gap-2 bg-amber-100 p-1 rounded-xl border border-amber-300">
                          <button
                            type="button"
                            onClick={() => setGender('bride')}
                            className={`py-2 rounded-lg font-bold transition-all ${
                              gender === 'bride' ? 'bg-[#A71930] text-amber-100 shadow' : 'text-slate-700'
                            }`}
                          >
                            👰 वधू (Bride)
                          </button>
                          <button
                            type="button"
                            onClick={() => setGender('groom')}
                            className={`py-2 rounded-lg font-bold transition-all ${
                              gender === 'groom' ? 'bg-[#A71930] text-amber-100 shadow' : 'text-slate-700'
                            }`}
                          >
                            🤵 वर (Groom)
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">वैवाहिक स्थिती (Marital Status)</label>
                        <select
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#A71930]"
                        >
                          <option value="never_married">अविवाहित (Never Married)</option>
                          <option value="divorced">घटस्फोटित (Divorced)</option>
                          <option value="widowed">विधवा / विधुर (Widowed)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">जन्मतारीख (Date of Birth) *</label>
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">वय (Age Calculated):</label>
                        <div className="w-full bg-amber-100 border-2 border-amber-300 rounded-xl px-3.5 py-2.5 text-[#A71930] font-black">
                          {currentAge} वर्षे
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">जन्म वेळ (Birth Time)</label>
                        <input
                          type="text"
                          placeholder="उदा. सकाळी १०:३० AM"
                          value={birthTime}
                          onChange={(e) => setBirthTime(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">जन्म ठिकाण (Birth Place)</label>
                        <input
                          type="text"
                          placeholder="उदा. बीड / अंबाजोगाई"
                          value={birthPlace}
                          onChange={(e) => setBirthPlace(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>
                    </div>

                    {/* Horoscope Details */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
                      <h4 className="font-extrabold text-[#A71930] text-xs">पत्रिका माहिती (Horoscope Details)</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <label className="block text-slate-700 text-[11px] mb-0.5">उपजात (Sub-caste)</label>
                          <input
                            type="text"
                            value={subCaste}
                            onChange={(e) => setSubCaste(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 text-[11px] mb-0.5">गोत्र (Gotra)</label>
                          <input
                            type="text"
                            value={gotra}
                            onChange={(e) => setGotra(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 text-[11px] mb-0.5">राशी (Rashi)</label>
                          <input
                            type="text"
                            value={rashi}
                            onChange={(e) => setRashi(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 text-[11px] mb-0.5">नक्षत्र (Nakshatra)</label>
                          <input
                            type="text"
                            value={nakshatra}
                            onChange={(e) => setNakshatra(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Education & Occupation */}
                {step === 2 && (
                  <div className="space-y-4 animate-fade-in font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-800 font-bold mb-1">शिक्षण (Education) *</label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. B.E. Computer / M.Sc / MBBS"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">नोकरी किंवा व्यवसाय (Occupation) *</label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. सॉफ्टवेयर इंजिनियर / शेती / व्यवसाय"
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">कंपनी / ऑफिस नाव (Company Name)</label>
                        <input
                          type="text"
                          placeholder="उदा. TCS Pune / शासकीय रुग्णालय"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">वार्षिक उत्पन्न (Annual Income)</label>
                        <input
                          type="text"
                          placeholder="उदा. ₹ ८ ते १२ लाख वार्षिक"
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>
                    </div>

                    {/* Physical Details */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
                      <h4 className="font-extrabold text-[#A71930] text-xs">शारीरिक माहिती (Physical Attributes)</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <label className="block text-slate-700 text-[11px] mb-0.5">उंची (Height)</label>
                          <input
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 text-[11px] mb-0.5">वजन (Weight)</label>
                          <input
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 text-[11px] mb-0.5">रक्तगट (Blood Group)</label>
                          <input
                            type="text"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 text-[11px] mb-0.5">वर्ण / रंग (Complexion)</label>
                          <input
                            type="text"
                            value={complexion}
                            onChange={(e) => setComplexion(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-slate-900 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Family Details & Relatives */}
                {step === 3 && (
                  <div className="space-y-4 animate-fade-in font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-800 font-bold mb-1">वडिलांचे नाव (Father's Name)</label>
                        <input
                          type="text"
                          placeholder="उदा. श्री. रामदास विष्णू मुंडे"
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">वडिलांचा व्यवसाय (Father Occupation)</label>
                        <input
                          type="text"
                          placeholder="उदा. शेतकरी / सेवानिवृत्त शिक्षक"
                          value={fatherOcc}
                          onChange={(e) => setFatherOcc(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">आईचे नाव (Mother's Name)</label>
                        <input
                          type="text"
                          placeholder="उदा. सौ. सुनिता रामदास मुंडे"
                          value={motherName}
                          onChange={(e) => setMotherName(e.target.value)}
                          className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-bold mb-1">मामांचे नाव व गाव (Mama Name & Native)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="मामांचे नाव"
                            value={mamaName}
                            onChange={(e) => setMamaName(e.target.value)}
                            className="w-full bg-white border-2 border-amber-200 rounded-xl px-3 py-2 text-slate-900 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="मामांचे गाव"
                            value={mamaNative}
                            onChange={(e) => setMamaNative(e.target.value)}
                            className="w-full bg-white border-2 border-amber-200 rounded-xl px-3 py-2 text-slate-900 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sibling Details */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
                      <h4 className="font-extrabold text-[#A71930] text-xs">नातेवाईक व भावंडे (Relatives & Siblings)</h4>
                      <div>
                        <label className="block text-slate-700 text-[11px] mb-1">
                          नातेवाईक आडनावे (Relative Surnames like Munde, Sanap, Nagre, Kakad, Ghuge)
                        </label>
                        <input
                          type="text"
                          placeholder="मुंडे, सानप, नागरे, काकड, घूगे, फड, आव्हाड"
                          value={relativeSurnames}
                          onChange={(e) => setRelativeSurnames(e.target.value)}
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Enhanced Contact Details, Address & Photo */}
                {step === 4 && (
                  <div className="space-y-4 animate-fade-in font-semibold">
                    
                    {/* REQUIREMENT 4: ENHANCED REGISTRATION FIELDS */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
                      <h4 className="font-extrabold text-[#A71930] text-xs flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-[#A71930]" />
                        <span>१. संपर्क क्रमांक व ईमेल (Contact Details)</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-800 font-bold mb-1">
                            मुख्य मोबाईल नंबर (Primary Mobile - Required) *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98220 12345"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-800 font-bold mb-1">
                            पर्यायी मोबाईल नंबर (Secondary Mobile - Optional / ऐच्छिक)
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 94220 54321"
                            value={secondaryMobile}
                            onChange={(e) => setSecondaryMobile(e.target.value)}
                            className="w-full bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-800 font-bold mb-1">
                            ईमेल आयडी (Email ID)
                          </label>
                          <input
                            type="email"
                            placeholder="pooja.munde@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Fields */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
                      <h4 className="font-extrabold text-[#A71930] text-xs flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#A71930]" />
                        <span>२. जिल्हा व पत्ता माहिती (District & Detailed Address)</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-800 font-bold mb-1">जिल्हा (District) *</label>
                          <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#A71930]"
                          >
                            {MAHARASHTRA_DISTRICTS.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-800 font-bold mb-1">तालुका व गाव/शहर</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="तालुका"
                              value={taluka}
                              onChange={(e) => setTaluka(e.target.value)}
                              className="w-full bg-white border-2 border-amber-300 rounded-xl px-3 py-2 text-slate-900 outline-none"
                            />
                            <input
                              type="text"
                              placeholder="शहर/गाव"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full bg-white border-2 border-amber-300 rounded-xl px-3 py-2 text-slate-900 outline-none"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-800 font-bold mb-1">कायमचा व मूळ पत्ता (Native Address)</label>
                          <input
                            type="text"
                            placeholder="उदा. मु. पो. धर्मापुरी, ता. परळी, जि. बीड"
                            value={nativeAddress}
                            onChange={(e) => setNativeAddress(e.target.value)}
                            className="w-full bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-800 font-bold mb-1">सध्याचा राहता पत्ता (Current Address)</label>
                          <input
                            type="text"
                            placeholder="उदा. बाणेर, पुणे / सिडको, संभाजीनगर"
                            value={currentAddress}
                            onChange={(e) => setCurrentAddress(e.target.value)}
                            className="w-full bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Photos Upload */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-900 font-extrabold text-xs">
                          ३. क्लाउड फोटो अपलोड (Cloudinary Direct Storage)
                        </label>
                        <span className="text-[11px] font-bold text-[#A71930] bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          जास्तीत जास्त ६०० KB पर्यंत फोटो (Max 600 KB)
                        </span>
                      </div>

                      {photoError && (
                        <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{photoError}</span>
                        </div>
                      )}

                      <div className="border-2 border-dashed border-amber-400 rounded-2xl p-4 text-center bg-white hover:border-[#A71930] transition-colors">
                        {isUploadingPhoto ? (
                          <div className="flex flex-col items-center justify-center py-2 text-[#A71930] space-y-1">
                            <Loader2 className="w-7 h-7 animate-spin text-[#A71930]" />
                            <p className="text-xs font-bold">क्लाउडवर सुरक्षित फोटो अपलोड होत आहे...</p>
                          </div>
                        ) : (
                          <>
                            <Camera className="w-8 h-8 text-[#A71930] mx-auto mb-1" />
                            <p className="text-xs text-slate-800 font-bold">
                              इथे क्लिक करून फोटो जोडा (जास्तीत जास्त ६०० KB, कमाल ५ फोटो)
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUploadSim}
                              disabled={isUploadingPhoto}
                              className="hidden"
                              id="modal-photo-upload"
                            />
                            <label
                              htmlFor="modal-photo-upload"
                              className="inline-block mt-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#A71930] font-bold text-xs border border-amber-300 cursor-pointer shadow-sm transition-all"
                            >
                              गॅलरी मधून फोटो निवडा
                            </label>
                          </>
                        )}
                      </div>

                      {/* Photo Thumbnails */}
                      {photoUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {photoUrls.map((url, index) => (
                            <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-amber-300 shadow">
                              <img src={url} alt="upload" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* Form Step Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-amber-200">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-slate-800 font-bold text-xs border border-amber-300 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>मागे (Previous)</span>
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A71930] to-[#C82333] hover:from-[#800C1E] text-amber-100 font-black text-xs shadow-md border border-amber-300/40 flex items-center gap-1"
                    >
                      <span>पुढील टप्पा →</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs shadow-xl border border-emerald-400 flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>नोंदणी फॉर्म सबमिट करा</span>
                    </button>
                  )}
                </div>

              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
