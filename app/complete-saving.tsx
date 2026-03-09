import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSavings } from '@/contexts/SavingsContext';
import type { SavingsMode } from '@/types';

export default function CompleteSavingScreen() {
  const router = useRouter();
  const { pendingId } = useLocalSearchParams<{ pendingId: string }>();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { pendingSavings, settings } = useSavings();
  const [mode, setMode] = useState<SavingsMode>('flexible');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lockedEndDate, setLockedEndDate] = useState<Date>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d;
  });

  const item = pendingSavings.find((p) => p.id === pendingId);
  if (!item) {
    return null;
  }

  const onDateChange = (_: unknown, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) setLockedEndDate(date);
  };

  const handleConfirm = () => {
    const params: Record<string, string> = { pendingId: item.id, mode };
    if (mode === 'locked') {
      params.lockedEndDate = lockedEndDate.toISOString().slice(0, 10);
    }
    router.push({ pathname: '/pin-verify', params });
  };

  const formatDate = (d: Date) => d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}>
      <Animated.Text
        entering={FadeInDown}
        style={[styles.title, { color: c.text }]}>
        Choose account
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(100)}
        style={[styles.amount, { color: c.primary }]}>
        {item.savingsAmount.toLocaleString()} {settings.currency}
      </Animated.Text>

      <View style={styles.options}>
        <TouchableOpacity
          style={[
            styles.option,
            { backgroundColor: c.surface, borderColor: mode === 'flexible' ? c.primary : c.border },
          ]}
          onPress={() => setMode('flexible')}>
          <MaterialIcons name="lock-open" size={28} color={mode === 'flexible' ? c.primary : c.textSecondary} />
          <View style={styles.optionText}>
            <Animated.Text style={[styles.optionTitle, { color: c.text }]}>
              Flexible
            </Animated.Text>
            <Animated.Text style={[styles.optionDesc, { color: c.textSecondary }]}>
              Withdraw anytime
            </Animated.Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            { backgroundColor: c.surface, borderColor: mode === 'locked' ? c.primary : c.border },
          ]}
          onPress={() => setMode('locked')}>
          <MaterialIcons name="lock" size={28} color={mode === 'locked' ? c.primary : c.textSecondary} />
          <View style={styles.optionText}>
            <Animated.Text style={[styles.optionTitle, { color: c.text }]}>
              Locked
            </Animated.Text>
            <Animated.Text style={[styles.optionDesc, { color: c.textSecondary }]}>
              Withdraw on chosen date only
            </Animated.Text>
          </View>
        </TouchableOpacity>
      </View>

      {mode === 'locked' && (
        <View style={[styles.dateSection, { backgroundColor: c.surface }]}>
          <Animated.Text style={[styles.dateLabel, { color: c.textSecondary }]}>
            Withdraw on
          </Animated.Text>
          <TouchableOpacity
            style={[styles.dateBtn, { borderColor: c.border }]}
            onPress={() => setShowDatePicker(true)}>
            <Animated.Text style={[styles.dateText, { color: c.text }]}>
              {formatDate(lockedEndDate)}
            </Animated.Text>
            <MaterialIcons name="edit-calendar" size={20} color={c.primary} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={lockedEndDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
      )}

      <PremiumButton
        title="Confirm"
        icon="check-circle"
        variant="primary"
        onPress={handleConfirm}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: Spacing.sm,
  },
  options: {
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
  },
  optionText: {
    marginLeft: Spacing.md,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 14,
    marginTop: 2,
  },
  dateSection: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 16,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
