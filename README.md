# BAAM.pro

Site public racine de l'écosystème BAAM et registre de ses actifs.

> **À ne pas confondre avec BAAM Hub** : le BAAM Hub est l'OS interne d'agents
> situé dans `baam-hub/`. BAAM.pro est le portail public qui rend l'écosystème
> lisible, navigable et cumulatif.

La spécification fondatrice du projet se trouve dans [SPEC.md](./SPEC.md).
Le contrat récursif des manifests et des registres territoriaux est détaillé dans
[MANIFEST.md](./MANIFEST.md).
Pour reprendre le chantier dans un nouveau fil, lire d'abord [HANDOFF.md](./HANDOFF.md) :
il contient l'état vérifié des déploiements et l'ordre des prochains lots.

## Architecture publique

```text
dépôt autonome ── baam.json ──→ registre compilé du territoire
                                      ├──→ site du territoire
                                      └──→ registre racine BAAM.pro
                                                    └──→ baam.pro
```

Un projet reste propriétaire de son code, de son déploiement et de son manifest.
Un territoire comme Lab agrège les manifests de ses projets et publie une projection
éditoriale ainsi qu'un `registry.json`. BAAM.pro consomme les registres territoriaux,
pas directement tous les dépôts. Cette même architecture peut se répéter à chaque
niveau sans créer de dépendance de code entre les projets.

## Première connexion réelle : BAAM.Lab

`site-lab.baam.pro/` est la première implémentation complète de ce contrat. Son
compilateur lit les manifests autonomes de R-Time, Pixel Bloom et Suite Première,
valide leurs données, calcule les relations inverses et publie son propre registre
ainsi qu'un graphe JSON-LD et un sitemap.

Le compilateur racine découvre ensuite ce registre via
`data/territory.sources.json`. Pour chaque territoire, il essaie le registre du dépôt
frère en local, puis son URL publique en production, et conserve une copie du dernier
état valide dans `data/territories/`. Une source momentanément indisponible ne fait
donc pas disparaître un territoire ou ses projets du portail public.

```text
R-Time/baam.json ───────────┐
pixel-bloom/baam.json ──────┼─→ site-lab.baam.pro/public/data/registry.json
suite-premiere/baam.json ───┘                      ↓
                                      site-baam.pro/public/data/registry.json
```

Lab sert maintenant de kit de référence pour Games, Tools et Médias : chaque portail
garde son identité graphique et son ordre éditorial, mais réutilise le même contrat
de données et la même mécanique de compilation.

## MVP local

Double-cliquer sur `lancer-site.bat`, puis ouvrir `http://127.0.0.1:8088`.

Le site statique se trouve dans `public/`. Netlify peut publier directement ce
dossier grâce à `netlify.toml`.

## Déploiement continu

Le dépôt GitHub public est la source du déploiement Netlify. La branche `main`
déclenche automatiquement `npm run build`, puis Netlify publie le dossier
`public/` sur `baam.pro`.

Le build reste autonome : il lit d'abord un éventuel dépôt territorial voisin, puis
le registre public déclaré dans `data/territory.sources.json`. Si les deux sont
indisponibles, sa dernière projection valide conservée dans `data/territories/` est
utilisée. Aucun dépôt de projet n'est requis dans le contexte de build Netlify.

La propagation est déclenchée après publication : un jeu publié avec succès appelle
la file groupée de BAAM.Games. Toutes les publications reçues dans une fenêtre de
cinq minutes sont fusionnées en une seule reconstruction de BAAM.Games, puis une
seule reconstruction de BAAM.pro. Les URLs de hooks et le jeton de la file restent
dans la configuration Netlify et ne sont jamais versionnés.

## Registre compilé

La source éditable est `data/registry.source.json`. Elle ne contient que les relations
déclarées ; leurs inverses ne sont jamais saisis à la main.

```text
data/registry.source.json
          ↓ scripts/build-registry.js
public/data/registry.json   interface
public/data/graph.json      graphe technique
public/data/graph.jsonld    graphe sémantique
public/sitemap.xml          indexation
```

Commandes :

```text
npm run check   validation sans écriture
npm test        refus d'une relation invalide + préservation du dernier export
npm run build   validation, inverses, tri et exports
npm run serve   serveur local sur le port 8088
```

Le build est déterministe : la date de compilation correspond à la date la plus
récente du corpus et un hash identifie exactement la source. En cas d'erreur, aucun
export n'est remplacé. Netlify exécute `npm run build` avant chaque publication.

