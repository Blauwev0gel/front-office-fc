/* ---------- departments ---------- */
function spark(arr, inv, W = 320, H = 70) {
  if (!arr || arr.length < 2) return '<p class="small">Not enough weeks yet.</p>';
  const mn = Math.min(...arr), mx = Math.max(...arr), sp = mx - mn || 1, x = i => 6 + i / (arr.length - 1) * (W - 12), y = v => inv ? 6 + (v - mn) / sp * (H - 12) : H - 6 - (v - mn) / sp * (H - 12);
  return `<svg class="ftrend" viewBox="0 0 ${W} ${H}" role="img" aria-label="Trend"><polyline points="${arr.map((v, i) => x(i) + ',' + y(v)).join(' ')}"/><circle cx="${x(arr.length - 1)}" cy="${y(arr[arr.length - 1])}" r="4"/></svg>`;
}
const kfmt = (k, v) => k === 'commercial' || k === 'business' ? money(v) : k === 'first' ? F.ord(v) : String(v);
function vDepts() {
  const O = F.deptOverview(), rq = k => (F.convoReqs ? F.convoReqs(k) : []);
  const tiles = O.map(o => {
    const w = rq(o.k).length, V = o.status.verdict, act = !o.s ? 'Hire' : w ? 'Wants a word' : '';
    return `<button class="dtile2" data-a="dept" data-k="${o.k}"><span class="dface ${o.s ? '' : 'empty'}">${o.s ? ART.staffFace(o.head) : ART.I.staff}</span><span class="dt"><small>${esc(o.t)}</small><b>${o.s ? esc(o.s.name) : 'Vacant'}</b><em class="dsub">${o.s ? `${healthHtml(V)} ${esc(V.t)}` : 'Nobody runs it. Appoint a head.'}</em></span>${act ? `<span class="dstat bad">${act}</span>` : ''}${ART.I.chev}</button>`;
  }).join('');
  const bud = `<div class="budcard">${planCard()}</div>`;
  const nw = O.filter(o => rq(o.k).length).length, vac = O.filter(o => !o.s).length;
  const bad = O.filter(o => o.s && o.status.st === 'bad' && !o.status.verdict.early).length;
  const top = nw ? `${nw} want${nw === 1 ? 's' : ''} a word` : vac ? `${vac} without a head` : bad ? `${bad} in trouble` : 'All quiet';
  return `<div class="dflat">${tourCard('staff')}<div class="dhead"><b>${O.length} departments</b><span class="${nw || vac || bad ? 'bad' : 'good'}">${top}</span></div><div class="dtiles">${tiles}</div><div class="sec">Money per department</div>${bud}</div>`;
}
function headLine(role, s, V) {
  const P = s.p, early = V ? V.early : F.record(role).early, v = V ? (V.st === 'good' ? 'Strong' : V.st === 'bad' ? 'Poor' : 'Mixed') : F.record(role).verdict;
  if (early) return P.ego > 14 ? 'Give it time. You will see what I can do.' : 'Early days. We are setting things up the right way.';
  if (v === 'Strong') return P.ego > 14 ? 'The numbers speak for themselves.' : 'Things are going well. Credit to the team.';
  if (v === 'Poor') return P.risk < 7 ? 'Not good enough, I know. I am fixing it step by step.' : 'A rough patch. I have a plan.';
  return P.amb > 14 ? 'Decent, but I want more.' : 'Steady progress. No complaints.';
}
function headCard(k, v) {
  const d = v.d, role = d.head;
  return `<section class="fthero vacant"><div class="fth1"><div class="ftface empty">${ART.I.staff}</div><div class="fthm"><b>No ${esc(F.ROLE[role].t.toLowerCase())}</b><span class="small">The department runs on chance until you appoint someone.</span></div></div><button class="btn wide" data-a="sheet" data-s="cands" data-r="${role}">Hire a ${esc(F.ROLE[role].t.toLowerCase())}</button></section>`;
}
function authHtml(role) {
  if (!F.authView || !F.DESK_HEADS.includes(role)) return ''; const A = F.authView(role), s = A.head; if (!s) return '';
  return `<div class="authb"><div class="authh"><span>${ART.I.trust}</span><b>Authority</b><small>${A.rec.n ? `${A.rec.err} of ${A.rec.n} calls went wrong` : 'No calls yet'}</small></div>
    <div class="seg wide" role="radiogroup" aria-label="Authority for ${esc(s.name)}">${A.opts.map((t, i) => `<button role="radio" aria-checked="${A.a === i}" class="${A.a === i ? 'on' : ''}" data-a="auth" data-r="${role}" data-v="${i}">${esc(t)}</button>`).join('')}</div>
    <p class="small">${esc(A.s)} Signs off alone up to ${money(A.lim)} a week.</p></div>`;
}
function headBtns(role) { return `<button class="btn small" data-a="cv-open" data-r="${role}">${ART.I.phone} Talk</button>`; }
function instinctRow(role) {
  const s = F.staff(role); if (!s) return ''; const L = F.LEAN[role], k = L[0], m = F.man(role, k), MD = F.MAND[role].sl.find(x => x[0] === k); if (!MD) return '';
  const d = Math.abs(m - s.lean);
  return `<div class="mvr"><div class="mvl"><span>${esc(MD[1])}</span><span>${esc(MD[2])}</span></div><div class="mvt"><i class="you" style="left:${m}%"></i><i class="him ${d > 40 ? 'off' : ''}" style="left:${s.lean}%">${ART.staffFace(role)}</i></div><div class="mvf"><span>Your mandate vs ${esc(s.name.split(' ')[0])}'s instinct</span><b class="${d > 40 ? 'bad' : d < 20 ? 'good' : ''}">${d > 40 ? 'Friction · costs trust' : d < 20 ? 'Aligned' : 'Some distance'}</b></div></div>`;
}
function fillCol(f) { return f >= 0.85 ? '#2a6b46' : f >= 0.6 ? '#5f9a4f' : f >= 0.4 ? '#d9a21b' : '#c8102e'; }
function stadiumSvg(V) {
  const D = V.D, h = D.home, m = D.main, fa = D.family;
  const st = (x, y, w, hh, d, lab) => `<g><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6" fill="${fillCol(d.fill)}" stroke="#16201b" stroke-width="3"/><text x="${x + w / 2}" y="${y + hh / 2 - 2}" text-anchor="middle" font-size="15" font-weight="900" fill="#fff" font-family="var(--head)">${Math.round(d.fill * 100)}%</text><text x="${x + w / 2}" y="${y + hh / 2 + 14}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="var(--head)">${lab}</text></g>`;
  return `<svg class="stadsvg" viewBox="0 0 340 220" role="img" aria-label="Stadium: home end ${Math.round(h.fill * 100)}%, main stand ${Math.round(m.fill * 100)}%, family stand ${Math.round(fa.fill * 100)}% full">
    <rect x="70" y="40" width="200" height="120" fill="#4f8d5c" stroke="#16201b" stroke-width="3"/><path d="M170 40v120" stroke="#fff" stroke-width="2" opacity=".7"/><circle cx="170" cy="100" r="18" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>
    <rect x="70" y="8" width="200" height="26" rx="6" fill="light-dark(#cfd4cf,#3a423d)" stroke="#16201b" stroke-width="2" stroke-dasharray="5 4"/><text x="170" y="25" text-anchor="middle" font-size="10" font-weight="800" fill="light-dark(#5a625d,#aab3ad)" font-family="var(--head)">AWAY END</text>
    ${st(8, 40, 56, 120, h, 'HOME END')}${st(70, 166, 200, 46, m, 'MAIN STAND')}${st(276, 40, 56, 120, fa, 'FAMILY')}</svg>`;
}
function comOverview(V) {
  const tot = Object.values(V.D).reduce((a, x) => a + x.att, 0), cap = Object.values(V.D).reduce((a, x) => a + x.cap, 0), rev = Object.values(V.D).reduce((a, x) => a + x.rev, 0);
  return `<div class="sec">Matchday</div><div class="panel2">${stadiumSvg(V)}<div class="stadleg"><span><i style="background:#c8102e"></i>Under 40%</span><span><i style="background:#d9a21b"></i>40 to 60</span><span><i style="background:#5f9a4f"></i>60 to 85</span><span><i style="background:#2a6b46"></i>Full</span></div>
  <div class="kgrid" style="margin-top:8px"><div class="kt"><small>Expected crowd</small><b>${tot.toLocaleString('en-GB')}</b><span>of ${cap.toLocaleString('en-GB')}</span></div><div class="kt"><small>Gate per home game</small><b>${money(rev)}</b><span>after concessions</span></div></div>
  <p class="small" style="margin:8px 0 0">Crowds follow your fans, recent form, prices and the matchday experience.</p></div>`;
}
function comDecisions(V) {
  const g = G(), o = V.offer;
  const offer = o ? `<div class="offer"><div class="ofh"><span class="ofs">${esc(o.sect)}</span><b>${esc(o.name)}</b><em>${money(o.wk)}/wk</em><small>${o.weeks} weeks. Offer ends in ${Math.max(0, o.exp - F.absWeek())} wk</small></div><div class="bopts"><button class="bopt" data-a="com-offer" data-k="accept"><b>Accept</b><span class="fx">+${money(o.wk)}/wk</span></button><button class="bopt" data-a="com-offer" data-k="push"><b>Push for 20% more</b><span class="fx">or they walk</span></button><button class="bopt" data-a="com-offer" data-k="reject"><b>Turn it down</b></button></div></div>` : `<p class="small" style="margin:0">No offer on the table. ${g.club.deals.length >= 5 ? 'All five sponsor slots are filled.' : 'Your commercial team is talking to local firms.'}</p>`;
  const prices = V.stands.map(st => { const d = V.D[st.k]; return `<div class="budrow"><span><b>${esc(st.t)}</b><small>${money(d.price)} a ticket, ${Math.round(d.fill * 100)}% full</small></span><button class="iconbtn sm" data-a="com-price" data-k="${st.k}" data-v="-0.1" aria-label="Cheaper ${esc(st.t)}">−</button><em>${Math.round(V.X.pf[st.k] * 100)}</em><button class="iconbtn sm" data-a="com-price" data-k="${st.k}" data-v="0.1" aria-label="Dearer ${esc(st.t)}">+</button></div>`; }).join('');
  return `<div class="sec">Sponsor offer</div><div class="panel2">${offer}</div>
  <div class="sec">Ticket prices <span class="small">100 is the standard price</span></div><div class="budcard">${prices}<p class="small" style="margin:6px 0 0">The home end barely reacts to price, the family stand does. Effect from the next home game.</p></div>
  <div class="sec">Matchday experience</div><div class="panel2"><div class="expl">${V.expL.map((l, i) => `<i class="${i < V.exp ? 'on' : ''}" title="${esc(l)}"></i>`).join('')}</div><div class="scr2"><span>${esc(V.expL[V.exp - 1])}</span><b>${V.expCost ? money(V.expCost) + '/wk' : 'No running cost'}</b></div>${V.exp < 5 ? `<button class="btn ghost wide" data-a="com-exp" data-v="up" ${g.club.cash < V.expFee ? 'disabled' : ''}>Upgrade to "${esc(V.expL[V.exp])}" for ${money(V.expFee)}</button>` : ''}${V.exp > 1 ? '<button class="linkbtn" data-a="com-exp" data-v="down">Cut back a level</button>' : ''}<p class="small" style="margin:6px 0 0">Each level draws more casual fans and sells more merchandise.</p></div>
  <div class="sec">Family day</div><div class="panel2"><p class="small" style="margin:0 0 8px">Half-price family stand for the next home game. Bigger crowd, a few new fans.</p>${V.X.promo === 'next' ? '<p class="small good" style="margin:0">Set for the next home game.</p>' : `<button class="btn ghost wide" data-a="com-promo" ${V.promoIn ? 'disabled' : ''}>${V.promoIn ? `Possible again in ${V.promoIn} wk` : `Run a family day (${money(Math.round(F.M(400) / 10) * 10)})`}</button>`}</div>`;
}
function mkOverview(V) {
  const rows = [['Reach', V.reach, 'People in the area who know the club'], ['Fans', V.fans, 'Turn up at least now and then'], ['Season tickets', V.stx, 'Come every home game, win or lose']], mx = Math.max(1, V.reach);
  return `<div class="sec">Supporters</div><div class="panel2"><div class="funnel2">${rows.map(([l, v, d], i) => `<div class="f2r"><div class="f2b" style="width:${Math.max(18, Math.sqrt(v / mx) * 100)}%"><b>${v.toLocaleString('en-GB')}</b></div><span><b>${l}</b><small>${d}</small></span></div>`).join('')}</div>
  ${mrow('trust', 'Loyalty', V.loyalty, 100, V.loyalty + '', V.loyalty < 35 ? 'lo' : '')}<p class="small" style="margin:4px 0 0">Loyal fans stay through a bad run and buy season tickets. Community work builds it.</p>
  ${V.camp ? `<div class="campon"><b>${esc(V.camp.t)}</b><span>${V.camp.left} week${V.camp.left === 1 ? '' : 's'} left</span></div>` : ''}</div>`;
}
function mkDecisions(V) {
  const g = G();
  return `<div class="sec">Campaign ${V.camp ? '<span class="small">one at a time</span>' : ''}</div><div class="camps">${V.camps.map(c => `<button class="camp ${V.camp && V.camp.k === c.k ? 'on' : ''}" data-a="mk-camp" data-k="${c.k}" ${V.camp || g.club.cash < c.price ? 'disabled' : ''}><b>${esc(c.t)}</b><small>${esc(c.d)}</small><em>${money(c.price)}, ${c.wk} wk</em></button>`).join('')}</div>
  <p class="small">Campaign strength ${Math.round(V.mult * 100)}%. A stronger head of marketing and a content creator raise it.</p>
  <div class="sec">Community programme</div><div class="budcard"><div class="budrow"><span><b>${esc(V.commL[V.comm])}</b><small>${V.commCost ? money(V.commCost) + '/wk' : 'No cost'}</small></span><button class="iconbtn sm" data-a="mk-comm" data-v="-1" aria-label="Less community work">−</button><em>${V.comm}</em><button class="iconbtn sm" data-a="mk-comm" data-v="1" aria-label="More community work">+</button></div><p class="small" style="margin:6px 0 0">Raises loyalty slowly, week by week.</p></div>`;
}
function planCard(only) {
  const V = F.bizView(), rows = V.rows.filter(r => !only || r.k === only);
  return `<div class="plan2">${!only ? `<div class="spread"><b>Season budget</b><span class="small ${V.ok ? 'good' : 'bad'}">${V.none ? `${money(V.spend)}/wk` : `${money(V.spend)} of ${money(V.env)}/wk`}</span></div>${V.none ? '' : `<div class="budbar"><b class="${V.ok ? '' : 'over'}" style="width:${Math.min(100, V.spend / V.env * 100)}%"></b></div>`}<p class="small" style="margin:4px 0 8px">${V.none ? `No room yet. Wages and fixed costs (${money(V.other)}) already pass revenue (${money(V.rev)}), so every budget adds to the loss.` : V.ok ? 'Within what revenue covers.' : 'Above what revenue covers: cash goes down.'} ${V.est ? 'Early estimate, firmer after four weeks.' : `Forecast ±${V.err}%.`}</p>` : ''}
  ${rows.map(r => `<div class="plrow"><span><b>${esc(r.t)}</b><small>${money(r.cost)}/wk${r.lv === 'cut' ? ' <em class="bad">· Cut below Lean</em>' : ''}</small></span><div class="seg3" role="group" aria-label="${esc(r.t)} budget">${V.levels.map(([k, l], i) => `<button class="${r.lv === k ? 'on' : ''}" data-a="biz-lv" data-k="${r.k}" data-v="${k}" aria-pressed="${r.lv === k}">${l}<small>${money(r.costs[i])}</small></button>`).join('')}</div></div>`).join('')}
  ${!only ? `<button class="linkbtn" data-a="biz-prop">Use Finance's proposal</button>` : '<p class="small" style="margin:6px 0 0">Finance checks every department against one season budget.</p>'}</div>`;
}
function bizOverview() {
  const V = F.bizView(), g = G(), L = g.fin.last, run = F.finRunway ? F.finRunway() : null;
  const inc = L ? L.tin : V.rev, out = L ? L.tout : 0, mx = Math.max(inc, out, 1);
  const seg = (o, cls) => Object.entries(o || {}).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([k, v], i) => `<i class="${cls}${i % 2 ? ' alt' : ''}" style="width:${v / mx * 100}%" title="${k}"></i>`).join('');
  const gauge = run == null ? 100 : Math.min(100, run / 26 * 100);
  return `<div class="sec">Money flow last week</div><div class="panel2"><div class="flow"><span>In</span><div class="fbar">${L ? seg(L.i, 'in') : ''}</div><b>${money(inc)}</b></div><div class="flow"><span>Out</span><div class="fbar">${L ? seg(L.o, 'out') : ''}</div><b>${money(out)}</b></div><div class="spread" style="margin-top:6px"><span class="small">Result</span><b class="${inc - out >= 0 ? 'good' : 'bad'}">${inc - out >= 0 ? '+' : ''}${money(inc - out)}</b></div></div>
  <div class="sec">Runway</div><div class="panel2"><div class="gauge"><i style="width:${gauge}%" class="${run != null && run <= 8 ? 'bad' : ''}"></i></div><p class="small" style="margin:6px 0 0">${run == null ? 'On the forecast, the club is not burning cash.' : `On the forecast, about ${run} weeks of cash.`}${L && L.tin - L.tout < 0 && g.club.cash > 0 ? ` At last week's loss alone: ${Math.floor(g.club.cash / (L.tout - L.tin))} weeks.` : ''} ${V.debt ? `Debt ${money(V.debt)} at ${(V.rate * 52 * 100).toFixed(1)}% a year.` : 'No debt.'}</p></div>
  <div class="sec">Budget</div><div class="budcard">${planCard()}</div>`;
}
function acPyramid(V) {
  const rows = [{ k: 'First team', ps: V.grads, w: 34 }].concat(V.groups.slice().reverse().map((x, i) => ({ k: x.k, ps: x.ps, w: 48 + i * 14 })));
  const col = p => { const b = p.band ? p.band[1] : F.absStars(p.pa); return b >= V.lvl + 0.5 ? '#2a6b46' : b >= V.lvl - 0.5 ? '#d9a21b' : 'light-dark(#b9beba,#5a625d)'; };
  return `<div class="pyr">${rows.map(r => `<div class="pyrow"><small>${esc(r.k)}</small><div class="pyb" style="width:${r.w}%">${r.ps.length ? r.ps.slice(0, 12).map(p => `<button class="pyd" style="background:${col(p)}" data-a="player" data-id="${p.id}" aria-label="${esc(p.name)}"></button>`).join('') : '<span class="small">empty</span>'}</div><em>${r.ps.length}</em></div>`).join('')}</div>
  <div class="stadleg"><span><i style="background:#2a6b46"></i>Can make it here</span><span><i style="background:#d9a21b"></i>Maybe</span><span><i style="background:#b9beba"></i>Unlikely</span></div>`;
}
function acDecisions(V) {
  const X = V.trial, last = (V.log || [])[0], lastL = last ? `<p class="small" style="margin:6px 0 0">Last time: ${esc(last.t)}</p>` : '';
  if (!X) return `<div class="sec">Trial day</div><div class="panel2"><p class="small" style="margin:0">Next trial day: ${G().phase === 'season' && G().week <= 28 ? 'week 28' : 'next season, week 28'}. You set what the recruiters look for; they choose the children.</p>${lastL}</div>`;
  return `<div class="sec">Trial day <span class="small">${X.list.length} on trial, room for ${X.picks}</span></div><div class="panel2"><p class="small" style="margin:0 0 8px">What should the recruiters look for? They choose the children.</p><div class="choice2">${Object.entries(F.AC_CRIT).map(([k, c]) => `<button class="btn ghost wide" data-a="ac-crit" data-v="${k}">${esc(c.l)}<small>${esc(c.d)}</small></button>`).join('')}</div><p class="small" style="margin:6px 0 0">Without your answer the recruiters go for the highest ceiling.</p></div>`;
}
/* the CEO's agreements with this department: what was agreed, what has happened, and a way to raise the team's form (CEO-2) */
function agrHtml(k) {
  if (!F.agrList || (k !== 'recruit' && k !== 'first')) return ''; const g = G(), own = k === 'recruit' ? 'dof' : 'coach';
  const L = F.agrList().filter(a => a.owner === own || a.with === own), live = L.filter(a => !a.res), done = L.filter(a => a.res && a.res !== 'merged').slice(-1);
  const sig = F.iniSignal ? F.iniSignal() : null, ask = sig || (!F.iniActive() && (g.ft && g.ft.games || []).length >= 4) ? `<button class="dk-ask" data-a="ini-open">${ART.staffFace('dof')}<span>${sig ? esc(sig.t[0].toUpperCase() + sig.t.slice(1)) + ': call in the coach and the DoF' : 'Ask the coach and the DoF how the team is really doing'}</span>${ART.I.chev}</button>` : '';
  if (!live.length && !done.length && !ask) return '';
  const row = a => `<div class="agr2"><b>${esc(a.t)}</b><small>${a.ordered ? 'Your decision' : 'Agreed with you'} in week ${a.mw}${a.res ? '' : ` · ${a.joint ? 'back to you' : 'judged'} in week ${a.by - F.absWeek() + g.week}`}</small>${(a.log || []).slice(-3).map(l => `<p>Week ${l.w}: ${esc(l.t)}</p>`).join('')}${a.res ? `<p class="${a.res === 'worked' ? 'good' : a.res === 'failed' ? 'bad' : ''}"><b>${esc(a.res === 'overtaken' ? 'Overtaken by events' : a.res[0].toUpperCase() + a.res.slice(1))}.</b> ${esc(a.out || '')}</p>` : ''}</div>`;
  return `<div class="sec">Agreements with you</div><div class="panel2">${live.map(row).join('')}${done.map(row).join('')}${ask}</div>`;
}
function vDept(k) {
  if (k === 'recruit' && U.portal && F.worldLeague) return vPortal();
  const g = G(), v = F.deptView(k), d = v.d, st = v.status, role = d.head, s = v.head;
  const head = `<div class="ohead"><button class="iconbtn" data-a="dept" data-k="" aria-label="Back to departments">${ART.I.back}</button><span class="pos">${esc(d.t)}</span></div>`;
  const TV = F.convoView ? F.convoView(k) : null; if (TV) return `<div class="dflat">${head}${cvTalkHtml(TV)}</div>`;
  const FP = k === 'first' && s ? vFirst(true) : null;
  let peopleHtml = '';
  {
    const me = s ? `<div class="pcard2 senior"><span class="pf">${ART.staffFace(role)}</span><span class="pm"><b>${esc(s.name)}</b><small>${esc(F.ROLE[role].t)}, ${s.age}. ${s.contract} season${s.contract === 1 ? '' : 's'} left. ${money(s.wage)}/wk</small><small class="pw">Relationship ${relW(s.rel)} (${r0(s.rel)}). ${esc(s.bio)}.</small></span><button class="btn ghost small danger" ${role === 'coach' ? 'data-a="ft-sackq"' : `data-a="sheet" data-s="fire" data-r="${role}"`}>Sack</button></div>` : '';
    const scoutC = d.also ? (v.also ? `<div class="pcard2 senior"><span class="pf">${ART.staffFace(d.also)}</span><span class="pm"><b>${esc(v.also.name)}</b><small>Chief scout, ${starsTxt(F.stars(F.ovr(v.also)))}. Relationship ${relW(v.also.rel)} (${r0(v.also.rel)})</small></span><span class="pb"><button class="linkbtn" data-a="cv-open" data-r="${d.also}">Talk</button><button class="linkbtn danger" data-a="sheet" data-s="fire" data-r="${d.also}">Sack</button></span></div>` : `<div class="pcard2 senior"><span class="pf empty">${ART.I.staff}</span><span class="pm"><b>No chief scout</b><small>Nobody is watching players</small></span><button class="btn small" data-a="sheet" data-s="cands" data-r="${d.also}">Hire</button></div>`) : '';
    const cards = v.staff.map(x => `<div class="pcard2 ${x.on ? '' : 'pending'}"><span class="pf">${ART.face(x.id * 17 + 5, { role: d.face, age: x.age, bg: '#fff' })}</span><span class="pm"><b>${esc(x.name)}</b><small>${esc(x.title)}</small><span class="traits"><span title="${esc(x.tdesc)}">${esc(x.trait)}</span></span><small class="pw">${esc(x.what)}. ${money(x.wage)}/wk</small>${x.on ? '' : `<small class="pw">Starts in ${x.left} wk</small>`}</span><span></span></div>`).join('');
    const want = F.deptStaffWant ? F.deptStaffWant(k) : 0, open = s ? `<p class="small">${esc(s.name.split(' ')[0])} hires and lets go his own staff. With this budget he wants ${want} ${want === 1 ? 'person' : 'people'}; there is room for ${v.slots}. Raise the budget below for more.</p>` : '<p class="small">Without a head, nobody hires staff here.</p>';
    const log = v.log.length ? `<div class="sec">Recently</div><div class="panel2">${v.log.map(l => `<p class="small" style="margin:3px 0">Wk ${l.w}: ${esc(l.t)}</p>`).join('')}</div>` : '';
    peopleHtml = `${me}${scoutC}<div class="sec">His staff <span class="small">${v.used}</span></div>${cards || '<p class="small">Nobody yet. He does everything alone.</p>'}${open}${k === 'academy' && g.acad ? acStaff() : ''}${log}`;
  }
  const mandBtn = s ? `<button class="btn ghost wide" data-a="sheet" data-s="mand" data-r="${role}" style="margin-top:8px">Change mandate</button>` : '';
  const FV = FP ? F.ftView() : null, comp = FP ? mrow('board', 'Follows your mandate', FV.comp * 100, 100, `${compW(FV.comp)} (${Math.round(FV.comp * 100)}%)`, FV.comp < 0.65 ? 'lo' : '') : '';
  const A = s && F.DESK_HEADS.includes(role) && F.authView ? F.authView(role) : null, auth = A ? authHtml(role) : '';
  const how = s ? `<div class="panel2">${comp}${FP ? FP.rows : instinctRow(role)}${mandBtn}${auth ? `<div class="hdiv"></div>${auth}` : ''}</div>` : '';
  const BV = F.bizView ? F.bizView() : null, br = BV && v.bud ? BV.rows.find(r => r.k === k) : null, lvL = br ? (BV.levels.find(l => l[0] === br.lv) || [0, 'Cut'])[1] : '';
  const money_ = `<div class="sec">Budget</div><div class="budcard">${planCard(v.bud ? k : undefined)}</div>`
    + (v.fac ? `<div class="sec">Facilities</div><div class="panel2">${mrow('stadium', esc(v.fac.l), v.fac.lv, 10, 'Level ' + v.fac.lv)}<p class="small" style="margin:6px 0 0">Upgrades come through projects in the board meeting.</p></div>` : '')
    + (v.projects.length ? `<div class="sec">Projects</div><div class="panel2">${v.projects.map(pr => { const P = F.PROP[pr.id]; let t = ''; try { t = typeof P.title === 'function' ? P.title(pr.ctx) : P.title; } catch (e) { } return `<div class="proj"><span>${esc(t)}</span><em>${Math.max(0, pr.due - F.absWeek())} wk</em></div>`; }).join('')}</div>` : '');
  const sDec = FP ? (FV.deal ? 'Target agreed' : 'No target agreed') : k === 'recruit' && F.recView ? (F.recView().inWin ? 'Window open' : 'Window closed') : '';
  const sHow = FP ? `Follows your mandate ${compW(FV.comp)}` : A ? A.opts[A.a] : '';
  const sPpl = s ? `${s.name.split(' ')[0]} + ${v.used} staff` : 'No head';
  const sMon = [lvL && `${lvL} · ${money(v.bud.cost)}/wk`, v.fac && `${v.fac.l} level ${v.fac.lv}`].filter(Boolean).join(' · ');
  // B62: the department as rooms. A calm top (the head, how it is going, who wants a word), then one line per room with its key number; a tap opens the full detail
  const row = l => st.rows.find(r => r.l === l) || {}, R = [], add = (id, t, v, vs, line, html, flag) => { if (html) R.push({ id, t, v: v == null ? '' : String(v), vs: vs || '', line: line || '', html, flag }); };
  const A2 = F.analysis();
  if (FP) {
    add('form', 'Results and form', A2.g ? F.ord(A2.pos) : '', A2.g ? `target ${F.ord(A2.target)}` : '', `${row('Points per game').v || '0'} points a game · form ${g.form.slice(-5).join(' ') || 'none yet'}`, () => `<div class="sec">Form</div><div class="panel2">${FP.form}</div><div class="sec">League position</div><div class="panel2">${FP.trend || '<p class="small" style="margin:0">Not enough weeks yet.</p>'}</div>`);
    add('squad', 'The squad, through his eyes', row('Squad quality').v, 'squad quality', `${row('Injured').v || 0} injured · ${row('Squad quality').ref || ''}`, () => `<div class="panel2">${FP.squad || '<p class="small">Nothing yet.</p>'}</div><div class="sec">Fitness</div>${FP.fit}${ftActions()}`, row('Squad quality').ok === false);
    add('how', 'Your mandate and his target', `${Math.round(FV.comp * 100)}%`, 'follows you', FV.deal ? 'A target is agreed with him.' : 'No target agreed yet.', () => `<div class="sec">Target</div>${FP.deal}${ftPlanExtra()}<div class="sec">How he works</div>${how}`, FV.comp < 0.65);
  }
  if (k === 'recruit') {
    const RV = F.recView ? F.recView() : null, SQ = F.squadPlanView ? F.squadPlanView() : null;
    if (SQ) add('sqp', 'The squad plan', '', '', SQ.summary || 'Winter and summer targets.', () => squadPlanHtml());
    if (RV) add('dec', 'The list and the market', row('Recruitment list').v, row('Recruitment list').ref, `Transfer budget ${row('Transfer budget').v || money(RV.budget)} · window ${RV.inWin ? 'open' : 'closed'}`, () => recTiles(RV));
    if (F.rxView) { const n = parseFloat(row('Scouting network, focus').v) || 0; add('scouts', 'Where the scouts look', netW(n), 'network', `${row('Scouts').v || 0} scouts · ${row('Scouting network, focus').ref || ''} · accuracy ${row('Scouting accuracy').v || '?'}`, () => regionCard(F.rxView()), n < 20); }
    if (RV) add('rec', 'Signed this season', String(row('Signings rated vs squad').v || '').split(' vs ')[0], 'signings rated', 'How his signings did against the squad.', () => recRecord(RV));
    if (F.worldLeague) add('portal', 'Scouting portal', '', '', 'Every league in the world. Flag a player yourself.', () => portalCard());
  }
  if (k === 'academy' && g.acad) {
    const pipe = String(row('Pipeline').v || '').split('/').reduce((a, x) => a + (parseInt(x) || 0), 0), AV = F.acView ? F.acView() : null;
    add('kids', 'The players', pipe, 'players', `Best prospect ${row('Best prospect').v || '?'} · ${row('Pipeline').v || ''} by age`, () => acKids());
    add('rec', 'Growth and the first team', row('Graduates in first team').v, 'in first team', row('Graduates in first team').ref, () => acRecord());
    if (AV) add('trial', 'Trial day and intake', AV.trial ? `${AV.trial.list.length}` : 'Wk 28', AV.trial ? 'on trial' : 'trial day', AV.trial ? 'The recruiters are waiting for your brief.' : 'You set what the recruiters look for.', () => acDecisions(AV) + acPyramid(AV), !!AV.trial);
    add('cat', 'Category and facilities', String(row('Category').v || '').replace('Category ', 'Cat '), row('Facilities').v, row('Category').ref, () => `<div class="kgrid">${['Category', 'Facilities', 'Coaching level', 'Reputation', 'Return on investment'].map(l => st.rows.find(r => r.l === l)).filter(Boolean).map(kpiTile).join('')}</div>`, row('Category').ok === false);
  }
  if (k === 'commercial' && F.comView) {
    const CV = F.comView();
    add('match', 'Matchday', row('Stadium fill').v, row('Stadium fill').ref, `Tickets ${row('Ticket price').v || ''} · shop ${row('Merchandise').v || ''}`, () => comOverview(CV), row('Stadium fill').ok === false);
    add('dec', 'Prices, sponsors and events', row('Sponsorship').v, 'sponsors', row('Sponsorship').ref, () => comDecisions(CV));
    add('rec', 'Over the season', '', '', 'Sponsorship and crowds week by week.', () => secCommercial() + `<div class="sec">${esc(v.kpiL[0])}</div><div class="panel2">${spark(v.kpi)}</div>`);
  }
  if (k === 'marketing' && F.mkView) {
    const MV = F.mkView();
    add('fans', 'Supporters', row('Supporter base').v, 'fans', `Mood ${row('Supporter mood').v} · ${row('Supporter base').ref}`, () => mkOverview(MV) + `<div class="sec">Fans over time</div><div class="panel2">${spark(MV.hist || v.kpi)}</div>`, row('Supporter mood').ok === false);
    add('dec', 'Campaigns and community', row('Brand strength').v, 'brand', MV.camp && MV.camp.on ? 'A campaign is running.' : 'Campaigns and the community programme.', () => mkDecisions(MV));
    add('rec', 'Over the season', '', '', 'What she did and what it brought.', () => secMarketing() + (MV.log.length ? `<div class="sec">Recently</div><div class="panel2">${MV.log.map(l => `<p class="small" style="margin:3px 0">Wk ${l.w}: ${esc(l.t)}</p>`).join('')}</div>` : ''));
  }
  if (k === 'business' && F.bizView) {
    add('run', 'Runway and money flow', row('Cash runway').v, '', `Last week ${row('Last week').v || ''} · wages ${row('Player wages vs revenue').v || ''} of revenue`, () => bizOverview(), row('Cash runway').ok === false);
    add('rec', 'Where the money goes', row('Player wages vs revenue').v, row('Player wages vs revenue').ref, 'Every department, every cost.', () => vMoney2(), row('Player wages vs revenue').ok === false);
  }
  if (s && !FP && how) add('how', `How ${esc(s.name.split(' ')[0])} works`, '', '', sHow || 'His mandate and freedom.', () => how);
  add('ppl', s ? 'His people' : 'People', v.used, `of ${v.slots} places`, sPpl, () => peopleHtml);
  if (k !== 'business') add('mon', 'Budget and buildings', v.bud ? money(v.bud.cost) : '', v.bud ? 'a week' : '', sMon || 'Budget and facilities.', () => money_);
  if (st.rows.length) add('num', 'All the numbers', st.rows.length, 'figures', st.rows.slice(0, 3).map(r => r.l).join(', '), () => `<div class="kgrid">${st.rows.map(kpiTile).join('')}</div>`);
  { const dh = s ? deskHist(role) : ''; if (dh) add('calls', 'His calls', '', '', 'What he decided for you, and how it went.', () => dh); }
  const ALIAS = { plan: 'how', dec: R.some(x => x.id === 'dec') ? 'dec' : 'how', record: R.some(x => x.id === 'rec') ? 'rec' : 'calls', data: 'num', people: 'ppl' };
  const rid = ALIAS[U.dtab] || U.dtab, room = R.find(x => x.id === rid);
  const strip = s ? `<div class="hmini"><span class="dface">${ART.staffFace(role)}</span><span class="dt"><b>${esc(s.name)}</b><small>${esc(F.ROLE[role].t)} · relationship ${relW(s.rel)}</small></span>${headBtns(role)}</div>` : '';
  if (room) return `<div class="dflat"><div class="ohead"><button class="iconbtn" data-a="dtab" data-v="now" aria-label="Back to ${esc(d.t)}">${ART.I.back}</button><span class="pos">${esc(d.t)}</span></div><h2 class="dr-h">${room.t}</h2>${room.html()}</div>`;
  const top = s ? verdictCard(st, role, s) + needsHtml(k, role, d) + agrHtml(k) : headCard(k, v);
  const list = `<div class="sec">The department</div><div class="dr-l">${R.map(x => `<button class="dr" data-a="dtab" data-v="${x.id}"><b>${x.t}</b>${x.v ? `<span class="dr-v">${esc(x.v)}${x.vs ? `<small>${esc(x.vs)}</small>` : ''}</span>` : ''}<span class="dr-s${x.flag ? ' bad' : ''}">${esc(x.line)}</span></button>`).join('')}</div>`;
  return `<div class="dflat">${head}${strip}${top}${list}</div>`;
}
