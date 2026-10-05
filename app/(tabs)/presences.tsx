import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { MEMBERS, TRAININGS } from '@/constants/data';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Avatar } from '@/components/volley/Avatar';
import { ProgressBar } from '@/components/volley/ProgressBar';

type Tab = 'mois' | 'saison' | 'joueur';

export default function PresencesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('mois');

  const totalTrainings = TRAININGS.length;
  const avgRate = 87;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Statistiques</Text>
        <View style={styles.tabs}>
          {(['mois', 'saison', 'joueur'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'mois' ? 'Mois' : t === 'saison' ? 'Saison' : 'Joueur'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <IconSymbol name="calendar" size={20} color={Colors.light.primary} />
            <Text style={styles.summaryNum}>{totalTrainings}</Text>
            <Text style={styles.summaryLabel}>Entraînements</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.circlePct}>
              <Text style={styles.circleText}>{avgRate}%</Text>
            </View>
            <Text style={styles.summaryLabel}>Présence moyenne</Text>
          </View>
        </View>

        {/* Répartition */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Répartition</Text>
          <View style={styles.repartRow}>
            <View style={styles.repartItem}>
              <View style={[styles.dot, { backgroundColor: Colors.light.success }]} />
              <Text style={styles.repartLabel}>Présents</Text>
              <Text style={styles.repartVal}>196 · 87%</Text>
            </View>
            <View style={styles.repartItem}>
              <View style={[styles.dot, { backgroundColor: Colors.light.warning }]} />
              <Text style={styles.repartLabel}>Retards</Text>
              <Text style={styles.repartVal}>14 · 6%</Text>
            </View>
            <View style={styles.repartItem}>
              <View style={[styles.dot, { backgroundColor: Colors.light.danger }]} />
              <Text style={styles.repartLabel}>Absents</Text>
              <Text style={styles.repartVal}>15 · 7%</Text>
            </View>
          </View>
        </View>

        {/* Par joueur */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Par joueur</Text>
          {MEMBERS.filter((m) => m.status === 'actif')
            .sort((a, b) => b.presenceRate - a.presenceRate)
            .map((m) => (
              <TouchableOpacity
                key={m.id}
                style={styles.playerRow}
                onPress={() => router.push(`/stats-joueur/${m.id}`)}
              >
                <Avatar firstName={m.firstName} lastName={m.lastName} size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.playerName}>
                    {m.firstName} {m.lastName}
                  </Text>
                  <View style={{ marginTop: 6 }}>
                    <ProgressBar
                      progress={m.presenceRate}
                      height={6}
                      color={
                        m.presenceRate >= 85
                          ? Colors.light.success
                          : m.presenceRate >= 70
                            ? Colors.light.warning
                            : Colors.light.danger
                      }
                    />
                  </View>
                </View>
                <Text style={styles.playerPct}>{m.presenceRate}%</Text>
              </TouchableOpacity>
            ))}
          <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>Voir toutes les présences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    backgroundColor: Colors.light.header,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.md,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabActive: { backgroundColor: '#fff' },
  tabText: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.7)' },
  tabTextActive: { color: Colors.light.header, fontWeight: '600' },
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
  seeAll: { paddingTop: 14, alignItems: 'center' },
  seeAllText: { fontSize: 14, fontWeight: '600', color: Colors.light.primary },
});
