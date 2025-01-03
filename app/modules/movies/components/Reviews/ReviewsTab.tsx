import React from 'react';
import { View, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import ReviewsUser from './ReviewsUser'; // Importar el componente
import { useAuth } from '@/app/modules/auth/hooks/useAuth'; // Importar useAuth


export default function ReviewsTab() {
  const { user } = useAuth(); // Obtener el usuario logueado

  return (
    <View style={[tw`flex-1`, { backgroundColor: '#1b1b1b' }]}>
    <ReviewsUser userId={user!.id} />
  </View>
  );
}
