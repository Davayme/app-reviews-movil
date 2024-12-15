import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

export default function WatchlistTab() {
  return (
    <View style={[tw`flex-1 p-4`, { backgroundColor: '#1b1b1b' }]}>
      <Text style={[tw`text-lg`, { color: '#ffffff' }]}>Mi Lista</Text>
    </View>
  );
}