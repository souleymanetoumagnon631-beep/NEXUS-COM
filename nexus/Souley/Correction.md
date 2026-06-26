# Migration vers Vite + React & Architecture Offline-First (PWA + IndexedDB)

Ce plan décrit la migration complète du frontend de NEXUS-COM d'une SPA en JS vanilla global vers une application réactive moderne utilisant **Vite**, **React**, et une architecture **Offline-First** basée sur **Dexie.js** (IndexedDB) synchronisée avec **Supabase**.

## User Review Required

> [!IMPORTANT]
> **Décisions d'Architecture clés :**
> 1. **Framework & Outils** : Initialisation d'une structure **Vite + React** avec **Dexie.js** pour la base locale et **React Router** pour la navigation.
> 2. **Refonte Offline-First** : L'interface ne lira/écrira plus directement dans Supabase. Elle interagira avec la base IndexedDB locale (Dexie.js). Une file d'attente (`outbox`) et un moteur de synchronisation asynchrone gèreront les synchronisations bidirectionnelles avec Supabase en arrière-plan.
> 3. **Préservation du Design** : Importation directe des fichiers CSS existants (`variables.css`, `layout.css`, `components.css`, `pages.css`, etc.) pour préserver l'identité visuelle existante de NEXUS-COM tout en optimisant le temps de développement.

> [!WARNING]
> **Dépendances supplémentaires :**
> Nous ajouterons les packages npm suivants au projet :
> - `react`, `react-dom`, `react-router-dom` (UI & Routage)
> - `@supabase/supabase-js` (Client DB & Auth)
> - `dexie`, `dexie-react-hooks` (Base IndexedDB locale et réactivité)
> - `chart.js`, `react-chartjs-2` (Graphiques)
> - `vite-plugin-pwa` (Support PWA et mise en cache des assets statiques)

---

## Open Questions

Aucune question bloquante restante. Les choix structurants ont été validés par l'utilisateur (Vite + React pour le framework, Offline-first en priorité absolue).

---

## Proposed Changes

La migration sera effectuée en plusieurs étapes pour minimiser les risques de régression.

### Phase 1 : Initialisation & Dépendances
- Configuration de Vite, installation des packages et mise à jour de `package.json`.
- Configuration de la PWA dans `vite.config.js`.

### Phase 2 : Modèle de Données Local & Moteur de Synchro
- Création de la base IndexedDB locale avec Dexie.js.
- Implémentation du `syncEngine` gérant :
  - La synchronisation initiale des données de Supabase vers IndexedDB.
  - La file d'attente des requêtes CRUD locales en attente (mode hors-ligne).
  - La re-tentative automatique au retour de la connexion internet.

### Phase 3 : Logique d'Authentification et Routage
- Création du `AuthContext` React pour encapsuler la session Supabase.
- Routage complet : `/login`, `/dashboard`, et les routes de paiement (`/success`).

### Phase 4 : Portabilité des Pages
- Migration des 14 modules de pages (`pages/*.js`) en composants React.
- Remplacement des requêtes Supabase directes par des requêtes de base locale Dexie.js (via le hook `useLiveQuery` de Dexie pour une réactivité instantanée à chaque mise à jour).
- Intégration du moteur financier (`engine.js`) réécrit proprement sous forme de fonctions utilitaires pures.

---

### [Component Name]

#### [NEW] [package.json](file:///c:/Users/Lenovo/Desktop/NEXUS-COM/package.json)
Mise à jour avec les dépendances Vite, React, Dexie, ChartJS et configuration PWA.

#### [NEW] [vite.config.js](file:///c:/Users/Lenovo/Desktop/NEXUS-COM/vite.config.js)
Configuration de Vite et de `vite-plugin-pwa` pour le support hors-ligne des assets.

#### [NEW] [src/db/localDb.js](file:///c:/Users/Lenovo/Desktop/NEXUS-COM/src/db/localDb.js)
Schéma Dexie.js contenant les 12 tables et la table `sync_queue` pour les modifications hors-ligne.

#### [NEW] [src/db/syncEngine.js](file:///c:/Users/Lenovo/Desktop/NEXUS-COM/src/db/syncEngine.js)
Moteur de synchronisation bidirectionnelle Supabase <-> IndexedDB avec gestion des conflits et retry automatique.

#### [NEW] [src/main.jsx](file:///c:/Users/Lenovo/Desktop/NEXUS-COM/src/main.jsx)
Point d'entrée principal React.

#### [NEW] [src/App.jsx](file:///c:/Users/Lenovo/Desktop/NEXUS-COM/src/App.jsx)
Structure globale de l'application, instanciation du SyncEngine, et gestion globale de l'état en ligne/hors-ligne.

---

## Verification Plan

### Automated Tests
- Lancer le serveur de développement Vite : `npm run dev`
- Lancer le build de production pour valider les types et la compilation : `npm run build`

### Manual Verification
- Simulation de coupure réseau (Mode Hors-ligne Chrome DevTools) :
  - Ajouter/modifier un produit ou une vente hors-ligne.
  - Vérifier que l'UI se met à jour immédiatement (réactivité locale via `useLiveQuery`).
  - Restaurer le réseau et valider la synchronisation automatique en arrière-plan vers Supabase.
- Validation PWA : Vérifier que l'application est installable sur mobile/desktop et fonctionne sans connexion réseau.
