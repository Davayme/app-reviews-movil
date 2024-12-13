import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

export default function MainScreen() {
  return (
    <View style={[tw`flex-1 justify-center items-center p-4`, { backgroundColor: '#1b1b1b' }]}>
      <Text style={[tw`text-3xl font-bold mb-6`, { color: '#fcbd00' }]}>Index</Text>
    </View>
  );
}