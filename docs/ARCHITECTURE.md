# Architecture

## Vue d’ensemble
- **Mobile (Expo RN)** : interface principale (onboarding, agenda, séances, bibliothèque, journal, mode enseignant).
- **Backend (Supabase)** : Auth, Postgres, Storage, politiques RLS.
- **Offline-first** : base SQLite locale, file de synchronisation LWW + versioning.

## Rôles
1. **Visiteur** : découverte + ressources publiques.
2. **Pratiquant** : agenda, séances guidées autorisées, journal, check-in.
3. **Enseignant habilité** : création/attribution de programmes, feedback, bibliothèque étendue.

## Modèle de données (Supabase)
### Tables principales
- `users (id, role, dojo_id, teacher_id, created_at)`
- `dojos (id, name, city, country, contact, website)`
- `content_items (id, type, title, body_md, level, allowed_autonomous, tags, media_urls)`
- `programs (id, title, description, created_by, visibility)`
- `program_blocks (id, program_id, order, block_type, content_item_id, duration_sec, instructions_md)`
- `assignments (id, program_id, student_id, start_date, cadence)`
- `sessions (id, user_id, program_id, started_at, ended_at, offline_id)`
- `session_logs (id, session_id, metrics, notes, shared_with_teacher)`
- `teacher_feedback (id, session_id, teacher_id, comment)`

### Stratégie offline
- Tables miroir locales via SQLite.
- File de synchronisation par entité, champs `updated_at`, `version`.
- Résolution de conflits : **Last-Write-Wins** + historisation légère.

## Flux UX (MVP)
1. **Onboarding** : disclaimer + consentements + profil léger.
2. **Agenda** : cours, pratiques, rappels.
3. **Séances guidées** : blocs, timers, consignes, sécurité.
4. **Bibliothèque** : recherche, filtres, favoris, gating.
5. **Journal** : ressenti, notes, export.

## Sécurité et conformité
- Auth email + magic link.
- RLS stricte selon `role` et `assignments`.
- Pas de tracking tiers par défaut.
