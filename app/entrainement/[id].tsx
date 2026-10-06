import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import {
  getTraining,
  getTrainingsWithStats,
  formatDateFr,
  deleteTraining,
} from '@/lib/api';
import type { Training } from '@/lib/types';
import { Header } from '@/components/volley/Header';
import { ProgressBar } from '@/components/volley/ProgressBar';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EntrainementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [training, setTraining] = useState<Training | null>(null);
  const [stats, setStats] = useState({ presents: 0, total: 0, rate: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [t, list] = await Promise.all([getTraining(id), getTrainingsWithStats()]);
    setTraining(t);
    const s = list.find((x) => x.id === id);
    if (s) {
      setStats({
        presents: s.presents,
        total: s.total_members,
        rate: s.total_members ? Math.round((s.presents / s.total_members) * 100) : 0,
      });
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [id])
  );

  const handleDelete = () => {
    Alert.alert(
      'Supprimer l\'entraînement',
      'Cette action est définitive. Les présences liées seront aussi supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const ok = await deleteTraining(id);
            if (ok) {
              Alert.alert('Supprimé', 'L\'entraînement a été supprimé.');
              router.replace('/(tabs)/entrainements');
            } else {
              Alert.alert('Erreur', 'Impossible de supprimer.');
            }
          },
        },
      ]
    );
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
        <Header title="Détail" showBack />
        <Text style={{ padding: 20, color: Colors.light.textSecondary }}>
          Aucune donnée enregistrée
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Détail de l'entraînement"
        showBack
        rightIcon="pencil"
        onRightPress={() => router.push(`/modifier-entrainement/${id}`)}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.card}>
          <View style={styles.row}>
            <IconSymbol name="calendar" size={18} color={Colors.light.primary} />
            <Text style={styles.date}>{formatDateFr(training.date)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <IconSymbol name="clock" size={18} color={Colors.light.textSecondary} />
            <Text style={styles.meta}>
              {training.start_time} – {training.end_time}
            </Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <IconSymbol name="mappin" size={18} color={Colors.light.textSecondary} />
            <Text style={styles.meta}>{training.location || '—'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Présence</Text>
          <View style={styles.presenceRow}>
            <Text style={styles.presenceCount}>
              {stats.presents} / {stats.total}
            </Text>
            <Text style={styles.presencePct}>{stats.rate}%</Text>
          </View>
          <ProgressBar progress={stats.rate} height={10} />
          <PrimaryButton
            title="QR Présence / Scanner"
            icon="qrcode"
            onPress={() => router.push(`/qr-coach?id=${training.id}`)}
            style={{ marginTop: 16 }}
          />
          <PrimaryButton
            title="Liste de présence"
            icon="list.bullet"
            variant="outline"
            onPress={() => router.push(`/presence-list?id=${training.id}`)}
            style={{ marginTop: 10 }}
          />
        </View>

        {training.notes ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes</Text>
            <Text style={styles.notes}>{training.notes}</Text>
          </View>
        ) : null}

        {/* Boutons UPDATE / DELETE bien visibles */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Actions</Text>
          <PrimaryButton
            title="Modifier l'entraînement"
            icon="pencil"
            onPress={() => router.push(`/modifier-entrainement/${training.id}`)}
          />
          <PrimaryButton
            title="Supprimer l'entraînement"
            icon="trash"
            variant="danger"
            onPress={handleDelete}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 14,
  },
  actionsCard: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 14,
    marginTop: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  date: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  meta: { fontSize: 14, color: Colors.light.textSecondary },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginBottom: 12 },
  presenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  presenceCount: { fontSize: 18, fontWeight: '700', color: Colors.light.text },
  presencePct: { fontSize: 16, fontWeight: '700', color: Colors.light.success },
  notes: { fontSize: 14, color: Colors.light.textSecondary, lineHeight: 20 },
});
