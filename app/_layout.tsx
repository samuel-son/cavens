import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { SavingsProvider } from '@/contexts/SavingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.surface,
  },
};

const DarkThemeCustom = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
  },
};

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkThemeCustom : LightTheme}>
      <AuthProvider>
        <SavingsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="unlock" />
            <Stack.Screen name="pin-setup" />
            <Stack.Screen name="pin-verify" />
            <Stack.Screen name="complete-saving" />
            <Stack.Screen name="pin-change" />
            <Stack.Screen name="savings" />
            <Stack.Screen name="withdraw" />
            <Stack.Screen name="momo" />
            <Stack.Screen name="momo-add" />
            <Stack.Screen name="add-money" />
            <Stack.Screen name="investment" />
            <Stack.Screen name="store" />
          </Stack>
          <StatusBar style="auto" />
        </SavingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
