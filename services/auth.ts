
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "../types";

// Helper para buscar dados do perfil no Firestore
export const getUserProfile = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: uid,
      email: data.email,
      name: data.nome,
      isPremium: data.plano === "premium"
    };
  }
  return null;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  
  // Atualiza última atividade
  const docRef = doc(db, "usuarios", uid);
  await updateDoc(docRef, {
    ultima_atividade: serverTimestamp()
  });

  const profile = await getUserProfile(uid);
  if (!profile) throw new Error("Perfil não encontrado no Firestore.");
  
  return profile;
};

export const registerUser = async (name: string, email: string, password?: string): Promise<User> => {
  if (!password) throw new Error("Password é necessária para registo Firebase.");
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Atualiza o perfil do Firebase Auth (opcional, mas bom para consistência)
  await updateProfile(userCredential.user, { displayName: name });

  // Cria documento no Firestore seguindo exatamente a estrutura solicitada
  const newUserDoc = {
    nome: name,
    email: email,
    plano: "gratuito",
    data_registo: serverTimestamp(),
    ultima_atividade: serverTimestamp()
  };

  // Usa o UID como ID do documento na coleção "usuarios"
  await setDoc(doc(db, "usuarios", uid), newUserDoc);

  return {
    id: uid,
    email: email,
    name: name,
    isPremium: false
  };
};

export const resetPassword = async (email: string) => {
  if (!email) throw new Error("Introduza o seu email primeiro.");
  await sendPasswordResetEmail(auth, email);
};

export const logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem('vigilante_session');
};
