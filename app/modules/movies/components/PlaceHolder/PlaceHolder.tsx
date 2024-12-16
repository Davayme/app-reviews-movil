import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonPlaceholder = () => {
  const fadeAnim = new Animated.Value(0.3);

  Animated.loop(
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  ).start();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View style={[styles.imagePlaceholder, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.textPlaceholder, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.textPlaceholder, { opacity: fadeAnim }]} />
      </View>
      <View style={styles.card}>
        <Animated.View style={[styles.imagePlaceholder, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.textPlaceholder, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.textPlaceholder, { opacity: fadeAnim }]} />
      </View>
      {/* Add more placeholders as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    width: 150,
    marginRight: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  textPlaceholder: {
    width: '100%',
    height: 20,
    backgroundColor: '#444',
    borderRadius: 4,
    marginTop: 8,
  },
});

export default SkeletonPlaceholder;