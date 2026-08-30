import { writeFile } from 'node:fs/promises';

const sourceUrl = 'https://palworld.gg/_nuxt/BgMAUA7y.js';
const source = await (await fetch(sourceUrl)).text();

const pals = new Map();
const metadata = [];
for (const match of source.matchAll(/\{id:"([^"]+)",[\s\S]*?name:"([^"]+)"/g)) {
  pals.set(match[1], match[2]);
}
for (const match of source.matchAll(/\{id:"([^"]+)",[\s\S]*?name:"([^"]+)",[\s\S]*?combiRank:([^,]+),combiPriority:([^,]+),[\s\S]*?ignoreCombi:(!0|!1),isBoss:(!0|!1),[\s\S]*?combos:\[([^\]]*)\]/g)) {
  const [, id, name, rank, priority, ignoreCombi, isBoss, comboSource] = match;
  const combos = [...comboSource.matchAll(/\{a:"([^"]+)",b:"([^"]+)",child:"([^"]+)"(?:,ga:"([^"]+)",gb:"([^"]+)")?\}/g)]
    .map(([, a, b, child, ga, gb]) => ({ a, b, child, ...(ga ? { ga, gb } : {}) }));
  metadata.push({ id, name, combiRank: Number(rank), combiPriority: Number(priority), ignoreCombi: ignoreCombi === '!0', isBoss: isBoss === '!0', combos });
}

const combinations = [];
for (const match of source.matchAll(/combos:\[([^\]]*)\]/g)) {
  for (const combo of match[1].matchAll(/\{a:"([^"]+)",b:"([^"]+)",child:"([^"]+)"\}/g)) {
    const [, a, b, child] = combo;
    const parents = [pals.get(a), pals.get(b)];
    const childName = pals.get(child);
    if (!parents[0] || !parents[1] || !childName) continue;
    combinations.push({ child: childName, parents, sourceId: `${a}+${b}->${child}` });
  }
}

const unique = new Map();
for (const combination of combinations) {
  const parents = [...combination.parents].sort((left, right) => left.localeCompare(right));
  const key = `${combination.child.toLocaleLowerCase()}|${parents.map((parent) => parent.toLocaleLowerCase()).join('|')}`;
  unique.set(key, { ...combination, parents });
}

await writeFile('data/palworld-breeding-meta.mjs', `// Generated from ${sourceUrl}; keep the importer for reproducible refreshes.\nconst PALWORLD_BREEDING_META = ${JSON.stringify(metadata, null, 2)};\n\nexport { PALWORLD_BREEDING_META };\n`, 'utf8');
console.log(JSON.stringify({ pals: pals.size, raw: combinations.length, unique: unique.size }));
