// The academy (MB-29): five age groups from nine years old, a trial day with limited places, a season line per child,
// youth league tables, and graduates who carry their whole academy history into the first team.
// Usage: node tests/academy-test.js
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE,UI}=require('../build.js');
const js=ENGINE.concat(UI).map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const ok=m=>console.log('ok  ',m);
const g=vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,ACAD,acadTeamOf,acadStars,cmd,advanceWeek,seasonOver,closeSeason,deptSheet,UI,playerSheet})');
g.newWorld(4545);const S=g.getS();g.chooseClub(S.seats[2]);const id=S.my;S.agmOff=true;
const A=g.ACAD();
for(const t of ['U10','U12','U14','U16','U18'])assert(A.kids.some(k=>g.acadTeamOf(k.age)===t),'children in the '+t);
assert(A.kids.filter(k=>k.age>=13).every(k=>k.hist.length>=2),'older children already have years at the club');
assert(new Set(A.trial.kids.map(k=>k.pos)).size>=3,'the trialists play different positions');
ok(`${A.kids.length} children in five age groups, with their history; a trial day of ${A.trial.kids.length} for ${A.trial.places} places`);
const pick=A.trial.kids.slice(-1)[0];assert(g.cmd('AcademyPick',id,{kid:pick.id}).ok,'the chairman can pick a trialist');
for(let i=0;i<A.trial.places;i++)g.cmd('AcademyPick',id,{kid:A.trial.kids[i].id});
assert(A.trial.picked.length<=A.trial.places,'never more than the places');
g.advanceWeek();assert(A.trial.done&&A.kids.some(k=>k.id===pick.id),'the picked child joins when the season starts');
ok('the chairman picks at the trial day; the picks join in week one');
g.UI.over='dept';g.UI.arg='academy';const html=g.deptSheet('academy');assert(html.includes('ac-tabs')&&html.includes('<svg class="face"'),'the academy screen shows the age groups with faces');
while(!g.seasonOver())g.advanceWeek();g.closeSeason();
const B=g.ACAD();assert(Object.keys(B.teams).length>=1&&Object.values(Object.values(B.teams)[0]).every(t=>t.pos>=1&&t.pos<=10),'every age group finished in the youth league');
const grads=S.squads[id].filter(p=>p.youth);assert(grads.length>=1,'graduates join the first team');
assert(grads.every(p=>p.youth.hist.length>=3&&p.age>=17),'graduates carry their academy years');
assert(g.playerSheet(grads[0].id).includes('THE ACADEMY YEARS'),'the profile shows the academy years');
ok(`after a season: youth league tables, ${grads.length} graduate(s) with ${grads[0].youth.hist.length} years of history in their profile`);
console.log('academy-test: all checks passed');
