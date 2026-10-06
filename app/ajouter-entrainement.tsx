import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { createTraining, addNotification } from '@/lib/api';
import { Header } from '@/components/volley/Header';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

function toIsoDate(input: string): string | null {
  // Accept YYYY-MM-DD or DD/MM/YYYY
  const s = input.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  return null;
}

export default function AjouterEntrainementScreen() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [start, setStart] = useState('18:00');
  const [end, setEnd] = useState('20:00');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const iso = toIsoDate(date);
    if (!iso) {
      Alert.alert('Erreur', 'Date invalide (utilisez AAAA-MM-JJ ou JJ/MM/AAAA)');
      return;
    }
    if (!start || !end) {
      Alert.alert('Erreur', 'Heures de début et fin obligatoires');
      return;
    }
    setSaving(true);
    try {
      const created = await createTraining({
        date: iso,
        start_time: start.trim(),
        end_time: end.trim(),
        location: location.trim(),
        notes: notes.trim() || null,
      });
      if (!created) {
        Alert.alert('Erreur', "Impossible de créer l'entraînement");
        return;
      }
      await addNotification(
        'Nouvel entraînement',
        `${iso} · ${start} – ${end}${location ? ' · ' + location : ''}`,
        'calendar',
        Colors.light.primary
      );
      Alert.alert('Succès', 'Entraînement créé', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Erreur', String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Ajouter un entraînement" showBack />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Field label="Date *" value={date} onChange={setDate} placeholder="AAAA-MM-JJ" />
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
        <PrimaryButton
          title={saving ? 'Création…' : "Créer l'entraînement"}
          onPress={handleSave}
          disabled={saving}
          style={{ marginTop: 8 }}
        />
        {saving && <ActivityIndicator style={{ marginTop: 12 }} color={Colors.light.primary} />}
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
