// app/modules/auth/guards/AuthGuard.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};