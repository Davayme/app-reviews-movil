// src/modules/auth/services/authService.ts
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../common/utils/firebaseConfig";
import Constants from 'expo-constants';

const { tmdbApiUrl, tmdbBearerToken } = Constants.manifest.extra;


export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

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
    console.log(posterPaths);
    return posterPaths;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};