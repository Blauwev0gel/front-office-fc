/* ================= Screens: the summer meeting, the brief, the transfer centre, the edition, the debrief, the staff office ================= */
const KIND_W={depth:['Depth','info'],weak:['Weakness','wait'],leaving:['Leaving','bad']};
const HOW_W={buy:'Signed',free:'Free transfer',loan:'On loan',academy:'From the academy',sold:'Sold',released:'Released','loan out':'Loaned out'};
function posBadge(pos){return`<span class="pb pb-${pos==='GK'?'gk':['CB','FB'].includes(pos)?'df':['DM','CM','AM'].includes(pos)?'mf':'fw'}">${pos}</span>`}
function gradeChip(g){return g?`<span class="grade g${g}" aria-label="scout grade ${g}">${g}</span>`:''}
function tgtLine(t,ab){const meta=t.kind==='buy'?`${t.age} · ${esc(CL(t.from)?CL(t.from).name:'abroad')}`:t.kind==='free'?`${t.age} · free agent`:t.kind==='academy'?`${t.age} · our academy`:'a loan';
  return`<div class="tgl"><span class="tg-ab">${ab}</span>${gradeChip(t.grade)}<span class="tg-n"><b>${esc(t.name)}</b><span class="muted">${meta}</span></span></div>`}
// in the summer meeting: the club, what we need, with named targets and the scout's confidence
function tdAssessment(){
  const s=S.cf&&S.cf.sum;if(!s)return planPanel();const tdp=P(S.cf.tdId),td=tdOf(S.cf.tdId);
  const L=sumLineStats(S.cf.squad.filter(p=>!p.loan)),weak=Object.entries(L).sort((a,b)=>a[1].q-b[1].q)[0][0].toLowerCase();
  const go=s.verdicts.filter(v=>v.v!=='keep').map(v=>{const p=playerById(v.pid);return p?`<span class="chipr ${v.v==='sell'?'bad':v.v==='release'?'warn':''}">${v.v==='sell'?'Sell':v.v==='release'?'Release':'Loan'}: ${esc(p.name)}</span>`:''}).join('');
  const renew=s.contracts.filter(c=>c.plan==='renew').length,letgo=s.contracts.filter(c=>c.plan==='go');
  const pr=s.prios.slice().sort((a,b)=>a.order-b.order).map((x,i)=>`<div class="mprio"><div class="mprio-h"><span class="prio-n">${i+1}</span><b>${esc(x.goal)}</b><span class="sv-v sv-${KIND_W[x.kind][1]}">${KIND_W[x.kind][0]}</span></div><span class="muted small">${esc(x.reason)}</span>${x.targets.slice(0,2).map((t,j)=>tgtLine(t,'AB'[j])).join('')}</div>`).join('');
  const A=(s.prios[0]&&s.prios[0].targets[0])||null,B=(s.prios[1]&&s.prios[1].targets[0])||null;
  const scout=A?(td.eye>=4?`I'd put my name to ${A.name}. I have seen him four times.`:td.eye<=2?`${A.name} looks good on video. Nobody has seen him live yet.`:`${A.name} I have seen twice. ${B?`${B.name} only on video.`:''}`):'Our reports are thin this summer.';
  return`<section class="agenda-s"><p class="cand-h">The club</p>
   <div class="bubble">${face(tdp.id).replace('class="face','class="face sm')}<div class="bb"><b>${esc(tdp.name)} · Director</b><p>Our weakest line is the ${weak}. These players go, and ${renew} contract${renew===1?'':'s'} I want to renew${letgo.length?`; ${letgo.map(c=>c.name).join(' and ')} leave${letgo.length===1?'s':''} in June`:''}.</p></div></div>
   ${go?`<div class="chips">${go}</div>`:''}
   <p class="cand-h">What we need</p>${pr||'<p class="muted">No gaps worth chasing.</p>'}
   <div class="bubble"><span class="face sm scout-f" aria-hidden="true">SC</span><div class="bb"><b>Chief scout</b><p>${esc(scout)}</p></div></div></section>`;
}
// the transfer centre: a week-by-week broadcast, played in the page
const TK_ST=['Talks','Bid','Agreed','Medical','Signed'];
function tkRoute(a,b){const c=x=>x?CL(x):null,me=C(),A=a?c(a):null,B=b?c(b):null;const sw=k=>`<i style="background:${k?k.col[0]:'#bbb'}"></i>`;
  return`<span class="route">${sw(A)}${esc(A?A.name:a===null&&B===me?'Free':'—')} → ${sw(B)}${esc(B?B.name:'Released')}</span>`}
function tkMug(m){const ini=m.name.split(' ').map(x=>x[0]).join('').slice(0,2);return`<span class="mug" aria-hidden="true">${ini}<span class="pb2">${m.pos}</span></span>`}
function tkCard(m){const me=S.my;
  if(m.type==='in')return`<div class="card c-in"><div class="ct">DONE DEAL<span>${esc(HOW_W[m.how]||'')}</span></div><div class="cb">${tkMug(m)}<div class="txt"><b>${esc(m.name)}</b>${tkRoute(m.from,me)}<span>${m.age} · scouted as ${m.grade||'–'}</span></div><span class="fee">${esc(m.fee)}</span></div></div>`;
  if(m.type==='out')return`<div class="card c-out"><div class="ct">OUT<span>${m.to?'Sold':esc(m.fee)}</span></div><div class="cb">${tkMug(m)}<div class="txt"><b>${esc(m.name)}</b>${tkRoute(me,m.to)}</div><span class="fee">${esc(m.to?m.fee:'')}</span></div></div>`;
  if(m.type==='hj'||m.type==='off')return`<div class="card ${m.type==='hj'?'c-hj':'c-off'}"><div class="ct">${m.type==='hj'?(m.lost==='market'?'HIJACKED':'MISSED'):'PLAN OFF'}</div><div class="cb"><div class="txt"><b>${esc(m.title)}</b><span>${esc(m.s)}</span></div></div></div>`;
  if(m.type==='rm')return`<div class="card c-rm"><div class="ct">WORD IS</div><div class="cb"><div class="txt"><b>${esc(m.title)}</b><span>${esc(m.s)}</span></div></div></div>`;
  if(m.type==='fr')return`<div class="card c-fr"><div class="ct">FRIENDLY · FULL TIME</div><div class="cb"><div class="score">${esc(C().name.split(' ')[0])} <span class="n">${m.sc}</span> ${esc(CL(m.opp).name.split(' ')[0])}</div></div><div class="cb" style="padding-top:0"><div class="txt"><span>${esc(m.s)}</span></div></div></div>`;
  return`<div class="card c-quiet">${esc(m.t)}</div>`}
function tkTracker(trk){return trk.map(t=>{const lost=t.st===-1,done=t.st===5,wait=t.st===-2;
  return`<div class="trk${lost?' lost':''}"><div class="trk-h">${gradeChip(t.grade)}<b>${esc(t.name)}</b><span class="plan">Plan ${t.plan} · ${POS_ONE[t.pos]}</span>${lost?'<span class="status no">Missed</span>':done?'<span class="status ok">Signed</span>':wait?'<span class="status wt">Waiting</span>':`<span class="status go">${TK_ST[t.st]}</span>`}</div>${t.lost&&t.lost.length?`<span class="trk-lost">Lost: ${t.lost.map(l=>`${l.plan} · ${esc(l.name)}`).join(', ')}</span>`:''}
  ${t.kind==='loan'||t.kind==='academy'?'':`<div class="dots">${TK_ST.map((x,i)=>`<span class="dot ${done||(!lost&&!wait&&i<t.st)?'done':(!lost&&i===t.st?'on':'')}"><i></i>${x}</span>`).join('')}</div>`}</div>`}).join('')}
function tickHTML(){const s=S.cf.sum,W=s.wk,n=Math.min(UI.tw||0,W.length-1),cur=W[n],parts=[];
  for(let i=n;i>=0;i--){if(i<n)parts.push(`<span class="sec">${W[i].label}</span>`);for(const m of W[i].moments.slice().reverse())parts.push(tkCard(m))}
  const heads=W.slice(0,n+1).flatMap(x=>x.heads).reverse().slice(0,10);
  return`<div class="tc-top"><span class="live-dot" aria-hidden="true"></span><b>Transfer centre</b><span class="clock"><b>${cur.date}</b><span>${cur.label}</span></span></div>
  <div class="crawl" aria-label="Latest headlines"><span class="lab">LATEST</span><span class="run">${heads.concat(heads).map(h=>`<span>${esc(h)}</span>`).join('')}</span></div>
  <div class="ctrl"><button data-tk="play" class="pri">${UI.tkT?'Pause':n>=W.length-1?'Replay':'Play'}</button><button data-tk="next">Next week</button><button data-tk="all">Show it all</button></div>
  <div class="tc-body"><span class="sec">Deal tracker</span>${tkTracker(cur.trk)||'<p class="muted">No deals this window.</p>'}<span class="sec">${cur.label} · moments</span><div class="feed">${parts.join('')}</div></div>`}
function tickPaint(){const el=document.getElementById('tick');if(el)el.innerHTML=tickHTML()}
function tickStop(){if(UI.tkT){clearInterval(UI.tkT);UI.tkT=null}}
function tickMount(){if(UI.tkMounted!==S.season+S.cf.sum.kind){UI.tkMounted=S.season+S.cf.sum.kind;UI.tw=0;tickStop();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)tickStart();else UI.tw=S.cf.sum.wk.length-1}tickPaint()}
function tickStart(){const L=S.cf.sum.wk.length-1;if((UI.tw||0)>=L)UI.tw=0;UI.tkT=setInterval(()=>{UI.tw++;if(UI.tw>=L)tickStop();tickPaint()},2000)}
if(HAS_DOM)document.addEventListener('click',e=>{const b=e.target.closest('[data-tk]');if(!b||!S||!S.cf||!S.cf.sum)return;const L=S.cf.sum.wk.length-1,k=b.dataset.tk;
  if(k==='play'){if(UI.tkT)tickStop();else tickStart()}if(k==='next'){tickStop();UI.tw=Math.min((UI.tw||0)+1,L)}if(k==='all'){tickStop();UI.tw=L}tickPaint()});
const SUM_STEPS=['Meeting','Brief','The summer','Edition','Debrief'];
function sumSteps(i){return`<div class="ssteps" aria-label="Step ${i+1} of 5">${SUM_STEPS.map((x,k)=>`<i class="${k<=i?'on':''}"></i>`).join('')}</div>`}
function edHead(g){const c=C().name.split(' ')[0];return{A:`A summer to remember at ${c}`,B:`Smart business at ${c}`,C:'A summer of half measures',D:`Questions over ${c}'s summer business`,E:`A summer to forget at ${c}`}[g]}
function tsumView(){
  const s=S.cf.sum,tdp=P(S.cf.tdId),td=tdOf(S.cf.tdId),F=S.cf.frames;
  if(s.step==='brief')return`${sumSteps(1)}<p class="eyebrow">The summer brief</p><h2 class="big-h">What ${esc(tdp.name)} signs</h2><p class="muted">He will be judged on this in September.</p>
   <div class="brief"><span class="stampB">Signed</span><h3>Summer brief</h3>${s.brief.map((k,i)=>`<div class="kpi"><span class="n">${i+1}</span><span>${esc(k.t)}.</span></div>`).join('')}
   <div class="sig"><span class="lbl muted">Director of football</span><span class="sig-n">${esc(tdp.name)}</span></div></div>
   <div class="chips"><span class="chipr">Budget £${S.cf.budgetLeft}k</span><span class="chipr">Wage cap £${F.cap}/wk</span>${(F.rules||[]).map(r=>`<span class="chipr">${esc(FRAME_WORD[r]||r)}</span>`).join('')}</div>
   <button class="btn" data-act="sumNext">Open the window</button>`;
  if(s.step==='live')return`${sumSteps(2)}<div class="tc" id="tick"></div><button class="btn" data-act="sumNext">The summer edition</button>`;
  const v=sumVerdict(false),a=s.analysis;
  if(s.step==='edition'){const R=q=>Math.round(qualityToStr(q));
    return`${sumSteps(3)}<article class="news"><div class="mast"><b>THE NORTHMARCH ECHO</b><span>Summer edition</span></div>
    <div class="headline"><span class="grade bigg g${v.grade}" aria-label="summer grade ${v.grade}">${v.grade}</span><div><h3>${esc(edHead(v.grade))}</h3><p class="muted">${v.met} of ${v.kpis.length} points of the brief met. ${v.net<0?`Net income £${-v.net}k.`:`Net spend £${v.net}k.`}</p></div></div>
    <span class="lbl">In</span><div class="chips">${s.ins.map(x=>`<span class="chipr good">${x.pos} ${esc(x.name)} ${gradeChip((playerById(x.pid)||{}).scoutGrade)}</span>`).join('')||'<span class="muted">Nobody</span>'}</div>
    <span class="lbl">Out</span><div class="chips">${s.outs.map(x=>`<span class="chipr bad">${x.pos} ${esc(x.name)}${x.fee?` · £${x.fee}k`:''}</span>`).join('')||'<span class="muted">Nobody</span>'}</div>
    <span class="lbl">Line by line · rating</span><div class="linecmp">${a.lines.map(l=>`<span>${l.name}</span><span class="bar"><i style="width:${clamp((R(l.qa)-30)*2.5,4,100)}%"></i></span><b>${R(l.qb)} → ${R(l.qa)}</b>`).join('')}</div>
    <p class="quote">Coach: "${v.xi>=.2?'I have a better squad than in May. Now it is up to me.':v.xi<=-.2?'We are weaker than last season. I will say that to anyone who asks.':'Much the same squad. We will have to be better ourselves.'}"</p>
    <p class="quote">Fans: ${v.grade<='B'?'The forums are buzzing about the new arrivals.':'Supporters ask where the plan went.'}</p>
    <p class="quote">Board: "${v.met>=2?'The director did what we agreed.':'We expected more from this summer.'}"</p></article>
    <button class="btn" data-act="sumNext">The debrief</button>`}
  const say=v.strike?'The rest is on me. I know what that means.':v.grade<='B'?'Give me the same backing next summer.':v.excuse?'The market beat us. I would do the same again.':'Not my best summer. I will learn from it.';
  return`${sumSteps(4)}<p class="eyebrow">The debrief</p><h2 class="big-h">Five questions</h2><p class="muted">About ${esc(tdp.name)}'s summer.</p>
   <div class="stack">${v.Q.map(q=>`<div class="q ${q.ok===true?'ok':q.ok===false?'no':'na'}"><span class="m" aria-hidden="true">${q.ok===true?'✔':q.ok===false?'✖':'–'}</span><span><b>${q.t}</b>${esc(q.x)}</span></div>`).join('')}</div>
   <div class="bubble">${face(tdp.id).replace('class="face','class="face sm')}<div class="bb"><b>${esc(tdp.name)}</b><p>${esc(say)}</p></div></div>
   ${v.strike?`<div class="strike">Strike ${v.strikes} of 2. It fades after a season; a second one makes Sack a real option in June.</div>`:'<div class="nostrike">No strike. This summer counts in his favour.</div>'}
   <button class="btn" data-act="sumNext">Start the season</button>`;
}
const WORK_KINDS=['buy','sale','keySale','renew','leave','pass','loanIn','loanOut','promote','window','refused'];
function staffBody(){
  const cf=S.cf,tdp=P(cf.tdId),td=tdOf(cf.tdId),ph=TD_PHIL[td.phil],coach=P(cast('coach')),fin=P(cast('finance'));
  const needs=cfNeeds().filter(g=>g.kind!=='contract').slice(0,3).map(g=>g.text),w=S.week||0;
  const contracts=cf.squad.filter(p=>p.contract===1&&!p.loanIn&&!p.loan).map(p=>`<li class="sv"><span class="sv-v sv-${p.leaving?'wait':p.renewDone?'good':'info'}">${p.leaving?'Leaving':p.renewDone?'Renewed':'Talks'}</span><span><b>${esc(p.name)}</b> <span class="muted">${p.pos}, ${p.age}</span><br>${p.leaving?'Goes in June.':p.renewDone?'Signed on.':w<20?'Talks in the spring (weeks 20-26).':'Talking now.'}</span></li>`).join('');
  const signed=cf.squad.filter(p=>p.signedBy===cf.tdId).map(p=>{const vd=sigVerdict(p);return`<li class="sv">${gradeChip(p.scoutGrade)||`<span class="sv-v sv-plain">S${p.signedS}</span>`}<span><button class="lnk" data-act="player" data-arg="${p.id}">${esc(p.name)}</button> <span class="muted">${p.pos}, ${p.age} · ${p.sApps||0} games${p.sGoals?`, ${p.sGoals} goals`:''}</span></span>${vd?`<span class="chipr ${vd==='Hit'?'good':vd==='Miss'?'bad':vd==='Unlucky'?'warn':'plain'}">${vd}</span>`:''}</li>`}).join('');
  const log=cf.events.filter(e=>e.s===S.season&&WORK_KINDS.includes(e.kind)).slice(-8).reverse().map(e=>`<li class="tk tk-${['buy','renew','promote','loanIn'].includes(e.kind)?'good':['sale','keySale','leave'].includes(e.kind)?'bad':'wait'}"><span class="tk-i" aria-hidden="true">${e.w?e.w:'☀'}</span><span>${esc(e.text)}</span></li>`).join('');
  const win=w<15?`The winter window opens in week 15.`:w<=17?`The winter window is open now.`:`The winter window has closed.`;
  return`<p class="eyebrow">Staff · Week ${w}</p>
   <article class="cand"><div class="cand-top">${personPortrait(cf.tdId,64)}<div><b>${esc(tdp.name)}</b><span class="phil">${esc(ph.t)}</span><span class="meta">Director of football · ${esc(band(tdp.loy))} with you</span></div></div>
    <p class="cand-h">The three-year plan</p><ul class="cand-plan">${ph.plan.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>
   ${S.cf.lastBrief&&S.cf.lastBrief.s===S.season?`<p class="cand-h">This summer's brief · Echo grade ${S.cf.lastBrief.grade}</p><ul class="svl">${S.cf.lastBrief.kpis.map(k=>`<li class="sv"><span class="sv-v sv-${k.met?'good':'bad'}">${k.met?'Done':'Missed'}</span><span>${esc(k.t)}<br><span class="muted">${esc(k.note)}</span></span></li>`).join('')}</ul>`:''}${S.cf.tdStrikes?`<p class="strike">Strike ${S.cf.tdStrikes} of 2 on his record.</p>`:''}
   <p class="cand-h">Working on</p><ul class="svl">${needs.length?needs.map(n=>`<li class="sv">${esc(n)}</li>`).join(''):'<li class="sv">Nothing urgent. The squad is covered.</li>'}<li class="sv muted">${win}</li></ul>
   ${contracts?`<p class="cand-h">Contracts ending this season</p><ul class="svl">${contracts}</ul>`:''}
   <p class="cand-h">${esc(tdp.name.split(' ')[0])}'s signings · scouted as → after half a season</p><ul class="svl">${signed||'<li class="sv">None yet.</li>'}</ul>
   <p class="cand-h">Work log</p><ul class="ticker">${log||'<li class="tk tk-world"><span class="tk-i">·</span><span>A quiet season so far.</span></li>'}</ul>
   <p class="cand-h">The other heads</p>
   ${coach?`<div class="row small"><span>${esc(coach.name)}<br><span class="muted">Head coach · picks the team</span></span><span class="mood">${band(coach.loy)}</span></div>`:''}
   ${fin?`<div class="row small"><span>${esc(fin.name)}<br><span class="muted">Finance · £${Math.round(C().cash)}k in the bank</span></span><span class="mood">${band(fin.loy)}</span></div>`:''}`;
}
function tdHireView(){
  const cards=(S.tdCands||[]).map(pid=>{const p=P(pid),td=tdOf(pid),ph=TD_PHIL[td.phil];
    return`<article class="cand"><div class="cand-top">${personPortrait(pid,64)}<div><b>${esc(p.name)}</b><span class="phil">${esc(ph.t)}</span><span class="meta">${esc(ph.d)}</span></div></div>
    <p class="cand-h">The three-year plan</p><ul class="cand-plan">${ph.plan.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
    <div class="chips">${p.traits.map(t=>`<span class="tag2">${esc(t)}</span>`).join('')}<span class="tag2">Age ${p.age}</span></div>
    ${td.rumour?`<p class="rumour">Word is: "${esc(td.rumour.text)}"</p>`:''}
    <button class="btn" data-act="tdhire" data-arg="${pid}">Hire ${esc(p.name.split(' ')[0])}</button></article>`}).join('');
  return`<p class="eyebrow">The director's office is empty</p><h2>Hire a director of football</h2><p>The director buys and sells; you never pick a player. Choose who you trust.</p><div class="stack">${cards}</div>`;
}
