// Push Notification & Sound Chime Utility for Vanjari Jodi Matrimony

// Plays a pleasant native Web Audio notification chime
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    // Chime Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Chime Note 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.12); // E5
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);

    // Chime Note 3 (High harmony)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(783.99, now + 0.24); // G5
    gain3.gain.setValueAtTime(0.3, now + 0.24);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.24);
    osc3.stop(now + 0.6);
  } catch (e) {
    console.log('Audio Context notification sound play failed or blocked:', e);
  }
}

export function isPushNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getPushPermissionState(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (!isPushNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestPushPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
  if (!isPushNotificationSupported()) return 'unsupported';
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      playNotificationSound();
    }
    return perm;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return Notification.permission;
  }
}

export interface PushOptions {
  body: string;
  icon?: string;
  tag?: string;
  url?: string;
  playSound?: boolean;
}

export function triggerBrowserPushNotification(
  title: string,
  options: PushOptions
): boolean {
  if (!isPushNotificationSupported()) return false;

  if (options.playSound !== false) {
    playNotificationSound();
  }

  if (Notification.permission === 'granted') {
    // 1. Try Service Worker showNotification first (Required for Android Chrome, PWA & Mobile Web)
    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready
        .then((reg) => {
          if (reg && reg.showNotification) {
            reg.showNotification(title, {
              body: options.body,
              icon: options.icon || '/icon-192.png',
              badge: '/icon-192.png',
              tag: options.tag || 'vanjari-jodi-push',
              data: { url: options.url || '/' },
            } as any);
          }
        })
        .catch(() => {
          // Fallback below
        });
    }

    // 2. Desktop Notification fallback
    try {
      const n = new Notification(title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        tag: options.tag || 'vanjari-jodi-push',
        badge: '/icon-192.png',
      });

      n.onclick = (event) => {
        event.preventDefault();
        window.focus();
        if (options.url) {
          window.location.href = options.url;
        }
        n.close();
      };
      return true;
    } catch (err) {
      // Ignored if handled by service worker or desktop permission constraints
    }
    return true;
  }

  return false;
}
