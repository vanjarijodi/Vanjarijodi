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

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'vj-101',
    fullName: 'पूजा भगवान सानप (Pooja Bhagwan Sanap)',
    gender: 'bride',
    dob: '1998-05-14',
    age: 26,
    mobile: '+91 98221 45890',
    email: 'pooja.sanap@example.com',
    district: 'बीड (Beed)',
    taluka: 'परळी वैजनाथ (Parli Vaijnath)',
    city: 'परळी (Parli)',
    education: 'M.Tech in Computer Engineering',
    occupation: 'Senior Software Engineer in MNC, Pune',
    income: '₹ 12 - 15 लाख वार्षिक',
    height: "5'4\"",
    weight: '55',
    bloodGroup: 'B+',
    maritalStatus: 'never_married',
    religion: 'हिंदू (Hindu)',
    subCaste: 'वंजारी (रावजिन वंजारी)',
    gotra: 'काश्यप',
    fatherOccupation: 'तहसीलदार (Class 1 Govt Officer)',
    motherOccupation: 'गृहिणी',
    brothers: 1,
    sisters: 0,
    familyType: 'एकत्र कुटुंब (Joint Family)',
    expectations: 'सुशिक्षित, निर्व्यसनी, पुण्यामध्ये कार्यरत, कौटुंबिक मूल्यांचा आदर करणारा वंजारी समाजातील सुसंस्कृत वर हवा.',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
    ],
    horoscopeUrl: '#',
    aadhaarVerified: true,
    isVerified: true,
    isFeatured: true,
    isApproved: true,
    membership: 'diamond',
    createdAt: '2026-01-10',
    lastActive: '२ मिनिटांपूर्वी',
    bio: 'शांत, सुसंस्कृत आणि करिअर ओरिएंटेड मुलगी. संगणक अभियंता म्हणून पुण्यामध्ये कार्यरत. धार्मिक आणि कौटुंबिक विचारसरणी.',
    privacy: { hideContact: false, hidePhoto: false }
  },
  {
    id: 'vj-102',
    fullName: 'अविनाश गोपीनाथ फड (Avinash Gopinath Phad)',
    gender: 'groom',
    dob: '1995-11-20',
    age: 29,
    mobile: '+91 97632 11098',
    email: 'avinash.phad@example.com',
    district: 'नाशिक (Nashik)',
    taluka: 'सिन्नर (Sinner)',
    city: 'नाशिक (Nashik)',
    education: 'MBBS, MD (General Medicine)',
    occupation: 'सहाय्यक प्राध्यापक व डॉक्टर (सरकारी रुग्णालय)',
    income: '₹ 20 - 25 लाख वार्षिक',
    height: "5'10\"",
    weight: '72',
    bloodGroup: 'O+',
    maritalStatus: 'never_married',
    religion: 'हिंदू (Hindu)',
    subCaste: 'वंजारी (लाड वंजारी)',
    gotra: 'भारद्वाज',
    fatherOccupation: 'निवृत्त मुख्य मुख्याध्यापक',
    motherOccupation: 'शिक्षिका',
    brothers: 0,
    sisters: 1,
    familyType: 'विभक्त कुटुंब (Nuclear Family)',
    expectations: 'डॉक्टर, इंजिनिअर किंवा पदव्युत्तर शिक्षण झालेली, नम्र आणि समंजस वंजारी वधू अपेक्षित.',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'
    ],
    horoscopeUrl: '#',
    aadhaarVerified: true,
    isVerified: true,
    isFeatured: true,
    isApproved: true,
    membership: 'gold',
    createdAt: '2026-02-01',
    lastActive: '१० मिनिटांपूर्वी',
    bio: 'वैद्यकीय क्षेत्रात कार्यरत. नाशिकमध्ये स्वतःचे क्लिनिक व सरकारी रुग्णालयात सेवा. धार्मिक विचार व भगवान बाबांवर असीम श्रद्धा.',
    privacy: { hideContact: false, hidePhoto: false }
  },
  {
    id: 'vj-103',
    fullName: 'स्नेहल रामभाऊ कराड (Snehal Rambhau Karad)',
    gender: 'bride',
    dob: '1999-08-04',
    age: 25,
    mobile: '+91 94227 88910',
    email: 'snehal.karad@example.com',
    district: 'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)',
    taluka: 'पैठण (Paithan)',
    city: 'छत्रपती संभाजीनगर',
    education: 'B.Sc Agriculture, MBA (Agri-Business)',
    occupation: 'कृषी अधिकारी (MPSC उत्तीर्ण class 2)',
    income: '₹ 8 - 10 लाख वार्षिक',
    height: "5'3\"",
    weight: '52',
    bloodGroup: 'A+',
    maritalStatus: 'never_married',
    religion: 'हिंदू (Hindu)',
    subCaste: 'वंजारी',
    gotra: 'वशिष्ठ',
    fatherOccupation: 'प्रगतशील शेतकरी व कृषी व्यावसायिक',
    motherOccupation: 'गृहिणी',
    brothers: 1,
    sisters: 1,
    familyType: 'एकत्र कुटुंब',
    expectations: 'सरकारी सेवेत किंवा चांगल्या कंपनीत कार्यरत असलेला, सुसंस्कृत आणि सुशिक्षित वंजारी वर.',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
    ],
    horoscopeUrl: '#',
    aadhaarVerified: true,
    isVerified: true,
    isFeatured: false,
    isApproved: true,
    membership: 'silver',
    createdAt: '2026-02-15',
    lastActive: '१ तासापूर्वी',
    bio: 'MPSC परीक्षेद्वारे शासकीय सेवेत निवड. शेती आणि आधुनिक विचारांची सांगड घालणारी मनमिळावू मुलगी.',
    privacy: { hideContact: false, hidePhoto: false }
  },
  {
    id: 'vj-104',
    fullName: 'प्रशांत उत्तमराव आंधळे (Prashant Uttamrao Andhale)',
    gender: 'groom',
    dob: '1996-03-22',
    age: 28,
    mobile: '+91 99210 33451',
    email: 'prashant.andhale@example.com',
    district: 'अहमदनगर (Ahmednagar)',
    taluka: 'पाथर्डी (Pathardi)',
    city: 'अहमदनगर',
    education: 'BE Civil, M.Tech (Structural Engg)',
    occupation: 'क्लास-१ कॉन्ट्रॅक्टर व रिअल इस्टेट व्यावसायिक',
    income: '₹ 30+ लाख वार्षिक',
    height: "5'11\"",
    weight: '76',
    bloodGroup: 'AB+',
    maritalStatus: 'never_married',
    religion: 'हिंदू (Hindu)',
    subCaste: 'वंजारी (मठवंजारी)',
    gotra: 'शांडिल्य',
    fatherOccupation: 'माजी सभापती व समाजसेवक',
    motherOccupation: 'गृहिणी',
    brothers: 1,
    sisters: 0,
    familyType: 'एकत्र कुटुंब',
    expectations: 'पदवीधर किंवा पदव्युत्तर शिक्षण घेतलेली, कौटुंबिक आणि प्रेमळ वंजारी मुलगी.',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'
    ],
    horoscopeUrl: '#',
    aadhaarVerified: true,
    isVerified: true,
    isFeatured: true,
    isApproved: true,
    membership: 'diamond',
    createdAt: '2026-01-20',
    lastActive: '३ तासांपूर्वी',
    bio: 'अहमदनगरमध्ये स्वतःचा सिव्हिल कन्सल्टन्सी व कन्स्ट्रक्शन व्यवसाय. समाजकार्याची आवड.',
    privacy: { hideContact: false, hidePhoto: false }
  },
  {
    id: 'vj-105',
    fullName: 'निकिता शिवाजी तांबडे (Nikita Shivaji Tambade)',
    gender: 'bride',
    dob: '2000-01-12',
    age: 24,
    mobile: '+91 96541 22334',
    email: 'nikita.tambade@example.com',
    district: 'पुणे (Pune)',
    taluka: 'हवेली (Haveli)',
    city: 'पुणे (पिंपरी चिंचवड)',
    education: 'B.Pharm, MBA (Pharma Tech)',
    occupation: 'QA Lead - Serum Institute Pune',
    income: '₹ 9 - 11 लाख वार्षिक',
    height: "5'5\"",
    weight: '53',
    bloodGroup: 'B+',
    maritalStatus: 'never_married',
    religion: 'हिंदू (Hindu)',
    subCaste: 'वंजारी',
    gotra: 'काश्यप',
    fatherOccupation: 'शासकीय लेखापरीक्षक (Auditor)',
    motherOccupation: 'शिक्षिका',
    brothers: 0,
    sisters: 1,
    familyType: 'विभक्त कुटुंब',
    expectations: 'पुणे किंवा मुंबईत नोकरी/व्यवसाय असलेला, उच्चशिक्षित आणि निर्व्यसनी वर.',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'
    ],
    horoscopeUrl: '#',
    aadhaarVerified: true,
    isVerified: true,
    isFeatured: false,
    isApproved: true,
    membership: 'silver',
    createdAt: '2026-02-10',
    lastActive: 'काल',
    bio: 'पुण्यात राहणारे सुसंस्कृत कुटुंब. फार्मा क्षेत्रात उत्तम करिअर.',
    privacy: { hideContact: false, hidePhoto: false }
  },
  {
    id: 'vj-106',
    fullName: 'रोहित एकनाथ आव्हाड (Rohit Eknath Awhad)',
    gender: 'groom',
    dob: '1994-09-18',
    age: 30,
    mobile: '+91 91580 99887',
    email: 'rohit.awhad@example.com',
    district: 'जळगाव (Jalgaon)',
    taluka: 'चाळीसगाव (Chalisgaon)',
    city: 'जळगाव',
    education: 'Chartered Accountant (CA)',
    occupation: 'Senior Financial Analyst, Mumbai',
    income: '₹ 18 - 22 लाख वार्षिक',
    height: "5'9\"",
    weight: '70',
    bloodGroup: 'O+',
    maritalStatus: 'never_married',
    religion: 'हिंदू (Hindu)',
    subCaste: 'वंजारी',
    gotra: 'अत्री',
    fatherOccupation: 'व्यावसायिक (Auto Components)',
    motherOccupation: 'गृहिणी',
    brothers: 1,
    sisters: 0,
    familyType: 'एकत्र कुटुंब',
    expectations: 'CA, CS, Engineer किंवा MBA झालेली, समंजस वंजारी वधू.',
    photos: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800'
    ],
    horoscopeUrl: '#',
    aadhaarVerified: true,
    isVerified: true,
    isFeatured: true,
    isApproved: true,
    membership: 'gold',
    createdAt: '2026-01-05',
    lastActive: 'आज सकाळी',
    bio: 'मुंबईत नामांकित कॉर्पोरेट कंपनीमध्ये CA. शांत आणि ध्येयवादी व्यक्तिमत्त्व.',
    privacy: { hideContact: false, hidePhoto: false }
  },
  {
    id: 'vj-107',
    fullName: 'अपेक्षा तुकाराम मुंडे (Apeksha Tukaram Munde)',
    gender: 'bride',
    dob: '1997-12-05',
    age: 27,
    mobile: '+91 98901 77221',
    email: 'apeksha.munde@example.com',
    district: 'लातूर (Latur)',
    taluka: 'अहमदपूर (Ahmadpur)',
    city: 'लातूर',
    education: 'M.Sc B.Ed (Mathematics)',
    occupation: 'शासकीय माध्यमिक शिक्षिका',
    income: '₹ 7 - 9 लाख वार्षिक',
    height: "5'2\"",
    weight: '50',
    bloodGroup: 'A+',
    maritalStatus: 'never_married',
    religion: 'हिंदू (Hindu)',
    subCaste: 'वंजारी',
    gotra: 'भारद्वाज',
    fatherOccupation: 'निवृत्त सहाय्यक पोलीस उपनिरीक्षक',
    motherOccupation: 'गृहिणी',
    brothers: 1,
    sisters: 0,
    familyType: 'विभक्त कुटुंब',
    expectations: 'शासकीय सेवेत किंवा बँक/इंजिनिअरिंग क्षेत्रात असलेला नम्र वंजारी वर.',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800'
    ],
    horoscopeUrl: '#',
    aadhaarVerified: true,
    isVerified: true,
    isFeatured: false,
    isApproved: true,
    membership: 'silver',
    createdAt: '2026-02-18',
    lastActive: '५ तासांपूर्वी',
    bio: 'शासकीय शाळेत गणिताची शिक्षिका. वाचनाची व संगीताची आवड.',
    privacy: { hideContact: false, hidePhoto: false }
  },
  {
    id: 'vj-108',
    fullName: 'गणेश बाबासाहेब शिनगारे (Ganesh Babasaheb Shingare)',
    gender: 'groom',
    dob: '1993-07-28',
    age: 31,
    mobile: '+91 98230 44556',
    email: 'ganesh.shingare@example.com',
    district: 'नांदेड (Nanded)',
    taluka: 'कंधार (Kandhar)',
    city: 'नांदेड',
    education: 'B.E Electronics, Class 1 Deputy Collector (UPSC/MPSC)',
    occupation: 'उपजिल्हाधिकारी (Deputy Collector)',
    income: '₹ 15 - 18 लाख वार्षिक',
    height: "6'0\"",
    weight: '78',
    bloodGroup: 'B+',
    maritalStatus: 'never_married',
    religion: 'हिंदू (Hindu)',
    subCaste: 'वंजारी',
    gotra: 'काश्यप',
    fatherOccupation: 'शेतकरी व माजी ग्रामपंचायत सरपंच',
    motherOccupation: 'गृहिणी',
    brothers: 0,
    sisters: 2,
    familyType: 'एकत्र कुटुंब',
    expectations: 'उच्चशिक्षित, प्रशासकीय किंवा शैक्षणिक सेवेतील सुसंस्कृत वंजारी वधू.',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'
    ],
    horoscopeUrl: '#',
    aadhaarVerified: true,
    isVerified: true,
    isFeatured: true,
    isApproved: true,
    membership: 'diamond',
    createdAt: '2026-01-02',
    lastActive: 'काल संध्याकाळी',
    bio: 'प्रशासकीय सेवेत वर्ग-१ अधिकारी. समाजाच्या प्रगतीसाठी सतत कार्यरत.',
    privacy: { hideContact: false, hidePhoto: false }
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    coupleName: 'डॉ. विशाल गर्जे ❤️ डॉ. प्रियंका गर्जे (सानप)',
    marriageDate: '१५ नोव्हेंबर २०२५',
    district: 'नाशिक / बीड',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    story: 'VanjariJodi through our families found each other smoothly. The contact detail verification and horoscope matching features made everything super easy.',
    storyMr: 'वंजारीजोडीच्या माध्यमातून आमचे विवाह जुळले. बायोडाटा आणि आधार पडताळणीमुळे विश्वासार्हता मिळाली. दोन्ही कुटुंबांमध्ये अत्यंत आनंदाचे वातावरण निर्माण झाले. धन्यवाद वंजारीजोडी टीम!'
  },
  {
    id: 'story-2',
    coupleName: 'मा. स्वप्निल ढाकणे (इंजिनिअर) ❤️ पूजा ढाकणे (सानप)',
    marriageDate: '०४ फेब्रुवारी २०२६',
    district: 'पुणे / अहमदनगर',
    image: 'https://images.unsplash.com/photo-1621801306175-312f2791be28?auto=format&fit=crop&q=80&w=800',
    story: 'We connected directly via VanjariJodi Premium WhatsApp Chat. Clear profile specifications helped us find common thoughts.',
    storyMr: 'वंजारीजोडी प्रीमियम मेम्बरशिप घेतल्यानंतर थेट संवाद साधता आला. सर्व माहिती पारदर्शक आणि परिपूर्ण असल्यामुळे लगेच बोलणी पक्की झाली. वंजारी समाजासाठी हे सर्वोत्तम ॲप आहे.'
  },
  {
    id: 'story-3',
    coupleName: 'महेश सानप (MPSC) ❤️ दिपाली सानप (कराड)',
    marriageDate: '२० डिसेंबर २०२५',
    district: 'छत्रपती संभाजीनगर / परभणी',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    story: 'Seamless matching for government & corporate profiles in Vanjari community.',
    storyMr: 'समाजातील योग्य स्थळ शोधण्यासाठी वंजारीजोडी चे मोफत व्यासपीठ खूप मदतशीर ठरले. मोबाईलवर सहज हाताळता येणारे आधुनिक तंत्रज्ञान आवडले.'
  }
];

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
    title: 'महा-वंजारी वधू-वर पालक परिचय मेळावा २०२६ (नाशिक)',
    description: 'नाशिक येथे भव्य वंजारी वधू-वर आणि पालक परिचय मेळावा आयोजित करण्यात आला आहे. सर्व उपवधू-वरांनी सहकुटुंब उपस्थित राहावे.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
    linkUrl: '#',
    type: 'meetup',
    isActive: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'ad-2',
    title: 'श्री क्षेत्र भगवानगड व राष्ट्रसंत भगवान बाबा ट्रस्ट विशेष उपक्रम',
    description: 'समाजातील उच्चशिक्षित डॉक्टर, इंजिनियर व वर्ग १ अधिकाऱ्यांसाठी विशेष विनामूल्य समुपदेशन व परिचय केंद्र.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
    linkUrl: '#',
    type: 'sponsor',
    isActive: true,
    createdAt: '2026-02-10'
  }
];

export const INITIAL_CONTACT_REQUESTS: any[] = [
  {
    id: 'req-101',
    requesterId: 'vj-102',
    requesterName: 'अविनाश गोपीनाथ फड',
    targetProfileId: 'vj-101',
    targetProfileName: 'पूजा भगवान सानप',
    status: 'pending',
    createdAt: '2026-02-18T09:30:00Z'
  }
];

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
  showProfilesOnIndexPage: true,
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
    apkUrl: 'https://vanjarijodi.org/downloads/VanjariJodi_v2.4.0.apk',
    appVersion: 'v2.4.0',
    isEnabled: true,
    releaseNotes: 'नवीन अपडेट: AI चेहरा पडताळणी ऑथेंटिकेशन आणि जलद सर्व्हर सपोर्ट.',
    downloadCount: 14200,
    fileSizeMb: '12.4 MB'
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

export const INITIAL_FACE_VERIFICATIONS: any[] = [
  {
    id: 'fv-101',
    userId: 'vj-101',
    userName: 'प्रियंका बाळकृष्ण मुंडे',
    userMobile: '+91 98221 55443',
    capturedPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    matchScore: 96,
    status: 'approved',
    submittedAt: '2026-08-01T10:30:00Z',
    reviewedAt: '2026-08-01T10:32:00Z',
    notes: 'AI मॅच यशस्वी (96% साधर्म्य)'
  },
  {
    id: 'fv-102',
    userId: 'vj-102',
    userName: 'अविनाश गोपीनाथ फड',
    userMobile: '+91 97632 11098',
    capturedPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    matchScore: 94,
    status: 'approved',
    submittedAt: '2026-08-01T14:15:00Z',
    reviewedAt: '2026-08-01T14:20:00Z',
    notes: 'ऑटोमॅटिक चेहरा जुळवणी स्वीकृत'
  }
];

export const INITIAL_PAYMENT_REQUESTS: any[] = [
  {
    id: 'pay-req-101',
    userId: 'vj-102',
    userName: 'अविनाश गोपीनाथ फड',
    userMobile: '+91 97632 11098',
    planId: 'gold',
    planName: 'गोल्ड प्लॅन (६ महिने)',
    amount: 999,
    utrNumber: 'UTR402918274011',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
    status: 'pending',
    createdAt: '2026-08-01T08:15:00Z'
  }
];

export const INITIAL_SUB_ADMINS: any[] = [
  {
    id: 'subadmin-01',
    name: 'रमेश नाईक (नाशिक विभाग)',
    username: 'ramesh_subadmin',
    password: 'subadmin123',
    role: 'sub_admin',
    permissions: ['manage_profiles', 'add_profiles', 'support_chat'],
    createdAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 'subadmin-02',
    name: 'स्वाती मुंडे (बीड-परळी विभाग)',
    username: 'swati_subadmin',
    password: 'subadmin123',
    role: 'sub_admin',
    permissions: ['manage_profiles', 'payment_requests'],
    createdAt: '2026-07-22T14:30:00Z'
  }
];

export const INITIAL_PROMO_CODES: any[] = [
  {
    id: 'promo-101',
    code: 'VANJARI20',
    discountType: 'percentage',
    discountValue: 20,
    maxUses: 100,
    usedCount: 14,
    isActive: true,
    createdAt: '2026-07-01T00:00:00Z'
  },
  {
    id: 'promo-102',
    code: 'FLAT200',
    discountType: 'flat',
    discountValue: 200,
    maxUses: 50,
    usedCount: 8,
    isActive: true,
    createdAt: '2026-07-10T00:00:00Z'
  },
  {
    id: 'promo-103',
    code: 'VIPFREE',
    discountType: 'vip_free',
    discountValue: 100,
    maxUses: 20,
    usedCount: 3,
    isActive: true,
    createdAt: '2026-07-15T00:00:00Z'
  }
];

export const INITIAL_PENDING_PROFILES: any[] = [
  {
    id: 'edit-req-101',
    profileId: 'vj-101',
    profileName: 'प्रियंका ज्ञानदेव फड (नाशिक)',
    mobile: '+91 98223 44556',
    originalData: { education: 'B.E. Computer', occupation: 'Software Engineer', annualIncome: '8 - 10 लाख' },
    updatedData: { education: 'M.Tech Computer Science', occupation: 'Senior Software Engineer (TCS Pune)', annualIncome: '12 - 15 लाख' },
    submittedAt: '2026-08-01T09:30:00Z',
    status: 'pending'
  }
];

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
