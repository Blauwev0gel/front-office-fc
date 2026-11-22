/* ================= Screens: title, choice of club, the week, tables and squad =================
   The UI only reads state and sends commands (cmd) or advanceWeek/closeSeason. No game rules live here. */
const UI={tab:'week',over:null,arg:null,gt:'stadium',mt:'overview',tier:null,msg:null,review:null,lastEv:[],gsel:null,ly:5,confirm:null,title:true};
const n0=v=>Math.round(v).toLocaleString('en-GB');
const k1=v=>(v<0?'−':'')+'£'+Math.abs(r1(v)).toLocaleString('en-GB')+'k';
const crest=`<svg class="crest" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 2 L31 7 V17 C31 25 24 30 17 32 C10 30 3 25 3 17 V7 Z" fill="var(--navy)"/><path d="M8 22 L14 12 L18 18 L21 14 L26 22" stroke="var(--signal)" stroke-width="2.6" fill="none" stroke-linejoin="round"/></svg>`;
function nm(id){return esc(marketClubName(id))} /* also for clubs abroad, where a candidate may come from */
function tierShort(t){return['Premier','One','Two','Three','Four'][t]}
function strWord(id){const t=CL(id).tier,ids=tierIds(t).sort((a,b)=>teamStrength(b)-teamStrength(a)),r=ids.indexOf(id)+1;return r<=3?'Among the best':r<=7?'Upper half':r<=11?'Lower half':'Among the weakest'}
function moneyWord(id){const f=F(id),inc=estSeasonIncome(id);return f.cash<0?'In the red':f.cash<inc*.1?'Stretched':f.cash<inc*.4?'Steady':'Comfortable'}
function wdlProb(lh,la){let w=0,d=0;for(let i=0;i<=9;i++){const a=pmf(lh,i);for(let j=0;j<=9;j++){const b=pmf(la,j);if(i>j)w+=a*b;else if(i===j)d+=a*b}}return{w,d,l:1-w-d}}
function pct(x){return Math.round(x*100)+'%'}

function topBar(){
  const c=C();
  return`<header class="top">${crest}<div class="tg"><div class="club">${esc(c.name)}</div><div class="sub">Season ${S.season} · ${S.week?'Week '+S.week:'Pre-season'} · ${TIER_NAME[c.tier]}</div></div><span class="pill ${F(S.my).cash<0?'bad':''}">${k1(F(S.my).cash)}</span></header>
  <nav class="nav" aria-label="Sections">${[['week','Week'],['club','Club'],['squad','Squad'],['money','Money'],['table','League']].map(([k,n])=>`<button class="${UI.tab===k?'on':''}" data-act="tab" data-arg="${k}" aria-current="${UI.tab===k?'page':'false'}">${n}</button>`).join('')}</nav>`;
}
function render(){
  if(!HAS_DOM)return;const app=document.getElementById('app');let h='';
  if(!S||UI.title)h=titleView();
  else if(UI.review)h=reviewView();
  else if(S.phase==='choose')h=chooseView();
  else{const body=UI.tab==='table'?tableView():UI.tab==='squad'?squadView():UI.tab==='club'?clubView():UI.tab==='money'?moneyView():weekView();h=topBar()+`<main class="withbar">${body}</main>`+actionBar()}
  if(S&&UI.over)h+=overlayView();
  app.innerHTML=h;
  document.body.style.overflow=UI.over?'hidden':'';
}

/* ----- title and the choice of club ----- */
function titleView(){
  return`<main class="scene" style="padding-top:48px"><p class="eyebrow">The Northmarch</p><h1>Chairman</h1>
  <p class="voice">Eighty clubs, five divisions, one national cup and a wider European football world. The world runs whether you act or not.</p>
  <p class="muted">You are the elected chairman. Build the ground, keep the books, set the frame for your director of football, and live with what follows.</p>
  <div class="stack">${hasSave()?`<button class="btn" data-act="cont">Continue</button>`:''}<button class="btn ${hasSave()?'ghost':''}" data-act="new">New game</button></div>
  <p class="note">Layer 1–2 build: the living world and club management. Stories, staff and dynasties are switched off in this version.</p></main>`;
}
function chooseView(){
  const again=S.career.length>0,last=again?S.career[S.career.length-1]:null;
  const probs=S.seats.map(id=>`${strWord(id)} in ${TIER_NAME[CL(id).tier]}; ${moneyWord(id).toLowerCase()} finances.`);
  return`<main class="scene" style="padding-top:28px"><p class="eyebrow">${again?`Season ${S.season} · after ${esc(CL(last.club).name)}`:`${S.seats.length} open chairs`}</p><h2>${again?`${S.seats.length} clubs want you`:'Where do you stand for election?'}</h2>
  <p class="muted">${again?`${esc(last.why||'Your term ended')}. The world kept turning; pick your next club.`:'Each club is a real club in the same world. Pick the one whose problem you want.'}</p>
  <div class="stack">${S.seats.map((id,i)=>{const c=CL(id),sg=groundSignals(id),f=F(id);return`<button class="deal" data-act="choose" data-arg="${id}"><span class="dt">${esc(c.name)}</span><span class="small muted">${probs[i]}</span>
    <dl><dt>Division</dt><dd>${TIER_NAME[c.tier]}</dd><dt>Squad</dt><dd>${strWord(id)}</dd><dt>Support</dt><dd>${n0(c.support)} · ground holds ${n0(sg.capacity)}</dd><dt>Money</dt><dd>${k1(f.cash)} in the bank${debt(id)?` · ${k1(debt(id))} debt`:''}</dd></dl></button>`}).join('')}</div></main>`;
}

/* ----- the week ----- */
/* what the chances said, from the match engine's own expected goals: no invented events */
function xgWord(m){const home=m.h===S.my,xf=home?m.lh:m.la,xa=home?m.la:m.lh,gf=home?m.gh:m.ga,ga=home?m.ga:m.gh,d=(gf-ga)-(xf-xa);return Math.abs(xf-xa)<.25?'an even game on chances':d>1.2?'we got more than the chances suggested':d<-1.2?'we deserved more than we got':xf>xa?'we created more':'they created more'}
function myMatches(){return(S.matches||[]).filter(m=>m.h===S.my||m.a===S.my)}
function headline(m){const home=m.h===S.my,gf=home?m.gh:m.ga,ga=home?m.ga:m.gh,opp=home?m.a:m.h,won=m.pens?m.pens===S.my:gf>ga;
  const cup=m.comp==='cup'?' in the cup':'';
  if(gf===ga&&!m.pens)return`Honours even with ${CL(opp).name}${cup}`;
  return won?(gf-ga>=3?`${C().name} run riot${cup}`:`${C().name} beat ${CL(opp).name}${cup}`):(ga-gf>=3?`Humbled by ${CL(opp).name}${cup}`:`${CL(opp).name} too strong${cup}`)}
function reportView(){
  const ms=myMatches();if(!S.week||!ms.length)return'';
  const evs=UI.lastEv.filter(e=>e.c===S.my&&['Injury','Return','ProjectCompleted','ProjectStarted','SafetyClosure','CashCrisis','ForcedSale','Administration','Renewed','Transfer','Signing','Released','Ground','LoanTaken','CupWon'].includes(e.t)).slice(-6);
  const m=ms[0],f=F(S.my).last;
  return`<section class="echo" aria-label="The Northmarch Echo"><div class="mast"><b>THE NORTHMARCH ECHO</b><span>Week ${S.week}</span></div>
  <div class="head">${esc(headline(m))}</div>
  ${ms.map((x,i)=>`<button class="btn ghost lvwatch" data-act="watch" data-arg="${i}">▶ Watch ${ms.length>1?esc(x.comp==='cup'?'the cup tie':'the league match'):'the match'}, minute by minute</button>`).join('')}
  ${ms.map(m=>`<div class="fix"><b>${nm(m.h)}</b><span class="score">${m.gh}–${m.ga}</span><b>${nm(m.a)}</b></div>
  <p class="small muted" style="text-align:center">${m.comp==='cup'?esc(CUP_ROUND[m.round])+' · ':''}${m.att?n0(m.att)+' watching':''}${m.pens?` · ${nm(m.pens)} win on penalties`:''}</p>
  <p class="small muted" style="text-align:center">Expected goals ${m.lh.toFixed(1)}–${m.la.toFixed(1)}: ${xgWord(m)}</p>
  ${m.scorers.length?`<p class="small">${m.scorers.map(s=>esc(s.name.split(' ').slice(-1)[0])+(s.side==='h'?' ('+esc(CL(m.h).name.split(' ')[0])+')':' ('+esc(CL(m.a).name.split(' ')[0])+')')).join(', ')}</p>`:''}`).join('<hr>')}
  ${ms.some(x=>x.comp==='league')?`<p class="small"><b>${TIER_NAME[C().tier]}: ${ord(posOf(S.my))}</b>${UI.prevPos&&UI.prevPos!==posOf(S.my)?` <span class="${UI.prevPos>posOf(S.my)?'up':'down'}">(${UI.prevPos>posOf(S.my)?'▲':'▼'}${Math.abs(UI.prevPos-posOf(S.my))})</span>`:''} · ${S.tbl[S.my].pts} point${S.tbl[S.my].pts===1?'':'s'}</p>`:''}
  <ul>${evs.map(e=>`<li>${esc(e.text)}</li>`).join('')}${f?`<li>The week's books: ${k1(f.net)}${f.lines.gate?` (gate ${k1(f.lines.gate)})`:''}.</li>`:''}</ul></section>`;
}
function europeanFixtureOf(id,week){
  const euro=S.foreign?.current?.europe;
  if(!euro||!EURO_WEEKS.includes(week))return null;
  const i=euro.alive.indexOf(id);
  if(i<0||euro.alive.length<2)return null;
  const j=i%2===0?i+1:i-1;
  return euro.alive[j]?{home:euro.alive[i-i%2],away:euro.alive[i-i%2+1],opponent:euro.alive[j]}:null;
}
function europeanPreviewPanel(){
  const w=S.week+1,fixture=europeanFixtureOf(S.my,w);
  if(!fixture)return'';
  const a=fixture.home,b=fixture.away,sa=foreignStrength(a),sb=foreignStrength(b);
  const [lh,la]=lambdas(sa,sb,false),p=wdlProb(lh,la),mine=a===S.my?p.w:p.l;
  const name=id=>S.clubs[id]?.name||S.foreign?.clubs?.[id]?.name||id;
  return`<div class="panel"><p class="eyebrow">European knockout · week ${w}</p>
    <div class="fix"><b>${esc(name(a))}</b><span class="muted">v</span><b>${esc(name(b))}</b></div>
    <p class="small muted">One-leg, neutral-ground knockout. Expected goals ${lh.toFixed(1)}–${la.toFixed(1)}; chance of winning in normal time about ${pct(mine)}. Extra match load will affect next week.</p></div>`;
}
function europeanResultPanel(){
  const rounds=S.foreign?.current?.europe?.rounds||[];
  const matches=rounds.flat().filter(m=>m.week===S.week&&(m.h===S.my||m.a===S.my));
  if(!matches.length)return'';
  const name=id=>S.clubs[id]?.name||S.foreign?.clubs?.[id]?.name||id;
  return matches.map(m=>`<div class="panel"><p class="eyebrow">Europe · week ${m.week}</p>
    <div class="fix"><b>${esc(name(m.h))}</b><span class="score">${m.gh}–${m.ga}</span><b>${esc(name(m.a))}</b></div>
    <p class="small muted">${m.winner===S.my?'Through to the next round':'Eliminated'}${m.gh===m.ga?' after a deciding shoot-out':''}.
    ${m.scorers?.[S.my]?.length?' Scorers: '+m.scorers[S.my].map(x=>esc(x.name)).join(', ')+'.':''}</p></div>`).join('');
}
function previewView(){
  if(seasonOver())return`<div class="panel"><p class="eyebrow">The season is over</p><p>${TIER_NAME[C().tier]}: you finish ${ord(posOf(S.my))}.</p></div>`;
  const w=S.week+1,fx=fixtureOf(S.my,w),cup=CUP_WEEKS[S.cup.round]===w?cupTieOf(S.my):null,out=[];
  for(const [m,comp] of [[fx,'league'],[cup?{h:cup.h,a:cup.a,home:cup.h===S.my,opp:cup.h===S.my?cup.a:cup.h}:null,'cup']]){if(!m)continue;
    const neutral=comp==='cup'&&S.cup.round===CUP_WEEKS.length-1,sh=teamStrength(m.h)+(neutral?0:homeEdge(m.h)),sa=teamStrength(m.a),[lh,la]=lambdas(sh,sa,!neutral),p=wdlProb(lh,la);
    const mine=m.home?p.w:p.l,theirs=m.home?p.l:p.w;
    out.push(`<div class="panel"><p class="eyebrow">${comp==='cup'?`${CUP_NAME} · ${CUP_ROUND[S.cup.round]}`:`Week ${w} · ${TIER_NAME[C().tier]}`}</p>
    <div class="fix"><b>${nm(m.h)}</b><span class="muted">v</span><b>${nm(m.a)}</b></div>
    <div class="cmp"><span>Position</span><b>${comp==='league'?(S.week?ord(posOf(m.h)):'—'):tierShort(CL(m.h).tier)}</b><b>${comp==='league'?(S.week?ord(posOf(m.a)):'—'):tierShort(CL(m.a).tier)}</b>
    <span>Squad strength</span><b>${Math.round(teamStrength(m.h))}</b><b>${Math.round(teamStrength(m.a))}</b>
    <span>Form</span><b>${(S.tbl[m.h].form||[]).join('')||'—'}</b><b>${(S.tbl[m.a].form||[]).join('')||'—'}</b></div>
    <p class="small muted">The bookmakers: ${pct(mine)} we win, ${pct(p.d)} a draw, ${pct(theirs)} we lose.</p></div>`)}
  if(!out.length)out.push(`<div class="panel"><p class="eyebrow">Week ${w}</p><p class="muted">No game for us this week.</p></div>`);
  return out.join('')+europeanPreviewPanel();
}
function myResults(n){
  return S.ev.filter(e=>e.t==='Match'&&e.s===S.season&&(e.c===S.my||e.c2===S.my)).slice(-n).reverse().map(e=>{const home=e.c===S.my,gf=home?e.gh:e.ga,ga=home?e.ga:e.gh,r=gf>ga?'W':gf<ga?'L':'D';return{r,gf,ga,opp:home?e.c2:e.c,home,cup:e.comp==='cup',w:e.w}});
}
function resultsPanel(){
  const rs=myResults(6);if(!rs.length)return'';
  return`<div class="panel"><p class="eyebrow">Recent results</p>${rs.map(x=>`<div class="row small"><span><span class="pill ${x.r==='W'?'good':x.r==='L'?'bad':''}" aria-label="${x.r==='W'?'Win':x.r==='L'?'Defeat':'Draw'}">${x.r}</span> ${x.home?'v':'at'} ${nm(x.opp)}${x.cup?' · cup':''}</span><b>${x.gf}–${x.ga}</b></div>`).join('')}</div>`;
}
function weekView(){
  const over=seasonOver();
  return`${chairmanBriefingView()}${UI.playNote?`<div class="panel playnote" role="status"><p class="small"><b>${esc(UI.playNote)}</b></p></div>`:''}${reportView()}${europeanResultPanel()}${urgentPanel()}${featurePanel('week:recruitmentAlerts')}${clubWeekPanel()}${windowPanel()}${previewView()}${resultsPanel()}${worldNewsPanel(5)}${lookPanel()}${targetsPanel()}
  <p class="note">${over?'Prize money, promotion and relegation, contracts and the summer window follow.':'Every week is played. Change prices, budgets or building first if you want them to count this week.'}</p>`;
}

/* ----- tables ----- */
function tableView(){
  const t=UI.tier??C().tier;
  const tabs=`<div class="tabs" role="tablist">${TIERS.map(x=>`<button class="${t===x?'on':''}" data-act="tier" data-arg="${x}" aria-pressed="${t===x}">${tierShort(x)}</button>`).join('')}<button class="${t==='cup'?'on':''}" data-act="tier" data-arg="cup" aria-pressed="${t==='cup'}">Cup</button><button class="${t==='market'?'on':''}" data-act="tier" data-arg="market" aria-pressed="${t==='market'}">Market</button><button class="${t==='archive'?'on':''}" data-act="tier" data-arg="archive" aria-pressed="${t==='archive'}">History</button></div>`;
  if(t==='market')return tabs+marketView();
  if(t==='archive')return tabs+archiveView();
  if(t==='cup')return tabs+cupView();
  const st=standings(t);
  return`${tabs}<div class="panel"><p class="eyebrow">${TIER_NAME[t]}</p><div class="tbl" role="table" aria-label="${TIER_NAME[t]} table">
  <div class="trow head" role="row"><span>#</span><span>Club</span><span>P</span><span>GD</span><b>Pts</b></div>
  ${st.map((id,i)=>{const r=S.tbl[id],zone=(t>0&&i<2)?'zone-up':(t<4&&i>=14)?'zone-down':'';return`<button class="trow ${id===S.my?'me':''} ${zone}" role="row" data-act="club" data-arg="${id}"><span>${i+1}</span><span class="nm">${nm(id)}${r.ded?` <span class="inj">−${r.ded}</span>`:''}</span><span>${r.p}</span><span>${r.gf-r.ga>0?'+':''}${r.gf-r.ga}</span><b>${r.pts}</b></button>`}).join('')}</div>
  <p class="note">${t>0?'Top two go up. ':''}${t<4?'Bottom two go down. ':''}Tap a club to inspect it.</p></div>`;
}
function cupView(){
  const cup=S.cup,rounds={};for(const l of cup.log)(rounds[l.r]=rounds[l.r]||[]).push(l);
  const next=cup.round<CUP_WEEKS.length?`<div class="panel"><p class="eyebrow">${CUP_ROUND[cup.round]} · week ${CUP_WEEKS[cup.round]}</p>${cup.ties.map(t=>`<div class="row small ${t.h===S.my||t.a===S.my?'':''}"><span>${t.h===S.my||t.a===S.my?'<b>':''}${nm(t.h)} v ${nm(t.a)}${t.h===S.my||t.a===S.my?'</b>':''}</span></div>`).join('')}</div>`:`<div class="panel"><p class="eyebrow">Winners</p><p><b>${nm(cup.winner)}</b></p></div>`;
  const mine=cup.alive.includes(S.my)||cup.winner===S.my;
  return`<p class="small ${mine?'up':'muted'}">${cup.winner===S.my?'You won the cup.':mine?'Still in the cup.':cup.round===0&&C().tier<=2?'The top three divisions join after the preliminary round.':'Out of the cup.'} Prize money grows every round.</p>${next}
  ${Object.keys(rounds).reverse().map(r=>`<div class="panel"><p class="eyebrow">${CUP_ROUND[r]}</p>${rounds[r].map(l=>`<div class="row small"><span>${l.h===S.my||l.a===S.my?'<b>':''}${nm(l.h)} ${l.gh}–${l.ga} ${nm(l.a)}${l.h===S.my||l.a===S.my?'</b>':''}</span></div>`).join('')}</div>`).join('')}`;
}

/* ----- squad ----- */
function qbar(q){return`<span class="qbar">${r1(q)}<i aria-hidden="true"><b style="width:${clamp((q-5)/12*100,4,100)}%"></b></i></span>`}
function potWord(p){const d=p.pa-p.q;return p.age>=29?'At their level':d>2.5?'Big potential':d>1?'Room to grow':'Close to their best'}
function loanedOutPanel(){const out=Object.entries(S.squads).flatMap(([cid,sq])=>sq.filter(p=>p.loan&&p.loan.from===S.my).map(p=>({p,cid})));
  return out.length?`<div class="panel"><p class="eyebrow">Out on loan</p>${out.map(({p,cid})=>`<div class="row small"><span>${esc(p.name)} <span class="muted">at ${nm(cid)}</span></span><b>${p.sApps} apps</b></div>`).join('')}</div>`:''}
function marketView(){
  const ev=S.ev.filter(e=>['Transfer','InternationalTransfer','Signing','Loan'].includes(e.t)).slice(-200),wins={};
  for(const e of ev){const k=e.w===0?`Summer window, season ${e.s}`:e.w>=SEASON_WEEKS?`Summer ${e.s}`:e.w>=WINTER_WEEK&&e.w<=WINTER_WEEK+1?`Winter, season ${e.s}`:`Season ${e.s}`;(wins[k]=wins[k]||[]).push(e)}
  const keys=Object.keys(wins).reverse().slice(0,3);
  return keys.length?keys.map(k=>{const list=wins[k],fees=list.filter(e=>e.fee).sort((a,b)=>b.fee-a.fee).slice(0,5),mine=list.filter(e=>e.c===S.my||e.c2===S.my);
    return`<div class="panel"><p class="eyebrow">${esc(k)} · ${list.length} moves</p>${fees.length?`<p class="small muted">Biggest fees</p>${fees.map(e=>`<p class="small">${esc(e.text)}</p>`).join('')}`:''}${mine.length?`<p class="small muted">Your club</p>${mine.map(e=>`<p class="small"><b>${esc(e.text)}</b></p>`).join('')}`:''}</div>`}).join(''):'<p class="muted">No transfers yet. Windows: the summer and week '+WINTER_WEEK+'.</p>';
}
function squadView(){
  const id=S.my,sq=S.squads[id].slice().sort((a,b)=>POS.indexOf(a.pos)-POS.indexOf(b.pos)||b.q-a.q),gaps=squadGaps(S.squads[id]),f=F(id);
  const bill=wageBillK(id),cap=wageCapK(id),xi=pickXI(S.squads[id]).map(x=>x.p.id);
  return`<div class="panel"><div class="row"><span>Squad strength</span><b>${Math.round(teamStrength(id))} · ${strWord(id)}</b></div>
  <div class="row small"><span>Players</span><b>${sq.length} · average age ${r1(sq.reduce((a,p)=>a+p.age,0)/sq.length)}</b></div>
  <div class="row small"><span>Wage bill</span><b class="${bill>cap?'down':''}">£${n0(bill*1000)} a week · limit £${n0(cap*1000)}</b></div>
  ${gaps.slice(0,3).map(g=>`<p class="small down">${esc(g.text)}</p>`).join('')}</div>
  <div class="panel"><p class="eyebrow">The frame for your director</p><div class="row small"><span>Wage limit</span><b>£${n0(cap*1000)} a week</b></div><div class="row small"><span>Spending power now</span><b>${k1(budgetFor(id))}</b></div><p class="small muted">The director signs and sells within the frame you set in the budget.</p><button class="btn ghost" data-act="tobudget">Set the frame in Money → Budget</button></div>
  ${loanedOutPanel()}
  ${POS.map(pos=>{const ps=sq.filter(p=>p.pos===pos);if(!ps.length)return'';return`<p class="eyebrow">${POS_L[pos]}</p><div class="stack">${ps.map(p=>`<button class="prow" data-act="player" data-arg="${p.id}"><span><span class="pn">${esc(p.name)}${xi.includes(p.id)?' <span class="pill">XI</span>':''}${p.susp>0?' <span class="pill bad">Banned</span>':''}${p.wantsOut?' <span class="pill bad">Wants out</span>':''}${p.loan?' <span class="pill">On loan</span>':''}</span><br><span class="pm">${p.age} · ${p.contract<=1?'<b>contract ends</b>':p.contract+' yrs'} · ${MORALE_WORD(p.morale)} · £${p.wage}/wk${p.inj?` · <span class="inj">out ${p.inj} wk</span>`:''}</span></span>
    <span>${qbar(p.q)}${Math.abs(p.grown)>=.1?`<span class="small ${p.grown>0?'up':'down'}"> ${p.grown>0?'▲':'▼'}</span>`:''}</span></button>`).join('')}</div>`}).join('')}`;
}
