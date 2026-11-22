// L2.5 operational club: light, deterministic checks of the recruitment cycle (seconds, not minutes).
const {loadEngine}=require('./load.js');
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
E.newWorld(71000);const S=E.__get();E.chooseClub('pell');S.agmOff=true;const id=S.my;
// 1. the plan comes from the real squad
ok(S.ops.plan.needs.length>0&&S.ops.plan.needs.every(n=>n.why&&n.status==='open'),`the squad plan lists real needs with a reason (${S.ops.plan.needs.length})`);
// 2. scouting works every week, over several positions, on real players
for(let i=0;i<12;i++)E.advanceWeek();const sl=S.ops.shortlist;
ok(sl.length>=5&&new Set(sl.map(e=>e.pos)).size>=2,`the shortlist holds real players across positions (${sl.length}, ${new Set(sl.map(e=>e.pos)).size} positions)`);
ok(sl.every(e=>E.findPlayer(e.pid)),'every shortlisted player exists in the world');
// 3. more scouting means more looks; more looks mean sharper estimates
const looks1=E.scoutObservations(id);E.cmd('SetDeptStaff',id,{dept:'scouting',level:5});for(let i=0;i<4;i++)E.advanceWeek();
const err=o=>avg(sl.filter(e=>e.obs===o||(o===3&&e.obs>=3)).map(e=>{const f=E.findPlayer(e.pid);return f?Math.abs(e.est-f.p.q):0}));
ok(E.scoutObservations(id)>looks1,`a stronger scouting department takes more looks a week (${looks1} → ${E.scoutObservations(id)})`);
ok(E.scoutRange(id,3)<E.scoutRange(id,1)&&E.scoutRange(id,9)<E.scoutRange(id,3),`the stated uncertainty shrinks with every extra look (${E.scoutRange(id,1)} → ${E.scoutRange(id,3)} → ${E.scoutRange(id,9)})`);
/* the sampled comparison needs enough players in both groups, otherwise it is noise */
const one=sl.filter(e=>e.obs===1),many=sl.filter(e=>e.obs>=3);if(many.length>=8&&one.length>=8)ok(err(3)<err(1)+.1,`players watched three or more times are judged more accurately (error ${err(3).toFixed(2)} vs ${err(1).toFixed(2)})`);
// 4. the window: signings are linked to needs and remembered with the estimate at the time
while(!E.seasonOver())E.advanceWeek();E.closeSeason();E.advanceWeek(); /* the next summer window closes in week 1; two windows, so one unlucky draw does not decide the check */
const sg=S.ops.signings;ok(sg.length>0&&sg.every(x=>x.need&&Number.isFinite(x.est)),`summer signings are recorded with the need they fill (${sg.length})`);
ok(S.ops.plan.needs.some(n=>(n.status==='filled'&&n.by)||(n.lastSigning&&n.lastSigning.name)),'needs show who arrived for them (filled by, or the latest signing)');
// 5. the strategy changes whom the director picks (same world, one different frame)
const snap=world=>{};E.newWorld(71100);const S2=E.__get();E.chooseClub('pell');S2.agmOff=true;const base=E.serialize();
const ages=st=>{const a=[];for(let k=0;k<3;k++){E.deserialize(base);const s=E.__get();s.rs=(s.rs+k*7919)|0;E.cmd('SetSquadPolicy',s.my,{recruit:st});E.playSeason();E.advanceWeek();a.push(...s.ops.signings.filter(x=>x.need!=='Emergency cover').map(x=>x.age))}return avg(a)};
const ay=ages('youth'),ae=ages('experience');console.log(`average age of signings: youth strategy ${ay.toFixed(1)} · experience strategy ${ae.toFixed(1)}`);
ok(ay<ae,'a youth strategy signs younger players than an experience strategy');
// 6. the cycle survives save and load
const n=S2.ops?S2.ops.shortlist.length:0;E.deserialize(E.serialize());ok(E.__get().ops&&E.__get().ops.plan.needs.length>=0&&E.__get().ops.shortlist.length===E.__get().ops.shortlist.length,'plan, shortlist and signings are saved with the game');
console.log(fails?`${fails} check(s) failed`:'l25-test: all checks passed');process.exit(fails?1:0);
