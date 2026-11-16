// Text-only presentation guard. Run after: python3 build.py
// Uses no browser dependencies; checks that the real engine and action router
// are still present in the built standalone HTML.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = require('./src.js');
const ui = read('ui.js');
const styleDir = path.join(__dirname, '../src/style');
const css = fs.readdirSync(styleDir).filter(x => x.endsWith('.css')).sort()
  .map(x => fs.readFileSync(path.join(styleDir, x), 'utf8')).join('');
const html = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/);
assert(script && script[1], 'standalone game script present');
new vm.Script(script[1], { filename: 'dist/index.html' });
assert(html.includes('FRONT OFFICE · RETRO WIREFRAME V4'),
  'text stylesheet included in the built HTML');
assert(!html.includes('/*JS*/') && !html.includes('/*CSS*/'), 'all build placeholders resolved');
assert(css.lastIndexOf('FRONT OFFICE · RETRO WIREFRAME V4') > css.indexOf('VOICE:'),
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
// Wireframe layout contract: this is presentation-only. It must preserve
// action targets and text-first responsive layout instead of introducing art.
for (const selector of ['.redbox', '.rbr', '.srow', '.mreply', '.dtiles',
  '.dtile2', '.planboard', '.feedl', '.mdfoot', '.bar2']) {
  assert(css.includes(selector),
    'selector is covered by the text-only stylesheet: ' + selector);
}
assert(css.includes('RETRO WIREFRAME V4'), 'wireframe system is loaded');
const retroCSS = fs.readFileSync(path.join(styleDir, 'zz-text-only.css'),'utf8');
assert(retroCSS.includes('FRONT OFFICE · RETRO WIREFRAME V4'),'single retro stylesheet owns the override');
assert.equal((retroCSS.match(/FRONT OFFICE · RETRO WIREFRAME V4/g)||[]).length,1,
  'no cascading stack of conflicting retro themes');
assert(retroCSS.includes('font:14px/1.5 var(--retro)'),'monospace text system');
assert(retroCSS.includes('border-radius:0!important'),'square retro panels and buttons');
assert(retroCSS.includes('#app *{background-image:none!important}'),
  'remove all remaining graphic-style gradients from the text mode');
for (const selector of ['.title2','.hd','.tabs','.redbox','.rbr','.srow','.mreply',
  '.dtile2','.dtabs','.clubhero','.scene','.seat','.mds','.mdfeed','.mdfoot','.bar2',
  '.b2nav','.sheet','.bkrs','.mbk','.fields','.trayspace','.mdsc']) {
  assert(retroCSS.includes(selector), 'retro screen coverage: '+selector);
}
for (const width of [350,500]) {
  assert(retroCSS.includes('@media(max-width:'+width+'px)'),
    'mobile-specific wireframe breakpoint '+width);
}
assert(retroCSS.includes('@media(min-width:680px)'),'desktop summary panels');
assert(retroCSS.includes('@media(prefers-reduced-motion:reduce)'),'motion reduction');
assert(retroCSS.includes('#app button[aria-label]:empty::after'),
  'decorative icons can be stripped without losing button labels');
assert(retroCSS.includes('.scene .seat .nm'),
  'summer meeting participants remain readable');
assert(!/#app\s+\*[^{}]*\{[^}]*display\s*:\s*none/i.test(retroCSS),
  'do not hide every game element with a global selector');

assert(css.includes('@media(max-width:500px)'), 'mobile-first wireframe responsive rules');
assert(css.includes('.srow[aria-pressed="true"]'),
  'chosen decision remains visually distinct');
assert(css.includes('.b2nav button.on'), 'selected navigation tab remains distinct');
assert(!/\\[?data-a[^}]*display\\s*:\\s*none/.test(css),
  'wireframe must not hide gameplay action controls');
// Behavioural UI contract: a required Red Box response is free in the
// engine. Verify the actual generated reply is not disabled at zero AP.
{
  const uiSource = read('ui.js');
  const start = uiSource.indexOf('function msgHtml(');
  const end = uiSource.indexOf('function briefHtml(', start);
  assert(start >= 0 && end > start, 'Red Box renderer available');
  const source = uiSource.slice(start, end);
  let replyArgs;
  const msg = new Function('F', 'G', 'ROLE_T', 'ART', 'mailTop', 'mailReply',
    'fdHtml', 'U', 'esc', 'ticOf', source + '\nreturn msgHtml;')(
    {msgView:() => ({role:'dof', from:'DoF, Director', title:'Decision',
      body:'Approve or decline', done:false, opts:[{l:'Accept'},{l:'Reject'}],
      auto:0, autoWho:'Your DoF', why:'You are responsible'})},
    () => ({ap:0}), {}, {I:{}}, () => '<mail>',
    (...args) => { replyArgs = args; return '<reply>'; },
    () => '', {}, x => x, () => false);
  const html = msg({id:1,ev:'wage_cap',done:false});
  assert(html.includes('<reply>'), 'Red Box response rendered');
  assert.equal(replyArgs[7],false,'required replies must not be disabled at zero AP');
  assert(replyArgs[6].includes('No action point required'),'free reply label visible');
}
assert(!css.includes('background-color:transparent !important;'), 'do not blank all component backgrounds');
assert(!css.includes('.scene,.crestbig'), 'meeting participants must not be hidden with art');
console.log('PASS: required Red Box reply remains free at zero AP');
console.log('PASS: structural wireframe hierarchy and responsive states');
console.log('PASS: text mode builds, script parses and all required actions and modules remain');
