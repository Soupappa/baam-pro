(async () => {
  const [registryResponse, jsonLdResponse] = await Promise.all([
    fetch('/data/registry.json', { cache: 'no-store' }),
    fetch('/data/graph.jsonld', { cache: 'no-store' })
  ]);
  if (!registryResponse.ok) throw new Error(`Registre indisponible (${registryResponse.status})`);
  const registry = await registryResponse.json();
  if (jsonLdResponse.ok) {
    const jsonLd = await jsonLdResponse.json();
    const metadata = document.createElement('script');
    metadata.type = 'application/ld+json';
    metadata.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(metadata);
  }
  const assets = new Map(registry.assets.map((asset) => [asset.id, asset]));
  const territories = new Map(registry.territories.map((territory) => [territory.id, territory]));
  const OPEN_KEY = 'baam.pro.open-territories';
  const VIEW_KEY = 'baam.pro.view';
  const THEME_KEY = 'baam.pro.theme';

  function readOpenCards() {
    try {
      const saved = JSON.parse(localStorage.getItem(OPEN_KEY) || '[]');
      const valid = saved.find((id) => territories.has(id));
      return new Set(valid ? [valid] : []);
    } catch {
      return new Set();
    }
  }

  const openCards = readOpenCards();
  const viewButtons = [...document.querySelectorAll('.view-button')];
  const views = {
    cards: document.querySelector('#cards-view'),
    graph: document.querySelector('#graph-view')
  };
  const themeButton = document.querySelector('.theme-toggle');

  function setTheme(noir, persist = true) {
    document.documentElement.classList.toggle('theme-noir', noir);
    themeButton.setAttribute('aria-pressed', String(noir));
    themeButton.setAttribute('aria-label', noir ? 'Revenir à la version couleur' : 'Passer en mode noir');
    themeButton.title = noir ? 'Version couleur' : 'Mode noir';
    document.querySelector('meta[name="theme-color"]').content = noir ? '#070707' : '#ffffff';
    if (persist) localStorage.setItem(THEME_KEY, noir ? 'noir' : 'couleur');
  }

  setTheme(document.documentElement.classList.contains('theme-noir'), false);
  themeButton.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('theme-noir')));

  function patternSvg(id) {
    const patterns = {
      studio: `
        <object class="territory-pattern territory-live-pattern pattern-studio-live" data-pattern-engine="loop" data="/assets/studio-swarm-viscous.svg" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>`,
      lab: `
        <object class="territory-pattern territory-live-pattern pattern-lab-live" data-pattern-engine="loop" data="/assets/lab-champ-tubes.svg" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>`,
      editions: `
        <div class="territory-pattern territory-editions-sequence" aria-hidden="true">
          <object class="territory-live-pattern pattern-editions-live" data-pattern-engine="loop" data="/assets/editions-paysage-horizon.svg" type="image/svg+xml" tabindex="-1"></object>
        </div>`,
      ideas: `
        <object class="territory-pattern territory-live-pattern pattern-ideas-live" data-pattern-engine="loop" data="/assets/idees-nappe-visqueuse.svg" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>`,
      research: `
        <object class="territory-pattern territory-live-pattern pattern-research-live" data-pattern-engine="loop" data="/assets/research-champ-pixels.svg" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>`,
      agence: `
        <object class="territory-pattern territory-live-pattern pattern-agence-live" data-pattern-engine="loop" data="/assets/agence-nappe-claque.svg" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>`,
      tools: `
        <object class="territory-pattern territory-live-pattern pattern-tools-live" data-pattern-engine="loop" data="/assets/tools-grille-figure8.svg" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>`,
      games: `
        <object class="territory-pattern territory-live-pattern pattern-games-live" data-pattern-engine="loop" data="/assets/games-nappe-reveal.svg" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>`,
      apps: `
        <object class="territory-pattern territory-live-pattern pattern-apps-live" data-pattern-engine="loop" data="/assets/apps-inverted-gravity.svg" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>`
    };
    return patterns[id] || patterns.studio;
  }

  function productionCard(asset, territory) {
    const visual = asset.visual
      ? `<object class="production-visual" data="${asset.visual}" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object>`
      : asset.url
        ? `<iframe class="production-page-preview" src="${asset.url}" title="Aperçu de ${asset.title}" loading="lazy" tabindex="-1" sandbox="allow-scripts allow-same-origin"></iframe>`
        : '';
    const title = asset.url
      ? `<a class="production-card-link" href="${asset.url}" target="_blank" rel="noreferrer"><span class="production-title">${asset.title}</span></a>`
      : `<h3 class="production-title">${asset.title}</h3>`;
    return `
      <article class="production-card${visual ? ' has-preview' : ' is-typographic'}" style="--accent:${territory.color}">
        ${visual}
        ${title}
      </article>`;
  }

  function expandedContent(territory) {
    const latest = territory.assets.slice(0, 3).map((id) => assets.get(id)).filter(Boolean);
    const preview = territory.previewImage
      ? `<div class="site-preview preview-${territory.id} has-image-preview">
          <img class="site-preview-image" src="${territory.previewImage}" alt="Aperçu de ${territory.name}" />
          <a class="site-preview-link" href="${territory.siteUrl}" target="_blank" rel="noreferrer" aria-label="Ouvrir ${territory.name}"></a>
        </div>`
      : territory.previewUrl
      ? `<div class="site-preview preview-${territory.id} has-live-preview">
          <div class="site-preview-placeholder" aria-hidden="true"><span>${territory.name}</span><strong>${new URL(territory.siteUrl).hostname}</strong></div>
          <iframe class="site-preview-frame" src="${territory.previewUrl}" title="${territory.name}" loading="lazy" sandbox="allow-scripts allow-same-origin"></iframe>
          <a class="site-preview-link" href="${territory.siteUrl}" target="_blank" rel="noreferrer" aria-label="Ouvrir ${territory.name}"></a>
        </div>`
      : `<div class="site-preview preview-${territory.id} is-placeholder">
          <span class="preview-placeholder-kicker">${territory.name}.BAAM.PRO</span>
          <strong>À VENIR</strong>
        </div>`;
    return `
      <div class="card-content">
        ${preview}
        <div class="production-rail" aria-label="Dernières productions de ${territory.name}">
          <div class="production-grid">${latest.map((asset) => productionCard(asset, territory)).join('')}</div>
        </div>
      </div>`;
  }

  function renderCards() {
    const grid = document.querySelector('#territory-grid');
    grid.classList.toggle('has-open', openCards.size > 0);
    const ordered = orderedTerritories();
    grid.innerHTML = ordered.map((territory) => {
      const open = openCards.has(territory.id);
      return `
        <article class="territory-card${open ? ' is-open' : ''}" style="--accent:${territory.color}" data-territory="${territory.id}">
          ${patternSvg(territory.id)}
          <button class="card-trigger" type="button" data-toggle-card="${territory.id}" aria-expanded="${open}">
            <h2 class="card-name">${territory.name}</h2>
            <p class="card-description">
              <span>${territory.description[0]}</span>
              <span>${territory.description[1]}</span>
            </p>
          </button>
          ${open ? expandedContent(territory) : ''}
        </article>`;
    }).join('');

    grid.querySelectorAll('[data-toggle-card]').forEach((button) => {
      button.addEventListener('click', () => toggleCard(button.dataset.toggleCard));
    });
    bindLivePatterns(grid);
  }

  function patternEngine(object) {
    const root = object.contentDocument?.documentElement;
    if (!root) return null;
    if (root.baamEngine) return root.baamEngine;
    return {
      setPaused(paused) {
        if (paused) root.pauseAnimations?.();
        else root.unpauseAnimations?.();
      },
      reset() { root.setCurrentTime?.(0); }
    };
  }

  function bindLivePatterns(grid) {
    grid.querySelectorAll('[data-pattern-engine]').forEach((object) => {
      const card = object.closest('.territory-card');
      const mode = object.dataset.patternEngine;
      const pause = () => patternEngine(object)?.setPaused?.(true);
      const play = () => patternEngine(object)?.setPaused?.(false);
      const start = () => {
        clearTimeout(card.patternTimer);
        card.classList.remove('is-pattern-complete');
        if (mode === 'sequence') patternEngine(object)?.reset?.();
        play();
        if (mode === 'sequence') {
          card.patternTimer = setTimeout(() => {
            pause();
            card.classList.add('is-pattern-complete');
          }, 6200);
        }
      };
      const stop = () => {
        clearTimeout(card.patternTimer);
        patternEngine(object)?.clearPointer?.();
        pause();
        card.classList.remove('is-pattern-complete');
      };

      object.addEventListener('load', () => {
        play();
        if (card.matches(':hover')) {
          start();
          return;
        }
        clearTimeout(card.posterTimer);
        card.posterTimer = setTimeout(() => {
          if (!card.matches(':hover')) pause();
        }, 180);
      }, { once: true });

      card.addEventListener('mouseenter', start);
      card.addEventListener('pointermove', (event) => {
        const engine = patternEngine(object);
        if (!engine?.setPointer) return;
        const rect = card.getBoundingClientRect();
        engine.setPointer((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height, true);
      });
      card.addEventListener('mouseleave', stop);
    });
  }

  function orderedTerritories() {
    const list = [...registry.territories];
    const openId = [...openCards][0];
    const index = list.findIndex((territory) => territory.id === openId);
    if (index < 0) return list;

    const columnCount = innerWidth <= 680 ? 1 : innerWidth <= 1050 ? 2 : 3;
    if (columnCount === 1) return list;
    const rowStart = Math.floor(index / columnCount) * columnCount;
    const row = list.slice(rowStart, rowStart + columnCount);
    const open = row.find((territory) => territory.id === openId);
    const others = row.filter((territory) => territory.id !== openId);
    const column = index % columnCount;
    const reorderedRow = columnCount === 2
      ? [open, ...others]
      : column === 0
        ? [open, others[1], others[0]].filter(Boolean)
        : [others[0], open, ...others.slice(1)].filter(Boolean);
    list.splice(rowStart, row.length, ...reorderedRow);
    return list;
  }

  function captureCardRects() {
    return new Map([...document.querySelectorAll('.territory-card')].map((card) => [card.dataset.territory, card.getBoundingClientRect()]));
  }

  function animateCardLayout(before) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.territory-card').forEach((card) => {
      const previous = before.get(card.dataset.territory);
      if (!previous) return;
      const next = card.getBoundingClientRect();
      const dx = previous.left - next.left;
      const dy = previous.top - next.top;
      const sx = previous.width / next.width;
      const sy = previous.height / next.height;
      card.animate(
        [
          { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.82 },
          { transformOrigin: 'top left', transform: 'none', opacity: 1 }
        ],
        { duration: 620, easing: 'cubic-bezier(.16, 1, .3, 1)' }
      );
    });
  }

  function toggleCard(id) {
    const before = captureCardRects();
    const closing = openCards.has(id);
    openCards.clear();
    if (!closing) openCards.add(id);
    localStorage.setItem(OPEN_KEY, JSON.stringify([...openCards]));
    renderCards();
    requestAnimationFrame(() => animateCardLayout(before));
  }

  function setView(name) {
    if (!views[name]) name = 'cards';
    viewButtons.forEach((button) => {
      const active = button.dataset.view === name;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    Object.entries(views).forEach(([key, element]) => {
      const active = key === name;
      element.hidden = !active;
      element.classList.toggle('is-active', active);
    });
    localStorage.setItem(VIEW_KEY, name);
    if (name === 'graph') renderMap();
  }

  viewButtons.forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));

  const contactCard = document.querySelector('.contact-card');
  const contactButton = document.querySelector('.contact-button');
  const contactPanel = document.querySelector('#contact-panel');
  const contactFrame = document.querySelector('.contact-preview-frame');

  function setContactOpen(open) {
    contactCard.classList.toggle('is-open', open);
    contactButton.setAttribute('aria-expanded', String(open));
    contactPanel.hidden = !open;
    if (open && !contactFrame.hasAttribute('src')) contactFrame.setAttribute('src', contactFrame.dataset.src);
  }

  contactButton.addEventListener('click', () => setContactOpen(!contactCard.classList.contains('is-open')));
  document.addEventListener('click', (event) => {
    if (!contactCard.contains(event.target)) setContactOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setContactOpen(false);
  });

  const svg = document.querySelector('#network-map');
  const root = document.querySelector('#map-root');
  const panLayer = document.querySelector('#map-pan-layer');
  const inspector = document.querySelector('#asset-inspector');
  const openBranches = new Set(['studio', 'editions']);
  let selectedId = null;
  let transform = { x: 0, y: 0, scale: 1 };
  let dragging = null;
  const positions = new Map();
  const NS = 'http://www.w3.org/2000/svg';
  const center = { x: 600, y: 360 };
  const territoryRadius = 215;
  const assetRadius = 145;

  function el(name, attributes = {}, text = '') {
    const node = document.createElementNS(NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (text) node.textContent = text;
    return node;
  }

  function shortLabel(text, max = 25) { return text.length > max ? `${text.slice(0, max - 1)}…` : text; }

  function calculatePositions() {
    positions.clear();
    registry.territories.forEach((territory, territoryIndex) => {
      const angle = -Math.PI / 2 + territoryIndex * (Math.PI * 2 / registry.territories.length);
      const territoryPosition = { x: center.x + Math.cos(angle) * territoryRadius, y: center.y + Math.sin(angle) * territoryRadius, angle };
      positions.set(territory.id, territoryPosition);
      if (!openBranches.has(territory.id)) return;
      const count = territory.assets.length;
      const spread = count === 1 ? 0 : Math.min(1.42, 0.38 * count);
      territory.assets.forEach((assetId, itemIndex) => {
        const offset = count === 1 ? 0 : (itemIndex / (count - 1) - .5) * spread;
        const childAngle = angle + offset;
        positions.set(assetId, { x: territoryPosition.x + Math.cos(childAngle) * assetRadius, y: territoryPosition.y + Math.sin(childAngle) * assetRadius, angle: childAngle });
      });
    });
  }

  function line(x1, y1, x2, y2, className, stroke) { return el('line', { x1, y1, x2, y2, class: className, stroke }); }

  function addMultilineLabel(group, value, x, y, anchor, color) {
    const words = value.split(' ');
    const lines = value.length > 20 && words.length > 1
      ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')]
      : [value];
    lines.forEach((part, index) => group.appendChild(el('text', { x, y: y + index * 13, 'text-anchor': anchor, fill: color, class: 'node-label' }, shortLabel(part, 23))));
  }

  function activateNode(group, callback) {
    group.addEventListener('click', (event) => { event.stopPropagation(); callback(); });
    group.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); callback(); }
    });
  }

  function renderMap() {
    calculatePositions();
    root.innerHTML = '';
    registry.territories.forEach((territory) => {
      const position = positions.get(territory.id);
      root.appendChild(line(center.x, center.y, position.x, position.y, 'root-spoke', territory.color));
    });

    registry.territories.forEach((territory) => {
      if (!openBranches.has(territory.id)) return;
      const territoryPosition = positions.get(territory.id);
      territory.assets.forEach((assetId) => {
        const assetPosition = positions.get(assetId);
        root.appendChild(line(territoryPosition.x, territoryPosition.y, assetPosition.x, assetPosition.y, 'branch-line', territory.color));
      });
    });

    registry.assets.forEach((asset) => {
      const from = positions.get(asset.id);
      if (!from) return;
      asset.relations.forEach((relation) => {
        const to = positions.get(relation.target);
        if (!to || asset.id > relation.target) return;
        const targetTerritory = territories.get(assets.get(relation.target)?.territory);
        root.appendChild(line(from.x, from.y, to.x, to.y, 'relation-line', targetTerritory?.color || '#00d95f'));
      });
    });

    registry.territories.forEach((territory) => {
      const position = positions.get(territory.id);
      const open = openBranches.has(territory.id);
      const group = el('g', { transform: `translate(${position.x} ${position.y})`, class: `map-node territory-node${open ? ' is-open' : ''}`, tabindex: '0', role: 'button', 'aria-label': `${open ? 'Refermer' : 'Déplier'} ${territory.name}` });
      group.appendChild(el('circle', { r: open ? 29 : 24, class: 'node-ring node-hit', fill: territory.color, stroke: territory.color, 'fill-opacity': open ? '.17' : '.04' }));
      group.appendChild(el('text', { x: 0, y: 4, 'text-anchor': 'middle', fill: territory.color, 'font-size': '18', 'font-weight': '800' }, open ? '−' : '+'));
      const outward = Math.cos(position.angle) >= 0;
      const labelX = outward ? 39 : -39;
      const anchor = outward ? 'start' : 'end';
      group.appendChild(el('text', { x: labelX, y: 4, 'text-anchor': anchor, fill: territory.color, class: 'node-label' }, territory.name));
      activateNode(group, () => {
        open ? openBranches.delete(territory.id) : openBranches.add(territory.id);
        if (selectedId && assets.get(selectedId)?.territory === territory.id && open) closeInspector();
        renderMap();
      });
      root.appendChild(group);
    });

    registry.territories.forEach((territory) => {
      if (!openBranches.has(territory.id)) return;
      territory.assets.forEach((assetId) => {
        const asset = assets.get(assetId);
        const position = positions.get(assetId);
        const selected = selectedId === assetId;
        const group = el('g', { transform: `translate(${position.x} ${position.y})`, class: `map-node asset-node${selected ? ' is-selected' : ''}`, tabindex: '0', role: 'button', 'aria-label': asset.title });
        group.appendChild(el('circle', { r: selected ? 13 : 9, class: 'node-core node-hit', stroke: territory.color, fill: territory.color, 'fill-opacity': selected ? '.35' : '.08' }));
        group.appendChild(el('circle', { r: 3.2, fill: territory.color }));
        const outward = Math.cos(position.angle) >= 0;
        const labelX = outward ? 18 : -18;
        addMultilineLabel(group, asset.title, labelX, asset.title.length > 20 ? -4 : 4, outward ? 'start' : 'end', selected ? territory.color : '#34342f');
        activateNode(group, () => selectAsset(asset.id));
        root.appendChild(group);
      });
    });

    const rootGroup = el('g', { transform: `translate(${center.x} ${center.y})`, class: 'root-node' });
    rootGroup.appendChild(el('circle', { r: 54, fill: '#00d95f', 'fill-opacity': '.08', stroke: '#00d95f', 'stroke-opacity': '.32', class: 'root-pulse' }));
    rootGroup.appendChild(el('circle', { r: 38, fill: '#ffffff', stroke: '#0b0b0a', 'stroke-width': '2' }));
    rootGroup.appendChild(el('text', { x: 0, y: 7, 'text-anchor': 'middle', fill: '#0b0b0a', class: 'root-a' }, 'BAAM'));
    root.appendChild(rootGroup);
    applyTransform();
  }

  function relationLabel(type) {
    return ({
      uses: 'utilise', 'used-by': 'est utilisé par',
      'part-of': 'fait partie de', contains: 'contient',
      'derived-from': 'dérive de', 'source-of': 'est à l’origine de',
      'inspired-by': 'est inspiré par', inspires: 'inspire',
      documents: 'documente', 'documented-by': 'est documenté par',
      demonstrates: 'démontre', 'demonstrated-by': 'est démontré par',
      'links-to': 'renvoie vers', 'linked-from': 'est relié depuis',
      extends: 'prolonge', 'extended-by': 'est prolongé par',
      'related-to': 'est relié à'
    })[type] || type;
  }

  function selectAsset(id) {
    const asset = assets.get(id);
    if (!asset) return;
    selectedId = id;
    openBranches.add(asset.territory);
    asset.relations.forEach((relation) => {
      const target = assets.get(relation.target);
      if (target) openBranches.add(target.territory);
    });
    const territory = territories.get(asset.territory);
    inspector.style.setProperty('--accent', territory.color);
    inspector.innerHTML = `
      <button class="inspector-close" type="button" aria-label="Fermer">×</button>
      <p class="inspector-type">${territory.name} / ${asset.type}</p>
      <h2 class="inspector-title">${asset.title}</h2>
      ${asset.relations.length ? `<ul class="inspector-links">${asset.relations.map((relation) => `<li>${relationLabel(relation.type)} <b>${assets.get(relation.target)?.title || relation.target}</b></li>`).join('')}</ul>` : ''}`;
    inspector.hidden = false;
    inspector.querySelector('.inspector-close').addEventListener('click', closeInspector);
    renderMap();
  }

  function closeInspector() { selectedId = null; inspector.hidden = true; renderMap(); }
  function applyTransform() { panLayer.setAttribute('transform', `translate(${transform.x} ${transform.y}) scale(${transform.scale})`); }
  function zoom(factor) { transform.scale = Math.max(.62, Math.min(1.9, transform.scale * factor)); applyTransform(); }

  document.querySelector('#zoom-in').addEventListener('click', () => zoom(1.15));
  document.querySelector('#zoom-out').addEventListener('click', () => zoom(1 / 1.15));
  document.querySelector('#zoom-reset').addEventListener('click', () => { transform = { x: 0, y: 0, scale: 1 }; applyTransform(); });
  svg.addEventListener('wheel', (event) => { event.preventDefault(); zoom(event.deltaY < 0 ? 1.08 : 1 / 1.08); }, { passive: false });
  svg.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.map-node')) return;
    dragging = { x: event.clientX, y: event.clientY, ox: transform.x, oy: transform.y };
    svg.classList.add('is-dragging');
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    transform.x = dragging.ox + (event.clientX - dragging.x) * (1200 / svg.clientWidth);
    transform.y = dragging.oy + (event.clientY - dragging.y) * (720 / svg.clientHeight);
    applyTransform();
  });
  svg.addEventListener('pointerup', () => { dragging = null; svg.classList.remove('is-dragging'); });
  svg.addEventListener('pointercancel', () => { dragging = null; svg.classList.remove('is-dragging'); });

  renderCards();
  renderMap();
  setView('cards');
})().catch((error) => {
  console.error(error);
  const grid = document.querySelector('#territory-grid');
  if (grid) grid.innerHTML = `<p class="registry-error">LE REGISTRE NE RÉPOND PAS.<br><small>${error.message}</small></p>`;
});

