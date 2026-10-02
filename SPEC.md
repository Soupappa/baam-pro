# Spécification fondatrice — BAAM.pro

**Version :** 0.3  
**Statut :** MVP graphique — modèle atomique et registres récursifs  
**Projet :** site public `baam.pro`  
**Nature :** portail public, carte de l'écosystème et registre distribué des actifs BAAM

---

## 1. Intention

BAAM.pro doit permettre à un ensemble protéiforme de grossir de manière visible.

Aujourd'hui, un article, un outil, un livre, une animation ou une expérimentation
peuvent facilement devenir autant de petits édifices indépendants. Le rôle de
BAAM.pro est d'en faire les pierres d'un même ensemble : chaque nouvelle production
enrichit un patrimoine commun et se relie aux précédentes sans perdre son autonomie.

BAAM.pro n'est donc pas seulement un site vitrine. C'est la représentation publique
d'un système de création continu : une carte, une mémoire et une porte d'entrée vers
les différents territoires BAAM.

### Principe directeur

> Chaque chose produite est un nœud concret. BAAM apparaît dans les liens entre ces
> nœuds, pas dans un objet canonique abstrait placé au-dessus d'eux.

Le site de *L'Utile et l'Agréable* et l'animation des réseaux vivants sont deux actifs
distincts. Le premier utilise le second ; le second peut être exposé dans Studio avec
sa propre page, sa propre fonction et sa propre existence. Leur relation est inscrite
dans le registre et devient visible des deux côtés, sans créer un troisième objet
« complet » dont ils seraient les projections.

Le registre est donc un graphe atomique : des productions réelles, publiées à des
adresses réelles, reliées par des verbes explicites — utilise, prolonge, documente,
inspire, appartient à, démontre. Les liens inverses sont calculés automatiquement.

---

## 2. Nomenclature et frontière avec le système interne

Deux projets distincts coexistent :

| Nom | Nature | Public | Fonction |
|---|---|---:|---|
| **BAAM Hub** | OS interne d'agents, dossier historique `AgentOps/` | Non | Piloter, documenter et faire agir les agents sur l'écosystème |
| **BAAM.pro** | Site racine et registre public | Oui | Montrer, relier et faire croître l'actif public BAAM |

Pour éviter toute confusion :

- le produit public porte toujours le nom **BAAM.pro** ;
- son rôle peut être décrit comme « portail », « site racine », « carte » ou
  « hall public » ;
- l'expression **BAAM Hub** est réservée au système interne d'agents ;
- le BAAM Hub interne pourra lire, enrichir et administrer le registre public, mais
  il ne se confond pas avec lui.

---

## 3. Objectifs

BAAM.pro doit :

1. rendre immédiatement compréhensible l'étendue de l'écosystème BAAM ;
2. donner une identité stable à chaque production publique ;
3. montrer les relations entre œuvres, outils, recherches, concepts et offres ;
4. rendre automatiques et visibles les liens entre des actifs distribués sur plusieurs
   sites ;
5. offrir une chronologie visible de l'accumulation ;
6. donner accès aux territoires BAAM sans devenir un simple Linktree ;
7. préserver l'autonomie technique et éditoriale de chaque sous-domaine ;
8. fournir au BAAM Hub interne un contrat clair pour référencer les nouveaux actifs.

### Indicateur fondamental de réussite

Après la mise en place du système, publier quelque chose et faire grossir BAAM
doivent devenir une seule et même action.

---

## 4. Non-objectifs

La première version ne cherche pas à :

- fusionner tous les projets dans une seule application ;
- migrer immédiatement tous les sites existants ;
- uniformiser leurs directions artistiques jusqu'à les rendre interchangeables ;
- remplacer les sites spécialisés par une base de données générique ;
- exposer le fonctionnement ou les données privées du BAAM Hub interne ;
- construire d'emblée un CMS complexe ou une API surdimensionnée ;
- absorber les licences autonomes dans la marque BAAM.

---

## 5. Architecture de marque

### 5.1 Le site racine

`baam.pro` est le hall public de l'écosystème. Il présente :

- ce qu'est BAAM ;
- ce qui vient d'être produit ;
- les grands territoires ;
- les actifs remarquables ;
- les relations entre les productions ;
- la trajectoire et l'accumulation dans le temps ;
- les satellites autonomes.

Il ne doit pas reproduire intégralement les sites spécialisés. Il oriente, relie et
donne envie d'entrer.

### 5.2 Les territoires BAAM

Les territoires sont des fonctions durables de l'écosystème, déployées sur des
sous-domaines indépendants :

| Sous-domaine | Fonction principale | Question à laquelle il répond |
|---|---|---|
| `studio.baam.pro` | Vitrine de création et d'animation vectorielles : SVG d'abord, puis éventuellement sites et autres formes interactives | Qu'est-ce que BAAM crée et met en mouvement ? |
| `lab.baam.pro` | Expérimentations, prototypes et recherches en train de se faire | Qu'est-ce que BAAM est en train d'explorer ? |
| `editions.baam.pro` | Livres, textes longs et objets éditoriaux | Qu'est-ce que BAAM publie ? |
| `ideas.baam.pro` *(nom public : Idées)* | Version grand public de la démarche intellectuelle : articles, Cargos, idées et formes visuelles destinées à séduire, intriguer et transmettre | Comment donner envie d'entrer dans les idées de BAAM ? |
| `research.baam.pro` | Version formalisée de la recherche : cadres, méthodes, protocoles, sources et résultats reproductibles | Comment poser et transmettre un cadre vérifiable et réutilisable ? |
| `agence.baam.pro` | Offres, interventions et cas d'implémentation IA | Qu'est-ce que BAAM peut faire avec ou pour une organisation ? |
| `tools.baam.pro` | Outils de fabrication, de publication et de production réutilisables | Avec quoi BAAM fabrique-t-il ? |
| `games.baam.pro` | Jeux, simulations et systèmes ludiques | À quoi BAAM fait-il jouer ou réfléchir par le jeu ? |
| `apps.baam.pro` | Applications métier, dont les outils spécialisés pour l'architecture et le pilotage | Qu'est-ce que BAAM permet de faire au travail ? |

Cette liste constitue l'architecture initiale. Un nouveau territoire ne doit être créé
que s'il correspond à une fonction durable, et non à un projet isolé.

### 5.3 Les licences autonomes

Certaines créations possèdent leur propre nom, leur propre public et leur propre
logique de marque. Elles restent autonomes : Trame, archiNorm, archiCarto,
archiTime, Fink, TdF, ainsi que les futures licences du même type.

BAAM.pro les référence comme des **satellites** ou des **licences issues de
l'écosystème**, sans les renommer ni les forcer à adopter un sous-domaine BAAM.

---

## 6. Modèle conceptuel : un graphe atomique

Le registre repose sur deux primitives seulement : des **nœuds** et des **relations**.
Il ne suppose aucune hiérarchie universelle entre eux.

### 6.1 Nœud / actif

Un actif est une chose publique concrète et adressable : article, animation, outil,
livre, site, épisode, protocole, visualisation, démonstrateur, vidéo, jeu de données ou
service. Il possède sa propre identité et sa propre URL.

Il n'existe pas d'« actif transcendant » dont un article et une animation seraient les
manifestations. Si un article parle d'une animation, ce sont deux nœuds différents
reliés par `documents`, `uses`, `inspired-by` ou un autre verbe précis.

### 6.2 Relation

Une relation est une arête orientée entre deux actifs. Elle est déclarée une seule
fois, puis son inverse est rendu visible automatiquement lorsque c'est pertinent.

```text
Site L'Utile et l'Agréable
        │
        ├── utilise ──────→ Animation « Deux réseaux vivants »
        │                         │
        │                         └── dérive de ─→ Recherche / prototype antérieur
        │
        └── contient ─────→ Épisode 01
```

Aucun troisième objet canonique n'est nécessaire pour rendre cet ensemble cohérent.

### 6.3 Territoire

Un territoire est une vue éditoriale durable du graphe : Studio, Lab, Éditions,
Idées, Research, Agence, Tools, Games ou Apps. Il sélectionne et met en scène certains nœuds selon
sa fonction, mais ne les transforme pas en représentations d'un objet supérieur.

Un territoire peut également être un **agrégateur récursif**. Lab, par exemple,
réunit des projets vivant dans des dépôts et des déploiements autonomes. Chacun publie
son propre manifest ; Lab les compile, les présente et republie un registre territorial.
BAAM.pro consomme ensuite ce registre territorial comme une source unique. La
hiérarchie décrit donc une présentation et une circulation de métadonnées, jamais une
dépendance de code ou une propriété intellectuelle supérieure.

### 6.4 Projet ou collection

Un projet est un regroupement utile dans le temps. Il peut être une simple métadonnée
ou devenir lui-même un nœud public lorsqu'il possède une page et une existence
propres. Cette souplesse évite d'imposer artificiellement une arborescence unique à
toutes les productions.

---

## 7. Registre public BAAM

### 7.1 Rôle

Le registre est la source commune qui permet aux sites distribués de savoir :

- quels actifs existent ;
- où ils vivent réellement ;
- à quels projets, collections et territoires ils sont associés ;
- à quels autres actifs ils sont reliés ;
- quels liens inverses doivent être affichés automatiquement ;
- quel est leur état de publication.

Le registre décrit les actifs et leurs relations. Il ne dicte pas la manière dont
chaque site doit les raconter.

### 7.2 Identité minimale d'un actif

```json
[
  {
    "id": "lutile-et-lagreable-en-ligne",
    "title": "L'Utile et l'Agréable — édition en ligne",
    "summary": "Le feuilleton littéraire publié en ligne.",
    "type": "site-editorial",
    "status": "public",
    "createdAt": "2026-09-01",
    "updatedAt": "2026-10-01",
    "territory": "editions",
    "tags": ["roman", "feuilleton", "édition"],
    "url": "https://editions.baam.pro/lutile-et-lagreable",
    "relations": [
      {
        "type": "uses",
        "targetId": "deux-reseaux-vivants"
      }
    ]
  },
  {
    "id": "deux-reseaux-vivants",
    "title": "Deux réseaux vivants",
    "summary": "Une croissance parallèle de filaments neuronaux et cosmiques.",
    "type": "animation-interactive",
    "status": "public",
    "createdAt": "2026-09-30",
    "updatedAt": "2026-10-01",
    "territory": "studio",
    "tags": ["réseaux", "cosmos", "neurones", "génératif"],
    "url": "https://studio.baam.pro/reseaux-vivants",
    "relations": [
      {
        "type": "derived-from",
        "targetId": "recherche-reseaux-multi-echelles"
      }
    ],
    "media": {
      "cover": "https://baam.pro/media/reseaux-vivants-cover.webp"
    }
  }
]
```

Le premier nœud suffit à déclarer la relation d'usage. Le registre déduit et expose
`used-by` sur le second ; cette relation inverse n'est pas saisie une deuxième fois.

### 7.3 Types de relations initiales

- `part-of` — fait partie de (`contains` en sens inverse) ;
- `derived-from` — dérive de ;
- `inspired-by` — inspiré par ;
- `documents` — documente ;
- `demonstrates` — démontre une capacité ;
- `uses` — utilise (`used-by` en sens inverse) ;
- `links-to` — renvoie vers ;
- `extends` — prolonge ;
- `related-to` — relation libre lorsque la nature exacte n'est pas encore stabilisée.

Le vocabulaire doit rester court et contrôlé. De nouveaux types ne sont ajoutés que
lorsqu'une relation récurrente ne peut pas être exprimée avec ceux-ci.

Le schéma des relations définit pour chaque verbe s'il est directionnel, symétrique
ou doté d'un inverse. L'interface, les exports et les sites consommateurs reçoivent
les deux sens calculés ; la source n'en conserve qu'un afin d'éviter les divergences.

### 7.4 États de publication

- `draft` — actif connu mais non public ;
- `private` — actif interne qui ne doit jamais sortir dans le registre public ;
- `preview` — visible dans un contexte restreint ou annoncé ;
- `public` — publiable et indexable ;
- `archived` — conservé et relié, mais plus mis en avant.

Seuls les actifs explicitement marqués `public` ou `preview` peuvent être exportés
vers BAAM.pro. Cette règle permet au BAAM Hub interne de manipuler davantage
d'informations sans les publier accidentellement.

### 7.5 Manifest local et registres récursifs

Chaque dépôt autonome qui souhaite rejoindre l'écosystème publie un fichier
`baam.json`. Ce manifest est la source de vérité de proximité pour l'identité publique
du projet : titre, résumé, URL, statut, dates, aperçu et relations déclarées.

Un territoire compile les manifests qu'il a explicitement choisis dans un
`registry.json` territorial. Cette compilation :

- valide et normalise les champs ;
- filtre les entrées non publiques ;
- calcule les relations inverses ;
- trie les productions récentes ;
- conserve une copie du dernier état valide ;
- publie les données nécessaires à sa propre interface et à BAAM.pro.

BAAM.pro agrège ensuite les registres territoriaux. Il ne doit pas interroger chaque
dépôt atomique au runtime. Cette règle limite les pannes en cascade, les problèmes
CORS et les divergences de schéma.

```text
R-Time/baam.json ───────┐
Premiers/baam.json ─────┼──→ lab.baam.pro/registry.json
ManyView/baam.json ─────┘              ├──→ Lab : vue complète
                                       └──→ BAAM.pro : résumé du territoire
```

Le même contrat peut se répéter sous Tools, Games, Apps ou tout autre territoire.
Le détail normatif du manifest figure dans `MANIFEST.md`.

---

## 8. Ramification distribuée

Chaque actif existe d'abord là où il est réellement publié. Lorsqu'un autre site
l'utilise, le cite ou le prolonge, il crée un nouvel actif et une relation entre les
deux — pas une nouvelle projection du premier.

Exemple :

- Éditions publie le site de *L'Utile et l'Agréable* ;
- Studio publie l'animation « Deux réseaux vivants » ;
- le site du livre déclare qu'il `uses` l'animation ;
- le registre calcule que l'animation est `used-by` le site du livre ;
- chaque page peut afficher ce lien avec un vocabulaire adapté à son propre ton.

### Deux écritures intellectuelles distinctes

Idées et Research peuvent partir d'un voisinage intellectuel commun, mais
produisent des actifs différents :

- **Idées** séduit, raconte, simplifie sans appauvrir et ouvre une porte au
  grand public ;
- **Research** définit, source, formalise et pose un cadre reproductible.

Un article grand public et un protocole de recherche ne sont donc pas deux versions
d'un même actif. Ce sont deux productions reliées, par exemple par `derived-from`,
`documents` ou `extends`.

### Canonicalité limitée au Web

Chaque nœud possède sa propre URL de référence. La balise SEO `rel=canonical` reste
utilisée uniquement pour gérer de véritables duplications de pages. Elle ne structure
pas le modèle intellectuel du registre.

### Lecture automatique du graphe

La ramification doit être compréhensible sans interprétation visuelle du site :

- export global `graph.json` ;
- export sémantique `graph.jsonld` ;
- métadonnées JSON-LD embarquées dans chaque page publique ;
- identifiants et URLs stables ;
- relations typées et liens inverses calculés ;
- sitemap par territoire et sitemap fédéré depuis BAAM.pro.

Un robot doit pouvoir parcourir BAAM comme un graphe de productions reliées, et non
comme une juxtaposition de domaines indépendants.

---

## 9. Expérience du site racine

BAAM.pro doit donner l'impression d'un ensemble vivant qui s'étend, et non d'un
catalogue administratif.

### 9.1 Parcours initial

La page d'accueil doit permettre de comprendre, en quelques instants :

1. la proposition de BAAM ;
2. ce qui vient de bouger récemment ;
3. les territoires que l'on peut explorer ;
4. les relations entre quelques actifs emblématiques ;
5. l'existence de licences autonomes issues du même écosystème.

### 9.2 Composants fonctionnels envisagés

- une entrée manifeste très courte ;
- une constellation ou carte vivante des territoires ;
- un flux des dernières pierres ajoutées ;
- une sélection de constellations reliant des actifs de plusieurs territoires ;
- une chronologie de l'accumulation ;
- des cartes de territoires ;
- une zone satellites/licences autonomes ;
- une recherche transversale lorsque le volume le justifiera.

### 9.3 Éviter l'effet Linktree

Les cartes de territoires ne sont pas une simple liste de liens. Elles doivent
montrer des signes de vie : dernier actif, volume, relation récente, fragment visuel
ou mouvement en cours. Dans la vue Cards, une carte s'ouvre à sa place, repousse les
cartes qui la gênent et conserve son état au rechargement. Une seule carte est ouverte
à la fois afin que le tableau reste un instrument lisible. Le portail raconte
l'ensemble avant de distribuer le trafic.

---

## 10. Architecture technique distribuée

### 10.1 Principe

Chaque territoire reste une application et un déploiement Netlify indépendant.
L'ajout d'un territoire repose sur un sous-domaine et son enregistrement DNS :

```text
baam.pro                 → site racine
studio.baam.pro          → déploiement Studio
lab.baam.pro             → déploiement Lab
editions.baam.pro        → déploiement Éditions
ideas.baam.pro           → déploiement Ideas
research.baam.pro        → déploiement Research
agence.baam.pro          → déploiement Agence
tools.baam.pro           → déploiement Tools
games.baam.pro           → déploiement Games
apps.baam.pro            → déploiement Apps métier
```

Cette indépendance permet :

- des stacks et rythmes de déploiement distincts ;
- une panne locale sans chute de tout l'écosystème ;
- des identités éditoriales propres ;
- une mise en ligne simple via Netlify ;
- une migration progressive des sites existants.

### 10.2 Sources distribuées et compilation

La première version du registre doit rester simple et récursive :

- un `baam.json` versionné dans chaque dépôt autonome ;
- une liste explicite de sources autorisées dans chaque territoire ;
- validation par schéma au moment de la compilation ;
- un `registry.json` statique publié par chaque territoire ;
- agrégation de ces registres au build de BAAM.pro ;
- export global en JSON et JSON-LD sous `https://baam.pro/data/` ;
- copie locale du dernier registre valide à chaque niveau ;
- webhooks Netlify pour reconstruire le territoire après le déploiement d'un projet,
  puis BAAM.pro après la publication d'un registre territorial.

La consommation au build est privilégiée au départ : elle évite une dépendance
runtime, les problèmes CORS et le besoin prématuré d'un service permanent.

Une API ne sera introduite que si des besoins d'édition collaborative, de recherche
dynamique ou de synchronisation temps réel la rendent réellement nécessaire.

### 10.3 Propriété du contenu

- chaque projet possède son code, son déploiement et son manifest de proximité ;
- le territoire possède sa sélection, son ordre, ses textes éditoriaux et sa mise en scène ;
- le registre territorial normalise et republie les métadonnées publiques validées ;
- BAAM.pro possède la projection racine, les relations transversales et les exports globaux ;
- chaque territoire possède son texte éditorial détaillé et sa présentation ;
- les médias lourds restent dans leur dépôt ou leur stockage d'origine ;
- le registre référence les URLs des médias au lieu de les dupliquer sans nécessité.

---

## 11. Couche commune de cohérence

L'unité de BAAM ne doit pas reposer sur une mise en page identique partout. Elle
repose sur quelques invariants partagés :

- une signature BAAM commune ;
- une navigation inter-territoires discrète mais constante ;
- les mêmes identifiants d'actifs ;
- des composants de relation (« utilise », « est utilisé par », « issu de »,
  « prolonge ») ;
- une taxonomie et des métadonnées communes ;
- une convention d'attribution ;
- une couche minimale de typographie, de couleur et de mouvement partageable ;
- une capacité à revenir au portail racine.

Chaque territoire peut ensuite avoir une personnalité propre. La cohérence doit être
perceptible comme une parenté, pas comme un thème plaqué.

---

## 12. Gouvernance et lien avec le BAAM Hub interne

Le BAAM Hub interne doit être briefé sur le contrat du registre afin que ses agents
puissent proposer ou préparer le référencement d'un nouvel actif.

### 12.1 Flux cible

```text
création ou mise à jour d'un actif
            ↓
proposition de fiche par le BAAM Hub interne ou saisie manuelle
            ↓
validation humaine : identité, statut public, URL et relations
            ↓
écriture dans le registre versionné
            ↓
validation du schéma et publication du JSON public
            ↓
rebuild des territoires concernés
```

### 12.2 Règle de publication

Le BAAM Hub peut détecter, préparer, suggérer et relier. La décision de rendre public
un nouvel actif ou une nouvelle relation reste explicitement validée par
Antoine. Aucune donnée interne n'est publiée par défaut.

### 12.3 Identifiants

Les identifiants sont stables, lisibles, en minuscules, sans accent et séparés par des
tirets. Ils identifient la production concrète, sans inventer une entité supérieure
destinée à regrouper artificiellement plusieurs productions.

---

## 13. Feuille de route proposée

### Phase 0 — Cartographie

- recenser les sites, projets et productions existants ;
- distinguer territoires, projets, actifs et satellites ;
- repérer les doublons et les relations déjà visibles ;
- choisir un premier corpus représentatif de 15 à 30 actifs.

### Phase 1 — Contrat du registre

- stabiliser le schéma d'un actif ;
- stabiliser `baam.json`, la liste des sources et `registry.json` ;
- stabiliser les vocabulaires de types, statuts et relations ;
- écrire les règles de validation ;
- créer le premier compilateur territorial ;
- produire son export public statique.

**État au 2 octobre 2026 : première boucle territoriale livrée.** La source
de transition `data/registry.source.json` est validée et compilée par
`scripts/build-registry.js`. Les inverses, le tri par récence, le maintien du dernier
état valide, `registry.json`, `graph.json`, `graph.jsonld`, le JSON-LD embarqué et le
sitemap sont opérationnels. BAAM.Lab compile maintenant les `baam.json` autonomes de
R-Time, Pixel Bloom et Suite Première ; BAAM.pro consomme ce registre territorial et
en garde le dernier état valide. La prochaine itération décline le même kit vers
Games, Tools et Médias puis remplace progressivement les autres données de transition.

### Phase 2 — BAAM.pro minimal

- manifeste court ;
- carte des territoires ;
- flux des actifs récents ;
- fiches d'actifs ;
- vues par projet, type et territoire ;
- satellites autonomes ;
- liens vers les sites existants.

### Phase 3 — Première connexion réelle

- connecter BAAM Studio et BAAM Éditions au registre ;
- connecter trois dépôts Lab autonomes par leurs manifests et publier le premier
  `lab.baam.pro/registry.json` ;
- relier le site de *L'Utile et l'Agréable* à l'animation publiée dans Studio ;
- déclarer la relation une seule fois et afficher automatiquement son inverse ;
- valider les exports JSON, JSON-LD, les métadonnées SEO et les sitemaps.

**État au 2 octobre 2026 : le jalon Lab est livré.** Les trois manifests, le portail
graphique Lab, son compilateur, ses exports machine, ses caches de dernier état valide
et sa remontée automatique dans BAAM.pro sont opérationnels. Les connexions Studio,
Éditions et la relation entre *L'Utile et l'Agréable* et son animation restent à
convertir au même contrat.

### Phase 4 — Boucle avec le BAAM Hub interne

- apprendre au BAAM Hub le schéma du registre ;
- générer des propositions de fiches non publiées ;
- ajouter une étape de validation humaine ;
- déclencher l'export et les builds concernés après validation.

### Phase 5 — Enrichissement

- recherche transversale ;
- chronologie approfondie ;
- visualisation du graphe de relations ;
- statistiques publiques choisies ;
- flux RSS/JSON Feed ;
- éventuelle API si les usages le nécessitent.

---

## 14. MVP : critères d'acceptation

La première version est considérée fonctionnelle lorsque :

- `baam.pro` présente clairement BAAM et ses territoires ;
- le registre contient au moins 15 actifs réels ;
- chaque actif possède un identifiant stable, un type, un statut et une URL ;
- au moins cinq actifs distribués sur trois territoires forment une chaîne de
  relations navigable ;
- une relation saisie dans un sens produit automatiquement un lien retour visible ;
- Studio et Éditions consomment réellement le même registre ;
- un robot peut reconstruire le graphe depuis `graph.jsonld` sans parcourir
  l'interface visuelle ;
- un nouvel actif peut être ajouté sans modifier manuellement le code des cartes de
  la page d'accueil ;
- au moins un territoire compile plusieurs manifests de dépôts autonomes et BAAM.pro
  consomme son registre territorial sans contacter directement ces dépôts ;
- le système interne et le site public sont impossibles à confondre dans les noms,
  la documentation et les déploiements ;
- aucune donnée privée du BAAM Hub ne peut apparaître dans l'export public sans
  changement explicite de statut.

---

## 15. Décisions acquises

- le nom public racine est **BAAM.pro** ;
- l'organisation visible repose sur des sous-domaines ;
- les déploiements restent autonomes sur Netlify ;
- un registre commun relie les actifs ;
- chaque production concrète est un nœud atomique avec sa propre URL ;
- les réemplois, citations et filiations sont des relations entre nœuds, sans actif
  canonique abstrait ;
- Idées et Research produisent des objets distincts : l'un séduit et transmet
  au grand public, l'autre formalise un cadre reproductible ;
- Studio est d'abord la vitrine de la création et de l'animation vectorielles ;
- les licences fortes restent autonomes et apparaissent comme satellites ;
- le BAAM Hub interne sera consommateur et contributeur sous validation du registre ;
- le système démarre par des fichiers structurés et un export statique, pas par une
  plateforme complexe.
- les dépôts autonomes publient leur propre `baam.json` ; les territoires compilent
  ces manifests et BAAM.pro agrège les registres territoriaux.

---

## 16. Questions encore ouvertes

Ces questions devront être tranchées pendant la cartographie, avant la conception
visuelle détaillée :

1. Quels actifs existants forment le premier corpus public ?
2. Quels éléments de direction artistique doivent être communs à tous les sites ?
3. Quelles relations doivent avoir un inverse automatique et comment doivent-elles
   être formulées dans chaque territoire ?
4. Quelles informations publiques sur le processus de création doivent être
   conservées dans la chronologie ?
5. Où versionner les listes de sources territoriales et les copies du dernier registre
   valide lorsque les premiers compilateurs seront branchés ?

---

## 17. Formule de synthèse

> **BAAM.pro est la carte publique d'une création en ramification : chaque production
> est un nœud autonome, chaque filiation est un lien explicite, et l'ensemble devient
> lisible comme un seul organisme plutôt que comme une collection de troncs séparés.**

