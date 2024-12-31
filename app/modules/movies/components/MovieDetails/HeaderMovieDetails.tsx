import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";
import { colors } from "@/app/common/utils/constants";
import tw from "tailwind-react-native-classnames";
import { GenreChip } from "./GenreChip";

const { width, height } = Dimensions.get("window");

interface HeaderMovieDetailsProps {
  movie: {
    title: string;
    tagline: string;
    genres: { id: number; name: string }[];
    vote_average: number;
    release_date: string;
    img: string;
    poster_path: string;
    runtime: number;
    score: string | null;
    inWatchlist: boolean;
    viewed: boolean;
    overview: string;
  };
}

const ExpandableOverview: React.FC<{ text: string }> = ({ text }) => {
  const [showFullOverview, setShowFullOverview] = useState(false);

  return (
    <View style={styles.overviewContainer}>
      <Text
        style={[styles.overview]}
        numberOfLines={showFullOverview ? undefined : 3}
      >
        {text}
      </Text>
      {text.length > 150 && (
        <TouchableOpacity
          onPress={() => setShowFullOverview(!showFullOverview)}
          style={styles.showMoreButton}
        >
          <Text style={styles.showMoreText}>
            {showFullOverview ? "Ver menos" : "Ver más"}
          </Text>
          <Ionicons
            name={showFullOverview ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.azul}
            style={tw`ml-1`}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <View style={tw`flex-row`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <FontAwesome5
        key={star}
        name="star"
        solid={star <= rating}
        size={14}
        color={colors.yellow}
        style={tw`mr-1`}
      />
    ))}
  </View>
);

export const HeaderMovieDetails: React.FC<HeaderMovieDetailsProps> = ({
  movie,
}) => {
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: `https://image.tmdb.org/t/p/original${movie.img}` }}
        style={styles.backgroundImage}
        blurRadius={0.5}
      >
        <LinearGradient
          colors={[
            "transparent",
            "rgba(0,0,0,0.7)",
            "rgba(0,0,0,0.95)",
            "#000",
          ]}
          locations={[0, 0.4, 0.75, 1]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }}
                style={styles.poster}
              />

              <View style={styles.headerInfo}>
                <Text style={styles.title} numberOfLines={2}>
                  {movie.title}
                </Text>

                <View style={styles.yearDuration}>
                  <Feather name="calendar" size={14} color="#CCC" />
                  <Text style={styles.metadata}>
                    {new Date(movie.release_date).getFullYear()}
                  </Text>
                  <View style={styles.dot} />
                  <Feather name="clock" size={14} color="#CCC" />
                  <Text style={styles.metadata}>
                    {formatRuntime(movie.runtime)}
                  </Text>
                </View>

                {movie.score !== null && (
                  <View style={styles.ratingSection}>
                    <RatingStars rating={Number(movie.score)} />
                    <Text style={styles.ratingText}>
                      {Number(movie.score).toFixed(1)}
                    </Text>
                  </View>
                )}

                <View style={styles.badges}>
                  {movie.inWatchlist && (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: `${colors.azul}20` },
                      ]}
                    >
                      <Ionicons name="bookmark" size={14} color={colors.azul} />
                      <Text style={[styles.badgeText, { color: colors.azul }]}>
                        Watchlist
                      </Text>
                    </View>
                  )}
                  {movie.viewed && (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: `${colors.yellow}20` },
                      ]}
                    >
                      <Ionicons name="eye" size={14} color={colors.yellow} />
                      <Text
                        style={[styles.badgeText, { color: colors.yellow }]}
                      >
                        Visto
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {movie.tagline && (
              <View style={styles.taglineContainer}>
                <Feather name="message-circle" size={16} color="#CCC" />
                <Text style={styles.tagline}>"{movie.tagline}"</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
      <ScrollView style={styles.overviewScroll}>
        <ExpandableOverview text={movie.overview} />

        <View style={styles.genresSection}>
          <View style={styles.sectionHeader}>
            <Feather name="tag" size={16} color="#CCC" />
            <Text style={styles.sectionTitle}>Géneros</Text>
          </View>
          <View style={styles.genresContainer}>
            {movie.genres.map((genre) => (
              <GenreChip key={genre.id} genre={genre} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    width,
    height: height * 0.5,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 20, // Ajustar el espaciado superior
  },
  headerSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  poster: {
    width: width * 0.3,
    height: width * 0.45,
    borderRadius: 12,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  yearDuration: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metadata: {
    color: "#CCC",
    fontSize: 14,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CCC",
    marginHorizontal: 8,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    color: colors.yellow,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tagline: {
    fontSize: 15,
    color: "#CCC",
    fontStyle: "italic",
    marginLeft: 8,
  },
  overviewScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  overviewContainer: {
    marginBottom: 20,
  },
  overview: {
    fontSize: 15,
    color: "#AAA",
    lineHeight: 22,
    textAlign: "justify",
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  showMoreText: {
    color: colors.azul,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#CCC",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  genresSection: {
    marginTop: 8,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
