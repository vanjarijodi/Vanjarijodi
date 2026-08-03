import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  PhoneCall,
  Clock,
  Upload,
  AlertCircle,
  IndianRupee,
  Lock,
  ArrowRight
} from 'lucide-react';

export const ContactUnlockModal: React.FC = () => {
  const {
    isContactUnlockModalOpen,
    setIsContactUnlockModalOpen,
    selectedProfileForUnlock,
    setSelectedProfileForUnlock,
    siteConfig,
    currentUser,
    unlockContact,
    addPayPerContactRequest,
    payPerContactRequests
  } = useApp();

  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isContactUnlockModalOpen || !selectedProfileForUnlock) return null;

  const unlockFee = siteConfig.unlockContactFee || 50;
  const upiId = siteConfig.paymentUpiId || '9822100000@ybl';
  const qrCodeUrl =
    siteConfig.paymentQrUrl ||
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400';

  // Check if there is an existing request for this target profile
  const existingReq = payPerContactRequests.find(
    r =>
      r.userId === (currentUser?.id || 'guest') &&
      r.targetProfileId === selectedProfileForUnlock.id
  );

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setErrorMsg('कृपया वैध १२ अंकी UTR / ट्रांझॅक्शन आयडी प्रविष्ट करा.');
      return;
    }

    addPayPerContactRequest({
      userId: currentUser?.id || 'guest-' + Date.now(),
      userName: currentUser?.fullName || 'पाहुणे युझर',
      userMobile: currentUser?.mobile || '+91 99000 00000',
      targetProfileId: selectedProfileForUnlock.id,
      targetProfileName: selectedProfileForUnlock.fullName,
      targetProfileMobile: selectedProfileForUnlock.mobile,
      amount: unlockFee,
      utrNumber: cleanUtr,
      screenshotUrl: screenshotUrl || undefined
    });

    setSubmitted(true);
  };

  const handleClose = () => {
    setIsContactUnlockModalOpen(false);
    setSelectedProfileForUnlock(null);
    setUtrNumber('');
    setScreenshotUrl('');
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 via-white to-amber-50 rounded-2xl shadow-2xl border-2 border-amber-300/80 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#A71930] via-[#800C1E] to-[#A71930] text-amber-100 px-6 py-4 flex items-center justify-between border-b border-amber-300/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400/20 rounded-xl border border-amber-300/40">
              <PhoneCall className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight text-white">
                संपर्क क्रमांक अन-लॉक करा
              </h3>
              <p className="text-xs text-amber-200">
                Unlock Contact Number (Pay Per Contact)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-amber-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Target Profile Card Banner */}
          <div className="bg-gradient-to-r from-amber-100/80 to-rose-50 p-3.5 rounded-xl border border-amber-200 flex items-center gap-3.5 shadow-sm">
            <img
              src={
                selectedProfileForUnlock.photos[0] ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
              }
              alt={selectedProfileForUnlock.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#A71930] shadow"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 break-words text-base">
                {selectedProfileForUnlock.fullName}
              </h4>
              <p className="text-xs text-slate-600">
                {selectedProfileForUnlock.district} • {selectedProfileForUnlock.education}
              </p>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#A71930] bg-white px-2 py-0.5 rounded-full border border-amber-300">
                <Lock className="w-3 h-3" />
                <span>शुल्क: ₹{unlockFee} फक्त</span>
              </div>
            </div>
          </div>

          {/* If Offer Mode or Disable Payments is active */}
          {(siteConfig?.isOfferModeEnabled || siteConfig?.disableAllPaymentsInOfferMode) ? (
            <div className="bg-[#FFFDF5] border-2 border-emerald-400 rounded-2xl p-6 text-center space-y-4 shadow-lg">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                <ShieldCheck className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <h4 className="text-xl font-black text-emerald-800">
                🎁 विशेष सण / नवीन ऑफर चालू आहे!
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                {siteConfig?.offerModeText || 'सध्या सर्व सदस्यांसाठी संपर्क क्रमांक अनलॉक आणि पेमेंट ऑनलाईन पूर्णपणे मोफत ठेवण्यात आले आहे.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  unlockContact(selectedProfileForUnlock.id);
                  alert(`🎉 ${selectedProfileForUnlock.fullName} यांचा संपर्क क्रमांक मोफत अन-लॉक झाला आहे!`);
                  handleClose();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-extrabold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition cursor-pointer border border-emerald-300"
              >
                <span>🎉 १-क्लिकवर मोफत अन-लॉक करा</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : submitted || (existingReq && existingReq.status === 'pending') ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-7 h-7 animate-pulse" />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                पडताळणी प्रलंबित (Pending Approval)
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                तुमची <strong>₹{unlockFee}</strong> संपर्क अनलॉक विनंती प्राप्त झाली आहे. यूटीआर (UTR) क्रमांकाची पडताळणी केल्यानंतर ॲडमिन कडून ५ ते १० मिनिटांत संपर्क क्रमांक थेट दिसू लागेल.
              </p>
              <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs text-left space-y-1">
                <p><strong>लक्ष्य नाव:</strong> {selectedProfileForUnlock.fullName}</p>
                <p><strong>UTR नं:</strong> {utrNumber || existingReq?.utrNumber}</p>
                <p><strong>स्थिती:</strong> <span className="text-amber-700 font-bold">ॲडमिन अप्रूव्हल प्रलंबित</span></p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-[#A71930] text-amber-100 font-bold rounded-xl shadow hover:bg-[#800C1E] transition cursor-pointer"
              >
                समजले / बंद करा
              </button>
            </div>
          ) : (
            <>
              {/* Payment Steps */}
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A71930] uppercase tracking-wide">
                      पायरी १: UPI किंवा QR स्कॅन करा
                    </span>
                    <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      ₹{unlockFee} ऑनलाईन पे
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    {/* QR Code Container */}
                    <div className="p-2 bg-white rounded-xl border-2 border-amber-300 shadow-md text-center">
                      <img
                        src={qrCodeUrl}
                        alt="UPI Payment QR Code"
                        className="w-32 h-32 object-contain mx-auto"
                      />
                      <span className="text-[10px] font-bold text-slate-500 mt-1 block">
                        GPay / PhonePe / Paytm स्कॅन
                      </span>
                    </div>

                    {/* UPI ID Copy */}
                    <div className="flex-1 space-y-2 w-full">
                      <p className="text-xs font-medium text-slate-600">
                        किंवा खालील UPI ID वर ₹{unlockFee} पाठवा:
                      </p>
                      <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-300">
                        <span className="font-mono text-xs font-bold text-slate-800 break-all flex-1">
                          {upiId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold flex items-center gap-1 shadow transition cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>कॉपी झाले</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>कॉपी</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-amber-800 font-medium">
                        💡 पेमेंट केल्यानंतर १२ अंकी UTR / Ref Number खाली एंटर करा.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Step 2 */}
                <form onSubmit={handleSubmitUtr} className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-3">
                    <span className="text-xs font-bold text-[#A71930] uppercase tracking-wide">
                      पायरी २: UTR नंबर प्रविष्ट करा
                    </span>

                    {errorMsg && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-1.5 font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        12-Digit UTR / Transaction ID <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={e => setUtrNumber(e.target.value)}
                        placeholder="उदा. 402918274011"
                        maxLength={18}
                        required
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#A71930] focus:border-[#A71930] font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        पेमेंट स्क्रीनशॉट (पर्यायी)
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 px-3 py-2 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-slate-600 transition">
                          <Upload className="w-4 h-4 text-amber-600" />
                          <span>{screenshotUrl ? 'स्क्रीनशॉट निवडला' : 'स्क्रीनशॉट अपलोड करा'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-extrabold rounded-xl shadow-lg border border-amber-300 flex items-center justify-center gap-2 transition cursor-pointer text-sm"
                  >
                    <span>₹{unlockFee} UTR सबमिट करा</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </form>
              </div>
            </>
          )}

          <div className="pt-2 text-center border-t border-slate-200 text-[11px] text-slate-500">
            <p className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>१००% सुरक्षित वंजारीजोडी पे-पर-काँटॅक्ट सिस्टीम</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
