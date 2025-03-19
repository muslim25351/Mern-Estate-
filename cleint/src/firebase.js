// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c0ed5.firebaseapp.com",
  projectId: "mern-estate-c0ed5",
  storageBucket: "mern-estate-c0ed5.firebasestorage.app",
  messagingSenderId: "459746859291",
  appId: "1:459746859291:web:85f0e0c2b5aafea5c55bbe",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
