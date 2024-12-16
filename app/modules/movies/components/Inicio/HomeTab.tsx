import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { CarouselMovies } from './CarouselMovies';
import { useAuth } from '@/app/modules/auth/hooks/useAuth';
import { getPopularMovies, getNowPlayingMovies } from '../../services/movieService';
import { Movie } from '@/app/common/interfaces/IMovie';
import { useWatchlist } from '@/app/modules/movies/context/WatchlistContext';
import tw from 'tailwind-react-native-classnames';
import { colors } from '@/app/common/utils/constants';
import SkeletonPlaceholder from '../PlaceHolder/PlaceHolder';

export default function HomeTab() {
  const { user } = useAuth();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isLoadingNowPlaying, setIsLoadingNowPlaying] = useState(true);
  const { watchlist } = useWatchlist();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    setPopularMovies(prev => 
      prev.map(movie => ({
        ...movie,
        inWatchlist: watchlist.has(movie.id)
      }))
    );
    
    setNowPlayingMovies(prev => 
      prev.map(movie => ({
        ...movie,
        inWatchlist: watchlist.has(movie.id)
      }))
    );
  }, [watchlist]);

  const updateMovieInList = (movieId: number, inWatchlist: boolean) => {
    setPopularMovies(prev => 
      prev.map(movie => 
        movie.id === movieId ? { ...movie, inWatchlist } : movie
      )
    );
    
    setNowPlayingMovies(prev => 
      prev.map(movie => 
        movie.id === movieId ? { ...movie, inWatchlist } : movie
      )
    );
  };

  const loadInitialData = async () => {
    try {
      setIsLoadingPopular(true);
      setIsLoadingNowPlaying(true);
      const [popularData, nowPlayingData] = await Promise.all([
        getPopularMovies(user?.id || 1, 1),
        getNowPlayingMovies(user?.id || 1, 1)
      ]);

      setPopularMovies(popularData.results);
      setNowPlayingMovies(nowPlayingData.results);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoadingPopular(false);
      setIsLoadingNowPlaying(false);
    }
  };

  return (
    <ScrollView 
      style={[tw`flex-1`, { backgroundColor: '#1b1b1b' }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[tw`text-xl font-bold mb-4 px-4`, { color: colors.yellow }]}>
        Películas Populares
      </Text>
      {isLoadingPopular ? (
        <SkeletonPlaceholder />
      ) : (
        <CarouselMovies
          userId={user?.id || 1}
          initialMovies={popularMovies}
          fetchMovies={getPopularMovies}
          onWatchlistChange={updateMovieInList}
        />
      )}

      <Text style={[tw`text-xl font-bold mb-4 px-4 mt-6`, { color: colors.yellow }]}>
        Últimos Estrenos
      </Text>
      {isLoadingNowPlaying ? (
        <SkeletonPlaceholder />
      ) : (
        <CarouselMovies
          userId={user?.id || 1}
          initialMovies={nowPlayingMovies}
          fetchMovies={getNowPlayingMovies}
          onWatchlistChange={updateMovieInList}
        />
      )}
    </ScrollView>
  );
}