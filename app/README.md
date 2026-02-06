# Compagnon Aikishintaiso

Application web hors-ligne (HTML/CSS/JS) pour construire et exécuter des séances structurées d’Aikishintaiso.

## Installation rapide
- Ouvrir `app/index.html` directement dans un navigateur moderne.
- Pour un hébergement local simple : servir le dossier `app/` via un serveur statique (ex: `python -m http.server`).
- Le mode PWA fonctionne si le site est servi en HTTPS ou via `localhost`.

## Déontologie (rappel)
- Cette application ne remplace pas un enseignant, n’est pas un dispositif médical, ne diagnostique rien.
- En cas de douleur vive ou de problème de santé, arrêter et consulter.
- Silence pendant la pratique ; questions et notes après la séance.
- Les contenus réservés sont verrouillés en mode autonome.

## Structure JSON
Les données sont stockées localement et exportables :

- **ContentItem** : éléments de bibliothèque (posture, marche, méditation, kihon, rituel).
- **SessionTemplate** : séance construite avec blocs.
- **SessionBlock** : bloc d’une séance (misogi, kihon, programme, retour stable, discussion).
- **BlockItem** : item dans un bloc, avec durée, intensité, guidance.
- **PracticeLog** : journal de pratique (ressenti, fatigue, calme, mobilité).
- **Settings** : thème, taille de police, mode enseignant, etc.

Voir `app/data/seed.json` pour un exemple complet.

## Import / Export
- Aller dans **Aide & Glossaire** pour exporter les données en JSON.
- Importer un JSON remplacera les données locales.

## Validation manuelle (checklist)
1. Ouvrir `index.html` sans réseau : l’app fonctionne et affiche la page d’accueil.
2. Créer une séance via le constructeur et vérifier les 5 phases + discussion.
3. Vérifier que les éléments réservés sont bloqués en mode autonome.
4. Démarrer une séance et vérifier le déroulé en mode dojo (timer, suivant/précédent).
5. Enregistrer une entrée de journal et vérifier les stats.
6. Exporter puis réimporter le JSON.
7. Passer en mode enseignant et vérifier l’accès aux éléments réservés.

## Points d’extension
- Ajout de médias locaux (audio/illustrations) via IndexedDB.
- Visualisations plus détaillées du journal.
- Notifications locales (si support du navigateur).
- Planificateur de séances récurrentes.
