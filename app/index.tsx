import { Redirect } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';

export default function IndexScreen() {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return <Redirect href="/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
