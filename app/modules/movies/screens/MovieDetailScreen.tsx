import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { HeaderMovieDetails } from '../components/MovieDetails/HeaderMovieDetails';
import { getDetailMovie } from '../services/movieService';
import { useRoute } from '@react-navigation/native';
import { colors } from '@/app/common/utils/constants';
import tw from 'tailwind-react-native-classnames';

const MovieDetailScreen: React.FC = () => {
  const route = useRoute();
  const { id, userId } = route.params as { id: number; userId: number };
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDetails = await getDetailMovie(id, userId);
        setMovie(movieDetails);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, userId]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-black`}>
      {movie && <HeaderMovieDetails movie={movie} />}
      {/* Aquí puedes agregar las secciones de actores, directores y reviews */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['background-color'],
  },
});

export default MovieDetailScreen;