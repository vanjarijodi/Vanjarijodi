import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { UserProfile, SiteConfig, ChatMessage, SuccessStory, PaymentRequest, ContactRequest, AdminSupportMessage } from '../types';

// Generic document write helper with graceful error handling
export const syncDocToFirestore = async (colName: string, docId: string, data: any) => {
  try {
    if (!colName || !docId || !data) return;
    const docRef = doc(db, colName, docId);
    await setDoc(docRef, JSON.parse(JSON.stringify(data)), { merge: true });
  } catch (err) {
    console.warn(`Firestore sync error for ${colName}/${docId}:`, err);
  }
};

// Generic document delete helper
export const deleteDocFromFirestore = async (colName: string, docId: string) => {
  try {
    if (!colName || !docId) return;
    const docRef = doc(db, colName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn(`Firestore delete error for ${colName}/${docId}:`, err);
  }
};

// Profiles real-time listener
export const listenToProfiles = (
  onUpdate: (profiles: UserProfile[]) => void,
  initialSeed: UserProfile[]
) => {
  try {
    const colRef = collection(db, 'profiles');
    return onSnapshot(colRef, async (snapshot) => {
      if (snapshot.empty && initialSeed && initialSeed.length > 0) {
        // Seed initial profiles to Firestore if database is fresh/empty
        for (const p of initialSeed) {
          if (p && p.id) {
            syncDocToFirestore('profiles', p.id, p);
          }
        }
        onUpdate(initialSeed);
      } else {
        const items: UserProfile[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as UserProfile;
          if (data && data.id) {
            items.push(data);
          }
        });
        if (items.length > 0) {
          onUpdate(items);
        }
      }
    }, (err) => {
      console.warn('Firestore snapshot error for profiles:', err);
    });
  } catch (err) {
    console.warn('Firestore listen error:', err);
    return () => {};
  }
};

// Site Config listener
export const listenToSiteConfig = (
  onUpdate: (config: SiteConfig) => void,
  initialConfig: SiteConfig
) => {
  try {
    const docRef = doc(db, 'siteConfig', 'mainConfig');
    return onSnapshot(docRef, async (snapshot) => {
      if (!snapshot.exists() && initialConfig) {
        syncDocToFirestore('siteConfig', 'mainConfig', initialConfig);
        onUpdate(initialConfig);
      } else if (snapshot.exists()) {
        const data = snapshot.data() as SiteConfig;
        onUpdate(data);
      }
    }, (err) => {
      console.warn('Firestore snapshot error for siteConfig:', err);
    });
  } catch (err) {
    console.warn('Firestore listen error:', err);
    return () => {};
  }
};

// Chat messages listener
export const listenToChatMessages = (onUpdate: (messages: ChatMessage[]) => void) => {
  try {
    const colRef = collection(db, 'chatMessages');
    return onSnapshot(colRef, (snapshot) => {
      const items: ChatMessage[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as ChatMessage;
        if (data && data.id) {
          items.push(data);
        }
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    }, (err) => {
      console.warn('Firestore snapshot error for chatMessages:', err);
    });
  } catch (err) {
    console.warn('Firestore listen error:', err);
    return () => {};
  }
};

// Admin support chat listener
export const listenToAdminSupport = (onUpdate: (messages: AdminSupportMessage[]) => void) => {
  try {
    const colRef = collection(db, 'adminSupportMessages');
    return onSnapshot(colRef, (snapshot) => {
      const items: AdminSupportMessage[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as AdminSupportMessage;
        if (data && data.id) {
          items.push(data);
        }
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    }, (err) => {
      console.warn('Firestore snapshot error for adminSupportMessages:', err);
    });
  } catch (err) {
    console.warn('Firestore listen error:', err);
    return () => {};
  }
};
