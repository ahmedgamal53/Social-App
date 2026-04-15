import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3mP6YbPR5_j7OYq1A5p5Wl76pfYK3VCo",
  authDomain: "social-media-app-8baed.firebaseapp.com",
  projectId: "social-media-app-8baed",
  storageBucket: "social-media-app-8baed.appspot.com",
  messagingSenderId: "559756905873",
  appId: "1:559756905873:web:1294a2c7c55898151bde30",
  measurementId: "G-E60H417D2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services (الـ Backend بتاعك)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
