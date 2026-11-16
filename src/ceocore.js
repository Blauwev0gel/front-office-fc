/* CEO Core Quality — evidence ledger, not a second decision engine.
   Existing FO actions, HOOK.seasonAfterMatch and game RNG stay authoritative. */
(function (F) {
'use strict';
const LIMIT=48;
const IMPORTANT=new Set(['coach_dof_clash','com_mkt_clash','grad_minutes','naming_rights',
  'rebrand','cash_crisis','wage_cap','acad_welfare','style_drift','clash_budget',
  'clash_prospect','rec_exception','squad_plan_policy']);
function state() {
  const G=F.G;
  if (!G.ceoCore || typeof G.ceoCore!=='object') G.ceoCore={ n:0, decisions:[], delegated:[] };
  const S=G.ceoCore;
  if (!Array.isArray(S.decisions)) S.decisions=[];
  if (!Array.isArray(S.delegated)) S.delegated=[];
  if (!Number.isFinite(S.n)) S.n=0;
  return S;
}
function snap(role) {
  const G=F.G, R=G.rec||{}, K=Object.values(R.know||{}),
    D=(G.desk && G.desk.by && G.desk.by[role])||{}, SS=G.ss||{}, FT=G.ft||{};
  return { season:G.season, games:SS.lg||0, xgf:SS.xgf||0, xga:SS.xga||0,
    youth:FT.u21||0, played:FT.played||0, reports:K.reduce((a,k)=>a+(k.n||0),0),
    confident:K.filter(k=>k.conf==='high').length, signings:(R.log||[]).length,
    calls:D.n||0, errors:D.err||0, cash:G.club?G.club.cash:0,
    board:G.board?G.board.conf:0 };
}
function track(type,role,label) {
  if (!F.G || !F.G.club) return;
  const S=state(),G=F.G;
  S.decisions.push({ id:++S.n,type,role,label,season:G.season,week:G.week,
    at:F.absWeek(),due:F.absWeek()+3,base:snap(role),review:null });
  S.decisions=S.decisions.slice(-LIMIT);
}
function review(row) {
  const G=F.G,now=snap(row.role),base=row.base||{},role=row.role;
  if (row.season!==G.season)
    return 'The season changed before this review; weekly figures from different seasons are not comparable.';
  if (row.type==='mandate' && role==='coach') {
    const n=now.games-base.games;
    if (!n) return 'No league matches since the mandate changed; no sporting verdict yet.';
    const xgf=(now.xgf-base.xgf)/n,xga=(now.xga-base.xga)/n;
    const u=(now.played-base.played)>0?(now.youth-base.youth)/(now.played-base.played):0;
    return 'Since the mandate: '+n+' league matches, '+xgf.toFixed(2)+' xG for and '+
      xga.toFixed(2)+' against per game, '+u.toFixed(1)+' U21 starters per match. Evidence, not proof of cause.';
  }
  if (row.type==='mandate' && role==='dof')
    return 'Since the recruitment mandate: '+Math.max(0,now.reports-base.reports)+
      ' scout observations, '+Math.max(0,now.signings-base.signings)+
      ' signings. The director still owns the individual decisions.';
  if (row.type==='authority')
    return 'Since authority changed: '+Math.max(0,now.calls-base.calls)+
      ' delegated calls, '+Math.max(0,now.errors-base.errors)+
      ' recorded against the mandate.';
  if (row.type==='hire') {
    const s=G.staff[role];
    return s ? s.name+' is still in post; relationship '+Math.round(s.rel)+
      '/100, '+Math.max(0,now.calls-base.calls)+' decisions handled during this review.' :
      'The appointee is no longer in post. Review the appointment and departure.';
  }
  if (row.type==='ceo_call')
    return 'Since this call: board confidence '+Math.round(now.board)+
      ' ('+(now.board-base.board>=0?'+':'')+Math.round(now.board-base.board)+
      '), cash change '+F.money(now.cash-base.cash)+
      '. Other events also affect these figures.';
  return 'Review completed; no further measurable indicator is available.';
}
const prev=F.HOOK.seasonAfterMatch;
F.HOOK.seasonAfterMatch=ours=>{
  if (prev) prev(ours);
  const G=F.G;
  if (!G || !G.club || !G.paper || !Array.isArray(G.paper.stories)) return;
  const due=state().decisions.filter(d=>!d.review && d.due<=F.absWeek());
  for(const row of due.slice(0,2)) {
    row.review=review(row);
    G.paper.stories.push({h:'Decision follow-up',t:row.label+' — '+row.review});
  }
  for(const row of due.slice(2)) row.due=F.absWeek()+1;
};
const hire=F.hire;
F.hire=function(role,idx) {
  const s=hire(role,idx);
  if (s && ['coach','dof'].includes(role))
    track('hire',role,s.name+' appointed '+(F.ROLE[role]||{}).t);
  return s;
};
const mandate=F.setMandate;
F.setMandate=function(role,m,free) {
  const old=(F.G.mand||{})[role]||{};
  const diffs=Object.keys(m||{}).filter(k=>String(m[k])!==String(old[k]));
  const r=mandate(role,m,free);
  if ((!r || !r.err) && diffs.length && ['coach','dof'].includes(role) &&
    ['season','summer'].includes(F.G.phase)) {
    track('mandate',role,(F.ROLE[role]||{}).t+': '+
      diffs.slice(0,3).map(k=>k+' '+old[k]+' → '+m[k]).join(', '));
  }
  return r;
};
const auth=F.setAuth;
if (auth) F.setAuth=function(role,val) {
  const old=(F.authView(role)||{}).a, r=auth(role,val),next=(F.authView(role)||{}).a;
  if ((!r || !r.err) && old!==next)
    track('authority',role,(F.ROLE[role]||{}).t+': '+
      (F.AUTH[old]||{}).t+' → '+(F.AUTH[next]||{}).t);
  return r;
};
const respond=F.respond;
F.respond=function(id,idx) {
  const m=(F.G.inbox||[]).find(x=>x.id===id);
  const can=m && !m.done && IMPORTANT.has(m.ev);
  let label='';
  if (can) {
    const v=F.msgView(m);
    label=v.title+': '+((v.opts[idx]||{}).l||'CEO decision');
  }
  const r=respond(id,idx);
  if (can && r && !r.err && m.done) track('ceo_call',null,label);
  return r;
};
F.ceoCoreDelegated=function(x) {
  if (!F.G || !F.G.club || !x) return;
  const S=state(), G=F.G;
  S.delegated.push({id:x.id,season:G.season,week:G.week,role:x.role,
    who:String(x.who||'The department'),title:String(x.title||'Routine decision'),
    choice:String(x.choice||'Decision taken'),
    reason:String(x.reason||'Inside the delegated mandate'),
    outcome:String(x.outcome||'No outcome recorded'),error:!!x.error,brief:!!x.brief});
  S.delegated=S.delegated.slice(-LIMIT);
};
F.ceoCoreView=function() {
  if (!F.G) return {decisions:[],delegated:[]};
  const S=state();
  return {decisions:S.decisions.slice(-5).reverse(),delegated:S.delegated.slice(-5).reverse()};
};
})(FO);
