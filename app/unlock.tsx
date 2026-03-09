import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PinPad } from '@/components/ui/PinPad';
import { useAuth } from '@/contexts/AuthContext';

export default function UnlockScreen() {
  const router = useRouter();
  const { verifyPin } = useAuth();
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
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.pinWrap}>
        <PinPad
          key={retryKey}
          title="Unlock Cavens"
          subtitle={error || 'Enter your PIN'}
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
