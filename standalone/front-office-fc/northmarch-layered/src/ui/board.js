/* ================= Screens: the chairman's club — overview and sub-sections, the action bar, orientation =================
   The Club tab is the board room: an overview first, then one sub-section per responsibility
   (football, departments, ground, members). Builds on the parallel overview tiles (commit 590c93b). */
const CLUB_TABS=[['overview','Overview'],['football','Football'],['depts','Departments'],['ground','Ground'],['members','Members']];
/* Club-hub V2: direct access to existing L1/L2 responsibilities. */
const CLUB_HUB_GROUPS=[
  ['Football organisation',[
    ['Trainer & director','Appoint and review','staff','coach'],
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
function clubHub(){
  const id=S.my,m=M(id),f=F(id),run=G(id).projects.filter(p=>p.phase!=='done').length;
  return`<div class="hubhead"><p class="eyebrow">The chairman's office</p><h2>Run your club</h2><p class="small muted">Choose a responsibility. Every department and board decision is one tap away.</p></div>
  <div class="panel hubstatus"><div class="row small"><span>League position</span><b>${S.week?ord(posOf(id)):'Pre-season'}</b></div><div class="row small"><span>Cash</span><b>${k1(f.cash)}</b></div><div class="row small"><span>Members' confidence</span><b>${Math.round(m.conf)}/100</b></div>${run?`<p class="small muted">${run} building project${run===1?'':'s'} running</p>`:''}</div>
  ${CLUB_HUB_GROUPS.map(([title,items])=>`<section class="hubsection"><h3>${title}</h3><div class="hubtiles">${items.map(clubHubTile).join('')}</div></section>`).join('')}
  <button class="btn ghost" data-act="ctab" data-arg="overview">Detailed board overview</button>`;
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
  <div class="seg"><button data-act="tab" data-arg="squad">See the squad</button><button data-act="tobudget">Set the frame</button></div></div>`;
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
  const over=seasonOver(),w=S.week+1,fx=over?null:fixtureOf(S.my,w),cup=!over&&CUP_WEEKS[S.cup.round]===w&&cupTieOf(S.my);
  const next=over?'All thirty weeks played':fx?`Next: ${fx.home?'v':'at'} ${CL(fx.opp).name}${cup?' + cup tie':''}`:'No league game';
  return`<div class="actbar"><div class="ab-in"><span class="small">${esc(next)}</span><button class="btn" data-act="${over?'close':'play'}">${over?'Close the season':`Play week ${w}`}</button></div></div>`;
}
