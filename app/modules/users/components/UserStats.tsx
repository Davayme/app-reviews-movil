import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '@/app/common/utils/constants';

interface UserStatsProps {
  reviews: { rating: number; reviewText: string; movie: { title: string; posterPath?: string } }[];
  watchlist: { movie: { title: string; posterPath?: string } }[];
}

const UserStats: React.FC<UserStatsProps> = ({ reviews = [], watchlist = [] }) => {
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
    labels: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'],
    datasets: [
      {
        data: ratingDistribution,
        colors: [
          () => colors.magenta,
          () => colors.azul,
          () => colors.yellow,
          () => colors.green,
          () => colors.cyan,
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas del Usuario</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <FontAwesome name="comment-o" size={32} color={colors.yellow} />
          <Text style={styles.statTitle}>Total de Reseñas</Text>
          <Text style={styles.statValue}>{totalReviews}</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="clipboard" size={32} color={colors.yellow} />
          <Text style={styles.statTitle}>Películas en Watchlist</Text>
          <Text style={styles.statValue}>{totalWatchlist}</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="star" size={32} color={colors.yellow} />
          <Text style={styles.statTitle}>Calificación Promedio</Text>
          <Text style={styles.statValue}>{averageRating}</Text>
        </View>
      </View>
      <View style={styles.lastItemsContainer}>
        <View style={styles.lastItemCard}>
          <Image
            source={{ uri: lastReview?.movie?.posterPath ? `https://image.tmdb.org/t/p/w200${lastReview.movie.posterPath}` : 'https://via.placeholder.com/100x150?text=No+Image' }}
            style={styles.lastItemImage}
          />
          <View>
            <Text style={styles.lastItemTitle}>Última Reseña</Text>
            <Text style={styles.lastItemText}>{lastReview?.movie?.title || 'No hay reseñas recientes'}</Text>
          </View>
        </View>
        <View style={styles.lastItemCard}>
          <Image
            source={{ uri: lastWatchlist?.movie?.posterPath ? `https://image.tmdb.org/t/p/w200${lastWatchlist.movie.posterPath}` : 'https://via.placeholder.com/100x150?text=No+Image' }}
            style={styles.lastItemImage}
          />
          <View>
            <Text style={styles.lastItemTitle}>Última Película en Watchlist</Text>
            <Text style={styles.lastItemText}>{lastWatchlist?.movie?.title || 'No hay películas en la watchlist'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribución de Calificaciones</Text>
        <BarChart
          data={barData}
          width={320}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#1b1b1b',
            backgroundGradientFrom: '#1b1b1b',
            backgroundGradientTo: '#1b1b1b',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b1b1b',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.yellow,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#2b2b2b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.yellow,
    marginTop: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.cyan,
    marginTop: 4,
  },
  lastItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  lastItemCard: {
    backgroundColor: '#2b2b2b',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  lastItemImage: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
  },
  lastItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.yellow,
  },
  lastItemText: {
    fontSize: 14,
    color: colors.cyan,
    marginTop: 4,
  },
  chartContainer: {
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.cyan,
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default UserStats;