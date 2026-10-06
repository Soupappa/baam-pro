'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public', 'data', 'registry.json');
const indexOutput = path.join(root, 'public', 'index.html');
const invalidRelationFixture = path.join('tests', 'fixtures', 'invalid-relation.json');
const invalidFeaturedFixture = path.join('tests', 'fixtures', 'invalid-featured-asset.json');
const validVideoFixture = path.join('tests', 'fixtures', 'valid-video-preview.json');
const invalidVideoFixture = path.join('tests', 'fixtures', 'invalid-video-preview.json');
const digest = () => crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex');
const indexDigest = () => crypto.createHash('sha256').update(fs.readFileSync(indexOutput)).digest('hex');

const before = digest();
const indexBefore = indexDigest();
const invalidRelation = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-registry.js'), '--source', invalidRelationFixture], {
  cwd: root,
  encoding: 'utf8'
});
const invalidFeatured = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-registry.js'), '--source', invalidFeaturedFixture], {
  cwd: root,
  encoding: 'utf8'
});
const validVideo = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-registry.js'), '--source', validVideoFixture, '--check'], {
  cwd: root,
  encoding: 'utf8'
});
const invalidVideo = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-registry.js'), '--source', invalidVideoFixture], {
  cwd: root,
  encoding: 'utf8'
});
const after = digest();
const indexAfter = indexDigest();
const registry = JSON.parse(fs.readFileSync(output, 'utf8'));
const indexHtml = fs.readFileSync(indexOutput, 'utf8');
const tools = registry.territories.find((territory) => territory.id === 'tools');
const toolAssets = registry.assets.filter((asset) => asset.territory === 'tools');

assert.notStrictEqual(invalidRelation.status, 0, 'une relation invalide doit faire échouer le build');
assert.match(invalidRelation.stderr, /verbe interdit : feeds/, 'le vocabulaire de relations doit être contrôlé');
assert.notStrictEqual(invalidFeatured.status, 0, 'un focus invalide doit faire échouer le build');
assert.match(invalidFeatured.stderr, /actif inconnu : actif-absent/, 'les focus doivent cibler un actif connu');
assert.strictEqual(validVideo.status, 0, `une preview vidéo complète doit être acceptée : ${validVideo.stderr}`);
assert.notStrictEqual(invalidVideo.status, 0, 'une preview vidéo incomplète doit faire échouer le build');
assert.match(invalidVideo.stderr, /texte alternatif non vide requis/, 'une vidéo doit posséder un texte alternatif');
assert.match(invalidVideo.stderr, /video\/webm ou video\/mp4 attendu/, 'les formats vidéo doivent être contrôlés');
assert.strictEqual(after, before, 'un build invalide ne doit pas modifier le dernier registre valide');
assert.strictEqual(indexAfter, indexBefore, 'un build invalide ne doit pas modifier le dernier HTML valide');
assert.strictEqual(registry.territories.find((territory) => territory.id === 'media')?.name, 'Média', 'le territoire public doit s’appeler Média');
assert.strictEqual(registry.territories.find((territory) => territory.id === 'editions')?.previewImage, '/assets/editions-preview-final.webp', 'Éditions doit posséder un aperçu local fiable');
assert.strictEqual(registry.assets.find((asset) => asset.id === 'point-plus-bas')?.url, 'https://lutileetlagreable.netlify.app/feuilleton/03-le-point-le-plus-bas', 'le troisième épisode doit pointer vers sa route publique réelle');
assert.match(indexHtml, /id="baam-knowledge-graph" type="application\/ld\+json"/, 'le graphe sémantique doit être présent dans le HTML initial');
assert.strictEqual((indexHtml.match(/territory-card-static/g) || []).length, registry.territories.length, 'chaque territoire doit exister dans le HTML initial');
assert.strictEqual((indexHtml.match(/<li>/g) || []).length, registry.assets.length, 'chaque actif doit exister dans le HTML initial');
assert.strictEqual(tools?.siteUrl, 'https://tools.baam.pro/', 'le territoire Tools doit pointer vers son portail public');
assert.deepStrictEqual(tools?.featuredAssets, ['operateur-texte', 'animateur-logo', 'fonds-vivants', 'convertisseur']);
assert.strictEqual(toolAssets.length, 15, 'les quinze contenus Tools doivent remonter dans la racine');
for (const id of ['animateur-logo', 'fonds-vivants', 'convertisseur']) {
  assert.ok(toolAssets.some((asset) => asset.id === id), `${id} doit remonter dans la racine`);
}
console.log('Tests réussis : relations, focus, previews vidéo/Éditions, SEO statique, Média et territoire Tools validés ; derniers exports préservés.');
