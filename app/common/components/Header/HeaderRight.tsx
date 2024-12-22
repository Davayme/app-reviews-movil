import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../utils/constants';

interface HeaderRightProps {
  onSearchPress: () => void;
}

export const HeaderRight: React.FC<HeaderRightProps> = ({ onSearchPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
        <MaterialIcons name="search" size={24} color={colors.yellow} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="person" size={24} color={colors.azul} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 16
  },
  iconButton: {
    padding: 4
  }
});