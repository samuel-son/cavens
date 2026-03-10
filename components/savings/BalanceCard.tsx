import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BorderRadius, Spacing } from '@/constants/theme';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface BalanceCardProps {
  total: number;
  flexible: number;
  locked: number;
  currency?: string;
  masked?: boolean;
  onRevealPress?: () => void;
}

function formatAmount(amount: number, currency = 'XAF'): string {
  return `${amount.toLocaleString()} ${currency}`;
}

export function BalanceCard({
  total,
  flexible,
  locked,
  currency = 'XAF',
  masked = true,
  onRevealPress,
}: BalanceCardProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const flipProgress = useSharedValue(masked ? 0 : 1);

  useEffect(() => {
    flipProgress.value = withSpring(masked ? 0 : 1, {
      damping: 18,
      stiffness: 120,
      mass: 0.8,
    });
  }, [masked, flipProgress]);

  const containerStyle = useAnimatedStyle(() => {
    'worklet';
    const rot = interpolate(flipProgress.value, [0, 1], [0, 180]);
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${rot}deg` },
      ],
    };
  });

  const backFaceStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: '180deg' }],
  }));

  const cardBaseStyle = [
    styles.card,
    {
      backgroundColor: c.surface,
      borderColor: c.border,
      shadowColor: c.primary,
    },
  ];

  const FrontFace = (
    <View style={[styles.face, styles.frontFace]} pointerEvents="none">
      <View style={[styles.cardInner, cardBaseStyle]}>
        <View style={[styles.revealPrompt, { backgroundColor: c.primary + '12' }]}>
          <MaterialIcons name="account-balance-wallet" size={48} color={c.primary} />
          <Text style={[styles.revealTitle, { color: c.text }]}>
            Tap to view balance
          </Text>
          <Text style={[styles.revealSub, { color: c.textSecondary }]}>
            Enter PIN to reveal
          </Text>
        </View>
      </View>
    </View>
  );

  const BackFace = (
    <Animated.View style={[styles.face, styles.backFace, backFaceStyle]} pointerEvents="none">
      <View style={[styles.cardInner, cardBaseStyle]}>
        <View style={styles.balanceContent}>
          <Text style={[styles.balanceLabel, { color: c.textSecondary }]}>
            Total Balance
          </Text>
          <Text style={[styles.balanceAmount, { color: c.primary }]}>
            {formatAmount(total, currency)}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: c.border }]} />
        <View style={styles.row}>
          <View style={styles.half}>
            <MaterialIcons name="lock-open" size={20} color={c.primary} />
            <Text style={[styles.sublabel, { color: c.textSecondary }]}>
              Flexible
            </Text>
            <Text style={[styles.subamount, { color: c.text }]}>
              {formatAmount(flexible, currency)}
            </Text>
          </View>
          <View style={[styles.dividerVertical, { backgroundColor: c.border }]} />
          <View style={styles.half}>
            <MaterialIcons name="lock" size={20} color={c.textSecondary} />
            <Text style={[styles.sublabel, { color: c.textSecondary }]}>
              Locked
            </Text>
            <Text style={[styles.subamount, { color: c.text }]}>
              {formatAmount(locked, currency)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const CardFaces = (
    <Animated.View style={[styles.flipContainer, containerStyle]}>
      {FrontFace}
      {BackFace}
    </Animated.View>
  );

  if (masked && onRevealPress) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onRevealPress}
        style={styles.touchWrapper}>
        {CardFaces}
      </TouchableOpacity>
    );
  }

  return <View style={styles.touchWrapper}>{CardFaces}</View>;
}

const styles = StyleSheet.create({
  touchWrapper: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    minHeight: 180,
  },
  flipContainer: {
    flex: 1,
    ...(Platform.OS === 'android' && { backfaceVisibility: 'hidden' }),
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
  },
  frontFace: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backFace: {
    justifyContent: 'center',
  },
  cardInner: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    padding: Spacing.xl,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  revealPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    borderRadius: 16,
  },
  revealTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.md,
    letterSpacing: 0.3,
  },
  revealSub: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: Spacing.xs,
    opacity: 0.8,
  },
  balanceContent: {
    marginBottom: Spacing.lg,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  dividerVertical: {
    width: 1,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  half: {
    flex: 1,
    alignItems: 'center',
  },
  sublabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  subamount: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
});
