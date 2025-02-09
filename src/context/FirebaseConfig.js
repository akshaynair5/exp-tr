import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYq-8EkifszyDNBvTzNfFkCWeVEKqtVJc",
  authDomain: "task-round-assignment.firebaseapp.com",
  projectId: "task-round-assignment",
  storageBucket: "task-round-assignment.appspot.com",
  messagingSenderId: "112721315589",
  appId: "1:112721315589:web:d162cdde4a47ecb10a996c",
  measurementId: "G-1K2EKW4W73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);