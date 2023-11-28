// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuneOulsyZ8OZui7jntjfDVhZYrlx2lWM",
  authDomain: "yuvadarpan-1a730.firebaseapp.com",
  projectId: "yuvadarpan-1a730",
  storageBucket: "yuvadarpan-1a730.appspot.com",
  messagingSenderId: "941392148346",
  appId: "1:941392148346:web:ff8d0bbfbb369237f9c8c3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
var database = getDatabase(app);

export { app, auth, db, database, collection, getDocs };
