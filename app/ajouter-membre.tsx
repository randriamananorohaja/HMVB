import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Radius } from '@/constants/theme';
import { POSITIONS } from '@/lib/types';
import { createMember } from '@/lib/api';
import { Header } from '@/components/volley/Header';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AjouterMembreScreen() {
  const router = useRouter();
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
  const [showPositions, setShowPositions] = useState(false);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        "Autorisez l'accès à la galerie pour choisir une photo d'avatar."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', "Autorisez l'accès à la caméra pour prendre une photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const chooseAvatar = () => {
    Alert.alert('Photo de profil', 'Choisir une source', [
      { text: 'Galerie', onPress: pickImage },
      { text: 'Appareil photo', onPress: takePhoto },
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
      const created = await createMember({
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
        status: 'actif',
      });
      if (!created) {
        Alert.alert('Erreur', "Impossible d'enregistrer le membre");
        return;
      }
      Alert.alert('Succès', 'Membre ajouté avec succès', [
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
      <Header title="Ajouter un membre" showBack />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.photoBox} onPress={chooseAvatar} activeOpacity={0.8}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.photoImg} />
          ) : (
            <>
              <IconSymbol name="camera.fill" size={32} color={Colors.light.textMuted} />
              <Text style={styles.photoText}>Ajouter une photo</Text>
            </>
          )}
        </TouchableOpacity>

        <Field label="Nom *" value={lastName} onChange={setLastName} placeholder="Rakoto" />
        <Field label="Prénom *" value={firstName} onChange={setFirstName} placeholder="Andry" />
        <Field
          label="Numéro de maillot"
          value={number}
          onChange={setNumber}
          placeholder="7"
          keyboard="numeric"
        />

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
                <Text
                  style={[
                    styles.dropdownText,
                    p === position && { color: Colors.light.primary, fontWeight: '600' },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Field
          label="Téléphone"
          value={phone}
          onChange={setPhone}
          placeholder="+261 34 12 34 567"
          keyboard="phone-pad"
        />
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="joueur@email.com"
          keyboard="email-address"
        />
        <Field
          label="Date de naissance"
          value={birthDate}
          onChange={setBirthDate}
          placeholder="JJ/MM/AAAA ou AAAA-MM-JJ"
        />
        <Field
          label="Lieu de naissance"
          value={birthPlace}
          onChange={setBirthPlace}
          placeholder="Antananarivo"
        />
        <Field
          label="Adresse"
          value={address}
          onChange={setAddress}
          placeholder="Lot II M 15 Bis, Ankorondrano"
        />

        <PrimaryButton
          title={saving ? 'Enregistrement…' : 'Ajouter le membre'}
          onPress={handleSave}
          disabled={saving}
          style={{ marginTop: 24 }}
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
        autoCapitalize={keyboard === 'email-address' ? 'none' : 'sentences'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  photoBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  photoImg: { width: 100, height: 100, borderRadius: 50 },
  photoText: { fontSize: 11, color: Colors.light.textMuted, marginTop: 4 },
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
    overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12 },
  dropdownText: { fontSize: 15, color: Colors.light.text },
});
