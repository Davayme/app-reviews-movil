import { API_URL } from '@/app/common/utils/constants';

export interface Movie {
  id: number;
  title: string;
  posterPath?: string;
  releaseDate: string;
  createdAt: string;
}

export interface Review {
  id: number;
  userId: number;
  movieId: number;
  rating: number;
  reviewText: string;
  containsSpoiler: boolean;
  likesCount: number;
  createdAt: string;
  movie: Movie;
}

export interface WatchlistItem {
  id: number;
  userId: number;
  movieId: number;
  viewed: boolean;
  addedAt: string;
  movie: Movie;
}

export interface UserProfile {
  id: number;
  uid: string;
  email: string;
  name: string;
  createdAt: string;
  reviews: Review[];
  watchlist: WatchlistItem[];
}

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener el perfil del usuario');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en getUserProfile:', error);
      throw error;
    }
  };