import React, { createContext, useContext, useState } from 'react';
import { Movie } from '@/app/common/interfaces/IMovie';

interface WatchlistContextProps {
  watchlist: Set<number>;
  toggleWatchlist: (movieId: number) => void;
}

const WatchlistContext = createContext<WatchlistContextProps | undefined>(undefined);

export const WatchlistProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set());

  const toggleWatchlist = (movieId: number) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(movieId)) {
        newWatchlist.delete(movieId);
      } else {
        newWatchlist.add(movieId);
      }
      return newWatchlist;
    });
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};