/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(({ request, url }) => {
  if (request.mode !== "navigate") {
    return false;
  }
  if (url.pathname.startsWith("/_")) {
    return false;
  }
  if (url.pathname.match(fileExtensionRegexp)) {
    return false;
  }
  return true;
}, createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`));

registerRoute(
  ({ request, url }) =>
    request.destination === "image" && url.origin === self.location.origin,
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [new ExpirationPlugin({ maxEntries: 60 })],
  }),
);

registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

try {
  const firebaseApp = initializeApp({
    apiKey: "AIzaSyDs93nc_DBmoyZcxJZhPGlObIABhdlnSj8",
    authDomain: "yuvadarpan-97eeb.firebaseapp.com",
    projectId: "yuvadarpan-97eeb",
    storageBucket: "yuvadarpan-97eeb.firebasestorage.app",
    messagingSenderId: "925386428228",
    appId: "1:925386428228:android:fe6a7a76772b1381ad1111",
  });
  const messaging = getMessaging(firebaseApp);
  onBackgroundMessage(messaging, (payload) => {
    const title = payload?.notification?.title || "Yuvadarpan";
    const options = {
      body: payload?.notification?.body || "",
      icon: `${process.env.PUBLIC_URL}/apple-touch-icon.png`,
    };
    self.registration.showNotification(title, options);
  });
} catch (error) {
  console.log("Firebase messaging in service worker skipped.", error);
}
