# SYSTÈME — le design system BAAM

Référence d'interface de tout l'écosystème BAAM (baam.pro et ses domaines), à lire avec
`MARQUE.md` avant de toucher à l'interface d'un site BAAM. La marque dit **qui parle**
(signe, couleurs, polices, voix) ; le système dit **comment on manipule** (cartes, gestes,
dépliage, thème).

- Deck de synthèse (audit de l'existant, nov. 2026) : https://claude.ai/artifact/DVn81VF49mqhWRsXBecas3
- Version : v0, novembre 2026 — issu de l'audit, pas encore entièrement appliqué.
- Toute évolution se fait ici, dans `site-baam.pro`, puis se propage.

## Principes

1. **Une unité : la carte.** Territoire, outil, système, jeu, module : tout entre dans une
   carte, et une carte peut en contenir d'autres. La carte est au système ce que le point
   carré est à la marque.
2. **Le geste avant le contenu.** Un même geste fait la même chose sur tous les sites.
3. **Vivant, mais au repos.** Chaque surface porte un champ génératif qui dort et s'anime
   à l'approche. Le mouvement est une réponse, pas un décor.
4. **Une couleur par surface.** La couleur d'univers vit dans le point, le nom, le bord et
   le champ ; le fond reste nuit ou papier.

## Grammaire des gestes

| Geste | Effet | Déjà en ligne |
|---|---|---|
| Survoler | réveiller, prévisualiser | champs vivants (baam.pro), bascule avant/après (Solutions) |
| Cliquer | déplier sur place | carte-territoire (baam.pro), carte d'outil (Tools), plis et tiroirs (Solutions) |
| Glisser | déplacer, lancer, tourner | rail des productions, cartes à gravité (Games), bureau 3D (Solutions) |
| Molette | zoomer, faire tourner | carte du réseau, rotation (Games), champs du livre de marque (toujours avec − ○ +) |
| Filtrer | recomposer le terrain | puces type × thème écrites dans l'adresse (Tools) |
| Basculer | changer d'état global | thème clair/nuit, langue FR/EN |

## La carte

Base de référence : la carte-territoire de baam.pro (`public/styles.css`).

- Grille 12 colonnes, gouttière 10 px. Carte au repos : 4 colonnes, 315 px de haut.
- **Repos** : champ qui dort, nom en couleur d'univers (Bebas), description en mono.
- **Survol** : le champ s'anime, `translateY(-4px) scale(1.012)`, bord intérieur 2 px couleur.
- **Ouverte** : 8 colonnes sur 3 rangées, les autres cartes se rangent (grille dense).
- **Imbriquée** : contient un aperçu et un rail d'autres cartes.
- Rôles par domaine : la **fiche** (Tools), le **panneau** (Lab), l'**objet** (Games),
  la **brique** (Solutions). Base commune, rôle au choix du domaine.

## Imbrication — quatre niveaux, un clic chacun

N0 constellation (tout BAAM) › N1 territoire › N2 production / outil › N3 détail (pli,
tiroir, cadre d'outil). On ne saute pas de niveau ; le parent reste visible ; le fil se
lit dans le signe (`BAAM▪TOOLS › Splats`). Modèle N3 : le tiroir à plis de Solutions.

## Jouer avec les cartes — trois façons de poser

**Grille** (redistribution à l'ouverture), **rail** (file glissée dans une carte ouverte),
**gravité** (cartes-objets, Games). Cible : un seul composant « table » à trois modes.

## Tokens

- Polices, couleurs, neutres : voir `MARQUE.md` (Bebas Neue · DM Sans · DM Mono ; nuit,
  encre, papier, blanc, gris ; neuf couleurs d'univers). Accent manuscrit Caveat toléré
  sur Solutions comme voix propre du domaine.
- Easing : `cubic-bezier(.16, 1, .3, 1)` (expo-out), 320 à 420 ms pour les dépliages,
  150 à 220 ms pour les retours d'état. Déjà commun à baam.pro, Lab, Solutions.
- À décider : angles (vif partout ou curseur de domaine), ombres (décalée sans flou ou
  douce).

## Noyau et curseurs de domaine

**Noyau, identique partout** : le signe `baam-signe`, la table des gestes, la carte et ses
quatre états, la grille, l'easing, les trois polices, les neutres et les neuf couleurs.

**Curseurs, réglés par chaque domaine** : fond (nuit ↔ papier), densité, angle, matière
(trame, verre, papier, HUD), part de jeu (calme ↔ physique). Les matières propres à chaque
domaine (néon de Studio, verre de Solutions, table de Games, panneaux du Lab, colonne
éditoriale de Research, fiches de Tools) sont à protéger.

## Mode nuit

Un vrai jeu de tokens sombres, pas un filtre qui efface la couleur : en nuit, les noms,
points, bords et champs gardent leur couleur d'univers (la couleur est le lien entre les
domaines). Les champs SVG passent sur fond nuit sans perdre leur teinte.

## Écarts relevés (audit nov. 2026)

1. Mot-signe redessiné à la main sur chaque site (BAAM·TOOLS, BAAM.LAB, point rond, minuscules).
2. Polices et couleurs proches mais hors charte (Impact, Inter, Arial ; #00d95f, #00a86b,
   #087a59, #5b45ff, #e63a2e).
3. Mode nuit de baam.pro par filtre gris + inversion : les univers perdent leur couleur.
4. Trois interrupteurs de thème différents, aucun sur Tools ni Research.
5. Carte du réseau codée dans baam.pro mais sans bouton d'accès.
6. Survol sans équivalent tactile ; pas de `:focus-visible` sur Tools, Lab, Research, Studio.
7. Pas de `prefers-reduced-motion` sur Research et Studio.
8. Icônes d'onglet et aperçus de partage hérités des outils (Lovable, Bolt) ou captures :
   aucun ne porte la marque. Réponse : le B. (`MARQUE.md`, `public/icones/`).

## Passes

- **Passe 1 — unification (en cours)** : mot-signe partout, mode nuit de baam.pro,
  polices et couleurs, icônes d'onglet et de partage (le B.). Prompt : `PASSE-UNIFICATION.md` (dev en local, validation par Antoine, puis un push commun pour un seul redéploiement par site).
- **Feuille de route** (après la passe 1) : composant de thème unique (`baam-bascule`) et
  interrupteur sur tous les sites ; retour de la carte du réseau ; équivalents tactiles du
  survol et focus clavier ; réglage « moins d'animations » partout ; composants
  `baam-carte`, `baam-table`, `baam-filtres` ; page `/systeme/` à côté de `/marque/`.
