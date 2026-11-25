/* ================= Game shell (UX overhaul, step 1) =================
   One clear loop: THIS WEEK (status, next match, at most three decisions) → PLAY → FULL TIME → next week.
   Four fixed tabs at the bottom: Week · Squad · Club · Table. Money and upgrades live under Club.
   Pure presentation: it reads state and sends the existing actions; no game rules, no new saved state.
   Loaded last, so it sits on top of the older V17–V18.7 layers (those are folded in during step 2). */
(function(){
 const inGame=()=>!!(S&&S.my&&S.phase==='season'&&!UI.title&&!UI.review);
 const TABS=[['week','Week','⌂'],['squad','Squad','⚽'],['club','Club','♜'],['table','Table','▤']];
 const tabOf=t=>t==='money'||t==='build'?'club':t;
 const issues=()=>S.v183&&S.v183.club===S.my&&Array.isArray(S.v183.issues)?S.v183.issues:[];
 const signed=v=>(v>0?'+':'')+k1(v);

 /* ----- the header: who, when, money ----- */
 const oldTopBar=topBar;
 topBar=function(){
   if(!inGame())return oldTopBar();
   const c=C(),cash=F(S.my).cash;
   return`<header class="g-top">${crest}<div class="g-id"><b>${esc(c.name)}</b><span>${S.week?'Week '+S.week+' of '+SEASON_WEEKS:'Pre-season'} · ${esc(TIER_NAME[c.tier])}</span></div><span class="g-cash ${cash<0?'bad':''}" aria-label="Cash">${k1(cash)}</span></header>`;
 };

 /* ----- the bottom: one play button on the week screen, four tabs everywhere ----- */
 const oldActionBar=actionBar;
 actionBar=function(){
   if(!inGame())return oldActionBar();
   const stage=UI.v183Stage||'preview',over=seasonOver(),pre=S.week===0;
   let play='';
   if(UI.tab==='week'&&stage==='preview')play=`<button class="btn g-play" data-act="${over?'close':'play'}">${over?'Finish the season ›':pre?'▶ Start the season':'▶ Play week '+(S.week+1)}</button>`;
   else if(UI.tab==='week'&&stage!=='preview')play=`<button class="btn g-play" data-act="v183ready">Next week ›</button>`;
   const nav=TABS.map(([k,n,i])=>`<button class="${tabOf(UI.tab)===k?'on':''}" data-act="${k==='week'?'nm85home':'tab'}" data-arg="${k}" aria-current="${tabOf(UI.tab)===k?'page':'false'}"><span aria-hidden="true">${i}</span>${n}</button>`).join('');
   return`<div class="g-bottom">${play}<nav class="g-nav" aria-label="Sections">${nav}</nav></div>`;
 };

 /* ----- THIS WEEK ----- */
 function statusStrip(id){
   const m=M(id),pos=S.week?ord(posOf(id)):'—';
   const cell=(k,v,w)=>`<div><small>${k}</small><b>${v}</b><span>${esc(w)}</span></div>`;
   return`<section class="g-status" aria-label="Your club at a glance">${cell('League',pos,S.week?(S.tbl[id]?.pts||0)+' pts':'Not started')}${cell('Squad',Math.round(teamStrength(id)),strWord(id))}${cell('Money',k1(F(id).cash),moneyWord(id))}${cell('Members',Math.round(m.conf),m.conf>=60?'Behind you':m.conf>=40?'Watching':'Restless')}</section>`;
 }
 function nextMatch(id){
   if(seasonOver())return`<section class="g-card g-match"><small class="g-k">SEASON COMPLETE</small><h2>All ${SEASON_WEEKS} weeks played</h2><p>Finish the season to see the final table, the accounts and the members' verdict.</p></section>`;
   const w=S.week+1,fx=fixtureOf(id,w),cup=CUP_WEEKS[S.cup.round]===w&&cupTieOf(id);
   if(!fx)return`<section class="g-card g-match"><small class="g-k">WEEK ${w}</small><h2>No league game</h2><p>The club still runs: wages, gates elsewhere and the market move on.</p></section>`;
   const opp=fx.opp,ours=teamStrength(id),theirs=teamStrength(opp),d=ours-theirs+(fx.home?1:-1);
   const odds=d>2?'You should win this':d>.5?'Slight favourites':d>-.5?'Too close to call':d>-2?'They are favourites':'A hard afternoon';
   const form=(S.tbl[id]?.form||[]).slice(-5).map(r=>`<i class="f${r}">${r}</i>`).join('')||'<span class="muted">No games yet</span>';
   return`<section class="g-card g-match"><small class="g-k">NEXT MATCH · WEEK ${w}${cup?' · CUP TIE TOO':''}</small>
   <h2>${fx.home?'vs':'at'} ${esc(CL(opp).name)}</h2><p>${fx.home?'Home':'Away'} · ${esc(odds)} · ${ord(posOf(opp))} in the table</p><div class="g-form" aria-label="Last five results">${form}</div></section>`;
 }
 /* what the staff did this week, and what to keep an eye on (no approvals: the staff act within their authority) */
 function decisions(id){
   const notes=staffWeekNotes(id,S.season,S.week);
   const done=notes.length?`<section class="g-card g-done"><h3>Done by your staff</h3><ul class="g-news">${notes.map(n=>`<li>${esc(n.text)}${n.cost?` <span class="muted">£${n.cost}k</span>`:''}</li>`).join('')}</ul></section>`:'';
   const watch=signals(id).sort((a,b)=>b.lv-a.lv).slice(0,2);
   const sig=watch.map(x=>`<button class="g-dec lv${x.lv}" data-act="${esc(x.act)}"${x.arg!=null?` data-arg="${esc(String(x.arg))}"`:''}><span class="g-dot" aria-hidden="true"></span><span>${esc(x.text)}</span><b aria-hidden="true">›</b></button>`).join('');
   return`${promises(id)}${done}${sig?`<section class="g-decide"><h3>Keep an eye on</h3>${sig}</section>`:''}`;
 }
 /* the manifest: three promises, chosen in the pre-season, judged at the AGM */
 function promiseOdds(id,g){
   if(g.k==='league'){const e=CL(id).expect||8;return g.target>=e+2?'Likely':g.target>=e?'Even chance':'Long shot'}
   return['Likely','Even chance','Long shot'][g.lv??1];
 }
 function promises(id){
   const m=M(id);if(!m.goals)return'';const pre=S.week===0;
   const rows=m.goals.map(g=>{const pr=goalProgress(id,g),lv=g.lv??1;
     const pick=pre?`<div class="g-seg g-seg3" role="group" aria-label="${esc(g.k)} promise">${MANIFEST_WORD.map((w,i)=>`<button class="${lv===i?'on':''}" data-act="manifest" data-arg="${g.k}:${i}" aria-pressed="${lv===i}">${w}</button>`).join('')}</div>`:'';
     return`<li class="${pre?'':pr.met?'on':'off'}"><div><b>${esc(g.text)}</b><span>${pre?`${promiseOdds(id,g)} · met +${g.w} confidence, missed −${g.w}`:`${esc(pr.text)} · ${pr.met?'on track':'behind'}`}</span></div>${pick}</li>`}).join('');
   return`<section class="g-card g-promise"><small class="g-k">${pre?'YOUR MANIFEST · CHOOSE HOW BOLD':'YOUR PROMISES TO THE MEMBERS'}</small>${pre?'<p>The members judge you on these at the AGM. Bolder promises win more trust, and cost as much when missed.</p>':''}<ul>${rows}</ul></section>`;
 }
 function lastWeek(){
   const is=issues().at(-1);if(!is||!is.matches?.length)return'';const m=is.matches[0];
   return`<button class="g-last" data-act="v183paper" data-arg="${esc(is.key)}"><small class="g-k">LAST WEEK</small><span><b>${esc(m.home)} ${m.hg}–${m.ag} ${esc(m.away)}</b></span><span class="muted">Read the Echo ›</span></button>`;
 }
 function weekScreen(){
   const id=S.my;
   const msg=UI.msg?`<p class="g-msg ${UI.msg.err?'err':''}" role="status">${esc(UI.msg.text)}</p>`:'';UI.msg=null;
   return`<div class="g-week">${msg}${momentCard()}${statusStrip(id)}${S.week===0?promises(id)+preSeason(id):''}${nextMatch(id)}${yourWeek(id)}${S.week===0?'':decisions(id)}${worldCard(id)}${lastWeek()}</div>`;
 }


 /* ----- PRE-SEASON: what it is, what the director will do, what you control ----- */
 function preSeason(id){
   const ops=S.ops||{plan:{needs:[]},shortlist:[]},needs=(ops.plan.needs||[]).filter(n=>n.status==='open').slice(0,4);
   const watch=(ops.shortlist||[]).filter(e=>e.status==='watching').sort((a,b)=>b.est-a.est).slice(0,5),strat=recruitStrategy(id);
   const needList=needs.length?needs.map(n=>`<li><b>${esc(POS_ONE[n.pos]||n.pos)}</b> · ${esc(n.why)}</li>`).join(''):'<li>No gaps: the squad is complete.</li>';
   const watchList=watch.length?watch.map(e=>`<li><span><b>${esc(e.name)}</b> · ${esc(POS_ONE[e.pos]||e.pos)}, ${e.age}${e.from?' · '+nm(e.from):' · free agent'}</span><em>${r1(e.est)} ±${scoutRange(id,e.obs)}</em></li>`).join(''):'<li>The scouts have not reported yet.</li>';
   return`<section class="g-card g-pre"><small class="g-k">PRE-SEASON · THE TRANSFER WINDOW IS OPEN</small>
   <h2>Your director will shop when you start</h2><p>You set the frame below. Pressing Start closes the window: the director signs and sells for you, and the season begins.</p>
   <h3>What the squad needs</h3><ul class="g-list">${needList}</ul>
   <h3>Being scouted <small>quality estimate ± doubt</small></h3><ul class="g-list g-scout">${watchList}</ul>
   <p class="g-hint">Better scouting staff see more players and doubt less. Your squad's average quality is ${r1(squadQuality(S.squads[id]))}.</p>
   <h3>Your frame</h3><div class="g-frame"><div><small>Transfer budget</small><b>${k1(budgetFor(id))}</b></div><div><small>Wage limit</small><b>${k1(wageCapK(id))}/wk</b></div></div>
   <div class="g-seg" role="group" aria-label="Recruitment strategy">${Object.keys(RECRUIT).map(k=>`<button class="${strat===k?'on':''}" data-act="recruit" data-arg="${k}" aria-pressed="${strat===k}">${esc(RECRUIT[k].n)}</button>`).join('')}</div>
   <p class="g-hint">${esc(RECRUIT[strat].d)}. Budget and wages are set under Club → Money.</p></section>`;
 }
 /* deals done since the last press of Play: shown at full time, so the window has a visible result */
 function dealsCard(evs){
   const id=S.my,ins=evs.filter(e=>(e.t==='Transfer'||e.t==='Signing')&&e.c===id),outs=evs.filter(e=>e.t==='Transfer'&&e.c2===id),rel=evs.filter(e=>e.t==='Released'&&e.c===id);
   if(!ins.length&&!outs.length&&!rel.length)return'';
   const li=(e,k)=>`<li><span class="g-tag ${k}">${{in:'IN',out:'OUT',rel:'LET GO'}[k]}</span> ${esc(e.text)}</li>`;
   return`<section class="g-card"><h3>Transfers this week</h3><ul class="g-news g-deals">${ins.map(e=>li(e,'in')).join('')}${outs.map(e=>li(e,'out')).join('')}${rel.map(e=>li(e,'rel')).join('')}</ul></section>`;
 }

 /* ----- FULL TIME: the payoff of a week ----- */
 function fullTime(){
   const is=issues().at(-1);if(!is)return weekScreen();
   const m=is.matches[0],id=S.my,before=UI.gPos,now=is.position,move=before&&now?before-now:0;
   const mine=m?(m.h===id?[m.hg,m.ag]:[m.ag,m.hg]):null,res=!mine?'':m.pens?(m.pens===id?'W':'L'):mine[0]>mine[1]?'W':mine[0]<mine[1]?'L':'D';
   const word={W:'WIN',D:'DRAW',L:'DEFEAT'}[res]||'FULL TIME';
   const news=(is.clubNews||[]).slice(0,3).map(n=>`<li>${esc(n.text)}</li>`).join('');
   return`<div class="g-ft r${res}">
   <small class="g-k">FULL TIME · WEEK ${is.w}</small><p class="g-res">${word}</p>
   ${m?`<div class="g-score"><span>${esc(m.home)}</span><b>${m.hg}–${m.ag}</b><span>${esc(m.away)}</span></div><h2>${esc(m.headline)}</h2>`:'<h2>No match for us this week</h2>'}
   <section class="g-delta"><div><small>Table</small><b>${now?ord(now):'—'}</b><span>${move>0?'▲ up '+move:move<0?'▼ down '+(-move):'No change'}</span></div><div><small>This week</small><b class="${is.net<0?'bad':'good'}">${signed(is.net)}</b><span>net</span></div><div><small>Cash</small><b>${k1(is.cash)}</b><span>in the bank</span></div></section>
   ${dealsCard(UI.gEv||[])}${news?`<section class="g-card"><h3>At the club</h3><ul class="g-news">${news}</ul></section>`:''}
   <div class="g-more">${m?'<button class="btn ghost" data-act="watch" data-arg="0">▶ Watch the match</button>':''}<button class="btn ghost" data-act="v183paper" data-arg="${esc(is.key)}">Read the Echo</button></div></div>`;
 }

 const oldWeek=weekView;
 weekView=function(){
   if(!inGame())return oldWeek();
   const stage=UI.v183Stage||'preview';
   if(stage==='result'&&S.week>0)return fullTime();
   if(stage==='preview')return weekScreen();
   return oldWeek(); /* the Echo paper and its archive stay as they are */
 };


 /* ----- CLUB: one calm overview instead of three long lists ----- */
 function clubHome(){
   const id=S.my,f=F(id),dbt=debt(id),wb=wageBillK(id),cap=wageCapK(id),net=operatingResult(f.season||{}),g=G(id);
   const money=`<button class="g-card g-money" data-act="hubmoney" data-arg="overview"><small class="g-k">MONEY</small>
     <div class="g-mrow"><div><b>${k1(f.cash)}</b><span>in the bank${dbt?' · '+k1(dbt)+' debt':''}</span></div><div><b class="${net<0?'bad':'good'}">${signed(net)}</b><span>this season</span></div></div>
     <div class="bar" role="img" aria-label="Wages against the limit"><i style="width:${Math.min(100,Math.round(wb/Math.max(.01,cap)*100))}%"></i></div><span class="g-sub">Wages ${k1(wb)} of ${k1(cap)} a week · Finances ›</span></button>`;
   const dots=n=>'●'.repeat(n)+'○'.repeat(5-n);
   const depts=Object.keys(DEPT).map(k=>{const d=g.depts[k];return`<button class="g-dept" data-act="dept" data-arg="${k}"><b>${esc(DEPT[k].n)}</b><small class="g-does">${esc(DEPT[k].does.split('. ').slice(1).join('. ').replace(/\.$/,'')||DEPT[k].does)}</small><span class="g-dots" aria-label="${d.staff} of 5 staff">${dots(d.staff)}</span><small>${d.hiring?'Hiring…':esc(d.budget)+' budget'}</small></button>`}).join('');
   const link=(t,sub,a,arg,i)=>`<button class="g-link" data-act="${a}" data-arg="${arg}"><span class="g-ic" aria-hidden="true">${i}</span><span><b>${t}</b><small>${sub}</small></span><em aria-hidden="true">›</em></button>`;
   return`<div class="g-week">${money}
   <section><h3 class="g-h">Departments</h3><p class="g-hint">Each department has three dials: staff (●), budget and a focus. Tap one to change them and to see what it delivers.</p><div class="g-depts">${depts}</div></section>
   <section class="g-links">${link('Football','Head coach, director, playing style','ctab','football','⚽')}${link('Scouting dossier','Players you found around the world','ctab','dossier','✈')}${link('Transfers','Needs, shortlist, window','ctab','window','⇄')}${link('Stadium & facilities','Build, repair, capacity','ctab','ground','▥')}${link('Members & board','Confidence, prices, goals','ctab','members','♜')}${link('Family & legacy','Your family, heir, era, legends','ctab','legacy','★')}${link('History & growth','Season by season, records, money','ctab','development','⌛')}</section></div>`;
 }

 /* ----- LEGACY: the dynasty, what lasts ----- */
 function legacyView(){
   const id=S.my,c=C(),lc=S.legacy&&S.legacy.clubs[id],era=lc?lc.era:[],hon=honours(id),L=S.legacy||{kept:0,made:0};
   const best=era.length?era.slice().sort((a,b)=>a.tier-b.tier||a.pos-b.pos)[0]:null,troph=era.filter(e=>e.champs||e.cup).length,ups=era.filter(e=>e.promoted).length;
   const cell=(k,v,w)=>`<div><small>${k}</small><b>${v}</b><span>${esc(w)}</span></div>`;
   const eraCard=`<section class="g-card"><small class="g-k">YOUR ERA AT ${esc(c.name.toUpperCase())}</small>
     <section class="g-delta">${cell('Seasons',era.length,era.length?'S'+era[0].s+'–S'+era[era.length-1].s:'first season')}${cell('Best',best?ord(best.pos):'—',best?TIER_NAME[best.tier]:'not yet')}${cell('Trophies',troph,ups?ups+' promotion'+(ups>1?'s':''):'none yet')}</section>
     ${era.length?`<ul class="g-era">${era.slice().reverse().map(e=>`<li><b>S${e.s}</b><span>${ord(e.pos)} · ${esc(TIER_NAME[e.tier])}${e.champs?' · 🏆 champions':e.promoted?' · ▲ promoted':e.relegated?' · ▼ relegated':''}${e.cup?' · 🏆 cup':''}</span><em>${e.met}/${e.total} promises</em></li>`).join('')}</ul>`:'<p class="g-hint">Your first season is still being written. Every season you finish is kept here.</p>'}</section>`;
   const honoursCard=`<section class="g-card"><small class="g-k">HONOURS BOARD · ALL TIME</small>${hon.titles.length||hon.cups.length?`<ul class="g-news">${hon.titles.map(t=>`<li>🏆 ${esc(TIER_NAME[t.tier])} champions, season ${t.s}</li>`).join('')}${hon.cups.map(x=>`<li>🏆 ${esc(CUP_NAME)}, season ${x}</li>`).join('')}</ul>`:'<p class="g-hint">The board is empty. The first name on it could be yours.</p>'}</section>`;
   const lg=legends(id);
   const legCard=`<section class="g-card"><small class="g-k">CLUB LEGENDS · MOST APPEARANCES</small>${lg.length?`<ul class="g-era">${lg.map((r,i)=>`<li><b>${i+1}</b><span>${esc(r.name)}${r.academy?' <i class="g-tag in">ACADEMY</i>':''}<br><small class="muted">${esc(POS_ONE[r.pos]||r.pos)} · S${r.first}–S${r.last}</small></span><em>${r.apps} apps · ${r.goals} goals</em></li>`).join('')}</ul>`:'<p class="g-hint">Legends are made over seasons: appearances are counted from the end of your first season.</p>'}</section>`;
   const ay=typeof academyYield==='function'&&S.youth?academyYield(10):null;
   const acad=ay&&ay.n?`<section class="g-card"><small class="g-k">YOUR ACADEMY</small><p>${ay.n} graduates, ${ay.regulars} became regulars, £${ay.fees}k in fees.</p></section>`:'';
   const career=`<section class="g-card"><small class="g-k">YOUR CAREER</small><p><b>${esc(repWord())}</b> · promises kept ${L.kept} of ${L.made}</p><ul class="g-news">${S.career.map(cr=>`<li>${nm(cr.club)} · S${cr.from}${cr.to?'–'+cr.to:'–now'}${cr.why?` · <span class="muted">${esc(cr.why)}</span>`:''}</li>`).join('')}</ul><p class="g-hint">Your reputation follows you: a chairman who keeps his word gets better clubs and more patience.</p></section>`;
   return`<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="hub">← Club</button></div><div class="g-week">${familyCard()}${eraCard}${honoursCard}${legCard}${acad}${career}</div>`;
 }
 /* ----- the living world: what happened elsewhere this week ----- */
 function worldCard(id){
   const t=CL(id).tier,tbl=standings(t),lead=tbl[0],gap=S.week?S.tbl[lead].pts-S.tbl[id].pts:0;
   const news=(S.worldLog||[]).filter(x=>x.s===S.season&&x.w===S.week&&x.c!==id).sort((a,b)=>b.priority-a.priority).slice(0,3);
   const race=S.week?(lead===id?`You lead ${esc(TIER_NAME[t])}.`:`${nm(lead)} lead ${esc(TIER_NAME[t])}, ${gap} point${gap===1?'':'s'} ahead of you.`):'';
   if(!race&&!news.length)return'';
   return`<section class="g-card g-world"><small class="g-k">AROUND THE NORTHMARCH</small>${race?`<p><b>${race}</b></p>`:''}${news.length?`<ul class="g-news">${news.map(n=>`<li>${esc(n.text)}</li>`).join('')}</ul>`:''}</section>`;
 }


 /* ----- the family moment: the story asks you, once in a while ----- */
 function momentCard(){
   const F_=S.family,mo=F_&&F_.moment;if(!mo)return'';const left=MOMENT_DEADLINE-(famNow()-mo.at),d=mo.dflt<0?mo.opts.length-1:mo.dflt;
   return`<article class="g-moment"><small class="g-k">A FAMILY MOMENT · ${esc(mo.who.toUpperCase())}</small><h2>${esc(mo.title)}</h2><p>${esc(mo.text)}</p>
   ${mo.opts.map((o,i)=>`<button class="g-opt" data-act="famchoose" data-arg="${i}"><b>${esc(o.label)}</b><span>${esc(o.sub)}</span></button>`).join('')}
   <p class="g-hint">If you say nothing for ${left} more week${left===1?'':'s'}: “${esc(mo.opts[d].label)}”.</p></article>`;
 }
 function familyCard(){
   if(!S.family)return'';const F_=S.family,heir=F_.heir;
   const face=m=>`<li class="${m.rel==='you'?'me':''}"><span class="g-face" aria-hidden="true">${esc(m.first[0])}</span><span><b>${esc(m.first)} ${esc(F_.surname)}</b>${m.id===heir?' <i class="g-tag in">HEIR</i>':''}<br><small class="muted">${esc({you:'You, the chairman',partner:'Partner',child:'Child',elder:'Former chairman'}[m.rel]||m.rel)} · ${m.age} · ${esc(m.traits.join(', '))}${m.job?' · runs '+esc(m.job):m.path==='academy'?' · in the academy':m.path==='business'?' · in business':m.path==='away'?' · away from the club':''}</small></span></li>`;
   const book=F_.book.map(b=>`<li><b>G${b.gen}</b><span>${esc(b.first)} ${esc(F_.surname)}</span><em>S${b.from}${b.to?'–'+b.to:'–now'}${b.why?' · '+esc(b.why):''}</em></li>`).join('');
   const log=F_.log.slice(-4).reverse().map(x=>`<li>S${x.s} W${x.w} · ${esc(x.text)}</li>`).join('');
   return`<section class="g-card"><small class="g-k">THE ${esc(F_.surname.toUpperCase())} FAMILY · GENERATION ${F_.gen}</small><ul class="g-fam">${F_.members.filter(m=>m.alive).map(face).join('')}</ul>
   <h3 class="g-h">Dynasty book</h3><ul class="g-era">${book}</ul>${log?`<h3 class="g-h">Lately</h3><ul class="g-news">${log}</ul>`:''}</section>`;
 }


 /* ----- YOUR WEEK: where the chairman spends his time ----- */
 const gemLine=(g,btn)=>`<li class="g-gem"><div><b>${esc(g.name)}</b> <small class="muted">${esc(POS_ONE[g.pos]||g.pos)}, ${g.age} · ${g.from?nm(g.from):'free agent'}</small><span>Now ~${g.est} · ceiling ~${g.pot}${g.fee?` · £${g.fee}k${g.fee>budgetFor(S.my)?' (over budget)':''}`:' · free'}${g.cheap>0?` · ${g.cheap}% under value`:''}</span></div>${btn?g.status==='found'?`<button class="btn ghost" data-act="chairrec" data-arg="${esc(g.pid)}">Recommend</button>`:`<em>${g.status==='gone'&&g.to?'Joined '+nm(g.to):esc({recommended:'With the director',signed:'Signed ✓',gone:'Gone'}[g.status]||g.status)}</em>`:''}</li>`;
 function yourWeek(id){
   const R=UI.trip;if(R&&R.w===scNow())return tripResult(R);
   if(chairBusy())return'';
   if(UI.pickRegion)return`<section class="g-card"><small class="g-k">WHERE DO YOU GO?</small><div class="g-regions">${Object.entries(REGIONS).map(([k,r])=>{const v=SC().visits[k]||0;return`<button class="g-opt" data-act="chairtrip" data-arg="${k}"><b>${esc(r.n)}${v?` <small class="muted">· visited ${v}×</small>`:''}</b><span>${esc(r.d)} £${r.cost}k travel.</span></button>`}).join('')}</div><button class="btn ghost" data-act="chairback">Back</button></section>`;
   return`<section class="g-card g-yw"><small class="g-k">YOUR WEEK · WHERE DO YOU SPEND YOUR TIME?</small><div class="g-acts">
   <button class="g-act" data-act="chairpick"><span aria-hidden="true">✈</span><b>Scouting trip</b><small>With your head scout, to a region</small></button>
   <button class="g-act" data-act="chairtour"><span aria-hidden="true">★</span><b>Youth tournament</b><small>Fifteen-year-olds for the academy</small></button>
   <button class="g-act" data-act="chairdata"><span aria-hidden="true">▤</span><b>Data day</b><small>Who plays above their price?</small></button>
   <button class="g-act" data-act="chairhome"><span aria-hidden="true">⌂</span><b>At the club</b><small>Be seen by members and staff</small></button></div>
   <p class="g-hint">You never sign anyone. You find players and recommend them; the director decides within his mandate.</p></section>`;
 }
 function tripResult(R){
   if(R.kind==='home')return`<section class="g-quiet"><b>A day at the club.</b> The members noticed (+1 confidence).</section>`;
   if(R.kind==='tour')return`<section class="g-card"><small class="g-k">YOUTH TOURNAMENT · WHAT YOU SAW</small><ul class="g-list g-gems">${R.found.map(p=>{const pr=SC().prospects.find(x=>x.id===p.id)||p;return`<li class="g-gem"><div><b>${esc(pr.name)}</b> <small class="muted">${esc(POS_ONE[pr.pos])}, 15</small><span>Your academy staff see a ceiling of ~${pr.seen}</span></div>${pr.status==='seen'?`<button class="btn ghost" data-act="chairinvite" data-arg="${pr.id}">Invite</button>`:`<em>Invited for the summer</em>`}</li>`}).join('')}</ul><p class="g-hint">Invited players choose next summer: a better academy and a bigger name convince more of them.</p></section>`;
   const gems=R.found.map(g=>SC().gems.find(x=>x.pid===g.pid)||g);
   return`<section class="g-card"><small class="g-k">${R.kind==='data'?'THE ANALYST’S LIST':'SCOUTING TRIP · '+esc(R.region.toUpperCase())}</small>${gems.length?`<ul class="g-list g-gems">${gems.map(g=>gemLine(g,true)).join('')}</ul>`:(R.none?'<p>Nobody good enough and affordable here right now.</p>':'<p>Nobody new worth reporting. This region has been fished out for now.</p>')}${R.thin&&gems.length?'<p class="g-hint">You have been here before this season: fewer new names.</p>':''}<p class="g-hint">Estimates come from your scouting department: better scouts, less doubt.</p></section>`;
 }
 function dossierView(){
   const A=S.scout||{gems:[],prospects:[]},gems=A.gems.slice().reverse();
   const pros=A.prospects.filter(p=>p.status!=='seen').slice().reverse();
   return`<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="hub">← Club</button></div><div class="g-week">
   <section class="g-card"><small class="g-k">YOUR DOSSIER · PLAYERS YOU FOUND</small>${gems.length?`<ul class="g-list g-gems">${gems.map(g=>gemLine(g,true)).join('')}</ul>`:'<p class="g-hint">Empty. Go on a scouting trip or spend a day with the data analyst.</p>'}</section>
   ${pros.length?`<section class="g-card"><small class="g-k">ACADEMY INVITATIONS</small><ul class="g-news">${pros.map(p=>`<li>${esc(p.name)} (${esc(POS_ONE[p.pos])}) · ${esc({invited:'invited for the summer',joined:'joined the academy ✓',declined:'chose another academy'}[p.status]||p.status)}</li>`).join('')}</ul></section>`:''}</div>`;
 }

 const oldClub=clubView;
 clubView=function(){if(inGame()&&UI.ct==='legacy')return legacyView();if(inGame()&&UI.ct==='dossier')return dossierView();if(inGame()&&(!UI.ct||UI.ct==='hub'))return clubHome();return oldClub()};


 /* ----- SEASON END: a report card first, the full review folded below ----- */
 const oldReview=reviewView;
 reviewView=function(){
   const full=oldReview(),h=UI.review;if(!h||!S)return full;
   const id=h.agm?h.agm.club:S.my,c=CL(id),last=c.hist[c.hist.length-1],mv=h.moves.find(m=>m.id===id),fh=F(id).hist[F(id).hist.length-1],out=h.agm&&h.agm.out;
   if(!last||!fh)return full;
   const champs=h.tables[last.tier]&&h.tables[last.tier][0]===id;
   const verdict=out?'Voted out':champs?'Champions':mv?(mv.to<mv.from?'Promoted':'Relegated'):'Season complete';
   const tone=out||(mv&&mv.to>mv.from)?'L':champs||(mv&&mv.to<mv.from)?'W':'D';
   const op=operatingResult(fh.lines),goals=h.agm&&h.agm.goals||[],met=goals.filter(g=>g.met).length;
   const btn=(full.match(/<button class="btn"[^>]*data-act="[^"]+"[^>]*>[^<]*<\/button>(?![\s\S]*<button class="btn"[^>]*data-act)/)||[''])[0];
   return`<main class="scene"><div class="g-ft r${tone}"><small class="g-k">SEASON ${h.s} · ${esc(c.name)}</small><p class="g-res">${esc(verdict.toUpperCase())}</p>
   <h2>${ord(last.pos)} in ${esc(TIER_NAME[last.tier])}${h.cup===id?' · cup winners':''}</h2>
   <section class="g-delta"><div><small>Points</small><b>${last.pts}</b><span>league</span></div><div><small>Money</small><b class="${op<0?'bad':'good'}">${signed(op)}</b><span>operating result</span></div><div><small>Members</small><b>${h.agm?h.agm.for+'%':'—'}</b><span>${h.agm?'voted for you':'no vote'}</span></div></section>
   ${goals.length?`<section class="g-card"><h3>Targets: ${met} of ${goals.length} met</h3><ul class="g-news">${goals.map(g=>`<li>${g.met?'✓':'✗'} ${esc(g.text)}</li>`).join('')}</ul></section>`:''}
   ${btn}</div><details class="g-full"><summary>Full season review</summary>${full.replace(/^<main[^>]*>|<\/main>\s*$/g,'')}</details></main>`;
 };

 const oldAct=act;
 act=function(a,arg){
   if(a==='chairpick'){UI.pickRegion=true;render();return}
   if(a==='chairback'){UI.pickRegion=false;render();return}
   if(['chairtrip','chairtour','chairdata','chairhome'].includes(a)&&S&&S.my){const id=S.my,r=a==='chairtrip'?chairTrip(id,arg):a==='chairtour'?chairTournament(id):a==='chairdata'?chairData(id):chairHome(id);
     UI.pickRegion=false;if(r.ok===false)UI.msg={err:true,text:r.err};else UI.trip={...r,kind:{chairtrip:'trip',chairtour:'tour',chairdata:'data',chairhome:'home'}[a],w:scNow()};save();render();return}
   if(a==='chairrec'&&S&&S.my){const r=chairRecommend(S.my,arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:`Recommended. The director will weigh him when he looks for a ${POS_ONE[r.pos]}.`};save();render();return}
   if(a==='chairinvite'&&S&&S.my){const r=chairInvite(S.my,arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:'Invited. He will decide next summer.'};save();render();return}
   if(a==='famchoose'&&S&&S.my){const r=familyChoose(+arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.note||'Decided.'};save();render();return}
   if(a==='manifest'&&S&&S.my){const [k,n]=String(arg).split(':');const r=cmd('SetManifest',S.my,{k,lv:+n});if(r.ok===false)UI.msg={err:true,text:r.err};save();render();return}
   const mark=S&&S.evn||0;if((a==='play'||a==='playn')&&S&&S.my)UI.gPos=S.week?posOf(S.my):null;
   const r=oldAct(a,arg);
   if(a==='play'||a==='playn'){UI.gEv=S?eventsSince(mark):[];render()}
   if(a==='cont'&&inGame()){UI.v183Stage='preview';UI.tab='week';render()}
   return r;
 };
})();
