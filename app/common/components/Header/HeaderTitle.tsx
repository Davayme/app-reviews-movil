import React from 'react';
import { View, Image, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { colors } from '@/app/common/utils/constants';

export const HeaderTitle = () => {
  return (
    <View style={tw`flex-row items-center`}>
      <Image 
        source={require('@/assets/images/icon-app.png')}
        style={{ 
          width: 40, 
          height: 40, 
          marginRight: 12, 
        }}
        resizeMode="contain"
      />
      <Text style={[
        tw`font-bold text-xl`, 
        { 
          color: colors.yellow, 
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: -1, height: 1 },
          textShadowRadius: 10
        }
      ]}>
        Cine Score
      </Text>
    </View>
  );
};