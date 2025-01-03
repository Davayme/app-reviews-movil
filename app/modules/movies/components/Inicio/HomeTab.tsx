import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Animated } from "react-native";
import { CarouselMovies } from "./CarouselMovies";
import { useAuth } from "@/app/modules/auth/hooks/useAuth";
import {
  getPopularMovies,
  getNowPlayingMovies,
} from "../../services/movieService";
import { Movie } from "@/app/common/interfaces/IMovie";
import { useWatchlist } from "@/app/modules/movies/context/WatchlistContext";
import tw from "tailwind-react-native-classnames";
import { colors } from "@/app/common/utils/constants";
import SkeletonPlaceholder from "../PlaceHolder/PlaceHolder";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeTab() {
  const { user } = useAuth();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isLoadingNowPlaying, setIsLoadingNowPlaying] = useState(true);
  const { toggleWatchlist } = useWatchlist();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const reloadCarousel = async (type: "popular" | "nowPlaying") => {
    try {
      if (type === "popular") {
        setIsLoadingPopular(true);
        const data = await getPopularMovies(user?.id || 1, 1);
        setPopularMovies(data.results);
        setIsLoadingPopular(false);
      } else {
        setIsLoadingNowPlaying(true);
        const data = await getNowPlayingMovies(user?.id || 1, 1);
        setNowPlayingMovies(data.results);
        setIsLoadingNowPlaying(false);
      }
    } catch (error) {
      console.error("Error reloading carousel:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const updateMovieInList = async (
    movieId: number,
    inWatchlist: boolean,
    fromCarousel: "popular" | "nowPlaying"
  ) => {
    toggleWatchlist(movieId);

    // Siempre recargar el otro carrusel
    if (fromCarousel === "popular") {
      await reloadCarousel("nowPlaying");
    } else {
      await reloadCarousel("popular");
    }
  };

  const loadInitialData = async () => {
    try {
      setIsLoadingPopular(true);
      setIsLoadingNowPlaying(true);
      const [popularData, nowPlayingData] = await Promise.all([
        getPopularMovies(user?.id || 1, 1),
        getNowPlayingMovies(user?.id || 1, 1),
      ]);

      setPopularMovies(popularData.results);
      setNowPlayingMovies(nowPlayingData.results);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoadingPopular(false);
      setIsLoadingNowPlaying(false);
    }
  };

  return (
    <Animated.ScrollView
      style={[tw`flex-1`, { backgroundColor: "#1b1b1b", opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[tw`flex-row items-center mb-4 px-4`, { marginTop: 10 }]}>
        <MaterialIcons
          name="local-fire-department"
          size={24}
          color={colors.yellow}
        />
        <Text style={[tw`text-xl font-bold ml-2`, { color: colors.yellow }]}>
          Películas Populares
        </Text>
      </View>
      {isLoadingPopular ? (
        <SkeletonPlaceholder />
      ) : (
        <CarouselMovies
          userId={user?.id || 1}
          initialMovies={popularMovies}
          fetchMovies={getPopularMovies}
          onWatchlistChange={(movieId, inWatchlist) =>
            updateMovieInList(movieId, inWatchlist, "popular")
          }
        />
      )}

      <View style={tw`flex-row items-center mb-4 px-4 mt-6`}>
        <MaterialIcons name="movie" size={24} color={colors.yellow} />
        <Text style={[tw`text-xl font-bold ml-2`, { color: colors.yellow }]}>
          Últimos Estrenos
        </Text>
      </View>
      {isLoadingNowPlaying ? (
        <SkeletonPlaceholder />
      ) : (
        <CarouselMovies
          userId={user?.id || 1}
          initialMovies={nowPlayingMovies}
          fetchMovies={getNowPlayingMovies}
          onWatchlistChange={(movieId, inWatchlist) =>
            updateMovieInList(movieId, inWatchlist, "nowPlaying")
          }
        />
      )}
    </Animated.ScrollView>
  );
}
