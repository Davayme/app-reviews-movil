import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/app/common/utils/constants";
import {
  addToWatchlist,
  removeFromWatchlist,
  updateMovieViewedStatus,
} from "../../services/watchlistService";
import { useToast } from "@/app/common/components/Toast/useToast";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../../services/reviewService";

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
  existingReview: {
    id: number;
    rating: number;
    reviewText: string | null;
    containsSpoiler: boolean;
    likesCount: number;
    createdAt: string;
  } | null;
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
  existingReview,
}) => {
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [review, setReview] = useState<string>(
    existingReview?.reviewText || ""
  );
  const [showReviewInput, setShowReviewInput] = useState<boolean>(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState<boolean>(false);
  const [loadingWatched, setLoadingWatched] = useState<boolean>(false);
  const [localIsInWatchlist, setLocalIsInWatchlist] =
    useState<boolean>(isInWatchlist);
  const [localIsWatched, setLocalIsWatched] = useState<boolean>(isWatched);
  const { showToast } = useToast();
  const [containsSpoiler, setContainsSpoiler] = useState<boolean>(
    existingReview?.containsSpoiler || false
  );
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible) {
      setRating(existingReview?.rating || 0);
      setReview(existingReview?.reviewText || "");
      setContainsSpoiler(existingReview?.containsSpoiler || false);
      setIsEditing(false);
      setShowReviewInput(!!existingReview);
    } else {
      resetStates();
    }
  }, [existingReview, isVisible]);

  const resetStates = () => {
    setRating(0);
    setReview("");
    setContainsSpoiler(false);
    setShowReviewInput(false);
    setIsEditing(false);
  };

  const handleWatchlistToggle = async () => {
    setLoadingWatchlist(true);
    try {
      if (localIsInWatchlist) {
        await removeFromWatchlist(userId, movieId);
      } else {
        await addToWatchlist({
          userId,
          movieId,
          title: movieTitle,
          posterPath,
          releaseDate: new Date(releaseDate),
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

  const handleUpdateReview = async () => {
    console.log("Actualizando reseña:", existingReview);
    if (!existingReview || existingReview.id === 0) {
      console.log("No se puede actualizar: existingReview no válido");
      return;
    }
    setLoadingSubmit(true);
    try {
      await updateReview(existingReview.id, {
        rating,
        reviewText: review.trim(),
        containsSpoiler,
      });
  
      showToast("¡Reseña actualizada con éxito!", "success");
      onSubmitReview(rating, review);
      resetStates();
      onClose();
    } catch (error) {
      console.error("Error updating review:", error);
      showToast("Error al actualizar la reseña", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  const handleDeleteReview = async () => {
    console.log("Eliminando reseña:", existingReview);
    if (!existingReview || existingReview.id === 0) {
      console.log("No se puede eliminar: existingReview no válido");
      return;
    }
    setLoadingSubmit(true);
    try {
      await deleteReview(existingReview.id);
      showToast("¡Reseña eliminada con éxito!", "success");
      onSubmitReview(0, "");
      resetStates();
      onClose();
    } catch (error) {
      console.error("Error deleting review:", error);
      showToast("Error al eliminar la reseña", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };
  

  const handleSubmitReview = async () => {
    setLoadingSubmit(true);
    try {
      const reviewData = {
        userId: Number(userId), 
        movieId,
        rating,
        reviewText: review.trim(),
        containsSpoiler,
      };
  
      console.log("Enviando datos de reseña:", reviewData); // Agregar log para verificar los datos
  
      await createReview(reviewData);
  
      showToast("¡Reseña publicada con éxito!", "success");
      onSubmitReview(rating, review);
      resetStates();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Error al publicar la reseña", "error");
    } finally {
      setLoadingSubmit(false);
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
          color={filled ? colors.yellow : "#666"}
          style={[styles.star, filled && styles.starFilled]}
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.dragLine} />

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
                        name={
                          localIsInWatchlist ? "check-circle" : "plus-circle"
                        }
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

              <View style={styles.ratingContainer}>
                <Text style={styles.sectionTitle}>
                  <Feather
                    name="star"
                    size={20}
                    color="#FFF"
                    style={styles.sectionIcon}
                  />
                  {existingReview
                    ? "Editar calificación"
                    : "Califica esta película"}
                </Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((num) => renderStar(num))}
                </View>
                {rating > 0 && (
                  <Text style={styles.ratingHint}>
                    {rating === 5
                      ? "¡Excelente!"
                      : rating === 4
                      ? "Muy buena"
                      : rating === 3
                      ? "Buena"
                      : rating === 2
                      ? "Regular"
                      : "Mala"}
                  </Text>
                )}
              </View>

              {existingReview ? (
                <View style={styles.reviewContainer}>
                  <Text style={styles.sectionTitle}>
                    <Feather
                      name="edit-3"
                      size={20}
                      color="#FFF"
                      style={styles.sectionIcon}
                    />
                    Tu reseña
                  </Text>

                  <TextInput
                    style={styles.reviewInput}
                    placeholder="¿Qué te pareció la película?"
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={4}
                    value={review}
                    onChangeText={setReview}
                    textAlignVertical="top"
                    autoCapitalize="sentences"
                    keyboardType="default"
                    returnKeyType="done"
                    editable={isEditing}
                  />

                  <View style={styles.spoilerContainer}>
                    <View style={styles.spoilerHeader}>
                      <Feather
                        name="alert-triangle"
                        size={20}
                        color={containsSpoiler ? colors.magenta : "#666"}
                      />
                      <Text style={styles.spoilerHeaderText}>
                        ¿Tu reseña contiene spoilers?
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.spoilerToggle,
                        containsSpoiler && styles.spoilerToggleActive,
                      ]}
                      onPress={() => setContainsSpoiler(!containsSpoiler)}
                      disabled={!isEditing}
                    >
                      <View
                        style={[
                          styles.spoilerIndicator,
                          containsSpoiler && styles.spoilerIndicatorActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.spoilerStateText,
                            containsSpoiler && styles.spoilerStateTextActive,
                          ]}
                        >
                          {containsSpoiler ? "SÍ" : "NO"}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.spoilerToggleText,
                          containsSpoiler && styles.spoilerToggleTextActive,
                        ]}
                      >
                        {containsSpoiler
                          ? "¡Cuidado! Tu reseña contiene spoilers"
                          : "Sin spoilers"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.buttonContainer}>
                    {isEditing ? (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.submitButton,
                            (!rating || !review.trim()) &&
                              styles.submitButtonDisabled,
                          ]}
                          onPress={handleUpdateReview}
                          disabled={!rating || !review.trim() || loadingSubmit}
                        >
                          {loadingSubmit ? (
                            <ActivityIndicator size="small" color="#FFF" />
                          ) : (
                            <>
                              <Feather
                                name="edit-2"
                                size={20}
                                color="#FFF"
                                style={styles.submitIcon}
                              />
                              <Text style={styles.submitButtonText}>
                                Actualizar reseña
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => setIsEditing(false)}
                        >
                          <Feather
                            name="x-circle"
                            size={20}
                            color="#FFF"
                            style={styles.cancelIcon}
                          />
                          <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => setIsEditing(true)}
                        >
                          <Feather
                            name="edit"
                            size={20}
                            color="#FFF"
                            style={styles.editIcon}
                          />
                          <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={handleDeleteReview}
                          disabled={loadingSubmit}
                        >
                          <Feather
                            name="trash-2"
                            size={20}
                            color="#FFF"
                            style={styles.deleteIcon}
                          />
                          <Text style={styles.deleteButtonText}>
                            Eliminar reseña
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              ) : (
                showReviewInput && (
                  <View style={styles.reviewContainer}>
                    <Text style={styles.sectionTitle}>
                      <Feather
                        name="edit-3"
                        size={20}
                        color="#FFF"
                        style={styles.sectionIcon}
                      />
                      Escribe tu reseña
                    </Text>

                    <TextInput
                      style={styles.reviewInput}
                      placeholder="¿Qué te pareció la película?"
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={4}
                      value={review}
                      onChangeText={setReview}
                      textAlignVertical="top"
                      autoCapitalize="sentences"
                      keyboardType="default"
                      returnKeyType="done"
                    />

                    <View style={styles.spoilerContainer}>
                      <View style={styles.spoilerHeader}>
                        <Feather
                          name="alert-triangle"
                          size={20}
                          color={containsSpoiler ? colors.magenta : "#666"}
                        />
                        <Text style={styles.spoilerHeaderText}>
                          ¿Tu reseña contiene spoilers?
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.spoilerToggle,
                          containsSpoiler && styles.spoilerToggleActive,
                        ]}
                        onPress={() => setContainsSpoiler(!containsSpoiler)}
                      >
                        <View
                          style={[
                            styles.spoilerIndicator,
                            containsSpoiler && styles.spoilerIndicatorActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.spoilerStateText,
                              containsSpoiler && styles.spoilerStateTextActive,
                            ]}
                          >
                            {containsSpoiler ? "SÍ" : "NO"}
                          </Text>
                        </View>

                        <Text
                          style={[
                            styles.spoilerToggleText,
                            containsSpoiler && styles.spoilerToggleTextActive,
                          ]}
                        >
                          {containsSpoiler
                            ? "¡Cuidado! Tu reseña contiene spoilers"
                            : "Sin spoilers"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        (!rating || !review.trim()) &&
                          styles.submitButtonDisabled,
                      ]}
                      onPress={handleSubmitReview}
                      disabled={!rating || !review.trim() || loadingSubmit}
                    >
                      {loadingSubmit ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <>
                          <Feather
                            name="send"
                            size={20}
                            color="#FFF"
                            style={styles.submitIcon}
                          />
                          <Text style={styles.submitButtonText}>
                            Publicar reseña
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                )
              )}
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    paddingBottom: Platform.OS === "ios" ? 40 : 20, // Ajuste para iOS
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
    color: "white",
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    color: "#FFF",
    fontSize: 18,
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  star: {
    transform: [{ scale: 1 }],
  },
  starFilled: {
    transform: [{ scale: 1.1 }],
  },
  ratingHint: {
    color: colors.yellow,
    fontSize: 16,
    marginTop: 8,
    fontWeight: "500",
  },
  reviewInput: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    color: "#FFF",
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  spoilerContainer: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
  },
  spoilerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  spoilerHeaderText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
  spoilerToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
  },
  spoilerToggleActive: {
    backgroundColor: `${colors.magenta}15`,
    borderColor: colors.magenta,
    borderWidth: 1,
  },
  spoilerIndicator: {
    backgroundColor: "#444",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  spoilerIndicatorActive: {
    backgroundColor: colors.magenta,
  },
  spoilerStateText: {
    color: "#CCC",
    fontSize: 12,
    fontWeight: "bold",
  },
  spoilerStateTextActive: {
    color: "#FFF",
  },
  spoilerToggleText: {
    color: "#CCC",
    fontSize: 14,
  },
  spoilerToggleTextActive: {
    color: colors.magenta,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: colors.magenta,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "48%",
  },
  submitButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.7,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#666",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "48%",
  },
  cancelIcon: {
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: colors.magenta,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "48%",
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "48%",
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
export default ReviewModal;
