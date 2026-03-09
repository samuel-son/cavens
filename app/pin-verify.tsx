import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PinPad } from '@/components/ui/PinPad';
import { useAuth } from '@/contexts/AuthContext';
import { useSavings } from '@/contexts/SavingsContext';

export default function PinVerifyScreen() {
  const router = useRouter();
  const { pendingId, action, amount, mode, lockedEndDate } = useLocalSearchParams<{
    pendingId?: string;
    action?: string;
    amount?: string;
    mode?: string;
    lockedEndDate?: string;
  }>();
  const { verifyPin } = useAuth();
  const { completePendingSavings, withdraw } = useSavings();
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const handleComplete = async (pin: string) => {
    const valid = await verifyPin(pin);
    if (!valid) {
      setError('Wrong PIN');
      setRetryKey((k) => k + 1);
      return;
    }
    setError('');
    if (pendingId) {
      const accountMode = (mode === 'locked' ? 'locked' : 'flexible') as 'locked' | 'flexible';
      completePendingSavings(pendingId, accountMode, lockedEndDate);
      router.back();
    } else if (action === 'withdraw' && amount && mode) {
      const amt = parseInt(amount, 10);
      const accountMode = (mode === 'locked' ? 'locked' : 'flexible') as 'locked' | 'flexible';
      if (amt > 0) {
        const result = withdraw(amt, accountMode);
        if (result.ok) router.replace('/(tabs)');
      }
    }
  };

  const subtitle =
    action === 'withdraw' && amount
      ? `Confirm withdrawal of ${amount}`
      : pendingId
        ? 'Complete your savings'
        : undefined;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.pinWrap}>
        <PinPad
          key={retryKey}
          title="Enter PIN"
          subtitle={error || subtitle}
          onComplete={handleComplete}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  pinWrap: {
    padding: 24,
  },
});
