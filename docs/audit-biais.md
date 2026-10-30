# Audit des biais et des chiffres

Ce que cet audit a vérifié, et ce qu'il ne peut pas vérifier.

## Vérifié
- Chaque chiffre de `/a-propos`, des outils et des sujets a été relu contre le PDF d'origine (Afrobaromètre 2024/25, PMA2020 Burkina Faso 2017-18, Stratégie Jeunes du PO).
- Chaque chiffre est présenté avec son pays, son année et sa nature (opinion ou mesure). Un chiffre du Burkina Faso n'est jamais présenté comme un chiffre du Bénin.
- Les chiffres favorables et défavorables sont montrés ensemble (ex. l'écart de qualité 64,9 % / 52,1 % entre jeunes et adultes).
- Aucune affirmation juridique : le site ne dit pas ce que la loi autorise ou interdit.
- Âge : la cible est 15-35 ans, sans hypothèse de sexe ni de situation (mariage, grossesse, école). Les parcours ne supposent pas que la personne est une fille.
- Données : aucun texte de message n'est gardé. Les cellules de moins de 5 observations sont masquées dans le tableau de bord. Les avis n'apparaissent qu'à partir de 5.

## Non vérifiable ici (à faire avant tout usage réel)
- **Aucun professionnel de santé n'a relu le contenu.** Le site le dit (`lib/validation.ts`). Quand une relecture a lieu, renseigner `NEXT_PUBLIC_CONTENT_REVIEWED_BY` et `NEXT_PUBLIC_CONTENT_REVIEW_DATE` : toutes les pages changent d'un coup.
- Aucun test avec des jeunes de 18 à 35 ans.
- Aucun service réel inscrit, aucun utilisateur réel.
- La connexion Supabase réelle n'a pas pu être testée depuis cet environnement (lecture paginée et clés testées avec un faux serveur).
- L'IA (pratique libre, synthèse) n'a pas été testée avec un vrai modèle.
- Les traductions de l'aide audio sont des démonstrations.
