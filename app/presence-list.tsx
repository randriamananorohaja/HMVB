import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { MEMBERS, TODAY_PRESENCE, TRAININGS, PresenceStatus } from '@/constants/data';
import { Header } from '@/components/volley/Header';
import { Avatar } from '@/components/volley/Avatar';
import { StatusBadge } from '@/components/volley/StatusBadge';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function PresenceListScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const training = TRAININGS.find((t) => t.id === id) ?? TRAININGS[0];
  const [query, setQuery] = useState('');

  const records = MEMBERS.map((m) => {
    const rec = TODAY_PRESENCE.find((p) => p.memberId === m.id);
    return {
      member: m,
      status: (rec?.status ?? 'absent') as PresenceStatus,
      time: rec?.time,
    };
  }).filter(
    (r) =>
      r.member.firstName.toLowerCase().includes(query.toLowerCase()) ||
      r.member.lastName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="Présence" showBack />

      <View style={styles.summary}>
        <Text style={styles.dateLabel}>
          {training.date} · {training.startTime}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <View style={[styles.dot, { backgroundColor: Colors.light.success }]} />
            <Text style={styles.statNum}>{training.presents}</Text>
            <Text style={styles.statLabel}>Présents</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.dot, { backgroundColor: Colors.light.warning }]} />
            <Text style={styles.statNum}>{training.retards}</Text>
            <Text style={styles.statLabel}>Retard</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.dot, { backgroundColor: Colors.light.danger }]} />
            <Text style={styles.statNum}>{training.absents}</Text>
            <Text style={styles.statLabel}>Absents</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchBox}>
        <IconSymbol name="magnifyingglass" size={18} color={Colors.light.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un membre..."
          placeholderTextColor={Colors.light.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => item.member.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Avatar
              firstName={item.member.firstName}
              lastName={item.member.lastName}
              size={42}
            />
            <View style={styles.info}>
              <Text style={styles.name}>
                {item.member.firstName} {item.member.lastName}
              </Text>
              {item.time ? (
                <Text style={styles.time}>{item.time}</Text>
              ) : (
                <Text style={styles.time}>—</Text>
              )}
            </View>
            <StatusBadge status={item.status} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />

      <TouchableOpacity style={styles.fab} onPress={() => {}}>
        <IconSymbol name="plus" size={22} color="#fff" />
        <Text style={styles.fabText}>Ajouter manuellement</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  summary: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  dateLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  statNum: { fontSize: 20, fontWeight: '700', color: Colors.light.text },
  statLabel: { fontSize: 12, color: Colors.light.textSecondary },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    margin: 12,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.light.text },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.light.text },
  time: { fontSize: 13, color: Colors.light.textSecondary, marginTop: 2 },
  sep: { height: 1, backgroundColor: Colors.light.border, marginLeft: 70 },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
  },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
