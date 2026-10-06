import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import { isLoggedIn } from '@/lib/auth';
import { cleanupExpiredTrainings } from '@/lib/api';
import { Colors } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await cleanupExpiredTrainings();
      } catch {}
      const ok = await isLoggedIn();
      setAuthed(ok);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const onLogin = segments[0] === 'login';
    if (!authed && !onLogin) {
      router.replace('/login');
    } else if (authed && onLogin) {
      router.replace('/(tabs)');
    }
  }, [ready, authed, segments]);

  // Re-check auth when navigating (after login)
  useEffect(() => {
    if (!ready) return;
    isLoggedIn().then(setAuthed);
  }, [segments, ready]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.header }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="membre/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ajouter-membre" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        <Stack.Screen name="modifier-membre/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="entrainement/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ajouter-entrainement" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        <Stack.Screen name="modifier-entrainement/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="qr-coach" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="presence-list" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ecolage/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="stats-joueur/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profil-equipe" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="scanner" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="confirmation-presence" options={{ animation: 'fade' }} />
        <Stack.Screen name="historique" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
