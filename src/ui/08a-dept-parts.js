/* ---------- department parts: words for numbers, attention, plan, record ---------- */
// words before numbers (P4): the word says good or bad, the number stays for those who dig
const relW = v => v >= 75 ? 'close' : v >= 55 ? 'good' : v >= 35 ? 'cool' : 'cold';
const compW = c => c >= 0.85 ? 'closely' : c >= 0.65 ? 'mostly' : 'loosely';
const netW = n => n >= 60 ? 'Strong' : n >= 40 ? 'Workable' : n >= 20 ? 'Thin' : 'Barely there';
const gapW = d => { const a = Math.abs(d); return a >= 15 ? `His own way (${d > 0 ? '+' : '−'}${a}) · costs trust` : a >= 8 ? `Drifts a little (${d > 0 ? '+' : '−'}${a})` : 'As agreed'; };
const DEPT_OF = { coach: 'first', dof: 'recruit', scout: 'recruit', acad: 'academy', com: 'commercial', mkt: 'marketing', fin: 'business' };
// a KPI tile: a word where a bare number would not say enough
function kpiTile(r) {
  let b = r.v, sub = r.ref || '';
  const mm = /-?\d+(\.\d+)?/.exec(String(r.v)), n = mm ? parseFloat(mm[0]) : NaN;
  if (r.l === 'Scouting network, focus' && isFinite(n)) { b = netW(n); sub = `${Math.round(n)} of 100 · ${r.ref || ''}`; }
  if (r.l === 'Scouting accuracy' && isFinite(n)) { b = n <= 0.6 ? 'Sharp' : n <= 1.1 ? 'Fair' : 'Rough'; sub = `off by ${r.v} · ${r.ref || ''}`; }
  if (r.l === 'Squad quality' && isFinite(n)) { b = r.ok === true ? 'Above par' : r.ok === false ? 'Below par' : 'Par'; sub = `${r.v} · ${r.ref || ''}`; }
  return `<div class="kt ${r.ok === true ? 'good' : r.ok === false ? 'bad' : ''}"><small>${esc(r.l)}</small><b>${esc(b)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div>`;
}
function attAttr(x) {
  if (x.a === 'talk') return `data-a="cv-open" data-r="${x.x}"`;
  if (x.a === 'mand') return `data-a="sheet" data-s="mand" data-r="${x.x}"`;
  if (x.a === 'dept') return `data-a="dept" data-k="${x.x}"`;
  return `data-a="dtab" data-v="${x.a}"`;
}
function attHtml(st) {
  const A = st.att || [];
  return `<p class="verd"><b>${esc(st.verdict.w)}.</b> ${esc(st.verdict.t)}</p>
  <div class="sec">Needs you</div>${A.length ? `<div class="attl">${A.map(x => `<div class="att"><p>${esc(x.t)}</p><button class="btn ghost small" ${attAttr(x)}>${esc(x.l)}</button></div>`).join('')}</div>` : '<div class="panel2"><p class="small" style="margin:0">Nothing here needs you this week.</p></div>'}`;
}
// what the head decided for you: the desk keeps the last calls per head
function deskHist(role) {
  const h = role === 'scout' ? 'dof' : role, b = ((G().desk || {}).by || {})[h], L = b && b.hist ? b.hist.slice().reverse() : [];
  return `<div class="sec">What he decided for you</div><div class="panel2">${L.length ? L.map(x => `<div class="scr2"><span>${esc(x.t)}<small>Week ${x.w}, season ${x.s}: ${esc(x.c)}</small></span>${x.err ? '<b class="bad">Against mandate</b>' : '<b class="good">In line</b>'}</div>`).join('') : '<p class="small" style="margin:0">No calls yet. Routine matters he settles within his authority appear here.</p>'}</div>`;
}

/* ---------- recruitment ---------- */
function recTiles(V) {
  const g = G(), thr = V.threshold === Infinity ? 'Never' : V.threshold === 0 ? 'Every deal' : 'Over ' + money(Math.round(V.threshold));
  const pr = V.plan.prios.length ? `<div class="traits">${V.plan.prios.map(x => `<span>${F.POS_L[x.pos]}: ${esc(F.REC_KINDS[x.kind].toLowerCase())}</span>`).join('')}</div>` : '<p class="small" style="margin:0">No priorities set. The DoF follows squad needs.</p>';
  return `<div class="sec">Money and rules</div><div class="kgrid"><div class="kt"><small>Transfer budget</small><b>${money(V.budget)}</b><span>set by Finance</span></div><div class="kt ${V.inWin ? 'good' : ''}"><small>Window</small><b>${V.inWin ? 'Open' : 'Closed'}</b><span>${V.inWin ? (g.phase === 'summer' ? 'Summer' : `Shuts after week ${g.week <= 2 ? 2 : 18}`) : g.week < 17 && g.phase === 'season' ? 'Opens week 17' : 'Opens in summer'}</span></div><div class="kt"><small>You approve</small><b>${thr}</b><span>DoF mandate</span></div><div class="kt"><small>Wage limit</small><b>${V.wageLimit === Infinity ? 'None' : money(Math.round(V.wageLimit))}</b><span>${V.wageLimit === Infinity ? 'DoF mandate' : 'per week · DoF mandate'}</span></div></div>
  <div class="sec">Priorities <button class="linkbtn" data-a="recplan" style="margin:0 0 0 auto">Edit</button></div><div class="panel2">${pr}</div>`;
}
// one card per region: how strong the network is, where the scouts look, and a trip
function regionCard(X) {
  return `<div class="sec">Where the scouts look</div><div class="panel2"><div class="regl">${X.regions.map(r => `<div class="regr"><span><b>${esc(r.t)}</b><small>${netW(r.net)} (${r.net})${r.focus === 1 ? ' · main focus' : r.focus === 2 ? ' · second focus' : ''}</small></span><button class="btn small ${r.focus ? '' : 'ghost'}" data-a="rx-focus" data-k="${r.k}" ${r.focus === 1 ? 'disabled' : ''} aria-label="Make ${esc(r.t)} the main focus">${r.focus === 1 ? 'Main' : r.focus === 2 ? 'Second' : 'Focus'}</button><button class="btn small ghost" data-a="rx-invest" data-k="${r.k}" ${X.investIn ? 'disabled' : ''} aria-label="Scouting trip to ${esc(r.t)}">Trip</button></div>`).join('')}</div>
  <p class="small" style="margin:6px 0 0">Focus is free: the old main focus becomes the second. A trip costs ${money(X.cost)} and grows one network fast${X.investIn ? `; next one in ${X.investIn} wk` : ', once every 8 weeks'}.</p></div>`;
}
function recRecord(V) {
  const g = G(), R = V.r, groups = ['identified', 'scouted', 'recommended', 'approach', 'negotiating'];
  const live = V.rows.filter(o => groups.includes(o.x.stage)), done = V.rows.filter(o => !groups.includes(o.x.stage)).slice(-6).reverse();
  const cnt = st => live.filter(o => o.x.stage === st).length, mx = Math.max(1, ...groups.map(cnt));
  const funnel = `<div class="funnel">${groups.map(st => `<div class="fstep"><b>${cnt(st)}</b><i style="height:${8 + cnt(st) / mx * 40}px"></i><small>${esc(STG_L[st])}</small></div>`).join('')}</div>`;
  const sect = st => { const rs = live.filter(o => o.x.stage === st).sort((a, b) => (a.k ? a.k.grade : 'Z').localeCompare(b.k ? b.k.grade : 'Z')), lim = st === 'scouted' || st === 'identified' ? 5 : 8; return rs.length ? `<div class="sub2">${esc(STG_L[st])} <span>${rs.length}</span></div>${rs.slice(0, lim).map(recRow).join('')}${rs.length > lim ? `<p class="small" style="margin:4px 0">And ${rs.length - lim} more.</p>` : ''}` : ''; };
  // signings: one list with the verdict, the fee and the scout's estimate
  const ev = F.recEval ? F.recEval(g.season) : [], fee = n => { const l = R.log.find(x => x.name === n); return l ? l.fee : null; };
  const evs = ev.map(e => { const f = e.fee != null ? e.fee : fee(e.name); return `<div class="scr2"><span>${esc(e.name)} <small>${e.pos}${e.loan ? ', loan' : ''}, ${f ? money(f) : 'free'}. Scouted ${e.est != null ? e.est + '★' : '–'}, now ${e.now != null ? e.now + '★' : '–'}, ${e.apps || 0} apps</small></span><b class="vchip ${e.cls}">${esc(e.verdict)}</b></div>`; }).join('');
  const scouts = V.scouts.map(sc => { const acc = F.recScoutAcc(sc), chief = sc === F.staff('scout'); return `<div class="pcard2 ${chief ? 'senior' : ''}"><span class="pf">${ART.face(sc.id * 31 + 3, { role: 'scout', age: sc.age || 40, bg: '#fff' })}</span><span class="pm"><b>${esc(sc.name)}</b><small>${chief ? 'Chief scout. ' : ''}${sc.assign ? esc(sc.assign.label) : 'Between assignments'}</small><small class="pw">Knows ${esc(F.REGIONS[sc.home || 'dom'].name)} best. ${sc.reports || 0} reports${acc ? `, off by ${acc.err.toFixed(1)}★ on average` : ''}</small></span><span></span></div>`; }).join('');
  return `<div class="sec">On the list</div><div class="panel2">${funnel}${live.length ? groups.slice().reverse().map(sect).join('') : `<p class="small">${V.scouts.length ? 'Nobody on the list right now. The scouts file new reports every week.' : 'Nobody on the list, and no chief scout to find anyone.'}</p>`}${done.length ? `<details class="more"><summary>Recent outcomes (${done.length}) ${ART.I.chev}</summary>${done.map(recRow).join('')}</details>` : ''}<p class="small" style="margin:6px 0 0">Grades: A clear upgrade, B good addition, C squad level, D not for us.</p></div>
  <div class="sec">Signed this season</div><div class="panel2">${evs || '<p class="small" style="margin:0">No signings yet this season.</p>'}${evs ? '<p class="small" style="margin:6px 0 0">Hit: a regular with good ratings. Miss: rarely plays or rates poorly.</p>' : ''}</div>
  <div class="sec">The scouts</div>${scouts || '<p class="small">No chief scout. Nobody is watching players.</p>'}`;
}

/* ---------- academy: the record as four questions ---------- */
function acRecord() {
  const g = G(), v = F.acadView(), a = v.a, last = a.lastSeason, sel = U.ag || 'U18', grpD = v.groups.find(x => x.k === sel) || v.groups[0];
  const intake = `<div class="sec">Is the intake good?</div><div class="panel2"><p class="small" style="margin:0 0 6px">${esc(F.acadCatName(v.cat))}, score ${Math.round(v.catScore.total)}. Category 3 from 55, 2 from 75, 1 from 95. Audit in week 30.</p>${v.catScore.parts.map(p => mrow('academy', esc(p[0]), p[1], p[2], `${Math.round(p[1])} of ${p[2]}`)).join('')}<p class="small" style="margin:6px 0 0">A better category brings better intakes, a grant, international recruitment and higher fees when rivals poach.</p></div>`;
  const kids = `<div class="sec">Are the kids growing?</div><div class="panel2">${acPyramid(F.acView())}</div>
  <div class="seg wide" style="margin:8px 0">${['U14', 'U16', 'U18', 'U21'].map(k => `<button class="${sel === k ? 'on' : ''}" data-a="ag" data-v="${k}">${k}</button>`).join('')}</div>
  <div class="pcards">${grpD.players.map(p => `<button class="pcd" data-a="player" data-id="${p.id}"><span class="pf">${ART.face(p.id * 17 + 11, { role: 'youth', age: p.age, region: p.region, c1: g.club.colors[0], c2: g.club.colors[1], bg: '#fff', emo: p.wel < 40 ? 'worried' : null })}</span><span class="pm"><b>${esc(p.name)}</b><small>${p.age}, ${F.POS_L[p.pos]}${p.playUp ? ', plays up' : ''}${p.loanOut ? ', on loan' : ''}</small><span class="strengths">${strengths(p)}</span></span><span class="pr"><span class="stx">${F.absStars(p.ca)}★</span><small class="small">pot ${p.band[0]}–${p.band[1]}★</small>${p.wel < 40 ? '<small class="bad">welfare low</small>' : p.edu < 40 ? '<small class="bad">school slipping</small>' : ''}</span></button>`).join('') || `<p class="small">No players in the ${sel} group.</p>`}</div>
  <p class="small">Coaching level ${grpD.lv.toFixed(1)} of 10. Low welfare or school results lead to drop-outs.</p>`;
  const reach = `<div class="sec">Do they reach the first team?</div><div class="panel2">${a.log.length ? a.log.slice().reverse().slice(0, 8).map(l => `<div class="scr2"><span>${esc(l.name)}<small>${l.pos}, promoted in season ${l.season}</small></span><b>${l.pot}★ potential</b></div>`).join('') : '<p class="small" style="margin:0">No graduates yet.</p>'}
  ${last ? `<details class="more"><summary>Last season in the academy ${ART.I.chev}</summary>${[['Promoted to first team', last.promoted], ['New scholars', last.scholars], ['Kept as under-21s', last.u21], ['On loan', last.loans], ['Released', last.released], ['Dropped out', last.dropped]].map(([l, x]) => `<p class="small"><b>${l}:</b> ${esc(x.join(', ') || 'none')}</p>`).join('')}</details>` : ''}</div>`;
  const roi = `<div class="sec">Is it worth the money?</div><div class="money1 panel2"><div><small>Spent</small><b>${money(v.roi.spent)}</b></div><div><small>Earned</small><b>${money(v.roi.earned)}</b></div><div><small>Net</small><b class="${v.roi.net >= 0 ? 'good' : 'bad'}">${v.roi.net >= 0 ? '+' : ''}${money(v.roi.net)}</b></div></div><p class="small">Earned counts sales, fees and grants; net adds the value of graduates in the squad.</p>`;
  const youth = `<details class="more"><summary>Youth leagues and cup ${ART.I.chev}</summary>${['U18', 'U21'].map(k => { const t = v.lg[k], me = t.findIndex(x => x.id === 0); return `<h3>${k} league</h3><table><thead><tr><th>Team</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>${t.map((x, i) => i < 4 || Math.abs(i - me) <= 1 ? `<tr class="${x.id === 0 ? 'me' : ''}"><td>${i + 1}. ${esc(x.n)}</td><td>${x.p}</td><td>${sign(x.gf - x.ga)}</td><td>${x.pts}</td></tr>` : '').join('')}</tbody></table>`; }).join('')}<h3>Youth Cup</h3>${v.cup && v.cup.log.length ? v.cup.log.map(l => `<p class="small">${cap(l.rd)}: ${esc(l.opp)}, <b class="${l.win ? 'good' : 'bad'}">${l.win ? 'won' : 'lost'}</b></p>`).join('') : '<p class="small">First round in week 9.</p>'}${v.honours.length ? `<p class="small">Honours: ${esc(v.honours.join(', '))}.</p>` : ''}</details>`;
  return intake + kids + reach + roi + youth;
}
function acStaff() {
  const v = F.acadView();
  return `<div class="sec">Academy staff</div><p class="small">The Academy Director appoints and replaces these coaches himself.</p>${v.staff.map(({ r, s }) => s ? `<div class="pcard2"><span class="pf">${ART.face(s.id * 13 + 7, { role: 'acad', age: s.age, bg: '#fff' })}</span><span class="pm"><b>${esc(s.name)}</b><small>${esc(r.t)}, ${starsTxt(F.stars((s.at[0] + s.at[1] + s.at[2]) / 3))}</small><small class="pw">${esc(s.bio)}. ${money(s.wage)}/wk</small></span><span></span></div>` : `<div class="pcard2"><span class="pf empty">${ART.I.staff}</span><span class="pm"><b>${esc(r.t)}</b><small>Vacant. The Academy Director fills it at season end.</small></span><span></span></div>`).join('')}`;
}

/* ---------- first team plan: where youth minutes come from, academy rules, medical ---------- */
function ftPlanExtra() {
  const g = G(), v = F.ftView(), PV = F.pwView ? F.pwView() : null, src = [];
  const ym = F.man('coach', 'youthMins'), act = F.cact('youthMins');
  src.push(`your mandate: ${ym >= 60 ? 'blood youngsters' : ym <= 35 ? 'trust veterans' : 'balanced'}${Math.abs(act - ym) >= 8 ? ` (he plays it ${act > ym ? 'younger' : 'older'})` : ''}`);
  if (PV && PV.ag && PV.stage !== 'closed' && PV.ag.route !== 'exp') src.push(`the ${esc(PV.tname)} agreement`);
  if (v.deal && v.deal.k === 'youth') src.push('his target to start more youngsters');
  if (v.pushN) src.push(`${v.pushN} request${v.pushN === 1 ? '' : 's'} for more minutes`);
  const prot = +F.man('acad', 'minGrads'), ment = F.man('acad', 'mentors') === 'yes';
  const push = g.push.medical > 0;
  return `<div class="sec">Youth minutes</div><div class="panel2"><p class="small" style="margin:0">Come from: ${src.join(' · ')}.${v.u21pm != null ? ` Result: ${v.u21pm.toFixed(1)} under-21s start per match.` : ''}</p>
  <p class="small" style="margin:6px 0 0">From the academy mandate: ${prot ? `${prot} academy player${prot === 1 ? '' : 's'} the DoF may not sell` : 'no academy players protected from sale'}; ${ment ? 'senior pros mentor the scholars' : 'no first-team mentors'}.</p>${F.staff('acad') ? '<button class="linkbtn" data-a="sheet" data-s="mand" data-r="acad">Academy mandate · 1 action</button>' : ''}</div>
  <div class="sec">Medical</div><div class="panel2"><p class="small" style="margin:0 0 8px">${push ? `Medical push active: fewer injuries and faster recovery, ${g.push.medical} week${g.push.medical === 1 ? '' : 's'} left.` : 'A medical push means fewer injuries and faster recovery for three weeks.'}</p><button class="btn ghost wide" data-a="push" data-d="medical" ${push || g.ap < 1 ? 'disabled' : ''}>Medical push · 1 action</button></div>`;
}

/* ---------- talks: requests on Now, the scene (B19) ---------- */
function wantsHtml(k, st) {
  const rq = F.convoReqs ? F.convoReqs(k) : [];
  const cards = rq.map(r => `<div class="att"><p><b>${esc(F.staff(r.role).name.split(' ')[0])} wants a word.</b> ${esc(r.t)}${r.left <= 1 ? ' <span class="small">If you wait, he decides himself.</span>' : ''}</p><button class="btn small" data-a="cv-open" data-r="${r.role}" data-q="1">Hear him out</button></div>`).join('');
  return `<p class="verd"><b>${esc(st.verdict.w)}.</b> ${esc(st.verdict.t)}</p>${cards ? `<div class="attl">${cards}</div>` : `<p class="small">Nothing he needs from you this week. Talk to him any time; it is free.</p>`}`;
}
function cvTalkHtml(T) {
  const role = T.role, s = F.staff(role); if (!s) return '';
  const coach = role === 'coach', last = T.log.slice(-3), ans = coach ? 'ft-ans' : 'cv-ans', cls = coach ? 'ft-talk-close' : 'cv-close';
  const emo = T.done ? (T.fx.some(x => /down|deflated|−/i.test(x)) ? 'worried' : 'happy') : null;
  U.tray = T.done ? trayHtml('', `<button class="btn" data-a="${cls}">Back to the department</button>`, '') : trayHtml('<span>You say</span>', T.opts.map((o, j) => choiceHtml({ l: o.t, h: o.fx }, j, `data-a="${ans}" data-id="${o.id}"`, false, false)).join(''), '');
  U.trayH = T.done ? 90 : 60 + T.opts.length * 66;
  return `<div class="ftalk">${sceneHtml(role, s.name, 'talk', 'In his office', '', emo)}${last.map((l, i) => l.who === 'you' ? `<p class="you-said">You: ${esc(l.t)}</p>` : `<div class="bubble ${i < last.length - 1 ? 'old' : ''}">${esc(l.t)}${ticOf(role, l.t) ? `<span class="tic">${esc(ticOf(role, l.t))}</span>` : ''}</div>`).join('')}${T.done && T.fx.length ? `<div class="fxrow">${T.fx.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>` : ''}</div><div class="trayspace" style="--tray:${U.trayH}px"></div>`;
}
