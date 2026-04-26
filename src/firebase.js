import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyDfhExWKhUcEcwJj_7DVy4LUj38ha6y0TU",
  authDomain: "db10edsonprova.firebaseapp.com",
  projectId: "db10edsonprova",
  storageBucket: "db10edsonprova.firebasestorage.app",
  messagingSenderId: "415037902653",
  appId: "1:415037902653:web:a705d2726760cbeacaff54",
  measurementId: "G-1TDWE7Y7RN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;

