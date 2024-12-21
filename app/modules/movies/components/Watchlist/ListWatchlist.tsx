import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getUserWatchlist } from "../../services/watchlistService";
import { colors } from "@/app/common/utils/constants";
import { IWatchlistItem } from "@/app/common/interfaces/IWatchlist";
import { useAuth } from "@/app/modules/auth/hooks/useAuth";
import tw from "tailwind-react-native-classnames";
import { CardWatchlistMovie } from "./CardWatchlistMovie";

export const ListWatchlist = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<IWatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "viewed" | "pending">("all");

  const loadWatchlist = async () => {
    try {
      setIsLoading(true);
      const response = await getUserWatchlist(user?.id || 0);
      setMovies(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWatchlist();
    setRefreshing(false);
  }, []);

  const handleToggleViewed = (id: number, viewed: boolean) => {
    setMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === id ? { ...movie, viewed } : movie
      )
    );
  };

  const renderMovie = ({ item, index }: { item: IWatchlistItem; index: number }) => (
    <CardWatchlistMovie 
      item={item} 
      index={index}
      userId={user?.id || 0}
      onToggleViewed={handleToggleViewed}
    />
  );

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  if (movies.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <MaterialIcons name="movie" size={48} color={colors.gris} />
        <Text style={[tw`text-center mt-4 text-lg`, { color: colors.gris }]}>
          No hay películas en tu watchlist
        </Text>
        <TouchableOpacity
          style={[tw`mt-4 px-6 py-3 rounded-full`, { backgroundColor: colors.yellow }]}
          onPress={onRefresh}
        >
          <Text style={tw`font-bold`}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const FilterButton = ({ 
    label, 
    value, 
    icon 
  }: { 
    label: string, 
    value: "all" | "viewed" | "pending",
    icon: string
  }) => (
    <TouchableOpacity
      style={[
        tw`px-4 py-2 rounded-full flex-row items-center`,
        filter === value && { backgroundColor: colors.magenta }
      ]}
      onPress={() => setFilter(value)}
    >
      <MaterialIcons
        name={icon as keyof typeof MaterialIcons.glyphMap}
        size={16}
        color={filter === value ? '#fff' : colors.gris}
        style={tw`mr-2`}
      />
      <Text style={[
        tw`font-medium`,
        { color: filter === value ? '#fff' : colors.gris }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors["background-color"] }]}>
      <StatusBar backgroundColor={colors["background-color"]} barStyle="light-content" />
      
      <View style={tw`flex-row justify-center py-6`}>
        <View style={[tw`flex-row rounded-full p-1`, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
          <FilterButton
            label="Todas"
            value="all"
            icon="local-movies"
          />
          <FilterButton
            label="Pendientes"
            value="pending"
            icon="watch-later"
          />
          <FilterButton
            label="Vistas"
            value="viewed"
            icon="done-all"
          />
        </View>
      </View>

      <FlatList
        data={movies.filter(movie => {
          if (filter === 'viewed') return movie.viewed;
          if (filter === 'pending') return !movie.viewed;
          return true;
        })}
        renderItem={renderMovie}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={tw`px-4 pt-2 pb-6`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.yellow}
          />
        }
      />
    </View>
  );
};