import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../utils/constants';

interface HeaderRightProps {
  onSearchPress: () => void;
}

export const HeaderRight: React.FC<HeaderRightProps> = ({ onSearchPress }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
        <MaterialIcons name="search" size={24} color={colors.yellow} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
        <MaterialIcons name="person" size={24} color={colors.azul} />
      </TouchableOpacity>
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="person-outline" size={20} color={colors.azul} />
            <Text style={styles.menuItemText}>Mi perfil</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="logout" size={20} color={colors.magenta} />
            <Text style={[styles.menuItemText, { color: colors.magenta }]}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  menu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: colors['background-color'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: colors.azul,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
    minWidth: 180,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 4,
  },
});