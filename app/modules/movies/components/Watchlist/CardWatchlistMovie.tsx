import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '@/app/common/utils/constants';
import tw from 'tailwind-react-native-classnames';
import { IWatchlistItem } from '@/app/common/interfaces/IWatchlist';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

interface CardWatchlistMovieProps {
  item: IWatchlistItem;
  index: number;
  onToggleViewed?: (id: number) => void;
}

export const CardWatchlistMovie: React.FC<CardWatchlistMovieProps> = ({
  item,
  index,
  onToggleViewed,
}) => {
  const formattedDate = new Date(item.movie.releaseDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
  });

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={[tw`mb-6`, { width: COLUMN_WIDTH }]}
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
          colors={['transparent', 'rgba(0,0,0,0.95)']}
          style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            <View style={styles.dateContainer}>
              <MaterialIcons name="calendar-today" size={12} color={colors.azul} />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            <Text numberOfLines={2} style={styles.title}>
              {item.movie.title}
            </Text>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.viewedButton,
                  item.viewed && styles.viewedButtonActive
                ]}
                onPress={() => onToggleViewed?.(item.id)}
              >
                <MaterialIcons
                  name={item.viewed ? 'check-circle' : 'radio-button-unchecked'}
                  size={16}
                  color={item.viewed ? colors.yellow : colors.gris}
                />
                <Text style={[
                  styles.viewedText,
                  item.viewed && styles.viewedTextActive
                ]}>
                  {item.viewed ? 'Vista' : 'No vista'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.addedText}>
                {new Date(item.addedAt).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.5,
    borderRadius: 12,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    color: colors.azul,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  viewedButtonActive: {
    backgroundColor: 'rgba(255,223,0,0.2)',
  },
  viewedText: {
    color: colors.gris,
    fontSize: 12,
    marginLeft: 4,
  },
  viewedTextActive: {
    color: colors.yellow,
  },
  addedText: {
    color: colors.gris,
    fontSize: 11,
    opacity: 0.7,
  },
});