// L1/L2 validation: six chairmen, each run only through player commands, over several seasons and seeds.
// Prints a comparison table and checks that the strategies really differ and that none wins on every front.
// Usage: node tests/strategy-test.js [seeds] [seasons]
const {loadEngine}=require('./load.js');
const NS=+(process.argv[2]||5),SEASONS=+(process.argv[3]||5);
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
const free=(S,id)=>S.grounds[id].plots.findIndex(p=>!p.kind);
const plotOf=(S,id,k)=>S.grounds[id].plots.findIndex(p=>p.kind===k);
function bestCoach(id,spec){const c=E.staffCandidates(id,'coach').filter(x=>!spec||E.__get().P[x.pid].pro.spec===spec);return c[0]}
const BOARDS={
  prudent:{n:'Careful',season:(S,id)=>{E.cmd('SetSquadPolicy',id,{wageR:.62,spend:.2})},week:(S,id)=>{if(S.week%10===5)for(const r of E.repairList(id).filter(x=>x.cond<50))E.cmd('Repair',id,{key:r.key})}},
  youth:{n:'Youth and facilities',season:(S,id,s)=>{
      if(s===0){E.cmd('TakeLoan',id,{amount:Math.min(150,E.maxNewLoan(id)),years:10});const f=free(S,id);if(f>=0)E.cmd('StartProject',id,{key:`plot:${f}:academy`,offer:'standard'})}
      const t=plotOf(S,id,'training');if(t>=0)E.cmd('StartProject',id,{key:`plot:${t}:up`,offer:'standard'});
      for(const d of ['training','academy','medical'])E.cmd('SetDeptStaff',id,{dept:d,level:Math.min(5,S.grounds[id].depts[d].staff+1)});
      E.cmd('SetSquadPolicy',id,{wageR:.72,spend:.4,loans:true});const c=bestCoach(id,'development');if(c)E.cmd('HireStaff',id,{role:'coach',pid:c.pid})},
    week:(S,id)=>{if(S.week%10===5)for(const r of E.repairList(id).filter(x=>x.cond<45))E.cmd('Repair',id,{key:r.key})}},
  ambitious:{n:'Ambitious',season:(S,id,s)=>{
      E.cmd('TakeLoan',id,{amount:E.maxNewLoan(id),years:5});E.cmd('SetSquadPolicy',id,{wageR:.95,spend:.9});const c=bestCoach(id);if(c)E.cmd('HireStaff',id,{role:'coach',pid:c.pid});
      if(s===1)E.cmd('StartStadium',id,{size:'standard'});E.cmd('SetDeptStaff',id,{dept:'commercial',level:Math.min(5,S.grounds[id].depts.commercial.staff+1)})},week:()=>{}},
  idle:{n:'Hardly acts',season:()=>{},week:()=>{}},
  crisis:{n:'Spends beyond means',season:(S,id,s)=>{E.cmd('TakeLoan',id,{amount:E.maxNewLoan(id),years:3});E.cmd('SetSquadPolicy',id,{wageR:1.05,spend:1});if(s===0)E.cmd('StartStadium',id,{size:'grand'});
      for(const d in S.grounds[id].depts){E.cmd('SetDeptStaff',id,{dept:d,level:5});E.cmd('SetDeptBudget',id,{dept:d,level:'generous'})}for(let i=0;i<4;i++)E.cmd('SetPrice',id,{kind:'terrace',delta:-1})},week:()=>{}},
  votedout:{n:'Voted out, carries on',season:()=>{},week:(S,id)=>{if(S.week===29&&S.season===1)S.members[id].conf=5}}
};
const rows={};
for(const key in BOARDS){const B=BOARDS[key],R=rows[key]={lvl:[],ppg:[],cash:[],debt:[],conf:[],out:[],admin:[],crisis:[],train:[],clubs:[]};
  for(let k=0;k<NS;k++){E.newWorld(31000+k);const S=E.__get();E.chooseClub('pell');let crises=0,admins=0,outs=0;const ppgs=[];
    for(let s=0;s<SEASONS;s++){if(S.phase==='choose'){outs++;E.chooseClub(S.seats[0])}const id=S.my;B.season(S,id,s);
      while(!E.seasonOver()){B.week(S,S.my);for(const e of E.advanceWeek()){if(e.c===S.my&&e.t==='CashCrisis')crises++;if(e.c===S.my&&e.t==='Administration')admins++}}
      ppgs.push(E.ppg(S.my));const conf=S.members[S.my].conf;E.closeSeason();R.conf.push(conf)}
    if(S.phase==='choose'){outs++;E.chooseClub(S.seats[0])}
    const id=S.my,c=S.clubs[id],pos=E.posOf(id);
    const last=c.hist[c.hist.length-1]||{tier:c.tier,pos:8};R.lvl.push((2-last.tier)*16+(17-last.pos));R.ppg.push(avg(ppgs));R.cash.push(S.fin[id].cash);R.debt.push(E.debt(id));R.out.push(outs);R.admin.push(admins);R.crisis.push(crises);
    R.train.push(E.groundSignals(id).training+E.groundSignals(id).academy);R.clubs.push(S.career.length)}}
console.log(`\n${NS} seeds × ${SEASONS} seasons, Pell United (Northmarch One) at the start. Level: 48 = top of the Premier, 17 = top of One, 1 = bottom of Two.`);
console.log('chairman               level  pts/game  cash    debt   members  voted out  cash crises  admin  training+academy');
for(const k in rows){const r=rows[k];console.log(`${BOARDS[k].n.padEnd(22)} ${avg(r.lvl).toFixed(1).padStart(5)}  ${avg(r.ppg).toFixed(2).padStart(7)}  ${('£'+avg(r.cash).toFixed(0)+'k').padStart(7)} ${('£'+avg(r.debt).toFixed(0)+'k').padStart(6)}  ${avg(r.conf).toFixed(0).padStart(6)}  ${avg(r.out).toFixed(1).padStart(8)}  ${avg(r.crisis).toFixed(1).padStart(10)}  ${avg(r.admin).toFixed(1).padStart(5)}  ${avg(r.train).toFixed(1).padStart(8)}`)}
const A=k=>rows[k];
ok(avg(A('prudent').cash)>avg(A('ambitious').cash)&&avg(A('ambitious').debt)>avg(A('prudent').debt),'the careful chairman keeps more cash and less debt than the ambitious one');
ok(avg(A('youth').train)>avg(A('idle').train)+2,'investing in youth and facilities builds a better complex than doing nothing');
ok(A('crisis').crisis.filter((c,i)=>c+A('crisis').admin[i]>0).length>=NS*.6,'spending beyond your means leads to cash crises or administration in most seeds');
ok(A('votedout').clubs.every(n=>n>=2),'a chairman who is voted out carries on at another club in every seed');
const fronts={sport:k=>avg(A(k).lvl),money:k=>avg(A(k).cash)-avg(A(k).debt),members:k=>avg(A(k).conf)},keys=['prudent','youth','ambitious','idle'];
const best=Object.fromEntries(Object.entries(fronts).map(([f,fn])=>[f,keys.slice().sort((a,b)=>fn(b)-fn(a))[0]]));
console.log(`best on sport: ${BOARDS[best.sport].n} · on money: ${BOARDS[best.money].n} · with the members: ${BOARDS[best.members].n}`);
ok(!(best.sport===best.money&&best.money===best.members),'no single strategy is best on sport, money and members at once');
console.log(fails?`${fails} check(s) failed`:'strategy-test: all checks passed');process.exit(fails?1:0);
