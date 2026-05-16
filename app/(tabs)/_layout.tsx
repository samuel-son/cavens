import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../src/theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIconName =
  | "home"
  | "shield-checkmark"
  | "bag-handle"
  | "trending-up"
  | "flash"
  | "person";

const TAB_CONFIG: {
  name: string;
  title: string;
  icon: TabIconName;
  isPrimary?: boolean;
}[] = [
  { name: "index", title: "Home", icon: "home" },
  { name: "vault", title: "Save", icon: "shield-checkmark", isPrimary: true },
  { name: "store", title: "Shop", icon: "bag-handle", isPrimary: true },
  { name: "wealth", title: "Invest", icon: "trending-up" },
  { name: "utilities", title: "Bills", icon: "flash" },
  { name: "profile", title: "Profile", icon: "person" },
];

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      <View style={styles.tabBarInner}>
        {state.routes.map((route: any, index: number) => {
          const config = TAB_CONFIG[index];
          if (!config) return null;
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                if (!isFocused) navigation.navigate(route.name);
              }}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {config.isPrimary && isFocused ? (
                <LinearGradient
                  colors={[...Colors.gradientGold]}
                  style={styles.primaryBadge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={config.icon}
                    size={22}
                    color={Colors.textInverse}
                  />
                </LinearGradient>
              ) : (
                <View
                  style={[styles.iconWrap, isFocused && styles.iconWrapActive]}
                >
                  <Ionicons
                    name={
                      isFocused
                        ? config.icon
                        : (`${config.icon}-outline` as any)
                    }
                    size={22}
                    color={isFocused ? Colors.gold : Colors.tabBarInactive}
                  />
                </View>
              )}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? config.isPrimary
                        ? Colors.gold
                        : Colors.textPrimary
                      : Colors.tabBarInactive,
                  },
                  isFocused && styles.tabLabelActive,
                ]}
              >
                {config.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="vault" />
      <Tabs.Screen name="store" />
      <Tabs.Screen name="wealth" />
      <Tabs.Screen name="utilities" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.tabBarBg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  tabBarInner: {
    flexDirection: "row",
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  iconWrap: {
    width: 40,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  iconWrapActive: {
    backgroundColor: Colors.goldSubtle,
  },
  primaryBadge: {
    width: 44,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 1,
  },
  tabLabelActive: {
    fontWeight: "700",
  },
});
