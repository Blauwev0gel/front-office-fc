// Text-only presentation guard. Run after: python3 build.py
// Uses no browser dependencies; checks that the real engine and action router
// are still present in the built standalone HTML.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = require('./src.js');
const ui = read('ui.js'), css = read('style.css');
const html = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/);
assert(script && script[1], 'standalone game script present');
new vm.Script(script[1], { filename: 'dist/index.html' });
assert(html.includes('THE FRONT OFFICE / TEXT-FIRST DEVELOPMENT UI'),
  'text stylesheet included in the built HTML');
assert(!html.includes('/*JS*/') && !html.includes('/*CSS*/'), 'all build placeholders resolved');
assert(css.lastIndexOf('THE FRONT OFFICE / TEXT-FIRST DEVELOPMENT UI') > css.indexOf('VOICE:'),
  'text CSS must load after the original visual styles');
assert(ui.includes('ART.face = noVisual') && ui.includes('ART.office = o =>'),
  'portrait and office drawing replaced with text');
assert(ui.includes('function mdPitch() { return \'\'; }') &&
  ui.includes('const MD_BALL = \'\';'), 'animated pitch and ball disabled');
assert(ui.includes('One actual engine event per tick'), 'match commentary comes from real engine events');
assert(ui.includes('Trend: ') && ui.includes('textbar') && ui.includes('text-stars'),
  'graphs and gauges replaced by numerical information');
assert(ui.includes('control.getAttribute(\'aria-label\')'),
  'icon-only interactive controls receive readable labels');
const required = [
  'new', 'continue', 'dna', 'pick', 'hire-all', 'mand-done',
  'mt-ans', 'tk-ans', 'tk-skip', 'dd-dec', 'dd-skip', 'db-talk',
  'mpick', 'msend', 'tab', 'dept', 'mand-save', 'md-kick',
  'md-skip', 'md-after', 'md-done', 's2-finish', 'next-season'
];
for (const action of required) {
  assert(ui.includes("case '" + action + "':"), 'preserve interactive action: ' + action);
}
for (const moduleName of ['recruit.js', 'summer.js', 'summer2.js', 'desk.js', 'dossiers.js',
  'pathway.js', 'matchday.js', 'business.js', 'firstteam.js', 'ui.js']) {
  const marker = 'The Front Office';
  assert(read(moduleName).length > 100, 'engine or UI module still available: ' + moduleName);
}
console.log('PASS: text mode builds, script parses and all required actions and modules remain');
