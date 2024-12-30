import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/app/common/utils/constants";
import {
  addToWatchlist,
  removeFromWatchlist,
  updateMovieViewedStatus,
} from "../../services/watchlistService";
import { useToast } from "@/app/common/components/Toast/useToast";

const { height } = Dimensions.get("window");

interface ReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  isInWatchlist: boolean;
  isWatched: boolean;
  onWatchlistToggle: () => void;
  onWatchedToggle: () => void;
  onSubmitReview: (rating: number, review?: string) => void;
  userId: number;
  movieId: number;
  movieTitle: string;
  posterPath: string;
  releaseDate: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isVisible,
  onClose,
  isInWatchlist,
  isWatched,
  onWatchlistToggle,
  onWatchedToggle,
  onSubmitReview,
  userId,
  movieId,
  movieTitle,
  posterPath,
  releaseDate,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [showReviewInput, setShowReviewInput] = useState<boolean>(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState<boolean>(false);
  const [loadingWatched, setLoadingWatched] = useState<boolean>(false);
  const [localIsInWatchlist, setLocalIsInWatchlist] =
    useState<boolean>(isInWatchlist);
  const [localIsWatched, setLocalIsWatched] = useState<boolean>(isWatched);
  const { showToast } = useToast();

  const handleWatchlistToggle = async () => {
    setLoadingWatchlist(true);
    try {
      if (localIsInWatchlist) {
        await removeFromWatchlist(userId, movieId);
        
      } else {
        await addToWatchlist({
          userId,
          movieId,
          title : movieTitle,
          posterPath,
          releaseDate : new Date(releaseDate),
        });
        
      }
      setLocalIsInWatchlist(!localIsInWatchlist);
      onWatchlistToggle();
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      showToast("Error al actualizar la watchlist", "error");
    } finally {
      setLoadingWatchlist(false);
    }
  };

  const handleWatchedToggle = async () => {
    setLoadingWatched(true);
    try {
      await updateMovieViewedStatus({
        userId,
        movieId,
        viewed: !localIsWatched,
      });
      setLocalIsWatched(!localIsWatched);
      onWatchedToggle();
    } catch (error) {
      console.error("Error toggling watched status:", error);
      showToast("Error al actualizar el estado de vista", "error");
    } finally {
      setLoadingWatched(false);
    }
  };

  const renderStar = (position: number) => {
    const filled = position <= rating;
    return (
      <TouchableOpacity
        key={position}
        onPress={() => {
          setRating(position);
          setShowReviewInput(true);
        }}
        style={styles.starContainer}
      >
        <Feather
          name={filled ? "star" : "star"}
          size={32}
          color={filled ? "#FFD700" : "#666"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          {/* Header con línea de arrastre */}
          <View style={styles.dragLine} />

          {/* Iconos de Watchlist y Watched */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                loadingWatchlist && styles.actionButtonLoading,
              ]}
              onPress={handleWatchlistToggle}
              disabled={loadingWatchlist}
            >
              <View style={styles.iconContainer}>
                {loadingWatchlist ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.yellow}
                    style={styles.loadingIndicator}
                  />
                ) : (
                  <Feather
                    name={localIsInWatchlist ? "check-circle" : "plus-circle"}
                    size={28}
                    color={localIsInWatchlist ? "#10ccd0" : "#CCC"}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.actionText,
                  localIsInWatchlist && styles.actionTextActive,
                ]}
              >
                Watchlist
              </Text>
            </TouchableOpacity>

            {localIsInWatchlist && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  loadingWatched && styles.actionButtonLoading,
                ]}
                onPress={handleWatchedToggle}
                disabled={loadingWatched}
              >
                <View style={styles.iconContainer}>
                  {loadingWatched ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.yellow}
                      style={styles.loadingIndicator}
                    />
                  ) : (
                    <Feather
                      name={localIsWatched ? "eye" : "eye-off"}
                      size={28}
                      color={localIsWatched ? colors.yellow : "#CCC"}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.actionText,
                    localIsWatched && styles.actionTextActive,
                  ]}
                >
                  {localIsWatched ? "Vista" : "Por ver"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Sistema de Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Califica esta película</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((num) => renderStar(num))}
            </View>
          </View>

          {/* Campo de Review (condicional) */}
          {showReviewInput && (
            <View style={styles.reviewContainer}>
              <TextInput
                style={styles.reviewInput}
                placeholder="Escribe tu reseña..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                value={review}
                onChangeText={setReview}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => onSubmitReview(rating, review)}
              >
                <Text style={styles.submitButtonText}>Enviar Reseña</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.6,
    padding: 20,
    paddingTop: 12,
  },
  dragLine: {
    width: 40,
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    color: "#CCC",
    marginTop: 8,
    fontSize: 14,
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  ratingLabel: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  starContainer: {
    padding: 8,
  },
  reviewContainer: {
    marginTop: 20,
  },
  reviewInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#FFF",
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#1DB954",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  iconContainer: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    transform: [{ scale: 0.8 }],
  },
  actionButtonLoading: {
    opacity: 0.7,
  },
  actionTextActive: {
    color: 'white',
  },
});

export default ReviewModal;
