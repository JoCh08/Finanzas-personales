// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuvRAWuy83JGNUBBW4_LgHdxF-czv_wbE",
  authDomain: "finanzas-personales-8a9d5.firebaseapp.com",
  projectId: "finanzas-personales-8a9d5",
  storageBucket: "finanzas-personales-8a9d5.firebasestorage.app",
  messagingSenderId: "29824287212",
  appId: "1:29824287212:web:6b7749952de393beb000c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);