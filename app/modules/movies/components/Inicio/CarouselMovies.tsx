import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Movie } from "@/app/common/interfaces/IMovie";
import { colors } from "@/app/common/utils/constants";
import { CardMovie } from "./CardMovie";
import tw from "tailwind-react-native-classnames";
import { getPopularMovies } from "../../services/movieService";
import { StyleSheet } from "react-native";

interface CarouselMoviesProps {
  title: string;
  userId: number;
  initialMovies: Movie[];
  fetchMovies: (userId: number, page: number) => Promise<any>;
}

export const CarouselMovies: React.FC<CarouselMoviesProps> = ({
  title,
  userId,
  initialMovies,
  fetchMovies,
}) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await getPopularMovies(userId, 1);
      setMovies(data.results);
      setPage(1);
    } catch (error) {
      console.error("Error loading movies:", error);
    }
  };

  const loadMoreMovies = async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchMovies(userId, nextPage);

      if (data.results.length > 0) {
        setMovies((prev) => [...prev, ...data.results]);
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
    <View style={tw`mb-6`}>
      <Text style={[tw`text-xl font-bold mb-4 px-4`, { color: colors.yellow }]}>
        {title}
      </Text>
      <FlatList
        data={movies}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <CardMovie movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={tw`px-4`}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (isLoadingMore ? <LoadingSpinner /> : null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    width: 80,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
