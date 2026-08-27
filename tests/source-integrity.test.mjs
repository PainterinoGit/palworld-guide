import assert from 'node:assert/strict';
import {
  ACTIVE_SOURCE_IDS,
  META_SOURCES,
  META_VERSION,
  isActiveSourceId
} from '../data/meta-sources.mjs';

const ALLOWED_TYPES = new Set(['official', 'data', 'editorial', 'video', 'calculator']);
const ISO_DATE = /^2026-08-(27|28)$/;
const REQUIRED_WRITTEN_SOURCE_URLS = new Set([
  'https://steamdb.info/patchnotes/24088745/',
  'https://docs.palworldgame.com/',
  'https://palworldcalc.com/tier-list/',
  'https://www.palmods.gg/guides/whats-new/work-suitability',
  'https://www.pcgamer.com/games/survival-crafting/palworld-best-pals/',
  'https://palcompass.com/guides/best-pals',
  'https://pindrop.gg/palworld/guides/best-combat-pals',
  'https://www.palmods.gg/blog/palworld-1-0-early-breeding-route'
]);
const REQUIRED_VIDEO_URLS = new Set([
  'https://www.youtube.com/watch?v=amZY6qiPAdQ',
  'https://www.youtube.com/watch?v=toYU7ofg3-s',
  'https://www.youtube.com/watch?v=uCX1SaQf64w',
  'https://www.youtube.com/watch?v=I2yWYKBcQqQ',
  'https://www.youtube.com/watch?v=N2LYB2yBC4E',
  'https://www.youtube.com/watch?v=82ims6y0nzQ',
  'https://www.youtube.com/watch?v=y8C6lM0Kcl0',
  'https://www.youtube.com/watch?v=2VZqwIiCcNc',
  'https://www.youtube.com/watch?v=kVmjm8JvdlU',
  'https://www.youtube.com/watch?v=WHgjoElqM_4',
  'https://www.youtube.com/watch?v=S-2-aMdw7Qw',
  'https://www.youtube.com/watch?v=Dj-DQN50zkI',
  'https://www.youtube.com/watch?v=oe2sMmKzx0I',
  'https://www.youtube.com/watch?v=dmDCXW1-j14'
]);

const urlsByType = type => new Set(
  META_SOURCES.filter(source => source.type === type).map(source => source.url)
);
const writtenSourceUrls = new Set([
  ...urlsByType('official'),
  ...urlsByType('data'),
  ...urlsByType('editorial')
]);

assert.match(META_VERSION, /Patch 1\.0\+/i);
assert.match(META_VERSION, /2026-08-28/);
assert.ok(Array.isArray(META_SOURCES));
assert.equal(META_SOURCES.length, 23);
assert.equal(urlsByType('official').size, 2);
assert.equal(urlsByType('data').size, 2);
assert.equal(urlsByType('editorial').size, 4);
assert.equal(urlsByType('video').size, 14);
assert.equal(urlsByType('calculator').size, 1);
assert.deepEqual(writtenSourceUrls, REQUIRED_WRITTEN_SOURCE_URLS);
assert.deepEqual(urlsByType('video'), REQUIRED_VIDEO_URLS);
assert.equal(new Set(META_SOURCES.map(source => source.id)).size, META_SOURCES.length);
assert.equal(new Set(META_SOURCES.map(source => source.url)).size, META_SOURCES.length);
assert.deepEqual(ACTIVE_SOURCE_IDS, META_SOURCES.map(source => source.id));

for (const source of META_SOURCES) {
  const parsedUrl = new URL(source.url);
  assert.ok(parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:');
  assert.ok(ALLOWED_TYPES.has(source.type));
  assert.match(source.checkedAt, ISO_DATE);
  assert.match(source.scope, /1\.0\+/i);
  assert.ok(source.confidence);
  assert.ok(source.summary);
  assert.equal(isActiveSourceId(source.id), true);
}

const steamDbMirror = META_SOURCES.find(source => source.url.startsWith('https://steamdb.info/'));
const officialDocumentation = META_SOURCES.find(source => source.url === 'https://docs.palworldgame.com/');
assert.equal(steamDbMirror.isOfficialDomain, false);
assert.equal(officialDocumentation.isOfficialDomain, true);

assert.equal(isActiveSourceId('missing-source'), false);

console.log('source integrity: ok');
