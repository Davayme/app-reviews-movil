import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

export default function ReviewsTab() {
  return (
    <View style={[tw`flex-1 p-4`, { backgroundColor: '#1b1b1b' }]}>
      <Text style={[tw`text-lg`, { color: '#ffffff' }]}>Mis Reseñas</Text>
    </View>
  );
}