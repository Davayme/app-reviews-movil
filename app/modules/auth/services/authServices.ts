// src/modules/auth/services/authService.ts
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../common/utils/firebaseConfig";

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};