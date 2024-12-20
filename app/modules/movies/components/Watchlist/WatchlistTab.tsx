import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { ListWatchlist } from './ListWatchlist';

export default function WatchlistTab() {
  return (
    <View style={[tw`flex-1 p-4`, { backgroundColor: '#1b1b1b' }]}>
      <ListWatchlist />
    </View>
  );
}