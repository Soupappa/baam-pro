# Passe 1 — unification de la marque sur les sites BAAM

Prompt pour un agent de code qui travaille dans `C:\Users\ANTOINE\projects`.
Antoine ne code pas : il valide en regardant les sites en local, puis déclenche le push.

---

## Contexte

Tu fais une passe d'unification de marque sur tous les sites de l'écosystème BAAM.
Avant toute chose, lis en entier :

- `site-baam.pro/MARQUE.md` (charte : signe, couleurs, polices) ;
- `site-baam.pro/SYSTEME.md` (design system, écarts relevés, périmètre des passes) ;
- `site-baam.pro/public/baam-signe.js` (en-tête : API du composant du signe).

`site-baam.pro` est la maison mère : la charte, le composant et les tokens partagés vivent
là et sont servis sur `https://baam.pro/`. Les autres sites les chargent, ils n'en gardent
pas de copie.

Sites concernés :

| Domaine | Dossier | Sources à modifier |
|---|---|---|
| baam.pro (racine) | `site-baam.pro` | `public/` |
| studio | `baam.studio` | `index.html` (+ CSS inline) |
| solutions | `site-solutions.baam.pro` | `src/` puis build vers `dist/` |
| research | `BAAM research` | `index.html`, `references.html`, `Articles/*.html` |
| lab | `site-lab.baam.pro` | vérifier si `public/` est généré (`scripts/`, `data/`) |
| tools | `site-tools-baam.pro` | `src/`, `tools-src/`, `shared/` puis build vers `public/` |
| games | `site-games.baam.pro` | vérifier si `public/` est généré (`scripts/`, `data/`) |

Pour chaque site, repère d'abord si le dossier publié est généré par un script : si oui,
modifie les sources et relance le build, jamais le seul résultat.

## Périmètre — uniquement ces cinq points

### 1. Mot-signe partout

Remplace chaque mot-signe écrit à la main (en-tête, pied de page, menus) par le composant
partagé :

```html
<script src="https://baam.pro/baam-signe.js" defer></script>
<a href="…lien existant…" aria-label="…"><baam-signe univers="games"></baam-signe></a>
```

- Repérés : Games `BAAM.GAMES`, Lab `BAAM.LAB`, Tools `BAAM·TOOLS`, Solutions
  `BAAM.Solutions` (en-tête et pied), Research `research.baam`, Studio `BAAM.STUDIO`
  (nav et pied). Cherche les autres occurrences.
- Garde les liens et les `aria-label` existants. La taille se règle par `font-size` sur
  l'hôte : reprends la hauteur visuelle de l'ancien mot-signe.
- Pas de `roulette` sur les sites de domaine : elle est réservée à l'en-tête de baam.pro.
- Une devise ne s'affiche qu'avec son propre univers. Ajoute `devise` seulement là où un
  sous-titre existait déjà.
- Si le site charge déjà les polices (point 3), ajoute l'attribut `sans-polices`.
- Les mentions de « BAAM » dans le texte courant ne changent pas.

### 2. Mode nuit de baam.pro

Aujourd'hui (`site-baam.pro/public/styles.css`, règles `.theme-noir`), la nuit force
`--accent:#f5f5f0` sur toutes les cartes et passe les champs SVG en gris inversé : les
univers perdent leur couleur. Cible :

- en nuit, chaque carte garde sa couleur d'univers : nom, bord, survol, point ;
- les champs vivants passent sur fond nuit **sans perdre leur teinte** (piste à vérifier
  visuellement : `invert(1) hue-rotate(180deg)` à la place du gris) ;
- l'orbe du thème en nuit prend le vert de charte `#00F058` ;
- vérifie la lisibilité des neuf noms sur nuit (Research et Tools : grands corps seulement).

Ne change pas l'interrupteur lui-même ni sa mémorisation : le composant de thème unique
est prévu plus tard.

### 3. Polices

- Titres et noms : **Bebas Neue**, à la place d'Impact, d'Inter titre et d'Arial titre.
- Texte : **DM Sans**, à la place d'Inter, d'Arial, d'Arial Narrow, des polices système.
- Repères, étiquettes, données : **DM Mono**, à la place d'ui-monospace et de JetBrains Mono.
- Exception gardée : l'accent manuscrit **Caveat** de Solutions.
- Bebas est plus étroit et plus léger qu'Impact : vérifie chaque titre (débordement,
  coupure, hauteur de ligne) et ajuste les tailles si besoin, sans refaire la mise en page.
- Mutualise le chargement : crée `site-baam.pro/public/baam-tokens.css` (les variables CSS
  de `MARQUE.md` + l'import Google Fonts Bebas Neue, DM Sans 400/500/700,
  DM Mono 400/500) ; chaque site le charge depuis `https://baam.pro/baam-tokens.css` et
  utilise les variables `--baam-*`.

### 4. Couleurs

Remplacements de charte :

| Hors charte | Charte | Où |
|---|---|---|
| `#00d95f` (et `rgba(0,217,95,…)`) | `#00F058` | baam.pro CSS, `data/registry.json`, motions |
| `#5b45ff` | `#753CFF` | Tools |
| `#e63a2e` (rouge d'accent) | `#FF4268` | Games |

Puis fais l'inventaire des autres couleurs d'accent de chaque site (ex. `#00a86b` sur
Tools, `#087a59` et `#f47b2d` sur Solutions, l'acide `#c9ed17` de Games) : remplace
celles qui désignent un univers par sa couleur de charte, **laisse les autres et liste-les**
dans le rapport pour décision d'Antoine. N'invente aucune couleur.
Règles : une seule couleur d'univers par surface ; jamais en aplat de fond ; pas de petit
texte Studio, Média, Solutions, Éditions ou Apps sur blanc (point et halo seulement).

### 5. Icônes d'onglet et de partage — le B.

Aujourd'hui les onglets et les aperçus de partage (WhatsApp, réseaux) affichent des icônes
d'outils (Lovable, Bolt…) ou des captures. Partout, on met **le B.** à la couleur du
domaine (voir `MARQUE.md`, section « Icône — le B. »). Les fichiers sont déjà prêts dans
`site-baam.pro/public/icones/` : ne les redessine pas.

Pour chaque site, avec `<univers>` = mere (baam.pro), studio, solutions, research, lab,
tools ou games, dans le `<head>` de **chaque page HTML** publiée :

```html
<link rel="icon" href="https://baam.pro/icones/b-<univers>.svg" type="image/svg+xml">
<link rel="icon" href="https://baam.pro/icones/b-<univers>-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="https://baam.pro/icones/b-<univers>-180.png">
<meta property="og:image" content="https://baam.pro/icones/og-<univers>.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://baam.pro/icones/og-<univers>.png">
```

- Sur baam.pro, les chemins peuvent rester relatifs (`/icones/…`), sauf `og:image` et
  `twitter:image` qui doivent toujours être des adresses absolues.
- Remplace les anciennes balises icon, apple-touch-icon, og:image, twitter:image, et les
  `manifest` qui pointent vers d'anciennes icônes (mets-y les PNG 180 et 512 du B.).
  Garde les `og:title`, `og:description` existants ; ajoute-les seulement s'ils manquent,
  à partir du `<title>` et de la description de la page.
- Les navigateurs demandent aussi `/favicon.ico` à la racine : copie
  `b-<univers>.ico` à la racine du dossier publié de chaque site sous le nom
  `favicon.ico` (seule copie locale autorisée). Les anciennes icônes (Lovable, Bolt,
  images) vont dans `_a_supprimer/`, pas à la poubelle.
- Pages générées par un script (Tools, Lab, Games, Solutions, articles de Research) :
  mets les balises dans le gabarit, pas seulement dans le résultat.
- Les icônes apps, media et editions existent aussi, pour les sites à venir.

## Hors périmètre — ne pas toucher

Mise en page, contenus, textes, interactions, animations, cartes, carte du réseau,
interrupteur de thème (sauf le point 2), survol, accessibilité, réglage des animations.
Ces sujets sont dans la feuille de route de `SYSTEME.md`. Si tu vois un problème hors
périmètre, note-le dans le rapport sans le corriger.

## Déroulé — dev, validation, push commun

**Étape A — Dev, en local, sans aucun push.**

1. `site-baam.pro` d'abord : `baam-tokens.css`, mode nuit, polices, couleurs. Les autres
   sites dépendent de ses fichiers.
2. Puis un site après l'autre, dans cet ordre : Tools, Lab, Games, Research, Studio,
   Solutions.
3. Test local : `https://baam.pro/…` n'est pas encore à jour en ligne. Pour tester, sers
   `site-baam.pro` en local (`lancer-site.bat`, http://127.0.0.1:8088) et fais pointer
   **temporairement** les liens vers `http://127.0.0.1:8088/…`, ou utilise la redirection
   de ton outil de test. Avant de commiter, remets **toutes** les adresses sur
   `https://baam.pro/…` et vérifie par recherche qu'il ne reste aucun `127.0.0.1`.
4. Pour chaque site : vérifie dans le `<head>` rendu que les balises du point 5 sont là
   et que l'onglet affiche le B. ; rends la page au repos, ouverte (une carte dépliée), en nuit si le
   site l'a, en desktop 1440 px et en mobile 390 px. Garde les captures avant et après
   dans `site-baam.pro/docs/passe-1/<site>/` (dossier non publié).
5. Après chaque site, un commit local dans son dépôt :
   `unification marque : signe, polices, couleurs`. Pas de push.

**Étape B — Validation par Antoine.**

Arrête-toi et donne à Antoine :

- comment lancer chaque site en local, avec l'adresse ;
- pour chaque site, les captures avant et après côte à côte, et la liste courte de ce qui
  a changé ;
- les couleurs laissées de côté (point 4) et les points hors périmètre repérés.

Attends son feu vert explicite. S'il demande des corrections, fais-les et repasse en
validation. Ne pousse rien tant qu'il n'a pas validé l'ensemble.

**Étape C — Push commun, un seul redéploiement par site.**

Une fois tout validé :

1. Vérifie dans chaque dépôt : arbre propre, aucun `127.0.0.1`, builds à jour (`dist/`,
   `public/` régénérés), tests du dépôt s'il en a.
2. Pousse **`site-baam.pro` en premier** (les autres chargent `baam-signe.js` et
   `baam-tokens.css` depuis baam.pro), puis tous les autres sites à la suite, en une seule
   série. Un push par dépôt : pas de corrections poussées après coup, chaque push
   déclenche un déploiement Netlify payant.
3. Si tu ne peux pas pousser toi-même (pas d'identifiants), donne à Antoine un bloc unique
   de commandes, dépôt par dépôt dans cet ordre, à copier-coller tel quel.
4. Après le déploiement, vérifie sur les adresses en ligne que le signe, les polices,
   les couleurs et l'icône d'onglet s'affichent ; teste l'aperçu de partage de chaque
   domaine (outil de débogage de partage, ou envoi d'un lien sur WhatsApp — l'aperçu
   peut rester en cache un moment) ; rapporte.

## Contraintes de l'environnement

- Pas de droit de suppression sur la machine : ne supprime aucun fichier ; déplace ce qui
  doit partir dans un dossier `_a_supprimer/` et signale-le.
- Git « dubious ownership » possible sur certains dépôts :
  `git config --global --add safe.directory "*"`.
- Ne modifie pas la charte : si une règle de `MARQUE.md` semble fausse, signale-le au lieu
  de la contourner.

## Rapport final attendu

Par site : fichiers modifiés, remplacements de polices et de couleurs, mots-signes
remplacés, icônes et balises de partage posées, anciennes icônes déplacées, captures avant/après, points laissés pour décision, points hors périmètre notés.
