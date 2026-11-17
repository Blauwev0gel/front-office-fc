// UX contract: decisions remain primary, optional information stays reachable.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync('src/'+p,'utf8');
const inbox=read('ui/10-inbox.js'), club=read('ui/07-club-league.js');
const bar=read('ui/13-redbox-render.js'), css=read('style/zz-text-only.css');
assert(inbox.includes('dw-decisions') && inbox.includes('deskDecisionCard'), 'primary decisions must be visible on Desk');
assert(inbox.includes('deskArchive(items)') && inbox.includes('dw-records'), 'messages and records remain reachable');
assert(inbox.includes('data-t="club"') && inbox.includes('money(g.club.cash)'), 'Club finances must remain reachable');
assert(inbox.includes("data-a=\"filt\"") && inbox.includes('dw-archive-nav'), 'archive browsing must remain functional');
assert(!club.includes("'Your grip'"), 'retired Grip must not appear in Club');
assert(!bar.includes('g.grip < 30'), 'retired Grip must not trigger Club warning');
assert(css.includes('.dw-archive-nav button') && css.includes('min-height:44px'), 'archive touch targets must remain accessible');
const nav=read('ui/04-masthead-news.js');
for(const id of ['inbox','club','squad','staff'])assert(nav.includes('data-t="league"'),'league remains reachable within Football');
assert(bar.includes('fo-mainnav')&&bar.includes('foRoot(U.tab)'),'only one four-way menu is rendered');
assert(css.includes('.fo-mainnav')&&css.includes('.fo-command'),'new responsive game navigation must be styled');
assert(read('ui/05-pitches-squad-money.js').includes('fo-squad'),'squad uses one consolidated three-view menu');
console.log('PASS: Desk V2 decisions, staff context, archive, Club navigation, stakeholders and mobile UI contract');
