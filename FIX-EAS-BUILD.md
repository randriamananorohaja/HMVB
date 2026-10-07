# Corriger le build EAS (sans rm -rf node_modules)

## Cause
`package.json` avait de **mauvaises versions** (ex. expo-camera 17 au lieu de ~57).
Le lockfile EAS n'était plus synchronisé → `npm ci` échoue.

## Sur le PC (économie de data)

```bash
cd ~/MonApp

# 1. Aligner les packages sur le SDK Expo installé (met à jour package.json + lockfile)
npx expo install expo-sqlite expo-camera expo-image-picker expo-file-system expo-sharing @react-native-community/datetimepicker expo-linking expo-router

# 2. Forcer la sync du lockfile SANS tout réinstaller from scratch
npm install --package-lock-only

# Si besoin d'installer les deltas seulement :
npm install

# 3. Vérifier
npx expo-doctor

# 4. Rebuild
npx eas-cli build -p android --profile preview --clear-cache
```

## Icônes
Les fichiers `icon.png` / adaptive devaient être de vrais PNG (pas du JPEG renommé).
Copiez depuis le ZIP mis à jour :
- assets/images/icon.png
- assets/images/android-icon-foreground.png
- assets/images/splash-icon.png
- assets/images/favicon.png
- assets/images/logoHMVB.png

## app.json
Ne pas mettre `splash` au niveau racine de `expo`.
Utiliser le plugin `expo-splash-screen` uniquement.
