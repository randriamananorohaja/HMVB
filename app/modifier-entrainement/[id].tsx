import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { getTraining, updateTraining, deleteTraining } from '@/lib/api';
import { Header } from '@/components/volley/Header';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { DateField, TimeField } from '@/components/volley/DateTimeFields';

export default function ModifierEntrainementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    (async () => {
      const t = await getTraining(id);
      if (t) {
        setDate(t.date);
        setStart(t.start_time);
        setEnd(t.end_time);
        setLocation(t.location || '');
        setNotes(t.notes || '');
      }
      setLoading(false);
    })();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTraining(id, {
        date,
        start_time: start,
        end_time: end,
        location: location.trim(),
        notes: notes.trim() || null,
      });
      Alert.alert('Succès', 'Entraînement mis à jour', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) {
      Alert.alert('Erreur', String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Supprimer', 'Supprimer définitivement cet entraînement ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteTraining(id);
          router.replace('/(tabs)/entrainements');
        },
      },
    ]);
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
      <Header title="Modifier l'entraînement" showBack />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <DateField label="Date *" value={date} onChange={setDate} />
        <TimeField label="Heure de début *" value={start} onChange={setStart} />
        <TimeField label="Heure de fin *" value={end} onChange={setEnd} />
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Lieu</Text>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>
        <PrimaryButton title={saving ? 'Enregistrement…' : 'Enregistrer'} onPress={handleSave} disabled={saving} />
        <PrimaryButton title="Supprimer l'entraînement" variant="danger" onPress={handleDelete} style={{ marginTop: 12 }} />
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
