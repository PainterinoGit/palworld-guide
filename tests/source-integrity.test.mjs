import assert from 'node:assert/strict';
import {
  ACTIVE_SOURCE_IDS,
  META_SOURCES,
  META_VERSION,
  isActiveSourceId
} from '../data/meta-sources.mjs';

const ALLOWED_TYPES = new Set(['official', 'data', 'editorial', 'video']);
const ISO_DATE = /^2026-08-27$/;

assert.match(META_VERSION, /Patch 1\.0\+/i);
assert.match(META_VERSION, /2026-08-27/);
assert.ok(Array.isArray(META_SOURCES));
assert.ok(META_SOURCES.length >= 21);
assert.equal(new Set(META_SOURCES.map(source => source.id)).size, META_SOURCES.length);
assert.equal(new Set(META_SOURCES.map(source => source.url)).size, META_SOURCES.length);
assert.deepEqual(ACTIVE_SOURCE_IDS, META_SOURCES.map(source => source.id));

for (const source of META_SOURCES) {
  assert.match(source.url, /^https?:\/\/\S+$/);
  assert.ok(ALLOWED_TYPES.has(source.type));
  assert.match(source.checkedAt, ISO_DATE);
  assert.match(source.scope, /1\.0\+/i);
  assert.ok(source.confidence);
  assert.ok(source.summary);
  assert.equal(isActiveSourceId(source.id), true);
}

assert.equal(isActiveSourceId('missing-source'), false);

console.log('source integrity: ok');
