# AikishintaisoAssistant

Compagnon mobile pour la pratique de l’Aikishintaiso, conçu pour accompagner la pratique **sans remplacer l’enseignant** et **sans promesse médicale**.

## Objectifs
- Proposer un cadre clair et éthique pour la pratique autonome, tout en encourageant l’encadrement par un enseignant.
- Offrir un agenda, des séances guidées autorisées, une bibliothèque structurée et un journal de pratique.
- Permettre un mode enseignant avec attribution de programmes et retours.

## Stack
- **Mobile** : React Native (Expo) + TypeScript.
- **Backend** : Supabase (Auth + Postgres + Storage).
- **Offline-first** : SQLite local + synchronisation Supabase (file de sync, LWW + versioning).
- **Accessibilité** : mode sombre, tailles de police ajustables, VoiceOver/TalkBack.

## Dossiers
- `apps/mobile` : application Expo RN.
- `supabase/migrations` : migrations SQL.
- `supabase/seed.sql` : données de démonstration non sensibles.
- `docs/ARCHITECTURE.md` : architecture, modèle de données, flux.
- `ETHICS.md` : cadre éthique et limites.

## Démarrage (squelette)
> Le dépôt contient un squelette minimal. Les dépendances et scripts seront complétés au fil de l’implémentation.

```bash
cd apps/mobile
npm install
npm run start
```

## Déontologie
Voir `ETHICS.md` pour les principes non négociables (non médical, pas de thérapie, contenus sensibles sous supervision).
