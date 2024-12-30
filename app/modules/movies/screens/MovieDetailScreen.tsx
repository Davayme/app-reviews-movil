import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { HeaderMovieDetails } from '../components/MovieDetails/HeaderMovieDetails';
import { getDetailMovie } from '../services/movieService';
import { RouteProp, useRoute } from '@react-navigation/native';
import { colors } from '@/app/common/utils/constants';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { CustomLoading } from '@/app/common/components/Loading/CustomLoading';
import { DirectorAndCastSection } from '../components/MovieDetails/DirectorAndCastSection';
import ReviewModal from '../components/MovieDetails/ReviewModal';
import * as Animatable from 'react-native-animatable';

type RootStackParamList = {
  MovieDetailScreen: { id: number; userId: number };
};

type MovieDetailScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetailScreen'>;

interface Person {
  id: number;
  name: string;
  profile_path: string;
}

interface Movie {
  id: number;
  title: string;
  tagline: string;
  genres: { id: number; name: string }[];
  vote_average: number;
  release_date: string;
  img: string;
  poster_path: string;
  runtime: number;
  score: number | null;
  inWatchlist: boolean;
  viewed: boolean;
  overview: string;
  cast: Person[];
  directors: Person[];
}

const MovieDetailScreen: React.FC = () => {
  const route = useRoute<MovieDetailScreenRouteProp>();
  const { id, userId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
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
        {movie && <DirectorAndCastSection cast={movie.cast} directors={movie.directors} />}
      </ScrollView>
      <Animatable.View
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
        duration={2000}
        style={styles.floatingButtonContainer}
      >
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setReviewModalVisible(true)}
        >
          <Icon name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animatable.View>
      {movie && (
        <ReviewModal
          isVisible={isReviewModalVisible}
          onClose={() => setReviewModalVisible(false)}
          isInWatchlist={movie.inWatchlist}
          isWatched={movie.viewed}
          onWatchlistToggle={() => {
            // Lógica para agregar o quitar de la watchlist
          }}
          onWatchedToggle={() => {
            // Lógica para marcar como vista o no vista
          }}
          onSubmitReview={(rating, review) => {
            // Lógica para enviar la reseña
            setReviewModalVisible(false);
          }}
          
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  floatingButton: {
    backgroundColor: colors['magenta'],
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
});

export default MovieDetailScreen;