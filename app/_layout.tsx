import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="membre/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="ajouter-membre"
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen name="modifier-membre/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="entrainement/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="ajouter-entrainement"
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
        <Stack.Screen name="qr-coach" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="presence-list" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="stats-joueur/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profil-equipe" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="scanner" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="confirmation-presence" options={{ animation: 'fade' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
