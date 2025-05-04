// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiyPpBfXlgjUCjoqLuPlR8TrB4uvDiMcE",
  authDomain: "dev-g-59bb5.firebaseapp.com",
  projectId: "dev-g-59bb5",
  storageBucket: "dev-g-59bb5.firebasestorage.app",
  messagingSenderId: "538395550234",
  appId: "1:538395550234:web:ef3f2802f05310125de7a3",
  measurementId: "G-YWYXHBHVMR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
