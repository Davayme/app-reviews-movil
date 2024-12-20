import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Movie } from "@/app/common/interfaces/IMovie";
import { colors } from "@/app/common/utils/constants";
import { CardMovie } from "./CardMovie";
import tw from "tailwind-react-native-classnames";
import { StyleSheet } from "react-native";
import { useWatchlist } from "../../context/WatchlistContext";
import { MaterialIcons } from "@expo/vector-icons";

interface CarouselMoviesProps {
  userId: number;
  initialMovies: Movie[];
  fetchMovies: (userId: number, page: number) => Promise<any>;
  onWatchlistChange: (movieId: number, inWatchlist: boolean) => void;
}

export const CarouselMovies: React.FC<CarouselMoviesProps> = ({
  userId,
  initialMovies,
  fetchMovies,
  onWatchlistChange
}) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [page, setPage] = useState(1);
  const flatListRef = useRef<FlatList>(null);
  const { watchlist, lastUpdatedMovie } = useWatchlist();

  useEffect(() => {
    if (lastUpdatedMovie) {
      setMovies(prevMovies =>
        prevMovies.map(movie =>
          movie.id === lastUpdatedMovie.id
            ? { ...movie, inWatchlist: lastUpdatedMovie.inWatchlist }
            : movie
        )
      );
    }
  }, [lastUpdatedMovie]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setShowScrollButton(offsetX > 50);
  };

  const scrollToStart = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const loadMoreMovies = async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchMovies(userId, nextPage);

      if (data.results.length > 0) {
        // Usar una función para actualizar el estado para evitar cierres anticipados
        setMovies(prev => {
          const newMovies = data.results.map((movie: Movie) => ({
            ...movie,
            inWatchlist: watchlist.has(movie.id)
          }));
          return [...prev, ...newMovies];
        });
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const memoizedCardMovie = React.useCallback(
    ({ item }: { item: Movie }) => (
      <CardMovie 
        movie={item} 
        onWatchlistChange={onWatchlistChange}
      />
    ),
    [onWatchlistChange]
  );

  const LoadingSpinner = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.azul} />
    </View>
  );

  return (
    <View style={tw`mb-6 relative`}>
      <FlatList
        ref={flatListRef}
        data={movies}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={memoizedCardMovie}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={tw`px-4`}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (isLoadingMore ? <LoadingSpinner /> : null)}
      />

      {showScrollButton && (
        <TouchableOpacity style={styles.scrollButton} onPress={scrollToStart}>
          <MaterialIcons name="arrow-back" size={24} color={colors.gris} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollButton: {
    position: "absolute",
    left: 15,
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  loadingContainer: {
    width: 80,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});