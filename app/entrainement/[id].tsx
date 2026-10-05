import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { TRAININGS, formatDateFr } from '@/constants/data';
import { Header } from '@/components/volley/Header';
import { ProgressBar } from '@/components/volley/ProgressBar';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EntrainementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const training = TRAININGS.find((t) => t.id === id) ?? TRAININGS[0];
  const rate = Math.round((training.presents / training.totalMembers) * 100);

  return (
    <View style={styles.container}>
      <Header title="Détail de l'entraînement" showBack rightIcon="pencil" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.card}>
          <View style={styles.row}>
            <IconSymbol name="calendar" size={18} color={Colors.light.primary} />
            <Text style={styles.date}>{formatDateFr(training.date)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <IconSymbol name="clock" size={18} color={Colors.light.textSecondary} />
            <Text style={styles.meta}>
              {training.startTime} – {training.endTime}
            </Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <IconSymbol name="mappin" size={18} color={Colors.light.textSecondary} />
            <Text style={styles.meta}>{training.location}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Présence</Text>
          <View style={styles.presenceRow}>
            <Text style={styles.presenceCount}>
              {training.presents} / {training.totalMembers}
            </Text>
            <Text style={styles.presencePct}>{rate}%</Text>
          </View>
          <ProgressBar progress={rate} height={10} />
          <PrimaryButton
            title="QR Présence"
            icon="qrcode"
            onPress={() => router.push(`/qr-coach?id=${training.id}`)}
            style={{ marginTop: 16 }}
          />
        </View>

        {training.notes ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes</Text>
            <Text style={styles.notes}>{training.notes}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Événements</Text>
          <View style={styles.eventRow}>
            <IconSymbol name="clock" size={16} color={Colors.light.success} />
            <Text style={styles.eventText}>{training.startTime} Début de l'entraînement</Text>
          </View>
          <View style={styles.eventRow}>
            <IconSymbol name="clock" size={16} color={Colors.light.danger} />
            <Text style={styles.eventText}>{training.endTime} Fin de l'entraînement</Text>
          </View>
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
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  eventText: { fontSize: 14, color: Colors.light.text },
});
