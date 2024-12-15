import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { CarouselMovies } from './CarouselMovies';
import { useAuth } from '@/app/modules/auth/hooks/useAuth';
import { LoadingScreen } from '@/app/common/components/Loading/LoadingScreen';
import { getPopularMovies, getNowPlayingMovies } from '../../services/movieService';
import { Movie } from '@/app/common/interfaces/IMovie';
import tw from 'tailwind-react-native-classnames';

export default function HomeTab() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [popularData, nowPlayingData] = await Promise.all([
        getPopularMovies(user?.id || 1, 1),
        getNowPlayingMovies(user?.id || 1, 1)
      ]);

      setPopularMovies(popularData.results);
      setNowPlayingMovies(nowPlayingData.results);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView 
      style={[tw`flex-1`, { backgroundColor: '#1b1b1b' }]}
      showsVerticalScrollIndicator={false}
    >
      <CarouselMovies
        title="Películas Populares"
        userId={user?.id || 1}
        initialMovies={popularMovies}
        fetchMovies={getPopularMovies}
      />
      <CarouselMovies
        title="Últimos Estrenos"
        userId={user?.id || 1}
        initialMovies={nowPlayingMovies}
        fetchMovies={getNowPlayingMovies}
      />
    </ScrollView>
  );
}