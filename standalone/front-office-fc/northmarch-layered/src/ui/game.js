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
   const P_=pre?PRE():null;
   if(UI.tab==='week'&&stage==='preview'&&P_&&!P_.brief)play=`<button class="btn g-play" data-act="briefsign">✍ Sign the summer brief</button>`;
   else if(UI.tab==='week'&&stage==='preview'&&P_&&P_.wk<=PRE_WEEKS)play=`<button class="btn g-play" data-act="prenext">${P_.wk===PRE_WEEKS?'▶ Deadline day':'▶ Pre-season week '+P_.wk}</button>`;
   else if(UI.tab==='week'&&stage==='preview'&&over){const st=UI.agmStep||0;play=`<button class="btn g-play" data-act="${st>=3?'close':'agmnext'}">${['Go to the floor ›','To your speech ›','To the vote ›','Call the vote'][st]}</button>`}
   else if(UI.tab==='week'&&stage==='preview')play=`<button class="btn g-play" data-act="${over?'close':'play'}">${over?'Finish the season ›':pre?'▶ Start the season':'▶ Play week '+(S.week+1)}</button>`;
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
   <h2>${fx.home?'vs':'at'} ${esc(CL(opp).name)}</h2><p>${fx.home?'Home':'Away'} · ${esc(odds)} · ${ord(posOf(opp))} in the table</p><div class="g-form" aria-label="Last five results">${form}</div>${(()=>{const st=matchStakes(id);return st?`<p class="g-stakes">${esc(st.text)}</p>`:''})()}</section>`;
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
 /* ----- the week (M2): topic · one escalation · match and stakes · your week · promises · looking back · the close ----- */
 function topicBanner(id){const t=weekTopic(id);return`<p class="g-topic t-${t.k}" role="note">${esc(t.t)}</p>`}
 function escalation(){return debriefCard()||(inWinter()&&preState().kind==='winter'?escCards(preState()):'')||clubMomentCard()||momentCard()}
 function promisesCompact(id){const m=M(id);if(!m.goals)return'';return`<section class="g-card g-pc"><small class="g-k">YOUR PROMISES · JUDGED AT THE AGM</small><ul>${m.goals.map(g=>{const pr=goalProgress(id,g);return`<li class="${pr.met?'on':'off'}"><b>${pr.met?'✓':'…'}</b><span>${esc(g.text)}</span><em>${esc(pr.text)}</em></li>`}).join('')}</ul></section>`}
 function lookBackCard(id){const c=lookingBack(id);if(!c)return'';return`<section class="g-card g-lb ${c.good===true?'up':c.good===false?'down':''}"><small class="g-k">LOOKING BACK</small><p>${esc(c.t)}</p></section>`}
 function weekClose(id){
   const notes=staffWeekNotes(id,S.season,S.week),sig=signals(id).sort((a,b)=>b.lv-a.lv).slice(0,3),world=worldCard(id),last=lastWeek();
   const n=notes.length+sig.length+(world?1:0);
   return`<details class="g-close"><summary>This week at the club${n?` · ${n} item${n>1?'s':''}`:''}</summary>
   ${notes.length?`<section class="g-card g-done"><h3>Done by your staff</h3><ul class="g-news">${notes.map(x=>`<li>${esc(x.text)}${x.cost?` <span class="muted">£${x.cost}k</span>`:''}</li>`).join('')}</ul></section>`:'<p class="g-hint">Your staff had nothing to report.</p>'}
   ${sig.length?`<section class="g-decide"><h3>Keep an eye on</h3>${sig.map(x=>`<button class="g-dec lv${x.lv}" data-act="${esc(x.act)}"${x.arg!=null?` data-arg="${esc(String(x.arg))}"`:''}><span class="g-dot" aria-hidden="true"></span><span>${esc(x.text)}</span><b aria-hidden="true">›</b></button>`).join('')}</section>`:''}
   ${world}${last}</details>`;
 }
 function weekScreen(){
   const id=S.my;
   const msg=UI.msg?`<p class="g-msg ${UI.msg.err?'err':''}" role="status">${esc(UI.msg.text)}</p>`:'';UI.msg=null;
   if(S.week===0)return`<div class="g-week">${msg}${momentCard()}${statusStrip(id)}${preSeason(id)}${promises(id)}${nextMatch(id)}${yourWeek(id)}</div>`;
   if(seasonOver())return`<div class="g-week">${msg}${topicBanner(id)}${agmView(id)}</div>`;
   return`<div class="g-week">${msg}${topicBanner(id)}${escalation()}${winterCard(id)}${statusStrip(id)}${nextMatch(id)}${yourWeek(id)}${tableCard()}${lookBackCard(id)}${promisesCompact(id)}${weekClose(id)}</div>`;
 }


 /* ----- PRE-SEASON: what it is, what the director will do, what you control ----- */
 /* ----- THE TRANSFER SUMMER (M1): meeting → brief → ticker → deadline day → summer edition ----- */
 function briefPick(id){const kind=preState().kind,max=kind==='winter'?1:3;if(!UI.brief||UI.brief.s!==S.season||UI.brief.kind!==kind){const m=summerMeeting(id);const ok=new Set(briefOptions(id).map(o=>o.k));UI.brief={s:S.season,kind,max,goals:m.plan.goals.filter(k=>ok.has(k)).slice(0,max),budget:m.plan.budget,recruit:recruitStrategy(id)}}return UI.brief}
 function meetingCard(id){
   const m=summerMeeting(id),b=briefPick(id),opts=briefOptions(id),word={bold:'a bold',careful:'a careful',steady:'a steady'}[m.style];
   const lineW=k=>`${k} ${m.avg[k]}`;
   return`<section class="g-card g-pre"><small class="g-k">${b.kind==='winter'?'WEEK '+S.week+' · THE WINTER MEETING':'PRE-SEASON · THE SUMMER MEETING'}</small><h2>${esc(m.dir)} sets out the ${b.kind}</h2>
   <ul class="g-list"><li><b>The squad.</b> Strongest in ${esc(m.strong)}, weakest in ${esc(m.weak)} (${['defence','midfield','attack'].map(lineW).join(' · ')}).${m.expiring.length?` Contracts ending: ${esc(m.expiring.slice(0,3).join(', '))}.`:''}</li>
   <li><b>The money.</b> ${k1(m.cash)} in the bank, ${k1(m.room)} a week of wage room.${m.surplus.length?` We could sell ${esc(m.surplus.map(x=>x.name).join(', '))}.`:''}</li>
   <li><b>What we need.</b> ${m.needs.length?esc(m.needs.map(n=>POS_ONE[n.pos]).join(', ')):'Nothing urgent.'}</li></ul>
   <p class="g-hint">${esc(m.dir)} is ${word} director: he proposes the goals ticked below. ${b.kind==='winter'?'Choose one goal for the winter window (weeks '+(WINTER_WEEK-1)+'–'+WINTER_WEEK+').':'Choose up to three; he signs what you sign.'}</p>
   <h3>The ${b.kind} brief</h3><div class="g-goals">${opts.map(o=>`<button class="g-opt ${b.goals.includes(o.k)?'on':''}" data-act="briefgoal" data-arg="${esc(o.k)}" aria-pressed="${b.goals.includes(o.k)}"><b>${b.goals.includes(o.k)?'✓ ':''}${esc(o.t)}</b><span>${esc(o.why)}</span></button>`).join('')}</div>
   <h3>Budget</h3><div class="g-seg g-seg3" role="group" aria-label="Budget">${Object.entries(BUDGET_LV).map(([k,v])=>`<button class="${b.budget===k?'on':''}" data-act="briefbudget" data-arg="${k}" aria-pressed="${b.budget===k}">${v.n}</button>`).join('')}</div>
   <p class="g-hint">${esc(BUDGET_LV[b.budget].d)}.</p>
   <h3>Profile</h3><div class="g-seg" role="group" aria-label="Recruitment profile">${Object.keys(RECRUIT).map(k=>`<button class="${b.recruit===k?'on':''}" data-act="briefrecruit" data-arg="${k}" aria-pressed="${b.recruit===k}">${esc(RECRUIT[k].n)}</button>`).join('')}</div>
   <p class="g-hint">${b.goals.length} of ${b.max} goal${b.max>1?'s':''} chosen.${b.kind==='winter'?' If you do not sign, the director works to his own plan.':' Sign the brief to open the market.'}</p>${b.kind==='winter'?'<button class="btn" data-act="briefsign">✍ Sign the winter brief</button>':''}</section>`;
 }
 function tickerCard(P_){
   const weeks=[...new Set(P_.ticker.map(t=>t.wk))].sort((a,b)=>b-a),label=w=>w===winWeeks(P_)?'Deadline day':P_.kind==='winter'?'Window week '+w:'Pre-season week '+w;
   return`<section class="g-card"><small class="g-k">THE TICKER · ${esc(P_.brief.dirName.toUpperCase())} AT WORK</small>${weeks.map((w,i)=>`<h3 class="g-h">${label(w)}</h3><ul class="g-tick">${P_.ticker.filter(t=>t.wk===w).sort((a,b)=>a.d-b.d).map(t=>`<li class="${t.kind}"><b>${t.d<0?'Brief':DAYS[t.d]||''}</b><span>${esc(t.t)}</span></li>`).join('')}</ul>`).slice(0,2).join('')}${weeks.length>2?'<p class="g-hint">Older weeks are in the Echo.</p>':''}</section>`;
 }
 function briefCard(P_,id){const res=briefJudge(id,P_);return`<section class="g-card g-promise"><small class="g-k">THE ${P_.kind==='winter'?'WINTER':'SUMMER'} BRIEF · ${esc(BUDGET_LV[P_.brief.budget].n.toUpperCase())} BUDGET</small><ul>${res.map(r=>`<li class="${r.met?'on':''}"><div><b>${esc(r.t)}</b><span>${esc(r.how)}</span></div></li>`).join('')}</ul></section>`}
 function escCards(P_){const o=P_.offer,r=P_.record;
   const offer=o?`<article class="g-moment"><small class="g-k">A BID FOR YOUR PLAYER · YOUR DECISION</small><h2>${esc(CL(o.by).name)} want ${esc(o.name)}</h2><p>£${o.fee}k for your ${esc(POS_ONE[o.pos])} (${o.age}), one of your three best players. The director cannot sell him without you.</p>
     <button class="g-opt" data-act="preoffer" data-arg="accept"><b>Accept £${o.fee}k</b><span>The money is yours; the director looks for a replacement</span></button>${o.asked?'':`<button class="g-opt" data-act="preoffer" data-arg="more"><b>Ask for more</b><span>They may raise it by a fifth, or walk away</span></button>`}<button class="g-opt g-leave" data-act="preoffer" data-arg="no"><b>Not for sale</b><span>He stays, but he may be unhappy</span></button></article>`:'';
   const rec=r?`<article class="g-moment"><small class="g-k">A CLUB RECORD · YOUR DECISION</small><h2>£${r.fee}k for ${esc(r.name)}?</h2><p>The selling club has said yes. It would beat the club record${r.rec?` of £${r.rec}k`:''}; the director needs your word.</p>
     <button class="g-opt" data-act="prerecord" data-arg="yes"><b>Approve the record fee</b><span>He signs today</span></button><button class="g-opt g-leave" data-act="prerecord" data-arg="no"><b>Too much</b><span>The director walks away and looks elsewhere</span></button></article>`:'';
   return offer+rec;
 }
 function preSeason(id){
   const P_=PRE();if(!P_)return'';
   if(!P_.brief)return meetingCard(id);
   const closed=P_.wk>winWeeks(P_),o=P_.offer,r=P_.record;
   const esc2=escCards(P_);
   if(closed){const E=summerEdition();return`<section class="g-card g-echo"><small class="g-k">THE NORTHMARCH ECHO · SUMMER EDITION</small><h2>${esc(E.head)}</h2>
     <p>In: ${E.ins.length?esc(E.ins.map(d=>`${d.name}${d.fee?' £'+d.fee+'k':' (free)'}`).join(', ')):'nobody'}. Out: ${E.outs.length?esc(E.outs.map(s=>`${s.name} £${s.fee}k`).join(', ')):'nobody'}. Spent £${E.spent}k, raised £${E.raised}k.</p>
     ${E.world.length?`<ul class="g-news">${E.world.map(t=>`<li>${esc(t.t)}</li>`).join('')}</ul>`:''}<p class="g-hint">The window shuts when the season starts. The director is judged on the brief after four weeks.</p></section>${briefCard(P_,id)}`}
   return`${esc2}${interestCard(P_)}${moneyCard(P_,id)}${boardCard(P_,id)}${P_.ticker.length>1?tickerCard(P_):`<section class="g-quiet"><b>The brief is signed.</b> Play the first ${P_.kind==='winter'?'window':'pre-season'} week and the market opens.</section>`}
   ${briefCard(P_,id)}${listCard(P_,id)}`;
 }
 /* the money, live */
 function moneyCard(P_,id){const spent=P_.deals.filter(d=>d.stage==='signed').reduce((a,d)=>a+d.fee,0),raised=P_.sold.reduce((a,x)=>a+x.fee,0),dl=P_.wk===winWeeks(P_);
   return`<section class="g-card"><small class="g-k">THE MONEY · ${dl?'DEADLINE DAY NEXT':(P_.kind==='winter'?'WINDOW':'PRE-SEASON')+' WEEK '+P_.wk+' OF '+winWeeks(P_)} · ${esc(({bold:'A BOLD',careful:'A CAREFUL',steady:'A STEADY'})[P_.style||'steady'])} DIRECTOR</small>
   <section class="g-delta"><div><small>Spent</small><b>£${spent}k</b><span>on fees</span></div><div><small>Raised</small><b>£${raised}k</b><span>from sales</span></div><div><small>Left</small><b>${k1(budgetFor(id))}</b><span>to spend</span></div></section>
   <p class="g-hint">Wage room ${k1(wageCapK(id)-wageBillK(id))} a week.</p>
   <div class="g-acts2"><button class="btn ghost" data-act="prebudget">Free up 10% more cash</button>${dl&&!P_.loan?'<button class="btn ghost" data-act="preloan">Deadline money (a loan)</button>':''}</div></section>`}
 /* the targets board: who the director is after, per need */
 function boardCard(P_,id){const T=P_.targets||{},pos=Object.keys(T).filter(k=>T[k]&&T[k].length);const live={};for(const d of P_.deals)live[d.pid]=d;
   const ST={bid:'Bid in',countered:'Haggling',record:'Needs you',signed:'Signed ✓',walked:'Walked away',hijacked:'Hijacked',gone:'Gone'};
   const rows=pos.map(k=>`<h3 class="g-h">${esc(POS_ONE[k])}${P_.base&&P_.base[k]&&P_.base[k].name?` <small>to beat: ${esc(P_.base[k].name)} (${P_.base[k].q})</small>`:''}</h3><ul class="g-list g-gems">${T[k].map((c,i)=>{const d=live[c.pid];return`<li class="g-gem"><div><b>${i===0&&!d?'▶ ':''}${esc(c.name)}</b>${c.chair?' <i class="g-tag in">YOUR FIND</i>':''} <small class="muted">${c.age} · ${c.from?nm(c.from):'free agent'}</small><span><i class="g-tag ${c.type==='For the future'?'in':''}">${esc((c.type||'').toUpperCase())}</i> ~${c.est} ±${c.doubt}${c.type==='For the future'?` · ceiling ~${c.ceil}`:''} · £${c.fee}k · £${c.wage}/wk · ${c.starter?'would start':'squad player'}</span></div>${d?`<em>${esc(ST[d.stage]||d.stage)}</em>`:(P_.fav&&P_.fav[k]===c.pid?'<em>You rate him</em>':`<button class="btn ghost" data-act="prefav" data-arg="${esc(c.pid)}">Rate him</button>`)}</li>`}).join('')}</ul>`).join('');
   const done=P_.deals.filter(d=>d.stage==='signed');
   return`<section class="g-card"><small class="g-k">THE TARGETS · ${esc((P_.brief.dirName||'the director').toUpperCase())}'S BOARD</small>${rows||`<p>${done.length?'Every need is covered.':'The director draws up his board in the first week.'}</p>`}<p class="g-hint">“Rate him” is a recommendation: the director goes for him first if the money allows. He still decides.</p></section>`}
 /* interest from other clubs */
 function interestCard(P_){const x=P_.interest;if(!x||(P_.list||[]).includes(x.pid))return'';return`<section class="g-card g-lb"><small class="g-k">INTEREST</small><p>${esc(CL(x.by).name)} are asking about ${esc(x.name)} (around £${x.fee}k).</p><button class="btn ghost" data-act="prelist" data-arg="${esc(x.pid)}">Make him available</button></section>`}
 /* the transfer list */
 function listCard(P_,id){const keep=new Set(topThree(id).map(p=>p.id)),L=P_.list||[],sq=S.squads[id].filter(p=>!p.loan&&!keep.has(p.id)).sort((a,b)=>a.q-b.q).slice(0,10);
   return`<details class="g-close"><summary>Transfer list · ${L.length} available</summary><section class="g-card"><p class="g-hint">Players you make available are sold by the director for a fair bid (at least 85% of their value). Your three best are never listed: bids for them come to you.</p><ul class="g-list g-gems">${sq.map(p=>`<li class="g-gem"><div><b>${esc(p.name)}</b> <small class="muted">${esc(POS_ONE[p.pos])}, ${p.age}</small><span>Quality ${r1(p.q)} · worth ~£${Math.round(askingFee(p,id))}k · ${p.sApps||0} games</span></div><button class="btn ghost" data-act="prelist" data-arg="${esc(p.id)}">${L.includes(p.id)?'Take off':'Make available'}</button></li>`).join('')}</ul></section></details>`}

 function debriefCard(){
   if(!debriefDue())return'';const P_=debriefTarget(),res=briefJudge(S.my,P_),met=res.filter(r=>r.met).length;
   return`<article class="g-moment"><small class="g-k">THE ${P_.kind==='winter'?'WINTER':'SUMMER'} DEBRIEF · ${esc(P_.brief.dirName.toUpperCase())}</small><h2>${met} of ${res.length} goals met</h2>
   <ul class="g-news">${res.map(r=>`<li>${r.met?'✓':'✗'} ${esc(r.t)} · <span class="muted">${esc(r.how)}</span></li>`).join('')}</ul>
   <button class="g-opt" data-act="debrief" data-arg="back"><b>Back him</b><span>He grows in confidence and loyalty</span></button><button class="g-opt g-leave" data-act="debrief" data-arg="warn"><b>Warn him</b><span>A second warning opens the door to replacing him</span></button></article>`;
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
   <section class="g-links">${link('Football','Head coach, director, playing style','ctab','football','⚽')}${link('Scouting & Moneyball','Your finds, transfers in and out, hit rate','ctab','dossier','✈')}${link('Transfers','Needs, shortlist, window','ctab','window','⇄')}${link('Stadium & facilities','Build, repair, capacity','ctab','ground','▥')}${link('Members & board','Confidence, prices, goals','ctab','members','♜')}${link('Family & legacy','Your family, heir, era, legends','ctab','legacy','★')}${link('History & growth','Season by season, records, money','ctab','development','⌛')}</section></div>`;
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
   const A=S.scout||{gems:[],prospects:[]},gems=A.gems.slice().reverse(),B=mbBoard();
   const pros=A.prospects.filter(p=>p.status!=='seen').slice().reverse();
   const net=B.received-B.spent,cell=(k,v,w,c)=>`<div><small>${k}</small><b class="${c||''}">${v}</b><span>${esc(w)}</span></div>`;
   const rows=B.rows.filter(r=>r.s!=null||r.so!=null).slice().reverse().slice(0,12).map(r=>`<li class="g-mb"><div><b>${esc(r.name)}</b>${r.found?' <i class="g-tag in">YOUR FIND</i>':''}${r.academy?' <i class="g-tag">ACADEMY</i>':''}<span>${r.s!=null?`In S${r.s} for £${r.in}k`:'Own player'}${r.so!=null?` · out S${r.so}${r.to?' to '+nm(r.to):' (released)'} for £${r.out}k`:r.here?` · worth ~£${r.worth}k now`:' · left the club'}${r.grew!=null?` · quality ${r.grew>=0?'+':''}${r.grew}`:''} · ${r.apps} apps</span></div><em class="${r.profit>0?'good':r.profit<0?'bad':''}">${r.profit>0?'+':''}${k1(r.profit)}</em></li>`).join('');
   const board=`<section class="g-card"><small class="g-k">MONEYBALL BOARD · IN AND OUT</small>
     <section class="g-delta">${cell('Spent','£'+B.spent+'k','on fees')}${cell('Received','£'+B.received+'k','from sales')}${cell('Hit rate',B.judged?Math.round(B.hits/B.judged*100)+'%':'—',B.judged?B.hits+' of '+B.judged+' signings':'too early')}</section>
     <p class="g-hint">Net transfer result ${k1(net)}. ${B.found} signing${B.found===1?'':'s'} came from your own scouting.${B.best&&B.best.profit>0?` Best deal: ${esc(B.best.name)}, +${k1(B.best.profit)}.`:''} A hit is a profit on a sale, a player who grew, or thirty games for the club.</p>
     ${rows?`<ul class="g-list">${rows}</ul>`:'<p class="g-hint">No transfers yet. They appear here from the first window.</p>'}</section>`;
   const glist=gems.map(g=>{const now=gemNow(g),why=gemWhy(g);return gemLine(g,true).replace('</span></div>',`</span>${now?`<span>Value then £${g.fee}k → now ~£${now.value}k${now.club&&now.club!==g.from&&now.club!==S.my?' · at '+nm(now.club):''}</span>`:''}${why?`<span class="g-why">Director: ${esc(why)}</span>`:''}</div>`)}).join('');
   return`<div class="hubback"><button class="tbtn" data-act="ctab" data-arg="hub">← Club</button></div><div class="g-week">${board}
   <section class="g-card"><small class="g-k">YOUR DOSSIER · PLAYERS YOU FOUND</small>${gems.length?`<ul class="g-list g-gems">${glist}</ul>`:'<p class="g-hint">Empty. Go on a scouting trip or spend a day with the data analyst.</p>'}</section>
   ${pros.length?`<section class="g-card"><small class="g-k">ACADEMY INVITATIONS</small><ul class="g-news">${pros.map(p=>`<li>${esc(p.name)} (${esc(POS_ONE[p.pos])}) · ${esc({invited:'invited for the summer',joined:'joined the academy ✓',declined:'chose another academy'}[p.status]||p.status)}</li>`).join('')}</ul></section>`:''}</div>`;
 }


 /* ----- M3: a moment with a person, ending in an agreement (You give · They give · Tested · If it fails) ----- */
 function clubMomentCard(){
   const mo=S.moment;if(!mo)return'';const left=MOM_DEADLINE-(momNow()-mo.at);
   return`<article class="g-moment"><small class="g-k">A MOMENT · ${esc(mo.role.toUpperCase())}</small><h2>${esc(mo.title)}</h2><p>${esc(mo.text)}</p>
   ${mo.opts.map((o,i)=>`<button class="g-opt g-deal-opt" data-act="momchoose" data-arg="${i}"><b>${esc(o.label)}</b>${o.test!=='—'?`<dl><dt>You give</dt><dd>${esc(o.give)}</dd><dt>They give</dt><dd>${esc(o.get)}</dd><dt>Tested</dt><dd>${esc(o.test)}</dd><dt>If it fails</dt><dd>${esc(o.fail)}</dd></dl>`:`<span>${esc(o.get!=='Nothing'?o.get:o.fail)}</span>`}</button>`).join('')}
   <p class="g-hint">Say nothing for ${left} more week${left===1?'':'s'} and it becomes “${esc(mo.opts[mo.dflt].label)}”.</p></article>`;
 }
 function pactProgress(p){const id=S.my,gone=S.week-p.w0,pts=ptsNow(id)-p.pts0;
   return p.kind==='points'?`${pts} of ${p.need} points · ${Math.max(0,p.weeks-gone)} games left`:p.kind==='wins'?`${(S.tbl[id]?.form||[]).slice(-Math.max(1,gone)).filter(r=>r==='W').length} of ${p.need} wins · ${Math.max(0,p.weeks-gone)} games left`
   :p.kind==='conf'?`Confidence ${Math.round(M(id).conf)} (must stay above ${p.min})`:p.kind==='homewin'?(p.hw?`Next home game: week ${p.hw}`:'No home game left'):p.kind==='keep'?'Keep him through the winter window':p.kind==='release'?'Next summer: accept the first fair bid':p.kind==='cash'?`${p.bad||0} loss-making month${(p.bad||0)===1?'':'s'} so far (two breaks it)`:p.kind==='nosale'?'No first-team sale in the winter window':p.kind==='apps'?'10 games for him before the season ends':p.kind==='sellwinter'?'Sell him in the winter window':p.kind==='finish'?`Finish ${ord(p.pos)} or higher (now ${ord(posOf(S.my))})`:''}
 function tableCard(){const open=(S.pacts||[]).filter(p=>p.status==='open');if(!open.length)return'';
   return`<section class="g-card g-pacts"><small class="g-k">ON THE TABLE · YOUR AGREEMENTS</small><ul>${open.map(p=>`<li><b>${esc(p.label)}</b> <span class="muted">with ${esc(p.who)}</span><span>${esc(pactProgress(p))}</span></li>`).join('')}</ul></section>`}


 /* ----- M3b: the AGM, played: report → the floor and a motion → your speech → the vote ----- */
 function agmView(id){
   const P_=AGMP(),st=UI.agmStep||0,R=agmReport(id);
   const steps=['The annual report','The floor','Your speech','The vote'].map((t,i)=>`<li class="${i===st?'on':i<st?'done':''}">${t}</li>`).join('');
   let body='';
   if(st===0)body=`<section class="g-card"><small class="g-k">THE ANNUAL REPORT · SEASON ${S.season}</small><h2>${ord(R.pos)} in ${esc(TIER_NAME[R.tier])} · ${R.pts} points</h2>
     <p>Operating result ${k1(R.op)}. Agreements this season: ${R.kept} kept, ${R.broken} broken.</p>
     <h3>Your promises</h3><ul class="g-news">${R.goals.map(g=>`<li>${g.met?'✓':'✗'} ${esc(g.t)} · <span class="muted">${esc(g.text)}</span></li>`).join('')}</ul>
     <h3>What the members weigh</h3><ul class="g-news">${R.reasons.map(([w,d])=>`<li>${esc(w)} <b class="${d<0?'bad':'good'}">${d>0?'+':''}${d}</b></li>`).join('')}</ul>
     <p class="g-hint">Before the hall speaks, ${R.forecast}% would vote for you. The floor and your speech can still move it.</p>${S.family&&S.family.retire?`<p class="g-hint">You step down tonight: after the vote your heir stands for election.</p>`:''}</section>`;
   if(st===1){const fl=agmFloor(id),mo=P_.motion;body=`<section class="g-card"><small class="g-k">THE FLOOR · WHO IS IN THE HALL</small><ul class="g-floor">${fl.map(g=>`<li class="${g.stance==='For you'?'on':g.stance==='Against you'?'off':''}"><b>${esc(g.n)}</b> <span class="muted">${g.share}% of members</span><span>${esc(g.stance)} (~${g.pct}%) · wants: ${esc(g.wants)}</span></li>`).join('')}</ul></section>
     ${mo?`<article class="g-moment"><small class="g-k">A MOTION FROM THE FLOOR · ${esc((ARCH[mo.k]?.n||'the members').toUpperCase())}</small><h2>“${esc(mo.t)}”</h2><p>${P_.motionDone?(P_.pass?'The motion passed. It binds the club.':'The motion fell.'):mo.t===TERM_LIMIT?'If it passes, you must step down after two seasons in the chair. An heir may stand in your place.':'If it passes it binds the club. Your word carries weight in the hall.'}</p>
       ${P_.motionDone?'':`<button class="g-opt" data-act="agmmotion" data-arg="yes"><b>Support it</b><span>${esc(agmGroupName(id,{k:mo.k}))} cheer${mo.against?`; the ${esc(agmGroupName(id,{k:mo.against}))} do not`:''}${mo.cost?` · costs £${mo.cost}k`:''}</span></button><button class="g-opt g-leave" data-act="agmmotion" data-arg="no"><b>Oppose it</b><span>They will remember; it may pass anyway if they are many and you are weak</span></button>`}</article>`:'<p class="g-hint">No motion this year.</p>'}`}
   if(st===2)body=`<section class="g-card"><small class="g-k">YOUR SPEECH · ONE THEME</small>${P_.speech?`<p>You spoke: <b>${esc(SPEECH[P_.speech].n)}</b>.</p>`:Object.entries(SPEECH).map(([k,v])=>`<button class="g-opt" data-act="agmspeech" data-arg="${k}"><b>${esc(v.n)}</b><span>${esc(v.d)} Pleases ${esc(Object.entries(v.fx).filter(([,d])=>d>0).map(([g])=>ARCH[g]?.n||'the workers').join(', '))}${Object.entries(v.fx).some(([,d])=>d<0)?`; costs ${esc(Object.entries(v.fx).filter(([,d])=>d<0).map(([g])=>ARCH[g]?.n||g).join(', '))}`:''}.</span></button>`).join('')}</section>`;
   if(st===3)body=`<section class="g-card"><small class="g-k">THE VOTE</small><h2>The hall decides</h2><p>Members' confidence ${Math.round(M(id).conf)}. Before tonight ${R.forecast}% were with you.</p><p class="g-hint">Call the vote: the result and the tally per group follow.</p></section>`;
   return`<ol class="g-steps">${steps}</ol>${body}`;
 }
 function tallyCard(){const id=UI.review&&UI.review.agm?UI.review.agm.club:S.my;if(!id||!M(id).agm)return'';const rows=agmTally(id);
   return`<section class="g-card"><small class="g-k">THE TALLY · PER GROUP</small><ul class="g-floor">${rows.map(r=>`<li class="${r.pct>=50?'on':'off'}"><b>${esc(r.n)}</b> <span class="muted">${r.share}% of members</span><span>${r.pct}% for you</span></li>`).join('')}</ul></section>`}


 /* ----- M4: the winter window, inside the season ----- */
 function winterCard(id){
   if(!inWinter())return'';const P_=preState();if(P_.kind!=='winter')return'';
   if(!P_.brief)return S.week>=WINTER_WEEK-3&&S.week<=WINTER_WEEK-2?meetingCard(id):'';
   if(P_.wk<=winWeeks(P_)&&P_.ticker.length<=1)return`<section class="g-quiet"><b>The winter brief is signed.</b> The window opens in week ${WINTER_WEEK-1}; the director acts after the matches.</section>${briefCard(P_,id)}`;
   if(S.week<=WINTER_WEEK)return`${moneyCard(P_,id)}${boardCard(P_,id)}${tickerCard(P_)}${briefCard(P_,id)}${listCard(P_,id)}`;
   if(S.week<=WINTER_WEEK+3){const E=summerEdition(P_);return`<section class="g-card g-echo"><small class="g-k">THE NORTHMARCH ECHO · WINTER EDITION</small><h2>${esc(E.head)}</h2><p>In: ${E.ins.length?esc(E.ins.map(d=>`${d.name}${d.fee?' £'+d.fee+'k':' (free)'}`).join(', ')):'nobody'}. Out: ${E.outs.length?esc(E.outs.map(x=>`${x.name} £${x.fee}k`).join(', ')):'nobody'}.</p><p class="g-hint">The director is judged on the winter brief in week ${WINTER_WEEK+4}.</p></section>`}
   return'';
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
   ${tallyCard()}${btn}</div><details class="g-full"><summary>Full season review</summary>${full.replace(/^<main[^>]*>|<\/main>\s*$/g,'')}</details></main>`;
 };

 const oldAct=act;
 act=function(a,arg){
   if(a==='briefgoal'&&S&&S.my){const b=briefPick(S.my);const i=b.goals.indexOf(arg);if(i>=0)b.goals.splice(i,1);else if(b.max===1)b.goals=[arg];else if(b.goals.length<b.max)b.goals.push(arg);else UI.msg={err:true,text:'Three goals at most: untick one first.'};render();return}
   if(a==='briefbudget'&&S&&S.my){briefPick(S.my).budget=arg;render();return}
   if(a==='briefrecruit'&&S&&S.my){briefPick(S.my).recruit=arg;render();return}
   if(a==='briefsign'&&S&&S.my){const b=briefPick(S.my),r=signBrief(S.my,b.goals,b.budget,b.recruit);UI.msg=r.ok===false?{err:true,text:r.err}:{text:'The summer brief is signed. The market opens.'};save();render();if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='debrief'&&S&&S.my){const r=debriefChoose(arg==='back');UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='prefav'&&S&&S.my){const r=preFavour(arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='prelist'&&S&&S.my){const r=preListToggle(arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.on?'Available: the director will sell for a fair bid.':'Taken off the list.'};save();render();return}
   if(a==='preloan'&&S&&S.my){const r=preDeadlineLoan();UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='prenext'&&S&&S.my){const r=preWeek();if(r.ok===false)UI.msg={err:true,text:r.err};save();render();if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='preoffer'&&S&&S.my){const r=preOffer(arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='prerecord'&&S&&S.my){const r=preRecord(arg==='yes');UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='preprio'&&S&&S.my){prePrio(arg);save();render();return}
   if(a==='prebudget'&&S&&S.my){const r=preBudget();UI.msg=r&&r.ok===false?{err:true,text:r.err}:{text:`Transfer budget now ${k1(budgetFor(S.my))}.`};save();render();return}
   if(a==='chairpick'){UI.pickRegion=true;render();return}
   if(a==='chairback'){UI.pickRegion=false;render();return}
   if(['chairtrip','chairtour','chairdata','chairhome'].includes(a)&&S&&S.my){const id=S.my,r=a==='chairtrip'?chairTrip(id,arg):a==='chairtour'?chairTournament(id):a==='chairdata'?chairData(id):chairHome(id);
     UI.pickRegion=false;if(r.ok===false)UI.msg={err:true,text:r.err};else UI.trip={...r,kind:{chairtrip:'trip',chairtour:'tour',chairdata:'data',chairhome:'home'}[a],w:scNow()};save();render();return}
   if(a==='chairrec'&&S&&S.my){const r=chairRecommend(S.my,arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:`Recommended. The director will weigh him when he looks for a ${POS_ONE[r.pos]}.`};save();render();return}
   if(a==='chairinvite'&&S&&S.my){const r=chairInvite(S.my,arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:'Invited. He will decide next summer.'};save();render();return}
   if(a==='agmnext'&&S&&S.my){const P_=AGMP(),st=UI.agmStep||0;if(st===1&&P_.motion&&!P_.motionDone){UI.msg={err:true,text:'Decide on the motion first.'}}else if(st===2&&!P_.speech){UI.msg={err:true,text:'Give your speech first.'}}else UI.agmStep=st+1;render();if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='agmmotion'&&S&&S.my){const r=agmMotionVote(S.my,arg==='yes');UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='agmspeech'&&S&&S.my){const r=agmSpeech(S.my,arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='close')UI.agmStep=0;
   if(a==='momchoose'&&S&&S.my){const r=momentChoose(+arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.note};save();render();return}
   if(a==='famchoose'&&S&&S.my){const r=familyChoose(+arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.note||'Decided.'};save();render();return}
   if(a==='manifest'&&S&&S.my){const [k,n]=String(arg).split(':');const r=cmd('SetManifest',S.my,{k,lv:+n});if(r.ok===false)UI.msg={err:true,text:r.err};save();render();return}
   const mark=S&&S.evn||0;if((a==='play'||a==='playn')&&S&&S.my){UI.gPos=S.week?posOf(S.my):null;lookingBackSeen()}
   const r=oldAct(a,arg);
   if(a==='play'||a==='playn'){UI.gEv=S?eventsSince(mark):[];render()}
   if(a==='cont'&&inGame()){UI.v183Stage='preview';UI.tab='week';render()}
   return r;
 };
})();
