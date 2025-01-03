import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '@/app/common/utils/constants';

interface UserInfoProps {
  displayName: string;
  email: string;
  createdAt: string;
}

const UserProfileInfo: React.FC<UserInfoProps> = ({ displayName, email, createdAt }) => {
  const getInitials = (name: string) => {
    const initials = name.split(' ').map((word) => word[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.displayName}>{displayName || 'Usuario desconocido'}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.createdAt}>Cuenta creada el: {new Date(createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b1b1b',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.yellow,
  },
  email: {
    color: '#ccc',
    marginTop: 4,
  },
  createdAt: {
    color: '#ccc',
    marginTop: 4,
  },
});

export default UserProfileInfo;