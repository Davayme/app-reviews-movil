import React from "react";
import { Stack } from "expo-router";
import { DefaultTheme } from "@react-navigation/native";
import { ToastProvider } from "./common/components/Toast/ToastProvider";
import { HeaderRight } from "./common/components/Header/HeaderRight";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#1b1b1b",
  },
};

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1b1b1b",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="modules/auth/screens/LoginScreen"
          options={{ title: "Iniciar Sesión" }}
        />
        <Stack.Screen
          name="modules/movies/screens/MainScreen"
          options={{
            title: "Inicio",
            headerRight: () => <HeaderRight />,
            headerStyle: {
              backgroundColor: "#1b1b1b",
            },
            headerTintColor: "#ffffff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="modules/auth/screens/RegisterScreen"
          options={{ title: "Regístrate" }}
        />
      </Stack>
    </ToastProvider>
  );
}
