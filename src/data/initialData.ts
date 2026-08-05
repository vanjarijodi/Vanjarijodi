import { UserProfile, SuccessStory, Plan } from '../types';

export const MAHARASHTRA_DISTRICTS = [
  'बीड (Beed)',
  'नाशिक (Nashik)',
  'अहमदनगर (Ahmednagar)',
  'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)',
  'पुणे (Pune)',
  'मुंबई (Mumbai)',
  'जळगाव (Jalgaon)',
  'लातूर (Latur)',
  'नांदेड (Nanded)',
  'सोलापूर (Solapur)',
  'ठाणे (Thane)',
  'धुळे (Dhule)',
  'परभणी (Parbhani)',
  'हिंगोली (Hingoli)',
  'धाराशिव (Dharashiv/Osmanabad)',
  'नागपूर (Nagpur)',
  'सांगली (Sangli)',
  'सातारा (Satara)',
  'इतर (Other)',
];

export const INITIAL_PROFILES: UserProfile[] = [];

export const SUCCESS_STORIES: SuccessStory[] = [];

export const MEMBERSHIP_PLANS: Plan[] = [
  {
    id: 'silver',
    name: 'Silver Plan',
    nameMr: 'सिल्व्हर प्लॅन (३ महिने)',
    price: 499,
    durationMonths: 3,
    features: [
      '25 Contact Number Unlocks',
      'Unlimited Interest Requests',
      'Profile Badge Verified',
      'Horoscope View',
      'Basic Search Filters'
    ],
    featuresMr: [
      '२५ मोबाईल नंबर संपर्क अनलॉक',
      'अनलिमिटेड प्रतिसाद (Interests) पाठवा',
      'प्रमाणित (Verified) प्रोफाईल बॅज',
      'पत्रिका / कुंडली डाउनलोड पर्याय',
      'बेसिक शोध आणि फिल्टर'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Plan',
    nameMr: 'गोल्ड प्लॅन (६ महिने)',
    price: 999,
    durationMonths: 6,
    recommended: true,
    features: [
      '75 Contact Number Unlocks',
      'Unlimited WhatsApp Direct Chat',
      'Featured Profile on Homepage',
      'Priority Customer Support',
      'Video Call Option',
      'Instant SMS/Push Notifications'
    ],
    featuresMr: [
      '७५ मोबाईल नंबर संपर्क अनलॉक',
      'थेट व्हॉट्सॲप चॅट (Unlimited Chat)',
      'मुख्यपृष्ठावर विशेष वैशिष्ट्यीकृत (Featured)',
      'प्राधान्य ग्राहक मदत सेवा',
      'व्हिडिओ कॉल सुविधा',
      'त्वरित पुश आणि SMS नोटिफिकेशन्स'
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond Plan',
    nameMr: 'डायमंड प्लॅन (१२ महिने - अमर्यादित)',
    price: 1499,
    durationMonths: 12,
    features: [
      'Unlimited Contact Number Unlocks',
      'Unlimited WhatsApp Chat & Video Calls',
      'Top Priority Search Listing',
      'Personal Matchmaking Manager Assistance',
      'Complete Privacy Control',
      'Aadhaar Verification Badge Guarantee'
    ],
    featuresMr: [
      'अमर्यादित (Unlimited) मोबाईल नंबर अनलॉक',
      'अमर्यादित व्हॉट्सॲप चॅट व व्हिडिओ कॉल',
      'शोध निकालात प्रथम स्थान (Top Priority)',
      'वैयक्तिक मॅचमेकिंग सहाय्यक मार्गदर्शन',
      'पूर्ण गोपनीयता नियंत्रण (Hide Photos/Phone)',
      'आधार व्हेरीफाईड बॅज गॅरंटी'
    ]
  }
];

export const INITIAL_COMMUNITY_ADS: any[] = [
  {
    id: 'ad-1',
    title: 'महा-वंजारी राज्यस्तरीय वधू-वर पालक परिचय मेळावा २०२६',
    description: 'बीड, नाशिक, अहमदनगर, संभाजीनगर, पुणे व मुंबई भागातील वधू-वर व पालकांसाठी भव्य राज्यस्तरीय परिचय मेळावा. मोफत बायोडाटा पुस्तक वाटप व प्रत्यक्ष गाठीभेटी.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    type: 'meetup',
    contactPhone: '+91 98221 00000',
    categoryTag: 'वधू-वर मेळावा',
    badgeText: 'विशेष मेळावा 🎯',
    linkUrl: 'https://wa.me/919822100000?text=मेळावा_नोंदणी',
    priority: 1,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-2',
    title: 'भगवान बाबा मॅरेज हॉल व राजेशाही लॉन्स',
    description: 'एसी बँक्वेट हॉल, ४००० लोकांची पंगत व्यवस्था, प्रशस्त पार्किंग, ५० लक्झरी रूम्स व २४ तास जनरेटर बॅकअप. वंजारी समाज बांधवांसाठी विशेष सवलत.',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
    type: 'sponsor',
    contactPhone: '+91 94222 11111',
    categoryTag: 'मंगल कार्यालय',
    badgeText: '२०% सवलत 💎',
    linkUrl: 'https://wa.me/919422211111?text=हॉल_बुकिंग',
    priority: 2,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-3',
    title: 'रॉयल वंजारी कॅमेरा व व्हिडिओग्राफी स्टुडिओ',
    description: '४K सिनेमॅटिक प्री-वेडिंग शुटींग, ड्रोन व्हिडिओग्राफी, वेडिंग लाईव्ह स्ट्रीमिंग व आधुनिक अल्बम डिझाईन. संपूर्ण महाराष्ट्रात उपलब्ध.',
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1200',
    type: 'business',
    contactPhone: '+91 98900 22222',
    categoryTag: 'फोटोग्राफी',
    badgeText: '४K सिनेमॅटिक 🎥',
    linkUrl: 'https://wa.me/919890022222?text=फोटोग्राफी_चौकशी',
    priority: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-4',
    title: 'गोपीनाथजी मुंडे आयएएस कोचिंग व स्पर्धा परीक्षा अकॅडमी',
    description: 'UPSC/MPSC स्पर्धा परीक्षा तयारी, मोफत वसतिगृह व अभ्यासीका सुविधा. उच्चशिक्षित अधिकारी व तज्ज्ञ मार्गदर्शकांचे मार्गदर्शन.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    type: 'banner',
    contactPhone: '+91 97630 33333',
    categoryTag: 'शिक्षण व करिअर',
    badgeText: 'मोफत मार्गदर्शन 🎓',
    linkUrl: 'https://wa.me/919763033333?text=अकॅडमी_चौकशी',
    priority: 4,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CONTACT_REQUESTS: any[] = [];

export const INITIAL_HERO_SLIDES: any[] = [
  {
    id: 'slide-1',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1920',
    title: 'विश्वासार्ह वंजारी विवाह मंच',
    subtitle: 'सत्यापित वधू-वरांची माहिती • सुरक्षित • गोपनीय'
  },
  {
    id: 'slide-2',
    imageUrl: 'https://images.unsplash.com/photo-1621801306175-312f2791be28?auto=format&fit=crop&q=80&w=1920',
    title: 'योग्य जोडीदार शोधण्याची पहिली पायरी',
    subtitle: '१००% आधार व प्रशासकीय पडताळणी केलेले प्रोफाईल्स'
  },
  {
    id: 'slide-3',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1920',
    title: 'संत भगवान बाबांच्या आशीर्वादाने स्थापित',
    subtitle: 'वंजारी समाजातील हजारो यशस्वी जोडप्यांची पहिली निवड'
  }
];

export const INITIAL_COUNTERS: any[] = [
  { id: 'c-1', label: 'Registered Members', labelMr: 'नोंदणीकृत वधू-वर', value: '१२,५००+', iconName: 'Users' },
  { id: 'c-2', label: 'Happy Couples', labelMr: 'यशस्वी विवाह', value: '३,८५०+', iconName: 'Heart' },
  { id: 'c-3', label: 'Districts Covered', labelMr: 'जिल्हे समाविष्ट', value: '३६+', iconName: 'MapPin' },
  { id: 'c-4', label: 'Verification Rate', labelMr: 'आधार पडताळणी', value: '१००%', iconName: 'ShieldCheck' }
];

export const INITIAL_SITE_CONFIG: any = {
  topBarText: '॥ श्री संत भगवान बाबा प्रसन्न ॥ — संत भगवान बाबा यांच्या आशीर्वादाने',
  logoTitle: 'वंजारी जोडी',
  logoSubtitle: 'विश्वासार्ह वंजारी विवाह मंच',
  logoUrl: '',
  logoHeight: 52,
  paymentQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=vanjarijodi@upi&pn=VanjariJodi%20Matrimony',
  paymentUpiId: 'vanjarijodi@upi',
  paymentNote: 'PhonePe / Google Pay / Paytm द्वारे क्यूआर कोड स्कॅन करून किंवा UPI ID वर पेमेंट करा व UTR नंबर सादर करा.',
  heroHeading: 'वंजारी समाजातील वधू-वर शोधा',
  heroSubheading: 'संत भगवान बाबा यांच्या आशीर्वादाने स्थापित मनपसंत आणि विश्वासू वंजारी विवाह मंच',
  heroDescription: 'हजारो विश्वासू वंजारी कुटुंब जोडणारा महाराष्ट्रातील नंबर १ विवाह मंच',
  ctaButtonText: 'मोफत नोंदणी करा',
  contactPhone: '+91 98221 00000',
  contactWhatsapp: '+91 98221 00000',
  contactEmail: 'contact@vanjarijodi.org',
  contactAddress: 'परळी वैजनाथ / नाशिक / पुणे, महाराष्ट्र',
  aboutUsText: 'वंजारी जोडी हे वंजारी समाजातील वधू-वर आणि त्यांच्या कुटुंबांना परस्परांशी संपर्क साधण्यासाठी उपलब्ध करून दिलेले एक डिजिटल व्यासपीठ आहे.',
  disclaimerText: "महत्त्वाची सूचना / टीप: 'वंजारी जोडी' हे केवळ वधू-वरांना आणि त्यांच्या कुटुंबांना परस्परांशी संपर्क साधण्यासाठी उपलब्ध करून दिलेले एक डिजिटल व्यासपीठ आहे. या मंचावर नोंदणी केलेल्या कोणत्याही प्रोफाईलची माहिती, कौटुंबिक पार्श्वभूमी, आर्थिक किंवा शैक्षणिक कागदपत्रांची पडताळणी आम्ही करत नाही. त्यामुळे कोणताही विवाह निश्चित करण्यापूर्वी किंवा आर्थिक व्यवहार करण्यापूर्वी वधू आणि वराच्या पालकांनी/कुटुंबीयांनी स्वतःच्या स्तरावर सर्व माहितीची प्रत्यक्ष खात्री (Verification) करून घ्यावी.",
  isSuccessStoriesEnabled: true,
  isAdsEnabled: true,
  isPaidPlansEnabled: false,
  isCountersEnabled: true,
  hidePhoneNumbersGlobal: false,
  hideFullAddressGlobal: false,
  enableProfileLiking: true,
  enableChatGlobal: true,
  blockContactSharingInChat: true,
  showDistrictFilter: true,
  showProfilesOnIndexPage: false,
  hideEmptyProfilesSection: false,
  blurProfilePhotos: false,
  photoBlurPercent: 30,
  blurProfileNames: false,
  blurEducation: false,
  blurOccupation: false,
  blurIncome: false,
  blurRepresentativeNames: false,
  enableGuestLogin: true,
  autoApproveLikes: true,
  showLikesToUsers: true,
  tickerText: '📢 विशेष घोषणा: वंजारी जोडी वधू-वर मेळावा २०२६ नोंदणी सुरू आहे! सर्व प्रोफाईल्स आधार पडताळणी केलेले आहेत.',
  isTickerEnabled: true,
  specialNoticeTitle: 'महत्त्वाची सूचना व विशेष घोषणा',
  specialNoticeText: 'वंजारी समाजातील सर्व पालकांनी कृपया नोंद घ्यावी: आपल्या पाल्यांची नोंदणी करताना आधार कार्ड व अचूक शैक्षणिक माहिती सादर करावी.',
  isSpecialNoticeEnabled: true,
  hideContactAndAddressGlobal: false,
  hideDistrictHeadquarters: false,
  hideOfficeAddress: false,
  guestBannerTitle: 'वंजारीजोडी वधू-वर सूचक केंद्र (Guest Preview)',
  guestBannerText: 'तुमचा योग्य जीवनसाथी शोधण्यासाठी आजच मोफत नोंदणी करा! संपूर्ण प्रोफाईल आणि संपर्क क्रमांक पाहण्यासाठी येथे क्लिक करा.',
  guestBannerButtonText: 'लॉगिन / मोफत नोंदणी करा',
  enableGuestBannerTrigger: true,
  unlockContactFee: 50,
  isPayPerContactEnabled: true,
  isOfferModeEnabled: false,
  offerModeText: '🎉 विशेष सण ऑफर: सध्या सर्व संपर्क अन-लॉक आणि नोंदणी पूर्णपणे मोफत!',
  disableAllPaymentsInOfferMode: true,
  isNoticeBannerEnabled: true,
  noticeBannerText: '📢 विशेष ऑफर: वंजारी समाजातील सर्व वधू-वरांसाठी या आठवड्यात मोफत नोंदणी आणि संपर्क अनलॉक सुविधा सुरू आहे!',
  noticeBannerBg: 'saffron',
  guestPermissions: {
    viewProfiles: true,
    searchFilters: true,
    kundaliView: false,
    expressInterest: false,
    viewPhotos: true,
    directChat: false
  },
  regOption1Title: '१. मॅन्युअल नोंदणी / फॉर्म भरा',
  regOption1Icon: '📝',
  regOption2Title: '२. फोटो किंवा PDF द्वारे नोंदणी',
  regOption2Icon: '📁',
  metaTitle: 'वंजारी जोडी (VanjariJodi) - विश्वासू वंजारी विवाह मंच',
  metaDescription: 'वंजारी समाजातील वधू-वरांचे नंबर १ विवाह पोर्टल. संत भगवान बाबा यांच्या आशीर्वादाने.',
  metaKeywords: 'वंजारी जोडी, वंजारी विवाह, Vanjari Jodi, Vanjari Matrimony',
  adminCredentials: {
    name: 'मुख्य मास्टर ॲडमिन',
    username: 'admin',
    password: 'password'
  },
  apkSettings: {
    apkUrl: 'https://vanjarijodi.org/downloads/VanjariJodi_v2.5.0.apk',
    appVersion: 'v2.5.0',
    isEnabled: true,
    releaseNotes: 'नवीन अपडेट v2.5.0: Android 14 सुसंगतता, वेगवान बिल्ड सिस्टीम, सुधारित UI/UX अनुभव आणि ऑप्टिमाइज्ड डेटा सिंक.',
    downloadCount: 14650,
    fileSizeMb: '12.8 MB'
  },
  socialLinks: [
    {
      id: 'soc-1',
      platform: 'telegram',
      name: 'टेलिग्राम चॅनल',
      iconName: 'Send',
      width: 24,
      height: 24,
      link: 'https://t.me/vanjarijodi_official',
      isEnabled: true
    },
    {
      id: 'soc-2',
      platform: 'whatsapp',
      name: 'व्हॉट्सॲप ग्रूप',
      iconName: 'MessageCircle',
      width: 24,
      height: 24,
      link: 'https://wa.me/919822100000',
      isEnabled: true
    },
    {
      id: 'soc-3',
      platform: 'facebook',
      name: 'फेसबुक पेज',
      iconName: 'Facebook',
      width: 24,
      height: 24,
      link: 'https://facebook.com/vanjarijodimatrimony',
      isEnabled: true
    },
    {
      id: 'soc-4',
      platform: 'instagram',
      name: 'इन्स्टाग्राम प्रोफाइल',
      iconName: 'Instagram',
      width: 24,
      height: 24,
      link: 'https://instagram.com/vanjarijodi',
      isEnabled: true
    }
  ],
  featureBoxes: [
    {
      id: 'box-1',
      title: 'सत्यपित प्रोफाइल (100% Verified)',
      desc: 'आधार कार्ड व ऑनलाईन पडताळणी केलेले अस्सल वंजारी वधू-वर बायोडाटा.',
      iconName: 'ShieldCheck',
      isEnabled: true
    },
    {
      id: 'box-2',
      title: 'संपूर्ण गोपनीयता (100% Privacy)',
      desc: 'तुमचे फोटो, मोबाईल नंबर व पत्ता तुमच्या परवानगीनेच इतरांना दिसतो.',
      iconName: 'Lock',
      isEnabled: true
    },
    {
      id: 'box-3',
      title: 'सुरक्षित संपर्क (Direct Contact)',
      desc: 'थेट पालकांशी किंवा वधू-वरांशी थेट संवाद साधण्याची सोपी यंत्रणा.',
      iconName: 'PhoneCall',
      isEnabled: true
    },
    {
      id: 'box-4',
      title: 'मोफत नोंदणी व विवाह जोडी',
      desc: 'संत भगवान बाबा यांच्या आशीर्वादाने समाजातील हजारो यशस्वी विवाह.',
      iconName: 'Heart',
      isEnabled: true
    }
  ]
};

export const INITIAL_FACE_VERIFICATIONS: any[] = [];

export const INITIAL_PAYMENT_REQUESTS: any[] = [];

export const INITIAL_SUB_ADMINS: any[] = [];

export const INITIAL_PROMO_CODES: any[] = [];

export const INITIAL_PENDING_PROFILES: any[] = [];

export const COMMUNITY_FAQS = [

  {
    qMr: 'वंजारीजोडी वर नोंदणी कशी करावी?',
    qEn: 'How to register on VanjariJodi?',
    aMr: 'मुख्यपृष्ठावरील "मोफत नोंदणी" बटनावर क्लिक करा. तुमची वैयक्तिक माहिती, शिक्षण, व्यवसाय, पत्ता आणि फोटो अपलोड करून ५ सोप्या टप्प्यात नोंदणी पूर्ण करा.',
    aEn: 'Click on "Free Register" button on homepage. Fill your basic details, education, occupation, address, and photos in 5 easy steps.'
  },
  {
    qMr: 'प्रोफाईल पडताळणी कशी होते?',
    qEn: 'How is profile verification done?',
    aMr: 'आमची ॲडमिन टीम मोबाईल नंबर OTP, ओळखपत्र आणि आधार कार्डच्या आधारे प्रत्येक प्रोफाईलची सत्यता तपासून पाहते. त्यानंतरच प्रोफाईलवर "प्रमाणित (Verified)" बॅज दिला जातो.',
    aEn: 'Our admin team verifies each profile using Mobile OTP, ID Proof, and Aadhaar Card. Once verified, a Verified Badge is awarded.'
  },
  {
    qMr: 'मी संपर्क क्रमांक कसा मिळवू शकतो/शकते?',
    qEn: 'How can I unlock contact numbers?',
    aMr: 'तुम्ही प्रीमियम मेम्बरशिप (सिल्व्हर, गोल्ड किंवा डायमंड) घेऊन कोणत्याही वधू किंवा वराचा थेट मोबाईल नंबर आणि व्हॉट्सॲप नंबर अनलॉक करू शकता.',
    aEn: 'You can upgrade to a Premium Plan (Silver, Gold, or Diamond) to instantly unlock mobile numbers and WhatsApp contact info.'
  },
  {
    qMr: 'माझी माहिती आणि फोटो सुरक्षित राहतील का?',
    qEn: 'Will my data and photos remain secure?',
    aMr: 'होय, वंजारीजोडी पूर्णपणे सुरक्षित व्यासपीठ आहे. तुमच्या डॅशबोर्डवरील गोपनीयता (Privacy) सेटिंग्जमधून तुम्ही तुमचे फोटो किंवा फोन नंबर लपवू शकता.',
    aEn: 'Yes, VanjariJodi uses high security standard. You can control photo visibility and phone privacy from your Dashboard settings.'
  }
];
