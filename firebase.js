import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAe--7-takZS4VP7rSstejdp4dCQul1qso",
  authDomain: "finance-2a36d.firebaseapp.com",
  projectId: "finance-2a36d",
  storageBucket: "finance-2a36d.firebasestorage.app",
  messagingSenderId: "94936102372",
  appId: "1:94936102372:web:f5054cd16bd4e3f29003f1",
  measurementId: "G-MC6JLJPJX4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
