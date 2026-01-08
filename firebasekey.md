// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCw7Eg6JMqFZf1SQW0KbgPTjL_-rczJRpU",
  authDomain: "copypasteui26.firebaseapp.com",
  projectId: "copypasteui26",
  storageBucket: "copypasteui26.firebasestorage.app",
  messagingSenderId: "607326162508",
  appId: "1:607326162508:web:d03e0174a3313677f3aee9",
  measurementId: "G-8Z76QB0T8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);