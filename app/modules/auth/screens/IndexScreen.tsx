import React from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Carousel from '@/app/common/components/Carrousel';
import tw from 'tailwind-react-native-classnames';

const { width: screenWidth } = Dimensions.get('window');

const images = [
  { uri: 'https://via.placeholder.com/300x200.png?text=Image+1' },
  { uri: 'https://via.placeholder.com/300x200.png?text=Image+2' },
  { uri: 'https://via.placeholder.com/300x200.png?text=Image+3' },
];

export default function IndexScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={[tw`flex-1 justify-center items-center p-4`, { backgroundColor: '#1b1b1b' }]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[tw`text-4xl font-bold mb-4`, { color: '#fcbd00' }]}>CineScore</Text>
        <Text style={[tw`text-lg mb-8`, { color: '#10ccd0', textAlign: 'center' }]}>
          ¡Descubre y reseña tus películas favoritas! Crea tu watchlist y comparte tus opiniones11.
        </Text>
        <TouchableOpacity
          style={[tw`p-3 rounded-lg`, { backgroundColor: '#e75793' }]}
          onPress={() => router.push('/modules/auth/screens/LoginScreen')}
        >
          <Text style={[tw`text-lg`, { color: '#1b1b1b' }]}>Ir al Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}