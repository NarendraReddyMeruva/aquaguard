// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARQSa19sU-dFOAXdZP46oeZSfUd8p_R-s",
  authDomain: "aquaguard-c3128.firebaseapp.com",
  projectId: "aquaguard-c3128",
  storageBucket: "aquaguard-c3128.firebasestorage.app",
  messagingSenderId: "1074078036877",
  appId: "1:1074078036877:web:57945d49b5d108fb03c3c4",
  measurementId: "G-8TE0SB4HGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider= new GoogleAuthProvider();
export const db=getFirestore(app);