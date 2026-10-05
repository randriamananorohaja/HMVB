import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { MEMBERS } from '@/constants/data';
import { Header } from '@/components/volley/Header';
import { Avatar } from '@/components/volley/Avatar';
import { ProgressBar } from '@/components/volley/ProgressBar';

export default function StatsJoueurScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const member = MEMBERS.find((m) => m.id === id) ?? MEMBERS[0];

  return (
    <View style={styles.container}>
      <Header title="Statistiques joueur" showBack />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.profile}>
          <Avatar firstName={member.firstName} lastName={member.lastName} size={64} />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.name}>
              {member.firstName} {member.lastName}
            </Text>
            <Text style={styles.pos}>
              #{member.number} · {member.position}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.season}>Saison 2026 – 2027</Text>
          <View style={styles.circleWrap}>
            <View style={styles.circle}>
              <Text style={styles.circlePct}>{member.presenceRate}%</Text>
              <Text style={styles.circleLabel}>Taux de{'\n'}présence</Text>
            </View>
          </View>
          <View style={styles.legend}>
            <Legend color={Colors.light.success} label="Présences" value={member.presents} />
            <Legend color={Colors.light.danger} label="Absences" value={member.absents} />
            <Legend color={Colors.light.warning} label="Retard" value={member.retards} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Évolution</Text>
          <View style={styles.bars}>
            {[
              { m: 'Août', v: 80 },
              { m: 'Sep', v: 90 },
              { m: 'Oct', v: member.presenceRate },
            ].map((b) => (
              <View key={b.m} style={styles.barCol}>
                <Text style={styles.barVal}>{b.v}%</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${b.v}%`, backgroundColor: Colors.light.primary },
                    ]}
                  />
                </View>
                <Text style={styles.barMonth}>{b.m}</Text>
              </View>
            ))}
          </View>
        </View>
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
    marginBottom: 14,
  },
  season: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
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
  legend: { paddingHorizontal: 20 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.light.text, marginBottom: 16 },
  bars: { flexDirection: 'row', justifyContent: 'space-around', height: 140 },
  barCol: { alignItems: 'center', flex: 1 },
  barVal: { fontSize: 12, fontWeight: '600', color: Colors.light.text, marginBottom: 4 },
  barTrack: {
    width: 36,
    flex: 1,
    backgroundColor: Colors.light.progressBg,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 8 },
  barMonth: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 6 },
});
