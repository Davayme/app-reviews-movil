import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyBe4mSlim2Dsm4JPNe9ecbEd8sOpZX_rGw",
  authDomain: "reviews-8b145.firebaseapp.com",
  projectId: "reviews-8b145",
  storageBucket: "reviews-8b145.firebasestorage.app",
  messagingSenderId: "88859850240",
  appId: "1:88859850240:web:ff6a10ffb49a575cc78ae5",
  measurementId: "G-RQ0XZBHEFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

// Export default to satisfy expo-router requirement
export default app;