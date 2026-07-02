ANNEXE A — PRESETS ESTHÉTIQUES (référence pour Phase 0, Bloc 4, question 12)
Preset A — "Tech Organique" (Boutique Clinique)
•	Identité : pont entre un laboratoire de recherche biologique et un magazine de luxe avant-gardiste.
•	Palette : Mousse #2E4036 (Primaire), Argile #CC5833 (Accent), Crème #F2F0E9 (Fond), Charbon #1A1A1A (Texte/Sombre).
•	Typographie : Titres "Plus Jakarta Sans" + "Outfit" (tracking serré). Dramatique : "Cormorant Garamond" italique. Données : "IBM Plex Mono".
•	Ambiance image : forêt sombre, textures organiques, mousse, fougères, verrerie de laboratoire.
•	Pattern titre hero : "[Nom concept] est le" (sans gras) / "[Mot puissant]." (serif italique massif).
Preset B — "Luxe de Minuit" (Éditorial Sombre)
•	Identité : club privé de membres rencontre l'atelier d'un horloger haut de gamme.
•	Palette : Obsidienne #0D0D12 (Primaire), Champagne #C9A84C (Accent), Ivoire #FAF8F5 (Fond), Ardoise #2A2A35 (Texte/Sombre).
•	Typographie : Titres "Inter" (tracking serré). Dramatique : "Playfair Display" italique. Données : "JetBrains Mono".
•	Ambiance image : marbre sombre, accents dorés, ombres architecturales, intérieurs de luxe.
•	Pattern titre hero : "[Nom aspirationnel] rencontre" (sans gras) / "[Mot précision]." (serif italique massif).
Preset C — "Signal Brutaliste" (Précision Brute)
•	Identité : une salle de contrôle du futur — aucune décoration, densité d'information pure.
•	Palette : Papier #E8E4DD (Primaire), Rouge Signal #E63B2E (Accent), Blanc cassé #F5F3EE (Fond), Noir #111111 (Texte/Sombre).
•	Typographie : Titres "Space Grotesk" (tracking serré). Dramatique : "DM Serif Display" italique. Données : "Space Mono".
•	Ambiance image : béton, architecture brutaliste, matériaux bruts, industriel.
•	Pattern titre hero : "[Verbe direct] le" (sans gras) / "[Nom système]." (serif italique massif).
Preset D — "Clinique Vapor" (Biotech Néon)
•	Identité : un laboratoire de séquençage génomique dans un nightclub de Tokyo.
•	Palette : Vide Profond #0A0A14 (Primaire), Plasma #7B61FF (Accent), Fantôme #F0EFF4 (Fond), Graphite #18181B (Texte/Sombre).
•	Typographie : Titres "Sora" (tracking serré). Dramatique : "Instrument Serif" italique. Données : "Fira Code".
•	Ambiance image : bioluminescence, eau sombre, reflets néon, microscopie.
•	Pattern titre hero : "[Nom tech] au-delà de" (sans gras) / "[Mot frontière]." (serif italique massif).
ANNEXE B — RAPPELS DE PRINCIPE (à garder en tête à chaque phase)
"Ne construis pas un site web ; construis un instrument digital. Chaque scroll, chaque clic, chaque état de chargement doit sembler intentionnel et pensé. Éradique tous les patterns génériques d'IA — visuels ET architecturaux."
"100 lignes de code bien structurées valent mieux que 1000 lignes mal organisées." L'objectif n'est jamais de réduire les fonctionnalités pour réduire le code — c'est d'obtenir exactement la même puissance fonctionnelle avec beaucoup moins de volume. Avant d'ajouter du code, cherche toujours la version la plus courte qui fait exactement la même chose, jamais une version qui en fait moins.
•	Ne jamais sauter l'étape de questions, même si la réponse te paraît évidente.
•	Ne jamais avancer à la phase suivante sans validation explicite de l'utilisateur.
•	Toujours vérifier l'état réel du projet (fichiers, dépendances, schéma Supabase) avant d'écrire du code, plutôt que de supposer.
•	Toujours garder la cohérence visuelle du preset choisi en Phase 0 à travers TOUTES les phases — aucune dérive de couleur, police, ou rayon de bordure.
•	Toute action hors-code (Supabase, Stripe, passerelle(s) africaine(s), déploiement, OAuth...) doit être documentée étape par étape dans le README avant d'être simplement mentionnée à l'oral dans le chat.
•	Chaque tâche de code terminée se termine par un commit + push Git, avec un message clair, jamais regroupé avec une tâche non liée.
•	La vitesse de construction ne doit jamais se faire au prix de la sécurité : la Phase 6 n'est pas optionnelle, surtout pour tout ce qui touche à l'auth (Phase 2), aux données utilisateur (Phase 3) et aux paiements (Phase 4).
•	Aucune fonctionnalité significative n’est considérée terminée sans ses tests (Phase 3bis) — une régression silencieuse détectée une semaine plus tard coûte toujours plus cher que le temps investi à écrire le test au bon moment.
•	Toute évolution du schéma Supabase passe par une migration versionnée (Règle 5), jamais par une modification directe non tracée — et toute tâche significative reste réversible par un commit propre (Règle 6).
•	La performance (Règle 3) et la résilience réseau (Règle 4) ne sont pas des finitions de Phase 5 : elles se construisent dès la première ligne de code, parce que le public cible utilise des connexions mobiles instables.
•	L’espace admin (Phase 4ter) n’est jamais protégé uniquement côté client : chaque table et chaque action accessible depuis “/admin” repose sur une vérification de rôle côté serveur (policy RLS ou fonction Edge), sans exception, même pour un simple affichage en lecture.

