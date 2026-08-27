import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { PALS } from '../data/pals.mjs';
import { META_SOURCES } from '../data/meta-sources.mjs';
import { buildPalDatabase } from '../js/pal-data-adapter.mjs';

const read = file => readFileSync(new URL(file, import.meta.url), 'utf8');
const html = read('../index.html');
const app = read('../js/app.js');
const rosterSource = read('../data/pals-roster.js');

function parseDivTree(source) {
  const withoutNonMarkup = source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const root = { tag: 'root', id: null, children: [] };
  const stack = [root];
  for (const token of withoutNonMarkup.match(/<\/?div\b[^>]*>/gi) || []) {
    if (token.startsWith('</')) {
      assert.equal(stack.at(-1).tag, 'div', `unerwartetes Div-Ende: ${token}`);
      stack.pop();
      continue;
    }
    const id = token.match(/\bid=["']([^"']+)["']/i)?.[1] || null;
    const node = { tag: 'div', id, children: [], parent: stack.at(-1) };
    stack.at(-1).children.push(node);
    stack.push(node);
  }
  assert.equal(stack.length, 1, 'alle Div-Container müssen geschlossen sein');
  return root;
}

function findById(node, id) {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findById(child, id);
    if (found) return found;
  }
  return null;
}

const tree = parseDivTree(html);
function findParent(node, target) {
  if (node.children.includes(target)) return node;
  for (const child of node.children) {
    const parent = findParent(child, target);
    if (parent) return parent;
  }
  return null;
}

const tabIds = ['teams', 'pals', 'locations', 'handbook'];
const topLevelTabNodes = tabIds.map(id => findById(tree, id));
const tabParents = topLevelTabNodes.map(node => findParent(tree, node));
assert.ok(tabParents[0], 'Tab-Container müssen unter einem gemeinsamen Container liegen');
for (const [index, id] of tabIds.entries()) {
  const node = topLevelTabNodes[index];
  assert.ok(node, `#${id} muss existieren`);
  assert.equal(tabParents[index], tabParents[0], `#${id} muss direkter Kindknoten des gemeinsamen Containers sein`);
  assert.ok(tabParents[index].children.includes(node), `#${id} muss direkter Kindknoten des gemeinsamen Containers sein`);
  assert.match(html, new RegExp(`switchTab\\(['"]${id}['"]\\)`), `switchTab muss #${id} erreichbar machen`);
}
assert.match(app, /function switchTab\s*\(tabName/);
assert.match(app, /document\.getElementById\(tabName\)\.classList\.add\('active'\)/);

const rosterScript = '<script src="data/pals-roster.js"></script>';
const bootstrapScript = '<script type="module" src="js/bootstrap.mjs"></script>';
const rosterScriptIndex = html.indexOf(rosterScript);
const bootstrapScriptIndex = html.indexOf(bootstrapScript);
assert.ok(rosterScriptIndex >= 0, 'der neutrale Vollroster muss eingebunden sein');
assert.ok(rosterScriptIndex < bootstrapScriptIndex, 'der Vollroster muss vor dem Bootstrap geladen werden');
assert.match(rosterSource, /const FULL_PAL_ROSTER\s*=/);

const rosterContext = { globalThis: {} };
vm.runInNewContext(rosterSource.replace(/const FULL_PAL_ROSTER\s*=/, 'globalThis.FULL_PAL_ROSTER ='), rosterContext);
const fullRoster = rosterContext.globalThis.FULL_PAL_ROSTER;
assert.ok([288, 295].includes(fullRoster.length), `unerwartete Vollroster-Größe: ${fullRoster.length}`);

const database = buildPalDatabase(fullRoster, PALS, META_SOURCES);
assert.equal(Object.keys(database).length, fullRoster.length, 'die Datenbank muss den vollständigen neutralen Roster laden');
assert.equal(database.Orserk?.active, true, 'aktive Meta muss den neutralen Roster-Eintrag überlagern');
assert.equal(database.Orserk?.featured, true, 'Meta-Priorität darf durch den Vollroster nicht verloren gehen');

console.log('final fix regression: ok');
