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
   return`<div class="g-week">${msg}${statusStrip(id)}${S.week===0?promises(id)+preSeason(id):''}${nextMatch(id)}${S.week===0?'':decisions(id)}${lastWeek()}</div>`;
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
   <section class="g-links">${link('Football','Head coach, director, playing style','ctab','football','⚽')}${link('Transfers','Needs, shortlist, window','ctab','window','⇄')}${link('Stadium & facilities','Build, repair, capacity','ctab','ground','▥')}${link('Members & board','Confidence, prices, goals','ctab','members','♜')}${link('History','Past seasons and club growth','ctab','development','⌛')}</section></div>`;
 }
 const oldClub=clubView;
 clubView=function(){if(inGame()&&(!UI.ct||UI.ct==='hub'))return clubHome();return oldClub()};


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
   if(a==='manifest'&&S&&S.my){const [k,n]=String(arg).split(':');const r=cmd('SetManifest',S.my,{k,lv:+n});if(r.ok===false)UI.msg={err:true,text:r.err};save();render();return}
   const mark=S&&S.evn||0;if((a==='play'||a==='playn')&&S&&S.my)UI.gPos=S.week?posOf(S.my):null;
   const r=oldAct(a,arg);
   if(a==='play'||a==='playn'){UI.gEv=S?eventsSince(mark):[];render()}
   if(a==='cont'&&inGame()){UI.v183Stage='preview';UI.tab='week';render()}
   return r;
 };
})();
