import React, { createContext, useContext, useState, useCallback } from 'react';
import { getUserWatchlist } from '../services/watchlistService';
import { useAuth } from '@/app/modules/auth/hooks/useAuth';
import { IWatchlistItem } from '@/app/common/interfaces/IWatchlist';

interface WatchlistContextType {
  movies: IWatchlistItem[];
  silentlyRefetchWatchlist: () => Promise<void>;
  isRefetching: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Obtener el usuario del contexto de autenticación
  const [movies, setMovies] = useState<IWatchlistItem[]>([]); // Especificar el tipo
  const [isRefetching, setIsRefetching] = useState(false);

  const silentlyRefetchWatchlist = useCallback(async () => {
    if (!user) return; // Validación temprana

    setIsRefetching(true);
    try {
      const response = await getUserWatchlist(user.id);
      setMovies(response.data);
    } catch (error) {
      console.error('Error refetching watchlist:', error);
    } finally {
      setIsRefetching(false);
    }
  }, [user]); // Añadir user como dependencia

  return (
    <WatchlistContext.Provider value={{ movies, silentlyRefetchWatchlist, isRefetching }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist debe usarse dentro de un WatchlistProvider');
  }
  return context;
};