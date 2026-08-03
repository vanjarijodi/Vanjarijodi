import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plan, MembershipTier } from '../types';
import { uploadToCloudinary, validateFileSize } from '../utils/cloudinary';
import { X, ShieldCheck, QrCode, Upload, Copy, Check, Sparkles, Send, Loader2, Tag, Gift, CheckCircle2 } from 'lucide-react';

export const PaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}> = ({ isOpen, onClose, plan }) => {
  const {
    language,
    currentUser,
    siteConfig,
    addPaymentRequest,
    validatePromoCode,
    addNotification,
    logActivity,
    updateMemberTier
  } = useApp();

  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [userMobile, setUserMobile] = useState(currentUser?.mobileNumber || currentUser?.whatsappNumber || '');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromoRes, setAppliedPromoRes] = useState<{
    valid: boolean;
    discountAmount: number;
    finalAmount: number;
    isVipFree: boolean;
    message: string;
    code?: string;
  } | null>(null);

  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const originalPrice = plan.price;
  const currentPrice = appliedPromoRes ? appliedPromoRes.finalAmount : originalPrice;
  const isVipFreeAccess = appliedPromoRes?.isVipFree || false;

  const upiId = siteConfig?.paymentUpiId || 'vanjarijodi@upi';
  const qrUrl =
    siteConfig?.paymentQrUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=VanjariJodi%20Matrimony&am=${currentPrice}`;
  const noteText =
    siteConfig?.paymentNote ||
    'PhonePe / Google Pay / Paytm द्वारे क्यूआर कोड स्कॅन करून किंवा UPI ID वर पेमेंट करा व UTR नंबर सादर करा.';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = validatePromoCode(promoInput, originalPrice);
    if (res.valid) {
      setAppliedPromoRes({ ...res, code: promoInput.toUpperCase().trim() });
    } else {
      setAppliedPromoRes({ ...res });
    }
  };

  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setScreenshotError(null);
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFileSize(file);
      if (!validation.valid) {
        setScreenshotError(validation.errorMsg || 'फाईलचा आकार ६०० KB पेक्षा जास्त आहे.');
        return;
      }

      setIsUploadingScreenshot(true);
      const res = await uploadToCloudinary(file, 'vanjarijodi_payments');
      setIsUploadingScreenshot(false);

      if (res.success && res.url) {
        setScreenshotUrl(res.url);
      } else {
        setScreenshotError(res.error || 'स्क्रीनशॉट अपलोड करण्यात त्रुटी आली.');
      }
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() && !isVipFreeAccess) {
      alert('कृपया पेमेंटचा 12-अंकी UTR किंवा Transaction ID प्रविष्ट करा.');
      return;
    }

    setIsSubmitting(true);

    if (isVipFreeAccess && currentUser) {
      // Instant VIP Bypass Activation
      updateMemberTier(currentUser.id, plan.id as MembershipTier);
      logActivity(
        'VIP Code Activation',
        `सदस्याने VIP कूपन (${appliedPromoRes?.code}) वापरून ${plan.nameMr} प्लॅन मोफत सक्रिय केला.`,
        currentUser.fullName
      );
      addNotification({
        userId: currentUser.id,
        title: '🎉 VIP मोफत प्रवेश सक्रिय!',
        message: `${plan.nameMr} प्लॅन यशस्वीरित्या सक्रिय झाला आहे. अमर्याद बायोडाटा व संपर्क पाहा!`,
        type: 'system',
        read: false,
      });
      alert('🎉 बधाई! VIP कूपन द्वारे तुमची मेम्बरशिप लगेच मोफत सक्रिय झाली आहे!');
      setIsSubmitting(false);
      onClose();
      return;
    }

    addPaymentRequest({
      userId: currentUser?.id || 'guest-user',
      userName: currentUser?.fullName || 'अनोळखी सभासद',
      userMobile: userMobile || currentUser?.mobileNumber || '+91 9822100000',
      planId: plan.id as MembershipTier,
      planName: language === 'mr' ? plan.nameMr : plan.name,
      amount: currentPrice,
      utrNumber: utrNumber.trim() || `VIP-FREE-${Date.now()}`,
      screenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
    });

    setIsSubmitting(false);
    alert(
      language === 'mr'
        ? `धन्यवाद! तुमची पेमेंट पावती (UTR: ${utrNumber || 'VIP'}) पडताळणीसाठी यशस्वीरित्या सादर झाली आहे. ॲडमिन टीम लवकरच पडताळणी करून तुमचे अकाऊंट सक्रिय करेल.`
        : `Thank you! Your payment proof has been submitted for verification.`
    );
    setUtrNumber('');
    setScreenshotUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FFFDF5] border-2 border-amber-300 rounded-3xl shadow-2xl text-slate-900 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#A71930] text-amber-100 border-b border-amber-400/30 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h2 className="text-base sm:text-lg font-extrabold">ऑनलाइन पेमेंट व क्यूआर कोड पावती</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-amber-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">

          {/* Selected Plan Summary Box */}
          <div className="p-4 bg-white border border-amber-300 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] text-[#A71930] font-black uppercase tracking-wider block">
                निवडलेला सबस्क्रिप्शन प्लॅन:
              </span>
              <h3 className="text-lg font-black text-slate-900">{language === 'mr' ? plan.nameMr : plan.name}</h3>
              <span className="text-xs text-slate-600 font-bold">कालावधी: {plan.durationMonths} महिने अमर्याद संपर्क</span>
            </div>
            <div className="text-right">
              {appliedPromoRes?.valid && appliedPromoRes.discountAmount > 0 ? (
                <div>
                  <span className="text-xs text-slate-400 line-through block font-bold">₹{originalPrice}</span>
                  <span className="text-2xl font-black text-[#A71930]">
                    {isVipFreeAccess ? 'मोफत ₹०' : `₹${currentPrice}`}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#A71930]">₹{originalPrice}</span>
                  <span className="text-[10px] text-emerald-700 block font-bold">GST समाविष्ट</span>
                </div>
              )}
            </div>
          </div>

          {/* Promo Code Input Box */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
            <label className="block text-slate-900 font-extrabold text-xs flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#A71930]" />
              <span>कूपन कोड किंवा डिस्काउंट प्रोमो कोड टाका (Apply Promo Code):</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="उदा. VANJARI20, FLAT200 किंवा VIPFREE"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase text-slate-900 outline-none focus:border-[#A71930]"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
              >
                लागू करा
              </button>
            </div>
            {appliedPromoRes && (
              <p
                className={`text-xs font-bold flex items-center gap-1 ${
                  appliedPromoRes.valid ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {appliedPromoRes.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                <span>{appliedPromoRes.message}</span>
              </p>
            )}
          </div>

          {/* QR Code Section (If not VIP Free) */}
          {!isVipFreeAccess ? (
            <div className="bg-white border border-amber-300 rounded-2xl p-4 text-center space-y-3 shadow-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#A71930] text-xs font-bold border border-amber-300">
                <QrCode className="w-3.5 h-3.5" />
                <span>१. खालील क्यूआर कोड वर स्कॅन करून पैसे भरा</span>
              </span>

              <div className="w-44 h-44 bg-white p-2 mx-auto rounded-2xl border-2 border-amber-400 shadow flex items-center justify-center">
                <img src={qrUrl} alt="Payment QR Code" className="w-full h-full object-contain" />
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-700 font-bold">{noteText}</p>
                <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs mt-1">
                  <span className="text-slate-600 font-bold">UPI ID:</span>
                  <span className="font-mono font-black text-[#A71930]">{upiId}</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1 hover:bg-amber-100 rounded text-[#A71930]"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center space-y-2">
              <Gift className="w-10 h-10 text-emerald-700 mx-auto animate-bounce" />
              <h4 className="font-black text-emerald-900 text-base">VIP मोफत पास प्राप्त झाला आहे!</h4>
              <p className="text-xs text-emerald-800 font-bold">
                तुम्हाला कोणतेही पैसे भरण्याची गरज नाही. खालील बटणावर क्लिक करून त्वरित मोफत मेम्बरशिप सक्रिय करा.
              </p>
            </div>
          )}

          {/* Payment Proof Submission Form */}
          <form onSubmit={handleSubmitProof} className="space-y-4 text-xs sm:text-sm">
            {!isVipFreeAccess && (
              <div className="border-t border-amber-200 pt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>२. पेमेंटची पावती (UTR/Transaction ID) सबमिट करा</span>
                </span>

                <div className="space-y-3">
                  {/* UTR Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      UTR / Transaction Ref Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required={!isVipFreeAccess}
                      placeholder="उदा. UTR402918274011 किंवा 12-अंकी नंबर"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-slate-900 placeholder-slate-400 font-mono text-xs focus:border-[#A71930] outline-none"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      तुमचा मोबाईल नंबर (संपर्कासाठी)
                    </label>
                    <input
                      type="text"
                      value={userMobile}
                      onChange={(e) => setUserMobile(e.target.value)}
                      placeholder="+91 98221 00000"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-slate-900 text-xs focus:border-[#A71930] outline-none"
                    />
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      पेमेंट स्क्रीनशॉट अपलोड (Max 600 KB):
                    </label>
                    {screenshotError && <p className="text-rose-600 font-bold text-[11px] mb-1">{screenshotError}</p>}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-dashed border-amber-400 hover:border-[#A71930] rounded-xl cursor-pointer text-slate-700 hover:text-[#A71930] text-xs font-bold transition-all">
                        {isUploadingScreenshot ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#A71930]" />
                        ) : (
                          <Upload className="w-4 h-4 text-[#A71930]" />
                        )}
                        <span>{screenshotUrl ? 'स्क्रीनशॉट बदलण्यासाठी निवडा' : 'गॅलरीमधून स्क्रीनशॉट निवडा'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingScreenshot}
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {screenshotUrl && (
                      <div className="mt-2 relative w-16 h-16 rounded-xl overflow-hidden border border-amber-400">
                        <img src={screenshotUrl} alt="Payment Proof" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isUploadingScreenshot}
              className="w-full py-3.5 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isVipFreeAccess ? 'VIP मोफत प्रवेश सक्रिय करा' : 'पेमेंट पावती (UTR) सबमिट करा'}</span>
            </button>

            <p className="text-[11px] text-center text-slate-600 flex items-center justify-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>सादर केलेली पावती १-२ तासात पडताळून मेम्बरशिप प्लॅन सक्रिय होईल.</span>
            </p>

          </form>

        </div>

      </div>
    </div>
  );
};
