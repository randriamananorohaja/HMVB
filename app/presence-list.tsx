import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import {
  getMembers,
  getTraining,
  getPresencesForTraining,
  setPresence,
  getTrainingsWithStats,
} from '@/lib/api';
import type { Member, PresenceStatus } from '@/lib/types';
import { Header } from '@/components/volley/Header';
import { Avatar } from '@/components/volley/Avatar';
import { StatusBadge } from '@/components/volley/StatusBadge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/volley/EmptyState';

type Row = {
  member: Member;
  status: PresenceStatus;
  time?: string | null;
};

export default function PresenceListScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState({ presents: 0, retards: 0, absents: 0 });
  const [dateLabel, setDateLabel] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    const [training, members, presences, withStats] = await Promise.all([
      getTraining(id),
      getMembers(),
      getPresencesForTraining(id),
      getTrainingsWithStats(),
    ]);
    const ts = withStats.find((t) => t.id === id);
    if (ts) {
      setStats({ presents: ts.presents, retards: ts.retards, absents: ts.absents });
    }
    if (training) {
      setDateLabel(`${training.date} · ${training.start_time}`);
    }
    const byMember = Object.fromEntries(presences.map((p) => [p.member_id, p]));
    const active = members.filter((m) => m.status === 'actif');
    setRows(
      active.map((m) => {
        const p = byMember[m.id];
        return {
          member: m,
          status: (p?.status as PresenceStatus) || 'absent',
          time: p?.time,
        };
      })
    );
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [id])
  );

  const changeStatus = (memberId: string) => {
    if (!id) return;
    Alert.alert('Statut de présence', undefined, [
      {
        text: 'Présent',
        onPress: async () => {
          const now = new Date();
          const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          await setPresence(id, memberId, 'present', time);
          load();
        },
      },
      {
        text: 'En retard',
        onPress: async () => {
          const now = new Date();
          const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          await setPresence(id, memberId, 'retard', time);
          load();
        },
      },
      {
        text: 'Absent',
        onPress: async () => {
          await setPresence(id, memberId, 'absent');
          load();
        },
      },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const filtered = rows.filter(
    (r) =>
      r.member.first_name.toLowerCase().includes(query.toLowerCase()) ||
      r.member.last_name.toLowerCase().includes(query.toLowerCase())
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
      <Header title="Présence" showBack />

      <View style={styles.summary}>
        <Text style={styles.dateLabel}>{dateLabel || '—'}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <View style={[styles.dot, { backgroundColor: Colors.light.success }]} />
            <Text style={styles.statNum}>{stats.presents}</Text>
            <Text style={styles.statLabel}>Présents</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.dot, { backgroundColor: Colors.light.warning }]} />
            <Text style={styles.statNum}>{stats.retards}</Text>
            <Text style={styles.statLabel}>Retard</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.dot, { backgroundColor: Colors.light.danger }]} />
            <Text style={styles.statNum}>{stats.absents}</Text>
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
        data={filtered}
        keyExtractor={(item) => item.member.id}
        contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState message="Aucune donnée enregistrée" icon="person.2.fill" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => changeStatus(item.member.id)}>
            <Avatar
              firstName={item.member.first_name}
              lastName={item.member.last_name}
              size={42}
              uri={item.member.avatar}
            />
            <View style={styles.info}>
              <Text style={styles.name}>
                {item.member.first_name} {item.member.last_name}
              </Text>
              <Text style={styles.time}>{item.time || '—'}</Text>
            </View>
            <StatusBadge status={item.status} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
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
});
