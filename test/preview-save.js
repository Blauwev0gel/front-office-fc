// Run the real UI save functions for three URLs against shared browser storage.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ui = fs.readFileSync(path.join(__dirname, '../src/ui.js'), 'utf8');
const source = ui.slice(0, ui.indexOf('function toast(')) +
  '\nthis.api = { KEY, saveGame, hasSave, loadGame, wipe };\n}';
const values = new Map([['frontoffice_save_v1', 'existing main save']]);
const localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key)
};
function open(url, save) {
  const context = {
    location: { pathname: url },
    document: { querySelector: () => ({}) },
    localStorage,
    FO: { G: { club: {} }, save: () => save, load: value => value }
  };
  vm.runInNewContext(source, context);
  return context.api;
}
const main = open('/front-office-fc/', 'new main save');
const chatgpt = open('/front-office-fc/chatgpt/', 'chatgpt save');
const claude = open('/front-office-fc/claude/index.html', 'claude save');
assert.equal(main.loadGame(), 'existing main save');
assert.equal(chatgpt.hasSave(), false);
assert.equal(claude.hasSave(), false);
chatgpt.saveGame();
claude.saveGame();
assert.equal(main.loadGame(), 'existing main save');
assert.equal(chatgpt.loadGame(), 'chatgpt save');
assert.equal(claude.loadGame(), 'claude save');
chatgpt.wipe();
assert.equal(chatgpt.hasSave(), false);
assert.equal(claude.loadGame(), 'claude save');
assert.equal(main.loadGame(), 'existing main save');
assert.equal(open('/front-office-fc/index.html').KEY, main.KEY);
assert.equal(open('/front-office-fc/chatgpt').KEY, chatgpt.KEY);
console.log('PASS: main save preserved; preview saves, loads and resets isolated');
