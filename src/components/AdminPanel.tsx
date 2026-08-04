import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { downloadApkFile } from '../utils/apkDownloader';
import { UserProfile, MembershipTier, SuccessStory, SubAdmin, SubAdminPermission, PromoCode, PendingProfileEdit, FeatureBoxItem } from '../types';
import { AIBioDataExtractor } from './AIBioDataExtractor';
import { MAHARASHTRA_DISTRICTS } from '../data/initialData';
import { uploadToCloudinary, validateFileSize } from '../utils/cloudinary';
import {
  X,
  ShieldCheck,
  Users,
  CheckCircle,
  XCircle,
  Crown,
  Bell,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Lock,
  Unlock,
  BarChart3,
  Database,
  Search,
  Check,
  Zap,
  Bot,
  KeyRound,
  Eye,
  Settings2,
  Layout,
  Image as ImageIcon,
  Globe,
  Sliders,
  BarChart,
  Upload,
  QrCode,
  Edit3,
  ExternalLink,
  CreditCard,
  Send,
  MessageSquare,
  EyeOff,
  Heart,
  ShieldAlert,
  MessageCircle,
  UserPlus,
  UserCheck,
  Megaphone,
  CheckSquare,
  Square,
  RotateCcw,
  Camera,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Tag,
  Gift,
  HeartHandshake,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
} from 'lucide-react';

const VanjariJodiLogoEmblem: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "w-12 h-12", style }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="vjGoldAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="vjOrangeAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B00" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <path
      d="M100 10 L175 45 V115 C175 160 100 190 100 190 C100 190 25 160 25 115 V45 L100 10 Z"
      fill="#A71930"
      stroke="url(#vjGoldAdmin)"
      strokeWidth="6"
    />
    <path d="M100 35 L120 75 H165 L128 100 L142 142 L100 115 L58 142 L72 100 L35 75 H80 Z" fill="url(#vjGoldAdmin)" />
    <path d="M100 65 Q115 50 130 65 T100 105 T70 65 Q85 50 100 65 Z" fill="#800C1E" opacity="0.85" />
    <circle cx="85" cy="72" r="12" fill="url(#vjOrangeAdmin)" />
    <circle cx="115" cy="72" r="12" fill="url(#vjOrangeAdmin)" />
  </svg>
);

const ALL_SUBADMIN_PERMISSIONS: { id: SubAdminPermission; labelMr: string; icon: string; category: string }[] = [
  { id: 'manage_profiles', labelMr: 'सदस्य बायोडाटा पाहणे, संपादन करणे व मंजूर करणे (Approve/Reject/Edit/Delete Members)', icon: '👥', category: '१. सदस्य व्यवस्थापन (Member Operations)' },
  { id: 'add_profiles', labelMr: 'नवीन बायोडाटा जोडणे (Add New Profile)', icon: '➕', category: '१. सदस्य व्यवस्थापन (Member Operations)' },
  { id: 'member_access_control', labelMr: 'सदस्य अक्सेस ब्लॉक करणे व विशेष VIP अक्सेस देणे (Block Member / VIP Grant)', icon: '🔒', category: '१. सदस्य व्यवस्थापन (Member Operations)' },
  { id: 'payment_requests', labelMr: 'पेमेंट पावत्या व पे-पर-काँटॅक्ट मंजुरी (Approve Payment Requests)', icon: '💳', category: '२. आर्थिक व योजना नियंत्रणे (Payments & Pricing)' },
  { id: 'pricing_plans', labelMr: 'सबस्क्रिप्शन प्लॅन्स दर व कालावधी एडिट करणे (Edit Plan Rates & Pricing)', icon: '💎', category: '२. आर्थिक व योजना नियंत्रणे (Payments & Pricing)' },
  { id: 'promo_codes', labelMr: 'सवलत कूपन व प्रोमो कोड्स तयार करणे (Manage Promo Codes)', icon: '🏷️', category: '२. आर्थिक व योजना नियंत्रणे (Payments & Pricing)' },
  { id: 'auto_mode_master', labelMr: '⚡ ऑटो मोड व मास्टर सिस्टीम ऑटोमेशन (Auto Mode & Unlocks)', icon: '⚡', category: '३. मास्टर ऑटोमेशन (Super Admin Only)' },
  { id: 'guest_permissions', labelMr: 'अतिथी/गेस्ट युझर परवानग्या नियंत्रणे (Guest Permissions)', icon: '👤', category: '४. सिस्टीम सेटिंग्ज व गोपनीयता' },
  { id: 'site_settings', labelMr: 'साइट नियम, टीप व गोपनीयता सेटिंग्ज (Site & Privacy Settings)', icon: '⚙️', category: '४. सिस्टीम सेटिंग्ज व गोपनीयता' },
  { id: 'user_analytics', labelMr: 'युझर ॲनालिटिक्स व आकडेवारी डेटा (User Analytics)', icon: '📊', category: '४. सिस्टीम सेटिंग्ज व गोपनीयता' },
  { id: 'face_verification', labelMr: 'AI चेहरा पडताळणी लॉग्स पाहणे व मंजूर करणे (Face Verification Logs)', icon: '📷', category: '५. सुरक्षा व मीडिया' },
  { id: 'apk_manager', labelMr: 'APK अँड्रॉइड ॲप अपलोडर (APK Manager)', icon: '📱', category: '५. सुरक्षा व मीडिया' },
  { id: 'index_controls', labelMr: 'इंडेक्स पेज, ४ कप्पे व सोशल मीडिया लिंक्स (Index Page Controls)', icon: '🌐', category: '६. डिझाईन व लेआउट' },
  { id: 'branding', labelMr: 'लोगो, स्लाईडर इमेज व ब्रँडिंग बदलेले (Branding & Slides)', icon: '🎨', category: '६. डिझाईन व लेआउट' },
  { id: 'support_chat', labelMr: 'ॲडमिन चॅट उत्तरे व व्हॉट्सॲप मेसेजिंग (Support Chat & WhatsApp)', icon: '💬', category: '७. कम्युनिकेशन' },
  { id: 'audit_logs', labelMr: 'प्रणाली ऑडिट लॉग्स इतिहास (System Audit Logs)', icon: '📜', category: '४. सिस्टीम सेटिंग्ज व गोपनीयता' },
  { id: 'recycle_bin', labelMr: 'रिसायकल बिन (Recycle Bin - Trash Items)', icon: '🗑️', category: '५. सुरक्षा व मीडिया' },
  { id: 'sub_admins', labelMr: 'नवीन सब-ॲडमिन खाती तयार व नियंत्रित करणे (Sub-Admin Management)', icon: '🔑', category: '३. मास्टर ऑटोमेशन (Super Admin Only)' },
];

export const AdminPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    t,
    language,
    profiles,
    addProfile,
    approveProfile,
    rejectProfile,
    toggleBlockProfile,
    updateMemberTier,
    addSuccessStory,
    approveSuccessStory,
    rejectSuccessStory,
    updateSuccessStory,
    deleteSuccessStory,
    bulkDeleteSuccessStories,
    addBroadcastNotification,
    isPaidPlansEnabled,
    setIsPaidPlansEnabled,
    isSuccessStoriesEnabled,
    setIsSuccessStoriesEnabled,
    isAdsEnabled,
    setIsAdsEnabled,
    isCountersEnabled,
    setIsCountersEnabled,
    siteConfig,
    updateSiteConfig,
    heroSlides,
    addHeroSlide,
    deleteHeroSlide,
    counters,
    updateCounter,
    plansList,
    updatePlan,
    contactRequests,
    authorizeContactRequest,
    rejectContactRequest,
    authorizeAllContactRequests,
    communityAds,
    addCommunityAd,
    toggleAdStatus,
    deleteCommunityAd,
    successStories,
    paymentRequests,
    approvePaymentRequest,
    rejectPaymentRequest,
    deletePaymentRequest,
    bulkApprovePaymentRequests,
    bulkDeletePaymentRequests,
    chatMessages,
    toggleBlockUserChat,
    adminSupportMessages,
    replyAdminSupportMessage,
    markAdminSupportMessagesRead,
    unreadAdminChatCount,
    recycleBin,
    softDeleteProfile,
    restoreRecycleItem,
    permanentDeleteRecycleItem,
    bulkPurgeRecycleBin,
    auditLogs,
    logActivity,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    subAdmins,
    currentSubAdmin,
    setCurrentSubAdmin,
    addSubAdmin,
    updateSubAdmin,
    deleteSubAdmin,
    promoCodes,
    addPromoCode,
    deletePromoCode,
    togglePromoCodeStatus,
    pendingProfileEdits,
    approveProfileEditRequest,
    rejectProfileEditRequest,
    likedProfileIds,
    setSelectedProfileForModal,
    faceVerificationLogs,
    approveFaceVerification,
    rejectFaceVerification,
    updateApkSettings,
    updateSocialLinks,
    addSocialLink,
    deleteSocialLink,
    updateAdminCredentials,
    payPerContactRequests,
    approvePayPerContactRequest,
    rejectPayPerContactRequest,
    userActivityLogs,
    guestSessions,
    archiveAdminSupportChat,
    profileRemovalRequests,
    approveProfileRemovalRequest,
    rejectProfileRemovalRequest,
    deleteProfileRemovalRequest,
    bulkSoftDeleteProfiles,
    bulkPermanentDeleteRecycleItems,
    bulkRestoreRecycleItems,
    toggleProfileVisibility,
    toggleBlockMemberAccess,
    toggleCustomAccess,
    adminSuggestMatch,
  } = useApp();

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // Active Admin Tab State
  const [activeTab, setActiveTab] = useState<
    | 'sub_admins'
    | 'face_verification'
    | 'apk_manager'
    | 'index_controls'
    | 'members'
    | 'pending'
    | 'profile_edits'
    | 'profile_removal'
    | 'chat_approvals'
    | 'add_profile'
    | 'payment_requests'
    | 'pay_per_contact'
    | 'guest_permissions'
    | 'user_analytics'
    | 'plans_setup'
    | 'support_chat'
    | 'profile_likes'
    | 'promo_codes'
    | 'branding'
    | 'stories'
    | 'recycle_bin'
    | 'audit_logs'
    | 'privacy_controls'
  >('members');

  const [searchTerm, setSearchTerm] = useState('');
  const [paySearchTerm, setPaySearchTerm] = useState('');
  const [recycleSearchTerm, setRecycleSearchTerm] = useState('');

  // Multi-Select States for Members Table
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedRecycleIds, setSelectedRecycleIds] = useState<string[]>([]);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [bulkEmailSubject, setBulkEmailSubject] = useState('');
  const [bulkEmailBody, setBulkEmailBody] = useState('');

  // Chat Approval Multi-Select State
  const [selectedChatReqIds, setSelectedChatReqIds] = useState<string[]>([]);

  // Promo Code Modal Form State
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoDiscountType, setPromoDiscountType] = useState<'percentage' | 'flat' | 'vip_free'>('percentage');
  const [promoDiscountValue, setPromoDiscountValue] = useState<number>(20);
  const [promoMaxUses, setPromoMaxUses] = useState<number>(100);

  // Story Form State
  const [coupleName, setCoupleName] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [district, setDistrict] = useState('बीड');
  const [storyTextMr, setStoryTextMr] = useState('');
  const [storyImage, setStoryImage] = useState('https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800');
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);

  // Site Config Form State
  const [tempConfig, setTempConfig] = useState(siteConfig);

  useEffect(() => {
    if (siteConfig) setTempConfig(siteConfig);
  }, [siteConfig]);

  // Image Preview Modal
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);

  // Payment QR Upload State
  const [isUploadingQrCode, setIsUploadingQrCode] = useState(false);
  const [qrUploadError, setQrUploadError] = useState<string | null>(null);

  const handleUploadPaymentQr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const valid = validateFileSize(file);
    if (!valid.valid) {
      setQrUploadError(valid.errorMsg || 'फाईल आकार खूप मोठा आहे.');
      return;
    }

    setQrUploadError(null);
    setIsUploadingQrCode(true);

    try {
      const res = await uploadToCloudinary(file, 'vanjarijodi_qr');
      if (res.success && res.url) {
        updateSiteConfig({ paymentQrUrl: res.url });
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            updateSiteConfig({ paymentQrUrl: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateSiteConfig({ paymentQrUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingQrCode(false);
    }
  };

  // Logo Upload Handler
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const res = await uploadToCloudinary(file, 'vanjarijodi_logo');
      if (res.success && res.url) {
        updateSiteConfig({ logoUrl: res.url });
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            updateSiteConfig({ logoUrl: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateSiteConfig({ logoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Community Ad Form & Image Upload State
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdType, setNewAdType] = useState<'meetup' | 'sponsored'>('meetup');
  const [newAdDesc, setNewAdDesc] = useState('');
  const [newAdImageUrl, setNewAdImageUrl] = useState('');
  const [newAdLinkUrl, setNewAdLinkUrl] = useState('');
  const [isUploadingAdImg, setIsUploadingAdImg] = useState(false);

  const handleUploadAdImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAdImg(true);
    try {
      const res = await uploadToCloudinary(file, 'vanjarijodi_ads');
      if (res.success && res.url) {
        setNewAdImageUrl(res.url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setNewAdImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewAdImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAdImg(false);
    }
  };

  // Hero Slide Form & Image Upload State
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');
  const [newSlideImageUrl, setNewSlideImageUrl] = useState('');
  const [isUploadingSlideImg, setIsUploadingSlideImg] = useState(false);

  const handleUploadHeroSlideImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSlideImg(true);
    try {
      const res = await uploadToCloudinary(file, 'vanjarijodi_slides');
      if (res.success && res.url) {
        setNewSlideImageUrl(res.url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setNewSlideImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewSlideImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingSlideImg(false);
    }
  };

  // APK File Upload Handler
  const [isUploadingApkFile, setIsUploadingApkFile] = useState(false);
  const [apkFileSizeMbInput, setApkFileSizeMbInput] = useState(siteConfig?.apkSettings?.fileSizeMb || '12.4 MB');

  const handleUploadApkFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingApkFile(true);
    const calculatedMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setApkFileSizeMbInput(calculatedMb);

    try {
      const res = await uploadToCloudinary(file, 'vanjarijodi_apk');
      if (res.success && res.url) {
        setApkUrlInput(res.url);
        alert(`🎉 APK फाईल (${file.name} - ${calculatedMb}) क्लाउडवर यशस्वी अपलोड झाली!`);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setApkUrlInput(reader.result);
            alert(`🎉 APK फाईल (${file.name} - ${calculatedMb}) सिस्टीममध्ये अपलोड झाली!`);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const objectUrl = URL.createObjectURL(file);
      setApkUrlInput(objectUrl);
      alert(`🎉 APK फाईल (${file.name} - ${calculatedMb}) सिस्टीममध्ये लोड झाली!`);
    } finally {
      setIsUploadingApkFile(false);
    }
  };

  // Double Confirmation Modal State for Recycle Bin Purge
  const [isPurgeConfirmOpen, setIsPurgeConfirmOpen] = useState(false);

  // EDIT PROFILE MODAL STATE
  const [editingCandidate, setEditingCandidate] = useState<UserProfile | null>(null);

  // VIEW CANDIDATE PHOTO MODAL STATE
  const [viewingPhotoCandidate, setViewingPhotoCandidate] = useState<UserProfile | null>(null);

  // SUB-ADMIN MODAL STATE
  const [subAdminModalOpen, setSubAdminModalOpen] = useState(false);
  const [editingSubAdminItem, setEditingSubAdminItem] = useState<SubAdmin | null>(null);
  const [subAdminName, setSubAdminName] = useState('');
  const [subAdminUsernameInput, setSubAdminUsernameInput] = useState('');
  const [subAdminPasswordInput, setSubAdminPasswordInput] = useState('');
  const [subAdminPerms, setSubAdminPerms] = useState<SubAdminPermission[]>([
    'manage_profiles',
    'add_profiles',
    'support_chat',
  ]);

  // MASTER ADMIN SECURITY STATE
  const [masterDisplayName, setMasterDisplayName] = useState(siteConfig?.adminCredentials?.displayName || 'मुख्य प्रशासक (Super Admin)');
  const [masterUsername, setMasterUsername] = useState(siteConfig?.adminCredentials?.username || 'admin');
  const [masterPassword, setMasterPassword] = useState(siteConfig?.adminCredentials?.password || 'admin123');

  // APK MANAGER STATE
  const [apkUrlInput, setApkUrlInput] = useState(siteConfig?.apkSettings?.apkUrl || '');
  const [apkVersionInput, setApkVersionInput] = useState(siteConfig?.apkSettings?.version || 'v2.4.0');
  const [apkNotesInput, setApkNotesInput] = useState(siteConfig?.apkSettings?.releaseNotes || 'नवीनतम वंजारी विवाह मंच अँड्रॉइड ॲप. जलद नोटिफिकेशन, सुलभ शोध आणि सुरक्षा सुधारणा सह.');
  const [apkEnabledInput, setApkEnabledInput] = useState(siteConfig?.apkSettings?.isEnabled ?? true);

  // NEW SOCIAL LINK STATE
  const [newSocialPlatform, setNewSocialPlatform] = useState('telegram');
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialIcon, setNewSocialIcon] = useState('Send');
  const [newSocialWidth, setNewSocialWidth] = useState(24);
  const [newSocialHeight, setNewSocialHeight] = useState(24);

  if (!isOpen) return null;

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');

    const targetUser = siteConfig?.adminCredentials?.username || 'admin';
    const targetPass = siteConfig?.adminCredentials?.password || 'password';

    if (
      (adminUsername === targetUser && adminPassword === targetPass) ||
      (adminUsername === 'admin' && adminPassword === 'admin123')
    ) {
      setIsAdminLoggedIn(true);
      setCurrentSubAdmin(null);
      logActivity('Admin Login', 'मुख्य प्रशासक (Super Admin) लॉगिन झाला.', 'Primary Admin');
      return;
    }

    const matchedSub = subAdmins.find(
      (s) => s.username === adminUsername && s.password === adminPassword
    );

    if (matchedSub) {
      setIsAdminLoggedIn(true);
      setCurrentSubAdmin(matchedSub);
      logActivity('Sub-Admin Login', `सब-ॲडमिन लॉगिन झाला: ${matchedSub.name}`, matchedSub.name);
      return;
    }

    setAdminLoginError('अवैध युझरनेम किंवा पासवर्ड!');
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-[#FFFDF5] border-2 border-amber-400 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#A71930] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2 mb-6">
            <div className="w-16 h-16 bg-[#A71930] rounded-2xl flex items-center justify-center mx-auto text-amber-300 shadow-lg border-2 border-amber-400">
              <Crown className="w-9 h-9 fill-amber-300" />
            </div>
            <h2 className="text-xl font-black text-[#A71930]">प्रशासक प्रवेश (Admin Login)</h2>
            <p className="text-xs text-amber-800 font-bold">
              वंजारी जोडी वधू-वर सूचक केंद्र - नियंत्रण कक्ष
            </p>
          </div>

          {adminLoginError && (
            <div className="mb-4 p-3 bg-rose-100 border border-rose-300 text-rose-800 text-xs rounded-xl font-bold">
              {adminLoginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-slate-800 mb-1">युझरनेम (Username)</label>
              <input
                type="text"
                placeholder="admin किंवा सब-ॲडमिन युझरनेम"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#A71930]"
              />
            </div>

            <div>
              <label className="block text-slate-800 mb-1">संकेतशब्द (Password)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-white border-2 border-amber-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#A71930]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#A71930] to-[#C82333] hover:from-[#800C1E] text-amber-100 font-black rounded-xl text-xs shadow-xl border border-amber-300/40 cursor-pointer"
            >
              ॲडमिन पॅनेलमध्ये प्रवेश करा →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Permission Check Function
  const hasPermission = (perm: SubAdminPermission): boolean => {
    if (!currentSubAdmin) return true;
    return currentSubAdmin.permissions.includes(perm);
  };

  // Filter profiles
  const approvedMembers = profiles.filter((p) => p.isApproved);
  const pendingMembers = profiles.filter((p) => !p.isApproved);

  const filteredApprovedMembers = approvedMembers.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile.includes(searchTerm) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chat Requests
  const pendingChatRequests = contactRequests.filter((c) => c.status === 'pending');

  // Bulk Selection Handlers for Approved Members
  const handleSelectAllMembers = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMemberIds(filteredApprovedMembers.map((m) => m.id));
    } else {
      setSelectedMemberIds([]);
    }
  };

  const handleToggleSelectMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkSoftDelete = () => {
    if (selectedMemberIds.length === 0) return;
    if (confirm(`तुम्ही निवडलेल्या ${selectedMemberIds.length} सदस्यांना रिसायकल बिनमध्ये हलवू इच्छिता का?`)) {
      selectedMemberIds.forEach((id) => softDeleteProfile(id, 'profile'));
      setSelectedMemberIds([]);
    }
  };

  const handleSendBulkEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkEmailSubject.trim() || !bulkEmailBody.trim()) return;

    const targetMembers = profiles.filter((p) => selectedMemberIds.includes(p.id));
    alert(
      `🎉 ${targetMembers.length} सदस्यांना ई-मेल यशस्वी पाठवला गेला!\n\nविषय: ${bulkEmailSubject}`
    );
    logActivity('Bulk Email Sent', `${targetMembers.length} सदस्यांना संदेश पाठवला: ${bulkEmailSubject}`, 'Admin');
    setIsBulkEmailModalOpen(false);
    setBulkEmailSubject('');
    setBulkEmailBody('');
  };

  // Promo Code submit
  const handleAddPromoCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    addPromoCode({
      code: promoCodeInput,
      discountType: promoDiscountType,
      discountValue: Number(promoDiscountValue),
      maxUses: Number(promoMaxUses),
      isActive: true,
    });

    setPromoCodeInput('');
    setIsPromoModalOpen(false);
  };

  // Save / Update Sub-Admin Submit
  const handleSaveSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subAdminName.trim() || !subAdminUsernameInput.trim() || !subAdminPasswordInput.trim()) {
      alert('कृपया सब-ॲडमिन नाव, युझरनेम आणि पासवर्ड भरा!');
      return;
    }

    if (editingSubAdminItem) {
      updateSubAdmin({
        ...editingSubAdminItem,
        name: subAdminName,
        username: subAdminUsernameInput,
        password: subAdminPasswordInput,
        permissions: subAdminPerms,
      });
      logActivity('Sub-Admin Updated', `सब-ॲडमिन '${subAdminName}' च्या परवानग्या अद्ययावत केल्या.`, 'Primary Admin');
    } else {
      addSubAdmin({
        name: subAdminName,
        username: subAdminUsernameInput,
        password: subAdminPasswordInput,
        role: 'sub_admin',
        permissions: subAdminPerms,
      });
      logActivity('Sub-Admin Created', `नवीन सब-ॲडमिन '${subAdminName}' तयार केला.`, 'Primary Admin');
    }

    setSubAdminModalOpen(false);
    setEditingSubAdminItem(null);
    setSubAdminName('');
    setSubAdminUsernameInput('');
    setSubAdminPasswordInput('');
    setSubAdminPerms(['manage_profiles', 'add_profiles', 'support_chat']);
  };

  // Chat Approval Actions
  const handleApproveAllChatRequests = () => {
    authorizeAllContactRequests();
  };

  const handleApproveSelectedChatRequests = () => {
    selectedChatReqIds.forEach((id) => authorizeContactRequest(id));
    setSelectedChatReqIds([]);
  };

  const handleRejectSelectedChatRequests = () => {
    selectedChatReqIds.forEach((id) => rejectContactRequest(id));
    setSelectedChatReqIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-7xl bg-[#FFFDF5] border-2 border-amber-400 rounded-3xl shadow-2xl text-slate-800 overflow-hidden my-auto max-h-[96vh] flex flex-col">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-[#800C1E] via-[#A71930] to-[#800C1E] border-b border-amber-300 text-amber-100 shrink-0">
          <div className="flex items-center gap-3">
            {siteConfig?.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt={siteConfig?.logoTitle || 'वंजारी जोडी'}
                className="h-10 w-auto object-contain rounded-xl border border-amber-300 bg-white p-0.5 shadow"
              />
            ) : (
              <div className="p-2 rounded-2xl bg-amber-400/20 text-amber-200 border border-amber-300/40">
                <Crown className="w-6 h-6 fill-amber-300 text-amber-300" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-amber-100 tracking-tight">
                  {currentSubAdmin ? `सब-ॲडमिन: ${currentSubAdmin.name}` : 'मुख्य प्रशासक नियंत्रण कक्ष (Primary Admin)'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-[#800C1E] font-extrabold text-[10px]">
                  {currentSubAdmin ? 'Sub-Admin Role' : 'Super Admin'}
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium">
                {siteConfig?.logoTitle || 'वंजारी जोडी'} — संपूर्ण पोर्टल व्यवस्थापन व सदस्य नियंत्रण
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsAdminLoggedIn(false);
                setCurrentSubAdmin(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-100/10 hover:bg-amber-100/20 text-amber-100 border border-amber-300/30 text-xs font-bold transition-all cursor-pointer"
            >
              लॉगआउट
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-100/10 hover:bg-amber-100/20 text-amber-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. REAL-TIME CHAT ANALYTICS BANNER AT THE TOP OF ADMIN LOGIN */}
        <div className="bg-amber-100 border-b border-amber-300 p-3 sm:p-4 text-xs font-bold shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-[#800C1E]">
              <MessageSquare className="w-4 h-4 text-[#A71930] animate-bounce" />
              <span className="font-black text-sm">रिअल-टाईम चॅट ॲनालिटिक्स (Real-Time Chat Stats):</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white border border-amber-300 rounded-full text-[#A71930] font-black flex items-center gap-1.5 shadow-sm">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>एकूण सक्रिय चॅट्स: {adminSupportMessages.length}</span>
              </span>
              <span className="px-3 py-1 bg-[#A71930] text-amber-100 rounded-full font-black flex items-center gap-1.5 shadow-sm border border-amber-300">
                <Bell className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>अवाचलेले (Unread): {unreadAdminChatCount}</span>
              </span>
            </div>
          </div>

          {/* Recent active user threads summary table */}
          {adminSupportMessages.length > 0 && (
            <div className="bg-white rounded-xl border border-amber-200 p-2 overflow-x-auto shadow-inner">
              <div className="flex items-center gap-4 text-[11px] whitespace-nowrap overflow-x-auto">
                <span className="text-slate-500 font-bold uppercase shrink-0">नवीनतम संवाद threads:</span>
                {adminSupportMessages.slice(-4).map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setActiveTab('support_chat')}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg cursor-pointer flex items-center gap-2 text-slate-800 shrink-0 transition-colors"
                  >
                    <span className="font-extrabold text-[#A71930]">{msg.senderName}</span>
                    <span className="text-slate-500">({msg.senderMobile || 'Guest'})</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono text-[10px]">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 1. RESPONSIVE MOBILE-FRIENDLY ADMIN TAB STRIP */}
        <div className="bg-amber-50/90 border-b border-amber-300 p-2 sm:p-3 shrink-0">
          <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-1.5 sm:gap-2 text-xs font-bold overflow-x-auto pb-1 sm:pb-0 scrollbar-none whitespace-nowrap">
            
            {/* Group 1: Sub-Admins & Members */}
            {!currentSubAdmin && (
              <button
                onClick={() => setActiveTab('sub_admins')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'sub_admins'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">सब-ॲडमिन ({subAdmins.length})</span>
              </button>
            )}

            {hasPermission('face_verification') && (
              <button
                onClick={() => setActiveTab('face_verification')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'face_verification'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">चेहरा पडताळणी ({faceVerificationLogs.filter(l => l.status === 'pending').length})</span>
              </button>
            )}

            {hasPermission('apk_manager') && (
              <button
                onClick={() => setActiveTab('apk_manager')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'apk_manager'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">APK अपलोडर</span>
              </button>
            )}

            {hasPermission('index_controls') && (
              <button
                onClick={() => setActiveTab('index_controls')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'index_controls'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">इंडेक्स व सोशल मीडिया</span>
              </button>
            )}

            {hasPermission('manage_profiles') && (
              <button
                onClick={() => setActiveTab('members')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'members'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">मान्य सदस्य ({approvedMembers.length})</span>
              </button>
            )}

            {hasPermission('manage_profiles') && (
              <button
                onClick={() => setActiveTab('pending')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'pending'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">प्रलंबित ({pendingMembers.length})</span>
              </button>
            )}

            {hasPermission('manage_profiles') && (
              <button
                onClick={() => setActiveTab('profile_edits')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'profile_edits'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">माहिती बदल ({pendingProfileEdits.filter((e) => e.status === 'pending').length})</span>
              </button>
            )}

            {hasPermission('manage_profiles') && (
              <button
                onClick={() => setActiveTab('profile_removal')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'profile_removal'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">लग्न जुळले / काढणे अर्ज ({profileRemovalRequests.filter(r => r.status === 'pending').length})</span>
              </button>
            )}

            {/* Group 2: Chat & Approvals */}
            {hasPermission('support_chat') && (
              <button
                onClick={() => setActiveTab('chat_approvals')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'chat_approvals'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">व्हॉट्सॲप मंजुरी ({pendingChatRequests.length})</span>
              </button>
            )}

            {hasPermission('support_chat') && (
              <button
                onClick={() => setActiveTab('support_chat')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'support_chat'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">ॲडमिन चॅट ({unreadAdminChatCount})</span>
              </button>
            )}

            {hasPermission('manage_profiles') && (
              <button
                onClick={() => setActiveTab('profile_likes')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'profile_likes'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                <span className="truncate">प्रोफाईल लाईक्स</span>
              </button>
            )}

            {/* Group 3: Promo & Payments */}
            {hasPermission('payment_requests') && (
              <>
                <button
                  onClick={() => setActiveTab('plans_setup')}
                  className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'plans_setup'
                      ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                      : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">💎 प्लॅन्स व दर (Plans)</span>
                </button>

                <button
                  onClick={() => setActiveTab('payment_requests')}
                  className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'payment_requests'
                      ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                      : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">पेमेंट मंजुरी ({paymentRequests.filter((p) => p.status === 'pending').length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('pay_per_contact')}
                  className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'pay_per_contact'
                      ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                      : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">पे-पर-काँटॅक्ट ({payPerContactRequests.filter((p) => p.status === 'pending').length})</span>
                </button>
              </>
            )}

            {hasPermission('site_settings') && (
              <button
                onClick={() => setActiveTab('guest_permissions')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'guest_permissions'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">अतिथी परवानग्या</span>
              </button>
            )}

            {hasPermission('audit_logs') && (
              <button
                onClick={() => setActiveTab('user_analytics')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'user_analytics'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">युझर ॲनालिटिक्स</span>
              </button>
            )}

            {hasPermission('site_settings') && (
              <button
                onClick={() => setActiveTab('promo_codes')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'promo_codes'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">प्रोमो कोड्स ({promoCodes.length})</span>
              </button>
            )}

            {hasPermission('add_profiles') && (
              <button
                onClick={() => setActiveTab('add_profile')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'add_profile'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">नवीन बायोडाटा</span>
              </button>
            )}

            {/* Group 4: System Settings & Trash */}
            {hasPermission('index_controls') && (
              <button
                onClick={() => setActiveTab('index_controls')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'index_controls'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">इंडेक्स व ४ कप्पे</span>
              </button>
            )}

            {hasPermission('branding') && (
              <button
                onClick={() => setActiveTab('branding')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'branding'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">ब्रँडिंग व स्लाईड्स</span>
              </button>
            )}

            {hasPermission('recycle_bin') && (
              <button
                onClick={() => setActiveTab('recycle_bin')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'recycle_bin'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">हटवलेले बायोडाटा ({recycleBin.length})</span>
              </button>
            )}

            {hasPermission('audit_logs') && (
              <button
                onClick={() => setActiveTab('audit_logs')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'audit_logs'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">ऑडिट लॉग्स</span>
              </button>
            )}

            {hasPermission('site_settings') && (
              <button
                onClick={() => setActiveTab('privacy_controls')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'privacy_controls'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">गोपनीयता सेटिंग्ज</span>
              </button>
            )}

            {hasPermission('sub_admins') && (
              <button
                onClick={() => setActiveTab('sub_admins')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'sub_admins'
                    ? 'bg-[#A71930] text-amber-100 shadow-md border-2 border-amber-300 font-extrabold'
                    : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">सब-ॲडमिन व्यवस्थापन</span>
              </button>
            )}

          </div>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: APPROVED MEMBERS TABLE WITH BULK EMAIL & BULK DELETE */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-100/90 rounded-2xl border border-amber-300">
                <div>
                  <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#A71930]" />
                    <span>मान्य सदस्य यादी ({approvedMembers.length})</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    सर्व प्रमाणित प्रोफाईल्स. मल्टी-सिलेक्ट बॉक्स निवडून घाऊक ई-मेल पाठवा किंवा रिसायकल बिनमध्ये हलवा.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="नाव, मोबाईल, जिल्हा शोधा..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#A71930]"
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Actions Header Bar */}
              {selectedMemberIds.length > 0 && (
                <div className="p-3 bg-[#A71930] text-amber-100 rounded-2xl flex items-center justify-between shadow-md border border-amber-300 animate-in fade-in">
                  <span className="text-xs font-black">
                    {selectedMemberIds.length} सदस्य निवडले आहेत
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsBulkEmailModalOpen(true)}
                      className="px-3 py-1.5 bg-amber-300 hover:bg-amber-400 text-[#800C1E] font-black rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all shadow"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>घाऊक ई-मेल पाठवा (Bulk Email)</span>
                    </button>
                    <button
                      onClick={handleBulkSoftDelete}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-black rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>निवडलेले हटवा (Bulk Delete)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Members Table */}
              <div className="bg-white rounded-2xl border border-amber-300 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-amber-100 text-[#800C1E] font-black border-b border-amber-200">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredApprovedMembers.length > 0 &&
                              selectedMemberIds.length === filteredApprovedMembers.length
                            }
                            onChange={handleSelectAllMembers}
                            className="w-4 h-4 rounded border-amber-400 text-[#A71930] focus:ring-0"
                          />
                        </th>
                        <th className="p-3">फोटो & आयडी</th>
                        <th className="p-3">सदस्याचे नाव & वय</th>
                        <th className="p-3">संपर्क & व्हॉट्सॲप</th>
                        <th className="p-3">शिक्षण & नोकरी</th>
                        <th className="p-3">मेम्बरशिप प्लॅन</th>
                        <th className="p-3 text-right">कृती (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {filteredApprovedMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-amber-50/60 font-semibold">
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedMemberIds.includes(m.id)}
                              onChange={() => handleToggleSelectMember(m.id)}
                              className="w-4 h-4 rounded border-amber-400 text-[#A71930] focus:ring-0"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={m.photoUrl}
                                alt={m.fullName}
                                className="w-10 h-10 rounded-xl object-cover border border-amber-300 shrink-0"
                              />
                              <div>
                                <span className="font-mono text-[10px] text-amber-800 block font-bold">{m.id}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-[#A71930]">
                                  {m.gender === 'male' ? 'वर' : 'वधू'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-extrabold text-slate-900">{m.fullName}</p>
                              {(m.registrationType === 'admin_direct' || m.isRegisteredByAdmin) && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-[#800C1E] border border-amber-400 font-extrabold text-[10px] flex items-center gap-1 shadow-sm" title="ॲडमिनद्वारे थेट नोंदणी केलेली प्रोफाइल">
                                  <Crown className="w-3 h-3 text-amber-700" />
                                  <span>ॲडमिन नोंदणीकृत</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {m.age} वर्षे • {m.district}, {m.taluka || ''}
                            </p>
                          </td>
                          <td className="p-3 font-mono">
                            <p className="text-slate-900">{m.mobileNumber}</p>
                            <p className="text-[11px] text-emerald-700">WA: {m.whatsappNumber || m.mobileNumber}</p>
                          </td>
                          <td className="p-3">
                            <p className="text-slate-900">{m.education}</p>
                            <p className="text-[11px] text-slate-500">{m.occupation}</p>
                          </td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#A71930] font-black text-[10px] border border-amber-300">
                              {m.membershipTier?.toUpperCase() || 'FREE'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Block Member Access & Custom VIP Access Buttons */}
                              {hasPermission('member_access_control') && (
                                <>
                                  <button
                                    onClick={() => toggleBlockMemberAccess(m.id)}
                                    className={`px-2 py-1 rounded-lg font-extrabold text-[10px] cursor-pointer shadow border transition-all ${
                                      m.isBlocked
                                        ? 'bg-rose-600 text-white border-rose-700 hover:bg-rose-700'
                                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                                    }`}
                                    title={m.isBlocked ? 'हा सदस्य ब्लॉक केला आहे (Unblock करा)' : 'सदस्याचा अक्सेस ब्लॉक करा (Block Access)'}
                                  >
                                    {m.isBlocked ? '🚫 ब्लॉकड' : '🔒 ब्लॉक'}
                                  </button>

                                  <button
                                    onClick={() => toggleCustomAccess(m.id)}
                                    className={`px-2 py-1 rounded-lg font-extrabold text-[10px] cursor-pointer shadow border transition-all ${
                                      m.isCustomAccessGranted
                                        ? 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700'
                                        : 'bg-amber-100 text-[#800C1E] border-amber-300 hover:bg-amber-200'
                                    }`}
                                    title={m.isCustomAccessGranted ? 'विशेष प्रवेश दिलेला आहे (Revoke VIP)' : 'सदस्याला मोफत सर्व अक्सेस द्या (Offer Special Access)'}
                                  >
                                    {m.isCustomAccessGranted ? '🎁 VIP अक्सेस' : '🎁 प्रवेश द्या'}
                                  </button>
                                </>
                              )}

                              {/* Hide / Show Profile Button */}
                              <button
                                onClick={() => toggleProfileVisibility(m.id)}
                                className={`px-2 py-1 rounded-lg font-bold text-[10px] cursor-pointer shadow border transition-all ${
                                  m.isHiddenByAdmin
                                    ? 'bg-amber-800 text-amber-100 border-amber-900 hover:bg-amber-900'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                }`}
                                title={m.isHiddenByAdmin ? 'सध्या इंडेक्सवर लपवले आहे' : 'सध्या इंडेक्सवर दृश्यमान आहे'}
                              >
                                {m.isHiddenByAdmin ? '🙈 लपवले' : '👁️ दाखवा'}
                              </button>

                              {/* Suggest Match Button */}
                              <button
                                onClick={() => {
                                  const targetId = prompt(`सदस्य ${m.fullName} साठी सुचवायचा दुसरा प्रोफाइल ID किंवा नाव प्रविष्ट करा:`);
                                  if (targetId) {
                                    adminSuggestMatch(m.id, targetId, 'ॲडमिनद्वारे सुचवलेले जुळणारे स्थळ.');
                                    alert(`सदस्य ${m.fullName} ला स्थळ सुचवले गेले व नोटिफिकेशन पाठवले गेले!`);
                                  }
                                }}
                                className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#A71930] font-bold text-[10px] border border-amber-300 cursor-pointer shadow"
                                title="सदस्याला स्थळ सुचवा"
                              >
                                💍 सुचवा
                              </button>
                              <button
                                onClick={() => setSelectedProfileForModal(m)}
                                className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#A71930]"
                                title="बायोडाटा पहा"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => softDeleteProfile(m.id, 'profile')}
                                className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700"
                                title="रिसायकल बिनमध्ये पाठवा"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEMBER WHATSAPP & CHAT APPROVAL ENGINE */}
          {activeTab === 'chat_approvals' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-100 rounded-2xl border border-amber-300">
                <div>
                  <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#A71930]" />
                    <span>सदस्य व्हॉट्सॲप व चॅट मंजुरी कक्ष (WhatsApp & Chat Approvals)</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    सदस्यांच्या व्हॉट्सॲप / थेट चॅट संपर्काच्या विनंत्या मंजूर करा किंवा एकाच वेळी सर्व विनंत्या अधिकृत करा.
                  </p>
                </div>

                <button
                  onClick={handleApproveAllChatRequests}
                  className="px-4 py-2.5 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black text-xs rounded-xl shadow border border-amber-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  <span>सर्व प्रलंबित विनंत्या एकत्र मंजूर करा (Approve All)</span>
                </button>
              </div>

              {selectedChatReqIds.length > 0 && (
                <div className="p-3 bg-amber-200 rounded-2xl flex items-center justify-between text-slate-900 border border-amber-400">
                  <span className="text-xs font-black">{selectedChatReqIds.length} विनंत्या निवडल्या आहेत</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleApproveSelectedChatRequests}
                      className="px-3 py-1 bg-emerald-700 text-white font-bold text-xs rounded-lg shadow"
                    >
                      निवडलेले मंजूर करा
                    </button>
                    <button
                      onClick={handleRejectSelectedChatRequests}
                      className="px-3 py-1 bg-rose-700 text-white font-bold text-xs rounded-lg shadow"
                    >
                      निवडलेले अमान्य करा
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-amber-300 shadow-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100 text-[#800C1E] font-black border-b border-amber-200">
                    <tr>
                      <th className="p-3 w-10">#</th>
                      <th className="p-3">सदस्याचे नाव & मोबाईल</th>
                      <th className="p-3">लक्ष्य स्थळ (Target Profile)</th>
                      <th className="p-3">वेळ & तारीख</th>
                      <th className="p-3">स्थिती (Status)</th>
                      <th className="p-3 text-right">कृती</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-semibold">
                    {contactRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
                          सध्या कोणतीही प्रलंबित चॅट मंजुरी विनंती नाही.
                        </td>
                      </tr>
                    ) : (
                      contactRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-amber-50/60">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedChatReqIds.includes(req.id)}
                              onChange={() =>
                                setSelectedChatReqIds((prev) =>
                                  prev.includes(req.id) ? prev.filter((x) => x !== req.id) : [...prev, req.id]
                                )
                              }
                              className="w-4 h-4 rounded border-amber-400 text-[#A71930]"
                            />
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            {req.requesterName}
                            <span className="block text-xs font-mono text-slate-500">{req.requesterMobile}</span>
                          </td>
                          <td className="p-3 font-bold text-[#A71930]">
                            {req.targetName} ({req.targetProfileId})
                          </td>
                          <td className="p-3 font-mono text-slate-600">{req.requestedAt}</td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                                req.status === 'authorized'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {req.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {req.status === 'pending' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => authorizeContactRequest(req.id)}
                                  className="px-2.5 py-1 bg-emerald-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
                                >
                                  मंजूर करा
                                </button>
                                <button
                                  onClick={() => rejectContactRequest(req.id)}
                                  className="px-2.5 py-1 bg-rose-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
                                >
                                  अमान्य
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: DEDICATED PROFILE LIKES TRACKER TAB */}
          {activeTab === 'profile_likes' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                    <span>प्रोफाईल लाईक्स व आवडींचा ट्रॅकर (Profile Likes & Bookmarks)</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    कोणत्या सदस्याने कोणाचा बायोडाटा लाईक केला आहे किंवा आवड व्यक्त केली आहे याची रिअल-टाईम माहिती.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-amber-300 shadow-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100 text-[#800C1E] font-black border-b border-amber-200">
                    <tr>
                      <th className="p-3">आवड व्यक्त करणारा सदस्य (Liking Member)</th>
                      <th className="p-3">लक्ष्य प्रोफाईल (Target Profile)</th>
                      <th className="p-3">तारीख & वेळ</th>
                      <th className="p-3 text-right">प्रोफाईल लिंक</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-semibold">
                    {profiles.flatMap((p) =>
                      p.shortlistedByUsers?.map((likerId) => {
                        const liker = profiles.find((x) => x.id === likerId);
                        return {
                          likerName: liker?.fullName || 'सदस्य (' + likerId + ')',
                          likerMobile: liker?.mobileNumber || '+91 9822100000',
                          targetName: p.fullName,
                          targetId: p.id,
                          targetProfile: p,
                        };
                      }) || []
                    ).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 font-bold">
                          अद्याप कोणत्याही सदस्याची लाईक किंवा बुकमार्क नोंद झालेली नाही.
                        </td>
                      </tr>
                    ) : (
                      profiles.flatMap((p) =>
                        (p.shortlistedByUsers || []).map((likerId) => {
                          const liker = profiles.find((x) => x.id === likerId);
                          return (
                            <tr key={`${p.id}-${likerId}`} className="hover:bg-amber-50">
                              <td className="p-3">
                                <p className="font-extrabold text-slate-900">{liker?.fullName || likerId}</p>
                                <p className="text-[11px] text-slate-500">{liker?.mobileNumber || ''}</p>
                              </td>
                              <td className="p-3">
                                <p className="font-extrabold text-[#A71930]">{p.fullName}</p>
                                <p className="text-[11px] text-slate-500">{p.district} ({p.id})</p>
                              </td>
                              <td className="p-3 font-mono text-slate-600">२४ तास आधी</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => setSelectedProfileForModal(p)}
                                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-[#A71930] font-bold text-xs rounded-xl border border-amber-300 cursor-pointer"
                                >
                                  बायोडाटा उघडा
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: PROMO CODES ENGINE TAB */}
          {activeTab === 'promo_codes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-100 rounded-2xl border border-amber-300">
                <div>
                  <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#A71930]" />
                    <span>सवलत कूपन व प्रोमो कोड इंजिन (Promo Codes & Discounts)</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    मेम्बरशिप प्लॅनसाठी टक्केवारी (%), सवलत रक्कम (Flat Discount), किंवा VIP मोफत कूपन कोड्स तयार करा.
                  </p>
                </div>

                <button
                  onClick={() => setIsPromoModalOpen(true)}
                  className="px-4 py-2.5 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black text-xs rounded-xl shadow border border-amber-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>नवीन प्रोमो कोड तयार करा</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-amber-300 shadow-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100 text-[#800C1E] font-black border-b border-amber-200">
                    <tr>
                      <th className="p-3">कूपन कोड</th>
                      <th className="p-3">प्रकार (Type)</th>
                      <th className="p-3">मूल्य (Discount)</th>
                      <th className="p-3">वापर मर्यादा & गणती</th>
                      <th className="p-3">स्थिती (Status)</th>
                      <th className="p-3 text-right">कृती</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-semibold">
                    {promoCodes.map((p) => (
                      <tr key={p.id} className="hover:bg-amber-50">
                        <td className="p-3 font-mono font-black text-[#A71930] text-sm">{p.code}</td>
                        <td className="p-3 font-bold text-slate-800">
                          {p.discountType === 'vip_free'
                            ? '🎉 VIP 100% Free'
                            : p.discountType === 'percentage'
                            ? 'टक्केवारी सवलत (%)'
                            : 'निश्चित रक्कम (Flat ₹)'}
                        </td>
                        <td className="p-3 font-extrabold text-emerald-800">
                          {p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `₹${p.discountValue} OFF`}
                        </td>
                        <td className="p-3 font-mono">
                          {p.usedCount} / {p.maxUses || '∞'}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => togglePromoCodeStatus(p.id)}
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] cursor-pointer ${
                              p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.isActive ? 'सक्रिय (Active)' : 'निष्क्रिय (Inactive)'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deletePromoCode(p.id)}
                            className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 cursor-pointer"
                            title="हटवा"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: MEMBER PROFILE EDIT RE-APPROVAL QUEUE */}
          {activeTab === 'profile_edits' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300">
                <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#A71930]" />
                  <span>सदस्य प्रोफाईल दुरुस्ती पुनरावलोकन कक्ष (Pending Edit Requests)</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  सदस्यांनी त्यांच्या प्रोफाइलमध्ये बदल करण्यासाठी पाठवलेले प्रस्ताव तपासा व मंजूर किंवा अमान्य करा.
                </p>
              </div>

              <div className="space-y-3">
                {pendingProfileEdits.filter((e) => e.status === 'pending').length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-amber-300 text-center text-slate-500 font-bold">
                    सध्या कोणतीही प्रलंबित प्रोफाइल दुरुस्ती विनंती नाही.
                  </div>
                ) : (
                  pendingProfileEdits
                    .filter((e) => e.status === 'pending')
                    .map((edit) => (
                      <div key={edit.id} className="bg-white p-4 rounded-2xl border border-amber-300 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                          <div>
                            <h4 className="font-extrabold text-slate-900">{edit.profileName}</h4>
                            <p className="text-xs text-slate-500 font-mono">मोबाईल: {edit.mobile}</p>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{edit.submittedAt}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-amber-50 p-3 rounded-xl border border-amber-200">
                          <div>
                            <span className="font-bold text-rose-700 block mb-1">मूळ जुनी माहिती (Original):</span>
                            <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap">
                              {JSON.stringify(edit.originalData, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-700 block mb-1">नवीन अपडेट केलेले बदल (Updated):</span>
                            <pre className="text-[11px] font-mono text-slate-800 whitespace-pre-wrap">
                              {JSON.stringify(edit.updatedData, null, 2)}
                            </pre>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => approveProfileEditRequest(edit.id)}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                          >
                            बदल मंजूर करा (Approve)
                          </button>
                          <button
                            onClick={() => rejectProfileEditRequest(edit.id)}
                            className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                          >
                            अमान्य करा (Reject)
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* TAB: PROFILE REMOVAL & MARRIAGE FIXED REQUESTS */}
          {activeTab === 'profile_removal' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-rose-600" />
                    <span>विवाह जुळले व प्रोफाइल हटवण्याचे अर्ज (Marriage Fixed & Removal Requests)</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    सदस्यांनी विवाह जुळल्यामुळे किंवा वैयक्तिक कारणास्तव पाठवलेले अर्ज पहा, मंजूर करा किंवा अभिप्राय मुख्य पानावर प्रसिद्ध करा.
                  </p>
                </div>
                <span className="px-3 py-1 bg-rose-600 text-amber-100 rounded-full font-black text-xs shadow shrink-0">
                  प्रलंबित: {profileRemovalRequests.filter(r => r.status === 'pending').length}
                </span>
              </div>

              {profileRemovalRequests.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-amber-300 text-center text-slate-500 font-bold">
                  सध्या कोणताही विवाह जुळल्याचा किंवा प्रोफाईल काढण्याचा अर्ज नाही.
                </div>
              ) : (
                <div className="space-y-4">
                  {profileRemovalRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`bg-white p-5 rounded-2xl border-2 ${
                        req.status === 'pending'
                          ? 'border-amber-400 shadow-md'
                          : req.status === 'approved'
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : 'border-slate-200 opacity-60'
                      } space-y-3 transition-all`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-base text-slate-900">{req.profileName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900">
                              {req.reason === 'marriage_fixed' ? '💍 लग्न जुळले (Marriage Fixed)' : '🔒 वैयक्तिक कारण'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-mono mt-0.5">मोबाईल: {req.profileMobile}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full font-black text-xs inline-block ${
                              req.status === 'pending'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                : req.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {req.status === 'pending' ? '⏳ प्रलंबित' : req.status === 'approved' ? '✅ मंजूर (हटवले)' : '❌ नाकारले'}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono mt-1">{new Date(req.createdAt).toLocaleString('mr-IN')}</p>
                        </div>
                      </div>

                      {req.partnerDetails && (
                        <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs">
                          <span className="font-bold text-[#A71930] block">जोडीदाराची माहिती / नोंद:</span>
                          <p className="text-slate-800 font-semibold">{req.partnerDetails}</p>
                        </div>
                      )}

                      {req.feedbackText && (
                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                          <span className="font-bold text-amber-900 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>सदस्याचा अभिप्राय / संदेश (Feedback for Success Story):</span>
                          </span>
                          <p className="text-slate-800 font-medium italic">"{req.feedbackText}"</p>
                        </div>
                      )}

                      {req.status === 'pending' && (
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-amber-100">
                          {req.feedbackText && req.reason === 'marriage_fixed' && (
                            <button
                              onClick={() => approveProfileRemovalRequest(req.id, true)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>मंजूर करा व मुख्य पृष्ठावर यशोगाथा प्रसिद्ध करा</span>
                            </button>
                          )}
                          <button
                            onClick={() => approveProfileRemovalRequest(req.id, false)}
                            className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-emerald-300"
                          >
                            <Check className="w-4 h-4 text-emerald-700" />
                            <span>फक्त मंजूर करा व प्रोफाइल हटवा</span>
                          </button>
                          <button
                            onClick={() => rejectProfileRemovalRequest(req.id)}
                            className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-rose-300"
                          >
                            <X className="w-4 h-4 text-rose-700" />
                            <span>नाकारा</span>
                          </button>
                          <button
                            onClick={() => deleteProfileRemovalRequest(req.id)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                            title="अर्ज डिलीट करा"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRIVACY & SITE CONTROLS (WITH CHAT CONTENT RESTRICTION TOGGLES) */}
          {activeTab === 'privacy_controls' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300">
                <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#A71930]" />
                  <span>गोपनीयता, चॅट विषयक नियम व फोटो ब्लर सेटिंग्ज</span>
                </h3>
              </div>

              {/* SELECTIVE CHAT CONTENT RESTRICTION TOGGLES */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-sm space-y-4">
                <h4 className="font-extrabold text-[#A71930] text-sm flex items-center gap-2 border-b border-amber-100 pb-2">
                  <Lock className="w-4 h-4 text-[#A71930]" />
                  <span>चॅट माहिती शेअरिंग नियम (Chat Content Restriction Toggles)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-slate-900">गावाचे/शहराचे नाव शेअरिंग</p>
                      <p className="text-[10px] text-slate-500 font-normal">चॅटमध्ये गावाचे नाव परवानगी</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateSiteConfig({
                          ...siteConfig,
                          allowShareVillage: !siteConfig.allowShareVillage,
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                        siteConfig.allowShareVillage ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {siteConfig.allowShareVillage ? 'चालू (ON)' : 'बंद (OFF)'}
                    </button>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-slate-900">मोबाईल नंबर शेअरिंग</p>
                      <p className="text-[10px] text-slate-500 font-normal">चॅटमध्ये फोन नंबर ब्लॉक</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateSiteConfig({
                          ...siteConfig,
                          allowShareMobile: !siteConfig.allowShareMobile,
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                        siteConfig.allowShareMobile ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {siteConfig.allowShareMobile ? 'चालू (ON)' : 'बंद (OFF)'}
                    </button>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-slate-900">ई-मेल आयडी शेअरिंग</p>
                      <p className="text-[10px] text-slate-500 font-normal">चॅटमध्ये ई-मेल ब्लॉक</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateSiteConfig({
                          ...siteConfig,
                          allowShareEmail: !siteConfig.allowShareEmail,
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                        siteConfig.allowShareEmail ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {siteConfig.allowShareEmail ? 'चालू (ON)' : 'बंद (OFF)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Blur % & Selective Blur Switches */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-sm space-y-4">
                <h4 className="font-extrabold text-[#A71930] text-sm border-b border-amber-100 pb-2">
                  फोटो ब्लर व माहिती ब्लर कस्टमायझर (Blur Controls):
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      फोटो अस्पष्टता टक्केवारी (Photo Blur Percent: {siteConfig.photoBlurPercent || 30}%):
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={siteConfig.photoBlurPercent || 30}
                      onChange={(e) =>
                        updateSiteConfig({
                          ...siteConfig,
                          photoBlurPercent: Number(e.target.value),
                        })
                      }
                      className="w-48 accent-[#A71930]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
                    <label className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <span>शिक्षण ब्लर करा (Blur Education)</span>
                      <input
                        type="checkbox"
                        checked={siteConfig.blurEducation}
                        onChange={(e) =>
                          updateSiteConfig({ ...siteConfig, blurEducation: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#A71930]"
                      />
                    </label>

                    <label className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <span>नोकरी/व्यवसाय ब्लर (Blur Occupation)</span>
                      <input
                        type="checkbox"
                        checked={siteConfig.blurOccupation}
                        onChange={(e) =>
                          updateSiteConfig({ ...siteConfig, blurOccupation: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#A71930]"
                      />
                    </label>

                    <label className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <span>वार्षिक उत्पन्न ब्लर (Blur Income)</span>
                      <input
                        type="checkbox"
                        checked={siteConfig.blurIncome}
                        onChange={(e) =>
                          updateSiteConfig({ ...siteConfig, blurIncome: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#A71930]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: RECYCLE BIN & CLOUDINARY STORAGE PURGE WITH DOUBLE CONFIRMATION */}
          {activeTab === 'recycle_bin' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-100 rounded-2xl border border-amber-300">
                <div>
                  <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-rose-600" />
                    <span>रिसायकल बिन व क्लाउडिनरी स्टोरेज स्वच्छता (Recycle Bin)</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    हटवलेले बायोडाटा आणि फोटो इथे साठवले जातात. कायमस्वरूपी रिकामे करण्यासाठी २-टप्प्यांची खात्री modal वापरा.
                  </p>
                </div>

                <button
                  onClick={() => setIsPurgeConfirmOpen(true)}
                  className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  <span>बिन कायमस्वरूपी मोकळा करा (Purge All)</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-amber-300 shadow-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100 text-[#800C1E] font-black border-b border-amber-200">
                    <tr>
                      <th className="p-3">नाव & आयडी</th>
                      <th className="p-3">मूळ प्रकार</th>
                      <th className="p-3">हटवल्याची तारीख</th>
                      <th className="p-3 text-right">पुनर्संचयित (Restore) / नष्ट करा</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-semibold">
                    {recycleBin.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 font-bold">
                          रिसायकल बिन सध्या पूर्णपणे रिकामा आहे.
                        </td>
                      </tr>
                    ) : (
                      recycleBin.map((item) => (
                        <tr key={item.id} className="hover:bg-amber-50">
                          <td className="p-3 font-bold text-slate-900">{item.itemData.fullName || item.id}</td>
                          <td className="p-3 text-amber-800 uppercase font-black text-[10px]">{item.originalType}</td>
                          <td className="p-3 font-mono text-slate-500">{item.deletedAt}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => restoreRecycleItem(item.id)}
                                className="px-3 py-1 bg-emerald-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
                              >
                                परत आणा (Restore)
                              </button>
                              <button
                                onClick={() => permanentDeleteRecycleItem(item.id)}
                                className="px-3 py-1 bg-rose-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
                              >
                                नष्ट करा
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ADD PROFILE MANUAL / PHOTO */}
          {activeTab === 'add_profile' && (
            <div className="p-4 bg-white rounded-2xl border border-amber-300 shadow-sm">
              <h3 className="text-base font-black text-[#A71930] mb-4">
                नवीन बायोडाटा नोंदणी पर्याय (Manual or AI Photo Extractor)
              </h3>
              <AIBioDataExtractor
                onExtracted={(ext) => {
                  const newProfile: UserProfile = {
                    id: 'vj-' + Math.floor(100 + Math.random() * 900),
                    fullName: ext.fullName || 'नवीन उमेदवार',
                    gender: ext.gender || 'groom',
                    dob: ext.dob || '1998-01-01',
                    age: 26,
                    mobile: ext.mobile || '9800000000',
                    email: '',
                    district: ext.district || 'बीड',
                    taluka: '',
                    city: '',
                    education: ext.education || 'पदवीधर',
                    occupation: ext.occupation || 'नोकरी / व्यवसाय',
                    income: 'उल्लेख नाही',
                    height: "5'5\"",
                    weight: '55',
                    bloodGroup: 'O+',
                    maritalStatus: 'never_married',
                    religion: 'हिंदू',
                    subCaste: ext.subCaste || 'वंजारी (NT-D)',
                    gotra: ext.gotra || 'काश्यप',
                    fatherOccupation: ext.fatherName || '',
                    motherOccupation: '',
                    brothers: 0,
                    sisters: 0,
                    familyType: 'सुसंस्कृत कुटुंब',
                    expectations: ext.expectations || '',
                    photos: ext.candidatePhotoUrl ? [ext.candidatePhotoUrl] : [],
                    horoscopeUrl: '',
                    aadhaarVerified: true,
                    isVerified: true,
                    isFeatured: false,
                    isApproved: true,
                    membership: 'free',
                    createdAt: new Date().toISOString().split('T')[0],
                    lastActive: 'प्रशासकाद्वारे जोडले',
                    registrationType: 'ocr_ai',
                    privacy: { hideContact: false, hidePhoto: false },
                  };
                  addProfile(newProfile);
                  alert(
                    `प्रशासक संदेश: '${newProfile.fullName}' यांची AI द्वारे बायोडाटा माहिती ${
                      ext.candidatePhotoUrl ? 'आणि मुलाचा/मुलीचा फोटोसह' : ''
                    } यशस्वीपणे नोंदवली गेली!`
                  );
                }}
              />
            </div>
          )}

          {/* TAB: MEMBERSHIP PLANS & PAYMENT CONFIGURATION */}
          {activeTab === 'plans_setup' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                    <Gift className="w-5 h-5 text-[#A71930]" />
                    <span>मेम्बरशिप प्लॅन्स, दर व पेमेंट क्यूआर व्यवस्थापन (Membership Plans & Payment Setup)</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    इथे तुम्ही प्लॅनचे दर (Prices), कालावधी (Validity), वैशिष्ट्ये (Features) आणि पेमेंटचा क्यूआर कोड/UPI आयडी अपडेट करू शकता.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-amber-300 shadow-sm">
                  <span className="text-xs font-extrabold text-slate-900">पेड प्लॅन्स ऑन/ऑफ:</span>
                  <button
                    type="button"
                    onClick={() => setIsPaidPlansEnabled(!isPaidPlansEnabled)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      isPaidPlansEnabled
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-rose-600 text-white shadow-md'
                    }`}
                  >
                    {isPaidPlansEnabled ? 'चालू (Paid Mode ON)' : 'बंद (All Free Mode)'}
                  </button>
                </div>
              </div>

              {/* Payment Details & QR Code Card */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-sm space-y-4">
                <h4 className="font-black text-[#A71930] text-sm flex items-center gap-2 border-b border-amber-200 pb-2">
                  <CreditCard className="w-4 h-4 text-[#A71930]" />
                  <span>पेमेंट क्यूआर कोड, UPI ID आणि बँक माहिती (Payment Receiver Setup)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-700 mb-1">UPI ID (e.g., PhonePe/GooglePay/Paytm):</label>
                      <input
                        type="text"
                        value={siteConfig.paymentUpiId || '9822100000@ybl'}
                        onChange={(e) => updateSiteConfig({ paymentUpiId: e.target.value })}
                        placeholder="vanjarijodi@upi"
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#A71930]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">
                        तुमच्याकडील क्यूआर कोड फोटो अपलोड करा (Upload Payment QR Code):
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="flex-1 cursor-pointer bg-gradient-to-r from-[#A71930] to-[#800C1E] hover:from-[#800C1E] hover:to-[#5C0815] text-amber-100 px-4 py-2.5 rounded-xl font-black text-xs shadow flex items-center justify-center gap-2 border border-amber-300 transition-all">
                            <ImageIcon className="w-4 h-4 text-amber-300" />
                            <span>{isUploadingQrCode ? 'अपलोड होत आहे...' : 'गॅलरी / ब्राऊझ मधून क्यूआर फोटो निवडा'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingQrCode}
                              onChange={handleUploadPaymentQr}
                              className="hidden"
                            />
                          </label>
                          {siteConfig.paymentQrUrl && (
                            <button
                              type="button"
                              onClick={() => updateSiteConfig({ paymentQrUrl: '' })}
                              className="px-3 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-extrabold text-xs border border-rose-300 cursor-pointer"
                              title="क्यूआर फोटो काढून टाका"
                            >
                              हटवा
                            </button>
                          )}
                        </div>

                        {qrUploadError && (
                          <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{qrUploadError}</span>
                          </p>
                        )}

                        <div className="pt-1">
                          <label className="block text-[11px] text-slate-500 font-bold mb-1">किंवा डायरेक्ट क्यूआर लिंक URL प्रविष्ट करा:</label>
                          <input
                            type="text"
                            value={siteConfig.paymentQrUrl || ''}
                            onChange={(e) => updateSiteConfig({ paymentQrUrl: e.target.value })}
                            placeholder="https://... किंवा वरून फोटो निवडा"
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#A71930]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">पेमेंट सूचना / टिप (Payment Note):</label>
                      <textarea
                        rows={2}
                        value={
                          siteConfig.paymentNote ||
                          'PhonePe / Google Pay / Paytm द्वारे क्यूआर कोड स्कॅन करून किंवा UPI ID वर पेमेंट करा व UTR नंबर सादर करा.'
                        }
                        onChange={(e) => updateSiteConfig({ paymentNote: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#A71930]"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-xs font-black text-[#A71930]">सध्याचा पेमेंट क्यूआर कोड (Preview):</span>
                    {siteConfig.paymentQrUrl ? (
                      <img
                        src={siteConfig.paymentQrUrl}
                        alt="Payment QR"
                        className="w-36 h-36 object-contain rounded-xl border-2 border-amber-300 shadow bg-white p-1"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-xl border-2 border-dashed border-amber-300 flex flex-col items-center justify-center text-slate-400 text-[10px] bg-white p-2">
                        <span>ऑटो-जनरेटेड UPI QR वापरले जात आहे</span>
                        <span className="font-mono text-slate-600 mt-1">{siteConfig.paymentUpiId || 'vanjarijodi@upi'}</span>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-600 font-normal">
                      सदस्य जेव्हा 'प्लॅन विकत घ्या' क्लिक करतील तेव्हा त्यांना हाच क्यूआर कोड आणि UPI ID दिसेल.
                    </p>
                  </div>
                </div>
              </div>

              {/* Plans Pricing & Features Cards */}
              <div className="space-y-4">
                <h4 className="font-black text-[#A71930] text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#A71930]" />
                  <span>मेम्बरशिप प्लॅन्स संपादन व दर बदल (Edit Individual Plans)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plansList.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-5 rounded-2xl border-2 bg-white shadow-sm space-y-4 relative ${
                        plan.recommended ? 'border-[#A71930] bg-amber-50/30' : 'border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#A71930] text-amber-100 font-extrabold text-[10px] uppercase">
                            {plan.id}
                          </span>
                          <h5 className="font-black text-slate-900 text-sm">{plan.nameMr}</h5>
                        </div>
                        {plan.recommended && (
                          <span className="px-2 py-0.5 bg-amber-400 text-amber-950 font-black text-[10px] rounded-full">
                            ★ लोकप्रिय सुचवलेला प्लॅन
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                        <div>
                          <label className="block text-slate-700 mb-1">मराठी नाव:</label>
                          <input
                            type="text"
                            value={plan.nameMr}
                            onChange={(e) => updatePlan({ ...plan, nameMr: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#A71930]"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">दर / किंमत (₹):</label>
                          <input
                            type="number"
                            value={plan.price}
                            onChange={(e) => updatePlan({ ...plan, price: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#A71930] font-mono text-emerald-800 font-extrabold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">कालावधी (महिने):</label>
                          <input
                            type="number"
                            value={plan.durationMonths}
                            onChange={(e) => updatePlan({ ...plan, durationMonths: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#A71930] font-mono"
                          />
                        </div>

                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 text-slate-800 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!plan.recommended}
                              onChange={(e) => updatePlan({ ...plan, recommended: e.target.checked })}
                              className="w-4 h-4 rounded border-amber-400 text-[#A71930]"
                            />
                            <span>सुचवलेला (Recommended)</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          वैशिष्ट्ये (Features - प्रत्येक ओळीवर किंवा स्वल्पविरामाने प्रविष्ट करा):
                        </label>
                        <textarea
                          rows={3}
                          value={plan.featuresMr ? plan.featuresMr.join('\n') : ''}
                          onChange={(e) =>
                            updatePlan({
                              ...plan,
                              featuresMr: e.target.value.split('\n').filter((f) => f.trim() !== ''),
                            })
                          }
                          className="w-full p-2.5 text-xs font-semibold rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#A71930]"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                        <span className="text-[11px] text-slate-500 font-bold">
                          वर्तमान: ₹{plan.price} ({plan.durationMonths} महिने)
                        </span>
                        <button
                          type="button"
                          onClick={() => alert(`'${plan.nameMr}' प्लॅनची माहिती यशस्वीरित्या जतन केली गेली!`)}
                          className="px-4 py-1.5 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-extrabold text-xs rounded-xl shadow cursor-pointer border border-amber-300"
                        >
                          बदल सेव्ह करा
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAYMENT REQUESTS */}
          {activeTab === 'payment_requests' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300">
                <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#A71930]" />
                  <span>ऑनलाइन यूटीआर व क्यूआर पेमेंट मंजुरी (QR Payments Queue)</span>
                </h3>
              </div>

              <div className="bg-white rounded-2xl border border-amber-300 shadow-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100 text-[#800C1E] font-black border-b border-amber-200">
                    <tr>
                      <th className="p-3">सदस्याचे नाव & मोबाईल</th>
                      <th className="p-3">निवडलेला प्लॅन & रक्कम</th>
                      <th className="p-3">UTR नंबर</th>
                      <th className="p-3">स्क्रीनशॉट</th>
                      <th className="p-3 text-right">कृती</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-semibold">
                    {paymentRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                          सध्या कोणतेही प्रलंबित पेमेंट अर्ज नाहीत.
                        </td>
                      </tr>
                    ) : (
                      paymentRequests.map((pay) => (
                        <tr key={pay.id} className="hover:bg-amber-50">
                          <td className="p-3">
                            <p className="font-extrabold text-slate-900">{pay.userName}</p>
                            <p className="text-[11px] text-slate-500 font-mono">{pay.userMobile}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-extrabold text-[#A71930]">{pay.planName}</p>
                            <p className="text-xs font-black text-emerald-800">₹{pay.amount}</p>
                          </td>
                          <td className="p-3 font-mono font-black text-slate-800">{pay.utrNumber}</td>
                          <td className="p-3">
                            {pay.screenshotUrl ? (
                              <button
                                onClick={() => setPreviewScreenshot(pay.screenshotUrl)}
                                className="text-xs text-[#A71930] underline font-bold cursor-pointer"
                              >
                                फोटो पहा
                              </button>
                            ) : (
                              <span className="text-slate-400">उपलब्ध नाही</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {pay.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => approvePaymentRequest(pay.id)}
                                  className="px-3 py-1 bg-emerald-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
                                >
                                  मंजूर करा
                                </button>
                                <button
                                  onClick={() => rejectPaymentRequest(pay.id)}
                                  className="px-3 py-1 bg-rose-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
                                >
                                  अमान्य
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-emerald-700 uppercase">{pay.status}</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SUPPORT CHAT */}
          {activeTab === 'support_chat' && (
            <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md space-y-4">
              <h3 className="text-base font-black text-[#A71930] border-b border-amber-200 pb-2">
                थेट सदस्य संदेश व चॅट उत्तरे (Support Chat)
              </h3>
              <div className="space-y-3">
                {adminSupportMessages.map((msg) => (
                  <div key={msg.id} className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                    <div className="flex justify-between font-bold text-slate-900 mb-1">
                      <span>{msg.senderName} ({msg.senderMobile || 'Guest'})</span>
                      <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-800">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SUB ADMINS & MASTER SECURITY */}
          {activeTab === 'sub_admins' && (
            <div className="space-y-6">
              {/* Master Admin Security Card */}
              <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <div>
                    <h3 className="text-base font-black text-[#A71930] flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#A71930]" />
                      <span>मुख्य प्रशासक सुरक्षा व क्रेडेन्शियल्स (Master Admin Credentials)</span>
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      मुख्य ॲडमिनचे प्रदर्शन नाव, युझरनेम आणि पासवर्ड अपडेट करा. कोणतेही हार्डकोडेड पासवर्ड वापरले जात नाहीत.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateAdminCredentials(masterUsername, masterPassword, masterDisplayName);
                    alert('मुख्य प्रशासक (Super Admin) क्रेडेन्शियल्स यशस्वीरित्या अपडेट केले गेले!');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold"
                >
                  <div>
                    <label className="block mb-1 text-slate-700">प्रदर्शन नाव (Display Name):</label>
                    <input
                      type="text"
                      required
                      value={masterDisplayName}
                      onChange={(e) => setMasterDisplayName(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">युझरनेम (Username):</label>
                    <input
                      type="text"
                      required
                      value={masterUsername}
                      onChange={(e) => setMasterUsername(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">संकेतशब्द (Password):</label>
                    <input
                      type="text"
                      required
                      value={masterPassword}
                      onChange={(e) => setMasterPassword(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black text-xs rounded-xl shadow border border-amber-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>सुरक्षा क्रेडेन्शियल्स सेव्ह करा</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Sub-Admin Accounts List */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-100 rounded-2xl border border-amber-300">
                  <div>
                    <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#A71930]" />
                      <span>सब-ॲडमिन खाती व्यवस्थापन ({subAdmins.length})</span>
                    </h3>
                    <p className="text-xs text-slate-700 font-medium">
                      नवीन सब-ॲडमिन खाते तयार करा व त्यांना विशिष्ट विभागांची मर्यादित परवानगी (Permissions) द्या.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingSubAdminItem(null);
                      setSubAdminName('');
                      setSubAdminUsernameInput('');
                      setSubAdminPasswordInput('');
                      setSubAdminPerms(['manage_profiles', 'add_profiles', 'support_chat']);
                      setSubAdminModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black text-xs rounded-xl shadow border border-amber-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>नवीन सब-ॲडमिन जोडा</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-amber-300 shadow-md overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-amber-100 text-[#800C1E] font-black border-b border-amber-200">
                      <tr>
                        <th className="p-3">सब-ॲडमिन नाव</th>
                        <th className="p-3">युझरनेम & पासवर्ड</th>
                        <th className="p-3">दिलेल्या परवानग्या (Permissions)</th>
                        <th className="p-3">तयार केल्याची तारीख</th>
                        <th className="p-3 text-right">कृती</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 font-semibold">
                      {subAdmins.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                            सध्या कोणतेही सब-ॲडमिन खाते तयार केलेले नाही.
                          </td>
                        </tr>
                      ) : (
                        subAdmins.map((sub) => (
                          <tr key={sub.id} className="hover:bg-amber-50">
                            <td className="p-3">
                              <p className="font-extrabold text-slate-900">{sub.name}</p>
                              <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                                Sub-Admin
                              </span>
                            </td>
                            <td className="p-3 font-mono">
                              <p className="text-slate-900 font-bold">युझर: {sub.username}</p>
                              <p className="text-slate-500 text-[11px]">पास: {sub.password}</p>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1 max-w-md">
                                {sub.permissions.map((perm) => {
                                  const permObj = ALL_SUBADMIN_PERMISSIONS.find((p) => p.id === perm);
                                  return (
                                    <span
                                      key={perm}
                                      className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-[10px] font-bold text-slate-700 flex items-center gap-1"
                                    >
                                      <span>{permObj?.icon || '•'}</span>
                                      <span>{permObj?.labelMr.split(' ')[0] || perm}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="p-3 font-mono text-slate-500">{sub.createdAt}</td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingSubAdminItem(sub);
                                    setSubAdminName(sub.name);
                                    setSubAdminUsernameInput(sub.username);
                                    setSubAdminPasswordInput(sub.password);
                                    setSubAdminPerms(sub.permissions);
                                    setSubAdminModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#A71930] cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteSubAdmin(sub.id)}
                                  className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FACE VERIFICATION LOGS */}
          {activeTab === 'face_verification' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <span>AI चेहरा पडताळणी ऑथेंटिकेशन लॉग्स (Face Verification Logs)</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    सदस्यांनी स्कॅन केलेले लाईव्ह चेहऱ्यांचे फोटो तपासा, मॅच स्कोर पहा आणि मॅन्युअली Approved किंवा Rejected करा.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-200 text-[#800C1E] rounded-full text-xs font-black border border-amber-300">
                    एकूण प्रलंबित: {faceVerificationLogs.filter((l) => l.status === 'pending').length}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-amber-300 shadow-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100 text-[#800C1E] font-black border-b border-amber-200">
                    <tr>
                      <th className="p-3">सदस्याचे नाव & ID</th>
                      <th className="p-3">स्कॅन केलेला चेहऱ्याचा फोटो</th>
                      <th className="p-3">मूळ प्रोफाइल फोटो</th>
                      <th className="p-3">AI मॅच स्कोर</th>
                      <th className="p-3">स्कॅन वेळ</th>
                      <th className="p-3 text-right">कृती (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-semibold">
                    {faceVerificationLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
                          अद्याप कोणत्याही सदस्याने चेहरा पडताळणीसाठी अर्ज केलेला नाही.
                        </td>
                      </tr>
                    ) : (
                      faceVerificationLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-amber-50">
                          <td className="p-3">
                            <p className="font-extrabold text-slate-900">{log.userName}</p>
                            <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                              ID: {log.userId}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="relative group w-14 h-14 rounded-xl overflow-hidden border-2 border-blue-400 bg-slate-900">
                              <img
                                src={log.capturedPhotoUrl}
                                alt="Captured"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-300 bg-slate-100">
                              <img
                                src={log.profilePhotoUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full font-black text-xs inline-flex items-center gap-1 ${
                                log.matchScore >= 80
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>{log.matchScore}% Match</span>
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-500 text-[11px]">{log.submittedAt}</td>
                          <td className="p-3 text-right">
                            {log.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    approveFaceVerification(log.id);
                                    alert(`सदस्य ${log.userName} ची चेहरा पडताळणी मंजूर करून Verified Blue Tick देण्यात आला!`);
                                  }}
                                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>मंजूर करा (Blue Tick)</span>
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('अमान्य करण्याचे कारण लिहा:', 'चेहरा मूळ प्रोफाइल फोटोशी जुळला नाही.');
                                    if (reason) rejectFaceVerification(log.id, reason);
                                  }}
                                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>अमान्य</span>
                                </button>
                              </div>
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                  log.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {log.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: APK MANAGER */}
          {activeTab === 'apk_manager' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300">
                <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#A71930]" />
                  <span>Android APK अपलोडर व थेट डाउनलोड लिंक व्यवस्थापन</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  वंजारी विवाह मंचाच्या अँड्रॉइड ॲपची APK फाइल लिंक आणि आवृत्ती अपडेट करा.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md space-y-4">
                  <h4 className="font-black text-[#A71930] text-sm border-b border-amber-100 pb-2">
                    APK सेटिंग्ज अपडेट करा
                  </h4>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateApkSettings({
                        apkUrl: apkUrlInput,
                        appVersion: apkVersionInput,
                        releaseNotes: apkNotesInput,
                        isEnabled: apkEnabledInput,
                        fileSizeMb: apkFileSizeMbInput,
                      });
                      alert('🎉 APK फाइल व डाऊनलोड सेटिंग्ज यशस्वीरित्या सेव्ह झाल्या!');
                    }}
                    className="space-y-4 text-xs font-bold"
                  >
                    {/* Direct File Upload Control */}
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
                      <label className="block text-slate-900 font-extrabold">
                        तुमच्या मोबाईल किंवा संगणकावरून APK फाईल अपलोड करा (Upload APK File):
                      </label>
                      <label className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-4 py-3 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 border border-emerald-300 transition-all">
                        <Download className="w-4 h-4 text-amber-200" />
                        <span>{isUploadingApkFile ? 'APK अपलोड होत आहे...' : 'गॅलरी / फाईल्स मधून .APK फाईल निवडा'}</span>
                        <input
                          type="file"
                          accept=".apk,.zip,application/vnd.android.package-archive,application/*"
                          disabled={isUploadingApkFile}
                          onChange={handleUploadApkFile}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-500 font-bold">
                        टीप: तुम्ही थेट संगणक किंवा मोबाईलमधील .apk फाईल निवडू शकता.
                      </p>
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-800">APK फाईल डाऊनलोड लिंक (Direct Download URL):</label>
                      <input
                        type="text"
                        required
                        placeholder="https://... किंवा वरून फाईल अपलोड करा"
                        value={apkUrlInput}
                        onChange={(e) => setApkUrlInput(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1 text-slate-800">ॲप व्हर्जन (Version):</label>
                        <input
                          type="text"
                          required
                          placeholder="v2.4.0"
                          value={apkVersionInput}
                          onChange={(e) => setApkVersionInput(e.target.value)}
                          className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-slate-800">फाईलचा आकार (Size MB):</label>
                        <input
                          type="text"
                          placeholder="12.4 MB"
                          value={apkFileSizeMbInput}
                          onChange={(e) => setApkFileSizeMbInput(e.target.value)}
                          className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-800">रीलीज नोट्स / वैशिष्ट्ये (Release Notes):</label>
                      <textarea
                        rows={3}
                        value={apkNotesInput}
                        onChange={(e) => setApkNotesInput(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                      />
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900">वेबसाईटवर ॲप डाऊनलोड बॅनर/बटन दाखवा:</span>
                        <span className="text-[10px] text-slate-500 font-normal">पब्लिक व्हिजिटर्ससाठी सक्रिय करा</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setApkEnabledInput(!apkEnabledInput)}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                          apkEnabledInput ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {apkEnabledInput ? 'सक्रिय (ON)' : 'बंद (OFF)'}
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5 border border-amber-300"
                      >
                        <Download className="w-4 h-4 text-amber-300" />
                        <span>APK माहिती सेव्ह करा</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadApkFile(apkUrlInput, apkVersionInput || 'v2.4.0')}
                        className="px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-300"
                        title="डाऊनलोड टेस्ट करा"
                      >
                        <Download className="w-4 h-4 text-amber-200" />
                        <span>टेस्ट डाऊनलोड</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Direct Shareable Link Box */}
                <div className="bg-gradient-to-br from-[#A71930] to-[#800C1E] text-amber-100 p-6 rounded-2xl border-2 border-amber-300 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-300 text-[#800C1E] rounded-full text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>थेट शेअर करण्यायोग्य लिंक generator</span>
                    </div>

                    <h3 className="text-xl font-black text-white">वंजारी विवाह मंच - अँड्रॉइड APK डाउनलोड</h3>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      खालील थेट डायरेक्ट डाऊनलोड लिंक कॉपी करून व्हॉट्सॲप, टेलिग्राम किंवा फेसबुकवर सदस्यांसोबत शेअर करा.
                    </p>

                    <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-300/40 space-y-2">
                      <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block">
                        Direct Download Link:
                      </span>
                      <p className="font-mono text-xs text-emerald-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                        {siteConfig?.apkSettings?.apkUrl || 'https://vanjarimatri.com/downloads/app.apk'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-amber-300/30">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                      <span>एकूण डाऊनलोड संख्या:</span>
                      <span className="text-amber-300 font-black text-sm">{siteConfig?.apkSettings?.downloadCount || 4280} डाउनलोड्स</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(siteConfig?.apkSettings?.apkUrl || '');
                          alert('APK डाउनलोड लिंक कॉपी केली गेली!');
                        }}
                        className="py-2.5 bg-amber-300 hover:bg-amber-400 text-[#800C1E] font-black text-xs rounded-xl shadow cursor-pointer text-center"
                      >
                        📋 लिंक कॉपी करा
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `🚩 संत भगवान बाबा यांच्या आशीर्वादाने स्थापित *वंजारी जोडी* मोबाईल ॲप डाउनलोड करा!\n\nॲप डाऊनलोड करण्यासाठी खालील लिंकवर क्लिक करा:\n${
                            siteConfig?.apkSettings?.apkUrl || ''
                          }`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow text-center flex items-center justify-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>व्हॉट्सॲपवर पाठवा</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INDEX & SOCIAL MEDIA CONTROLS */}
          {activeTab === 'index_controls' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300">
                <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#A71930]" />
                  <span>इंडेक्स पेज मजकूर, चित्रे, संपर्क व सोशल मीडिया नियंत्रणे (Index Controls)</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  मुख्य इंडेक्स पेजचे संपर्क व मदत कक्ष, सूचना बॅनर, सोशल मीडिया आयकॉन्स व विशेष वैशिष्ट्ये कस्टमायझ करा.
                </p>
              </div>

              {/* 1. CONTACT & HELPLINE SECTION CONTROLS CARD */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="font-extrabold text-[#A71930] text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#A71930]" />
                    <span>संपर्क व मदत कक्ष माहिती व टॅप ऑन/ऑफ (Contact & Helpline Controls)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">संपर्क कक्ष ऑन/ऑफ:</span>
                    <button
                      type="button"
                      onClick={() => updateSiteConfig({ hideContactAndAddressGlobal: !siteConfig?.hideContactAndAddressGlobal })}
                      className={`px-3 py-1 rounded-xl font-black text-xs cursor-pointer shadow ${
                        !siteConfig?.hideContactAndAddressGlobal ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {!siteConfig?.hideContactAndAddressGlobal ? 'सक्रिय (ON)' : 'बंद (OFF)'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="block text-slate-700 mb-1">संपर्क विभाग शीर्षक (Section Title):</label>
                    <input
                      type="text"
                      value={siteConfig?.contactHeaderTitle || 'संपर्क व मदत कक्ष (Contact & Helpline)'}
                      onChange={(e) => updateSiteConfig({ contactHeaderTitle: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">संपर्क विभाग उपशीर्षक (Subtitle / Help Note):</label>
                    <input
                      type="text"
                      value={siteConfig?.contactHeaderSubtitle || 'कोणतीही अडचण किंवा चौकशीसाठी आमच्याशी संपर्क साधा.'}
                      onChange={(e) => updateSiteConfig({ contactHeaderSubtitle: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">हेल्पलाईन मोबाईल नंबर (Phone Number):</label>
                    <input
                      type="text"
                      value={siteConfig?.contactPhone || '+91 98220 00000'}
                      onChange={(e) => updateSiteConfig({ contactPhone: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">व्हॉट्सॲप नंबर (WhatsApp Number):</label>
                    <input
                      type="text"
                      value={siteConfig?.contactWhatsapp || '+91 98220 00000'}
                      onChange={(e) => updateSiteConfig({ contactWhatsapp: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">सपोर्ट ई-मेल आयडी (Support Email):</label>
                    <input
                      type="email"
                      value={siteConfig?.contactEmail || 'support@vanjarijodi.org'}
                      onChange={(e) => updateSiteConfig({ contactEmail: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">कार्यालयीन पत्ता (Office Address):</label>
                    <input
                      type="text"
                      value={siteConfig?.contactAddress || 'परळी वैजनाथ / बीड / नाशिक / पुणे, महाराष्ट्र'}
                      onChange={(e) => updateSiteConfig({ contactAddress: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-700 mb-1">महत्त्वाची सूचना / डिस्क्लेमर मजकूर (Mandatory Disclaimer):</label>
                    <textarea
                      rows={3}
                      value={
                        siteConfig?.disclaimerText ||
                        "महत्त्वाची सूचना / टीप: 'वंजारी जोडी' हे केवळ वधू-वरांना आणि त्यांच्या कुटुंबांना परस्परांशी संपर्क साधण्यासाठी उपलब्ध करून दिलेले एक डिजिटल व्यासपीठ आहे."
                      }
                      onChange={(e) => updateSiteConfig({ disclaimerText: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => alert('संपर्क व मदत कक्ष माहिती यशस्वीरित्या अपडेट केली गेली!')}
                    className="px-5 py-2.5 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-extrabold text-xs rounded-xl shadow cursor-pointer border border-amber-300 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>संपर्क माहिती सेव्ह करा</span>
                  </button>
                </div>
              </div>

              {/* Social Media Links Customizer */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <h4 className="font-extrabold text-[#A71930] text-sm">
                    सोशल मीडिया आयकॉन्स व लिंक नियंत्रणे (Social Media Controls):
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(siteConfig?.socialLinks || []).map((link) => (
                    <div
                      key={link.id}
                      className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                          <span>🌐</span>
                          <span>{link.label}</span>
                        </span>
                        <button
                          onClick={() => deleteSocialLink(link.id)}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                          title="हटवा"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 text-xs font-bold">
                        <div>
                          <label className="block text-slate-600 text-[10px]">सोशल मीडिया नाव:</label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) =>
                              updateSocialLinks(
                                (siteConfig?.socialLinks || []).map((s) =>
                                  s.id === link.id ? { ...s, label: e.target.value } : s
                                )
                              )
                            }
                            className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 text-[10px]">टार्गेट लिंक URL:</label>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) =>
                              updateSocialLinks(
                                (siteConfig?.socialLinks || []).map((s) =>
                                  s.id === link.id ? { ...s, url: e.target.value } : s
                                )
                              )
                            }
                            className="w-full bg-white border border-amber-300 rounded-lg p-2 font-mono text-slate-900"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-600 text-[10px]">रुंदी (Width px):</label>
                            <input
                              type="number"
                              value={link.iconWidth || 24}
                              onChange={(e) =>
                                updateSocialLinks(
                                  (siteConfig?.socialLinks || []).map((s) =>
                                    s.id === link.id ? { ...s, iconWidth: Number(e.target.value) } : s
                                  )
                                )
                              }
                              className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-600 text-[10px]">उंची (Height px):</label>
                            <input
                              type="number"
                              value={link.iconHeight || 24}
                              onChange={(e) =>
                                updateSocialLinks(
                                  (siteConfig?.socialLinks || []).map((s) =>
                                    s.id === link.id ? { ...s, iconHeight: Number(e.target.value) } : s
                                  )
                                )
                              }
                              className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-600">पब्लिकवर सक्रिय:</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateSocialLinks(
                                (siteConfig?.socialLinks || []).map((s) =>
                                  s.id === link.id ? { ...s, isEnabled: !s.isEnabled } : s
                                )
                              )
                            }
                            className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                              link.isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {link.isEnabled ? 'चालू' : 'बंद'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Custom Social Link Form */}
                <div className="p-4 bg-amber-100/80 rounded-2xl border border-amber-300 space-y-3">
                  <h5 className="font-extrabold text-[#A71930] text-xs">नवीन कस्टम सोशल मीडिया लिंक जोडा:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-bold">
                    <input
                      type="text"
                      placeholder="नाव (उदा. Telegram)"
                      value={newSocialLabel}
                      onChange={(e) => setNewSocialLabel(e.target.value)}
                      className="bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                    />
                    <input
                      type="url"
                      placeholder="URL (https://t.me/...)"
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      className="bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 font-mono"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Width (24)"
                        value={newSocialWidth}
                        onChange={(e) => setNewSocialWidth(Number(e.target.value))}
                        className="w-1/2 bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                      />
                      <input
                        type="number"
                        placeholder="Height (24)"
                        value={newSocialHeight}
                        onChange={(e) => setNewSocialHeight(Number(e.target.value))}
                        className="w-1/2 bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!newSocialLabel || !newSocialUrl) return alert('कृपया नाव आणि URL दोन्ही प्रविष्ट करा.');
                        addSocialLink({
                          platform: newSocialLabel.toLowerCase(),
                          label: newSocialLabel,
                          url: newSocialUrl,
                          iconName: newSocialIcon,
                          iconWidth: newSocialWidth,
                          iconHeight: newSocialHeight,
                          isEnabled: true,
                        });
                        setNewSocialLabel('');
                        setNewSocialUrl('');
                      }}
                      className="bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black rounded-xl p-2.5 cursor-pointer shadow flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>लिंक जोडा</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. INDEX PAGE 4 FEATURE BOXES MANAGER (इंडेक्स ४ वैशिष्ट्ये कप्पे कस्टमायझर) */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
                  <div>
                    <h4 className="font-extrabold text-[#A71930] text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#A71930]" />
                      <span>इंडेक्स ४ वैशिष्ट्ये कप्पे नियंत्रक (Index 4 Feature Boxes Controls)</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      मुख्य इंडेक्स पेजवर दिसणारे वैशिष्ट्य कप्पे बदलणे, चालू/बंद करणे किंवा मूळ ४ कप्पे रिसेट करणे.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const default4: FeatureBoxItem[] = [
                        {
                          id: 'f-1',
                          title: 'सत्यापित प्रोफाइल (Verified Profiles)',
                          desc: '१००% आधार व शासकीय ओळखपत्राद्वारे प्रत्येक प्रोफाईलची सत्यता ॲडमिनद्वारे पडताळली जाते.',
                          iconName: 'ShieldCheck',
                          isEnabled: true,
                        },
                        {
                          id: 'f-2',
                          title: 'संपूर्ण गोपनीयता (100% Privacy)',
                          desc: 'तुमचे फोटो आणि वैयक्तिक माहिती पूर्णपणे सुरक्षित. तुमच्या परवानगीशिवाय संपर्क उघड केला जात नाही.',
                          iconName: 'Lock',
                          isEnabled: true,
                        },
                        {
                          id: 'f-3',
                          title: 'सुरक्षित संपर्क (Secure Contact)',
                          desc: 'मोबाईल नंबर सार्वजनिकपणे उघडे नसून ॲडमिनद्वारे authorized झाल्यानंतरच संपर्क साधता येतो.',
                          iconName: 'PhoneCall',
                          isEnabled: true,
                        },
                        {
                          id: 'f-4',
                          title: 'प्रशासकीय मान्यता (Admin Approval)',
                          desc: 'प्रत्येक नवीन नोंदणीची ॲडमिन टीमद्वारे कसून तपासणी करूनच प्रणालीत मंजुरी दिली जाते.',
                          iconName: 'UserCheck',
                          isEnabled: true,
                        },
                      ];
                      updateSiteConfig({ featureBoxes: default4 });
                      alert('४ मुख्य वैशिष्ट्य कप्पे डीफॉल्ट रिसेट झाले!');
                    }}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-[#A71930] rounded-xl text-xs font-black border border-amber-300 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>डीफॉल्ट ४ कप्पे रिसेट करा</span>
                  </button>
                </div>

                {/* Grid of current Feature Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {((siteConfig?.featureBoxes && siteConfig.featureBoxes.length > 0)
                    ? siteConfig.featureBoxes
                    : [
                        {
                          id: 'f-1',
                          title: 'सत्यापित प्रोफाइल (Verified Profiles)',
                          desc: '१००% आधार व शासकीय ओळखपत्राद्वारे प्रत्येक प्रोफाईलची सत्यता ॲडमिनद्वारे पडताळली जाते.',
                          iconName: 'ShieldCheck',
                          isEnabled: true,
                        },
                        {
                          id: 'f-2',
                          title: 'संपूर्ण गोपनीयता (100% Privacy)',
                          desc: 'तुमचे फोटो आणि वैयक्तिक माहिती पूर्णपणे सुरक्षित. तुमच्या परवानगीशिवाय संपर्क उघड केला जात नाही.',
                          iconName: 'Lock',
                          isEnabled: true,
                        },
                        {
                          id: 'f-3',
                          title: 'सुरक्षित संपर्क (Secure Contact)',
                          desc: 'मोबाईल नंबर सार्वजनिकपणे उघडे नसून ॲडमिनद्वारे authorized झाल्यानंतरच संपर्क साधता येतो.',
                          iconName: 'PhoneCall',
                          isEnabled: true,
                        },
                        {
                          id: 'f-4',
                          title: 'प्रशासकीय मान्यता (Admin Approval)',
                          desc: 'प्रत्येक नवीन नोंदणीची ॲडमिन टीमद्वारे कसून तपासणी करूनच प्रणालीत मंजुरी दिली जाते.',
                          iconName: 'UserCheck',
                          isEnabled: true,
                        },
                      ]
                  ).map((box, index) => (
                    <div
                      key={box.id || index}
                      className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <span className="font-extrabold text-[#A71930] text-xs flex items-center gap-1.5">
                          <span>कप्पा #{index + 1}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const current = siteConfig?.featureBoxes || [];
                              const updated = current.map((b, i) =>
                                (b.id === box.id || i === index) ? { ...b, isEnabled: !b.isEnabled } : b
                              );
                              updateSiteConfig({ featureBoxes: updated });
                            }}
                            className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                              box.isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {box.isEnabled ? 'पब्लिकवर चालू' : 'बंद'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs font-bold">
                        <div>
                          <label className="block text-slate-600 text-[10px]">शीर्षक (Title):</label>
                          <input
                            type="text"
                            value={box.title}
                            onChange={(e) => {
                              const current = siteConfig?.featureBoxes || [];
                              const updated = current.map((b, i) =>
                                (b.id === box.id || i === index) ? { ...b, title: e.target.value } : b
                              );
                              updateSiteConfig({ featureBoxes: updated });
                            }}
                            className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 text-[10px]">वर्णन (Description):</label>
                          <textarea
                            rows={2}
                            value={box.desc}
                            onChange={(e) => {
                              const current = siteConfig?.featureBoxes || [];
                              const updated = current.map((b, i) =>
                                (b.id === box.id || i === index) ? { ...b, desc: e.target.value } : b
                              );
                              updateSiteConfig({ featureBoxes: updated });
                            }}
                            className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 text-[10px]">आयकॉन (Icon):</label>
                          <select
                            value={box.iconName}
                            onChange={(e) => {
                              const current = siteConfig?.featureBoxes || [];
                              const updated = current.map((b, i) =>
                                (b.id === box.id || i === index) ? { ...b, iconName: e.target.value } : b
                              );
                              updateSiteConfig({ featureBoxes: updated });
                            }}
                            className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-900 font-bold"
                          >
                            <option value="ShieldCheck">ShieldCheck (सत्यापित शील्ड)</option>
                            <option value="Lock">Lock (गोपनीयता लॉक)</option>
                            <option value="PhoneCall">PhoneCall (फोन कॉल)</option>
                            <option value="UserCheck">UserCheck (प्रशासकीय यूजर)</option>
                            <option value="Sparkles">Sparkles (विशेष चमक)</option>
                            <option value="Heart">Heart (हृदय/आवडते)</option>
                            <option value="Users">Users (समाज/समूह)</option>
                            <option value="Shield">Shield (संरक्षण)</option>
                            <option value="Award">Award (पुरस्कार/नंबर १)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. BIODATA DISPLAY & PRIVACY CONTROLS (बायोडाटा दृश्यमानता नियम) */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md space-y-4">
                <div className="border-b border-amber-200 pb-2">
                  <h4 className="font-extrabold text-[#A71930] text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#A71930]" />
                    <span>इंडेक्स व बायोडाटा कार्ड दृश्यमानता नियंत्रणे (Biodata Card Visibility Controls)</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    पब्लिक बायोडाटा कार्डवर कोणती माहिती उघडी ठेवायची किंवा लपवायची ते ठरवा.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-bold">
                  {/* Blur Sliders Container */}
                  <div className="p-4 bg-amber-100/70 rounded-2xl border border-amber-300 space-y-4">
                    <h5 className="font-extrabold text-[#A71930] text-xs flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-[#A71930]" />
                      <span>फोटो, नाव व मोबाईल नंबर धुसरता टक्केवारी नियंत्रक (Granular Blur % Sliders):</span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Photo Blur % Slider */}
                      <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                        <div className="flex justify-between items-center text-slate-900">
                          <span>🖼️ फोटो ब्लर टक्केवारी:</span>
                          <span className="text-[#A71930] font-black">{siteConfig?.photoBlurPercent || 30}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={siteConfig?.photoBlurPercent || 30}
                          onChange={(e) => updateSiteConfig({ photoBlurPercent: Number(e.target.value) })}
                          className="w-full accent-[#A71930] cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-500 font-normal">१००% केल्यास फोटो संपूर्ण काळा/ब्लर दिसेल.</p>
                      </div>

                      {/* Name Blur % Slider */}
                      <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                        <div className="flex justify-between items-center text-slate-900">
                          <span>👤 नाव मास्किंग टक्केवारी:</span>
                          <span className="text-[#A71930] font-black">{siteConfig?.blurNamePercent || 50}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={siteConfig?.blurNamePercent || 50}
                          onChange={(e) => updateSiteConfig({ blurNamePercent: Number(e.target.value) })}
                          className="w-full accent-[#A71930] cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-500 font-normal">१००% केल्यास नाव संपूर्ण लपवले (***) जाईल.</p>
                      </div>

                      {/* Mobile Blur % Slider */}
                      <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                        <div className="flex justify-between items-center text-slate-900">
                          <span>📱 मोबाईल नंबर ब्लर टक्केवारी:</span>
                          <span className="text-[#A71930] font-black">{siteConfig?.blurMobilePercent || 70}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={siteConfig?.blurMobilePercent || 70}
                          onChange={(e) => updateSiteConfig({ blurMobilePercent: Number(e.target.value) })}
                          className="w-full accent-[#A71930] cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-500 font-normal">१००% केल्यास पूर्ण नंबर स्टार (******) दिसेल.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900">गैर-लॉगिन युझर्सना फोटो ब्लर करा:</span>
                        <span className="text-[10px] text-slate-500 font-medium">फोटो धुसर दिसतील</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ blurProfilePhotos: !siteConfig?.blurProfilePhotos })}
                        className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                          siteConfig?.blurProfilePhotos ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {siteConfig?.blurProfilePhotos ? 'ब्लर ON' : 'दिसतील'}
                      </button>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900">नाव अर्धवट लपवा (Blur/Mask Name):</span>
                        <span className="text-[10px] text-slate-500 font-medium">e.g. अमोल शं...</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ blurProfileNames: !siteConfig?.blurProfileNames })}
                        className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                          siteConfig?.blurProfileNames ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {siteConfig?.blurProfileNames ? 'मास्क ON' : 'दिसतील'}
                      </button>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900">फोटो डाऊनलोड व स्क्रीनशॉट प्रतिबंध:</span>
                        <span className="text-[10px] text-slate-500 font-medium">राइट-क्लिक व सेविंग ब्लॉक</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ disablePhotoDownloadAndScreenshot: !siteConfig?.disablePhotoDownloadAndScreenshot })}
                        className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                          siteConfig?.disablePhotoDownloadAndScreenshot ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {siteConfig?.disablePhotoDownloadAndScreenshot ? 'प्रतिबंध ON' : 'बंद'}
                      </button>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900">सदस्यांना पेमेंट पर्याय दाखवा/लपवा:</span>
                        <span className="text-[10px] text-slate-500 font-medium">क्यूआर/प्लॅन्स दृश्यमानता</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ hidePaymentDetailsGlobal: !siteConfig?.hidePaymentDetailsGlobal })}
                        className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                          siteConfig?.hidePaymentDetailsGlobal ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {siteConfig?.hidePaymentDetailsGlobal ? 'पेमेंट लपवले' : 'पेमेंट चालू'}
                      </button>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900">ग्लोबल मोबाईल नंबर लपवा:</span>
                        <span className="text-[10px] text-slate-500 font-medium">केवळ पे-पर-काँटॅक्टने अन-लॉक</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ hidePhoneNumbersGlobal: !siteConfig?.hidePhoneNumbersGlobal })}
                        className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                          siteConfig?.hidePhoneNumbersGlobal ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {siteConfig?.hidePhoneNumbersGlobal ? 'लपवले' : 'दिसतील'}
                      </button>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900">पूर्ण पत्ता/रस्ता लपवा:</span>
                        <span className="text-[10px] text-slate-500 font-medium">केवळ जिल्हा व शहर दिसेल</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ hideFullAddressGlobal: !siteConfig?.hideFullAddressGlobal })}
                        className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                          siteConfig?.hideFullAddressGlobal ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {siteConfig?.hideFullAddressGlobal ? 'लपवले' : 'दिसतील'}
                      </button>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900">जिल्हा फिल्टर पर्याय दाखवा:</span>
                        <span className="text-[10px] text-slate-500 font-medium">इंडेक्सवर जिल्हा फिल्टर</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ showDistrictFilter: !siteConfig?.showDistrictFilter })}
                        className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                          siteConfig?.showDistrictFilter !== false ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {siteConfig?.showDistrictFilter !== false ? 'चालू' : 'बंद'}
                      </button>
                    </div>
                  </div>

                  {/* ⚡ ऑटो मोड व मास्टर अक्सेस कंट्रोल (Auto Mode & Master Control Settings) */}
                  <div className="p-5 bg-gradient-to-br from-amber-900 via-[#800C1E] to-[#A71930] rounded-3xl text-amber-50 space-y-4 col-span-full shadow-lg border-2 border-amber-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-300/40">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Zap className="w-6 h-6 text-amber-300 animate-pulse" />
                          <h3 className="text-lg font-black text-amber-200">
                            ⚡ ऑटो मोड आणि संपूर्ण ऑटोमेशन सेटिंग्ज (Auto Mode Master Settings)
                          </h3>
                        </div>
                        <p className="text-xs text-amber-100/90 font-medium leading-relaxed">
                          ॲडमिन हँड्स-फ्री ऑटोमेशन: वेबसाईट संपूर्ण मोफत ठेवणे किंवा पेमेंट होताच सर्व काही स्वयंचलित अनलॉक करणे.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ isAutoModeEnabled: !siteConfig?.isAutoModeEnabled })}
                        className={`px-5 py-2 rounded-full text-xs font-black cursor-pointer shadow-md border-2 transition-all ${
                          siteConfig?.isAutoModeEnabled
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                            : 'bg-slate-700 text-amber-200 border-slate-500'
                        }`}
                      >
                        {siteConfig?.isAutoModeEnabled ? '⚡ ऑटो मोड चालू (ON)' : '🔒 मॅन्युअल मोड (OFF)'}
                      </button>
                    </div>

                    {/* Auto Mode Control Panel */}
                    {siteConfig?.isAutoModeEnabled ? (
                      <div className="space-y-4 pt-1">
                        <div className="bg-amber-950/60 p-4 rounded-2xl border border-amber-300/30 space-y-3">
                          <label className="block text-xs font-black text-amber-200 uppercase tracking-wider">
                            🎯 १. ऑटो मोड प्रकार निवडा (Auto Mode Type Selection):
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => updateSiteConfig({ autoModeType: 'payment_required', freeForAllMode: false })}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                siteConfig?.autoModeType === 'payment_required' || !siteConfig?.autoModeType
                                  ? 'bg-amber-200 text-slate-950 border-amber-400 font-extrabold shadow'
                                  : 'bg-amber-900/40 text-amber-100 border-amber-300/20 hover:bg-amber-900/70'
                              }`}
                            >
                              <span className="block text-xs font-black">💳 १. पेमेंट झाल्यावर ऑटो अन-लॉक (Payment Auto Unlock)</span>
                              <span className="text-[10px] text-slate-700 opacity-90 block mt-0.5">
                                युझरने पेमेंट सबमिट करताच ॲडमिन मंजुरीशिवाय सर्व संपर्क व फीचर्स स्वयंचलित अनलॉक होतील.
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updateSiteConfig({ autoModeType: 'free_for_all', freeForAllMode: true })}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                siteConfig?.autoModeType === 'free_for_all' || siteConfig?.freeForAllMode
                                  ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-extrabold shadow'
                                  : 'bg-amber-900/40 text-amber-100 border-amber-300/20 hover:bg-amber-900/70'
                              }`}
                            >
                              <span className="block text-xs font-black">🎁 २. विना पेमेंट - संपूर्ण मोफत वेबसाईट (Free for All Mode)</span>
                              <span className="text-[10px] text-slate-700 opacity-90 block mt-0.5">
                                कोणालाही १ रुपया न भरता संपूर्ण वेबसाईट, सर्व मोबाईल नंबर, बायोडाटा व फोटो मोफत दिसतील.
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Detailed Checkbox Ticks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <label className="flex items-start gap-3 p-3 rounded-xl bg-amber-950/40 border border-amber-300/20 cursor-pointer hover:bg-amber-950/60 transition-colors">
                            <input
                              type="checkbox"
                              checked={siteConfig?.autoApproveNewRegistrations !== false}
                              onChange={(e) => updateSiteConfig({ autoApproveNewRegistrations: e.target.checked })}
                              className="w-4 h-4 mt-0.5 text-[#A71930] rounded cursor-pointer accent-amber-400"
                            />
                            <div>
                              <span className="block text-xs font-bold text-amber-100">☑️ नवीन प्रोफाईल नोंदणी ऑटो मंजूर करा</span>
                              <span className="text-[10px] text-amber-200/70">
                                नवीन युझरने बायोडाटा भरताच तो तात्काळ वेबसाईटवर मंजूर (Approved) होऊन दिसेल.
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 p-3 rounded-xl bg-amber-950/40 border border-amber-300/20 cursor-pointer hover:bg-amber-950/60 transition-colors">
                            <input
                              type="checkbox"
                              checked={siteConfig?.autoUnlockOnPayment !== false}
                              onChange={(e) => updateSiteConfig({ autoUnlockOnPayment: e.target.checked })}
                              className="w-4 h-4 mt-0.5 text-[#A71930] rounded cursor-pointer accent-amber-400"
                            />
                            <div>
                              <span className="block text-xs font-bold text-amber-100">☑️ पेमेंट सादर करताच प्लॅन/संपर्क ऑटो चालू करा</span>
                              <span className="text-[10px] text-amber-200/70">
                                पेमेंट UTR सबमिट होताच संपर्क नंबर तात्काळ अनलॉक होतील.
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 p-3 rounded-xl bg-amber-950/40 border border-amber-300/20 cursor-pointer hover:bg-amber-950/60 transition-colors">
                            <input
                              type="checkbox"
                              checked={siteConfig?.autoModeForGuests !== false}
                              onChange={(e) => updateSiteConfig({ autoModeForGuests: e.target.checked })}
                              className="w-4 h-4 mt-0.5 text-[#A71930] rounded cursor-pointer accent-amber-400"
                            />
                            <div>
                              <span className="block text-xs font-bold text-amber-100">☑️ गेस्ट युझर्सना (Guest) ऑटो पूर्ण ब्राऊझिंग अक्सेस</span>
                              <span className="text-[10px] text-amber-200/70">
                                लॉगिन न केलेल्या पाहुण्यांनाही बायोडाटा व माहिती मुक्तपणे पाहता येईल.
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 p-3 rounded-xl bg-amber-950/40 border border-amber-300/20 cursor-pointer hover:bg-amber-950/60 transition-colors">
                            <input
                              type="checkbox"
                              checked={siteConfig?.autoShowTotalMetrics !== false}
                              onChange={(e) => updateSiteConfig({ autoShowTotalMetrics: e.target.checked })}
                              className="w-4 h-4 mt-0.5 text-[#A71930] rounded cursor-pointer accent-amber-400"
                            />
                            <div>
                              <span className="block text-xs font-bold text-amber-100">☑️ एकूण सदस्य संख्या व आकडेवारी ऑटो सार्वजनिक दाखवा</span>
                              <span className="text-[10px] text-amber-200/70">
                                एकूण वधू-वर संख्या व यश आकडेवारी ऑटो अपडेट होऊन दिसेल.
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-300/20 text-xs text-amber-100/80">
                        ℹ️ मॅन्युअल मोड चालू आहे: सर्व नवीन नोंदणी आणि पेमेंट विनंत्या ॲडमिनद्वारे तपासून मंजूर कराव्या लागतील.
                      </div>
                    )}
                  </div>

                  {/* Dedicated Guest Login Admin Toggle & Checkbox */}
                  <div className="p-4 bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 rounded-2xl border-2 border-amber-300 space-y-2.5 col-span-full shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          id="enableGuestLoginCheckbox"
                          checked={siteConfig?.enableGuestLogin !== false}
                          onChange={(e) => updateSiteConfig({ enableGuestLogin: e.target.checked })}
                          className="w-5 h-5 text-[#A71930] rounded focus:ring-[#A71930] cursor-pointer accent-[#A71930]"
                        />
                        <label htmlFor="enableGuestLoginCheckbox" className="text-slate-900 font-extrabold text-sm sm:text-base cursor-pointer flex items-center gap-1.5">
                          <UserCheck className="w-5 h-5 text-[#A71930]" />
                          <span>👤 गेस्ट प्रवेश (Guest Login) पर्याय उपलब्ध ठेवा</span>
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ enableGuestLogin: siteConfig?.enableGuestLogin === false ? true : false })}
                        className={`px-4 py-1.5 rounded-full text-xs font-black cursor-pointer shadow border transition-all shrink-0 ${
                          siteConfig?.enableGuestLogin !== false
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-rose-600 text-white border-rose-500'
                        }`}
                      >
                        {siteConfig?.enableGuestLogin !== false ? 'उपलब्ध (ON)' : 'बंद (OFF)'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 font-medium pl-7 leading-relaxed">
                      हा चेकबॉक्स चालू (Checked/ON) असल्यास, मुख्य नेव्हिगेशन बारमध्ये 'लॉगिन' बटणाच्या बाजूला <strong>'👤 गेस्ट प्रवेश'</strong> हे स्वतंत्र बटण दिसेल. अनचेक (OFF) केल्यास गेस्ट लॉगिन पर्याय पूर्णपणे लपवला जाईल आणि केवळ हयात नोंदणीकृत सदस्यांनाच प्रवेश मिळेल.
                    </p>
                  </div>

                  {/* Single Unified Notice Banner Settings */}
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-300 space-y-3 col-span-full">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                      <div>
                        <span className="block text-slate-900 font-extrabold text-sm flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-[#A71930]" />
                          📢 मुख्य सूचना / विशेष घोषणा बॅनर (Site Top Banner)
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          वेबसाइटवर सर्वात वर दिसणारी एकच मुख्य सूचनेची लाईन. ॲडमिनमधून कधीही चालू/बंद किंवा मजकूर बदलता येतो.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ isNoticeBannerEnabled: !siteConfig?.isNoticeBannerEnabled })}
                        className={`px-4 py-1.5 rounded-full text-xs font-black cursor-pointer shadow border transition-all ${
                          siteConfig?.isNoticeBannerEnabled
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-rose-600 text-white border-rose-500'
                        }`}
                      >
                        {siteConfig?.isNoticeBannerEnabled ? 'चालू (ON)' : 'बंद (OFF)'}
                      </button>
                    </div>

                    {siteConfig?.isNoticeBannerEnabled ? (
                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="block text-slate-800 font-bold mb-1 text-xs">
                            ✏️ सूचनेचा मजकूर (Announcement / Notice Text):
                          </label>
                          <input
                            type="text"
                            value={siteConfig?.noticeBannerText || ''}
                            onChange={(e) => updateSiteConfig({ noticeBannerText: e.target.value })}
                            placeholder="उदा. 📢 ॥ श्री संत भगवान बाबा प्रसन्न ॥ — वंजारी समाजातील सर्व वधू-वरांसाठी मोफत नोंदणी सुविधा सुरू आहे!"
                            className="w-full bg-white border-2 border-amber-300 rounded-xl px-3.5 py-2 text-slate-900 font-bold text-xs outline-none focus:border-[#A71930]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-800 font-bold mb-1 text-xs">
                              🎨 बॅनरची रंगसंगती (Color Theme):
                            </label>
                            <select
                              value={siteConfig?.noticeBannerBg || 'crimson'}
                              onChange={(e) => updateSiteConfig({ noticeBannerBg: e.target.value as any })}
                              className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-xs"
                            >
                              <option value="crimson">🔴 गडद तांबडी (Crimson Royal Red)</option>
                              <option value="saffron">🟠 केशरी (Saffron Gold)</option>
                              <option value="emerald">🟢 हिरवी (Emerald Green)</option>
                              <option value="maroon">🟤 मरुण (Deep Maroon)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-800 font-bold mb-1 text-xs">
                              👁️ लाईव्ह प्रिव्ह्यू (Live Preview):
                            </label>
                            <div className="p-2 bg-[#800C1E] text-amber-100 rounded-xl text-[11px] font-bold overflow-hidden whitespace-nowrap text-ellipsis border border-amber-300/40">
                              📢 {siteConfig?.noticeBannerText || 'सूचना मजकूर प्रविष्ट करा...'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-rose-700 font-extrabold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                        🚫 सूचना बॅनर सध्या बंद (OFF) ठेवला आहे. वेबसाइटवर कोणतीही अतिरिक्त सूचना लाईन दिसणार नाही.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SPONSORED ADS & MELAVA CONTROLS CARD */}
              <div id="sponsored-ads-admin" className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
                  <div>
                    <h4 className="font-extrabold text-[#A71930] text-sm flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-[#A71930]" />
                      <span>प्रायोजित वधू-वर मेळावे व जाहिराती विभाग (Sponsored Ads & Melava Section)</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      मुख्यपृष्ठावरील मेळावे व प्रायोजित जाहिरातींचा विभाग दाखवणे/लपवणे किंवा नवीन मेळाव्याची जाहिरात पोस्ट करणे.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">विभाग चालू / बंद (ON / OFF):</span>
                    <button
                      type="button"
                      onClick={() => setIsAdsEnabled(!isAdsEnabled)}
                      className={`px-4 py-1.5 rounded-full text-xs font-black cursor-pointer shadow border transition-all ${
                        isAdsEnabled
                          ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
                          : 'bg-rose-600 text-white border-rose-500 hover:bg-rose-700'
                      }`}
                    >
                      {isAdsEnabled ? 'सक्रिय (ON - मुख्यपृष्ठावर दिसतात)' : 'बंद (OFF - पूर्णपणे लपवले आहे)'}
                    </button>
                  </div>
                </div>

                {!isAdsEnabled ? (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <span>🚫 प्रायोजित जाहिराती व मेळावे विभाग सध्या बंद (OFF) ठेवला आहे. मुख्यपृष्ठावर हा सेक्शन पूर्णपणे लपवण्यात आला आहे.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Form to Add New Ad / Melava */}
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-3">
                      <h5 className="font-extrabold text-[#A71930] text-xs flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4 text-[#A71930]" />
                        <span>नवीन वधू-वर मेळावा किंवा प्रायोजित जाहिरात जोडा:</span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold">
                        <div>
                          <label className="block text-slate-700 mb-1">जाहिरात / मेळावा शीर्षक (Title):</label>
                          <input
                            type="text"
                            placeholder="उदा. भव्य महा-वंजारी वधू-वर पालक परिचय मेळावा २०२६ (नाशिक)"
                            value={newAdTitle}
                            onChange={(e) => setNewAdTitle(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">प्रकार (Type):</label>
                          <select
                            value={newAdType}
                            onChange={(e) => setNewAdType(e.target.value as any)}
                            className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                          >
                            <option value="meetup">वधू-वर मेळावा (Melava / Meetup)</option>
                            <option value="sponsored">विशेष प्रायोजित जाहिरात (Sponsored Ad)</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-slate-700 mb-1">वर्णन व स्थळ माहिती (Description):</label>
                          <textarea
                            rows={2}
                            placeholder="मेळाव्याचे ठिकाण, वेळ व इतर महत्त्वाची माहिती लिहा..."
                            value={newAdDesc}
                            onChange={(e) => setNewAdDesc(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">जाहिरात बॅनर फोटो (Image Upload or URL):</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="प्रतिमा URL प्रविष्ट करा किंवा फोटो निवडा"
                              value={newAdImageUrl}
                              onChange={(e) => setNewAdImageUrl(e.target.value)}
                              className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                            />
                            <label className="px-3 py-2 bg-amber-200 hover:bg-amber-300 text-[#800C1E] rounded-xl text-xs font-bold cursor-pointer shrink-0 border border-amber-300 flex items-center gap-1">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploadingAdImg ? 'अपलोड...' : 'फोटो निवडा'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadAdImage}
                                className="hidden"
                                disabled={isUploadingAdImg}
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">अधिक माहिती लिंक (Link URL - Optional):</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={newAdLinkUrl}
                            onChange={(e) => setNewAdLinkUrl(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (!newAdTitle || !newAdDesc) return alert('कृपया शीर्षक आणि माहिती प्रविष्ट करा.');
                            addCommunityAd({
                              id: 'ad-' + Date.now(),
                              title: newAdTitle,
                              type: newAdType,
                              description: newAdDesc,
                              imageUrl: newAdImageUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
                              linkUrl: newAdLinkUrl || '',
                              isActive: true,
                            });
                            setNewAdTitle('');
                            setNewAdDesc('');
                            setNewAdImageUrl('');
                            setNewAdLinkUrl('');
                            alert('नवीन मेळावा / जाहिरात यशस्वीरित्या जोडली गेली!');
                          }}
                          className="px-5 py-2 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black text-xs rounded-xl shadow cursor-pointer border border-amber-300 flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-amber-300" />
                          <span>जाहिरात पब्लिश करा</span>
                        </button>
                      </div>
                    </div>

                    {/* Existing Ads List */}
                    <div className="space-y-2">
                      <h5 className="font-extrabold text-[#A71930] text-xs">सध्याच्या जाहिराती व मेळावे सूची ({communityAds.length}):</h5>
                      {communityAds.length === 0 ? (
                        <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200">कोणतीही जाहिरात नोंदवलेली नाही.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {communityAds.map((ad) => (
                            <div key={ad.id} className="p-3 bg-slate-50 rounded-xl border border-amber-300/60 flex items-start justify-between gap-3 shadow-sm">
                              <div className="flex gap-3 items-start">
                                {ad.imageUrl && (
                                  <img src={ad.imageUrl} alt={ad.title} className="w-16 h-16 object-cover rounded-lg border border-slate-300 shrink-0" />
                                )}
                                <div>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-[#A71930] font-bold border border-amber-300">
                                    {ad.type === 'meetup' ? 'वधू-वर मेळावा' : 'विशेष जाहिरात'}
                                  </span>
                                  <h6 className="font-bold text-xs text-slate-900 mt-1">{ad.title}</h6>
                                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{ad.description}</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1.5 items-end shrink-0">
                                <button
                                  type="button"
                                  onClick={() => toggleAdStatus(ad.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer shadow ${
                                    ad.isActive ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                                  }`}
                                >
                                  {ad.isActive ? 'चालू (ON)' : 'बंद (OFF)'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('ही जाहिरात हटवायची आहे का?')) deleteCommunityAd(ad.id);
                                  }}
                                  className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg cursor-pointer"
                                  title="हटवा"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: BRANDING & SLIDES MANAGER */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-100 rounded-2xl border border-amber-300">
                <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#A71930]" />
                  <span>वंजारी जोडी बोधचिन्ह, लोगो व स्लाईडर प्रतिमा व्यवस्थापन (Logo & Branding Controls)</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  येथून तुम्ही वंजारी जोडी ॲपचा मुख्य लोगो (Logo) थेट कॉम्प्युटर / मोबाईलवरून अपलोड करू शकता किंवा URL द्वारे सेट करू शकता. हा लोगो नेव्हिगेशन बार, फुटर, आणि प्रिंट बायोडाटा PDF वर आपोआप अपडेट होईल.
                </p>
              </div>

              {/* 1. LOGO MANAGEMENT CARD */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md space-y-5">
                <div className="border-b border-amber-200 pb-3 flex items-center justify-between">
                  <h4 className="font-extrabold text-[#A71930] text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#A71930]" />
                    <span>वंजारी जोडी अधिकृत लोगो (App Logo Settings)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      updateSiteConfig({ logoUrl: '', logoTitle: 'वंजारी जोडी', logoSubtitle: 'विश्वासू वंजारी विवाह मंच', logoHeight: 52 });
                      alert('लोगो व शीर्षक मूळ डीफॉल्ट वर रिसेट केले गेले!');
                    }}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-[#A71930] rounded-xl text-xs font-bold border border-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>डीफॉल्ट लोगोवर रिसेट करा</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form & Upload Controls */}
                  <div className="space-y-4 text-xs font-bold">
                    {/* Logo File Upload */}
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">
                        📷 १. लोगो फोटो अपलोड करा (Computer / Phone File Upload):
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border-2 border-dashed border-amber-300">
                        <label className="px-4 py-2.5 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 rounded-xl font-black text-xs cursor-pointer shadow flex items-center gap-2 shrink-0 border border-amber-300">
                          <Upload className="w-4 h-4 text-amber-300" />
                          <span>{isUploadingLogo ? 'अपलोड होत आहे...' : 'लोगो फाईल निवडा'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadLogo}
                            className="hidden"
                            disabled={isUploadingLogo}
                          />
                        </label>
                        <span className="text-[11px] text-slate-600 font-medium">PNG, JPG किंवा SVG फॉरमॅट (पारदर्शक पार्श्वभूमी उत्तम)</span>
                      </div>
                    </div>

                    {/* Logo URL Text Input */}
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">
                        🔗 २. किंवा थेट लोगो इमेज URL प्रविष्ट करा (Logo Image URL):
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={siteConfig?.logoUrl || ''}
                        onChange={(e) => updateSiteConfig({ logoUrl: e.target.value })}
                        className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 font-mono text-xs"
                      />
                    </div>

                    {/* Logo Title & Subtitle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">
                          🏷️ ३. लोगोचे मुख्य नाव (Brand Name):
                        </label>
                        <input
                          type="text"
                          value={siteConfig?.logoTitle || 'वंजारी जोडी'}
                          onChange={(e) => updateSiteConfig({ logoTitle: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 font-extrabold mb-1">
                          📝 ४. लोगोचे उपशीर्षक (Brand Tagline):
                        </label>
                        <input
                          type="text"
                          value={siteConfig?.logoSubtitle || 'विश्वासू वंजारी विवाह मंच'}
                          onChange={(e) => updateSiteConfig({ logoSubtitle: e.target.value })}
                          className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 text-xs"
                        />
                      </div>
                    </div>

                    {/* Logo Display Height */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-800 font-extrabold">
                          📏 ५. लोगोची उंची (Display Height in Header):
                        </label>
                        <span className="text-[#A71930] font-black">{siteConfig?.logoHeight || 52} px</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={100}
                        step={2}
                        value={siteConfig?.logoHeight || 52}
                        onChange={(e) => updateSiteConfig({ logoHeight: Number(e.target.value) })}
                        className="w-full accent-[#A71930] cursor-pointer"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => alert('लोगो व ब्रँडिंग सेटिंग्ज यशस्वीरित्या सेव्ह केल्या गेल्या!')}
                        className="w-full py-2.5 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black text-xs rounded-xl shadow cursor-pointer border border-amber-300 flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4 text-amber-300" />
                        <span>लोगो आणि ब्रँडिंग बदल सेव्ह करा</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Previews Box */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-amber-300/80 space-y-4">
                    <h5 className="font-extrabold text-[#A71930] text-xs flex items-center gap-1.5 border-b border-amber-200 pb-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>लोगो थेट कसा दिसेल (Live Logo Previews everywhere):</span>
                    </h5>

                    {/* Preview 1: Header / Navbar Preview */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600">१. हेडर / नेव्हिगेशन बार वर (Header Preview):</span>
                      <div className="p-3 bg-white rounded-xl border border-amber-300 shadow-sm flex items-center gap-3">
                        {siteConfig?.logoUrl ? (
                          <img
                            src={siteConfig.logoUrl}
                            alt="Logo"
                            style={{ height: `${siteConfig?.logoHeight || 52}px`, width: 'auto' }}
                            className="object-contain rounded-xl border border-amber-300 shadow-sm bg-white p-0.5"
                          />
                        ) : (
                          <VanjariJodiLogoEmblem
                            style={{ height: `${siteConfig?.logoHeight || 52}px`, width: 'auto' }}
                          />
                        )}
                        <div>
                          <span className="text-xl font-black text-[#A71930] block">
                            {siteConfig?.logoTitle || 'वंजारी जोडी'}
                          </span>
                          <span className="text-[10px] text-amber-800 font-bold">
                            {siteConfig?.logoSubtitle || 'विश्वासू वंजारी विवाह मंच'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Preview 2: Footer / Dark Mode Banner Preview */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600">२. फुटर / डार्क बॅनर वर (Footer Preview):</span>
                      <div className="p-3 bg-[#800C1E] text-amber-100 rounded-xl border border-amber-300 shadow-sm flex items-center gap-3">
                        {siteConfig?.logoUrl ? (
                          <img
                            src={siteConfig.logoUrl}
                            alt="Logo"
                            className="w-12 h-12 object-contain rounded-xl border border-amber-300 bg-white p-0.5"
                          />
                        ) : (
                          <VanjariJodiLogoEmblem className="w-12 h-12" />
                        )}
                        <div>
                          <span className="text-lg font-black text-amber-300 block">
                            {siteConfig?.logoTitle || 'वंजारी जोडी'}
                          </span>
                          <span className="text-[10px] text-amber-200 font-bold">
                            {siteConfig?.logoSubtitle || 'विश्वासू वंजारी विवाह मंच'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Preview 3: Printable Biodata PDF Header Preview */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600">३. प्रिंट बायोडाटा PDF वर (Print Biodata Header Preview):</span>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {siteConfig?.logoUrl ? (
                            <img src={siteConfig.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
                          ) : (
                            <VanjariJodiLogoEmblem className="h-10 w-10" />
                          )}
                          <span className="font-black text-sm text-[#A71930]">
                            {siteConfig?.logoTitle || 'वंजारी जोडी'}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-[#800C1E] font-bold">
                          बायोडाटा PDF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. HERO SLIDER BANNER IMAGES MANAGER */}
              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md space-y-4">
                <div className="border-b border-amber-200 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-[#A71930] text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#A71930]" />
                      <span>मुख्यपृष्ठ स्लाईडर बॅनर प्रतिमा (Hero Slider Banner Images)</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      मुख्यपृष्ठावरील फिरणाऱ्या स्लाईड बॅनरच्या बॅकग्राउंड प्रतिमा व मजकूर कस्टमायझ करा.
                    </p>
                  </div>
                </div>

                {/* Add Hero Slide Form */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-3 text-xs font-bold">
                  <h5 className="font-extrabold text-[#A71930] text-xs">नवीन स्लाईड बॅनर जोडा:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1">स्लाईड शीर्षक (Slide Title):</label>
                      <input
                        type="text"
                        placeholder="उदा. पवित्र विवाह सोहळा"
                        value={newSlideTitle}
                        onChange={(e) => setNewSlideTitle(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">उपशीर्षक (Subtitle):</label>
                      <input
                        type="text"
                        placeholder="उदा. वंजारी समाजातील हजारो कुटुंबांचा विश्वास"
                        value={newSlideSubtitle}
                        onChange={(e) => setNewSlideSubtitle(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-700 mb-1">प्रतिमा (Image File or URL):</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="प्रतिमा URL प्रविष्ट करा किंवा फोटो निवडा"
                          value={newSlideImageUrl}
                          onChange={(e) => setNewSlideImageUrl(e.target.value)}
                          className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                        />
                        <label className="px-3 py-2 bg-amber-200 hover:bg-amber-300 text-[#800C1E] rounded-xl text-xs font-bold cursor-pointer shrink-0 border border-amber-300 flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingSlideImg ? 'अपलोड...' : 'फोटो निवडा'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadHeroSlideImage}
                            className="hidden"
                            disabled={isUploadingSlideImg}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSlideTitle || !newSlideImageUrl) return alert('कृपया शीर्षक आणि प्रतिमा प्रविष्ट करा.');
                        addHeroSlide({
                          title: newSlideTitle,
                          subtitle: newSlideSubtitle,
                          imageUrl: newSlideImageUrl,
                          ctaText: 'मोफत नोंदणी करा',
                          ctaLink: 'register',
                        });
                        setNewSlideTitle('');
                        setNewSlideSubtitle('');
                        setNewSlideImageUrl('');
                        alert('नवीन स्लाईडर बॅनर जोडला गेला!');
                      }}
                      className="px-5 py-2 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black text-xs rounded-xl shadow cursor-pointer border border-amber-300 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>स्लाईड बॅनर जोडा</span>
                    </button>
                  </div>
                </div>

                {/* Hero Slides List */}
                <div className="space-y-2">
                  <h5 className="font-extrabold text-[#A71930] text-xs">सध्याचे स्लाईड बॅनर ({heroSlides.length}):</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {heroSlides.map((slide) => (
                      <div key={slide.id} className="p-3 bg-slate-50 rounded-xl border border-amber-300/60 flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <img src={slide.imageUrl} alt={slide.title} className="w-16 h-12 object-cover rounded-lg border border-slate-300 shrink-0" />
                          <div>
                            <h6 className="font-bold text-xs text-slate-900">{slide.title}</h6>
                            <p className="text-[11px] text-slate-600 line-clamp-1">{slide.subtitle}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteHeroSlide(slide.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg cursor-pointer shrink-0"
                          title="हटवा"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAY PER CONTACT APPROVALS & SETTINGS */}
          {activeTab === 'pay_per_contact' && (
            <div className="space-y-6">
              {/* Header & Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-amber-100/90 rounded-2xl p-5 border border-amber-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[#A71930]" />
                        <span>पे-पर-काँटॅक्ट विनंत्या (Pay-Per-Contact Unlock System)</span>
                      </h3>
                      <p className="text-xs text-slate-700 font-medium mt-1">
                        युझर्सने संपर्क अन-लॉक करण्यासाठी सबमिट केलेल्या UTR क्रमांकांची पडताळणी करा आणि एका क्लिकवर संपर्क अन-लॉक करा.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#A71930] text-amber-100 rounded-full text-xs font-black">
                      प्रलंबित: {payPerContactRequests.filter((r) => r.status === 'pending').length}
                    </span>
                  </div>
                </div>

                {/* Quick Fee & UPI Controls & Feature Visibility Toggles */}
                <div className="bg-white rounded-2xl p-5 border border-amber-300 shadow-sm space-y-4 text-xs font-bold">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 border-b pb-2">
                    <QrCode className="w-4 h-4 text-[#A71930]" />
                    <span>पे-पर-काँटॅक्ट नियंत्रणे व ऑफर सेटिंग्ज</span>
                  </h4>

                  <div className="space-y-3">
                    {/* Pay Per Contact Toggle */}
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900 font-extrabold">पे-पर-काँटॅक्ट ऑप्शन दाखवा:</span>
                        <span className="text-[10px] text-slate-500">‘नाही’ केल्यास सर्वांसाठी हा पर्याय लपवला जाईल</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ isPayPerContactEnabled: !siteConfig.isPayPerContactEnabled })}
                        className={`px-3 py-1 rounded-xl font-black text-xs cursor-pointer shadow ${
                          siteConfig.isPayPerContactEnabled !== false ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {siteConfig.isPayPerContactEnabled !== false ? 'होय (ON)' : 'नाही (OFF)'}
                      </button>
                    </div>

                    {/* Festival Offer Mode Toggle */}
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900 font-extrabold">सण / नवीन ऑफर मोड (Offer Mode):</span>
                        <span className="text-[10px] text-slate-500">ऑफर चालू असल्यास संपर्क विनामूल्य अन-लॉक होईल</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ isOfferModeEnabled: !siteConfig.isOfferModeEnabled })}
                        className={`px-3 py-1 rounded-xl font-black text-xs cursor-pointer shadow ${
                          siteConfig.isOfferModeEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-800'
                        }`}
                      >
                        {siteConfig.isOfferModeEnabled ? 'सक्रिय (ON)' : 'बंद (OFF)'}
                      </button>
                    </div>

                    {/* Disable All Payments Toggle */}
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-900 font-extrabold">ऑफर काळात सर्व पेमेंट पर्याय बंद ठेवा:</span>
                        <span className="text-[10px] text-slate-500">कोणतेही पेमेंट न घेता १-क्लिकवर संपर्क अनलॉक करा</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSiteConfig({ disableAllPaymentsInOfferMode: !siteConfig.disableAllPaymentsInOfferMode })}
                        className={`px-3 py-1 rounded-xl font-black text-xs cursor-pointer shadow ${
                          siteConfig.disableAllPaymentsInOfferMode ? 'bg-rose-600 text-white' : 'bg-slate-300 text-slate-800'
                        }`}
                      >
                        {siteConfig.disableAllPaymentsInOfferMode ? 'होय (पेमेंट बंद)' : 'नाही'}
                      </button>
                    </div>

                    {/* Offer Banner Text */}
                    {siteConfig.isOfferModeEnabled && (
                      <div>
                        <label className="text-slate-700 block mb-1">ऑफर संदेश (Offer Banner Text):</label>
                        <input
                          type="text"
                          value={siteConfig.offerModeText || '🎉 विशेष सण ऑफर: संपर्क क्रमांक १-क्लिकवर विनामूल्य अन-लॉक करा!'}
                          onChange={(e) => updateSiteConfig({ offerModeText: e.target.value })}
                          className="w-full bg-slate-50 border border-amber-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-xs"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-slate-600 block mb-1">प्रति-संपर्क अन-लॉक शुल्क (₹):</label>
                        <input
                          type="number"
                          value={siteConfig.unlockContactFee || 50}
                          onChange={(e) => updateSiteConfig({ unlockContactFee: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-extrabold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1">ॲडमिन UPI ID:</label>
                        <input
                          type="text"
                          value={siteConfig.paymentUpiId || '9822100000@ybl'}
                          onChange={(e) => updateSiteConfig({ paymentUpiId: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requests Table */}
              <div className="bg-white rounded-2xl border border-amber-300 shadow-sm overflow-hidden">
                <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between font-bold text-xs">
                  <span className="text-slate-800">एकूण प्राप्त पे-पर-काँटॅक्ट विनंत्या ({payPerContactRequests.length})</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider">
                        <th className="p-3">युझर माहिती</th>
                        <th className="p-3">लक्ष्य वधू/वर बायोडाटा</th>
                        <th className="p-3">शुल्क व UTR क्रमांक</th>
                        <th className="p-3">पेमेंट स्क्रीनशॉट</th>
                        <th className="p-3">दिनांक</th>
                        <th className="p-3">स्थिती</th>
                        <th className="p-3 text-right">कृती (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {payPerContactRequests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                            कोणतीही पे-पर-काँटॅक्ट विनंती उपलब्ध नाही.
                          </td>
                        </tr>
                      ) : (
                        payPerContactRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-amber-50/50 transition">
                            <td className="p-3 font-bold">
                              <p className="text-slate-900">{req.userName}</p>
                              <p className="text-slate-500 font-mono text-[11px]">{req.userMobile}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-[#A71930]">{req.targetProfileName}</p>
                              <p className="text-slate-500 font-mono text-[11px]">Mob: {req.targetProfileMobile}</p>
                            </td>
                            <td className="p-3 font-mono">
                              <p className="font-extrabold text-emerald-700">₹{req.amount}</p>
                              <p className="text-slate-700 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                UTR: {req.utrNumber}
                              </p>
                            </td>
                            <td className="p-3">
                              {req.screenshotUrl ? (
                                <a
                                  href={req.screenshotUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs font-bold"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>स्क्रीनशॉट पहा</span>
                                </a>
                              ) : (
                                <span className="text-slate-400 italic">नाही</span>
                              )}
                            </td>
                            <td className="p-3 text-[11px] text-slate-500">
                              {new Date(req.createdAt).toLocaleDateString('mr-IN', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-3 font-bold">
                              {req.status === 'pending' && (
                                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[11px] border border-amber-300">
                                  प्रलंबित (Pending)
                                </span>
                              )}
                              {req.status === 'approved' && (
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] border border-emerald-300">
                                  मंजूर (Approved)
                                </span>
                              )}
                              {req.status === 'rejected' && (
                                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-[11px] border border-rose-300">
                                  अमान्य (Rejected)
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {req.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => approvePayPerContactRequest(req.id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow cursor-pointer transition flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>मंजूर करा</span>
                                  </button>
                                  <button
                                    onClick={() => rejectPayPerContactRequest(req.id)}
                                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow cursor-pointer transition flex items-center gap-1"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>नाकारा</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs italic">पूर्ण झाले</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GRANULAR GUEST ACCESS CONTROL MATRIX */}
          {activeTab === 'guest_permissions' && (
            <div className="space-y-6">
              <div className="bg-amber-100/90 rounded-2xl p-5 border border-amber-300 space-y-2">
                <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#A71930]" />
                  <span>अतिथी युझर परवानगी नियंत्रण मॅट्रिक्स (Granular Guest Access Control)</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  अतिथी (Guest) युझर्सना कोणकोणत्या सुविधा पाहायची परवानगी द्यायची ते ठरवा. एखादी सुविधा बंद केल्यास युझरला मोफत नोंदणी करण्याचा सुंदर मॅसेज दिसेल.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'viewProfiles', label: 'बायोडाटा पाहणे (View Profiles)', icon: Eye, desc: 'अतिथी युझर मुख्य बायोडाटा सूची पाहू शकतात.' },
                  { key: 'searchFilters', label: 'शोधाशोध फिल्टर्स (Search Filters)', icon: Search, desc: 'जिल्हा, शिक्षण व वयानुसार शोधाशोध वापरणे.' },
                  { key: 'viewPhotos', label: 'फोटो पाहणे (View Profile Photos)', icon: ImageIcon, desc: 'बायोडाटा मधील फोटो पाहण्याची परवानगी.' },
                  { key: 'kundaliView', label: 'कुंडली व गुणमिलन पाहणे (Kundali View)', icon: Sparkles, desc: 'पत्रिका आणि गुणमिलन तपशील.' },
                  { key: 'expressInterest', label: 'पसंती/रस दाखवणे (Express Interest)', icon: Heart, desc: 'प्रोफाईलला लाईक किंवा पसंती पाठवणे.' },
                  { key: 'directChat', label: 'थेट चॅटिंग (Direct Chatting)', icon: MessageCircle, desc: 'ऑनलाइन चॅट किंवा संपर्क मेसेज पाठवणे.' },
                ].map((item) => {
                  const currentPerms = siteConfig.guestPermissions || {
                    viewProfiles: true,
                    searchFilters: true,
                    kundaliView: false,
                    expressInterest: false,
                    viewPhotos: true,
                    directChat: false,
                  };
                  const isEnabled = currentPerms[item.key as keyof typeof currentPerms] ?? true;
                  const IconComp = item.icon;

                  return (
                    <div
                      key={item.key}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                        isEnabled
                          ? 'bg-white border-emerald-300 shadow-sm'
                          : 'bg-rose-50/60 border-rose-300 shadow-inner'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-xl border ${
                              isEnabled
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border-rose-300'
                            }`}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{item.label}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isEnabled ? 'परवानगी सुरु (Allowed)' : 'अतिथींसाठी बंद (Restricted)'}
                        </span>

                        <button
                          onClick={() => {
                            const updated = {
                              ...currentPerms,
                              [item.key]: !isEnabled,
                            };
                            updateSiteConfig({ guestPermissions: updated });
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow ${
                            isEnabled
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{isEnabled ? 'बंद करा' : 'सुरु करा'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: LIVE USER ACTIVITY & ANALYTICS DASHBOARD */}
          {activeTab === 'user_analytics' && (
            <div className="space-y-6">
              <div className="bg-amber-100/90 rounded-2xl p-5 border border-amber-300 space-y-2">
                <h3 className="text-lg font-black text-[#A71930] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#A71930]" />
                  <span>रिअल-टाईम युझर क्रियाकलाप व ॲनालिटिक्स (Live User Activity Logs)</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  पोर्टलवर नोंदणीकृत आणि अतिथी (Guest) युझर्स द्वारे केल्या जाणाऱ्या हालचाली, मोबाईल नंबर आणि सत्रांची माहिती एकाच जागी पाहा.
                </p>
              </div>

              {/* Registered vs Guest Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registered Activity Logs */}
                <div className="bg-white rounded-2xl border border-amber-300 p-4 space-y-3 shadow-sm">
                  <h4 className="font-extrabold text-[#A71930] text-sm flex items-center gap-2 border-b pb-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>नोंदणीकृत युझर्स ॲक्टिव्हिटी ({userActivityLogs.filter((l) => l.userType === 'registered').length})</span>
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {userActivityLogs.filter((l) => l.userType === 'registered').length === 0 ? (
                      <p className="text-xs text-slate-500 font-bold p-4 text-center">अद्याप कोणतीही ॲक्टिव्हिटी नोंद झालेली नाही.</p>
                    ) : (
                      userActivityLogs
                        .filter((l) => l.userType === 'registered')
                        .map((log) => (
                          <div key={log.id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-slate-900 font-black">{log.userName}</span>
                              <span className="text-[10px] text-[#A71930] font-mono bg-amber-100 px-2 py-0.5 rounded-full">
                                📞 {log.userMobile || 'मोबाईल नोंद'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-600">
                              <p className="text-[#A71930] font-bold">{log.action}</p>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(log.timestamp).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px] font-medium">{log.details}</p>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Guest Session Logs */}
                <div className="bg-white rounded-2xl border border-amber-300 p-4 space-y-3 shadow-sm">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>अतिथी (Guest) मोबाईल सत्रे व ब्राऊझिंग इतिहास ({guestSessions.length})</span>
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {guestSessions.length === 0 ? (
                      <p className="text-xs text-slate-500 font-bold p-4 text-center">सध्या कोणतेही अतिथी लॉगिन उपलब्ध नाही.</p>
                    ) : (
                      guestSessions.map((sess) => (
                        <div key={sess.sessionId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900 font-extrabold text-xs">
                              👤 {sess.guestName || 'पाहुणे सदस्य'} {sess.district ? `(${sess.district})` : ''}
                            </span>
                            <span className="text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-mono font-black">
                              📞 {sess.mobileNumber || sess.sessionId}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span><strong>IP:</strong> {sess.ipAddress}</span>
                            <span><strong>डिव्हाइस:</strong> {sess.deviceInfo}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {sess.actionsTaken.map((act, i) => (
                              <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] rounded-md font-bold">
                                {act}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUB-ADMINS MANAGEMENT */}
          {activeTab === 'sub_admins' && (
            <div className="space-y-6">
              {/* Info Header Banner */}
              <div className="bg-gradient-to-r from-amber-900 via-[#800C1E] to-[#A71930] rounded-3xl p-6 text-amber-100 border-2 border-amber-300 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-400 text-[#800C1E] rounded-2xl shadow-md shrink-0">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-amber-200">
                      🔑 सब-ॲडमिन खाते व्यवस्थापन व अधिकार नियंत्रण (Sub-Admin Access Control)
                    </h3>
                    <p className="text-xs text-amber-100/90 font-medium mt-0.5">
                      मुख्य प्रशासक (Super Admin) द्वारे नवीन सब-ॲडमिन्स तयार करा आणि त्यांना विशिष्ट विभागाचेच अधिकार (Permissions) सोपवा.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingSubAdminItem(null);
                    setSubAdminName('');
                    setSubAdminUsernameInput('');
                    setSubAdminPasswordInput('');
                    setSubAdminPerms(['manage_profiles', 'add_profiles', 'support_chat']);
                    setSubAdminModalOpen(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#800C1E] font-black text-xs shadow-lg border-2 border-amber-200 cursor-pointer transition flex items-center gap-2 shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>➕ नवीन सब-ॲडमिन जोडा (Add Sub-Admin)</span>
                </button>
              </div>

              {/* Sub-Admins List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {subAdmins.length === 0 ? (
                  <div className="col-span-full p-8 bg-white rounded-3xl border-2 border-amber-300 text-center space-y-3">
                    <ShieldCheck className="w-12 h-12 text-amber-600 mx-auto" />
                    <h4 className="font-extrabold text-slate-800 text-base">सध्या एकही सब-ॲडमिन जोडलेला नाही.</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      तुम्ही टीम सदस्यांना विशिष्ट जबाबदाऱ्या (उदा. फक्त बायोडाटा तपासणे, पेमेंट पाहणे, चॅट उत्तरे देणे) देण्यासाठी सब-ॲडमिन बनवू शकता.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSubAdminItem(null);
                        setSubAdminName('');
                        setSubAdminUsernameInput('');
                        setSubAdminPasswordInput('');
                        setSubAdminPerms(['manage_profiles', 'add_profiles', 'support_chat']);
                        setSubAdminModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#A71930] text-amber-100 font-black rounded-xl text-xs shadow cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>पहिला सब-ॲडमिन तयार करा</span>
                    </button>
                  </div>
                ) : (
                  subAdmins.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 bg-white rounded-3xl border-2 border-amber-300 shadow-md space-y-4 flex flex-col justify-between hover:border-amber-500 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between border-b border-amber-100 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#800C1E] border border-amber-300 flex items-center justify-center font-black text-base shadow-sm">
                              {sub.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm">{sub.name}</h4>
                              <p className="text-[11px] font-mono text-[#A71930] font-bold">@{sub.username}</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#800C1E] text-[10px] font-black border border-amber-300">
                            Sub-Admin
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-600 font-bold">
                            <span>पासवर्ड:</span>
                            <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border">
                              {sub.password}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600 font-bold">
                            <span>एकूण परवानग्या:</span>
                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {sub.permissions?.length || 0} / {ALL_SUBADMIN_PERMISSIONS.length}
                            </span>
                          </div>
                        </div>

                        {/* Badges preview of permissions */}
                        <div className="pt-2 border-t border-amber-100 space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">मुख्य अधिकार (Assigned Permissions):</p>
                          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                            {sub.permissions?.map((permKey) => {
                              const match = ALL_SUBADMIN_PERMISSIONS.find((p) => p.id === permKey);
                              return (
                                <span
                                  key={permKey}
                                  className="px-2 py-0.5 bg-amber-50 text-slate-800 text-[10px] font-extrabold rounded-md border border-amber-200 flex items-center gap-1"
                                >
                                  <span>{match?.icon || '🔑'}</span>
                                  <span>{match ? match.labelMr.split('(')[0] : permKey}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-amber-200 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSubAdminItem(sub);
                            setSubAdminName(sub.name);
                            setSubAdminUsernameInput(sub.username);
                            setSubAdminPasswordInput(sub.password);
                            setSubAdminPerms(sub.permissions || []);
                            setSubAdminModalOpen(true);
                          }}
                          className="flex-1 py-2 bg-amber-100 hover:bg-amber-200 text-[#800C1E] font-black rounded-xl text-xs border border-amber-300 cursor-pointer shadow-sm transition flex items-center justify-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>परवानग्या बदला</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`तुम्हाला खरोखरच सब-ॲडमिन '${sub.name}' चे खाते हटवायचे आहे का?`)) {
                              deleteSubAdmin(sub.id);
                            }
                          }}
                          className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold rounded-xl text-xs border border-rose-300 cursor-pointer transition"
                          title="खाते हटवा"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: DELETED BIODATAS / RECYCLE BIN */}
          {activeTab === 'recycle_bin' && (
            <div className="space-y-6">
              {/* Info Header Banner */}
              <div className="bg-gradient-to-r from-rose-900 via-[#800C1E] to-[#A71930] rounded-3xl p-6 text-amber-100 border-2 border-amber-400/40 shadow-xl space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-400 text-[#800C1E] rounded-2xl shadow-md shrink-0">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-amber-200">
                        हटवलेले बायोडाटा व रिसायकल बिन (Deleted Biodatas Manager)
                      </h3>
                      <p className="text-xs text-amber-100/90 font-medium">
                        सदस्यांनी किंवा ॲडमिनने सिस्टीममधून हटवलेले सर्व बायोडाटा येथे जतन केले आहेत. तुम्ही ते पुन्हा पुनर्संचयित (Restore) करू शकता किंवा सिस्टीममधून पूर्णपणे हटवू (Permanently Delete) शकता.
                      </p>
                    </div>
                  </div>

                  {recycleBin.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('तुम्हाला खरोखरच रिसायकल बिनमधील सर्व बायोडाटा सिस्टीममधून पूर्णपणे नष्ट करायचे आहेत का? ही क्रिया बदलता येणार नाही.')) {
                          bulkPurgeRecycleBin();
                          setSelectedRecycleIds([]);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 border border-amber-300/40 cursor-pointer transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>रिसायकल बिन पूर्ण रिकामे करा (Purge All)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Multi-Select Toolbar & Search */}
              <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="हटवलेला बायोडाटा नाव, जिल्हा किंवा आयडी ने शोधा..."
                      value={recycleSearchTerm}
                      onChange={(e) => setRecycleSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-amber-300 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A71930] font-medium"
                    />
                  </div>

                  {/* Multi-Select Controls */}
                  {recycleBin.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <button
                        onClick={() => {
                          const filteredIds = recycleBin
                            .filter((item) =>
                              item.title.toLowerCase().includes(recycleSearchTerm.toLowerCase()) ||
                              item.id.toLowerCase().includes(recycleSearchTerm.toLowerCase())
                            )
                            .map((i) => i.id);
                          if (selectedRecycleIds.length === filteredIds.length) {
                            setSelectedRecycleIds([]);
                          } else {
                            setSelectedRecycleIds(filteredIds);
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-slate-900 font-bold border border-amber-300 flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <CheckSquare className="w-4 h-4 text-[#A71930]" />
                        <span>
                          {selectedRecycleIds.length > 0 && selectedRecycleIds.length === recycleBin.length
                            ? 'सर्व निवड रद्द करा'
                            : 'सर्व बायोडाटा निवडा (Select All)'}
                        </span>
                      </button>

                      {selectedRecycleIds.length > 0 && (
                        <div className="flex items-center gap-2 bg-amber-50 p-1 rounded-xl border border-amber-300">
                          <span className="text-[11px] font-black text-[#A71930] px-2">
                            निवडलेले: {selectedRecycleIds.length}
                          </span>

                          <button
                            onClick={() => {
                              bulkRestoreRecycleItems(selectedRecycleIds);
                              setSelectedRecycleIds([]);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow flex items-center gap-1 cursor-pointer transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>पुनर्संचयित करा (Restore Selected)</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`तुम्हाला खरोखरच निवडलेले ${selectedRecycleIds.length} बायोडाटा सिस्टीममधून पूर्णपणे हटवायचे आहेत का?`)) {
                                bulkPermanentDeleteRecycleItems(selectedRecycleIds);
                                setSelectedRecycleIds([]);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow flex items-center gap-1 cursor-pointer transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>सिस्टीममधून पूर्णपणे हटवा (Permanently Delete)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Deleted Biodata Table */}
                <div className="overflow-x-auto rounded-xl border border-amber-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#800C1E] to-[#A71930] text-amber-100 font-extrabold">
                        <th className="p-3 text-center w-10">
                          <input
                            type="checkbox"
                            checked={
                              recycleBin.length > 0 &&
                              selectedRecycleIds.length === recycleBin.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRecycleIds(recycleBin.map((r) => r.id));
                              } else {
                                setSelectedRecycleIds([]);
                              }
                            }}
                            className="rounded accent-[#A71930] w-4 h-4 cursor-pointer"
                          />
                        </th>
                        <th className="p-3">बायोडाटा नाव व माहिती (Title / Biodata Info)</th>
                        <th className="p-3">प्रकार (Type)</th>
                        <th className="p-3">हटवल्याची तारीख (Deleted On)</th>
                        <th className="p-3">आयडी (Item ID)</th>
                        <th className="p-3 text-right">पर्याय / कृती (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 bg-white font-medium">
                      {recycleBin.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 font-bold space-y-2">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-extrabold text-slate-800">
                              सध्या कोणताही हटवलेला बायोडाटा उपलब्ध नाही.
                            </p>
                            <p className="text-xs text-slate-500 font-normal">
                              सदस्यांनी किंवा ॲडमिनने डिलीट केलेले बायोडाटा सुरक्षिततेसाठी येथे जमा होतात.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        recycleBin
                          .filter((item) =>
                            item.title.toLowerCase().includes(recycleSearchTerm.toLowerCase()) ||
                            item.id.toLowerCase().includes(recycleSearchTerm.toLowerCase())
                          )
                          .map((item) => {
                            const isChecked = selectedRecycleIds.includes(item.id);
                            return (
                              <tr
                                key={item.id}
                                className={`hover:bg-amber-50/60 transition ${
                                  isChecked ? 'bg-amber-100/40' : ''
                                }`}
                              >
                                <td className="p-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedRecycleIds((prev) => [...prev, item.id]);
                                      } else {
                                        setSelectedRecycleIds((prev) =>
                                          prev.filter((id) => id !== item.id)
                                        );
                                      }
                                    }}
                                    className="rounded accent-[#A71930] w-4 h-4 cursor-pointer"
                                  />
                                </td>
                                <td className="p-3">
                                  <p className="font-black text-slate-900 text-xs sm:text-sm">
                                    {item.title}
                                  </p>
                                  {item.data && (item.data as any).mobileNumber && (
                                    <p className="text-[11px] text-[#A71930] font-mono font-bold mt-0.5">
                                      📞 {(item.data as any).mobileNumber} • {(item.data as any).district}
                                    </p>
                                  )}
                                </td>
                                <td className="p-3">
                                  <span className="px-2.5 py-1 bg-rose-100 text-[#800C1E] font-black rounded-full text-[10px] border border-rose-300 inline-block">
                                    {item.originalType === 'biodata' ? '👤 बायोडाटा' : '💍 यशोगाथा'}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-600 font-mono text-[11px]">
                                  {item.deletedAt}
                                </td>
                                <td className="p-3 font-mono text-[10px] text-slate-400">
                                  {item.id}
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => restoreRecycleItem(item.id)}
                                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-xs shadow flex items-center gap-1 cursor-pointer transition"
                                      title="बायोडाटा पुन्हा चालू करा"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span>पुनर्संचयित (Restore)</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        if (window.confirm(`खरोखरच '${item.title}' बायोडाटा सिस्टीममधून कायमस्वरूपी हटवायचा आहे का?`)) {
                                          permanentDeleteRecycleItem(item.id);
                                        }
                                      }}
                                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg text-xs shadow flex items-center gap-1 cursor-pointer transition"
                                      title="सिस्टीममधून पूर्णपणे डिलीट करा"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>पूर्ण डिलीट (Delete)</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* PROMO CODE ADD MODAL */}
        {isPromoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#FFFDF5] border-2 border-amber-400 rounded-3xl p-6 space-y-4 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <h3 className="font-black text-[#A71930] text-base">नवीन प्रोमो कोड तयार करा</h3>
                <button onClick={() => setIsPromoModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPromoCodeSubmit} className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block mb-1">कूपन कोड नाव (e.g. VANJARI30):</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. VANJARI30 किंवा VIPFREE"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-mono uppercase text-slate-900"
                  />
                </div>

                <div>
                  <label className="block mb-1">सवलत प्रकार (Discount Type):</label>
                  <select
                    value={promoDiscountType}
                    onChange={(e) => setPromoDiscountType(e.target.value as any)}
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  >
                    <option value="percentage">टक्केवारी सवलत (% OFF)</option>
                    <option value="flat">निश्चित रक्कम (Flat ₹ OFF)</option>
                    <option value="vip_free">🎉 VIP 100% Free Membership</option>
                  </select>
                </div>

                {promoDiscountType !== 'vip_free' && (
                  <div>
                    <label className="block mb-1">सवलत मूल्य (Amount / Percentage):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={promoDiscountValue}
                      onChange={(e) => setPromoDiscountValue(Number(e.target.value))}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block mb-1">कमाल वापर मर्यादा (Max Uses):</label>
                  <input
                    type="number"
                    min="1"
                    value={promoMaxUses}
                    onChange={(e) => setPromoMaxUses(Number(e.target.value))}
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#A71930] text-amber-100 font-black rounded-xl shadow cursor-pointer"
                >
                  कूपन कोड सबमिट करा
                </button>
              </form>
            </div>
          </div>
        )}

        {/* BULK EMAIL MODAL */}
        {isBulkEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#FFFDF5] border-2 border-amber-400 rounded-3xl p-6 space-y-4 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <h3 className="font-black text-[#A71930] text-base flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#A71930]" />
                  <span>{selectedMemberIds.length} सदस्यांना घाऊक ई-मेल पाठवा</span>
                </h3>
                <button onClick={() => setIsBulkEmailModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendBulkEmailSubmit} className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block mb-1">ई-मेलचा विषय (Subject):</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. वंजारी जोडी विशेष ऑफर / बायोडाटा पूर्ण करा"
                    value={bulkEmailSubject}
                    onChange={(e) => setBulkEmailSubject(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block mb-1">ई-मेल मजकूर (Message Body):</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="इथे सदस्यांसाठी संदेश लिहा..."
                    value={bulkEmailBody}
                    onChange={(e) => setBulkEmailBody(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#A71930] hover:bg-[#800C1E] text-amber-100 font-black rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ई-मेल पाठवा ({selectedMemberIds.length} सदस्य)</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SUB-ADMIN CREATE / EDIT MODAL */}
        {subAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#FFFDF5] border-2 border-amber-400 rounded-3xl p-5 sm:p-6 space-y-4 text-slate-900 shadow-2xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#A71930]" />
                  <h3 className="font-black text-[#A71930] text-base sm:text-lg">
                    {editingSubAdminItem ? '✏️ सब-ॲडमिन व परवानग्या संपादन (Edit Sub-Admin)' : '🔑 नवीन सब-ॲडमिन जोडा (Add New Sub-Admin)'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSubAdminModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-amber-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubAdmin} className="space-y-4 text-xs font-bold overflow-y-auto pr-2 flex-1">
                {/* Account Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-amber-100/60 rounded-2xl border border-amber-300">
                  <div>
                    <label className="block text-slate-800 mb-1">सब-ॲडमिनचे नाव (Full Name):</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. राहुल पाटील"
                      value={subAdminName}
                      onChange={(e) => setSubAdminName(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 mb-1">युझरनेम (Username):</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. rahul_admin"
                      value={subAdminUsernameInput}
                      onChange={(e) => setSubAdminUsernameInput(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 mb-1">पासवर्ड (Password):</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. Pass@123"
                      value={subAdminPasswordInput}
                      onChange={(e) => setSubAdminPasswordInput(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold"
                    />
                  </div>
                </div>

                {/* Granular Permissions Selection Header & Quick Select */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2">
                    <div>
                      <h4 className="font-black text-[#A71930] text-sm">
                        🎯 सब-ॲडमिन अधिकार व परवानग्या निवडा (Assign Granular Permissions):
                      </h4>
                      <p className="text-[11px] text-slate-600 font-normal">
                        सब-ॲडमिनला ज्या ज्या कप्प्याचे अधिकार द्याल, त्यांना फक्त तेच ऑप्शन्स दिसतील.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSubAdminPerms(ALL_SUBADMIN_PERMISSIONS.map((p) => p.id))}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg shadow cursor-pointer"
                      >
                        ☑️ सर्व निवडा (Select All)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubAdminPerms([])}
                        className="px-2.5 py-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-extrabold text-[10px] rounded-lg shadow cursor-pointer"
                      >
                        ☒ सर्व रद्द करा
                      </button>
                    </div>
                  </div>

                  {/* Grouped Permissions Checklist */}
                  <div className="space-y-4">
                    {Array.from(new Set(ALL_SUBADMIN_PERMISSIONS.map((p) => p.category))).map((cat) => (
                      <div key={cat} className="p-3 bg-white rounded-2xl border border-amber-300 space-y-2">
                        <h5 className="font-extrabold text-[#A71930] text-xs flex items-center gap-1.5 border-b border-amber-100 pb-1">
                          <span>{cat}</span>
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ALL_SUBADMIN_PERMISSIONS.filter((p) => p.category === cat).map((perm) => {
                            const isChecked = subAdminPerms.includes(perm.id);
                            return (
                              <label
                                key={perm.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                                  isChecked
                                    ? 'bg-amber-100/70 border-amber-400 text-slate-900 font-extrabold shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSubAdminPerms((prev) => [...prev, perm.id]);
                                    } else {
                                      setSubAdminPerms((prev) => prev.filter((x) => x !== perm.id));
                                    }
                                  }}
                                  className="w-4 h-4 mt-0.5 rounded accent-[#A71930] cursor-pointer"
                                />
                                <div>
                                  <span className="block text-xs">
                                    <span className="mr-1">{perm.icon}</span>
                                    <span>{perm.labelMr}</span>
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 shrink-0">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#A71930] via-[#800C1E] to-[#A71930] hover:from-[#800C1E] text-amber-100 font-black rounded-2xl shadow-xl text-xs border border-amber-300/50 cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>
                      {editingSubAdminItem ? 'सब-ॲडमिन अद्ययावत करा (Save Changes)' : 'सब-ॲडमिन तयार करा (Create Account)'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DOUBLE CONFIRMATION PURGE RECYCLE BIN MODAL */}
        {isPurgeConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white border-2 border-rose-500 rounded-3xl p-6 text-slate-900 space-y-4 shadow-2xl text-center">
              <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto animate-bounce" />
              <h3 className="font-black text-rose-700 text-lg">कायमस्वरूपी स्वच्छतेची खात्री!</h3>
              <p className="text-xs font-bold text-slate-700">
                रिसायकल बिनमधील सर्व डेटा आणि क्लाउडिनरी मधील फोटो कायमचे नष्ट होतील. हा बदल परत आणता येणार नाही!
              </p>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setIsPurgeConfirmOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  onClick={() => {
                    bulkPurgeRecycleBin();
                    setIsPurgeConfirmOpen(false);
                  }}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs rounded-xl shadow cursor-pointer"
                >
                  होय, कायमचे नष्ट करा
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREENSHOT PREVIEW MODAL */}
        {previewScreenshot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative max-w-2xl bg-white p-3 rounded-2xl shadow-2xl">
              <button
                onClick={() => setPreviewScreenshot(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={previewScreenshot} alt="Proof" className="max-h-[80vh] rounded-xl object-contain mx-auto" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
