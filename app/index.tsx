import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';

const WELCOME_SEEN_KEY = 'cavens_welcome_seen';

export default function IndexScreen() {
  const { hasPin, isAuthenticated, isInitializing } = useAuth();
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(WELCOME_SEEN_KEY).then((v) =>
      setHasSeenWelcome(v === 'true')
    );
  }, []);

  if (isInitializing || hasSeenWelcome === null) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!hasSeenWelcome) {
    return <Redirect href="/welcome" />;
  }

  if (!hasPin) {
    return <Redirect href="/pin-setup" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/unlock" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
