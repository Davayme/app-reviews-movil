import React, { createContext, useContext, useState } from 'react';

interface ReviewContextType {
  triggerRefresh: () => void;
  addRefreshListener: (callback: () => void) => () => void;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listeners] = useState<Set<() => void>>(new Set());

  const triggerRefresh = () => {
    listeners.forEach(listener => listener());
  };

  const addRefreshListener = (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  return (
    <ReviewContext.Provider value={{ triggerRefresh, addRefreshListener }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReviewContext must be used within ReviewProvider');
  return context;
};