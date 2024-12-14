import React from 'react';
import { Stack } from 'expo-router';
import { DefaultTheme } from '@react-navigation/native';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#1b1b1b',
  },
};

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1b1b1b',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{headerShown: false }} 

      />
      <Stack.Screen 
        name="modules/auth/screens/LoginScreen" 
        options={{ title: 'Iniciar Sesión' }} 
      />
      <Stack.Screen 
        name="modules/auth/screens/MainScreen" 
        options={{ title: 'Inicio' }}
      />
      <Stack.Screen 
        name="modules/auth/screens/RegisterScreen" 
        options={{ title: 'Regístrate' }}
      />
    </Stack>
  );
}