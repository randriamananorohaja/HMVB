import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { getMember, deleteMember, updateMember, getMemberPresenceStats } from '@/lib/api';
import type { Member } from '@/lib/types';
import { Header } from '@/components/volley/Header';
import { Avatar } from '@/components/volley/Avatar';
import { StatusBadge } from '@/components/volley/StatusBadge';
import { ProgressBar } from '@/components/volley/ProgressBar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

export default function MembreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [stats, setStats] = useState({ presents: 0, retards: 0, absents: 0, rate: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const data = await getMember(id);
    setMember(data);
    if (data) {
      const s = await getMemberPresenceStats(data.id);
      setStats(s);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [id])
  );

  const handleDelete = () => {
    Alert.alert('Supprimer', 'Supprimer définitivement ce membre ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteMember(id);
          router.back();
        },
      },
    ]);
  };

  const handleToggleStatus = async () => {
    if (!member) return;
    const next = member.status === 'actif' ? 'desactive' : 'actif';
    await updateMember(member.id, { status: next });
    load();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.container}>
        <Header title="Membre" showBack />
        <Text style={{ padding: 20, color: Colors.light.textSecondary }}>
          Aucune donnée enregistrée
        </Text>
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
            {
              text: member.status === 'actif' ? 'Désactiver' : 'Réactiver',
              onPress: handleToggleStatus,
            },
            { text: 'Supprimer', style: 'destructive', onPress: handleDelete },
            { text: 'Annuler', style: 'cancel' },
          ])
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.profileHeader}>
          <Avatar
            firstName={member.first_name}
            lastName={member.last_name}
            size={90}
            uri={member.avatar}
          />
          <Text style={styles.name}>
            {member.first_name.toUpperCase()} {member.last_name.toUpperCase()}
          </Text>
          <Text style={styles.number}>#{member.number}</Text>
          <Text style={styles.position}>{member.position}</Text>
          <View style={{ marginTop: 8 }}>
            <StatusBadge status={member.status as any} size="md" />
          </View>
        </View>

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

        <View style={styles.card}>
          {member.phone ? <InfoRow icon="phone.fill" label="Téléphone" value={member.phone} /> : null}
          {member.email ? <InfoRow icon="envelope.fill" label="Email" value={member.email} /> : null}
          {member.birth_date ? (
            <InfoRow icon="calendar" label="Date de naissance" value={member.birth_date} />
          ) : null}
          {member.birth_place ? (
            <InfoRow icon="mappin" label="Lieu de naissance" value={member.birth_place} />
          ) : null}
          {member.address ? (
            <InfoRow icon="mappin" label="Adresse" value={member.address} />
          ) : null}
          {!member.phone && !member.email && !member.birth_date && !member.birth_place && !member.address && (
            <Text style={{ color: Colors.light.textMuted, fontSize: 14 }}>
              Aucune information complémentaire
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Statistiques présence</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: Colors.light.success }]}>{stats.presents}</Text>
              <Text style={styles.statLabel}>Présences</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: Colors.light.danger }]}>{stats.absents}</Text>
              <Text style={styles.statLabel}>Absences</Text>
            </View>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Taux de présence</Text>
            <Text style={styles.rateVal}>{stats.rate}%</Text>
          </View>
          <ProgressBar progress={stats.rate} height={10} />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Modifier"
            icon="pencil"
            onPress={() => router.push(`/modifier-membre/${member.id}`)}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            title={member.status === 'actif' ? 'Désactiver' : 'Réactiver'}
            variant="outline"
            onPress={handleToggleStatus}
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
      <View style={{ flex: 1 }}>
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
  center: { alignItems: 'center', justifyContent: 'center' },
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
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rateLabel: { fontSize: 14, color: Colors.light.text },
  rateVal: { fontSize: 14, fontWeight: '700', color: Colors.light.success },
  actions: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginTop: 20 },
});
