import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getPopularMovies } from '../services/authServices';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false, // Cambiado a false para evitar la advertencia
    }).start();

    // Llamar al servicio de películas y obtener los paths de los posters
    const fetchMovies = async () => {
      try {
        const posterPaths: string[] = await getPopularMovies();
        setBackgroundImages(posterPaths.map(path => `https://image.tmdb.org/t/p/w500${path}`));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [fadeAnim]);

  useEffect(() => {
    if (backgroundImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [backgroundImages]);

  if (loading) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, styles.container]}>
        <ActivityIndicator size="large" color="#fcbd00" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: backgroundImages[currentImageIndex] || 'ruta/a/una/imagen/predeterminada.jpg' }}
      style={styles.background}
    >
      <View style={[tw`flex-1 justify-center items-center p-4`, styles.overlay]}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={[tw`text-4xl font-bold mb-2`, styles.title]}>CineScore</Text>
          <Text style={[tw`text-lg mb-4 text-center`, styles.subtitle]}>
            ¡Descubre y reseña tus películas favoritas!
          </Text>
          <Text style={[tw`text-base mb-8 text-center`, styles.description]}>
            Crea tu watchlist y comparte tus opiniones con otros cinéfilos.
          </Text>
          <TouchableOpacity
            style={[tw`flex-row items-center justify-center p-4 rounded-lg mt-6 w-64`, styles.loginButton]}
            onPress={() => router.push('/modules/auth/screens/LoginScreen')}
          >
            <Icon name="sign-in" size={20} color="#1b1b1b" style={tw`mr-2`} />
            <Text style={[tw`text-lg text-center`, styles.buttonText]}>Ir al Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[tw`flex-row items-center justify-center p-4 rounded-lg mt-4 w-64`, styles.registerButton]}
            onPress={() => router.push('/modules/auth/screens/RegisterScreen')}
          >
            <Icon name="user-plus" size={20} color="#1b1b1b" style={tw`mr-2`} />
            <Text style={[tw`text-lg text-center`, styles.buttonText]}>Registrarse</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b1b1b',
  },
  background: {
    flex: 1,
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: 'rgba(27, 27, 27, 0.8)',
  },
  title: {
    color: '#fcbd00',
  },
  subtitle: {
    color: '#10ccd0',
  },
  description: {
    color: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#e75793',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  registerButton: {
    backgroundColor: '#10ccd0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#1b1b1b',
  },
});