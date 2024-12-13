import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ title: 'Inicio' }} 
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