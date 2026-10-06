import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

/**
 * QR personnel permanent du joueur.
 * Utilise le code fixe généré à la création (qr_code), jamais recalculé.
 */
type Props = {
  /** Code permanent, ex. HMVB-<uuid> */
  qrCode: string;
  size?: number;
};

export function MemberQr({ qrCode, size = 180 }: Props) {
  const payload = qrCode.startsWith('member:') ? qrCode : `member:${qrCode}`;
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
      <Text style={styles.hint}>Code unique · inchangé même si les infos sont modifiées</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 8 },
  code: {
    marginTop: 12,
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontFamily: 'monospace',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  hint: {
    marginTop: 4,
    fontSize: 11,
    color: Colors.light.textMuted,
    textAlign: 'center',
  },
});
