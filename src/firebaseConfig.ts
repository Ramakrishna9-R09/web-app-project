import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "",
  authDomain: "vit-connect-420a2.firebaseapp.com",
  projectId: "vit-connect-420a2",
  storageBucket: "vit-connect-420a2.appspot.com",
  messagingSenderId: "1030046126425",
  appId: "1:1030046126425:web:e360a8ddd203035d57bc48",
  measurementId: "G-Q8XPVJJ6WE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
