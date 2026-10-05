import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Header } from '@/components/volley/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';

const NOTIFS = [
  {
    id: '1',
    icon: 'calendar',
    color: Colors.light.primary,
    title: 'Nouvel entraînement',
    body: '02 OCT. 2026 · 18:00',
    time: 'Il y a 2h',
  },
  {
    id: '2',
    icon: 'bell.fill',
    color: Colors.light.danger,
    title: 'Rappel',
    body: "N'oublie pas ton entraînement...",
    time: 'Il y a 3h',
  },
  {
    id: '3',
    icon: 'checkmark.circle.fill',
    color: Colors.light.success,
    title: 'Présence enregistrée',
    body: 'Andry Rakoto a pointé sa présence',
    time: 'Il y a 4h',
  },
  {
    id: '4',
    icon: 'xmark',
    color: Colors.light.danger,
    title: 'Absence signalée',
    body: 'Mika R. est absent à l\'entraînement',
    time: 'Il y a 6h',
  },
  {
    id: '5',
    icon: 'person.crop.circle.badge.plus',
    color: Colors.light.primary,
    title: 'Nouveau membre',
    body: 'Tiana Randria a rejoint l\'équipe',
    time: 'Il y a 1j',
  },
  {
    id: '6',
    icon: 'envelope.fill',
    color: Colors.light.warning,
    title: 'Message du coach',
    body: 'Félicitations pour votre presse !',
    time: 'Il y a 1j',
  },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Header title="Notifications" showBack />
      <FlatList
        data={NOTIFS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.icon, { backgroundColor: item.color + '18' }]}>
              <IconSymbol name={item.icon} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    alignItems: 'flex-start',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
  body: { fontSize: 13, color: Colors.light.textSecondary, marginTop: 2 },
  time: { fontSize: 11, color: Colors.light.textMuted },
});
