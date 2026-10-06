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
import {
  getTeam,
  getMembers,
  getTrainingsWithStats,
  getGlobalStats,
  type TrainingWithStats,
} from '@/lib/api';
import type { Team } from '@/lib/types';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/volley/ProgressBar';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { EmptyState } from '@/components/volley/EmptyState';

export default function AccueilScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [today, setToday] = useState<TrainingWithStats | null>(null);
  const [stats, setStats] = useState({ avgRate: 0, trainingsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const [t, members, trainings, g] = await Promise.all([
      getTeam(),
      getMembers(),
      getTrainingsWithStats(),
      getGlobalStats(),
    ]);
    setTeam(t);
    setMemberCount(members.filter((m) => m.status === 'actif').length);
    const todayStr = new Date().toISOString().slice(0, 10);
    setToday(trainings.find((x) => x.date === todayStr) ?? trainings[0] ?? null);
    setStats({ avgRate: g.avgRate, trainingsCount: g.trainingsCount });
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

  const presentCount = today?.presents ?? 0;
  const total = today?.total_members ?? memberCount;
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🏐</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Bonjour Coach 👋</Text>
              <Text style={styles.teamName}>
                {team?.name ?? 'Volley Team'} · {team?.category ?? 'Senior'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => router.push('/notifications')}>
            <IconSymbol name="bell.fill" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
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
        {today ? (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Prochain entraînement</Text>
            <View style={styles.trainingRow}>
              <View style={styles.dateBox}>
                <IconSymbol name="calendar" size={18} color={Colors.light.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.trainingDate}>
                  {today.date === new Date().toISOString().slice(0, 10)
                    ? "Aujourd'hui"
                    : today.date}
                </Text>
                <Text style={styles.trainingTime}>
                  {today.start_time} – {today.end_time}
                </Text>
                <View style={styles.locRow}>
                  <IconSymbol name="mappin" size={14} color={Colors.light.textSecondary} />
                  <Text style={styles.locText}>{today.location || '—'}</Text>
                </View>
              </View>
            </View>

            {total > 0 && (
              <>
                <View style={styles.presenceRow}>
                  <Text style={styles.presenceCount}>
                    {presentCount} présents / {total}
                  </Text>
                  <Text style={styles.presencePct}>{rate}%</Text>
                </View>
                <ProgressBar progress={rate} height={10} />
              </>
            )}

            <PrimaryButton
              title="Ouvrir le QR"
              icon="qrcode"
              onPress={() => router.push(`/qr-coach?id=${today.id}`)}
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <View style={styles.card}>
            <EmptyState
              message={"Aucune donnée enregistrée\nCréez un entraînement pour commencer"}
              icon="calendar"
            />
            <PrimaryButton
              title="Créer un entraînement"
              icon="plus"
              onPress={() => router.push('/ajouter-entrainement')}
            />
          </View>
        )}

        {today && total > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Présence</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statDot, { backgroundColor: Colors.light.success }]} />
                <Text style={styles.statNum}>{today.presents}</Text>
                <Text style={styles.statLabel}>Présents</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statDot, { backgroundColor: Colors.light.warning }]} />
                <Text style={styles.statNum}>{today.retards}</Text>
                <Text style={styles.statLabel}>En retard</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statDot, { backgroundColor: Colors.light.danger }]} />
                <Text style={styles.statNum}>{today.absents}</Text>
                <Text style={styles.statLabel}>Absents</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => router.push(`/presence-list?id=${today.id}`)}
            >
              <Text style={styles.linkText}>Voir la liste complète</Text>
              <IconSymbol name="chevron.right" size={18} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(tabs)/equipe')}>
            <View style={[styles.quickIcon, { backgroundColor: '#DBEAFE' }]}>
              <IconSymbol name="person.2.fill" size={22} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickLabel}>Équipe</Text>
            <Text style={styles.quickSub}>
              {memberCount} membre{memberCount !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(tabs)/presences')}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#DCFCE7' }]}>
              <IconSymbol name="chart.bar.fill" size={22} color={Colors.light.success} />
            </View>
            <Text style={styles.quickLabel}>Stats</Text>
            <Text style={styles.quickSub}>
              {stats.trainingsCount === 0 ? 'Aucune donnée' : `${stats.avgRate}% moyenne`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    backgroundColor: Colors.light.header,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 22 },
  greeting: { color: '#fff', fontSize: 18, fontWeight: '700' },
  teamName: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1, marginTop: -8 },
  card: {
    backgroundColor: Colors.light.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: Radius.lg,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trainingRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  dateBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainingDate: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  trainingTime: { fontSize: 14, color: Colors.light.textSecondary, marginTop: 2 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locText: { fontSize: 13, color: Colors.light.textSecondary },
  presenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  presenceCount: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
  presencePct: { fontSize: 14, fontWeight: '700', color: Colors.light.success },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statDot: { width: 10, height: 10, borderRadius: 5 },
  statNum: { fontSize: 22, fontWeight: '700', color: Colors.light.text },
  statLabel: { fontSize: 12, color: Colors.light.textSecondary },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  linkText: { fontSize: 14, fontWeight: '600', color: Colors.light.primary },
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  quickCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
  quickSub: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 2 },
});
