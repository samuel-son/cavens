import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PinPad } from '@/components/ui/PinPad';
import { useAuth } from '@/contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'cavens_pin';

export default function PinChangeScreen() {
  const router = useRouter();
  const { verifyPin, setPin } = useAuth();
  const [step, setStep] = useState<'verify' | 'new' | 'confirm'>('verify');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleVerify = async (pin: string) => {
    const valid = await verifyPin(pin);
    if (!valid) return;
    setStep('new');
  };

  const handleNew = (pin: string) => {
    setNewPin(pin);
    setStep('confirm');
  };

  const handleConfirm = async (pin: string) => {
    if (pin !== newPin) {
      setStep('new');
      return;
    }
    await SecureStore.setItemAsync(PIN_KEY, pin);
    router.back();
  };

  const titles = {
    verify: 'Current PIN',
    new: 'New PIN',
    confirm: 'Confirm PIN',
  };

  const subtitles = {
    verify: undefined,
    new: undefined,
    confirm: 'Enter your new PIN again',
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.pinWrap}>
        <PinPad
          title={titles[step]}
          subtitle={subtitles[step]}
          onComplete={
            step === 'verify'
              ? handleVerify
              : step === 'new'
                ? handleNew
                : handleConfirm
          }
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
