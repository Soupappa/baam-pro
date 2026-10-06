'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const sourceArgumentIndex = process.argv.indexOf('--source');
const SOURCE_FILE = sourceArgumentIndex >= 0
  ? path.resolve(ROOT, process.argv[sourceArgumentIndex + 1] || '')
  : path.join(ROOT, 'data', 'registry.source.json');
const OUTPUT_DIR = path.join(ROOT, 'public', 'data');
const INDEX_FILE = path.join(ROOT, 'public', 'index.html');
const CHECK_ONLY = process.argv.includes('--check');
const TERRITORY_SOURCES_FILE = path.join(ROOT, 'data', 'territory.sources.json');

const PUBLIC_STATUSES = new Set(['public', 'preview']);
const ALL_STATUSES = new Set(['draft', 'private', 'preview', 'public', 'archived']);
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const VIDEO_MEDIA_TYPES = new Set(['video/webm', 'video/mp4']);
const RELATIONS = Object.freeze({
  'part-of': { inverse: 'contains' },
  'derived-from': { inverse: 'source-of' },
  'inspired-by': { inverse: 'inspires' },
  documents: { inverse: 'documented-by' },
  demonstrates: { inverse: 'demonstrated-by' },
  uses: { inverse: 'used-by' },
  'links-to': { inverse: 'linked-from' },
  extends: { inverse: 'extended-by' },
  'related-to': { inverse: 'related-to', symmetric: true }
});

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`Impossible de lire ${path.relative(ROOT, file)} : ${error.message}`);
  }
}

async function readRemoteJson(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function mergeTerritoryRegistries(baseSource) {
  if (sourceArgumentIndex >= 0 || !fs.existsSync(TERRITORY_SOURCES_FILE)) return baseSource;
  const source = JSON.parse(JSON.stringify(baseSource));
  const selections = readJson(TERRITORY_SOURCES_FILE);
  for (const selection of selections) {
    const liveFile = path.resolve(ROOT, selection.file);
    const cacheFile = path.resolve(ROOT, selection.cache);
    let territorial;
    let sourceLabel;

    if (fs.existsSync(liveFile)) {
      territorial = readJson(liveFile);
      sourceLabel = path.relative(ROOT, liveFile);
    } else if (selection.url) {
      try {
        territorial = await readRemoteJson(selection.url);
        sourceLabel = selection.url;
      } catch (error) {
        console.warn(`${selection.territory}: registre distant indisponible (${error.message}), repli sur le cache`);
      }
    }

    if (!territorial && fs.existsSync(cacheFile)) {
      territorial = readJson(cacheFile);
      sourceLabel = path.relative(ROOT, cacheFile);
    }
    if (!territorial) throw new Error(`${selection.territory}: registre local, distant et cache introuvables`);
    if (territorial.meta?.territory !== selection.territory || territorial.territory?.id !== selection.territory) {
      throw new Error(`${selection.territory}: identité incohérente dans ${sourceLabel}`);
    }
    if (!CHECK_ONLY && sourceLabel !== path.relative(ROOT, cacheFile)) {
      fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
      fs.writeFileSync(cacheFile, `${JSON.stringify(territorial, null, 2)}\n`, 'utf8');
    }
    const territory = source.territories.find((item) => item.id === selection.territory);
    if (!territory) throw new Error(`${selection.territory}: territoire absent de la source racine`);
    territory.siteUrl = territorial.territory.url;
    territory.preview = { type: 'iframe', url: territorial.territory.url };
    source.assets = source.assets.filter((asset) => asset.territory !== selection.territory);
    territorial.assets.forEach((asset) => {
      const imported = {
        id: asset.id,
        territory: selection.territory,
        title: asset.title,
        summary: asset.summary || null,
        type: asset.type,
        status: asset.status,
        updatedAt: asset.updatedAt,
        url: asset.url || null,
        tags: asset.tags || [],
        relations: (asset.relations || [])
          .filter((relation) => !relation.generated)
          .map((relation) => ({ type: relation.type, targetId: relation.target }))
      };
      if (asset.preview && asset.preview.type !== 'none') imported.preview = asset.preview;
      source.assets.push(imported);
    });
  }
  return source;
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isAbsoluteUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isPreviewUrl(value) {
  return typeof value === 'string' && (value.startsWith('/') || isAbsoluteUrl(value));
}

function validateAssetPreview(preview, at, fail) {
  if (!isObject(preview) || !['iframe', 'image', 'svg', 'video'].includes(preview.type)) {
    fail(`${at}.type`, 'iframe, image, svg ou video attendu');
    return;
  }
  if (preview.type !== 'video') {
    if (!isPreviewUrl(preview.url)) fail(`${at}.url`, 'URL absolue ou chemin racine attendu');
    return;
  }
  if (!isPreviewUrl(preview.poster)) fail(`${at}.poster`, 'poster requis : URL absolue ou chemin racine attendu');
  if (typeof preview.alt !== 'string' || !preview.alt.trim()) fail(`${at}.alt`, 'texte alternatif non vide requis');
  if (!Number.isInteger(preview.width) || preview.width <= 0) fail(`${at}.width`, 'entier positif requis');
  if (!Number.isInteger(preview.height) || preview.height <= 0) fail(`${at}.height`, 'entier positif requis');
  if (!Array.isArray(preview.sources) || preview.sources.length === 0) {
    fail(`${at}.sources`, 'au moins une source vidéo est requise');
    return;
  }
  const mediaTypes = new Set();
  preview.sources.forEach((source, index) => {
    const sourceAt = `${at}.sources[${index}]`;
    if (!isObject(source)) return fail(sourceAt, 'objet requis');
    if (!VIDEO_MEDIA_TYPES.has(source.type)) fail(`${sourceAt}.type`, 'video/webm ou video/mp4 attendu');
    if (!isPreviewUrl(source.url)) fail(`${sourceAt}.url`, 'URL absolue ou chemin racine attendu');
    if (mediaTypes.has(source.type)) fail(`${sourceAt}.type`, `format répété : ${source.type}`);
    mediaTypes.add(source.type);
  });
}

function validate(source) {
  const errors = [];
  const fail = (location, message) => errors.push(`${location}: ${message}`);
  if (!isObject(source)) return ['racine: un objet JSON est requis'];
  if (source.version !== 1) fail('version', 'seule la version 1 est acceptée');
  if (!isObject(source.root)) fail('root', 'objet requis');
  if (!Array.isArray(source.territories)) fail('territories', 'tableau requis');
  if (!Array.isArray(source.assets)) fail('assets', 'tableau requis');
  if (errors.length) return errors;

  const ids = new Map();
  const registerId = (id, location) => {
    if (!ID_PATTERN.test(id || '')) fail(`${location}.id`, 'minuscules, chiffres et tirets uniquement');
    if (ids.has(id)) fail(`${location}.id`, `identifiant déjà utilisé par ${ids.get(id)}`);
    else ids.set(id, location);
  };

  registerId(source.root.id, 'root');
  if (!source.root.name) fail('root.name', 'requis');
  if (!isAbsoluteUrl(source.root.url)) fail('root.url', 'URL HTTP(S) absolue requise');

  const territoryIds = new Set();
  source.territories.forEach((territory, index) => {
    const at = `territories[${index}]`;
    if (!isObject(territory)) return fail(at, 'objet requis');
    registerId(territory.id, at);
    territoryIds.add(territory.id);
    if (!territory.name) fail(`${at}.name`, 'requis');
    if (!/^#[0-9a-f]{6}$/i.test(territory.color || '')) fail(`${at}.color`, 'couleur hexadécimale #RRGGBB requise');
    if (!Array.isArray(territory.description) || territory.description.length !== 2 || territory.description.some((line) => !line)) {
      fail(`${at}.description`, 'exactement deux lignes non vides sont requises');
    }
    if (territory.siteUrl != null && !isAbsoluteUrl(territory.siteUrl)) fail(`${at}.siteUrl`, 'URL HTTP(S) absolue attendue');
    if (territory.preview != null) {
      if (!isObject(territory.preview) || !['iframe', 'image'].includes(territory.preview.type)) fail(`${at}.preview.type`, 'iframe ou image attendu');
      if (!isPreviewUrl(territory.preview?.url)) fail(`${at}.preview.url`, 'URL absolue ou chemin racine attendu');
    }
    if (territory.featuredAssets != null && (!Array.isArray(territory.featuredAssets) || territory.featuredAssets.some((id) => !ID_PATTERN.test(id || '')))) {
      fail(`${at}.featuredAssets`, 'tableau d’identifiants attendu');
    }
  });

  const assetIds = new Set();
  const sourceEdges = new Set();
  source.assets.forEach((asset, index) => {
    const at = `assets[${index}]`;
    if (!isObject(asset)) return fail(at, 'objet requis');
    registerId(asset.id, at);
    assetIds.add(asset.id);
    if (!territoryIds.has(asset.territory)) fail(`${at}.territory`, `territoire inconnu : ${asset.territory}`);
    if (!asset.title) fail(`${at}.title`, 'requis');
    if (!asset.type) fail(`${at}.type`, 'requis');
    if (!ALL_STATUSES.has(asset.status)) fail(`${at}.status`, `statut inconnu : ${asset.status}`);
    if (!DATE_PATTERN.test(asset.updatedAt || '') || Number.isNaN(Date.parse(`${asset.updatedAt}T00:00:00Z`))) fail(`${at}.updatedAt`, 'date YYYY-MM-DD valide requise');
    if (asset.url != null && !isAbsoluteUrl(asset.url)) fail(`${at}.url`, 'URL HTTP(S) absolue attendue');
    if (asset.status === 'public' && !isAbsoluteUrl(asset.url)) fail(`${at}.url`, 'un actif public doit avoir une URL');
    if (asset.preview != null) {
      validateAssetPreview(asset.preview, `${at}.preview`, fail);
    }
    if (asset.relations != null && !Array.isArray(asset.relations)) fail(`${at}.relations`, 'tableau attendu');
  });

  source.assets.forEach((asset, assetIndex) => {
    (asset.relations || []).forEach((relation, relationIndex) => {
      const at = `assets[${assetIndex}].relations[${relationIndex}]`;
      if (!isObject(relation)) return fail(at, 'objet requis');
      if (!Object.hasOwn(RELATIONS, relation.type)) fail(`${at}.type`, `verbe interdit : ${relation.type}`);
      if (!assetIds.has(relation.targetId) && !territoryIds.has(relation.targetId)) fail(`${at}.targetId`, `cible inconnue : ${relation.targetId}`);
      if (relation.targetId === asset.id) fail(`${at}.targetId`, 'une relation ne peut pas se cibler elle-même');
      const edgeKey = `${asset.id}|${relation.type}|${relation.targetId}`;
      if (sourceEdges.has(edgeKey)) fail(at, 'relation déclarée deux fois');
      sourceEdges.add(edgeKey);
      if (relation.type === 'related-to' && sourceEdges.has(`${relation.targetId}|related-to|${asset.id}`)) {
        fail(at, 'related-to est symétrique et ne doit être déclarée que dans un sens');
      }
    });
  });

  source.territories.forEach((territory, territoryIndex) => {
    const featuredIds = new Set();
    (territory.featuredAssets || []).forEach((assetId, featuredIndex) => {
      const asset = source.assets.find((item) => item.id === assetId);
      const at = `territories[${territoryIndex}].featuredAssets[${featuredIndex}]`;
      if (featuredIds.has(assetId)) fail(at, `actif répété : ${assetId}`);
      featuredIds.add(assetId);
      if (!asset) fail(at, `actif inconnu : ${assetId}`);
      else if (asset.territory !== territory.id) fail(at, `l’actif appartient au territoire ${asset.territory}`);
      else if (!PUBLIC_STATUSES.has(asset.status)) fail(at, `l’actif n’est pas public : ${asset.status}`);
    });
  });

  return errors;
}

function compile(source) {
  const sourceText = `${JSON.stringify(source)}\n`;
  const sourceHash = crypto.createHash('sha256').update(sourceText).digest('hex');
  const sourceOrder = new Map(source.assets.map((asset, index) => [asset.id, index]));
  const visibleAssets = source.assets.filter((asset) => PUBLIC_STATUSES.has(asset.status));
  const visibleIds = new Set(visibleAssets.map((asset) => asset.id));
  const territoryIds = new Set(source.territories.map((territory) => territory.id));

  const territories = source.territories.map((territory) => ({
    id: territory.id,
    name: territory.name,
    color: territory.color,
    description: territory.description,
    siteUrl: territory.siteUrl || null,
    previewUrl: territory.preview?.type === 'iframe' ? territory.preview.url : null,
    previewImage: territory.preview?.type === 'image' ? territory.preview.url : null,
    featuredAssets: territory.featuredAssets || [],
    assets: [],
    relations: []
  }));
  const territoryById = new Map(territories.map((territory) => [territory.id, territory]));

  const assets = visibleAssets.map((asset) => ({
    id: asset.id,
    territory: asset.territory,
    title: asset.title,
    summary: asset.summary || null,
    type: asset.type,
    status: asset.status,
    updatedAt: asset.updatedAt,
    tags: asset.tags || [],
    url: asset.url || null,
    visual: ['svg', 'image'].includes(asset.preview?.type)
      ? asset.preview.url
      : asset.preview?.type === 'video' ? asset.preview.poster : null,
    preview: asset.preview || null,
    relations: []
  }));
  const assetById = new Map(assets.map((asset) => [asset.id, asset]));

  const addRelation = (owner, relation) => {
    if (!owner.relations.some((item) => item.type === relation.type && item.target === relation.target)) owner.relations.push(relation);
  };

  visibleAssets.forEach((sourceAsset) => {
    const owner = assetById.get(sourceAsset.id);
    (sourceAsset.relations || []).forEach((relation) => {
      if (!visibleIds.has(relation.targetId) && !territoryIds.has(relation.targetId)) return;
      addRelation(owner, { type: relation.type, target: relation.targetId, generated: false });
      const target = assetById.get(relation.targetId) || territoryById.get(relation.targetId);
      addRelation(target, { type: RELATIONS[relation.type].inverse, target: sourceAsset.id, generated: true });
    });
  });

  territories.forEach((territory) => {
    territory.assets = assets
      .filter((asset) => asset.territory === territory.id)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt) || sourceOrder.get(left.id) - sourceOrder.get(right.id))
      .map((asset) => asset.id);
  });

  assets.sort((left, right) => {
    const territoryDelta = source.territories.findIndex((territory) => territory.id === left.territory) - source.territories.findIndex((territory) => territory.id === right.territory);
    return territoryDelta || right.updatedAt.localeCompare(left.updatedAt) || sourceOrder.get(left.id) - sourceOrder.get(right.id);
  });

  const newestDate = assets.reduce((latest, asset) => asset.updatedAt > latest ? asset.updatedAt : latest, '1970-01-01');
  const registry = {
    meta: {
      schemaVersion: 1,
      source: 'data/registry.source.json',
      sourceHash,
      compiledAt: newestDate,
      relationVocabulary: Object.keys(RELATIONS),
      counts: { territories: territories.length, assets: assets.length }
    },
    root: source.root,
    territories,
    assets
  };

  const graphNodes = [
    { id: source.root.id, kind: 'root', title: source.root.name, url: source.root.url },
    ...territories.map((territory) => ({ id: territory.id, kind: 'territory', title: territory.name, url: territory.siteUrl })),
    ...assets.map((asset) => ({ id: asset.id, kind: 'asset', title: asset.title, territory: asset.territory, type: asset.type, status: asset.status, updatedAt: asset.updatedAt, url: asset.url }))
  ];
  const graphEdges = [];
  territories.forEach((territory) => graphEdges.push({ from: territory.id, type: 'part-of', to: source.root.id, generated: true }));
  assets.forEach((asset) => {
    graphEdges.push({ from: asset.id, type: 'part-of', to: asset.territory, generated: true });
    asset.relations.forEach((relation) => graphEdges.push({ from: asset.id, type: relation.type, to: relation.target, generated: relation.generated }));
  });
  territories.forEach((territory) => territory.relations.forEach((relation) => graphEdges.push({ from: territory.id, type: relation.type, to: relation.target, generated: relation.generated })));
  const graph = { meta: registry.meta, nodes: graphNodes, edges: graphEdges };

  const idUrl = (id) => {
    const asset = assetById.get(id);
    if (asset) return asset.url || `https://baam.pro/id/${asset.id}`;
    const territory = territoryById.get(id);
    if (territory) return territory.siteUrl || `https://baam.pro/#territory-${territory.id}`;
    return source.root.url;
  };
  const jsonLdNode = (asset) => {
    const node = {
      '@id': idUrl(asset.id),
      '@type': 'CreativeWork',
      name: asset.title,
      dateModified: asset.updatedAt,
      isPartOf: { '@id': idUrl(asset.territory) }
    };
    if (asset.url) node.url = asset.url;
    asset.relations.forEach((relation) => {
      const predicate = `baam:${relation.type}`;
      if (!node[predicate]) node[predicate] = [];
      node[predicate].push({ '@id': idUrl(relation.target) });
    });
    return node;
  };
  const graphJsonLd = {
    '@context': {
      '@vocab': 'https://schema.org/',
      baam: 'https://baam.pro/vocab/'
    },
    '@graph': [
      {
        '@id': source.root.url,
        '@type': 'Organization',
        name: source.root.name,
        url: source.root.url,
        description: source.root.description,
        hasPart: territories.map((territory) => ({ '@id': idUrl(territory.id) }))
      },
      ...territories.map((territory) => ({
        '@id': idUrl(territory.id),
        '@type': 'CollectionPage',
        name: territory.name,
        url: territory.siteUrl || undefined,
        isPartOf: { '@id': source.root.url },
        hasPart: territory.assets.map((assetId) => ({ '@id': idUrl(assetId) }))
      })),
      ...assets.map(jsonLdNode)
    ]
  };

  const sitemapUrls = new Set([source.root.url]);
  territories.forEach((territory) => {
    if (territory.siteUrl && !/127\.0\.0\.1|localhost/.test(territory.siteUrl)) sitemapUrls.add(territory.siteUrl);
  });
  assets.forEach((asset) => {
    if (asset.status === 'public' && asset.url && !/127\.0\.0\.1|localhost/.test(asset.url)) sitemapUrls.add(asset.url);
  });
  const escapeXml = (value) => value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...sitemapUrls].map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;

  return { registry, graph, graphJsonLd, sitemap };
}

function stableJson(value) {
  return `${JSON.stringify(value, (_key, item) => item === undefined ? null : item, 2)}\n`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function replaceGeneratedBlock(source, name, content) {
  const start = `<!-- BAAM:${name}-START -->`;
  const end = `<!-- BAAM:${name}-END -->`;
  if (!source.includes(start) || !source.includes(end)) {
    throw new Error(`Marqueurs ${name} absents de public/index.html`);
  }
  return source.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${content}\n          ${end}`);
}

function renderStaticRegistry(registry) {
  const assets = new Map(registry.assets.map((asset) => [asset.id, asset]));
  return registry.territories.map((territory) => {
    const items = territory.assets.map((assetId) => assets.get(assetId)).filter(Boolean).map((asset) => {
      const label = escapeHtml(asset.title);
      const title = asset.url
        ? `<a href="${escapeHtml(asset.url)}">${label}</a>`
        : `<span>${label}</span>`;
      return `<li>${title}<span class="visually-hidden"> — ${escapeHtml(asset.type)}, ${escapeHtml(asset.status)}</span></li>`;
    }).join('\n              ');
    const name = territory.siteUrl
      ? `<a href="${escapeHtml(territory.siteUrl)}">${escapeHtml(territory.name)}</a>`
      : escapeHtml(territory.name);
    return `        <article class="territory-card territory-card-static" id="territory-${escapeHtml(territory.id)}" style="--accent:${escapeHtml(territory.color)}">
          <h2 class="card-name">${name}</h2>
          <p class="card-description"><span>${escapeHtml(territory.description[0])}</span><span>${escapeHtml(territory.description[1])}</span></p>
          <ul class="static-asset-list" aria-label="${territory.assets.length} contenus dans ${escapeHtml(territory.name)}">
              ${items}
          </ul>
        </article>`;
  }).join('\n');
}

function renderIndex(outputs) {
  let index = fs.readFileSync(INDEX_FILE, 'utf8');
  const jsonLd = JSON.stringify(outputs.graphJsonLd, null, 2).replace(/</g, '\\u003c');
  index = replaceGeneratedBlock(index, 'SEO', `    <script id="baam-knowledge-graph" type="application/ld+json">\n${jsonLd}\n    </script>`);
  index = replaceGeneratedBlock(index, 'REGISTRY', renderStaticRegistry(outputs.registry));
  return index;
}

function writeOutputs(outputs) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const files = new Map([
    ['registry.json', stableJson(outputs.registry)],
    ['graph.json', stableJson(outputs.graph)],
    ['graph.jsonld', stableJson(outputs.graphJsonLd)],
    ['sitemap.xml', outputs.sitemap]
  ]);
  const staged = [];
  try {
    files.forEach((content, name) => {
      const temporary = path.join(OUTPUT_DIR, `.${name}.${process.pid}.tmp`);
      fs.writeFileSync(temporary, content, 'utf8');
      staged.push([temporary, path.join(OUTPUT_DIR, name)]);
    });
    staged.forEach(([temporary, target]) => fs.renameSync(temporary, target));
    const publicSitemap = path.join(ROOT, 'public', 'sitemap.xml');
    const temporarySitemap = `${publicSitemap}.${process.pid}.tmp`;
    fs.writeFileSync(temporarySitemap, outputs.sitemap, 'utf8');
    fs.renameSync(temporarySitemap, publicSitemap);
    const temporaryIndex = `${INDEX_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(temporaryIndex, renderIndex(outputs), 'utf8');
    fs.renameSync(temporaryIndex, INDEX_FILE);
  } catch (error) {
    staged.forEach(([temporary]) => { try { fs.unlinkSync(temporary); } catch {} });
    throw error;
  }
}

async function main() {
  const source = await mergeTerritoryRegistries(readJson(SOURCE_FILE));
  const errors = validate(source);
  if (errors.length) {
    console.error(`Registre invalide (${errors.length} erreur${errors.length > 1 ? 's' : ''}) :`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    const outputs = compile(source);
    if (!CHECK_ONLY) writeOutputs(outputs);
    console.log(`${CHECK_ONLY ? 'Validation' : 'Compilation'} réussie : ${outputs.registry.meta.counts.territories} territoires, ${outputs.registry.meta.counts.assets} actifs, ${outputs.graph.edges.length} arêtes.`);
    if (CHECK_ONLY) console.log('Aucun fichier modifié ; les derniers exports valides restent en place.');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
