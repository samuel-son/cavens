import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useProfileStore } from "../src/features/profile/profileStore";
import { Colors } from "../src/theme/colors";
import { Spacing, BorderRadius, Shadows } from "../src/theme/spacing";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const setProfile = useProfileStore((state) => state.setProfile);

  const saveProfile = () => {
    const isPhone = /^\+?[0-9\s-]{7,}$/i.test(identifier);
    setProfile({
      fullName: name || "Cavens Member",
      email: isPhone ? "" : identifier,
      phone: isPhone ? identifier : "",
      location: "Accra, Ghana",
      covenantGoal: "Build my covenant savings vault",
    });
  };

  return (
    <LinearGradient
      colors={["#09090F", "#10101A", "#141421"]}
      style={styles.root}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoider}
        >
          <View style={styles.headerBlock}>
            <Text style={styles.heading}>Create your Cavens account</Text>
            <Text style={styles.subheading}>
              Get started with purpose-led saving and secure covenant goals.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Samuel Boateng"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email or Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="hello@cavens.com or 024 000 0000"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a strong password"
                placeholderTextColor="rgba(255,255,255,0.35)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor="rgba(255,255,255,0.35)"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => {
                saveProfile();
                router.replace("/(tabs)/profile");
              }}
            >
              <Text style={styles.actionText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.8}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.linkText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Start with confidence</Text>
            <Text style={styles.footerText}>
              Cavens keeps your covenant contributions safe, visible, and
              aligned with your mission.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoider: {
    flex: 1,
    padding: Spacing["2xl"],
    justifyContent: "center",
  },
  headerBlock: {
    marginBottom: Spacing["2xl"],
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: 34,
    fontWeight: "900",
    marginBottom: Spacing.sm,
  },
  subheading: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: "90%",
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["2xl"],
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: BorderRadius.lg,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    ...Shadows.gold,
  },
  actionText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: "800",
  },
  linkButton: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  footerCard: {
    marginTop: Spacing["2xl"],
    padding: Spacing["2xl"],
    borderRadius: BorderRadius["2xl"],
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footerTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
