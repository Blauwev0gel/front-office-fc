/* ================= UI extension, ported from Northmarch V19 =================
   V17: chairman journey (self-contained L1/L2 extension).
   Ported verbatim: these layers wrap core functions (render, act, cmd, ...) instead of using the feature hooks.
   Do not add new behaviour here; convert to hooks module by module. */
/* NORTHMARCH V17 — self-contained L1/L2 development extension */
(function installV17(){
  // L1/L2 extension: read from existing simulation, do not create new economy or clock.
  const originFor=id=>S?.v17&&S.v17.club===id?S.v17.start:null;
  const journeyPush=(kind,label,s=S.season,w=S.week)=>{
    if(!S?.v17||!S.my||S.v17.club!==S.my)return;
    const J=S.v17.journey||(S.v17.journey=[]);
    if(J.some(x=>x.kind===kind&&x.s===s&&x.w===w&&x.label===label))return;
    J.push({kind,label:String(label||"").slice(0,180),s,w});
    if(J.length>30)J.splice(0,J.length-30);
  };
  const oldChoose=chooseClub;
  chooseClub=function(id){
    const okay=oldChoose(id);
    if(okay){
      S.v17={club:id,from:S.season,start:devSnap(id),journey:[]};
      journeyPush("Appointment","You became chairman of "+CL(id).name);
    }
    return okay;
  };
  const oldDeserialize=deserialize;
  deserialize=function(t){
    const obj=oldDeserialize(t);
    if(obj.v17){obj.v17.journey=Array.isArray(obj.v17.journey)?obj.v17.journey.slice(-30):[];}
    return obj;
  };
  const oldEmit=emit;
  emit=function(type,club,text,data){
    const e=oldEmit(type,club,text,data);
    if(S?.v17&&club===S.my&&S.v17.club===club){
      if(["ProjectCompleted","YouthIntake","Promotion","Relegation","CupWin","CupWinner","StadiumCompleted","Record"].includes(type)){
        journeyPush(type,text||type,e.s,e.w);
      }
    }
    return e;
  };
  const oldClose=closeSeason;
  closeSeason=function(){
    const id=S?.my,season=S?.season;
    const r=oldClose();
    if(r&&id&&S.v17?.club===id){
      const latest=(S.dev||[]).at(-1);
      if(latest?.s===season){
        // S.my can change after the AGM; preserve history for the club that was actually managed.
        const J=S.v17.journey||(S.v17.journey=[]);
        J.push({kind:"Season",label:`Season ${season}: ${latest.pos} place in ${TIER_NAME[latest.tier]}, squad strength ${latest.str.toFixed(1)}, £${latest.cash}k cash.`,s:season,w:SEASON_WEEKS});
        if(J.length>30)J.splice(0,J.length-30);
      }
    }
    return r;
  };
  const money=v=>(v<0?"−":"")+"£"+Math.abs(Math.round(v)).toLocaleString("en-GB")+"k";
  const pound=v=>"£"+Math.round(v).toLocaleString("en-GB");
  const delta=(curr,base)=>base==null?"—":(curr-base>0?"+":"")+(Math.round((curr-base)*10)/10).toLocaleString("en-GB");
  const cap=(v)=>Math.round(v).toLocaleString("en-GB");
  function v17MetricCards(id){
    const current=devSnap(id),start=originFor(id);
    const previous=(S.dev||[]).filter(x=>x.s<S.season && (!S.v17 || x.s>=S.v17.from)).at(-1)||null;
    const metrics=[
      ["Squad strength","str",v=>v.toFixed(1)],
      ["Stadium capacity","cap",cap],
      ["Members","members",cap],
      ["Cash","cash",money],
      ["Weekly wages","wages",pound],
      ["Reputation","rep",v=>String(v)]
    ];
    return `<div class="v17-stat-grid">${metrics.map(([label,key,fmt])=>{
      const val=current[key],base=start?.[key],prior=previous?.[key];
      return `<div class="v17-stat"><span>${label}</span><strong>${fmt(val)}</strong><small>At takeover: ${base==null?"Not recorded":fmt(base)}</small><small>Last season: ${prior==null?"—":fmt(prior)}</small></div>`;
    }).join("")}</div>`;
  }
  function v17StadiumGraphic(id){
    const sides=G(id).sides,projs=G(id).projects.filter(p=>p.phase!=="done");
    const loc={N:[97,10,166,33],S:[97,190,166,33],W:[23,55,60,122],E:[277,55,60,122]};
    const labels={N:"NORTH END",S:"SOUTH END",W:"MAIN STAND",E:"EAST STAND"};
    const stands=Object.entries(loc).map(([k,[x,y,w,h]])=>{
      const s=sides[k],rows=Math.min(7,Math.max(1,s.rings));
      const vertical=k==="E"||k==="W",maint=s.cond<40?"#985951":s.cond<65?"#9b8b67":"#7499af";
      const lines=Array.from({length:rows},(_,i)=>{
        const px=vertical?x+9+(i+1)*(w-18)/(rows+1):x+10;
        const py=vertical?y+10:y+8+(i+1)*(h-16)/(rows+1);
        return vertical?`<path d="M${px} ${y+9} V${y+h-9}" />`:`<path d="M${x+9} ${py} H${x+w-9}" />`;
      }).join("");
      const active=projs.some(p=>p.target==="side:"+k||p.key?.startsWith("side:"+k+":"));
      return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${maint}" stroke="${active?"#ffc773":"#d8e0e8"}" stroke-width="${active?3:1.2}"/><g stroke="#dbe6ed" stroke-width="2" opacity=".85">${lines}</g><text x="${x+w/2}" y="${vertical?y+h/2:y+h/2+3}" fill="#0e2738" text-anchor="middle" font-size="${vertical?9:9}" font-weight="700">${labels[k]}</text><text x="${x+w/2}" y="${vertical?y+h/2+13:y+h/2+14}" fill="#19394d" text-anchor="middle" font-size="9">${s.rings} ring${s.rings===1?"":"s"} · ${s.cond}%</text></g>`;
    }).join("");
    return `<svg class="v17-stadium" viewBox="0 0 360 234" role="img" aria-label="Stadium plan showing the four actual stands, rings and condition"><rect width="360" height="234" rx="11" fill="#182b35"/><rect x="93" y="48" width="174" height="137" rx="2" fill="#307e51"/><path d="M180 48 V185 M93 116.5 H267" stroke="#e6f2e8" stroke-width="1.6"/><circle cx="180" cy="116.5" r="23" stroke="#e6f2e8" fill="none" stroke-width="1.6"/><rect x="94" y="80" width="20" height="70" stroke="#e6f2e8" fill="none"/><rect x="246" y="80" width="20" height="70" stroke="#e6f2e8" fill="none"/>${stands}</svg>`;
  }
  function v17Projects(id){
    const active=G(id).projects.filter(p=>p.phase!=="done");
    if(!active.length)return `<p class="small muted">No building work in progress. Explore facilities to plan the next improvement.</p>`;
    return active.map(p=>{
      const total=Math.max(1,(p.weeks||1)+(p.delay||0)),left=Math.max(0,p.left||0),pct=p.phase==="permit"?0:Math.min(100,Math.round((total-left)/total*100));
      return `<div class="v17-project"><div class="row"><b>${esc(p.label)}</b><span class="small">${p.phase==="permit"?"Awaiting permission":left+" weeks left"}</span></div><div class="v17-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div><p class="small muted">£${Math.round(p.paid||0)}k paid so far · ${p.phase==="permit"?"Construction has not started":pct+"% of planned construction time elapsed"}</p></div>`;
    }).join("");
  }
  function v17Journey(id){
    const data=S.v17?.club===id?S.v17.journey:[];
    const history=(S.dev||[]).filter(x=>x.s>= (S.v17?.from||0)).slice(-12).reverse();
    let rows=data.slice(-14).reverse().map(j=>`<div class="v17-event"><span class="small muted">S${j.s} · W${j.w}</span><b>${esc(j.label)}</b></div>`).join("");
    if(!rows&&history.length)rows=history.map(x=>`<div class="v17-event"><span class="small muted">Season ${x.s}</span><b>${ord(x.pos)} · ${TIER_NAME[x.tier]} · ${x.str.toFixed(1)} squad strength</b></div>`).join("");
    if(!rows)rows='<p class="small muted">Your journey starts with the club you took over. Major results and project completions will appear here.</p>';
    return rows;
  }
  function v17DevelopmentView(){
    const id=S.my,origin=originFor(id),d=devSnap(id);
    return `<section class="v17-development">
      <div class="v17-heading"><p class="eyebrow">Club development · Northmarch V18</p><h2>${esc(CL(id).name)}: your club's journey</h2><p class="small muted">The same club, changing over seasons. These are recorded results, not experience points.</p></div>
      ${origin?`<p class="v17-origin">Your starting point was season ${S.v17.from}. Compare the club you inherited with what you manage now.</p>`:`<p class="v17-origin">This is an older save. We cannot reliably reconstruct your takeover measurements; new milestones are recorded going forward.</p>`}
      <section class="panel"><p class="eyebrow">Then → now</p>${v17MetricCards(id)}</section>
      <section class="panel"><div class="row"><p class="eyebrow">Your ground</p><b>${cap(groundSignals(id).capacity)} places</b></div>${v17StadiumGraphic(id)}<div class="v17-stands">${Object.entries(G(id).sides).map(([k,s])=>`<span>${k}: ${s.rings} rings · ${s.cond}% condition</span>`).join("")}</div><button class="btn ghost" data-act="ctab" data-arg="ground">Manage the ground</button></section>
      <section class="panel"><p class="eyebrow">Projects under way</p>${v17Projects(id)}</section>
      <section class="panel"><p class="eyebrow">What happened to your club?</p><div class="v17-timeline">${v17Journey(id)}</div><button class="btn ghost" data-act="history">Full historical records</button></section>
      <div class="v17-next"><b>Where next?</b><p class="small">Set the recruitment direction, develop your facilities or protect your finances. Your choices affect the simulation; no artificial growth bonuses are awarded.</p><div class="v17-actions"><button class="btn ghost" data-act="ctab" data-arg="football">Football planning</button><button class="btn ghost" data-act="tobudget">Financial framework</button></div></div>
    </section>`;
  }
  function v17WeekProgress(){
    if(!S?.my)return"";
    const id=S.my,ev=eventsFor(id,{s:S.season,w:S.week})
      .filter(e=>["ProjectCompleted","YouthIntake","Signing","Transfer","Record"].includes(e.t)).slice(-3);
    const works=G(id).projects.filter(p=>p.phase!=="done").slice(0,2);
    const items=[...ev.map(e=>`<p class="small"><b>${esc(e.t.replace(/([a-z])([A-Z])/g,"$1 $2"))}:</b> ${esc(e.text)}</p>`),...works.map(p=>`<p class="small">Building: <b>${esc(p.label)}</b> — ${p.phase==="permit"?"waiting for permission":Math.max(0,p.left)+" weeks left"}</p>`)];
    return `<section class="panel v17-week"><div class="row"><p class="eyebrow">Club development</p><button class="tbtn" data-act="ctab" data-arg="development">Your club's journey ›</button></div>${items.length?items.join(""):'<p class="small muted">Your long-term investments, finances and squad development continue between matches.</p>'}</section>`;
  }
  const oldWeekView=weekView;
  weekView=function(){return oldWeekView()+v17WeekProgress()};
  const oldReviewView=reviewView;
  reviewView=function(){
    const html=oldReviewView();
    const hist=S.dev||[],last=hist.at(-1),prev=hist.length>1?hist.at(-2):originFor(S.my);
    const id=S.my||S.v17?.club;
    if(!last||!id)return html;
    const diff=(key)=>prev?.[key]==null?"No previous measure":delta(last[key],prev[key]);
    const panel=`<section class="panel v17-season"><p class="eyebrow">Club development · season ${last.s}</p><p class="small">Compared with the last recorded reference, your club's squad strength changed by ${diff("str")}, capacity by ${diff("cap")} and membership by ${diff("members")}. Cash changed by ${diff("cash")} thousand pounds.</p><p class="small muted">Several factors can affect these figures. This records change, not proof that any single decision caused it.</p></section>`;
    return html.replace(/<\/main>\s*$/,panel+"</main>");
  };
  const oldClubHub=clubHub;
  clubHub=function(){
    const id=S.my,pre=S.week===0||S.week===WINTER_WEEK-1,which=S.week===0?"summer":S.week===WINTER_WEEK-1?"winter":"next";
    return `<section class="v17-clubhub"><div class="v17-heading"><p class="eyebrow">The chairman's office · V17</p><h2>Run ${esc(CL(id).name)}</h2><p class="small muted">Choose a responsibility. Your decisions influence the weeks and seasons that follow.</p></div>
      ${pre?`<div class="v17-priority"><p class="eyebrow">${which==="summer"?"Summer transfer window": "Winter transfer window"}</p><h3>Decide your recruitment approach</h3><p class="small">Review the squad plan and financial limits before your director acts.</p><button class="btn" data-act="ctab" data-arg="football">Prepare the window</button></div>`:""}
      <div class="v17-navgrid">
        <button class="v17-navcard" data-act="ctab" data-arg="development"><b>Club Development</b><small>How your club has changed, projects and journey</small></button>
        <button class="v17-navcard" data-act="ctab" data-arg="football"><b>Football & Transfers</b><small>Coach, director, recruitment and squad plan</small></button>
        <button class="v17-navcard" data-act="ctab" data-arg="ground"><b>Stadium & Facilities</b><small>Stands, pitch, construction and repairs</small></button>
        <button class="v17-navcard" data-act="ctab" data-arg="depts"><b>Departments</b><small>Staffing, budgets and operating performance</small></button>
        <button class="v17-navcard" data-act="ctab" data-arg="members"><b>Members & Board</b><small>Support, confidence, targets and AGM</small></button>
        <button class="v17-navcard" data-act="hubmoney" data-arg="overview"><b>Finances</b><small>Income, spending, funding and budgets</small></button>
      </div><div class="v17-actions"><button class="btn ghost" data-act="ctab" data-arg="overview">Detailed chairman overview</button></div>
      <details class="v17-planning"><summary>Looking for ways to improve the club?</summary>${oldClubHub()}</details>
    </section>`;
  };
  const oldClubView=clubView;
  clubView=function(){
    if(UI.ct==="development")return `<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="hub">← Club management</button></div>`+v17DevelopmentView();
    return oldClubView();
  };
})();
