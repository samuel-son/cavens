import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  Switch,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSavings } from '@/contexts/SavingsContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { settings, updateSettings } = useSavings();
  const { signOut } = useAuth();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Animated.Text
        entering={FadeInDown}
        style={[styles.title, { color: c.text }]}>
        Settings
      </Animated.Text>

      <View style={[styles.card, { backgroundColor: c.surface }]}>
        <Animated.Text
          entering={FadeInDown.delay(100)}
          style={[styles.sectionTitle, { color: c.text }]}>
          Savings
        </Animated.Text>

        <View style={[styles.row, { borderBottomColor: c.border }]}>
          <Animated.Text style={[styles.label, { color: c.textSecondary }]}>
            Auto-save
          </Animated.Text>
          <Switch
            value={settings.autoSaveEnabled}
            onValueChange={(v) => updateSettings({ autoSaveEnabled: v })}
            trackColor={{ false: c.border, true: c.primary + '60' }}
            thumbColor={settings.autoSaveEnabled ? c.primary : c.textSecondary}
          />
        </View>

        <View style={[styles.row, { borderBottomColor: c.border }]}>
          <Animated.Text style={[styles.label, { color: c.textSecondary }]}>
            Savings %
          </Animated.Text>
          <TextInput
            style={[styles.input, { color: c.text }]}
            value={String(settings.defaultSavingsPercentage)}
            keyboardType="number-pad"
            onChangeText={(t) => {
              const n = parseInt(t.replace(/\D/g, ''), 10);
              if (!isNaN(n) && n >= 0 && n <= 100) {
                updateSettings({ defaultSavingsPercentage: n });
              }
            }}
          />
        </View>

        <View style={[styles.row]}>
          <Animated.Text style={[styles.label, { color: c.textSecondary }]}>
            Default account
          </Animated.Text>
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                {
                  backgroundColor: settings.savingsMode === 'flexible' ? c.primary : 'transparent',
                  borderColor: c.primary,
                },
              ]}
              onPress={() => updateSettings({ savingsMode: 'flexible' })}>
              <Animated.Text
                style={[
                  styles.modeText,
                  { color: settings.savingsMode === 'flexible' ? '#fff' : c.text },
                ]}>
                Flexible
              </Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                {
                  backgroundColor: settings.savingsMode === 'locked' ? c.primary : 'transparent',
                  borderColor: c.primary,
                },
              ]}
              onPress={() => updateSettings({ savingsMode: 'locked' })}>
              <Animated.Text
                style={[
                  styles.modeText,
                  { color: settings.savingsMode === 'locked' ? '#fff' : c.text },
                ]}>
                Locked
              </Animated.Text>
            </TouchableOpacity>
          </View>
        </View>
        <Animated.Text style={[styles.hint, { color: c.textSecondary }]}>
          Choose which account new savings go to by default
        </Animated.Text>
      </View>

      <View style={[styles.card, { backgroundColor: c.surface }]}>
        <Animated.Text
          entering={FadeInDown.delay(150)}
          style={[styles.sectionTitle, { color: c.text }]}>
          MoMo / Telecel
        </Animated.Text>
        <PremiumButton
          title="Manage Numbers"
          icon="phone"
          variant="outline"
          onPress={() => router.push('/momo')}
        />
      </View>

      <View style={[styles.card, { backgroundColor: c.surface }]}>
        <Animated.Text
          entering={FadeInDown.delay(200)}
          style={[styles.sectionTitle, { color: c.text }]}>
          Security
        </Animated.Text>
        <PremiumButton
          title="Change PIN"
          icon="lock"
          variant="outline"
          onPress={() => router.push('/pin-change')}
        />
      </View>

      <PremiumButton
        title="Sign Out"
        icon="logout"
        variant="outline"
        onPress={() => {
          signOut();
          router.replace('/welcome');
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: Spacing.xxl, padding: Spacing.md },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.lg,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'right',
  },
  modeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modeBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    marginTop: -Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});
