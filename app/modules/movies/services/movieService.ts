import { API_URL } from '@/app/common/utils/constants';
import { MovieResponse } from '@/app/common/interfaces/IMovie';

export const getPopularMovies = async (userId: number, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/movies/popular?idUser=${userId}&language=es-ES&page=${page}`
    );
    if (!response.ok) throw new Error('Error al obtener películas populares');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getNowPlayingMovies = async (userId: number, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/movies/now-playing?idUser=${userId}&language=es-ES&page=${page}`
    );
    if (!response.ok) throw new Error('Error al obtener películas en cartelera');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};