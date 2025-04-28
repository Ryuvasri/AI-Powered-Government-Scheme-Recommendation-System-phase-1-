import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNKPKfBah1RhuMJLzcRsvAcTu8C0h1aeQ",
  authDomain: "govscheme-6fb99.firebaseapp.com",
  databaseURL: "https://govscheme-6fb99-default-rtdb.firebaseio.com",
  projectId: "govscheme-6fb99",
  storageBucket: "govscheme-6fb99.appspot.com", // ✅ FIXED storageBucket URL
  messagingSenderId: "1099137793469",
  appId: "1:1099137793469:web:2748b987e848acd336a6d4",
  measurementId: "G-6TYQWYHHBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, doc, setDoc, getDoc };