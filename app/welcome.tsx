import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Colors } from "../src/theme/colors";
import { Spacing, BorderRadius, Shadows } from "../src/theme/spacing";

const { width } = Dimensions.get("window");

const ONBOARDING_SLIDES = [
  {
    title: "Plan with purpose",
    description:
      "Set covenant goals and save toward them with clarity and ease.",
  },
  {
    title: "Track every contribution",
    description:
      "Watch deposits, milestones, and progress move your purpose forward.",
  },
  {
    title: "Secure premium vaults",
    description:
      "Enjoy a premium saving experience with trusted security and support.",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);

  const handleMomentumEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <LinearGradient
      colors={[Colors.background, "#111118", Colors.backgroundSecondary]}
      style={styles.root}
    >
      <View style={styles.glowCircle} />
      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.logo}>cavens</Text>
          <Text style={styles.tagline}>
            where covenant saving meet purpose...
          </Text>

          <Animated.View
            style={[
              styles.animatedBadge,
              {
                opacity: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.65, 1],
                }),
                transform: [
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.96, 1.08],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.diamond} />
          </Animated.View>

          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            contentContainerStyle={styles.carouselContainer}
            decelerationRate="fast"
          >
            {ONBOARDING_SLIDES.map((slide, index) => (
              <View key={index} style={styles.slideCard}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>
              </View>
            ))}
          </Animated.ScrollView>

          <View style={styles.dotRow}>
            {ONBOARDING_SLIDES.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, activeIndex === index && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>
            Your covenant saving journey begins here
          </Text>
          <Text style={styles.bottomCaption}>
            Build wealth with intention, track every contribution, and watch
            your purpose carry you forward.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    position: "relative",
  },
  glowCircle: {
    position: "absolute",
    width: width * 1.3,
    height: width * 1.3,
    borderRadius: width * 0.65,
    backgroundColor: "rgba(212, 168, 83, 0.14)",
    top: -width * 0.5,
    left: -width * 0.3,
    transform: [{ scale: 1.05 }],
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["3xl"],
    marginBottom: Spacing["2xl"],
    ...Shadows.md,
  },
  logo: {
    fontSize: 58,
    color: Colors.textPrimary,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: Spacing.md,
    textTransform: "lowercase",
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing["2xl"],
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing["2xl"],
  },
  featurePill: {
    backgroundColor: Colors.goldSubtle,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  featureText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  carouselContainer: {
    paddingBottom: Spacing.lg,
  },
  slideCard: {
    width: width - Spacing["2xl"] * 2,
    minHeight: 150,
    marginRight: Spacing.lg,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["2xl"],
    borderWidth: 1,
    borderColor: Colors.borderLight,
    justifyContent: "center",
    ...Shadows.sm,
  },
  slideTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: Spacing.sm,
  },
  slideDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing["2xl"],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  dotActive: {
    backgroundColor: Colors.gold,
    width: 16,
  },
  primaryButton: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    marginBottom: Spacing.md,
    ...Shadows.gold,
  },
  primaryButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.borderGold,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  animatedBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(212, 168, 83, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["2xl"],
    alignSelf: "center",
  },
  diamond: {
    width: 18,
    height: 18,
    backgroundColor: Colors.gold,
    transform: [{ rotate: "45deg" }],
    borderRadius: 5,
  },
  bottomCard: {
    width: "100%",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["2xl"],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bottomTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: Spacing.sm,
  },
  bottomCaption: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
