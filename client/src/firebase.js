// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "marketplacediplom.firebaseapp.com",
  projectId: "marketplacediplom",
  storageBucket: "marketplacediplom.appspot.com",
  messagingSenderId: "212641592612",
  appId: "1:212641592612:web:2499ba4b78196e49c26fb1",
  measurementId: "G-QFYZSJX5L0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
