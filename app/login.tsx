import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '@/constants/theme';
import { login } from '@/lib/auth';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le numéro et le mot de passe');
      return;
    }
    setLoading(true);
    try {
      const ok = await login(phone, password);
      if (ok) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Accès refusé', 'Numéro ou mot de passe incorrect');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={{ fontSize: 48 }}>🏐</Text>
        </View>
        <Text style={styles.title}>VolleyTeam</Text>
        <Text style={styles.subtitle}>Espace Coach</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Numéro de téléphone</Text>
        <View style={styles.inputRow}>
          <IconSymbol name="phone.fill" size={20} color={Colors.light.textMuted} />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="0347180709"
            placeholderTextColor={Colors.light.textMuted}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Mot de passe</Text>
        <View style={styles.inputRow}>
          <IconSymbol name="gearshape.fill" size={20} color={Colors.light.textMuted} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={Colors.light.textMuted}
            secureTextEntry={!showPwd}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPwd(!showPwd)} hitSlop={10}>
            <Text style={styles.showPwd}>{showPwd ? 'Masquer' : 'Voir'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Se connecter</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.header },
  hero: { alignItems: 'center', paddingTop: 48, paddingBottom: 32 },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  form: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: { flex: 1, fontSize: 16, color: Colors.light.text },
  showPwd: { fontSize: 13, color: Colors.light.primary, fontWeight: '600' },
  btn: {
    marginTop: 28,
    backgroundColor: Colors.light.primary,
    borderRadius: Radius.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
