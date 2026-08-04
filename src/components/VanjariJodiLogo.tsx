import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'emblem' | 'full' | 'stacked' | 'horizontal';
  themeColor?: 'saffron' | 'gold' | 'light';
  showSubtitle?: boolean;
}

export const VanjariJodiLogo: React.FC<LogoProps> = ({
  className = '',
  size = 54,
  variant = 'full',
  themeColor = 'saffron',
  showSubtitle = true,
}) => {
  const renderSVGEmblem = () => (
    <svg
      viewBox="-20 -20 240 240"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
    >
      <defs>
        {/* Royal Saffron & Deep Maroon Gradients */}
        <linearGradient id="vjRedRoyal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#991B1B" />
          <stop offset="50%" stopColor="#800C1E" />
          <stop offset="100%" stopColor="#450A0A" />
        </linearGradient>

        <linearGradient id="vjSaffronPheta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9100" />
          <stop offset="40%" stopColor="#FF6D00" />
          <stop offset="85%" stopColor="#D83A00" />
          <stop offset="100%" stopColor="#800C1E" />
        </linearGradient>

        <linearGradient id="vjGoldLustre" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        <radialGradient id="vjGlowAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FDE68A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="vjFlameGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
          <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>

        <filter id="vjDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#780216" floodOpacity="0.4" />
        </filter>

        <filter id="vjGoldShine" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#F59E0B" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Outer Divine Aura Glow */}
      <circle cx="100" cy="100" r="92" fill="url(#vjGlowAura)" />

      {/* Traditional Folk Sun Rays & Rangoli Accents */}
      <g opacity="0.45">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + 88 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 88 * Math.sin((angle * Math.PI) / 180)}
            stroke="url(#vjGoldLustre)"
            strokeWidth="1.2"
            strokeDasharray="2 4"
          />
        ))}
      </g>

      {/* Outer Decorative Folk Ring with Red & White Rangoli Motifs */}
      <circle cx="100" cy="100" r="82" stroke="url(#vjGoldLustre)" strokeWidth="2.5" opacity="0.85" />
      <circle cx="100" cy="100" r="77" stroke="#FEF3C7" strokeWidth="1" strokeDasharray="3 3" opacity="0.9" />

      {/* Traditional White & Red Folk Rangoli Corner Motifs around circle */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + 82 * Math.cos(rad);
        const cy = 100 + 82 * Math.sin(rad);
        return (
          <g key={i} transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
            <circle cx="0" cy="0" r="4" fill="#800C1E" stroke="#FFF" strokeWidth="0.8" />
            <path d="M-6,-6 L0,-10 L6,-6 L0,-2 Z" fill="#F59E0B" />
          </g>
        );
      })}

      {/* Inner Royal Shield Background */}
      <circle cx="100" cy="100" r="72" fill="url(#vjRedRoyal)" filter="url(#vjDropShadow)" />
      <circle cx="100" cy="100" r="71" stroke="url(#vjGoldLustre)" strokeWidth="1.5" opacity="0.8" />

      {/* ROYAL MARATHA SAFFRON TURBAN (शाही फेटा) */}
      <g filter="url(#vjGoldShine)">
        {/* Turban Fan / Plume (तुरा/शिरपेच) rising upwards */}
        <path
          d="M 90,50 C 86,22 102,8 120,10 C 110,26 102,38 106,50 Z"
          fill="url(#vjSaffronPheta)"
          stroke="url(#vjGoldLustre)"
          strokeWidth="1.2"
        />
        <path
          d="M 94,46 C 96,28 108,18 114,16 C 108,26 104,36 102,46 Z"
          fill="url(#vjGoldLustre)"
          opacity="0.7"
        />

        {/* Turban Folds / Pleats */}
        <path
          d="M 50,70 C 65,48 112,42 150,64 C 138,80 102,84 50,70 Z"
          fill="url(#vjSaffronPheta)"
          stroke="#FBBF24"
          strokeWidth="1"
        />
        <path
          d="M 48,64 C 58,44 106,44 138,56 C 124,78 80,82 48,64 Z"
          fill="url(#vjSaffronPheta)"
          stroke="#FDE047"
          strokeWidth="0.8"
        />
        <path
          d="M 62,54 C 78,38 120,40 144,58 C 132,68 94,70 62,54 Z"
          fill="url(#vjSaffronPheta)"
          stroke="#FFF"
          strokeWidth="0.5"
          opacity="0.9"
        />

        {/* Royal Jewel Kalgi Brooch */}
        <path
          d="M 100,70 L 104,48 L 100,40 L 96,48 Z"
          fill="url(#vjGoldLustre)"
          stroke="#FFFFFF"
          strokeWidth="1"
        />
        <circle cx="100" cy="54" r="3.5" fill="#DC2626" stroke="#FFF" strokeWidth="0.8" />
        <circle cx="100" cy="64" r="2" fill="#FEF08A" />
      </g>

      {/* SACRED SACRIFICIAL FLAME (मंगल पवित्र ज्योत) ABOVE RINGS */}
      <circle cx="100" cy="98" r="12" fill="url(#vjFlameGlow)" />
      <path
        d="M 100,86 C 105,94 107,100 100,108 C 93,100 95,94 100,86 Z"
        fill="#F59E0B"
        stroke="#FFF"
        strokeWidth="0.8"
      />
      <path
        d="M 100,90 C 103,96 104,100 100,105 C 96,100 97,96 100,90 Z"
        fill="#FEF08A"
      />

      {/* INTERLOCKING WEDDING RINGS FORMING SACRED HEART (पवित्र विवाह बंधने) */}
      <g transform="translate(0, 10)">
        {/* Left Golden Wedding Ring */}
        <path
          d="M 80,110 C 65,90 45,106 65,126 L 80,141 L 95,126 C 115,106 95,90 80,110 Z"
          fill="#FFFDFB"
          stroke="url(#vjGoldLustre)"
          strokeWidth="4"
        />
        {/* Right Golden Wedding Ring */}
        <path
          d="M 120,110 C 105,90 85,106 105,126 L 120,141 L 135,126 C 155,106 135,90 120,110 Z"
          fill="#FFF1F2"
          stroke="url(#vjGoldLustre)"
          strokeWidth="4"
        />

        {/* Sacred Red Silk Gathbandhan Knot */}
        <path
          d="M 82,122 Q 100,100 118,122 Q 100,138 82,122 Z"
          fill="url(#vjSaffronPheta)"
          stroke="url(#vjGoldLustre)"
          strokeWidth="1.2"
        />

        {/* Center Auspicious Mangalsutra Gem */}
        <circle cx="100" cy="122" r="4" fill="url(#vjGoldLustre)" stroke="#780216" strokeWidth="0.8" />
        <circle cx="91" cy="117" r="2.2" fill="#FEF08A" />
        <circle cx="109" cy="117" r="2.2" fill="#FEF08A" />
      </g>

      {/* Sacred Tilak */}
      <path
        d="M 100,92 Q 103,78 100,68 Q 97,78 100,92 Z"
        fill="#F59E0B"
      />
      <circle cx="100" cy="85" r="1.8" fill="#FFFFFF" />
    </svg>
  );

  if (variant === 'emblem') {
    return renderSVGEmblem();
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center space-y-2 ${className}`}>
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          {renderSVGEmblem()}
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-[#800C1E] text-[8px] font-black px-2 py-0.5 rounded-full shadow-md border border-white uppercase tracking-wider">
            १००% मोफत
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#800C1E] drop-shadow-sm">
              वंजारी जोडी
            </span>
          </div>
          <span className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300/80 mt-1">
            VANJARI JODI MATRIMONY
          </span>
        </div>
      </div>
    );
  }

  // Default 'full' or 'horizontal' brand logo
  return (
    <div className={`flex items-center gap-2 sm:gap-3.5 ${className}`}>
      <div className="relative shrink-0 transform hover:scale-105 transition-transform duration-300">
        {renderSVGEmblem()}
        <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
        </span>
      </div>
      
      <div className="flex flex-col min-w-0 justify-center">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Main Devanagari Title */}
          <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#800C1E] leading-tight whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            वंजारी जोडी
          </span>
          <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 text-[#800C1E] border border-amber-300 font-black uppercase tracking-wider shadow-sm shrink-0 hidden sm:inline-block">
            अधिकृत
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-extrabold text-amber-800 leading-none whitespace-nowrap">
              VANJARI JODI • विश्वासू विवाह मंच
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
