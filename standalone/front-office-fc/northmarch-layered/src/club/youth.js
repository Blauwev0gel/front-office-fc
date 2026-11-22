/* ================= L2.5: the youth development cycle =================
   INTAKE → DEVELOPMENT (minutes, growth) → PATHWAY (ready to step up, loan) → OUTCOME → ACADEMY YIELD.
   Owns S.youth (the player's club only): every academy cohort and what became of each graduate, kept after he leaves.
   Owns p.dev on the player's own young players: one line per season (quality, appearances, where he played).
   It records what the engine does; growth itself stays in football/players.js. */
const YOUTH_GRADS_MAX=80,DEV_MAX=10;
function youthInit(){return{cohorts:[],grads:{}}}
function YOUTH(){if(!S.youth)S.youth=youthInit();return S.youth}
/* how far the academy staff can see a youngster's ceiling: a fixed per-player error, smaller with better staff */
function pidHash(pid){let h=7;for(const ch of String(pid))h=(h*31+ch.charCodeAt(0))%9973;return h/9973*2-1}
function potentialSeen(id,p){const st=G(id).depts.academy.staff;return r1(p.pa+pidHash(p.id)*clamp(1.6-.25*st,.3,1.6))}
function potentialBand(id,p){const d=potentialSeen(id,p)-squadQuality(S.squads[id]);return d>=1?'Future starter':d>=-.4?'First-team player':d>=-1.5?'Squad player':'Unlikely to make it'}

/* season end, before ageing (called from playersSeasonEnd): one development line per young player of the player's club */
function youthDevRecord(id){
  if(id!==S.my)return;const Y=YOUTH();
  for(const p of S.squads[id]){if(p.age>23&&!Y.grads[p.id])continue;
    const line={s:S.season,age:p.age,q:r1(p.q),apps:p.loanStats?.apps??p.sApps,where:p.wasLoan?CL(p.wasLoan).name:null};p.wasLoan=null;p.loanStats=null;
    if(p.age<=23){p.dev=p.dev||[];p.dev.push(line);if(p.dev.length>DEV_MAX)p.dev.shift()}
    const g=Y.grads[p.id];if(g){g.dev.push(line);if(g.dev.length>DEV_MAX)g.dev.shift();g.peak=Math.max(g.peak,line.q);if(!line.where&&line.apps>=10)g.regular=true}
  }
}
/* season end, after the intake: a new cohort */
function youthIntake(id,kids){
  if(id!==S.my)return;const Y=YOUTH();
  Y.cohorts.push({s:S.season,ids:kids.map(k=>k.id),level:groundSignals(id).academy});
  for(const k of kids)Y.grads[k.id]={pid:k.id,name:k.name,pos:k.pos,s:S.season,q0:r1(k.q),pot0:potentialSeen(id,k),peak:r1(k.q),dev:[],status:'academy',fate:null,regular:false};
  if(Y.cohorts.length>15)Y.cohorts.shift();
  const keep=new Set(Y.cohorts.flatMap(c=>c.ids));for(const pid in Y.grads)if(!keep.has(pid))delete Y.grads[pid];
}
/* a graduate leaves: the record stays, with how and where he went */
function youthLeft(p,how,to,fee){
  const g=S.youth&&S.youth.grads[p.id];if(!g||g.fate)return;
  g.fate={s:S.season,w:S.week,how,to:to||null,fee:fee||0,q:r1(p.q),age:p.age};g.status=how;
}
/* keep every graduate's status true to the world (end of each season and after the winter window) */
function youthReconcile(){
  if(!S.my||!S.youth)return;
  for(const g of Object.values(S.youth.grads)){if(g.fate)continue;const f=findPlayer(g.pid);
    if(!f){youthLeft({id:g.pid,q:g.peak,age:null},'retired');continue}
    if(f.club===S.my){g.status=f.p.age<=18&&!f.p.sApps?'academy':'squad';continue}
    if(f.club&&f.p.loan&&f.p.loan.from===S.my){g.status='loan';continue}
    youthLeft(f.p,f.club?'sold':'released',f.club);
  }
}
/* what an academy has given the club: per cohort and over the last five */
function cohortYield(c){
  const gs=c.ids.map(pid=>S.youth.grads[pid]).filter(Boolean);
  return{s:c.s,n:gs.length,regulars:gs.filter(g=>g.regular).length,here:gs.filter(g=>!g.fate).length,fees:gs.reduce((a,g)=>a+(g.fate&&g.fate.how==='sold'?g.fate.fee:0),0),
    apps:gs.reduce((a,g)=>a+g.dev.filter(d=>!d.where).reduce((x,d)=>x+d.apps,0),0),best:gs.slice().sort((a,b)=>b.peak-a.peak)[0]||null,gs};
}
function academyYield(n=5){
  const cs=(S.youth?S.youth.cohorts:[]).slice(-n).map(cohortYield);
  return{cohorts:cs,n:cs.reduce((a,c)=>a+c.n,0),regulars:cs.reduce((a,c)=>a+c.regulars,0),fees:cs.reduce((a,c)=>a+c.fees,0),apps:cs.reduce((a,c)=>a+c.apps,0)};
}
/* the pathway of a young player at the club now */
function pathwayOf(id,p){
  const xi=pickXI(S.squads[id]).map(x=>x.p),wk=Math.max(1,S.week),ready=S.ops&&S.ops.plan.ready.some(r=>r.pid===p.id);
  if(p.loan&&p.loan.from===id)return{k:'loan',t:'On loan'};
  if(xi.includes(p))return{k:'starter',t:'Starting'};
  if(ready)return{k:'ready',t:'Ready to step up'};
  if(p.sApps<wk*.25&&p.pa>p.q+1&&p.age<=21)return{k:'games',t:'Needs games'};
  return{k:'dev',t:'Developing'};
}
/* old saves: rebuild cohorts from the intake records the academy already kept */
function youthAfterLoad(){
  if(!S.my||S.youth)return;S.youth=youthInit();const hist=(S.stats[S.my]&&S.stats[S.my].academyHistory)||[];
  for(const h of hist){S.youth.cohorts.push({s:h.season,ids:h.graduates.map(g=>g.pid),level:null});
    for(const g of h.graduates)S.youth.grads[g.pid]={pid:g.pid,name:g.name,pos:g.pos,s:h.season,q0:g.quality,pot0:null,peak:g.quality,dev:[],status:'academy',fate:null,regular:false}}
  youthReconcile();
}
