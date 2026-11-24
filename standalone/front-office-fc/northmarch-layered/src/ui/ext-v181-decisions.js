/* ================= UI extension, ported from Northmarch V19 =================
   V18.1: Decisions That Matter (records of choices and what changed).
   Ported verbatim: these layers wrap core functions (render, act, cmd, ...) instead of using the feature hooks.
   Do not add new behaviour here; convert to hooks module by module. */
/* Northmarch V18.1 - Decisions That Matter */
(function installV181(){
const ES=s=>esc(String(s??"")),V=(x)=>Math.round(x*10)/10;
const nf=v=>Math.round(v).toLocaleString("en-GB");
const time=()=>S.season*SEASON_WEEKS+S.week;
const deptMetric=k=>"dept:"+k;
const observedMetrics=(name,a)=>{if(a?.dept&&DEPT[a.dept])return deptMetric(a.dept);if(name==="StartProject")return"capacity";if(name==="Repair")return"dept:grounds";if(name==="SetPrice")return"att";if(name==="SetDues")return"members";if(name==="SignSponsor")return"sponsorwk";if(name==="TakeLoan"||name==="RepayLoan")return"debt";if(name==="SetSquadPolicy")return"strength";return null;};
const tracked=new Set(["SetDeptCourse","SetDeptBudget","SetDeptStaff","StartProject","StartStadium","Repair","SetSquadPolicy","SetPrice","SetDues","SignSponsor","TakeLoan","RepayLoan","IssueBond","Fundraise"]);
const originalCmd=cmd;
cmd=function(name,club,args,actor){
  const own=(actor==null||actor==="player")&&S&&club===S.my&&tracked.has(name);
  let before=null;
  if(own){
    const key=observedMetrics(name,args||{});let m=null;
    try{m=key?metric(key,club):null}catch(e){}
    before={key,value:m&&Number.isFinite(m.v)?m.v:null,cash:F(club).cash,
      spend:args?.dept?deptWeekCost(club,args.dept):null};
  }
  const result=originalCmd(name,club,args,actor);
  if(own&&result.ok){
    if(!S.v181||S.v181.club!==club)S.v181={club,records:[],next:1};
    const d=S.v181;
    d.records=Array.isArray(d.records)?d.records:[];
    const id=d.next++||1;
    const n={id,name,scope:args?.dept||null,detail:args?.key||null,s:S.season,w:S.week,clock:time(),
      label:journalText(name,args||{},club),key:before?.key||null,before:before?.value??null,
      cashBefore:before?.cash??null,spendBefore:before?.spend??null,
      cashAfter:F(club).cash,spendAfter:args?.dept?deptWeekCost(club,args.dept):null};
    if(name==="StartProject"){
      const found=G(club).projects.filter(p=>p.phase!=="done").at(-1);
      if(found)n.projectKey=found.key;
    }
    d.records.push(n);if(d.records.length>24)d.records.splice(0,d.records.length-24);
  }
  return result;
};
function records(){return S.v181?.club===S.my&&Array.isArray(S.v181.records)?S.v181.records:[]}
function currentValue(key){try{const m=key?metric(key,S.my):null;return m&&Number.isFinite(m.v)?m:null}catch(e){return null}}
function formatMetric(key,value){const m=currentValue(key);if(m&&Number.isFinite(value))return m.fmt(value);return Number.isFinite(value)?String(V(value)):"Not recorded"}
function elapsed(r){return Math.max(0,time()-(r.clock||r.s*SEASON_WEEKS+r.w))}
function recordStatus(r){
  if(r.name==="SetDeptCourse"&&r.scope){
    const d=G(S.my).depts[r.scope];return d.pending?`New approach settling in · ${d.settle} week${d.settle===1?"":"s"} left`:"Approach is active";
  }
  if(r.name==="SetDeptStaff"&&r.scope){
    const d=G(S.my).depts[r.scope];return d.hiring?`Recruiting staff · ${d.hiring.left} week${d.hiring.left===1?"":"s"} left`:"Staffing change completed";
  }
  if(r.name==="StartProject"||r.name==="StartStadium"){
    const p=r.projectKey?G(S.my).projects.find(p=>p.key===r.projectKey&&p.phase!=="done"):null;
    return p?(p.phase==="permit"?"Permit pending":`${Math.max(0,p.left)} weeks of construction left`):"Project no longer active";
  }
  if(r.name==="SetDeptBudget")return "Budget active from this week";
  if(r.name==="Repair")return "Repair applied immediately";
  return elapsed(r)?"In effect · review the measured result":"Decision recorded";
}
function recordDelta(r){
  if(!r.key||!Number.isFinite(r.before))return"An earlier performance baseline was not available.";
  const m=currentValue(r.key);
  if(!m)return"Performance data not currently available.";
  return `<b>${ES(m.label)}:</b> ${ES(formatMetric(r.key,r.before))} → ${ES(m.fmt(m.v))} <span class="v181-muted">(observed; not proof of cause)</span>`;
}
function decisionHistory(limit=4,scope=null){
 const r=records().filter(x=>!scope||x.scope===scope).slice(-limit).reverse();
 if(!r.length)return `<p class="small muted">No new decisions have been recorded in this version. Existing policies still apply.</p>`;
 return r.map(x=>`<div class="v181-decision-history">
   <span class="v181-muted">S${x.s} · W${x.w}</span>
   <b>${ES(x.label)}</b>
   <small>${ES(recordStatus(x))}</small>
   <p class="small">${recordDelta(x)}</p>
 </div>`).join("");
}
function preDecision(){
  const info=windowInfo(),wk=S.week;
  if(seasonOver())return{kind:"close",label:"Season review",heading:"Your season is finished",text:"Review the results and your club's development before next season.",act:"close",arg:"",cta:"Close season"};
  if(info.k==="open"||wk===WINTER_WEEK-1)return{kind:"window",label:"Time-sensitive",heading:wk===0?"Set your summer transfer plan":"Prepare the winter window",text:"Choose the recruitment approach and spending frame before the director acts.",act:"ctab",arg:"window",cta:"Open transfer centre"};
  const urgent=signals(S.my).find(x=>x.lv>=2);
  if(urgent)return{kind:"urgent",label:"Important club issue",heading:"Your club needs attention",text:urgent.text,act:urgent.act,arg:urgent.arg||"",cta:"Review options"};
  const worn=repairList(S.my).find(r=>r.cond<60);
  if(worn)return{kind:"repair",label:"Ground condition",heading:ES(worn.label)+" needs repair",text:`${worn.cond}% condition. An immediate repair costs £${worn.cost}k; the club can also continue without it.`,act:"ctab",arg:"ground",cta:"Review ground options"};
  const training=G(S.my).depts.training,kpi=deptKpi(S.my,"training");
  if(kpi.good===false&&!training.pending)return{kind:"training",label:"Development opportunity",heading:"Review your training direction",text:`${kpi.label}: ${kpi.text}. Consider whether to focus on development or fitness; both have different benefits.`,act:"dept",arg:"training",cta:"Review training choices"};
  return{kind:"free",label:"No urgent decision",heading:"You can play on",text:"The club runs under your existing instructions. You can still inspect departments or adjust policy when you choose.",act:"tab",arg:"club",cta:"Browse your club"};
}
const previousWeek=weekView;
weekView=function(){
  if(!S?.my)return previousWeek();
  const z=preDecision(),match=S.week?myMatches()[0]:null;
  const result=match?(match.h===S.my?match.gh:match.ga)+"–"+(match.h===S.my?match.ga:match.gh):"";
  const opponent=match?marketClubName(match.h===S.my?match.a:match.h):"";
  const recent=records().filter(r=>elapsed(r)<=SEASON_WEEKS).slice(-3).reverse();
  const recentBuild=G(S.my).projects.filter(p=>p.phase!=="done").slice(0,2);
  const lastWindow=S.v18?.club===S.my?S.v18.windows?.at(-1):null;
  const allReports=previousWeek();
  return `<section class="v181-desk">
    <header class="v181-head"><span>THE CHAIRMAN'S DESK · SEASON ${S.season} · ${S.week?"WEEK "+S.week:"PRE-SEASON"}</span><h2>Your club this week</h2><p>Review what changed, make a choice if you want to, then play on.</p></header>
    <section class="v181-result" aria-label="Football this week"><span class="v181-overline">${match?"LAST MATCH":"FOOTBALL OUTLOOK"}</span>
      ${match?`<h3>${ES(CL(S.my).name)} ${result} ${ES(opponent)}</h3><p>${match.comp==="cup"?"Cup":"League"} · ${ord(posOf(S.my))} in ${ES(TIER_NAME[C().tier])}</p><button class="tbtn" data-act="watch" data-arg="0">Match report & replay ›</button>`:`<h3>${ES(CL(S.my).name)} · ${ES(TIER_NAME[C().tier])}</h3><p>Season ${S.season} · ${S.week?"League position "+ord(posOf(S.my)):"Pre-season preparations"}</p>`}
    </section>
    <section class="v181-spotlight"><div class="v181-overline">${ES(z.label)}</div><h3>${ES(z.heading)}</h3><p>${ES(z.text)}</p><div class="v181-buttons"><button class="btn" data-act="${ES(z.act)}" data-arg="${ES(z.arg)}">${ES(z.cta)}</button><button class="btn ghost" data-act="v181skip">Not this week</button></div><p class="v181-hint">Review is optional. Playing the next week is never locked by this suggestion.</p></section>
    <section class="v181-tracker"><div class="v181-section-title"><h3>Decisions & developments</h3><button class="tbtn" data-act="v181history">Review decisions ›</button></div>
      ${recent.length?recent.map(r=>`<div class="v181-tracker-row"><div><b>${ES(r.label)}</b><small>${ES(recordStatus(r))}</small></div><span>S${r.s} W${r.w}</span></div>`).join(""):'<p class="small muted">No new board decisions yet. Your existing policies continue to apply.</p>'}
      ${recentBuild.map(b=>`<div class="v181-tracker-row"><div><b>${ES(b.label)}</b><small>${b.phase==="permit"?"Waiting for permit":`${b.left} weeks of construction left`}</small></div><span>Building</span></div>`).join("")}
      ${lastWindow&&lastWindow.s===S.season&&((lastWindow.kind||lastWindow.phase)==="summer"&&S.week<=2||(lastWindow.kind||lastWindow.phase)==="winter"&&S.week<=WINTER_WEEK+1)?`<div class="v181-tracker-row"><div><b>${lastWindow.kind||lastWindow.phase} transfer window completed</b><small>Results are recorded in the Transfer Centre</small></div><button class="tbtn" data-act="ctab" data-arg="window">View ›</button></div>`:""}
    </section>
    <details class="v181-more"><summary>Full reports: match, scouting, club, league & finances</summary><div class="v181-all-reports">${allReports}</div></details>
  </section>`;
};
const originalDeptSheet=deptSheet;
deptSheet=function(k){
  if(UI.v181DeptFull===k)return originalDeptSheet(k).replace(`<p class="muted">${esc(DEPT[k].does)}</p>`,`<button class="btn ghost" data-act="v181deptback">← Back to decisions</button><p class="muted">${esc(DEPT[k].does)}</p>`);
  const id=S.my,d=G(id).depts[k],D=DEPT[k],kp=deptKpi(id,k);
  const base=metric(deptMetric(k),id);
  const opt=D.courses.map(c=>`<button class="v181-choice ${(d.pending||d.course)===c?"is-selected":""}" data-act="gcourse" data-arg="${k}:${c}" aria-pressed="${(d.pending||d.course)===c}">
     <b>${ES(c[0].toUpperCase()+c.slice(1))}</b><span>${ES(D.cd[c])}</span><small>${d.pending===c?"Transition in progress":d.course===c&&!d.pending?"Current approach":"Choose this direction"}</small>
  </button>`).join("");
  const budgets=Object.keys(BUDGET_F).map(b=>`<button class="v181-budget ${d.budget===b?"is-selected":""}" data-act="gdept" data-arg="${k}:${b}" aria-pressed="${d.budget===b}">
    <b>${ES(b[0].toUpperCase()+b.slice(1))}</b><span>£${nf(deptWeekCost(id,k,null,b)*1000)} / wk</span>
  </button>`).join("");
  return overlayShell(D.n,`<section class="v181-dept-head"><span class="v181-overline">CLUB · DEPARTMENT DECISION</span><h3>What should ${ES(D.n.toLowerCase())} focus on?</h3><p>${ES(D.does)}</p></section>
   <section class="v181-measure"><span>Current measure</span><b>${ES(kp.label)}</b><strong>${ES(kp.text)}</strong><small>Compared against the club's division where data is available.</small></section>
   <section class="v181-dept-block"><h3>1. Choose a direction</h3><p class="small muted">One main priority. The department cannot receive both bonuses at once.</p><div class="v181-choice-grid">${opt}</div>
     ${d.pending?`<p class="v181-status">New way of working: ${ES(d.pending)} · ${d.settle} weeks until it settles.</p>`:`<p class="v181-status">Current approach: ${ES(d.course)}.</p>`}
     <p class="small muted">Changing the way of working has no direct fee, but normally takes 30 weeks to settle. Until then neither approach gets its bonus.</p></section>
   <section class="v181-dept-block"><h3>2. Choose the budget</h3><p class="small muted">This changes weekly operating costs immediately. A higher budget may improve results but increases spending.</p><div class="v181-budget-grid">${budgets}</div></section>
   <section class="v181-dept-block"><h3>3. Follow the result</h3>${decisionHistory(2,k)}<p class="small muted">Outcomes are compared with the measures recorded when decisions were made. Other changes in the world can also affect the results.</p></section>
   <section class="v181-dept-block"><h3>More information and controls</h3><p class="small muted">${d.staff}/5 staff · ${ES(STAFF_WORD[d.staff])}. Staffing, facilities, pipeline reports and advanced controls are unchanged.</p>
   <button class="btn ghost" data-act="v181deptfull" data-arg="${ES(k)}">Open full department report ›</button></section>`);
};
const originalClubView=clubView;
function groundChoicePanel(){
 const id=S.my,sg=groundSignals(id),worst=groundCondWorst(id),rep=repairList(id).slice(0,3),run=G(id).projects.filter(x=>x.phase!=="done"),cat=projectCatalog(id).filter(x=>!x.busy);
 const example=cat.find(x=>x.group==="Pitch"||x.group==="Stadium")||cat[0];
 return `<section class="v181-ground"><span class="v181-overline">CLUB · FACILITIES DECISION</span><h2>Protect or improve your ground?</h2>
   <div class="v181-ground-stats"><div><small>Licensed capacity</small><strong>${nf(sg.capacity)}</strong></div><div><small>Most worn part</small><strong>${ES(worst?.n||"—")}</strong><span>${worst?Math.round(worst.c)+"% condition":"No condition recorded"}</span></div></div>
   <p class="small muted">Repairs restore condition immediately. Construction takes time, costs money and can increase capacity or facility quality.</p>
   <h3>Option A — Repair what is wearing out</h3>
   ${rep.length?rep.map(x=>`<div class="v181-fac-option"><div><b>${ES(x.label)}</b><small>${Math.round(x.cond)}% condition · Repair cost £${x.cost}k</small></div><button class="btn ghost" data-act="v181repairchoose" data-arg="${ES(x.key)}">Review repair</button></div>`).join(""):'<p class="small muted">No repairs are needed right now.</p>'}
   ${UI.v181Repair?(()=>{const r=rep.find(x=>x.key===UI.v181Repair);return r?`<div class="v181-confirm"><b>Repair ${ES(r.label)} for £${r.cost}k?</b><p>Restores the affected structure to 100% condition immediately. The bank balance is charged by the existing rules.</p>
      <button class="btn" data-act="grepair" data-arg="${ES(r.key)}">Confirm repair</button> <button class="btn ghost" data-act="v181repairchoose">Cancel</button></div>`:""})():""}
   <h3>Option B — Improve the facilities</h3>
   ${example?`<div class="v181-fac-option"><div><b>${ES(example.label)}</b><small>£${example.cost}k · ${example.weeks} weeks${example.permit?" plus a permit":""} · ${ES(example.effect)}</small></div><button class="btn ghost" data-act="v181project" data-arg="${ES(example.key)}">Review build</button></div>`:'<p class="small muted">No new project is currently available.</p>'}
   <div class="v181-ground-cta"><button class="btn ghost" data-act="gtab" data-arg="build">All building options</button><button class="btn ghost" data-act="gtab" data-arg="repairs">All repairs</button></div>
   <h3>What is already in progress?</h3>${run.length?run.map(x=>`<p class="small"><b>${ES(x.label)}</b> — ${x.phase==="permit"?"Waiting for permit":`${x.left} weeks remaining`}</p>`).join(""):'<p class="small muted">No current construction.</p>'}
   <h3>Decision outcomes</h3>${records().filter(x=>["StartProject","Repair","StartStadium"].includes(x.name)).length?records().filter(x=>["StartProject","Repair","StartStadium"].includes(x.name)).slice(-3).reverse().map(x=>`<p class="small"><b>${ES(x.label)}</b> · ${ES(recordStatus(x))}</p>`).join(""):'<p class="small muted">New building and repair decisions will appear in the decision tracker.</p>'}
 </section>`;
}
clubView=function(){
  const existing=originalClubView();
  if(UI.ct==="ground"&&UI.gt==="stadium")return `<div class="v181-ground-outer">${groundChoicePanel()}</div>`+existing;
  return existing;
};
const origReview=reviewView;
reviewView=function(){
  const original=origReview();
  const ds=records().filter(x=>x.s===S.season-1).slice(-4);
  if(!ds.length)return original;
  const panel=`<section class="panel v181-season-decisions"><p class="eyebrow">Chairman's decisions this season</p>${ds.map(x=>`<p class="small"><b>${ES(x.label)}</b> — ${recordDelta(x)}</p>`).join("")}<p class="small muted">Results are observed measurements, not proof that one decision caused them.</p></section>`;
  return original.replace(/<\/main>\s*$/,panel+"</main>");
};
const origAct=act;
act=function(a,arg){
  if(a==="v181deptfull"){UI.v181DeptFull=arg;render();return}
  if(a==="v181deptback"){UI.v181DeptFull=null;render();return}
  if(a==="v181repairchoose"){UI.v181Repair=arg||null;render();return}
  if(a==="v181project"){UI.gt="build";UI.gsel=arg;render();return}
  if(a==="v181history"){UI.over="v181history";render();return}
  if(a==="v181skip"){
    UI.v181Skipped=(S.season+":"+S.week);
    render();return;
  }
  if(a==="dept"){UI.v181DeptFull=null}
  if(a==="grepair"){UI.v181Repair=null}
  return origAct(a,arg);
};
const origOverlay=overlayView;
overlayView=function(){
  if(UI.over==="v181history")return overlayShell("Decisions and results",`<p class="small muted">Real board instructions and observed changes. Not every change can be attributed to a single decision.</p>${decisionHistory(24)}`);
  return origOverlay();
};
// Suppression is per week; it does not alter club policy or simulation.
const withSkip=weekView;
weekView=function(){
  const body=withSkip();
  if(UI.v181Skipped!==S.season+":"+S.week)return body;
  return body.replace(/<section class="v181-spotlight">[\s\S]*?<\/section>/,`<section class="v181-spotlight is-quiet"><span class="v181-overline">YOUR CHOICE</span><h3>Nothing to decide right now</h3><p>Play the next week or open Club to manage any department.</p><button class="btn ghost" data-act="tab" data-arg="club">Manage your club</button></section>`);
};
})();
