import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function InvestmentScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Animated.Text
        entering={FadeInDown}
        style={[styles.title, { color: c.text }]}>
        Investment
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(100)}
        style={[styles.subtitle, { color: c.textSecondary }]}>
        Grow your savings with investments. Coming soon.
      </Animated.Text>

      <View style={[styles.placeholder, { backgroundColor: c.surface }]}>
        <MaterialIcons name="trending-up" size={64} color={c.primary} style={{ opacity: 0.4 }} />
        <Animated.Text style={[styles.placeholderText, { color: c.textSecondary }]}>
          Invest your saved money into opportunities
        </Animated.Text>
      </View>

      <PremiumButton
        title="Back"
        variant="outline"
        onPress={() => router.back()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  placeholder: {
    padding: Spacing.xxl,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  placeholderText: {
    fontSize: 14,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
