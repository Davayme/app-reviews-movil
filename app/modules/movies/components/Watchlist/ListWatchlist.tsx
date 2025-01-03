import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/app/common/utils/constants";
import { useAuth } from "@/app/modules/auth/hooks/useAuth";
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

  const sortMovies = (
    moviesToSort: any[],
    type: "title" | "date",
    order: "asc" | "desc"
  ) => {
    return [...moviesToSort].sort((a, b) => {
      if (type === "title") {
        return order === "asc"
          ? a.movie.title.localeCompare(b.movie.title)
          : b.movie.title.localeCompare(a.movie.title);
      } else {
        const dateA = new Date(a.movie.createdAt).getTime();
        const dateB = new Date(b.movie.createdAt).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  if (movies.length === 0) {
    return (
      <View style={[styles.centered, styles.padding]}>
        <MaterialIcons name="movie" size={48} color={colors.gris} />
        <Text
          style={[
            styles.textCenter,
            styles.marginTop,
            styles.textLg,
            { color: colors.gris },
          ]}
        >
          No hay películas en tu watchlist
        </Text>
        <TouchableOpacity
          style={[
            styles.marginTop,
            styles.button,
            { backgroundColor: colors.yellow },
          ]}
          onPress={onRefresh}
        >
          <Text style={styles.fontBold}>Actualizar</Text>
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
        styles.filterButton,
        filter === value && { backgroundColor: colors.magenta },
      ]}
      onPress={() => setFilter(value)}
    >
      <MaterialIcons
        name={icon as keyof typeof MaterialIcons.glyphMap}
        size={16}
        color={filter === value ? "#fff" : colors.gris}
        style={styles.iconMargin}
      />
      <Text
        style={[
          styles.fontMedium,
          { color: filter === value ? "#fff" : colors.gris },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.flex1, { backgroundColor: colors["background-color"] }]}
    >
      <StatusBar
        backgroundColor={colors["background-color"]}
        barStyle="light-content"
      />

      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <FilterButton label="Todas" value="all" icon="local-movies" />
          <FilterButton label="Pendientes" value="pending" icon="watch-later" />
          <FilterButton label="Vistas" value="viewed" icon="done-all" />
        </View>
        <View style={styles.sortContainer}>
          <SortWatchlist onSort={handleSort} />
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
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
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

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  padding: {
    padding: 16,
  },
  textCenter: {
    textAlign: "center",
  },
  marginTop: {
    marginTop: 16,
  },
  textLg: {
    fontSize: 18,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  fontBold: {
    fontWeight: "bold",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: 4,
    flex: 1,
    marginRight: 12,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 2,
  },
  iconMargin: {
    marginRight: 6,
  },
  fontMedium: {
    fontWeight: "500",
    fontSize: 13, // Reducir tamaño de fuente
  },
  sortContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemSeparator: {
    height: 16,
  },
});
