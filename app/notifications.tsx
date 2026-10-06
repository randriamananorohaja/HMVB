import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { getNotifications } from '@/lib/api';
import { Header } from '@/components/volley/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/volley/EmptyState';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `Il y a ${d}j`;
}

export default function NotificationsScreen() {
  const [items, setItems] = useState<
    {
      id: string;
      title: string;
      body: string | null;
      icon: string | null;
      color: string | null;
      created_at: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getNotifications();
        setItems(data);
        setLoading(false);
      })();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Notifications" showBack />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState message="Aucune donnée enregistrée" icon="bell.fill" />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View
              style={[
                styles.icon,
                { backgroundColor: (item.color || Colors.light.primary) + '18' },
              ]}
            >
              <IconSymbol
                name={item.icon || 'bell.fill'}
                size={20}
                color={item.color || Colors.light.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              {item.body ? <Text style={styles.body}>{item.body}</Text> : null}
            </View>
            <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
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
