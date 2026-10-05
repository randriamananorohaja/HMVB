import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { TEAM, MEMBERS } from '@/constants/data';
import { Header } from '@/components/volley/Header';
import { Avatar } from '@/components/volley/Avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

export default function ProfilEquipeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Profil de l'équipe" showBack />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Text style={{ fontSize: 40 }}>🏐</Text>
          </View>
          <Text style={styles.teamName}>{TEAM.name}</Text>
          <PrimaryButton
            title="Modifier l'équipe"
            icon="pencil"
            variant="outline"
            onPress={() => {}}
            style={{ marginTop: 12, paddingVertical: 10 }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informations</Text>
          <Info label="Nom de l'équipe" value={TEAM.name} />
          <Info label="Catégorie" value={TEAM.category} />
          <Info label="Coach" value={TEAM.coach} />
          <Info label="Saison" value={TEAM.season} />
        </View>

        <View style={styles.card}>
          <View style={styles.membersHeader}>
            <Text style={styles.cardTitle}>Membres</Text>
            <Text style={styles.count}>{MEMBERS.length}</Text>
          </View>
          <View style={styles.avatars}>
            {MEMBERS.slice(0, 6).map((m) => (
              <View key={m.id} style={{ marginRight: -8 }}>
                <Avatar firstName={m.firstName} lastName={m.lastName} size={40} />
              </View>
            ))}
            {MEMBERS.length > 6 && (
              <View style={styles.more}>
                <Text style={styles.moreText}>+{MEMBERS.length - 6}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.seeAll}
            onPress={() => router.push('/(tabs)/equipe')}
          >
            <Text style={styles.seeAllText}>Voir tous les membres</Text>
            <IconSymbol name="chevron.right" size={16} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  label: { fontSize: 14, color: Colors.light.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  hero: { alignItems: 'center', marginBottom: 20 },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.header,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  teamName: { fontSize: 22, fontWeight: '700', color: Colors.light.text },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.light.text, marginBottom: 8 },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: { fontSize: 16, fontWeight: '700', color: Colors.light.primary },
  avatars: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  more: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  moreText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { fontSize: 14, fontWeight: '600', color: Colors.light.primary },
});
