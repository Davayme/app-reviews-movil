import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/app/common/utils/constants";
import {
  getUserReviewByMovie,
  getOtherReviewsByMovie,
} from "../../services/reviewService";

interface User {
  id: number;
  name: string;
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
  user: User;
}

interface ReviewCardProps {
  review: Review;
  onLike: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onLike }) => {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{review.user.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{review.user.name}</Text>
            <Text style={styles.date}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <Feather
              key={i}
              name="star"
              size={16}
              color={i < review.rating ? colors.yellow : "#666"}
            />
          ))}
        </View>
      </View>

      {review.containsSpoiler ? (
        <View style={styles.spoilerContainer}>
          <TouchableOpacity
            style={styles.spoilerButton}
            onPress={() => setShowSpoiler(!showSpoiler)}
          >
            <Feather name="alert-triangle" size={20} color={colors.magenta} />
            <Text style={styles.spoilerText}>
              {showSpoiler
                ? review.reviewText
                : "Esta reseña contiene spoilers. Toca para mostrar."}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.reviewText}>{review.reviewText}</Text>
      )}

      <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
        <Feather
          name="heart"
          size={24} // Aumentar el tamaño del icono
          color={isLiked ? colors.magenta : "#666"}
        />
        <Text style={[styles.likeCount, isLiked && styles.likedText]}>
          {review.likesCount}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const ListReviews: React.FC<{ movieId: number; userId: number }> = ({
  movieId,
  userId,
}) => {
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [otherReviews, setOtherReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [userRev, otherRevs] = await Promise.all([
          getUserReviewByMovie(userId, movieId),
          getOtherReviewsByMovie(movieId, userId),
        ]);
        setUserReview(userRev);
        setOtherReviews(otherRevs);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId, userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.magenta} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.reviewsSection}>
        {userReview && (
          <>
            <View style={styles.sectionHeader}>
              <Feather name="user" size={20} color="#CCC" />
              <Text style={styles.sectionTitle}>Tu reseña</Text>
            </View>
            <ReviewCard
              review={userReview}
              onLike={() => console.log("Like review:", userReview.id)}
            />
          </>
        )}

        {otherReviews.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Feather name="users" size={20} color="#CCC" />
              <Text style={styles.sectionTitle}>Otras reseñas</Text>
            </View>
            {otherReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onLike={() => console.log("Like review:", review.id)}
              />
            ))}
          </>
        )}

        {!userReview && otherReviews.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="message-square" size={48} color="#666" />
            <Text style={styles.emptyStateText}>
              No hay reseñas todavía. ¡Sé el primero en compartir tu opinión!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewsSection: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    color: "#CCC",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.magenta,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  userName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  date: {
    color: "#666",
    fontSize: 12,
  },
  rating: {
    flexDirection: "row",
    gap: 4,
  },
  reviewText: {
    color: "#FFF",
    fontSize: 14,
    lineHeight: 20,
  },
  spoilerContainer: {
    marginVertical: 8,
  },
  spoilerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.magenta}15`,
    padding: 12,
    borderRadius: 8,
  },
  spoilerText: {
    color: colors.magenta,
    marginLeft: 8,
    flex: 1,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  likeCount: {
    color: "#666",
    marginLeft: 8,
  },
  likedText: {
    color: colors.magenta,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyStateText: {
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
});

export default ListReviews;
