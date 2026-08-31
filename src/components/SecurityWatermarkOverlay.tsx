import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Lock, AlertTriangle, Eye } from 'lucide-react';

interface SecurityWatermarkOverlayProps {
  variant?: 'photo' | 'modal' | 'banner';
  className?: string;
  children?: React.ReactNode;
  showWarningAlert?: boolean;
}

export const SecurityWatermarkOverlay: React.FC<SecurityWatermarkOverlayProps> = ({
  variant = 'photo',
  className = '',
  children,
  showWarningAlert = true,
}) => {
  const { currentUser } = useApp();
  const [screenshotDetected, setScreenshotDetected] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  // User credentials to embed into watermark
  const viewerName = currentUser?.fullName || 'अज्ञात सदस्य (Logged User)';
  const viewerMobile = currentUser?.mobile || '98XXXXXXXX';
  const viewerId = currentUser?.id || 'VJ-GUEST';
  const nowStamp = new Date().toLocaleDateString('mr-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Anti-Screenshot & Screen Recording Interceptors
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        triggerSecurityAlert();
      }

      // Mac Screenshot Hotkeys: Cmd + Shift + 3 / 4 / 5
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        triggerSecurityAlert();
      }

      // Windows / Linux Ctrl+P or Ctrl+S
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerSecurityAlert();
      }
    };

    const triggerSecurityAlert = () => {
      setScreenshotDetected(true);
      setTimeout(() => setScreenshotDetected(false), 5000);
    };

    // Detect app switching or screen capture tool opening (Visibility / Blur)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    const handleWindowBlur = () => {
      setIsWindowBlurred(true);
    };

    const handleWindowFocus = () => {
      setIsWindowBlurred(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setScreenshotDetected(true);
        setTimeout(() => setScreenshotDetected(false), 3000);
      }}
      onDragStart={(e) => e.preventDefault()}
      className={`relative select-none ${isWindowBlurred ? 'blur-xl grayscale opacity-30 transition-all duration-300' : ''} ${className}`}
      style={{
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {/* Wrapped Content (Photos or Biodata View) */}
      {children}

      {/* DYNAMIC WATERMARK STAMP LAYER */}
      {/* 1. Diagonal Tiled Text Across Container */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden flex flex-col justify-around opacity-25 select-none rotate-[-18deg] scale-125">
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="whitespace-nowrap font-mono font-black text-[11px] sm:text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-widest uppercase flex justify-between gap-8 py-2"
          >
            <span>🔒 VIEWED BY: {viewerName} ({viewerMobile}) • VJ-ID: {viewerId}</span>
            <span>🔒 {viewerName} • {viewerMobile}</span>
            <span>🔒 VIEWED BY: {viewerName} ({viewerMobile})</span>
          </div>
        ))}
      </div>

      {/* 2. Top-Left Floating Security Badge */}
      <div className="absolute top-2 left-2 z-30 pointer-events-none select-none px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white border border-amber-400/40 shadow-lg flex items-center gap-1.5 max-w-[90%]">
        <Lock className="w-3 h-3 text-amber-300 shrink-0" />
        <div className="text-[9px] font-black leading-tight truncate">
          <span className="text-amber-300 block">🔒 दर्शकाची माहिती (Logged Viewer):</span>
          <span className="text-white truncate block">{viewerName} • 📞 {viewerMobile}</span>
        </div>
      </div>

      {/* 3. Bottom-Right Security Stamp */}
      <div className="absolute bottom-2 right-2 z-30 pointer-events-none select-none px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-xs text-[9px] font-mono font-black text-amber-200 border border-amber-300/30 shadow-md">
        VJ-PROTECTED • {viewerId} • {nowStamp}
      </div>

      {/* SCREENSHOT WARNING OVERLAY POPUP */}
      {screenshotDetected && showWarningAlert && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-white animate-fadeIn">
          <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center mb-2 shadow-lg animate-bounce">
            <ShieldAlert className="w-7 h-7 text-amber-200" />
          </div>
          <h4 className="text-sm sm:text-base font-black text-amber-300">
            🚨 स्क्रीनशॉट घेण्यास मनाई आहे! (Screenshot Prevented)
          </h4>
          <p className="text-xs text-slate-200 font-bold mt-1 max-w-sm leading-relaxed">
            या फोटोवर तुमचा नाव व मोबाईल नंबर (<span className="text-amber-300">{viewerName} - {viewerMobile}</span>) वॉटरमार्क केला आहे. हा फोटो व्हायरल केल्यास थेट तुमची आयडी ट्रॅक होईल.
          </p>
          <div className="mt-3 px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg shadow">
            सुरक्षितता नियम • VanjariJodi Protection Engine
          </div>
        </div>
      )}
    </div>
  );
};
