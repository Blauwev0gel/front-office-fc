// L2.5 youth cycle: light, deterministic checks (seconds). Cohorts, outcomes kept after leaving, development lines, old saves.
const {loadEngine}=require('./load.js');
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
E.newWorld(5150);let S=E.__get();E.chooseClub('pell');S.agmOff=true;
E.cmd('SetDeptStaff',S.my,{dept:'academy',level:5});
for(let s=0;s<5;s++)E.playSeason();S=E.__get();const Y=S.youth,id=S.my,gs=Object.values(Y.grads);
ok(Y.cohorts.length===5,`one cohort per summer (${Y.cohorts.length})`);
ok(Y.cohorts.every(c=>c.ids.every(pid=>Y.grads[pid])),'every graduate of every cohort has a record');
const left=gs.filter(g=>g.fate);
ok(left.length>0&&left.every(g=>g.fate.how&&g.fate.s),`graduates who left keep their record, with how and when (${left.length})`);
ok(gs.filter(g=>!g.fate).every(g=>{const f=E.findPlayer(g.pid);return f&&(f.club===id||(f.p.loan&&f.p.loan.from===id))}),'graduates without an outcome are really at the club or on loan from it');
const sold=left.filter(g=>g.fate.how==='sold');ok(sold.every(g=>g.fate.to),`sold graduates name the buying club (${sold.length})`);
const young=S.squads[id].filter(p=>p.age<=23&&p.dev&&p.dev.length);
ok(young.length>0&&young.every(p=>p.dev.every(d=>d.s&&d.q>0&&d.apps>=0)),`young players carry a development line per season (${young.length})`);
const ay=E.academyYield(5);ok(ay.n===gs.filter(g=>Y.cohorts.slice(-5).some(c=>c.ids.includes(g.pid))).length&&ay.regulars<=ay.n,`academy yield adds up (${ay.regulars} regulars of ${ay.n}, £${ay.fees}k)`);
// save and load keep it; an old save without S.youth rebuilds cohorts from the academy's intake records
const txt=E.serialize();E.deserialize(txt);ok(JSON.stringify(E.__get().youth)===JSON.stringify(Y),'save and load keep the youth records');
const old=JSON.parse(txt);delete old.youth;E.deserialize(JSON.stringify(old));const R=E.__get().youth;
ok(R&&R.cohorts.length>0&&R.cohorts.every(c=>c.ids.every(pid=>R.grads[pid])),`an older save rebuilds cohorts from the intake records (${R.cohorts.length})`);
const n0=R.cohorts.length;E.playSeason();ok(E.__get().youth.cohorts.length===n0+1||n0===15,'and keeps recording after loading');
console.log(fails?`youth-test: ${fails} failed`:'youth-test: all checks passed');process.exit(fails?1:0);
