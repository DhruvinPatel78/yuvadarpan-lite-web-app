/* Align with app Firebase project (yuvadarpan-97eeb) for web push. */
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDs93nc_DBmoyZcxJZhPGlObIABhdlnSj8",
  authDomain: "yuvadarpan-97eeb.firebaseapp.com",
  projectId: "yuvadarpan-97eeb",
  storageBucket: "yuvadarpan-97eeb.firebasestorage.app",
  messagingSenderId: "925386428228",
  appId: "1:925386428228:android:fe6a7a76772b1381ad1111",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload?.notification?.title || "Yuvadarpan";
  const notificationOptions = {
    body: payload?.notification?.body || "",
    icon: "/apple-touch-icon.png",
    data: payload?.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const path = event.notification?.data?.path || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(path);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(path);
      }
      return undefined;
    }),
  );
});
