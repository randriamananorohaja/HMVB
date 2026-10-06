import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Colors, Radius } from '@/constants/theme';
import { getMembers, getTraining, setPresence, addNotification } from '@/lib/api';
import { Header } from '@/components/volley/Header';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

/**
 * Format QR attendu :
 * - member:<memberId>
 * - training:<trainingId>
 * - ou JSON { type: 'member'|'training', id: '...' }
 */
export default function ScannerScreen() {
  const router = useRouter();
  const { trainingId } = useLocalSearchParams<{ trainingId?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCode = async (result: BarcodeScanningResult) => {
    if (scanned || processing) return;
    setScanned(true);
    setProcessing(true);

    try {
      const raw = result.data?.trim() || '';
      let memberId: string | null = null;
      let tid = trainingId || null;

      if (raw.startsWith('member:')) {
        memberId = raw.slice(7);
      } else if (raw.startsWith('training:')) {
        tid = raw.slice(9);
      } else {
        try {
          const json = JSON.parse(raw);
          if (json.type === 'member') memberId = json.id;
          if (json.type === 'training') tid = json.id;
          if (json.memberId) memberId = json.memberId;
          if (json.trainingId) tid = json.trainingId;
        } catch {
          // treat as member id
          memberId = raw;
        }
      }

      if (!tid) {
        Alert.alert(
          'Entraînement requis',
          "Ouvrez le scanner depuis un entraînement, ou scannez un QR d'entraînement.",
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
        setProcessing(false);
        return;
      }

      const training = await getTraining(tid);
      if (!training) {
        Alert.alert('Erreur', 'Entraînement introuvable', [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
        setProcessing(false);
        return;
      }

      if (!memberId) {
        // QR training only — navigate to coach QR or list
        router.replace(`/qr-coach?id=${tid}`);
        return;
      }

      const members = await getMembers();
      const member = members.find((m) => m.id === memberId);
      if (!member) {
        Alert.alert('Erreur', 'Membre introuvable dans la base', [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
        setProcessing(false);
        return;
      }

      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      // Simple late logic: after start_time + 10 min
      const [sh, sm] = training.start_time.split(':').map(Number);
      const startMins = sh * 60 + sm;
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const status = nowMins > startMins + 10 ? 'retard' : 'present';

      await setPresence(tid, member.id, status as any, time);
      await addNotification(
        'Présence enregistrée',
        `${member.first_name} ${member.last_name} · ${status === 'present' ? 'Présent' : 'En retard'} à ${time}`,
        'checkmark.circle.fill',
        Colors.light.success
      );

      router.push({
        pathname: '/confirmation-presence',
        params: {
          memberId: member.id,
          name: `${member.first_name} ${member.last_name}`,
          number: String(member.number),
          position: member.position,
          time,
          status,
        },
      });
    } catch (e) {
      Alert.alert('Erreur', String(e), [{ text: 'OK', onPress: () => setScanned(false) }]);
    } finally {
      setProcessing(false);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Header title="Scanner" showBack />
        <View style={[styles.content, styles.center]}>
          <Text style={styles.hint}>
            L'autorisation caméra est nécessaire pour scanner les QR codes de présence.
          </Text>
          <PrimaryButton title="Autoriser la caméra" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Scanner" showBack />
      <View style={styles.content}>
        <Text style={styles.hint}>Scannez le QR du joueur ou de l'entraînement</Text>
        <View style={styles.cameraWrap}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : handleBarCode}
          />
          <View style={styles.overlay} pointerEvents="none">
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
        </View>
        {processing && <ActivityIndicator color={Colors.light.primary} style={{ marginTop: 16 }} />}
        {scanned && !processing && (
          <PrimaryButton
            title="Scanner à nouveau"
            onPress={() => setScanned(false)}
            style={{ marginTop: 16, width: '100%' }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  hint: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: Colors.light.primary,
  },
  tl: { top: 24, left: 24, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  tr: { top: 24, right: 24, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bl: { bottom: 24, left: 24, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  br: { bottom: 24, right: 24, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
});
