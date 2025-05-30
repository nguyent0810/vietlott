import { Tabs } from "expo-router";
import React, { useState, useEffect } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import LanguageService, { Language } from "../../src/services/LanguageService";
import { theme } from "../../src/theme/theme";

export default function TabLayout() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("vi");

  useEffect(() => {
    // Initialize language service
    const initLanguage = async () => {
      await LanguageService.init();
      setCurrentLanguage(LanguageService.getCurrentLanguage());
    };

    initLanguage();

    // Listen for language changes
    const handleLanguageChange = (language: Language) => {
      setCurrentLanguage(language);
    };

    LanguageService.addLanguageChangeListener(handleLanguageChange);

    return () => {
      LanguageService.removeLanguageChangeListener(handleLanguageChange);
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: LanguageService.t("nav.home"),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 32 : 28}
              name="house.fill"
              color={focused ? theme.colors.primary : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="predictions"
        options={{
          title: LanguageService.t("nav.predictions"),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 32 : 28}
              name="brain.head.profile"
              color={focused ? theme.colors.aiEnsemble : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: LanguageService.t("nav.statistics"),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 32 : 28}
              name="chart.bar.fill"
              color={focused ? theme.colors.secondary : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: LanguageService.t("nav.history"),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 32 : 28}
              name="clock.fill"
              color={focused ? theme.colors.info : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: LanguageService.t("nav.settings"),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 32 : 28}
              name="gearshape.fill"
              color={focused ? theme.colors.textLight : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
