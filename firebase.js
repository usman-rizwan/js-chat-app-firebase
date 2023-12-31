// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
// // ==============================================================================
// // ========================================= authentication =====================
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// // ==============================================================================
// // =================================== fire store ===============================
// import { getFirestore, collection, addDoc, doc, onSnapshot, setDoc, getDoc , updateDoc, query, where , getDocs ,serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// // ================================  STORAGE
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
// const firebaseConfig = {
//     apiKey: "AIzaSyCNLLVAJDsvgEujEbHWjHTykGL5O-HDPQE",
//     authDomain: "hackathon-batch-10.firebaseapp.com",
//     projectId: "hackathon-batch-10",
//     storageBucket: "hackathon-batch-10.appspot.com",
//     messagingSenderId: "644990541146",
//     appId: "1:644990541146:web:2c4071891ecc3f634ba763",
//     measurementId: "G-WN4BG6E1F9"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app)
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);
// export {
//     auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
//     db, getFirestore, collection, addDoc, doc, onSnapshot, setDoc, getDoc, updateDoc ,
//     query, where,
//     getStorage, storage, ref, uploadBytesResumable, getDownloadURL, getDocs,serverTimestamp
// }

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7pvJuZOX2O-tZJRfcuhPSUyZDZyi1Wbs",
  authDomain: "fir-users-auth-fc835.firebaseapp.com",
  projectId: "fir-users-auth-fc835",
  storageBucket: "fir-users-auth-fc835.appspot.com",
  messagingSenderId: "240085089487",
  appId: "1:240085089487:web:e18821a8d60a10123b4bba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  db,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  storage,
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
};
