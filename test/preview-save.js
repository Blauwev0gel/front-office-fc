// Run the real UI save functions for three URLs against shared browser storage.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ui = require('./src.js')('ui.js');
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

/* Organizational simulation regression: execute the real recruitment needs
   functions against controlled squad states. This is run by Pages CI. */
{
  const recruitment = require('./src.js')('recruit.js');
  const start = recruitment.indexOf('function coachCoverageNeeds()');
  const end = recruitment.indexOf('function dofPipeline()', start);
  assert(start >= 0 && end > start, 'Recruitment coverage functions present');
  const api = recruitment.slice(start, end) + '\\nthis.getNeeds = recruitmentNeeds;';
  const cases = [
    { players: [{pos:'GK',inj:8}], base:[], want:['GK'] },
    { players: [{pos:'GK',inj:1}], base:[], want:[] },
    { players: [{pos:'CB',inj:8},{pos:'CB',inj:0}], base:[], want:['CB'] },
    { players: [{pos:'CB',inj:8},{pos:'CB',inj:0},{pos:'CB',inj:0}], base:[], want:[] },
    { players: [{pos:'CM',inj:0}], base:['ST'], want:['ST'] },
    { players: [{pos:'ST',inj:7}], base:['ST'], want:['ST'] }
  ];
  for (const {players,base,want} of cases) {
    const context = {sq:()=>players,F:{squadNeeds:()=>base},Set,Object};
    vm.runInNewContext(api,context);
    assert.deepEqual(Array.from(context.getNeeds()),want,
      'Coverage needs and existing squad needs must combine without duplicates');
  }
  console.log('PASS: coach availability -> DoF recruitment priorities (6 cases)');
}
