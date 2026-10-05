import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { MEMBERS, POSITIONS } from '@/constants/data';
import { Header } from '@/components/volley/Header';
import { Avatar } from '@/components/volley/Avatar';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

export default function ModifierMembreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const member = MEMBERS.find((m) => m.id === id) ?? MEMBERS[0];

  const [lastName, setLastName] = useState(member.lastName);
  const [firstName, setFirstName] = useState(member.firstName);
  const [number, setNumber] = useState(String(member.number));
  const [phone, setPhone] = useState(member.phone);
  const [status, setStatus] = useState(member.status);

  const handleSave = () => {
    Alert.alert('Succès', 'Membre mis à jour', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Modifier un membre" showBack />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Avatar firstName={firstName} lastName={lastName} size={80} />
        </View>

        <Field label="Nom *" value={lastName} onChange={setLastName} />
        <Field label="Prénom *" value={firstName} onChange={setFirstName} />
        <Field label="Numéro de maillot" value={number} onChange={setNumber} />
        <Field label="Position" value={member.position} onChange={() => {}} />
        <Field label="Téléphone" value={phone} onChange={setPhone} />

        <Text style={styles.label}>Statut *</Text>
        <View style={styles.statusRow}>
          <PrimaryButton
            title="Actif"
            variant={status === 'actif' ? 'success' : 'outline'}
            onPress={() => setStatus('actif')}
            style={{ flex: 1, paddingVertical: 10 }}
          />
          <PrimaryButton
            title="Désactivé"
            variant={status === 'desactive' ? 'danger' : 'outline'}
            onPress={() => setStatus('desactive')}
            style={{ flex: 1, paddingVertical: 10 }}
          />
        </View>

        <PrimaryButton title="Enregistrer" onPress={handleSave} style={{ marginTop: 24 }} />
      </ScrollView>
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
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={Colors.light.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.light.text,
  },
  statusRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
});
