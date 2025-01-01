import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/app/common/utils/constants";
import {
  getUserReviewByMovie,
  getOtherReviewsByMovie,
  updateLikes,
} from "../../services/reviewService";
import {
  getLikedReviews,
  saveLike,
  removeLike,
} from "../../services/likesService";

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
  isUserReview?: boolean;
  likedReviews: Set<number>;
  setLikedReviews: React.Dispatch<React.SetStateAction<Set<number>>>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onLike,
  isUserReview = false,
  likedReviews,
  setLikedReviews,
}) => {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isLiked = likedReviews.has(review.id);

  const handleLike = async () => {
    if (isUserReview || isLoading) return;
    setIsLoading(true);
    try {
      await onLike();
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLoading(false);
    }
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
        <TouchableOpacity
          style={[styles.likeButton, isUserReview && styles.disabledLikeButton]}
          onPress={handleLike}
          disabled={isUserReview}
        >
          <Feather
            name="heart"
            size={24}
            color={isUserReview ? "#666" : isLiked ? colors.magenta : "#666"}
          />
          <Text
            style={[
              styles.likeCount,
              !isUserReview && isLiked && styles.likedText,
            ]}
          >
            {review.likesCount}
          </Text>
        </TouchableOpacity>
      </View>

      {review.containsSpoiler ? (
        <View style={styles.spoilerContainer}>
          <TouchableOpacity
            style={styles.spoilerButton}
            onPress={() => setShowSpoiler(!showSpoiler)}
          >
            <Feather name="alert-triangle" size={20} color={colors.magenta} />
            <Text
              style={[
                styles.spoilerText,
                showSpoiler && styles.revealedSpoilerText,
              ]}
            >
              {showSpoiler
                ? review.reviewText
                : "Esta reseña contiene spoilers. Toca para mostrar."}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.reviewText}>{review.reviewText}</Text>
      )}

      <View style={styles.ratingContainer}>
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
  );
};

const ListReviews: React.FC<{ movieId: number; userId: number }> = ({
  movieId,
  userId,
}) => {
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [otherReviews, setOtherReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRev, otherRevs, userLikes] = await Promise.all([
          getUserReviewByMovie(userId, movieId),
          getOtherReviewsByMovie(movieId, userId),
          getLikedReviews(userId) // Esta función ahora obtiene los likes desde AsyncStorage
        ]);

        setUserReview(userRev);
        setOtherReviews(otherRevs);
        setLikedReviews(new Set(userLikes)); // userLikes es un array de IDs
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, userId]);

  const handleLike = async (reviewId: number, isLiked: boolean) => {
    try {
      // Actualizar estado local primero (optimistic update)
      setLikedReviews((prev) => {
        const newLikedReviews = new Set(prev);
        if (isLiked) {
          newLikedReviews.delete(reviewId);
          removeLike(userId, reviewId); // Actualizar AsyncStorage
        } else {
          newLikedReviews.add(reviewId);
          saveLike(userId, reviewId); // Actualizar AsyncStorage
        }
        return newLikedReviews;
      });

      // Actualizar UI
      setOtherReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, likesCount: review.likesCount + (isLiked ? -1 : 1) }
            : review
        )
      );

      await updateLikes({
        reviewId,
        action: isLiked ? "decrement" : "increment",
      });
    } catch (error) {
      console.error("Error updating like:", error);
      setLikedReviews((prev) => {
        const newLikedReviews = new Set(prev);
        if (isLiked) {
          newLikedReviews.add(reviewId);
          saveLike(userId, reviewId); // Revertir en AsyncStorage
        } else {
          newLikedReviews.delete(reviewId);
          removeLike(userId, reviewId); // Revertir en AsyncStorage
        }
        return newLikedReviews;
      });

      setOtherReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, likesCount: review.likesCount + (isLiked ? 1 : -1) }
            : review
        )
      );
    }
  };

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
              onLike={() => {}}
              isUserReview={true}
              likedReviews={likedReviews}
              setLikedReviews={setLikedReviews}
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
                onLike={() =>
                  handleLike(review.id, likedReviews.has(review.id))
                }
                likedReviews={likedReviews}
                setLikedReviews={setLikedReviews}
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
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 12,
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
    position: "relative",
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
  ratingContainer: {
    flexDirection: "row",
    marginTop: 12,
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
    backgroundColor: "#333", // Cambiar el fondo a un color más neutro
    padding: 12,
    borderRadius: 8,
  },
  spoilerText: {
    color: colors.magenta,
    marginLeft: 8,
    flex: 1,
  },
  revealedSpoilerText: {
    color: "#FFF",
  },
  likeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  disabledLikeButton: {
    opacity: 0.7,
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
