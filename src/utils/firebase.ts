import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import { getSecureToken } from "@/utils/cryptoUtils";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const requestNotificationPermission = async () => {
  if (!messaging) return;
  
  try {
    const userToken = getSecureToken(); // decoded JWT
    if (!userToken) return;

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      
      if (token) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3688/api/v1/';
        const url = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}auth/register-fcm`;
        await axios.post(url,
          { token },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
      }
    }
  } catch (error: any) {
    if (error?.response?.status === 401) return; // silently ignore — not logged in
    console.error("Error getting notification permission:", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// Persistent listener —  set once, fire multiple times on incoming messages
export const setupForegroundListener = (callback: (payload: any) => void) => {
  if (!messaging) return () => {};
  const unsubscribe = onMessage(messaging, callback);
  return unsubscribe; // cleanup function
};

export { messaging };
