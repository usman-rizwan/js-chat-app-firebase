// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

///////////////////////////Authentication//////////////////////////////
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

///////////////////////////// Firestore  ///////////////////////////////
import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  setDoc,
  doc,
  getDoc,
 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

///////////////////////////// Storage  ///////////////////////////////
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
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getDoc,
  signOut,
};
