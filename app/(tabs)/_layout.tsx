import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // Hauteur de la barre système (boutons Android / home indicator iOS)
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 0);
  const tabBarHeight = 56 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: Colors.light.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: Platform.OS === 'android' ? 4 : 0,
        },
        // Espace pour que le contenu ne passe pas sous la tab bar
        sceneStyle: {
          paddingBottom: tabBarHeight,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="equipe"
        options={{
          title: 'Équipe',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="entrainements"
        options={{
          title: 'Entraînements',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="presences"
        options={{
          title: 'Présences',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="checkmark.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="plus"
        options={{
          title: 'Plus',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="ellipsis" color={color} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
