// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
console.log('firebaseID',import.meta.env.KEY_FIREBASE);
const firebaseConfig = {
  apiKey: "AIzaSyARomMjQNdUOJbQtcMOcR-5X326RdkR93Y",
  authDomain: "sevenestate-714e4.firebaseapp.com",
  projectId: "sevenestate-714e4",
  storageBucket: "sevenestate-714e4.appspot.com",
  messagingSenderId: "988980750904",
  appId: "1:988980750904:web:6d934927872256bf27d4cd",
  measurementId: "G-TRPFJPCTCC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);