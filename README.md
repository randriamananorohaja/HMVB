# VolleyTeam

Application mobile de gestion d'équipe de volleyball — **données réelles en SQLite local**.

## Fonctionnalités

- Membres : ajout / modification / suppression, photo avatar (galerie ou caméra)
- Champs joueur : nom, prénom, n°, position, téléphone, email, **date de naissance**, **lieu de naissance**, **adresse**
- Entraînements : création, détail, suppression
- Présences : scan QR (caméra), pointage manuel, stats
- États vides : message **« Aucune donnée enregistrée »** quand les tables sont vides
- Base SQLite locale (aucune donnée fictive)

## Installation

```bash
npm install
npx expo start
```

Permissions demandées : **caméra** (scan QR + photo avatar), **galerie** (avatar).

## Structure données

Tables SQLite : `teams`, `members`, `trainings`, `presences`, `notifications`.

API : `lib/api.ts` · schéma : `lib/database.ts`
