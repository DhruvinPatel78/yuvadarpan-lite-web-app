// import firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDs93nc_DBmoyZcxJZhPGlObIABhdlnSj8",
  authDomain: "yuvadarpan-97eeb.firebaseapp.com",
  projectId: "yuvadarpan-97eeb",
  storageBucket: "yuvadarpan-97eeb.firebasestorage.app",
  messagingSenderId: "925386428228",
  appId: "1:925386428228:android:fe6a7a76772b1381ad1111",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { app, auth, db, messaging, getToken, onMessage };
