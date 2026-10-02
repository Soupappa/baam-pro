'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public', 'data', 'registry.json');
const fixture = path.join('tests', 'fixtures', 'invalid-relation.json');
const digest = () => crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex');

const before = digest();
const result = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-registry.js'), '--source', fixture], {
  cwd: root,
  encoding: 'utf8'
});
const after = digest();

assert.notStrictEqual(result.status, 0, 'une source invalide doit faire échouer le build');
assert.match(result.stderr, /verbe interdit : feeds/, 'le vocabulaire de relations doit être contrôlé');
assert.strictEqual(after, before, 'un build invalide ne doit pas modifier le dernier registre valide');
console.log('Test réussi : relation invalide refusée, dernier registre valide préservé.');
