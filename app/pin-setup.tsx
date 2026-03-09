import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PinPad } from '@/components/ui/PinPad';
import { useAuth } from '@/contexts/AuthContext';

export default function PinSetupScreen() {
  const router = useRouter();
  const { setPin } = useAuth();
  const [step, setStep] = useState<'first' | 'confirm'>('first');
  const [firstPin, setFirstPin] = useState('');

  const handleFirst = (pin: string) => {
    setFirstPin(pin);
    setStep('confirm');
  };

  const handleConfirm = async (pin: string) => {
    if (pin !== firstPin) {
      // Show error - for now just reset
      setStep('first');
      return;
    }
    await setPin(pin);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.pinWrap}>
        <PinPad
          title={step === 'first' ? 'Create PIN' : 'Confirm PIN'}
          subtitle={step === 'confirm' ? 'Enter your PIN again' : undefined}
          onComplete={step === 'first' ? handleFirst : handleConfirm}
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
