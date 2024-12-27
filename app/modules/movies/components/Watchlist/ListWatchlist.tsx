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
import { colors } from "@/app/common/utils/constants";
import { useAuth } from "@/app/modules/auth/hooks/useAuth";
import tw from "tailwind-react-native-classnames";
import { CardWatchlistMovie } from "./CardWatchlistMovie";
import { useWatchlist } from "../../context/WatchlistContextGlobal";
import { SortWatchlist } from "./SortWatchlist";

export const ListWatchlist = () => {
  const { user } = useAuth();
  const { movies, isRefetching, silentlyRefetchWatchlist } = useWatchlist();
  const [filter, setFilter] = useState<"all" | "viewed" | "pending">("all");
  const [sortedMovies, setSortedMovies] = useState(movies);

  useEffect(() => {
    if (currentSort.type && currentSort.order) {
      const sorted = sortMovies(movies, currentSort.type, currentSort.order);
      setSortedMovies(sorted);
    } else {
      setSortedMovies(movies);
    }
  }, [movies]);

  const [currentSort, setCurrentSort] = useState<{
    type: "title" | "date" | null;
    order: "asc" | "desc" | null;
  }>({ type: null, order: null });

  const handleSort = (type: "title" | "date", order: "asc" | "desc") => {
    setCurrentSort({ type, order });
    const sorted = sortMovies(movies, type, order);
    setSortedMovies(sorted);
  };

  const sortMovies = (moviesToSort: any[], type: 'title' | 'date', order: 'asc' | 'desc') => {
    return [...moviesToSort].sort((a, b) => {
      if (type === 'title') {
        return order === 'asc'
          ? a.movie.title.localeCompare(b.movie.title)
          : b.movie.title.localeCompare(a.movie.title);
      } else {
        const dateA = new Date(a.movie.createdAt).getTime();
        const dateB = new Date(b.movie.createdAt).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
  };


  useEffect(() => {
    silentlyRefetchWatchlist();
  }, [silentlyRefetchWatchlist]);

  const onRefresh = useCallback(async () => {
    await silentlyRefetchWatchlist();
  }, [silentlyRefetchWatchlist]);

  if (isRefetching && movies.length === 0) {
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
          style={[
            tw`mt-4 px-6 py-3 rounded-full`,
            { backgroundColor: colors.yellow },
          ]}
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
    icon,
  }: {
    label: string;
    value: "all" | "viewed" | "pending";
    icon: string;
  }) => (
    <TouchableOpacity
      style={[
        tw`px-4 py-2 rounded-full flex-row items-center`,
        filter === value && { backgroundColor: colors.magenta },
      ]}
      onPress={() => setFilter(value)}
    >
      <MaterialIcons
        name={icon as keyof typeof MaterialIcons.glyphMap}
        size={16}
        color={filter === value ? "#fff" : colors.gris}
        style={tw`mr-2`}
      />
      <Text
        style={[
          tw`font-medium`,
          { color: filter === value ? "#fff" : colors.gris },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors["background-color"] }]}>
      <StatusBar
        backgroundColor={colors["background-color"]}
        barStyle="light-content"
      />

      <View style={tw`px-4 py-6`}>
        <View style={tw`flex-row items-center`}>
          <View
            style={[
              tw`flex-row rounded-full p-1`,
              { backgroundColor: "rgba(255,255,255,0.1)" },
            ]}
          >
            <FilterButton label="Todas" value="all" icon="local-movies" />
            <FilterButton
              label="Pendientes"
              value="pending"
              icon="watch-later"
            />
            <FilterButton label="Vistas" value="viewed" icon="done-all" />
          </View>
          <View style={tw`ml-2`}>
            <SortWatchlist onSort={handleSort} />
          </View>
        </View>
      </View>

      <FlatList
        data={sortedMovies.filter((movie) => {
          if (filter === "viewed") return movie.viewed;
          if (filter === "pending") return !movie.viewed;
          return true;
        })}
        renderItem={({ item, index }) => (
          <CardWatchlistMovie
            item={item}
            index={index}
            userId={user?.id || 0}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={tw`px-4 pt-2 pb-6`}
        columnWrapperStyle={tw`justify-between`}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.yellow}
          />
        }
      />
    </View>
  );
};
