import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSavings } from '@/contexts/SavingsContext';

export default function MomoAddScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { addMomoNumber, settings } = useSavings();
  const [number, setNumber] = useState('');
  const [percent, setPercent] = useState(String(settings.defaultSavingsPercentage));

  const handleAdd = () => {
    const p = parseInt(percent.replace(/\D/g, ''), 10) || 10;
    if (!number.trim()) return;
    addMomoNumber({
      id: `momo-${Date.now()}`,
      number: number.trim(),
      provider: 'momo',
      savingsPercentage: Math.min(100, Math.max(1, p)),
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Animated.Text
          entering={FadeInDown}
          style={[styles.title, { color: c.text }]}>
          Add Number
        </Animated.Text>

        <View style={[styles.inputWrap, { backgroundColor: c.surface }]}>
          <Animated.Text style={[styles.label, { color: c.textSecondary }]}>
            Phone
          </Animated.Text>
          <TextInput
            style={[styles.input, { color: c.text }]}
            placeholder="+237 6XX XXX XXX"
            placeholderTextColor={c.textSecondary}
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
          />
        </View>

        <View style={[styles.inputWrap, { backgroundColor: c.surface }]}>
          <Animated.Text style={[styles.label, { color: c.textSecondary }]}>
            Savings %
          </Animated.Text>
          <TextInput
            style={[styles.input, { color: c.text }]}
            placeholder="10"
            placeholderTextColor={c.textSecondary}
            keyboardType="number-pad"
            value={percent}
            onChangeText={(t) => setPercent(t.replace(/\D/g, ''))}
          />
        </View>

        <PremiumButton
          title="Add"
          icon="add"
          variant="primary"
          onPress={handleAdd}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.lg,
  },
  inputWrap: {
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
  },
});
