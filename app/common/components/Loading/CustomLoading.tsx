import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '@/app/common/utils/constants';
import Icon from 'react-native-vector-icons/Ionicons';

export const CustomLoading = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Icon name="film-outline" size={50} color={colors.yellow} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['background-color'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(252, 189, 0, 0.1)',
  },
});