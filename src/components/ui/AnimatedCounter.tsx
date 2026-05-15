import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TextStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  style?: TextStyle;
}

export function AnimatedCounter({
  value, prefix = '₵', suffix = '', decimals = 2,
  duration = 800, style,
}: AnimatedCounterProps) {
  const animValue = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = React.useState('0.00');

  useEffect(() => {
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    const listener = animValue.addListener(({ value: v }) => {
      setDisplay(v.toFixed(decimals));
    });

    return () => animValue.removeListener(listener);
  }, [value]);

  return (
    <Text style={[styles.text, style]}>
      {prefix}{display}{suffix}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
});
