/* ---- ui/act.js ---- */
/* ================= Taps: one handler for every data-act, then save and redraw ================= */
function say(r,okText){UI.msg=r&&r.ok===false?{err:true,text:r.err}:okText?{text:okText}:null}
function act(a,arg){
  UI.msg=null;
  switch(a){
    case'new':newWorld((Date.now()%2147483647)|0);UI.title=false;UI.tab='week';UI.review=null;break;
    case'cont':if(load()){UI.title=false;UI.review=null}break;
    case'quit':save();UI.title=true;UI.over=null;break;
    case'choose':chooseClub(arg);UI.tier=null;break;
    case'boardjump':UI.tab='club';UI.ct={members:'members',staff:'football',departments:'depts'}[arg]||'overview';UI.over=null;break; // kept for old links
    case'buildgroup':UI.buildGroup=arg;UI.buildChoice=null;break;
    case'buildpick':UI.buildChoice=UI.buildChoice===arg?null:arg;break;
    case'buildgo':{const opt=projectCatalog(S.my).find(o=>o.key===arg);if(!opt||opt.busy){UI.msg={err:true,text:'This upgrade is no longer available.'};break}const r=cmd('StartProject',S.my,{key:arg,offer:'standard'});say(r,'Upgrade ordered. Follow its progress here.');if(r.ok)UI.buildChoice=null;break}
    case'improve':UI.improve=UI.improve===arg?null:arg;break;
    case'hubmoney':UI.tab='money';UI.mt=arg;UI.over=null;if(HAS_DOM)window.scrollTo(0,0);break;
    case'hubprojects':UI.tab='club';UI.ct='projects';UI.over=null;if(HAS_DOM)window.scrollTo(0,0);break;
    case'ctab':UI.tab='club';UI.ct=arg;UI.over=null;UI.gsel=null;UI.confirm=null;if(arg==='ground')UI.gt=UI.gt||'stadium';if(HAS_DOM)window.scrollTo(0,0);break;
    case'helpok':S.help=true;break;
    case'journal':UI.over='journal';break;
    case'tab':UI.tab=arg;UI.over=null;if(arg==='club')UI.ct='hub';if(arg==='money')UI.mt=UI.mt||'overview';if(HAS_DOM)window.scrollTo(0,0);break;
    case'playn':{UI.prevPos=S.week?posOf(S.my):null;const r=playWeeks(arg==='stop'?99:+arg);UI.lastEv=r.events;UI.playNote=`Played ${r.n} week${r.n===1?'':'s'}. ${r.why||''}`;if(HAS_DOM)window.scrollTo(0,0);break}
    case'play':{UI.playNote=null;UI.prevPos=S.week?posOf(S.my):null;const ev=advanceWeek();UI.lastEv=ev||[];if(HAS_DOM)window.scrollTo(0,0);if(UI.autoLive&&myMatches().length)liveOpen(0);break}
    case'watch':liveOpen(+arg);break;
    case'lv':liveAct(arg);break;
    case'close':{const mark=S.evn||0;const h=closeSeason();UI.summerEv=eventsSince(mark);UI.review=h;UI.lastEv=[];if(HAS_DOM)window.scrollTo(0,0);break}
    case'startnext':UI.review=null;UI.tab='week';break;
    case'tier':UI.tier=['cup','market','archive'].includes(arg)?arg:+arg;break;
    case'worldarchive':UI.tab='table';UI.tier='archive';UI.over=null;if(HAS_DOM)window.scrollTo(0,0);break;
    case'ov':UI.over=arg||null;UI.gsel=null;UI.confirm=null;if(arg==='ground')UI.gt='stadium';break;
    case'club':UI.over='club';UI.arg=arg;break;
    case'foreignclub':UI.over='foreignclub';UI.arg=arg;break;
    case'worldplayer':UI.over='worldplayer';UI.arg=arg;break;
    case'dept':UI.over='dept';UI.arg=arg;UI.gsel=null;break;
    case'dstaff':{const [dept,lv]=arg.split(':');say(cmd('SetDeptStaff',S.my,{dept,level:+lv}));break}
    case'player':UI.over='player';UI.arg=arg;UI.confirm=null;break;
    case'gtab':UI.gt=arg;UI.gsel=null;break;
    case'mtab':UI.mt=arg;break;
    case'gsel':UI.gsel=arg||null;break;
    case'gbuild':{const [key,offer]=arg.split('|');const r=cmd('StartProject',S.my,{key,offer});say(r,'Building work ordered.');if(r.ok)UI.gsel=null;break}
    case'grepair':say(cmd('Repair',S.my,{key:arg}),'Repaired.');break;
    case'gdept':{const [dept,level]=arg.split(':');say(cmd('SetDeptBudget',S.my,{dept,level}));break}
    case'gcourse':{const [dept,course]=arg.split(':');say(cmd('SetDeptCourse',S.my,{dept,course}));break}
    case'price':{const [kind,d]=arg.split(':');say(cmd('SetPrice',S.my,{kind,delta:+d}));break}
    case'ly':UI.ly=+arg;break;
    case'loan':say(cmd('TakeLoan',S.my,{amount:+arg,years:UI.ly}),`£${arg}k borrowed.`);break;
    case'repay':say(cmd('RepayLoan',S.my,{i:+arg}),'Loan repaid.');break;
    case'staff':UI.over='staff';UI.arg=arg;UI.confirm=null;break;
    case'shire':{const [role,pid]=arg.split('|');const r=cmd('HireStaff',S.my,{role,pid});say(r,'Appointed.');if(r.ok)UI.confirm=null;break}
    case'ssack':say(cmd('SackStaff',S.my,{role:arg}),'Sacked. A caretaker takes over.');break;
    case'srenew':say(cmd('RenewStaff',S.my,{role:arg}),'Contract renewed.');break;
    case'history':UI.over='history';break;
    case'buyplot':say(cmd('BuyPlot',S.my,{}),'Land bought.');UI.confirm=null;break;
    case'stadium':say(cmd('StartStadium',S.my,{size:arg}),'Work on the new stadium has started.');UI.confirm=null;break;
    case'mtabgo':UI.tab='money';UI.mt=arg==='sponsors'||arg==='prices'?'income':arg;UI.over=null;if(HAS_DOM)window.scrollTo(0,0);break;
    case'tobudget':UI.tab='money';UI.mt='budget';UI.over=null;if(HAS_DOM)window.scrollTo(0,0);break;
    case'wager':say(cmd('SetSquadPolicy',S.my,{wageR:clamp(r2(wageRatio(S.my)+.02*(+arg)),.4,1.05)}));break;
    case'sponsor':say(cmd('SignSponsor',S.my,{i:+arg}),'Deal signed.');break;
    case'bond':say(cmd('IssueBond',S.my,{amount:+arg}),'Bond issued.');break;
    case'appeal':{const r=cmd('Fundraise',S.my,{});say(r,r.ok?`The appeal raised £${r.res}k.`:null);break}
    case'sellground':say(cmd('SellGround',S.my,{}),'The ground is sold.');UI.confirm=null;break;
    case'buyback':say(cmd('BuyBackGround',S.my,{}),'The ground is ours again.');break;

    case'course':say(cmd('SetSquadPolicy',S.my,{course:arg}),'The director follows the new course from the next window.');break;
    case'recruit':say(cmd('SetSquadPolicy',S.my,{recruit:arg}),`Recruitment strategy: ${RECRUIT[arg].n}.`);break;
    case'dues':say(cmd('SetDues',S.my,{delta:+arg}));break;
    case'pol':say(cmd('SetSquadPolicy',S.my,{wage:arg}));break;
    case'loans':say(cmd('SetSquadPolicy',S.my,{loans:arg==='true'}));break;
    case'spend':say(cmd('SetSquadPolicy',S.my,{spend:+arg}));break;
    case'confirm':UI.confirm=arg||null;break;
    case'release':{const r=cmd('ReleasePlayer',S.my,{pid:arg});say(r);if(r.ok){UI.over=null;UI.confirm=null}break}
    default:featureAction(a,arg);break;
  }
  if(S&&!UI.title&&(S.phase!=='choose'||S.career.length))save();
  render();
}

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

/* Northmarch V18: better club management UX */
(function install(){
const tx=s=>esc(String(s??""));
const fnum=x=>Math.round(x).toLocaleString("en-GB");
const rnum=x=>(Math.round(x*10)/10).toFixed(1);
const link=(t,sub,act,arg,icon="›")=>`<button class="v18-link" data-act="${act}" data-arg="${tx(arg||"")}"><span class="v18-icon" aria-hidden="true">${icon}</span><span><b>${tx(t)}</b><small>${tx(sub)}</small></span><em>›</em></button>`;
const deptKeys=()=>Object.keys(DEPT);
function deptCards(keys){
 return keys.map(k=>{const d=G(S.my).depts[k],q=deptKpi(S.my,k);
 return `<button class="v18-dept" data-act="dept" data-arg="${k}"><span class="v18-dept-head"><b>${tx(DEPT[k].n)}</b><small>${d.staff}/5 staff</small></span><span class="v18-purpose">${tx(DEPT[k].does)}</span><span class="v18-tags"><span>${tx(d.budget)} budget</span><span>${tx(d.pending||d.course||"Standard")}${d.hiring?" · hiring":""}</span></span><span class="v18-dept-kpi">${tx(q.label)}: <strong>${tx(q.text)}</strong></span><span class="v18-jump">Manage ›</span></button>`}).join("");
}
function focus(){
 const info=windowInfo(),active=info.k==="open"||info.k==="next";const risk=signals(S.my).find(x=>x.lv>=2);
 const projects=G(S.my).projects.filter(x=>x.phase!=="done");
 if(active)return `<div class="v18-focus"><span class="v18-eyebrow">NEXT IMPORTANT DECISION</span><h3>${info.k==="open"?"Summer transfer window":"Winter transfer window"}</h3><p>Set the recruitment approach and check the finances before the director acts.</p><button class="btn" data-act="ctab" data-arg="window">Plan transfers</button></div>`;
 if(seasonOver())return `<div class="v18-focus"><span class="v18-eyebrow">SEASON COMPLETE</span><h3>Review your season</h3><p>See the sporting and financial consequences.</p><button class="btn" data-act="close">Close the season</button></div>`;
 if(risk)return `<div class="v18-focus"><span class="v18-eyebrow">NEEDS ATTENTION</span><h3>${tx(risk.text)}</h3><button class="btn" data-act="${tx(risk.act)}"${risk.arg!=null?` data-arg="${tx(risk.arg)}"`:""}>Review this</button></div>`;
 if(projects.length)return `<div class="v18-focus"><span class="v18-eyebrow">UNDER CONSTRUCTION</span><h3>${tx(projects[0].label)}</h3><p>${projects[0].phase==="permit"?"Waiting for permission":projects[0].left+" weeks remaining"}</p><button class="btn" data-act="ctab" data-arg="ground">See project</button></div>`;
 return `<div class="v18-focus"><span class="v18-eyebrow">YOUR CLUB THIS SEASON</span><h3>Decide what to improve next</h3><p>Football, facilities, staff and finances all affect the club over time.</p><button class="btn" data-act="ctab" data-arg="development">View club growth</button></div>`;
}
const nav=[
 ["Football","Coach, director and playing squad","ctab","football","⚽"],
 ["Transfer centre","Window, strategy and scouting","ctab","window","⇄"],
 ["Finances","Budget, costs, income and loans","hubmoney","overview","£"],
 ["Stadium & facilities","Building, repairs and training grounds","ctab","ground","▥"],
 ["Members & board","Confidence, prices, objectives","ctab","members","♟"],
 ["Club development","History, club growth, stadium","ctab","development","↗"]
];
function clubHome(){
 const c=CL(S.my),f=F(S.my),m=M(S.my),projects=G(S.my).projects.filter(x=>x.phase!=="done");
 const fgroup=["training","medical","academy","scouting"];
 const groups=[["FOOTBALL DEVELOPMENT",deptKeys().filter(k=>fgroup.includes(k))],["CLUB OPERATIONS",deptKeys().filter(k=>!fgroup.includes(k))]];
 return `<div class="v18-club">
 <header class="v18-head"><span class="v18-eyebrow">NORTHMARCH V18 · CLUB</span><h2>${tx(c.name)}</h2><p>Season ${S.season} · ${S.week?"Week "+S.week:"Pre-season"} · ${tx(TIER_NAME[c.tier])}</p></header>
 <section class="v18-stats"><div><small>LEAGUE</small><b>${S.week?ord(posOf(S.my)):"—"}</b><span>${S.week?"Current place":"Season starts soon"}</span></div><div><small>SQUAD</small><b>${rnum(teamStrength(S.my))}</b><span>Team strength</span></div><div><small>CASH</small><b>${k1(f.cash)}</b><span>${k1(debt(S.my))} debt</span></div><div><small>MEMBERS</small><b>${Math.round(m.conf)}/100</b><span>Confidence</span></div></section>
 ${focus()}
 <section class="v18-section"><div class="v18-section-title"><h3>Run your club</h3><small>One tap to every responsibility</small></div><div class="v18-links">${nav.map(x=>link(...x)).join("")}</div></section>
 <section class="v18-section"><div class="v18-section-title"><h3>All ${deptKeys().length} departments</h3><small>Staff, budget and actual results</small></div>
 <p class="small muted">Tap any department to see its detailed information and change staffing, funding or priorities.</p>
 ${groups.map(([label,ks])=>`<div class="v18-dept-group"><h4>${label}</h4><div class="v18-depts">${deptCards(ks)}</div></div>`).join("")}
 <button class="btn ghost" data-act="ctab" data-arg="depts">All department comparisons</button></section>
 <section class="v18-section"><div class="v18-section-title"><h3>Projects</h3><small>What is changing</small></div>
 ${projects.length?projects.map(x=>`<div class="v18-project"><b>${tx(x.label)}</b><span>${x.phase==="permit"?"Permit pending":Math.max(0,x.left)+" weeks left"}</span></div>`).join(""):'<p class="small muted">There are no active building projects.</p>'}
 <button class="btn ghost" data-act="ctab" data-arg="ground">See building options</button></section>
 <section class="v18-section"><div class="v18-section-title"><h3>More information</h3><small>Nothing hidden or removed</small></div><div class="v18-links">
 ${link("Detailed club report","League, finance, staffing and facilities","ctab","overview","▤")}
 ${link("Players","Full squad and player profiles","tab","squad","♙")}
 ${link("History & records","Previous seasons, achievements","history","","⌛")}
 ${link("Income & sponsorship","Sponsors, prices and other income","hubmoney","income","✦")}
 ${link("Funding & debt","Loans and borrowing","hubmoney","funding","£")}
 ${link("Operations overview","All eight department comparisons","ctab","depts","▦")}
 </div></section>
 </div>`;
}
function snapshot(){
 const id=S.my,q=S.squads[id].filter(x=>!x.loan);
 return {s:S.season,w:S.week,quality:r1(teamStrength(id)),count:q.length,age:r1(q.reduce((a,p)=>a+p.age,0)/Math.max(1,q.length)),wages:r1(wageBillK(id)),cash:r1(F(id).cash),needs:openNeeds().filter(x=>x.status==="open").slice(0,20).map(x=>({pos:x.pos,kind:x.kind,why:x.why}))};
}
const oldAdvance=advanceWeek;
advanceWeek=function(){
 const isWindow=!!(S?.my&&S.phase==="season"&&(S.week===0||S.week===WINTER_WEEK-1));
 let before=null,lastE=S?.evn||0;
 if(isWindow)before={s:S.season,kind:S.week===0?"summer":"winter",before:snapshot(),policy:{course:F(S.my).policy.course||"custom",recruit:recruitStrategy(S.my),spend:F(S.my).policy.spend}};
 const outcome=oldAdvance();
 if(before&&S?.my&&S.week>before.before.w){
   const id=S.my;
   before.after=snapshot();
   before.moves=eventsSince(lastE).filter(e=>["Transfer","Signing","InternationalTransfer"].includes(e.t)&&
      (e.c===id||e.c2===id||e.from===id||e.to===id)).slice(0,25).map(e=>({text:e.text||"",dir:e.t==="InternationalTransfer"?(e.to===id?"in":"out"):e.c2===id?"out":"in"}));
   S.v18=S.v18&&S.v18.club===id?S.v18:{club:id,windows:[]};
   S.v18.windows=S.v18.windows.filter(x=>!(x.s===before.s&&x.kind===before.kind)).concat([before]).slice(-6);
 }
 return outcome;
};
function stat(title,value,sub){return `<div><small>${tx(title)}</small><b>${tx(value)}</b><span>${tx(sub)}</span></div>`}
function change(x,y,key,digits=1){if(!x||!y)return"Not recorded";const v=Math.round((y[key]-x[key])*10**digits)/10**digits;return (v>0?"+":"")+v}
function reviewWindow(){
 const w=S.v18?.club===S.my?S.v18.windows?.at(-1):null;
 if(!w||!w.after)return '<p class="small muted">Your first V18 window review appears after the next transfer window. Previous saves have no reliable before-window measurements.</p>';
 const a=w.before,b=w.after,ins=w.moves.filter(x=>x.dir==="in"),out=w.moves.filter(x=>x.dir==="out");
 return `<p class="small muted">${tx(w.kind==="summer"?"Summer":"Winter")} window · Season ${w.s}</p>
 <div class="v18-review-stats">${stat("Squad quality",rnum(a.quality)+" → "+rnum(b.quality),change(a,b,"quality"))}
 ${stat("Squad size",a.count+" → "+b.count,change(a,b,"count",0))}
 ${stat("Weekly wages","£"+fnum(a.wages*1000)+" → £"+fnum(b.wages*1000),change(a,b,"wages")+"k/wk")}
 ${stat("Cash",k1(a.cash)+" → "+k1(b.cash),change(a,b,"cash")+"k")}</div>
 <p class="small muted">The financial comparison includes the whole playing week, not just transfers.</p>
 <div class="v18-moves"><h4>Arrivals (${ins.length})</h4>${ins.length?ins.map(x=>`<p class="small">${tx(x.text)}</p>`).join(""):'<p class="small muted">No recorded arrivals.</p>'}
 <h4>Departures (${out.length})</h4>${out.length?out.map(x=>`<p class="small">${tx(x.text)}</p>`).join(""):'<p class="small muted">No recorded departures.</p>'}</div>
 <p class="small"><b>Open squad needs:</b> ${b.needs.length?b.needs.slice(0,3).map(x=>tx(x.why)).join("; "):"None currently recorded"}.</p>`;
}
function transferCentre(){
 const id=S.my,inf=windowInfo(),decision=S.week===0||S.week===WINTER_WEEK-1,needs=openNeeds(),scouts=OPS().shortlist.filter(x=>x.status==="watching").slice(0,6),p=F(id).policy;
 return `<div class="v18-transfer">
 <header class="v18-head"><span class="v18-eyebrow">FOOTBALL · TRANSFER CENTRE</span><h2>${tx(inf.name)}</h2><p>${tx(inf.when)}</p></header>
 ${decision?`<div class="v18-focus"><span class="v18-eyebrow">YOUR DECISION</span><h3>Set the direction; the director signs the players.</h3><p>The chairman chooses real policies. The director operates within budget and market rules.</p></div>`:""}
 <section class="v18-section"><h3>Assess the squad</h3>
 <div class="v18-stats v18-mini">${stat("Quality",rnum(teamStrength(id)),"Current strength")}${stat("Players",S.squads[id].filter(x=>!x.loan).length,"In the squad")}${stat("Open needs",needs.length,"Squad plan")}${stat("Scouting",scoutObservations(id),"Looks each week")}</div>
 ${needs.length?needs.slice(0,6).map(n=>`<div class="v18-need"><b>${tx(POS_ONE[n.pos]||n.pos)}</b><span>${tx(n.why)}</span><small>${n.prio>=3?"Urgent":n.prio===2?"Soon":"Long term"}</small></div>`).join(""):'<p class="small muted">No unresolved squad-plan needs. Summer upgrades are still possible.</p>'}
 ${needs.length>6?`<details><summary>${needs.length-6} more needs</summary>${needs.slice(6).map(n=>`<p class="small">${tx(n.why)}</p>`).join("")}</details>`:""}
 <button class="btn ghost" data-act="tab" data-arg="squad">See full squad</button></section>
 <section class="v18-section"><h3>Choose a club course</h3>
 <p class="small muted">Changes wage limits, transfer spending, loans and the recruitment strategy together. You can use a preset or change individual limits in any order.</p>
 <div class="v18-options">${Object.entries(COURSE).map(([k,c])=>`<button class="v18-option ${p.course===k?"active":""}" data-act="course" data-arg="${k}" aria-pressed="${p.course===k}"><b>${tx(c.n)}</b><small>${tx(c.d)}</small></button>`).join("")}</div>
 <p class="small muted">${p.course&&COURSE[p.course]?"Selected: "+tx(COURSE[p.course].n):"Custom policy: individual controls are active."}</p></section>
 <section class="v18-section"><h3>Choose recruitment preference</h3>
 <p class="small muted">The director uses this to rank comparable affordable players. It does not guarantee any signing.</p>
 <div class="v18-options">${Object.entries(RECRUIT).map(([k,r])=>`<button class="v18-option ${recruitStrategy(id)===k?"active":""}" data-act="recruit" data-arg="${k}" aria-pressed="${recruitStrategy(id)===k}"><b>${tx(r.n)}</b><small>${tx(r.d)}</small></button>`).join("")}</div></section>
 <section class="v18-section"><h3>Review finances</h3><div class="v18-stats v18-mini">
 ${stat("Transfer money",k1(budgetFor(id)),"Budget formula")}${stat("Weekly wages","£"+fnum(wageBillK(id)*1000),"Current bill")}
 ${stat("Weekly limit","£"+fnum(wageCapK(id)*1000),"Wage ceiling")}${stat("Cash",k1(F(id).cash),k1(debt(id))+" debt")}</div>
 <button class="btn ghost" data-act="tobudget">Detailed spending settings</button></section>
 <section class="v18-section"><h3>Scouting reports</h3>
 <p class="small muted">Real observed candidates; ratings are estimates and available players may decline a deal.</p>
 ${scouts.length?scouts.map(x=>`<div class="v18-need"><b>${tx(x.name)}</b><span>${tx(x.pos)} · ${tx(x.age)} · ${tx(x.from?marketClubName(x.from):"Free agent")}</span><small>${rnum(x.est)} estimated · ${x.obs} looks</small></div>`).join(""):'<p class="small muted">No players currently watched. Scouting improves the search over time.</p>'}
 <button class="btn ghost" data-act="dept" data-arg="scouting">Manage scouting</button></section>
 ${decision?`<section class="v18-launch"><h3>${S.week===0?"Ready for summer transfers?":"Ready for the winter window?"}</h3>
 <p>${S.week===0?"Playing week 1 runs the summer window.":"Playing week "+WINTER_WEEK+" runs winter recruitment. Winter deals mainly cover emergencies."} You may keep your current policy.</p>
 <button class="btn" data-act="play">${S.week===0?"Execute window and play week 1":"Execute winter window and play week "+WINTER_WEEK}</button></section>`:""}
 <section class="v18-section"><h3>Window outcome</h3>${reviewWindow()}</section>
 <section class="v18-section"><h3>More recruitment information</h3>
 <div class="v18-links">${link("Full scouting & signings","The complete shortlist, squad plan and past signings","ctab","recruitdetail","▤")}
 ${link("Football organisation","Coach, director and squad overview","ctab","football","⚽")}</div></section>
 </div>`;
}
const formerClubView=clubView;
clubHub=clubHome;
clubView=function(){
 if(UI.ct==="window")return `<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="hub">← Club</button></div>`+transferCentre();
 if(UI.ct==="recruitdetail")return `<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="window">← Transfer centre</button></div>`+recruitPanels();
 if(UI.ct==="football"){
  return `<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="hub">← Club</button></div>
  <section class="v18-section"><h2>Football organisation</h2><p class="small muted">Manage the sporting staff, see the squad and prepare your transfer strategy.</p><div class="v18-links">
  ${link("Transfer centre","Current needs, policies and window results","ctab","window","⇄")}
  ${link("Full squad","Individual player information and form","tab","squad","⚽")}
  ${link("Academy","Young players and training","dept","academy","✦")}
  ${link("Scouting","Director's observations and reach","dept","scouting","◉")}
  </div></section>${staffPanel()}`;
 }
 return formerClubView();
};
windowPanel=function(){
 const w=windowInfo();
 return `<section class="panel"><div class="row"><p class="eyebrow">Transfer window</p><span class="pill">${w.k==="open"?"Open now":w.k==="next"?"Next week":w.k==="done"?"Completed":"Upcoming"}</span></div>
 <h3>${tx(w.name)}</h3><p class="small muted">${tx(w.when)}</p><button class="btn ghost" data-act="ctab" data-arg="window">Open transfer centre ›</button></section>`;
};
})();

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
/* Standalone export, save transfer, and display diagnostics — no game-rule changes. */
(function(){
  if(typeof document==='undefined')return;
  const q=id=>document.getElementById(id);
  const status=msg=>{const e=q('nm-tool-status');if(e)e.textContent=msg};
  function makeFile(content,mime,name){
    const blob=new Blob([content],{type:mime});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);
    a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),120000);return url;
  }
  function documentSource(){
    const clone=document.documentElement.cloneNode(true);
    const app=clone.querySelector('#app');
    if(app)app.replaceChildren();
    const modal=clone.querySelector('.overlay');
    if(modal)modal.remove();
    return '<!DOCTYPE html>\n'+clone.outerHTML;
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-nm-tool]');if(!button)return;
    e.preventDefault();const which=button.dataset.nmTool;
    try{
      if(which==='download'){
        makeFile(documentSource(),'text/html;charset=utf-8','Northmarch_V18_3_Matchday_Echo.html');
        status('De HTML-download is gestart. Open het bestand buiten de embed om te testen.');
      }
      else if(which==='open'){
        const u=URL.createObjectURL(new Blob([documentSource()],{type:'text/html'}));
        const win=window.open(u,'_blank','noopener,noreferrer');
        if(!win)status('Nieuw venster geblokkeerd. Gebruik Download standalone HTML.');
      }
      else if(which==='export'){
        if(!S){status('Er is nog geen spel begonnen.');return}
        makeFile(serialize(),'application/json;charset=utf-8','Northmarch_save_S'+S.season+'_W'+S.week+'.json');
        status('Save-export gestart.');
      }
      else if(which==='import')q('nm-save-import').click();
    }catch(err){status('Niet toegestaan in deze ingebedde browser: '+String(err.message||err)+'. Probeer de pagina in Safari/Chrome te openen.');}
  });
  q('nm-save-import')?.addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;
    try{
      const content=await f.text();JSON.parse(content);deserialize(content);
      UI.title=false;UI.review=null;UI.over=null;UI.tab='week';save();render();
      status('Save geladen. Controleer de Week-tab.');
    }catch(err){status('Deze save kan niet geladen worden: '+String(err.message||err))}
    e.target.value='';
  });
})();
