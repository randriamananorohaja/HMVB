import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { getTraining, getTrainingsWithStats, formatDateFr } from '@/lib/api';
import type { Training } from '@/lib/types';
import { Header } from '@/components/volley/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

/**
 * Session de pointage : le coach scanne les QR des joueurs (pas un QR collectif).
 */
export default function QrCoachScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [training, setTraining] = useState<Training | null>(null);
  const [stats, setStats] = useState({ presents: 0, retards: 0, absents: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    const [t, list] = await Promise.all([getTraining(id), getTrainingsWithStats()]);
    setTraining(t);
    const s = list.find((x) => x.id === id);
    if (s) setStats({ presents: s.presents, retards: s.retards, absents: s.absents });
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [id])
  );

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!training) {
    return (
      <View style={styles.container}>
        <Header title="Pointage" showBack />
        <Text style={{ padding: 20, color: Colors.light.textSecondary }}>
          Aucune donnée enregistrée
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Pointage présence" showBack />

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Entraînement</Text>
          <Text style={styles.date}>
            {formatDateFr(training.date)} · {training.start_time} – {training.end_time}
          </Text>
          <View style={styles.locRow}>
            <IconSymbol name="mappin" size={14} color={Colors.light.textSecondary} />
            <Text style={styles.loc}>{training.location || '—'}</Text>
          </View>
        </View>

        <View style={styles.helpCard}>
          <IconSymbol name="qrcode" size={40} color={Colors.light.primary} />
          <Text style={styles.helpTitle}>Comment pointer ?</Text>
          <Text style={styles.helpText}>
            Chaque joueur affiche le QR de sa fiche membre. Vous scannez ce QR avec la caméra pour
            enregistrer sa présence.
          </Text>
        </View>

        <PrimaryButton
          title="Scanner les QR des joueurs"
          icon="camera.fill"
          onPress={() => router.push(`/scanner?trainingId=${training.id}`)}
          style={{ marginBottom: 12 }}
        />
        <PrimaryButton
          title="Liste de présence (manuel)"
          icon="list.bullet"
          variant="outline"
          onPress={() => router.push(`/presence-list?id=${training.id}`)}
          style={{ marginBottom: 20 }}
        />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <View style={[styles.statDot, { backgroundColor: Colors.light.success }]} />
            <Text style={styles.statNum}>{stats.presents}</Text>
            <Text style={styles.statLabel}>Présents</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.statDot, { backgroundColor: Colors.light.warning }]} />
            <Text style={styles.statNum}>{stats.retards}</Text>
            <Text style={styles.statLabel}>En retard</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.statDot, { backgroundColor: Colors.light.danger }]} />
            <Text style={styles.statNum}>{stats.absents}</Text>
            <Text style={styles.statLabel}>Absents</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { flex: 1, padding: 20 },
  infoCard: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  label: { fontSize: 12, color: Colors.light.textSecondary, marginBottom: 4 },
  date: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  loc: { fontSize: 13, color: Colors.light.textSecondary },
  helpCard: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  helpTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginTop: 4 },
  helpText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
  },
  stat: { alignItems: 'center', gap: 4 },
  statDot: { width: 10, height: 10, borderRadius: 5 },
  statNum: { fontSize: 22, fontWeight: '700', color: Colors.light.text },
  statLabel: { fontSize: 12, color: Colors.light.textSecondary },
});
