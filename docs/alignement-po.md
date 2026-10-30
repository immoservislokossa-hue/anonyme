# Alviosa et le Partenariat de Ouagadougou : de la donnée au choix de conception

> Mise à jour du 30 octobre 2026 : Alviosa est devenue une plateforme en trois espaces (Jeunes, Prestataires, Pilotage) reliés par un annuaire de services.
> La section 0 résume la logique ; les sections suivantes détaillent les données et les choix pour l'espace Jeunes.

## 0. Du problème à l'espace

| Problème nommé par les documents | Espace et fonction |
|---|---|
| Normes sociales, préjugés, restrictions d'âge ou de statut (Afrobaromètre, appel du Prix) | Jeunes : « Parler à quelqu'un », aucune condition d'âge ou de statut. Prestataires : entraînement avec de faux clients jeunes. |
| Conseil incomplet (PMA2020 : autres méthodes 64,9 %, effets 52,1 %) | Jeunes : « Je prépare ma visite ». Prestataires : consultation guidée et liste de qualité du conseil, mesurée sur ces deux points. |
| Services pour jeunes pas à l'échelle, orientation faible | Annuaire : inscription, validation, avis anonymes, signaux de rupture. |
| Suivi des résultats pour les femmes et les jeunes, intégration aux soins de base, appropriation nationale (New York) | Pilotage : chiffres anonymes, alertes, export `ALV_*` pour les systèmes d'information sanitaire ; `lib/pays.ts` pour la configuration nationale. |
| IA qui soutient les prestataires, l'orientation et les données de planification, hors connexion (appel du Prix) | IA : questions libres des jeunes, faux client et assistant pour les prestataires, synthèse des chiffres agrégés. Règles cliniques fixes. |
| Jeunes acteurs et rémunérés (stratégie jeunes) | **Pas encore couvert.** À faire : un petit groupe de jeunes co-concepteurs, rémunérés et encadrés. |
| Contextes fragiles | Tout fonctionne sans connexion, y compris les entraînements et le tableau de bord de démonstration. |

Document de travail, à jour au 30 octobre 2026. Les chiffres viennent de documents publics lus en entier (liste en fin de page).
Règle : une donnée n'est reprise que pour ce qu'elle mesure. Aucune n'est présentée comme un résultat d'Alviosa.

## 1. Ce que les données disent

| Donnée | Source | Portée et limite |
|---|---|---|
| 44 % soutiennent l'accès à la contraception quel que soit le statut matrimonial, 40 % quel que soit l'âge (Bénin 58 % et 53 %) | Afrobaromètre, dépêche 1138 (26/02/2026) | Opinion d'adultes 18+, 7 pays sur 9 (pas le Burkina Faso ni le Niger). Biais possible de désirabilité sociale, signalé par les auteurs |
| 18-35 ans plus favorables (48 % / 43 %) que les plus de 55 ans (34 % / 34 %) | idem | Opinion |
| Autonomie pour décider du nombre d'enfants : 42 % (femmes 49 %, hommes 35 %) ; Bénin 60 % | idem | Opinion |
| Éducation sexuelle à l'école : 65 % (Bénin 78 %). Filles enceintes à l'école : 79 % (Bénin 84 %) | idem | Opinion |
| Téléphone portable : 84 % des femmes, 95 % des hommes. Aucune instruction formelle : 39 % des femmes, 29 % des hommes | idem | « Téléphone » ne veut pas dire smartphone avec données |
| Non-utilisation chez les femmes qui veulent attendre : 44,5 % ne se sentent pas à risque ; 21,5 % non mariées ; 21,2 % opposition ; 20 % craintes liées à la méthode ; 10,4 % accès ou connaissance | PMA2020 Burkina Faso, vague 5 (2017-18) | Burkina Faso, femmes 15-49 ans, données de 2017-18 : ne pas appliquer telles quelles au Bénin |
| Informées d'autres méthodes : 64,9 % ; informées des effets secondaires : 52,1 % | idem | idem |
| Mix des méthodes, non mariées sexuellement actives : préservatif 37,7 %, implant 28,9 %, injectable IM 12,1 %, pilule 13,8 % | idem | idem |
| Âge médian : premier rapport 17-18 ans, premier usage d'une méthode 22 (urbain) à 25 ans (rural). Besoin non satisfait : espacer 13,5 %, limiter 3,3 % | idem | idem |
| 80 % des grossesses non intentionnelles des 15-19 ans surviennent chez celles sans méthode moderne | Appel à candidatures 20/10/2026 (cite un papier UNFPA WCARO) | Cité de seconde main |
| Objectif PO : 13 millions d'utilisatrices de méthodes modernes en 2030 (+6,5 millions) | UCPO | Cible régionale |

## 2. Ce que nous en avons fait

| Besoin identifié | Réponse dans Alviosa |
|---|---|
| Normes sociales et jugement (âge, statut) | Aucune condition d'âge ou de statut ; outil « Parler à quelqu'un » (partenaire, parent, proche, soignant) avec réponses fondées sur le guide OMS ; page « Pour les garçons » |
| Risque perçu faible | Vrai/Faux « première fois, pendant les règles » (guide OMS), outil « Après un rapport à risque », page « Rumeurs et vérités » |
| Conseil de qualité insuffisant (autres méthodes, effets) | Outil « Je prépare ma visite » : les questions à poser, selon la raison et la méthode ; la fiche « Préparer une consultation » enrichie |
| Premier usage tardif, besoin d'espacer | Sujet « Attendre ou espacer » (18 ans / études, 2 ans entre deux naissances, après l'accouchement, allaitement) |
| Instruction faible, accès inégal au numérique | Français très simple, dessins, lecture à voix haute, saisie vocale, tout hors connexion après la première visite, Afi locale sans réseau |
| Méthodes courantes chez les jeunes non mariés (préservatif, implant) | Préservatif présenté comme seule méthode protégeant aussi des IST, pages complètes pour l'implant et les méthodes de longue durée |
| Contextes fragiles, volatilité des financements | Fonctionnement sans connexion ; coût faible par personne ; contenu adaptable aux directives nationales |
| Suivi des résultats pour les jeunes (réunion de New York) | Trois indicateurs, événements anonymes (« avis oui/non », outils terminés), jeu de questions cliniques relancé à chaque version |

## 3. Orientations des documents du PO auxquelles Alviosa répond

- Stratégie jeunes du PO (2019) : diversifier les jeunes, développer leurs capacités avec des technologies adéquates, usage faible chez les 15-24 ans.
- Stratégie post-2025 : pilier 2 (contextes fragiles), pilier 3 (jeunes), volets recherche et équité.
- Réunion ministérielle de New York (24/09/2026) : intégrer la planification familiale aux soins primaires, suivre les résultats pour les femmes et les jeunes, appropriation nationale.
- Prix des Jeunes Innovateurs Africains pour la Santé 2026 : IA responsable, faible connectivité, protection des données, supervision humaine.

Alviosa n'est affiliée ni au PO ni à l'OMS. Elle ne remplace pas les services : elle prépare les jeunes à y aller.

## 4. Ce qui manque encore (à ne pas cacher)

1. Aucun retour d'utilisateur : test prévu avec 20 jeunes de 18 à 24 ans (les mineurs demandent plus de précautions).
2. Relecture clinique : aucune validation signée à ce jour.
3. Numéros d'urgence et liste de centres à renseigner pays par pays.
4. Langues locales : démo yoruba non validée. 8. Jeunes co-concepteurs rémunérés : non réalisés. 9. Correspondance des codes d'export avec les éléments de données nationaux (par exemple DHIS2) : à faire avec le ministère.
5. Autorisation d'usage du texte OMS à confirmer.
6. Compteurs et annuaire en mémoire tant que Supabase n'est pas configuré (`docs/schema.sql`) : à configurer avant le pilote.
7. Document hors sujet : le règlement du Prix national de la simplification administrative du Bénin (14/10/2026) porte sur la simplification des procédures publiques ; Alviosa n'y est pas recevable.

## Sources

- Afrobaromètre, dépêche n° 1138, 26 février 2026.
- PMA2020 Burkina Faso, vague 5, novembre 2017 - janvier 2018.
- Partenariat de Ouagadougou, Stratégie Jeunes PO (2019).
- UCPO, Réunion ministérielle de New York, 24 septembre 2026 (synthèse et infographie).
- Speak Up Africa et UCPO, appel à candidatures, 20 octobre 2026.
- OMS, Guide de la planification familiale à l'intention des agents de santé communautaires (2012).
