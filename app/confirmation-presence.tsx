import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { Avatar } from '@/components/volley/Avatar';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ConfirmationPresenceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    memberId?: string;
    name?: string;
    number?: string;
    position?: string;
    time?: string;
    status?: string;
  }>();

  const name = params.name || 'Joueur';
  const parts = name.split(' ');
  const first = parts[0] || 'J';
  const last = parts.slice(1).join(' ') || '';
  const isLate = params.status === 'retard';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={[styles.checkCircle, isLate && { backgroundColor: Colors.light.warning }]}>
          <IconSymbol name="checkmark" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Présence enregistrée</Text>
        <Text style={styles.subtitle}>
          {isLate ? 'Arrivée en retard enregistrée' : 'Votre présence a bien été enregistrée !'}
        </Text>

        <Avatar firstName={first} lastName={last} size={72} />
        <Text style={styles.name}>{name.toUpperCase()}</Text>
        <Text style={styles.pos}>
          #{params.number || '—'} · {params.position || ''}
        </Text>
        <View style={[styles.badge, isLate && { backgroundColor: '#FEF3C7' }]}>
          <IconSymbol
            name="checkmark.circle.fill"
            size={16}
            color={isLate ? Colors.light.warning : Colors.light.success}
          />
          <Text
            style={[
              styles.badgeText,
              isLate && { color: Colors.light.warning },
            ]}
          >
            {isLate ? 'En retard' : 'Présent'}
            {params.time ? ` · ${params.time}` : ''}
          </Text>
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
