# Installation VolleyTeam

## Si erreur "buffer" / react-native-svg / qrcode-svg

Ces packages ont été **retirés**. Le QR joueur utilise une image standard (plus de svg).

## Commandes

```bash
cd ~/MonApp

rm -rf node_modules
rm -f package-lock.json

npm install

npx expo install expo-sqlite expo-camera expo-image-picker
npx expo install @react-native-community/datetimepicker
npx expo install expo-file-system expo-sharing

npx expo start -c
```

## Identifiants coach
- Numéro : 0347180709
- Mot de passe : Dera301

## Pointage QR
1. Ouvrir la fiche du joueur → afficher le QR personnel
2. Depuis un entraînement → « Scanner les QR des joueurs »
3. Le coach scanne le QR de chaque joueur
