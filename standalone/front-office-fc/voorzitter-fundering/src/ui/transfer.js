/* ================= Screens of the transfer summer and hiring the director ================= */
const SUM_IC={good:'✔',bad:'✖',wait:'…',rumour:'?',world:'·',echo:'✉'};
function sumLine(l){return`<li class="tk tk-${l.k}"><span class="tk-i" aria-hidden="true">${SUM_IC[l.k]||'·'}</span><span>${esc(l.t)}</span></li>`}
function tsumView(){
  const s=S.cf.sum,tdp=P(S.cf.tdId),td=tdOf(S.cf.tdId),c=C(),money=`<p class="sum-money">Budget <b>£${S.cf.budgetLeft}k</b> · Wage cap £${S.cf.frames.cap}/wk</p>`;
  if(s.step==='review'){const V={sell:['Sell','bad'],release:['Release','wait'],loan:['Loan out','info'],keep:['Keep','good']};
    const rows=s.verdicts.map(v=>{const p=playerById(v.pid);if(!p)return'';return`<li class="sv"><span class="sv-v sv-${V[v.v][1]}">${V[v.v][0]}</span><span><b>${esc(p.name)}</b> <span class="muted">${p.pos}, ${p.age}</span><br>"${esc(v.why)}"</span></li>`}).join('');
    return`<p class="eyebrow">The summer · ${esc(tdp.name)} · ${esc(TD_PHIL[td.phil].t)}</p><h2>The squad review</h2><p>Your director decides who stays and who goes. You read it.</p><ul class="svl">${rows||'<li class="sv">Everyone stays.</li>'}</ul><button class="btn" data-act="sumNext">To the plan</button>`}
  if(s.step==='plan'){const list=s.prios.slice().sort((a,b)=>a.order-b.order),n=list.length;
    const cards=list.map((x,i)=>{const T=x.targets.map((t,j)=>`<li><span class="tgt">${'ABC'[j]}</span><span><b>${esc(t.name)}</b> <span class="muted">${t.kind==='buy'?`${t.age} · £${t.price}k · £${t.wage}/wk`:t.kind==='free'?`${t.age} · free · £${t.wage}/wk`:t.kind==='academy'?`${t.age} · academy`:'loan'}</span></span></li>`).join('');
      return`<article class="prio"><div class="prio-h"><span class="prio-n">${i+1}</span><b>${esc(x.goal)}</b><span class="prio-mv"><button class="mv" data-act="sumUp" data-arg="${x.id}" aria-label="Move up"${i===0?' disabled':''}>▲</button><button class="mv" data-act="sumDown" data-arg="${x.id}" aria-label="Move down"${i===n-1?' disabled':''}>▼</button></span></div><ul class="tgts">${T}</ul></article>`}).join('');
    const sumA=list.reduce((a,x)=>a+(x.targets[0]&&x.targets[0].kind==='buy'?x.targets[0].price:0),0);
    return`<p class="eyebrow">The summer plan</p><h2>${esc(tdp.name.split(' ')[0])}'s priorities</h2><p>Put them in order. The money goes down your list; what sits at the bottom may become a B or a C.</p>${money}<p class="muted">The A-targets cost £${sumA}k together. Sales should bring in about £${Math.max(0,s.pool-s.startBudget)}k for the budget.</p><div class="stack">${cards}</div><button class="btn" data-act="sumNext">Open the window</button>`}
  if(s.step==='week'){const lines=s.weeks[s.week-1]||[],t=s.talk;
    const talk=t?`<div class="talk"><p class="talk-h">✉ In the post</p><p>${esc(t.text)}</p>${t.answered?`<p class="muted">You answered: ${esc(talkOptions(t).find(o=>o.k===t.answered).t)}.</p>`:`<div class="stack">${talkOptions(t).map(o=>`<button class="choice" data-act="talk" data-arg="${o.k}"><b>${esc(o.t)}</b><span class="meta">${esc(o.d)}</span></button>`).join('')}</div>`}</div>`:'';
    return`<p class="eyebrow">Transfer week ${s.week} of ${SUM_WEEKS}</p><h2>The ticker</h2>${money}<ul class="ticker">${lines.map(sumLine).join('')}</ul>${talk}<button class="btn" data-act="sumNext">${s.week<SUM_WEEKS?'Next week':'Deadline day'}</button>`}
  if(s.step==='deadline')return`<p class="eyebrow">Deadline day</p><h2>The last hours</h2>${money}<ol class="tl2">${s.deadline.map(x=>`<li class="tk-${x.k}"><span class="tl-t">${x.time}</span><span>${esc(x.t)}</span></li>`).join('')}</ol><button class="btn" data-act="sumNext">The summer balance</button>`;
  const b=s.balance,res=b.prios.map(x=>`<li><span class="chipr ${x.res==='fail'?'bad':'good'}">${x.res==='fail'?'✖ Missed':'✔ '+x.res}</span><span>${esc(x.goal)}${x.name?`: <b>${esc(x.name)}</b>`:''}</span></li>`).join('');
  return`<p class="eyebrow">The summer balance</p><h2>${b.prios.filter(x=>x.res!=='fail').length} of ${b.prios.length} done</h2>
   <div class="bal"><div><p class="cand-h">In</p><p>${b.ins.length?b.ins.map(esc).join('<br>'):'Nobody'}</p></div><div><p class="cand-h">Out</p><p>${b.outs.length?b.outs.map(esc).join('<br>'):'Nobody'}</p></div></div>
   <ul class="balr">${res}</ul><div class="chips"><span class="chipr bad">Spent £${b.spent}k</span><span class="chipr good">Received £${b.got}k</span><span class="chipr ${b.wages>0?'bad':'good'}">Wages ${b.wages>0?'+':'−'}£${Math.abs(b.wages)}/wk</span><span class="chipr">£${b.left}k left</span></div>
   <button class="btn" data-act="sumNext">Start the season</button>`;
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
