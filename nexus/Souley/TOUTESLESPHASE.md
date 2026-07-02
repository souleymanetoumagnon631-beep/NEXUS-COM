COMMENT UTILISER CE DOCUMENT
Ce prompt est découpé en phases. Tu ne fait qu'une phase à la fois dans l'ordre. Chaque phase commence par une étape de questions obligatoires que doit poser et attendre avant d'écrire la moindre ligne de code. Ne passe à la phase suivante que quand la phase en cours est terminée et validée. Certaine reponse peuvent déja ce trouver dans le fichier Souley. Tu doit lire et prendre en compte tout les fichiers présent dans le dossier Souley avant de commencer. 
Ordre des phases :
•	Phase 0 — Cadrage produit (une seule fois, sert à toutes les phases suivantes)
•	Phase 1 — Landing page cinématographique
•	Phase 2 — Authentification (Supabase Auth)
•	Phase 3 — Dashboard applicatif (le cœur du SaaS)
•	Phase 3bis — Tests automatisés (à lancer après la Phase 2 et après chaque fonctionnalité significative de la Phase 3)
•	Phase 4 — Pricing & paiements (Stripe + passerelles africaines : CinetPay / PayDunya / Sene-Pay / autre)
•	Phase 4bis — Tracking Meta (Pixel + Conversions API) — à lancer une fois la landing (Phase 1) et les paiements (Phase 4) en place
•	Phase 4ter — Espace admin réservé au(x) développeur(s) (métriques, gestion utilisateurs) — à lancer une fois la Phase 4 en place
•	Phase 5 — Polish, responsive, déploiement
•	Phase 6 — Audit de sécurité complet (à lancer après chaque phase de construction significative, et obligatoirement avant tout déploiement en production)
Vois tout de façon logique et coherent et determine la meilleure manière de reussir toutes les phase.
Après la fait de chaque phase fait moi un rapport et demande moi l'autorisation de débuter la suivante.
PHASE 0 — CADRAGE PRODUIT (obligatoire, une seule fois) (Lit toujours le rôle global dans Rules.md avant d’agir)
Instruction à l'IA
Avant de produire quoi que ce soit — aucun fichier, aucun code, aucun plan détaillé — pose toutes les questions ci-dessous, dans l'ordre des blocs (un bloc peut être posé par appel d'outil de question, plutôt que les 18 questions d'un seul coup en vrac). L'ordre n'est pas arbitraire : chaque bloc s'appuie sur les réponses du bloc précédent, donc ne pose jamais un bloc avant d'avoir traité celui qui le précède.
•	Ne demande JAMAIS l'esthétique (Bloc 3) avant de connaître le produit, son public, et ses fonctionnalités (Blocs 1-2) — un système de design se choisit en fonction de ce que le produit est et de qui il s'adresse, pas l'inverse.
•	Si une réponse est vague ou incomplète, repose une question de clarification ciblée sur ce point précis avant de continuer — ne complète jamais un blanc avec une supposition de ta part sur un sujet aussi structurant que le nom, le public, ou les fonctionnalités cœur.
•	Une fois toutes les réponses obtenues, résume le produit en une fiche structurée complète (voir Livrable ci-dessous) et attends ma validation explicite avant de passer à la Phase 1.
Questions obligatoires
Bloc 1 — Identité fondamentale du produit
(Ce bloc détermine tout le reste — à traiter en premier, sans exception.)
•	Quel est le nom du SaaS ?
•	En une phrase, quelle est sa mission : quel problème résout-il, pour qui ?
•	Quel est le problème précis que ce SaaS résout, et comment les gens s'en sortent aujourd'hui sans lui (alternative actuelle : un concurrent, un tableau Excel, un processus manuel, rien du tout) ?
•	Dans quelle catégorie ce SaaS se range-t-il le mieux (ex : outil de productivité, CRM, plateforme de contenu, outil financier, marketplace, outil interne d'équipe, autre) ? Cela influence fortement la structure du dashboard en Phase 3.
Bloc 2 — Marque et identité visuelle
•	As-tu déjà un logo, ou faut-il que la direction esthétique du Bloc 4 inclue une proposition simple de logo (typographique ou icône minimale, cohérente avec le preset choisi) ?
•	Si tu as déjà un logo : sous quel format (fichier à fournir, ou décris-le pour que l'IA s'en inspire dans le code) ?
•	As-tu déjà des couleurs de marque imposées (charte graphique existante), ou le choix du preset esthétique au Bloc 4 peut-il définir entièrement la palette ?
Bloc 3 — Public et fonctionnalités cœur
(Ne pose ce bloc qu'une fois le Bloc 1 entièrement répondu — les fonctionnalités dépendent de qui est l'utilisateur et du problème identifié.) 8. Qui est l'utilisateur cible précisément (métier, niveau technique, taille d'entreprise s'il s'agit de B2B, ou profil personnel s'il s'agit de B2C) ? 9. Quelles sont les 3 à 5 fonctionnalités principales que cet utilisateur va utiliser une fois connecté ? (Ce sont elles qui définiront les écrans du dashboard en Phase 3 — sois aussi concret que possible : "créer et suivre des factures" plutôt que "gestion financière".) 10. Pour chaque fonctionnalité listée au point 9 : quelle donnée est créée, lue, modifiée ou supprimée ? (Exemple : "Créer un projet", "Lire la liste des tâches", "Modifier un statut".) 11. Y a-t-il une notion de rôles/permissions (ex : Admin vs Membre vs Invité), ou tous les comptes ont les mêmes droits ? 12. Au-delà des métriques génériques (nombre d’abonnés, revenu, churn) qui seront suivies par défaut dans l’espace admin (Phase 4ter), y a-t-il une donnée propre à ce produit que tu veux absolument pouvoir surveiller toi-même (ex : volume d’usage, taux de complétion, activité par compte) ?
Bloc 4 — Direction esthétique
(Posé seulement après les Blocs 1 à 3 — le choix doit correspondre au produit réel, pas être décidé dans le vide.) 12. Au vu du produit et du public définis ci-dessus, choisis une direction esthétique parmi les 4 presets ci-dessous (Tech Organique, Luxe de Minuit, Signal Brutaliste, Clinique Vapor) — voir Annexe A pour le détail complet de chaque preset. Si le profil d'utilisateur du Bloc 3 semble en décalage avec le preset choisi (ex : un outil B2B très sérieux avec un preset très festif), signale-le avant de valider plutôt que de l'accepter silencieusement.
Bloc 5 — Modèle économique
•	Le SaaS est-il payant dès le départ, freemium, ou gratuit pour l'instant ?
•	Si payant : combien de paliers tarifaires (1, 2, 3+) et qu'est-ce qui différencie chaque palier (quota, fonctionnalité, support) ? Les paliers doivent rester cohérents avec les fonctionnalités cœur identifiées au Bloc 3 — ne pas inventer une limite qui n'a pas de sens avec ce que fait réellement le produit.
•	Facturation mensuelle, annuelle, ou les deux avec réduction sur l'annuel ?
Bloc 6 — Onboarding et conversion
•	Que doit faire un visiteur en premier sur la landing page ? (CTA principal : "Essai gratuit", "Réserver une démo", "S'inscrire", etc. — doit être cohérent avec le modèle économique du Bloc 5.)
•	Y a-t-il une période d'essai gratuite avant paiement (trial), et si oui, combien de jours ?
Bloc 7 — Contraintes techniques
•	As-tu déjà un projet Supabase créé (URL + clés disponibles), ou l'IA doit-elle documenter le schéma à créer sans pouvoir le déployer elle-même ?
•	As-tu déjà un compte Stripe configuré ? Et un compte chez une passerelle africaine (CinetPay, PayDunya, ou autre) ? Pour chacun, confirme s'il existe déjà ou si l'IA doit documenter sa création sans pouvoir le déployer elle-même.
•	Important — environnement d'exécution serveur : Vite produit une application 100% statique côté navigateur (SPA) — elle n'a, par elle-même, aucun endroit où exécuter du code serveur (webhooks, appels avec des clés secrètes, CAPI). Ce code "serveur" doit donc tourner ailleurs. Choisis l'option qui correspond à ta plateforme de déploiement prévue (Phase 5) :
•	Supabase Edge Functions (runtime Deno) — cohérent si tout le reste de ton backend est déjà sur Supabase, pas de plateforme de déploiement supplémentaire à gérer pour le code serveur.
•	Fonctions Serverless de la plateforme de déploiement (ex. Vercel Functions, Netlify Functions) — pertinent si tu déploies déjà sur l'une de ces plateformes pour héberger le frontend.
•	Si tu n'as pas encore choisi de plateforme de déploiement, l'IA peut recommander une option par défaut cohérente avec le reste de la stack, mais ce choix doit être fait maintenant, pas découvert au moment d'écrire le premier webhook en Phase 4.
Livrable de fin de Phase 0
Une fiche produit structurée comprenant : Nom + logo/identité visuelle, Mission, Catégorie de produit, Public cible, Fonctionnalités cœur (avec leur logique CRUD), Rôles/permissions, Métrique(s) admin spécifique(s) identifiée(s) en question 12, Direction esthétique choisie, Modèle économique et paliers, Stratégie d'onboarding, État des comptes techniques (Supabase/Stripe/passerelle africaine), Environnement d'exécution serveur retenu (Edge Functions Supabase ou Serverless de la plateforme de déploiement) — plus une proposition de schéma de données Supabase de haut niveau (tables principales, relations). Présente cette fiche complète et attends ma validation explicite avant de passer à la Phase 1. Pas de code à ce stade.
PHASE 1 — LANDING PAGE CINÉMATOGRAPHIQUE
Instruction à l'IA	
Utilise la fiche produit validée en Phase 0. Pose uniquement les questions ci-dessous si l'information manque dans la fiche Phase 0 (ne répète pas ce qui est déjà connu).
Avant d'écrire le moindre composant, initialise le projet complet :
•	npm create vite@latest (template React + TypeScript).
•	Installe et configure Tailwind CSS v3.4.17, GSAP 3 (+ ScrollTrigger), Lucide React, React Router.
•	Mets en place la structure de dossiers (src/components/, src/pages/, src/lib/, src/hooks/, src/context/, src/types/).
•	Configure les routes de base en prévision des phases suivantes : /, /login, /signup, /dashboard, /pricing.
•	Charge les fonts Google Fonts du preset choisi dans index.html.
Construis ensuite la landing complète comme page d'accueil (/) de ce nouveau projet.
Questions (si non déjà répondues en Phase 0)
•	Confirme les 3 arguments de vente clés à mettre en avant (peuvent être un sous-ensemble des fonctionnalités cœur).
•	Le CTA principal de la landing pointe-t-il vers l'inscription (Phase 2) ou vers une autre action (waitlist, démo) ?
Système de design fixe (s'applique à TOUTES les phases suivantes aussi)
•	Overlay de bruit CSS global via <feTurbulence> SVG inline, opacité 0.05.
•	Rayons rounded-[2rem] à rounded-[3rem] partout. Aucun angle vif.
•	Boutons "magnétiques" : scale(1.03) au survol, easing cubic-bezier(0.25, 0.46, 0.45, 0.94), couche <span> glissante en fond pour la transition de couleur.
•	Liens/éléments interactifs : lift translateY(-1px) au survol.
•	Toutes les animations via gsap.context() dans useEffect, avec ctx.revert() au nettoyage. Easing power3.out (entrées), power2.inOut (morphismes). Décalage : 0.08 (texte), 0.15 (cartes).
Architecture de la landing (ne jamais changer la structure — adapter contenu/couleurs)
A. Navbar — pilule flottante centrée, morphing transparent → bg/60 backdrop-blur-xl au scroll (IntersectionObserver/ScrollTrigger). Logo, 3-4 liens, CTA accent.
•	Gestion du logo (selon réponses au Bloc 2 de la Phase 0) : si un fichier logo a été fourni, l'intégrer directement (src/assets/logo.svg ou équivalent). Si aucun logo n'existe encore, composer un logo simple et cohérent avec le preset choisi — typographie de marque (nom du SaaS dans la police de titre du preset, éventuellement avec une icône Lucide ou une forme géométrique simple en couleur accent) plutôt qu'un logo générique ou un placeholder. Ce logo composé doit être réutilisé identiquement dans le footer (Bloc G) et dans le favicon.
B. Hero — 100dvh, image Unsplash (mots-clés liés au preset), overlay gradient primaire-vers-noir. Contenu en tiers inférieur gauche. Titre en deux temps : sans-serif gras puis serif italique massif (3-5x la taille). Fade-up GSAP décalé. CTA sous le titre.
C. Fonctionnalités — 3 cartes interactives dérivées des arguments de vente :
•	Carte 1 "Mélangeur Diagnostique" : 3 sous-cartes qui cyclent (array.unshift(array.pop()) toutes les 3s, rebond élastique cubic-bezier(0.34, 1.56, 0.64, 1)).
•	Carte 2 "Machine à Écrire Télémétrie" : texte monospace qui s'écrit caractère par caractère, curseur clignotant accent, label "Flux en Direct" avec point pulsant.
•	Carte 3 "Planificateur Protocole Curseur" : grille L M M J V S D, curseur SVG animé qui clique une cellule, l'active, puis va vers "Sauvegarder".
D. Philosophie — fond sombre, image texture parallaxe faible opacité. Deux déclarations contrastantes ("La plupart des [industrie] se concentrent sur X" vs "Nous nous concentrons sur Y" en serif italique massif, mot accent coloré). Révélation SplitText au scroll.
E. Protocole — 3 cartes plein écran empilées au scroll (ScrollTrigger + pin: true), scale/blur/fade de la carte précédente. Chaque carte a une animation SVG/canvas unique (hélice rotative, balayage laser, onde ECG stroke-dashoffset).
F. Pricing — voir Phase 4 pour le détail ; ici, version teaser simplifiée qui renvoie vers la page pricing complète ou vers le CTA d'inscription.
G. Footer — fond sombre, rounded-t-[4rem], grille (marque+slogan, nav, légal), indicateur "Système Opérationnel" avec point vert pulsant.
Exigences techniques
•	Vraies URLs Unsplash correspondant à l'ambiance du preset choisi.
•	Responsive mobile-first, cartes empilées verticalement sur mobile.
•	Fichiers .tsx typés, séparés en components/ dès qu'un fichier dépasse ~300 lignes (voir Principe directeur de l'architecture du code, dans le Rôle global) — ne pas attendre qu'un fichier devienne massif pour le découper.
•	Les routes /login, /signup, /dashboard, /pricing sont déjà déclarées (même vides) dans le routeur — elles seront remplies dans les phases suivantes.
PHASE 2 — AUTHENTIFICATION (Supabase Auth)
Instruction à l'IA
Avant de coder, vérifie si un fichier docs/supabase.md existe (Règle 7) — s'il documente déjà la configuration Auth retenue pour ce projet (providers activés, redirections, structure de session), c'est la référence à suivre. Pose ensuite les questions ci-dessous. Implémente l'authentification complète avec Supabase, dans le même langage visuel que la landing (mêmes tokens de design, même typographie, mêmes micro-interactions).
Questions obligatoires
•	Quelles méthodes de connexion veux-tu activer ? (Email/mot de passe, Magic Link, Google OAuth, autre)
•	Faut-il une étape de vérification d'email obligatoire avant accès au dashboard ?
•	Faut-il collecter des informations supplémentaires à l'inscription (nom, nom d'entreprise, taille d'équipe...) au-delà de l'email/mot de passe ?
•	Que se passe-t-il après une inscription réussie : redirection directe vers le dashboard, vers un onboarding guidé, ou vers le choix d'un plan tarifaire ?
Ce qu'il faut livrer
•	Pages /login, /signup, /forgot-password, /reset-password avec le même habillage visuel que la landing (cartes rounded-[2rem], boutons magnétiques, overlay de bruit).
•	Intégration Supabase Auth (@supabase/supabase-js), gestion de session via contexte React (AuthContext typé).
•	Protection de route : un composant ProtectedRoute qui redirige vers /login si non connecté.
•	Gestion des erreurs utilisateur (email déjà utilisé, mot de passe trop court, etc.) affichée dans le même langage visuel, jamais de alert() brut.
•	Si Google OAuth demandé : bouton avec icône, flux complet documenté (callback URL à configurer côté Supabase).
•	État de chargement géré proprement (spinner cohérent avec la direction esthétique, pas un spinner générique de librairie UI par défaut).
PHASE 3 — DASHBOARD APPLICATIF (le cœur du SaaS)
Instruction à l'IA
Avant de coder, pose les questions ci-dessous pour chacune des fonctionnalités cœur identifiées en Phase 0. Construis ensuite le dashboard fonctionnalité par fonctionnalité, jamais tout en bloc — termine et valide une fonctionnalité avant de passer à la suivante si je te le demande explicitement, sinon enchaîne dans l'ordre de priorité que je donne.
Questions obligatoires (à répéter pour chaque fonctionnalité cœur)
•	Quel est le parcours utilisateur exact pour cette fonctionnalité, étape par étape ?
•	Quelles données Supabase (tables/colonnes) sont lues ou écrites ? Si la Phase 0 a déjà proposé un schéma, confirme-le ou ajuste-le ici.
•	Cette fonctionnalité a-t-elle des règles de permission (RLS) particulières — ex : un utilisateur ne voit que ses propres données, un admin voit tout ?
•	Y a-t-il une limite liée au plan tarifaire (ex : 3 projets max en plan gratuit) qui doit être vérifiée ici ?
Question d'architecture (une seule fois, avant la première fonctionnalité)
•	Pour la synchronisation des données entre Supabase et l'interface, trois options : (a) TanStack Query (@tanstack/react-query) pour le cache, le re-fetch automatique et la gestion d'état serveur — recommandation par défaut, c'est l'outil standard pour ce problème et il évite de réinventer la logique de cache/chargement/erreur à la main dans chaque hook ; (b) Supabase Realtime (souscriptions websocket) en plus ou à la place, si plusieurs utilisateurs doivent voir les mêmes données se mettre à jour en direct (ex : un tableau collaboratif) ; (c) state React simple (useState/useEffect) si le projet est volontairement minimal et que la complexité de TanStack Query n'est pas justifiée. Si tu n'as pas de préférence, l'IA installe TanStack Query dès la première fonctionnalité du dashboard et l'utilise de façon cohérente pour toutes les suivantes — ne jamais mélanger plusieurs approches de gestion d'état serveur dans le même projet.
Architecture du dashboard (structure de base, à adapter au nombre de fonctionnalités)
•	Layout : sidebar fixe ou navbar horizontale (cohérente avec le preset choisi), zone de contenu principale, indicateur de plan actuel/usage.
•	Navigation entre les fonctionnalités cœur, chacune sur sa propre route (/dashboard/...).
•	États systématiques pour chaque écran : chargement (skeleton cohérent avec le design, pas de spinner générique), vide (illustration + CTA quand aucune donnée), erreur (message clair, action de retry), rempli (la vraie interface). Avec TanStack Query, ces états (isLoading, isError, data) sont déjà fournis par le hook — ne pas les recoder manuellement par-dessus.
•	Tables/listes de données : tri, recherche, pagination si le volume le justifie.
•	Formulaires de création/édition : validation claire, feedback visuel immédiat (pas de soumission silencieuse), respect du système de boutons magnétiques. Les créations/modifications passent par des mutations TanStack Query qui invalident le cache concerné, pour que la liste affichée se mette à jour sans rechargement manuel de la page.
•	Chaque interaction de données passe par Supabase (jamais de mock local une fois cette phase commencée), avec gestion d'erreur réseau.
Exigences techniques additionnelles
•	Hooks Supabase typés par fonctionnalité (ex : useProjects(), useTasks()), construits sur TanStack Query (useQuery pour la lecture, useMutation pour la création/modification/suppression) plutôt que des appels directs dispersés dans les composants ou des useEffect réécrits à chaque fois pour refaire la même chose.
•	Une seule instance de QueryClient, créée une fois à la racine de l'app (src/main.tsx ou un fichier src/lib/queryClient.ts dédié) et réutilisée partout — jamais une nouvelle instance par composant.
•	RLS (Row Level Security) activée et documentée pour chaque table sensible — propose les policies SQL même si tu ne peux pas les déployer toi-même.
PHASE 3BIS — TESTS AUTOMATISÉS (à lancer après chaque phase de construction significative)
Instruction à l’IA
Cette phase n’est pas une option de fin de projet : elle se déclenche après la Phase 2 (Authentification) et après chaque ajout de fonctionnalité significative en Phase 3 (Dashboard), pour éviter qu’une régression invisible ne s’accumule pendant une semaine de développement rapide. Avant d’écrire le moindre test, vérifie quels tests existent déjà dans le projet pour ne pas dupliquer une couverture existante.
Questions obligatoires
•	As-tu une préférence d’outil de test, ou l’IA choisit-elle par défaut Vitest (cohérent avec Vite) + React Testing Library pour les composants, et Playwright pour les parcours critiques de bout en bout (inscription, paiement) ?
•	Quels sont les 3 à 5 parcours utilisateur dont une panne serait la plus coûteuse pour le SaaS (ex : inscription, paiement, création de la donnée cœur identifiée en Phase 0 Bloc 3) ? Ce sont eux qui définissent les tests de bout en bout prioritaires, pas une couverture exhaustive de chaque écran.
Ce qu’il faut livrer
•	Tests unitaires pour toute logique partagée vivant dans src/lib/ ou src/hooks/ (calcul de quota, formatage de prix, validation de champ) — c’est précisément le code dont la duplication est interdite par le Rôle global, donc le code le plus rentable à tester une seule fois.
•	Tests de composants pour les formulaires critiques (inscription, connexion, paiement) couvrant au minimum : cas de succès, champ invalide, échec réseau (cohérent avec la Règle 4).
•	Tests de bout en bout (Playwright) pour les parcours identifiés en question 2 ci-dessus — exécutés contre un environnement de test (jamais contre les données de production réelles).
•	Un script npm run test documenté dans le README (Règle 1), et son exécution intégrée comme étape avant chaque commit significatif (Règle 2) touchant à l’authentification, aux paiements, ou à une fonctionnalité cœur déjà testée.
Principe directeur
•	Un test qui ne peut jamais échouer (assertion triviale, mock qui retourne toujours vrai) est aussi inutile qu’une absence de test, mais donne une fausse impression de sécurité — pire, car elle est trompeuse. Préfère peu de tests qui vérifient un vrai comportement plutôt que beaucoup de tests qui ne testent rien.
PHASE 4 — PRICING & PAIEMENTS (Stripe + passerelles africaines, dont Sene-Pay)
Contexte
Le SaaS doit accepter à la fois des paiements internationaux par carte (Stripe) et des paiements locaux africains via Mobile Money et cartes locales (CinetPay, PayDunya, Sene-Pay, et/ou une passerelle équivalente comme PayTech ou FedaPay selon disponibilité dans le pays cible). C'est important parce que dans une large partie de l'Afrique francophone, la majorité des paiements grand public passent par Mobile Money (Wave, Orange Money, MTN MoMo, Moov...) plutôt que par carte bancaire — un SaaS qui n'accepte que Stripe perd l'essentiel de sa clientèle locale potentielle.
Limite à connaître avant de coder : contrairement à Stripe, les agrégateurs africains (CinetPay, PayDunya, Sene-Pay) n'ont généralement pas un système d'abonnement récurrent natif aussi robuste que Stripe Billing — ils sont conçus avant tout pour l'encaissement ponctuel (« collection »). Pour un SaaS facturé mensuellement, le renouvellement périodique devra être géré par ta propre logique applicative (relance manuelle ou semi-automatisée du paiement à échéance) plutôt que par un abonnement automatique côté provider, sauf si le provider choisi documente explicitement un mécanisme de prélèvement récurrent. Confirme ce point dans la documentation retenue pour ce provider (locale ou officielle, voir workflow ci-dessous) avant de t'engager sur l'architecture — ne pas supposer une parité totale avec Stripe Billing.
Instruction à l'IA
Avant de coder, pose les questions ci-dessous. Conçois une architecture de paiement à fournisseurs multiples avec un statut d'abonnement unifié côté Supabase, alimenté par n'importe quel provider utilisé.
Workflow obligatoire avant d'écrire la moindre ligne de code d'intégration (application de la Règle 7 aux paiements)
Pour chaque provider de paiement retenu (Stripe, CinetPay, PayDunya, Sene-Pay, ou autre), suis cet ordre strict, sans exception :
1.	Vérifie si un fichier docs/<provider>.md existe à la racine du projet (ex : docs/stripe.md, docs/cinetpay.md, docs/paydunya.md, docs/senepay.md).
2.	S'il existe, c'est la source de vérité : lis-le entièrement avant de coder. Tous les endpoints, paramètres, schémas de requête/réponse, mécanismes de signature de webhook, modèles tarifaires et flux de paiement utilisés dans le code doivent venir exactement de ce fichier — jamais d'un endpoint ou d'un payload reconstitué de mémoire ou par analogie avec un autre provider.
3.	S'il n'existe pas, consulte la documentation officielle actuelle du provider (docs.stripe.com, docs.cinetpay.com, developers.paydunya.com, ou équivalent) pour les noms d'endpoints, champs exacts et méthode de signature exacte — ces détails évoluent et ne doivent jamais être supposés de mémoire. Propose ensuite de consigner ce que tu viens d'apprendre dans un nouveau fichier docs/<provider>.md, pour que les tâches suivantes sur ce provider n'aient plus à repasser par la documentation en ligne.
4.	Ce n'est qu'après l'étape 2 ou 3 que tu écris le code d'intégration — jamais avant.
Cas particulier — Sene-Pay : si un fichier docs/senepay.md est présent dans le projet, il est la référence absolue pour cette intégration, au même titre que n'importe quel autre fichier docs/<provider>.md, mais avec une attention particulière car ce fichier provient directement de la documentation officielle de Sene-Pay fournie par l'utilisateur. Réutilise tels quels les exemples de requêtes et de réponses qu'il contient plutôt que d'en reconstruire des approximatifs, et respecte exactement les webhooks, le mécanisme de signature, le modèle tarifaire et le flux de paiement qui y sont décrits — ne les adapte ni ne les « améliore » par rapport à un autre provider déjà intégré dans le projet.
Questions obligatoires
•	Confirme le nombre de paliers tarifaires et leur contenu exact (prix, quotas, fonctionnalités incluses) — référence à la fiche Phase 0, à ajuster si besoin.
•	Quels marchés vises-tu en priorité ? (Cela détermine quelle(s) passerelle(s) africaine(s) a/ont du sens — ex. PayDunya couvre plusieurs pays d'Afrique de l'Ouest, CinetPay est positionné Afrique de l'Ouest et Centrale, Sene-Pay est positionné sur le Sénégal ; vérifie la couverture pays à jour via le workflow documentation ci-dessus avant de choisir.)
•	Stripe sera-t-il proposé en parallèle (pour la clientèle internationale/diaspora avec carte étrangère) ou uniquement la/les passerelle(s) africaine(s) ?
•	As-tu une préférence entre CinetPay, PayDunya, Sene-Pay, PayTech, ou un autre agrégateur, ou dois-je m'en tenir à une recommandation par défaut selon le marché visé ? (Limiter à un agrégateur principal plutôt que d'en intégrer plusieurs en parallèle réduit fortement la complexité de maintenance et de réconciliation — ne proposer un deuxième agrégateur que si un besoin précis le justifie. Si docs/senepay.md est déjà présent dans le projet, c'est un signal fort que Sene-Pay est le choix retenu.)
•	Stripe Checkout (page hébergée) ou Stripe Elements (formulaire intégré) si Stripe est utilisé ?
•	Faut-il un Billing Portal Stripe (gestion d'abonnement en self-service) pour les paiements Stripe ? Pour les paiements via agrégateur africain, comment veux-tu gérer le renouvellement — relance automatique par email/notification avant échéance, ou paiement manuel renouvelé par l'utilisateur à chaque période ?
•	Que se passe-t-il en cas d'échec de paiement ou de fin d'essai gratuit, pour chaque méthode de paiement (downgrade automatique, blocage d'accès, email de relance) ?
Architecture commune (s'applique quel que soit le provider)
•	Une table Supabase unique (ex. subscriptions) qui représente le statut d'abonnement de l'utilisateur, avec une colonne payment_provider (stripe, cinetpay, paydunya, senepay, etc.) — le reste de l'application (Phase 3, vérification des quotas) lit cette table sans jamais savoir quel provider a été utilisé. Si la Phase 4bis (tracking Meta) est prévue, ajouter dès cette table les colonnes meta_event_id, fbp, fbc (nullable) — elles seront renseignées au moment de l'initiation du paiement et relues par le webhook pour l'envoi à Meta CAPI, en particulier pour les paiements asynchrones (Mobile Money) où le contexte navigateur a disparu au moment où le webhook arrive.
•	Chaque provider a son propre module d'intégration (src/lib/payments/stripe.ts, src/lib/payments/cinetpay.ts, src/lib/payments/senepay.ts, etc.) mais tous exposent la même interface minimale côté code : initier un paiement, vérifier un webhook, mettre à jour subscriptions. Le contenu de chaque module découle du fichier docs/<provider>.md correspondant (ou de la documentation officielle si ce fichier n'existe pas encore) — jamais de deux modules qui copient la structure d'un provider voisin par supposition de similarité.
•	Le choix du moyen de paiement (carte internationale vs Mobile Money local) se fait sur la page /pricing, par exemple via un sélecteur ou une détection simple de la devise/localisation, à affiner selon réponse à la question 3.
•	Rappel d'architecture (déjà tranché en Phase 0, Bloc 7, question 20) : ce projet est une SPA Vite, qui n'a aucun runtime serveur natif. Tout le code qui initie un paiement avec une clé secrète, ou qui reçoit et vérifie un webhook, doit tourner dans l'environnement serveur choisi en Phase 0 — Supabase Edge Functions (Deno) ou fonctions Serverless de la plateforme de déploiement (Vercel/Netlify) — jamais dans le code React/Vite qui s'exécute dans le navigateur. Si ce choix n'a pas été fait en Phase 0, le clarifier maintenant avant d'écrire le premier webhook.
Ce qu'il faut livrer
Stripe (si retenu)
•	Intégration Stripe Checkout (ou Elements selon réponse) — boutons "Choisir ce plan" qui déclenchent la session de paiement.
•	Webhook Stripe (exécuté dans l'environnement serveur retenu en Phase 0 — Edge Function Supabase ou fonction Serverless de la plateforme de déploiement) documenté (checkout.session.completed, customer.subscription.updated, customer.subscription.deleted) pour synchroniser le statut d'abonnement dans Supabase.
•	Lien vers le Billing Portal si demandé, accessible depuis le dashboard.
Passerelle(s) africaine(s) (CinetPay / PayDunya / Sene-Pay / autre, selon réponses)
•	Initiation de paiement exécutée dans l'environnement serveur retenu en Phase 0 (Edge Function Supabase ou fonction Serverless) : appel à l'API du provider avec montant, devise, référence de commande/abonnement, et URL de notification (webhook) — jamais d'appel direct depuis le frontend avec une clé secrète, et jamais d'endpoint ou de payload inventé : voir le workflow documentation ci-dessus.
•	Redirection de l'utilisateur vers la page de paiement hébergée par le provider (l'utilisateur y choisit son canal : Wave, Orange Money, carte locale, etc.).
•	Webhook de notification signé : vérifier la signature (HMAC ou équivalent selon le provider, exactement comme documenté dans docs/<provider>.md ou, en son absence, dans la documentation officielle) avant de marquer un abonnement comme payé — ne jamais faire confiance à un simple retour de redirection côté navigateur, qui peut être falsifié. Ne marquer le paiement comme confirmé qu'après validation du webhook serveur.
•	Gestion de l'idempotence : un même webhook peut être renvoyé plusieurs fois par certains providers — vérifier qu'un paiement déjà traité n'est pas retraité une seconde fois.
•	Logique de renouvellement adaptée à la réponse de la question 6 (relance manuelle/notification, ou mécanisme récurrent si le provider le permet réellement — à confirmer via le workflow documentation, pas par supposition).
Commun
•	Page /pricing avec grille à 3 niveaux dans le même langage visuel que la landing (carte du milieu mise en avant, fond primaire, CTA accent, scale légèrement plus grand), avec le ou les moyens de paiement proposés clairement affichés (logos/labels Stripe, Mobile Money, Sene-Pay, etc.).
•	Toggle mensuel/annuel si pertinent, avec recalcul visuel du prix — en tenant compte que la devise affichée peut différer entre Stripe (souvent USD/EUR) et la passerelle africaine (souvent FCFA) ; clarifier ce point dans la fiche Phase 0 si pas déjà fait.
•	Affichage du plan actuel, du moyen de paiement utilisé, et de l'usage (quotas) dans le dashboard, cohérent avec les limites définies en Phase 3.
PHASE 4BIS — TRACKING META (PIXEL + CONVERSIONS API)
Quand lancer cette phase
Après la Phase 1 (landing en ligne, donc le Pixel a quelque chose à mesurer) et après la Phase 4 (paiements en place — Stripe et/ou passerelle africaine — donc CAPI peut capter les vrais événements de paiement et de renouvellement d'abonnement que le Pixel ne voit jamais). Si tu fais de la pub Meta avant d'avoir des paiements en place, tu peux activer le Pixel seul en attendant, mais le tracking ne sera complet qu'une fois CAPI branché sur le ou les webhooks de paiement.
Pourquoi le Pixel seul ne suffit pas
Le Pixel s'exécute dans le navigateur du visiteur — il est donc bloqué par les ad-blockers, par les restrictions de tracking de Safari/Firefox, et par les utilisateurs iOS qui refusent le tracking via ATT. Une part significative des conversions réelles n'est jamais vue par le Pixel seul. Le Conversions API (CAPI) envoie les mêmes événements directement depuis ton serveur, ce qui n'est jamais bloqué côté navigateur et permet en plus de capter des événements que le navigateur ne voit jamais (un paiement confirmé par webhook, qu'il vienne de Stripe ou d'une passerelle africaine, un renouvellement d'abonnement). Meta recommande d'utiliser les deux ensemble (« dual tracking ») avec une déduplication par identifiant d'événement partagé, pour avoir une vue complète sans compter les conversions deux fois.
Instruction à l'IA
Avant de coder, vérifie si un fichier docs/meta.md existe (Règle 7) : s'il est présent, les noms d'événements, le format exact du payload CAPI et la version d'API Graph à utiliser doivent en provenir plutôt que de ta mémoire. En son absence, consulte la documentation officielle Meta for Developers avant d'écrire le module CAPI — la version d'API Graph et certains champs evolvent régulièrement. Pose ensuite les questions ci-dessous, puis implémente le Pixel et le CAPI selon les réponses, avec déduplication correcte entre les deux.
Questions obligatoires
•	As-tu déjà un compte Meta Business Manager avec un Pixel créé, ou faut-il documenter sa création dans le README (Règle 1 du Rôle global) ?
•	Quels événements veux-tu suivre ? Au minimum, propose : PageView (toutes les pages), Lead (inscription/signup réussie), InitiateCheckout (clic sur un plan tarifaire), Purchase (paiement confirmé via webhook, quel que soit le provider — Stripe ou passerelle africaine), Subscribe (abonnement actif). Confirme ou ajuste cette liste selon ton funnel réel défini en Phase 0.
•	As-tu un site avec du trafic européen significatif ? Si oui, il faudra un bandeau de consentement qui bloque le Pixel et CAPI jusqu'à acceptation (voir section RGPD ci-dessous) — confirme si tu as déjà une solution de gestion du consentement (CMP) ou si l'IA doit en proposer une simple.
•	Le token d'accès CAPI et l'ID du Pixel seront stockés en variable d'environnement serveur — confirmes-tu que tu géreras leur création via le README étape par étape (Règle 1) avant que le code ne les utilise ?
Architecture technique à mettre en place
A. Pixel (côté client)
•	Charger le script Pixel Meta standard dans index.html, avec l'ID du Pixel en variable d'environnement (VITE_META_PIXEL_ID — jamais le token CAPI, qui est un secret serveur).
•	Déclencher PageView automatiquement à chaque changement de route (écouter React Router).
•	Déclencher les événements custom (Lead, InitiateCheckout) directement aux points d'interaction concernés : succès du formulaire de signup (Phase 2), clic sur un bouton de plan tarifaire (Phase 4).
•	Générer un event_id unique pour chaque événement (ex. UUID) au moment où il se déclenche côté client, et l'envoyer à la fois dans l'appel Pixel ET dans l'appel CAPI correspondant — c'est ce qui permet à Meta de dédupliquer (ne pas compter deux fois le même événement).
•	**Persister l'event_id du clic **InitiateCheckout : au moment où l'utilisateur initie un paiement (Phase 4), enregistrer cet event_id — avec les cookies fbp/fbc disponibles à cet instant — dans la ligne correspondante de la table de transaction/abonnement Supabase (la même que celle créée pour suivre le paiement en attente). C'est indispensable pour les paiements asynchrones (voir point B) : sans cette persistance, l'event_id n'existe que dans la mémoire du navigateur et disparaît dès que l'utilisateur quitte la page — ce qui est précisément ce qui se passe avec un paiement Mobile Money, où l'utilisateur valide depuis son téléphone plusieurs minutes après avoir quitté le site.
•	Si une CMP est utilisée : ne pas charger le script Pixel avant que l'utilisateur ait donné son consentement.
B. Conversions API (côté serveur)
•	Important — où tourne ce code : ce projet est une SPA Vite, qui n'a pas de runtime serveur par elle-même (Vite ne fait que servir des fichiers statiques au navigateur). Le module CAPI doit donc impérativement être écrit comme une Edge Function Supabase (Deno) ou comme une fonction Serverless de la plateforme de déploiement (ex. Vercel/Netlify), selon le choix déjà fait en Phase 0 (Bloc 7, question 20) — jamais comme une simple fonction .ts appelée depuis un composant React, qui s'exécuterait alors dans le navigateur et exposerait le token CAPI à n'importe qui.
•	Créer ce module dans l'environnement retenu (ex. supabase/functions/meta-capi/index.ts pour une Edge Function Supabase, ou api/meta-capi.ts pour une fonction Serverless Vercel) qui poste vers https://graph.facebook.com/v[version]/[PIXEL_ID]/events avec le token d'accès CAPI en en-tête, jamais exposé côté client.
•	Hasher en SHA-256 chaque identifiant personnel envoyé (email, téléphone) avant transmission — jamais de PII en clair dans l'appel API.
•	Envoyer le maximum d'identifiants disponibles par événement pour améliorer l'Event Match Quality : email haché, téléphone haché si disponible, external_id (ton propre ID utilisateur Supabase), et les cookies fbp/fbc du visiteur si capturés côté client et transmis au serveur avec la requête.
•	Déclencher Purchase et Subscribe depuis le webhook du provider de paiement (Stripe ou passerelle africaine, Phase 4 — lui-même déjà hébergé dans cet environnement serveur), pas depuis le frontend — c'est la seule source fiable pour un paiement réellement confirmé, quel que soit le moyen de paiement utilisé.
•	Cas synchrone (Stripe, carte) : le webhook arrive généralement pendant que le contexte de la session reste exploitable — réutiliser le même event_id que celui généré côté client au moment du clic InitiateCheckout.
•	Cas asynchrone (Mobile Money, paiement validé sur le téléphone plusieurs minutes après) : le webhook ne peut compter sur aucun contexte navigateur. Il doit donc relire l'event_id (et fbp/fbc s'ils existent) directement dans la ligne de transaction Supabase persistée par le frontend au moment de l'initiation (voir point A), en utilisant la référence de commande/transaction transmise dans le webhook pour retrouver la bonne ligne. Si aucun event_id n'est trouvé pour cette transaction (cas limite : webhook reçu sans qu'un InitiateCheckout ait été persisté), en générer un nouveau dédié à l'événement serveur plutôt que de bloquer l'envoi à Meta.
•	Gérer les échecs d'appel à l'API Meta avec retry (l'API Graph peut renvoyer des erreurs temporaires) — ne jamais faire échouer le traitement du webhook de paiement lui-même si l'envoi à Meta échoue.
C. Déduplication
•	Tout événement envoyé à la fois par le Pixel et par CAPI doit partager le même event_id. Documenter ce flux clairement dans le code (commentaires) pour que la prochaine fonctionnalité ajoutée respecte le même pattern.
D. RGPD / consentement (si trafic européen)
•	Si une CMP est en place : le script Pixel ne se charge qu'après consentement, ET le serveur doit vérifier le statut de consentement de l'utilisateur avant d'envoyer un événement CAPI le concernant — un consentement bloqué côté navigateur n'empêche pas un appel serveur non vérifié.
•	Ne jamais envoyer un identifiant (email, téléphone) pour un utilisateur qui n'a pas consenti au tracking marketing, même si cette donnée existe dans ta base.
•	Documenter dans le README (Règle 1) la nécessité de mentionner l'usage de Meta CAPI dans la politique de confidentialité du produit.
Ce qu'il faut livrer
•	Script Pixel chargé conditionnellement selon consentement.
•	Module CAPI serveur réutilisable, avec hashing SHA-256 et gestion d'erreur/retry.
•	Événements PageView, Lead, InitiateCheckout câblés côté client avec event_id partagé.
•	Événements Purchase/Subscribe câblés depuis le ou les webhooks de paiement côté serveur (Stripe et/ou passerelle africaine).
•	README mis à jour (Règle 1 du Rôle global) avec : comment créer le Pixel et le token CAPI dans Meta Business Manager, où mettre les variables d'environnement résultantes, et comment vérifier dans Meta Events Manager que les événements arrivent bien en "Browser + Server" (preuve que Pixel et CAPI fonctionnent ensemble avec déduplication correcte).
•	Commit + push (Règle 2 du Rôle global) une fois la phase testée et fonctionnelle.
**Consentement et conformité RGPD (si le public cible Phase 0 inclut l’Europe) : **Le tracking Meta (Pixel + CAPI) ne peut pas se déclencher avant un consentement explicite si une partie du public visé est en Europe — sans cette étape, l’intégration Meta devient un risque légal plutôt qu’un simple choix technique.
•	Demander explicitement : le public cible défini en Phase 0 inclut-il des visiteurs européens, ou le SaaS cible-t-il exclusivement un marché hors RGPD (ex. : Afrique francophone uniquement) ? La réponse détermine si cette section s’applique.
•	Si oui : implémenter une bannière de consentement cookies (acceptation explicite, pas de case pré-cochée) avant tout chargement du Pixel Meta — le script de tracking ne doit pas s’exécuter avant ce consentement.
•	Documenter dans le README (Règle 1) la nécessité de mettre à jour la politique de confidentialité avec la mention du tracking Meta et des catégories de données transmises via CAPI.
PHASE 4TER — ESPACE ADMIN (réservé au(x) développeur(s)/propriétaire(s) du SaaS)
Instruction à l’IA
Cette phase se lance une fois la Phase 4 (paiements) terminée et validée — c’est le moment où les trois sources de données que l’admin doit agréger existent enfin toutes : comptes utilisateurs (Phase 2), données métier cœur (Phase 3), abonnements et transactions (Phase 4). Construire l’admin avant reviendrait à reprendre ce travail à chaque nouvelle source de données — pose toutes les questions ci-dessous avant d’écrire le moindre composant.
Questions obligatoires
•	Au-delà des métriques génériques proposées plus bas (utilisateurs, abonnements, CA), y a-t-il une métrique propre à la catégorie de produit définie en Phase 0 Bloc 1 que tu veux absolument suivre (ex. : taux de réponse pour un CRM, volume de stockage pour un outil de fichiers, taux de complétion pour un outil de productivité) ?
•	Combien de comptes admin prévois-tu (toi seul, ou toi plus quelques collaborateurs de confiance) ? Cela détermine si un simple champ booléen suffit ou s’il faut une vraie table de rôles.
•	As-tu besoin d’actions correctives depuis l’admin (suspendre un compte, rembourser manuellement, modifier le palier tarifaire d’un utilisateur), ou l’admin reste-t-il une vue en lecture seule dans un premier temps ?
•	Veux-tu un export des données (CSV) depuis les tableaux admin, pour une analyse plus poussée dans un tableur ?
Sécurité de l’espace admin — non négociable
Un espace admin mal protégé est la faille la plus coûteuse possible : il donne accès à l’ensemble des données de tous les utilisateurs en un seul point d’entrée. Les règles suivantes s’appliquent sans exception :
•	Ajouter une colonne role (ou une table dédiée selon la réponse à la question 2 ci-dessus) sur la table des utilisateurs Supabase, avec une valeur par défaut non-admin — aucun compte n’est admin par accident.
•	Toute table consultée par l’admin doit avoir une policy RLS Supabase qui vérifie ce rôle côté serveur — la vérification ne doit jamais se faire uniquement côté client (un simple if (user.role === ‘admin’) dans le composant React peut être contourné en modifiant le code dans le navigateur, ce n’est qu’un confort d’affichage, jamais une protection réelle).
•	La route /admin est protégée par un composant dédié (AdminRoute, distinct du ProtectedRoute de la Phase 2) qui vérifie le rôle en plus de la session — un utilisateur connecté mais non-admin doit être redirigé, jamais voir un écran vide ou une erreur qui révèle la structure de l’interface admin.
•	Si des actions correctives sont demandées (question 3 ci-dessus) : toute action qui modifie les données d’un autre utilisateur (suspension, remboursement) passe par une fonction serveur (Edge Function) qui revérifie le rôle admin côté serveur avant d’exécuter l’action — jamais un appel direct depuis le client qui modifierait la table en s’appuyant uniquement sur la policy RLS.
•	Documenter dans le README (Règle 1) comment promouvoir manuellement ton propre compte au rôle admin la première fois (requête SQL à exécuter une seule fois dans l’éditeur Supabase) — ce premier compte admin ne peut pas se créer lui-même depuis l’interface, pour éviter qu’un utilisateur normal ne puisse s’auto-promouvoir.
Métriques par défaut (toujours incluses, quelle que soit la catégorie de produit)
•	Vue d’ensemble utilisateurs : nombre total d’inscrits, nouveaux inscrits sur 7/30 jours, taux d’activation (utilisateurs ayant réalisé l’action cœur définie en Phase 0 Bloc 3 au moins une fois).
•	Vue d’ensemble abonnements et revenu : répartition des comptes par palier tarifaire (Phase 0 Bloc 5), revenu récurrent mensuel (MRR), nombre de nouveaux abonnements et de désabonnements (churn) sur la période, ventilé par méthode de paiement (Stripe vs passerelle africaine) pour repérer si l’un des deux canaux sous-performe.
•	Liste des utilisateurs : table consultable avec recherche et filtre (par palier, par date d’inscription, par statut actif/inactif), menant vers une fiche détail par utilisateur (infos de compte, historique de paiement, usage de la fonctionnalité cœur).
•	Santé technique de base : nombre d’échecs de paiement récents et nombre d’erreurs de webhook non résolues (Phase 4) — pour repérer un problème d’intégration avant qu’il n’affecte beaucoup d’utilisateurs.
Métriques spécifiques par catégorie de produit (sélectionner selon la catégorie de Phase 0 Bloc 1)
•	CRM : nombre de contacts/prospects créés, taux de conversion prospect → client, activité par utilisateur (nombre d’actions/semaine) pour repérer les comptes inactifs à risque de désabonnement.
•	Outil de productivité : nombre moyen d’éléments créés par utilisateur (tâches, projets, documents), taux de complétion, fréquence d’usage (jours actifs/semaine).
•	Plateforme de contenu : volume de contenu publié, engagement moyen (vues, interactions) si applicable, répartition du stockage utilisé par utilisateur.
•	Outil financier : volume total transactionnel traité par les utilisateurs (distinct du revenu du SaaS lui-même), nombre de documents/factures générés, répartition par devise si plusieurs marchés.
•	Marketplace : nombre de transactions entre utilisateurs, volume d’échange (GMV), répartition acheteurs/vendeurs actifs, litiges ou signalements en attente.
•	Outil interne d’équipe : nombre d’équipes/organisations actives, nombre moyen de membres par équipe, fonctionnalités les plus utilisées pour prioriser les futurs développements.
•	Si la catégorie ne correspond à aucune de ces lignes, ou si la réponse à la question 1 ci-dessus a identifié une métrique propre au produit : construire les requêtes Supabase nécessaires pour cette métrique spécifique plutôt que de se limiter aux métriques génériques.
Architecture du dashboard admin
•	Layout distinct du dashboard utilisateur (Phase 3) : même design system (cohérence du preset Phase 0 Bloc 4) mais une navigation propre à l’admin (/admin, /admin/users, /admin/billing), jamais mélangée aux routes utilisateur.
•	Vue d’ensemble (/admin) : cartes de métriques clés en haut (utilisateurs, MRR, churn), graphique d’évolution sur les 30 derniers jours, suivi des métriques par défaut et spécifiques définies ci-dessus.
•	Toute requête de métrique agrégée (comptage, somme, moyenne) doit être calculée côté serveur (vue SQL Supabase ou fonction Edge) plutôt que de récupérer toutes les lignes brutes côté client pour les recalculer en JavaScript — un SaaS avec des milliers d’utilisateurs ne doit pas faire exploser le temps de chargement de l’admin.
•	Si un export CSV a été demandé (question 4 ci-dessus) : bouton d’export par table, générant le fichier côté client à partir des données déjà chargées (pas de nouvelle requête serveur dédiée à l’export, sauf si le volume de données dépasse ce qui est raisonnable à charger pour l’affichage).
Ce qu’il faut livrer
•	Migration Supabase (Règle 5) ajoutant le rôle admin et les policies RLS associées, documentée dans le README.
•	Composant AdminRoute et structure de routes /admin/*.
•	Vue d’ensemble, liste des utilisateurs avec fiche détail, et les métriques spécifiques à la catégorie de produit retenue.
•	README mis à jour (Règle 1) avec la procédure pour promouvoir le premier compte admin.
•	Tests (Phase 3bis) couvrant au minimum : un utilisateur non-admin ne peut pas accéder à /admin, et les policies RLS bloquent bien l’accès aux données admin pour un rôle non autorisé.
•	Commit + push (Règle 2) une fois la phase testée et fonctionnelle.
PHASE 5 — POLISH, RESPONSIVE & DÉPLOIEMENT
Instruction à l'IA
Pose les questions ci-dessous, puis fais une passe complète de finition sur l'ensemble du produit (Phases 1 à 4bis réunies).
Questions obligatoires
•	As-tu déjà une plateforme de déploiement prévue (Vercel, Netlify, autre) ou faut-il en recommander une ?
•	Y a-t-il des pages légales obligatoires à générer (CGU, politique de confidentialité, mentions légales) ou les as-tu déjà ? (Note : si la Phase 4bis a été faite, la politique de confidentialité doit mentionner l'usage de Meta CAPI.)
•	Faut-il un mode sombre/clair en plus du thème du preset, ou le preset choisi reste l'unique thème ?
Ce qu'il faut livrer
•	Audit responsive complet (mobile, tablette, desktop) sur chaque écran produit dans les Phases 1-4bis.
•	Vérification de cohérence visuelle inter-phases (mêmes tokens de couleur, typographie, rayons, easing partout — aucune dérive).
•	Nettoyage : suppression de tout code mort, tout console.log, toute donnée de test codée en dur.
•	SEO de base sur la landing (title, meta description, Open Graph) cohérents avec l'identité de marque définie en Phase 0.
•	Vérification finale du tracking Meta en environnement de production (Events Manager affiche bien "Browser + Server" sur les événements clés, pas seulement en local/dev).
•	Instructions de déploiement claires (variables d'environnement Supabase/Stripe/passerelle(s) africaine(s)/Meta à configurer côté plateforme).
PHASE 6 — AUDIT DE SÉCURITÉ COMPLET
Quand lancer cette phase
•	Après la Phase 2 (authentification) : un premier audit centré sur Auth + RLS, avant de construire le dashboard sur des fondations potentiellement fragiles.
•	Après la Phase 4 (paiements) : un audit centré sur les webhooks de paiement (Stripe et passerelles africaines), les secrets, et le rate limiting.
•	Obligatoirement avant tout déploiement en production (fin de Phase 5) : audit complet, checklist entière.
Ce n'est pas une phase de construction — ne pas écrire de nouveau code ici sauf pour corriger les failles trouvées. C'est une phase de lecture, de diagnostic, puis de correction ciblée.
Instruction à l'IA
Tu effectues un audit de sécurité complet d'une application web vibe-codée. "Vibe-codée" signifie que cette application a été principalement construite en utilisant des assistants de code IA (Claude, Cursor, Copilot ou similaires). Ces outils produisent du code fonctionnel rapidement mais introduisent régulièrement des failles de sécurité qu'un développeur humain détecterait habituellement. Ton travail est de trouver chacune de ces failles.
Passe 1 — Découverte
Lis l'intégralité de la base de code avant de produire des conclusions. Construis un modèle mental de l'architecture : framework, base de données, fournisseur d'authentification, couche API, configuration de déploiement. Identifie chaque point d'entrée (pages, routes API, actions serveur, webhooks, tâches cron). Trace le flux de données depuis l'entrée utilisateur jusqu'à la base de données et retour.
Passe 2 — Audit systématique
Parcours chaque section de la checklist ci-dessous. Pour chaque élément, rends l'un de ces quatre verdicts :
•	✅ PASSE — La base de code gère cela correctement. Cite le fichier/ligne.
•	❌ ÉCHOUÉ — Une vulnérabilité existe. Documente-la complètement (voir format de sortie).
•	⚠️ PARTIEL — Couverture partielle mais des lacunes subsistent. Explique ce qui manque.
•	⬚ N/A — Non applicable à cette base de code. Indique brièvement pourquoi.
Ne saute aucun élément. Ne résume pas des groupes d'éléments ensemble — chaque élément reçoit son propre verdict explicite. Si tu es incertain au sujet d'une conclusion, signale-la ⚠️ PARTIEL et explique ce que tu aurais besoin de vérifier.
Format de sortie pour chaque conclusion ❌ ÉCHOUÉ
															CONCLUSION #[numéro]

															Sévérité   : CRITIQUE / HAUTE / MOYENNE / BASSE

															Catégorie  : (ex. Exposition de Secret, RLS Manquant, etc.)

															Emplacement: chemin/fichier.ts:numéro_ligne

															CWE        : CWE-XXX (Nom)

															

															Ce qui ne va pas :

															[Description en langage clair de la vulnérabilité]

															

															Pourquoi c'est important :

															[Ce qu'un attaquant pourrait réellement faire avec ça]

															

															Le code vulnérable :

															[extrait de code exact]

															

															La correction :

															[extrait de code corrigé, prêt à copier/coller]

															

															Effort : ~[X] minutes
Checklist d'audit
Section 1 — Variables d'environnement et gestion des secrets
•	1.1 Secrets codés en dur : cherche clés API, tokens, mots de passe, chaînes de connexion, URLs de webhook en dur dans le code. Patterns à grep : sk_live_, sk_test_, sk-, pk_live_, Bearer, eyJ (préfixe JWT base64), ghp_, gho_, github_pat_, xoxb-, xoxp- (Slack), AKIA (AWS), toute chaîne alphanumérique de 32+ caractères entre guillemets.
•	**1.2 Couverture *.gitignore : .env, .env.local, .env.production, .env.local doivent tous y figurer. Vérifie aussi l'historique git pour d'anciens .env commités (même supprimés depuis, les secrets dans l'historique restent exposés).
•	1.3 Fuites de préfixe public : les secrets serveur ne doivent jamais avoir de préfixe public de framework (VITE_ pour Vite, NEXT_PUBLIC_ pour Next.js, REACT_APP_ pour CRA). Ne doivent jamais être préfixées en public : clés de rôle service Supabase/base de données, clés secrètes Stripe, clés API/secrets des passerelles africaines (CinetPay, PayDunya, ou autre), clés API OpenAI/Anthropic, identifiants SMTP, le token d'accès Meta Conversions API, toute clé donnant un accès en écriture/admin. (L'ID du Pixel Meta, lui, est public par nature et peut être préfixé VITE_ — seul le token CAPI est sensible.)
•	1.4 Fuites console/erreurs : cherche les console.log, console.error, et composants de frontière d'erreur qui pourraient afficher des variables d'environnement ou secrets côté client.
•	1.5 Exposition des artefacts de build : vérifie si les source maps sont activées en production (sourcemap dans la config Vite). Les source maps permettent de reconstituer le code source original, secrets inclus.
•	1.6 Validation au démarrage : l'app doit échouer rapidement si des variables d'environnement requises manquent, plutôt que tourner silencieusement avec des valeurs undefined.
Section 2 — Sécurité de la base de données (Supabase)
•	2.1 RLS activée : Row Level Security doit être activé sur CHAQUE table du schéma public, y compris celles créées via migrations ou l'éditeur SQL. Une seule table non protégée expose toutes ses données à quiconque possède la clé anon.
•	2.2 Les policies RLS existent : une table avec RLS activé mais sans aucune policy retourne silencieusement des résultats vides pour toutes les requêtes — ça ressemble à un bug, pas à un problème de sécurité, et c'est une erreur fréquente de l'IA. Vérifie qu'il y a au moins des policies SELECT et INSERT.
•	**2.3 Clauses **WITH CHECK : toutes les policies INSERT et UPDATE doivent inclure WITH CHECK. Sans ça sur INSERT, un utilisateur peut insérer des lignes avec n'importe quel user_id (usurpation). Sans ça sur UPDATE, il peut changer le user_id d'une ligne pour en voler la propriété.
•	2.4 Source d'identité des policies : les policies doivent utiliser auth.uid(), jamais auth.jwt()->'user_metadata' (modifiable par l'utilisateur final authentifié, donc non fiable).
•	**2.5 Isolation de la clé **service_role : cette clé contourne tout le RLS. Elle ne doit jamais apparaître côté client, ni être importée dans des composants — uniquement côté serveur où le contournement est réellement nécessaire (admin, webhooks).
•	2.6 Policies des buckets de stockage : si Supabase Storage est utilisé, vérifie que les buckets ont des policies RLS — par défaut, ils sont accessibles publiquement.
•	2.7 Injection SQL : cherche les requêtes SQL brutes par concaténation de chaînes au lieu de requêtes paramétrées. Le client Supabase standard est sécurisé par défaut, mais les appels .rpc() bruts ou les requêtes pg/postgres.js peuvent ne pas l'être.
•	**2.8 Fonctions **SECURITY DEFINER : ces fonctions s'exécutent avec les privilèges du créateur (souvent superuser), pas de l'appelant. Vérifie qu'elles n'exposent pas de données et ne contournent pas le RLS de façon non maîtrisée.
Section 3 — Authentification et gestion des sessions
•	3.1 Le middleware d'auth existe et s'exécute sur les routes protégées, avec un matcher couvrant tous les chemins nécessaires.
•	3.2 Routage par défaut en refus : préfère une liste blanche de routes publiques (refus par défaut) à une liste noire de routes protégées — les nouvelles routes sont alors protégées automatiquement.
•	**3.3 getUser() vs **getSession() (Supabase) : les opérations serveur sensibles doivent utiliser supabase.auth.getUser() (valide le JWT auprès des serveurs Supabase), pas supabase.auth.getSession() (lecture locale sans vérification).
•	3.4 Gestionnaire de callback auth : la route /auth/callback (ou équivalent) doit échanger correctement les codes pour des sessions, gérer les erreurs proprement, et ne jamais exposer de tokens dans les URLs ou les logs.
•	3.5 Stockage de session : tokens stockés dans des cookies httpOnly, jamais dans localStorage/sessionStorage (accessibles à tout JS de la page, y compris en cas de XSS).
•	3.6 Routes API protégées : chaque route gérant des données utilisateur doit vérifier l'authentification avant traitement. Cherche en particulier les routes ajoutées tardivement qui auraient pu sauter cette vérification.
•	3.7 Sécurité OAuth : URLs de callback validées, paramètre state utilisé pour la protection CSRF, tokens gérés de façon sécurisée.
•	3.8 Flux de réinitialisation de mot de passe : tokens à expiration, à usage unique, transmis de façon sécurisée.
Section 4 — Validation côté serveur
•	4.1 Validation par schéma : chaque route API/action serveur valide ses entrées avec une librairie de schéma (Zod, Yup, Valibot, ArkType...) côté serveur. La validation frontend est de l'UX, pas de la sécurité.
•	4.2 Identité depuis la session : l'identité utilisateur pour une opération d'écriture doit toujours venir de la session/JWT authentifié, jamais d'un champ du corps de requête comme { userId: "..." } — un attaquant peut envoyer n'importe quel userId.
•	4.3 Nettoyage des entrées : contenu utilisateur rendu en HTML doit être nettoyé contre le XSS. Cherche dangerouslySetInnerHTML, v-html, [innerHTML], ou des template literals non échappés.
•	4.4 Application des méthodes HTTP : les opérations qui modifient l'état utilisent POST/PUT/PATCH/DELETE, jamais GET (déclenchable par balises image, prefetching, extensions navigateur).
•	4.5 Fuites d'informations dans les erreurs : les réponses d'erreur ne doivent pas fuiter de traces de pile, erreurs SQL, chemins de fichiers, ou noms de variables d'environnement.
•	4.6 Vérification de signature de webhook : tout webhook reçu (Stripe, CinetPay, PayDunya, GitHub...) doit valider sa signature avant traitement, sinon n'importe qui peut envoyer de faux événements — y compris de faux événements de paiement confirmé.
Section 5 — Sécurité des dépendances et packages
•	5.1 Résultats d'audit : lance npm audit (ou équivalent selon le gestionnaire) et rapporte les vulnérabilités groupées par sévérité.
•	5.2 Packages hallucinés : vérifie les packages installés avec des téléchargements anormalement bas, des dates de publication très récentes, ou des noms approximants des packages connus — les outils IA hallucinent parfois des noms de packages que des attaquants exploitent ensuite.
•	5.3 Lockfile commité : package-lock.json/pnpm-lock.yaml/etc. doit être commité, sinon les installs peuvent silencieusement récupérer des versions différentes.
•	5.4 Packages obsolètes : surtout les librairies d'auth, de cryptographie, et les versions de framework avec CVE connues.
•	5.5 Dépendances inutilisées : packages présents dans package.json mais jamais importés — surface d'attaque inutile.
Section 6 — Limitation de débit (rate limiting)
•	6.1 Opérations coûteuses : toute route appelant une API externe payante (OpenAI, Anthropic, Stripe, email/SMS...) doit être rate-limitée, sinon un attaquant peut faire exploser la facture.
•	6.2 Endpoints d'auth : connexion, inscription, reset de mot de passe, OTP doivent être rate-limités contre le brute-force et le credential stuffing.
•	6.3 Vérification de l'implémentation : le rate limiting doit être appliqué côté serveur (pas juste un debounce frontend) avec un stockage fiable (Redis, Upstash...), pas un stockage en mémoire qui se réinitialise à chaque déploiement.
Section 7 — Configuration CORS
•	7.1 CORS des routes API : pour les routes destinées uniquement à ton propre frontend, vérifie que les en-têtes CORS restreignent l'accès à tes domaines. Cherche Access-Control-Allow-Origin: * sur des endpoints sensibles.
•	7.2 Mode credentials : Access-Control-Allow-Credentials: true ne doit être associé qu'à des origines spécifiques, jamais à un joker.
Section 8 — Sécurité des téléchargements de fichiers
•	8.1 Validation côté serveur : type et taille de fichier validés côté serveur (vérifier le type MIME réel, pas juste l'extension — un fichier malveillant peut être renommé en .jpg).
•	8.2 Permissions de stockage : fichiers publics (photos de profil) et privés (documents) doivent avoir des policies différentes.
•	8.3 Prévention d'exécution : les fichiers téléchargés ne doivent pas être exécutables, et les répertoires d'upload ne doivent pas être dans le chemin exécutable de la racine web.
Rapport final attendu
1. Évaluation de la posture de sécurité — un verdict global :
•	🔴 CRITIQUE — exposition active de données ou contournement d'auth. Tout arrêter et corriger maintenant.
•	🟠 À AMÉLIORER — lacunes significatives exploitables.
•	🟡 ACCEPTABLE — problèmes mineurs, pas de risque immédiat.
•	🟢 SOLIDE — bien sécurisé, conclusions seulement informationnelles.
Inclure un paragraphe de résumé exécutif justifiant l'évaluation.
2. Conclusions critiques et hautes — listées à part pour visibilité immédiate, même si elles apparaissent déjà section par section.
3. Victoires rapides — corrections de moins de 10 minutes chacune mais à fort impact.
4. Plan de remédiation priorisé — liste numérotée de toutes les conclusions, triées par sévérité puis par effort, avec temps de correction estimé pour chacune.
5. Ce qui est déjà bien fait — les mesures de sécurité correctement implémentées, pour ne pas les casser accidentellement par la suite.
6. Résumé compact de la checklist — un verdict par élément en une ligne, ex. 1.1 ✅ 1.2 ✅ 1.3 ❌ 1.4 ✅ 1.5 ⚠️ 1.6 ⬚ ...
**Limite de débit (rate limiting) — vérification proactive, pas seulement à l’audit : **La checklist d’audit ci-dessus vérifie déjà la présence de rate limiting, mais cette protection doit être mise en place dès l’écriture du code serveur (Phase 2 pour l’auth, Phase 4 pour les webhooks), pas découverte comme manquante seulement au moment de l’audit final.
•	Toute fonction serveur exposée publiquement (Edge Function ou Serverless) qui accepte une requête non authentifiée (webhook de paiement, endpoint de connexion) doit avoir une limite de débit par IP ou par identifiant, pour empêcher un abus par appels répétés.
•	Pour Supabase Edge Functions : documenter dans le README (Règle 1) la configuration de rate limiting choisie (au niveau de la fonction ou via un middleware dédié), avec un seuil cohérent pour un usage légitime (ex. : quelques tentatives de connexion par minute, pas une par seconde).
•	Vérifier que ce point n’est jamais reporté « à la Phase 6 » par défaut : chaque endpoint sensible doit déjà avoir sa limite de débit au moment où il est écrit, l’audit ne fait que vérifier qu’elle est bien en place.
Principes directeurs de l'audit
•	Lis l'intégralité de la base de code avant de conclure quoi que ce soit.
•	Sois minutieux mais pratique : priorise les vulnérabilités réelles et exploitables plutôt que les préoccupations purement théoriques. Si une conclusion suppose une capacité d'attaquant spécifique et inhabituelle, note-le dans l'évaluation de sévérité.
•	Ne regroupe jamais plusieurs éléments de la checklist dans une seule réponse — chaque élément a son verdict explicite.
