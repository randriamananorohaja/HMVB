import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { Header } from '@/components/volley/Header';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

export default function AjouterEntrainementScreen() {
  const router = useRouter();
  const [date, setDate] = useState('02/10/2026');
  const [start, setStart] = useState('18:00');
  const [end, setEnd] = useState('20:00');
  const [location, setLocation] = useState('Gymnase Ankorondrano');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    Alert.alert('Succès', 'Entraînement créé', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Ajouter un entraînement" showBack />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Field label="Date *" value={date} onChange={setDate} placeholder="JJ/MM/AAAA" />
        <Field label="Heure de début *" value={start} onChange={setStart} placeholder="18:00" />
        <Field label="Heure de fin *" value={end} onChange={setEnd} placeholder="20:00" />
        <Field label="Lieu *" value={location} onChange={setLocation} placeholder="Gymnase..." />
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Notes (optionnel)</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Travail technique + jeu collectif"
            placeholderTextColor={Colors.light.textMuted}
            multiline
          />
        </View>
        <PrimaryButton title="Créer l'entraînement" onPress={handleSave} style={{ marginTop: 8 }} />
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
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
});
