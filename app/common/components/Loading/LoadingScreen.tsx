import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../utils/constants';

interface LoadingScreenProps {
  color?: string;
  size?: number | "small" | "large";
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  color = colors.azul, 
  size = "large" 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors["background-color"]
  }
});