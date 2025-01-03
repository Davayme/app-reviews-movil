import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { getUserReviewsWithMovies } from "../../services/reviewService";
import { colors } from "@/app/common/utils/constants";
import { FilterReviews } from "./FilterReviews"; // Importar el componente
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../context/RootStack";
import { useAuth } from "@/app/modules/auth/hooks/useAuth";

interface Movie {
  title: string;
  posterPath: string;
  releaseDate: string;
}

interface Review {
  id: number;
  userId: number;
  movieId: number;
  rating: number;
  reviewText: string;
  containsSpoiler: boolean;
  likesCount: number;
  createdAt: string;
  movie: Movie;
}

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${review.movie.posterPath}`,
          }}
          style={styles.poster}
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {review.movie.title}
          </Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, i) => (
              <Feather
                key={i}
                name="star"
                size={16}
                color={i < review.rating ? colors.yellow : colors.gris}
              />
            ))}
          </View>
          <Text style={styles.date}>
            {new Date(review.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.reviewContent}>
        <Text style={styles.reviewText} numberOfLines={3}>
          {review.reviewText}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.likes}>
              <Feather name="heart" size={16} color={colors.magenta} />
              <Text style={styles.likesCount}>{review.likesCount}</Text>
            </View>
            {review.containsSpoiler && (
              <View style={styles.spoiler}>
                <Feather name="alert-triangle" size={16} color={colors.azul} />
                <Text style={styles.spoilerText}>Spoiler</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.viewMoreButton}>
            <Text
              style={styles.viewMoreText}
              onPress={() => {
                navigation.navigate(
                  "modules/movies/screens/MovieDetailScreen",
                  {
                    id: review.movieId,
                    userId: user?.id,
                  }
                );
              }}
            >
              Ver película
            </Text>
            <Feather name="chevron-right" size={16} color={colors.azul} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ReviewsUser: React.FC<{ userId: number }> = ({ userId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const userReviews = await getUserReviewsWithMovies(userId);
        setReviews(userReviews);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  const handleFilter = (order: "asc" | "desc") => {
    const sortedReviews = [...reviews].sort((a, b) => {
      if (order === "asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });
    setReviews(sortedReviews);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.azul} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="edit-3" size={24} color={colors.magenta} />
          <Text style={styles.headerText}>Mis reseñas</Text>
        </View>
        <FilterReviews onFilter={handleFilter} />
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ReviewCard review={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    alignItems: "flex-end",
    padding: 16,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.gris,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gris,
    backgroundColor: "#222",
  },
  list: {
    paddingVertical: 8,
  },
  separator: {
    height: 16,
    backgroundColor: colors.gris,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  reviewContent: {
    padding: 12,
  },
  reviewText: {
    color: "#FFF",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: "justify", // Justificar el texto
  },
  date: {
    color: colors.gris,
    fontSize: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  likesCount: {
    color: "#FFF",
    marginLeft: 4,
  },
  spoiler: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 204, 208, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  spoilerText: {
    color: colors.azul,
    marginLeft: 4,
    fontSize: 12,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 204, 208, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewMoreText: {
    color: colors.azul,
    marginRight: 4,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ReviewsUser;
