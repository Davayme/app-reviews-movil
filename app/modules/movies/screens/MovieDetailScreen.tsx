import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { HeaderMovieDetails } from '../components/MovieDetails/HeaderMovieDetails';
import { getDetailMovie } from '../services/movieService';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors } from '@/app/common/utils/constants';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { CustomLoading } from '@/app/common/components/Loading/CustomLoading';

const MovieDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, userId } = route.params as { id: number; userId: number };
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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
    return <CustomLoading />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/modules/movies/screens/MainScreen')}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <ScrollView style={tw`flex-1 bg-black`}>
        {movie && <HeaderMovieDetails movie={movie} />}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['background-color'],
  },
  loadingContainer: {
    backgroundColor: colors['background-color'],
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
});

export default MovieDetailScreen;