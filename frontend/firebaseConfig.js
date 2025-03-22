

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBk-K7Qqw3s-oIWQK5EnbhoTRMach7vF3k",
//   authDomain: "stoxflow-e43ad.firebaseapp.com",
//   projectId: "stoxflow-e43ad",
//   storageBucket: "stoxflow-e43ad.firebasestorage.app",
//   messagingSenderId: "494084380554",
//   appId: "1:494084380554:web:6b933695c6c62fa5629a73",
//   measurementId: "G-6BY50YSVBT"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// auth.settings.appVerificationDisabledForTesting = false; // Ensure verification is enabled

// export { auth, RecaptchaVerifier, signInWithPhoneNumber };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBk-K7Qqw3s-oIWQK5EnbhoTRMach7vF3k",
  authDomain: "stoxflow-e43ad.firebaseapp.com",
  projectId: "stoxflow-e43ad",
  storageBucket: "stoxflow-e43ad.firebasestorage.app",
  messagingSenderId: "494084380554",
  appId: "1:494084380554:web:6b933695c6c62fa5629a73",
  measurementId: "G-6BY50YSVBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
// auth.settings.appVerificationDisabledForTesting = false; // Ensure verification is enabled

export { auth, RecaptchaVerifier, signInWithPhoneNumber };