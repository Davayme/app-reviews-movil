import React, { useState } from "react";
import { Stack } from "expo-router";
import { DefaultTheme } from "@react-navigation/native";
import { ToastProvider } from "./common/components/Toast/ToastProvider";
import { HeaderRight } from "./common/components/Header/HeaderRight";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import { HeaderTitle } from "./common/components/Header/HeaderTitle";
import { SearchModal } from "./modules/movies/components/Search/SearchModal";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#1b1b1b",
  },
};

export default function RootLayout() {
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  return (
    <AuthProvider>
      <ToastProvider>
      <SearchModal
          visible={isSearchModalVisible}
          onClose={() => setIsSearchModalVisible(false)}
        />
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
              headerTitle: () => <HeaderTitle />,
              headerRight: () => <HeaderRight onSearchPress={() => setIsSearchModalVisible(true)} />,
              headerBackVisible: false,
              headerLeft: () => null,
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
    </AuthProvider>
  );
}
