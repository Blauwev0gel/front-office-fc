// UX contract: decisions remain primary, optional information stays reachable.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync('src/'+p,'utf8');
const inbox=read('ui/10-inbox.js'), club=read('ui/07-club-league.js');
const bar=read('ui/13-redbox-render.js'), css=read('style/zz-text-only.css');
assert(inbox.includes('<section class="redbox"'), 'primary decision area missing');
assert(inbox.includes('<details class="inbox-browse">'), 'secondary message folders must be optional');
assert(inbox.includes('data-t="club"><b>${money(g.club.cash)}'), 'cash shortcut must open Club');
assert(inbox.includes('aria-selected='), 'inbox folder state must be exposed');
assert(!club.includes("'Your grip'"), 'retired Grip must not appear in Club');
assert(!bar.includes('g.grip < 30'), 'retired Grip must not trigger Club warning');
assert(css.includes('.inbox-browse .folders button')&&css.includes('min-height:44px'),'folder touch targets must remain accessible');
const nav=read('ui/04-masthead-news.js');
for(const id of ['inbox','club','squad','staff'])assert(nav.includes('data-t="league"'),'league remains reachable within Football');
assert(bar.includes('fo-mainnav')&&bar.includes('foRoot(U.tab)'),'only one four-way menu is rendered');
assert(css.includes('.fo-mainnav')&&css.includes('.fo-command'),'new responsive game navigation must be styled');
assert(read('ui/05-pitches-squad-money.js').includes('fo-squad'),'squad uses one consolidated three-view menu');
console.log('PASS: inbox hierarchy, optional browse, cash navigation, legacy Grip and touch targets');
