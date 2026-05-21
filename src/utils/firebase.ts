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

let app: any = null;
let messaging: any = null;

const getFirebaseApp = () => {
  console.log("[Firebase] getFirebaseApp called");
  if (typeof window === "undefined") {
    console.log("[Firebase] Window not available (server-side), returning null");
    return null;
  }
  try {
    if (!app) {
      console.log("[Firebase] Initializing Firebase app with config:", {
        apiKey: firebaseConfig.apiKey ? "***present***" : "missing",
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
      });
      app = initializeApp(firebaseConfig);
      console.log("[Firebase] Firebase app initialized successfully");
    }
    return app;
  } catch (error) {
    console.error("[Firebase] Error initializing Firebase app:", error);
    return null;
  }
};

const getFirebaseMessaging = () => {
  console.log("[Firebase] getFirebaseMessaging called");
  if (typeof window === "undefined") {
    console.log("[Firebase] Window not available (server-side), returning null");
    return null;
  }
  try {
    if (!messaging) {
      console.log("[Firebase] Getting Firebase messaging instance");
      const firebaseApp = getFirebaseApp();
      if (firebaseApp) {
        messaging = getMessaging(firebaseApp);
        console.log("[Firebase] Firebase messaging initialized successfully");
      } else {
        console.error("[Firebase] Failed to get Firebase app, can't initialize messaging");
      }
    }
    return messaging;
  } catch (error) {
    console.error("[Firebase] Error initializing Firebase messaging:", error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  console.log("[Firebase] requestNotificationPermission called");
  const fcmMessaging = getFirebaseMessaging();
  if (!fcmMessaging) {
    console.log("[Firebase] No messaging instance available, exiting");
    return;
  }
  
  try {
    const userToken = getSecureToken(); // decoded JWT
    console.log("[Firebase] User token check:", userToken ? "present" : "not present");
    if (!userToken) {
      console.log("[Firebase] No user token, exiting");
      return;
    }

    console.log("[Firebase] Requesting notification permission");
    const permission = await Notification.requestPermission();
    console.log("[Firebase] Notification permission result:", permission);
    
    if (permission === "granted") {
      console.log("[Firebase] Getting FCM token");
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      console.log("[Firebase] FCM token obtained:", token ? "***present***" : "missing");
      
      if (token) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || '';
        const url = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}auth/register-fcm`;
        console.log("[Firebase] Registering FCM token at:", url);
        await axios.post(url,
          { token },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        console.log("[Firebase] FCM token registered successfully");
      }
    }
  } catch (error: any) {
    console.error("[Firebase] Error in requestNotificationPermission:", error);
    if (error?.response?.status === 401) {
      console.log("[Firebase] 401 error (not logged in), ignoring");
      return;
    }
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    console.log("[Firebase] onMessageListener called");
    const fcmMessaging = getFirebaseMessaging();
    if (!fcmMessaging) {
      console.log("[Firebase] No messaging instance, exiting");
      return;
    }
    onMessage(fcmMessaging, (payload) => {
      console.log("[Firebase] Message received:", payload);
      resolve(payload);
    });
  });

// Persistent listener —  set once, fire multiple times on incoming messages
export const setupForegroundListener = (callback: (payload: any) => void) => {
  console.log("[Firebase] setupForegroundListener called");
  const fcmMessaging = getFirebaseMessaging();
  if (!fcmMessaging) {
    console.log("[Firebase] No messaging instance, returning empty cleanup");
    return () => {};
  }
  console.log("[Firebase] Setting up foreground message listener");
  const unsubscribe = onMessage(fcmMessaging, callback);
  return unsubscribe; // cleanup function
};

export { messaging };
