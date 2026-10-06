import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { getMembers, getGlobalStats, getMemberPresenceStats } from '@/lib/api';
import type { Member } from '@/lib/types';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Avatar } from '@/components/volley/Avatar';
import { ProgressBar } from '@/components/volley/ProgressBar';
import { EmptyState } from '@/components/volley/EmptyState';

type MemberStat = Member & { rate: number; presents: number; absents: number };

export default function PresencesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [global, setGlobal] = useState({
    trainingsCount: 0,
    avgRate: 0,
    presents: 0,
    retards: 0,
    absents: 0,
  });
  const [players, setPlayers] = useState<MemberStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const [g, members] = await Promise.all([getGlobalStats(), getMembers()]);
    setGlobal(g);
    const active = members.filter((m) => m.status === 'actif');
    const withStats: MemberStat[] = [];
    for (const m of active) {
      const s = await getMemberPresenceStats(m.id);
      withStats.push({ ...m, rate: s.rate, presents: s.presents, absents: s.absents });
    }
    withStats.sort((a, b) => b.rate - a.rate);
    setPlayers(withStats);
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  const hasData = global.trainingsCount > 0 || players.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Statistiques</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
      >
        {!hasData ? (
          <EmptyState
            message={"Aucune donnée enregistrée\nAjoutez des membres et des entraînements"}
            icon="chart.bar.fill"
          />
        ) : (
          <>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <IconSymbol name="calendar" size={20} color={Colors.light.primary} />
                <Text style={styles.summaryNum}>{global.trainingsCount}</Text>
                <Text style={styles.summaryLabel}>Entraînements</Text>
              </View>
              <View style={styles.summaryCard}>
                <View style={styles.circlePct}>
                  <Text style={styles.circleText}>{global.avgRate}%</Text>
                </View>
                <Text style={styles.summaryLabel}>Présence moyenne</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Répartition</Text>
              <View style={styles.repartRow}>
                <View style={styles.repartItem}>
                  <View style={[styles.dot, { backgroundColor: Colors.light.success }]} />
                  <Text style={styles.repartLabel}>Présents</Text>
                  <Text style={styles.repartVal}>{global.presents}</Text>
                </View>
                <View style={styles.repartItem}>
                  <View style={[styles.dot, { backgroundColor: Colors.light.warning }]} />
                  <Text style={styles.repartLabel}>Retards</Text>
                  <Text style={styles.repartVal}>{global.retards}</Text>
                </View>
                <View style={styles.repartItem}>
                  <View style={[styles.dot, { backgroundColor: Colors.light.danger }]} />
                  <Text style={styles.repartLabel}>Absents</Text>
                  <Text style={styles.repartVal}>{global.absents}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Par joueur</Text>
              {players.length === 0 ? (
                <Text style={{ color: Colors.light.textMuted }}>Aucune donnée enregistrée</Text>
              ) : (
                players.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={styles.playerRow}
                    onPress={() => router.push(`/stats-joueur/${m.id}`)}
                  >
                    <Avatar
                      firstName={m.first_name}
                      lastName={m.last_name}
                      size={40}
                      uri={m.avatar}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.playerName}>
                        {m.first_name} {m.last_name}
                      </Text>
                      <View style={{ marginTop: 6 }}>
                        <ProgressBar
                          progress={m.rate}
                          height={6}
                          color={
                            m.rate >= 85
                              ? Colors.light.success
                              : m.rate >= 70
                                ? Colors.light.warning
                                : Colors.light.danger
                          }
                        />
                      </View>
                    </View>
                    <Text style={styles.playerPct}>{m.rate}%</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    backgroundColor: Colors.light.header,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  summaryNum: { fontSize: 28, fontWeight: '700', color: Colors.light.text },
  summaryLabel: { fontSize: 12, color: Colors.light.textSecondary },
  circlePct: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: { fontSize: 16, fontWeight: '700', color: Colors.light.success },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 14,
  },
  repartRow: { gap: 10 },
  repartItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  repartLabel: { flex: 1, fontSize: 14, color: Colors.light.text },
  repartVal: { fontSize: 13, fontWeight: '600', color: Colors.light.textSecondary },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  playerName: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
  playerPct: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    marginLeft: 10,
    minWidth: 40,
    textAlign: 'right',
  },
});
