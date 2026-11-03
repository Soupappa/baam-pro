# MARQUE — BAAM, un point, neuf directions

Référence de marque de tout l'écosystème BAAM, à lire avant de produire un visuel,
une motion, une page ou un document aux couleurs de BAAM ou d'un de ses univers.

- **Livre de marque complet** (vivant, non indexé) : `public/marque/index.html`, en ligne sur
  `https://baam.pro/marque/`.
- **Composant du signe** : `public/baam-signe.js`, servi sur `https://baam.pro/baam-signe.js`.
  Les autres sites le chargent depuis cette adresse plutôt que d'en garder une copie.
- Version : v1, novembre 2026. Toute évolution de charte se fait ici, puis se propage.

## Concept

BAAM = *Before Anything A Movement* — « Avant tout, un mouvement ».
Un seul signe, le point carré ; neuf directions qui en partent et y reviennent.
Le geste avant le sens. Des systèmes plutôt que des fichiers figés. De la sobriété.

## Le signe

- `BAAM` en **Bebas Neue**, capitales, puis le **point carré**, puis le nom d'univers à la même taille :
  `BAAM▪SOLUTIONS`. Marque mère seule : `BAAM▪`.
- Point : **0,19 × corps**, carré (jamais rond), bas du point sur la ligne de base,
  soit **0,80 × corps** depuis le haut d'une ligne de hauteur 1 em.
- Écart : **0,45 × point** de chaque côté (0,085 em). Aucune espace typographique.
- Point de la marque mère : neutre (encre sur papier, papier sur nuit). Point d'univers : sa couleur.
- Zone de protection : 2 points autour du bloc. Taille mini : 18 px de haut écran, 6 mm imprimé.

## Icône — le B.

L'icône de BAAM partout où le signe entier ne tient pas : onglet du navigateur, écran
d'accueil, aperçu de partage (WhatsApp, réseaux, messageries).

- `B` en **Bebas Neue** (papier `#F5F5F0`) suivi du **point carré** à la couleur de l'univers,
  même géométrie que le signe (point 0,19 em, écart 0,085 em, bas du point sur la ligne de base).
- Sur tuile **Nuit** `#070707`, carrée, sans arrondi. Marque mère : point papier.
- Aperçu de partage 1200 × 630 : le B. seul, centré sur nuit (survit au recadrage carré).
- Fichiers prêts, servis par baam.pro : `public/icones/` → `https://baam.pro/icones/`
  `b-<univers>.svg` (onglet), `b-<univers>-32.png`, `b-<univers>-180.png` (écran d'accueil),
  `b-<univers>-512.png`, `b-<univers>.ico`, `og-<univers>.png` (partage).
  `<univers>` : mere, studio, solutions, research, lab, tools, apps, games, media, editions.
- Ne jamais : arrondir la tuile ou le point, mettre la couleur en fond de tuile, utiliser
  une icône d'outil (Lovable, Bolt…) ou une capture.

## Couleurs

| Rôle | Nom | Code |
|---|---|---|
| Fond principal | Nuit | `#070707` |
| Texte sur papier | Encre | `#0B0B0A` |
| Texte sur nuit | Papier | `#F5F5F0` |
| Paillasse | Blanc | `#FFFFFF` |
| Légendes | Gris | `#9A9A94` |

| Univers | Couleur | Devise | Adresse |
|---|---|---|---|
| STUDIO | `#00F058` | Animer les vecteurs | studio.baam.pro |
| SOLUTIONS | `#00BFD1` | Libérer du temps | solutions.baam.pro |
| RESEARCH | `#244CFF` | Déformer la question | research.baam.pro |
| LAB | `#F00098` | Prototyper l'inconnu | lab.baam.pro |
| TOOLS | `#753CFF` | Offrir les outils | tools.baam.pro |
| APPS | `#00A98F` | Construire l'usage | apps.baam.pro (à confirmer) |
| GAMES | `#FF4268` | Jouer avec les règles | games.baam.pro |
| MÉDIA | `#F0D000` | Transmettre la curiosité | media.baam.pro (à confirmer) |
| ÉDITIONS | `#FF762E` | Écrire des mondes | editions.baam.pro (à confirmer) |

- La couleur vit dans le point, la seconde ligne de la devise, le halo et les circuits. Jamais en aplat de fond.
- Une seule couleur d'univers par surface. Les neuf ensemble (« la rangée ») seulement pour dire « tout BAAM ».
- Sur blanc, Studio, Média, Solutions, Éditions et Apps ne passent pas en texte : point et halo seulement.
  Sur nuit, Research et Tools sont réservés aux grands corps.

## Typographies

- **Bebas Neue** : signer et nommer (mot-signe, univers, titres courts), toujours en capitales.
- **DM Sans** (500 pour les devises, 400 pour le texte) : parler.
- **DM Mono** : situer (adresses, repères, données).
- Échelle motion 1080 px : marque 142 · devise 104 · interligne 1,12.

## Voix

- Devise = un verbe à l'infinitif (blanc / encre) + un complément (couleur de l'univers), 2 à 4 mots.
- Ton direct, singulier, sans jargon ni superlatif. « Je » sur LinkedIn.
- Une devise ne s'affiche **qu'avec son propre nom d'univers**.

## Matières et motion

- Trame à circuits fine (couleur de l'univers), halo radial doux, et un champ SVG vivant par univers
  (`public/assets/` : studio-swarm-viscous, agence-nappe-claque, research-champ-pixels, lab-champ-tubes,
  tools-grille-figure8, apps-inverted-gravity, games-nappe-reveal, idees-nappe-visqueuse, editions-paysage-horizon).
- Motion : le point d'abord ; le nom tombe sur le temps fort (0,34 s) ; la devise suit puis se condense
  dans son propre point (0,26 s) ; chaque univers laisse un pixel dans la rangée ; signature par l'acronyme.

## Règles

Ne jamais : arrondir le point · mélanger deux univers · mettre la couleur en aplat · écrire « Baam » ou
changer de police · ajouter un point final (`BAAM.SOLUTIONS.`) · déformer, détourer, ombrer ·
écrire une devise sans verbe · afficher une devise avec un autre nom.

## Variables CSS

```css
:root{
  --baam-nuit:#070707; --baam-encre:#0b0b0a; --baam-papier:#f5f5f0; --baam-blanc:#ffffff; --baam-gris:#9a9a94;
  --baam-studio:#00F058; --baam-solutions:#00BFD1; --baam-research:#244CFF; --baam-lab:#F00098; --baam-tools:#753CFF;
  --baam-apps:#00A98F; --baam-games:#FF4268; --baam-media:#F0D000; --baam-editions:#FF762E;
  --baam-f-marque:"Bebas Neue",Impact,sans-serif; --baam-f-texte:"DM Sans",system-ui,sans-serif; --baam-f-mono:"DM Mono",ui-monospace,monospace;
  --baam-point:.19em; --baam-ecart:.085em;
}
```

## Composant

```html
<script src="https://baam.pro/baam-signe.js" defer></script>
<baam-signe></baam-signe>                              <!-- BAAM▪ -->
<baam-signe univers="lab" devise adresse></baam-signe> <!-- BAAM▪LAB + devise + adresse -->
<baam-signe roulette clic></baam-signe>                <!-- en-tête : un clic lance la roulette -->
```

## Chantiers ouverts

- Remplacer `#00d95f` par `#00F058` dans les motions et le CSS de baam.pro ; `#5b45ff` par `#753cff` sur Tools.
- Accent de baam.pro : point neutre ou cycle des neuf couleurs plutôt que le vert de Studio (à trancher).
- Confirmer les adresses apps, media, editions.
