import React, { createContext, useContext, useState } from 'react';

export const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

interface WatchlistContextType {
  watchlist: Set<number>;
  toggleWatchlist: (movieId: number) => void;
  lastUpdatedMovie: {
    id: number;
    inWatchlist: boolean;
  } | null;
}

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set());
  const [lastUpdatedMovie, setLastUpdatedMovie] = useState<{id: number; inWatchlist: boolean} | null>(null);

  const toggleWatchlist = (movieId: number) => {
    const newWatchlist = new Set(watchlist);
    const inWatchlist = !newWatchlist.has(movieId);
    
    if (inWatchlist) {
      newWatchlist.add(movieId);
    } else {
      newWatchlist.delete(movieId);
    }
    
    setWatchlist(newWatchlist);
    setLastUpdatedMovie({ id: movieId, inWatchlist });
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist, lastUpdatedMovie }}>
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