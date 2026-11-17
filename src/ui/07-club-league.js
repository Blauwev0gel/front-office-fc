/* ---------- review & sacked ---------- */
/* ---------- club, league, staff, academy, review: game screens ---------- */
const mrow = (ic, l, v, max, txt, cls) => `<div class="mrow">${ART.I[ic] || ''}<span>${l}</span><i><b class="${cls || ''}" style="width:${Math.max(0, Math.min(100, v / (max || 100) * 100))}%"></b></i><em>${txt != null ? txt : r0(v)}</em></div>`;
function secCommercial() {
  const g = G(), c = g.club, deals = c.deals.map(d => `<div class="scr2"><span>${esc(d.name)}</span><b>${money(d.wk)}/wk<small> ${d.weeks > 150 ? 'long term' : d.weeks + ' wk left'}</small></b></div>`).join('');
  return `<div class="sec">Matchday</div><div class="panel2"><div class="scr2"><span>Ticket price</span><b>${money(F.ticketPrice())}</b></div><div class="scr2"><span>Last home crowd</span><b>${(c.lastAtt || 0).toLocaleString('en-GB')} of ${c.cap.toLocaleString('en-GB')}</b></div>${mrow('stadium', 'Stadium full', c.cap ? (c.lastAtt || 0) / c.cap * 100 : 0, 100, Math.round(c.cap ? (c.lastAtt || 0) / c.cap * 100 : 0) + '%')}${F.CAPREQ[c.tier - 1] ? `<p class="small" style="margin:6px 0 0">Licensing: the ${F.TIERS[c.tier - 1]} requires ${F.CAPREQ[c.tier - 1].toLocaleString('en-GB')} seats.</p>` : ''}</div>
  <div class="sec">Sponsor deals <span class="small">${money(F.sponsorIncome())}/wk</span></div><div class="panel2">${deals || '<p class="small">No deals yet. Your commercial head is working on it.</p>'}</div>`;
}
function secMarketing() {
  const g = G(), c = g.club;
  return `<div class="sec">Reach</div><div class="panel2"><div class="scr2"><span>Supporter base</span><b>${c.fanbase.toLocaleString('en-GB')}</b></div>${mrow('star', 'Brand', c.brand)}${mrow('press', 'Press', g.st.press)}${mrow('money', 'Sponsors', g.st.spons)}</div>`;
}
function secPromises() {
  const g = G(), pr = g.promises.filter(p => p.season === g.season);
  return pr.length ? `<div class="sec">Your public promises</div><div class="planboard">${pr.map(p => { const ok = p.status !== 'broken' && F.promiseMet(p); return `<div class="pl ${ok ? 'done' : 'open'}"><i class="dot"></i>${esc(p.t)}<span>${p.status === 'broken' ? 'Broken' : ok ? 'On track' : 'At risk'}</span></div>`; }).join('')}</div>` : '';
}
function vClub2() {
  const g = G(), c = g.club, forecast = F.weekForecast();
  const deptCost = F.HOOK.deptCost ? Object.values(F.HOOK.deptCost()).reduce((x,y)=>x+y,0) : 0;
  const net = forecast.rev - forecast.cost - deptCost;
  const runway = F.finRunway ? F.finRunway() : null;
  const objs = g.board.obj || [], on = objs.filter(o => F.objMet(o)).length;
  const bk = F.backers ? F.backers() : [];
  const financeRisk = c.cash < 0 || (runway != null && runway <= 8);
  const goals = objs.map(o => `<div class="fo-goal ${F.objMet(o) ? 'on' : 'behind'}">
    <span>${esc(o.t)}</span><b>${F.objMet(o) ? 'ON TRACK' : 'AT RISK'}</b></div>`).join('');
  const supporters = bk.map(b => `<div class="fo-trust">
    <span>${esc(b.t)}</span><b class="${b.danger ? 'bad' : ''}">${b.v}/100</b></div>`).join('');
  const projects = (g.projects || []).map(pr => {
    const v = F.PROP[pr.id];let t = '';
    try {t = typeof v.title === 'function' ? v.title(pr.ctx) : v.title;}catch(e){t = pr.id;}
    const left = Math.max(0,pr.due-F.absWeek());
    return `<div class="fo-goal"><span>${esc(t)}</span><b>${left} wk</b></div>`;
  }).join('');
  const hist = (g.history || []).slice(-6).reverse().map(x =>
    `<div class="fo-goal"><span>Season ${x.season} · ${esc(F.TIERS[x.tier])}</span><b>${F.ord(x.pos)}</b></div>`).join('');
  const R = ART.rep();
  return `${tourCard('club')}
  <section class="fo-club-fin ${financeRisk ? 'risk' : ''}">
    <div class="fo-sectionline"><h2>Club finances</h2><span>${financeRisk ? 'ACTION MAY BE NEEDED' : 'WEEKLY OUTLOOK'}</span></div>
    <div class="fo-finance-grid">
      <div><small>Cash available</small><b>${money(c.cash)}</b></div>
      <div><small>Net per week</small><b class="${net < 0 ? 'bad' : 'good'}">${net >= 0 ? '+' : ''}${money(net)}</b></div>
      <div><small>${runway == null ? 'Club debt' : 'Cash runway'}</small><b>${runway == null ? money(c.debt || 0) : runway + ' weeks'}</b></div>
    </div>
    <button class="fo-textlink" data-a="dept-go" data-k="business" data-v="data">Open full financial report</button>
  </section>
  <section class="fo-club-panel">
    <div class="fo-sectionline"><h2>Board expectations</h2><span>${on}/${objs.length} ON TRACK</span></div>
    ${goals || '<p>No objectives set.</p>'}
  </section>
  <section class="fo-club-panel">
    <div class="fo-sectionline"><h2>People who matter</h2><span>THREE GROUPS</span></div>
    ${supporters}
    <button class="fo-textlink" data-a="sheet" data-s="backers">Why their confidence changed</button>
  </section>
  <section class="fo-club-panel">
    <div class="fo-sectionline"><h2>Work underway</h2><span>${(g.projects || []).length} PROJECTS</span></div>
    ${projects || '<p class="small">No active projects. Department heads bring proposals to meetings.</p>'}
  </section>
  <details class="fo-club-archive"><summary>Club identity, promises & history</summary>
    <p><b>${esc(c.name)}</b> · ${esc(F.TIERS[c.tier])} · ${c.cap.toLocaleString('en-GB')} seats</p>
    <p class="small">Club DNA: ${F.DNA.map(q => {const x=q.o.find(o=>o.v===c.dna[q.k]);return x?x.l:'';}).filter(Boolean).map(esc).join(' · ')}</p>
    <p class="small">CEO: ${esc(R.title)} · Level ${R.lv}</p>
    ${secPromises()}${credHtml()}
    ${g.trophies && g.trophies.length ? `<h3>Honours</h3><p>${esc(g.trophies.join(', '))}</p>` : ''}
    ${hist ? `<h3>Previous seasons</h3>${hist}` : ''}
  </details>`;
}
function vLeague2() {
  const g = G(), t = U.lt || g.club.tier, tab = F.sortTable(t), dv = g.divs[t], full = U.lfull;
  const nf = t === g.club.tier ? nextFix() : null;
  const dot = id => { const PALS = [['#1d4ed8', '#fff'], ['#b91c1c', '#fff'], ['#15803d', '#fde047'], ['#111', '#fff'], ['#f59e0b', '#111'], ['#7c3aed', '#fff'], ['#0e7490', '#fff'], ['#be185d', '#fff'], ['#854d0e', '#fde68a'], ['#475569', '#f1f5f9']]; const cl = id === 0 ? g.club.colors : PALS[(id * 7 + 3) % PALS.length]; return `<i class="cdot" style="background:${cl[0]};box-shadow:inset 0 -4px 0 ${cl[1]}"></i>`; };
  const mine = t === g.club.tier, rank = mine ? tab.indexOf(0) + 1 : null, our = mine ? dv.tab[0] : null;
  const leaguePulse = mine ? `<section class="ceo-league-pulse" aria-label="League position"><h2>League overview</h2>
    <div class="ceo-metrics"><span><b>${F.ord(rank)}</b> position</span><span><b>${our.pts}</b> points</span><span><b>${our.p}</b> played</span><span><b>${F.ord(F.analysis().target)}</b> target</span></div>
    <p class="small">Results and expectations belong here. Staff decisions belong in Departments.</p></section>` : '';
  return `${tourCard('league')}${leaguePulse}<div class="tierstep"><button class="iconbtn" data-a="lt" data-t="${Math.max(1, t - 1)}" ${t === 1 ? 'disabled' : ''} aria-label="Higher division">${ART.I.up}</button><div><b>${F.TIERS[t]}</b><small>Tier ${t} of 8</small></div><button class="iconbtn" data-a="lt" data-t="${Math.min(8, t + 1)}" ${t === 8 ? 'disabled' : ''} aria-label="Lower division">${ART.I.down}</button></div>
  ${nf ? `<div class="nextfix"><small>Next match</small><b>${nf.home ? 'vs' : 'at'} ${esc(nf.name)}</b><span>${F.ord(nf.pos)} in the table</span></div>` : ''}
  ${t === g.club.tier && g.form.length ? `<div class="formrow">${g.form.slice(-8).map(r => `<i class="f${r}">${r}</i>`).join('')}</div>` : ''}
  <div class="ltab ${full ? 'full' : ''}"><div class="lr lh"><span>#</span><span>Club</span><span>P</span>${full ? '<span>W</span><span>D</span><span>L</span>' : ''}<span>GD</span><span>Pts</span></div>
  ${tab.map((id, i) => { const r = dv.tab[id]; return `<div class="lr ${id === 0 ? 'me' : ''} ${i < 3 && t > 1 ? 'up' : ''} ${i >= 15 && t < 8 ? 'dn' : ''}"><span>${i + 1}</span><span class="cn">${dot(id)}${esc(F.cname(id))}</span><span>${r.p}</span>${full ? `<span>${r.w}</span><span>${r.d}</span><span>${r.l}</span>` : ''}<span>${r.gf - r.ga > 0 ? '+' : ''}${r.gf - r.ga}</span><b>${r.pts}</b></div>`; }).join('')}</div>
  <div class="spread" style="margin-top:6px"><span class="small">${t > 1 ? 'Top 3 go up' : 'Top 3 win honours'}${t < 8 ? ', bottom 3 go down' : ''}.</span><button class="linkbtn" data-a="lfull" style="margin:0">${full ? 'Short table' : 'Full table'}</button></div>
  ${t === g.club.tier ? `<div class="sec">National Cup</div><div class="planboard">${g.cup.log.length ? g.cup.log.map(l => `<div class="pl ${l.win ? 'done' : 'open'}"><i class="dot"></i>${cap(l.rd)}: ${esc(l.opp)}<span>${esc(l.s)}</span></div>`).join('') : '<div class="pl open"><i class="dot"></i>First round<span>week 5</span></div>'}</div>` : ''}`;
}
