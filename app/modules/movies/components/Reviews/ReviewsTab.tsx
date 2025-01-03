import React from 'react';
import { View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import ReviewsUser from './ReviewsUser';
import { useAuth } from '@/app/modules/auth/hooks/useAuth'; 


export default function ReviewsTab() {
  const { user } = useAuth(); 

  return (
    <View style={[tw`flex-1`, { backgroundColor: '#1b1b1b' }]}>
    <ReviewsUser userId={user!.id} />
  </View>
  );
}
