import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/app/common/utils/constants';
import tw from 'tailwind-react-native-classnames';

const { width } = Dimensions.get('window');

interface HeaderMovieDetailsProps {
  movie: {
    title: string;
    tagline: string;
    genres: { id: number; name: string }[];
    vote_average: number;
    release_date: string;
    img: string;
    poster_path: string;
  };
}

export const HeaderMovieDetails: React.FC<HeaderMovieDetailsProps> = ({ movie }) => {
  return (
    <ImageBackground
      source={{ uri: `https://image.tmdb.org/t/p/w500${movie.img}` }}
      style={[tw`w-full justify-end`, styles.background]}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={tw`w-full h-full justify-end`}
      >
        <View style={tw`p-4 flex-row items-end`}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            style={tw`w-24 h-36 rounded-lg mr-4`}
          />
          <View style={tw`flex-1`}>
            <Text style={[tw`text-white text-2xl font-bold`, styles.textShadow]}>{movie.title}</Text>
            {movie.tagline && <Text style={[tw`text-gray-400 text-lg italic mt-1`, styles.textShadow]}>{movie.tagline}</Text>}
            <View style={tw`flex-row items-center mt-2`}>
              <Text style={tw`text-gray-400 text-sm mr-4`}>
                {movie.genres.map(genre => genre.name).join(', ')}
              </Text>
              <View style={tw`flex-row items-center mr-4`}>
                <MaterialIcons name="star" size={16} color={colors.yellow} />
                <Text style={tw`text-yellow-500 text-sm ml-1`}>{movie.vote_average.toFixed(1)}</Text>
              </View>
              <Text style={tw`text-gray-400 text-sm`}>{new Date(movie.release_date).getFullYear()}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    height: width * 0.8,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});