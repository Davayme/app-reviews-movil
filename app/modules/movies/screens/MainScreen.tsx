import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../common/utils/constants";
import HomeTab from "../components/Inicio/HomeTab";
import ReviewsTab from "../components/ReviewsTab";
import WatchlistTab from "../components/WatchlistTab";
import { WatchlistProvider } from "../context/WatchlistContext";

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <WatchlistProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#1b1b1b",
            borderTopWidth: 0,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarActiveTintColor: colors.yellow,
          tabBarInactiveTintColor: "#6b7280",
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeTab}
          options={{
            tabBarLabel: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Reviews"
          component={ReviewsTab}
          options={{
            tabBarLabel: "Mis Reseñas",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="rate-review" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Watchlist"
          component={WatchlistTab}
          options={{
            tabBarLabel: "Mi Lista",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="bookmark" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </WatchlistProvider>
  );
}
