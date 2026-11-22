/* ================= Screens: signals, major projects, club history and the world archive ================= */
function sigButtons(sg){return`<div class="stack">${sg.map(x=>`<button class="sig lv${x.lv}" data-act="${x.act}"${x.arg!=null?` data-arg="${x.arg}"`:''}><span>${esc(x.text)}</span><span aria-hidden="true">›</span></button>`).join('')}</div>`}
function urgentPanel(){const sg=signals(S.my).filter(x=>x.lv>=3);return sg.length?`<div class="panel urgent"><p class="eyebrow">Needs attention now</p>${sigButtons(sg)}</div>`:''}
function lookPanel(){const sg=signals(S.my).filter(x=>x.lv<3).slice(0,4);return sg.length?`<div class="panel"><p class="eyebrow">Worth a look</p>${sigButtons(sg)}</div>`:''}
function signalsPanel(){
  const sg=signals(S.my).slice(0,5);if(!sg.length)return'';
  return`<div class="panel"><p class="eyebrow">Needs attention</p><div class="stack">${sg.map(x=>`<button class="sig lv${x.lv}" data-act="${x.act}"${x.arg!=null?` data-arg="${x.arg}"`:''}><span>${esc(x.text)}</span><span aria-hidden="true">›</span></button>`).join('')}</div></div>`;
}
function majorProjectsPanel(){
  const id=S.my,g=G(id),sp=stadiumProject(id),price=plotPrice(id);
  const land=g.plots.length<PLOT_MAX?(UI.confirm==='plot'?`<div class="opt on"><b>Buy a plot for £${price}k?</b><div class="seg"><button data-act="buyplot">Buy the land</button><button data-act="confirm" data-arg="">Cancel</button></div></div>`
    :`<button class="opt" data-act="confirm" data-arg="plot"><b>Buy land next to the ground</b><span class="small muted">£${price}k · plot ${g.plots.length+1} of ${PLOT_MAX} for the complex</span></button>`):'<p class="small muted">There is no more land to buy.</p>';
  const stad=sp?`<div class="opt dim"><b>${esc(sp.label)}</b><span class="small">${sp.phase==='permit'?'Waiting for planning permission':`${sp.left} weeks of building left`} · paid ${k1(sp.paid)} of ${k1(sp.cost)}</span></div>`
    :Object.keys(STADIUM_SIZE).map(k=>{const pl=stadiumPlan(id,k);return UI.confirm==='st:'+k?`<div class="opt on"><b>Build a ${esc(pl.label.toLowerCase())}?</b><span class="small">£${pl.deposit}k deposit now, the rest week by week over about ${Math.ceil(pl.weeks/SEASON_WEEKS)} seasons. The old ground is sold when you move.</span>${stadiumImpact(id,pl)}<div class="seg"><button data-act="stadium" data-arg="${k}">Start (£${pl.deposit}k now)</button><button data-act="confirm" data-arg="">Cancel</button></div></div>`
      :`<button class="opt" data-act="confirm" data-arg="st:${k}"><b>${esc(pl.label)}: ${n0(pl.cap)} places</b><span class="small muted">£${pl.cost}k · ${pl.weeks} weeks after the permit · deposit £${pl.deposit}k</span></button>`}).join('');
  return`<div class="panel"><p class="eyebrow">Major projects</p><p class="small muted">Decisions for a decade. Borrow first: the money goes out every week.</p><div class="stack">${land}${stad}</div></div>`;
}
function finChartSVG(hist){
  if(hist.length<2)return'<p class="small muted">The chart fills in after two seasons.</p>';
  const W=300,H=110,vals=hist.map(h=>operatingResult(h.lines)),cash=hist.map(h=>h.cash),mx=Math.max(1,...vals.map(Math.abs),...cash.map(Math.abs)),bw=W/hist.length;
  const y=v=>Math.round(H/2-v/mx*(H/2-6));
  return`<svg class="fcast" viewBox="0 0 ${W} ${H}" role="img" aria-label="Operating result and cash per season"><line x1="0" x2="${W}" y1="${H/2}" y2="${H/2}" class="zero"/>
  ${vals.map((v,i)=>`<rect x="${Math.round(i*bw+bw*.2)}" width="${Math.round(bw*.6)}" y="${Math.min(y(v),H/2)}" height="${Math.max(1,Math.abs(y(v)-H/2))}" class="${v<0?'barneg':'barpos'}"/>`).join('')}
  <polyline class="mid" points="${cash.map((v,i)=>`${Math.round(i*bw+bw/2)},${y(v)}`).join(' ')}"/></svg><p class="note">Bars: operating result per season. Line: cash at the end of each season.</p>`;
}
/* how the club changed: the latest season against the one before, then the seasons in a row */
const DEV_COLS=[['Position',d=>ord(d.pos),d=>-d.pos,1],['Squad strength',d=>Math.round(d.str),d=>d.str,1],['Average age',d=>d.age.toFixed(1),d=>0,0],['Wage bill a week',d=>'£'+n0(d.wages),d=>0,0],
  ['Members',d=>n0(d.members),d=>d.members,1],['Ground capacity',d=>n0(d.cap),d=>d.cap,1],['Reputation',d=>d.rep,d=>d.rep,1],['Cash',d=>k1(d.cash),d=>d.cash,1],['Weeks lost to injury',d=>d.inj,d=>-d.inj,1],['Youth growth',d=>'+'+d.growth.toFixed(1),d=>d.growth,1]];
function devChangePanel(){
  const dv=S.dev||[],a=dv[dv.length-1],b=dv[dv.length-2];if(!a)return'';
  return`<div class="panel"><p class="eyebrow">How the club changed${b?` · season ${a.s} against ${b.s}`:` · season ${a.s}`}</p>${DEV_COLS.map(([n,f,v,judge])=>{const dl=b?v(a)-v(b):0,arrow=b&&Math.abs(dl)>1e-9&&judge?` <span class="${dl>0?'up':'down'}" aria-label="${dl>0?'better':'worse'}">${dl>0?'▲':'▼'}</span>`:'';
    return`<div class="row small"><span>${n}</span><b>${b?`${f(b)} → `:''}${f(a)}${arrow}</b></div>`}).join('')}
  <p class="note">Staffing, budgets and policy show up here over the seasons. Other clubs change too, so read it as a direction, not a verdict.</p></div>`;
}
function devTablePanel(){
  const dv=(S.dev||[]).slice(-6).reverse();if(dv.length<2)return'';
  return`<div class="panel"><p class="eyebrow">Season by season: the club</p><div class="devt" role="table"><div class="devr head" role="row"><span>S</span><span>Pos</span><span>Str</span><span>Age</span><span>Wages</span><span>Members</span></div>${dv.map(d=>`<div class="devr" role="row"><span>${d.s}</span><span>${ord(d.pos)}</span><span>${Math.round(d.str)}</span><span>${d.age.toFixed(1)}</span><span>£${r1(d.wages/1000)}k</span><span>${n0(d.members)}</span></div>`).join('')}</div></div>`;
}
function historySheet(){
  const id=S.my,c=C(),h=c.hist.slice().reverse(),r=S.records[id]||{},hon=honours(id),fh=F(id).hist.filter(x=>c.hist.some(y=>y.s===x.s));
  return overlayShell(`${c.name}: history`,`<div class="panel"><p class="eyebrow">Honours</p>${hon.titles.length?hon.titles.map(t=>`<p class="small"><b>${TIER_NAME[t.tier]} champions</b>, season ${t.s}</p>`).join(''):'<p class="small muted">No titles yet.</p>'}${hon.cups.length?`<p class="small"><b>${CUP_NAME}</b>: ${hon.cups.map(s=>'season '+s).join(', ')}</p>`:''}</div>
  <div class="panel"><p class="eyebrow">Records</p><div class="row small"><span>Biggest win</span><b>${r.bigWin?`${r.bigWin.gf}–${r.bigWin.ga} v ${nm(r.bigWin.opp)} (S${r.bigWin.s})`:'—'}</b></div><div class="row small"><span>Record crowd</span><b>${r.crowd?`${n0(r.crowd.n)} v ${nm(r.crowd.opp)} (S${r.crowd.s})`:'—'}</b></div></div>
  ${devChangePanel()}${devTablePanel()}<div class="panel"><p class="eyebrow">Money over the seasons</p>${finChartSVG(fh.slice(-12))}</div>
  <div class="panel"><p class="eyebrow">Season by season</p>${h.length?h.map(x=>`<div class="row small"><span><b>S${x.s}</b> ${TIER_NAME[x.tier]}, ${ord(x.pos)} · ${x.pts} pts${x.cup?`<br><span class="muted">Cup: ${esc(x.cup)}${x.top?` · top scorer ${esc(x.top.name)} (${x.top.goals})`:''}</span>`:x.top?`<br><span class="muted">Top scorer ${esc(x.top.name)} (${x.top.goals})</span>`:''}</span><b>${x.you?'You':''}</b></div>`).join(''):'<p class="small muted">The first season is under way.</p>'}</div>
  <div class="panel"><p class="eyebrow">Your career</p>${S.career.map(cr=>`<div class="row small"><span>${nm(cr.club)}<br><span class="muted">${cr.why?esc(cr.why):'In office'}</span></span><b>S${cr.from}${cr.to?'–'+cr.to:'–'}</b></div>`).join('')}</div>`);
}
function archiveView(){
  const h=S.hist.slice().reverse();
  return h.length?`<div class="panel"><p class="eyebrow">Roll of honour</p>${h.map(x=>`<div class="row small"><span><b>Season ${x.s}</b><br><span class="muted">${TIERS.map(t=>`${tierShort(t)}: ${esc(CL(x.tables[t][0]).name)}`).join(' · ')}</span></span><b>${x.cup?esc(CL(x.cup).name.split(' ')[0])+' (cup)':''}</b></div>`).join('')}</div>`:'<p class="muted">The first season is under way.</p>';
}
function journalPanel(n){
  const rows=journalRows(n);if(!rows.length)return`<div class="panel"><p class="eyebrow">Your decisions</p><p class="small muted">Decisions you take are noted here with a measure, so you can see later what changed.</p></div>`;
  return`<div class="panel"><div class="row"><p class="eyebrow">Your decisions</p>${n<30?'<button class="tbtn" data-act="journal">All</button>':''}</div>${rows.map(j=>{const m=j.m;let ch='';
    if(m&&j.before!=null){const d=m.v-j.before,good=m.hi==null||Math.abs(d)<1e-6?null:(d>0)===m.hi;ch=`<br><span class="small muted">${esc(m.label)}: ${m.fmt(j.before)} then → <b class="${good===true?'up':good===false?'down':''}">${m.fmt(m.v)}</b> now</span>`}
    return`<p class="small"><span class="num">S${j.s} W${j.w}</span> ${esc(j.text)}${ch}</p>`}).join('')}<p class="note">Other things change too: read the measures as pointers, not proof.</p></div>`;
}
function journalSheet(){return overlayShell('Your decisions',journalPanel(30))}
