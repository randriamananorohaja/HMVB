import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { TRAININGS, formatDateFr } from '@/constants/data';
import { Header } from '@/components/volley/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

export default function QrCoachScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const training = TRAININGS.find((t) => t.id === id) ?? TRAININGS[0];

  return (
    <View style={styles.container}>
      <Header title="QR de l'entraînement" showBack />

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Entraînement</Text>
          <Text style={styles.date}>
            {formatDateFr(training.date)} · {training.startTime} – {training.endTime}
          </Text>
          <View style={styles.locRow}>
            <IconSymbol name="mappin" size={14} color={Colors.light.textSecondary} />
            <Text style={styles.loc}>{training.location}</Text>
          </View>
        </View>

        <View style={styles.qrCard}>
          <View style={styles.qrBox}>
            {/* Simulated QR */}
            <View style={styles.qrInner}>
              {Array.from({ length: 11 }).map((_, row) => (
                <View key={row} style={styles.qrRow}>
                  {Array.from({ length: 11 }).map((_, col) => {
                    const filled =
                      (row < 3 && col < 3) ||
                      (row < 3 && col > 7) ||
                      (row > 7 && col < 3) ||
                      ((row + col) % 3 === 0 && row > 2 && row < 8 && col > 2 && col < 8);
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
          <Text style={styles.scanHint}>
            Scannez ce QR pour enregistrer votre présence
          </Text>
        </View>

        <PrimaryButton
          title="Partager / Afficher en plein écran"
          icon="share"
          onPress={() => {}}
          style={{ marginBottom: 20 }}
        />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <View style={[styles.statDot, { backgroundColor: Colors.light.success }]} />
            <Text style={styles.statNum}>{training.presents}</Text>
            <Text style={styles.statLabel}>Présents</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.statDot, { backgroundColor: Colors.light.warning }]} />
            <Text style={styles.statNum}>{training.retards}</Text>
            <Text style={styles.statLabel}>En retard</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.statDot, { backgroundColor: Colors.light.danger }]} />
            <Text style={styles.statNum}>{training.absents}</Text>
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
