# Traductions de l'audio d'aide à faire faire

Ces phrases sont lues à voix haute pendant que l'application entoure l'élément concerné. Pour chaque langue, un locuteur natif traduit les phrases (même nombre, même ordre), puis, idéalement, les enregistre avec sa voix.

Langues par pays (les deux plus parlées) :

- Bénin (BJ) : Fon, Yoruba
- Burkina Faso (BF) : Mooré, Dioula
- Côte d'Ivoire (CI) : Dioula, Baoulé
- Guinée (GN) : Pular / Peul, Malinké
- Mali (ML) : Bambara, Pular / Peul
- Mauritanie (MR) : Hassaniya (arabe), Pular / Peul
- Niger (NE) : Haoussa, Zarma
- Sénégal (SN) : Wolof, Pular / Peul
- Togo (TG) : Éwé, Kabiyè

Seuls le français et le yoruba (démonstration, non validé) sont en service.

Fichier à compléter : `lib/guides.ts` (champ `translations`), et enregistrements dans `public/audio/guides/<langue>/<guide>-<numéro>.mp3` (champ `audio`).


## Bienvenue sur Alviosa (`global`)

1. Bonjour ! Bienvenue sur Alviosa. Je vais te montrer comment ça marche. Écoute, et regarde ce que j'entoure.
2. Quand tu appuies ici, tu parles à Afi. Tu peux écrire, ou dire ta question à voix haute.
3. Quand tu appuies ici, tu apprends : les méthodes, des histoires et un jeu de vrai ou faux.
4. Quand tu appuies ici, tu trouves un centre de santé ou une pharmacie près de toi.
5. Ce bouton rose, c'est pour les urgences. Appuie dessus si tu es en danger, ou après un rapport sans protection.
6. Ce bouton haut-parleur répète l'explication de la page où tu es.
7. Maintenant, appuie ici pour poser ta première question. Ici, personne ne te juge et personne ne voit ce que tu fais.

## Page d'accueil (`home`)

1. Tu es sur la page d'accueil. Appuie ici pour poser ta question à Afi.
2. Appuie ici pour comprendre les méthodes de contraception.
3. En cas d'urgence, appuie sur ce lien rose, ou sur le bouton rose en haut de l'écran.

## Parler à Afi (`chat`)

1. Ici, tu parles à Afi. Écris ta question dans cette zone.
2. Ou appuie sur le micro et dis ta question à voix haute.
3. Quand tu as fini, appuie sur ce bouton pour envoyer.
4. Ici, tu peux changer de sujet : planification familiale, santé mentale ou bien-être.

## Apprendre (`apprendre`)

1. Quand tu appuies ici, tu vois chaque méthode de contraception expliquée simplement.
2. Ici, des histoires vraies, avec Afi, Fallone et Chimène.
3. Ici, un jeu de vrai ou faux. Tu gagnes des points à chaque bonne réponse.

## Les méthodes (`methodes`)

1. Chaque carte explique une méthode : comment elle marche, combien de temps elle protège, et si elle protège des infections.
2. Appuie ici si tu veux poser une question sur cette méthode.

## Les histoires (`histoires`)

1. Choisis ici comment tu aimes apprendre : en images, en faisant des choix, ou en dessin animé.
2. Appuie ici pour commencer une histoire.

## Une histoire (`histoire`)

1. Ici, tu changes la façon de vivre l'histoire : en images, en choix ou en dessin animé.
2. Dans le dessin animé, appuie sur « Activer la voix » pour entendre les personnages.

## Vrai ou faux (`quiz`)

1. Lis la phrase, puis appuie sur Vrai ou Faux. Tu vois l'explication juste après.

## Trouver un centre (`orientation`)

1. Appuie ici pour utiliser ta position et voir les centres les plus proches.
2. Si tu préfères, écris le nom de ton quartier ici.

## Urgence (`urgence`)

1. Si tu as un saignement très abondant, une douleur très forte, de la fièvre, un malaise, ou si tu as subi une violence : va tout de suite au centre de santé le plus proche.
2. Demande à une personne de confiance de t'accompagner. Tu n'es pas seul.

## Aide (`default`)

1. Utilise le menu en bas pour aller à Parler, Apprendre ou Centres.
2. Le bouton rose en haut sert pour les urgences.
