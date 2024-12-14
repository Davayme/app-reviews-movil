import React from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../utils/constants';

const icons = {
  success: 'check-circle',
  error: 'times-circle',
  info: 'info-circle',
  warning: 'exclamation-circle'
};

const toastColors = {
  success: colors.azul,
  error: '#FF4B4B',
  info: colors.yellow,
  warning: '#FFB020'
};

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  slideAnim: Animated.Value;
}

export const Toast = ({ visible, message, type, slideAnim }: ToastProps) => {
  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
        { backgroundColor: toastColors[type] }
      ]}
    >
      <Icon name={icons[type]} size={24} color="#fff" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
});