// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhGXOFsO0xCTlWS_NURH9i6vy7THEoOoM",
  authDomain: "smartkiddoverse.firebaseapp.com",
  projectId: "smartkiddoverse",
  storageBucket: "smartkiddoverse.firebasestorage.app",
  messagingSenderId: "10233173121",
  appId: "1:10233173121:web:c2e5d736dba8b5e2a0e980",
  measurementId: "G-ZYGFYK7MHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
