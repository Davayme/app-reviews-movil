import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import UserProfileInfo from '../components/UserProfileInfo';
import UserStats from '../components/UserStats';
import { getUserProfile } from '../services/userService';
import { useAuth } from '@/app/modules/auth/hooks/useAuth';
import { colors } from '@/app/common/utils/constants';
import { UserProfile } from '../services/userService';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user?.uid) {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {userProfile && (
        <LinearGradient
          colors={['rgba(16, 204, 208, 0.1)', 'rgba(231, 87, 147, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <UserProfileInfo
            displayName={userProfile.name}
            email={userProfile.email}
            createdAt={userProfile.createdAt}
          />
          <UserStats reviews={userProfile.reviews} watchlist={userProfile.watchlist} />
        </LinearGradient>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['background-color'],
  },
  gradientContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(31, 31, 31, 0.7)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors['background-color'],
  },
});

export default ProfileScreen;