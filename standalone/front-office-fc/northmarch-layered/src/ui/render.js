/* ================= Screens: title, choice of club, the week, tables and squad =================
   The UI only reads state and sends commands (cmd) or advanceWeek/closeSeason. No game rules live here. */
const UI={tab:'week',over:null,arg:null,gt:'stadium',mt:'overview',tier:null,msg:null,review:null,lastEv:[],gsel:null,ly:5,confirm:null,title:true};
const n0=v=>Math.round(v).toLocaleString('en-GB');
const k1=v=>(v<0?'−':'')+'£'+Math.abs(r1(v)).toLocaleString('en-GB')+'k';
const crest=`<svg class="crest" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 2 L31 7 V17 C31 25 24 30 17 32 C10 30 3 25 3 17 V7 Z" fill="var(--navy)"/><path d="M8 22 L14 12 L18 18 L21 14 L26 22" stroke="var(--signal)" stroke-width="2.6" fill="none" stroke-linejoin="round"/></svg>`;
function nm(id){return esc(CL(id).name)}
function tierShort(t){return['Premier','One','Two'][t]}
function strWord(id){const t=CL(id).tier,ids=tierIds(t).sort((a,b)=>teamStrength(b)-teamStrength(a)),r=ids.indexOf(id)+1;return r<=3?'Among the best':r<=7?'Upper half':r<=11?'Lower half':'Among the weakest'}
function moneyWord(id){const f=F(id),inc=estSeasonIncome(id);return f.cash<0?'In the red':f.cash<inc*.1?'Stretched':f.cash<inc*.4?'Steady':'Comfortable'}
function wdlProb(lh,la){let w=0,d=0;for(let i=0;i<=9;i++){const a=pmf(lh,i);for(let j=0;j<=9;j++){const b=pmf(la,j);if(i>j)w+=a*b;else if(i===j)d+=a*b}}return{w,d,l:1-w-d}}
function pct(x){return Math.round(x*100)+'%'}

function topBar(){
  const c=C();
  return`<header class="top">${crest}<div class="tg"><div class="club">${esc(c.name)}</div><div class="sub">Season ${S.season} · ${S.week?'Week '+S.week:'Pre-season'} · ${TIER_NAME[c.tier]}</div></div><span class="pill ${F(S.my).cash<0?'bad':''}">${k1(F(S.my).cash)}</span></header>
  <nav class="nav" aria-label="Sections">${[['week','Week'],['table','Tables'],['squad','Squad'],['club','Club']].map(([k,n])=>`<button class="${UI.tab===k?'on':''}" data-act="tab" data-arg="${k}" aria-current="${UI.tab===k?'page':'false'}">${n}</button>`).join('')}</nav>`;
}
function render(){
  if(!HAS_DOM)return;const app=document.getElementById('app');let h='';
  if(!S||UI.title)h=titleView();
  else if(S.phase==='choose')h=chooseView();
  else if(UI.review)h=reviewView();
  else{const body=UI.tab==='table'?tableView():UI.tab==='squad'?squadView():UI.tab==='club'?clubView():weekView();h=topBar()+`<main>${body}</main>`}
  if(S&&UI.over)h+=overlayView();
  app.innerHTML=h;
  document.body.style.overflow=UI.over?'hidden':'';
}

/* ----- title and the choice of club ----- */
function titleView(){
  return`<main class="scene" style="padding-top:48px"><p class="eyebrow">The Northmarch</p><h1>Chairman</h1>
  <p class="voice">Forty-eight members' clubs, three divisions, one cup. The world runs whether you act or not.</p>
  <p class="muted">You are the elected chairman. Build the ground, keep the books, set the frame for your director of football, and live with what follows.</p>
  <div class="stack">${hasSave()?`<button class="btn" data-act="cont">Continue</button>`:''}<button class="btn ${hasSave()?'ghost':''}" data-act="new">New game</button></div>
  <p class="note">Layer 1–2 build: the living world and club management. Stories, staff and dynasties are switched off in this version.</p></main>`;
}
function chooseView(){
  const probs=['A big club that has fallen behind its rivals.','The harbour club: proud, broke enough to matter.','A small club with a big crowd for its size.'];
  return`<main class="scene" style="padding-top:28px"><p class="eyebrow">Three open chairs</p><h2>Where do you stand for election?</h2>
  <p class="muted">Each club is a real club in the same world. Pick the one whose problem you want.</p>
  <div class="stack">${S.seats.map((id,i)=>{const c=CL(id),sg=groundSignals(id),f=F(id);return`<button class="deal" data-act="choose" data-arg="${id}"><span class="dt">${esc(c.name)}</span><span class="small muted">${probs[i]}</span>
    <dl><dt>Division</dt><dd>${TIER_NAME[c.tier]}</dd><dt>Squad</dt><dd>${strWord(id)}</dd><dt>Support</dt><dd>${n0(c.support)} · ground holds ${n0(sg.capacity)}</dd><dt>Money</dt><dd>${k1(f.cash)} in the bank${debt(id)?` · ${k1(debt(id))} debt`:''}</dd></dl></button>`}).join('')}</div></main>`;
}

/* ----- the week ----- */
function myMatches(){return(S.matches||[]).filter(m=>m.h===S.my||m.a===S.my)}
function headline(m){const home=m.h===S.my,gf=home?m.gh:m.ga,ga=home?m.ga:m.gh,opp=home?m.a:m.h,won=m.pens?m.pens===S.my:gf>ga;
  const cup=m.comp==='cup'?' in the cup':'';
  if(gf===ga&&!m.pens)return`Honours even with ${CL(opp).name}${cup}`;
  return won?(gf-ga>=3?`${C().name} run riot${cup}`:`${C().name} beat ${CL(opp).name}${cup}`):(ga-gf>=3?`Humbled by ${CL(opp).name}${cup}`:`${CL(opp).name} too strong${cup}`)}
function reportView(){
  const ms=myMatches();if(!S.week||!ms.length)return'';
  const evs=UI.lastEv.filter(e=>e.c===S.my&&['Injury','Return','ProjectCompleted','ProjectStarted','SafetyClosure','CashCrisis','ForcedSale','Administration','Renewed','Transfer','Signing','Released','Ground','LoanTaken','CupWon'].includes(e.t));
  const m=ms[0],f=F(S.my).last;
  return`<section class="echo" aria-label="The Northmarch Echo"><div class="mast"><b>THE NORTHMARCH ECHO</b><span>Week ${S.week}</span></div>
  <div class="head">${esc(headline(m))}</div>
  ${ms.map(m=>`<div class="fix"><b>${nm(m.h)}</b><span class="score">${m.gh}–${m.ga}</span><b>${nm(m.a)}</b></div>
  <p class="small muted" style="text-align:center">${m.comp==='cup'?esc(CUP_ROUND[m.round])+' · ':''}${m.att?n0(m.att)+' watching':''}${m.pens?` · ${nm(m.pens)} win on penalties`:''}</p>
  ${m.scorers.length?`<p class="small">${m.scorers.map(s=>esc(s.name.split(' ').slice(-1)[0])+(s.side==='h'?' ('+esc(CL(m.h).name.split(' ')[0])+')':' ('+esc(CL(m.a).name.split(' ')[0])+')')).join(', ')}</p>`:''}`).join('<hr>')}
  <ul>${evs.slice(0,6).map(e=>`<li>${esc(e.text)}</li>`).join('')}${f?`<li>The week's books: ${k1(f.net)}${f.lines.gate?` (gate ${k1(f.lines.gate)})`:''}.</li>`:''}</ul></section>`;
}
function previewView(){
  if(seasonOver())return`<div class="panel"><p class="eyebrow">The season is over</p><p>${TIER_NAME[C().tier]}: you finish ${ord(posOf(S.my))}.</p></div>`;
  const w=S.week+1,fx=fixtureOf(S.my,w),cup=CUP_WEEKS[S.cup.round]===w?cupTieOf(S.my):null,out=[];
  for(const [m,comp] of [[fx,'league'],[cup?{h:cup.h,a:cup.a,home:cup.h===S.my,opp:cup.h===S.my?cup.a:cup.h}:null,'cup']]){if(!m)continue;
    const neutral=comp==='cup'&&S.cup.round===CUP_WEEKS.length-1,sh=teamStrength(m.h)+(neutral?0:homeEdge(m.h)),sa=teamStrength(m.a),[lh,la]=lambdas(sh,sa,!neutral),p=wdlProb(lh,la);
    const mine=m.home?p.w:p.l,theirs=m.home?p.l:p.w;
    out.push(`<div class="panel"><p class="eyebrow">${comp==='cup'?`${CUP_NAME} · ${CUP_ROUND[S.cup.round]}`:`Week ${w} · ${TIER_NAME[C().tier]}`}</p>
    <div class="fix"><b>${nm(m.h)}</b><span class="muted">v</span><b>${nm(m.a)}</b></div>
    <div class="cmp"><span>Position</span><b>${comp==='league'?ord(posOf(m.h)):tierShort(CL(m.h).tier)}</b><b>${comp==='league'?ord(posOf(m.a)):tierShort(CL(m.a).tier)}</b>
    <span>Squad strength</span><b>${Math.round(teamStrength(m.h))}</b><b>${Math.round(teamStrength(m.a))}</b>
    <span>Form</span><b>${(S.tbl[m.h].form||[]).join('')||'—'}</b><b>${(S.tbl[m.a].form||[]).join('')||'—'}</b></div>
    <p class="small muted">The bookmakers: ${pct(mine)} we win, ${pct(p.d)} a draw, ${pct(theirs)} we lose.</p></div>`)}
  if(!out.length)out.push(`<div class="panel"><p class="eyebrow">Week ${w}</p><p class="muted">No game for us this week.</p></div>`);
  return out.join('');
}
function weekView(){
  const over=seasonOver();
  return`${reportView()}${previewView()}${hubCards()}
  <button class="btn" data-act="${over?'close':'play'}">${over?'Close the season':`Play week ${S.week+1}`}</button>
  <p class="note">${over?'Prize money, promotion and relegation, contracts and the summer window follow.':'Every week is played. Change prices, budgets or building first if you want them to count this week.'}</p>`;
}

/* ----- tables ----- */
function tableView(){
  const t=UI.tier??C().tier;
  const tabs=`<div class="tabs" role="tablist">${TIERS.map(x=>`<button class="${t===x?'on':''}" data-act="tier" data-arg="${x}" aria-pressed="${t===x}">${tierShort(x)}</button>`).join('')}<button class="${t==='cup'?'on':''}" data-act="tier" data-arg="cup" aria-pressed="${t==='cup'}">Cup</button></div>`;
  if(t==='cup')return tabs+cupView();
  const st=standings(t);
  return`${tabs}<div class="panel"><p class="eyebrow">${TIER_NAME[t]}</p><div class="tbl" role="table" aria-label="${TIER_NAME[t]} table">
  <div class="trow head" role="row"><span>#</span><span>Club</span><span>P</span><span>GD</span><b>Pts</b></div>
  ${st.map((id,i)=>{const r=S.tbl[id],zone=(t>0&&i<2)?'zone-up':(t<2&&i>=14)?'zone-down':'';return`<button class="trow ${id===S.my?'me':''} ${zone}" role="row" data-act="club" data-arg="${id}"><span>${i+1}</span><span class="nm">${nm(id)}${r.ded?` <span class="inj">−${r.ded}</span>`:''}</span><span>${r.p}</span><span>${r.gf-r.ga>0?'+':''}${r.gf-r.ga}</span><b>${r.pts}</b></button>`}).join('')}</div>
  <p class="note">${t>0?'Top two go up. ':''}${t<2?'Bottom two go down. ':''}Tap a club to inspect it.</p></div>`;
}
function cupView(){
  const cup=S.cup,rounds={};for(const l of cup.log)(rounds[l.r]=rounds[l.r]||[]).push(l);
  const next=cup.round<CUP_WEEKS.length?`<div class="panel"><p class="eyebrow">${CUP_ROUND[cup.round]} · week ${CUP_WEEKS[cup.round]}</p>${cup.ties.map(t=>`<div class="row small ${t.h===S.my||t.a===S.my?'':''}"><span>${t.h===S.my||t.a===S.my?'<b>':''}${nm(t.h)} v ${nm(t.a)}${t.h===S.my||t.a===S.my?'</b>':''}</span></div>`).join('')}</div>`:`<div class="panel"><p class="eyebrow">Winners</p><p><b>${nm(cup.winner)}</b></p></div>`;
  const mine=cup.alive.includes(S.my)||cup.winner===S.my;
  return`<p class="small ${mine?'up':'muted'}">${cup.winner===S.my?'You won the cup.':mine?'Still in the cup.':cup.round===0&&C().tier===0?'Premier clubs enter in the second round.':'Out of the cup.'} Prize money grows every round.</p>${next}
  ${Object.keys(rounds).reverse().map(r=>`<div class="panel"><p class="eyebrow">${CUP_ROUND[r]}</p>${rounds[r].map(l=>`<div class="row small"><span>${l.h===S.my||l.a===S.my?'<b>':''}${nm(l.h)} ${l.gh}–${l.ga} ${nm(l.a)}${l.h===S.my||l.a===S.my?'</b>':''}</span></div>`).join('')}</div>`).join('')}`;
}

/* ----- squad ----- */
function qbar(q){return`<span class="qbar">${r1(q)}<i aria-hidden="true"><b style="width:${clamp((q-5)/12*100,4,100)}%"></b></i></span>`}
function potWord(p){const d=p.pa-p.q;return p.age>=29?'At their level':d>2.5?'Big potential':d>1?'Room to grow':'Close to their best'}
function squadView(){
  const id=S.my,sq=S.squads[id].slice().sort((a,b)=>POS.indexOf(a.pos)-POS.indexOf(b.pos)||b.q-a.q),gaps=squadGaps(S.squads[id]),f=F(id);
  const bill=wageBillK(id),cap=wageCapK(id),xi=pickXI(S.squads[id]).map(x=>x.p.id);
  return`<div class="panel"><div class="row"><span>Squad strength</span><b>${Math.round(teamStrength(id))} · ${strWord(id)}</b></div>
  <div class="row small"><span>Players</span><b>${sq.length} · average age ${r1(sq.reduce((a,p)=>a+p.age,0)/sq.length)}</b></div>
  <div class="row small"><span>Wage bill</span><b class="${bill>cap?'down':''}">£${n0(bill*1000)} a week · limit £${n0(cap*1000)}</b></div>
  ${gaps.slice(0,3).map(g=>`<p class="small down">${esc(g.text)}</p>`).join('')}</div>
  <div class="panel"><p class="eyebrow">The frame for your director</p><p class="small muted">The director signs, sells and renews within these limits. You set the frame; he does the deals.</p>
  <p class="small"><b>Wages</b> as a share of expected income</p><div class="seg">${Object.keys(WAGE_RATIO).map(k=>`<button class="${f.policy.wage===k?'on':''}" data-act="pol" data-arg="${k}" aria-pressed="${f.policy.wage===k}">${{tight:'Tight',normal:'Normal',ambitious:'Bold',allin:'All in'}[k]} ${Math.round(WAGE_RATIO[k]*100)}%</button>`).join('')}</div>
  <p class="small"><b>Transfer money</b>: share of spare cash he may spend</p><div class="seg">${[[.2,'Keep cash'],[.5,'Balanced'],[.8,'Back him']].map(([v,n])=>`<button class="${Math.abs(f.policy.spend-v)<.05?'on':''}" data-act="spend" data-arg="${v}" aria-pressed="${Math.abs(f.policy.spend-v)<.05}">${n}</button>`).join('')}</div>
  <p class="note">Spending power now: ${k1(budgetFor(id))}. Windows: the summer and week ${WINTER_WEEK}. Renewals in week ${RENEW_WEEK}.</p></div>
  ${POS.map(pos=>{const ps=sq.filter(p=>p.pos===pos);if(!ps.length)return'';return`<p class="eyebrow">${POS_L[pos]}</p><div class="stack">${ps.map(p=>`<button class="prow" data-act="player" data-arg="${p.id}"><span><span class="pn">${esc(p.name)}${xi.includes(p.id)?' <span class="pill">XI</span>':''}</span><br><span class="pm">${p.age} · ${p.contract<=1?'<b>contract ends</b>':p.contract+' yrs'} · £${p.wage}/wk${p.inj?` · <span class="inj">out ${p.inj} wk</span>`:''}</span></span>
    <span>${qbar(p.q)}${Math.abs(p.grown)>=.1?`<span class="small ${p.grown>0?'up':'down'}"> ${p.grown>0?'▲':'▼'}</span>`:''}</span></button>`).join('')}</div>`}).join('')}`;
}
