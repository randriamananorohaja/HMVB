import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { getMember, getMemberPresenceStats } from '@/lib/api';
import type { Member } from '@/lib/types';
import { Header } from '@/components/volley/Header';
import { Avatar } from '@/components/volley/Avatar';
import { EmptyState } from '@/components/volley/EmptyState';

export default function StatsJoueurScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [stats, setStats] = useState({ presents: 0, retards: 0, absents: 0, rate: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const m = await getMember(id);
        setMember(m);
        if (m) setStats(await getMemberPresenceStats(m.id));
        setLoading(false);
      })();
    }, [id])
  );

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.container}>
        <Header title="Statistiques joueur" showBack />
        <EmptyState message="Aucune donnée enregistrée" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Statistiques joueur" showBack />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.profile}>
          <Avatar
            firstName={member.first_name}
            lastName={member.last_name}
            size={64}
            uri={member.avatar}
          />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.name}>
              {member.first_name} {member.last_name}
            </Text>
            <Text style={styles.pos}>
              #{member.number} · {member.position}
            </Text>
          </View>
        </View>

        {stats.total === 0 ? (
          <EmptyState message="Aucune donnée de présence enregistrée" icon="chart.bar.fill" />
        ) : (
          <View style={styles.card}>
            <View style={styles.circleWrap}>
              <View style={styles.circle}>
                <Text style={styles.circlePct}>{stats.rate}%</Text>
                <Text style={styles.circleLabel}>Taux de{'\n'}présence</Text>
              </View>
            </View>
            <Legend color={Colors.light.success} label="Présences" value={stats.presents} />
            <Legend color={Colors.light.danger} label="Absences" value={stats.absents} />
            <Legend color={Colors.light.warning} label="Retard" value={stats.retards} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
      <Text style={{ flex: 1, fontSize: 13, color: Colors.light.text }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.light.text }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 14,
  },
  name: { fontSize: 17, fontWeight: '700', color: Colors.light.text },
  pos: { fontSize: 13, color: Colors.light.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
  },
  circleWrap: { alignItems: 'center', marginBottom: 20 },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePct: { fontSize: 28, fontWeight: '700', color: Colors.light.success },
  circleLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
});
