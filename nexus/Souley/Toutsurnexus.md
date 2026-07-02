Reponse : Bloc 1 — Identité fondamentale du produit

Nom du SaaS : NEXUS

Mission en une phrase : NEXUS transforme l'activité quotidienne des petits commerçants et artisans ouest-africains — vendue et gérée sur WhatsApp et en cash/mobile money — en comptabilité automatique et en historique finançable, pour leur donner accès au crédit et à la croissance sans qu'ils changent une seule de leurs habitudes.

Le problème précis résolu, et l'alternative actuelle : Un commerçant ouest-africain (boutique de quartier, revendeuse en gros/demi-gros, artisan, petit importateur) gère aujourd'hui son activité de trois façons, souvent en même temps :

Le cahier papier ou rien du tout — aucune vue consolidée de ce qui rentre, sort, est dû ou est en stock ; les pertes et les fraudes internes (vol par un employé, oubli de créance) sont invisibles jusqu'à ce qu'il soit trop tard. WhatsApp non structuré — commandes, prix, relances clients, tout se noie dans des fils de discussion illisibles au bout de trois mois. Un logiciel de gestion classique (type Excel ou appli de caisse) — abandonné en quelques semaines car il demande une double saisie que personne n'a le temps de faire entre deux clients.

Conséquence directe et mesurable : sans historique fiable, ce commerçant est invisible pour le système financier. Une banque ou une IMF ne peut pas évaluer son risque, donc ne prête pas, ou prête à des taux dissuasifs avec garanties impossibles à réunir. Il finance sa croissance sur fonds propres, au rythme le plus lent possible, ou recourt à des tontines et prêteurs informels à taux élevé.

Catégorie : Outil financier pour PME (Business Financial Operating System) — à la croisée de la comptabilité automatisée, du CRM commercial léger et de l'infrastructure de scoring de crédit. Cette catégorie hybride structure directement le futur dashboard : il ne sera pas un simple tableau de comptabilité, mais un centre de pilotage "santé financière + accès au financement".

Bloc 2 — Marque et identité visuelle

Logo : Logo est disponible dans LOGO-NEXUS.md Couleurs de marque : aucune charte imposée. Le preset esthétique du Bloc 4 définira entièrement la palette — mais avec une contrainte non négociable : le produit doit inspirer confiance financière (donc éviter les palettes trop "startup fintech occidentale" froides) tout en restant crédible pour un banquier. On ira vers une direction chaleureuse mais sérieuse plutôt que gadget.

Bloc 3 — Public et fonctionnalités cœur

Utilisateur cible précis : Commerçant ou artisan indépendant, 25-45 ans, en zone urbaine ou péri-urbaine (Bamako, Abidjan, Dakar, Ouagadougou, Cotonou en priorité), gérant seul ou avec 1 à 5 employés/apprentis. Niveau technique bas à moyen : smartphone Android d'entrée de gamme, usage intensif de WhatsApp, connectivité intermittente (2G/3G par intermittence), pas de compte bancaire actif mais compte mobile money quasi systématique. Chiffre d'affaires mensuel typique : entre 300 000 et 5 000 000 FCFA. Secteurs prioritaires au lancement : commerce général/boutique, textile et prêt-à-porter, quincaillerie, alimentation en gros/demi-gros — secteurs à rotation de stock rapide et flux de trésorerie fréquents, donc les plus riches en signal pour le scoring.

Les 3 à 5 fonctionnalités cœur, concrètes :

Capture automatique des ventes via WhatsApp Business — le commerçant continue d'écrire ou de recevoir "2 sacs de riz, 15000F, Fatou" comme il le fait déjà ; un assistant conversationnel structure la donnée en arrière-plan et demande confirmation par un simple emoji-réponse (✅) plutôt qu'une saisie de formulaire. Rapprochement automatique des paiements mobile money — connexion aux notifications SMS/USSD Orange Money, Wave, Moov Money pour associer chaque paiement reçu à une vente ou une créance, sans ressaisie. Suivi de stock simplifié — alertes de rupture et calcul automatique de marge par article, à partir des mêmes messages de vente (pas d'écran de gestion de stock complexe à apprendre). Tableau de bord de trésorerie et carnet de créances — ce qui est dû, par qui, depuis quand, avec relance automatique préformulée envoyable en un clic sur WhatsApp. Score NEXUS et accès au financement — un score de fiabilité construit sur 3+ mois d'historique réel de vente et de paiement, partageable en un clic avec un partenaire de microcrédit ou une banque via API, pour transformer l'historique d'activité en dossier de crédit.

Données créées / lues / modifiées / supprimées par fonctionnalité :
Capture des ventes : Créer une transaction (montant, article, client, date) ; Lire l'historique de transactions ; Modifier une transaction mal interprétée par l'assistant ; Supprimer un doublon. Rapprochement mobile money : Créer un paiement rattaché à une transaction ; Lire le solde consolidé multi-opérateurs ; Modifier le rattachement si erreur d'association. Stock : Créer/Modifier un article et son niveau de stock ; Lire la marge et le taux de rotation ; Supprimer un article obsolète. Trésorerie & créances : Créer une créance ; Lire le tableau de bord agrégé ; Modifier le statut (payé/partiel/en retard) ; Supprimer une créance annulée. Score & financement : Créer un dossier de score à un instant T ; Lire l'évolution du score dans le temps ; le score n'est jamais modifiable manuellement (intégrité obligatoire) ; Supprimer n'existe pas ici — seule l'anonymisation/suppression de compte RGPD-like est possible.

Rôles et permissions : Oui, nécessaire dès le lancement, car beaucoup de boutiques emploient un ou plusieurs vendeurs :
Propriétaire (Admin) : accès complet, y compris score de crédit et export financier. Gérant/Vendeur : peut enregistrer des ventes et consulter le stock, mais ne voit ni la trésorerie consolidée ni le score. Comptable externe (invité, optionnel, palier payant supérieur) : accès lecture seule à la comptabilité pour préparer les déclarations fiscales.

Métrique propre à surveiller en plus des génériques (abonnés, revenu, churn) : La métrique reine du produit est le taux d'activation du score de crédit : pourcentage de comptes actifs depuis 90 jours ayant un historique suffisant pour générer un score exploitable, et parmi eux, le pourcentage ayant effectivement obtenu un financement via un partenaire. C'est la métrique qui prouve que NEXUS crée de la valeur réelle (accès au crédit) et pas seulement de l'usage passif — et c'est elle qui justifiera la thèse d'investissement du produit à moyen terme.
Bloc 4 — Direction esthétique

Au vu du produit (outil financier sérieux, mais destiné à un utilisateur non technique qui doit se sentir en confiance et jamais infantilisé ni intimidé), le preset le plus cohérent est :

→ Clinique Vapor si l'objectif est une clarté clinique et une confiance immédiate façon "outil bancaire sérieux et lisible", ou plus probablement → Tech Organique si l'on veut une chaleur humaine qui respecte l'ancrage culturel du produit sans tomber dans le folklore.

Recommandation ferme : Tech Organique, à condition de le décliner vers une version plus sobre et moins "startup lifestyle" que son usage habituel — parce que le public cible (Bloc 3) est un commerçant pragmatique qui doit sentir que l'outil parle d'argent sérieusement, pas un early adopter tech urbain. Aucun décalage majeur signalé tant que les couleurs restent chaleureuses mais pas criardes et que la typographie reste très lisible sur petit écran bas de gamme — c'est une contrainte d'accessibilité, pas seulement esthétique, compte tenu du profil technique du Bloc 3.

(Le détail des 4 presets étant en Annexe A de ton document source, à confirmer ensemble une fois que tu as vu le rendu concret avant validation finale — je ne fige pas ce choix sans que tu voies les maquettes.)

Bloc 5 — Modèle économique

Freemium, pour lever la barrière d'entrée numéro un identifiée dans l'analyse de marché : le coût perçu de la digitalisation est le frein principal cité par les PME de la région.

3 paliers, strictement alignés sur les fonctionnalités cœur du Bloc 3 :

PalierPrix indicatifCe qui est inclusLimiteGratuit — "Cahier"0 FCFACapture des ventes WhatsApp, stock basique, jusqu'à 100 transactions/moisPas de rapprochement mobile money automatique, pas de scorePro — "Boutique"~5 000 FCFA/moisTransactions illimitées, rapprochement mobile money multi-opérateurs, carnet de créances, jusqu'à 3 utilisateursScore de crédit consultable mais non partageableCroissance — "Grossiste"~15 000 FCFA/moisTout Pro + score de crédit partageable avec partenaires financiers, comptable invité, export fiscal, utilisateurs illimités—

Cette structure évite l'écueil signalé dans les instructions : chaque limite correspond à un vrai palier d'usage (volume de transactions, accès au financement), jamais une restriction arbitraire déconnectée du produit réel.

Facturation : mensuelle par défaut (le commerçant raisonne en trésorerie mensuelle, pas annuelle), avec réduction sur l'engagement annuel (~2 mois offerts) pour les comptes Croissance une fois la confiance installée.

Bloc 6 — Onboarding et conversion

Action n°1 attendue du visiteur sur la landing page : "Essayer gratuitement" — cohérent avec le modèle freemium du Bloc 5, sans carte bancaire requise à l'inscription (rappel : la cible n'a majoritairement pas de carte bancaire, seulement du mobile money). L'inscription se fait par numéro de téléphone + connexion WhatsApp Business, pas par email — c'est la seule identité numérique fiable de l'utilisateur cible.

Essai gratuit : pas un "trial" classique à date d'expiration — le palier Gratuit est permanent (freemium réel), et l'upgrade est déclenché par un signal produit naturel : dès que le commerçant atteint sa limite de 100 transactions/mois, ce qui prouve que l'outil lui est déjà utile avant de lui demander de payer. C'est un choix délibéré : forcer un trial à durée fixe sur une cible qui doute encore de la valeur d'un outil numérique risquerait de tuer l'adoption avant que la confiance ne se construise.

Bloc 7 — Contraintes techniques

Supabase : pas encore de projet créé — l'IA devra documenter le schéma complet (tables transactions, stocks, créances, utilisateurs, scores) sans pouvoir le déployer elle-même à ce stade.

Passerelles de paiement :

Passerelle africaine Senepay : A utiliser sur tout le paiement

Exécution serveur : compte tenu de l'absence de plateforme de déploiement encore choisie, et du fait que ce produit dépendra fortement de Supabase pour l'authentification, la base de données et le stockage du score de crédit, la recommandation par défaut cohérente est :

→ Supabase Edge Functions (runtime Deno).

Raison : cela évite d'ajouter une plateforme de déploiement supplémentaire à gérer uniquement pour le code serveur (webhooks WhatsApp Business API, réception des notifications mobile money, calcul du score), alors que tout le reste du backend vivra déjà sur Supabase. Ce choix est fait maintenant, pas laissé en suspens jusqu'au premier webhook.

Les trois arguments et CTA:

Zéro saisie, zéro effort — Capture automatique des ventes depuis WhatsApp Business ; le commerçant continue d'écrire "2 sacs de riz, 15000F, Fatou" comme il le fait déjà.
Trésorerie claire, même sans comptable — Rapprochement mobile money automatique + carnet de créances avec relance WhatsApp en un clic.
Ton activité devient un dossier de crédit — Après 3 mois d'historique réel, un score de fiabilité partageable avec les banques et IMF partenaires.
Ces 3 arguments sont-ils les bons, ou veux-tu en modifier certains ?

Question 2 — Destination du CTA principal

D'après la fiche Phase 0 (Bloc 6), la réponse est déjà connue :

CTA principal : "Essayer gratuitement"
Destination : page /signup (inscription par téléphone + WhatsApp Business — pas de waitlist, pas de démo)
En une phrase pour clore

NEXUS ne vend pas un logiciel de comptabilité de plus — il vend à un commerçant invisible pour le système bancaire la preuve numérique de sa propre fiabilité, construite sans lui demander de changer une seule de ses habitudes. C'est cette combinaison — zéro friction d'adoption + infrastructure de confiance financière — qui constitue le vrai avantage défendable sur le long terme, bien plus que n'importe quelle fonctionnalité isolée.