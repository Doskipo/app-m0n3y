// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDO8aYPn_Ibuk_JgZF9DMP15lb-KQjxRdI",
  authDomain: "necse-6a7f5.firebaseapp.com",
  projectId: "necse-6a7f5",
  storageBucket: "necse-6a7f5.appspot.com",
  messagingSenderId: "511790790399",
  appId: "1:511790790399:web:6e45b432a7c8c2a293feca",
  measurementId: "G-T2KMRYKGCJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

