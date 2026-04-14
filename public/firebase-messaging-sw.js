// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBuneOulsyZ8OZui7jntjfDVhZYrlx2lWM",
  authDomain: "yuvadarpan-1a730.firebaseapp.com",
  projectId: "yuvadarpan-1a730",
  storageBucket: "yuvadarpan-1a730.appspot.com",
  messagingSenderId: "941392148346",
  appId: "1:941392148346:web:ff8d0bbfbb369237f9c8c3",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
