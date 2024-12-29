import { API_URL } from '@/app/common/utils/constants';
import { MovieResponse } from '@/app/common/interfaces/IMovie';

export const getPopularMovies = async (userId: number, page: number = 1): Promise<MovieResponse> => {
  console.log('Fetching popular movies:', { userId, page }); // Debug
  try {
    const response = await fetch(
      `${API_URL}/movies/popular?idUser=${userId}&language=es-ES&page=${page}`
    );
    const data = await response.json();
    console.log('API Response:', {
      page: data.page,
      totalPages: data.total_pages,
      results: data.results.length
    });
    console.log('Popular movies:', data.results); // Debug
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
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

export const searchMovies = async (
  query: string,
  language: string = 'es-ES',
  page: number = 1
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_URL}/movies/search?query=${encodeURIComponent(query)}&language=${language}&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error searching movies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getDetailMovie = async (id: number, userId: number, language: string = 'es-ES') => {
  try {
    const response = await fetch(`${API_URL}/movies/detail-movie/${id}?userId=${userId}&language=${language}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching movie details');
    }
    const data = await response.json();
     console.log('Movie details:', data); 
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};