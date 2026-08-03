export type Language = 'mr' | 'en';

export type ThemeMode = 'crimson-gold' | 'dark-obsidian' | 'classic-emerald';

export type Gender = 'bride' | 'groom';

export type MaritalStatus = 'never_married' | 'divorced' | 'widowed' | 'awaiting_divorce';

export type MembershipTier = 'free' | 'silver' | 'gold' | 'diamond';

export interface ContactRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterMobile?: string;
  targetProfileId: string;
  targetProfileName: string;
  status: 'pending' | 'authorized' | 'rejected';
  createdAt: string;
  note?: string;
}

export interface CommunityAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  type: 'banner' | 'meetup' | 'sponsor';
  isActive: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  gender: Gender;
  dob: string;
  age: number;
  birthTime?: string;
  birthPlace?: string;
  mobile: string;
  secondaryMobile?: string;
  email: string;
  district: string;
  taluka: string;
  city: string;
  currentAddress?: string;
  nativeAddress?: string;
  education: string;
  occupation: string;
  companyName?: string;
  income: string;
  height: string;
  weight: string;
  bloodGroup: string;
  complexion?: string; // गोरा, निमगोरा, गव्हाळ, सावळा
  maritalStatus: MaritalStatus;
  religion: string;
  subCaste: string;
  gotra?: string;
  rashi?: string;
  nakshatra?: string;
  gan?: string;
  nadi?: string;
  fatherName?: string;
  fatherOccupation: string;
  motherName?: string;
  motherOccupation: string;
  brothers: number;
  brotherDetails?: string;
  sisters: number;
  sisterDetails?: string;
  relativeSurnames?: string[]; // e.g. ["मुंडे", "सानप", "नागरे", "काकड", "घूगे"]
  mamaName?: string;
  mamaNative?: string;
  familyType: string;
  expectations: string;
  photos: string[];
  horoscopeUrl?: string;
  aadhaarVerified: boolean;
  isFaceVerified?: boolean;
  faceVerifiedAt?: string;
  idProofUrl?: string;
  isVerified: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  membership: MembershipTier;
  createdAt: string;
  lastActive: string;
  bio?: string;
  privacy: {
    hideContact: boolean;
    hidePhoto: boolean;
  };
  registrationType?: 'manual' | 'ocr_ai' | 'admin_direct';
  isRegisteredByAdmin?: boolean;
  isChatBlocked?: boolean;
  isBlocked?: boolean;
  isCustomAccessGranted?: boolean;
  isHiddenByAdmin?: boolean;
  viewsCount?: number;
  pendingPhotoApproval?: boolean;
  aadhaarCardUrl?: string;
}

export interface ProfileRemovalRequest {
  id: string;
  profileId: string;
  profileName: string;
  profileMobile: string;
  reason: 'marriage_fixed' | 'personal_reasons' | 'other';
  partnerDetails?: string;
  feedbackText?: string; // Feedback/review for home page success story
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface SuccessStory {
  id: string;
  coupleName: string;
  marriageDate: string;
  district: string;
  image: string;
  story: string;
  storyMr: string;
  status?: 'pending' | 'approved' | 'rejected';
  submittedByUserId?: string;
  submittedByUserName?: string;
  partnerProfileId?: string;
  createdAt?: string;
}

export interface Plan {
  id: MembershipTier;
  name: string;
  nameMr: string;
  price: number;
  durationMonths: number;
  features: string[];
  featuresMr: string[];
  recommended?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  imageUrl?: string;
  voiceUrl?: string;
}

export interface Interest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  titleMr: string;
  message: string;
  messageMr: string;
  type: 'interest' | 'chat' | 'system' | 'approval';
  createdAt: string;
  isRead: boolean;
}

export interface AdminStats {
  totalMembers: number;
  totalBrides: number;
  totalGrooms: number;
  totalMarriages: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  activeChats: number;
}

export interface SearchFilterState {
  gender: Gender | 'all';
  minAge: number;
  maxAge: number;
  district: string;
  taluka: string;
  education: string;
  occupation: string;
  income: string;
  maritalStatus: string;
  subCaste: string;
  verifiedOnly: boolean;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

export interface CounterItem {
  id: string;
  label: string;
  labelMr: string;
  value: string;
  iconName: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  planId: MembershipTier;
  planName: string;
  amount: number;
  utrNumber: string;
  screenshotUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface GuestPermissions {
  viewProfiles: boolean;
  searchFilters: boolean;
  kundaliView: boolean;
  expressInterest: boolean;
  viewPhotos: boolean;
  directChat: boolean;
}

export interface PayPerContactRequest {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  targetProfileId: string;
  targetProfileName: string;
  targetProfileMobile?: string;
  amount: number;
  utrNumber: string;
  screenshotUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface GuestSessionLog {
  sessionId: string;
  guestName?: string;
  guestMobile?: string;
  location?: string;
  deviceInfo: string;
  ipAddress: string;
  firstVisitTime: string;
  lastActiveTime: string;
  status?: 'active' | 'logged_out';
  pagesViewed: string[];
  actionsTaken: string[];
}

export interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  userMobile?: string;
  userType: 'registered' | 'guest';
  action: string;
  details: string;
  timestamp: string;
}

export interface AdminSupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  isReadByAdmin: boolean;
  isReadByUser: boolean;
  userMobile?: string;
  isArchived?: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat' | 'vip_free';
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PendingProfileEdit {
  id: string;
  profileId: string;
  profileName: string;
  mobile: string;
  originalData: Partial<UserProfile>;
  updatedData: Partial<UserProfile>;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface RecycleBinItem {
  id: string;
  originalType: 'biodata' | 'photo' | 'story';
  title: string;
  deletedAt: string;
  data: any;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
}

export interface FaceVerificationLog {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  capturedPhotoUrl: string;
  profilePhotoUrl?: string;
  matchScore: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: 'telegram' | 'whatsapp' | 'facebook' | 'instagram' | 'youtube' | 'custom';
  name: string;
  iconName?: string;
  iconUrl?: string;
  width: number;
  height: number;
  link: string;
  isEnabled: boolean;
}

export interface ApkSettings {
  apkUrl: string;
  appVersion: string;
  isEnabled: boolean;
  releaseNotes?: string;
  downloadCount?: number;
  fileSizeMb?: string;
}

export type SubAdminPermission = 
  | 'manage_profiles'
  | 'add_profiles'
  | 'member_access_control'
  | 'payment_requests'
  | 'pricing_plans'
  | 'auto_mode_master'
  | 'face_verification'
  | 'apk_manager'
  | 'index_controls'
  | 'support_chat'
  | 'branding'
  | 'guest_permissions'
  | 'user_analytics'
  | 'promo_codes'
  | 'recycle_bin'
  | 'audit_logs'
  | 'site_settings'
  | 'sub_admins';

export interface SubAdmin {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'primary_admin' | 'sub_admin';
  permissions: SubAdminPermission[];
  createdAt: string;
}

export interface FeatureBoxItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  isEnabled: boolean;
}

export interface PendingLike {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SiteConfig {
  topBarText: string;
  logoTitle: string;
  logoSubtitle: string;
  logoUrl?: string;
  logoHeight?: number;
  logoWidth?: number;
  paymentQrUrl?: string;
  paymentUpiId?: string;
  paymentNote?: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription?: string;
  ctaButtonText: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  contactAddress: string;
  contactHeaderTitle?: string;
  contactHeaderSubtitle?: string;
  aboutUsText: string;
  disclaimerText: string;
  isSuccessStoriesEnabled: boolean;
  isAdsEnabled: boolean;
  isPaidPlansEnabled: boolean;
  isCountersEnabled: boolean;
  hidePhoneNumbersGlobal?: boolean;
  hideFullAddressGlobal?: boolean;
  enableProfileLiking?: boolean;
  autoApproveLikes?: boolean;
  showLikesToUsers?: boolean;
  enableChatGlobal?: boolean;
  blockContactSharingInChat?: boolean;
  showDistrictFilter?: boolean;
  showProfilesOnIndexPage?: boolean;
  blurProfilePhotos?: boolean;
  photoBlurPercent?: number;
  blurProfileNames?: boolean;
  blurNamePercent?: number;
  blurMobilePercent?: number;
  blurEducation?: boolean;
  blurOccupation?: boolean;
  blurIncome?: boolean;
  blurRepresentativeNames?: boolean;
  disablePhotoDownloadAndScreenshot?: boolean;
  enableGuestLogin?: boolean;
  tickerText?: string;
  isTickerEnabled?: boolean;
  specialNoticeTitle?: string;
  specialNoticeText?: string;
  isSpecialNoticeEnabled?: boolean;
  hideContactAndAddressGlobal?: boolean;
  hidePaymentDetailsGlobal?: boolean;
  hideDistrictHeadquarters?: boolean;
  hideOfficeAddress?: boolean;
  enableAadhaarVerification?: boolean;
  guestBannerTitle?: string;
  guestBannerText?: string;
  guestBannerButtonText?: string;
  enableGuestBannerTrigger?: boolean;
  unlockContactFee?: number;
  isPayPerContactEnabled?: boolean;
  isOfferModeEnabled?: boolean;
  offerModeText?: string;
  disableAllPaymentsInOfferMode?: boolean;
  isAutoModeEnabled?: boolean;
  autoModeType?: 'payment_required' | 'free_for_all';
  autoApproveNewRegistrations?: boolean;
  autoUnlockOnPayment?: boolean;
  freeForAllMode?: boolean;
  autoModeForGuests?: boolean;
  autoShowTotalMetrics?: boolean;
  guestPermissions?: GuestPermissions;
  isNoticeBannerEnabled?: boolean;
  noticeBannerText?: string;
  noticeBannerBg?: 'saffron' | 'emerald' | 'crimson' | 'maroon';
  regOption1Title?: string;
  regOption1Icon?: string;
  regOption2Title?: string;
  regOption2Icon?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  adminCredentials?: {
    name: string;
    username: string;
    password: string;
  };
  apkSettings?: ApkSettings;
  socialLinks?: SocialLinkItem[];
  featureBoxes?: FeatureBoxItem[];
}

