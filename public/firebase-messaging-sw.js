importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD6JaFkZiwENYCUZfxFywkmQdnU_UXPSJQ",
  authDomain: "upleex-e14fa.firebaseapp.com",
  projectId: "upleex-e14fa",
  storageBucket: "upleex-e14fa.firebasestorage.app",
  messagingSenderId: "388808204583",
  appId: "1:388808204583:web:7898269103babc38740902",
  measurementId: "G-CDKH1ZF88C"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
