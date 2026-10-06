import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Colors } from '@/constants/theme';
import { getMembers, getTraining, setPresence, addNotification } from '@/lib/api';
import { Header } from '@/components/volley/Header';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

/**
 * Le COACH scanne le QR personnel de chaque JOUEUR.
 * Format QR joueur : member:<memberId>
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
      const raw = (result.data || '').trim();
      let memberId: string | null = null;

      if (raw.startsWith('member:')) {
        memberId = raw.slice(7).trim();
      } else {
        try {
          const json = JSON.parse(raw);
          if (json.type === 'member' || json.memberId) {
            memberId = json.id || json.memberId;
          }
        } catch {
          // UUID-like payload
          if (/^[0-9a-f-]{8,}$/i.test(raw)) memberId = raw;
        }
      }

      if (!trainingId) {
        Alert.alert(
          'Entraînement requis',
          "Ouvrez le scanner depuis un entraînement pour pointer les présences.",
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
        setProcessing(false);
        return;
      }

      const training = await getTraining(trainingId);
      if (!training) {
        Alert.alert('Erreur', 'Entraînement introuvable', [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
        setProcessing(false);
        return;
      }

      if (!memberId) {
        Alert.alert(
          'QR invalide',
          "Ce QR n'est pas une carte membre. Demandez au joueur d'afficher son QR personnel.",
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
        setProcessing(false);
        return;
      }

      const members = await getMembers();
      // Résolution stable : id OU qr_code permanent (même après modification des infos)
      const rawCode = memberId;
      const member = members.find(
        (m) =>
          m.id === rawCode ||
          m.qr_code === rawCode ||
          m.qr_code === `HMVB-${rawCode}` ||
          `HMVB-${m.id}` === rawCode ||
          m.id === rawCode.replace(/^HMVB-/, '')
      );
      if (!member) {
        Alert.alert('Erreur', 'Joueur introuvable dans la base', [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
        setProcessing(false);
        return;
      }

      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const [sh, sm] = training.start_time.split(':').map(Number);
      const startMins = sh * 60 + (sm || 0);
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const status = nowMins > startMins + 10 ? 'retard' : 'present';

      await setPresence(trainingId, member.id, status as any, time);
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
          position: String(member.position),
          time,
          status,
          trainingId,
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
        <Header title="Scanner les joueurs" showBack />
        <View style={[styles.content, styles.center]}>
          <Text style={styles.hint}>
            Autorisez la caméra pour scanner le QR personnel de chaque joueur.
          </Text>
          <PrimaryButton title="Autoriser la caméra" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Scanner les joueurs" showBack />
      <View style={styles.content}>
        <Text style={styles.hint}>
          Scannez le QR personnel affiché sur la carte de chaque joueur
        </Text>
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
            title="Scanner le joueur suivant"
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
  corner: { position: 'absolute', width: 36, height: 36, borderColor: Colors.light.primary },
  tl: { top: 24, left: 24, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  tr: { top: 24, right: 24, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bl: { bottom: 24, left: 24, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  br: { bottom: 24, right: 24, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
});
