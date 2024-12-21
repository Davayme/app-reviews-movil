import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '@/app/common/utils/constants';
import tw from 'tailwind-react-native-classnames';
import { IWatchlistItem } from '@/app/common/interfaces/IWatchlist';
import { updateMovieViewedStatus } from '../../services/watchlistService';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 82) / 2; // Aumentamos el espacio entre columnas

interface CardWatchlistMovieProps {
  item: IWatchlistItem;
  index: number;
  userId: number;
  onToggleViewed?: (id: number, viewed: boolean) => void;
}

export const CardWatchlistMovie: React.FC<CardWatchlistMovieProps> = ({
  item,
  index,
  userId,
  onToggleViewed,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleViewed = async () => {
    try {
      setIsLoading(true);
      await updateMovieViewedStatus({
        userId,
        movieId: item.movieId,
        viewed: !item.viewed
      });
      onToggleViewed?.(item.id, !item.viewed);
    } catch (error) {
      console.error('Error toggling viewed status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={[tw`mb-8`, { width: COLUMN_WIDTH }]}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.movie.posterPath}` }}
          style={styles.image}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.98)']}
          style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            <Text numberOfLines={2} style={styles.title}>
              {item.movie.title}
            </Text>

            <TouchableOpacity
              style={[
                styles.viewedButton, 
                item.viewed && styles.viewedButtonActive,
                isLoading && styles.viewedButtonDisabled
              ]}
              onPress={handleToggleViewed}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.yellow} />
              ) : (
                <>
                  <MaterialIcons
                    name={item.viewed ? 'check-circle' : 'remove-red-eye'}
                    size={18}
                    color={item.viewed ? colors.yellow : colors.gris}
                    style={styles.viewedIcon}
                  />
                  <Text style={[styles.viewedText, item.viewed && styles.viewedTextActive]}>
                    {item.viewed ? 'Vista' : 'Por ver'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  image: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.5,
    borderRadius: 16,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  viewedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  viewedButtonActive: {
    backgroundColor: 'rgba(255,223,0,0.25)',
  },
  viewedButtonDisabled: {
    opacity: 0.7,
  },
  viewedIcon: {
    marginRight: 4,
  },
  viewedText: {
    color: colors.gris,
    fontSize: 12,
    fontWeight: '600',
  },
  viewedTextActive: {
    color: colors.yellow,
  }
});