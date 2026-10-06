import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Radius } from '@/constants/theme';
import { getMember, updateMember } from '@/lib/api';
import { POSITIONS } from '@/lib/types';
import { Header } from '@/components/volley/Header';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ModifierMembreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [number, setNumber] = useState('');
  const [position, setPosition] = useState(POSITIONS[0]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [status, setStatus] = useState<'actif' | 'desactive'>('actif');
  const [showPositions, setShowPositions] = useState(false);

  useEffect(() => {
    (async () => {
      const m = await getMember(id);
      if (m) {
        setLastName(m.last_name);
        setFirstName(m.first_name);
        setNumber(String(m.number ?? ''));
        setPosition((m.position as any) || POSITIONS[0]);
        setPhone(m.phone || '');
        setEmail(m.email || '');
        setBirthDate(m.birth_date || '');
        setBirthPlace(m.birth_place || '');
        setAddress(m.address || '');
        setAvatar(m.avatar || null);
        setStatus((m.status as any) || 'actif');
      }
      setLoading(false);
    })();
  }, [id]);

  const chooseAvatar = () => {
    Alert.alert('Photo de profil', 'Choisir une source', [
      {
        text: 'Galerie',
        onPress: async () => {
          const { status: s } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (s !== 'granted') {
            Alert.alert('Permission requise', "Autorisez l'accès à la galerie.");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled && result.assets[0]) setAvatar(result.assets[0].uri);
        },
      },
      {
        text: 'Appareil photo',
        onPress: async () => {
          const { status: s } = await ImagePicker.requestCameraPermissionsAsync();
          if (s !== 'granted') {
            Alert.alert('Permission requise', "Autorisez l'accès à la caméra.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled && result.assets[0]) setAvatar(result.assets[0].uri);
        },
      },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!lastName.trim() || !firstName.trim()) {
      Alert.alert('Erreur', 'Nom et prénom sont obligatoires');
      return;
    }
    setSaving(true);
    try {
      await updateMember(id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        number: number ? parseInt(number, 10) : 0,
        position,
        phone: phone.trim(),
        email: email.trim() || null,
        birth_date: birthDate.trim() || null,
        birth_place: birthPlace.trim() || null,
        address: address.trim() || null,
        avatar,
        status,
      });
      Alert.alert('Succès', 'Membre mis à jour', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Erreur', String(e));
    } finally {
      setSaving(false);
    }
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
      <Header title="Modifier un membre" showBack />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.photoBox} onPress={chooseAvatar}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.photoImg} />
          ) : (
            <IconSymbol name="camera.fill" size={28} color={Colors.light.textMuted} />
          )}
        </TouchableOpacity>

        <Field label="Nom *" value={lastName} onChange={setLastName} />
        <Field label="Prénom *" value={firstName} onChange={setFirstName} />
        <Field label="Numéro de maillot" value={number} onChange={setNumber} keyboard="numeric" />

        <Text style={styles.label}>Position</Text>
        <TouchableOpacity style={styles.select} onPress={() => setShowPositions(!showPositions)}>
          <Text style={styles.selectText}>{position}</Text>
          <IconSymbol name="chevron.right" size={18} color={Colors.light.textMuted} />
        </TouchableOpacity>
        {showPositions && (
          <View style={styles.dropdown}>
            {POSITIONS.map((p) => (
              <TouchableOpacity
                key={p}
                style={styles.dropdownItem}
                onPress={() => {
                  setPosition(p);
                  setShowPositions(false);
                }}
              >
                <Text style={styles.dropdownText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Field label="Téléphone" value={phone} onChange={setPhone} keyboard="phone-pad" />
        <Field label="Email" value={email} onChange={setEmail} keyboard="email-address" />
        <Field label="Date de naissance" value={birthDate} onChange={setBirthDate} placeholder="AAAA-MM-JJ" />
        <Field label="Lieu de naissance" value={birthPlace} onChange={setBirthPlace} />
        <Field label="Adresse" value={address} onChange={setAddress} />

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

        <PrimaryButton
          title={saving ? 'Enregistrement…' : 'Enregistrer'}
          onPress={handleSave}
          disabled={saving}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboard,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboard?: any;
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
        keyboardType={keyboard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  photoBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  photoImg: { width: 90, height: 90 },
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
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  selectText: { fontSize: 15, color: Colors.light.text },
  dropdown: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: -12,
    marginBottom: 16,
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12 },
  dropdownText: { fontSize: 15, color: Colors.light.text },
  statusRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
});
