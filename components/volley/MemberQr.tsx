import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

/**
 * QR personnel du joueur — sans react-native-svg / qrcode-svg
 * (évite l'erreur Node "buffer" sur le runtime natif).
 *
 * Affiche une image QR via API publique + le code texte en secours.
 */
type Props = {
  memberId: string;
  size?: number;
};

export function MemberQr({ memberId, size = 180 }: Props) {
  const payload = `member:${memberId}`;
  const uri = `https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&margin=8&data=${encodeURIComponent(payload)}`;

  return (
    <View style={styles.wrap}>
      <Image
        source={{ uri }}
        style={{ width: size, height: size, backgroundColor: '#fff' }}
        resizeMode="contain"
        accessibilityLabel={`QR code ${payload}`}
      />
      <Text style={styles.code} selectable>
        {payload}
      </Text>
      <Text style={styles.hint}>Scannable par le coach · code aussi lisible hors ligne</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 8 },
  code: {
    marginTop: 12,
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: 'monospace',
  },
  hint: {
    marginTop: 4,
    fontSize: 11,
    color: Colors.light.textMuted,
    textAlign: 'center',
  },
});
