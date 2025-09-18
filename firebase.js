import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLjZufXbsJDvjHFkHhRH2ylGcf2wBA2ro",
  authDomain: "defect-tracker-90c14.firebaseapp.com",
  projectId: "defect-tracker-90c14",
  storageBucket: "defect-tracker-90c14.firebasestorage.app",
  messagingSenderId: "1091937130543",
  appId: "1:1091937130543:web:6e640e215a7e399bb94eda",
  measurementId: "G-0KP05JZYFM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
