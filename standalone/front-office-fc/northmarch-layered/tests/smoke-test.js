// Fast smoke test (seconds): every player command once, two seasons, the AGM, and the invariants of the whole world.
// Deterministic; no statistics. The statistical tests live in the deep suite (tests/run-all.sh).
const {loadEngine}=require('./load.js');
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
E.newWorld(61000);const S=E.__get();E.chooseClub('pell');const id=S.my;
const free=S.grounds[id].plots.findIndex(p=>!p.kind);
const calls=[['SetPrice',{kind:'terrace',delta:1}],['SetDues',{delta:1}],['SetDeptStaff',{dept:'medical',level:3}],['SetDeptBudget',{dept:'training',level:'generous'}],['SetDeptCourse',{dept:'academy',course:'broad'}],
  ['StartProject',{key:`plot:${free}:medical`,offer:'standard'}],['Repair',{key:(E.repairList(id)[0]||{}).key}],['TakeLoan',{amount:25,years:5}],['IssueBond',{amount:5}],['Fundraise',{}],
  ['SetSquadPolicy',{wageR:.8,spend:.5,loans:true}],['BuyPlot',{}],['HireStaff',{role:'td',pid:(E.staffCandidates(id,'td')[0]||{}).pid}],['RenewStaff',{role:'coach'}],['SignSponsor',{i:0}],['RepayLoan',{i:0}]];
let ran=0;for(const [n,a] of calls){const r=E.cmd(n,id,a);if(r.ok)ran++;else console.log(`     (${n} refused: ${r.err})`)}
ok(ran>=12,`player commands run through cmd() (${ran}/${calls.length}; refusals above are valid rule checks)`);
ok(S.journal.length>=10,'the decision journal records them');
/* the chairman wins these two votes (losing one is tested below): otherwise a seed that ends in a lost vote freezes the world in 'choose' */
for(let s=0;s<2;s++){while(!E.seasonOver())E.advanceWeek();S.members[S.my].conf=90;E.closeSeason()}
E.advanceWeek(); /* the summer window is open through the pre-season and closes when week 1 is played */
ok(S.season===3&&S.phase==='season','two full seasons play through, AGMs included');
let bad=[];for(const c in S.clubs){const f=S.fin[c];let sum=f.start;for(const h of f.hist)for(const k in h.lines)sum+=h.lines[k];for(const k in f.season)sum+=f.season[k];
  if(Math.abs(sum-f.cash)>.5)bad.push(c+' ledger');if(!Number.isFinite(f.cash))bad.push(c+' cash');const n=S.squads[c].length;if(n<18||n>30)bad.push(c+' squad '+n)}
ok(!bad.length,`every club's ledger reconciles and squads stay between 18 and 30 ${bad.slice(0,3).join(', ')}`);
ok(E.tierIds(0).length===16&&E.tierIds(1).length===16&&E.tierIds(2).length===16,'three divisions of sixteen');
// voted out: the chairman picks a new club and plays on
for(let i=0;i<29;i++)E.advanceWeek();S.members[S.my].conf=2;E.advanceWeek();E.closeSeason();
ok(S.phase==='choose'&&S.seats.length>=3&&new Set(S.seats.map(i=>S.clubs[i].tier)).size===S.seats.length,`a lost AGM vote offers new chairs, one in each division (${S.seats.length})`);E.chooseClub(S.seats[1]);E.advanceWeek();ok(S.week===1&&S.career.length===2,'and the game carries on at the new club');
console.log(fails?`${fails} check(s) failed`:'smoke-test: all checks passed');process.exit(fails?1:0);
