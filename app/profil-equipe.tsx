import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { getTeam, getMembers, updateTeam } from '@/lib/api';
import type { Team, Member } from '@/lib/types';
import { Header } from '@/components/volley/Header';
import { Avatar } from '@/components/volley/Avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { EmptyState } from '@/components/volley/EmptyState';

export default function ProfilEquipeScreen() {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [coach, setCoach] = useState('');
  const [season, setSeason] = useState('');

  const load = async () => {
    const [t, m] = await Promise.all([getTeam(), getMembers()]);
    setTeam(t);
    setMembers(m);
    if (t) {
      setName(t.name);
      setCategory(t.category);
      setCoach(t.coach);
      setSeason(t.season);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const save = async () => {
    if (!team) return;
    await updateTeam(team.id, { name, category, coach, season });
    setEditing(false);
    load();
    Alert.alert('Succès', 'Équipe mise à jour');
  };

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Profil de l'équipe" showBack />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Text style={{ fontSize: 40 }}>🏐</Text>
          </View>
          <Text style={styles.teamName}>{team?.name ?? 'Volley Team'}</Text>
          <PrimaryButton
            title={editing ? 'Enregistrer' : "Modifier l'équipe"}
            icon="pencil"
            variant={editing ? 'primary' : 'outline'}
            onPress={() => (editing ? save() : setEditing(true))}
            style={{ marginTop: 12, paddingVertical: 10 }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informations</Text>
          {editing ? (
            <>
              <Field label="Nom de l'équipe" value={name} onChange={setName} />
              <Field label="Catégorie" value={category} onChange={setCategory} />
              <Field label="Coach" value={coach} onChange={setCoach} />
              <Field label="Saison" value={season} onChange={setSeason} />
            </>
          ) : (
            <>
              <Info label="Nom de l'équipe" value={team?.name || '—'} />
              <Info label="Catégorie" value={team?.category || '—'} />
              <Info label="Coach" value={team?.coach || '—'} />
              <Info label="Saison" value={team?.season || '—'} />
            </>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.membersHeader}>
            <Text style={styles.cardTitle}>Membres</Text>
            <Text style={styles.count}>{members.length}</Text>
          </View>
          {members.length === 0 ? (
            <EmptyState message="Aucune donnée enregistrée" icon="person.2.fill" />
          ) : (
            <>
              <View style={styles.avatars}>
                {members.slice(0, 6).map((m) => (
                  <View key={m.id} style={{ marginRight: -8 }}>
                    <Avatar
                      firstName={m.first_name}
                      lastName={m.last_name}
                      size={40}
                      uri={m.avatar}
                    />
                  </View>
                ))}
                {members.length > 6 && (
                  <View style={styles.more}>
                    <Text style={styles.moreText}>+{members.length - 6}</Text>
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
            </>
          )}
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

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 12, color: Colors.light.textSecondary, marginBottom: 4 }}>
        {label}
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: Colors.light.border,
          borderRadius: 8,
          padding: 10,
          fontSize: 15,
          color: Colors.light.text,
        }}
        value={value}
        onChangeText={onChange}
      />
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
