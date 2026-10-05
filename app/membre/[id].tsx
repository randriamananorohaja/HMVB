import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { MEMBERS } from '@/constants/data';
import { Header } from '@/components/volley/Header';
import { Avatar } from '@/components/volley/Avatar';
import { StatusBadge } from '@/components/volley/StatusBadge';
import { ProgressBar } from '@/components/volley/ProgressBar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

export default function MembreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const member = MEMBERS.find((m) => m.id === id);

  if (!member) {
    return (
      <View style={styles.container}>
        <Header title="Membre" showBack />
        <Text style={{ padding: 20 }}>Membre introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title=""
        showBack
        rightIcon="ellipsis"
        onRightPress={() =>
          Alert.alert('Actions', undefined, [
            { text: 'Modifier', onPress: () => router.push(`/modifier-membre/${member.id}`) },
            { text: 'QR personnel', onPress: () => {} },
            { text: 'Désactiver', style: 'destructive' },
            { text: 'Supprimer', style: 'destructive' },
            { text: 'Annuler', style: 'cancel' },
          ])
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <Avatar firstName={member.firstName} lastName={member.lastName} size={90} />
          <Text style={styles.name}>
            {member.firstName.toUpperCase()} {member.lastName.toUpperCase()}
          </Text>
          <Text style={styles.number}>#{member.number}</Text>
          <Text style={styles.position}>{member.position}</Text>
          <View style={{ marginTop: 8 }}>
            <StatusBadge status={member.status} size="md" />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <View style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Informations</Text>
          </View>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.push(`/stats-joueur/${member.id}`)}
          >
            <Text style={styles.tabText}>Statistiques</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.card}>
          <InfoRow icon="phone.fill" label="Téléphone" value={member.phone} />
          {member.email && (
            <InfoRow icon="envelope.fill" label="Email" value={member.email} />
          )}
          {member.birthDate && (
            <InfoRow icon="calendar" label="Date de naissance" value={member.birthDate} />
          )}
        </View>

        {/* Stats présence */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Statistiques présence</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: Colors.light.success }]}>
                {member.presents}
              </Text>
              <Text style={styles.statLabel}>Présences</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: Colors.light.danger }]}>
                {member.absents}
              </Text>
              <Text style={styles.statLabel}>Absences</Text>
            </View>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Taux de présence</Text>
            <Text style={styles.rateVal}>{member.presenceRate}%</Text>
          </View>
          <ProgressBar progress={member.presenceRate} height={10} />
        </View>

        {/* QR personnel */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>QR personnel</Text>
          <View style={styles.qrPlaceholder}>
            <IconSymbol name="qrcode" size={80} color={Colors.light.textMuted} />
            <Text style={styles.qrHint}>Scannez pour enregistrer la présence</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Modifier"
            icon="pencil"
            onPress={() => router.push(`/modifier-membre/${member.id}`)}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            title="Désactiver"
            variant="outline"
            onPress={() => {}}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <View style={infoStyles.icon}>
        <IconSymbol name={icon} size={18} color={Colors.light.primary} />
      </View>
      <View>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 12, color: Colors.light.textSecondary },
  value: { fontSize: 15, fontWeight: '500', color: Colors.light.text, marginTop: 1 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  profileHeader: {
    backgroundColor: Colors.light.header,
    alignItems: 'center',
    paddingBottom: 24,
    marginTop: -1,
  },
  name: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 14 },
  number: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 4 },
  position: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 2 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: Radius.md,
    padding: 3,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.sm },
  tabActive: { backgroundColor: Colors.light.primary },
  tabText: { fontSize: 14, fontWeight: '500', color: Colors.light.textSecondary },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  card: {
    backgroundColor: Colors.light.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: Radius.lg,
    padding: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.light.text, marginBottom: 14 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '700' },
  statLabel: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 2 },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rateLabel: { fontSize: 14, color: Colors.light.text },
  rateVal: { fontSize: 14, fontWeight: '700', color: Colors.light.success },
  qrPlaceholder: { alignItems: 'center', paddingVertical: 20, gap: 10 },
  qrHint: { fontSize: 13, color: Colors.light.textMuted },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 20,
  },
});
