/* ================= Screens: the director's assessment, the transfer summer, the staff office ================= */
const SUM_IC={good:'✔',bad:'✖',wait:'…',rumour:'?',world:'·',echo:'✉'};
const KIND_W={depth:['Depth','info'],weak:['Weakness','wait'],leaving:['Leaving','bad']};
const HOW_W={buy:'Signed',free:'Free transfer',loan:'On loan',academy:'From the academy',sold:'Sold',released:'Released','loan out':'Loaned out'};
function sumLine(l,i,anim){return`<li class="tk tk-${l.k}"${anim?` style="animation-delay:${(i*.32).toFixed(2)}s"`:''}><span class="tk-i" aria-hidden="true">${SUM_IC[l.k]||'·'}</span><span>${esc(l.t)}</span></li>`}
function posBadge(pos){return`<span class="pb pb-${pos==='GK'?'gk':['CB','FB'].includes(pos)?'df':['DM','CM','AM'].includes(pos)?'mf':'fw'}">${pos}</span>`}
// in the summer meeting: what the director sees in the squad, and why
function tdAssessment(){
  const s=S.cf&&S.cf.sum;if(!s)return planPanel();const tdp=P(S.cf.tdId);
  const pr=s.prios.map((x,i)=>`<li class="as-p"><span class="prio-n">${i+1}</span><span><b>${esc(x.goal)}</b> <span class="sv-v sv-${KIND_W[x.kind][1]}">${KIND_W[x.kind][0]}</span><br><span class="muted">${esc(x.reason)}</span></span></li>`).join('');
  const V={sell:['Sell','bad'],release:['Release','wait'],loan:['Loan out','info']};
  const go=s.verdicts.filter(v=>v.v!=='keep').map(v=>{const p=playerById(v.pid);return p?`<li class="sv"><span class="sv-v sv-${V[v.v][1]}">${V[v.v][0]}</span><span><b>${esc(p.name)}</b> <span class="muted">${p.pos}, ${p.age}</span><br>"${esc(v.why)}"</span></li>`:''}).join('');
  const ct=s.contracts.map(c=>`<li class="sv"><span class="sv-v sv-${c.plan==='renew'?'good':'wait'}">${c.plan==='renew'?'Renew':'Let go'}</span><span><b>${esc(c.name)}</b> <span class="muted">${c.pos}, ${c.age}</span><br>${esc(c.why)}</span></li>`).join('');
  return`<section class="panel as"><p class="eyebrow">${esc(tdp.name)}'s assessment</p><p class="cand-h">Priorities</p><ul class="svl">${pr||'<li class="sv">No gaps worth chasing.</li>'}</ul>
   ${go?`<p class="cand-h">Who goes</p><ul class="svl">${go}</ul>`:''}${ct?`<p class="cand-h">Contracts ending</p><ul class="svl">${ct}</ul>`:''}</section>`;
}
function inCard(x){const p=playerById(x.pid),story=p&&p.story?`<p class="pc-s">${esc(p.story)}</p>`:'';
  return`<article class="pc">${p?playerPortrait(p,56):''}<div class="pc-b"><b>${esc(x.name)}</b><span class="pc-m">${posBadge(x.pos)} ${x.age} · ${esc(qWord(x.q))}</span>
   <span class="pc-m">${esc(HOW_W[x.how]||x.how)}${x.from&&CL(x.from)?` from ${esc(CL(x.from).name)}`:''}${x.fee?` · £${x.fee}k`:''}${x.how!=='loan'?` · £${x.wage}/wk`:''}</span>${x.goal?`<span class="pc-m">For: ${esc(x.goal.toLowerCase())}</span>`:''}${story}
   ${p?`<button class="rb" data-act="player" data-arg="${p.id}">Profile</button>`:''}</div></article>`}
function outCard(x){return`<article class="pc out"><div class="pc-b"><b>${esc(x.name)}</b><span class="pc-m">${posBadge(x.pos)} ${x.age} · ${esc(qWord(x.q))}${x.goals?` · ${x.goals} goals for us`:''}</span>
   <span class="pc-m">${esc(HOW_W[x.how]||x.how)}${x.to&&CL(x.to)?` to ${esc(CL(x.to).name)}`:''}${x.fee?` · £${x.fee}k`:''}</span></div></article>`}
function tsumView(){
  const s=S.cf.sum,tdp=P(S.cf.tdId),td=tdOf(S.cf.tdId);
  if(s.step==='live'){const anim=!s.skip;let i=0;
    const weeks=s.weeks.map((w,k)=>`<li class="tk-wk"${anim?` style="animation-delay:${(i*.32).toFixed(2)}s"`:''}>Week ${k+1}</li>${w.map(l=>sumLine(l,++i,anim)).join('')}`).join('');
    const dl=`<li class="tk-wk"${anim?` style="animation-delay:${(++i*.32).toFixed(2)}s"`:''}>Deadline day</li>${s.deadline.map(x=>sumLine({k:x.k,t:`${x.time}  ${x.t}`},++i,anim)).join('')}`;
    const b=s.balance,end=anim?` style="animation-delay:${(++i*.32).toFixed(2)}s"`:'';
    return`<p class="eyebrow">The transfer summer · ${esc(tdp.name)} at work</p><h2>The ticker</h2>${anim?'<button class="rb" data-act="sumSkip">Show it all</button>':''}
     <ul class="ticker${anim?' live':''}">${weeks}${dl}</ul>
     <div class="inout${anim?' live':''}"${end}><div><p class="cand-h">In · ${b.ins.length}</p>${b.ins.map(x=>`<p>${posBadge(x.pos)} ${esc(x.name)}</p>`).join('')||'<p class="muted">Nobody</p>'}</div><div><p class="cand-h">Out · ${b.outs.length}</p>${b.outs.map(x=>`<p>${posBadge(x.pos)} ${esc(x.name)}</p>`).join('')||'<p class="muted">Nobody</p>'}</div></div>
     <button class="btn" data-act="sumNext">The summer report</button>`}
  const a=s.analysis,b=s.balance,d=Math.round((a.strA-a.strB)*10)/10,head=d>=.2?'Stronger than in May':d<=-.2?'Weaker than in May':'About as strong as in May';
  const VW={stronger:['Stronger','good'],weaker:['Weaker','bad'],deeper:['Deeper','good'],thinner:['Thinner','bad'],same:['Same','plain']};
  const R=q=>Math.round(qualityToStr(q));
  const rows=a.lines.map(l=>`<li class="an"><div class="an-h"><span class="an-n">${l.name}</span><span class="chipr ${VW[l.verdict][1]}">${VW[l.verdict][0]}</span></div><div class="an-d"><span>Rating <b>${R(l.qb)} → ${R(l.qa)}</b></span><span>Players <b>${l.db} → ${l.da}</b></span><span>Age <b>${l.ageb} → ${l.agea}</b></span></div></li>`).join('');
  const say=[a.gain?`Gained most in ${a.gain.name.toLowerCase()}.`:'',a.loss?`Lost most in ${a.loss.name.toLowerCase()}.`:'',a.thin.length?`Thinner in ${a.thin.map(l=>l.name.toLowerCase()).join(' and ')}.`:''].filter(Boolean).join(' ')||'Little changed on the pitch.';
  const res=b.prios.map(x=>`<li><span class="chipr ${x.res==='fail'?'bad':'good'}">${x.res==='fail'?'✖ Missed':'✔ '+x.res}</span><span>${esc(x.goal)}${x.name?`: <b>${esc(x.name)}</b>`:''}</span></li>`).join('');
  return`<p class="eyebrow">The summer report · ${esc(TD_PHIL[td.phil].t)}</p><h2>${head}</h2><p>${esc(say)}</p>
   <div class="chips"><span class="chipr ${d>0?'good':d<0?'bad':''}">Team rating ${R(a.strB)} → ${R(a.strA)}</span><span class="chipr">Age ${a.ageB} → ${a.ageA}</span><span class="chipr bad">Spent £${b.spent}k</span><span class="chipr good">Received £${b.got}k</span><span class="chipr ${b.wages>0?'bad':'good'}">Wages ${b.wages>0?'+':'−'}£${Math.abs(b.wages)}/wk</span></div>
   <p class="cand-h">Line by line · rating of the best eleven</p><ul class="anl">${rows}</ul>
   <p class="cand-h">The director's priorities</p><ul class="balr">${res}</ul>
   <p class="cand-h">Arrivals · ${b.ins.length}</p><div class="stack">${b.ins.map(inCard).join('')||'<p class="muted">Nobody came in.</p>'}</div>
   <p class="cand-h">Departures · ${b.outs.length}</p><div class="stack">${b.outs.map(outCard).join('')||'<p class="muted">Nobody left.</p>'}</div>
   <button class="btn" data-act="sumNext">Start the season</button>`;
}
// the staff office during the season: what the director is doing
const WORK_KINDS=['buy','sale','keySale','renew','leave','pass','loanIn','loanOut','promote','window','refused'];
function staffBody(){
  const cf=S.cf,tdp=P(cf.tdId),td=tdOf(cf.tdId),ph=TD_PHIL[td.phil],coach=P(cast('coach')),fin=P(cast('finance'));
  const needs=cfNeeds().filter(g=>g.kind!=='contract').slice(0,3).map(g=>g.text),w=S.week||0;
  const contracts=cf.squad.filter(p=>p.contract===1&&!p.loanIn&&!p.loan).map(p=>`<li class="sv"><span class="sv-v sv-${p.leaving?'wait':p.renewDone?'good':'info'}">${p.leaving?'Leaving':p.renewDone?'Renewed':'Talks'}</span><span><b>${esc(p.name)}</b> <span class="muted">${p.pos}, ${p.age}</span><br>${p.leaving?'Goes in June.':p.renewDone?'Signed on.':w<20?'Talks in the spring (weeks 20-26).':'Talking now.'}</span></li>`).join('');
  const signed=cf.squad.filter(p=>p.signedBy===cf.tdId).map(p=>`<li class="sv"><span class="sv-v sv-plain">${p.signedS===S.season?'New':'S'+p.signedS}</span><span><button class="lnk" data-act="player" data-arg="${p.id}">${esc(p.name)}</button> <span class="muted">${p.pos}, ${p.age} · ${p.sApps||0} games${p.sGoals?`, ${p.sGoals} goals`:''}</span></span></li>`).join('');
  const log=cf.events.filter(e=>e.s===S.season&&WORK_KINDS.includes(e.kind)).slice(-8).reverse().map(e=>`<li class="tk tk-${['buy','renew','promote','loanIn'].includes(e.kind)?'good':['sale','keySale','leave'].includes(e.kind)?'bad':'wait'}"><span class="tk-i" aria-hidden="true">${e.w?e.w:'☀'}</span><span>${esc(e.text)}</span></li>`).join('');
  const win=w<15?`The winter window opens in week 15.`:w<=17?`The winter window is open now.`:`The winter window has closed.`;
  return`<p class="eyebrow">Staff · Week ${w}</p>
   <article class="cand"><div class="cand-top">${personPortrait(cf.tdId,64)}<div><b>${esc(tdp.name)}</b><span class="phil">${esc(ph.t)}</span><span class="meta">Director of football · ${esc(band(tdp.loy))} with you</span></div></div>
    <p class="cand-h">The three-year plan</p><ul class="cand-plan">${ph.plan.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>
   <p class="cand-h">Working on</p><ul class="svl">${needs.length?needs.map(n=>`<li class="sv">${esc(n)}</li>`).join(''):'<li class="sv">Nothing urgent. The squad is covered.</li>'}<li class="sv muted">${win}</li></ul>
   ${contracts?`<p class="cand-h">Contracts ending this season</p><ul class="svl">${contracts}</ul>`:''}
   <p class="cand-h">${esc(tdp.name.split(' ')[0])}'s signings</p><ul class="svl">${signed||'<li class="sv">None yet.</li>'}</ul>
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
