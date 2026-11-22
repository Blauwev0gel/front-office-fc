// Slimline gates G3/G4: paired policy scenarios. Same world and seed, one choice differs, N seasons played without any other decision.
// Reports mean difference (B minus A), its standard error and sample size per measure. Nothing is forced to be significant.
// usage: node tests/policy-test.js [seasons] [seeds] [scenario ...]
const {loadEngine}=require('./load.js');
const N=+process.argv[2]||5,SEEDS=+process.argv[3]||4,ONLY=process.argv.slice(4);
const SCEN={
  'course frugal v win now':[E=>E.cmd('SetSquadPolicy',E.__get().my,{course:'frugal'}),E=>E.cmd('SetSquadPolicy',E.__get().my,{course:'win'})],
  'course youth first v win now':[E=>E.cmd('SetSquadPolicy',E.__get().my,{course:'youth'}),E=>E.cmd('SetSquadPolicy',E.__get().my,{course:'win'})],
  'recruit youth v experience':[E=>E.cmd('SetSquadPolicy',E.__get().my,{recruit:'youth'}),E=>E.cmd('SetSquadPolicy',E.__get().my,{recruit:'experience'})],
  'wage tight v ambitious':[E=>E.cmd('SetSquadPolicy',E.__get().my,{wage:'tight'}),E=>E.cmd('SetSquadPolicy',E.__get().my,{wage:'ambitious'})],
  'transfer money 10% v 90%':[E=>E.cmd('SetSquadPolicy',E.__get().my,{spend:.1}),E=>E.cmd('SetSquadPolicy',E.__get().my,{spend:.9})],
  'scouting staff 1 v 5':[E=>E.cmd('SetDeptStaff',E.__get().my,{dept:'scouting',level:1}),E=>E.cmd('SetDeptStaff',E.__get().my,{dept:'scouting',level:5})],
  'medical staff 1 v 5':[E=>E.cmd('SetDeptStaff',E.__get().my,{dept:'medical',level:1}),E=>E.cmd('SetDeptStaff',E.__get().my,{dept:'medical',level:5})],
  'training staff 1 v 5':[E=>E.cmd('SetDeptStaff',E.__get().my,{dept:'training',level:1}),E=>E.cmd('SetDeptStaff',E.__get().my,{dept:'training',level:5})],
  'academy staff 1 v 5':[E=>E.cmd('SetDeptStaff',E.__get().my,{dept:'academy',level:1}),E=>E.cmd('SetDeptStaff',E.__get().my,{dept:'academy',level:5})],
  'loans on v off':[E=>E.cmd('SetSquadPolicy',E.__get().my,{loans:true}),E=>E.cmd('SetSquadPolicy',E.__get().my,{loans:false})],
};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
function run(seed,apply){
  const E=loadEngine();E.newWorld(seed);const S=E.__get();E.chooseClub(S.seats[0]);S.agmOff=true;const id=S.my;apply(E);
  let looks=0,inj=0,grow=0,ppg=[],incomes=[],bills=[],spent=0;
  for(let s=1;s<=N;s++){
    while(!E.seasonOver()){E.advanceWeek();if(S.ops&&S.ops.looks&&S.ops.looks.w===S.week&&S.ops.looks.s===S.season)looks+=S.ops.looks.list.length}
    const st=S.stats[id];inj+=st.injWeeks;grow+=st.youthGrowth;ppg.push(E.ppg(id));
    const f=S.fin[id];bills.push(E.wageBillK(id));
    E.closeSeason();if(S.phase==='choose')break;
  }
  E.advanceWeek();const sq=S.squads[id],f=S.fin[id];
  for(const h of f.hist)spent+=-(h.lines.feesOut||0)+(h.lines.feesIn||0);
  const hist=S.clubs[id].hist,sg=E.groundSignals(id);
  return{'squad age':avg(sq.map(p=>p.age)),'age of signings':avg((S.ops?S.ops.signings:[]).map(x=>x.age)),'squad strength':E.teamStrength(id),'points a season':avg(hist.map(h=>h.pts)),
    'wage bill £k/wk':avg(bills),'net transfer spend £k':spent,'cash £k':f.cash,'scout looks':looks,'injury weeks':inj,'youth growth':grow,
    'academy pa of intake':avg((S.youth?S.youth.cohorts:[]).flatMap(c=>c.ids.map(p=>S.youth.grads[p]&&S.youth.grads[p].pot0)).filter(Number.isFinite)),'academy first-team apps':E.academyYield(15).apps,'players on loan':Object.values(S.squads).flat().filter(p=>p.loan&&p.loan.from===id).length};
}
for(const [name,[a,b]] of Object.entries(SCEN)){
  if(ONLY.length&&!ONLY.some(o=>name.includes(o)))continue;
  const rows=[];for(let k=0;k<SEEDS;k++){const seed=5000+k*77;rows.push([run(seed,a),run(seed,b)])}
  console.log(`\n${name} · ${SEEDS} matched worlds · ${N} seasons`);
  for(const m of Object.keys(rows[0][0])){const d=rows.map(([x,y])=>y[m]-x[m]),mean=avg(d),sd=Math.sqrt(avg(d.map(v=>(v-mean)**2))*d.length/Math.max(1,d.length-1)),se=sd/Math.sqrt(d.length);
    console.log(`  ${m.padEnd(26)} A ${avg(rows.map(r=>r[0][m])).toFixed(1).padStart(7)}  B ${avg(rows.map(r=>r[1][m])).toFixed(1).padStart(7)}  diff ${(mean>=0?'+':'')+mean.toFixed(2)} ± ${se.toFixed(2)}${Math.abs(mean)>2*se&&se>0?'  *':''}`)}
}
console.log('\n* = difference larger than two standard errors (small samples: indicative only)');
