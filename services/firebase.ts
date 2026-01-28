
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração real do projeto Vigilante
const firebaseConfig = {
  apiKey: "AIzaSyBdX3b9ETTjQhm7rp7b6ksKkyDS73NirwE",
  authDomain: "vigilante-d09be.firebaseapp.com",
  projectId: "vigilante-d09be",
  storageBucket: "vigilante-d09be.firebasestorage.app",
  messagingSenderId: "485517267312",
  appId: "1:485517267312:web:0b418c4404e1574609bfb5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
