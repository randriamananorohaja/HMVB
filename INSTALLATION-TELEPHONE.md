# Installer HMVB sur votre téléphone (hors ligne)

L’app stocke tout en **SQLite sur le téléphone** : une fois installée, elle fonctionne **sans Internet**
(sauf l’image QR qui utilise une API web ; le code texte reste lisible hors ligne).

---

## Option A — Expo Go (test rapide)

Bon pour tester. Certaines fonctions natives (caméra, SQLite) marchent en général dans Expo Go.

1. Installez **Expo Go** depuis Play Store / App Store  
2. Sur votre PC, dans le dossier du projet :

```bash
cd ~/MonApp   # ou VolleyTeam
npm install
npx expo install expo-sqlite expo-camera expo-image-picker
npx expo install @react-native-community/datetimepicker
npx expo install expo-file-system expo-sharing
npx expo start
```

3. Scannez le QR code affiché dans le terminal avec Expo Go  
4. **Identifiants :** numéro `0347180709` / mot de passe `Dera301`

> L’icône HMVB n’apparaît pas dans Expo Go (c’est l’icône Expo).  
> Pour l’icône officielle, utilisez l’option B.

---

## Option B — APK installable (recommandé, hors ligne complet + icône HMVB)

### Sur le PC (une seule fois pour générer l’APK)

```bash
cd ~/MonApp
npm install
npx expo install expo-sqlite expo-camera expo-image-picker @react-native-community/datetimepicker expo-file-system expo-sharing

# Générer un APK Android
npx eas-cli login          # compte Expo gratuit
npx eas build -p android --profile preview
```

Ou en local (Android Studio + téléphone en USB) :

```bash
npx expo run:android
```

### Sur le téléphone
1. Téléchargez le fichier `.apk` fourni par EAS (lien dans le terminal / site expo.dev)  
2. Autorisez « sources inconnues » si demandé  
3. Installez l’APK → l’icône **HMVB** apparaît sur l’écran d’accueil  
4. Ouvrez l’app **sans Internet** après la première ouverture

### iPhone
```bash
npx eas build -p ios --profile preview
```
Nécessite un compte Apple Developer pour installer hors TestFlight.

---

## Fonctionnalités hors ligne

| Fonction | Hors ligne |
|----------|------------|
| Login coach | Oui |
| Membres (ajouter / modifier / désactiver / supprimer) | Oui |
| Entraînements (CRUD) | Oui |
| Présences + scan caméra | Oui |
| Stats / historique | Oui |
| Export CSV | Oui |
| Image QR (API web) | Non (le code texte reste affiché) |

---

## Icône de l’application

Fichier : `assets/images/logoHMVB.png` (et `icon.png`, splash, adaptive Android)  
Configuré dans `app.json` sous le nom **HMVB**.
