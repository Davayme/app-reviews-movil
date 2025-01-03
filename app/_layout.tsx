import React, { useState } from "react";
import { Stack } from "expo-router";
import { DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar"; // Importar StatusBar
import { ToastProvider } from "./common/components/Toast/ToastProvider";
import { HeaderRight } from "./common/components/Header/HeaderRight";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import { HeaderTitle } from "./common/components/Header/HeaderTitle";
import { SearchModal } from "./modules/movies/components/Search/SearchModal";
import { WatchlistProvider } from "./modules/movies/context/WatchlistContextGlobal";
import { ReviewProvider } from "./modules/movies/context/ReviewContext";

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
    <ToastProvider>
      <StatusBar
        style="light"
        backgroundColor={customTheme.colors.background}
      />
      <AuthProvider>
        <WatchlistProvider>
          <ReviewProvider>
            <SearchModal
              visible={isSearchModalVisible}
              onClose={() => setIsSearchModalVisible(false)}
            />
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: customTheme.colors.background,
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
                  headerRight: () => (
                    <HeaderRight
                      onSearchPress={() => setIsSearchModalVisible(true)}
                    />
                  ),
                  headerBackVisible: false,
                  headerLeft: () => null,
                  headerStyle: {
                    backgroundColor: customTheme.colors.background,
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
              <Stack.Screen
                name="modules/movies/screens/MovieDetailScreen"
                options={{ headerShown: false }}
              />
            </Stack>
          </ReviewProvider>
        </WatchlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
