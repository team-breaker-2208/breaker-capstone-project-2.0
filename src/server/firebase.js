// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBERzHrD9zSDSnn_TQbi-q52Zky9nZ3yjo",
  authDomain: "breaker-capstone-project.firebaseapp.com",
  projectId: "breaker-capstone-project",
  storageBucket: "breaker-capstone-project.appspot.com",
  messagingSenderId: "200626535902",
  appId: "1:200626535902:web:2f5b25c3e348a74768f14f",
  measurementId: "G-2H39XCZ8MW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore()