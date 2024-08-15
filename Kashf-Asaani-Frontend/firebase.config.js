// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDv9U3V54lPFbwqXYBHHKBJiLVYHp1T6WQ",
  authDomain: "kashf-asaani-otp.firebaseapp.com",
  projectId: "kashf-asaani-otp",
  storageBucket: "kashf-asaani-otp.appspot.com",
  messagingSenderId: "553733133764",
  appId: "1:553733133764:web:70919a1f099b7b37138091",
  measurementId: "G-WVVFDVJM7N"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase
// const app = initializeApp(firebaseConfig);