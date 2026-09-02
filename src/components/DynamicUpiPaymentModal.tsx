import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Plan, MembershipTier } from '../types';
import { uploadToCloudinary, validateFileSize } from '../utils/cloudinary';
import {
  X,
  ShieldCheck,
  QrCode,
  Upload,
  Copy,
  Check,
  Sparkles,
  Loader2,
  Clock,
  Smartphone,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  FileText,
  CreditCard,
  Lock,
  Info,
  Download,
  MessageCircle,
  Tag,
  Percent,
  Gift,
  Send,
} from 'lucide-react';

interface DynamicUpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export const DynamicUpiPaymentModal: React.FC<DynamicUpiPaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  const {
    currentUser,
    paymentConfig,
    siteConfig,
    plansList,
    selectedPlanForPayment,
    addPaymentRequest,
    addNotification,
    logActivity,
    updateMemberTier,
    setCurrentView,
    validatePromoCode,
    usePromoCode,
  } = useApp();

  // Active Plan Resolution
  const activePlan =
    plan ||
    selectedPlanForPayment ||
    plansList.find((p) => p.id === 'welcome_offer' && p.isActive !== false) ||
    plansList.find((p) => p.isActive !== false) ||
    plansList[0];

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
    isVipFree: boolean;
    message: string;
    promo?: any;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState<boolean>(false);

  // Dynamic Pricing Math
  const originalPrice = Number(activePlan?.price || paymentConfig?.amount || 398);
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const finalPayablePrice = appliedPromo ? appliedPromo.finalAmount : originalPrice;
  const isVipFree = Boolean(appliedPromo?.isVipFree || finalPayablePrice === 0);

  // Steps: 'checkout' | 'waiting' | 'approved' | 'rejected'
  const [step, setStep] = useState<'checkout' | 'waiting' | 'approved' | 'rejected'>('checkout');

  // Intent Data State
  const [orderId, setOrderId] = useState<string>('');
  const [upiIntentUri, setUpiIntentUri] = useState<string>('');
  const [gpayUri, setGpayUri] = useState<string>('');
  const [phonepeUri, setPhonepeUri] = useState<string>('');
  const [paytmUri, setPaytmUri] = useState<string>('');
  const [bhimUri, setBhimUri] = useState<string>('');
  const [credUri, setCredUri] = useState<string>('');
  const [amazonpayUri, setAmazonpayUri] = useState<string>('');
  const [dynamicQrUrl, setDynamicQrUrl] = useState<string>('');
  const [upiId, setUpiId] = useState<string>(siteConfig?.paymentUpiId || 'mahesh.hange1@ybl');
  const [businessName, setBusinessName] = useState<string>(siteConfig?.paymentPayeeName || 'Vanjari Jodi Matrimony');
  const [isLoadingIntent, setIsLoadingIntent] = useState<boolean>(false);
  const [activeAppLaunching, setActiveAppLaunching] = useState<string | null>(null);

  // Countdown Timer State (10:00 = 600 seconds) with real-world timestamp drift compensation
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const deadlineRef = useRef<number>(Date.now() + 600 * 1000);

  // Legal Terms Agreement Checkbox
  const [isPaymentTermsAgreed, setIsPaymentTermsAgreed] = useState<boolean>(true);

  // Form State
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [isUtrChecking, setIsUtrChecking] = useState<boolean>(false);
  const [isUtrDuplicate, setIsUtrDuplicate] = useState<boolean>(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [userMobile, setUserMobile] = useState<string>(
    currentUser?.mobile || currentUser?.mobileNumber || currentUser?.whatsappNumber || ''
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Active Submitted Request ID for Polling
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState<number>(0);
  const [adminNote, setAdminNote] = useState<string>('');
  const [approvedDetails, setApprovedDetails] = useState<any>(null);

  // Toast / Copy Feedback & Deep Link Notice
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [qrDownloaded, setQrDownloaded] = useState<boolean>(false);
  const [upiLaunchNotice, setUpiLaunchNotice] = useState<string | null>(null);

  // Reset & Initialize on Open & on Payment Config Updates
  useEffect(() => {
    if (isOpen && activePlan) {
      setStep('checkout');
      setUtrNumber('');
      setUtrError(null);
      setIsUtrDuplicate(false);
      setScreenshotUrl('');
      setScreenshotPreview('');
      setScreenshotFile(null);
      setSubmitError(null);
      setSubmittedRequestId(null);
      setPromoCodeInput('');
      setAppliedPromo(null);
      setPromoError(null);
      deadlineRef.current = Date.now() + 600 * 1000;
      setTimeLeft(600);
      fetchPaymentIntent();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [
    isOpen,
    activePlan?.id,
    activePlan?.price,
    paymentConfig?.upiId,
    paymentConfig?.merchantQrImageUrl,
    paymentConfig?.qrCodeUrl,
    paymentConfig?.payeeName,
    paymentConfig?.amount,
    siteConfig?.paymentQrCodeUrl,
    siteConfig?.paymentQrUrl,
    siteConfig?.paymentUpiId
  ]);

  // Global event listener for instant realtime update when Admin changes QR or UPI ID
  useEffect(() => {
    const handleConfigUpdated = () => {
      if (isOpen && activePlan) {
        fetchPaymentIntent();
      }
    };
    window.addEventListener('vanjari_payment_config_updated', handleConfigUpdated);
    return () => {
      window.removeEventListener('vanjari_payment_config_updated', handleConfigUpdated);
    };
  }, [isOpen, activePlan]);

  // Countdown Timer Engine (Handles tab backgrounding & mobile app switching seamlessly)
  useEffect(() => {
    if (!isOpen || step !== 'checkout') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const updateRemaining = () => {
      const remainingSecs = Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000));
      setTimeLeft(remainingSecs);
      if (remainingSecs <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    updateRemaining();
    timerRef.current = setInterval(updateRemaining, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, step]);

  // Fetch Dynamic UPI Intent & QR from Backend
  const fetchPaymentIntent = async (overridePrice?: number) => {
    if (!activePlan) return;
    const targetUpi = paymentConfig?.upiId || siteConfig?.paymentUpiId || 'paytm.s3ms5x7@pty';
    const targetBusiness = paymentConfig?.payeeName || siteConfig?.paymentPayeeName || 'Usha Shivdas Hange';
    const currentPrice = typeof overridePrice === 'number'
      ? overridePrice
      : (appliedPromo ? appliedPromo.finalAmount : (activePlan.price || 499));
    const targetPrice = currentPrice;
    const transactionNote = paymentConfig?.transactionNote || `VanjariJodi_${activePlan.id}`;

    const cleanBusiness = String(targetBusiness).replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Usha Shivdas Hange';
    const cleanNote = String(transactionNote).replace(/[^a-zA-Z0-9]/g, '') || 'VanjariJodi';

    // Multi-App UPI routing IDs
    const phonepeUpi = (paymentConfig?.phonepeUpiId || targetUpi).trim();
    const gpayUpi = (paymentConfig?.gpayUpiId || targetUpi).trim();
    const paytmUpi = (paymentConfig?.paytmUpiId || targetUpi).trim();

    // Instant client-side fallback generation with exact dynamic plan amount
    const fallbackUniversal = `upi://pay?pa=${encodeURIComponent(targetUpi)}&pn=${encodeURIComponent(cleanBusiness)}&am=${encodeURIComponent(targetPrice)}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
    const fallbackPhonePe = `phonepe://pay?pa=${encodeURIComponent(phonepeUpi)}&pn=${encodeURIComponent(cleanBusiness)}&am=${encodeURIComponent(targetPrice)}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
    const fallbackGPay = `tez://upi/pay?pa=${encodeURIComponent(gpayUpi)}&pn=${encodeURIComponent(cleanBusiness)}&am=${encodeURIComponent(targetPrice)}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
    const fallbackPaytm = `paytmmp://pay?pa=${encodeURIComponent(paytmUpi)}&pn=${encodeURIComponent(cleanBusiness)}&am=${encodeURIComponent(targetPrice)}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
    const fallbackBhim = `bhim://pay?pa=${encodeURIComponent(targetUpi)}&pn=${encodeURIComponent(cleanBusiness)}&am=${encodeURIComponent(targetPrice)}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
    const fallbackCred = `cred://upi/pay?pa=${encodeURIComponent(targetUpi)}&pn=${encodeURIComponent(cleanBusiness)}&am=${encodeURIComponent(targetPrice)}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
    const fallbackAmazonPay = `amazonpay://upi/pay?pa=${encodeURIComponent(targetUpi)}&pn=${encodeURIComponent(cleanBusiness)}&am=${encodeURIComponent(targetPrice)}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;

    setUpiIntentUri(fallbackUniversal);
    setPhonepeUri(fallbackPhonePe);
    setGpayUri(fallbackGPay);
    setPaytmUri(fallbackPaytm);
    setBhimUri(fallbackBhim);
    setCredUri(fallbackCred);
    setAmazonpayUri(fallbackAmazonPay);
    setUpiId(targetUpi);
    setBusinessName(targetBusiness);
    setDynamicQrUrl(paymentConfig?.merchantQrImageUrl || siteConfig?.paymentQrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(fallbackUniversal)}`);

    try {
      setIsLoadingIntent(true);
      const res = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser?.id || 'guest-user',
          plan_id: activePlan.id,
          plan_name: activePlan.nameMr || activePlan.name,
          amount: targetPrice,
          upi_id: targetUpi,
          phonepe_upi_id: phonepeUpi,
          gpay_upi_id: gpayUpi,
          paytm_upi_id: paytmUpi,
          business_name: targetBusiness,
          note: transactionNote,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setOrderId(data.orderId);
          setUpiIntentUri(data.upiIntentUri || fallbackUniversal);
          setPhonepeUri(data.phonepeUri || fallbackPhonePe);
          setGpayUri(data.gpayUri || fallbackGPay);
          setPaytmUri(data.paytmUri || fallbackPaytm);
          setBhimUri(data.bhimUri || fallbackBhim);
          setCredUri(data.credUri || fallbackCred);
          setAmazonpayUri(data.amazonpayUri || fallbackAmazonPay);
          setDynamicQrUrl(paymentConfig?.merchantQrImageUrl || siteConfig?.paymentQrCodeUrl || data.dynamicQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(data.upiIntentUri || fallbackUniversal)}`);
          setUpiId(data.targetUpiId || targetUpi);
          setBusinessName(data.businessName || targetBusiness);
        }
      }
    } catch (err) {
      console.error('Error fetching payment intent:', err);
    } finally {
      setIsLoadingIntent(false);
    }
  };

  // Apply Promo Code Handler
  const handleApplyPromoCode = (codeToApply?: string) => {
    const rawCode = (typeof codeToApply === 'string' ? codeToApply : promoCodeInput).trim().toUpperCase();
    setPromoError(null);

    if (!rawCode) {
      setPromoError('कृपया प्रोमो / कूपन कोड टाकावा.');
      return;
    }

    setIsApplyingPromo(true);
    const result = validatePromoCode(rawCode, originalPrice);
    setIsApplyingPromo(false);

    if (!result.valid) {
      setPromoError(result.message || 'हा प्रोमो कोड अवैध किंवा कालबाह्य झालेला आहे.');
      return;
    }

    setAppliedPromo({
      code: rawCode,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
      isVipFree: result.isVipFree,
      message: result.message,
      promo: result.promo,
    });
    setPromoCodeInput('');
    setPromoError(null);

    // Regenerate QR and UPI Intent with new discounted price
    fetchPaymentIntent(result.finalAmount);
  };

  // Remove Promo Code Handler
  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoError(null);
    setPromoCodeInput('');
    fetchPaymentIntent(originalPrice);
  };

  // 1-Click Instant VIP Free Activation (For 100% Discount / VIPFREE code)
  const handleInstantVipFreeActivation = async () => {
    if (!isVipFree || !appliedPromo) return;
    try {
      setIsSubmitting(true);
      const nowIso = new Date().toISOString();
      const vipUtr = `VIPFREE${Date.now().toString().slice(-6)}`;
      const memberId = currentUser?.id || `guest-${Date.now()}`;
      const memberName = currentUser?.fullName || 'Member';
      const memberMobile = userMobile || currentUser?.mobile || currentUser?.mobileNumber || '';

      // Context Sync
      addPaymentRequest({
        userId: memberId,
        userName: memberName,
        userMobile: memberMobile,
        planId: activePlan.id as MembershipTier,
        planName: activePlan.nameMr || activePlan.name,
        amount: 0,
        utrNumber: vipUtr,
        screenshotUrl: '',
        paymentMethod: 'vip_promo_code',
        adminNote: `VIP Promo Code Auto-Activated: ${appliedPromo.code}`,
        promoCode: appliedPromo.code,
        discountAmount: originalPrice,
        originalAmount: originalPrice,
      });

      // Update User Membership directly
      if (currentUser) {
        updateMemberTier(currentUser.id, activePlan.id as MembershipTier, undefined, {
          paidAt: nowIso,
          paymentApprovedAt: nowIso,
          paymentAmount: 0,
          paymentUtr: vipUtr,
          paymentPlanName: `${activePlan.nameMr || activePlan.name} (VIP कूपन)`,
        });
      }

      // Record promo code usage count
      usePromoCode(appliedPromo.code);

      logActivity(
        'VIP Free Promo Code Activated',
        `सदस्याने ${appliedPromo.code} कूपन वापरून मोफत ${activePlan.nameMr || activePlan.name} (₹०) ॲक्टिव्हेट केला.`,
        memberName
      );

      handlePaymentApproved({
        plan_name: activePlan.nameMr || activePlan.name,
        amount: 0,
        utr_number: vipUtr,
      });
    } catch (err: any) {
      console.error('Error activating VIP Free promo:', err);
      setSubmitError('VIP कूपन ॲक्टिव्हेट करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Launch Specific UPI App with auto-copy, desktop check, Android Intent & universal fallback
  const handleLaunchUpiApp = (appName: string, customUri?: string) => {
    // Auto-copy UPI ID to clipboard as a fail-proof fallback
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(upiId);
      }
    } catch (e) {
      console.log('Clipboard copy error:', e);
    }

    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
    setActiveAppLaunching(appName);
    setTimeout(() => setActiveAppLaunching(null), 4000);

    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    const cleanBusiness = String(businessName || 'Usha Shivdas Hange').replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Usha Shivdas Hange';
    const cleanNote = String(paymentConfig?.transactionNote || 'VanjariJodi').replace(/[^a-zA-Z0-9]/g, '') || 'VanjariJodi';

    const formattedPrice = String(finalPayablePrice).replace(/[^0-9.]/g, '');
    
    const targetUpiId = (upiId || 'paytm.s3ms5x7@pty').trim();
    const phonepeUpi = (paymentConfig?.phonepeUpiId || targetUpiId).trim();
    const gpayUpi = (paymentConfig?.gpayUpiId || targetUpiId).trim();
    const paytmUpi = (paymentConfig?.paytmUpiId || targetUpiId).trim();

    const encodedUpi = encodeURIComponent(targetUpiId);
    const encodedBusiness = encodeURIComponent(cleanBusiness);
    const encodedNote = encodeURIComponent(cleanNote);

    // Always auto-copy UPI ID to clipboard immediately for seamless fallback
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(targetUpiId);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      }
    } catch (clipErr) {}

    let targetUri = customUri || upiIntentUri;

    // Direct app-specific schemes & universal Android intent with auto amount & payee
    if (appName === 'PhonePe') {
      const encodedPhonePeUpi = encodeURIComponent(phonepeUpi);
      // Using phonepe:// custom protocol directly to bypass Android Intent package-sandbox security blocks
      targetUri = `phonepe://pay?pa=${encodedPhonePeUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}`;
    } else if (appName === 'Google Pay') {
      const encodedGPayUpi = encodeURIComponent(gpayUpi);
      targetUri = isAndroid
        ? `intent://pay?pa=${encodedGPayUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`
        : `tez://upi/pay?pa=${encodedGPayUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}`;
    } else if (appName === 'Paytm') {
      const encodedPaytmUpi = encodeURIComponent(paytmUpi);
      targetUri = isAndroid
        ? `intent://pay?pa=${encodedPaytmUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}#Intent;scheme=upi;package=net.one97.paytm;end`
        : `paytmmp://pay?pa=${encodedPaytmUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}`;
    } else if (appName === 'BHIM UPI') {
      targetUri = isAndroid
        ? `intent://pay?pa=${encodedUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}#Intent;scheme=upi;package=in.org.npci.upiapp;end`
        : bhimUri || `bhim://pay?pa=${encodedUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}`;
    } else if (appName === 'CRED') {
      targetUri = isAndroid
        ? `intent://pay?pa=${encodedUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}#Intent;scheme=upi;package=com.dreamplug.androidapp;end`
        : credUri || `cred://upi/pay?pa=${encodedUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}`;
    } else if (appName === 'Amazon Pay') {
      targetUri = isAndroid
        ? `intent://pay?pa=${encodedUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}#Intent;scheme=upi;package=in.amazon.mShop.android.shopping;end`
        : amazonpayUri || `amazonpay://upi/pay?pa=${encodedUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}`;
    } else {
      // Universal standard UPI intent which prompts Android / iOS chooser dialog
      targetUri = isAndroid
        ? `intent://pay?pa=${encodedUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}#Intent;scheme=upi;end`
        : `upi://pay?pa=${encodedUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}`;
    }

    if (!isMobileDevice) {
      setUpiLaunchNotice(
        `💻 तुम्ही लॅपटॉप/कॉम्प्युटरवर आहात. कृपया खालील QR कोड तुमच्या मोबाईलमधील PhonePe / GPay / Paytm ने स्कॅन करा — रक्कम (₹${formattedPrice}) आपोआप येईल! किंवा UPI ID (${targetUpiId}) कॉपी झाला आहे.`
      );
      return;
    }

    setUpiLaunchNotice(
      `📲 ${appName} ॲप उघडत आहे... रक्कम: ₹${formattedPrice} आणि नाव: ${cleanBusiness} ऑटोमॅटिक आले आहे. फक्त तुमचा UPI PIN टाका!`
    );

    try {
      const link = document.createElement('a');
      link.href = targetUri;
      link.target = '_top';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Deep link trigger fallback:', err);
    }

    // Direct window.location trigger
    try {
      window.location.href = targetUri;
    } catch (eLoc) {}

    // Fallback timer: if specific app intent wasn't handled, open universal OS chooser
    if (appName !== 'सर्व UPI ॲप्स') {
      setTimeout(() => {
        try {
          const universalFallback = `upi://pay?pa=${encodedUpi}&pn=${encodedBusiness}&am=${formattedPrice}&cu=INR&tn=${encodedNote}`;
          const fallbackLink = document.createElement('a');
          fallbackLink.href = universalFallback;
          fallbackLink.target = '_top';
          fallbackLink.rel = 'noopener noreferrer';
          document.body.appendChild(fallbackLink);
          fallbackLink.click();
          document.body.removeChild(fallbackLink);
        } catch (e) {}
      }, 1200);
    }
  };

  // Copy UPI ID with Toast
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Download / Save QR Code Image
  const handleDownloadQr = async () => {
    const qrUrl = paymentConfig?.merchantQrImageUrl || siteConfig?.paymentQrCodeUrl || siteConfig?.paymentQrUrl || dynamicQrUrl;
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `VanjariJodi_UPI_QR_${activePlan?.price || '398'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (e) {
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `VanjariJodi_UPI_QR_${activePlan?.price || '398'}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setQrDownloaded(true);
    setTimeout(() => setQrDownloaded(false), 3000);
  };

  // Direct WhatsApp Admin Assistance
  const handleOpenWhatsApp = () => {
    const num = paymentConfig?.whatsappNumber || '7083070830';
    const cleanNum = num.replace(/[^0-9]/g, '');
    const planName = activePlan?.nameMr || activePlan?.name || 'नोंदणी प्लॅन';
    const planPrice = activePlan?.price || paymentConfig?.amount || '398';
    const msg = encodeURIComponent(`नमस्कार ॲडमिन, मी वंजारी जोडी मॅट्रिमोनीवर "${planName}" (रक्कम: ₹${planPrice}) साठी पेमेंट करत आहे. मला पेमेंट करताना मदत हवी आहे.`);
    window.open(`https://wa.me/91${cleanNum.slice(-10)}?text=${msg}`, '_blank');
  };

  // Strict 12-Digit Numeric UTR Input Handler & Live Validation
  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric digits, maximum 12 characters
    const numericVal = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
    setUtrNumber(numericVal);
    setIsUtrDuplicate(false);

    if (numericVal.length === 0) {
      setUtrError(null);
    } else if (numericVal.length < 12) {
      setUtrError(`१२-अंकी UTR क्रमांक आवश्यक आहे (${numericVal.length}/12 अंक भरले)`);
    } else if (numericVal.length === 12) {
      setUtrError(null);
      // Trigger Live Duplicate Check
      checkUtrDuplicate(numericVal);
    }
  };

  // Live UTR Uniqueness & Anti-Fraud Check
  const checkUtrDuplicate = async (utr: string) => {
    if (utr.length !== 12) return;
    try {
      setIsUtrChecking(true);
      const res = await fetch(`/api/payment/check-utr/${utr}`);
      const data = await res.json();
      if (data.success && data.is_fake) {
        setIsUtrDuplicate(true);
        setUtrError(data.message || '⚠️ अमान्य डमी UTR क्रमांक. कृपया बँकेचा खरा UTR टाका.');
      } else if (data.success && data.is_duplicate) {
        setIsUtrDuplicate(true);
        setUtrError('⚠️ हा UTR क्रमांक आधीच वापरला गेला आहे (Duplicate UTR). कृपया नवीन खरी पावती सबमिट करा.');
      } else {
        setIsUtrDuplicate(false);
      }
    } catch (err) {
      console.error('Error verifying UTR uniqueness:', err);
    } finally {
      setIsUtrChecking(false);
    }
  };

  // Screenshot Upload Handler
  const handleFileSelect = async (file: File) => {
    const sizeCheck = validateFileSize(file);
    if (!sizeCheck.valid) {
      setSubmitError(sizeCheck.errorMsg || 'फाइल साइज खूप मोठी आहे.');
      return;
    }

    setScreenshotFile(file);
    const localUrl = URL.createObjectURL(file);
    setScreenshotPreview(localUrl);
    setSubmitError(null);

    // Upload to Cloudinary in background
    try {
      setIsUploading(true);
      const uploaded = await uploadToCloudinary(file);
      if (uploaded && uploaded.url) {
        setScreenshotUrl(uploaded.url);
      }
    } catch (err) {
      console.warn('Direct Cloudinary upload failed, local preview will be used:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Payment Request for Verification
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Strict Validations
    if (!utrNumber || utrNumber.length !== 12 || !/^\d{12}$/.test(utrNumber)) {
      setUtrError('कृपया बँक पावतीतील बरोबर १२-अंकी UTR / Transaction ID नंबर टाकावा.');
      return;
    }

    // Anti-fraud fake sequence detection
    if (/^(\d)\1{11}$/.test(utrNumber)) {
      setUtrError('अमान्य UTR (सर्व अंक समान आहेत). कृपया बँकेचा खरा UTR टाका.');
      return;
    }
    const dummyPatterns = [
      '123456789012',
      '012345678901',
      '987654321098',
      '098765432109',
      '121212121212',
      '123123123123',
      '112233445566',
      '001122334455',
      '101010101010',
    ];
    if (dummyPatterns.includes(utrNumber) || new Set(utrNumber.split('')).size < 3) {
      setUtrError('अमान्य किंवा बनावट UTR क्रमांक. प्रत्यक्ष बँकेत पैसे पाठवल्याचा खरा UTR टाका.');
      return;
    }

    if (isUtrDuplicate) {
      setSubmitError('हा UTR क्रमांक आधीच वापरलेला आहे. कृपया नवीन खरी पावती किंवा योग्य UTR सबमिट करा.');
      return;
    }

    try {
      setIsSubmitting(true);

      let finalScreenshotUrl = screenshotUrl;
      // If screenshot file selected but not uploaded yet, upload now
      if (screenshotFile && !finalScreenshotUrl) {
        try {
          const res = await uploadToCloudinary(screenshotFile);
          if (res?.url) finalScreenshotUrl = res.url;
        } catch (uploadErr) {
          console.warn('Screenshot upload skipped:', uploadErr);
        }
      }

      // Backend API Call
      let data: any = { success: true };
      try {
        const res = await fetch('/api/payment/submit-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUser?.id || `guest-${Date.now()}`,
            user_name: currentUser?.fullName || 'Member',
            user_mobile: userMobile || currentUser?.mobile || '',
            plan_id: activePlan.id,
            plan_name: activePlan.nameMr || activePlan.name,
            amount: finalPayablePrice,
            utr_number: utrNumber,
            screenshot_url: finalScreenshotUrl || screenshotPreview,
            payment_method: 'upi_intent',
            promo_code: appliedPromo?.code || undefined,
            discount_amount: discountAmount,
            original_amount: originalPrice,
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
          if (!res.ok || !data.success) {
            if (res.status === 409 || data.isDuplicate) {
              setIsUtrDuplicate(true);
              setUtrError(data.error || 'हा UTR नंबर आधीच वापरला गेला आहे.');
            } else {
              setSubmitError(data.error || 'पेमेंट सबमिट करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
            }
            setIsSubmitting(false);
            return;
          }
        }
      } catch (apiErr) {
        console.warn('Backend payment submit not reachable, proceeding with local state sync:', apiErr);
      }

      // Context Sync
      addPaymentRequest({
        userId: currentUser?.id || `guest-${Date.now()}`,
        userName: currentUser?.fullName || 'Member',
        userMobile: userMobile || currentUser?.mobile || '',
        planId: activePlan.id as MembershipTier,
        planName: activePlan.nameMr || activePlan.name,
        amount: finalPayablePrice,
        utrNumber: utrNumber,
        screenshotUrl: finalScreenshotUrl || screenshotPreview,
        paymentMethod: 'upi_intent',
        adminNote: appliedPromo ? `कूपन कोड लागू: ${appliedPromo.code} (सवलत ₹${discountAmount})` : '',
        promoCode: appliedPromo?.code,
        discountAmount: discountAmount,
        originalAmount: originalPrice,
      });

      if (appliedPromo) {
        usePromoCode(appliedPromo.code);
      }

      logActivity(
        'UPI Payment Proof Submitted',
        `सदस्याने ${activePlan.nameMr || activePlan.name} (रक्कम: ₹${finalPayablePrice}${appliedPromo ? `, कूपन: ${appliedPromo.code}` : ''}) साठी १२-अंकी UTR: ${utrNumber} सबमिट केला.`,
        currentUser?.fullName || 'Member'
      );

      // Transition to Waiting Screen Polling
      setSubmittedRequestId(data.requestId || data.paymentRequest?.id || `REQ-${Date.now()}`);
      setStep('waiting');
    } catch (err: any) {
      console.error('Error submitting payment:', err);
      setSubmitError('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया इंटरनेट तपासा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Polling Engine (Polls `/api/payment/status/:id` every 5 seconds)
  useEffect(() => {
    if (step !== 'waiting' || !submittedRequestId) return;

    const pollInterval = setInterval(async () => {
      try {
        setPollCount((prev) => prev + 1);
        const res = await fetch(`/api/payment/status/${submittedRequestId}`);
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) return;
        const data = await res.json();

        if (data.success) {
          if (data.status === 'approved') {
            clearInterval(pollInterval);
            handlePaymentApproved(data);
          } else if (data.status === 'rejected') {
            clearInterval(pollInterval);
            setAdminNote(data.admin_note || 'पेमेंट माहिती अमान्य झाली.');
            setStep('rejected');
          }
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [step, submittedRequestId]);

  // Trigger Confetti Celebration & UI Activation
  const handlePaymentApproved = (data: any) => {
    setApprovedDetails(data);
    setStep('approved');

    // Launch Confetti Cannon
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#800C1E', '#D97706', '#10B981', '#3B82F6', '#EC4899'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
    } catch (e) {
      console.log('Confetti error:', e);
    }

    // Sync App Context User Tier
    if (currentUser) {
      updateMemberTier(currentUser.id, activePlan.id as MembershipTier, undefined, {
        paidAt: new Date().toISOString(),
        paymentApprovedAt: new Date().toISOString(),
        paymentAmount: activePlan.price,
        paymentUtr: utrNumber,
        paymentPlanName: activePlan.nameMr || activePlan.name,
      });

      if (typeof addNotification === 'function') {
        addNotification({
          userId: currentUser.id,
          title: '🎉 मेंबरशिप यशस्वीरित्या सुरू झाली!',
          titleMr: '🎉 प्रीमियम मेंबरशिप ॲक्टिव्हेट झाली!',
          message: `${activePlan.nameMr || activePlan.name} प्लॅन (₹${activePlan.price}) मंजूर झाला आहे!`,
          messageMr: `${activePlan.nameMr || activePlan.name} प्लॅन (₹${activePlan.price}) मंजूर झाला आहे!`,
          type: 'approval',
        });
      }
    }
  };

  // Format MM:SS for Timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !activePlan) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#800C1E] via-[#A71930] to-[#800C1E] text-white px-6 py-5 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <CreditCard className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold font-serif text-white tracking-wide">
                  सुरक्षित UPI पेमेंट गेटवे
                </h3>
                <span className="bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-400/40 font-medium">
                  Dynamic UPI
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                Google Pay • PhonePe • Paytm • Any UPI App
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: CHECKOUT SCREEN (Dynamic Intent, QR, 10-Min Timer, Form) */}
        {/* ------------------------------------------------------------- */}
        {step === 'checkout' && (
          <div className="p-5 sm:p-7 space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Plan Summary Card & Countdown Timer */}
            <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-amber-900 uppercase bg-amber-200/60 px-2.5 py-0.5 rounded-md">
                  निवडलेला सबस्क्रिप्शन प्लॅन
                </span>
                <h4 className="text-lg font-bold text-gray-900 mt-1">
                  {activePlan.nameMr || activePlan.name}
                </h4>
                <p className="text-xs text-gray-600">
                  {activePlan.durationLabelMr || activePlan.featuresMr?.[0] || 'सर्व वधू-वर प्रोफाइल्स व संपर्क अनलॉक'}
                </p>
              </div>

              {/* Amount & Timer */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">एकूण देय रक्कम</span>
                  <div className="flex items-baseline space-x-1.5 justify-end">
                    {appliedPromo && discountAmount > 0 && (
                      <span className="text-sm font-bold text-gray-400 line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                    <span className={`text-2xl sm:text-3xl font-black ${isVipFree ? 'text-emerald-700' : 'text-[#800C1E]'}`}>
                      {isVipFree ? '₹० (मोफत)' : `₹${finalPayablePrice}`}
                    </span>
                  </div>
                  {appliedPromo && (
                    <span className="text-[10px] font-bold text-emerald-700 block bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-0.5">
                      ✓ ₹{discountAmount} सवलत लागू ({appliedPromo.code})
                    </span>
                  )}
                </div>

                {/* 10:00 Countdown Badge */}
                <div
                  className={`flex flex-col items-center justify-center px-3.5 py-2 rounded-xl border ${
                    timeLeft < 120
                      ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                      : 'bg-white border-amber-200 text-amber-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono text-sm font-black tracking-wider">
                      {formatTimer(timeLeft)}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-gray-500">
                    {timeLeft === 0 ? 'मुदत संपली' : 'वेळ शिल्लक'}
                  </span>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PROMO / COUPON CODE SECTION */}
            {/* ------------------------------------------------------------- */}
            <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Tag className="w-4 h-4 text-[#800C1E]" />
                  <span>कूपन किंवा प्रोमो कोड (Promo / Discount Code):</span>
                </label>
                {appliedPromo && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>कूपन लागू झाले</span>
                  </span>
                )}
              </div>

              {!appliedPromo ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => {
                          setPromoCodeInput(e.target.value.toUpperCase());
                          setPromoError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyPromoCode();
                          }
                        }}
                        placeholder="उदा. WELCOME50, VANJARI20, VIPFREE"
                        className="w-full pl-3.5 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono tracking-wider focus:outline-none focus:border-[#800C1E] focus:ring-1 focus:ring-[#800C1E] uppercase"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyPromoCode()}
                      disabled={isApplyingPromo || !promoCodeInput.trim()}
                      className="px-4 py-2.5 bg-[#800C1E] hover:bg-[#6A0A19] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-sm active:scale-95 flex-shrink-0"
                    >
                      {isApplyingPromo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Percent className="w-3.5 h-3.5" />
                          <span>लागू करा</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Quick Promo Suggestions Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] text-gray-500 font-medium">उपलब्ध ऑफर्स:</span>
                    {['WELCOME50', 'VANJARI20', 'VIPFREE'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setPromoCodeInput(code);
                          handleApplyPromoCode(code);
                        }}
                        className="text-[10px] font-mono font-bold bg-white hover:bg-amber-50 text-[#800C1E] border border-amber-300/80 px-2 py-0.5 rounded-lg shadow-2xs transition active:scale-95 flex items-center space-x-0.5"
                      >
                        <Tag className="w-2.5 h-2.5 opacity-70" />
                        <span>{code}</span>
                      </button>
                    ))}
                  </div>

                  {promoError && (
                    <p className="text-xs text-rose-600 font-medium flex items-center space-x-1 animate-in fade-in">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{promoError}</span>
                    </p>
                  )}
                </div>
              ) : (
                /* Applied Promo Card */
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-black text-xs text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-300">
                          {appliedPromo.code}
                        </span>
                        <span className="text-xs font-bold text-emerald-800">
                          {appliedPromo.message || 'सवलत लागू झाली!'}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                        मूळ रक्कम: <span className="line-through">₹{originalPrice}</span> • सवलत: <span className="font-bold">₹{discountAmount}</span> • अंतिम रक्कम: <span className="font-bold text-[#800C1E]">₹{finalPayablePrice}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemovePromoCode}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg transition shadow-2xs flex-shrink-0"
                  >
                    काढून टाका
                  </button>
                </div>
              )}

              {/* Instant VIP Free 1-Click Activation Button */}
              {isVipFree && (
                <div className="p-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-xl shadow-md space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span className="font-bold text-sm">🎉 १००% मोफत VIP कूपन लागू झाले आहे!</span>
                  </div>
                  <p className="text-xs text-emerald-100">
                    या कूपनद्वारे तुम्हाला कोणतेही शुल्क भरण्याची किंवा UTR टाकण्याची आवश्यकता नाही. खालील बटण दाबून थेट ॲक्टिव्हेट करा.
                  </p>
                  <button
                    type="button"
                    onClick={handleInstantVipFreeActivation}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-xl text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>VIP प्लॅन सुरू होत आहे...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-900" />
                        <span>🎉 मोफत VIP मेंबरशिप त्वरित सुरू करा (₹० भरणा)</span>
                        <ArrowRight className="w-4 h-4 text-emerald-900" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Timer Expired Warning */}
            {timeLeft === 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center justify-between text-rose-800 text-xs">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>पेमेंट सेशनची वेळ संपली आहे. कृपया रिफ्रेश करून नवीन क्यूआर मिळवा.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTimeLeft(600);
                    fetchPaymentIntent();
                  }}
                  className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-700 transition flex items-center space-x-1 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>रिफ्रेश करा</span>
                </button>
              </div>
            )}

            {/* UPI Payment Methods: Mobile 1-Click Apps & Authentic Paytm QR Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left/Top Area (7 cols on lg): 1-Click UPI App Launch Cards */}
              <div className="lg:col-span-7 space-y-3.5 order-1 lg:order-1">
                <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-300/80 rounded-2xl p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-[#800C1E]">
                        ⚡ १-क्लिक पेमेंट (कोणत्याही ॲपवर क्लिक करा):
                      </h4>
                    </div>
                    <span className="text-[10px] font-extrabold bg-[#800C1E] text-white px-2 py-0.5 rounded-full shadow-xs">
                      ऑटो रक्कम ₹{finalPayablePrice}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium mt-1 leading-relaxed">
                    खालीलपैकी तुमच्या ॲपवर क्लिक करताच ते ॲप थेट उघडेल, <strong>₹{finalPayablePrice} रक्कम आणि नाव (Usha Shivdas Hange) आपोआप येईल</strong>. तुम्हाला काहीही टाईप करण्याची गरज नाही, फक्त तुमचा UPI पिन टाका!
                  </p>
                </div>

                {/* Active App Launching Notice */}
                {activeAppLaunching && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-pulse">
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin flex-shrink-0" />
                    <span>{activeAppLaunching} उघडत आहे... रक्कम ₹{finalPayablePrice} व नाव ऑटोमॅटिक लोड होत आहे.</span>
                  </div>
                )}

                {/* Live Launch Status / Copy Guidance Banner */}
                {upiLaunchNotice && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 font-bold leading-relaxed flex items-start gap-2 shadow-xs animate-in fade-in duration-200">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p>{upiLaunchNotice}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="font-mono text-xs bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 font-black text-[#800C1E]">
                          {upiId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="text-[11px] bg-[#800C1E] text-amber-100 px-2.5 py-1 rounded-lg font-black hover:bg-[#A71930] transition shadow-xs flex items-center space-x-1"
                        >
                          {copiedToast ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-300" />
                              <span>✓ आयडी कॉपी झाला!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>UPI आयडी कॉपी करा</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary App Launch Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 1. PhonePe Card */}
                  <button
                    type="button"
                    onClick={() => handleLaunchUpiApp('PhonePe')}
                    className="group relative p-3.5 bg-gradient-to-br from-white to-purple-50/50 hover:to-purple-100/60 border-2 border-purple-500 rounded-2xl flex items-center justify-between text-left shadow-sm hover:shadow-md transition active:scale-98 cursor-pointer"
                  >
                    <span className="absolute -top-2.5 right-3 bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow-xs">
                      सर्वोत्तम व जलद
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                        पे
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm font-black text-purple-950">PhonePe (फोन पे)</span>
                        </div>
                        <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                          १-क्लिकने PhonePe उघडा • ऑटो ₹{finalPayablePrice}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-100 group-hover:bg-purple-600 text-purple-700 group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* 2. Google Pay Card */}
                  <button
                    type="button"
                    onClick={() => handleLaunchUpiApp('Google Pay')}
                    className="group p-3.5 bg-gradient-to-br from-white to-blue-50/50 hover:to-blue-100/60 border-2 border-blue-400 hover:border-blue-500 rounded-2xl flex items-center justify-between text-left shadow-sm hover:shadow-md transition active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                        <span className="text-blue-600 font-black">G</span>
                        <span className="text-rose-500 font-black text-xs">P</span>
                        <span className="text-amber-500 font-black text-xs">a</span>
                        <span className="text-emerald-500 font-black text-xs">y</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm font-black text-blue-950">Google Pay (गुगल पे)</span>
                        </div>
                        <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                          १-क्लिकने GPay उघडा • ऑटो ₹{finalPayablePrice}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-600 text-blue-700 group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* 3. Paytm Card */}
                  <button
                    type="button"
                    onClick={() => handleLaunchUpiApp('Paytm')}
                    className="group relative p-3.5 bg-gradient-to-br from-white to-sky-50/50 hover:to-sky-100/60 border-2 border-sky-400 hover:border-sky-500 rounded-2xl flex items-center justify-between text-left shadow-sm hover:shadow-md transition active:scale-98 cursor-pointer"
                  >
                    <span className="absolute -top-2.5 right-3 bg-sky-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow-xs">
                      अधिकृत Paytm
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#002970] text-[#00baf2] flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                        Paytm
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm font-black text-sky-950">Paytm (पेटीएम)</span>
                        </div>
                        <p className="text-[11px] text-sky-700 font-semibold mt-0.5">
                          १-क्लिकने Paytm उघडा • ऑटो ₹{finalPayablePrice}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-sky-100 group-hover:bg-sky-600 text-sky-700 group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* 4. BHIM UPI Card */}
                  <button
                    type="button"
                    onClick={() => handleLaunchUpiApp('BHIM UPI')}
                    className="group p-3.5 bg-gradient-to-br from-white to-emerald-50/50 hover:to-emerald-100/60 border-2 border-emerald-400 hover:border-emerald-500 rounded-2xl flex items-center justify-between text-left shadow-sm hover:shadow-md transition active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                        BHIM
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm font-black text-emerald-950">BHIM UPI (भीम)</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          सरकारी सुरक्षित UPI • ऑटो ₹{finalPayablePrice}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>

                {/* 5. Universal Any UPI App Banner */}
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp('सर्व UPI ॲप्स')}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-between shadow-md hover:shadow-lg transition transform active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Smartphone className="w-5 h-5 text-amber-300 animate-bounce flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-black">📱 मोबाईलमधील इतर कोणत्याही ॲपने भरा (Universal UPI)</div>
                      <div className="text-[10px] text-emerald-100 font-normal">Cred, Amazon Pay, MobiKwik किंवा कोणतेही बँक ॲप</div>
                    </div>
                  </div>
                  <span className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-black px-3 py-1 rounded-xl shadow-xs">
                    रक्कम: ₹{finalPayablePrice} →
                  </span>
                </button>

                {/* PhonePe Security Error Guide / Direct Solution Card */}
                <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl space-y-2.5 shadow-xs">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-amber-950">
                        💡 PhonePe मध्ये "Declined for Security Reasons" असा एरर येत असल्यास:
                      </h4>
                      <p className="text-[11px] text-amber-900 font-medium mt-0.5 leading-relaxed">
                        काही मोबाईलवर PhonePe च्या नियमांमुळे डायरेक्ट लिंक थांबल्यास काळजी करू नका, खालीलपैकी १-क्लिक पर्याय वापरा:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                    {/* Option 1: Direct Mobile Number Pay */}
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard?.writeText) {
                          navigator.clipboard.writeText('9623790916');
                          setCopiedToast(true);
                          setTimeout(() => setCopiedToast(false), 2500);
                        }
                        setUpiLaunchNotice('📱 9623790916 मोबाईल नंबर कॉपी झाला आहे! PhonePe मधील "To Mobile Number" मध्ये हा नंबर टाकून ₹' + finalPayablePrice + ' पाठवा.');
                        window.location.href = 'phonepe://';
                      }}
                      className="p-2.5 bg-white hover:bg-purple-50 border-2 border-purple-300 rounded-xl text-left flex items-center justify-between cursor-pointer shadow-xs transition active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        <div>
                          <div className="text-[11px] font-black text-purple-950">9623790916 वर PhonePe करा</div>
                          <div className="text-[10px] text-purple-700 font-bold">नंबर कॉपी करून PhonePe उघडा</div>
                        </div>
                      </div>
                      <Copy className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    </button>

                    {/* Option 2: Scan QR from gallery */}
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      className="p-2.5 bg-white hover:bg-sky-50 border-2 border-sky-300 rounded-xl text-left flex items-center justify-between cursor-pointer shadow-xs transition active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🖼️</span>
                        <div>
                          <div className="text-[11px] font-black text-sky-950">अधिकृत QR कोड सेव्ह करा</div>
                          <div className="text-[10px] text-sky-700 font-bold">PhonePe स्कॅनरमधून स्कॅन करा</div>
                        </div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    </button>
                  </div>
                </div>

                {/* 3 Step Simple Instructions */}
                <div className="bg-amber-50/90 rounded-2xl p-3.5 border border-amber-300/80 text-xs text-amber-950 space-y-1.5 shadow-xs">
                  <p className="font-black flex items-center space-x-1.5 text-amber-900 text-xs">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>सोप्या ३ पायऱ्यांत पेमेंट पूर्ण करा:</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-800 leading-relaxed font-medium">
                    <li>वरीलपैकी <strong>PhonePe, Google Pay किंवा Paytm</strong> बटणावर दाबा — ॲप उघडेल व ₹{finalPayablePrice} रक्कम ऑटोमॅटिक येईल.</li>
                    <li>तुमच्या ॲपमध्ये UPI PIN टाकून पेमेंट पूर्ण करा.</li>
                    <li>पेमेंट झाल्यावर मिळालेला <strong>१२-अंकी UTR क्रमांक</strong> खालील रकान्यात टाकून सबमिट करा.</li>
                  </ol>
                </div>
              </div>

              {/* Right Area (5 cols on lg): Authentic Paytm Business QR Card */}
              <div className="lg:col-span-5 order-2 lg:order-2">
                <div className="bg-gradient-to-b from-[#002970] via-[#002970] to-[#011a47] rounded-3xl p-4 sm:p-5 text-white shadow-xl border border-sky-400/40 relative overflow-hidden">
                  {/* Top Header replicating Paytm Business QR Screenshot */}
                  <div className="flex items-center justify-between pb-3 border-b border-sky-400/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm">
                        <span className="text-[#002970] font-black text-xs leading-none">Pay<span className="text-[#00baf2]">tm</span></span>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-sky-300 uppercase tracking-wider">Paytm से UPI</div>
                        <div className="text-sm font-black text-white leading-tight">Usha Shivdas Hange</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-sky-200">मोबाईल</div>
                      <div className="text-xs font-black text-amber-300">9623790916</div>
                    </div>
                  </div>

                  {/* Cashback Banner matching screenshot */}
                  <div className="mt-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center justify-between shadow-xs">
                    <span>✨ Get Assured Cashback</span>
                    <span className="bg-amber-950 text-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold">Paytm • PhonePe • GPay</span>
                  </div>

                  {/* Dynamic QR Container */}
                  <div className="mt-3 bg-white rounded-2xl p-3 text-center shadow-md relative">
                    <div className="text-[11px] font-black text-slate-800 mb-1.5 flex items-center justify-center space-x-1">
                      <QrCode className="w-3.5 h-3.5 text-[#002970]" />
                      <span>कोणत्याही UPI ॲपने स्कॅन करा</span>
                    </div>

                    <div className="relative inline-block mx-auto p-2 bg-white rounded-xl border-2 border-slate-200">
                      {isLoadingIntent ? (
                        <div className="w-48 h-48 flex flex-col items-center justify-center space-y-2">
                          <Loader2 className="w-8 h-8 text-[#002970] animate-spin" />
                          <span className="text-xs text-slate-500 font-medium">QR कोड जनरेट होत आहे...</span>
                        </div>
                      ) : (paymentConfig?.merchantQrImageUrl || siteConfig?.paymentQrCodeUrl || siteConfig?.paymentQrUrl || dynamicQrUrl) ? (
                        <img
                          src={paymentConfig?.merchantQrImageUrl || siteConfig?.paymentQrCodeUrl || siteConfig?.paymentQrUrl || dynamicQrUrl}
                          alt="Paytm UPI Payment QR Code"
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg mx-auto"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-xs text-slate-500">
                          QR कोड उपलब्ध नाही
                        </div>
                      )}

                      {/* Exact Plan Amount Embedded Badge */}
                      <div className="mt-1.5 bg-emerald-50 border border-emerald-300 rounded-lg py-1 px-2 text-center">
                        <span className="text-[11px] font-black text-emerald-900">
                          ऑटो स्कॅन रक्कम: ₹{finalPayablePrice} • Usha Shivdas Hange
                        </span>
                      </div>
                    </div>

                    {/* NPCI / Verified Badge */}
                    <div className="mt-2 flex items-center justify-center space-x-1.5 text-[10px] text-slate-500 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>NPCI / 100% सुरक्षित UPI पेमेंट</span>
                    </div>
                  </div>

                  {/* Paytm Postpaid, UPI, UPI Lite Badges matching screenshot */}
                  <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] font-black text-sky-200">
                    <span className="bg-sky-900/60 border border-sky-400/30 px-2 py-0.5 rounded-full">Paytm Postpaid</span>
                    <span className="bg-sky-900/60 border border-sky-400/30 px-2 py-0.5 rounded-full">UPI</span>
                    <span className="bg-sky-900/60 border border-sky-400/30 px-2 py-0.5 rounded-full">UPI LITE</span>
                  </div>

                  {/* UPI ID Display & Copy Button */}
                  <div className="mt-3 pt-2.5 border-t border-sky-400/30">
                    <div className="text-[10px] text-sky-200 mb-1">Paytm UPI आयडी:</div>
                    <div className="flex items-center justify-between bg-sky-950/80 border border-sky-400/50 rounded-xl px-2.5 py-1.5">
                      <span className="font-mono text-xs font-black text-sky-200 select-all truncate">
                        {upiId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="ml-2 px-2.5 py-1 bg-[#00baf2] hover:bg-sky-400 text-[#002970] rounded-lg text-[11px] font-black transition flex items-center space-x-1 flex-shrink-0"
                      >
                        {copiedToast ? (
                          <>
                            <Check className="w-3 h-3 text-[#002970]" />
                            <span>कॉपी झाले!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>कॉपी</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons: Download QR, Telegram & WhatsApp */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      className="py-2 px-2 bg-sky-900/80 hover:bg-sky-800 border border-sky-400/40 rounded-xl text-white text-[11px] font-black flex items-center justify-center space-x-1 shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      {qrDownloaded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>सेव्ह झाला</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-sky-300" />
                          <span>QR सेव्ह करा</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://t.me/${(siteConfig?.telegramUsername || 'VanjariJodiSupport').replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 bg-sky-500 hover:bg-sky-400 border border-sky-300 rounded-xl text-white text-[11px] font-black flex items-center justify-center space-x-1 shadow-xs transition active:scale-95 cursor-pointer text-center"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>टेलिग्राम मदत</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleOpenWhatsApp}
                      className="py-2 px-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 rounded-xl text-white text-[11px] font-black flex items-center justify-center space-x-1 shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                      <span>व्हॉट्सॲप</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PAYMENT VERIFICATION SUBMISSION FORM */}
            {/* ------------------------------------------------------------- */}
            <form onSubmit={handleSubmitPayment} className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#800C1E] text-white text-xs font-bold flex items-center justify-center">
                  २
                </div>
                <h4 className="text-sm font-bold text-gray-900">
                  पेमेंट झाल्यावर पावतीची माहिती भरा (UTR Verification)
                </h4>
              </div>

              {/* Anti-Fraud Security Notice Banner */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-950">
                    🛡️ अधिकृत बँक पडताळणी सूचना (Anti-Fraud Protection):
                  </p>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    केवळ प्रत्यक्ष बँक पावतीतील खरा १२-अंकी UTR क्रमांकच सबमिट करा. कोणताही खोटा, अंदाजे किंवा डमी नंबर टाकल्यास खाते चालू <strong>होत नाही</strong>. ॲडमिन स्वतः बँक खात्यात प्रत्यक्ष रक्कम जमा झाल्याची तपासणी करूनच खाते सक्रिय (Approve) करतात.
                  </p>
                </div>
              </div>

              {/* UTR Input Field with Strict 12-Digit Numeric Validation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-800 flex items-center space-x-1">
                    <span>१२-अंकी UTR / Transaction ID (कंपलसरी)</span>
                    <span className="text-rose-600">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      utrNumber.length === 12
                        ? 'text-emerald-600'
                        : utrNumber.length > 0
                        ? 'text-amber-600'
                        : 'text-gray-400'
                    }`}
                  >
                    ({utrNumber.length}/12 अंक)
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={12}
                    value={utrNumber}
                    onChange={handleUtrChange}
                    placeholder="उदा. 423819203841 (12 Digits Only)"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl font-mono text-sm tracking-wider font-bold transition focus:bg-white focus:outline-none ${
                      isUtrDuplicate
                        ? 'border-rose-400 text-rose-800 bg-rose-50'
                        : utrNumber.length === 12
                        ? 'border-emerald-400 text-emerald-900 bg-emerald-50/40'
                        : 'border-slate-300 focus:border-[#800C1E]'
                    }`}
                  />
                  {isUtrChecking ? (
                    <div className="absolute right-3.5 top-3.5">
                      <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                    </div>
                  ) : utrNumber.length === 12 && !isUtrDuplicate ? (
                    <div className="absolute right-3.5 top-3.5 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : null}
                </div>

                {utrError && (
                  <p className="text-xs text-rose-600 font-medium mt-1 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{utrError}</span>
                  </p>
                )}
                {!utrError && utrNumber.length === 12 && (
                  <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>वैध १२-अंकी UTR क्रमांक नोंदवला गेला.</span>
                  </p>
                )}
              </div>

              {/* Mobile Number & Optional Screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Mobile Number */}
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    तुमचा संपर्क / व्हॉट्सॲप नंबर
                  </label>
                  <input
                    type="tel"
                    value={userMobile}
                    onChange={(e) => setUserMobile(e.target.value)}
                    placeholder="१०-अंकी मोबाईल नंबर"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-[#800C1E] focus:outline-none"
                  />
                </div>

                {/* Screenshot Upload Receipt */}
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    स्क्रीनशॉट पावती (पर्यायी)
                  </label>
                  <label className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-300 hover:border-amber-400 rounded-xl cursor-pointer transition text-xs font-medium text-gray-700">
                    <div className="flex items-center space-x-2 truncate">
                      <Upload className="w-4 h-4 text-[#800C1E] flex-shrink-0" />
                      <span className="truncate">
                        {screenshotFile ? screenshotFile.name : 'फोटो / स्क्रीनशॉट निवडा'}
                      </span>
                    </div>
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 text-amber-600 animate-spin flex-shrink-0" />
                    ) : screenshotPreview ? (
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="text-[10px] text-gray-400">JPG/PNG</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Mandatory Legal & Refund Terms Agreement Box */}
              <div className="p-3.5 bg-amber-50 rounded-xl border-2 border-amber-300 space-y-1 text-xs">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaymentTermsAgreed}
                    onChange={(e) => setIsPaymentTermsAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border-amber-400 text-[#800C1E] focus:ring-0 mt-0.5 cursor-pointer shrink-0"
                  />
                  <div className="text-[11px] text-slate-800 font-bold leading-relaxed">
                    <span>मी <strong>वंजारी जोडी मॅट्रिमोनी</strong> च्या ऑनलाईन वर्गणी अटी, </span>
                    <span className="text-[#800C1E] underline">परतावा धोरण (5-7 Days Refund)</span>
                    <span> व कायदेशीर अस्वीकरण मान्य करतो. विवाह ठरवण्यापूर्वी कुटुंबाने स्वतः प्रत्यक्ष खात्री (Due Diligence) करणे आवश्यक आहे. मंचाची कोणतीही कायदेशीर जबाबदारी नाही.</span>
                  </div>
                </label>
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || utrNumber.length !== 12 || isUtrDuplicate || !isPaymentTermsAgreed}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#800C1E] to-[#A71930] hover:from-[#6A0A19] hover:to-[#8E1428] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>पडताळणी प्रक्रिया सुरू आहे...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-amber-300" />
                    <span>पेमेंट पडताळणीसाठी सबमिट करा (Submit for Approval)</span>
                    <ArrowRight className="w-4 h-4 ml-1 text-amber-300" />
                  </>
                )}
              </button>

              {/* Verified Merchant Details & Security Notice */}
              <div className="p-3 bg-slate-900 text-amber-100 rounded-xl border border-amber-400/30 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between border-b border-amber-400/20 pb-1 font-bold text-amber-300">
                  <span>🏢 {siteConfig?.businessName || 'वंजारी जोडी मॅट्रिमोनी (Vanjari Jodi Matrimony)'}</span>
                  <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">Verified PayU Merchant</span>
                </div>
                <div className="text-[10px] text-slate-300 space-y-0.5 font-medium">
                  <p>📍 <strong>Address:</strong> Bhagwan Baba Chowk, Beed, Maharashtra - 431122</p>
                  <p>📧 <strong>Official Support Email:</strong> {siteConfig?.contactEmail || 'gitevijay123@gmail.com'}</p>
                  <p>⏱️ <strong>Operating Hours:</strong> Mon - Sat, 10:00 AM to 5:00 PM</p>
                  <p className="text-amber-200 font-semibold pt-0.5">⚡ <strong>Refund Policy:</strong> Duplicate payments are automatically refunded within 5-7 working days to original payment source.</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-500 font-medium pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted • PayU Gateway Compliant • 24/7 Helpline</span>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: WAITING & LIVE POLLING SCREEN (Every 5s status check) */}
        {/* ------------------------------------------------------------- */}
        {step === 'waiting' && (
          <div className="p-8 sm:p-10 text-center space-y-6">
            {/* Animated Radar Pulse Scanner */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-[#800C1E]/15 animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#800C1E] to-[#A71930] text-white flex items-center justify-center shadow-xl">
                <Loader2 className="w-10 h-10 animate-spin text-amber-300" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="bg-amber-100 text-amber-900 text-xs px-3 py-1 rounded-full font-bold border border-amber-300">
                ⏳ प्रशासक पडताळणी सुरू आहे (Polling Live Status...)
              </span>
              <h4 className="text-xl font-bold font-serif text-gray-900 mt-2">
                तुमची पेमेंट पावती प्राप्त झाली आहे
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                बँक UTR व पावतीची पडताळणी होत असून दर ५ सेकंदाला स्टेटस आपोआप अपडेट होत आहे.
              </p>
            </div>

            {/* Request Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">विनंती आयडी:</span>
                <span className="font-mono font-bold text-slate-800">{submittedRequestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">UTR / Transaction ID:</span>
                <span className="font-mono font-bold text-emerald-700">{utrNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">प्लॅन & रक्कम:</span>
                <span className="font-bold text-[#800C1E]">
                  {activePlan.nameMr || activePlan.name} (₹{activePlan.price})
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px] text-gray-500">
                <span>लाइव्ह स्टेटस चेक्स:</span>
                <span>{pollCount} वेळा तपासले</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              प्रशासक मंजुरी देताच स्क्रीनवर अभिनंदन संदेश व मेंबरशिप सुरू होईल.
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: CELEBRATION & APPROVED SCREEN (Confetti Activated!) */}
        {/* ------------------------------------------------------------- */}
        {step === 'approved' && (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white mx-auto flex items-center justify-center shadow-2xl animate-bounce">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>

            <div className="space-y-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs px-3.5 py-1 rounded-full font-black border border-emerald-300 uppercase tracking-wide">
                🎉 APPROVED & ACTIVATED
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 mt-2">
                अभिनंदन! तुमचे पेमेंट मंजूर झाले आहे!
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {activePlan.nameMr || activePlan.name} सबस्क्रिप्शन यशस्वीरीत्या सक्रिय झाले असून सर्व वधू-वर संपर्क अनलॉक झाले आहेत.
              </p>
            </div>

            {/* Approved Membership Details */}
            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-200 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2.5 shadow-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">मेंबरशिप प्लॅन:</span>
                <span className="font-bold text-gray-900">{activePlan.nameMr || activePlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">पेड रक्कम:</span>
                <span className="font-black text-[#800C1E]">₹{activePlan.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UTR नंबर:</span>
                <span className="font-mono font-bold text-emerald-800">{utrNumber}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-emerald-200/60 font-bold text-emerald-900">
                <span>स्टेटस:</span>
                <span>सक्रिय (Active Premium Member)</span>
              </div>
            </div>

            {/* Go to Profiles / Dashboard CTA Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (typeof setCurrentView === 'function') setCurrentView('profiles');
              }}
              className="w-full max-w-md mx-auto py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center space-x-2 text-base"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>वधू-वर प्रोफाईल्स पाहा (Explore Profiles)</span>
              <ArrowRight className="w-5 h-5 text-amber-300 ml-1" />
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 4: REJECTED SCREEN (With Reason & Retry Button) */}
        {/* ------------------------------------------------------------- */}
        {step === 'rejected' && (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center border-2 border-rose-300">
              <XCircle className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="bg-rose-100 text-rose-800 text-xs px-3 py-1 rounded-full font-bold border border-rose-300">
                पेमेंट अमान्य / नाकारले
              </span>
              <h4 className="text-xl font-bold font-serif text-gray-900 mt-2">
                पेमेंट पडताळणी अयशस्वी
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                प्रशासकाने दिलेल्या कारणामुळे ही विनंती मंजूर होऊ शकली नाही:
              </p>
            </div>

            {/* Admin Note Box */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs text-rose-900 font-medium">
              <p className="font-bold mb-1 flex items-center space-x-1 text-rose-800">
                <ShieldAlert className="w-4 h-4" />
                <span>प्रशासक शेरा (Reason):</span>
              </p>
              <p>{adminNote || 'UTR नंबर बँक खात्याशी जुळला नाही किंवा अस्पष्ट पावती आहे.'}</p>
            </div>

            {/* Retry Button */}
            <button
              type="button"
              onClick={() => {
                setStep('checkout');
                setUtrNumber('');
                setUtrError(null);
                setIsUtrDuplicate(false);
                setTimeLeft(600);
              }}
              className="w-full max-w-md mx-auto py-3.5 px-6 bg-[#800C1E] hover:bg-[#6A0A19] text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
            >
              <RefreshCw className="w-4 h-4 text-amber-300" />
              <span>पुन्हा नवीन UTR टाकून प्रयत्न करा</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
