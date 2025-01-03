import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/app/common/utils/constants';

interface UserStatsProps {
  reviews: { rating: number; reviewText: string; movie: { title: string; posterPath?: string } }[];
  watchlist: { movie: { title: string; posterPath?: string } }[];
}

const UserStats: React.FC<UserStatsProps> = ({ reviews = [], watchlist = [] }) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(20);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
    : 'N/A';
  const totalWatchlist = watchlist.length;
  const lastReview = totalReviews > 0 ? reviews[0] : null;
  const lastWatchlist = totalWatchlist > 0 ? watchlist[0] : null;

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating - 1]++;
    return acc;
  }, Array(5).fill(0));

  const barData = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [{ data: ratingDistribution }],
  };

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.gradientContainer}>
        <Text style={styles.title}>Estadísticas del Usuario</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="rate-review" size={32} color={colors.yellow} />
            <Text style={styles.statTitle}>Reseñas</Text>
            <Text style={styles.statValue}>{totalReviews}</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="playlist-add-check" size={32} color={colors.magenta} />
            <Text style={styles.statTitle}>Watchlist</Text>
            <Text style={styles.statValue}>{totalWatchlist}</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="star" size={32} color={colors.azul} />
            <Text style={styles.statTitle}>Promedio</Text>
            <Text style={styles.statValue}>{averageRating}</Text>
          </View>
        </View>

        <View style={styles.moviesSection}>
          {lastReview && (
            <View style={styles.movieCard}>
              <Image
                source={{
                  uri: lastReview.movie.posterPath 
                    ? `https://image.tmdb.org/t/p/w200${lastReview.movie.posterPath}`
                    : 'https://via.placeholder.com/100x150?text=No+Image'
                }}
                style={styles.moviePoster}
              />
              <View style={styles.movieInfo}>
                <Text style={styles.movieLabel}>Última Reseña</Text>
                <Text numberOfLines={2} style={styles.movieTitle}>
                  {lastReview.movie.title}
                </Text>
                <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={16} color={colors.yellow} />
                  <Text style={styles.ratingText}>{lastReview.rating}</Text>
                </View>
              </View>
            </View>
          )}

          {lastWatchlist && (
            <View style={styles.movieCard}>
              <Image
                source={{
                  uri: lastWatchlist.movie.posterPath 
                    ? `https://image.tmdb.org/t/p/w200${lastWatchlist.movie.posterPath}`
                    : 'https://via.placeholder.com/100x150?text=No+Image'
                }}
                style={styles.moviePoster}
              />
              <View style={styles.movieInfo}>
                <Text style={styles.movieLabel}>Último en Watchlist</Text>
                <Text numberOfLines={2} style={styles.movieTitle}>
                  {lastWatchlist.movie.title}
                </Text>
              </View>
            </View>
          )}
        </View>

        {totalReviews > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Distribución de Calificaciones</Text>
            <BarChart
              data={barData}
              width={screenWidth - 64}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(252, 189, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
                barPercentage: 0.7,
              }}
              style={styles.chart}
              showValuesOnTopOfBars={true}
              fromZero={true}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.cyan,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 31, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.cyan,
    marginTop: 4,
  },
  moviesSection: {
    gap: 12,
    marginBottom: 20,
  },
  movieCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 31, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  moviePoster: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
  },
  movieLabel: {
    fontSize: 14,
    color: colors.cyan,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  movieTitle: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    color: colors.white,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 31, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.cyan,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    paddingRight: 0,
  },
});

export default UserStats;