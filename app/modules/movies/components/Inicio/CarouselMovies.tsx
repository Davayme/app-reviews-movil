import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Movie } from '@/app/common/interfaces/IMovie';
import { colors } from '@/app/common/utils/constants';
import { CardMovie } from './CardMovie';
import tw from 'tailwind-react-native-classnames';

interface CarouselMoviesProps {
  title: string;
  movies: Movie[];
}

export const CarouselMovies: React.FC<CarouselMoviesProps> = ({
  title,
  movies
}) => {
  return (
    <View style={tw`mb-6`}>
      <Text style={[tw`text-xl font-bold mb-4 px-4`, { color: colors.yellow }]}>
        {title}
      </Text>
      <FlatList
        data={movies}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <CardMovie movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={tw`px-4`}
      />
    </View>
  );
};