import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface VerifiedBadgeProps {
  isVerified?: boolean;
  isFaceVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  isVerified = false,
  isFaceVerified = false,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  if (!isVerified && !isFaceVerified) return null;

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold ${className}`}
      title={isFaceVerified ? "फेस ऑथेंटिकेशन द्वारे पडताळणीकृत प्रोफाईल (Verified Face)" : "पडताळणीकृत प्रोफाईल (Verified Profile)"}
    >
      <span className="relative inline-flex items-center justify-center text-blue-600">
        <CheckCircle2 className={`${iconSizes[size]} fill-blue-600 text-white drop-shadow-sm`} />
        {isFaceVerified && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        )}
      </span>
      {showLabel && (
        <span className={`px-1.5 py-0.5 rounded-full ${isFaceVerified ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'} font-bold ${textSizes[size]} inline-flex items-center gap-1`}>
          {isFaceVerified ? (
            <>
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>फेस व्हेरिफाइड</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>व्हेरिफाइड</span>
            </>
          )}
        </span>
      )}
    </span>
  );
};
