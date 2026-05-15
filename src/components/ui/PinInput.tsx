import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';

interface PinInputProps {
  onComplete: (pin: string) => void;
  title?: string;
  error?: string;
}

export function PinInput({ onComplete, title = 'Enter PIN', error }: PinInputProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const refs = [
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
  ];

  const handleChange = (text: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);
    if (text && index < 3) refs[index + 1].current?.focus();
    if (newPin.every((d) => d !== '')) onComplete(newPin.join(''));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.pinRow}>
        {pin.map((digit, i) => (
          <TextInput
            key={i} ref={refs[i]}
            style={[styles.pinBox, digit ? styles.pinBoxFilled : null, error ? styles.pinBoxError : null]}
            keyboardType="number-pad" maxLength={1} secureTextEntry
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !pin[i] && i > 0) {
                const newPin = [...pin]; newPin[i - 1] = ''; setPin(newPin);
                refs[i - 1].current?.focus();
              }
            }}
          />
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: Spacing.xl },
  title: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.xl },
  pinRow: { flexDirection: 'row', gap: Spacing.lg },
  pinBox: {
    width: 56, height: 64, borderRadius: BorderRadius.lg,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface, color: Colors.textPrimary,
    fontSize: 24, fontWeight: '700', textAlign: 'center',
  },
  pinBoxFilled: { borderColor: Colors.gold, backgroundColor: Colors.goldSubtle },
  pinBoxError: { borderColor: Colors.error },
  error: { color: Colors.error, fontSize: 13, marginTop: Spacing.md },
});
