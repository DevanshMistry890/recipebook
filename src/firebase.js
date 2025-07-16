import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7NIiqUayru2r2SpB0E18XprXFyGI6VU4",
  authDomain: "recipe-book-95f5f.firebaseapp.com",
  projectId: "recipe-book-95f5f",
  databaseURL: "https://recipe-book-95f5f-default-rtdb.firebaseio.com",
  storageBucket: "recipe-book-95f5f.firebasestorage.app",
  messagingSenderId: "59513837638",
  appId: "1:59513837638:web:d429d39f9fd8c34cc29247"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };