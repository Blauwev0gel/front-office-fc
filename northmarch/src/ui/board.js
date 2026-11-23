/* ---- ui/board.js ---- */
/* ================= Screens: the chairman's club — overview and sub-sections, the action bar, orientation =================
   The Club tab is the board room: an overview first, then one sub-section per responsibility
   (football, departments, ground, members). Builds on the parallel overview tiles (commit 590c93b). */
const CLUB_TABS=[['overview','Overview'],['football','Football'],['depts','Departments'],['ground','Ground'],['members','Members']];
/* Club-hub V2: direct access to existing L1/L2 responsibilities. */
const CLUB_HUB_GROUPS=[
  ['Football organisation',[
    ['Club course','Set the direction','ctab','football'],
    ['Trainer & director','Appoint and review','ctab','football'],
    ['Training','Player development','dept','training'],
    ['Medical','Injuries and recovery','dept','medical'],
    ['Academy','Youth development','dept','academy'],
    ['Scouting','Recruitment intelligence','dept','scouting'],
    ['Squad policy','Wages and transfer frame','tobudget','']
  ]],
  ['Club organisation',[
    ['Commercial','Sponsors and sales','dept','commercial'],
    ['Members','Community and AGM','ctab','members'],
    ['Matchday','Operations and atmosphere','dept','matchday'],
    ['Maintenance','Ground and facilities','dept','grounds'],
    ['Stadium','Stands and building','ctab','ground'],
    ['Ticket policy','Prices and attendance','hubmoney','income']
  ]],
  ['Board and finance',[
    ['Budget','Income and spending','hubmoney','budget'],
    ['Funding','Loans and members bonds','hubmoney','funding'],
    ['Projects','Building and progress','hubprojects',''],
    ['Club history','Seasons and records','history','']
  ]]
];
function clubHubTile(item){
  const [name,sub,act,arg]=item;
  let status='';
  if(act==='dept'){const kp=deptKpi(S.my,arg),d=G(S.my).depts[arg];status=(kp.good===true?'Ahead of division':kp.good===false?'Behind division':'Near division average')+' · '+STAFF_WORD[d.staff]+' staff';}
  else if(name==='Members')status=Math.round(M(S.my).conf)+'/100 confidence';
  else if(name==='Stadium')status=n0(groundSignals(S.my).capacity)+' places';
  else if(name==='Projects')status=G(S.my).projects.filter(p=>p.phase!=='done').length+' active';
  else if(name==='Budget')status=k1(F(S.my).cash)+' in the bank';
  return`<button class="hubtile" data-act="${act}" data-arg="${arg}" aria-label="${esc(name)}: ${esc(sub)}"><b>${esc(name)}</b><span>${esc(sub)}</span>${status?`<small>${esc(status)}</small>`:''}</button>`;
}
/* Improvement routes: real decisions, actual engine signals, and direct existing screens. */
const IMPROVEMENT_ROUTES=[
 {id:'squad',title:'Build a stronger squad',why:'Give the director the people and spending room to improve recruitment.',steps:[['Appoint a stronger director','ctab','football'],['Set wage and transfer limits','tobudget',''],['Inspect your squad','tab','squad']],check:'Squad strength, wage bill and transfers over the next windows',when:'Transfer windows and contract renewals'},
 {id:'results',title:'Improve match results',why:'Coaching quality, player fitness and training can influence results without choosing the team yourself.',steps:[['Review your head coach','ctab','football'],['Invest in training','dept','training'],['Reduce injuries','dept','medical']],check:'Match results, player growth and weeks lost to injury',when:'Over subsequent matches and training weeks'},
 {id:'youth',title:'Develop your own talent',why:'Youth staff, the academy and its facilities affect the next generations of players.',steps:[['Strengthen the academy','dept','academy'],['Improve training','dept','training'],['Review youth players','tab','squad']],check:'Youth intake quality and development of young players',when:'Development during the season; new intake in summer'},
 {id:'recruit',title:'Find better players',why:'The scouting department improves the pool of players the director can assess.',steps:[['Improve scouting','dept','scouting'],['Review your director','ctab','football'],['Set recruitment budget','tobudget','']],check:'Director search reach, signings and squad strength',when:'Scouting over time; deals in transfer windows'},
 {id:'income',title:'Grow the money available',why:'Commercial income, attendance and sponsor deals can fund your long-term football plans.',steps:[['Improve commercial operations','dept','commercial'],['Review sponsors','hubmoney','income'],['Set ticket prices','hubmoney','income']],check:'Sponsor income, matchday receipts, cash and season budget',when:'Home matches, weekly income and sponsor contract cycles'},
 {id:'club',title:'Build a sustainable club',why:'Members, ground improvements and disciplined borrowing support growth but have ongoing costs.',steps:[['Grow member support','ctab','members'],['Plan ground improvements','ctab','ground'],['Review financial forecast','hubmoney','overview']],check:'Member confidence, capacity, project progress and cash forecast',when:'Weeks for maintenance and building; seasons for lasting growth'}
];
function improvementRoutes(){
 const id=S.my,sg=groundSignals(id),g=G(id),f=F(id);
 const metrics={
  squad:[['Squad strength',Math.round(teamStrength(id))],['Wage bill / week',k1(wageBillK(id))]],
  results:[['League position',S.week?ord(posOf(id)):'Pre-season'],['Injury weeks',Math.round(S.stats[id].injWeeks||0)]],
  youth:[['Academy staff',g.depts.academy.staff+'/5'],['Training staff',g.depts.training.staff+'/5']],
  recruit:[['Scouting staff',g.depts.scouting.staff+'/5'],['Director',esc(P(C().cast.td).name)]],
  income:[['Cash',k1(f.cash)],['Commercial staff',g.depts.commercial.staff+'/5']],
  club:[['Member confidence',Math.round(M(id).conf)+'/100'],['Ground capacity',n0(sg.capacity)]]
 };
 return`<section class="improve" aria-label="How to improve your club"><div class="improve-intro"><p class="eyebrow">Your choices change the club</p><h3>What do you want to improve?</h3><p class="small muted">Pick a goal. Follow the decisions, then watch the numbers over the coming weeks. No choice guarantees a win.</p></div>
 <div class="improve-grid">${IMPROVEMENT_ROUTES.map(route=>`<button class="improve-choice ${UI.improve===route.id?'selected':''}" data-act="improve" data-arg="${route.id}" aria-expanded="${UI.improve===route.id}"><b>${route.title}</b><span>${route.why}</span><small>${UI.improve===route.id?'Hide decisions':'See decisions →'}</small></button>`).join('')}</div>
 ${IMPROVEMENT_ROUTES.filter(route=>UI.improve===route.id).map(route=>`<div class="improve-detail"><h3>${route.title}</h3><p class="small">${route.why}</p><p class="eyebrow">Your decisions</p><div class="improve-steps">${route.steps.map(([label,act,arg],i)=>`<button data-act="${act}" data-arg="${arg}"><span class="improve-number">${i+1}</span><b>${label}</b><span aria-hidden="true">›</span></button>`).join('')}</div><p class="eyebrow">Current position</p><div class="improve-metrics">${metrics[route.id].map(([label,value])=>`<div><span>${label}</span><b>${value}</b></div>`).join('')}</div><p class="small"><b>When:</b> ${route.when}</p><p class="small"><b>Track:</b> ${route.check}</p><p class="small muted">Trade-off: higher investment uses cash or adds recurring costs. Outcomes also depend on opponents, player quality and chance.</p></div>`).join('')}</section>`;
}
function clubHub(){
  const id=S.my,m=M(id),f=F(id),run=G(id).projects.filter(p=>p.phase!=='done').length;
  return`<div class="hubhead"><p class="eyebrow">The chairman's office</p><h2>Run your club</h2><p class="small muted">Choose a responsibility. Every department and board decision is one tap away.</p></div>
  <div class="panel hubstatus"><div class="row small"><span>League position</span><b>${S.week?ord(posOf(id)):'Pre-season'}</b></div><div class="row small"><span>Cash</span><b>${k1(f.cash)}</b></div><div class="row small"><span>Members' confidence</span><b>${Math.round(m.conf)}/100</b></div>${run?`<p class="small muted">${run} building project${run===1?'':'s'} running</p>`:''}</div>
  <div class="panel"><h3>Grow your club</h3><p class="small muted">Real levels, costs, build times and effects.</p><button class="btn" data-act="tab" data-arg="build">Open club upgrades</button></div>
  ${improvementRoutes()}
  ${CLUB_HUB_GROUPS.map(([title,items])=>`<section class="hubsection"><h3>${title}</h3><div class="hubtiles">${items.map(clubHubTile).join('')}</div></section>`).join('')}
  <button class="btn ghost" data-act="ctab" data-arg="overview">Detailed board overview</button>`;
}

/* V18.4 upgrade dashboard: read existing project catalog; use existing StartProject command. */
const BUILD_GROUPS=[['all','All'],['football','Football'],['revenue','Revenue'],['ground','Stadium']];
const BUILD_FOCUS=[
 ['training','Training ground','football','training','Develop players and slow their decline.'],
 ['medical','Medical centre','football','medical','Help players recover and avoid injuries.'],
 ['academy','Youth academy','football','academy','Develop better youth intakes.'],
 ['scouting','Scouting office','football','scouting','Find and assess more transfer targets.'],
 ['commercial','Club shop','revenue','shop','Improve merchandise and events income.'],
 ['clubhouse','Clubhouse','revenue','community','Grow membership and supporter base.'],
 ['parking','Car park','revenue','access','Make home matches more accessible.']
];
function buildView(){
 const id=S.my,g=G(id),f=F(id),sg=groundSignals(id),cat=projectCatalog(id),active=g.projects.filter(p=>p.phase!=='done'),group=UI.buildGroup||'all',selected=UI.buildChoice,forecast=cashForecast(id);
 const card=(title,description,level,opt,signal)=>{
  const busy=opt&&opt.busy,chosen=opt&&selected===opt.key;
  return '<article class="build-card"><div class="row"><b>'+esc(title)+'</b><span class="pill">'+esc(level)+'</span></div><p class="small muted">'+esc(description)+'</p>'+
  (signal==null?'':'<p class="small">Current contribution: <b>'+signal+'</b></p>')+
  (!opt?'<p class="small muted">No upgrade available at this location.</p>':
  '<p class="small"><b>Next:</b> '+esc(opt.label)+' · '+esc(opt.effect)+'</p><p class="small">'+k1(opt.cost)+' standard estimate · '+opt.weeks+' weeks'+(opt.permit?' + permit':'')+'</p>'+
  (busy?'<p class="small muted">Construction already in progress.</p>':chosen?
  '<div class="build-confirm"><p class="small">Confirm this project? Construction is paid week by week. Delays, permits and overruns are possible. Forecast cash low: '+k1(forecast.minV)+'.</p><div class="row"><button class="btn" data-act="buildgo" data-arg="'+esc(opt.key)+'">Start standard build</button><button class="btn ghost" data-act="buildpick" data-arg="'+esc(opt.key)+'">Cancel</button></div></div>':
  '<button class="btn ghost" data-act="buildpick" data-arg="'+esc(opt.key)+'">Plan upgrade</button>'))+'</article>';
 };
 const cards=[];
 for(const [key,title,grp,signal,description] of BUILD_FOCUS){
  if(group!=='all'&&group!==grp)continue;
  const i=g.plots.findIndex(p=>p.kind===key),p=i>=0?g.plots[i]:null,empty=g.plots.findIndex(p=>!p.kind);
  const projectKey=p?'plot:'+i+':up':empty>=0?'plot:'+empty+':'+key:null;
  const opt=projectKey?cat.find(o=>o.key===projectKey):null;
  cards.push(card(title,description,p?'Level '+p.lv:'Not built',opt,Number.isFinite(sg[signal])?sg[signal]:null));
 }
 if(group==='all'||group==='ground'){
  for(const [key,title,description] of [['fac:access','Turnstiles','Increase licensed capacity.'],['fac:safety','Safety','Unlock legal ground capacity.'],['fac:catering','Catering','Earn more per fan.'],['pitch:lv','Pitch','Improve the playing surface.'],['side:N:ring','North stand','Add supporter places.']]){
   const obj=key.startsWith('fac:')?g.fac[key.split(':')[1]]:key.startsWith('pitch:')?g.pitch:g.sides.N;
   cards.push(card(title,description,key.startsWith('side:')?obj.rings+' rings':'Level '+obj.lv,cat.find(o=>o.key===key),null));
  }
 }
 return '<section class="build-head"><p class="eyebrow">Build your club · Season '+S.season+'</p><h2>Upgrade. Compete. Grow.</h2><p class="small muted">Invest in the existing club systems. Improvements take time, cost money and do not guarantee victories.</p><div class="build-kpis"><div><span>Cash</span><b>'+k1(f.cash)+'</b></div><div><span>Forecast low</span><b>'+k1(forecast.minV)+'</b></div><div><span>Squad strength</span><b>'+Math.round(teamStrength(id))+'</b></div><div><span>League</span><b>'+(S.week?ord(posOf(id)):'Pre-season')+'</b></div></div><div class="row"><button class="btn ghost" data-act="ctab" data-arg="football">Coach & director</button><button class="btn ghost" data-act="ctab" data-arg="depts">Staff & budgets</button></div></section>'+
 '<div class="build-filter">'+BUILD_GROUPS.map(([k,t])=>'<button class="tbtn '+(group===k?'on':'')+'" data-act="buildgroup" data-arg="'+k+'">'+t+'</button>').join('')+'</div>'+
 (UI.msg?'<div class="panel">'+msgLine()+'</div>':'')+
 (active.length?'<section class="panel"><p class="eyebrow">Construction in progress</p>'+active.map(p=>'<div class="build-progress"><b>'+esc(p.label)+'</b><span>'+(p.phase==='permit'?'Permit pending':p.left+' weeks left')+' · '+k1(p.cost)+' committed · '+k1(p.paid)+' paid</span></div>').join('')+'</section>':'')+
 '<div class="build-cards">'+cards.join('')+'</div><section class="panel"><p class="eyebrow">The next step</p><p class="small">Play matches and read The Northmarch Echo to follow consequences. The existing stadium menu has every other construction and repair option.</p><button class="btn ghost" data-act="ctab" data-arg="ground">All construction options</button></section>';
}

function clubView(){
  const t=UI.ct||'hub';
  if(t==='hub')return clubHub();
  const body=t==='football'?footballBody():t==='depts'?deptsView():t==='ground'?`${msgLine()}${groundBody()}`:t==='members'?membersBody():t==='projects'?hubProjectsBody():overviewBody();
  return`<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="hub">← Club management</button></div>${body}`;
}
function hubProjectsBody(){
 const run=G(S.my).projects.filter(p=>p.phase!=='done');
 return`<div class="panel"><p class="eyebrow">Building projects</p>${run.length?run.map(p=>`<div class="row small"><span>${esc(p.label)}</span><b>${p.phase==='permit'?'Permit pending':p.left+' weeks left'}</b></div>`).join(''):'<p class="small muted">No active projects.</p>'}<button class="btn ghost" data-act="ctab" data-arg="ground">Open stadium and building options</button></div>`;
}
function tile(act,arg,label,value,sub,cls){return`<button class="boardtile" data-act="${act}" data-arg="${arg}"><span>${label}</span><b class="${cls||''}">${value}</b><small>${sub}</small></button>`}
function overviewBody(){
  const id=S.my,c=C(),f=F(id),m=M(id),fc=cashForecast(id),sg=groundSignals(id),g=G(id),run=g.projects.filter(p=>p.phase!=='done');
  const goal=m.goals.find(x=>x.k==='league'),coach=P(c.cast.coach),td=P(c.cast.td),risks=signals(id).filter(x=>x.lv>=2).slice(0,3);
  const op=operatingResult(f.season),deptRows=Object.keys(DEPT).map(k=>({k,kp:deptKpi(id,k),d:G(id).depts[k]}));
  const ids=tierIds(c.tier),avg=fn=>ids.reduce((a,i)=>a+fn(i),0)/ids.length;
  const rows=[['Reputation',i=>CL(i).rep,v=>repWord(v)],['Support',i=>CL(i).support,n0],['Capacity',i=>groundSignals(i).capacity,n0],['Squad strength',i=>teamStrength(i),v=>Math.round(v)],['Wage bill /wk',i=>wageBillK(i)*1000,v=>'£'+n0(v)]];
  return`${S.season===1&&S.week<4&&!S.help?onboardCard():''}
  <section class="panel" aria-label="Chairman's overview"><p class="eyebrow">Chairman's overview</p>
  <div class="boardgrid">
    ${tile('tab','table','League',S.week?ord(posOf(id)):'—',goal?`Target: ${goal.target<=2&&c.tier>0?'promotion':ord(goal.target)+' or better'}`:TIER_NAME[c.tier])}
    ${tile('tab','money','Cash',k1(f.cash),`Forecast low ${k1(fc.minV)} · result ${k1(op)}`,f.cash<0||fc.minV<0?'down':'')}
    ${tile('ctab','members',"Members' confidence",`${Math.round(m.conf)}/100`,`AGM today: about ${agmForecast(id)}% for`,m.conf<45?'down':'')}
    ${tile('ctab','football','Football',`${staffStars(staffEstimate(coach.id))}★ coach`,`${esc(coach.name.split(' ').slice(-1)[0])} · director ${staffStars(staffEstimate(td.id))}★`,coach.pro.caretaker?'down':'')}
  </div></section>
  ${risks.length?`<div class="panel"><p class="eyebrow">Board watch</p><div class="stack">${risks.map(x=>`<button class="sig lv${x.lv}" data-act="${x.act}"${x.arg!=null?` data-arg="${x.arg}"`:''}><span>${esc(x.text)}</span><span aria-hidden="true">›</span></button>`).join('')}</div></div>`:'<div class="panel"><p class="eyebrow">Board watch</p><p class="small muted">Nothing urgent. A good week to plan ahead.</p></div>'}
  <div class="panel"><div class="row"><p class="eyebrow">Departments</p><button class="tbtn" data-act="ctab" data-arg="depts">Manage</button></div>
  <div class="deptgrid">${deptRows.map(({k,kp,d})=>`<button class="dmini ${kp.good===true?'ok':kp.good===false?'bad':''}" data-act="dept" data-arg="${k}"><b>${DEPT[k].n.split(' ')[0]}</b><span>${'●'.repeat(d.staff)}${d.hiring?' ↑':''}</span></button>`).join('')}</div>
  <p class="note">Green: ahead of the division. Red: behind. Dots: staff level.</p></div>
  <div class="panel"><div class="row"><p class="eyebrow">Ground and projects</p><button class="tbtn" data-act="ctab" data-arg="ground">Manage</button></div>
  <div class="row small"><span>Capacity</span><b>${n0(sg.capacity)}</b></div><div class="row small"><span>Worst condition</span><b class="${groundCondWorst(id).c<40?'down':''}">${esc(groundCondWorst(id).n)} ${Math.round(groundCondWorst(id).c)}%</b></div>
  ${run.length?run.map(p=>{const tot=p.phase==='permit'?0:Math.round((1-p.left/Math.max(1,p.weeks+p.delay))*100);return`<div class="proj"><span class="small"><b>${esc(p.label)}</b> · ${p.phase==='permit'?'awaiting permit':`${p.left} weeks left`}</span><span class="bar" role="img" aria-label="${tot}% built"><i style="width:${tot}%"></i></span></div>`}).join(''):'<p class="small muted">No building work under way.</p>'}</div>
  ${journalPanel(4)}
  <div class="panel"><p class="eyebrow">Against the ${TIER_NAME[c.tier]}</p><div class="cmp"><span></span><b>Us</b><b>Average</b>${rows.map(([n,fn,fm])=>`<span>${n}</span><b>${fm(fn(id))}</b><b>${fm(avg(fn))}</b>`).join('')}</div></div>
  <div class="panel"><p class="eyebrow">${esc(c.name)}</p><p class="small muted">Founded ${c.founded}. Ground: ${esc(c.ground)}. Rivals: ${nm(c.rival)} (${esc(c.rivalWhy)}). The club once ${esc(c.scar)}.</p>
  <button class="btn ghost" data-act="history">Club history and records</button></div>
  <div class="panel"><p class="eyebrow">Game layers</p><p class="small muted">1 The living world and 2 Club management are on. Staff with their own minds, stories and dynasties come later; the original Northmarch story game stays playable as its own file.</p></div>
  <button class="btn ghost" data-act="quit">Save and back to the title</button>`;
}
function footballBody(){
  const id=S.my,bill=wageBillK(id),cap=wageCapK(id);
  return`${staffPanel()}
  <div class="panel"><p class="eyebrow">The squad</p><div class="row small"><span>Strength</span><b>${Math.round(teamStrength(id))} · ${strWord(id)}</b></div>
  <div class="row small"><span>Wage bill</span><b class="${bill>cap?'down':''}">£${n0(bill*1000)} of £${n0(cap*1000)} a week</b></div><div class="row small"><span>Transfer money now</span><b>${k1(budgetFor(id))}</b></div>
  <p class="small muted">The director signs, sells and renews; you set his frame. Windows: the summer and week ${WINTER_WEEK}.</p>
  <div class="seg"><button data-act="tab" data-arg="squad">See the squad</button><button data-act="tobudget">Set the frame</button></div></div>${recruitPanels()}`;
}
function membersBody(){
  return`${membersPanel()}${targetsPanel()}<div class="panel"><p class="eyebrow">How the AGM works</p><p class="small">After week 30 every club votes on its chairman. Below 50% for, you are out and choose a new club in the same world.</p>
  <p class="small muted">Results against expectation, the season targets, prices, dues, debt, facilities and cup runs all move the members.</p><button class="btn ghost" data-act="history">Your history at the club</button></div>`;
}
/* orientation for a new chairman: what you do, where to find it */
function onboardCard(){
  return`<section class="panel onboard" aria-label="Your job"><p class="eyebrow">Your job as chairman</p><p class="small">You run the club, not the team. The coach picks the side; the director does the deals.</p>
  <div class="boardlinks"><button data-act="ctab" data-arg="football">Appoint the coach and director <span>Football ›</span></button><button data-act="tobudget">Set the budget and the director's frame <span>Money ›</span></button>
  <button data-act="ctab" data-arg="depts">Staff and fund eight departments <span>Departments ›</span></button><button data-act="ctab" data-arg="ground">Build and maintain the ground <span>Ground ›</span></button>
  <button data-act="ctab" data-arg="members">Keep the members behind you <span>Members ›</span></button></div>
  <button class="tbtn" data-act="helpok">Got it</button></section>`;
}
/* the action bar: playing the week is always one tap away */
function actionBar(){
  if(!S||S.phase!=='season'||UI.review||UI.title)return'';
  const over=seasonOver(),w=S.week+1,pre=S.week===0,fx=over?null:fixtureOf(S.my,w),cup=!over&&CUP_WEEKS[S.cup.round]===w&&cupTieOf(S.my);
  const next=over?'All thirty weeks played':fx?`Next: ${fx.home?'v':'at'} ${CL(fx.opp).name}${cup?' + cup tie':''}`:'No league game';
  return`<div class="actbar"><div class="ab-in"><span class="small">${esc(next)}</span><button class="btn" data-act="${over?'close':'play'}">${over?'Close the season':pre?'Close the window · start the season':`Play week ${w}`}</button>${over||pre?'':`<div class="ab-more"><button class="btn ghost" data-act="playn" data-arg="4">Play 4 weeks</button><button class="btn ghost" data-act="playn" data-arg="stop">To the next stop</button></div>`}</div></div>`;
}

