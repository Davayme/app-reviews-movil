// src/modules/auth/services/authService.ts
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../common/utils/firebaseConfig";
import Constants from 'expo-constants';
import { API_URL } from "@/app/common/utils/constants";

const { tmdbApiUrl, tmdbBearerToken } = Constants.manifest.extra;

export const getPopularMovies = async () => {
  const url = `${tmdbApiUrl}/movie/popular?language=es-ES&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbBearerToken}`
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const posterPaths = data.results.slice(0, 6).map((movie: any) => movie.poster_path);
    return posterPaths;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};


export const registerUser = async (email: string, password: string, name?: string) => {
  try {
    // Registrar al usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Registrar al usuario en tu backend
    const url = `${API_URL}/user/register`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, email, name }),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar el usuario en el backend');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error registering user:', error);

    // Manejar errores específicos de Firebase
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('El correo electrónico ya está en uso.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('El correo electrónico no es válido.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('La contraseña es demasiado débil.');
    }


    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }

    throw new Error(error.message || 'Error al registrar el usuario.');
  }
};