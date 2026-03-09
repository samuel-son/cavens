import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface PinPadProps {
  onComplete: (pin: string) => void;
  title?: string;
  subtitle?: string;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

export function PinPad({ onComplete, title = 'Enter PIN', subtitle }: PinPadProps) {
  const [pin, setPin] = useState('');
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  const handlePress = useCallback(
    (key: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (key === 'backspace') {
        setPin((p) => p.slice(0, -1));
        return;
      }
      if (key === '') return;
      const next = pin + key;
      if (next.length <= 4) {
        setPin(next);
        if (next.length === 4) {
          onComplete(next);
        }
      }
    },
    [pin, onComplete]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.Text
          entering={FadeIn}
          style={[styles.title, { color: c.text }]}>
          {title}
        </Animated.Text>
        {subtitle ? (
          <Animated.Text
            entering={FadeIn.delay(50)}
            style={[styles.subtitle, { color: c.textSecondary }]}>
            {subtitle}
          </Animated.Text>
        ) : null}
      </View>

      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: pin.length > i ? c.pinDot : c.border,
                borderColor: c.border,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.keypad}>
        {KEYS.map((key) => (
          <TouchableOpacity
            key={key || 'empty'}
            style={[styles.key, { backgroundColor: c.surface }]}
            onPress={() => handlePress(key)}
            disabled={key === ''}
            activeOpacity={0.7}>
            {key === 'backspace' ? (
              <MaterialIcons name="backspace" size={28} color={c.text} />
            ) : key ? (
              <Animated.Text
                entering={FadeIn}
                style={[styles.keyText, { color: c.text }]}>
                {key}
              </Animated.Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  key: {
    width: '28%',
    aspectRatio: 1.2,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 28,
    fontWeight: '600',
  },
});
