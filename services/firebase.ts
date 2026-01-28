
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do projeto Vigilante usando variáveis de ambiente do Vite
// Caso as variáveis não existam, usa os valores padrão fornecidos
// Fix: Use process.env as per environment expectations to avoid TypeScript errors on import.meta.env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBdX3b9ETTjQhm7rp7b6ksKkyDS73NirwE",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "vigilante-d09be.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "vigilante-d09be",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "vigilante-d09be.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "485517267312",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:485517267312:web:0b418c4404e1574609bfb5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
