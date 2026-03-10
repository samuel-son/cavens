import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { hasPin } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  const handleGetStarted = () => {
    router.replace('/pin-setup');
  };

  const handleLogin = () => {
    router.replace('/unlock');
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing.xxl }]}>
        <Animated.Text
          entering={FadeInDown.delay(150).duration(500).springify()}
          style={[styles.brand, { color: c.primary }]}>
          Cavens
        </Animated.Text>
        <Animated.View
          entering={FadeIn.delay(400).duration(400)}
          style={[styles.accentLine, { backgroundColor: c.primary }]}
        />
        <Animated.Text
          entering={FadeInDown.delay(350).duration(500).springify()}
          style={[styles.motto, { color: c.textSecondary }]}>
          Covenant saving, met with purpose
        </Animated.Text>
      </View>

      <Animated.View
        entering={FadeInUp.delay(550).duration(500).springify()}
        style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xxl }]}>
        <PremiumButton
          title="Get Started"
          variant="primary"
          onPress={handleGetStarted}
        />
        {hasPin && (
          <PremiumButton
            title="Login"
            variant="outline"
            onPress={handleLogin}
            style={styles.loginBtn}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  brand: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  accentLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginTop: Spacing.md,
  },
  motto: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: Spacing.lg,
    textAlign: 'center',
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  loginBtn: {
    marginTop: Spacing.sm,
  },
});
