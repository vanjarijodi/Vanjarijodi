import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Phone, Mail, MapPin, Download, ShieldCheck, Sparkles, ShieldAlert } from 'lucide-react';

const VanjariJodiLogoEmblem: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="vjGoldF" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="vjOrangeF" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B00" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="vjRedF" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A71930" />
        <stop offset="100%" stopColor="#800C1E" />
      </linearGradient>
    </defs>

    <path
      d="M100 10 L175 45 V115 C175 160 100 190 100 190 C100 190 25 160 25 115 V45 L100 10 Z"
      fill="url(#vjRedF)"
      stroke="url(#vjGoldF)"
      strokeWidth="4"
    />
    <path
      d="M85 30 L92 40 L100 26 L108 40 L115 30 L112 46 H88 L85 30 Z"
      fill="url(#vjGoldF)"
      stroke="#FFF"
      strokeWidth="1"
    />
    <path
      d="M68 52 C78 42 122 42 132 52 C140 60 136 68 100 68 C64 68 60 60 68 52 Z"
      fill="url(#vjOrangeF)"
      stroke="url(#vjGoldF)"
      strokeWidth="2"
    />
    <path
      d="M58 70 C38 58 22 32 28 18 C40 32 54 56 70 72 Z"
      fill="url(#vjGoldF)"
      stroke="#FFF"
      strokeWidth="1.5"
    />
    <path
      d="M142 70 C162 58 178 32 172 18 C160 32 146 56 130 72 Z"
      fill="url(#vjGoldF)"
      stroke="#FFF"
      strokeWidth="1.5"
    />
    <path
      d="M70 72 C78 68 122 68 130 72 C138 88 132 118 100 133 C68 118 62 88 70 72 Z"
      fill="url(#vjOrangeF)"
      stroke="url(#vjGoldF)"
      strokeWidth="2"
    />
    <path
      d="M86 114 C86 124 114 124 114 114"
      fill="none"
      stroke="url(#vjGoldF)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const Footer: React.FC = () => {
  const { t, language, siteConfig, setIsAdminOpen } = useApp();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const disclaimer = siteConfig?.disclaimerText || `महत्त्वाची सूचना / टीप: 'वंजारी जोडी' हे केवळ वधू-वरांना आणि त्यांच्या कुटुंबांना परस्परांशी संपर्क साधण्यासाठी उपलब्ध करून दिलेले एक डिजिटल व्यासपीठ आहे. या मंचावर नोंदणी केलेल्या कोणत्याही प्रोफाईलची माहिती, कौटुंबिक पार्श्वभूमी, आर्थिक किंवा शैक्षणिक कागदपत्रांची पडताळणी आम्ही करत नाही. त्यामुळे कोणताही विवाह निश्चित करण्यापूर्वी किंवा आर्थिक व्यवहार करण्यापूर्वी वधू आणि वराच्या पालकांनी/कुटुंबीयांनी स्वतःच्या स्तरावर सर्व माहितीची प्रत्यक्ष खात्री (Verification) करून घ्यावी.`;

  return (
    <footer id="contact-section" className="bg-[#800C1E] text-amber-100 border-t-2 border-amber-400">
      
      {/* 1. MANDATORY MARATHI DISCLAIMER BOX */}
      <div className="bg-[#5C0815] py-6 px-4 sm:px-6 lg:px-8 border-b border-amber-400/30">
        <div className="max-w-7xl mx-auto bg-[#800C1E]/80 border-2 border-amber-400/60 rounded-2xl p-4 sm:p-6 shadow-inner">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-[#800C1E] shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 font-bold" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
              <h4 className="font-extrabold text-amber-300 text-sm sm:text-base underline underline-offset-4 decoration-amber-400">
                महत्त्वाची सूचना / टीप (Mandatory Disclaimer)
              </h4>
              <p className="pt-1 text-slate-100">{disclaimer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTACT HELPLINE BANNER */}
      {!siteConfig?.hideContactAndAddressGlobal && (
        <div className="bg-[#A71930] py-6 px-4 sm:px-6 lg:px-8 border-b border-amber-400/20 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-bold flex items-center justify-center md:justify-start gap-2 text-amber-200">
                <Sparkles className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>{siteConfig?.contactHeaderTitle || 'संपर्क व मदत कक्ष (Contact & Helpline)'}</span>
              </h3>
              <p className="text-xs text-amber-100">
                {siteConfig?.contactHeaderSubtitle || (language === 'mr' ? 'कोणतीही अडचण किंवा चौकशीसाठी आमच्याशी संपर्क साधा.' : 'Have queries? Call our helpline anytime.')}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center text-xs font-bold">
              <a
                href={`tel:${siteConfig?.contactPhone || '+91 98220 00000'}`}
                className="px-4 py-2 bg-white text-[#A71930] hover:bg-amber-100 rounded-xl font-black shadow flex items-center gap-2 border border-amber-300"
              >
                <Phone className="w-4 h-4 text-[#A71930]" />
                <span>{siteConfig?.contactPhone || '+91 98220 00000'}</span>
              </a>
              {siteConfig?.contactWhatsapp && (
                <a
                  href={`https://wa.me/${siteConfig.contactWhatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold shadow flex items-center gap-2"
                >
                  <span>व्हॉट्सॲप: {siteConfig.contactWhatsapp}</span>
                </a>
              )}
              <a
                href={`mailto:${siteConfig?.contactEmail || 'support@vanjarijodi.org'}`}
                className="px-4 py-2 bg-[#800C1E] text-amber-200 hover:bg-[#5C0815] rounded-xl font-bold border border-amber-300/40 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-amber-300" />
                <span>{siteConfig?.contactEmail || 'support@vanjarijodi.org'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN FOOTER INFO */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Brand Column */}
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center justify-center md:justify-start gap-3">
            {siteConfig?.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt={siteConfig?.logoTitle || 'वंजारी जोडी'}
                className="w-12 h-12 object-contain rounded-xl border border-amber-300 shadow bg-white p-0.5"
              />
            ) : (
              <VanjariJodiLogoEmblem className="w-12 h-12" />
            )}
            <div>
              <span className="text-xl font-black text-amber-300 tracking-tight block">
                {siteConfig?.logoTitle || 'वंजारी जोडी'}
              </span>
              <p className="text-xs font-bold text-amber-200">
                {siteConfig?.logoSubtitle || 'विश्वासू वंजारी विवाह मंच'}
              </p>
            </div>
          </div>
          <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
            {siteConfig?.aboutUsText || 'वंजारी समाजातील वधू-वरांसाठी विश्वासाचे आणि सर्व सोयींनी युक्त डिजिटल मॅट्रिमोनी व्यासपीठ.'}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>सुरक्षित व गोपनीय विवाह सेवा</span>
          </div>
        </div>

        {/* Central Blessing Banner */}
        <div className="bg-[#5C0815] px-6 py-4 rounded-2xl border-2 border-amber-400/50 shadow-inner text-center space-y-1">
          <span className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-widest block">
            ॥ श्री संत भगवान बाबा प्रसन्न ॥
          </span>
          <p className="text-[11px] text-amber-200 font-bold">
            संत भगवान बाबा व जगदंबा माता यांच्या आशीर्वादाने हजारो यशस्वी वंजारी विवाह जोड्या!
          </p>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-amber-400/20 py-4 px-4 text-center text-xs text-amber-200/70 font-medium flex flex-wrap items-center justify-between max-w-7xl mx-auto">
        <p>© 2026 वंजारी जोडी मॅट्रिमोनी ({siteConfig?.logoTitle || 'VanjariJodi'}). सर्व हक्क सुरक्षित.</p>
        <button
          onClick={() => {
            setIsAdminOpen(true);
          }}
          className="text-[11px] text-amber-300 hover:text-amber-100 font-bold underline cursor-pointer mt-1 sm:mt-0 flex items-center gap-1"
        >
          <span>प्रशासक प्रवेश (Admin Panel)</span>
        </button>
      </div>
    </footer>
  );
};
