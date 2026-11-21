/* ================= Screens: the season budget, sponsors and funding (Money tab) ================= */
function budgetBody(){
  const id=S.my,f=F(id),b=f.budget,rows=budgetRows(id),warn=budgetWarnings(id),inc=estSeasonIncome(id),cap=wageCapK(id);
  return`${warn.map(w=>`<p class="err" role="status">${esc(w)}</p>`).join('')}
  <div class="panel"><p class="eyebrow">Season ${S.season} plan</p><div class="cmp"><span></span><b>Plan</b><b>${S.week?'On course for':'So far'}</b>
  ${rows.map(r=>`<span>${r.n}</span><b>${k1(r.plan)}</b><b class="${r.over?'down':''}">${k1(r.proj)}</b>`).join('')}</div>
  <p class="note">The plan is set in the summer. "On course for" scales the season so far to thirty weeks.</p></div>
  <div class="panel"><p class="eyebrow">The frame for your director</p><p class="small muted">He signs, sells and renews within these limits. You set the frame; he does the deals.</p>
  <div class="grow"><span><b>Wage limit</b><br><span class="small muted">${Math.round(wageRatio(id)*100)}% of income expected on current form (£${n0(inc)}k) · bill now £${n0(wageBillK(id)*1000)}</span></span><span></span><span class="stepper"><button data-act="wager" data-arg="-1" aria-label="Lower the wage limit">−</button><b>£${n0(cap*1000)}</b><button data-act="wager" data-arg="1" aria-label="Raise the wage limit">+</button></span></div>
  <p class="small"><b>Transfer money</b>: share of spare cash he may spend</p><div class="seg">${[[.2,'Keep cash'],[.5,'Balanced'],[.8,'Back him']].map(([v,n])=>`<button class="${Math.abs(f.policy.spend-v)<.05?'on':''}" data-act="spend" data-arg="${v}" aria-pressed="${Math.abs(f.policy.spend-v)<.05}">${n}</button>`).join('')}</div>
  <p class="small"><b>Loans</b>: send young reserves to smaller clubs to play</p><div class="seg">${[[true,'Loan them out'],[false,'Keep them']].map(([v,n])=>`<button class="${(f.policy.loans!==false)===v?'on':''}" data-act="loans" data-arg="${v}" aria-pressed="${(f.policy.loans!==false)===v}">${n}</button>`).join('')}</div>
  <p class="note">Spending power now: ${k1(budgetFor(id))}. Windows: the summer and week ${WINTER_WEEK}. Renewals in week ${RENEW_WEEK}.</p></div>`;
}
function dealLine(o){return o.kind==='bonus'?`£${n0(o.perWeek*1000)} a week + £${n0(o.perPoint*1000)} a league point`:o.kind==='naming'?`£${n0(o.perWeek*1000)} a week for the stadium name`:`£${n0(o.perWeek*1000)} a week, fixed`}
function sponsorsBody(){
  const id=S.my,f=F(id),s=f.sponsor,n=f.naming,of=f.offers||[];
  return`<div class="panel"><p class="eyebrow">Main sponsor</p>${s&&s.until>=S.season?`<div class="row"><b>${esc(s.name)}</b><span class="small muted">until season ${s.until}</span></div><p class="small">${dealLine(s)}</p>`:'<p class="small down">No main sponsor: local backers pay a fraction.</p>'}
  ${n&&n.until>=S.season?`<div class="row"><b>${esc(n.name)} Stadium</b><span class="small muted">until season ${n.until}</span></div><p class="small">${dealLine(n)} · members dislike it</p>`:''}
  <div class="row small"><span>Local partners this season</span><b>${k1(f.season.partners||0)}</b></div><p class="note">The commercial department and media facilities raise local partners now and the size of future deals.</p></div>
  ${of.length?`<p class="eyebrow">Offers on the table</p><div class="stack">${of.map((o,i)=>`<div class="opt"><b>${esc(o.name)}${o.kind==='naming'?' (naming rights)':''}</b><span class="small">${dealLine(o)} · ${o.years} season${o.years>1?'s':''}</span>
    <span class="small muted">${o.kind==='bonus'?'A good season pays more than a fixed deal; a bad one pays less.':o.kind==='naming'?'Big money, but members dislike a renamed ground.':o.years>=3?'Security for three seasons.':'More now, renegotiate next summer.'}</span><button class="tbtn" data-act="sponsor" data-arg="${i}">Sign</button></div>`).join('')}</div>`:'<p class="small muted">New offers arrive in the summer when a deal ends.</p>'}`;
}
function fundingExtra(){
  const id=S.my,f=F(id),cap=bondCap(id),y=fundraiseYield(id),g=f.groundSold,gv=groundValue(id),stat=hasStatute(id,STATUTE_SALE);
  return`<div class="panel"><p class="eyebrow">Members' bond</p><p class="small muted">Members lend to their club for five years, cheaper than the bank. Confident members lend more.</p>
  ${f.bondSeason===S.season?'<p class="small">One bond a season: this season\'s is issued.</p>':cap>=5?`<div class="seg">${[.5,1].map(x=>Math.max(5,Math.round(cap*x))).map(a=>`<button data-act="bond" data-arg="${a}">£${a}k at ${Math.round(bondRate(id)*1000)/10}%</button>`).join('')}</div>`:'<p class="small down">Members have too little confidence to lend.</p>'}</div>
  <div class="panel"><p class="eyebrow">Members' appeal</p><p class="small muted">A one-off collection. Ask too often and members give less and grumble.</p>
  ${f.fundLast===S.season?'<p class="small">This season\'s appeal is done.</p>':`<button class="btn ghost" data-act="appeal">Launch an appeal (about £${y}k)</button>`}</div>
  <div class="panel"><p class="eyebrow">The ground</p>${g?`<p class="small">Sold in season ${g.s}. Rent £${n0(g.rent*1000)} a week.</p><button class="btn ghost" data-act="buyback">Buy it back (£${Math.round(g.value*1.1)}k)</button>`:`<p class="small muted">Sell ${esc(CL(id).ground)} for about £${gv}k and lease it back at £${n0(gv*.075/SEASON_WEEKS*1000)} a week. Members will not forgive it easily.${stat?' The statute needs their approval.':''}</p>
  ${UI.confirm==='sellground'?`<div class="seg"><button data-act="sellground">Sell the ground</button><button data-act="confirm" data-arg="">Keep it</button></div>`:`<button class="btn ghost" data-act="confirm" data-arg="sellground">Sell and lease back</button>`}`}</div>`;
}
