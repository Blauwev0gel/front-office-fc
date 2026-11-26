/* ================= The chairman's week: where do you spend your time? =================
   Decision D-S1: the chairman may travel and recommend players to the director; he never signs or approves a deal.
   Activities (MB-12): a scouting trip to a region (with the head scout) or a youth tournament takes the week; a day with the data
   analyst can be added once a week; or a week at the club. Finds go into the dossier; a recommended player joins the director's shortlist with extra weight.
   A region visited often yields less until the next season. Youth prospects may join the academy at the next summer intake.
   Owns S.scout = {used, visits{region:n}, gems[], prospects[]} for the player's club. No DOM; old saves start empty. */
const REGIONS={
  low:{n:'Northmarch lower leagues',d:'Hungry players at small clubs. Cheap, close to home.',pos:['CB','CM','ST'],cost:.5},
  fa:{n:'Out of contract',d:'Free agents nobody else wants. No fee, plenty of risk.',pos:null,cost:.2},
  eng:{n:'England',d:'Physical players at fair prices.',pos:['CB','ST','DM'],cost:2},
  sco:{n:'Scotland',d:'Hard-working defenders, often underrated.',pos:['CB','FB','DM'],cost:1.5},
  ned:{n:'Netherlands',d:'Technical youngsters with a high ceiling.',pos:['AM','W','CM'],cost:2.5},
  ger:{n:'Germany',d:'Disciplined midfielders and goalkeepers.',pos:['DM','CM','GK'],cost:2.5},
  fra:{n:'France',d:'Quick wingers and strikers.',pos:['W','ST','FB'],cost:3},
  esp:{n:'Spain',d:'Gifted technicians. Rarely cheap.',pos:['AM','CM','W'],cost:3.5}
};
const GEMS_MAX=40;
function SC(){if(!S.scout)S.scout={used:null,visits:{},gems:[],prospects:[],seasonV:S.season};if(S.scout.seasonV!==S.season){S.scout.visits={};S.scout.seasonV=S.season}return S.scout}
const scNow=()=>S.season*100+S.week;
/* MB-12: each activity has its own limit. Travel (a scouting trip or a tournament) takes the week and excludes the other
   trip and a week at the club; a data day can be done alongside, once a week. S.scout.did is new; a missing one means nothing done. */
const chairAway=()=>SC().used===scNow();
const chairDid=k=>((SC().did||{})[k])===scNow();
function chairMark(k){const A=SC();(A.did=A.did||{})[k]=scNow()}
function chairBusy(){return (chairAway()||chairDid('home'))&&chairDid('data')}
function chairWhyNot(k){if(k==='data')return chairDid('data')?'The analysts need a week for new numbers':null;if(chairAway())return'You are away this week';if(chairDid('home'))return'You are spending this week at the club';return null}
function regionPool(id,r){
  if(r==='fa')return S.fa.map(p=>({p,from:null}));
  if(r==='low'){const t=CL(id).tier,out=[];for(const c of allIds())if(c!==id&&CL(c).tier>=Math.min(4,t+1))for(const p of S.squads[c])if(!p.loan)out.push({p,from:c});return out}
  const out=[];for(const c in (S.foreign?.squads||{}))if(c.split('_')[1]===r)for(const p of S.foreign.squads[c])out.push({p,from:c});return out;
}
function gemScore(id,c,r){const p=c.p,R=REGIONS[r],fee=c.from?askingFee(p,c.from):0,sq=squadQuality(S.squads[id]);
  const growth=Math.max(0,p.pa-p.q)*(p.age<=21?1.4:p.age<=24?1:.4),value=(p.q-sq)*1.2-fee/Math.max(20,budgetFor(id))*2;
  return growth+value-Math.max(0,p.age-28)*.9+(R.pos&&R.pos.includes(p.pos)?1:0)+rnd()*1.5}
/* a trip: the head scout and you watch a few games; the department's quality decides how sharp the read is */
function chairTrip(id,r){
  const A=SC(),R=REGIONS[r];if(!R)return{ok:false,err:'Unknown region'};{const w=chairWhyNot('trip');if(w)return{ok:false,err:w}}
  const n=Math.max(0,3-(A.visits[r]||0)),sq=squadQuality(S.squads[id]),known=new Set(A.gems.map(g=>g.pid));
  const pool=regionPool(id,r).filter(c=>!known.has(c.p.id)&&c.p.q>=sq-2.5&&(!c.from||askingFee(c.p,c.from)<=Math.max(6,budgetFor(id)*1.5)));
  const picks=pool.map(c=>({c,s:gemScore(id,c,r)})).sort((a,b)=>b.s-a.s).slice(0,n).map(x=>x.c);
  A.used=scNow();A.visits[r]=(A.visits[r]||0)+1;book(id,'travel',-R.cost);
  const noise=scoutNoise(id),found=picks.map(c=>gemRecord(id,c,r,noise,'trip'));
  return{ok:true,found,region:R.n,thin:n<3,none:!pool.length};
}
function gemRecord(id,c,r,noise,how){const p=c.p;
  const g={pid:p.id,name:p.name,pos:p.pos,age:p.age,from:c.from,region:r,how,s:S.season,w:S.week,
    est:r1(p.q+(rnd()+rnd()-1)*2*noise),pot:0,fee:c.from?askingFee(p,c.from):0,q0:r1(p.q),status:'found'};
  g.pot=r1(Math.max(g.est,Math.max(p.q,p.pa)+(rnd()+rnd()-1)*2.5*noise));SC().gems.push(g);if(SC().gems.length>GEMS_MAX)SC().gems.shift();return g}
/* the analyst: players whose output beats their price, across the whole world */
function chairData(id){
  const A=SC();{const w=chairWhyNot('data');if(w)return{ok:false,err:w}}
  const known=new Set(A.gems.map(g=>g.pid)),sq=squadQuality(S.squads[id]),all=[];
  for(const r of Object.keys(REGIONS))if(r!=='fa')for(const c of regionPool(id,r))if(!known.has(c.p.id)&&c.p.age>=20&&c.p.age<=28&&c.p.q>=sq-1){const fee=askingFee(c.p,c.from);all.push({c,r,ratio:(c.p.q-sq+3)/Math.max(1,fee)})}
  const picks=all.sort((a,b)=>b.ratio-a.ratio).slice(0,3);chairMark('data');
  const found=picks.map(x=>{const g=gemRecord(id,x.c,x.r,scoutNoise(id)*.8,'data');g.cheap=Math.round((1-g.fee/Math.max(1,playerValue(x.c.p)*1.6))*100);return g});
  return{ok:true,found};
}
/* a youth tournament: fifteen-year-olds who might join the academy next summer */
function chairTournament(id){
  const A=SC();{const w=chairWhyNot('trip');if(w)return{ok:false,err:w}}A.used=scNow();book(id,'travel',-.8);
  const ac=groundSignals(id).academy,base=11.5+(tierBaseStr(CL(id).tier)-50)/4,found=[];
  for(let i=0;i<3;i++){const q=base-4.5+rnd()*1.5,pa=q+2+rnd()*4.5;const pr={id:'yp'+(S.pc++),name:pname(),pos:pick(POS.slice(1)),age:15,q:r1(q),pa:r1(pa),seen:r1(pa+(rnd()+rnd()-1)*clamp(1.6-.25*G(id).depts.academy.staff,.3,1.6)),s:S.season,status:'seen'};A.prospects.push(pr);found.push(pr)}
  if(A.prospects.length>20)A.prospects.splice(0,A.prospects.length-20);
  return{ok:true,found,academy:ac};
}
/* a week at the club: the chairman spends it with the unhappiest members' group, and they feel it */
function chairHome(id){const A=SC();{const w=chairWhyNot('home');if(w)return{ok:false,err:w}}chairMark('home');
  const g=CL(id).groups.slice().sort((a,b)=>a.mood-b.mood)[0],before=g?Math.round(g.mood):null;if(g)g.mood=clamp(g.mood+6,0,100);
  confLog(id,1,g?`The chairman spent the week with ${groupName(id,g)}`:'The chairman was seen around the club');
  return{ok:true,group:g?groupName(id,g):null,before,after:g?Math.round(g.mood):null}}
/* recommend: the director adds him to the shortlist with extra weight; he still decides */
function chairRecommend(id,pid){
  const g=SC().gems.find(x=>x.pid===pid);if(!g)return{ok:false,err:'Not in your dossier'};const f=findPlayer(pid);if(!f||f.club===id)return{ok:false,err:'He is no longer available'};
  const ops=OPS();let e=ops.shortlist.find(x=>x.pid===pid);
  if(!e){e={pid,name:g.name,pos:g.pos,age:f.p.age,from:f.club,est:g.est,obs:2,status:'watching',first:[S.season,S.week],need:null};ops.shortlist.push(e)}
  e.chair=true;e.status='watching';g.status='recommended';return{ok:true,pos:g.pos};
}
function chairInvite(id,ypid){const pr=SC().prospects.find(x=>x.id===ypid);if(!pr||pr.status!=='seen')return{ok:false,err:'Not available'};pr.status='invited';return{ok:true}}
/* the summer intake: invited prospects choose your academy or another club */
function chairIntake(id){
  if(!S.scout||id!==S.my)return;const ac=groundSignals(id).academy;
  for(const pr of S.scout.prospects.filter(x=>x.status==='invited')){
    if(rnd()<clamp(.35+.07*ac+(CL(id).rep||40)/400,.2,.9)){const k=newPlayer(pr.pos,{age:16,q:pr.q,pa:pr.pa,academy:true,contract:3,club:id,name:pr.name});k.career.push('Academy');S.squads[id].push(k);pr.status='joined';pr.pid=k.id;emit('YouthIntake',id,`${pr.name}, spotted at a youth tournament, joins the academy.`)}
    else{pr.status='declined';emit('Club',id,`${pr.name} chooses another academy.`)}}
}
/* keep the dossier true to the world: who signed for us, who moved elsewhere */
function chairDossierUpdate(){
  if(!S.scout||!S.my)return;for(const g of S.scout.gems){if(g.status==='signed'||g.status==='gone')continue;const f=findPlayer(g.pid);
    if(!f){g.status='gone';continue}if(f.club===S.my){g.status='signed';g.signedS=S.season}else if(f.club!==g.from){g.status='gone';g.to=f.club}}
}
onWeek(chairDossierUpdate);
/* ----- the Moneyball ledger: every player in and out of the player's club, with fees, growth and appearances ----- */
function MB(){if(!S.mb)S.mb=[];return S.mb}
function mbRecord(p,from,to,fee){
  if(!S.my||(to!==S.my&&from!==S.my))return;const L=MB();
  if(to===S.my){L.push({pid:p.id,name:p.name,pos:p.pos,age:p.age,in:fee||0,from,s:S.season,w:S.week,q0:r1(p.q),found:!!(S.scout&&S.scout.gems.some(g=>g.pid===p.id)),out:null,to:null,so:null});if(L.length>80)L.shift();return}
  let r=L.slice().reverse().find(x=>x.pid===p.id&&x.so==null);
  if(!r){r={pid:p.id,name:p.name,pos:p.pos,age:p.age,in:0,from:null,s:null,q0:null,academy:!!(p.career&&p.career[0]==='Academy'),found:false,out:null,to:null,so:null};L.push(r)}
  r.out=fee||0;r.to=to;r.so=S.season;r.qOut=r1(p.q);
}
function mbRow(r){const f=findPlayer(r.pid),here=!!f&&(f.club===S.my||f.p.loan?.from===S.my),lc=S.legacy&&S.legacy.clubs[S.my],apps=lc&&lc.players[r.pid]?lc.players[r.pid].apps:0;
  const worth=r.so!=null?r.out:here?Math.round(playerValue(f.p)):0,profit=worth-r.in,qNow=here?r1(f.p.q):r.qOut??null;
  return{...r,here,apps:apps+(here?(f.p.sApps||0):0),worth,profit,qNow,grew:r.q0!=null&&qNow!=null?r1(qNow-r.q0):null,hit:r.s!=null&&(r.so!=null?r.out>r.in:qNow!=null&&qNow-r.q0>=.5||apps>=30)}}
function mbBoard(){
  const rows=MB().map(mbRow),bought=rows.filter(r=>r.s!=null),sold=rows.filter(r=>r.so!=null);
  const judged=bought.filter(r=>r.so!=null||S.season>r.s),hits=judged.filter(r=>r.hit).length;
  const best=rows.filter(r=>r.s!=null||r.academy).sort((a,b)=>b.profit-a.profit)[0]||null;
  return{rows,spent:bought.reduce((a,r)=>a+r.in,0),received:sold.reduce((a,r)=>a+r.out,0),hits,judged:judged.length,best,found:bought.filter(r=>r.found).length};
}
/* why the director has not signed a recommended player (yet) */
function gemWhy(g){
  if(g.status!=='recommended')return null;const e=S.ops&&S.ops.shortlist.find(x=>x.pid===g.pid);
  if(e&&e.reason&&e.reason!=='Considered')return({'Below target':'Not good enough in my view','Outside transfer budget':'Too expensive for the budget','Above my mandate':'Above my mandate','Outside wage limit':'His wages do not fit','Selling club unwilling':'His club will not sell'})[e.reason]||e.reason;
  const need=S.ops&&S.ops.plan.needs.some(n=>n.status==='open'&&(n.pos===g.pos||NEAR[g.pos]?.includes(n.pos)));
  return need?'Waiting for the next window':`No need for a ${POS_ONE[g.pos]} right now`;
}
function gemNow(g){const f=findPlayer(g.pid);return f?{value:Math.round(playerValue(f.p)),age:f.p.age,club:f.club}:null}
