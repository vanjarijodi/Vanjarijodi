import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAu93jYuGsJGFSxuAOJ7epcqwo8VR0itqA",
  authDomain: "vanjarijodi.firebaseapp.com",
  projectId: "vanjarijodi",
  storageBucket: "vanjarijodi.firebasestorage.app",
  messagingSenderId: "84450936891",
  appId: "1:84450936891:android:6b10bd21f9a1712cbfb41e"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
