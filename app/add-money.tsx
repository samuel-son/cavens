import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSavings } from '@/contexts/SavingsContext';
import { formatCurrency } from '@/lib/format';
import type { SavingsMode } from '@/types';

type FundSource = 'bank' | 'saved';

export default function AddMoneyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { addDeposit, momoNumbers, settings } = useSavings();
  const [source, setSource] = useState<FundSource>('bank');
  const [selectedMomoId, setSelectedMomoId] = useState<string | null>(
    momoNumbers[0]?.id ?? null
  );
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<SavingsMode>('flexible');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lockedEndDate, setLockedEndDate] = useState<Date>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d;
  });

  const amountNum = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const sourceLabel =
    source === 'bank'
      ? 'Bank Account'
      : momoNumbers.find((m) => m.id === selectedMomoId)?.number ?? 'Saved Number';
  const canSubmit =
    amountNum > 0 &&
    (source !== 'saved' || (selectedMomoId && momoNumbers.some((m) => m.id === selectedMomoId)));

  const onDateChange = (_: unknown, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) setLockedEndDate(date);
  };

  const effectiveLockedDate =
    mode === 'locked' && settings.lockedEndDate
      ? settings.lockedEndDate
      : lockedEndDate.toISOString().slice(0, 10);

  const handleAdd = () => {
    if (!canSubmit) return;
    addDeposit(
      amountNum,
      mode,
      sourceLabel,
      mode === 'locked' ? effectiveLockedDate : undefined
    );
    router.back();
  };

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.Text
          entering={FadeInDown}
          style={[styles.title, { color: c.text }]}>
          Add Money
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(50)}
          style={[styles.subtitle, { color: c.textSecondary }]}>
          From bank or saved number to flexible or locked savings
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(100)}
          style={[styles.sectionLabel, { color: c.textSecondary }]}>
          Source
        </Animated.Text>
        <View style={styles.sourceRow}>
          <TouchableOpacity
            style={[
              styles.sourceBtn,
              { backgroundColor: c.surface, borderColor: source === 'bank' ? c.primary : c.border },
            ]}
            onPress={() => setSource('bank')}>
            <MaterialIcons
              name="account-balance"
              size={28}
              color={source === 'bank' ? c.primary : c.textSecondary}
            />
            <Animated.Text
              style={[styles.sourceLabel, { color: c.text }]}>
              Bank
            </Animated.Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sourceBtn,
              {
                backgroundColor: c.surface,
                borderColor: source === 'saved' ? c.primary : c.border,
                opacity: momoNumbers.length > 0 ? 1 : 0.5,
              },
            ]}
            onPress={() => momoNumbers.length > 0 && setSource('saved')}
            disabled={momoNumbers.length === 0}>
            <MaterialIcons
              name="phone-iphone"
              size={28}
              color={source === 'saved' ? c.primary : c.textSecondary}
            />
            <Animated.Text
              style={[styles.sourceLabel, { color: c.text }]}>
              Saved
            </Animated.Text>
          </TouchableOpacity>
        </View>

        {source === 'saved' && momoNumbers.length > 0 && (
          <View style={styles.momoList}>
            {momoNumbers.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.momoItem,
                  {
                    backgroundColor: c.surface,
                    borderColor: selectedMomoId === m.id ? c.primary : c.border,
                  },
                ]}
                onPress={() => setSelectedMomoId(m.id)}>
                <MaterialIcons
                  name="phone"
                  size={20}
                  color={selectedMomoId === m.id ? c.primary : c.textSecondary}
                />
                <Animated.Text style={[styles.momoNumber, { color: c.text }]}>
                  {m.number}
                </Animated.Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Animated.Text
          entering={FadeInDown.delay(150)}
          style={[styles.sectionLabel, { color: c.textSecondary }]}>
          Amount
        </Animated.Text>
        <View style={[styles.inputWrap, { backgroundColor: c.surface }]}>
          <TextInput
            style={[styles.input, { color: c.text }]}
            placeholder="0"
            placeholderTextColor={c.textSecondary}
            keyboardType="number-pad"
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/\D/g, ''))}
          />
          <Animated.Text style={[styles.currency, { color: c.textSecondary }]}>
            {settings.currency}
          </Animated.Text>
        </View>

        <Animated.Text
          entering={FadeInDown.delay(200)}
          style={[styles.sectionLabel, { color: c.textSecondary }]}>
          To
        </Animated.Text>
        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.option,
              { backgroundColor: c.surface, borderColor: mode === 'flexible' ? c.primary : c.border },
            ]}
            onPress={() => setMode('flexible')}>
            <MaterialIcons
              name="lock-open"
              size={28}
              color={mode === 'flexible' ? c.primary : c.textSecondary}
            />
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
            <MaterialIcons
              name="lock"
              size={28}
              color={mode === 'locked' ? c.primary : c.textSecondary}
            />
            <View style={styles.optionText}>
              <Animated.Text style={[styles.optionTitle, { color: c.text }]}>
                Locked
              </Animated.Text>
              <Animated.Text style={[styles.optionDesc, { color: c.textSecondary }]}>
                Withdraw on chosen date
              </Animated.Text>
            </View>
          </TouchableOpacity>
        </View>

        {mode === 'locked' && (
          <View style={[styles.dateSection, { backgroundColor: c.surface }]}>
            <Animated.Text style={[styles.dateLabel, { color: c.textSecondary }]}>
              Withdraw on
            </Animated.Text>
            {settings.lockedEndDate ? (
              <View style={[styles.dateDisplay, { borderColor: c.border }]}>
                <Animated.Text style={[styles.dateText, { color: c.text }]}>
                  {formatDate(settings.lockedEndDate)}
                </Animated.Text>
                <Animated.Text style={[styles.dateHint, { color: c.textSecondary }]}>
                  Same date as existing locked savings
                </Animated.Text>
              </View>
            ) : (
              <>
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
              </>
            )}
          </View>
        )}

        {amountNum > 0 && (
          <Animated.View
            entering={FadeInDown}
            style={[styles.summary, { backgroundColor: c.surface }]}>
            <Animated.Text style={[styles.summaryRow, { color: c.textSecondary }]}>
              {formatCurrency(amountNum, settings.currency)} → {mode}
            </Animated.Text>
            <Animated.Text style={[styles.summaryRow, { color: c.text }]}>
              From {sourceLabel}
            </Animated.Text>
          </Animated.View>
        )}

        <PremiumButton
          title="Add Money"
          icon="add-circle"
          variant="primary"
          disabled={!canSubmit}
          onPress={handleAdd}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 14,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  sourceRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sourceBtn: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  sourceLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  momoList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  momoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
  },
  momoNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputWrap: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  input: {
    fontSize: 36,
    fontWeight: '700',
  },
  currency: {
    fontSize: 16,
    marginTop: Spacing.xs,
  },
  options: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
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
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.lg,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  dateDisplay: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
  },
  dateHint: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  summary: {
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
});
