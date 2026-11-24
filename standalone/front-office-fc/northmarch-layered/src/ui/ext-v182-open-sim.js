/* ================= UI extension, ported from Northmarch V19 =================
   V18.2: open simulation (dismissals, former clubs) and V18.2 UX polish.
   Ported verbatim: these layers wrap core functions (render, act, cmd, ...) instead of using the feature hooks.
   Do not add new behaviour here; convert to hooks module by module. */
/* Northmarch V18.2 open simulation */
(function installV182(){
 const E=s=>esc(String(s??""));
 const present=()=>!!(S&&S.my!=null&&S.phase==="season");
 const currentDismissals=()=>S?.v182?.club===S?.my&&Array.isArray(S.v182.hidden)?S.v182.hidden:[];
 const muted=key=>currentDismissals().some(x=>x.key===key&&x.season===S.season);
 const typeKey=(s)=>{
  const t=String(s.text||"").toLowerCase();
  if(t.includes("forecast"))return"cashForecast";
  if(t.includes("confidence"))return"memberConfidence";
  if(t.includes("sponsor"))return"sponsor";
  if(t.includes("caretaker"))return"caretaker:"+s.arg;
  if(t.includes("contract"))return"contracts:"+s.act;
  if(t.includes("leave"))return"playersLeaving";
  if(t.includes("repair")||t.includes("inspectors"))return"groundCondition";
  if(t.includes("budget")||t.includes("wage"))return"budget";
  return"s:"+String(s.act||"")+":"+String(s.arg||"")+":"+t.replace(/\d+/g,"#").slice(0,35);
 };
 function feed(){
  if(!present())return [];
  const id=S.my,out=[];
  const add=x=>{if(!out.some(y=>y.key===x.key))out.push(x)};
  if(S.week===0)add({key:"summer:"+S.season,severity:1,category:"Calendar",headline:"Summer recruitment",detail:"The director acts under your existing budget and recruitment policy when you play week 1. You may change those settings, but you do not have to.",act:"ctab",arg:"window",cta:"Inspect transfers"});
  else if(S.week===WINTER_WEEK-1)add({key:"winter:"+S.season,severity:1,category:"Calendar",headline:"Winter transfer window next week",detail:"The winter market opens on the existing calendar; the director will act under the current policy.",act:"ctab",arg:"window",cta:"Inspect transfers"});
  if(seasonOver())add({key:"end:"+S.season,severity:1,category:"Calendar",headline:"Season finished",detail:"The season has ended. The next season begins through the normal season-review process.",act:"tab",arg:"table",cta:"See table"});
  for(const x of signals(id)){
   add({key:typeKey(x),severity:x.lv>=3?4:x.lv>=2?3:1,category:x.lv>=3?"Urgent":x.lv>=2?"Attention":"Information",
     headline:x.lv>=2?"Club issue":"Club update",detail:String(x.text),act:x.act||"tab",arg:x.arg||"club",cta:"View details"});
  }
  const repair=repairList(id).find(r=>r.cond<60);
  if(repair)add({key:"groundCondition",severity:repair.cond<30?4:2,category:"Opportunity",headline:"Ground condition",detail:`${repair.label} is at ${Math.round(repair.cond)}%; repairs are available but not mandatory.`,act:"ctab",arg:"ground",cta:"Inspect facilities"});
  if(S.week>=8){
    const d=deptKpi(id,"training");
    if(d.good===false)add({key:"trainingReview",severity:2,category:"Opportunity",headline:"Training performance",detail:`${d.label}: ${d.text}. Inspect the department if you want to adjust its direction.`,act:"dept",arg:"training",cta:"Open training"});
  }
  const projects=G(id).projects.filter(x=>x.phase!=="done");
  if(projects.length)add({key:"construction",severity:0,category:"In progress",headline:"Construction is under way",detail:`${projects.length} active building project${projects.length===1?"":"s"}.`,act:"ctab",arg:"ground",cta:"View projects"});
  return out.sort((a,b)=>b.severity-a.severity||a.key.localeCompare(b.key));
 }
 const rec=()=>S?.v181?.club===S?.my&&Array.isArray(S.v181.records)?S.v181.records:[];
 function slot(r){
  if(r.name==="SetSquadPolicy"){
   const t=String(r.label||"").toLowerCase();
   return"policy:"+(t.includes("club course")?"club":t.includes("recruit")?"recruit":t.includes("transfer money")?"spend":t.includes("wage")?"wage":t.includes("loan")?"loans":"other");
  }
  return r.name+":"+(r.scope||r.detail||"");
 }
 const superseded=r=>rec().some(x=>x.id>r.id&&slot(x)===slot(r));
 function status(r){
  if(superseded(r))return"Replaced by a later decision";
  if(r.scope&&G(S.my).depts[r.scope]){
    const d=G(S.my).depts[r.scope];
    if(r.name==="SetDeptCourse")return d.pending?`Changing direction · ${d.settle} weeks left`:"Current approach in effect";
    if(r.name==="SetDeptStaff")return d.hiring?`Recruiting · ${d.hiring.left} weeks left`:"Staffing instruction applied";
    if(r.name==="SetDeptBudget")return"Current operating budget: "+d.budget;
  }
  if(r.name==="StartProject"||r.name==="StartStadium"){
    const active=G(S.my).projects.find(x=>x.phase!=="done"&&(!r.projectKey||r.projectKey===x.key));
    return active?active.phase==="permit"?"Permit pending":`${active.left} weeks of construction remaining`:"Project no longer active";
  }
  if(r.name==="Repair")return"Repair completed";
  return"Instruction recorded";
 }
 function result(r){
  if(!r.key||!Number.isFinite(r.before))return"An earlier comparable measurement was not recorded.";
  let m;try{m=metric(r.key,S.my)}catch(e){return"Current measurement is unavailable."}
  if(!m||!Number.isFinite(m.v))return"Current measurement is unavailable.";
  const weeks=Math.max(0,(S.season-r.s)*SEASON_WEEKS+S.week-r.w);
  return weeks===0?`${m.label}: ${m.fmt(r.before)} at the moment of the decision.`:
   `${m.label}: ${m.fmt(r.before)} → ${m.fmt(m.v)} after ${weeks} week${weeks===1?"":"s"} (observed, not proof of cause).`;
 }
 function history(limit=24,scope=null){
  const all=rec().filter(x=>!scope||x.scope===scope).slice(-limit).reverse();
  return all.length?all.map(x=>`<div class="v182-history"><small>Season ${x.s} · Week ${x.w}</small><b>${E(x.label)}</b>
    <span>${E(status(x))}</span><p>${E(result(x))}</p>
    ${x.name==="SetDeptBudget"&&Number.isFinite(x.spendBefore)&&Number.isFinite(x.spendAfter)?
    `<small>Department cost at decision: £${Math.round(1000*x.spendBefore).toLocaleString("en-GB")} → £${Math.round(1000*x.spendAfter).toLocaleString("en-GB")} per week</small>`:""}</div>`).join(""):
   '<p class="small muted">No new decisions recorded here. Existing instructions remain active.</p>';
 }
 const oldWeek=weekView,oldDept=deptSheet,oldOverlay=overlayView,oldAct=act;
 weekView=function(){
  if(!present())return oldWeek();
  const id=S.my,all=feed(),spot=all.find(x=>x.severity>0&&!muted(x.key)),m=S.week?myMatches()[0]||null:null;
  const game=m?`<h3>${E(CL(m.h).name)} ${m.gh}–${m.ga} ${E(CL(m.a).name)}</h3><p>${m.comp==="cup"?"Cup":"League"} · ${E(CL(id).name)} ${ord(posOf(id))} in ${E(TIER_NAME[CL(id).tier])}</p>
   <button class="tbtn" data-act="watch" data-arg="0">Watch match ›</button>`:
   `<h3>${E(CL(id).name)}</h3><p>Season ${S.season} · ${S.week?"Week "+S.week:"Pre-season"} · ${E(TIER_NAME[CL(id).tier])}</p>`;
  const changes=rec().slice(-3).reverse(),building=G(id).projects.filter(x=>x.phase!=="done").slice(0,2);
  const win=S.v18?.club===id?S.v18.windows?.at(-1):null;
  // All original reports are still independently accessible, with no artificial tasks added.
  const reports=`${UI.playNote?`<div class="panel"><p class="small">${E(UI.playNote)}</p></div>`:""}
   ${chairmanBriefingView()}${reportView()}${europeanResultPanel()}${urgentPanel()}${featurePanel("week:recruitmentAlerts")}
   ${clubWeekPanel()}${windowPanel()}${previewView()}${resultsPanel()}${worldNewsPanel(5)}${lookPanel()}${targetsPanel()}`;
  return `<section class="v182-desk"><header class="v182-hero"><span class="v182-kicker">THE CHAIRMAN'S DESK · SEASON ${S.season}, ${S.week?"WEEK "+S.week:"PRE-SEASON"}</span>
   <h2>Your club this week</h2><p>The world continues whether you intervene or not. Every department remains yours to manage.</p></header>
   <section class="v182-card"><span class="v182-kicker">FOOTBALL</span>${game}<div class="v182-links">
     <button class="tbtn" data-act="tab" data-arg="table">League table ›</button><button class="tbtn" data-act="tab" data-arg="squad">View squad ›</button></div></section>
   <section class="v182-card"><div class="v182-headrow"><h3>Club situation</h3><small>${all.length} current signals</small></div>
     ${spot?`<div class="v182-focus"><span class="v182-kicker">${E(spot.category)}</span><h3>${E(spot.headline)}</h3><p>${E(spot.detail)}</p>
     <div class="v182-links"><button class="btn ghost" data-act="${E(spot.act)}" data-arg="${E(spot.arg)}">${E(spot.cta)} ›</button>
     <button class="tbtn" data-act="v182mute" data-arg="${E(spot.key)}">Hide this suggestion</button></div></div>`:
     `<div class="v182-free"><b>Nothing requires a decision</b><p>Play on, or open any department to make your own changes.</p><button class="tbtn" data-act="tab" data-arg="club">Manage club ›</button></div>`}
     <details><summary>All club situations (${all.length})</summary>
       ${all.length?all.map(x=>`<div class="v182-signals"><b>${E(x.headline)}</b><span>${E(x.category)}${muted(x.key)?" · hidden from suggestions":""}</span>
       <p>${E(x.detail)}</p><button class="tbtn" data-act="${E(x.act)}" data-arg="${E(x.arg)}">${E(x.cta)} ›</button></div>`).join(""):'<p class="small muted">No additional issues or opportunities recorded.</p>'}
     </details></section>
   <section class="v182-card"><div class="v182-headrow"><h3>Your club in motion</h3><button class="tbtn" data-act="v182history">Decision history ›</button></div>
      ${changes.length?changes.map(x=>`<div class="v182-progress"><div><b>${E(x.label)}</b><small>${E(status(x))}</small></div><span>S${x.s} W${x.w}</span></div>`).join(""):'<p class="small muted">No new board decisions. The club keeps operating under its existing rules.</p>'}
      ${building.map(x=>`<div class="v182-progress"><div><b>${E(x.label)}</b><small>${x.phase==="permit"?"Permit pending":x.left+" weeks to finish"}</small></div><span>Project</span></div>`).join("")}
      ${win&&win.s===S.season?`<div class="v182-progress"><div><b>${E(win.kind||win.phase)} transfer window</b><small>Completed; results are available</small></div><button class="tbtn" data-act="ctab" data-arg="window">See results ›</button></div>`:""}
      <button class="tbtn" data-act="ctab" data-arg="development">View long-term club development ›</button>
    </section>
    <div class="v182-next"><h3>Play the next week whenever you choose</h3><p>The normal Play button stays available. No recommended action blocks time.</p></div>
    <details class="v182-reports"><summary>Full reports · match, scouting, club and league</summary>${reports}</details>
   </section>`;
 };
 deptSheet=function(k){
  let out=oldDept(k);
  if(UI.v181DeptFull===k)return out;
  if(!out.includes('<h3>3. Follow the result</h3>'))return out;
  return out.replace(/<section class="v181-dept-block"><h3>3\. Follow the result<\/h3>[\s\S]*?<\/section>/,
     `<section class="v181-dept-block"><h3>3. Follow the result</h3><p class="small muted">You can change strategy again whenever the rules allow. Earlier choices remain in the history.</p>${history(6,k)}
        <p class="small muted">These measurements are observations, not proof that one decision caused a change.</p></section>`);
 };
 overlayView=function(){
  if(UI.over==="v182history")return overlayShell("Decisions and consequences",`<p class="small muted">Decisions are not quests. Your recent actions, superseded instructions and measured results appear here.</p>${history()}`);
  return oldOverlay();
 };
 act=function(name,arg){
  if(name==="v182mute"){
    const s=feed().find(x=>x.key===arg);
    if(s){
      if(!S.v182||S.v182.club!==S.my)S.v182={club:S.my,hidden:[]};
      S.v182.hidden=S.v182.hidden.filter(x=>x.key!==arg);
      S.v182.hidden.push({key:arg,season:S.season,w:S.week});
      if(S.v182.hidden.length>50)S.v182.hidden=S.v182.hidden.slice(-50);
      save();render();
    }return;
  }
  if(name==="v182history"){UI.over="v182history";render();return}
  return oldAct(name,arg);
 };
})();

/* V18.2 UX polish: urgent visibility and unnumbered department decisions */
(function polish(){
 const oldWeek=weekView,oldDept=deptSheet;
 deptSheet=function(k){const html=oldDept(k);return html
  .replace("<h3>1. Choose a direction</h3>","<h3>Choose a direction</h3>")
  .replace("<h3>2. Choose the budget</h3>","<h3>Adjust the budget</h3>")
  .replace("<h3>3. Follow the result</h3>","<h3>Decisions and results</h3>");};
 weekView=function(){
  const html=oldWeek();
  if(!S||S.my==null||S.phase!=="season"||!html.includes('All club situations'))return html;
  const urgent=signals(S.my).filter(x=>x.lv>=3);
  if(!urgent.length)return html;
  const warnings=`<div class="v182-urgent-summary"><strong>Important risks remain active</strong>
    ${urgent.map(x=>`<div class="v182-urgent-item"><span>${esc(String(x.text))}</span><button class="tbtn" data-act="${esc(String(x.act||'tab'))}" data-arg="${esc(String(x.arg||'club'))}">Review ›</button></div>`).join("")}
    <p class="small muted">A risk remains visible even after you hide its suggestion. No action is mandatory.</p></div>`;
  return html.replace("<details><summary>All club situations",warnings+"<details><summary>All club situations");
 };
})();
