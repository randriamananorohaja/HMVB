import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { Header } from '@/components/volley/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

export default function ScannerScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Scanner" showBack />
      <View style={styles.content}>
        <Text style={styles.hint}>Scannez le QR de l'entraînement</Text>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          <IconSymbol name="qrcode" size={64} color={Colors.light.textMuted} />
        </View>
        <Text style={styles.or}>Ou</Text>
        <PrimaryButton
          title="Mon QR personnel"
          icon="person.fill"
          variant="outline"
          onPress={() => {}}
        />
        <PrimaryButton
          title="Activer le scanner"
          icon="camera.fill"
          onPress={() => router.push('/confirmation-presence')}
          style={{ marginTop: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  hint: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 24,
  },
  frame: {
    width: 220,
    height: 220,
    borderRadius: 16,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: Colors.light.primary,
  },
  tl: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 6 },
  tr: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6 },
  bl: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 6 },
  br: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },
  or: { fontSize: 14, color: Colors.light.textMuted, marginBottom: 16 },
});
