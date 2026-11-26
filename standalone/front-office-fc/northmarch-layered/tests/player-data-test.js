// Player data (§7.3–7.4, D-G4, Moneyball): every league match leaves public data per player (xG share, match rating, last
// five), at home and abroad; seasons are archived with rating and xG; every player has one profile. Usage: node tests/player-data-test.js
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE,UI}=require('../build.js');
const js=ENGINE.concat(UI).map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const ok=m=>console.log('ok  ',m);
const g=vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,advanceWeek,closeSeason,seasonOver,playerSheet,squadView,UI})');
g.newWorld(9090);g.chooseClub(g.getS().seats[1]);const S=g.getS(),id=S.my;S.agmOff=true;
for(let w=0;w<10;w++)g.advanceWeek();
const mine=S.squads[id].filter(p=>p.sRn>0);
assert(mine.length>=11,'our regulars have match ratings');
assert(mine.every(p=>p.sRat/p.sRn>=3.5&&p.sRat/p.sRn<=9.8&&p.rLast.length>=1&&p.rLast.length<=5),'ratings stay in range; last five are kept');
const att=mine.filter(p=>['ST','W','AM'].includes(p.pos));assert(att.length&&att.every(p=>p.sXg>0),'attackers build up expected goals');
const gk=mine.filter(p=>p.pos==='GK');assert(gk.every(p=>(p.sXg||0)===0),'a keeper has no expected goals');
ok(`league matches leave a rating and an xG share per player (${mine.length} of ours rated)`);
const abroad=Object.values(S.foreign.squads).flat().filter(p=>p.sRn>0);
assert(abroad.length>100,'foreign league players have data too');
ok(`foreign leagues leave the same data (${abroad.length} players)`);
/* profiles: one view for ours, for a player abroad and for a free agent */
for(const p of [S.squads[id][0],abroad[0],S.fa[0]].filter(Boolean)){const html=g.playerSheet(p.id);assert(html.includes('THE DATA')&&html.includes('THE MONEY')&&html.includes('WHAT WE KNOW'),'profile for '+p.name)}
assert(g.playerSheet(S.squads[id][0].id).includes('EXACT'),'our own players are known exactly');
assert(g.playerSheet(abroad[0].id).includes('NOT SCOUTED'),'a player we never scouted is data only');
ok('every player has one profile: ours exactly, others by data and scouting');
g.UI.title=false;S.phase='season';const tab=g.squadView();assert(tab.includes('sq-tab')&&tab.includes('xG'),'the squad view is a data table');
ok('the squad is a sortable data table');
while(!g.seasonOver())g.advanceWeek();g.closeSeason();
const h=S.squads[S.my].flatMap(p=>p.history||[]).filter(x=>x.season===1&&x.rating!=null);
assert(h.length>=11&&h.every(x=>x.xg!=null),'season archive keeps rating and xG');
assert(S.squads[S.my].every(p=>!(p.sRn>0)),'season data resets for the new season');
ok('a season is archived with average rating and xG, and the new season starts at zero');
console.log('player-data-test: all checks passed');
