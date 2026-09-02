import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Sparkles,
  UserCheck,
  ShieldCheck,
  UserPlus,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Mail,
  Loader2,
  Smartphone,
  Info,
  Clock
} from 'lucide-react';
import { VanjariJodiLogo } from './VanjariJodiLogo';
import { logSecurityEvent } from '../utils/securityService';

type LoginTabMode = 'truecaller' | 'member_otp' | 'google' | 'member_pass' | 'member_email' | 'guest';

export const LoginModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    language,
    setIsRegisterOpen,
    setCurrentUser,
    setCurrentView,
    profiles,
    setIsAdminOpen,
    loginAsGuest,
    loginWithGoogle,
    loginWithEmail,
    loginWithTruecaller,
    siteConfig,
    loginModalMode
  } = useApp();

  const isGuestAllowed = siteConfig?.enableGuestLogin !== false;

  // Active Tab Mode
  const [mode, setMode] = useState<LoginTabMode>('truecaller');

  // Loading States
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTruecallerLoading, setIsTruecallerLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Success / Pending Approval Feedback State
  const [successBanner, setSuccessBanner] = useState<{
    userName: string;
    isNewUser: boolean;
    authMethod: string;
    isApproved: boolean;
    emailOrMobile?: string;
  } | null>(null);

  // Synchronize modal sub-mode when opened
  useEffect(() => {
    if (isOpen) {
      if (loginModalMode === 'guest' && isGuestAllowed) setMode('guest');
      else if (loginModalMode === 'member_pass') setMode('member_pass');
      else if (loginModalMode === 'member_otp') setMode('member_otp');
      else setMode('truecaller');
    }
    if (!isOpen) {
      setSuccessBanner(null);
      setIsGoogleLoading(false);
      setIsTruecallerLoading(false);
      setIsEmailLoading(false);
    }
  }, [isOpen, loginModalMode, isGuestAllowed]);

  // Truecaller Form States
  const [truecallerMobile, setTruecallerMobile] = useState('');
  const [truecallerName, setTruecallerName] = useState('');
  const [truecallerCity, setTruecallerCity] = useState('बीड (Beed)');
  const [isTruecallerAutoFilling, setIsTruecallerAutoFilling] = useState(false);

  // Mobile OTP States
  const [memberMobile, setMemberMobile] = useState('');
  const [memberOtpSent, setMemberOtpSent] = useState(false);
  const [memberOtpInput, setMemberOtpInput] = useState('');
  const [generatedMemberOtp, setGeneratedMemberOtp] = useState('849201');

  // Member Password Login States
  const [passwordMobile, setPasswordMobile] = useState('');
  const [memberPassword, setMemberPassword] = useState('');

  // Email Direct Login States
  const [emailInput, setEmailInput] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [generatedEmailOtp, setGeneratedEmailOtp] = useState('519342');

  // Guest Login States
  const [guestMobile, setGuestMobile] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestDistrict, setGuestDistrict] = useState('बीड (Beed)');
  const [guestOtpSent, setGuestOtpSent] = useState(false);
  const [guestOtpInput, setGuestOtpInput] = useState('');
  const [generatedGuestOtp, setGeneratedGuestOtp] = useState('654321');

  if (!isOpen) return null;

  // Helper: Handle Post-Login Approval & Navigation
  const handleUserLoginSuccess = (
    user: any,
    authProvider: string,
    isNew: boolean = false
  ) => {
    logSecurityEvent({
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email || '',
      userMobile: user.mobile || '',
      eventType: 'LOGIN_SUCCESS',
      metadata: { authProvider, isNewUser: isNew, isApproved: user.isApproved !== false }
    });

    // Check if user is approved (Admin-uploaded candidates or admin-approved members)
    const isApproved = user.isApproved !== false || user.isRegisteredByAdmin;

    if (!isApproved) {
      setSuccessBanner({
        userName: user.fullName,
        isNewUser: isNew,
        authMethod: authProvider,
        isApproved: false,
        emailOrMobile: user.mobile || user.email
      });
      return;
    }

    if (isNew) {
      setSuccessBanner({
        userName: user.fullName,
        isNewUser: true,
        authMethod: authProvider,
        isApproved: true,
        emailOrMobile: user.mobile || user.email
      });
    } else {
      setCurrentView('profiles');
      onClose();
    }
  };

  // Handler: Truecaller 1-Tap Instant Login & Verification
  const handleTruecallerLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNumber = truecallerMobile.replace(/\D/g, '');

    if (!cleanNumber || cleanNumber.length < 10) {
      alert(language === 'mr' ? 'कृपया तुमचा १० अंकी मोबाईल नंबर टाका.' : 'Please enter valid 10-digit mobile number.');
      return;
    }

    try {
      setIsTruecallerLoading(true);
      const res = await loginWithTruecaller(cleanNumber, truecallerName || undefined, truecallerCity);

      if (res.success && res.user) {
        handleUserLoginSuccess(res.user, 'truecaller', !!res.isNewUser);
      } else {
        alert(res.message || 'Truecaller login failed');
      }
    } catch (err: any) {
      alert(language === 'mr' ? 'Truecaller लॉगिन करताना त्रुटी आली.' : 'Truecaller authentication error');
    } finally {
      setIsTruecallerLoading(false);
    }
  };

  // Handler: Simulate Truecaller 1-Tap Auto-Detect
  const handleSimulateTruecallerAutoDetect = () => {
    setIsTruecallerAutoFilling(true);
    setTimeout(() => {
      // Find an existing approved profile or generate a verified mock
      const existingApproved = profiles.find(p => p.mobile && p.isApproved !== false);
      if (existingApproved && existingApproved.mobile) {
        const raw = existingApproved.mobile.replace(/\D/g, '').slice(-10);
        setTruecallerMobile(raw);
        setTruecallerName(existingApproved.fullName);
      } else {
        setTruecallerMobile('9822314567');
        setTruecallerName('अविनाश तात्यासाहेब मुंडे');
      }
      setIsTruecallerAutoFilling(false);
    }, 600);
  };

  // Handler: Google 1-Click Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        handleUserLoginSuccess(res.user, 'google', !!res.isNewUser);
      } else if (res.message && res.message !== 'Google login cancelled') {
        logSecurityEvent({
          userId: 'anonymous_google_fail',
          eventType: 'LOGIN_FAILED',
          metadata: { authProvider: 'google.com', error: res.message }
        });
        alert(language === 'mr' ? `गुगल लॉगिन त्रुटी: ${res.message}` : `Google login error: ${res.message}`);
      }
    } catch (err: any) {
      alert(language === 'mr' ? 'गुगल लॉगिन करताना अडचण आली.' : 'Failed to sign in with Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handler: Send OTP for Member Mobile
  const handleSendMemberOtp = () => {
    const clean = memberMobile.replace(/\D/g, '');
    if (!clean || clean.length < 10) {
      alert(language === 'mr' ? 'कृपया तुमचा वैध १० अंकी मोबाईल नंबर प्रविष्ट करा.' : 'Please enter valid 10-digit mobile number.');
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedMemberOtp(newOtp);
    setMemberOtpSent(true);
    alert(language === 'mr' ? `तुमचा पडताळणी OTP पाठवला आहे: ${newOtp}` : `Verification OTP sent: ${newOtp}`);
  };

  // Handler: Verify Member OTP & Login
  const handleVerifyMemberOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberOtpInput === generatedMemberOtp) {
      const cleanInput = memberMobile.replace(/\D/g, '').slice(-10);
      const match = profiles.find((p) => {
        const cleanP = (p.mobile || '').replace(/\D/g, '');
        return cleanInput && cleanP.includes(cleanInput);
      });

      if (!match) {
        logSecurityEvent({
          userId: 'unknown_mobile_' + cleanInput,
          userMobile: memberMobile,
          eventType: 'LOGIN_FAILED',
          metadata: { reason: 'User not registered', authProvider: 'mobile_otp' }
        });
        alert(
          language === 'mr'
            ? 'या मोबाईल नंबरची नोंदणी सापडली नाही! कृपया आधी "नवीन नोंदणी" फॉर्म भरा किंवा वर "Truecaller / Google लॉगिन" वापरा.'
            : 'No registered user found with this mobile. Please register first.'
        );
        return;
      }

      if (match.isBlocked) {
        alert(language === 'mr' ? '🚫 तुमचे अकाऊंट ॲडमिनद्वारे ब्लॉक करण्यात आले आहे.' : 'Account blocked by Admin.');
        return;
      }

      setCurrentUser(match);
      handleUserLoginSuccess(match, 'mobile_otp', false);
    } else {
      alert(language === 'mr' ? `चुकीचा OTP! प्रविष्ट केलेला OTP जुळत नाही. पडताळणी OTP: ${generatedMemberOtp}` : `Invalid OTP. Enter ${generatedMemberOtp}`);
    }
  };

  // Handler: Member Password Login
  const handleMemberPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordMobile) {
      alert(language === 'mr' ? 'मोबाईल नंबर किंवा ई-मेल टाका.' : 'Enter Mobile or Email.');
      return;
    }
    const cleanInput = passwordMobile.replace(/\D/g, '').slice(-10);
    const match = profiles.find((p) => {
      const cleanP = (p.mobile || '').replace(/\D/g, '');
      return (cleanInput && cleanP.includes(cleanInput)) || (p.email && p.email.toLowerCase() === passwordMobile.trim().toLowerCase());
    });

    if (!match) {
      alert(
        language === 'mr'
          ? 'या मोबाईल नंबरची किंवा ई-मेलची नोंदणी सापडली नाही! कृपया आधी नोंदणी करा.'
          : 'No registered user found with this mobile/email.'
      );
      return;
    }

    if (match.isBlocked) {
      alert(language === 'mr' ? '🚫 तुमचे अकाऊंट ॲडमिनद्वारे ब्लॉक केले आहे.' : 'Account blocked by Admin.');
      return;
    }

    if (match.password !== memberPassword) {
      alert(language === 'mr' ? 'चुकीचा पासवर्ड! कृपया पुन्हा प्रयत्न करा.' : 'Invalid password.');
      return;
    }

    setCurrentUser(match);
    handleUserLoginSuccess(match, 'password', false);
  };

  // Handler: Send OTP for Email Login
  const handleSendEmailOtp = () => {
    if (!emailInput || !emailInput.includes('@')) {
      alert(language === 'mr' ? 'कृपया वैध ई-मेल पत्ता प्रविष्ट करा.' : 'Please enter a valid email address.');
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedEmailOtp(newOtp);
    setEmailOtpSent(true);
    alert(language === 'mr' ? `तुमच्या ${emailInput} वर OTP पाठवला आहे: ${newOtp}` : `Verification OTP sent to ${emailInput}: ${newOtp}`);
  };

  // Handler: Verify Email OTP & Login / Register
  const handleVerifyEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtpInput === generatedEmailOtp) {
      setIsEmailLoading(true);
      try {
        const res = await loginWithEmail(emailInput);
        if (res.success && res.user) {
          handleUserLoginSuccess(res.user, 'email_otp', !!res.isNewUser);
        } else {
          alert(res.message || 'Login error');
        }
      } catch (err: any) {
        alert('ई-मेल लॉगिन करताना त्रुटी आली.');
      } finally {
        setIsEmailLoading(false);
      }
    } else {
      alert(language === 'mr' ? `चुकीचा OTP! पडताळणी कोड: ${generatedEmailOtp}` : `Invalid OTP. Enter ${generatedEmailOtp}`);
    }
  };

  // Handler: Send OTP for Guest Login
  const handleSendGuestOtp = () => {
    const clean = guestMobile.replace(/\D/g, '');
    if (!clean || clean.length < 10) {
      alert(language === 'mr' ? 'गेस्ट प्रवेशासाठी वैध १० अंकी मोबाईल नंबर आवश्यक आहे.' : 'Please enter 10-digit mobile number.');
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedGuestOtp(newOtp);
    setGuestOtpSent(true);
    alert(language === 'mr' ? `गेस्ट पडताळणी OTP पाठवला आहे: ${newOtp}` : `Guest Verification OTP: ${newOtp}`);
  };

  // Handler: Verify Guest OTP & Submit Guest Login
  const handleVerifyGuestOtpAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestOtpSent) {
      alert(language === 'mr' ? 'प्रथम "OTP पाठवा" वर क्लिक करा.' : 'Click "Send OTP" first.');
      return;
    }
    if (guestOtpInput === generatedGuestOtp) {
      loginAsGuest(guestMobile, guestName || 'पाहुणे सदस्य', guestDistrict);
      setCurrentView('profiles');
      onClose();
    } else {
      alert(language === 'mr' ? `चुकीचा OTP! पडताळणी कोड: ${generatedGuestOtp}` : `Invalid OTP. Enter ${generatedGuestOtp}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Crisp Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-rose-900 via-[#800C1E] to-rose-950 text-white shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wide text-white">
                वंजारी जोडी पोर्टल लॉगिन
              </h2>
              <p className="text-[10px] text-amber-200 font-semibold">
                अधिकृत व सुरक्षित सदस्य प्रवेश प्रणाली
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition cursor-pointer"
            title="बंद करा"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          
          {/* Brand Logo & Slogan Header */}
          <div className="flex flex-col items-center justify-center py-2.5 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <VanjariJodiLogo variant="stacked" size={60} />
            <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-0.5 bg-amber-50 border border-amber-200/80 rounded-full">
              <span className="text-[10px] font-black text-[#800C1E] tracking-wider">
                ॥ श्री संत भगवान बाबा प्रसन्न ॥
              </span>
            </div>
          </div>

          {/* New User Welcome / Pending Approval Banner */}
          {successBanner ? (
            <div className={`p-5 rounded-2xl border-2 shadow-sm text-center space-y-4 animate-in zoom-in-95 duration-200 ${
              successBanner.isApproved
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400'
                : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400'
            }`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-md ${
                successBanner.isApproved ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
              }`}>
                {successBanner.isApproved ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">
                  {successBanner.isApproved ? '🎉 लॉगिन व पडताळणी यशस्वी!' : '⏳ खाते ॲडमिन मंजुरी प्रक्रियेत आहे'}
                </h3>
                <p className="text-xs font-extrabold text-slate-800 mt-1">
                  सस्नेह नमस्कार, <span className="text-[#800C1E] font-black">{successBanner.userName}</span>!
                </p>
                {successBanner.authMethod === 'truecaller' && (
                  <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-blue-600 text-white text-[11px] font-black rounded-full shadow-xs">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-200" />
                    <span>✓ Truecaller Verified Badge सक्रीय</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 text-left space-y-1.5 shadow-xs">
                {successBanner.isApproved ? (
                  <>
                    <p className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>आपले खाते पूर्णपणे प्रमाणित आहे.</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      आता आपण समाजातील सर्व अनुरूप व सुसंस्कृत वर-वधूंचे बायोडाटा पाहू शकता, संपर्क क्रमांक मिळवू शकता व थेट प्रस्ताव पाठवू शकता.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-extrabold text-amber-800 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-amber-600" />
                      <span>ॲडमिन मंजुरी प्रलंबित</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      सुरक्षा व विश्वासार्हतेसाठी सर्व नवीन नोंदी ॲडमिनद्वारे पडताळल्या जातात. मंजुरी मिळताच आपले खाते पूर्णपणे सुरू होईल.
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsRegisterOpen(true);
                  }}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#800C1E]" />
                  <span>बायोडाटा माहिती भरा</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('profiles');
                    onClose();
                  }}
                  className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-xl text-xs font-black shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>स्थळे पाहणे सुरू करा</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Quick Hero 1-Tap Logins (Truecaller & Google) */}
              <div className="grid grid-cols-1 gap-2">
                {/* 1. Truecaller 1-Tap Login Hero Card */}
                <div className="p-3.5 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border-2 border-blue-400 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                        ⚡
                      </div>
                      <div>
                        <span className="text-xs font-black text-blue-900">
                          Truecaller १-क्लिक व्हेरिफाइड लॉगिन
                        </span>
                        <p className="text-[10px] text-blue-700 font-semibold">
                          मोबाईल नंबर पडताळणीसह थेट व्हेरिफाइड बॅज मिळवा
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-600 text-white font-black rounded-full">
                      १ सेकंद
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        placeholder="उदा. 9822314567"
                        value={truecallerMobile}
                        onChange={(e) => setTruecallerMobile(e.target.value)}
                        maxLength={10}
                        className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-600 font-mono text-xs font-bold shadow-xs"
                      />
                      {truecallerMobile.length === 10 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-2.5 top-2.5" />
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isTruecallerLoading || isTruecallerAutoFilling}
                      onClick={() => handleTruecallerLogin()}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60 transition"
                    >
                      {isTruecallerLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Smartphone className="w-3.5 h-3.5 text-cyan-200" />
                      )}
                      <span>लॉगिन करा</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200/60 text-[10px]">
                    <button
                      type="button"
                      onClick={handleSimulateTruecallerAutoDetect}
                      className="text-blue-800 hover:text-blue-900 font-bold underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>⚡ Truecaller ऑटो-डिटेक्ट सिम्युलेटर</span>
                    </button>
                    <span className="text-blue-600 font-bold">✓ Truecaller Verified Badge</span>
                  </div>
                </div>

                {/* 2. Google 1-Tap Sign-In */}
                <button
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-2xl shadow-xs transition-all flex items-center justify-between cursor-pointer group active:scale-[0.99] disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    {isGoogleLoading ? (
                      <Loader2 className="w-5 h-5 text-slate-700 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <div className="text-left">
                      <div className="text-xs font-black text-slate-900 group-hover:text-[#800C1E] transition">
                        Google द्वारे १-क्लिक लॉगिन
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold">
                        Sign in with Google Account
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0">
                  किंवा इतर पर्याय
                </span>
              </div>

              {/* Tab Selector Buttons */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 text-[11px] font-bold text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('member_otp');
                    setMemberOtpSent(false);
                  }}
                  className={`py-1.5 px-1 rounded-xl transition cursor-pointer truncate ${
                    mode === 'member_otp'
                      ? 'bg-[#800C1E] text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  📱 मोबाईल OTP
                </button>
                <button
                  type="button"
                  onClick={() => setMode('member_pass')}
                  className={`py-1.5 px-1 rounded-xl transition cursor-pointer truncate ${
                    mode === 'member_pass'
                      ? 'bg-[#800C1E] text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  🔒 पासवर्ड
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('member_email');
                    setEmailOtpSent(false);
                  }}
                  className={`py-1.5 px-1 rounded-xl transition cursor-pointer truncate ${
                    mode === 'member_email'
                      ? 'bg-[#800C1E] text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  📧 ई-मेल OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('guest');
                    setGuestOtpSent(false);
                  }}
                  className={`py-1.5 px-1 rounded-xl transition cursor-pointer truncate ${
                    mode === 'guest'
                      ? 'bg-[#800C1E] text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  👥 गेस्ट प्रवेश
                </button>
              </div>

              {/* TAB 1: Mobile OTP Login */}
              {mode === 'member_otp' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <PhoneCall className="w-4 h-4 text-[#800C1E]" />
                    <h3 className="font-extrabold text-xs text-slate-900">
                      नोंदणीकृत मोबाईल नंबर OTP लॉगिन
                    </h3>
                  </div>

                  <form onSubmit={handleVerifyMemberOtpLogin} className="space-y-3 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">
                        १० अंकी मोबाईल नंबर:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          placeholder="उदा. 9822145890"
                          value={memberMobile}
                          onChange={(e) => setMemberMobile(e.target.value)}
                          maxLength={10}
                          className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#800C1E] font-mono text-sm font-bold shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={handleSendMemberOtp}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-xs shrink-0 cursor-pointer"
                        >
                          {memberOtpSent ? 'पुन्हा पाठवा' : 'OTP पाठवा'}
                        </button>
                      </div>
                    </div>

                    {memberOtpSent ? (
                      <div className="space-y-2 pt-2 border-t border-slate-200 animate-in fade-in duration-150">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-bold">
                          🔑 प्राप्त पडताळणी कोड टाका (चाचणी OTP: <strong>{generatedMemberOtp}</strong>)
                        </div>
                        <div>
                          <label className="block text-slate-800 font-extrabold mb-1">
                            ६ अंकी पडताळणी OTP:
                          </label>
                          <input
                            type="text"
                            placeholder="उदा. 849201"
                            required
                            value={memberOtpInput}
                            onChange={(e) => setMemberOtpInput(e.target.value)}
                            maxLength={6}
                            className="w-full bg-white border-2 border-emerald-500 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-emerald-600 font-mono text-center font-black tracking-widest text-base shadow-xs"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-gradient-to-r from-[#800C1E] to-[#9B1B30] hover:from-[#670918] text-white font-black rounded-xl text-xs shadow flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>OTP पडताळा व थेट प्रवेश करा</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 font-bold text-center">
                        👆 मोबाईल नंबर टाकून <strong>"OTP पाठवा"</strong> बटणावर क्लिक करा.
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* TAB 2: Password Login */}
              {mode === 'member_pass' && (
                <form onSubmit={handleMemberPasswordLogin} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Lock className="w-4 h-4 text-[#800C1E]" />
                    <h3 className="font-extrabold text-xs text-slate-900">
                      पासवर्ड द्वारे सदस्य लॉगिन
                    </h3>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1 text-xs">
                      📱 मोबाईल नंबर किंवा ई-मेल:
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. 9822145890 किंवा email@gmail.com"
                      required
                      value={passwordMobile}
                      onChange={(e) => setPasswordMobile(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#800C1E] font-bold text-xs shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1 text-xs">
                      🔒 पासवर्ड:
                    </label>
                    <input
                      type="password"
                      placeholder="तुमचा पासवर्ड प्रविष्ट करा"
                      required
                      value={memberPassword}
                      onChange={(e) => setMemberPassword(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#800C1E] font-bold text-xs shadow-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#800C1E] hover:bg-[#670918] text-white font-black rounded-xl text-xs shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>लॉगिन करा</span>
                  </button>
                </form>
              )}

              {/* TAB 3: Email OTP Login */}
              {mode === 'member_email' && (
                <form onSubmit={handleVerifyEmailLogin} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Mail className="w-4 h-4 text-[#800C1E]" />
                    <h3 className="font-extrabold text-xs text-slate-900">
                      ई-मेल पत्ता (Email) OTP लॉगिन
                    </h3>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1 text-xs">
                      📧 ई-मेल पत्ता:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="उदा. member@gmail.com"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#800C1E] text-xs font-bold shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-xs shrink-0 cursor-pointer"
                      >
                        {emailOtpSent ? 'पुन्हा पाठवा' : 'OTP पाठवा'}
                      </button>
                    </div>
                  </div>

                  {emailOtpSent ? (
                    <div className="space-y-2 pt-2 border-t border-slate-200 animate-in fade-in duration-150">
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 font-bold">
                        🔑 प्राप्त पडताळणी कोड टाका (चाचणी OTP: <strong>{generatedEmailOtp}</strong>)
                      </div>
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1 text-xs">
                          ६ अंकी ई-मेल OTP:
                        </label>
                        <input
                          type="text"
                          placeholder="उदा. 519342"
                          required
                          value={emailOtpInput}
                          onChange={(e) => setEmailOtpInput(e.target.value)}
                          maxLength={6}
                          className="w-full bg-white border-2 border-blue-500 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-blue-600 font-mono text-center font-black tracking-widest text-base shadow-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isEmailLoading}
                        className="w-full py-2.5 bg-gradient-to-r from-[#800C1E] to-[#9B1B30] hover:from-[#670918] text-white font-black rounded-xl text-xs shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isEmailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                        <span>ई-मेल OTP पडताळा व पुढे जा</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 font-bold text-center">
                      👆 आपला ई-मेल टाकून <strong>"OTP पाठवा"</strong> वर क्लिक करा.
                    </div>
                  )}
                </form>
              )}

              {/* TAB 4: Guest Login */}
              {mode === 'guest' && isGuestAllowed && (
                <form onSubmit={handleVerifyGuestOtpAndLogin} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <UserCheck className="w-4 h-4 text-[#800C1E]" />
                    <h3 className="font-extrabold text-xs text-slate-900">
                      गेस्ट प्रवेश (Visitor Mobile Access)
                    </h3>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1 text-xs">
                      📱 तुमचा १० अंकी मोबाईल नंबर <span className="text-rose-600">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        placeholder="उदा. 9822145890"
                        required
                        value={guestMobile}
                        onChange={(e) => setGuestMobile(e.target.value)}
                        maxLength={10}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-[#800C1E] font-mono text-sm font-bold shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={handleSendGuestOtp}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-xs shrink-0 cursor-pointer"
                      >
                        {guestOtpSent ? 'पुन्हा OTP' : 'OTP पाठवा'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1 text-[11px]">
                        👤 नाव (पर्यायी):
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. नाव व आडनाव"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 outline-none focus:border-[#800C1E] text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1 text-[11px]">
                        📍 जिल्हा (पर्यायी):
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. बीड / नाशिक"
                        value={guestDistrict}
                        onChange={(e) => setGuestDistrict(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 outline-none focus:border-[#800C1E] text-xs font-bold"
                      />
                    </div>
                  </div>

                  {guestOtpSent ? (
                    <div className="space-y-2 pt-2 border-t border-slate-200 animate-in fade-in duration-150">
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-bold">
                        🔑 प्राप्त पडताळणी कोड टाका (चाचणी OTP: <strong>{generatedGuestOtp}</strong>)
                      </div>
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1 text-xs">
                          ६ अंकी पडताळणी OTP:
                        </label>
                        <input
                          type="text"
                          placeholder="उदा. 654321"
                          required
                          value={guestOtpInput}
                          onChange={(e) => setGuestOtpInput(e.target.value)}
                          maxLength={6}
                          className="w-full bg-white border-2 border-emerald-500 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:border-emerald-600 font-mono text-center font-black tracking-widest text-base shadow-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-[#800C1E] to-[#9B1B30] hover:from-[#670918] text-white font-black rounded-xl text-xs shadow flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>OTP पडताळा व गेस्ट प्रवेश मिळवा</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2 bg-slate-100 rounded-xl text-[11px] text-slate-600 font-bold text-center">
                      👆 वर मोबाईल नंबर टाकून <strong>"OTP पाठवा"</strong> वर क्लिक करा.
                    </div>
                  )}
                </form>
              )}

              {/* Bottom Registration Banner */}
              <div className="p-3.5 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#800C1E]/10 flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4 text-[#800C1E]" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">नवीन नोंदणी करायची आहे?</p>
                    <p className="text-[10px] text-slate-600 font-semibold">वर/वधू बायोडाटा नोंदणी फॉर्म भरा</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsRegisterOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#800C1E] hover:bg-[#670918] text-white rounded-xl text-xs font-black shadow flex items-center gap-1 shrink-0 cursor-pointer transition"
                >
                  <span>नवीन नोंदणी</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Admin Portal Direct Link */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-[11px]">व्यवस्थापक / ॲडमिन?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsAdminOpen(true);
                  }}
                  className="text-[#800C1E] hover:text-[#670918] font-black underline flex items-center gap-1 cursor-pointer transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#800C1E]" />
                  <span>मुख्य ॲडमिन प्रवेश (Admin Portal)</span>
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
