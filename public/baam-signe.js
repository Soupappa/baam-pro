/* baam-signe.js — le signe BAAM en composant web, pour tous les sites de l'écosystème.
 *
 *   <script src="baam-signe.js" defer></script>
 *   <baam-signe></baam-signe>                         BAAM▪  (marque mère, point neutre)
 *   <baam-signe univers="solutions"></baam-signe>     BAAM▪SOLUTIONS
 *   <baam-signe univers="lab" devise adresse></baam-signe>
 *   <baam-signe roulette devise adresse autoplay></baam-signe>
 *   <baam-signe roulette clic devise signature></baam-signe>  signature « Avant tout, un mouvement. » sous la devise
 *   <baam-signe roulette clic ligne mere devise></baam-signe> version en-tête : la devise sort à droite du signe,
 *       et la marque mère fait partie des tirages (BAAM▪  Avant tout, un mouvement.),
 *       garantie au plus tard au 5e lancer si les 4 précédents ne l'ont pas donnée
 *   <baam-signe roulette cible="tools"></baam-signe>  la roulette s'arrête sur Tools
 *   <baam-signe roulette clic></baam-signe>           BAAM▪ au repos ; un clic (ou Entrée) lance la roulette
 *
 * Taille : font-size du parent ou --baam-taille. Couleur du texte : color du parent.
 * Géométrie (univers de marque v1) : point carré de 0,19 × corps, bas du point à 0,80 × corps
 * depuis le haut des capitales, écart de 0,45 × point de chaque côté. Le point reste sur cette
 * ligne dans tous les modes, roulette comprise.
 * Méthodes : el.lancer(cible?) relance la roulette ; el.repos() revient à BAAM▪ (roulette). Événement : « baam-arret » (detail.univers).
 * Polices : charge Bebas Neue et DM Sans depuis Google Fonts si absentes (attribut sans-polices pour l'empêcher).
 */
(() => {
  const U = [
    { k: 'studio', n: 'STUDIO', c: '#00F058', v: 'Animer', o: 'les vecteurs' },
    { k: 'solutions', n: 'SOLUTIONS', c: '#00BFD1', v: 'Libérer', o: 'du temps' },
    { k: 'research', n: 'RESEARCH', c: '#244CFF', v: 'Déformer', o: 'la question' },
    { k: 'lab', n: 'LAB', c: '#F00098', v: 'Prototyper', o: "l'inconnu" },
    { k: 'tools', n: 'TOOLS', c: '#753CFF', v: 'Offrir', o: 'les outils' },
    { k: 'apps', n: 'APPS', c: '#00A98F', v: 'Construire', o: "l'usage" },
    { k: 'games', n: 'GAMES', c: '#FF4268', v: 'Jouer', o: 'avec les règles' },
    { k: 'media', n: 'MÉDIA', c: '#F0D000', v: 'Transmettre', o: 'la curiosité' },
    { k: 'editions', n: 'ÉDITIONS', c: '#FF762E', v: 'Écrire', o: 'des mondes' }
  ];
  const BY = Object.fromEntries(U.map(u => [u.k, u]));
  const MERE = { k: 'mere', n: '', c: '', v: '', o: '', mere: true };   // tirage « marque mère »
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  let fontsAsked = false;
  function ensureFonts(host) {
    if (fontsAsked || host.hasAttribute('sans-polices')) return; fontsAsked = true;
    if (document.querySelector('link[href*="Bebas+Neue"]')) return;
    const l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@500&family=DM+Mono&display=swap';
    document.head.appendChild(l);
  }

  const CSS = `
  :host{display:inline-block;font-size:var(--baam-taille,1em);line-height:1;color:inherit;--c:currentColor}
  .sg{display:inline-flex;flex-direction:column;align-items:center;gap:.22em}
  .lk{display:flex;align-items:flex-start;font-family:"Bebas Neue",Impact,"Arial Narrow",sans-serif;font-weight:400;line-height:1;letter-spacing:.01em;white-space:nowrap}
  .b,.nm{display:block;height:1em;line-height:1}
  /* point : bas à 0,80 × corps, côté 0,19 × corps, écart 0,45 × point */
  .pt{flex:none;width:.19em;height:.19em;margin:.61em .085em 0;background:var(--c);transition:background .1s}
  .win{display:block;box-sizing:content-box;height:1em;padding-top:.2em;margin-top:-.2em;overflow:hidden;position:relative;transition:width .45s cubic-bezier(.2,.8,.2,1)}  /* .2em de marge haute pour les accents (É) */
  .reel{display:block;width:max-content}
  .reel span{display:block;height:1em;line-height:1;width:max-content}
  :host([clic]){cursor:pointer;-webkit-tap-highlight-color:transparent}
  :host([clic]:focus-visible){outline:2px solid currentColor;outline-offset:.12em}
  .repos .pt{margin-right:0}
  .rl .win{-webkit-mask-image:linear-gradient(transparent,#000 30%,#000 84%,transparent 89%);mask-image:linear-gradient(transparent,#000 30%,#000 84%,transparent 89%)}
  .dv{font-family:"DM Sans",system-ui,sans-serif;font-weight:500;font-size:.32em;line-height:1.2;text-align:center;letter-spacing:0;transition:opacity .4s}
  .dv b{font-weight:500;color:var(--c)}
  .ad{display:block;font-family:"DM Mono",ui-monospace,monospace;font-size:1em;margin-top:.3em;color:var(--c)}
  .sgn{display:block;font:inherit;margin-top:.15em;color:var(--c);transition:color .25s}  /* la signature prend la couleur de l'univers : le fil commun entre les domaines */
  .hide{opacity:0}
  /* version en-tête : la devise sort à droite, sur la ligne de base de BAAM, capitales à mi-hauteur de BAAM */
  :host([ligne]) .sg{flex-direction:row;align-items:baseline;gap:var(--ecart,2.6em)}  /* écart = largeur de « BAAM▪ » */
  :host([ligne]) .dv{font-size:.5em;line-height:1;text-align:left;white-space:nowrap;margin:0}
  :host([ligne]) .dv .sgn{display:inline;margin:0 0 0 .3em}
  @media (max-width:820px){:host([ligne]) .dv{display:none}}
  `;

  class BaamSigne extends HTMLElement {
    static get observedAttributes() { return ['univers', 'cible']; }
    connectedCallback() {
      ensureFonts(this);
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
      this.render();
      if (this.hasAttribute('roulette') && this.hasAttribute('clic') && !this._bound) {
        this._bound = true;
        this.tabIndex = this.tabIndex >= 0 ? this.tabIndex : 0;
        this.addEventListener('click', () => this.lancer());
        this.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.lancer(); } });
      }
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => this.mesurer());
      if (this.hasAttribute('roulette') && this.hasAttribute('autoplay')) {
        const go = () => setTimeout(() => this.lancer(), 400);
        (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go);
      }
    }
    attributeChangedCallback() { if (this.shadowRoot) this.render(); }
    get liste() { return this.hasAttribute('mere') ? [...U, MERE] : U; }
    get univers() { return BY[(this.getAttribute('univers') || '').toLowerCase()] || null; }

    render() {
      const r = this.hasAttribute('roulette'), u = this.univers;
      const nom = r
        ? `<span class="win"><span class="reel">${[0, 1, 2, 3].flatMap(() => this.liste).map(x => `<span>${x.n || '&#8203;'}</span>`).join('')}</span></span>`
        : (u ? `<span class="nm">${u.n}</span>` : '');
      const sig = this.hasAttribute('signature');
      const bas = (this.hasAttribute('devise') || this.hasAttribute('adresse') || sig)
        ? `<span class="dv${r && !sig ? ' hide' : ''}">${r && sig ? '<span class="sgn">Avant tout, un mouvement.</span>' : ''}</span>` : '';
      this.shadowRoot.innerHTML = `<style>${CSS}</style><span class="sg${r ? ' rl' : ''}" part="signe"><span class="lk" part="marque" aria-hidden="true"><span class="b">BAAM</span><span class="pt" part="point"></span>${nom}</span>${bas}</span>`;
      this.setAttribute('role', 'img');
      if (!r) this.paint(u);
      else {
        this.setAttribute('aria-label', this.hasAttribute('clic') ? 'BAAM — lancer la roulette des univers' : 'BAAM');
        if (this.hasAttribute('clic')) { this.setAttribute('role', 'button'); this.shadowRoot.querySelector('.sg').classList.add('repos'); this.shadowRoot.querySelector('.win').style.width = '0'; }
      }
    }

    /* largeur de chaque nom, en em : la fenêtre de la roulette épouse le nom affiché */
    mesurer() {
      const lk = this.shadowRoot && this.shadowRoot.querySelector('.lk');
      if (lk && this.hasAttribute('ligne')) {   // écart entre le signe et sa phrase : la largeur de « BAAM▪ »
        const f = parseFloat(getComputedStyle(lk).fontSize) || 16, b = lk.querySelector('.b').getBoundingClientRect(), pt = lk.querySelector('.pt').getBoundingClientRect();
        if (b.width > 0) this.shadowRoot.querySelector('.sg').style.setProperty('--ecart', ((pt.right - b.left) / f + .085).toFixed(3) + 'em');
      }
      const reel = this.shadowRoot && this.shadowRoot.querySelector('.reel'); if (!reel) return;
      const fs = parseFloat(getComputedStyle(this.shadowRoot.querySelector('.lk')).fontSize) || 16;
      const spans = [...reel.children].slice(0, this.liste.length);
      const w = spans.map((s, i) => this.liste[i].mere ? 0 : s.getBoundingClientRect().width / fs);
      // élément masqué (onglet en arrière-plan, aperçu non affiché) : largeurs nulles, on ne fige rien
      if (!w.length || Math.max(...w) <= 0) { this._w = null; this._wmax = 0; return; }
      this._w = w; this._wmax = Math.max(...w);
      const win = this.shadowRoot.querySelector('.win');
      if (!this.hasAttribute('clic') && win && !this._spin && this._t == null) win.style.width = this._w[0] + 'em';
    }

    paint(u) {
      const sg = this.shadowRoot.querySelector('.sg');
      sg.style.setProperty('--c', u && u.c ? u.c : 'currentColor');
      sg.classList.toggle('repos', !!(u && u.mere));
      const dv = this.shadowRoot.querySelector('.dv');
      if (dv && u && u.mere) {
        dv.innerHTML = 'Avant tout, un mouvement.'; dv.classList.remove('hide');
        this.setAttribute('aria-label', 'BAAM — Avant tout, un mouvement.'); return;
      }
      if (dv) {
        dv.innerHTML = (u && this.hasAttribute('devise') ? `${u.v} <b>${u.o}.</b>` : '') +
          (this.hasAttribute('adresse') ? `<span class="ad">${u ? u.k + '.' : ''}baam.pro</span>` : '') +
          (this.hasAttribute('signature') ? '<span class="sgn">Avant tout, un mouvement.</span>' : '');
        dv.classList.remove('hide');
      }
      this.setAttribute('aria-label', 'BAAM' + (u ? ' ' + u.n : '') + (u && this.hasAttribute('devise') ? ' — ' + u.v + ' ' + u.o : ''));
    }

    /* retour à l'état de repos : BAAM▪, point neutre, sans nom */
    repos() {
      if (!this.hasAttribute('roulette') || this._spin) return;
      const reel = this.shadowRoot.querySelector('.reel'); reel.getAnimations().forEach(a => a.cancel());
      this._t = null; this.render(); this.mesurer();
      this.dispatchEvent(new CustomEvent('baam-repos', { bubbles: true }));
    }

    lancer(cible) {
      if (!this.hasAttribute('roulette') || this._spin) return;
      const reel = this.shadowRoot.querySelector('.reel'), dv = this.shadowRoot.querySelector('.dv');
      const key = (cible || this.getAttribute('cible') || '').toLowerCase();
      const L = this.liste;
      const cib = key === 'mere' && this.hasAttribute('mere') ? MERE : BY[key];
      // avec « mere » : après 4 tirages sans la marque mère, le suivant est forcément BAAM▪
      const garantie = !cib && this.hasAttribute('mere') && (this._sansMere || 0) >= 4;
      const t = cib ? L.indexOf(cib) : garantie ? L.indexOf(MERE) : Math.floor(Math.random() * L.length);
      if (this.hasAttribute('mere')) this._sansMere = L[t].mere ? 0 : (this._sansMere || 0) + 1;
      const idx = L.length * 3 + t;
      this.shadowRoot.querySelector('.sg').style.setProperty('--c', 'currentColor');
      if (dv) dv.classList.add('hide');
      this._spin = true;
      this.mesurer();   // toujours remesurer : la page a pu être masquée au chargement
      const win = this.shadowRoot.querySelector('.win');
      this.shadowRoot.querySelector('.sg').classList.remove('repos');
      if (win) win.style.width = this._wmax ? this._wmax + 'em' : 'auto';
      const end = () => { this._spin = false; this._t = t; if (win) win.style.width = L[t].mere ? '0' : (this._w && this._w[t] > 0 ? this._w[t] + 'em' : 'auto'); this.paint(L[t]); this.dispatchEvent(new CustomEvent('baam-arret', { detail: { univers: L[t].k }, bubbles: true })); };
      reel.getAnimations().forEach(a => a.cancel());
      const anim = reel.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-idx}em)` }],
        { duration: RM() ? 1 : 1700, easing: 'cubic-bezier(.15,.7,.2,1)', fill: 'forwards' });
      anim.onfinish = end;
      // pendant la roulette, le point prend la couleur du nom qui passe dans la fenêtre
      const sg = this.shadowRoot.querySelector('.sg'), fs = parseFloat(getComputedStyle(reel).fontSize) || 16;
      const suivre = () => {
        if (!this._spin) return;
        const ty = new DOMMatrixReadOnly(getComputedStyle(reel).transform).m42;
        const u = L[((Math.round(-ty / fs) % L.length) + L.length) % L.length];
        sg.style.setProperty('--c', u.c || 'currentColor');
        requestAnimationFrame(suivre);
      };
      requestAnimationFrame(suivre);
    }
  }
  if (!customElements.get('baam-signe')) customElements.define('baam-signe', BaamSigne);
  window.BAAM_UNIVERS = U;
})();
