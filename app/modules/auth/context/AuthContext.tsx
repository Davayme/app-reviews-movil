import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";

interface User {
  id: number;
  uid: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "modules" && segments[1] === "auth";
    const inPublicRoutes =
      !segments[0] || (segments[0] === "modules" && segments[1] === "auth");

    if (user && inPublicRoutes) {
      // Si está autenticado y trata de acceder a rutas públicas
      router.replace("/modules/movies/screens/MainScreen");
    } else if (!user && !inPublicRoutes) {
      // Si no está autenticado y trata de acceder a rutas protegidas
      router.replace("/");
    }
  }, [user, segments, isLoading]);

  const checkUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("@user_data");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (userData: User) => {
    await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("@user_data");
    setUser(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
