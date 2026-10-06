import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { createTraining, addNotification } from '@/lib/api';
import { Header } from '@/components/volley/Header';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { DateField, TimeField } from '@/components/volley/DateTimeFields';

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
    if (!date || !start || !end) {
      Alert.alert('Erreur', 'Date et heures obligatoires');
      return;
    }
    setSaving(true);
    try {
      const created = await createTraining({
        date,
        start_time: start,
        end_time: end,
        location: location.trim(),
        notes: notes.trim() || null,
      });
      if (!created) {
        Alert.alert('Erreur', "Impossible de créer l'entraînement");
        return;
      }
      await addNotification(
        'Nouvel entraînement',
        `${date} · ${start} – ${end}${location ? ' · ' + location : ''}`,
        'calendar',
        Colors.light.primary
      );
      Alert.alert('Succès', 'Entraînement créé', [{ text: 'OK', onPress: () => router.back() }]);
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
        <DateField label="Date *" value={date} onChange={setDate} />
        <TimeField label="Heure de début *" value={start} onChange={setStart} />
        <TimeField label="Heure de fin *" value={end} onChange={setEnd} />
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Lieu *</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Gymnase..."
            placeholderTextColor={Colors.light.textMuted}
          />
        </View>
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
        />
        {saving && <ActivityIndicator style={{ marginTop: 12 }} color={Colors.light.primary} />}
      </ScrollView>
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
