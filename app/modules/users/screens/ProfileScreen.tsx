import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import UserProfileInfo from '../components/UserProfileInfo';
import UserStats from '../components/UserStats';
import { getUserProfile } from '../services/userService';
import { useAuth } from '@/app/modules/auth/hooks/useAuth';
import { colors } from '@/app/common/utils/constants';
import { UserProfile } from '../services/userService';

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
        <>
          <UserProfileInfo
            displayName={userProfile.name}
            email={userProfile.email}
            createdAt={userProfile.createdAt}
          />
          <UserStats reviews={userProfile.reviews} watchlist={userProfile.watchlist} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['background-color'],
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors['background-color'],
  },
});

export default ProfileScreen;