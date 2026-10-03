# HANDOFF — BAAM.pro et ses territoires publics

> Relais de session au **3 octobre 2026**.
> Ce document concerne l'écosystème public BAAM.pro. Il ne faut pas le confondre
> avec le **BAAM Hub**, OS interne d'agents documenté dans `../baam-hub/HANDOFF.md`.

## Reprendre à froid

1. Lire ce fichier.
2. Lire `README.md`, puis `MANIFEST.md` pour le contrat récursif.
3. Lire `SPEC.md` pour l'intention fondatrice. Les décisions plus récentes de ce
   HANDOFF priment sur les anciennes occurrences d'« Idées » dans la spec.
4. Consulter `../PORTS.md` avant d'attribuer un port local.
5. Lire la branche `baam-pro` de la carto par l'API 3333 ou en lecture seule dans
   `../CartoProjects/projects-data.js`. Ne jamais éditer cette source directement.

## Vision acquise

BAAM.pro est la carte publique d'une production en ramification. Chaque projet reste
autonome — dépôt, code, déploiement et rythme propres — et publie un manifest. Les
territoires l'agrègent et BAAM.pro agrège les territoires.

```text
projet/baam.json
        ↓
territoire/public/data/registry.json
        ↓
site-baam.pro/public/data/registry.json
        ↓
baam.pro
```

Le vocabulaire visuel commun est désormais robuste sans être uniforme : **cartes
dépliables, fond animé, ouverture qui recompose l'espace, aperçu vivant**. Chaque
territoire traduit ce vocabulaire selon sa fonction : organisme pour Lab, jeu
physique pour Games, hiérarchie pour Apps, table filtrable pour Tools.

Le principe de données reste atomique : pas d'actif transcendant ou canonique au-
dessus des projets. Une relation est déclarée une fois ; son inverse est calculé.

## État vérifié

### BAAM.pro — racine

- Dossier : `../site-baam.pro/`
- Dépôt : `https://github.com/Soupappa/baam-pro`
- Production : `https://baam.pro/`
- Local : `http://127.0.0.1:8088/`
- Build : `npm run build`; tests : `npm test`; serveur : `npm run serve`
- Le compilateur racine importe Lab et Games depuis un dépôt frère en local, leur
  registre public sur Netlify en production, puis le dernier cache valide en repli.
- Le correctif de lecture distante est publié sur
  `98335aa feat: fetch territory registries in production` et son déploiement
  Netlify a été vérifié.

### BAAM.Lab — chaîne de référence terminée

- Dossier : `../site-lab.baam.pro/`
- Dépôt : `https://github.com/Soupappa/baam-lab`
- Production : `https://lab.baam.pro/`
- Local : `http://127.0.0.1:8089/`
- R-Time, Pixel Bloom et Suite Première sont autonomes, déployés, reliés par leurs
  manifests et agrégés jusqu'à BAAM.pro.
- C'est le modèle technique à copier, pas nécessairement son design.

### BAAM.Games — portail et quatre jeux publiés

- Dossier : `../site-games.baam.pro/`
- Dépôt : `https://github.com/Soupappa/baam-games`
- Production : `https://games.baam.pro/`
- Secours Netlify : `https://baam-games.netlify.app/`
- Local : `http://127.0.0.1:8090/`
- Git : publication du registre complet sur
  `df45396 feat: publish complete BAAM Games registry`.
- Namecheap : CNAME `games` vers `baam-games.netlify.app`.
- DNS public et certificat HTTPS vérifiés ; réponse `200 OK` sur les deux nœuds
  Netlify au moment du relais.

Le monde Games est un cadre qui tourne alors que la gravité reste verticale à
l'écran. Les cartes tombent, rebondissent, se lestent face lisible et finissent au
repos. Les textes se redressent par quart de tour. La molette module la vitesse ; le
HUD offre gravité, son, pause et replay par seed. Préserver cette logique : c'est le
geste propre de Games, pas un simple effet décoratif.

Les quatre sources existent dans `portal.config.json` et dans `data/manifests/`.
Elles sont toutes résolues en production depuis leur origine Netlify stable, tout en
exposant leur URL canonique `*.games.baam.pro`. Le registre public Games et le
registre public racine contiennent les quatre jeux en source distante, datés du
`2026-10-03`. Le statut reste volontairement `preview` et `preview.type` reste
`none` jusqu'à la capture des vraies séquences de gameplay.

## État des quatre jeux

| Jeu | Dossier | Git publié | URL canonique |
|---|---|---|---|
| Asymmetric Wars | `../asymmetric-war/` | `4a8768a` — `Soupappa/asymmetric-war` | `https://asym.games.baam.pro/` |
| Doctrine Engine | `../Doctrine Engine/` | `8322822` — `Soupappa/DoctrineEngine` | `https://doctrine.games.baam.pro/` |
| Ninja Worms | `../NinjaWorms/` | `06afa18` — `Soupappa/NinjaWorms` | `https://ninja-worms.games.baam.pro/` |
| Spider vs Ants | `../SpiderVsAnts/` | `d63a10d` — `Soupappa/SpiderVsAnts` | `https://spider-vs-ants.games.baam.pro/` |

Chaque jeu possède désormais son `netlify.toml`, son manifest racine et sa copie
`public/.well-known/baam.json`, ainsi qu'une cascade sortante après déploiement réussi.

## Audit de reprise — phase 0 terminée

Audit exécuté le **3 octobre 2026**, sans nettoyage ni correction du gameplay :

- `npm test` et `npm run check` passent dans BAAM.pro ; les checks Lab et Games
  passent également ;
- les quatre jeux produisent un build de production et passent leur contrôle
  TypeScript ;
- chaque `baam.json` est identique à sa copie `public/.well-known/baam.json` et à la
  copie publiée dans `dist/.well-known/baam.json` ;
- aucun des quatre jeux ne possède encore de `netlify.toml` ; leurs URLs publiques
  restent nulles et leurs previews sont encore de type `none` ;
- Doctrine Engine n'a toujours ni dépôt Git ni URL de dépôt dans son manifest ;
- les linters exposent une dette existante non bloquante pour le build : Asymmetric
  Wars, 47 erreurs et 17 avertissements ; Ninja Worms, 90 erreurs et 7 avertissements ;
  Spider vs Ants, 2 erreurs ;
- l'installation reproductible de Spider vs Ants signale 32 vulnérabilités npm,
  dont 23 hautes. Ne pas lancer de correction forcée sans audit ciblé ;
- les builds et vérifications n'ont ajouté aucune modification suivie aux arbres Git.

Conclusion : le socle est publiable sans sprint de finition gameplay. Le prochain
lot peut se concentrer sur le contrat de preview vidéo puis sur le déploiement pilote,
en gardant la dette produit et la dette de lint hors périmètre sauf blocage réel.

## Contrat vidéo et cascade — phase 1 terminée

Le contrat partagé accepte désormais `preview.type: "video"` avec poster, dimensions,
texte alternatif et sources WebM/MP4. Games et BAAM.pro refusent les variantes
incomplètes par des tests dédiés.

Dans BAAM.Games, une vidéo joue uniquement si sa carte est ouverte, visible et si
l'onglet est actif. La pause globale, `prefers-reduced-motion` et l'économie de données
laissent le poster en place. BAAM.pro conserve seulement ce poster dans ses petits
carrousels pour ne pas multiplier les lectures automatiques.

Le `postbuild` générique reste disponible comme repli, mais la production utilise des
notifications HTTP POST Netlify limitées à `Deploy succeeded`. Spider appelle ainsi
le build hook privé de Games, puis Games appelle celui de BAAM.pro. Les URLs des hooks
ne sont jamais versionnées.

Aucun manifest de jeu n'utilise encore `video` : les médias réels seront ajoutés au
moment des captures de gameplay.

## Phase 2 — pilote Spider vs Ants validé

Le 3 octobre 2026, le premier arbre automatique a été exécuté de bout en bout :

```text
Spider vs Ants publié → hook Games → Games publié → hook BAAM.pro → racine publiée
```

- Spider est disponible sur `https://baam-spider-vs-ants.netlify.app/` ; son domaine
  canonique est `https://spider-vs-ants.games.baam.pro/`.
- La zone DNS active est bien celle de Namecheap. Le CNAME
  `spider-vs-ants.games` → `baam-spider-vs-ants.netlify.app` y a été ajouté sur le
  modèle des jeux Lab. Sa propagation et son certificat HTTPS sont vérifiés.
- Le registre public Games contient Spider en source `remote`, avec son URL canonique
  et la date `2026-10-03`.
- Une première cascade complète a validé les notifications. Elle a aussi révélé que
  la racine Netlify relisait son cache faute de dépôt Games voisin.
- Le correctif racine ajoute les URLs publiques à `data/territory.sources.json` et la
  résolution dépôt local → registre public → cache. Tests, check et build passent.

Commits publiés : Spider `d63a10d`, Games `b169efb`, `b94a430` puis `37b95b8`,
racine `7397ad7` puis `98335aa`. Le registre public BAAM.pro a été contrôlé après la
cascade : Spider y possède son URL canonique et la date `2026-10-03`.

## Phase 3 — publication des quatre jeux terminée

Le 3 octobre 2026, Asymmetric Wars, Doctrine Engine et Ninja Worms ont rejoint le
pilote Spider vs Ants :

- dépôts GitHub autonomes et builds Netlify continus ;
- CNAME Namecheap `asym.games`, `doctrine.games` et `ninja-worms.games` vers leurs
  origines Netlify respectives ;
- DNS validé par Netlify, certificats HTTPS émis et réponses publiques `200 OK` ;
- notifications sortantes `Deploy succeeded` vers la file groupée de Games ;
- sources Games configurées sur les origines Netlify stables ;
- `npm run check`, `npm test` et `npm run build` réussis dans BAAM.Games ;
- déploiements de contrôle des trois jeux réussis, suivis de trois reconstructions
  Games puis BAAM.pro ;
- registres publics Games et BAAM.pro contrôlés : quatre jeux, quatre URL canoniques.

La chaîne prouvée est maintenant générale :

```text
push d'un jeu → Netlify jeu → file groupée 5 min → Netlify Games → hook BAAM.pro → racine
```

La dette de lint/TypeScript des prototypes reste hors périmètre tant qu'elle ne bloque
pas le build. Elle devra être traitée jeu par jeu lors des itérations produit.

## Optimisation de cascade — lot groupé terminé

Le 3 octobre 2026, la cascade directe a été remplacée par une file groupée sur
BAAM.Games. Chaque jeu appelle désormais la fonction Netlify
`queue-games-rebuild`. La dernière invocation d'une fenêtre de cinq minutes est la
seule à déclencher le build hook Games ; les précédentes quittent sans reconstruction.
La notification Games → BAAM.pro reste inchangée.

Les deux secrets nécessaires sont enregistrés uniquement dans l'environnement
Netlify de BAAM.Games. Les quatre notifications ont été contrôlées : Asymmetric Wars,
Doctrine Engine, Ninja Worms et Spider vs Ants utilisent toutes le nouvel endpoint,
sans ancien hook direct résiduel. Le commit Games `19a243c` est publié et la fonction
est visible dans Netlify.

Le carrousel Games de BAAM.pro référence maintenant explicitement les quatre jeux.
Le commit racine `5a39464` a été publié par la cascade et la présence de
`Spider vs Ants` a été vérifiée sur la façade publique.

## Phase 4 — vraies previews de gameplay

Objectif : remplacer `preview.type: "none"` par une séquence forte et légère pour
chaque jeu, sans retarder la façade déjà envoyable.

1. Capturer une **phase de jeu**, jamais la page d'accueil : boucle courte, lisible,
   sans son, démarrant directement dans l'action.
2. Produire WebM/MP4 et un poster de repli, avec dimensions et texte alternatif.
3. Renseigner le contrat `video` déjà validé dans chaque manifest.
4. Vérifier autoplay muet, pause hors écran, économie de données et mouvement réduit.
5. Laisser chaque push de jeu propager automatiquement la nouvelle preview jusqu'à
   Games puis BAAM.pro, et contrôler les deux registres publics.

Le premier carrousel pourra alterner plusieurs séquences plus tard. Ce lot doit
d'abord livrer une vidéo de gameplay forte et légère par jeu.

## Phase suivante 2 — BAAM.Apps

Créer un dépôt et un déploiement autonomes `site-apps.baam.pro`, avec le même contrat
de manifests mais une grammaire différente de Lab et Games.

Direction acquise :

- distribution **hiérarchique** ;
- regroupement par familles ou capacités métier ;
- raffinement progressif des cartes ;
- piste de **double ouverture** : première ouverture pour la famille/le rôle, seconde
  pour l'application et son aperçu détaillé ;
- les ouvertures recomposent la page, sans devenir un arbre administratif ;
- les applications Archi publiées en l'état doivent porter une mention **BÊTA**
  explicite dans leur carte, leur page et leur manifest.

Inventaire pressenti à confirmer au début du lot : ArchiNorm, ArchiCarto, ArchiTime,
TimelineArchitect et les licences qui sont davantage des applications que de simples
médias. La décision récente place plutôt TRAME, AIIE, FINK et TdF dans Apps, tandis
que BAAM Médias devient un site éditorial complet. Ne pas figer cette liste sans une
dernière validation d'Antoine.

Ordre recommandé : prototype de la mécanique hiérarchique avec 4 à 6 cartes, choix
des applications, manifests, déploiements autonomes, puis agrégation Apps → BAAM.pro.

## Phase suivante 3 — BAAM.Tools

Créer un dépôt et un déploiement autonomes `site-tools.baam.pro`.

Direction acquise :

- distribution **à plat**, très filtrable ;
- filtres combinables par thème et type ;
- animation légère et cohérente par type, sans physique lourde ;
- trois familles de contenus :
  1. `free-webtool` — outil web gratuit hébergé ;
  2. `tutorial` — tutoriel ou mode opératoire ;
  3. `resource` — ressource ou lien vers un outil tiers.

Tools doit aussi devenir une petite fabrique éditoriale : un page builder permet de
créer rapidement ces trois types de page ; chaque page publiée produit son manifest
et devient automatiquement une carte du sous-portail. Il faut donc concevoir ensemble
le schéma de contenu, les trois gabarits et l'index filtrable, plutôt qu'ajouter un CMS
généraliste avant d'avoir besoin de ses fonctions.

Premier lot recommandé : schéma commun, trois pages exemples réelles, filtres URL-
adressables, publication statique, puis compilation Tools → BAAM.pro.

## Médias et Agence — plus tard

### BAAM Médias

La décision actuelle est d'en faire un **site éditorial complet**, et non un petit
sous-portail. Il pourra mettre en scène les derniers articles dans des carrousels,
avec les héros d'articles déjà denses — punchline et animation. Le renommage d'Idées
vers Médias doit être répercuté dans `SPEC.md`, les données racine et les URLs quand
le site réel est prêt, pas par une substitution partielle avant cela.

### BAAM Agence

À traiter en dernier. Ce sera le site de conversion commerciale : dérivés de la
production BAAM, offres d'implémentation pour les entreprises, preuves, cas et prises
de contact. Ne pas en faire un catalogue de tout l'écosystème ; BAAM.pro montre la
ramification, Agence transforme certaines capacités en offres achetables.

## Contrat technique à préserver

- Un projet possède son `baam.json` et son URL.
- Un territoire choisit explicitement ses sources dans `portal.config.json`.
- Résolution : fichier local → URL publique → dernier cache valide.
- Les relations sources utilisent le vocabulaire contrôlé et un seul sens.
- Les inverses sont générés ; ils ne sont jamais ressaisis.
- Un build invalide ne remplace jamais le dernier export valide.
- Le portail publie au minimum `registry.json`, `graph.json`, `graph.jsonld` et un
  sitemap.
- BAAM.pro consomme les registres territoriaux, pas tous les dépôts atomiques.
- Les manifests et fichiers techniques restent accessibles aux machines, pas comme
  boutons éditoriaux dans les interfaces publiques.

## Vérifications de fin de lot

- `npm run check` puis `npm run build` dans le territoire.
- Tests du compilateur racine avec `npm test` puis `npm run build`.
- Vérification visuelle desktop et mobile, couleur et noir et blanc lorsque pertinent.
- Test direct de chaque route publique et de `/.well-known/baam.json`.
- Contrôle des vidéos : poids, autoplay muet, pause hors écran, poster et mouvement
  réduit.
- Git propre, branche `main` synchronisée seulement après autorisation de push.
- Netlify : déploiement continu, domaine principal, DNS et HTTPS.
- Carto : API 3333 ou patch-file, jamais d'édition directe de
  `projects-data.js`/`carto.html`.

## Ports déjà réservés

- `8088` — BAAM.pro
- `8089` — BAAM.Lab
- `8090` — BAAM.Games

Les prochains portails doivent utiliser la plage libre indiquée dans `../PORTS.md` et
y être inscrits avant création du lanceur.

## Formule de reprise

> Le portail racine et les deux premières déclinaisons ont prouvé le système. La
> prochaine étape n'est plus d'inventer BAAM.pro, mais de faire circuler de vrais
> projets publics dans ses branches : d'abord quatre jeux et leurs phases de gameplay,
> puis Apps hiérarchique, Tools filtrable et bâtisseur de pages, enfin Médias et
> Agence.
