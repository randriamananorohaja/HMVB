# Corriger le build EAS (npm ci failed)

Le build a échoué à l’étape **Install dependencies** (`npm ci` code 1).
Cause habituelle : `package-lock.json` désynchronisé avec `package.json`.

## Sur votre PC (dans ~/MonApp)

```bash
cd ~/MonApp

# 1. Régénérer un lockfile propre
rm -rf node_modules
rm -f package-lock.json
npm install

# 2. Rebuild APK avec cache EAS vidé
npx eas-cli build -p android --profile preview --clear-cache
```

## Si ça échoue encore

```bash
echo "legacy-peer-deps=true" > .npmrc
rm -rf node_modules package-lock.json
npm install
npx eas-cli build -p android --profile preview --clear-cache
```

Logs détaillés :
https://expo.dev/accounts/hajaaridera301/projects/hmvb/builds

## Alternative locale (sans EAS)

```bash
npx expo run:android
```

## Warning DateTimePicker

`onChange is deprecated` est un **avertissement**, pas une erreur.
Il n’empêche ni le build ni les pickers.
