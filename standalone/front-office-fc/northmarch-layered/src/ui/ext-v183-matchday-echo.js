/* ================= UI extension, ported from Northmarch V19 =================
   V18.3: matchday echo (presentation layer).
   Ported verbatim: these layers wrap core functions (render, act, cmd, ...) instead of using the feature hooks.
   Do not add new behaviour here; convert to hooks module by module. */
/* V18.3 — THE MATCHDAY ECHO: presentation layer, uses existing L1/L2 simulation */
(function installV183(){
 const e=x=>esc(String(x??""));
 const n=x=>Math.round(x||0).toLocaleString("en-GB");
 const money=x=>k1(Number(x||0));
 const issueId=(s,w)=>`${s}:${w}`;
 const valid=()=>!!(S&&S.my!=null&&S.phase==="season");
 function makeIssue(){
   const id=S.my, s=S.season,w=S.week,club=CL(id),finance=F(id),f=finance.last||{};
   const lines=f.lines||{},amounts=Object.entries(lines),revenue=amounts.filter(([k,v])=>v>0).reduce((a,[k,v])=>a+v,0),spending=amounts.filter(([k,v])=>v<0).reduce((a,[k,v])=>a-v,0);
   const matches=myMatches().map(m=>({competition:m.comp,home:CL(m.h).name,away:CL(m.a).name,h:m.h,a:m.a,
     hg:m.gh,ag:m.ga,att:m.att||0,xgh:m.lh,xga:m.la, headline:headline(m),
     scorers:(m.scorers||[]).map(x=>x.name).slice(0,6), pens:m.pens||null}));
   const clubNews=S.ev.filter(x=>x.s===s&&x.w===w&&(x.c===id||x.c2===id||x.from===id||x.to===id)&&
     !["Match","MatchEnd","Minute","Goal","Substitution"].includes(x.t)).slice(-18).reverse()
     .map(x=>({kind:x.t,text:x.text})).filter(x=>x.text).slice(0,5);
   const worldNews=(S.worldLog||[]).filter(x=>x.s===s&&x.w===w&&x.priority>=2).slice(-14)
     .sort((a,b)=>b.priority-a.priority).map(x=>({text:x.text,kind:x.t})).filter(x=>x.text).slice(0,3);
   const others=(S.matches||[]).filter(m=>m.comp==="league"&&m.h!==id&&m.a!==id&&CL(m.h)?.tier===club.tier)
     .sort((a,b)=>b.gh+b.ga-(a.gh+a.ga)).slice(0,3)
     .map(m=>({home:CL(m.h).name,away:CL(m.a).name,hg:m.gh,ag:m.ga}));
   const projects=G(id).projects.filter(x=>x.phase!=="done").slice(0,3).map(x=>({label:x.label,phase:x.phase,left:x.left||0}));
   const decisions=S.v181?.club===id?S.v181.records.filter(x=>x.s===s&&(x.w===w-1||x.w===w)).slice(-4).map(x=>x.label):[];
   const next=seasonOver()?null:fixtureOf(id,w+1);
   return {key:issueId(s,w),club:id,clubName:club.name,s,w,tier:TIER_NAME[club.tier],position:posOf(id),points:S.tbl[id]?.pts||0,
     matches,clubNews,worldNews,others,projects,decisions,
     cash:f.cash??finance.cash,net:f.net??0,revenue,spending,
     lines:Object.fromEntries(amounts.filter(([k,v])=>Math.abs(v)>=.001)),
     next:next?{opponent:CL(next.opp).name,home:!!next.home,week:w+1}:null,
     strength:Math.round(teamStrength(id)*10)/10};
 }
 function getIssues(){return S?.v183?.club===S?.my&&Array.isArray(S.v183.issues)?S.v183.issues:[]}
 function latest(){return getIssues().find(x=>x.key===UI.v183Issue)||getIssues().at(-1)||(valid()&&S.week>0?makeIssue():null)}
 const originalAdvance=advanceWeek;
 advanceWeek=function(){
   const prev=S?.week,prevSeason=S?.season;
   const result=originalAdvance();
   if(valid()&&S.week>0&&(S.week!==prev||S.season!==prevSeason)){
     const now=makeIssue();
     if(!S.v183||S.v183.club!==S.my)S.v183={club:S.my,issues:[],unread:null};
     const log=S.v183.issues;
     if(!log.some(x=>x.key===now.key))log.push(now);
     if(log.length>100)log.splice(0,log.length-100);
     S.v183.unread=now.key;
   }
   return result;
 };
 function beforeMatch(){
   const id=S.my,w=S.week+1,fixture=seasonOver()?null:fixtureOf(id,w);
   const latestIssue=getIssues().at(-1);
   const recent=(S.tbl[id]?.form||[]).slice(-5).join(" · ")||"New season";
   const tier=TIER_NAME[CL(id).tier];
   const club=CL(id).name;
   if(!fixture)return `<section class="v183-match-card"><span class="v183-kicker">MATCHDAY</span><h2>${seasonOver()?"Season finished":"No league fixture this week"}</h2>
     <p>There is still club business to manage. Your existing simulation controls remain available.</p></section>`;
   const opp=CL(fixture.opp),home=!!fixture.home,venue=home?"HOME":"AWAY";
   return `<section class="v183-match-card"><div class="v183-match-top"><span class="v183-kicker">MATCHDAY ${w} · ${e(tier)}</span><span class="v183-venue">${venue}</span></div>
     <h2>${e(home?club:opp.name)} <span class="v183-versus">v</span> ${e(home?opp.name:club)}</h2>
     <p class="v183-match-lead">The next result changes the league table, your finances and the week's newspaper.</p>
     <div class="v183-match-facts">
       <div><small>Your position</small><b>${S.week?ord(posOf(id)):"Pre-season"}</b></div>
       <div><small>Squad strength</small><b>${Math.round(teamStrength(id)*10)/10}</b></div>
       <div><small>Opponent strength</small><b>${Math.round(teamStrength(fixture.opp)*10)/10}</b></div>
       <div><small>Recent form</small><b>${e(recent)}</b></div>
     </div><button class="btn v183-match-go" data-act="play">▶ PLAY MATCHDAY ${w}</button>
     <p class="v183-muted">Your director and coaching staff run the team. You control the club, not in-match tactics.</p>
     ${latestIssue?`<button class="tbtn" data-act="v183paper" data-arg="${e(latestIssue.key)}">Read last week's Echo ›</button>`:""}
   </section>`;
 }

 function decisionDesk(){
  const choices=["training","academy","matchday","commercial"],id=S.my;
  const k=choices.includes(UI.v183Focus)?UI.v183Focus:"training", d=G(id).depts[k],type=DEPT[k];
  const topics=choices.map(key=>`<button class="v183-desk-tab ${key===k?"active":""}" data-act="v183focus" data-arg="${key}" aria-pressed="${key===k}">${e(DEPT[key].n)}</button>`).join("");
  const courses=type.courses.map(c=>`<button class="v183-desk-option ${(d.pending||d.course)===c?"active":""}" data-act="gcourse" data-arg="${k}:${c}" aria-pressed="${(d.pending||d.course)===c}">
    <strong>${e(c[0].toUpperCase()+c.slice(1))}</strong><span>${e(type.cd[c])}</span>
    <small>${d.pending===c?"Changing course":!d.pending&&d.course===c?"Current direction":"Choose direction"}</small></button>`).join("");
  const budgets=["tight","normal","generous"].map(b=>`<button class="v183-budget-option ${d.budget===b?"active":""}" data-act="gdept" data-arg="${k}:${b}" aria-pressed="${d.budget===b}">
    <b>${e(b[0].toUpperCase()+b.slice(1))}</b><small>£${n(deptWeekCost(id,k,null,b)*1000)}/wk</small></button>`).join("");
  const status=d.pending?`A change to ${d.pending} is in progress: ${d.settle} weeks remain. No course bonus applies until it settles.`:
    `Current course: ${d.course}. Changing direction takes time; your next budget change affects weekly costs immediately.`;
  return `<section class="v183-boardroom" aria-label="Optional boardroom decisions">
    <span class="v183-kicker">YOUR BOARDROOM · VOLUNTARY</span><h3>Make a real club decision</h3>
    <p>Choose a department to manage right here. Do it now, make several changes, or leave your club running as it is.</p>
    <div class="v183-desk-tabs">${topics}</div>
    <div class="v183-boardroom-panel"><h4>${e(type.n)} · ${d.staff}/5 staff</h4><p>${e(type.does)}</p>
      <h5>Choose a direction</h5><div class="v183-desk-options">${courses}</div>
      <p class="v183-hint">${e(status)}</p>
      <h5>Choose an operating budget</h5><div class="v183-budget-options">${budgets}</div>
      ${UI.msg?.text?`<p class="v183-board-message" role="status">${e(UI.msg.text)}</p>`:""}
      <button class="tbtn" data-act="dept" data-arg="${k}">Full department report and staffing ›</button>
    </div>
  </section>`;
 }

 function opportunities(){
  const id=S.my,f=F(id),d=G(id).depts;
  const projects=G(id).projects.filter(x=>x.phase!=="done");
  const cards=[
   {name:"Strengthen the team",fact:`Squad ${Math.round(teamStrength(id)*10)/10} · transfer room ${money(budgetFor(id))}`,desc:"Set real recruitment rules and wage limits. Deals happen at transfer windows.",act:"ctab",arg:"window",soon:"Window-based"},
   {name:"Develop your players",fact:`Training: ${d.training.staff}/5 staff · ${d.training.course}`,desc:"Choose development or fitness; spend on coaches and training.",act:"dept",arg:"training",soon:"Over weeks"},
   {name:"Build youth talent",fact:`Academy: ${d.academy.staff}/5 staff · ${d.academy.course}`,desc:"Coach young players and shape the next summer intake.",act:"dept",arg:"academy",soon:"Each season"},
   {name:"Improve matchday advantage",fact:`Matchday: ${d.matchday.staff}/5 staff · ${d.matchday.course}`,desc:"Atmosphere influences home edge; comfort benefits supporters.",act:"dept",arg:"matchday",soon:"Upcoming home games"},
   {name:"Improve your stadium",fact:`${projects.length} projects ongoing · ${n(groundSignals(id).capacity)} seats`,desc:"Repair facilities, expand stands and improve the pitch.",act:"ctab",arg:"ground",soon:"Costs + construction"},
   {name:"Earn and protect money",fact:`Cash ${money(f.cash)} · ${f.last?"weekly net "+money(f.last.net):"pre-season"}`,desc:"Adjust prices, commercial focus and spending before investing.",act:"hubmoney",arg:"overview",soon:"Each week"}
  ];
  return `<section class="v183-growth"><div class="v183-section-heading"><span class="v183-kicker">THE CHAIRMAN'S LEVERS</span><h3>How can you make your club better?</h3></div>
    <p>These are real actions in the simulation. You can combine them, ignore them or change direction later.</p>
    <div class="v183-improve-grid">${cards.map(c=>`<button class="v183-lever" data-act="${c.act}" data-arg="${c.arg}"><b>${e(c.name)}</b><small>${e(c.fact)}</small>
       <span>${e(c.desc)}</span><em>${e(c.soon)} · Open ›</em></button>`).join("")}</div></section>`;
 }
 function summary(){
  const id=S.my,f=F(id),now=latest();
  return `<section class="v183-club-stats"><div><small>LEAGUE POSITION</small><strong>${S.week?ord(posOf(id)):"—"}</strong></div>
    <div><small>CASH</small><strong>${money(f.cash)}</strong></div><div><small>LAST WEEK</small><strong>${f.last?money(f.last.net):"—"}</strong></div>
    <div><small>CLUB CONFIDENCE</small><strong>${Math.round(M(id).conf)}/100</strong></div></section>`;
 }
 function issueMain(i){
  const match=i.matches[0],headlineText=match?match.headline:"A week behind the scenes at "+i.clubName;
  const fx=i.next?`${i.next.home?"Host":"Visit"} ${i.next.opponent} in week ${i.next.week}`:"Next up: the season review";
  const main=match?`<p class="v183-lede">${e(i.clubName)} ${match.h===i.club?match.hg+"–"+match.ag:match.ag+"–"+match.hg} against ${e(match.h===i.club?match.away:match.home)}.
    The match finished ${match.hg}–${match.ag}, with ${e(match.home)} at home${match.att?` in front of ${n(match.att)} supporters`:""}.
    Expected goals were ${Number(match.xgh||0).toFixed(1)}–${Number(match.xga||0).toFixed(1)}.
    ${Math.abs((match.hg-match.ag)-(Number(match.xgh||0)-Number(match.xga||0)))>1.4?"The scoreline moved further than the expected-goals gap, a reminder that chances and goals do not always align.":"The expected-goals figures offer another view of how the game unfolded."}</p>`:
    `<p class="v183-lede">No first-team match was recorded this week. The club's financial and operational world continued to move.</p>`;
  const otherGames=i.matches.slice(1).map(m=>`<p><b>${e(m.home)} ${m.hg}–${m.ag} ${e(m.away)}</b> · ${e(m.competition)} fixture</p>`).join("");
  const moneyParts=Object.entries(i.lines||{}),topIncome=moneyParts.filter(([k,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const topCosts=moneyParts.filter(([k,v])=>v<0).sort((a,b)=>a[1]-b[1]).slice(0,3);
  const finRows=(arr)=>arr.length?arr.map(([k,v])=>`<div class="v183-fin-row"><span>${e(k.replace(/([A-Z])/g," $1").replace(/_/g," "))}</span><b>${money(v)}</b></div>`).join(""):'<p class="v183-muted">No amounts recorded.</p>';
  const interesting=i.clubNews.length?i.clubNews.map(x=>`<p class="v183-newstext"><b>${e(x.kind.replace(/([a-z])([A-Z])/g,"$1 $2"))}:</b> ${e(x.text)}</p>`).join(""):
    i.projects.length?i.projects.map(x=>`<p class="v183-newstext"><b>${e(x.label)}</b> ${x.phase==="permit"?"is awaiting a permit":`has ${x.left} weeks of planned construction left`}.</p>`).join(""):
      '<p class="v183-newstext">The club continued under its existing policies. No major off-pitch event was recorded this week.</p>';
  const world=i.worldNews.length?i.worldNews.map(x=>`<p class="v183-newstext">${e(x.text)}</p>`).join(""):
    i.others.length?i.others.slice(0,2).map(x=>{const total=x.hg+x.ag,draw=x.hg===x.ag,winner=x.hg>x.ag?x.home:x.away,loser=x.hg>x.ag?x.away:x.home;
      const narrative=draw?`${x.home} and ${x.away} shared the points after ${total} goals.`:
        total>=5?`${winner} took the points from ${loser} in a ${total}-goal contest.`:`${winner} collected a league victory over ${loser}.`;
      return `<p class="v183-newstext"><b>${e(x.home)} ${x.hg}–${x.ag} ${e(x.away)}</b>. ${e(narrative)}</p>`;}).join(""):
      '<p class="v183-newstext">No major additional world event was recorded in this edition.</p>';
  return `<article class="v183-paper" aria-label="Northmarch Echo season ${i.s} week ${i.w}">
   <header class="v183-mast"><div class="v183-date">SEASON ${i.s} · WEEK ${i.w} · ${e(i.tier)}</div>
     <div class="v183-name">THE NORTHMARCH ECHO</div><div class="v183-submast">THE WEEK IN FOOTBALL · FINANCES · YOUR CLUB</div></header>
   <section class="v183-lead"><span class="v183-kicker">THE BIG STORY</span><h1>${e(headlineText)}</h1>${main}
     ${i.matches.map((m,j)=>`<div class="v183-paper-score"><b>${e(m.home)}</b><strong>${m.hg}–${m.ag}</strong><b>${e(m.away)}</b></div>`).join("")}
     ${i.matches.length?'<button class="btn ghost" data-act="watch" data-arg="0">Watch your match ›</button>':""}${otherGames}
     <p class="v183-muted">${e(i.position?ord(i.position)+" in "+i.tier+" · "+i.points+" league points":"Pre-season")}</p></section>
   <section class="v183-paper-section"><span class="v183-kicker">INSIDE THE ACCOUNTS</span><h2>The week's money</h2>
     <div class="v183-fin-head"><div><small>INCOME</small><b>${money(i.revenue)}</b></div><div><small>COSTS</small><b>${money(i.spending)}</b></div>
      <div><small>NET</small><b>${money(i.net)}</b></div><div><small>CASH</small><b>${money(i.cash)}</b></div></div>
     <h3>Largest income streams</h3>${finRows(topIncome)}<h3>Largest costs</h3>${finRows(topCosts)}
     ${(i.lines||{}).seasontix?'<p class="v183-muted">This week includes season-ticket receipts, which do not recur every week.</p>':""}
     <button class="tbtn" data-act="hubmoney" data-arg="overview">Manage club finances ›</button></section>
   <section class="v183-paper-section"><span class="v183-kicker">BEHIND THE SCENES</span><h2>At your club</h2>${interesting}
     ${i.decisions.length?`<h3>Chairman's instructions this week</h3>${i.decisions.map(x=>`<p class="v183-newstext">${e(x)}</p>`).join("")}`:""}
     <button class="tbtn" data-act="tab" data-arg="club">Open club management ›</button></section>
   <section class="v183-paper-section"><span class="v183-kicker">AROUND THE FOOTBALL WORLD</span><h2>Elsewhere in Northmarch</h2>${world}
     <button class="tbtn" data-act="tab" data-arg="table">League and world ›</button></section>
   <section class="v183-paper-section v183-next"><span class="v183-kicker">LOOKING AHEAD</span><h2>${e(fx)}</h2>
     <p>Build the squad, adjust staff and budgets, or let your existing choices play out. There is no required weekly task.</p>
     <button class="btn" data-act="v183ready">Return to next matchday ›</button></section>
   </article>`;
 }
 function archive(){
   const issues=getIssues().slice().reverse();
   return `<section class="v183-archive"><span class="v183-kicker">PAST EDITIONS</span><h2>The Echo archive</h2>
     ${issues.length?issues.map(i=>`<button class="v183-archive-link" data-act="v183paper" data-arg="${e(i.key)}"><b>Season ${i.s}, week ${i.w}</b>
       <span>${e(i.matches[0]?.headline||"Your club this week")} · ${money(i.net)}</span></button>`).join(""):'<p>No archived newspapers have been recorded yet.</p>'}
     <button class="btn ghost" data-act="v183ready">Back to matchday ›</button></section>`;
 }
 function finalWhistle(){
   const issue=latest();if(!issue)return beforeMatch();
   const main=issue.matches[0],cup=issue.matches.find(x=>x.competition==="cup");
   return `<section class="v183-postmatch"><span class="v183-kicker">FULL TIME · SEASON ${issue.s}, WEEK ${issue.w}</span>
     <h2>${e(main?.headline||"The week's results are in")}</h2>
     ${issue.matches.map(m=>`<div class="v183-bigscore"><div>${e(m.home)}</div><strong>${m.hg}–${m.ag}</strong><div>${e(m.away)}</div></div>
       <div class="v183-scoremeta">${e(m.competition==="cup"?"Cup":"League")} · xG ${Number(m.xgh||0).toFixed(1)}–${Number(m.xga||0).toFixed(1)}</div>`).join("")}
     <div class="v183-fin-snippet"><b>League: ${issue.position?ord(issue.position):"—"}</b><span>Week's net ${money(issue.net)}</span><span>Cash ${money(issue.cash)}</span></div>
     <button class="btn v183-action-primary" data-act="v183paper" data-arg="${e(issue.key)}">READ THE NORTHMARCH ECHO ›</button>
     ${issue.matches.length?'<button class="btn ghost" data-act="watch" data-arg="0">▶ Watch match minute by minute</button>':""}
     <button class="tbtn" data-act="v183ready">Return to club & next match ›</button>
   </section>`;
 }
 const previousWeek=weekView,previousAct=act,previousActionBar=actionBar;
 weekView=function(){
   if(!valid())return previousWeek();
   const stage=UI.v183Stage||"preview";
   if(stage==="paper")return issueMain(latest()||makeIssue())+
     `<div class="v183-bottomnav"><button class="tbtn" data-act="v183archive">Past editions</button><button class="tbtn" data-act="v183ready">Matchday desk</button></div>`;
   if(stage==="archive")return archive();
   if(stage==="result"&&S.week>0)return finalWhistle();
   const past=getIssues().at(-1);
   const story=past?`<section class="v183-last-news"><div><span class="v183-kicker">LAST WEEK IN THE ECHO</span><h3>${e(past.matches[0]?.headline||"Your club's latest headlines")}</h3>
    <p>Net ${money(past.net)} · Cash ${money(past.cash)}</p></div><button class="tbtn" data-act="v183paper" data-arg="${e(past.key)}">Read ›</button></section>`:"";
   return `<div class="v183-desktop">${beforeMatch()}${summary()}${story}${decisionDesk()}${opportunities()}
     <section class="v183-loop-map"><span class="v183-kicker">HOW THE GAME WORKS</span><h3>The chairman's weekly loop</h3>
       <div class="v183-steps"><div><b>1 · DECIDE</b><span>Change policies, people, prices or projects</span></div><div><b>2 · PLAY</b><span>The world, players, clubs and finances advance</span></div>
       <div><b>3 · MATCH</b><span>See the result and watch the match</span></div><div><b>4 · ECHO</b><span>Read real news, accounts and consequences</span></div></div>
       <p class="v183-muted">Play on without taking action, or make several decisions in the same week. Both are valid.</p></section>
     <details class="v183-fullreports"><summary>Full reports, club signals & detailed statistics</summary>${previousWeek()}</details></div>`;
 };
 actionBar=function(){
   if(!valid()||UI.tab!=="week")return previousActionBar();
   if(UI.v183Stage==="result")return `<div class="actbar v183-bar"><div class="ab-in"><span class="small">Full-time · the week's news is ready</span>
     <button class="btn" data-act="v183paper">Read the Echo ›</button></div></div>`;
   if(UI.v183Stage==="paper"||UI.v183Stage==="archive")return `<div class="actbar v183-bar"><div class="ab-in"><span class="small">Your next matchday awaits</span>
     <button class="btn" data-act="v183ready">Return to matchday ›</button></div></div>`;
   const old=previousActionBar();
   return old.replace(/Close the window · start the season|Play week \d+/,"Play matchday · week "+(S.week+1));
 };
 act=function(a,arg){
   if(a==="v183focus"){
     if(["training","academy","matchday","commercial"].includes(arg))UI.v183Focus=arg;
     render();return;
   }
   if(a==="v183paper"){
     UI.v183Stage="paper";UI.v183Issue=arg||null;UI.tab="week";UI.over=null;
     if(S?.v183)S.v183.unread=null;
     save();render();return;
   }
   if(a==="v183archive"){UI.v183Stage="archive";UI.tab="week";UI.over=null;render();return}
   if(a==="v183ready"){UI.v183Stage="preview";UI.v183Issue=null;UI.tab="week";UI.over=null;render();return}
   if(a==="play"||a==="playn"){
     const oldWeek=S?.week,oldYear=S?.season;
     previousAct(a,arg);
     if(S&&S.phase==="season"&&(S.week!==oldWeek||S.season!==oldYear)){
       UI.v183Stage=a==="play"?"result":"paper";UI.v183Issue=null;UI.tab="week";save();render();
     }
     return;
   }
   if(a==="new"){UI.v183Stage="preview";UI.v183Issue=null;}
   if(a==="startnext"){UI.v183Stage="preview";UI.v183Issue=null;}
   if(a==="cont"){
     const res=previousAct(a,arg);
     if(S?.v183?.club===S.my&&S.v183.unread){
       UI.v183Stage="paper";UI.v183Issue=S.v183.unread;UI.tab="week";
       render();
     }
     return res;
   }
   return previousAct(a,arg);
 };
})();
if(HAS_DOM){
  document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;act(b.dataset.act,b.dataset.arg)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&UI.over){UI.over=null;render()}});
  render();
}



/* Preserve an open sheet's scroll position after a settings change. */
(function(){
  if(typeof document==='undefined')return;
  const originalRender=render;
  render=function(){
    const prev=document.querySelector('.overlay');
    const kind=prev?UI.over:null;
    const offset=prev?prev.scrollTop:0;
    originalRender();
    if(kind&&UI.over===kind){
      const current=document.querySelector('.overlay');
      if(current)current.scrollTop=offset;
    }
  };
})();
