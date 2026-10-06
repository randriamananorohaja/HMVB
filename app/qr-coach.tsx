import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { getTraining, getTrainingsWithStats, formatDateFr } from '@/lib/api';
import type { Training } from '@/lib/types';
import { Header } from '@/components/volley/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

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

  const qrPayload = training ? `training:${training.id}` : '';

  const shareQr = async () => {
    if (!qrPayload) return;
    await Share.share({
      message: `QR VolleyTeam — scannnez pour l'entraînement\n${qrPayload}`,
    });
  };

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
        <Header title="QR de l'entraînement" showBack />
        <Text style={{ padding: 20, color: Colors.light.textSecondary }}>
          Aucune donnée enregistrée
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="QR de l'entraînement" showBack />

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

        <View style={styles.qrCard}>
          <View style={styles.qrBox}>
            {/* Pattern visual representing QR — payload is training:id */}
            <View style={styles.qrInner}>
              {Array.from({ length: 11 }).map((_, row) => (
                <View key={row} style={styles.qrRow}>
                  {Array.from({ length: 11 }).map((_, col) => {
                    const seed = (training.id.charCodeAt(row % training.id.length) + col * 3 + row) % 5;
                    const filled =
                      (row < 3 && col < 3) ||
                      (row < 3 && col > 7) ||
                      (row > 7 && col < 3) ||
                      seed === 0;
                    return (
                      <View
                        key={col}
                        style={[styles.qrCell, filled && styles.qrCellFilled]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.scanHint}>Scannez ce QR pour enregistrer votre présence</Text>
          <Text style={styles.payload} numberOfLines={1}>
            {qrPayload}
          </Text>
        </View>

        <PrimaryButton
          title="Partager / Afficher"
          icon="share"
          onPress={shareQr}
          style={{ marginBottom: 12 }}
        />
        <PrimaryButton
          title="Ouvrir le scanner"
          icon="camera.fill"
          variant="outline"
          onPress={() => router.push(`/scanner?trainingId=${training.id}`)}
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

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push(`/presence-list?id=${training.id}`)}
        >
          <Text style={styles.linkText}>Voir la liste complète</Text>
          <IconSymbol name="chevron.right" size={18} color={Colors.light.primary} />
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  label: { fontSize: 12, color: Colors.light.textSecondary, marginBottom: 4 },
  date: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  loc: { fontSize: 13, color: Colors.light.textSecondary },
  qrCard: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  qrBox: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  qrInner: { gap: 3 },
  qrRow: { flexDirection: 'row', gap: 3 },
  qrCell: { width: 12, height: 12, backgroundColor: '#E5E7EB', borderRadius: 1 },
  qrCellFilled: { backgroundColor: '#0A2540' },
  scanHint: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  payload: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  stat: { alignItems: 'center', gap: 4 },
  statDot: { width: 10, height: 10, borderRadius: 5 },
  statNum: { fontSize: 22, fontWeight: '700', color: Colors.light.text },
  statLabel: { fontSize: 12, color: Colors.light.textSecondary },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  linkText: { fontSize: 14, fontWeight: '600', color: Colors.light.primary },
});
