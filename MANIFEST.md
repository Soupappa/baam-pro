# Contrat des manifests BAAM

Ce document formalise le passage entre un dépôt autonome, son territoire de
présentation et le portail racine BAAM.pro.

## 1. Principe

Un dépôt autonome reste un projet complet : code, historique Git, déploiement,
documentation et rythme propres. Il rejoint l'écosystème en publiant un fichier
`baam.json` à sa racine ou à l'URL publique `/.well-known/baam.json`.

Le manifest ne transfère pas la propriété du projet au territoire. Il déclare seulement
une identité publique stable et les relations que le projet souhaite exposer.

## 2. Flux de compilation

```text
projet/baam.json
      ↓ validation
territoire/registry.json
      ├──→ interface du territoire
      ├──→ flux des dernières productions
      └──→ BAAM.pro
              ↓
         graph.json + graph.jsonld
```

Chaque niveau conserve le dernier registre valide. Une source indisponible ne doit
jamais faire disparaître silencieusement un projet déjà publié.

## 3. Manifest minimal

```json
{
  "$schema": "https://baam.pro/schema/manifest-v1.json",
  "schemaVersion": 1,
  "id": "r-time",
  "title": "R-Time",
  "summary": "Explorer les déformations du temps dans le navigateur.",
  "type": "simulation-interactive",
  "status": "public",
  "territories": ["lab", "games"],
  "url": "https://rtime.lab.baam.pro",
  "repository": "https://github.com/baam-pro/r-time",
  "createdAt": "2025-05-01",
  "updatedAt": "2026-10-01",
  "tags": ["temps", "relativité", "simulation"],
  "preview": {
    "type": "iframe",
    "url": "https://rtime.lab.baam.pro",
    "poster": "https://rtime.lab.baam.pro/preview.webp"
  },
  "relations": [
    { "type": "related-to", "targetId": "suite-premiere-visualizer" }
  ]
}
```

## 4. Propriété des champs

| Couche | Possède | Ne possède pas |
|---|---|---|
| Projet | identité locale, URL, dates, aperçu, relations déclarées | ordre d'apparition dans un territoire |
| Territoire | sélection des sources, validation, ordre éditorial, textes de contexte | code et contenu interne du projet |
| BAAM.pro | projection racine, relations transversales, export global | présentation détaillée de chaque territoire |

Un même manifest peut être sélectionné par plusieurs territoires. R-Time peut ainsi
apparaître dans Lab comme expérience et dans Games comme simulation, sans duplication
du projet ni création d'un actif abstrait supérieur.

## 5. Aperçus

`preview.type` accepte initialement :

- `iframe` — page publique embarquable et vivante ;
- `svg` — animation ou illustration vectorielle ;
- `image` — poster stable lorsque l'embarquement est impossible ;
- `video` — boucle de gameplay ou démonstration courte, accompagnée d'un poster ;
- `none` — carte typographique assumée.

Le poster est un repli, pas la source principale. Les interfaces doivent préserver
l'animation des SVG et des pages embarquées, y compris dans leurs variantes visuelles.

Une preview vidéo suit ce contrat :

```json
{
  "type": "video",
  "poster": "https://jeu.games.baam.pro/preview/gameplay.webp",
  "width": 1280,
  "height": 720,
  "alt": "Une phase de jeu en cours.",
  "sources": [
    { "url": "https://jeu.games.baam.pro/preview/gameplay.webm", "type": "video/webm" },
    { "url": "https://jeu.games.baam.pro/preview/gameplay.mp4", "type": "video/mp4" }
  ]
}
```

Le poster, le texte alternatif, les dimensions et au moins une source WebM ou MP4
sont obligatoires. Une interface ne lance la vidéo que lorsqu'elle est utile et
visible. Elle la suspend quand la carte se ferme, sort du viewport ou que l'onglet
est masqué. `prefers-reduced-motion` et l'économie de données conservent le poster.
BAAM.pro utilise le poster dans ses petits carrousels afin de ne pas multiplier les
lectures automatiques ; le territoire détaillé possède la boucle vivante.

## 6. Dernières productions

Un territoire expose par défaut ses trois entrées publiques les plus récentes selon
`updatedAt`. Il peut épingler explicitement une entrée, mais ne doit pas réécrire les
dates pour piloter sa présentation.

La première interface utilise trois cartes fixes. Le contrat prévoit une évolution
vers un rail horizontal cyclique sans changer le format des manifests.

## 7. Déclenchement des builds

1. Le dépôt projet valide puis déploie son manifest.
2. Une notification de déploiement réussi appelle le build hook du territoire.
3. Le territoire relit le manifest public, compile et publie son `registry.json`.
4. Une notification de déploiement territorial réussi appelle le hook de BAAM.pro.
5. BAAM.pro relit le registre public et reconstruit ses exports globaux.

Cette chaîne reste statique au départ. Aucun service central permanent n'est requis.

L'implémentation Netlify utilise un hook descendant par niveau. Chaque dépôt de jeu
déclenche BAAM.Games après un `Deploy succeeded` ; BAAM.Games déclenche ensuite
BAAM.pro selon la même règle. Ce déclenchement post-publication empêche le niveau
suivant de relire une ancienne version. Les URLs des hooks restent privées et ne sont
jamais versionnées. Un changement de gameplay est ainsi publié immédiatement à l'URL
stable du jeu ; un changement de manifest se propage en plus dans les deux registres
agrégés.

## 8. Première implémentation dans BAAM.pro

Le portail racine dispose désormais de son premier compilateur déterministe :

- `data/registry.source.json` sert de source locale de transition avant l'arrivée des
  registres territoriaux et des manifests distants ;
- `scripts/build-registry.js` contrôle les identifiants, statuts, dates, URLs, cibles
  et le vocabulaire des relations ;
- seules les relations canoniques sont admises dans la source ;
- les inverses sont ajoutés aux sorties avec `generated: true` ;
- les actifs sont triés par `updatedAt` dans chaque territoire ;
- `public/data/registry.json`, `graph.json` et `graph.jsonld` sont reconstruits au build ;
- `public/sitemap.xml` et les métadonnées JSON-LD de la page racine sont produits à
  partir de la même source ;
- un build invalide échoue avant l'écriture et laisse les derniers exports valides
  intacts.

Le vocabulaire source initial est : `part-of`, `derived-from`, `inspired-by`,
`documents`, `demonstrates`, `uses`, `links-to`, `extends`, `related-to`.
`contains`, `source-of`, `inspires`, `documented-by`, `demonstrated-by`, `used-by`,
`linked-from` et `extended-by` sont exclusivement des inverses compilés.

## 9. Première boucle territoriale opérationnelle

BAAM.Lab applique désormais ce contrat de bout en bout :

- R-Time, Pixel Bloom et Suite Première possèdent chacun leur `baam.json` dans leur
  dépôt autonome ;
- `site-lab.baam.pro/portal.config.json` choisit explicitement les sources autorisées
  et leur ordre éditorial ;
- `site-lab.baam.pro/scripts/build-portal.js` compile ces sources dans
  `public/data/registry.json` et `public/data/graph.jsonld` ;
- une copie de chaque dernier manifest valide est conservée sous
  `site-lab.baam.pro/data/manifests/` ;
- `site-baam.pro/scripts/build-registry.js` importe le registre territorial grâce à
  `data/territory.sources.json` : dépôt frère en local, URL publique en production,
  puis cache si les deux sources vivantes sont indisponibles ;
- le portail racine conserve à son tour le dernier registre territorial valide sous
  `data/territories/`.

Cette double mémoire est volontaire : elle permet de reconstruire Lab et BAAM.pro
même lorsqu'un dépôt ou un sous-portail est momentanément indisponible. Les futurs
portails Games, Tools et Médias doivent reprendre cette topologie plutôt que déclarer
leurs contenus directement dans le registre racine.
