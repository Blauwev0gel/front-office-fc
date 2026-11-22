// Savegames: a save made mid-season continues exactly like the original; versions and migrations are checked.
const {loadEngine}=require('./load.js');
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
E.newWorld(777);E.chooseClub(E.__get().seats[0]);
for(let i=0;i<12;i++)E.advanceWeek();
E.cmd('SetPrice',E.__get().my,{kind:'terrace',delta:2});
const snap=E.serialize();
const V=E.schemaVersion();ok(JSON.parse(snap).v===V,`the save carries schema version ${V}`);
// continue the original to the end of the next season
for(let s=0;s<2;s++)E.playSeason()
const a=E.serialize();
// load the save and continue the same way
E.deserialize(snap);
ok(E.__get().week===12,'the loaded save is in week 12');
for(let s=0;s<2;s++)E.playSeason()
ok(E.serialize()===a,'a loaded save continues exactly like the original (two seasons on)');
// a save that is not ours, or from the future, is refused; an older version without a migration fails loudly
let threw=false;try{E.deserialize(JSON.stringify({v:99}))}catch(e){threw=true}ok(threw,'a save from a newer version is refused');
threw=false;try{E.deserialize('{"foo":1}')}catch(e){threw=true}ok(threw,'a foreign save is refused');
// migration 1 → 2: a save in the M1 shape (six departments, no staff, no statistics) loads and plays on
{const v1=JSON.parse(snap);v1.v=1;delete v1.stats;
 for(const id in v1.grounds){const d=v1.grounds[id].depts;delete d.medical;delete d.grounds;for(const k in d){delete d[k].staff;delete d[k].hiring}}
 E.deserialize(JSON.stringify(v1));const S=E.__get();
 ok(S.v===V&&Object.keys(S.grounds[S.my].depts).length===8,'a version 1 save migrates to eight departments (and on to the current version)');
 ok(Object.values(S.grounds).every(g=>Object.values(g.depts).every(d=>d.staff>=1&&d.staff<=5)),'every department gets a staff level');
 let err=null;try{E.playSeason()}catch(e){err=e.message}
 ok(!err,'the migrated save plays on to the next season '+(err||''));}
// migration 2 → 3: a save without members, targets or a career gets them and plays on
{const v2=JSON.parse(snap);v2.v=2;delete v2.members;delete v2.career;delete v2.rep;delete v2.votedOut;
 E.deserialize(JSON.stringify(v2));const S=E.__get();
 ok(S.v===V&&Object.keys(S.members).length===Object.keys(S.clubs).length&&S.members[S.my].goals.length===3,'a version 2 save gets members, confidence and season targets');
 let err=null;try{E.playSeason()}catch(e){err=e.message}ok(!err,'the migrated save plays on through an AGM '+(err||''));}
// migration 3 → 4: coaches and directors without a profile get one, and the free pool is filled
{const v3=JSON.parse(snap);v3.v=3;delete v3.staffPool;for(const id in v3.P)delete v3.P[id].pro;
 E.deserialize(JSON.stringify(v3));const S=E.__get();
 ok(S.v===V&&Object.keys(S.clubs).every(i=>S.P[S.clubs[i].cast.coach].pro&&S.P[S.clubs[i].cast.td].pro)&&S.staffPool.length>=10,'a version 3 save gets coach and director profiles and a free pool');
 let err=null;try{E.playSeason()}catch(e){err=e.message}ok(!err,'and plays on '+(err||''));}
// migration 4 → 5: budget, sponsor and funding fields are filled after loading
{const v4=JSON.parse(snap);v4.v=4;for(const id in v4.fin){const f=v4.fin[id];delete f.budget;delete f.sponsor;delete f.offers;delete f.naming;delete f.fundLast;delete f.groundSold;delete f.bondSeason}
 E.deserialize(JSON.stringify(v4));const S=E.__get();
 ok(S.v===V&&Object.values(S.fin).every(f=>f.sponsor&&f.budget&&f.fundLast!=null),'a version 4 save gets a sponsor, a season budget and funding fields');
 let err=null;try{E.playSeason()}catch(e){err=e.message}ok(!err,'and plays on '+(err||''));}
// migration 6 → 7: records and history fields
{const v6=JSON.parse(snap);v6.v=6;delete v6.records;E.deserialize(JSON.stringify(v6));const S=E.__get();
 ok(S.v===V&&Object.keys(S.records).length===Object.keys(S.clubs).length,'a version 6 save gets club records');let err=null;try{E.playSeason()}catch(e){err=e.message}ok(!err,'and plays on '+(err||''));}
console.log(fails?`${fails} check(s) failed`:'save-test: all checks passed');process.exit(fails?1:0);
