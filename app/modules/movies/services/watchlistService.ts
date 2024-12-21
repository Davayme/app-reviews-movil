import { IWatchlistResponse } from '@/app/common/interfaces/IWatchlist';
import { API_URL } from '@/app/common/utils/constants';

interface AddToWatchlistDto {
  userId: number;
  movieId: number;
  title: string;
  posterPath?: string;
  releaseDate?: Date;
}

export const addToWatchlist = async (movie: AddToWatchlistDto): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/watchlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movie),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al agregar a watchlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en addToWatchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (userId: number, movieId: number): Promise<any> => {
  try {
    const response = await fetch(
      `${API_URL}/watchlist/remove/${userId}/${movieId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar de watchlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en removeFromWatchlist:', error);
    throw error;
  }
};

export const getUserWatchlist = async (userId: number): Promise<IWatchlistResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/watchlist/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener el watchlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUserWatchlist:', error);
    throw error;
  }
};

export interface UpdateViewedStatusDto {
  userId: number;
  movieId: number;
  viewed: boolean;
}

export const updateMovieViewedStatus = async (data: UpdateViewedStatusDto): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/watchlist/viewed-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar estado de película');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateMovieViewedStatus:', error);
    throw error;
  }
};