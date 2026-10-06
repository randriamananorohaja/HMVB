/**
 * Wrapper optionnel autour d'expo-image-picker.
 * Si le package n'est pas installé, les fonctions renvoient null et affichent une alerte.
 */
import { Alert } from 'react-native';

type PickerResult = { uri: string } | null;

let ImagePicker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ImagePicker = require('expo-image-picker');
} catch {
  ImagePicker = null;
}

export function isImagePickerAvailable(): boolean {
  return ImagePicker != null;
}

export async function pickFromGallery(): Promise<PickerResult> {
  if (!ImagePicker) {
    Alert.alert(
      'Package manquant',
      "Installez expo-image-picker :\nnpx expo install expo-image-picker"
    );
    return null;
  }
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission requise', "Autorisez l'accès à la galerie.");
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (!result.canceled && result.assets?.[0]) {
    return { uri: result.assets[0].uri };
  }
  return null;
}

export async function pickFromCamera(): Promise<PickerResult> {
  if (!ImagePicker) {
    Alert.alert(
      'Package manquant',
      "Installez expo-image-picker :\nnpx expo install expo-image-picker"
    );
    return null;
  }
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission requise', "Autorisez l'accès à la caméra.");
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (!result.canceled && result.assets?.[0]) {
    return { uri: result.assets[0].uri };
  }
  return null;
}
