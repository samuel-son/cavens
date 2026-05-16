import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../src/theme/colors";
import { Spacing, BorderRadius, Shadows } from "../../src/theme/spacing";
import { useProfileStore } from "../../src/features/profile/profileStore";

export default function ProfileScreen() {
  const { profile, setProfile } = useProfileStore();
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [goal, setGoal] = useState(profile.covenantGoal);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setProfile({ fullName, email, phone, location, covenantGoal: goal });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    const uri = (result as any).uri ?? (result as any)?.assets?.[0]?.uri;
    if (uri) setProfile({ avatar: uri });
  };

  return (
    <LinearGradient
      colors={["#09090F", "#10101A", "#141421"]}
      style={styles.root}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.avatarLargeContainer}
            onPress={pickAvatar}
          >
            {profile.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatarLarge}
              />
            ) : (
              <View style={styles.avatarLargePlaceholder}>
                <Text style={{ color: Colors.textInverse, fontWeight: "800" }}>
                  P
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
            <Text style={styles.subtitle}>
              Your covenant savings identity and contact details.
            </Text>
          </View>
        </View>

        {/* Account summary removed per request; profile editing form follows */}

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full name"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="email@cavens.com"
              placeholderTextColor="rgba(255,255,255,0.35)"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="024 000 0000"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Accra, Ghana"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Covenant Goal</Text>
            <TextInput
              style={styles.input}
              value={goal}
              onChangeText={setGoal}
              placeholder="E.g. Gold Vault Savings"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
          {saved && (
            <Text style={styles.savedText}>Profile updated successfully.</Text>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: Spacing["2xl"],
    paddingBottom: Spacing["3xl"],
  },
  header: {
    marginBottom: Spacing["2xl"],
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 32,
    fontWeight: "900",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["2xl"],
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing["2xl"],
    ...Shadows.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    maxWidth: "55%",
    textAlign: "right",
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["2xl"],
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
  avatarLargeContainer: {
    width: 86,
    height: 86,
    borderRadius: 44,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.goldSubtle,
  },
  avatarLarge: { width: 86, height: 86, borderRadius: 44 },
  avatarLargePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
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
  saveButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    ...Shadows.gold,
  },
  saveButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: "800",
  },
  savedText: {
    color: Colors.success,
    fontSize: 12,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
});
