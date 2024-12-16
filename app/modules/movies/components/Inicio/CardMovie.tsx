import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Movie } from "@/app/common/interfaces/IMovie";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/app/common/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import tw from "tailwind-react-native-classnames";
import { useAuth } from "@/app/modules/auth/hooks/useAuth";
import { useToast } from "@/app/common/components/Toast/useToast";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../services/watchlistService";
import { useWatchlist } from "../../context/WatchlistContext";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.4;

interface CardMovieProps {
  movie: Movie;
  onWatchlistChange?: (movieId: number, inWatchlist: boolean) => void;
}

export const CardMovie: React.FC<CardMovieProps> = ({
  movie,
  onWatchlistChange,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { watchlist, toggleWatchlist } = useWatchlist();
  const [showModal, setShowModal] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(movie.inWatchlist);

  const handleWatchlistToggle = async () => {
    if (!user) {
      showToast("Debes iniciar sesión para agregar películas", "warning");
      return;
    }

    try {
      setIsLoading(true);
      if (inWatchlist) {
        await removeFromWatchlist(user.id, movie.id);
        showToast("Película eliminada de tu watchlist", "success");
      } else {
        await addToWatchlist({
          userId: user.id,
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          releaseDate: new Date(movie.release_date),
        });
        showToast("Película agregada a tu watchlist", "success");
      }
      setInWatchlist(!inWatchlist);
      onWatchlistChange?.(movie.id, !inWatchlist);
      toggleWatchlist(movie.id);
    } catch (error) {
      showToast("Ocurrió un error. Intenta nuevamente", "error");
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("es-ES", options);
  };


  const renderRating = () => {
    if (!movie.vote_average) {
      return (
        <View style={[tw`flex-row items-center`, { gap: 4 }]}>
          <MaterialIcons name="star-outline" size={16} color={colors.gris} />
          <Text style={[tw`text-xs`, { color: colors.gris }]}>
            Sin calificación
          </Text>
        </View>
      );
    }

    const rating = (movie.vote_average / 2).toFixed(1);
    const ratingNumber = Number(rating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(ratingNumber)) {
        stars.push(
          <MaterialIcons key={i} name="star" size={16} color={colors.magenta} />
        );
      } else if (i === Math.ceil(ratingNumber) && ratingNumber % 1 !== 0) {
        stars.push(
          <MaterialIcons
            key={i}
            name="star-half"
            size={16}
            color={colors.magenta}
          />
        );
      } else {
        stars.push(
          <MaterialIcons
            key={i}
            name="star-outline"
            size={16}
            color={colors.magentaLight}
          />
        );
      }
    }
    return <View style={[tw`flex-row items-center`, { gap: 2 }]}>{stars}</View>;
  };

  return (
    <TouchableOpacity
      onPress={() => setShowModal(true)}
      disabled={isLoading}
      activeOpacity={0.7}
      style={[styles.container, tw`mr-4`]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        />
        {inWatchlist && (
          <View style={styles.watchlistBadge}>
            <MaterialIcons name="bookmark" size={20} color={colors.yellow} />
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text
            style={[tw`text-sm font-bold`, { color: "#ffffff" }]}
            numberOfLines={2}
          >
            {movie.title}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          {renderRating()}

          <View style={[tw`flex-row items-center mt-2`, { gap: 4 }]}>
            <MaterialIcons
              name="calendar-today"
              size={14}
              color={colors.azul}
            />
            <Text style={[tw`text-xs`, { color: colors.azul }]}>
              {formatDate(movie.release_date)}
            </Text>
          </View>
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                inWatchlist && styles.modalButtonDanger,
              ]}
              onPress={handleWatchlistToggle}
              disabled={isLoading}
            >
              <MaterialIcons
                name={inWatchlist ? "bookmark-remove" : "bookmark-add"}
                size={24}
                color="#fff"
              />
              <Text style={styles.modalButtonText}>
                {inWatchlist ? "Quitar de watchlist" : "Agregar a watchlist"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton}>
              <MaterialIcons name="info" size={24} color="#fff" />
              <Text style={styles.modalButtonText}>Ver detalles</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#2d2d2d",
    elevation: 5,
  },
  poster: {
    width: "100%",
    height: ITEM_WIDTH * 1.5,
    borderRadius: 12,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
  },
  watchlistBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    padding: 6,
    elevation: 4,
  },
  contentContainer: {
    marginTop: 8,
    height: 100, // Altura fija para el contenedor de contenido
    justifyContent: "space-between",
  },
  titleContainer: {
    height: 40, // Altura fija para el título (2 líneas)
    marginBottom: 4,
  },
  detailsContainer: {
    justifyContent: "flex-end",
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2d2d2d",
    borderRadius: 12,
    padding: 16,
    width: "80%",
    elevation: 5,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  modalButtonDanger: {
    backgroundColor: "rgba(255,59,48,0.2)",
  },
  modalButtonText: {
    color: "#fff",
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
  },
});
