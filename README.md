# VolleyTeam

Application coach — gestion d'équipe volleyball.

## Identifiants coach
- **Numéro :** `0347180709`
- **Mot de passe :** `Dera301`

## Fonctionnalités
- Login coach unique
- Membres (CRUD) + avatar + date/lieu naissance + adresse + **QR personnel**
- Entraînements (CRUD) + date/heure pickers
- **Pointage :** le coach scanne le QR de chaque joueur
- Historique saison + **export Excel (CSV)**
- Archivage auto des entraînements passés l'heure de fin
- Base SQLite locale

## Installation

```bash
npm install
# ou pour aligner les versions Expo :
npx expo install expo-sqlite expo-camera expo-image-picker @react-native-community/datetimepicker @react-native-async-storage/async-storage expo-file-system expo-sharing react-native-svg react-native-qrcode-svg

npx expo start
```
# HMVB
