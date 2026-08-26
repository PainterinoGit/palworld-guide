import assert from 'node:assert/strict';
import { mergeGuidePalIntoDatabase } from '../js/pal-data-adapter.mjs';

const database = {
  Cattiva: { name: 'Cattiva', types: ['Normal'], roles: [], skills: {}, tags: [], stages: [], location: null, note: null },
};

const result = mergeGuidePalIntoDatabase(database, {
  name: 'Cattiva',
  types: ['Normal'],
  roles: ['carry'],
  location: 'Startgebiet',
  whyGood: 'Früher Allrounder',
  alternatives: ['Lamball'],
  upgradeTo: ['Anubis'],
  availability: 'wild-early',
});

assert.equal(result, database);
assert.deepEqual(database.Cattiva.roles, ['carry']);
assert.equal(database.Cattiva.location, 'Startgebiet');
assert.equal(database.Cattiva.note, 'Früher Allrounder');
assert.deepEqual(database.Cattiva.alternatives, ['Lamball']);
assert.deepEqual(database.Cattiva.upgradeTo, ['Anubis']);
assert.equal(database.Cattiva.availability, 'wild-early');

console.log('pal data adapter: ok');
