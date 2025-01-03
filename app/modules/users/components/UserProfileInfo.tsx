import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/app/common/utils/constants';

interface UserInfoProps {
  displayName: string;
  email: string;
  createdAt: string;
}

const UserProfileInfo: React.FC<UserInfoProps> = ({ displayName, email, createdAt }) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getInitials = (name: string) => {
    const initials = name.split(' ').map((word) => word[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGradient}>
            <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
          </View>
        </View>
        
        <View style={styles.info}>
          <View style={styles.nameContainer}>
            <MaterialIcons name="person" size={24} color={colors.yellow} />
            <Text style={styles.displayName}>{displayName || 'Usuario desconocido'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={20} color={colors.magenta} />
            <Text style={styles.infoText}>{email}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="date-range" size={20} color={colors.azul} />
            <Text style={styles.infoText}>
              Miembro desde {new Date(createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    zIndex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    backgroundColor: 'rgba(31, 31, 31, 0.7)',
  },
  avatarText: {
    position: 'absolute',
    color: colors.white,
    fontSize: 40,
    fontWeight: 'bold',
    backgroundColor: colors['background-color'],
    width: '100%',
    height: '100%',
    textAlign: 'center',
    lineHeight: 100, // Mismo valor que height para centrar verticalmente
    borderRadius: 50,
  },
  info: {
    gap: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  displayName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.cyan,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoText: {
    color: colors.white,
    fontSize: 16,
    flex: 1,
  },
});

export default UserProfileInfo;