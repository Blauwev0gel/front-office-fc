/* ================= Screens: the club (ground, money, comparison, history), overlays and the season review =================
   Ground and money overlays are adapted from voorzitter-fundering ui/system.js; every change goes through cmd(). */
function condBar(c){const v=Math.round(c);return`<span class="cbar ${v<30?'lo':v<60?'mid':''}" role="img" aria-label="condition ${v}%"><i style="width:${v}%"></i></span><span class="small muted cnum">${v}%</span>`}
function hubCards(){
  const id=S.my,g=G(id),sg=groundSignals(id),w=groundCondWorst(id),run=g.projects.filter(p=>p.phase!=='done'),f=F(id),fc=cashForecast(id),h=finHealth(id);
  return`<div class="hub">
  <button class="hubc" data-act="ov" data-arg="ground"><span class="eyebrow">Ground</span><b>${n0(sg.capacity)} places</b><span class="small ${w.c<40?'down':'muted'}">${w.c<40?'⚠ ':''}${esc(w.n)} ${Math.round(w.c)}%</span><span class="small muted">${run.length?`${run.length} project${run.length>1?'s':''} running`:'No building work'}</span></button>
  <button class="hubc" data-act="ov" data-arg="money"><span class="eyebrow">Money</span><b class="${f.cash<0?'down':''}">${k1(f.cash)}</b><span class="small ${f.last&&f.last.net<0?'down':'up'}">${f.last?'Last week '+k1(f.last.net):'No weeks played'}</span><span class="small ${h==='healthy'?'muted':'down'}">${h==='healthy'?'Healthy':h==='tight'?'Tight':'In the red'} · low ${k1(fc.minV)}</span></button></div>`;
}
function gTabs(cur,list,act){return`<div class="tabs" role="tablist">${list.map(([k,n])=>`<button class="${cur===k?'on':''}" data-act="${act}" data-arg="${k}" aria-pressed="${cur===k}">${n}</button>`).join('')}</div>`}
function msgLine(){return UI.msg?`<p class="${UI.msg.err?'err':'small up'}" role="status">${esc(UI.msg.text)}</p>`:''}
function overlayShell(title,body){return`<div class="overlay" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="inner"><div class="row"><h2>${esc(title)}</h2><button class="tbtn" data-act="ov">Close</button></div>${msgLine()}${body}</div></div>`}
function overlayView(){
  if(UI.over==='ground')return groundOverlay();if(UI.over==='money')return moneyOverlay();
  if(UI.over==='club')return clubSheet(UI.arg);if(UI.over==='player')return playerSheet(UI.arg);return'';
}

/* ----- the ground ----- */
function groundOverlay(){
  const id=S.my,g=G(id),sg=groundSignals(id),t=UI.gt,gate=F(id).lastGate;let body='';
  if(t==='stadium'){
    body=`<div class="panel"><div class="row"><span>Licensed capacity</span><b>${n0(sg.capacity)}</b></div>${sg.limitedBy?`<p class="small down">Limited by ${sg.limitedBy==='access'?'the turnstiles':'safety'}: the stands hold more.</p>`:''}${gate?`<p class="small muted">Last home game: ${n0(gate.total)} (${n0(gate.terrace)} standing, ${n0(gate.seated)} seated, ${gate.business} business).</p>`:''}
    <div class="row small"><span>Atmosphere (home edge)</span><b>${sg.atmosphere}</b></div><div class="row small"><span>Comfort</span><b>${sg.comfort}</b></div></div>
    <div class="panel"><p class="eyebrow">The four sides</p>${Object.entries(g.sides).map(([k,s])=>`<div class="grow"><span><b>${SIDE_NAME[k]}</b><br><span class="small muted">${s.type==='terrace'?'Terrace':'Seated'} · ${s.rings} ring${s.rings>1?'s':''} · ${n0(s.rings*RING[s.type])} · ${['no roof','part roof','full roof'][s.roof]}${building(id,'side:'+k)?' · building':''}</span></span>${condBar(s.cond)}</div>`).join('')}</div>
    <div class="panel"><p class="eyebrow">The pitch</p><div class="grow"><span><b>${LV_NAME[g.pitch.lv]} grass</b><br><span class="small muted">Drainage ${LV_NAME[g.pitch.drain]}</span></span>${condBar(g.pitch.cond)}</div></div>
    <div class="panel"><p class="eyebrow">Facilities</p>${Object.entries(g.fac).map(([k,f])=>`<div class="grow"><span><b>${FAC[k].n}</b><br><span class="small muted">${LV_NAME[f.lv]} · ${FAC[k].sig}</span></span>${condBar(f.cond)}</div>`).join('')}</div>`}
  if(t==='complex')body=`<p class="small muted">Six plots. You can never build everything: what stands here decides what kind of club you are.</p><div class="panel">${g.plots.map((p,i)=>p.kind?`<div class="grow"><span><b>${i+1}. ${COMPLEX[p.kind].n}</b><br><span class="small muted">${LV_NAME[p.lv]} · ${COMPLEX[p.kind].sig}</span></span>${condBar(p.cond)}</div>`:`<div class="grow"><span><b>${i+1}. Empty plot</b><br><span class="small muted">${building(id,'plot:'+i)?'Building work under way':'Free to build on'}</span></span></div>`).join('')}</div>
    <div class="panel"><p class="eyebrow">What the complex does on the pitch</p>${[['Training level','Young players grow faster, old ones fade slower',sg.training],['Medical level','Fewer and shorter injuries',sg.medical],['Academy level','How many graduates, and how good',sg.academy],['Scouting reach','How many players the director sees',sg.scouting],['Shop and events','Merchandise and hire income',sg.shop],['Community','Dues, and support that grows',sg.community]].map(([n,d,v])=>`<div class="row small"><span>${n}<br><span class="muted">${d}</span></span><b>${v}</b></div>`).join('')}</div>`;
  if(t==='depts')body=`<p class="small muted">The budget pays staff and upkeep and decides how fast things recover. A new course takes a season to settle.</p>${Object.entries(g.depts).map(([k,d])=>`<div class="panel"><div class="row"><b>${DEPT[k].n}</b><span class="small muted">£${Math.round(DEPT_COST[C().tier]*BUDGET_F[d.budget]*1000)}/wk</span></div>
    <div class="seg">${Object.keys(BUDGET_F).map(b=>`<button class="${d.budget===b?'on':''}" data-act="gdept" data-arg="${k}:${b}" aria-pressed="${d.budget===b}">${b[0].toUpperCase()+b.slice(1)}</button>`).join('')}</div>
    <div class="seg">${DEPT[k].courses.map(c=>`<button class="${(d.pending||d.course)===c?'on':''}" data-act="gcourse" data-arg="${k}:${c}" aria-pressed="${(d.pending||d.course)===c}">${c[0].toUpperCase()+c.slice(1)}</button>`).join('')}</div>${d.pending?`<p class="small muted">Switching to ${d.pending}: ${d.settle} weeks to settle.</p>`:''}</div>`).join('')}<p class="small muted">All departments: £${n0(deptCost(id)*1000)} a week.</p>`;
  if(t==='build'){const cat=projectCatalog(id),run=g.projects.filter(p=>p.phase!=='done'),groups=[...new Set(cat.map(o=>o.group))];
    body=`${run.length?`<div class="panel"><p class="eyebrow">Under way</p>${run.map(p=>`<div class="row small"><span><b>${esc(p.label)}</b><br><span class="muted">${p.phase==='permit'?'Waiting for the permit':`${p.left} weeks left`} · £${p.cost}k${p.over?` (+${p.over}%)`:''} · paid ${k1(p.paid)}</span></span></div>`).join('')}</div>`:''}
    <p class="small muted">Building is paid week by week. The cash forecast in Money shows what it does to the bank.</p>
    ${groups.map(gr=>`<div class="panel"><p class="eyebrow">${esc(gr)}</p><div class="stack">${cat.filter(o=>o.group===gr).map(o=>o.busy?`<div class="opt dim"><b>${esc(o.label)}</b><span class="small muted">Work under way here</span></div>`:UI.gsel===o.key?`<div class="opt on"><b>${esc(o.label)}</b><span class="small">${esc(o.effect)} · ${o.weeks} weeks${o.permit?' + permit':''}</span><div class="offers">${Object.entries(OFFER).map(([ok,of])=>`<button class="offer" data-act="gbuild" data-arg="${o.key}|${ok}"><b>£${Math.round(o.cost*of.p)}k</b><span>${of.n}</span><span class="muted">${Math.round(of.over*100)}% overrun risk</span></button>`).join('')}</div><button class="tbtn" data-act="gsel" data-arg="">Cancel</button></div>`:`<button class="opt" data-act="gsel" data-arg="${o.key}"><b>${esc(o.label)}</b><span class="small muted">£${o.cost}k · ${esc(o.effect)}</span></button>`).join('')}</div></div>`).join('')}`}
  if(t==='repairs'){const rl=repairList(id);body=rl.length?`<p class="small muted">Below 30% a safety inspection can close half a stand.</p><div class="panel">${rl.map(r=>`<div class="grow"><span><b>${esc(r.label)}</b><br>${condBar(r.cond)}</span><span></span><button class="tbtn" data-act="grepair" data-arg="${r.key}">Repair £${r.cost}k</button></div>`).join('')}</div>`:'<p class="muted">Everything is in good shape.</p>'}
  const log=eventsFor(id,{types:['Ground','ProjectStarted','ProjectCompleted','SafetyClosure']}).slice(-5).reverse();
  return overlayShell(CL(id).ground||'The ground',`${gTabs(t,[['stadium','Stadium'],['complex','Complex'],['depts','Departments'],['build','Build'],['repairs','Repairs']],'gtab')}${body}${log.length?`<div class="panel"><p class="eyebrow">Ground log</p><ul class="log">${log.map(l=>`<li><span class="num">S${l.s} W${l.w}</span> ${esc(l.text)}</li>`).join('')}</ul></div>`:''}`);
}

/* ----- money ----- */
function forecastSVG(fc){
  const all=[...fc.low,...fc.high,0],mn=Math.min(...all),mx=Math.max(...all),W=300,H=90,x=i=>Math.round(i/(fc.mid.length-1)*W),y=v=>Math.round(H-4-(v-mn)/(mx-mn||1)*(H-8));
  const band=fc.high.map((v,i)=>`${x(i)},${y(v)}`).join(' ')+' '+fc.low.map((v,i)=>`${x(i)},${y(v)}`).reverse().join(' ');
  return`<svg class="fcast" viewBox="0 0 ${W} ${H}" role="img" aria-label="Cash forecast: lowest £${fc.minV}k in ${fc.minW} weeks"><polygon points="${band}" class="band"/><line x1="0" x2="${W}" y1="${y(0)}" y2="${y(0)}" class="zero"/><polyline points="${fc.mid.map((v,i)=>`${x(i)},${y(v)}`).join(' ')}" class="mid"/></svg>`;
}
function linesTable(L){return Object.keys(LINE).filter(k=>L[k]).map(k=>`<div class="row small"><span>${LINE[k][0]}</span><b class="${L[k]<0?'down':''}">${k1(L[k])}</b></div>`).join('')||'<p class="small muted">Nothing yet.</p>'}
function moneyOverlay(){
  const id=S.my,f=F(id),t=UI.mt,fc=cashForecast(id),sl=seasonTotals(id),h=finHealth(id);let body='';
  if(t==='overview'){const heads=Object.keys(HEAD).map(k=>[k,sl.head[k]||0]).filter(x=>x[1]),mx=Math.max(1,...heads.map(x=>Math.abs(x[1])));
    body=`<div class="panel"><div class="row"><span>In the bank</span><b class="${f.cash<0?'down':''}">${k1(f.cash)}</b></div><div class="row small"><span>Debt</span><b>${k1(debt(id))}</b></div><div class="row small"><span>Overdraft limit</span><b>${k1(-creditLimit(id))}</b></div><div class="row small"><span>Health</span><b class="${h==='healthy'?'up':'down'}">${h==='healthy'?'Healthy':h==='tight'?'Tight':'In the red'}</b></div></div>
    <div class="panel"><p class="eyebrow">Next 26 weeks</p>${forecastSVG(fc)}<p class="small ${fc.minV<0?'down':'muted'}">${fc.minV>=f.cash-1?'No dip ahead on current form.':`Lowest point: ${k1(fc.minV)} in ${fc.minW} week${fc.minW>1?'s':''}.`} The band shows bad and good results.</p></div>
    <div class="panel"><p class="eyebrow">Season ${S.season} so far</p>${heads.map(([k,v])=>`<div class="hline"><span>${HEAD[k]}</span><span class="hbar"><i class="${v<0?'neg':''}" style="width:${Math.round(Math.abs(v)/mx*100)}%"></i></span><b class="${v<0?'down':''}">${k1(v)}</b></div>`).join('')||'<p class="small muted">No weeks played yet.</p>'}<div class="row small"><span>Operating result</span><b class="${operatingResult(sl.lines)<0?'down':'up'}">${k1(operatingResult(sl.lines))}</b></div></div>
    <p class="small muted">Over 3 weeks above the overdraft limit means administration: six points and a rescue loan.</p>`}
  if(t==='ledger')body=`<div class="panel"><p class="eyebrow">Last week</p>${f.last?linesTable(f.last.lines)+`<div class="row"><span>Net</span><b class="${f.last.net<0?'down':'up'}">${k1(f.last.net)}</b></div>`:'<p class="small muted">No week played yet.</p>'}</div><div class="panel"><p class="eyebrow">Season ${S.season} so far</p>${linesTable(sl.lines)}</div>
    ${f.hist.slice(-3).reverse().map(hh=>`<div class="panel"><div class="row"><b>Season ${hh.s}</b><span class="small muted">${TIER_NAME[hh.tier]}, ${ord(hh.pos)}</span></div><div class="row small"><span>Operating result</span><b class="${operatingResult(hh.lines)<0?'down':''}">${k1(operatingResult(hh.lines))}</b></div><div class="row small"><span>Cash at the end</span><b>${k1(hh.cash)}</b></div></div>`).join('')}`;
  if(t==='prices'){const pr=f.prices,gate=f.lastGate,ref=PRICE_DEF[C().tier];const st=(k,n,note)=>`<div class="grow"><span><b>${n}</b><br><span class="small muted">${note} · usual £${ref[k]}</span></span><span></span><span class="stepper"><button data-act="price" data-arg="${k}:-1" aria-label="Lower ${n}">−</button><b>£${pr[k]}</b><button data-act="price" data-arg="${k}:1" aria-label="Raise ${n}">+</button></span></div>`;
    const a=attendance(id,null,{});
    body=`<p class="small muted">Families walk away first when prices rise; the terrace comes anyway; business pays for comfort.</p><div class="panel">${st('terrace','Terrace ticket','Price-tolerant')}${st('seated','Seat ticket','Price-sensitive')}${st('business','Business seat','Pays for comfort')}${st('season','Season ticket','Sold in week 1')}</div>
    <div class="panel"><div class="row small"><span>Expected crowd at these prices</span><b>${n0(a.total)} of ${n0(a.cap)}</b></div>${gate?`<div class="row small"><span>Last home game</span><b>${n0(gate.total)}</b></div>`:''}<div class="row small"><span>Expected gate per home game</span><b>${k1((a.terrace*pr.terrace+a.seated*pr.seated)/1000)}</b></div></div>`}
  if(t==='loans'){const max=maxNewLoan(id);
    body=`<div class="panel"><p class="eyebrow">Loans</p>${f.loans.length?f.loans.map((l,i)=>`<div class="grow"><span><b>${esc(l.label)}</b><br><span class="small muted">${k1(l.left)} left · ${Math.round(l.rate*1000)/10}% · ${k1(l.pay)} a week</span></span><span></span>${f.cash>=l.left?`<button class="tbtn" data-act="repay" data-arg="${i}">Repay</button>`:''}</div>`).join(''):'<p class="small muted">No loans.</p>'}</div>
    <div class="panel"><p class="eyebrow">Borrow</p><p class="small muted">The bank lends up to 80% of a season's income in total. The more you owe, the higher the rate.</p>
    <div class="seg">${[3,5,10].map(y=>`<button class="${UI.ly===y?'on':''}" data-act="ly" data-arg="${y}" aria-pressed="${UI.ly===y}">${y} years</button>`).join('')}</div>
    <div class="seg">${[25,50,100,200].filter(a=>a<=max).map(a=>`<button data-act="loan" data-arg="${a}">£${a}k at ${Math.round(loanRate(id,a)*1000)/10}%</button>`).join('')||'<p class="small down">The bank will not lend more.</p>'}</div><p class="note">Room to borrow: ${k1(max)}.</p></div>`}
  return overlayShell('Money',`${gTabs(t,[['overview','Overview'],['ledger','Ledger'],['prices','Prices'],['loans','Loans']],'mtab')}${body}`);
}

/* ----- the club tab: compare, history, layers ----- */
function clubView(){
  const id=S.my,c=C(),t=c.tier,ids=tierIds(t),avg=fn=>ids.reduce((a,i)=>a+fn(i),0)/ids.length,sg=groundSignals(id);
  const rows=[['Support',i=>CL(i).support,n0],['Capacity',i=>groundSignals(i).capacity,n0],['Squad strength',i=>teamStrength(i),v=>Math.round(v)],['Wage bill /wk',i=>wageBillK(i)*1000,v=>'£'+n0(v)],['Training level',i=>groundSignals(i).training,r1],['Academy level',i=>groundSignals(i).academy,r1]];
  const hist=c.hist.slice(-8).reverse();
  return`${hubCards()}
  <div class="panel"><p class="eyebrow">Against the ${TIER_NAME[t]}</p><div class="cmp"><span></span><b>Us</b><b>Average</b>${rows.map(([n,fn,fm])=>`<span>${n}</span><b>${fm(fn(id))}</b><b>${fm(avg(fn))}</b>`).join('')}</div></div>
  <div class="panel"><p class="eyebrow">${esc(c.name)}</p><p class="small muted">Founded ${c.founded}. Ground: ${esc(c.ground)}. Rivals: ${nm(c.rival)} (${esc(c.rivalWhy)}). The club once ${esc(c.scar)}.</p>
  ${hist.length?hist.map(h=>`<div class="row small"><span>Season ${h.s}</span><b>${TIER_NAME[h.tier]}, ${ord(h.pos)}</b></div>`).join(''):'<p class="small muted">Your first season.</p>'}</div>
  <div class="panel"><p class="eyebrow">Game layers</p><div class="row small"><span>1 · The living world</span><b class="up">On</b></div><div class="row small"><span>2 · Club management</span><b class="up">On</b></div><div class="row small"><span>3 · Staff with their own minds</span><b class="muted">Later</b></div><div class="row small"><span>4 · Stories, members and politics</span><b class="muted">Later</b></div><div class="row small"><span>5 · Dynasty</span><b class="muted">Later</b></div>
  <p class="note">The original Northmarch story game stays playable as its own file.</p></div>
  <button class="btn ghost" data-act="quit">Save and back to the title</button>`;
}
function clubSheet(id){
  const c=CL(id),sg=groundSignals(id),sq=S.squads[id].slice().sort((a,b)=>b.q-a.q),r=S.tbl[id],ev=eventsFor(id).filter(e=>e.t!=='Match'&&e.t!=='Command').slice(-5).reverse();
  return overlayShell(c.name,`<div class="panel"><div class="row"><span>${TIER_NAME[c.tier]}</span><b>${ord(posOf(id))} · ${r.pts} pts</b></div><div class="row small"><span>Form</span><b>${r.form.join('')||'—'}</b></div><div class="row small"><span>Squad</span><b>${Math.round(teamStrength(id))} · ${strWord(id)}</b></div>
  <div class="row small"><span>Support · capacity</span><b>${n0(c.support)} · ${n0(sg.capacity)}</b></div><div class="row small"><span>Money (from the papers)</span><b>${moneyWord(id)}</b></div><div class="row small"><span>Training · academy</span><b>${sg.training} · ${sg.academy}</b></div></div>
  <div class="panel"><p class="eyebrow">Best players</p>${sq.slice(0,4).map(p=>`<div class="row small"><span>${esc(p.name)} <span class="muted">${p.pos}, ${p.age}</span></span>${qbar(p.q)}</div>`).join('')}</div>
  ${ev.length?`<div class="panel"><p class="eyebrow">Lately</p><ul class="log">${ev.map(e=>`<li><span class="num">S${e.s} W${e.w}</span> ${esc(e.text)}</li>`).join('')}</ul></div>`:''}
  <p class="small muted">Rivals: ${nm(c.rival)}. Founded ${c.founded}.</p>`);
}
function playerSheet(pid){
  const p=S.squads[S.my].find(x=>x.id===pid);if(!p)return overlayShell('Player','<p class="muted">No longer at the club.</p>');
  const cost=releaseCost(p);
  return overlayShell(p.name,`<div class="panel"><div class="row"><span>${POS_ONE[p.pos]}, ${p.age}</span>${qbar(p.q)}</div><div class="row small"><span>Level</span><b>${qWord(p.q-(S.qref-11.7))}</b></div><div class="row small"><span>Outlook</span><b>${potWord(p)}</b></div>
  <div class="row small"><span>This season</span><b>${p.sApps} apps · ${p.sGoals} goals${Math.abs(p.grown)>=.05?` · ${p.grown>0?'+':''}${r1(p.grown)} quality`:''}</b></div><div class="row small"><span>Contract</span><b>${p.contract} yr${p.contract===1?'':'s'} · £${p.wage} a week</b></div><div class="row small"><span>Market value</span><b>${k1(playerValue(p))}</b></div>${p.inj?`<p class="inj">Injured: out for ${p.inj} week${p.inj>1?'s':''}.</p>`:''}<p class="small muted">${p.trait}${p.academy?' · academy graduate':''}</p></div>
  ${p.career.length?`<div class="panel"><p class="eyebrow">Career</p>${p.career.slice(-4).map(x=>`<p class="small">${esc(x)}</p>`).join('')}</div>`:''}
  ${UI.confirm===pid?`<div class="panel"><p>Release ${esc(p.name)}? It costs ${k1(cost)} in compensation.</p><button class="btn" data-act="release" data-arg="${pid}">Release him</button><button class="btn ghost" data-act="confirm" data-arg="">Keep him</button></div>`:`<button class="btn ghost" data-act="confirm" data-arg="${pid}">Release (${k1(cost)})</button>`}`);
}

/* ----- the season review ----- */
function reviewView(){
  const h=UI.review,s=h.s,id=S.my,last=CL(id).hist[CL(id).hist.length-1],mv=h.moves.find(m=>m.id===id),fh=F(id).hist[F(id).hist.length-1];
  const sev=UI.summerEv||[],ins=sev.filter(e=>(e.t==='Transfer'||e.t==='Signing')&&e.c===id),outs=sev.filter(e=>e.t==='Transfer'&&e.c2===id);
  const kids=sev.filter(e=>e.t==='YouthIntake'&&e.c===id).pop();
  return`<main class="scene" style="padding-top:28px"><p class="eyebrow">Season ${s} · the verdict</p><h1>${ord(last.pos)}</h1>
  <p class="voice">${mv?(mv.to<mv.from?`Promoted to ${TIER_NAME[mv.to]}.`:`Relegated to ${TIER_NAME[mv.to]}.`):`Another season in ${TIER_NAME[last.tier]}.`}${h.cup===id?' And the cup is ours.':''}</p>
  <div class="panel"><div class="row small"><span>Points</span><b>${last.pts}</b></div><div class="row small"><span>Operating result</span><b class="${operatingResult(fh.lines)<0?'down':'up'}">${k1(operatingResult(fh.lines))}</b></div><div class="row small"><span>Cash</span><b>${k1(F(id).cash)}</b></div><div class="row small"><span>Cup winners</span><b>${nm(h.cup)}</b></div></div>
  <div class="panel"><p class="eyebrow">Around the Northmarch</p>${TIERS.map(t=>`<div class="row small"><span>${TIER_NAME[t]} champions</span><b>${nm(h.tables[t][0])}</b></div>`).join('')}${h.moves.filter(m=>m.to<m.from).map(m=>`<p class="small up">${nm(m.id)} go up to ${TIER_NAME[m.to]}.</p>`).join('')}</div>
  <div class="panel"><p class="eyebrow">The summer</p>${kids?`<p class="small">${esc(kids.text)}</p>`:''}${ins.map(e=>`<p class="small">In: ${esc(e.text)}</p>`).join('')}${outs.map(e=>`<p class="small">Out: ${esc(e.text)}</p>`).join('')}${!ins.length&&!outs.length?'<p class="small muted">A quiet window.</p>':''}</div>
  <button class="btn" data-act="startnext">Start season ${S.season}</button></main>`;
}
