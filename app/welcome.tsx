import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';

const WELCOME_SEEN_KEY = 'cavens_welcome_seen';

export default function WelcomeScreen() {
  const router = useRouter();
  const { hasPin } = useAuth();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  const handleGetStarted = async () => {
    await SecureStore.setItemAsync(WELCOME_SEEN_KEY, 'true');
    if (hasPin) {
      router.replace('/unlock');
    } else {
      router.replace('/pin-setup');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.content}>
        <Animated.Text
          entering={FadeInDown.delay(200)}
          style={[styles.brand, { color: c.primary }]}>
          CavensApp
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(400)}
          style={[styles.motto, { color: c.textSecondary }]}>
          where covenant saving meets purpose
        </Animated.Text>
      </View>

      <Animated.View
        entering={FadeIn.delay(600)}
        style={styles.footer}>
        <PremiumButton
          title="Get Started"
          variant="primary"
          onPress={handleGetStarted}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
  },
  motto: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: Spacing.xxl,
  },
});
