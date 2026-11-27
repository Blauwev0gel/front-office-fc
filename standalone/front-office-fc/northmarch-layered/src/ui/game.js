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
   return`<header class="g-top">${crestSVG(S.my,30)}<div class="g-id"><b>${esc(c.name)}</b><span>${S.week?'Week '+S.week+' of '+SEASON_WEEKS:'Pre-season'} · ${esc(TIER_NAME[c.tier])}</span></div><span class="g-cash ${cash<0?'bad':''}" aria-label="Cash">${k1(cash)}</span></header>`;
 };

 /* ----- the bottom: one play button on the week screen, four tabs everywhere ----- */
 const oldActionBar=actionBar;
 actionBar=function(){
   if(!inGame())return oldActionBar();
   const stage=UI.v183Stage||'preview',over=seasonOver(),pre=S.week===0;
   let play='';
   const P_=pre?PRE():null;
   if(UI.tab==='week'&&stage==='preview'&&P_&&preStep()==='promise')play=`<button class="btn g-play" data-act="sealmanifest">✍ Sign the manifest</button>`;
   else if(UI.tab==='week'&&stage==='preview'&&P_&&preStep()==='budget')play=`<button class="btn g-play" data-act="budgetsign">✍ Sign the budget</button>`;
   else if(UI.tab==='week'&&stage==='preview'&&P_&&!P_.brief)play=`<button class="btn g-play" data-act="briefsign">✍ Agree the plan · open the market</button>`;
   else if(UI.tab==='week'&&stage==='preview'&&P_&&P_.brief&&tcPlaying())play=`<button class="btn g-play" data-act="tcskip">Skip to the end of the week ›</button>`;
   else if(UI.tab==='week'&&stage==='preview'&&P_&&P_.brief&&P_.wk<=PRE_WEEKS&&UI.tcRun)play=`<button class="btn g-play tc-pause" data-act="tcpause">⏸ Pause the clock</button>`;
   else if(UI.tab==='week'&&stage==='preview'&&P_&&P_.wk<=PRE_WEEKS&&(P_.offer||P_.record))play=`<button class="btn g-play" data-act="prenext">Let it lapse · carry on ›</button>`;
   else if(UI.tab==='week'&&stage==='preview'&&P_&&P_.wk<=PRE_WEEKS)play=`<button class="btn g-play" data-act="prenext">${!P_.day?'▶ Open the window':preDeadlineNow(P_)?'▶ Play deadline day':'▶ Continue'}</button>`;
   else if(UI.tab==='week'&&stage==='preview'&&over){const st=UI.agmStep||0;play=`<button class="btn g-play" data-act="${st>=3?'close':'agmnext'}">${['Go to the floor ›','To your speech ›','To the vote ›','Call the vote'][st]}</button>`}
   else if(UI.tab==='week'&&stage==='preview')play=`<button class="btn g-play" data-act="${over?'close':'play'}">${over?'Finish the season ›':pre?'▶ Start the season':(()=>{const fx=fixtureOf(S.my,S.week+1);return fx?`▶ Saturday: ${fx.home?'vs':'at'} ${CL(fx.opp).name}`:'▶ Play week '+(S.week+1)})()}</button>`;
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
 /* ----- the whiteboard: our eleven as the coach will pick them, in football terms (ratings on the squad scale) ----- */
 const WB_POS=[[39,82],[12,66],[29,69],[49,69],[66,66],[39,57],[25,46],[53,44],[12,28],[39,20],[66,28]];
 const pRating=p=>Math.round(qualityToStr(p.q));
 function whyHere(p,id){if(p.academy&&p.originClub===id)return'academy';const d=S.pre&&S.pre.s===S.season&&S.pre.deals.find(x=>x.pid===p.id&&x.stage==='signed');if(d)return d.chair?'find':'new';return p.joined===S.season&&S.season>1?'new':''}
 function whiteboard(id,label){const xi=pickXI(S.squads[id]);if(xi.length<11)return'';
   const dots=xi.map((x,i)=>{const [cx,cy]=WB_POS[i],w=whyHere(x.p,id),ring=w==='academy'?'var(--good)':w?'var(--signal)':'none';
     return`<g transform="translate(${cx},${cy})">${ring!=='none'?`<circle r="5.6" fill="none" stroke="${ring}" stroke-width=".9"/>`:''}<circle r="4.3" fill="#fff"/><text class="wb-rt" text-anchor="middle" y="1.5">${pRating(x.p)}</text><text class="wb-nm" text-anchor="middle" y="8.4">${esc(x.p.name.split(' ').slice(-1)[0])}</text></g>`}).join('');
   const out=S.squads[id].filter(p=>p.inj>0).sort((a,b)=>b.q-a.q).slice(0,2);
   return`<figure class="wb"><svg viewBox="0 0 78 92" role="img" aria-label="${esc(label)}"><defs><pattern id="wbst" width="78" height="11.5" patternUnits="userSpaceOnUse"><rect width="78" height="5.75" fill="#2d6a3b"/><rect y="5.75" width="78" height="5.75" fill="#2a6237"/></pattern></defs><rect width="78" height="92" rx="4" fill="url(#wbst)"/><g fill="none" stroke="rgba(255,255,255,.7)" stroke-width=".5"><rect x="3" y="3" width="72" height="86"/><line x1="3" y1="46" x2="75" y2="46"/><circle cx="39" cy="46" r="8"/><rect x="21" y="3" width="36" height="13"/><rect x="21" y="76" width="36" height="13"/></g>${dots}</svg>
   <figcaption><span><i class="wb-k new"></i>Signed this season</span><span><i class="wb-k acad"></i>Academy</span>${out.length?`<span class="wb-out">Out: ${out.map(p=>`${esc(p.name)} (${p.inj} wk${p.inj>1?'s':''})`).join(', ')}</span>`:''}</figcaption></figure>`}
 /* the danger man and the derby: context the fan knows before kick-off */
 function oppContext(id,opp){const c=CL(id),o=CL(opp),best=S.squads[opp].filter(p=>!p.inj).sort((a,b)=>b.q-a.q)[0],derby=c.rival===opp||o.rival===id||c.town===o.town;
   return`${derby?`<p class="g-derby"><b>DERBY</b> ${esc(c.rival===opp?'Rivals since '+c.rivalWhy+'.':'The town is split in two this week.')}</p>`:''}${best?`<p class="g-hint">Their danger man: <b>${esc(best.name)}</b>, ${esc(POS_ONE[best.pos])}, rating ${pRating(best)}.</p>`:''}`}
 function nextMatch(id){
   if(seasonOver())return`<section class="g-card g-match"><small class="g-k">SEASON COMPLETE</small><h2>All ${SEASON_WEEKS} weeks played</h2><p>Finish the season to see the final table, the accounts and the members' verdict.</p></section>`;
   const w=S.week+1,fx=fixtureOf(id,w),cup=CUP_WEEKS[S.cup.round]===w&&cupTieOf(id);
   if(!fx)return`<section class="g-card g-match"><small class="g-k">WEEK ${w}</small><h2>No league game</h2><p>The club still runs: wages, gates elsewhere and the market move on.</p></section>`;
   const opp=fx.opp,ours=teamStrength(id),theirs=teamStrength(opp),d=ours-theirs+(fx.home?1:-1);
   const odds=d>2?'You should win this':d>.5?'Slight favourites':d>-.5?'Too close to call':d>-2?'They are favourites':'A hard afternoon';
   const form=(S.tbl[id]?.form||[]).slice(-5).map(r=>`<i class="f${r}">${r}</i>`).join('')||'<span class="muted">No games yet</span>';
   return`<section class="g-card g-match"><small class="g-k">NEXT MATCH · WEEK ${w}${cup?' · CUP TIE TOO':''}</small>
   <h2 class="g-opp">${crestSVG(opp,26)} ${esc(CL(opp).name)}</h2><p>${fx.home?'Home':'Away'} · ${esc(odds)} · ${ord(posOf(opp))} in the table</p><div class="g-form" aria-label="Last five results">${form}</div>${(()=>{const st=matchStakes(id);return st?`<p class="g-stakes">${esc(st.text)}</p>`:''})()}${oppContext(id,opp)}<details class="g-wbd"><summary>Your eleven</summary>${whiteboard(id,'Our likely eleven')}</details></section>`;
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
   const m=M(id);if(!m.goals)return'';const pre=S.week===0&&!manifestSealed(id),signedPre=S.week===0&&!pre;
   const rows=m.goals.map(g=>{const pr=goalProgress(id,g),lv=g.lv??1;
     const pick=pre?`<div class="g-seg g-seg3" role="group" aria-label="${esc(g.k)} promise">${MANIFEST_WORD.map((w,i)=>`<button class="${lv===i?'on':''}" data-act="manifest" data-arg="${g.k}:${i}" aria-pressed="${lv===i}">${w}</button>`).join('')}</div>`:'';
     return`<li class="${pre||signedPre?'':pr.met?'on':'off'}"><div><b>${esc(g.text)}</b><span>${pre||signedPre?`${promiseOdds(id,g)} · met +${g.w} confidence, missed −${g.w}`:`${esc(pr.text)} · ${pr.met?'on track':'behind'}`}</span></div>${pick}</li>`}).join('');
   return`<section class="g-card g-promise"><small class="g-k">${pre?'YOUR MANIFEST · CHOOSE HOW BOLD':signedPre?'YOUR SIGNED MANIFEST':'YOUR PROMISES TO THE MEMBERS'}</small>${pre?'<p class="g-hint">Three promises. Bolder wins more trust, and falls harder.</p>':''}<ul>${rows}</ul></section>`;
 }
 function lastWeek(){
   const is=issues().at(-1);if(!is||!is.matches?.length)return'';const m=is.matches[0];
   return`<button class="g-last" data-act="v183paper" data-arg="${esc(is.key)}"><small class="g-k">LAST WEEK</small><span><b>${esc(m.home)} ${m.hg}–${m.ag} ${esc(m.away)}</b></span><span class="muted">Read the Echo ›</span></button>`;
 }
 /* ----- the week (M2): topic · one escalation · match and stakes · your week · promises · looking back · the close ----- */
 function topicBanner(id){const t=weekTopic(id);return`<p class="g-topic t-${t.k}" role="note">${esc(t.t)}</p>`}
 /* every open decision is shown, stacked: a pending debrief must never hide a moment (moments then lapsed unseen) */
 function escalation(){return debriefCard()+(inWinter()&&preState().kind==='winter'?escCards(preState()):'')+clubMomentCard()+momentCard()}
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
 /* ----- L3: YOUR PEOPLE. The director and the head coach as people: what they are good at, how they feel about you,
    what they remember. The chairman decides about people (mandate, contract, who), never about players (D-L3-1, D-L3-2). ----- */
 const loyText=l=>l>=65?'Trusts you':l>=40?'Loyal, for now':'Looking around';
 function personRow(id,role){const p=P(CL(id).cast[role]);if(!p||!p.pro)return'';const est=staffEstimate(p.id)??p.pro.q,stars='★'.repeat(staffStars(est))+'☆'.repeat(5-staffStars(est)),last=(p.mem||[]).slice(-1)[0],loy=p.loy??50;
   const ini=p.name.split(' ').map(w=>w[0]).join('').slice(0,2),r=role==='coach'?'Head coach':'Director of football',care=p.pro.caretaker;
   const mand=role==='td'&&typeof MANDATE_DEALS!=='undefined'&&!care?`<div class="g-seg g-seg3" role="group" aria-label="Signing limit">${Object.entries(MANDATE_DEALS).map(([k,v])=>`<button class="${mandateOf(id).deals===k?'on':''}" data-act="pmandate" data-arg="${k}" aria-pressed="${mandateOf(id).deals===k}">${esc(v.n)}</button>`).join('')}</div><p class="g-hint">${esc({small:'Signs alone up to 40% of the budget a deal. Bigger targets are left on the table.',medium:'Signs alone up to 75% of the budget a deal. Only the biggest targets get away.',large:'Signs anyone within the budget. Fast, and on their judgement alone.'}[mandateOf(id).deals]||'')}</p>`:'';
   const acts=care?`<button class="btn ghost" data-act="preplace" data-arg="${role}">Appoint a ${role==='coach'?'head coach':'director'}</button>`:`<div class="g-acts2">${p.pro.contract<=1?`<button class="btn ghost" data-act="prenew" data-arg="${role}">Renew the contract</button>`:''}<button class="btn ghost" data-act="preplace" data-arg="${role}">Replace…</button></div>`;
   const cands=UI.replace===role?`<div class="g-cands"><h3>Who do you want?</h3>${staffCandidates(id,role).slice(0,3).map(c=>{const q=P(c.pid);return`<button class="g-opt" data-act="phire" data-arg="${role}:${esc(c.pid)}"><b>${esc(q.name)}, ${q.age}</b><span>${esc(STAFF_SPEC[role][q.pro.spec])} · ${'★'.repeat(staffStars(staffEstimate(c.pid)))} · £${q.pro.wage} a week${c.comp?` · £${c.comp}k to ${esc(CL(c.from).name)}`:' · free'}</span></button>`}).join('')||'<p class="g-hint">Nobody available right now.</p>'}<button class="btn ghost" data-act="preplace" data-arg="">Keep ${esc(p.name)}</button></div>`:'';
   return`<li class="g-person"><div class="g-ph">${faceSVG(p.name,{size:40,kit:clubKit(S.my).a})}<div><b>${esc(p.name)}</b><small>${r}${care?' · caretaker':''} · ${esc(STAFF_SPEC[role][p.pro.spec]||'')}</small></div><span class="g-stars" aria-label="${staffStars(est)} of 5">${stars}</span></div>
   ${care?'':`<p class="g-ploy ${loy>=65?'up':loy<40?'down':''}"><b>${loyText(loy)}</b>${last?` · remembers: ${esc(last.t)}`:''} · contract ${p.pro.contract} season${p.pro.contract===1?'':'s'}</p>`}${mand}${acts}${cands}</li>`}
 function peopleCard(id){const ps=['td','coach'].map(r=>P(CL(id).cast[r])).filter(Boolean),hot=ps.some(p=>!p.pro||p.pro.caretaker||p.pro.contract<=1||(p.loy??50)<40)||!!UI.replace;
   return`<details class="g-card g-people" ${hot?'open':''}><summary><small class="g-k">YOUR PEOPLE</small><span>${ps.map(p=>`${esc(p.name.split(' ')[0])}: ${p.pro&&p.pro.caretaker?'caretaker':loyText(p.loy??50).toLowerCase()}`).join(' · ')}</span></summary><ul class="g-plist">${personRow(id,'td')}${personRow(id,'coach')}</ul></details>`}
 /* ----- CLUB BUILDER (MB-01, MB-08, MB-16): what the club is, where it is going, and the people who build it ----- */
 const strHash=t=>{let h=7;for(const ch of String(t))h=(h*31+ch.charCodeAt(0))>>>0;return h};
 /* every department has a head with a name: derived from the club and the department, so nothing new is saved */
 function deptHead(id,k){const h=strHash(id+':'+k);return`${FIRST[h%FIRST.length]} ${LAST[(h>>>8)%LAST.length]}`}
 const HEAD_ROLE={training:'Head of training',medical:'Head of medical',academy:'Academy manager',scouting:'Chief scout',commercial:'Commercial manager',community:'Membership secretary',matchday:'Matchday manager'};
 const HEAD_ASK={training:'With better facilities our young players grow faster and the old ones last longer.',medical:'Give me a proper centre and you will see fewer and shorter injuries.',academy:'With a better academy I bring in more kids, and better ones, every summer.',scouting:'A bigger office means the director sees more players before signing one.',commercial:'A shop and an events hall pay for themselves within a few seasons.',community:'A better clubhouse brings in members, dues and a support that grows.',matchday:'An easier way in means bigger crowds on a Saturday.'};
 /* what the club can put into building without touching four weeks of wages */
 const investRoom=id=>{const b=budBuildLeft(id);return b!=null?b:Math.max(0,Math.round(F(id).cash-wageBillK(id)*4))};
 function deptAsks(id){const out=[];for(const k in DEPT){const fac=deptFacility(id,k);if(!fac||fac.busy||!fac.opt)continue;const o=fac.opt,lv=fac.have?fac.have.lv:0;
     out.push({k,key:o.key,cost:o.cost,weeks:o.weeks,annual:o.annual||0,lvNow:LV_NAME[lv]||'none',lvNext:LV_NAME[lv+1]||'',label:fac.have?`${COMPLEX[DEPT[k].fac].n} to ${LV_NAME[lv+1]}`:`Build ${/^[aeiou]/i.test(COMPLEX[DEPT[k].fac].n)?'an':'a'} ${COMPLEX[DEPT[k].fac].n.toLowerCase()}`,effect:COMPLEX[DEPT[k].fac].sig,head:deptHead(id,k),role:HEAD_ROLE[k],ask:HEAD_ASK[k]})}
   return out.sort((a,b)=>a.cost-b.cost)}
 function askButton(id,a,bare){const room=investRoom(id),can=room>=a.cost;
   return`<button class="g-plan-opt g-ask${bare?' bare':''}" data-act="invest" data-arg="${esc(a.key)}" ${can?'':'disabled aria-disabled="true"'}>${bare?'':`${faceSVG(a.head,{size:40,kit:clubKit(S.my).a})}`}<span><b>${esc(a.label)}</b><small>${bare?'':`<i>${esc(a.head)}, ${esc(a.role.toLowerCase())}:</i> `}“${esc(a.ask)}”</small><small class="g-cost">£${a.cost}k · ${a.weeks} weeks${a.annual?` · then £${a.annual}k a season to run`:''}${can?'':' · not enough money yet'}</small></span></button>`}
 /* milestones: things to build towards, from the club as it is (MB-16); progress you can see */
 function milestones(id){const c=CL(id),g=G(id),sg=groundSignals(id),out=[],bar=(t,now,target,txt,act,arg)=>out.push({t,pct:clamp(Math.round(now/Math.max(1,target)*100),0,100),txt,act,arg});
   const cap=sg.capacity,next=Math.ceil((cap+1)/500)*500;bar(`A ${n0(next)}-place ground`,cap,next,`${n0(cap)} places now`,'ctab','ground');
   const acad=g.plots.find(p=>p.kind==='academy'),al=acad?acad.lv:0;bar(al?`An academy rated ${LV_NAME[Math.min(8,Math.max(al+1,3))]}`:'Build an academy',al,Math.max(al+1,3),`now ${al?LV_NAME[al]:'no academy building'}`,'dept','academy');
   const tr=g.plots.find(p=>p.kind==='training'),tl=tr?tr.lv:0;bar(tl?`A training ground rated ${LV_NAME[Math.min(8,Math.max(tl+1,3))]}`:'Build a training ground',tl,Math.max(tl+1,3),`now ${tl?LV_NAME[tl]:'none'}`,'dept','training');
   const d=debt(id);if(d>0)bar('Debt-free',Math.max(0,F(id).cash),Math.max(0,F(id).cash)+d,`£${Math.round(d)}k still owed`,'hubmoney','overview');
   const xi=pickXI(S.squads[id]).filter(x=>x.p.academy&&x.p.originClub===id).length;bar('Two of our own in the eleven',xi,2,`${xi} now`,'tab','squad');
   if(c.tier>0)bar(`Promotion to ${TIER_NAME[c.tier-1]}`,Math.max(0,17-(S.week?posOf(id):c.expect||9)),15,S.week?`${ord(posOf(id))} now · top two go up`:'top two go up','tab','table');
   return out.filter(m=>m.pct<100).slice(0,4)}
 function growthCard(id){const c=CL(id),sg=groundSignals(id),ms=milestones(id);
   return`<section class="g-card g-grow"><small class="g-k">YOUR CLUB · WHERE IT IS GOING</small>
   <p class="g-clubline"><b>${esc(TIER_NAME[c.tier])}</b> · ground ${n0(sg.capacity)} · reputation ${Math.round(c.rep)} · £${investRoom(id)}k to invest</p>
   <ul class="g-ms">${ms.map(m=>`<li><button data-act="${m.act}" data-arg="${esc(m.arg)}"><span><b>${esc(m.t)}</b><small>${esc(m.txt)}</small></span><i class="g-msbar"><i style="width:${m.pct}%"></i></i></button></li>`).join('')}</ul></section>`}
 /* the department heads on the club page: who they are and what they want next */
 function headsCard(id){const asks=deptAsks(id);
   return`<section class="g-card g-heads"><small class="g-k">YOUR DEPARTMENT HEADS · £${investRoom(id)}k TO INVEST</small>${Object.keys(HEAD_ROLE).map(k=>{const a=asks.find(x=>x.k===k),fac=deptFacility(id,k),lv=fac&&fac.have?fac.have.lv:0,busy=fac&&fac.busy;
     return`<div class="g-head"><div class="g-ph">${faceSVG(deptHead(id,k),{size:40,kit:clubKit(S.my).a})}<div><b>${esc(deptHead(id,k))}</b><small>${esc(HEAD_ROLE[k])} · ${esc(COMPLEX[DEPT[k].fac].n)}: ${lv?LV_NAME[lv]:'not built'}</small></div><button class="btn ghost g-mini" data-act="dept" data-arg="${k}">Open</button></div>
     ${busy?`<p class="g-hint">Building work under way.</p>`:a?askButton(id,a,true):'<p class="g-hint">Nothing more to build here.</p>'}</div>`}).join('')}</section>`}
 /* ----- THE DEPARTMENTS (27-11): each one is a person, their people and their building. One question per department:
    is it ahead of or behind the division, and what does the next step cost (a week, or once from the building pot)? ----- */
 const ROOMS=[['On the pitch','Makes the team stronger',['training','medical','academy','scouting']],['On matchday','The ground and the crowd',['matchday','grounds']],['The business','Income and members',['commercial','community']]];
 const roleOf=k=>HEAD_ROLE[k]||(k==='grounds'?'Head groundsman':'Head of department');
 const verdict=g=>g===true?['ahead','Ahead of the division']:g===false?['behind','Behind the division']:['level','Level with the division'];
 /* what the wage limit would be with another staff level (the running costs come out of the same turnover) */
 function capWithStaff(id,k,n){const d=G(id).depts[k],s0=d.staff;d.staff=n;const c=wageCapK(id);d.staff=s0;return c}
 /* strength: what the people and the building can do together (the building only works as far as the people can run it) */
 function deptPower(id,k){const d=G(id).depts[k],f=DEPT[k].fac,pl=f&&G(id).plots.find(p=>p.kind===f);return d.staff*.45*BUDGET_F[d.budget]+(pl?operatingLevel(id,pl):0)}
 function deptKpiNow(id,k){const kp=deptKpi(id,k);if(S.week>=6&&kp.good!=null)return kp;
   const me=deptPower(id,k),ids=tierIds(CL(id).tier).filter(i=>i!==id),avg=ids.reduce((a,i)=>a+deptPower(i,k),0)/Math.max(1,ids.length);
   return{label:'Strength (people and building)',text:`${me.toFixed(1)} · division ${avg.toFixed(1)}`,good:Math.abs(me-avg)<.25?null:me>avg}}
 function deptState(id,k){const d=G(id).depts[k],fac=deptFacility(id,k),kp=deptKpiNow(id,k),have=fac&&fac.have;
   return{d,fac,kp,lv:have?have.lv:0,run:have?operatingLevel(id,have):0,building:DEPT[k].fac?COMPLEX[DEPT[k].fac].n:null}}
 function deptsCard(id){const room=investRoom(id);
   return`<section class="g-card g-depts2"><small class="g-k">YOUR DEPARTMENTS · £${n0(deptCost(id)*1000)} A WEEK</small>
   <p class="g-hint">Each department is a head, their people (paid every week) and a building (paid once, from the building pot: £${room}k left).</p>
   ${ROOMS.map(([t,sub,ks])=>`<h3 class="dp-room">${esc(t)} <small>${esc(sub)}</small></h3>${ks.map(k=>{const x=deptState(id,k),[cls,word]=verdict(x.kp.good);
     return`<button class="dp-row" data-act="dept" data-arg="${k}">${faceSVG(deptHead(id,k),{size:40,kit:clubKit(S.my).a})}
     <span class="dp-main"><b>${esc(DEPT[k].n)}</b><small>${esc(x.kp.label)}: ${esc(x.kp.text)}</small>
     <span class="dp-chips"><i>People ${'●'.repeat(x.d.staff)}${'○'.repeat(5-x.d.staff)}</i>${x.building?`<i>${x.lv?esc(LV_NAME[x.lv])+' '+esc(x.building.toLowerCase()):'No '+esc(x.building.toLowerCase())}</i>`:''}${x.d.hiring?'<i>Hiring…</i>':''}${x.fac&&x.fac.busy?'<i>Building…</i>':''}</span></span>
     <span class="dp-v ${cls}">${esc(word.split(' ')[0])}</span><span class="dp-next">${esc(deptNextStep(id,k))}</span></button>`}).join('')}`).join('')}</section>`}
 function deptNextStep(id,k){const d=G(id).depts[k],fac=deptFacility(id,k);if(d.hiring)return'Recruiting staff…';if(fac&&fac.busy)return'Building under way…';const o=fac&&fac.opt,up=d.staff<5?deptWeekCost(id,k,d.staff+1)-deptWeekCost(id,k):null;return['Next:',o?`build £${o.cost}k`:null,up!=null?`hire +£${n0(up*1000)}/w`:null].filter(Boolean).join(' ')}
 /* ----- CLUB COLOURS AND THE HOME SCENE (MB-30): every club has a kit and a crest; the home screen shows your own
    ground and town, drawn from the real ground (stands, roofs, floodlights), lit for the time of the season ----- */
 const KITS=[['#0f4a32','#e3b23c'],['#7a1f2b','#f3f1ea'],['#173e8c','#ffffff'],['#c4252e','#ffffff'],['#151515','#f2c200'],['#5b2a86','#f3f1ea'],['#e0661c','#151515'],['#6aaee0','#13294b'],['#f3f1ea','#151515'],['#0a6b5a','#f3f1ea'],['#8b1a1a','#8fc9ec'],['#1f3a5f','#e3b23c']];
 const KIT_PAT=['plain','stripes','hoops','halves','sash'];
 function clubKit(id){let h=7;for(const ch of String(id))h=(h*31+ch.charCodeAt(0))>>>0;const [a,b]=KITS[h%KITS.length];return{a,b,pat:KIT_PAT[(h>>>6)%KIT_PAT.length]}}
 globalThis.clubKit=clubKit;
 function crestSVG(id,sz=40){const k=clubKit(id),n=(CL(id)?.name||'').split(' ')[0].slice(0,5).toUpperCase(),u='cr'+String(id).replace(/\W/g,'');
   const pat={plain:'',stripes:`<path d="M13 0V60M26 0V60M39 0V60" stroke="${k.b}" stroke-width="6.5"/>`,hoops:`<path d="M0 24H52M0 38H52M0 52H52" stroke="${k.b}" stroke-width="6"/>`,halves:`<rect x="26" width="26" height="60" fill="${k.b}"/>`,sash:`<path d="M0 14 L52 58" stroke="${k.b}" stroke-width="10"/>`}[k.pat];
   return`<svg class="crest2" width="${sz}" height="${Math.round(sz*1.15)}" viewBox="0 0 52 60" aria-hidden="true"><clipPath id="${u}"><path d="M26 2 L49 9 V30 C49 45 38 53 26 58 C14 53 3 45 3 30 V9 Z"/></clipPath><g clip-path="url(#${u})"><rect width="52" height="60" fill="${k.a}"/>${pat}<rect width="52" height="16" fill="${k.b}"/></g><path d="M26 2 L49 9 V30 C49 45 38 53 26 58 C14 53 3 45 3 30 V9 Z" fill="none" stroke="${k.b}" stroke-width="2.5"/><text x="26" y="12.5" text-anchor="middle" font-family="var(--f-display),Impact,sans-serif" font-weight="800" font-size="${n.length>4?8.5:10}" fill="${k.a}">${esc(n)}</text></svg>`}
 globalThis.crestSVG=crestSVG;
 /* the time of the season: summer afternoon, autumn, winter under the floodlights, spring */
 function scenePhase(){const w=S.week;if(w===0)return{k:'summer',sky:['#7cc3f0','#d9effa'],sun:'#ffd75e',lit:false,txt:'Pre-season · a July afternoon'};if(seasonOver())return{k:'may',sky:['#f0a35c','#fbe1b7'],sun:'#ffb347',lit:false,txt:'The last day of the season'};
   if(w<=10)return{k:'autumn',sky:['#8fb4cf','#e7d8c2'],sun:'#f6c35b',lit:false,txt:'Autumn · leaves on the terraces'};if(w<=20)return{k:'winter',sky:['#16233b','#3d4f73'],sun:'#e9eef7',lit:true,txt:'Winter · under the floodlights'};return{k:'spring',sky:['#9fd0ee','#eef7e6'],sun:'#ffe27a',lit:false,txt:'Spring · the run-in'}}
 function townSilhouette(town,fill){
   const base='M0 120 L0 96 L18 96 L18 88 L30 88 L30 96 L46 96 L46 84 L60 84 L60 96 L300 96 L300 86 L316 86 L316 96 L336 96 L336 90 L360 90 L360 120Z';
   const icon={mill:'<rect x="70" y="58" width="9" height="40"/><rect x="82" y="78" width="40" height="20"/><path d="M82 78 l10-8 10 8 10-8 10 8"/>',mining:'<path d="M276 98 L290 56 L304 98 M282 80 H298 M286 66 H294"/><circle cx="290" cy="56" r="7" fill="none" stroke="'+fill+'" stroke-width="3"/>',
     cathedral:'<path d="M286 98 V70 L292 40 L298 70 V98Z"/><rect x="266" y="74" width="20" height="24"/><rect x="298" y="74" width="20" height="24"/>',harbour:'<path d="M276 98 V48 H316 M310 48 V66 M276 60 L300 48"/><rect x="292" y="66" width="24" height="10"/>',
     resort:'<circle cx="292" cy="68" r="24" fill="none" stroke="'+fill+'" stroke-width="3"/><path d="M292 44 V92 M268 68 H316 M275 51 L309 85 M309 51 L275 85" stroke="'+fill+'" stroke-width="1.5"/><path d="M280 98 L292 70 L304 98Z"/>',
     newtown:'<rect x="270" y="50" width="14" height="48"/><rect x="288" y="62" width="14" height="36"/><rect x="306" y="44" width="12" height="54"/>'}[town]||'';
   return`<g fill="${fill}" stroke="${fill}">${icon}</g><path d="${base}" fill="${fill}"/>`}
 function sceneSVG(id){const g=G(id),ph=scenePhase(),k=clubKit(id),c=CL(id),sg=groundSignals(id);
   const rings=Object.values(g.sides).reduce((a,s)=>a+s.rings,0),main=g.sides.W,end=g.sides.N,H=clamp(22+rings*2.2,30,62),roof=main.roof>0,lights=(g.fac.lights?.lv||0)>0;
   const seat=main.type==='seated',fillPct=clamp((S.tbl[id]?.form?.length?.7:.55)+(ph.k==='winter'?-.05:0),.3,.95);
   let crowd='';let h=11;for(let i=0;i<Math.round(90*fillPct);i++){h=(h*1103515245+12345)>>>0;const x=62+(h%236),y=124-H+6+((h>>>9)%Math.max(8,H-12));crowd+=`<rect x="${x}" y="${y}" width="2.4" height="2.4" fill="${i%5===0?k.b:i%3===0?k.a:'#3a3a3a'}" opacity=".85"/>`}
   const night=ph.lit,town=townSilhouette(c.town,night?'#0d1626':'rgba(40,52,64,.32)');
   const pylon=x=>lights?`<path d="M${x} 128 L${x} ${120-H-26}" stroke="${night?'#9aa6b8':'#6c7480'}" stroke-width="2"/><rect x="${x-7}" y="${116-H-30}" width="14" height="7" rx="1.5" fill="${night?'#fffbe6':'#9aa6b8'}"/>${night?`<path d="M${x-7} ${116-H-23} L${x-40} 150 L${x+40} 150 L${x+7} ${116-H-23}Z" fill="#fff6c8" opacity=".14"/>`:''}`:'';
   return`<svg class="sc-svg" viewBox="0 0 360 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ph.sky[0]}"/><stop offset="1" stop-color="${ph.sky[1]}"/></linearGradient></defs>
   <rect width="360" height="170" fill="url(#skyg)"/><circle cx="${night?300:66}" cy="${night?30:34}" r="${night?9:14}" fill="${ph.sun}" opacity="${night?.9:1}"/>${night?[[40,20],[120,14],[200,30],[250,12],[330,40],[160,44]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1" fill="#fff" opacity=".7"/>`).join(''):`<g fill="#fff" opacity=".75"><ellipse cx="150" cy="30" rx="26" ry="7"/><ellipse cx="170" cy="25" rx="18" ry="7"/><ellipse cx="270" cy="44" rx="20" ry="5"/></g>`}
   <g transform="translate(0 6)">${town}</g>
   ${pylon(48)}${pylon(312)}
   <rect x="56" y="${124-H}" width="248" height="${H+4}" fill="${night?'#1d2533':'#5a626e'}"/>${seat?Array.from({length:Math.floor(H/6)},(_,i)=>`<rect x="60" y="${128-H+i*6}" width="240" height="3" fill="${k.a}" opacity="${night?.55:.85}"/>`).join(''):Array.from({length:Math.floor(H/5)},(_,i)=>`<rect x="58" y="${126-H+i*5}" width="244" height="1.5" fill="#8a929c" opacity=".6"/>`).join('')}
   ${crowd}${roof?`<path d="M50 ${124-H} L310 ${124-H} L304 ${116-H} L56 ${116-H}Z" fill="${night?'#2b3446':'#3c4450'}"/><rect x="52" y="${124-H}" width="256" height="3" fill="${k.b}"/>`:''}
   <path d="M180 ${114-H} V${96-H}" stroke="#444" stroke-width="1.5"/><path d="M180 ${96-H} h16 l-3 5 3 5 h-16Z" fill="${k.a}"/><path d="M180 ${101-H} h16" stroke="${k.b}" stroke-width="2"/>
   <rect x="0" y="128" width="360" height="42" fill="${night?'#1d5a34':'#3f9a5c'}"/>${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${i*45}" y="128" width="22.5" height="42" fill="${night?'#1a5230':'#388f53'}"/>`).join('')}<path d="M0 131 H360 M180 128 V170" stroke="#fff" stroke-width="1.4" opacity=".75"/><ellipse cx="180" cy="160" rx="34" ry="9" fill="none" stroke="#fff" stroke-width="1.4" opacity=".75"/></svg>`}
 /* the club in four numbers: every decision on this screen moves one of them */
 function clubGauges(id){const f=F(id),lim=creditLimit(id),cash=f.cash,mem=agmForecastPct(id),ids=tierIds(CL(id).tier),rank=ids.slice().sort((a,b)=>teamStrength(b)-teamStrength(a)).indexOf(id)+1,w=S.week;
   const g=(k,v,pct,sub,cls,line)=>`<div class="sc-g ${cls||''}"><small>${k}</small><b>${v}</b><i class="sc-m"><i style="width:${clamp(pct,3,100)}%"></i>${line!=null?`<em style="left:${line}%"></em>`:''}</i><span>${sub}</span></div>`;
   return`<div class="sc-gauges">${g('Money',k1(cash),(cash+lim)/(lim*2+Math.max(1,Math.abs(cash)))*100,cash<0?'overdrawn':'in the bank',cash<0?'bad':'')}${g('Members',mem+'%',mem,'would vote for you',mem<50?'bad':'',50)}${g('Team',ord(rank),(ids.length-rank+1)/ids.length*100,'strongest of '+ids.length)}${g('Season',w?'Wk '+w:'July',w/SEASON_WEEKS*100,w?ord(posOf(id))+' in the table':'pre-season')}</div>`}
 function clubScene(id){const c=CL(id),ph=scenePhase(),w=S.week+1,fx=!seasonOver()&&S.week>0||S.week===0?fixtureOf(id,Math.max(1,w)):null,G0=groundSignals(id);
   const vs=fx?`<div class="sc-vs">${crestSVG(fx.home?id:fx.opp,38)}<div><b>${esc(fx.home?c.name:CL(fx.opp).name)}</b><small>v</small><b>${esc(fx.home?CL(fx.opp).name:c.name)}</b></div>${crestSVG(fx.home?fx.opp:id,38)}</div><p class="sc-ko">${S.week===0?'Opening day':'Saturday 15:00'} · ${esc(fx.home?c.ground:CL(fx.opp).ground)}${CL(id).rival===fx.opp?' · <b class="sc-derby">DERBY</b>':''}</p>`:'';
   const at=fx&&!fx.home&&S.week>0?fx.opp:id;return`<section class="sc"><div class="sc-art">${sceneSVG(at)}<div class="sc-cap"><small>${at===id?esc(ph.txt):'Away day · '+esc(ph.txt.split(' · ')[0])}</small><span>${esc(CL(at).ground)} · ${n0(groundSignals(at).capacity)}</span></div></div>${vs?`<div class="sc-match">${vs}</div>`:''}${clubGauges(id)}</section>`}
 /* ----- FACES (MB-29): a drawn portrait for every person, from a hash of their id. Kids look like kids. ----- */
 const SKIN=['#f2d0b5','#e8b996','#d39b72','#b07a52','#8a5a3b','#5e3b26'],HAIR=['#1d1612','#3b2618','#6b4527','#a8742f','#d9b25c','#8f8f8f','#b5432a'];
 function faceSVG(seed,o={}){let h=7;for(const ch of String(seed))h=(h*31+ch.charCodeAt(0))>>>0;const sz=o.size||44,kid=!!o.kid,sk=SKIN[h%SKIN.length],hc=HAIR[(h>>>4)%HAIR.length],hs=(h>>>8)%5,kit=o.kit||'var(--navy)';
   const hy=kid?19:18,hr=kid?11.5:10.5,sh=kid?'M9 48 Q10 36 24 35 Q38 36 39 48Z':'M5 48 Q7 34 24 33 Q41 34 43 48Z';
   const hair=[`<path d="M${24-hr} ${hy} Q24 ${hy-hr-6} ${24+hr} ${hy} Q${24+hr} ${hy-hr+1} 24 ${hy-hr-1} Q${24-hr} ${hy-hr+1} ${24-hr} ${hy}Z" fill="${hc}"/>`,
     `<path d="M${24-hr-1} ${hy+2} Q${24-hr} ${hy-hr-3} 24 ${hy-hr-2} Q${24+hr} ${hy-hr-3} ${24+hr+1} ${hy+2} L${24+hr-2} ${hy-3} Q24 ${hy-6} ${24-hr+2} ${hy-3}Z" fill="${hc}"/>`,
     `<path d="M${24-hr} ${hy-2} Q24 ${hy-hr-3} ${24+hr} ${hy-2} L${24+hr} ${hy-5} Q24 ${hy-hr-1} ${24-hr} ${hy-5}Z" fill="${hc}"/>`,
     `<circle cx="24" cy="${hy-4}" r="${hr+1}" fill="${hc}"/>`,`<path d="M${24-hr+1} ${hy-4} Q24 ${hy-hr-1} ${24+hr-1} ${hy-4}" stroke="${hc}" stroke-width="3" fill="none"/>`][hs];
   return`<svg class="face" width="${sz}" height="${sz}" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="var(--chip)"/><clipPath id="fc${h}"><circle cx="24" cy="24" r="24"/></clipPath><g clip-path="url(#fc${h})"><path d="${sh}" fill="${kit}"/><path d="M20 35 L24 39 L28 35" stroke="var(--onnavy)" stroke-width="1.6" fill="none"/>
   <rect x="21" y="${hy+hr-4}" width="6" height="7" fill="${sk}"/>${hs===3?hair:''}<ellipse cx="24" cy="${hy}" rx="${hr}" ry="${hr+1}" fill="${sk}"/>${hs!==3?hair:''}
   <circle cx="${24-hr*.38}" cy="${hy+1}" r="${kid?1.5:1.2}" fill="#1d1612"/><circle cx="${24+hr*.38}" cy="${hy+1}" r="${kid?1.5:1.2}" fill="#1d1612"/><path d="M${24-3} ${hy+5} Q24 ${hy+7.5} ${24+3} ${hy+5}" stroke="#7a3b2e" stroke-width="1.3" fill="none" stroke-linecap="round"/></g></svg>`}
 globalThis.faceSVG=faceSVG;
 /* ----- THE ACADEMY (MB-29): five age groups, a trial day, children with a history ----- */
 const GROW_WORD={early:'Early developer',steady:'Steady grower',late:'Late bloomer',volatile:'Up and down'};
 const stars=n=>`<span class="ac-stars" aria-label="${n} of 5 stars">${'★'.repeat(n)}<i>${'★'.repeat(5-n)}</i></span>`;
 function acadPanel(id){const A=ACAD();if(!A)return'';const t=UI.acadT||'U18',T=A.trial,last=A.teams[S.season-1]||A.teams[S.season]||{},head=deptHead(id,'academy');
   const kids=A.kids.filter(k=>acadTeamOf(k.age)===t).sort((a,b)=>acadStanding(id,b)-acadStanding(id,a)),rec=last[t];
   const trial=T&&!T.done?`<section class="ac-trial"><small class="g-k">TRIAL DAY · ${T.kids.length} NINE-YEAR-OLDS · ${T.places} PLACES</small>
     <div class="g-voice">${faceSVG(id+':academy')}<div><small>${esc(head)} · Academy manager</small><q>Six kids from the schools and Sunday clubs. We have room for ${T.places}. I have marked the ones I would take; it is your club.</q></div></div>
     <div class="ac-grid">${T.kids.map(k=>{const on=T.picked.length?T.picked.includes(k.id):T.advice.includes(k.id);return`<button class="ac-kid ${on?'on':''}" data-act="acadpick" data-arg="${k.id}" aria-pressed="${on}">${faceSVG(k.id,{kid:true,size:52,kit:'#6b7d74'})}<b>${esc(k.name)}</b><small>${esc(POS_ONE[k.pos]||k.pos)} · ${esc(k.from.club)}</small>${stars(acadStars(id,k))}${T.advice.includes(k.id)?'<i class="ac-adv">Manager’s pick</i>':''}</button>`}).join('')}</div>
     <p class="g-hint">${T.picked.length?`You picked ${T.picked.length} of ${T.places}.`:'Untouched, the manager’s picks join.'} The places are filled when the season starts.</p></section>`:'';
   const tabs=`<div class="ac-tabs" role="tablist">${ACAD_TEAMS.map(([n])=>`<button role="tab" aria-selected="${n===t}" class="${n===t?'on':''}" data-act="acadt" data-arg="${n}">${n}<small>${A.kids.filter(k=>acadTeamOf(k.age)===n).length}</small></button>`).join('')}</div>`;
   const team=`<div class="ac-team"><div class="ac-th"><b>${esc(CL(id).name)} ${t}s</b>${rec?`<span>${ord(rec.pos)} in the youth league · ${rec.w}W ${rec.d}D ${rec.l}L${rec.top?` · top scorer ${esc(rec.top.name)} (${rec.top.goals})`:''}</span>`:'<span>First season in the youth league</span>'}</div>
     <div class="ac-list">${kids.map(k=>{const st=acadStanding(id,k),l=k.hist.filter(x=>x.apps).slice(-1)[0];return`<button class="ac-row" data-act="acadkid" data-arg="${k.id}">${faceSVG(k.id,{kid:k.age<15,size:46})}<span class="ac-m"><b>${esc(k.name)}</b><small>${k.age} · ${esc(POS_ONE[k.pos]||k.pos)} · ${esc(GROW_WORD[k.grow])}</small><span class="ac-bar" title="Standing in the age group"><i style="width:${st}%"></i></span><small class="ac-note">${esc(k.moment||(l?l.note:`From ${k.from.club}, ${k.from.where}`))}</small></span>${stars(acadStars(id,k))}</button>`}).join('')||'<p class="g-hint">Nobody in this age group.</p>'}</div></div>`;
   const al=A.alumni.slice(-6).reverse();
   const alumni=al.length?`<h3>Alumni</h3><ul class="g-news">${al.map(a=>`<li>${a.pid&&findPlayer(a.pid)?`<button class="g-linkbtn" data-act="player" data-arg="${a.pid}">${esc(a.name)}</button>`:esc(a.name)} · ${esc(a.why)}</li>`).join('')}</ul>`:'';
   return`<section class="ac">${trial}<small class="g-k">THE AGE GROUPS · ${A.kids.length} CHILDREN</small>${tabs}${team}${alumni}</section>`}
 function acadKidSheet(id,kid){const A=ACAD(),k=A&&A.kids.find(x=>x.id===kid);if(!k)return'';const tot=k.hist.reduce((a,x)=>({apps:a.apps+x.apps,goals:a.goals+x.goals}),{apps:0,goals:0});
   return`<button class="btn ghost" data-act="acadkid" data-arg="">‹ The ${esc(acadTeamOf(k.age))}s</button>
   <div class="ac-hero">${faceSVG(k.id,{kid:k.age<15,size:84})}<div><h2>${esc(k.name)}</h2><p>${k.age} · ${esc(POS_ONE[k.pos]||k.pos)} · ${k.foot==='both'?'two-footed':k.foot+'-footed'}</p>${stars(acadStars(id,k))}</div></div>
   <ul class="g-list"><li><b>From:</b> ${esc(k.from.school)} and ${esc(k.from.club)}, ${esc(k.from.where)}.</li><li><b>With us since:</b> age ${k.joinAge} · ${tot.apps} games, ${tot.goals} goals.</li><li><b>How he grows:</b> ${esc(GROW_WORD[k.grow])}.</li></ul>
   <h3>Year by year</h3><ol class="ac-time">${k.hist.slice().reverse().map(x=>`<li><span class="ac-tb">${esc(x.team)}</span><div><b>Age ${x.age}</b>${x.apps?` · ${x.apps} games, ${x.goals} goals · rating ${x.rat}`:''}<p>${esc(x.note)}</p></div></li>`).join('')}</ol>`}
 deptSheet=function(k){
   const id=S.my,D=DEPT[k],x=deptState(id,k),d=x.d,fac=x.fac,[cls,word]=verdict(x.kp.good),head=deptHead(id,k),wkv=v=>'£'+n0(Math.abs(v)*1000);
   const quote=x.kp.good===false?`We are behind the division. ${HEAD_ASK[k]||'More hands would make the difference.'}`:x.kp.good===true?'We are ahead of the division. Keep us there and it shows on Saturdays.':'We are where the division is. One step either way shows.';
   const cap0=wageCapK(id);
   /* people: one level up or down, priced per week, with what it does to the wage limit */
   let people='',cut='';
   if(d.hiring)people=`<p class="g-hint">Recruiting to ${esc(STAFF_WORD[d.hiring.to].toLowerCase())}: ${d.hiring.left} week${d.hiring.left>1?'s':''} to go.</p>`;
   else{const up=d.staff<5?d.staff+1:null,dn=d.staff>1?d.staff-1:null;
     const dw=up?deptWeekCost(id,k,up)-deptWeekCost(id,k):0,capUp=up?cap0-capWithStaff(id,k,up):0;
     people=up?`<div class="dp-opt"><small class="g-k">PEOPLE · ${esc(STAFF_WORD[d.staff].toUpperCase())} → ${esc(STAFF_WORD[up].toUpperCase())}</small><p><b>+${wkv(dw)} a week</b>${capUp>.005?` · your wage limit drops ${wkv(capUp)} a week`:''}. A fee of ${wkv(deptWeekCost(id,k,up)*2)} and ${HIRE_WEEKS} weeks to recruit.</p><button class="btn" data-act="dstaff" data-arg="${k}:${up}">Hire more people</button></div>`:`<p class="g-hint">The people are elite already.</p>`;
     if(dn)cut=`<button class="g-opt g-leave" data-act="dstaff" data-arg="${k}:${dn}"><b>Cut to ${esc(STAFF_WORD[dn].toLowerCase())}</b><span>Saves ${wkv(deptWeekCost(id,k)-deptWeekCost(id,k,dn))} a week after four weeks' severance. The department gets weaker.</span></button>`}
   /* the building: once, from the building pot; and whether the people can run all of it */
   let bld='';
   if(fac){const o=fac.opt,room=investRoom(id);
     const runs=x.lv&&x.run<x.lv?`<p class="dp-warn">The ${esc(x.building.toLowerCase())} works at level ${x.run} of ${x.lv}: there are not enough people to run all of it.</p>`:'';
     if(fac.busy)bld=`<p class="g-hint">Building work under way. Follow it under Running on the week screen.</p>`;
     else if(o)bld=`<div class="dp-opt"><small class="g-k">BUILDING · ${x.lv?esc(LV_NAME[x.lv].toUpperCase())+' → '+esc((LV_NAME[x.lv+1]||'').toUpperCase()):'NOT BUILT YET'}</small><p><b>£${o.cost}k once</b>, from the building pot (£${room}k left). ${o.weeks} weeks${o.permit?' after the permit':''}${o.annual?`, then £${o.annual}k a season to run`:''}. ${esc(COMPLEX[D.fac].sig)}.</p>
       <button class="btn" data-act="invest" data-arg="${esc(o.key)}" ${room>=o.cost?'':'disabled aria-disabled="true"'}>${room>=o.cost?'Build it':`Needs £${o.cost-room}k more in the building pot`}</button></div>`;
     else bld=`<p class="g-hint">${fac.noPlot?'No free plot for another building.':'The building is as big as it gets.'}</p>`;
     bld=runs+bld}
   const tight=d.budget==='tight'?`<div class="dp-opt"><small class="g-k">RUNNING BUDGET · CUT BY THE TREASURER</small><p>The department works with 70% of its equipment and travel money.</p><button class="btn ghost" data-act="gdept" data-arg="${k}:normal">Restore it · +${wkv(deptWeekCost(id,k,null,'normal')-deptWeekCost(id,k))} a week</button></div>`:'';
   const course=`<h3>The way of working</h3><div class="g-goals">${D.courses.map(c=>{const on=(d.pending||d.course)===c;return`<button class="g-opt ${on?'on':''}" data-act="gcourse" data-arg="${k}:${c}" aria-pressed="${on}"><b>${on?'✓ ':''}${esc(c[0].toUpperCase()+c.slice(1))}</b><span>${esc(D.cd[c])}</span></button>`}).join('')}</div><p class="g-hint">${d.pending?`Switching to ${esc(d.pending)}: ${d.settle} weeks to settle.`:'A change costs nothing, but takes a season to settle.'}</p>`;
   const extra=departmentPipeline(k);
   if(k==='academy'&&UI.acadKid)return overlayShell(D.n,acadKidSheet(id,UI.acadKid));
   return overlayShell(D.n,`<div class="g-voice">${faceSVG(head,{size:40,kit:clubKit(S.my).a})}<div><small>${esc(head)} · ${esc(roleOf(k))}</small><q>${esc(quote)}</q></div></div>
   <section class="dp-kpi ${cls}"><small>${esc(x.kp.label)}</small><b>${esc(x.kp.text)}</b><span>${esc(word)}</span></section>
   <p class="g-hint">${esc(D.does)}</p>${k==='academy'?acadPanel(id):''}
   <h3>Make it stronger</h3>${people}${bld}${tight}
   ${cut?`<h3>Save money</h3>${cut}`:''}
   ${course}${extra?`<details class="g-close"><summary>Inside the department</summary>${extra}</details>`:''}`);
 };
 /* ----- THE BOOKS: money as a chairman feels it. Cash, the season so far, wages against turnover, where it ends ----- */
 function books(id){const f=F(id),inc=estSeasonIncome(id),wr=Math.round(wageBillK(id)*SEASON_WEEKS/Math.max(1,inc)*100),op=operatingResult(f.season||{}),fc=cashForecast(id,Math.max(1,SEASON_WEEKS-S.week)),end=fc.mid[fc.mid.length-1]??f.cash,lim=creditLimit(id);
   return{cash:Math.round(f.cash),op:Math.round(op),wr,end:Math.round(end),low:Math.round(fc.minV),lowW:S.week+fc.minW,lim,tight:fc.minV<-lim*.5||f.cash<0}}
 function booksCard(id){const b=books(id),tr=deptHead(id,'finance'),line=b.tight?`We dip to ${k1(b.low)} around week ${b.lowW}. The bank allows ${k1(-b.lim)}.`:b.wr>75?`Wages are ${b.wr}% of turnover. That is where clubs get into trouble.`:b.end<b.cash?`We spend more than we earn: ${k1(b.end)} by the end of the season.`:`We end the season around ${k1(b.end)}. There is room, not much.`;
   return`<section class="g-card g-books ${b.tight?'tight':''}"><small class="g-k">THE BOOKS</small><div class="g-bk"><span><small>Cash</small><b class="${b.cash<0?'bad':''}">${k1(b.cash)}</b></span><span><small>Season so far</small><b class="${b.op<0?'bad':'good'}">${signed(b.op)}</b></span><span><small>Wages / turnover</small><b class="${b.wr>75?'bad':b.wr>65?'warn':''}">${b.wr}%</b></span><span><small>End of season</small><b class="${b.end<0?'bad':''}">${k1(b.end)}</b></span></div>${budgetStrip(id)}<p class="g-hint"><b>${esc(tr)}, treasurer:</b> “${esc(line)}”</p></section>`}
 /* the treasurer comes to you when the money runs out: the chairman's levers, each with its price */
 function bankMsg(id){const b=books(id);if(!b.tight||snoozed('bank'))return null;const need=Math.max(10,Math.min(maxNewLoan(id),Math.ceil((-b.low+b.lim*.5)/5)*5)),dep=Object.keys(G(id).depts).filter(k=>G(id).depts[k].budget!=='tight').length;
   const sell=S.squads[id].filter(p=>!p.loan&&!topThree(id).includes(p)).sort((a,b)=>playerValue(b)-playerValue(a))[0];
   return{kind:'decision',from:deptHead(id,'finance'),role:'Treasurer',subject:b.cash<0?'We are overdrawn':'The money runs out this season',open:true,
     body:`On this course we reach ${k1(b.low)} around week ${b.lowW}; the bank allows ${k1(-b.lim)}. Beyond that the bank sells players for us, and administration costs six points.`,
     html:`<div class="ib-acts ib-col">${maxNewLoan(id)>=10?`<button class="g-opt" data-act="bankloan" data-arg="${need}"><b>Borrow £${need}k over five years</b><span>The hole is filled; interest every week for five years.</span></button>`:''}
     <button class="g-opt" data-act="bankprices"><b>Raise ticket prices by £1</b><span>More at the gate; the members will notice.</span></button>
     ${dep?`<button class="g-opt" data-act="bankcut"><b>Put ${dep} department${dep>1?'s':''} on a tight budget</b><span>Saves money every week; they deliver less.</span></button>`:''}
     ${sell?`<button class="g-opt" data-act="banksell" data-arg="${esc(sell.id)}"><b>Sell ${esc(sell.name)} in the winter window</b><span>Worth about ${k1(playerValue(sell))}; the director lists him.</span></button>`:''}
     <button class="g-opt g-leave" data-act="snooze" data-arg="bank"><b>Not yet</b><span>The treasurer asks again in a few weeks.</span></button></div>`}}
 globalThis.bankMsg=bankMsg;globalThis.books=books; /* the treasurer's logic, reachable for tests (tests/money-test.js) */
 /* ----- THE INBOX: people who talk to you. Decisions that are yours, advice from your staff, reports. No routine approvals
    (D-G1): the staff handle routine; and never only an inbox (MB-03): you can always start something yourself below it. ----- */
 const ini2=n=>String(n||'?').split(' ').map(w=>w[0]).join('').slice(0,2);
 const snoozed=k=>((S.inboxSnooze||{})[k]||0)>S.season*100+S.week;
 function ibMsg(o){return`<article class="ib-msg ib-${o.kind}${o.open?' open':''}"><details ${o.open?'open':''}><summary>${faceSVG(o.from,{size:40,kit:clubKit(S.my).a})}<span class="ib-head"><small>${esc(o.from)} · ${esc(o.role)}</small><b>${esc(o.subject)}</b></span><i class="ib-tag">${{decision:'DECIDE',advice:'ADVICE',report:'REPORT'}[o.kind]}</i></summary><div class="ib-body">${o.body?`<p>${esc(o.body)}</p>`:''}${o.html||''}</div></details></article>`}
 const ibBtns=(...b)=>`<div class="ib-acts">${b.filter(Boolean).join('')}</div>`;
 const ibBtn=(label,act,arg,ghost)=>`<button class="btn${ghost?' ghost':''}" data-act="${act}"${arg!=null?` data-arg="${esc(arg)}"`:''}>${esc(label)}</button>`;
 function inboxItems(id){const out=[],td=tdOf(id),co=coachOf(id),dn=td?td.name:'The director',now=S.season*100+S.week;
   /* decisions: the moments, the debrief and window calls, each already a full card with its options */
   const bank=bankMsg(id);if(bank)out.push(bank);
   const dec=escalation();if(dec)out.push({kind:'decision',from:S.moment?S.moment.who:'Your desk',role:S.moment?S.moment.role:'Waiting for you',subject:S.moment?S.moment.title:'A decision is waiting',html:dec,open:true});
   /* reports: what your week turned up, the director's watch list, the coach after Saturday */
   const fresh=(S.scout?S.scout.gems:[]).filter(g=>g.status==='found'&&g.s===S.season&&now-(g.s*100+g.w)<=2);
   if(fresh.length)out.push({kind:'report',from:deptHead(id,'scouting'),role:'Chief scout',subject:`${fresh.length} player${fresh.length>1?'s':''} worth a look`,body:'Here is what we saw. Tap a name for the data; recommend the ones you want the director to weigh.',open:true,
     html:`<ul class="ib-list">${fresh.map(g=>`<li><button class="pp-link" data-act="player" data-arg="${esc(g.pid)}">${esc(g.name)}</button> <small class="muted">${esc(POS_ONE[g.pos]||g.pos)}, ${g.age} · ~${Math.round(qualityToStr(g.est))} · ${g.fee?'£'+g.fee+'k':'free'}</small><button class="btn ghost g-mini" data-act="chairrec" data-arg="${esc(g.pid)}">Recommend to ${esc(dn)}</button></li>`).join('')}</ul>`});
   const kids=(S.scout?S.scout.prospects:[]).filter(p=>p.status==='seen'&&p.s===S.season);
   if(kids.length)out.push({kind:'report',from:deptHead(id,'academy'),role:'Academy manager',subject:`${kids.length} fifteen-year-olds from the tournament`,body:'Invite the ones you like; they decide next summer.',
     html:`<ul class="ib-list">${kids.slice(-3).map(k=>`<li><b>${esc(k.name)}</b> <small class="muted">${esc(POS_ONE[k.pos]||k.pos)} · could reach ~${Math.round(qualityToStr(k.seen))}</small><button class="btn ghost g-mini" data-act="chairinvite" data-arg="${esc(k.id)}">Invite</button></li>`).join('')}</ul>`});
   const m=myMatches()[0];if(S.week>0&&m&&co){const mine=m.h===id?[m.gh,m.ga]:[m.ga,m.gh];out.push({kind:'report',from:co.name,role:'Head coach',subject:mine[0]>mine[1]?'A good afternoon':mine[0]<mine[1]?'Not good enough on Saturday':'A point',body:`${mine[0]}–${mine[1]}. On the chances, ${xgWord(m)}.${S.squads[id].some(p=>p.inj>0)?` Out injured: ${S.squads[id].filter(p=>p.inj>0).slice(0,2).map(p=>p.name).join(', ')}.`:''}`})}
   /* advice: your staff want something from you this week */
   const needs=(typeof openNeeds==='function'?openNeeds():[]).slice().sort((a,b)=>(b.prio||0)-(a.prio||0)),n=needs[0];
   if(n&&!chairWhyNot('trip')&&!snoozed('trip')){const reg=Object.entries(REGIONS).filter(([k,r])=>r.pos&&r.pos.includes(n.pos)).sort((a,b)=>a[1].cost-b[1].cost)[0]||['low',REGIONS.low],w=weakestAt(id,n.pos);
     out.push({kind:'advice',from:deptHead(id,'scouting'),role:'Chief scout',subject:`Come with me to look at ${POS_ONE[n.pos]}s`,body:`${w.name?`${w.name} (${Math.round(qualityToStr(w.q))}) is our weak spot. `:''}I would go to ${reg[1].n}: ${reg[1].d} About £${reg[1].cost}k, and it takes your week.`,
       html:ibBtns(ibBtn("Let's go",'chairtrip',reg[0]),ibBtn('Somewhere else','chairpick',null,true),ibBtn('Not this week','snooze','trip',true))})}
   const yg=M(id).goals&&M(id).goals.find(g=>g.k==='youth');
   if(!chairWhyNot('trip')&&!snoozed('tour'))out.push({kind:'advice',from:deptHead(id,'academy'),role:'Academy manager',subject:'The regional youth tournament is on',body:`${yg?`We promised the members ${yg.target} academy games; we have ${academyApps(id)}. `:''}Fifteen-year-olds who could join us next summer. About £1k; it takes your week.`,html:ibBtns(ibBtn("I'll come",'chairtour'),ibBtn('Not this week','snooze','tour',true))});
   const g=CL(id).groups.slice().sort((a,b)=>a.mood-b.mood)[0];
   if(g&&g.mood<58&&!chairWhyNot('home')&&!snoozed('home'))out.push({kind:'advice',from:deptHead(id,'community'),role:'Membership secretary',subject:`${groupName(id,g)} feel ignored`,body:`Their mood is ${Math.round(g.mood)} and they are ${g.share}% of the vote. What they want: ${ARCH[g.k]?ARCH[g.k].wants:''} A week among them would help.`,html:ibBtns(ibBtn('Spend the week with them','chairhome'),ibBtn('Not now','snooze','home',true))});
   const ask=deptAsks(id).find(a=>!snoozed('ask:'+a.k)&&investRoom(id)>=a.cost);
   if(ask)out.push({kind:'advice',from:ask.head,role:ask.role,subject:ask.label,body:`“${ask.ask}” £${ask.cost}k, ${ask.weeks} weeks${ask.annual?`, then £${ask.annual}k a season to run`:''}. We have £${investRoom(id)}k to invest.`,html:ibBtns(ibBtn('Approve the plan','invest',ask.key),ibBtn('Not now','snooze','ask:'+ask.k,true))});
   if(!chairWhyNot('data')&&!snoozed('data'))out.push({kind:'advice',from:deptHead(id,'data'),role:'Data analyst',subject:'Players who play above their price',body:'Give me a day and I will show you who the numbers like, anywhere in the world. It fits alongside a trip.',html:ibBtns(ibBtn('Show me','chairdata'),ibBtn('Not now','snooze','data',true))});
   return out}
 function inboxCard(id){const it=inboxItems(id),done=weekDone(scNow()).map(r=>`<p class="g-did">✓ ${esc(r)}</p>`).join(''),nd=it.filter(x=>x.kind==='decision').length;
   if(UI.pickRegion)return yourWeek(id);
   return`<section class="ib"><div class="ib-top"><small class="g-k">YOUR INBOX</small><span class="ib-count">${it.length} message${it.length===1?'':'s'}${nd?` · ${nd} to decide`:''}</span></div>${done}${it.filter(x=>x.kind==='decision').map(ibMsg).join('')}${it.some(x=>x.kind!=='decision')?`<details class="ib-own"><summary>${it.filter(x=>x.kind!=='decision').length} notes from your staff</summary>${it.filter(x=>x.kind!=='decision').map(ibMsg).join('')}</details>`:''}</section>`}
 /* ----- THE NEWS TICKER: the world moves while you read ----- */
 function tickerItems(id){const tier=CL(id).tier,out=[];
   const ev=(S.ev||[]).filter(e=>e.s===S.season&&S.week-e.w<=1).slice(-60).reverse();
   for(const e of ev){if(out.length>=10)break;if(e.t==='Transfer'&&e.fee>=15)out.push(e.text);else if(['StaffSacked','StaffPoached','StaffHired'].includes(e.t)&&e.c!==id)out.push(e.text);else if(['Promotion','CupWon','Administration'].includes(e.t))out.push(e.text)}
   {const A=S.acad;if(A)for(const n of A.news.filter(n=>n.s===S.season&&S.week-n.w<=1).slice(-2))out.unshift('⚽ '+n.t)}
   const ms=(S.matches||[]).filter(m=>m.comp!=='cup'&&CL(m.h)&&CL(m.h).tier===tier).slice(0,6);for(const m of ms)out.push(`${CL(m.h).name} ${m.gh}–${m.ga} ${CL(m.a).name}`);
   if(S.week>0){const top=(S.tbl&&tierIds(tier).slice().sort((a,b)=>posOf(a)-posOf(b))[0]);if(top)out.push(`${CL(top).name} lead ${TIER_NAME[tier]}`)}
   return out.length?out:[`${TIER_NAME[tier]}: the new season is close`]}
 function newsTicker(id){const it=tickerItems(id),row=it.map(t=>`<span>${esc(t)}</span>`).join('<i aria-hidden="true">●</i>');
   return`<div class="g-ticker" role="region" aria-label="News ticker"><b class="g-tk-label">NEWS</b><div class="g-tk-view"><div class="g-tk-track" style="--dur:${Math.max(25,it.length*6)}s">${row}<i aria-hidden="true">●</i><span aria-hidden="true" class="g-tk-dup">${row}</span></div></div></div>`}
 /* ----- THE WEEK (§6): the match and its stakes · what is on your desk · your plans, from the club's situation ·
    what you set running and how it stands · the club at a glance. One clear way on: Saturday. ----- */
 function deskCard(){const e=escalation();return e?`<section class="g-desk"><small class="g-k">ON YOUR DESK</small>${e}</section>`:`<p class="g-clear">Your desk is clear. The club runs itself this week.</p>`}
 const nextWindowWord=()=>S.week<WINTER_WEEK-1?`the winter window (week ${WINTER_WEEK-1})`:'the summer window';
 /* plans: two to four things worth your week, each tied to something the club needs right now (MB-03, MB-12) */
 function plans(id){const out=[],needs=(typeof openNeeds==='function'?openNeeds():[]).slice().sort((a,b)=>(b.prio||0)-(a.prio||0));
   const n=needs[0];if(n){const reg=Object.entries(REGIONS).filter(([k,r])=>r.pos&&r.pos.includes(n.pos)).sort((a,b)=>a[1].cost-b[1].cost)[0]||['low',REGIONS.low],w=weakestAt(id,n.pos);
     out.push({k:'trip',act:'chairtrip',arg:reg[0],ic:'✈',t:`Scout a ${POS_ONE[n.pos]}: ${reg[1].n}`,why:`${w.name?`${w.name} (${Math.round(qualityToStr(w.q))}) is our weak spot there. `:''}£${reg[1].cost}k, takes the week. What you find goes to ${tdOf(id)?tdOf(id).name:'the director'} for ${nextWindowWord()}.`})}
   const yg=M(id).goals&&M(id).goals.find(g=>g.k==='youth'),apps=academyApps(id);
   out.push({k:'trip',act:'chairtour',ic:'★',t:'The regional youth tournament',why:`${yg?`Your academy promise: ${apps} of ${yg.target} games. `:''}Fifteen-year-olds who could join next summer. £1k, takes the week.`});
   const g=CL(id).groups.slice().sort((a,b)=>a.mood-b.mood)[0],a=g&&ARCH[g.k];
   if(g)out.push({k:'home',act:'chairhome',ic:'⌂',t:`A week with ${groupName(id,g)}`,why:`Their mood: ${Math.round(g.mood)} of 100, ${g.share}% of the vote. They want: ${a?a.wants:''}`});
   out.push({k:'data',act:'chairdata',ic:'▤',t:'A day with the analyst',why:'Players across the world who play above their price. Fits alongside a trip, once a week.'});
   return out}
 function plansCard(id){const done=weekDone(scNow()).map(r=>`<p class="g-did">✓ ${esc(r)}</p>`).join('');if(UI.pickRegion)return yourWeek(id);
   const P_=plans(id);return`${done}<section class="g-card g-plans"><small class="g-k">YOUR PLANS THIS WEEK</small>
   ${P_.map(x=>{const why=chairWhyNot(x.k);return`<button class="g-plan-opt" data-act="${x.act}"${x.arg?` data-arg="${esc(x.arg)}"`:''} ${why?'disabled aria-disabled="true"':''}><span class="g-pic" aria-hidden="true">${x.ic}</span><span><b>${esc(x.t)}</b><small>${esc(why||x.why)}</small></span></button>`}).join('')}
   <button class="btn ghost" data-act="chairpick" ${chairWhyNot('trip')?'disabled':''}>Another trip…</button>
   <h3 class="g-h3">Build the club · £${investRoom(id)}k to invest</h3>${deptAsks(id).slice(0,2).map(x=>askButton(id,x)).join('')||'<p class="g-hint">Nothing to build right now.</p>'}<button class="btn ghost" data-act="tab" data-arg="club">All departments…</button></section>`}
 /* running: what the chairman set in motion, and where it stands; this is where a week's work pays off */
 function runningCard(id){const A=S.scout||{gems:[],prospects:[]},td=tdOf(id),dn=td?td.name:'The director',rows=[];
   for(const g of A.gems.filter(g=>g.s===S.season&&!['gone','found'].includes(g.status)).slice(-4).reverse()){const st=g.status==='signed'?'<em class="g-ok">Signed · plays for us now</em>':g.status==='recommended'?`<em>${esc(dn)} is watching him · ${esc(nextWindowWord())} decides</em>`:`<button class="btn ghost g-mini" data-act="chairrec" data-arg="${esc(g.pid)}">Recommend to ${esc(dn)}</button>`;
     rows.push(`<li><span class="g-rk">FIND</span><div><button class="pp-link" data-act="player" data-arg="${esc(g.pid)}">${esc(g.name)}</button> <small class="muted">${esc(POS_ONE[g.pos]||g.pos)}, ${g.age} · ~${Math.round(qualityToStr(g.est))}${g.fee?` · £${g.fee}k`:' · free'}</small>${st}</div></li>`)}
   for(const pr of A.prospects.filter(p=>p.s===S.season&&p.status==='invited').slice(-3).reverse())
     rows.push(`<li><span class="g-rk">YOUTH</span><div><b>${esc(pr.name)}</b> <small class="muted">${esc(POS_ONE[pr.pos]||pr.pos)}, 15</small>${pr.status==='invited'?'<em>Invited · decides next summer</em>':`<button class="btn ghost g-mini" data-act="chairinvite" data-arg="${esc(pr.id)}">Invite to the academy</button>`}</div></li>`);
   for(const p of pactsOpen())rows.push(`<li><span class="g-rk">WORD</span><div><b>${esc(p.label)}</b> <small class="muted">${esc(p.who)}</small><em>${esc(pactProgress(p))}</em></div></li>`);
   for(const p of G(id).projects.filter(x=>x.phase!=='done'))rows.push(`<li><span class="g-rk">BUILD</span><div><b>${esc(p.label||p.key)}</b><em>${p.phase==='permit'?'Waiting for the permit':`${p.left} weeks to go`}</em></div></li>`);
   return`<section class="g-card g-running"><small class="g-k">RUNNING</small>${rows.length?`<ul class="g-run">${rows.join('')}</ul>`:'<p class="g-hint">Nothing running yet. A trip, a promise or a project starts something.</p>'}</section>`}
 function clubGlance(id){return`<details class="g-close g-glance"><summary>The club · ${S.week?ord(posOf(id)):'—'} · members’ trust ${Math.round(M(id).conf)}</summary>${statusStrip(id)}${tableCard()}${lookBackCard(id)}${promisesCompact(id)}${weekClose(id)}</details>`}
 /* what your week did, at full time */
 /* what the chairman did in a week, in one line per action (kept per week, not just the last one) */
 function weekDone(w){return(UI.weekLog||[]).filter(r=>r.w===w).map(R=>R.kind==='home'?(R.group?`A week with ${R.group}: their mood ${R.before} → ${R.after}.`:'A week at the club.')
   :R.kind==='tour'?`Youth tournament: ${R.found.length} fifteen-year-olds seen. Invite them under Running.`
   :R.found&&R.found.length?`${R.kind==='data'?'The analyst':'Your trip to '+R.region} found ${R.found.map(g=>g.name).join(', ')}. Recommend them under Running.`:`${R.kind==='data'?'The analyst':'Your trip'} found nobody worth the money.`)}
 function weekRecap(){const t=weekDone(scNow()-1);if(!t.length)return'';return`<section class="g-card g-recap"><small class="g-k">YOUR WEEK</small>${t.map(x=>`<p>${esc(x)}</p>`).join('')}</section>`}
 /* ----- THE WEEK (MB-35): one skeleton. Where and when → your desk → your week (where you spend your time) → Saturday
    → the club in a few lines → the news. The chairman's verbs: decide, travel, be seen, back or warn people, invest. ----- */
 function seasonDate(w){const d=new Date(Date.UTC(2026,7,8+7*(w-1)+(w>WINTER_WEEK-3?14:0)));return d.toUTCString().slice(0,11).replace(',','')}
 /* ----- THE CHAIRMAN'S WEEK (MB-36): who you see midweek, where you sit on Saturday ----- */
 function agendaCard(id){const A=AG(),ts=agendaTopics(id),seats=agendaSeats(id),kit=clubKit(id).a,open=UI.agOpen;
   const met=A.met?`<div class="ag-done">${faceSVG(A.met.who,{size:36,kit})}<span><small>MIDWEEK · DONE</small><b>${esc(A.met.who)}: ${esc(A.met.title)}</b><em>${esc(A.met.opt)}</em></span></div>`:'';
   const rows=A.met?'':ts.map(t=>{const on=open===t.k;return`<div class="ag-row ${on?'on':''} ${t.urgent?'urgent':''}"><button class="ag-head" data-act="agopen" data-arg="${esc(t.k)}" aria-expanded="${on}">${faceSVG(t.who,{size:40,kit:t.k==='fans'?'#6b7d74':kit})}<span><small>${esc(t.role.toUpperCase())}</small><b>${esc(t.title)}</b></span>${t.urgent?'<i class="ag-tag">URGENT</i>':'<i class="ag-arrow">›</i>'}</button>
     ${on?`<div class="ag-body"><p>“${esc(t.line)}” <small>— ${esc(t.who)}</small></p>${t.opts.map(o=>`<button class="ag-opt" data-act="agmeet" data-arg="${esc(t.k)}|${esc(o.k)}"><b>${esc(o.t)}</b><span>${esc(o.fx)}</span></button>`).join('')}</div>`:''}</div>`}).join('');
   const seat=A.seat?`<div class="ag-done"><span><small>SATURDAY · YOUR SEAT</small><b>${esc(A.seat.t)}</b></span></div>`:seats.length?`<div class="ag-seats">${seats.map(x=>`<button class="ag-seat" data-act="agseat" data-arg="${esc(x.k)}"><b>${esc(x.t)}</b><span>${esc(x.fx)}</span></button>`).join('')}</div>`:'<p class="rt-note">No match this Saturday.</p>';
   return`<section class="rt ag">${rtBar('YOUR WEEK',`${(A.met?1:0)+(A.seat?1:0)}/2 CHOSEN${A.met&&A.seat?' · READY':''}`)}
   <div class="rt-h">MIDWEEK · WHO DO YOU SEE? ${A.met?'':`<small>${ts.length} waiting · you see one</small>`}</div>${met}${rows}
   <div class="rt-h">SATURDAY · WHERE DO YOU SIT?</div>${seat}
   ${A.today&&A.today.length?`<ul class="rt-news">${A.today.map(t=>`<li><b>✓</b><span>${esc(t)}</span></li>`).join('')}</ul>`:''}</section>`}
 /* ----- THE COACH'S SEAT (MB-38): the coach's position every week, and the shortlist when the job is open ----- */
 function coachSeatRow(id){const c=coachOf(id);if(!c)return'';if(coachVacant(id))return`<div class="cs-row cs-vac"><span><small>HEAD COACH</small><b>Caretaker in charge</b></span><em>Choose a new coach below</em></div>`;
   const h=coachHeat(id),st=heatStage(h),hist=(S.heat&&S.heat.hist||[]).slice(-8);
   return`<div class="cs-row cs-${st.k}">${faceSVG(c.name,{size:36,kit:clubKit(id).a})}<span><small>HEAD COACH · ${esc(c.name.toUpperCase())}</small><b>${esc(st.word)}</b><em>${esc(heatWhy(id))}</em></span><span class="cs-meter" aria-label="Pressure ${h} of 100"><i style="width:${h}%"></i>${hist.length>1?`<svg viewBox="0 0 80 20" aria-hidden="true"><polyline fill="none" stroke="currentColor" stroke-width="1.5" points="${hist.map((x,i)=>`${Math.round(i*80/(hist.length-1))},${Math.round(20-x.h/5)}`).join(' ')}"/></svg>`:''}</span></div>`}
 function vacancyCard(id){if(!coachVacant(id))return'';const L=coachShortlist(id),kit='#6b7d74';
   return`<section class="rt cs-short">${rtBar('VACANCY · HEAD COACH','A CARETAKER HAS THE TEAM')}
   <div class="rt-quote">“The players need to know who is in charge before long.” <small>— ${esc(tdOf(id)?.name||'Your director')}</small></div>
   ${L.map(c=>`<div class="cs-cand">${faceSVG(c.name,{size:44,kit})}<span class="cs-cb"><b>${esc(c.name)}</b><small>${c.age} · ${c.from?esc(nm(c.from)):'out of work'} · ${'★'.repeat(c.stars)}<i>${'★'.repeat(5-c.stars)}</i></small><em>${esc(c.style)}${c.cheer?` · ${esc(c.cheer)} would cheer`:''}</em><small>£${n0(c.wage)}/w${c.comp?` · £${c.comp}k compensation to ${esc(nm(c.from))}`:''}</small></span><button class="rt-mini" data-act="hirecoach" data-arg="${esc(c.pid)}">Appoint</button></div>`).join('')||'<p class="rt-note">Nobody suitable is available yet.</p>'}
   ${(()=>{const r=caretakerRecord(id),c=coachOf(id);return`<div class="cs-cand">${faceSVG(c.name,{size:44,kit:clubKit(id).a})}<span class="cs-cb"><b>${esc(c.name)} · caretaker</b><small>${c.age} · ${'★'.repeat(staffStars(staffEstimate(c.id)))}</small><em>${r&&r.n?`In charge: ${r.w}W ${r.d}D ${r.l}L`:'Takes the team on Saturday'}</em><small>£${n0(c.pro.wage)}/w · no compensation</small></span><button class="rt-mini" data-act="keepcaretaker">Until summer</button></div>`})()}
   <p class="rt-note">Every week without a choice, the caretaker keeps the team.</p></section>`}
 function weekHead(id){const w=S.week+1,pos=posOf(id),t=S.tbl[id]||{pts:0,form:[]},mem=agmForecastPct(id),f=F(id),form=(t.form||[]).slice(-5);
   return`<section class="rt">${rtBar(`MATCHWEEK ${w} OF ${SEASON_WEEKS}`,esc(seasonDate(w)))}
   <div class="wk-strip"><div><small>TABLE</small><b>${S.week?ord(pos):'—'}</b><span>${t.pts||0} pts</span></div><div><small>FORM</small><b class="wk-form">${form.map(r=>`<i class="f${r}">${r}</i>`).join('')||'—'}</b></div><div><small>CASH</small><b class="${f.cash<0?'bad':''}">${k1(f.cash)}</b></div><div><small>MEMBERS</small><b class="${mem<50?'bad':''}">${mem}%</b><i class="bar"><i style="width:${mem}%"></i></i></div></div>
   ${coachSeatRow(id)}<div class="rt-quote">${esc(weekTopic(id).t)}</div></section>`}
 function clubRows(id){const b=books(id),m=M(id),gp=(m.goals||[]).map(g=>goalProgress(id,g)),met=gp.filter(x=>x.met).length,td=tdOf(id),co=coachOf(id),proj=G(id).projects.filter(x=>x.phase!=='done');
   const mood=p=>p?((p.loy??50)>=60?'content':(p.loy??50)>=40?'steady':'restless'):'—';
   return`<section class="rt">${rtBar('THE CLUB','AT A GLANCE')}
   <button class="rt-row rt-file" data-act="tab" data-arg="money"><span class="rt-a">MONEY</span><span class="rt-b">${b.tight?`<b class="bad">Tight: ${k1(b.low)} around week ${b.lowW}</b>`:`End of season around ${k1(b.end)}`}<small>wages ${b.wr}% of turnover</small></span><span class="rt-c">›</span></button>
   <button class="rt-row rt-file" data-act="tab" data-arg="club"><span class="rt-a">GOALS</span><span class="rt-b">${met} of ${gp.length} on track<small>${esc((m.goals||[]).map(g=>g.text).slice(0,1).join(''))}</small></span><span class="rt-c">›</span></button>
   <button class="rt-row rt-file" data-act="ctab" data-arg="football"><span class="rt-a">PEOPLE</span><span class="rt-b">Director ${esc(mood(td))} · coach ${esc(mood(co))}<small>${esc(td?td.name:'')}${co?' · '+esc(co.name):''}</small></span><span class="rt-c">›</span></button>
   <button class="rt-row rt-file" data-act="tab" data-arg="club"><span class="rt-a">BUILD</span><span class="rt-b">${proj.length?esc(proj.map(p=>`${p.label} · ${p.phase==='permit'?'permit':p.left+' wk'}`).join(' · ')):'Nothing being built'}<small>£${investRoom(id)}k to invest</small></span><span class="rt-c">›</span></button></section>`}
 function weekNews(id){const it=tickerItems(id).slice(0,6);if(!it.length)return'';return`<section class="rt">${rtBar('AROUND THE LEAGUE','')}<ul class="rt-news">${it.map(t=>`<li><b>·</b><span>${esc(t)}</span></li>`).join('')}</ul></section>`}
 function weekScreen(){
   const id=S.my;
   const msg=UI.msg?`<p class="g-msg ${UI.msg.err?'err':''}" role="status">${esc(UI.msg.text)}</p>`:'';UI.msg=null;
   if(S.week===0)return preSeasonScreen(id,msg);
   if(seasonOver())return`<div class="g-week">${msg}${topicBanner(id)}${agmView(id)}</div>`;
   return`<div class="g-week rt-season">${msg}${weekHead(id)}${vacancyCard(id)}${inboxCard(id)}${agendaCard(id)}${winterCard(id)}${nextMatch(id)}<details class="g-close wk-club"><summary>The club and the league</summary>${clubRows(id)}${/Nothing running yet/.test(runningCard(id))?'':runningCard(id)}${weekNews(id)}</details></div>`;
 }


 /* ----- PRE-SEASON: what it is, what the director will do, what you control ----- */
 /* ----- THE TRANSFER SUMMER (M1): meeting → brief → ticker → deadline day → summer edition ----- */
 function briefPick(id){const kind=preState().kind,max=kind==='winter'?1:3;if(!UI.brief||UI.brief.s!==S.season||UI.brief.kind!==kind){const m=summerMeeting(id);const ok=new Set(briefOptions(id).map(o=>o.k));UI.brief={s:S.season,kind,max,goals:m.plan.goals.filter(k=>ok.has(k)).slice(0,max),budget:budSigned()?budLevel():m.plan.budget,recruit:recruitStrategy(id)}}return UI.brief}
 /* with a signed budget the director's budget level follows the players pot */
 function budLevel(){const sh=S.bud.pots.players/Math.max(1,budTotal());return sh>=.6?'allin':sh<=.3?'cautious':'normal'}
 /* the meeting: the director's plan first (one tap to agree); the full brief only if you want to change it */
 /* ----- THE OPENING AND THE TRANSFER SUMMER (§7.1, §7.2, §8): text-led retro football pages ----- */
 const rtBar=(l,r)=>`<div class="rt-bar"><b>${l}</b><span>${r||''}</span></div>`;
 const rtRow=(a,b,c,cls,attr)=>`<div class="rt-row ${cls||''}" ${attr||''}><span class="rt-a">${a}</span><span class="rt-b">${b}</span><span class="rt-c">${c||''}</span></div>`;
 const money2=id=>{const b=Math.max(0,Math.round(budgetFor(id)));return`£${b}k available | £${n0(Math.max(0,(wageCapK(id)-wageBillK(id))*1000))}/w room${b<3?' · free agents only':''}`};
 const an=w=>/^[aeiou]/i.test(w)?'an '+w:'a '+w;
 const firstDay=()=>!S.welcomed&&S.career.length===1&&S.season===S.career[0]?.from;
 /* the first day: election night and the next morning in one page, then the manifest under it */
 function firstDayCard(id){const c=C(),d=tdOf(id),co=coachOf(id),vote=Math.round(M(id).conf),m=summerMeeting(id),kit=clubKit(id).a;
   return`<section class="rt">${rtBar('YOUR FIRST DAY',esc(c.ground))}
   <div class="fd-vote"><b>${vote}%</b><div><i class="bar big"><i style="width:${vote}%"></i><em style="left:50%"></em></i><span>of the members trust you today · the first AGM judges you; under 50% and you are out</span></div></div>
   <div class="d-job">${jobTag(id)}<span>${esc(jobLine(id))}</span></div>
   <div class="fd-people">${d?`<div>${faceSVG(d.name,{size:44,kit})}<span><small>DIRECTOR</small><b>${esc(d.name)}</b><em>“Weak in ${esc(m.weak)}. I sign, you set the frame.”</em></span></div>`:''}${co?`<div>${faceSVG(co.name,{size:44,kit})}<span><small>COACH</small><b>${esc(co.name)}</b><em>“I pick the side.”</em></span></div>`:''}</div></section>`}
 /* the TD meeting: holes in the squad, the money, the director's plan that follows your manifest; agree it or change it */
 function meetingCard(id){
   const m=summerMeeting(id),b=briefPick(id),opts=briefOptions(id),winter=b.kind==='winter';
   const lo=Math.min(m.avg.defence,m.avg.midfield,m.avg.attack)-1.5,hi=Math.max(m.avg.defence,m.avg.midfield,m.avg.attack)+.5;
   const bars=['defence','midfield','attack'].map(k=>`<div class="tm-bar ${k===m.weak?'weak':''}"><small>${k.slice(0,3).toUpperCase()}</small><i><i style="width:${Math.round((m.avg[k]-lo)/(hi-lo)*100)}%"></i></i><b>${m.avg[k]}</b></div>`).join('');
   const holes=m.needs.map(n=>{const w=weakestAt(id,n.pos);return`<span class="tm-hole"><b>${esc(n.pos)}</b>${w.name?`<small>now ${esc(w.name.split(' ').slice(-1)[0])} ${w.q}</small>`:''}</span>`}).join('')||'<span class="tm-hole"><b>—</b><small>no holes</small></span>';
   const plan=b.goals.map(k=>(opts.find(o=>o.k===k)||{t:k}).t),bud=Math.max(0,Math.round(budgetFor(id)));
   const edit=UI.briefEdit?`<div class="rt-h">PRIORITIES · ${b.goals.length}/${b.max}</div><div class="g-goals">${opts.map(o=>`<button class="g-opt ${b.goals.includes(o.k)?'on':''}" data-act="briefgoal" data-arg="${esc(o.k)}" aria-pressed="${b.goals.includes(o.k)}"><b>${b.goals.includes(o.k)?'✓ ':''}${esc(o.t)}</b><span>${esc(o.why)}</span></button>`).join('')}</div>
     <div class="rt-h">FUNDING</div><div class="g-seg g-seg3" role="group" aria-label="Funding">${Object.entries(BUDGET_LV).map(([k,v])=>`<button class="${b.budget===k?'on':''}" data-act="briefbudget" data-arg="${k}" aria-pressed="${b.budget===k}">${v.n}</button>`).join('')}</div>
     <div class="rt-h">PROFILE</div><div class="g-seg" role="group" aria-label="Recruitment profile">${Object.keys(RECRUIT).map(k=>`<button class="${b.recruit===k?'on':''}" data-act="briefrecruit" data-arg="${k}" aria-pressed="${b.recruit===k}">${esc(RECRUIT[k].n)}</button>`).join('')}</div>`
     :`<div class="rt-btns"><button class="rt-btn" data-act="briefedit">Change the plan</button></div>`;
   return`<section class="rt">${rtBar(winter?`WINTER MEETING · WEEK ${S.week}`:'TD MEETING',esc(m.dir))}
   <div class="tm-top"><div class="tm-money"><small>TO SPEND</small><b>£${bud}k</b><span>£${n0(Math.max(0,(wageCapK(id)-wageBillK(id))*1000))}/w wage room${bud<3?' · free agents only':''}</span></div><div class="tm-bars">${bars}</div></div>
   <div class="rt-h">THE HOLES</div><div class="tm-holes">${holes}</div>
   <div class="rt-h">THE PLAN · ${esc(BUDGET_LV[b.budget].n.toUpperCase())} · ${esc(RECRUIT[b.recruit].n.toUpperCase())}</div>
   <ol class="tm-plan">${plan.map(t=>`<li>${esc(t)}</li>`).join('')||'<li>No goals chosen</li>'}</ol>
   ${edit}${winter?'<div class="rt-btns"><button class="rt-btn on" data-act="briefsign">✍ Agree the winter plan</button></div>':''}</section>`;
 }
 /* the Transfer Centre: the director's board as a text page; one tap a market week */
 /* the Transfer Centre (MB-32): a calendar that runs, the plan as one line per need, the money, the news.
    The clock runs by itself and stops when the chairman is needed: a bid for one of the best players, a club record,
    the morning of deadline day, or when the window shuts. */
 const DEAL_TXT=d=>({bid:`Bid £${d.fee}k`,countered:`Talks · £${d.fee}k`,record:'Needs your word',signed:d.fee?`Signed · £${d.fee}k`:'Signed · free',walked:'Walked away',hijacked:`Hijacked${d.rival?' by '+nm(d.rival):''}`,gone:'Gone elsewhere'})[d.stage]||d.stage;
 const DEAL_CLS=d=>d.stage==='signed'?'good':['walked','hijacked','gone'].includes(d.stage)?'out':d.stage==='record'?'warn':'live';
 function tcScreen(P_,id,esc2){const W=winWeeks(P_),N=winDays(P_),day=Math.min(preDayOf(P_),N-1),closed=P_.wk>W,dir=P_.brief.dirName||'The director',T=P_.targets||{},run=!!UI.tcRun;
   const left=N-1-day,dl=preDeadlineNow(P_)&&!closed;
   /* the calendar: every day of the window, past days filled, deadline day marked */
   const cal=`<ol class="tc-cal" aria-label="Day ${day+1} of ${N}">${Array.from({length:N},(_,i)=>`<li class="${i<day||closed?'past':''}${i===day&&!closed?' now':''}${i===N-1?' dl':''}">${i%7===0?`<b>${preDayLabel(P_,i).split(' ')[1]}</b>`:''}</li>`).join('')}</ol>`;
   const when=closed?'The window has shut':dl?`DEADLINE DAY · ${P_.round==null?'09:00':['09:00','15:00','22:00'][P_.round]||'23:00'}`:`${preDayLabel(P_,day)} · deadline in ${left} day${left===1?'':'s'}`;
   const spent=P_.deals.filter(d=>d.stage==='signed').reduce((a,d)=>a+d.fee,0),raised=P_.sold.reduce((a,x)=>a+x.fee,0);
   const money=`<div class="tc-mon"><span><small>Available</small><b>${k1(budgetFor(id))}</b></span><span><small>Wage room</small><b>£${n0(Math.max(0,(wageCapK(id)-wageBillK(id))*1000))}/w</b></span><span><small>Spent</small><b>£${spent}k</b></span><span><small>Raised</small><b>£${raised}k</b></span></div>`;
   /* the plan: one line per need, with where it stands */
   const posList=[...new Set([...(P_.needs0||[]),...preTargets(id).map(n=>n.pos),...P_.deals.map(d=>d.pos)])];
   const needRow=pos=>{const ds=P_.deals.filter(d=>d.pos===pos),liveD=ds.find(d=>['bid','countered','record'].includes(d.stage)),sig=ds.filter(d=>d.stage==='signed'),fails=ds.filter(d=>['walked','hijacked','gone'].includes(d.stage)),open=preTargets(id).some(n=>n.pos===pos),c=(T[pos]||[])[0];
     let st,cls,who;
     if(liveD){st=DEAL_TXT(liveD)+(liveD.due!=null&&liveD.stage!=='record'&&!dl?` · answer ${preDayLabel(P_,Math.min(N-1,liveD.due)).split(' ')[0]}`:'');cls=DEAL_CLS(liveD);who=liveD}
     else if(sig.length&&!open){st=DEAL_TXT(sig[sig.length-1]);cls='good';who=sig[sig.length-1]}
     else if(sig.length){st=`${DEAL_TXT(sig[sig.length-1])} (cover) · still looking`;cls='live';who=sig[sig.length-1]}
     else if(!open){st='Covered';cls='good';who=null}
     else if(c&&day>0){st='On the shortlist';cls='short';who=c}
     else{st=day?'No one found yet':'Searching';cls='short';who=null}
     const name=who?`<button class="pp-link" data-act="player" data-arg="${esc(who.pid)}">${esc(who.name)}</button> <small>${who.age} · ${who.from?esc(nm(who.from)):'free agent'}${who.est?` · ~${who.est}`:''}${who.chair?' · your find':''}</small>`:`<small>${esc(POS_ONE[pos]||pos)}</small>`;
     const flash=who&&who.stage==='signed'&&who.sday!=null&&who.sday>=day-1;
     return`<div class="tc-need s-${cls}${flash?' flash':''}"><span class="tc-np">${esc(pos)}</span>${flash?'<i class="tc-stamp2">SIGNED</i>':''}<span class="tc-nb">${name}<em>${esc(st)}${fails.length?` <i>· ${fails.length} failed</i>`:''}</em></span></div>`};
   const outs=[...P_.sold.map(x=>rtRow('OUT',`${esc(x.name)} <small>${x.to?'to '+esc(nm(x.to)):'released'}</small>`,x.fee?`£${x.fee}k`:'free','s-good')),...(P_.outPlan||[]).filter(o=>!o.done).map(o=>rtRow('SELL',`${esc(o.name)} <small>${esc(o.why)}</small>`,'on the list','s-short')),...(P_.list||[]).map(pid=>{const p=S.squads[id].find(x=>x.id===pid);return p?rtRow('LIST',`${esc(p.name)} <small>available · ~£${Math.round(askingFee(p,id))}k</small>`,'','s-short'):''})].join('');
   /* the director's line, from the state of the deals */
   const needs=preTargets(id),live=P_.deals.filter(d=>['bid','countered'].includes(d.stage)),done=P_.deals.filter(d=>d.stage==='signed');
   const say=closed?`${done.length?done.length+' signed. ':''}The window is shut; we go with this squad.`:!day&&!done.length?`I go for ${needs.length?needs.slice(0,2).map(n=>an(POS_ONE[n.pos])).join(' and '):'upgrades'} first. Free agents early, bids where we must.`:`${live.length?`Waiting on ${live.map(d=>d.name).join(' and ')}. `:''}${needs.length?`Still need ${needs.slice(0,2).map(n=>an(POS_ONE[n.pos])).join(' and ')} who would start.`:'Every need is covered.'}`;
   /* the chairman's levers */
   const pan=UI.tcPanel;let panel='';
   if(pan==='prio')panel=`<div class="rt-h">PRIORITY</div>${needs.map(n=>`<button class="g-opt ${P_.prio===n.pos?'on':''}" data-act="preprio" data-arg="${esc(n.pos)}" aria-pressed="${P_.prio===n.pos}"><b>${P_.prio===n.pos?'✓ ':''}The ${esc(POS_ONE[n.pos])} comes first</b><span>The director goes there first from tomorrow.</span></button>`).join('')||'<p class="rt-note">No open needs.</p>'}
     <div class="rt-h">PROFILE</div><div class="g-seg" role="group" aria-label="Recruitment profile">${Object.keys(RECRUIT).map(k=>`<button class="${recruitStrategy(id)===k?'on':''}" data-act="prerecruit" data-arg="${k}" aria-pressed="${recruitStrategy(id)===k}">${esc(RECRUIT[k].n)}</button>`).join('')}</div>`;
   if(pan==='rec'){const cs=needs.flatMap(n=>(T[n.pos]||[]).map(c=>({...c,need:n.pos}))).filter(c=>{const f=findPlayer(c.pid);return f&&f.club!==id&&!P_.deals.some(d=>d.pid===c.pid&&['signed','walked','hijacked','gone'].includes(d.stage))});panel=`<div class="rt-h">THE SHORTLIST · RATE A PLAYER</div>${cs.length?cs.map(c=>`<div class="rt-row"><span class="rt-a">${esc(c.need)}</span><span class="rt-b"><button class="pp-link" data-act="player" data-arg="${esc(c.pid)}">${esc(c.name)}</button> <small>${c.age} · ~${c.est}±${c.doubt} · ${esc(c.type||'')} · £${c.fee}k</small></span><span class="rt-c"><button class="rt-mini ${P_.fav&&P_.fav[c.need]===c.pid?'on':''}" data-act="prefav" data-arg="${esc(c.pid)}">${P_.fav&&P_.fav[c.need]===c.pid?'✓ Rated':'Rate'}</button></span></div>`).join(''):'<p class="rt-note">The shortlist fills once the window is open.</p>'}<p class="rt-note">Weight, not a signing: the director may still choose otherwise.</p>`}
   if(pan==='fund')panel=`<div class="rt-h">FUNDING</div><div class="rt-btns"><button class="rt-btn" data-act="prebudget">Free 10% more of the cash</button>${dl&&!P_.loan?'<button class="rt-btn" data-act="preloan">Deadline money (a loan)</button>':''}</div><p class="rt-note">Now ${k1(budgetFor(id))} for transfers. More money makes the books promise harder.</p>`;
   if(pan==='list')panel=listCard(P_,id).replace('<details class="g-close">','<details class="g-close" open>');
   const lever=(k,t)=>`<button class="rt-btn ${pan===k?'on':''}" data-act="tcpanel" data-arg="${k}" aria-pressed="${pan===k}" ${run?'disabled':''}>${t}</button>`;
   /* the news: newest first, grouped by date */
   const items=P_.ticker.filter(t=>t.d>=0&&t.day!=null).slice().reverse(),groups=[];for(const t of items){const g=groups[groups.length-1],k=t.d>=10?'Deadline · '+DAYS[t.d]:preDayLabel(P_,t.day);if(g&&g.k===k)g.t.push(t);else groups.push({k,t:[t],fresh:t.day===day-1||t.day===day})}
   const news=groups.slice(0,UI.tcAll?99:2).map(g=>`<li class="${g.fresh?'fresh':''}"><b>${esc(g.k)}</b>${g.t.map(t=>`<span class="tk-${esc(t.kind||'news')}">${esc(t.t)}</span>`).join('')}</li>`).join('');
   return`<div class="tc2">${esc2}${interestCard(P_)}
   <section class="rt tc3">${rtBar('TRANSFER CENTRE',esc(when))}${cal}${money}
   <div class="rt-quote">“${esc(say)}” <small>— ${esc(dir)}, director</small></div>
   <div class="rt-h">THE PLAN</div>${posList.map(needRow).join('')||'<p class="rt-note">No needs.</p>'}
   ${outs?`<div class="rt-h">OUTGOING</div>${outs}`:''}
   <div class="rt-btns">${lever('prio','Priority')}${lever('rec','Shortlist')}${lever('fund','Funding')}${lever('list','Transfer list')}</div>${panel}
   <div class="rt-h">MARKET NEWS</div><ul class="tc-news" aria-live="polite">${news||'<li><b>'+esc(preDayLabel(P_,0))+'</b><span>The window opens today.</span></li>'}</ul>${groups.length>2&&!UI.tcAll?`<button class="rt-more" data-act="tcall">All market news · ${items.length} ›</button>`:''}
   </section></div>`}
 /* the pre-season as steps: welcome (first season) → the plan → the market → the season ahead */
 function preStep(){const P_=PRE();if(!P_)return null;if(!P_.brief&&!manifestSealed(S.my))return'promise';if(!P_.brief)return'plan';if(P_.wk<=winWeeks(P_)||tcPlaying())return'market';return'ahead'}
 function preSteps(st){const L=[['promise',firstDay()?'First day':'Manifest'],['plan','TD meeting'],['market','Market'],['ahead','Season']];const k=L.findIndex(x=>x[0]===st);return`<ol class="g-steps">${L.map(([,t],i)=>`<li class="${i===k?'on':i<k?'done':''}">${t}</li>`).join('')}</ol>`}
 /* election night and the first morning: the club's own people, from the world the engine made (MB-02, §7.1) */
 function welcomeCard(id){const c=C(),d=tdOf(id),co=coachOf(id),fan=c.cast.fan&&P(c.cast.fan),g=c.groups.slice().sort((a,b)=>b.share-a.share)[0],grp=g&&ARCH[g.k];
   const vote=clamp(Math.round(24+.75*M(id).conf+6),51,90),m=summerMeeting(id),r=c.rival&&CL(c.rival);
   const v=(i,who,q)=>`<div class="g-voice">${faceSVG(who.split(' · ')[0],{size:40,kit:clubKit(S.my).a})}<div><small>${esc(who)}</small><q>${esc(q)}</q></div></div>`;
   const ini=n=>n.split(' ').map(w=>w[0]).join('').slice(0,2);
   return`<section class="g-card g-welcome g-night"><small class="g-k">ELECTION NIGHT · THE ${esc(c.ground.toUpperCase())} CLUBHOUSE</small><h2>${esc(c.name)} is yours</h2>
   <div class="g-vote" aria-label="${vote} percent voted for you"><i style="--v:${vote}%"></i></div><p><b>${vote}% of the members voted for you.</b> Below 50% at any AGM and you are out.</p>
   ${fan&&grp?v(ini(fan.name),`${fan.name} · ${groupName(id,g)}, ${g.share}% of the members`,`${grp.wants} Don't forget who put you here.`):''}
   <p class="g-hint">Legend: ${esc(c.legend)}. The scar: ${esc(c.scar)}.${r?` The rivals: ${esc(r.name)}, since ${esc(c.rivalWhy)}.`:''}</p></section>
   <section class="g-card"><small class="g-k">THE NEXT MORNING · YOUR OFFICE</small>
   ${d?v(ini(d.name),`${d.name} · director of football`,`Strong in ${m.strong}, weak in ${m.weak}. I buy and sell; you set the frame and the money.`):''}
   ${co?v(ini(co.name),`${co.name} · head coach`,'I pick the side. Give me players and time, and judge me on Saturdays.'):''}
   <ul class="g-list"><li><b>You never pick the team.</b> The director signs, the coach selects.</li><li><b>The members vote every summer.</b> Your promises are what they judge.</li></ul></section>${keyPlayersCard(id)}<p class="g-hint">First: your promises to the members. Then your director's plan for the summer.</p>`}
 /* the three players this club is about, and the job in one line: shown on the first day and in the dossiers */
 function keyPlayersCard(id){const ks=keyPlayers(id);return`<section class="g-card"><small class="g-k">THE JOB</small><p><b>${esc(clubChallenge(id))}</b></p><h3>Three names to know</h3><ul class="g-list">${ks.map(k=>`<li><b>${esc(k.p.name)}</b> · ${esc(k.role)}. <span class="muted">${esc(POS_ONE[k.p.pos])}, ${k.p.age}.</span></li>`).join('')}</ul></section>`}
 /* first day, every summer: the manifest is signed before the market opens, so the summer is played towards it */
 function promiseScreen(id){return promises(id)}
 /* ----- THE BUDGET MEETING (module 2, MB-27): the boardroom, the first Monday of July ----- */
 const BUD_ROLE={players:'Director of football',wages:'Head coach',build:'Head of facilities',bank:'Treasurer'};
 const BUD_WHAT={players:'Players',wages:'Wages',build:'Building',bank:'The bank'};
 function budgetScreen(id){
   const B=budOpen(id),u=B.unit,tot=budTotal(),ini=n=>String(n).split(' ').map(w=>w[0]).join('').slice(0,2);
   const row=k=>{const a=B.asks[k],have=B.pots[k]*u,met=have>=a.ask*.9,short=Math.max(0,a.ask-have),btn=k!=='bank';
     return`<div class="bd-row bd-${k}"><div class="g-voice">${faceSVG(a.who,{size:40,kit:clubKit(S.my).a})}<div><small>${esc(a.who)} · ${esc(BUD_ROLE[k])}</small><q>${esc(a.why)}</q></div></div>
     <div class="bd-ctl"><span class="bd-pot"><b>${esc(BUD_WHAT[k])}</b><span>£${have}k <small>${B.pots[k]} block${B.pots[k]===1?'':'s'}</small></span></span>
     ${btn?`<button class="bd-b" data-act="budmove" data-arg="${k}:-1" aria-label="One block less for ${esc(BUD_WHAT[k])}" ${B.pots[k]<1?'disabled':''}>−</button><button class="bd-b" data-act="budmove" data-arg="${k}:1" aria-label="One block more for ${esc(BUD_WHAT[k])}" ${B.pots.bank<1?'disabled':''}>+</button>`:'<span class="bd-rest">What you do not give away</span>'}</div>
     <p class="bd-ask ${met?'good':'bad'}">Asks £${a.ask}k · ${met?'✓ satisfied':`£${short}k short`}</p></div>`};
   const blocks=['players','wages','build','bank'].flatMap(k=>Array(B.pots[k]).fill(k)).map(k=>`<i class="bd-${k}" title="${esc(BUD_WHAT[k])}"></i>`).join('');
   const pk=B.pots.players*u,wk=B.pots.wages*u,bk=B.pots.build*u,cash=Math.round(F(id).cash);
   const proj=projectCatalog(id).filter(o=>!o.busy&&o.cost<=bk).sort((a,b)=>b.cost-a.cost)[0];
   const means=[`<b>Players:</b> the director can spend £${pk}k, plus whatever is sold.${pk>cash?` Only ${k1(cash)} of it is cash today; the rest comes in with the gate money.`:''}`,
     wk?`<b>Wages:</b> £${Math.round(wk/SEASON_WEEKS*1000).toLocaleString('en-GB')} a week more than the turnover carries. Better players will come.`:`<b>Wages:</b> no room. The director only signs players the turnover can pay.`,
     proj?`<b>Building:</b> enough for ${esc(proj.label.toLowerCase())} (£${proj.cost}k).`:`<b>Building:</b> not enough for any project this season.`,
     `<b>The bank:</b> £${B.pots.bank*u}k stays put, on top of four weeks of wages (£${budFloor(id)}k) that nobody may touch.`];
   const loan=B.loan?`<p class="g-hint">The bank lent £${B.loan}k over five years. The interest comes every season.</p>`:maxNewLoan(id)>=u*3?`<button class="g-opt" data-act="budloan"><b>Ask the bank for £${u*3}k</b><span>Three more blocks now. Five years of repayments and interest; the business members will not like it.</span></button>`:'';
   const tr=B.asks.bank.who;
   return`<section class="g-card g-board"><small class="g-k">THE BOARDROOM · THE FIRST MONDAY OF JULY</small><h2>£${tot*u}k to divide</h2>
   <div class="g-voice">${faceSVG(tr,{size:40,kit:clubKit(S.my).a})}<div><small>${esc(tr)} · Treasurer</small><q>This is what we can move this season: ${tot} blocks of £${u}k. Every block goes to one place only. They will all ask for more than there is.</q></div></div>
   <div class="bd-strip" aria-label="${tot} blocks">${blocks}</div></section>
   <section class="g-card g-board">${['players','wages','build','bank'].map(row).join('')}${loan}</section>
   <section class="g-card"><small class="g-k">WHAT THIS MEANS FOR THE SEASON</small><ul class="g-list">${means.map(x=>`<li>${x}</li>`).join('')}</ul><p class="g-hint">The members hear about it. Business members want a full bank; the terraces want signings; families want something built. At the AGM you answer for every block.</p></section>`;
 }
 function budSignLine(met){const no=['players','wages','build','bank'].filter(k=>!met[k]).map(k=>BUD_ROLE[k].toLowerCase());return no.length?`Budget signed. The ${no.join(', the ')} wanted more, and will remember.`:'Budget signed. Everyone got what they asked for: this time.'}
 /* the pots during the season, under the books */
 function budgetStrip(id){if(!budSigned())return'';const a=S.bud.signedAt,pl=budPlayersLeft(id),bl=budBuildLeft(id);
   return`<ul class="bd-left"><li><small>Players</small><b>£${pl}k</b><span>of £${a.players}k</span></li><li><small>Wages</small><b>+£${Math.round(a.wages/SEASON_WEEKS*1000).toLocaleString('en-GB')}</b><span>a week</span></li><li><small>Building</small><b>£${bl}k</b><span>of £${a.build}k</span></li><li><small>Kept back</small><b>£${a.bank}k</b><span>${S.bud.loan?`+ £${S.bud.loan}k loan`:'in July'}</span></li></ul>`}
 function preSeasonScreen(id,msg){
   const st=preStep(),P_=PRE();
   if(st==='promise')return`<div class="g-week">${msg}${preSteps(st)}${firstDay()?firstDayCard(id):''}<section class="rt rt-wrap">${rtBar('YOUR MANIFEST','SAFE · STEADY · BOLD')}${promiseScreen(id)}</section></div>`;
   if(st==='budget')return`<div class="g-week">${msg}${preSteps(st)}${budgetScreen(id)}</div>`;
   if(st==='plan')return`<div class="g-week">${msg}${preSteps(st)}${meetingCard(id)}</div>`;
   if(st==='market')return`<div class="g-week">${msg}${preSteps(st)}${momentCard()}${preSeason(id)}</div>`;
   return`<div class="g-week rt-season">${msg}${preSteps(st)}${momentCard()}${preSeason(id)}${promises(id)}${nextMatch(id)}</div>`;
 }
 function briefCard(P_,id){const res=briefJudge(id,P_);return`<section class="g-card g-promise"><small class="g-k">THE ${P_.kind==='winter'?'WINTER':'SUMMER'} BRIEF · ${esc(BUDGET_LV[P_.brief.budget].n.toUpperCase())} BUDGET</small><ul>${res.map(r=>`<li class="${r.met?'on':''}"><div><b>${esc(r.t)}</b><span>${esc(r.how)}</span></div></li>`).join('')}</ul></section>`}
 /* the numbers you need before saying yes: a data strip and a way to the full profile */
 function quickData(pid){const f=findPlayer(pid);if(!f)return'';const p=f.p,K=knowOf(p,f.club),ar=avgR(p);
   return`<div class="pp-strip"><span><small>Rating</small><b>${K.now==null?'?':(K.lo!=null?'~':'')+K.now}</b></span><span><small>Age</small><b>${p.age}</b></span><span><small>Avg</small><b>${ar??'—'}</b></span><span><small>Goals</small><b>${p.sGoals||0}</b></span><span><small>xG</small><b>${r1(p.sXg||0)}</b></span></div><button class="btn ghost" data-act="player" data-arg="${esc(pid)}">Full profile and data</button>`}
 function escCards(P_){const o=P_.offer,r=P_.record;
   const offer=o?`<article class="g-moment"><small class="g-k">A BID FOR YOUR PLAYER · YOUR DECISION</small><h2>${esc(CL(o.by).name)} want ${esc(o.name)}</h2>${quickData(o.pid)}<p>£${o.fee}k for your ${esc(POS_ONE[o.pos])} (${o.age}), one of your three best players. The director cannot sell him without you.</p>
     <button class="g-opt" data-act="preoffer" data-arg="accept"><b>Accept £${o.fee}k</b><span>The money is yours; the director looks for a replacement</span></button>${o.asked?'':`<button class="g-opt" data-act="preoffer" data-arg="more"><b>Ask for more</b><span>They may raise it by a fifth, or walk away</span></button>`}<button class="g-opt g-leave" data-act="preoffer" data-arg="no"><b>Not for sale</b><span>He stays, but he may be unhappy</span></button></article>`:'';
   const rec=r?`<article class="g-moment"><small class="g-k">A CLUB RECORD · YOUR DECISION</small><h2>£${r.fee}k for ${esc(r.name)}?</h2>${quickData(r.pid)}<p>The selling club has said yes. It would beat the club record${r.rec?` of £${r.rec}k`:''}; the director needs your word.</p>
     <button class="g-opt" data-act="prerecord" data-arg="yes"><b>Approve the record fee</b><span>He signs today</span></button><button class="g-opt g-leave" data-act="prerecord" data-arg="no"><b>Too much</b><span>The director walks away and looks elsewhere</span></button></article>`:'';
   return offer+rec;
 }
 function preSeason(id){
   const P_=PRE();if(!P_)return'';
   if(!P_.brief)return meetingCard(id);
   const closed=P_.wk>winWeeks(P_),o=P_.offer,r=P_.record;
   const esc2=escCards(P_);
   if(closed){const E=summerEdition();return`<section class="rt rt-echo">${rtBar('THE NORTHMARCH ECHO','SUMMER EDITION')}<h2 class="rt-head">${esc(E.head)}</h2>
     <div class="rt-h">IN</div>${E.ins.map(d=>rtRow(esc(d.pos||''),esc(d.name),d.fee?'£'+d.fee+'k':'free')).join('')||rtRow('—','Nobody')}
     <div class="rt-h">OUT</div>${E.outs.map(x=>rtRow('',esc(x.name),'£'+x.fee+'k')).join('')||rtRow('—','Nobody')}
     ${rtRow('NET','Spent £'+E.spent+'k · raised £'+E.raised+'k','')}${P_.safety&&P_.safety.length?`<div class="rt-h">LEAGUE SAFETY RULE</div>${P_.safety.map(t=>rtRow('NB',esc(t))).join('')}`:''}
     ${E.world.length?`<div class="rt-h">AROUND THE LEAGUE</div><ul class="rt-news">${E.world.map(t=>`<li><b></b><span>${esc(t.t)}</span></li>`).join('')}</ul>`:''}<div class="rt-h">THE SUMMER BRIEF · JUDGED IN WEEK 4</div>${briefJudge(id,P_).map(r=>rtRow(r.met?'✓':'·',`<b>${esc(r.t)}</b><small>${esc(r.how)}</small>`,'',r.met?'s-good':'')).join('')}</section>`}
   return tcScreen(P_,id,esc2);
 }

 /* ----- THE TRANSFER CENTRE: the director's week played back day by day on a live ticker, then her board.
    The director does every deal (D-L3-2); the chairman talks frame and priority and decides only the two
    exceptions (D-L3-2b), shown as breaking news when the ticker stops. Pure presentation on S.pre. ----- */
 const TC_ST={bid:2,countered:3,record:4,signed:5},TC_STEPS=['Scouted','Enquiry','Bid','Talks','Agreed','Signed'];
 const TC_LBL={bid:'Bid in',countered:'Haggling',record:'Needs your word',signed:'Signed',walked:'Walked away',hijacked:'Hijacked',gone:'Gone'};
 const tcPlaying=()=>{const p=UI.tcPlay;return !!(p&&p.s===S.season&&p.shown<p.total)};
 const tcShownWk=P_=>tcPlaying()?UI.tcPlay.wk:P_.wk-1;
 const tcItems=(P_,wk)=>P_.ticker.filter(t=>t.wk===wk&&t.d>=0).sort((a,b)=>a.d-b.d);
 const tcDay=t=>t.d>=10?DAYS[t.d]:DAYS[t.d]||'';
 function tcHead(P_,wk,play){const W=winWeeks(P_),items=tcItems(P_,wk),shown=play?items.slice(0,UI.tcPlay.shown):items,last=shown[shown.length-1],dl=wk===W&&wk>0;
   const spent=P_.deals.filter(d=>d.stage==='signed').reduce((a,d)=>a+d.fee,0),raised=P_.sold.reduce((a,x)=>a+x.fee,0);
   const money=`<div class="tc-money"><span><small>Spent</small><b>£${spent}k</b></span><span><small>Raised</small><b>£${raised}k</b></span><span><small>Left</small><b>${k1(budgetFor(S.my))}</b></span></div>`;
   if(dl){const clock=last&&last.d>=10?DAYS[last.d]:'09:00';return`<header class="tc-head"><small class="g-k">DEADLINE DAY · THE WINDOW SHUTS AT 23:00</small><div class="tc-clock ${clock>='22:00'?'late':''}">${play?clock:P_.wk>W?'23:00':clock}</div>${P_.wk>W&&!play?'<div class="tc-closed" role="status">WINDOW CLOSED</div>':''}${play?'':money}</header>`}
   const cur=play?wk:P_.wk,day=last?last.d:-1;
   return`<header class="tc-head"><small class="g-k">TRANSFER WINDOW · ${play?'NOW PLAYING':wk?'WEEK '+wk+' PLAYED':'OPENS MONDAY'}</small><h2>Pre-season week ${Math.min(cur,W)} of ${W}${cur===W?' · deadline day next':''}</h2>
   <ol class="tc-days">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>`<li class="${wk&&(!play||i<day)?'past':''}${play&&i===day?' now':''}">${d}</li>`).join('')}</ol>${play?'':money}</header>`}
 function tcTicker(P_,wk,play){const items=tcItems(P_,wk),shown=play?items.slice(0,UI.tcPlay.shown):items,older=P_.ticker.filter(t=>t.wk<wk&&t.d>=0);
   if(!wk)return'';
   const li=(t,i,fresh)=>`<li class="tk-${esc(t.kind||'news')}${fresh?' fresh':''}"><b>${esc(tcDay(t))}</b><span>${esc(t.t)}</span></li>`;
   return`<section class="tc-sec"><div class="tc-h"><b>The ticker</b></div>
   <ul class="tc-tk" aria-live="polite">${shown.slice().reverse().map((t,i)=>li(t,i,play&&i===0)).join('')||'<li class="tk-news"><b></b><span>Quiet. For now.</span></li>'}</ul>
   ${!play&&older.length?`<details class="tc-older"><summary>Earlier weeks · ${older.length} items</summary><ul class="tc-tk">${older.slice().reverse().map(t=>li(t)).join('')}</ul></details>`:''}</section>`}
 function tcBoard(P_,id,wk){const T=P_.targets||{},cards=[],seen=new Set();
   const signedNow=new Set(tcItems(P_,wk).filter(t=>/✍/.test(t.t)).map(t=>t.t));
   for(const d of P_.deals){seen.add(d.pos+':'+d.pid);const out=['walked','hijacked','gone'].includes(d.stage),st=TC_ST[d.stage]??0,fresh=[...signedNow].some(t=>t.includes(d.name));
     cards.push(`<article class="tc-deal ${out?'out '+d.stage:''} ${d.stage==='signed'?'done':''}"><div class="tc-top"><span class="tc-pos">${esc(d.pos)}</span><div class="tc-id"><button class="pp-link" data-act="player" data-arg="${esc(d.pid)}">${esc(d.name)}</button><span>${d.age} · ${d.from?esc(nm(d.from)):'free agent'} · ~${d.est}</span></div><span class="tc-fee">${d.fee?'£'+d.fee+'k':'free'}</span></div>
     <ol class="tc-rail" aria-label="${esc(TC_LBL[d.stage]||d.stage)}">${TC_STEPS.map((x,i)=>`<li class="${!out&&i<=st?'on':''}"></li>`).join('')}</ol><div class="tc-st">${esc(TC_LBL[d.stage]||d.stage)}${d.chair?' · <i>your find</i>':''}</div>
     ${d.stage==='signed'?`<span class="tc-stamp${fresh?' anim':''}">SIGNED</span>`:''}${d.stage==='hijacked'?'<span class="tc-stamp red">HIJACKED</span>':''}</article>`)}
   for(const pos of Object.keys(T)){if(P_.deals.some(d=>d.pos===pos&&['bid','countered','record','signed'].includes(d.stage)))continue;const c=(T[pos]||[])[0];if(!c)continue;
     cards.push(`<article class="tc-deal"><div class="tc-top"><span class="tc-pos">${esc(pos)}</span><div class="tc-id"><button class="pp-link" data-act="player" data-arg="${esc(c.pid)}">${esc(c.name)}</button><span>${c.age} · ${c.from?esc(nm(c.from)):'free agent'} · ~${c.est} ±${c.doubt}</span></div><span class="tc-fee">£${c.fee}k</span></div><ol class="tc-rail">${TC_STEPS.map((x,i)=>`<li class="${i===0?'on':''}"></li>`).join('')}</ol><div class="tc-st">On the board · ${esc(c.type||'')}${c.chair?' · <i>your find</i>':''}</div></article>`)}
   return`<section class="tc-sec"><div class="tc-h"><b>${esc((P_.brief.dirName||'The director'))}’s board</b><span class="g-hint">The director does the deals. You set the frame.</span></div>${cards.join('')||'<p class="g-hint">The board fills up in the first week.</p>'}</section>`}
 /* talking to the director: priority and money, never a deal */
 function tcTalk(P_,id){if(P_.wk>winWeeks(P_))return'';const dir=P_.brief.dirName||'The director',needs=preTargets(id),live=P_.deals.filter(d=>['bid','countered'].includes(d.stage)),done=P_.deals.filter(d=>d.stage==='signed');
   const msg=P_.wk===1?`The window opens Monday. I’ll go after ${needs.length?'a '+needs.map(n=>POS_ONE[n.pos]).join(' and a '):'upgrades'} first.`:`${done.length?done.map(d=>d.name).join(' and ')+' signed. ':''}${live.length?`Still talking about ${live.map(d=>d.name).join(' and ')}. `:''}${needs.length?`We still need a ${needs.map(n=>POS_ONE[n.pos]).join(' and a ')}.`:'Every need is covered.'}`;
   return`<section class="tc-chat"><div class="tc-bubble">${(dir.split(' ').map(w=>w[0]).join('').slice(0,2))?`<span class="tc-face" aria-hidden="true">${esc(dir.split(' ').map(w=>w[0]).join('').slice(0,2))}</span>`:''}<p><b>${esc(dir)}:</b> ${esc(msg)}</p></div>
   <div class="tc-opts">${needs.map(n=>`<button class="g-opt ${P_.prio===n.pos?'on':''}" data-act="preprio" data-arg="${esc(n.pos)}" aria-pressed="${P_.prio===n.pos}"><b>${P_.prio===n.pos?'✓ ':''}“The ${esc(POS_ONE[n.pos])} comes first.”</b><span>The director makes it the priority this week.</span></button>`).join('')}
   <button class="g-opt" data-act="prebudget"><b>“I’ll free up more money.”</b><span>Another 10% of the cash for transfers (now ${k1(budgetFor(id))}). The money promise gets harder.</span></button></div></section>`}
 /* the money, live */
 function moneyCard(P_,id){const spent=P_.deals.filter(d=>d.stage==='signed').reduce((a,d)=>a+d.fee,0),raised=P_.sold.reduce((a,x)=>a+x.fee,0),dl=P_.wk===winWeeks(P_);
   return`<section class="g-card"><small class="g-k">THE MONEY · ${dl?'DEADLINE DAY NEXT':(P_.kind==='winter'?'WINDOW':'PRE-SEASON')+' WEEK '+P_.wk+' OF '+winWeeks(P_)} · ${esc(({bold:'A BOLD',careful:'A CAREFUL',steady:'A STEADY'})[P_.style||'steady'])} DIRECTOR</small>
   <section class="g-delta"><div><small>Spent</small><b>£${spent}k</b><span>on fees</span></div><div><small>Raised</small><b>£${raised}k</b><span>from sales</span></div><div><small>Left</small><b>${k1(budgetFor(id))}</b><span>to spend</span></div></section>
   <p class="g-hint">Wage room ${k1(wageCapK(id)-wageBillK(id))} a week.</p>
   <div class="g-acts2"><button class="btn ghost" data-act="prebudget">Free up 10% more cash</button>${dl&&!P_.loan?'<button class="btn ghost" data-act="preloan">Deadline money (a loan)</button>':''}</div></section>`}
 /* interest from other clubs */
 function interestCard(P_){const x=P_.interest;if(!x||(P_.list||[]).includes(x.pid))return'';return`<section class="rt">${rtBar('INTEREST',esc(CL(x.by).name))}<div class="rt-quote">${esc(CL(x.by).name)} are asking about ${esc(x.name)} (around £${x.fee}k).</div><div class="rt-btns"><button class="rt-btn" data-act="prelist" data-arg="${esc(x.pid)}">Make him available</button></div></section>`}
 /* the transfer list */
 function listCard(P_,id){const keep=new Set(topThree(id).map(p=>p.id)),L=P_.list||[],sq=S.squads[id].filter(p=>!p.loan&&!keep.has(p.id)).sort((a,b)=>a.q-b.q).slice(0,10);
   return`<details class="g-close"><summary>Transfer list · ${L.length} available</summary><section class="g-card"><p class="g-hint">Players you make available are sold by the director for a fair bid (at least 85% of their value). Your three best are never listed: bids for them come to you.</p><ul class="g-list g-gems">${sq.map(p=>`<li class="g-gem"><div><b>${esc(p.name)}</b> <small class="muted">${esc(POS_ONE[p.pos])}, ${p.age}</small><span>Quality ${r1(p.q)} · worth ~£${Math.round(askingFee(p,id))}k · ${p.sApps||0} games</span></div><button class="btn ghost" data-act="prelist" data-arg="${esc(p.id)}">${L.includes(p.id)?'Take off':'Make available'}</button></li>`).join('')}</ul></section></details>`}

 function debriefCard(){
   if(!debriefDue())return'';const P_=debriefTarget(),res=briefJudge(S.my,P_),met=res.filter(r=>r.met).length;
   return`<article class="g-moment"><small class="g-k">THE ${P_.kind==='winter'?'WINTER':'SUMMER'} DEBRIEF · ${esc(P_.brief.dirName.toUpperCase())}</small><h2>${met} of ${res.length} goals met</h2>
   <ul class="g-news">${res.map(r=>`<li>${r.met?'✓':'✗'} ${esc(r.t)} · <span class="muted">${esc(r.how)}</span></li>`).join('')}</ul>
   <button class="g-opt" data-act="debrief" data-arg="back"><b>Back the director</b><span>More confidence and loyalty</span></button><button class="g-opt g-leave" data-act="debrief" data-arg="warn"><b>Warn the director</b><span>A second warning opens the door to replacing the director</span></button></article>`;
 }
 /* deals done since the last press of Play: shown at full time, so the window has a visible result */
 function dealsCard(evs){
   const id=S.my,ins=evs.filter(e=>(e.t==='Transfer'||e.t==='Signing')&&e.c===id),outs=evs.filter(e=>e.t==='Transfer'&&e.c2===id),rel=evs.filter(e=>e.t==='Released'&&e.c===id);
   if(!ins.length&&!outs.length&&!rel.length)return'';
   const safe=new Set(S.pre&&S.pre.s===S.season&&S.pre.safety||[]);
   const li=(e,k)=>`<li><span class="g-tag ${k}">${{in:'IN',out:'OUT',rel:'LET GO'}[k]}</span> ${esc(e.text)}${k==='in'&&safe.has(e.text)?' <span class="muted">League rule: every club needs two keepers and a player in each position.</span>':''}</li>`;
   return`<section class="g-card"><h3>Transfers this week</h3><ul class="g-news g-deals">${ins.map(e=>li(e,'in')).join('')}${outs.map(e=>li(e,'out')).join('')}${rel.map(e=>li(e,'rel')).join('')}</ul></section>`;
 }

 /* ----- FULL TIME: the payoff of a week ----- */
 /* who scored and where they came from: the chairman's fingerprints on the result */
 function ftScorers(id){const m=myMatches()[0];if(!m)return'';const side=m.h===id?'h':'a',ours=m.scorers.filter(x=>x.side===side),theirs=m.scorers.filter(x=>x.side!==side);
   const tag=pid=>{const p=S.squads[id].find(x=>x.id===pid);if(!p)return'';const w=whyHere(p,id);return w==='academy'?'<i class="g-tag in">ACADEMY</i>':w==='find'?'<i class="g-tag in">YOUR FIND</i>':w==='new'?'<i class="g-tag">SIGNED THIS SUMMER</i>':''};
   const li=(x,us)=>`<li>${us?'⚽':'·'} <button class="pp-link" data-act="player" data-arg="${esc(x.pid)}">${esc(x.name)}</button> ${us?tag(x.pid):''}</li>`;
   return`<section class="g-card"><h3>The goals</h3>${ours.length?`<ul class="g-news g-goals">${ours.map(x=>li(x,1)).join('')}</ul>`:'<p class="g-hint">We did not score.</p>'}${theirs.length?`<p class="g-hint">For them: ${esc(theirs.map(x=>x.name).join(', '))}.</p>`:''}<p class="g-hint">Why: ${esc(xgWord(m))}.</p></section>`}
 function builtCard(evs){const done=evs.filter(e=>e.t==='ProjectCompleted'&&e.c===S.my);if(!done.length)return'';return`<section class="g-card g-built"><small class="g-k">BUILT</small>${done.map(e=>`<p>🏗 ${esc(e.text)}</p>`).join('')}</section>`}
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
   ${ftScorers(id)}${(()=>{const r=agendaRecap();return r.length?`<section class="rt">${rtBar('YOUR WEEK','WHAT IT DID')}<ul class="rt-news">${r.map(t=>`<li><b>✓</b><span>${esc(t)}</span></li>`).join('')}</ul></section>`:''})()}${weekRecap()}${builtCard(UI.gEv||[])}${dealsCard(UI.gEv||[])}${news?`<section class="g-card"><h3>At the club</h3><ul class="g-news">${news}</ul></section>`:''}
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
   return`<div class="g-week">${money}${growthCard(id)}${deptsCard(id)}
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
   const career=`<section class="g-card"><small class="g-k">YOUR CAREER</small><p><b>${esc(repWord())}</b> · promises kept ${L.kept} of ${L.made}</p><ul class="g-news">${S.career.map(cr=>`<li>${nm(cr.club)} · S${cr.from}${cr.to?'–'+cr.to:'–now'}${cr.why?` · <span class="muted">${esc(cr.why)}</span>`:''}</li>`).join('')}</ul><p class="g-hint">Your reputation follows you: a chairman who keeps their word gets better clubs and more patience.</p></section>`;
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
   const face=m=>`<li class="${m.rel==='you'?'me':''}">${faceSVG(m.first+F_.surname,{size:40,kid:m.age!=null&&m.age<16})}<span><b>${esc(m.first)} ${esc(F_.surname)}</b>${m.id===heir?' <i class="g-tag in">HEIR</i>':''}<br><small class="muted">${esc({you:'You, the chairman',partner:'Partner',child:'Child',elder:'Former chairman'}[m.rel]||m.rel)} · ${m.age} · ${esc(m.traits.join(', '))}${m.job?' · runs '+esc(m.job):m.path==='academy'?' · in the academy':m.path==='business'?' · in business':m.path==='away'?' · away from the club':''}</small></span></li>`;
   const book=F_.book.map(b=>`<li><b>G${b.gen}</b><span>${esc(b.first)} ${esc(F_.surname)}</span><em>S${b.from}${b.to?'–'+b.to:'–now'}${b.why?' · '+esc(b.why):''}</em></li>`).join('');
   const log=F_.log.slice(-4).reverse().map(x=>`<li>S${x.s} W${x.w} · ${esc(x.text)}</li>`).join('');
   return`<section class="g-card"><small class="g-k">THE ${esc(F_.surname.toUpperCase())} FAMILY · GENERATION ${F_.gen}</small><ul class="g-fam">${F_.members.filter(m=>m.alive).map(face).join('')}</ul>
   <h3 class="g-h">Dynasty book</h3><ul class="g-era">${book}</ul>${log?`<h3 class="g-h">Lately</h3><ul class="g-news">${log}</ul>`:''}</section>`;
 }


 /* ----- YOUR WEEK: where the chairman spends his time ----- */
 const gemLine=(g,btn)=>`<li class="g-gem"><div><b>${esc(g.name)}</b> <small class="muted">${esc(POS_ONE[g.pos]||g.pos)}, ${g.age} · ${g.from?nm(g.from):'free agent'}</small><span>Now ~${g.est} · ceiling ~${g.pot}${g.fee?` · £${g.fee}k${g.fee>budgetFor(S.my)?' (over budget)':''}`:' · free'}${g.cheap>0?` · ${g.cheap}% under value`:''}</span></div>${btn?g.status==='found'?`<button class="btn ghost" data-act="chairrec" data-arg="${esc(g.pid)}">Recommend</button>`:`<em>${g.status==='gone'&&g.to?'Joined '+nm(g.to):esc({recommended:'With the director',signed:'Signed ✓',gone:'Gone'}[g.status]||g.status)}</em>`:''}</li>`;
 function yourWeek(id){
   const R=UI.trip,res=R&&R.w===scNow()?tripResult(R):'';
   if(chairBusy())return res;
   if(UI.pickRegion)return`<section class="g-card"><small class="g-k">WHERE DO YOU GO?</small><div class="g-regions">${Object.entries(REGIONS).map(([k,r])=>{const v=SC().visits[k]||0;return`<button class="g-opt" data-act="chairtrip" data-arg="${k}"><b>${esc(r.n)}${v?` <small class="muted">· visited ${v}×</small>`:''}</b><span>${esc(r.d)} £${r.cost}k travel.</span></button>`}).join('')}</div><button class="btn ghost" data-act="chairback">Back</button></section>`;
   const act=(k,a,ic,t,sub)=>{const why=chairWhyNot(k);return`<button class="g-act" data-act="${a}" ${why?'disabled aria-disabled="true"':''}><span aria-hidden="true">${ic}</span><b>${t}</b><small>${esc(why||sub)}</small></button>`};
   return`${res}<section class="rt g-yw">${rtBar('YOUR WEEK','WHERE DO YOU SPEND IT?')}<div class="g-acts">
   ${act('trip','chairpick','✈','Scouting trip','With your head scout, to a region. Takes the week.')}
   ${act('trip','chairtour','★','Youth tournament','Fifteen-year-olds for the academy. Takes the week.')}
   ${act('data','chairdata','▤','Data day','Who plays above their price? Once a week.')}
   ${act('home','chairhome','⌂','At the club','Be seen by members and staff. The whole week.')}</div>
   <p class="rt-note">Trips find players for the director; a week at the club lifts the unhappiest members. One trip a week.</p></section>`;
 }
 function tripResult(R){
   if(R.kind==='home')return`<section class="g-quiet"><b>${R.group?`A week with ${esc(R.group)}.`:'A week at the club.'}</b> ${R.group?`Their mood: ${R.before} → ${R.after}.`:''} The members noticed.</section>`;
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
   ${mo.opts.map((o,i)=>`<button class="g-opt g-deal-opt" data-act="momchoose" data-arg="${i}"><b>${esc(o.label)}</b>${o.test!=='—'?`<dl><dt>You give</dt><dd>${esc(o.give)}</dd><dt>They give</dt><dd>${esc(o.get)}</dd><dt>Tested</dt><dd>${esc(o.test)}</dd><dt>If it fails</dt><dd>${esc(o.fail)}</dd></dl>`:`<span>${esc([o.give,o.get].filter(x=>x&&x!=='Nothing').join(' · ')||o.fail)}</span>`}</button>`).join('')}
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
     ${(()=>{const bv=budReview(id);return bv?`<h3>The budget you signed in July</h3><ul class="g-news">${bv.map(r=>`<li><b>${esc(r.n)} · £${r.pot}k.</b> ${esc(r.t)}</li>`).join('')}</ul>`:''})()}
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
   if(S.week<=WINTER_WEEK)return`${moneyCard(P_,id)}${tcBoard(P_,id,P_.wk-1)}${tcTicker(P_,P_.wk-1,false)}${briefCard(P_,id)}${listCard(P_,id)}`;
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
   ${h.agm?`<section class="g-card g-verdict ${out?'out':'in'}"><small class="g-k">THE VOTE · ${esc(c.name.toUpperCase())} MEMBERS</small><div class="g-vote big" aria-label="${h.agm.for} percent for you"><i style="--v:${h.agm.for}%"></i><span class="g-half" aria-hidden="true"></span></div><p class="g-vres">${out?'VOTED OUT':'RE-ELECTED'}</p><p>${h.agm.for}% for you. ${out?'The club goes on without you; other clubs are looking for a chairman.':'Another season to keep your promises.'}</p></section>`:''}
   ${goals.length?`<section class="g-card"><h3>Targets: ${met} of ${goals.length} met</h3><ul class="g-news">${goals.map(g=>`<li>${g.met?'✓':'✗'} ${esc(g.text)}</li>`).join('')}</ul></section>`:''}
   ${tallyCard()}${btn}</div><details class="g-full"><summary>Full season review</summary>${full.replace(/^<main[^>]*>|<\/main>\s*$/g,'')}</details></main>`;
 };

 /* the ticker plays back the week that was just simulated: one line at a time, then the board */
 /* the market clock: one day a beat; it stops when the chairman is needed */
 function tcStop(){UI.tcRun=false;clearTimeout(UI.tcTimer);UI.tcTimer=null}
 function tcStep(){const P_=PRE();if(!P_||!P_.brief||P_.wk>winWeeks(P_)){tcStop();return'closed'}
   /* deciding the bid or the record is the chairman's: lapse it only when Continue is pressed */
   const r=preDay();if(r.ok===false){tcStop();UI.msg={err:true,text:r.err};return'error'}
   if(r.closed){tcStop();return'closed'}
   if(P_.offer||P_.record){tcStop();return'decision'}
   if(preDeadlineNow(P_)&&P_.round==null&&!P_.dlStop){P_.dlStop=true;tcStop();UI.msg={text:'Deadline day. The window shuts at 23:00: anything you want to change, change it now.'};return'deadline'}
   return'go'}
 function tcGo(){const P_=PRE();if(!P_)return;UI.tcPanel=null;
   if(P_.offer||P_.record){/* Continue lets a waiting decision lapse */if(P_.offer){preTick(`You let the bid for ${P_.offer.name} lapse.`,'us');P_.offer=null}if(P_.record){const d=P_.deals.find(x=>x.pid===P_.record.pid);if(d)d.stage='walked';preTick(`The record deal for ${P_.record.name} falls through.`,'bad');P_.record=null}}
   const reduce=HAS_DOM&&window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
   if(!HAS_DOM||reduce){let x='go',n=0;while(x==='go'&&n++<40)x=tcStep();save();render();return}
   UI.tcRun=true;const beat=()=>{if(!UI.tcRun)return;const x=tcStep();save();render();if(x==='go')UI.tcTimer=setTimeout(beat,preDeadlineNow(PRE()||{})?900:380);else if(HAS_DOM&&x==='closed')window.scrollTo(0,0)};beat()}
 function tcStart(wk){const P_=S.pre;if(!P_||!HAS_DOM)return;const n=P_.ticker.filter(t=>t.wk===wk&&t.d>=0).length;UI.tcPlay={s:S.season,wk,shown:Math.min(1,n),total:n};clearTimeout(UI.tcTimer);
   const fast=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
   const tick=()=>{const p=UI.tcPlay;if(!p||p.shown>=p.total||!S||S.week!==0)return;p.shown++;render();UI.tcTimer=setTimeout(tick,fast?60:(wk===winWeeks(P_)?1300:950))};UI.tcTimer=setTimeout(tick,250)}
 /* ----- PLAYERS (§7.3–7.4, D-G4, Moneyball): one profile for every player, ours or not. Public data is exact (apps, goals,
    xG, match ratings, value, wage); ability is exact only for our own players and an estimate with a range for everyone else. ----- */
 const rt=q=>Math.round(qualityToStr(q));
 const avgR=p=>p.sRn?r1(p.sRat/p.sRn):null;
 const spark=a=>`<span class="pp-spark" aria-label="Last ratings ${(a||[]).join(', ')}">${(a||[]).map(r=>`<i style="height:${Math.round((r-3.5)/6.3*100)}%" class="${r>=7?'hi':r<6?'lo':''}"></i>`).join('')||'<em>—</em>'}</span>`;
 function knowOf(p,club){const id=S.my;if(club===id)return{own:true,now:rt(p.q),pot:rt(potentialSeen(id,p)),txt:'Exact: he is ours'};
   const g=S.scout&&S.scout.gems.find(x=>x.pid===p.id),sl=typeof shortlistEntry==='function'&&shortlistEntry(p.id);
   if(sl&&sl.obs){const r=scoutRange(id,sl.obs);return{now:rt(sl.est),lo:rt(sl.est-r),hi:rt(sl.est+r),pot:g?rt(g.pot):null,txt:`Scouted ${sl.obs} time${sl.obs>1?'s':''}`}}
   if(g)return{now:rt(g.est),lo:rt(g.est-2*scoutNoise(id)),hi:rt(g.est+2*scoutNoise(id)),pot:rt(g.pot),txt:`Your ${g.how==='data'?'analyst':'trip'}, S${g.s} W${g.w}`};
   return{now:null,txt:'Not scouted: you only have the data'}}
 function profileSheet(pid){const f=findPlayer(pid);if(!f)return overlayShell('Player','<p class="muted">This player has left the game world.</p>');
   const p=f.p,club=f.club,id=S.my,K=knowOf(p,club),own=club===id,cn=club?(S.clubs[club]?.name||S.foreign?.clubs?.[club]?.name||club):'Free agent';
   const tile=(k,v,sub)=>`<div class="pp-t"><small>${k}</small><b>${v}</b>${sub?`<span>${sub}</span>`:''}</div>`,ar=avgR(p),gx=r1((p.sGoals||0)-(p.sXg||0));
   const fee=!own&&club&&!String(club).startsWith('f_')?Math.round(askingFee(p,club)):!own&&club?Math.round(playerValue(p)):0;
   const hist=(p.history||[]).filter(h=>h.apps!=null).slice(-6).reverse();
   const g=S.scout&&S.scout.gems.find(x=>x.pid===pid),td=tdOf(id);
   const act=own?(UI.confirm===pid?`<div class="panel"><p>Release ${esc(p.name)}? It costs ${k1(releaseCost(p))} in compensation.</p><button class="btn" data-act="release" data-arg="${pid}">Release him</button><button class="btn ghost" data-act="confirm" data-arg="">Keep him</button></div>`:`<button class="btn ghost" data-act="confirm" data-arg="${pid}">Release (${k1(releaseCost(p))})</button>`)
     :g&&g.status==='found'?`<button class="btn" data-act="chairrec" data-arg="${pid}">Recommend to ${esc(td?td.name:'the director')}</button>`:g&&g.status==='recommended'?`<p class="g-hint">${esc(td?td.name:'The director')} is watching him.</p>`:'';
   return overlayShell(p.name,`<div class="pp">
   <p class="pp-id"><b>${esc(POS_ONE[p.pos]||p.pos)}</b> · ${p.age} · ${esc((p.nationality||'nmr').toUpperCase())} · ${esc(cn)}</p>
   <p class="pp-tags"><i class="g-tag">${esc(p.style||'')}</i>${own||K.lo!=null?`<i class="g-tag">${esc(p.trait||'')}</i>`:''}${p.academy&&p.originClub===id?'<i class="g-tag in">ACADEMY</i>':''}${p.inj>0?`<i class="g-tag out">INJURED ${p.inj} WK</i>`:''}</p>
   <section class="pp-sec"><small class="g-k">WHAT WE KNOW · ${esc(K.txt.toUpperCase())}</small><div class="pp-grid">${tile('Rating',K.now==null?'?':(K.lo!=null?'~':'')+K.now,K.lo!=null?`${K.lo}–${K.hi}`:own?'exact':'scout him')}${tile('Ceiling',K.pot==null?'?':'~'+K.pot,p.age<=23?'still growing':p.age>=31?'past his peak':'at his peak')}${tile('Form',spark(p.rLast),'last five')}</div></section>
   <section class="pp-sec"><small class="g-k">THE DATA · SEASON ${S.season}</small><div class="pp-grid">${tile('Games',p.sApps||0)}${tile('Goals',p.sGoals||0)}${tile('xG',r1(p.sXg||0))}${tile('Goals − xG',(gx>0?'+':'')+gx,gx>=1?'finishes well':gx<=-1?'wasteful':'as expected')}${tile('Avg rating',ar==null?'—':ar,ar==null?'':ar>=7?'excellent':ar>=6.5?'good':ar>=6?'steady':'poor')}${tile('Career',`${p.apps||0} / ${p.goals||0}`,'games / goals')}</div></section>
   ${p.youth?`<section class="pp-sec"><small class="g-k">THE ACADEMY YEARS · FROM AGE ${p.youth.joinAge}</small><p class="g-hint">${esc(p.youth.from.school)} and ${esc(p.youth.from.club)}, ${esc(p.youth.from.where)}.</p><ol class="ac-time">${p.youth.hist.slice().reverse().filter(x=>x.apps||x.note).slice(0,8).map(x=>`<li><span class="ac-tb">${esc(x.team)}</span><div><b>Age ${x.age}</b>${x.apps?` · ${x.apps} games, ${x.goals} goals`:''}<p>${esc(x.note)}</p></div></li>`).join('')}</ol></section>`:''}
   <section class="pp-sec"><small class="g-k">THE MONEY</small><div class="pp-grid">${tile('Value',k1(playerValue(p)))}${tile('Wage',`£${n0(p.wage)}`,'a week')}${tile('Contract',`${p.contract} yr`,p.contract<=1?'ends this summer':'')}${fee?tile('Asking fee',k1(fee),ar?`£${Math.round(fee/Math.max(.5,ar-5))}k per rating point over 5`:''):''}</div></section>
   ${hist.length?`<section class="pp-sec"><small class="g-k">SEASON BY SEASON</small><table class="pp-tab"><thead><tr><th>Season</th><th>Club</th><th>G</th><th>Gls</th><th>xG</th><th>Rtg</th></tr></thead><tbody>${hist.map(h=>`<tr><td>S${h.season}</td><td>${esc((S.clubs[h.club]?.name||S.foreign?.clubs?.[h.club]?.name||'—').split(' ')[0])}</td><td>${h.apps}</td><td>${h.goals}</td><td>${h.xg??'—'}</td><td>${h.rating??'—'}</td></tr>`).join('')}</tbody></table></section>`:''}
   ${p.dev&&p.dev.length?`<section class="pp-sec"><small class="g-k">DEVELOPMENT</small>${devLines(p)}</section>`:''}
   ${act}</div>`)}
 playerSheet=function(pid){return profileSheet(pid)};
 /* the squad as data: sort it the way a Moneyball office would */
 const SQ_SORT={rating:['Rating',p=>-p.q],avg:['Avg',p=>-(avgR(p)??0)],goals:['Goals',p=>-(p.sGoals||0)],xg:['xG',p=>-(p.sXg||0)],value:['Value',p=>-playerValue(p)],wage:['Wage',p=>-p.wage],age:['Age',p=>p.age]};
 const oldSquad=squadView;
 squadView=function(){if(!inGame())return oldSquad();const id=S.my,k=UI.sqSort||'rating',sq=S.squads[id].slice().sort((a,b)=>SQ_SORT[k][1](a)-SQ_SORT[k][1](b));
   return`<div class="g-week"><section class="g-card"><small class="g-k">THE SQUAD · ${sq.length} PLAYERS · SEASON ${S.season} DATA</small>
   <div class="sq-sort" role="group" aria-label="Sort by">${Object.entries(SQ_SORT).map(([kk,v])=>`<button class="${k===kk?'on':''}" data-act="sqsort" data-arg="${kk}" aria-pressed="${k===kk}">${v[0]}</button>`).join('')}</div>
   <div class="sq-wrap"><table class="sq-tab"><thead><tr><th>Player</th><th>Pos</th><th>Age</th><th>Rtg</th><th>Avg</th><th>G</th><th>Gls</th><th>xG</th><th>Value</th><th>£/wk</th></tr></thead><tbody>
   ${sq.map(p=>`<tr class="${p.inj>0?'inj':''}"><td><button class="sq-name" data-act="player" data-arg="${p.id}">${esc(p.name)}</button>${p.academy&&p.originClub===id?' <i class="g-tag in">A</i>':''}</td><td>${esc(p.pos)}</td><td>${p.age}</td><td><b>${rt(p.q)}</b></td><td>${avgR(p)??'—'}</td><td>${p.sApps||0}</td><td>${p.sGoals||0}</td><td>${r1(p.sXg||0)}</td><td>${k1(playerValue(p))}</td><td>${n0(p.wage)}</td></tr>`).join('')}</tbody></table></div>
   <p class="g-hint">Rtg is the player's level on the squad scale; Avg is his average match rating this season; xG the goals his chances were worth. Tap a name for the profile.</p></section></div>`};
 const oldAct=act;
 act=function(a,arg){
   if(a==='prewelcome'&&S){S.welcomed=true;save();render();if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='seat'&&S){UI.seat=arg;render();if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='seatback'&&S){UI.seat=null;render();if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='choose')UI.seat=null;
   if(a==='sealmanifest'&&S&&S.my){S.welcomed=true;const r=cmd('SealManifest',S.my,{});UI.msg=r.ok===false?{err:true,text:r.err}:{text:'Manifest signed. Your director comes to the TD meeting with a plan built around it.'};save();render();if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='pmandate'&&S&&S.my){const old=mandateOf(S.my).deals,r=cmd('SetMandate',S.my,{deals:arg});const d=tdOf(S.my),order=['small','medium','large'];if(r.ok!==false&&d&&old!==arg){const up=order.indexOf(arg)>order.indexOf(old);d.loy=clamp((d.loy??50)+(up?4:-6),0,100);(d.mem=d.mem||[]).push({s:S.season,t:up?'given more room to sign':'had the signing limit cut'})}UI.msg=r.ok===false?{err:true,text:r.err}:{text:`${d?d.name:'The director'}: ${order.indexOf(arg)>order.indexOf(old)?'“Thank you. I will use it.”':arg===old?'“Understood.”':'“If that is how you want it.”'}`};save();render();return}
   if(a==='prenew'&&S&&S.my){const r=cmd('RenewStaff',S.my,{role:arg});const p=P(CL(S.my).cast[arg]);if(r.ok!==false&&p){p.loy=clamp((p.loy??50)+8,0,100);(p.mem=p.mem||[]).push({s:S.season,t:'given a new contract'})}UI.msg=r.ok===false?{err:true,text:r.err}:{text:`${p.name} signs for two more seasons.`};save();render();return}
   if(a==='preplace'){UI.replace=arg||null;render();return}
   if(a==='phire'&&S&&S.my){const [role,pid]=String(arg).split(':');const old=P(CL(S.my).cast[role]),r=cmd('HireStaff',S.my,{role,pid});UI.replace=null;if(r.ok!==false){const n=P(pid);(n.mem=n.mem||[]).push({s:S.season,t:'appointed by you'});n.loy=Math.max(n.loy??50,60)}UI.msg=r.ok===false?{err:true,text:r.err}:{text:`${P(pid).name} is your new ${role==='coach'?'head coach':'director of football'}${old&&!old.pro.caretaker?`; ${old.name} leaves`:''}.`};save();render();return}
   if(a==='bankloan'&&S&&S.my){const r=cmd('TakeLoan',S.my,{amount:+arg,years:5});if(r.ok!==false)(S.inboxSnooze=S.inboxSnooze||{}).bank=S.season*100+S.week+4;UI.msg=r.ok===false?{err:true,text:r.err}:{text:`£${arg}k borrowed over five years.`};save();render();return}
   if(a==='bankprices'&&S&&S.my){let ok=0;for(const k of ['terrace','seated'])if(cmd('SetPrice',S.my,{kind:k,delta:1}).ok!==false)ok++;(S.inboxSnooze=S.inboxSnooze||{}).bank=S.season*100+S.week+4;UI.msg={text:ok?'Ticket prices up by £1. The members grumble.':'Prices are already at their limit.',err:!ok};save();render();return}
   if(a==='bankcut'&&S&&S.my){for(const k in G(S.my).depts)cmd('SetDeptBudget',S.my,{dept:k,level:'tight'});(S.inboxSnooze=S.inboxSnooze||{}).bank=S.season*100+S.week+4;UI.msg={text:'Every department is on a tight budget.'};save();render();return}
   if(a==='banksell'&&S&&S.my){const p=S.squads[S.my].find(x=>x.id===arg);if(p){(S.sellNext=S.sellNext||[]).push(p.id);if(S.win&&S.win.s===S.season&&S.win.list)S.win.list.push(p.id)}(S.inboxSnooze=S.inboxSnooze||{}).bank=S.season*100+S.week+4;UI.msg={text:p?`${p.name} goes on the list for the winter window.`:'He has gone.'};save();render();return}
   if(a==='snooze'&&S&&S.my){(S.inboxSnooze=S.inboxSnooze||{})[arg]=S.season*100+S.week+(String(arg).startsWith('ask:')?4:arg==='bank'?3:1);save();render();return}
   if(a==='invest'&&S&&S.my){const o=projectCatalog(S.my).find(x=>x.key===arg),r=cmd('StartProject',S.my,{key:arg,offer:'standard'});UI.msg=r.ok===false?{err:true,text:r.err}:{text:`Work starts: ${o?o.label:'the project'}. Follow it under Running.`};save();render();return}
   if(a==='sqsort'){UI.sqSort=arg;render();return}
   if(a==='briefedit'){UI.briefEdit=true;render();return}
   if(a==='briefgoal'&&S&&S.my){const b=briefPick(S.my);const i=b.goals.indexOf(arg);if(i>=0)b.goals.splice(i,1);else if(b.max===1)b.goals=[arg];else if(b.goals.length<b.max)b.goals.push(arg);else UI.msg={err:true,text:'Three goals at most: untick one first.'};render();return}
   if(a==='keepcaretaker'&&S&&S.my){const r=cmd('KeepCaretaker',S.my,{});UI.msg=r.ok===false?{err:true,text:r.err}:{text:`${coachOf(S.my).name} has the job until the summer.`};save();render();return}
   if(a==='hirecoach'&&S&&S.my){const r=cmd('HireStaff',S.my,{role:'coach',pid:arg});UI.msg=r.ok===false?{err:true,text:r.err}:{text:`${P(arg).name} is your new head coach. The dressing room lifts.`};save();render();return}
   if(a==='agopen'){UI.agOpen=UI.agOpen===arg?null:arg;render();return}
   if(a==='agmeet'&&S&&S.my){const [topic,opt]=arg.split('|'),r=cmd('Meet',S.my,{topic,opt});UI.agOpen=null;if(r.ok===false)UI.msg={err:true,text:r.err};save();render();return}
   if(a==='agseat'&&S&&S.my){const r=cmd('Seat',S.my,{seat:arg});if(r.ok===false)UI.msg={err:true,text:r.err};save();render();return}
   if(a==='acadt'){UI.acadT=arg;UI.acadKid=null;render();return}
   if(a==='acadkid'){UI.acadKid=arg||null;render();if(HAS_DOM){const o=document.querySelector('.overlay .inner');if(o)o.scrollTop=0}return}
   if(a==='acadpick'&&S&&S.my){const r=cmd('AcademyPick',S.my,{kid:arg});if(r.ok===false)UI.msg={err:true,text:r.err};save();render();return}
   if(a==='budmove'&&S&&S.my){const [pot,d]=arg.split(':'),r=cmd('BudgetMove',S.my,{pot,d:+d});if(r.ok===false)UI.msg={err:true,text:r.err};render();return}
   if(a==='budloan'&&S&&S.my){const r=cmd('BudgetLoan',S.my,{});UI.msg=r.ok===false?{err:true,text:r.err}:{text:`The bank lends £${r.res.amount}k over five years. Three more blocks to divide.`};save();render();return}
   if(a==='budgetsign'&&S&&S.my){budOpen(S.my);const r=cmd('SignBudget',S.my,{});UI.brief=null;UI.msg=r.ok===false?{err:true,text:r.err}:{text:budSignLine(r.res.met)};save();render();if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='briefbudget'&&S&&S.my){briefPick(S.my).budget=arg;render();return}
   if(a==='briefrecruit'&&S&&S.my){briefPick(S.my).recruit=arg;render();return}
   if(a==='briefsign'&&S&&S.my){const b=briefPick(S.my),r=signBrief(S.my,b.goals,b.budget,b.recruit);UI.briefEdit=false;UI.msg=r.ok===false?{err:true,text:r.err}:{text:'Plan agreed. Play the first week and the market opens.'};save();render();if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='debrief'&&S&&S.my){const r=debriefChoose(arg==='back');UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='prefav'&&S&&S.my){const r=preFavour(arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='prelist'&&S&&S.my){const r=preListToggle(arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.on?'Available: the director will sell for a fair bid.':'Taken off the list.'};save();render();return}
   if(a==='preloan'&&S&&S.my){const r=preDeadlineLoan();UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='prenext'&&S&&S.my){tcGo();return}
   if(a==='tcpause'){tcStop();render();return}
   if(a==='tcall'){UI.tcAll=true;render();return}
   if(false){if(HAS_DOM)window.scrollTo(0,0);return}
   if(a==='tcskip'){if(UI.tcPlay)UI.tcPlay.shown=UI.tcPlay.total;render();return}
   if(a==='preoffer'&&S&&S.my){const r=preOffer(arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='prerecord'&&S&&S.my){const r=preRecord(arg==='yes');UI.msg=r.ok===false?{err:true,text:r.err}:{text:r.text};save();render();return}
   if(a==='tcpanel'){UI.tcPanel=UI.tcPanel===arg?null:arg;render();return}
   if(a==='prerecruit'&&S&&S.my){const r=cmd('SetSquadPolicy',S.my,{recruit:arg});UI.msg=r.ok===false?{err:true,text:r.err}:{text:`Profile: ${RECRUIT[arg].n}. The director looks for that from now on.`};save();render();return}
   if(a==='preprio'&&S&&S.my){prePrio(arg);save();render();return}
   if(a==='prebudget'&&S&&S.my){const r=preBudget();UI.msg=r&&r.ok===false?{err:true,text:r.err}:{text:`Transfer budget now ${k1(budgetFor(S.my))}.`};save();render();return}
   if(a==='chairpick'){UI.pickRegion=true;render();return}
   if(a==='chairback'){UI.pickRegion=false;render();return}
   if(['chairtrip','chairtour','chairdata','chairhome'].includes(a)&&S&&S.my){const id=S.my,r=a==='chairtrip'?chairTrip(id,arg):a==='chairtour'?chairTournament(id):a==='chairdata'?chairData(id):chairHome(id);
     UI.pickRegion=false;if(r.ok===false)UI.msg={err:true,text:r.err};else{UI.trip={...r,kind:{chairtrip:'trip',chairtour:'tour',chairdata:'data',chairhome:'home'}[a],w:scNow()};(UI.weekLog=UI.weekLog||[]).push(UI.trip);if(UI.weekLog.length>12)UI.weekLog.shift()}save();render();return}
   if(a==='chairrec'&&S&&S.my){const r=chairRecommend(S.my,arg);UI.msg=r.ok===false?{err:true,text:r.err}:{text:`Recommended. The director will weigh him in the search for a ${POS_ONE[r.pos]}.`};save();render();return}
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
