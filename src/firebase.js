// import firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuneOulsyZ8OZui7jntjfDVhZYrlx2lWM",
  authDomain: "yuvadarpan-1a730.firebaseapp.com",
  projectId: "yuvadarpan-1a730",
  storageBucket: "yuvadarpan-1a730.appspot.com",
  messagingSenderId: "941392148346",
  appId: "1:941392148346:web:ff8d0bbfbb369237f9c8c3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
