import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Movie } from "@/app/common/interfaces/IMovie";
import { colors } from "@/app/common/utils/constants";
import { CardMovie } from "./CardMovie";
import tw from "tailwind-react-native-classnames";
import { StyleSheet, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useWatchlist } from "../../context/WatchlistContext";

interface CarouselMoviesProps {
  title: string;
  userId: number;
  initialMovies: Movie[];
  fetchMovies: (userId: number, page: number) => Promise<any>;
  onWatchlistChange: (movieId: number, inWatchlist: boolean) => void;
}

export const CarouselMovies: React.FC<CarouselMoviesProps> = ({
  title,
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
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const { watchlist } = useWatchlist();
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setShowScrollButton(offsetX > 50);
  };
  const scrollToStart = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };
  useEffect(() => {
    setMovies(prevMovies => 
      prevMovies.map(movie => ({
        ...movie,
        inWatchlist: watchlist.has(movie.id)
      }))
    );
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [watchlist]);



  const loadMoreMovies = async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchMovies(userId, nextPage);

      if (data.results.length > 0) {
        const newMovies = data.results.map((movie: Movie) => ({
          ...movie,
          inWatchlist: watchlist.has(movie.id)
        }));
        setMovies(prev => [...prev, ...newMovies]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const LoadingSpinner = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.azul} />
    </View>
  );

  return (
    <View style={tw`mb-6 relative`}>
      <Animated.View
        style={[tw`flex-row items-center mb-4 px-4`, { opacity: titleOpacity }]}
      >
        <MaterialIcons
          name={title.includes("Populares") ? "local-fire-department" : "movie"}
          size={24}
          color={colors.yellow}
          style={tw`mr-2`}
        />
        <Text style={[tw`text-xl font-bold`, { color: colors.yellow }]}>
          {title}
        </Text>
      </Animated.View>
      <FlatList
        ref={flatListRef}
        data={movies}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <CardMovie movie={item} onWatchlistChange={onWatchlistChange}/>}
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.magenta,
    paddingLeft: 12,
  },
});
