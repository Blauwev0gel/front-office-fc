/* L3 S3.2 — optional director accountability extension.
   Read-only evidence and reports. The baseline simulation may run without this file.
   The core offers generic events; this module subscribes without modifying the clock. */
function directorReportOnWindowClosed({club,week}){
  if(!S.ops||club!==S.my)return;
  const ops=S.ops,windowWeek=week;
  const signings=ops.signings.filter(x=>x.s===S.season&&x.w===windowWeek);
  const missed=(ops.missed||[]).filter(x=>x.status==='above');
  const deals=(S.ev||[]).filter(e=>e.s===S.season&&e.w===windowWeek&&
    ((e.c===S.my&&['Transfer','Signing'].includes(e.t))||(e.c2===S.my&&e.t==='Transfer')||
     (e.t==='InternationalTransfer'&&(e.from===S.my||e.to===S.my))));
  const report={s:S.season,w:windowWeek,kind:windowWeek===0?'Summer':'Winter',
    director:tdOf(S.my).name,directorPid:tdOf(S.my).id,mandate:mandateOf(S.my).deals,
    signed:signings.map(x=>({pid:x.pid,name:x.name,pos:x.pos,fee:x.fee,est:x.est,q0:x.q0,need:x.need,s:x.s,w:x.w,directorPid:x.directorPid||null,directorName:x.directorName||null})),
    missed:missed.map(x=>({pid:x.pid,name:x.name,pos:x.pos,fee:x.fee,cap:x.cap,need:x.need})),
    events:deals.map(e=>({t:e.t,text:e.text})),closed:[S.season,S.week]};
  ops.reports=ops.reports||[];
  const idx=ops.reports.findIndex(x=>x.s===report.s&&x.w===report.w);
  if(idx>=0)ops.reports[idx]=report;else ops.reports.push(report);
  if(ops.reports.length>8)ops.reports.splice(0,ops.reports.length-8);
}
/* S3.2: retained evidence, not a fictional satisfaction score.
   A club appearance in an earlier season remains valid after the season stats reset.
   Stints are counted only for the chairman's club, not games before a transfer or on loan.
   An assessment is frozen after eight real appearances, so later growth, transfers
   and retirement cannot rewrite how the original signing was judged. */
function directorSigningApps(x){
  const f=findPlayer(x.pid);
  if(!f)return {apps:x.appsObserved||0,player:null,club:null};
  const p=f.p;
  const history=(p.history||[]).filter(h=>h.club===S.my&&h.season>=x.s);
  const past=history.reduce((n,h)=>n+(h.apps||0)+(h.cupApps||0)+(h.europe||0),0);
  const current=f.club===S.my?(p.sApps||0)+(p.cupApps||0)+(p.eApps||0):0;
  return {apps:Math.max(x.appsObserved||0,past+current),player:p,club:f.club};
}
function directorAuditWeek(){
  if(!S.my||!S.ops)return;
  for(const r of S.ops.reports||[])for(const x of r.signed||[]){
    const evidence=directorSigningApps(x);
    x.appsObserved=evidence.apps;
    if(x.assessment||evidence.apps<8||!Number.isFinite(x.est)||!Number.isFinite(x.q0))continue;
    x.assessment={result:x.q0>=x.est-1?'meeting':'below',apps:evidence.apps,
      s:S.season,w:S.week,estimate:x.est,qualityAtSigning:x.q0};
  }
}
/* Trust attaches to the actual director who signed each player. A replacement
   inherits none of a predecessor's successes or mistakes. The sample count
   prevents a single fortunate signing from deciding his reputation. */
function directorTrust(pid){
  const who=pid||tdOf(S.my)?.id;
  const all=(S.ops?.reports||[]).flatMap(r=>r.signed||[]).filter(x=>x.directorPid===who&&x.assessment);
  const n=all.length,hits=all.filter(x=>x.assessment.result==='meeting').length;
  const label=n<3?'Too early to judge':hits/n>=2/3?'Earned confidence':hits/n<=1/3?'Recruitment concerns':'Mixed recruitment record';
  return {pid:who,n,hits,rate:n?Math.round(hits/n*100):null,label};
}
function directorWindowReviews(){
  return (S.ops?.reports||[]).slice().reverse().map(r=>{
    const players=(r.signed||[]).map(x=>{
      const evidence=directorSigningApps(x),p=evidence.player;
      const elapsed=(S.season-(x.s??r.s))*SEASON_WEEKS+S.week-(x.w??r.w);
      const verdict=x.assessment?(x.assessment.result==='meeting'?'Met estimate':'Below estimate'):
        !p?'Unavailable':evidence.club!==S.my?'Departed before assessment':elapsed>=SEASON_WEEKS?'Limited involvement':'Too early';
      return {...x,apps:evidence.apps,current:p?r1(p.q):null,club:evidence.club,verdict};
    });
    const assessed=players.filter(x=>x.assessment);
    return {...r,players,assessed:assessed.length,meeting:assessed.filter(x=>x.assessment.result==='meeting').length};
  });
}

onFeature('transferWindowClosed',directorReportOnWindowClosed);
onFeature('weekClosed',()=>{if(S.my)directorAuditWeek()});
onFeature('saveLoaded',()=>{if(S.ops&&!Array.isArray(S.ops.reports))S.ops.reports=[]});
