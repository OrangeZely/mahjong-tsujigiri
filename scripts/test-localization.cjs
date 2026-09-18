/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS build/test script. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = process.cwd();
const ts = require(path.join(root, 'node_modules/typescript'));
const cache = new Map();
function load(file) {
  file = path.resolve(root, file);
  if (!path.extname(file)) file += '.ts';
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true}}).outputText;
  vm.runInNewContext(code, {exports, require: name => load(name.startsWith('@/') ? 'src/' + name.slice(2) : path.resolve(path.dirname(file), name)), console, Math, JSON});
  return exports;
}
const {localePath, preferredLocale, staticExportHref} = load('src/i18n/locale.ts');
assert.equal(localePath('/game?mode=casual#hand', 'en'), '/en/game?mode=casual#hand');
assert.equal(localePath('/en/game?mode=casual#hand', 'ja'), '/game?mode=casual#hand');
assert.equal(localePath('/en?x=1', 'ja'), '/?x=1');
assert.equal(localePath('//example.com/a', 'en'), '//example.com/a');
assert.equal(localePath('https://example.com', 'en'), 'https://example.com');

// ネイティブの全ページ遷移用。拡張子のないパスはCapacitorのアセット配信が解決できないので
// index.html を直接指す。クエリとハッシュは末尾に保つ。
assert.equal(staticExportHref('/en/'), '/en/index.html');
assert.equal(staticExportHref('/en'), '/en/index.html');
assert.equal(staticExportHref('/'), '/index.html');
assert.equal(staticExportHref('/en/game/'), '/en/game/index.html');
assert.equal(staticExportHref('/index.html'), '/index.html');
assert.equal(staticExportHref('/en/index.html?x=1#h'), '/en/index.html?x=1#h');
assert.equal(staticExportHref('/en/?x=1#h'), '/en/index.html?x=1#h');
// localePath と往復しても壊れないこと。
assert.equal(localePath(staticExportHref('/en/'), 'ja'), '/index.html');
assert.equal(localePath(staticExportHref('/en/'), 'en'), '/en/index.html');
assert.equal(preferredLocale('en', ['ja-JP']), 'en');
assert.equal(preferredLocale(null, ['ja-JP']), 'ja');
assert.equal(preferredLocale(null, ['fr-FR', 'ja-JP']), 'en');
const {messages} = load('src/i18n/messages.ts');
for (const [key, copy] of Object.entries(messages)) {
  assert.ok(copy.en.trim() || key === '位', key);
  const vars = text => [...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
  assert.deepEqual(vars(copy.en), vars(copy.ja), `Interpolation mismatch: ${key}`);
}
const {problemExplanation} = load('src/lib/problemExplanation.ts');
const tables = load('src/i18n/problem-explanations.json');
let count = 0;
for (const [table, entries] of Object.entries(tables)) {
  assert.equal(Object.keys(entries).length, table === 'problems' ? 50 : 120);
  for (const [id, item] of Object.entries(entries)) {
    const p = {id, description: item.source, tiles: item.tiles.map((key,i)=>({suit:key[0], num:Number(key[1]), isRed:key.endsWith('r'), id:String(i)})), correctDiscards:item.discards};
    const mode = table === 'problems' ? 'speed' : 'casual';
    assert.equal(problemExplanation(p, 'en', mode).text, item.en);
    assert.equal(problemExplanation(p, 'ja', mode).text, item.source);
    assert.equal(problemExplanation({...p, description:p.description+' changed'}, 'en', mode).language, 'ja');
    assert.equal(problemExplanation({...p, correctDiscards:['z9']}, 'en', mode).language, 'ja');
    assert.equal(problemExplanation({...p, tiles:[]}, 'en', mode).language, 'ja');
    assert.equal(problemExplanation({...p, descriptionEn:'DB copy'}, 'en', mode).text, 'DB copy');
    count++;
  }
}
const {computeFu} = load('src/lib/fu.ts');
const {fuItemLabel} = load('src/i18n/mahjong.ts');
const tile = (num, suit='m') => ({num,suit,id:suit+num});
const sequence = {kind:'shuntsu', tiles:[tile(2),tile(3),tile(4)], isYaochu:false};
const hand = {id:'test', mentsuList:Array(4).fill(sequence), pair:[tile(5),tile(5)],pairFu:0,waitType:'ryanmen',waitGroupIndex:0,winType:'tsumo',isMenzen:true};
assert.equal(computeFu(hand).total,20);
assert.equal(computeFu({...hand,winType:'ron'}).total,30);
assert.equal(computeFu({...hand,winType:'ron',isMenzen:false}).total,30);
const complex = {...hand, winType:'ron', waitType:'tanki', pairFu:4, pairReason:'東（連風牌）', pair:[tile(1,'z'),tile(1,'z')], mentsuList:[{kind:'ankan',tiles:Array(4).fill(tile(9)),isYaochu:true},...Array(3).fill(sequence)]};
assert.equal(computeFu(complex).rawTotal,68);
assert.equal(computeFu(complex).total,70);
for(const item of computeFu(complex).items) assert.ok(!/[\u3040-\u30ff\u3400-\u9fff]/.test(fuItemLabel(item,'en')));
const {getRank, RANKS} = load('src/lib/ranks.ts');
for (const rank of RANKS) {
  assert.equal(getRank(rank.minScore),rank.label);
  assert.equal(getRank(rank.minScore,'en'),rank.labelEn);
}
console.log(`Localization checks passed: ${Object.keys(messages).length} messages, ${count} explanations, routes, legacy history, fu examples, ${RANKS.length} ranks.`);
