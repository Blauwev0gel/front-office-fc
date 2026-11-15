/* ---------- review & sacked ---------- */
/* ---------- club, league, staff, academy, review: game screens ---------- */
const mrow = (ic, l, v, max, txt, cls) => `<div class="mrow">${ART.I[ic] || ''}<span>${l}</span><i><b class="${cls || ''}" style="width:${Math.max(0, Math.min(100, v / (max || 100) * 100))}%"></b></i><em>${txt != null ? txt : r0(v)}</em></div>`;
function secScouting() {
  const g = G(), c = g.club, nets = Object.keys(F.REGIONS).map(k => meter(F.REGIONS[k].name, c.net[k])).join('');
  return `<div class="sec">Scouting network</div><div class="panel2"><p class="small" style="margin-top:0">${esc(F.staffName('scout'))} focuses on ${esc(F.REGIONS[F.man('scout', 'reg1')].name)} and ${esc(F.REGIONS[F.man('scout', 'reg2')].name)}. Stronger networks find better targets.</p>${nets}</div>`;
}
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
  const g = G(), c = g.club, R = ART.rep(), wf = F.weekForecast(), dc = F.HOOK.deptCost ? Object.values(F.HOOK.deptCost()).reduce((x, y) => x + y, 0) : 0, net = wf.rev - wf.cost - dc, run = F.finRunway ? F.finRunway() : null;
  const lab = (k, v) => { const q = F.DNA.find(q => q.k === k); const o = q && q.o.find(o => o.v === v); return o ? o.l : ''; };
  const al = F.alignment(), on = g.board.obj.filter(o => F.objMet(o)).length;
  const objs = g.board.obj.map(o => `<div class="pl ${F.objMet(o) ? 'done' : 'open'}"><i class="dot"></i>${esc(o.t)}<span>${F.objMet(o) ? 'On track' : 'Off track'}</span></div>`).join('');
  const projs = g.projects || [], proj = projs.map(pr => { const v = F.PROP[pr.id]; let t = ''; try { t = typeof v.title === 'function' ? v.title(pr.ctx) : v.title; } catch (e) { } const tot = pr.due - pr.start, left = pr.due - F.absWeek(); return `<div class="proj"><span>${esc(t)}</span><i><b style="width:${Math.max(4, Math.min(100, (tot - Math.max(0, left)) / Math.max(1, tot) * 100))}%"></b></i><em>${Math.max(0, left)} wk</em></div>`; }).join('');
  const done = (g.projLog || []).slice(0, 5).map(l => `<div class="scr2"><span>${esc(l.title)}</span><b class="${l.ok ? 'good' : 'bad'}">${l.ok ? 'Delivered' : 'Failed'}</b></div>`).join('');
  const hist = g.history.slice(-6).reverse().map(h => `<div class="scr2"><span>Season ${h.season}</span><b>${F.ord(h.pos)}<small> ${F.TIERS[h.tier]}</small></b></div>`).join('');
  return `${tourCard('club')}<section class="clubhero"><div class="ch1">${crest(c.colors, c.short, 64)}<div><h2>${esc(c.name)}</h2><span class="small">${F.TIERS[c.tier]}, ${c.cap.toLocaleString('en-GB')} seats</span><div class="traits">${F.DNA.slice(0, 4).map(q => `<span>${esc(lab(q.k, c.dna[q.k]))}</span>`).join('')}</div></div></div>
    <div class="replv"><span>CEO level ${R.lv}</span><b>${R.title}</b><i><b style="width:${R.prog * 100}%"></b></i></div></section>
  <div class="sec">Who backs you</div><div class="panel2">${mrow('trust', 'Your grip', g.grip == null ? 60 : g.grip, 100, r0(g.grip == null ? 60 : g.grip), g.grip < 30 ? 'lo' : '')}${F.backers ? F.backers().map(b => mrow(b.ic, b.t, b.v, 100, String(b.v), b.danger ? 'lo' : '')).join('') : ''}${mrow('club', 'DNA fit', al, 100, r0(al) + '%', al < 60 ? 'lo' : '')}<p class="small" style="margin:6px 0 0">${al < 60 ? 'Your choices drift from the club DNA. Fans and board notice.' : 'Your choices fit the club DNA.'}</p></div>
  <div class="sec">Board objectives <span class="small">${on} of ${g.board.obj.length} on track</span></div><div class="objprog"><b style="width:${g.board.obj.length ? on / g.board.obj.length * 100 : 0}%"></b></div><div class="planboard">${objs}</div>
  ${secPromises()}${credHtml()}
  <div class="sec">Money</div><div class="panel2"><div class="money1"><div><small>Cash</small><b class="${c.cash < 0 ? 'bad' : ''}">${money(c.cash)}</b></div><div><small>Per week</small><b class="${net < 0 ? 'bad' : 'good'}">${net >= 0 ? '+' : ''}${money(net)}</b></div><div><small>${run != null ? 'Runway' : 'Debt'}</small><b class="${run != null && run <= 8 ? 'bad' : ''}">${run != null ? run + ' wk' : money(c.debt || 0)}</b></div></div><div class="scr2"><span>Transfer budget</span><b>${money(F.transferBudget())}</b></div><button class="linkbtn" data-a="dept-go" data-k="business" data-v="data">Full finances in Business ${ART.I.chev}</button></div>
  <div class="sec">Projects ${projs.length ? `<span class="small">${projs.length} under way</span>` : ''}</div><div class="panel2">${proj || '<p class="small" style="margin:0">No projects under way. Staff pitch new ones in the board meetings.</p>'}${done ? `<div class="sub2">Completed</div>${done}` : ''}</div>
  ${g.trophies.length || hist ? `<div class="sec">History</div><div class="panel2">${g.trophies.length ? `<div class="cabinet">${g.trophies.map(t => `<span>${ART.I.league}${esc(t)}</span>`).join('')}</div>` : ''}${hist}</div>` : ''}`;
}
function vLeague2() {
  const g = G(), t = U.lt || g.club.tier, tab = F.sortTable(t), dv = g.divs[t], full = U.lfull;
  const nf = t === g.club.tier ? nextFix() : null;
  const dot = id => { const PALS = [['#1d4ed8', '#fff'], ['#b91c1c', '#fff'], ['#15803d', '#fde047'], ['#111', '#fff'], ['#f59e0b', '#111'], ['#7c3aed', '#fff'], ['#0e7490', '#fff'], ['#be185d', '#fff'], ['#854d0e', '#fde68a'], ['#475569', '#f1f5f9']]; const cl = id === 0 ? g.club.colors : PALS[(id * 7 + 3) % PALS.length]; return `<i class="cdot" style="background:${cl[0]};box-shadow:inset 0 -4px 0 ${cl[1]}"></i>`; };
  return `${tourCard('league')}<div class="tierstep"><button class="iconbtn" data-a="lt" data-t="${Math.max(1, t - 1)}" ${t === 1 ? 'disabled' : ''} aria-label="Higher division">${ART.I.up}</button><div><b>${F.TIERS[t]}</b><small>Tier ${t} of 8</small></div><button class="iconbtn" data-a="lt" data-t="${Math.min(8, t + 1)}" ${t === 8 ? 'disabled' : ''} aria-label="Lower division">${ART.I.down}</button></div>
  ${nf ? `<div class="nextfix"><small>Next match</small><b>${nf.home ? 'vs' : 'at'} ${esc(nf.name)}</b><span>${F.ord(nf.pos)} in the table</span></div>` : ''}
  ${t === g.club.tier && g.form.length ? `<div class="formrow">${g.form.slice(-8).map(r => `<i class="f${r}">${r}</i>`).join('')}</div>` : ''}
  <div class="ltab ${full ? 'full' : ''}"><div class="lr lh"><span>#</span><span>Club</span><span>P</span>${full ? '<span>W</span><span>D</span><span>L</span>' : ''}<span>GD</span><span>Pts</span></div>
  ${tab.map((id, i) => { const r = dv.tab[id]; return `<div class="lr ${id === 0 ? 'me' : ''} ${i < 3 && t > 1 ? 'up' : ''} ${i >= 15 && t < 8 ? 'dn' : ''}"><span>${i + 1}</span><span class="cn">${dot(id)}${esc(F.cname(id))}</span><span>${r.p}</span>${full ? `<span>${r.w}</span><span>${r.d}</span><span>${r.l}</span>` : ''}<span>${r.gf - r.ga > 0 ? '+' : ''}${r.gf - r.ga}</span><b>${r.pts}</b></div>`; }).join('')}</div>
  <div class="spread" style="margin-top:6px"><span class="small">${t > 1 ? 'Top 3 go up' : 'Top 3 win honours'}${t < 8 ? ', bottom 3 go down' : ''}.</span><button class="linkbtn" data-a="lfull" style="margin:0">${full ? 'Short table' : 'Full table'}</button></div>
  ${t === g.club.tier ? `<div class="sec">National Cup</div><div class="planboard">${g.cup.log.length ? g.cup.log.map(l => `<div class="pl ${l.win ? 'done' : 'open'}"><i class="dot"></i>${cap(l.rd)}: ${esc(l.opp)}<span>${esc(l.s)}</span></div>`).join('') : '<div class="pl open"><i class="dot"></i>First round<span>week 5</span></div>'}</div>` : ''}`;
}
function vStaff2() {
  const g = G();
  return `<p class="small" style="margin:0 0 10px">Hire, set the mandate, talk. A mandate change, a talk or a dismissal costs one action.</p><div class="scards">${F.ROLES.map(r => {
    const s = g.staff[r.id];
    if (!s) return `<div class="scard vacant"><div class="sface2 empty">${ART.I.staff}</div><div class="sm"><b>${esc(r.t)}</b><small>Vacant: ${esc(r.dept)} runs on chance</small></div><button class="btn small" data-a="sheet" data-s="cands" data-r="${r.id}">Hire</button></div>`;
    const P = s.p, tr = [P.ego > 14 ? 'Big ego' : '', P.loy > 14 ? 'Loyal' : P.loy < 7 ? 'Mercenary' : '', P.risk > 14 ? 'Risk-taker' : P.risk < 7 ? 'Careful' : '', P.amb > 14 ? 'Ambitious' : ''].filter(Boolean).slice(0, 2), rc = F.record(r.id);
    return `<div class="scard"><div class="sface2">${ART.staffFace(r.id)}</div><div class="sm"><b>${esc(s.name)}</b><small>${esc(r.t)}, ${starsTxt(F.stars(F.ovr(s)))}</small><div class="traits">${tr.map(x => `<span>${x}</span>`).join('')}<span class="${rc.verdict === 'Strong' ? 'good' : rc.verdict === 'Poor' ? 'bad' : ''}">${esc(rc.verdict)}</span></div>
      ${mrow('trust', 'Trust', s.rel, 100, null, s.rel < 35 ? 'lo' : '')}${mrow('star', 'Form', s.perf, 100, null, s.perf < 35 ? 'lo' : '')}</div>
      <div class="sbtns"><button class="btn small" data-a="sheet" data-s="mand" data-r="${r.id}">Mandate</button><button class="btn ghost small" data-a="sheet" data-s="talk" data-r="${r.id}" ${g.ap < 1 ? 'disabled' : ''}>Talk</button><details class="more2"><summary aria-label="More">…</summary><button class="linkbtn" data-a="sheet" data-s="fire" data-r="${r.id}" ${g.ap < 1 ? 'disabled' : ''}>Dismiss</button></details></div>
      <details class="more snum"><summary>The numbers ${ART.I.chev}</summary>${numbers(r.id)}</details></div>`;
  }).join('')}</div>`;
}
