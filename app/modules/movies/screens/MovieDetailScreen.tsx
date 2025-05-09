import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { HeaderMovieDetails } from "../components/MovieDetails/HeaderMovieDetails";
import { getDetailMovie } from "../services/movieService";
import { RouteProp, useRoute } from "@react-navigation/native";
import { colors } from "@/app/common/utils/constants";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { CustomLoading } from "@/app/common/components/Loading/CustomLoading";
import { DirectorAndCastSection } from "../components/MovieDetails/DirectorAndCastSection";
import ReviewModal from "../components/MovieDetails/ReviewModal";
import * as Animatable from "react-native-animatable";
import { getUserReviewByMovie } from "../services/reviewService";
import ListReviews from "../components/MovieDetails/ListReviews";

type RootStackParamList = {
  MovieDetailScreen: { id: number; userId: number };
};

type MovieDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "MovieDetailScreen"
>;

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
  score: string | null;
  inWatchlist: boolean;
  viewed: boolean;
  overview: string;
  cast: Person[];
  directors: Person[];
}

interface UserReview {
  id: number;
  rating: number;
  reviewText: string | null;
  containsSpoiler: boolean;
  likesCount: number;
  createdAt: string;
}

const MovieDetailScreen: React.FC = () => {
  const route = useRoute<MovieDetailScreenRouteProp>();
  const { id, userId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [userReview, setUserReview] = useState<UserReview | null>(null);
  const [reviewsKey, setReviewsKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieDetails, review] = await Promise.all([
          getDetailMovie(id, userId),
          getUserReviewByMovie(userId, id),
        ]);
        setMovie(movieDetails);
        setUserReview(review || null); 
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, userId]);

  const handleWatchlistToggle = () => {
    if (movie) {
      // Si se está quitando de watchlist y está vista, actualizar ambos estados
      if (movie.inWatchlist && movie.viewed) {
        setMovie({
          ...movie,
          inWatchlist: false,
          viewed: false,
        });
      } else {
        // Si no, solo actualizar watchlist
        setMovie({
          ...movie,
          inWatchlist: !movie.inWatchlist,
        });
      }
    }
  };

  const handleWatchedToggle = () => {
    if (movie) {
      setMovie({
        ...movie,
        viewed: !movie.viewed,
      });
    }
  };

  if (loading) {
    return <CustomLoading />;
  }

  const handleReviewSubmit = (
    rating: number,
    review?: string,
    newReview?: any
  ) => {
    if (newReview) {
      setUserReview(newReview);
    } else {
      setUserReview(null);
    }
    setReviewsKey((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setReviewModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/modules/movies/screens/MainScreen")}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={tw`flex-1 bg-black`}>
        <ScrollView
          style={tw`flex-1 bg-black`}
          showsVerticalScrollIndicator={false}
        >
          {movie && (
            <>
              <HeaderMovieDetails movie={movie} />
              <DirectorAndCastSection
                cast={movie.cast}
                directors={movie.directors}
              />
              <ListReviews
                key={reviewsKey}
                movieId={movie.id}
                userId={userId}
              />
            </>
          )}
        </ScrollView>
      </View>

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
          userId={userId}
          movieId={movie.id}
          isVisible={isReviewModalVisible}
          movieTitle={movie.title}
          posterPath={movie.poster_path}
          releaseDate={movie.release_date}
          onClose={handleCloseModal}
          isInWatchlist={movie.inWatchlist}
          isWatched={movie.viewed}
          onWatchlistToggle={handleWatchlistToggle}
          onWatchedToggle={handleWatchedToggle}
          existingReview={userReview}
          onSubmitReview={handleReviewSubmit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors["background-color"],
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 10,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  floatingButton: {
    backgroundColor: colors["magenta"],
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
});

export default MovieDetailScreen;
