# Modèle économique d'Alviosa

Ce document décrit comment Alviosa peut durer. Les chiffres ne sont pas encore mesurés : tout ce qui est marqué *à valider* est une hypothèse à tester pendant le pilote.

## Le principe

**Les jeunes ne paient jamais. Ceux qui gagnent de la valeur paient : les structures de santé, les programmes, les ministères.** La partie jeunes est le moteur d'usage. Les parties prestataires et pilotage sont celles qui financent l'ensemble.

## Qui paie quoi

| Qui | Ce qu'il reçoit | Comment il paie | Statut |
|---|---|---|---|
| Jeunes | Information, outils, annuaire, bon de visite, rappels | Rien | Disponible |
| Centres, cliniques, pharmacies | Annuaire, QR, bons, ruptures, entraînement (Essentiel) | Gratuit | Disponible |
| Structures (Pro) | Plusieurs sites et comptes d'équipe, tableau du centre, rappels WhatsApp/SMS, exports, attestations | Abonnement par mobile money, par site et par mois | Prévu, *prix à valider* |
| Districts, ministères | Tableau de bord Pilotage sur leur zone, alertes, exports vers le système d'information sanitaire | Licence annuelle par district ou par pays, financée par un programme ou un bailleur | Prévu, *à négocier* |
| Programmes et bailleurs | Mesure vérifiable de l'accès des jeunes, rapports anonymes | Subvention de projet ; plus tard, contrat lié à des résultats vérifiés | Prévu |
| Employeurs de santé | Parcours de formation avec attestation | Paiement par équipe | Prévu, *à valider* |

Growbrandweb, l'agence qui développe la solution, peut aussi facturer l'adaptation de la plateforme à un pays ou à une organisation (configuration, intégration, formation).

## Les coûts à couvrir

- Hébergement et base de données (Vercel, Supabase).
- IA : le coût d'une question libre, des jeux de rôle et des synthèses. Les réponses fixes, les règles et les fiches ne coûtent rien.
- WhatsApp et SMS pour les rappels, quand ils seront ouverts.
- Relecture clinique et mise à jour du contenu.
- Voix en langues locales.
- Sécurité, audit, support aux structures.
- Équipe : développement, animation des centres, partenariats.

## Règles qui protègent la confiance

1. Les jeunes ne paient pas, et n'ont pas besoin de compte.
2. Payer ne change pas la place dans l'annuaire. Pas de publicité.
3. Seuls les services validés apparaissent.
4. Les données restent anonymes et appartiennent aux pays. Elles ne sont jamais vendues.
5. Un contrat lié à des résultats ne porte que sur des mesures vérifiées et anonymes, avec contrôle de la qualité du conseil : on ne paie pas « plus de visites » sans regarder si les jeunes ont été bien accueillis.

## Comment arriver à l'équilibre

Formule simple, à remplir avec de vrais chiffres :

> Points d'équilibre = (coûts fixes mensuels) ÷ (revenu mensuel moyen par structure payante, moins le coût d'IA, de SMS et de support par structure)

À mesurer pendant le pilote : combien de structures veulent le Pro, le prix qu'elles acceptent, le coût réel par question, et ce qu'un district est prêt à financer.

## Feuille de route

- **Mois 0 à 3 :** pilote autour de Lokossa. 2 à 5 centres inscrits, premiers bons de visite, premiers avis. Mesures réelles.
- **Mois 3 à 6 :** ouverture du Pro à quelques structures. Premiers tests de prix. Discussion avec un district.
- **Mois 6 à 12 :** première licence de district ; extension à un deuxième pays du Partenariat.

## Risques

- Peu de structures prêtes à payer au départ : on garde l'Essentiel gratuit et on finance d'abord par subvention.
- Dépendance à un seul bailleur : plusieurs lignes de revenus.
- Coût de l'IA : réponses fixes d'abord, IA seulement quand elle ajoute de la valeur, plafonds par jour.
- Qualité du conseil : mesure dans le tableau de bord, formation, jamais de paiement sans contrôle.
