import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { Avatar } from '@/components/volley/Avatar';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ConfirmationPresenceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.checkCircle}>
          <IconSymbol name="checkmark" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Présence enregistrée</Text>
        <Text style={styles.subtitle}>Votre présence a bien été enregistrée !</Text>

        <Avatar firstName="Andry" lastName="Rakoto" size={72} />
        <Text style={styles.name}>ANDRY RAKOTO</Text>
        <Text style={styles.pos}>#7 · Réceptionneur-attaquant</Text>
        <View style={styles.badge}>
          <IconSymbol name="checkmark.circle.fill" size={16} color={Colors.light.success} />
          <Text style={styles.badgeText}>Présent · 18:07</Text>
        </View>

        <PrimaryButton
          title="OK"
          onPress={() => router.back()}
          style={{ marginTop: 28, width: '100%' }}
        />
        <PrimaryButton
          title="Retour au scanner"
          variant="outline"
          onPress={() => router.replace('/scanner')}
          style={{ marginTop: 10, width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(10,37,64,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    padding: 28,
    alignItems: 'center',
    width: '100%',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.light.text },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 6,
    marginBottom: 20,
    textAlign: 'center',
  },
  name: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginTop: 12 },
  pos: { fontSize: 13, color: Colors.light.textSecondary, marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  badgeText: { fontSize: 13, fontWeight: '600', color: Colors.light.success },
});
