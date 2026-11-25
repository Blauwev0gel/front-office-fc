/* ================= The chairman's week: where do you spend your time? =================
   Decision D-S1: the chairman may travel and recommend players to the director; he never signs or approves a deal.
   One activity a week: a scouting trip to a region (with the head scout), a youth tournament, a day with the data analyst,
   or a day at home. Finds go into the dossier; a recommended player joins the director's shortlist with extra weight.
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
function chairBusy(){return SC().used===scNow()}
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
  const A=SC(),R=REGIONS[r];if(!R)return{ok:false,err:'Unknown region'};if(chairBusy())return{ok:false,err:'You have already spent this week'};
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
  const A=SC();if(chairBusy())return{ok:false,err:'You have already spent this week'};
  const known=new Set(A.gems.map(g=>g.pid)),sq=squadQuality(S.squads[id]),all=[];
  for(const r of Object.keys(REGIONS))if(r!=='fa')for(const c of regionPool(id,r))if(!known.has(c.p.id)&&c.p.age>=20&&c.p.age<=28&&c.p.q>=sq-1){const fee=askingFee(c.p,c.from);all.push({c,r,ratio:(c.p.q-sq+3)/Math.max(1,fee)})}
  const picks=all.sort((a,b)=>b.ratio-a.ratio).slice(0,3);A.used=scNow();
  const found=picks.map(x=>{const g=gemRecord(id,x.c,x.r,scoutNoise(id)*.8,'data');g.cheap=Math.round((1-g.fee/Math.max(1,playerValue(x.c.p)*1.6))*100);return g});
  return{ok:true,found};
}
/* a youth tournament: fifteen-year-olds who might join the academy next summer */
function chairTournament(id){
  const A=SC();if(chairBusy())return{ok:false,err:'You have already spent this week'};A.used=scNow();book(id,'travel',-.8);
  const ac=groundSignals(id).academy,base=11.5+(tierBaseStr(CL(id).tier)-50)/4,found=[];
  for(let i=0;i<3;i++){const q=base-4.5+rnd()*1.5,pa=q+2+rnd()*4.5;const pr={id:'yp'+(S.pc++),name:pname(),pos:pick(POS.slice(1)),age:15,q:r1(q),pa:r1(pa),seen:r1(pa+(rnd()+rnd()-1)*clamp(1.6-.25*G(id).depts.academy.staff,.3,1.6)),s:S.season,status:'seen'};A.prospects.push(pr);found.push(pr)}
  if(A.prospects.length>20)A.prospects.splice(0,A.prospects.length-20);
  return{ok:true,found,academy:ac};
}
function chairHome(id){const A=SC();if(chairBusy())return{ok:false,err:'You have already spent this week'};A.used=scNow();confLog(id,1,'The chairman was seen around the club');return{ok:true}}
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
