import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSavings } from '@/contexts/SavingsContext';

export default function MomoScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { momoNumbers } = useSavings();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Animated.Text
        entering={FadeInDown}
        style={[styles.title, { color: c.text }]}>
        MoMo / Telecel
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(50)}
        style={[styles.subtitle, { color: c.textSecondary }]}>
        Manage numbers for savings detection
      </Animated.Text>

      {momoNumbers.map((m) => (
        <View
          key={m.id}
          style={[styles.card, { backgroundColor: c.surface }]}>
          <MaterialIcons name="phone-iphone" size={28} color={c.primary} />
          <View style={styles.info}>
            <Animated.Text style={[styles.number, { color: c.text }]}>
              {m.number}
            </Animated.Text>
            <Animated.Text style={[styles.percent, { color: c.textSecondary }]}>
              {m.savingsPercentage}% savings
            </Animated.Text>
          </View>
        </View>
      ))}

      <PremiumButton
        title="Add Number"
        icon="add"
        variant="primary"
        onPress={() => router.push('/momo-add')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 16,
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  info: {
    flex: 1,
  },
  number: {
    fontSize: 18,
    fontWeight: '700',
  },
  percent: {
    fontSize: 14,
    marginTop: 2,
  },
});
