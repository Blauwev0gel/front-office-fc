/* ---------- views: title & setup ---------- */
function vTitle() {
  const C = PALETTES[0];
  return `<div class="title2"><svg class="tscene" viewBox="0 0 360 200" aria-hidden="true"><defs><pattern id="td" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="rgba(0,0,0,.08)"/></pattern></defs><rect width="360" height="200" fill="#a9cce6"/><circle cx="300" cy="44" r="18" fill="#f6d86b" stroke="#16201b" stroke-width="3"/><rect y="130" width="360" height="70" fill="#4f8d5c"/><path d="M0 130h360" stroke="#16201b" stroke-width="3"/><path d="M60 132 L84 92 L276 92 L300 132Z" fill="${C[0]}" stroke="#16201b" stroke-width="3"/><rect x="92" y="100" width="176" height="8" fill="#f3d36b"/><path d="M110 92v-22M250 92v-22" stroke="#16201b" stroke-width="3"/><circle cx="110" cy="66" r="6" fill="#fff" stroke="#16201b" stroke-width="2.5"/><circle cx="250" cy="66" r="6" fill="#fff" stroke="#16201b" stroke-width="2.5"/><rect width="360" height="200" fill="url(#td)"/></svg>
  <div class="tbody"><h1>The Front Office</h1><p class="tag">You run the club. Not the team.</p><p>Found a club at the bottom of the pyramid. Hire the people, set their mandates and live with the results.</p></div></div>
  ${trayHtml('', `<button class="btn" data-a="new">Found a club</button><button class="btn ghost" data-a="sheet" data-s="quick">Start with a base club</button>${hasSave() ? '<button class="btn ghost" data-a="continue">Continue your club</button>' : ''}`, 'Saves automatically in this browser')}`;
}
function vSetupDNA() {
  const s = U.setup, steps = F.DNA.length + 2, pal = PALETTES[s.col];
  const prog = `<div class="progress">${Array.from({ length: steps }, (_, i) => `<i class="${i === s.step ? 'on' : i < s.step ? 'done' : ''}"></i>`).join('')}</div>`;
  if (s.step === 0) {
    return `<div class="setup">${prog}<div class="crestbig">${crest(pal, s.short || (s.city || 'FC').slice(0, 3).toUpperCase(), 96)}</div><h1 class="sh1">Name your club</h1>
    <div class="fields"><label>Town or city<input type="text" id="f-city" value="${esc(s.city)}" placeholder="Harwick" maxlength="20"></label>
    <label>Club name<input type="text" id="f-name" value="${esc(s.name)}" placeholder="Harwick Athletic" maxlength="28"></label>
    <label>Short name<input type="text" id="f-short" value="${esc(s.short)}" placeholder="HAR" maxlength="3"></label></div>
    <div class="sec">Colours: ${esc(pal[2])}</div><div class="cols2">${PALETTES.map((p, i) => `<button data-a="col" data-i="${i}" class="${s.col === i ? 'on' : ''}" aria-label="${p[2]}"><i style="background:${p[0]}"></i><i style="background:${p[1]}"></i></button>`).join('')}</div>
    <div class="trayspace" style="--tray:100px"></div></div>${trayHtml('', `<button class="btn" data-a="s-next">Next: the club's DNA</button>`, '')}`;
  }
  if (s.step <= F.DNA.length) {
    const q = F.DNA[s.step - 1], cur = s.dna[q.k];
    return `<div class="setup">${prog}<div class="kick">Club DNA, ${s.step} of ${F.DNA.length}</div><h1 class="sh1">${esc(q.q)}</h1>
    <div class="dnacards">${q.o.map(o => `<button class="dnacard ${cur === o.v ? 'on' : ''}" data-a="dna" data-k="${q.k}" data-v="${o.v}"><b>${esc(o.l)}</b><span>${esc(clip2(o.d)[0])}</span><small>${esc(o.e)}</small></button>`).join('')}</div>
    <div class="trayspace" style="--tray:100px"></div></div>${trayHtml('', `<div class="row2"><button class="btn ghost" data-a="s-back">Back</button><button class="btn" data-a="s-next" ${cur ? '' : 'disabled'}>Next</button></div>`, '')}`;
  }
  const lab = (k, v) => F.DNA.find(q => q.k === k).o.find(o => o.v === v).l;
  return `<div class="setup">${prog}<div class="crestbig">${crest(pal, s.short, 110)}</div><h1 class="sh1" style="text-align:center">${esc(s.name)}</h1><p class="small" style="text-align:center">Founded in ${esc(s.city)}. The board, the fans and your staff will hold you to this DNA.</p>
  <div class="traits" style="justify-content:center;margin:12px 0">${F.DNA.map(q => `<span>${esc(lab(q.k, s.dna[q.k]))}</span>`).join('')}</div>
  <div class="trayspace" style="--tray:100px"></div></div>${trayHtml('', `<div class="row2"><button class="btn ghost" data-a="s-back">Back</button><button class="btn" data-a="found">Found ${esc(s.name)}</button></div>`, '')}`;
}
function staffCard(s, role, opts = {}) {
  const R = F.ROLE[role], L = F.LEAN[role], ln = s.lean >= 60 ? L[2] : s.lean <= 40 ? L[1] : 'Open-minded on ' + (L[0] === 'data' ? 'data vs instinct' : 'this');
  const P = s.p, pers = [P.ego > 14 ? 'Big ego' : P.ego < 7 ? 'Humble' : '', P.loy > 14 ? 'Loyal' : P.loy < 7 ? 'Mercenary' : '', P.risk > 14 ? 'Risk-taker' : P.risk < 7 ? 'Cautious' : '', P.amb > 14 ? 'Very ambitious' : P.amb < 7 ? 'Content' : ''].filter(Boolean);
  return `<div class="staff ${opts.on ? 'card on' : ''}" ${opts.click ? `data-a="${opts.click}" data-r="${role}" data-i="${opts.i}" role="button" tabindex="0"` : ''}>
    <div class="spread"><div><div class="role">${esc(opts.title || R.t)}</div><h3>${esc(s.name)}</h3></div><div class="num" style="text-align:right">${stars(F.stars(F.ovr(s)))}<div class="small">${money(s.wage)}/wk</div></div></div>
    <div class="small">${s.age}, ${esc(s.bio)}.</div>
    ${R.at.map((a, i) => `<div class="attr"><span>${a}</span>${bar(s.at[i], 20, 'ink')}<span class="num">${s.at[i]}</span></div>`).join('')}
    <div class="chips">${pers.map(x => `<span class="chip">${x}</span>`).join('')}<span class="chip">${esc(ln)}</span>${s.style ? `<span class="chip">Style: ${F.STYLES[s.style]}</span>` : ''}</div>
    ${opts.live ? numbers(role) : ''}
    ${opts.live ? meter('Relationship', s.rel) + meter('Performance', s.perf) + `<div class="small">${s.track && (s.track.ok + s.track.fail) ? `Projects delivered: ${s.track.ok} of ${s.track.ok + s.track.fail}. ` : ''}Contract: ${s.contract} season${s.contract === 1 ? '' : 's'} left. ${s.boostW > 0 ? (s.boost >= 0 ? 'Fired up after your last talk.' : 'Deflated after your last talk.') : ''}</div>` : ''}
    ${opts.actions || ''}</div>`;
}
function numbers(role) { const rc = F.record(role); return `<div style="border-top:1px solid var(--rule);margin-top:4px;padding-top:6px"><div class="spread"><b style="font-family:var(--head);font-weight:500">The numbers</b><b class="${rc.verdict === 'Strong' ? 'good' : rc.verdict === 'Poor' ? 'bad' : ''}" style="font-family:var(--head)">${rc.verdict}</b></div><dl class="kv">${rc.lines.map(([l, v, ok]) => `<dt>${esc(l)}</dt><dd class="${ok === true ? 'good' : ok === false ? 'bad' : ''}">${esc(v)}</dd>`).join('')}</dl></div>`; }
function vSetupStaff() {
  const g = G(), budget = F.staffBudget(); let total = 0; for (const r in U.hire) total += g.cands[r][U.hire[r]].wage;
  const ok = U.hire.dof != null && U.hire.coach != null, role = U.hireRole || 'dof', R = F.ROLE[role];
  const tabs = `<div class="mtabs">${F.ROLES.map(r => `<button class="${role === r.id ? 'on' : ''}" data-a="hire-tab" data-r="${r.id}"><span class="mface ${U.hire[r.id] != null ? 'done' : ''}">${U.hire[r.id] != null ? ART.face(g.cands[r.id][U.hire[r.id]].id * 31 + 3, { role: r.id, age: g.cands[r.id][U.hire[r.id]].age, bg: '#fff' }) : ART.I.staff}</span><small>${esc(r.s)}</small></button>`).join('')}</div>`;
  const cand = (s, i) => { const P = s.p, tr = [P.ego > 14 ? 'Big ego' : P.ego < 7 ? 'Humble' : '', P.loy > 14 ? 'Loyal' : P.loy < 7 ? 'Mercenary' : '', P.risk > 14 ? 'Risk-taker' : P.risk < 7 ? 'Careful' : '', P.amb > 14 ? 'Ambitious' : ''].filter(Boolean).slice(0, 3);
    return `<button class="cand ${U.hire[role] === i ? 'on' : ''}" data-a="pick" data-r="${role}" data-i="${i}"><span class="cf">${ART.face(s.id * 31 + 3, { role, age: s.age, bg: '#fff', emo: U.hire[role] === i ? 'happy' : null })}</span><span class="cm"><b>${esc(s.name)}</b><small>${s.age}, ${esc(s.bio)}</small><span class="traits">${tr.map(x => `<span>${x}</span>`).join('')}</span>${R.at.map((a, k) => `<span class="mrow small2"><span>${esc(a)}</span><i><b style="width:${s.at[k] * 5}%"></b></i><em>${s.at[k]}</em></span>`).join('')}</span><span class="cr">${starsTxt(F.stars(F.ovr(s)))}<small>${money(s.wage)}/wk</small></span></button>`; };
  return `<div class="setup"><div class="sumhead"><h1>Hire your staff</h1><span class="chip" style="margin-left:auto">${Object.keys(U.hire).length} of ${F.ROLES.length}</span></div>${tabs}
  <h2 class="itemh">${esc(R.t)}</h2><p class="small" style="margin:0 0 8px">${role === 'dof' || role === 'coach' ? 'Required.' : 'Optional, but a vacant role runs on chance.'}</p>
  <div class="cands">${g.cands[role].map(cand).join('')}</div>${U.hire[role] != null && role !== 'dof' && role !== 'coach' ? `<button class="linkbtn" data-a="unpick" data-r="${role}">Leave vacant</button>` : ''}
  <div class="trayspace" style="--tray:150px"></div></div>${trayHtml(`<span>Staff wages ${money(total)} of ${money(budget)}/wk</span><span class="${total > budget ? 'bad' : ''}">${total > budget ? 'Over budget' : 'Within budget'}</span>`, `<div class="budgetbar"><b class="${total > budget ? 'over' : ''}" style="width:${Math.min(100, total / budget * 100)}%"></b></div><button class="btn" data-a="hire-all" ${ok ? '' : 'disabled'}>${ok ? 'Confirm appointments' : 'Pick a DoF and a coach'}</button>`, '')}`;
}
/* ---------- mandates as a tactics board ---------- */
const PRESETS = {
  dof: [['Win now', { youth: 20, data: 45, sell: 20, depth: 60, hard: 35, maxFee: '100', maxAge: '32' }], ['Moneyball', { youth: 60, data: 85, sell: 70, depth: 45, hard: 75, maxFee: '50', maxAge: '28' }], ['Youth first', { youth: 90, data: 50, sell: 55, depth: 50, hard: 50, maxFee: '25', maxAge: '24' }]],
  coach: [['Solid', { attack: 30, youthMins: 25, rotation: 25, intensity: 50 }], ['Attack', { attack: 80, youthMins: 40, rotation: 35, intensity: 65 }], ['Develop', { attack: 55, youthMins: 80, rotation: 55, intensity: 55 }]],
  scout: [['Ready now', { potential: 20, data: 45, budget: 45 }], ['Hidden gems', { potential: 80, data: 70, budget: 55 }], ['Lean', { potential: 50, data: 50, budget: 25 }]],
  acad: [['Patient', { pace: 25, technical: 60, budget: 45, philosophy: 20 }], ['Fast-track', { pace: 80, technical: 50, budget: 60, philosophy: 35 }], ['Business', { pace: 60, technical: 50, budget: 35, philosophy: 30 }]],
  com: [['Community', { tickets: 25, selectivity: 75, merch: 30 }], ['Balanced', { tickets: 45, selectivity: 50, merch: 50 }], ['Maximise', { tickets: 75, selectivity: 20, merch: 80 }]],
  mkt: [['Local', { reach: 15, tone: 25, budget: 40 }], ['Growth', { reach: 70, tone: 55, budget: 65 }], ['Lean', { reach: 40, tone: 35, budget: 25 }]],
  fin: [['Cautious', { risk: 15, transfer: 35, invest: 30, wageCap: '60' }], ['Balanced', { risk: 35, transfer: 50, invest: 40, wageCap: '70' }], ['Ambitious', { risk: 70, transfer: 75, invest: 60, wageCap: '85' }]]
};
const END_IC = { Experience: 'star', Youth: 'youth', "Scout's eye": 'scout', Data: 'info', 'Keep the core': 'trust', 'Sell for profit': 'money', 'Lean squad': 'staff', 'Deep squad': 'squad', 'Soft negotiator': 'trust', 'Hard negotiator': 'risk', Defensive: 'board', Attacking: 'league', 'Trust veterans': 'star', 'Blood youngsters': 'youth', 'Settled XI': 'squad', 'Heavy rotation': 'staff', 'Light training': 'time', 'Intense training': 'risk', Proven: 'star', Potential: 'youth', 'Lean spend': 'money', 'Lavish spend': 'money', 'Cheap tickets': 'fans', 'Premium tickets': 'money', Cautious: 'trust', Aggressive: 'risk', 'Hold cash': 'money', 'Fund transfers': 'squad', 'Cut costs': 'money', 'Invest in facilities': 'stadium', 'Local community': 'fans', 'Global audience': 'press', Safe: 'trust', Edgy: 'risk', Patient: 'time', 'Fast-track': 'youth', Physical: 'staff', Technical: 'star', 'Any money': 'money', 'Values first': 'trust', 'Low-key': 'fans', 'Hard sell': 'money', 'Develop players': 'youth', 'Win youth games': 'league', 'Recruit widely': 'scout', 'Local kids only': 'fans' };
function says(role, k, v, lo, hi) {
  const S = { dof: { youth: v > 65 ? 'Mostly players under 25 with room to grow. Fewer ready-made starters.' : v < 35 ? 'Experienced players who start now. Little resale value.' : 'A mix of ready players and prospects.', data: v > 65 ? 'Numbers decide. Fewer surprises, fewer gambles on instinct.' : v < 35 ? 'Trusts what the scouts see in person.' : 'Scouts and data weigh the same.', sell: v > 65 ? `Sells a starter if someone offers about ${(1.6 - v / 250).toFixed(1)}× his value.` : v < 35 ? 'Keeps the core together, even for big offers.' : 'Sells at a clearly good price.', depth: v > 65 ? 'A big squad with cover everywhere. Higher wage bill.' : v < 35 ? 'A small squad, every wage counts. Injuries hurt.' : 'Normal cover in every position.', hard: v > 65 ? 'Haggles hard: cheaper deals, more lost targets.' : v < 35 ? 'Pays the asking price to get it done.' : 'Negotiates, but closes.' },
    coach: { attack: v > 65 ? 'Goes for goals and concedes more.' : v < 35 ? 'Sits deep and keeps it tight.' : 'Balanced approach.', youthMins: v > 65 ? 'Young players get real minutes.' : v < 35 ? 'Veterans first, kids wait.' : 'Picks on form, whatever the age.', rotation: v > 65 ? 'Rotates a lot: fresher legs, less rhythm.' : v < 35 ? 'Same eleven every week.' : 'Rotates when needed.', intensity: v > 65 ? 'Hard sessions: sharper team, more injuries.' : v < 35 ? 'Light sessions: fewer injuries, less sharp.' : 'Normal training load.' } };
  const t = S[role] && S[role][k]; return t || (v > 65 ? `Leans to ${hi.toLowerCase()}.` : v < 35 ? `Leans to ${lo.toLowerCase()}.` : 'Balanced.');
}
function sliderRows(role, m, prefix) {
  const D = F.MAND[role], P = PRESETS[role] || [];
  const isP = vals => Object.entries(vals).every(([k, v]) => String(m[k]) === String(v));
  const cur = P.findIndex(([, vals]) => isP(vals));
  const preset = P.length ? `<div class="sec">Style</div><div class="seg wide">${P.map(([l], i) => `<button class="${cur === i ? 'on' : ''}" data-a="preset" data-r="${role}" data-i="${i}" data-p="${prefix}">${l}</button>`).join('')}<button class="${cur < 0 ? 'on' : ''}" tabindex="-1" aria-disabled="true">Custom</button></div>` : '';
  const dials = D.sl.map(([k, lo, hi]) => { const v = +m[k]; return `<div class="dial"><label class="dlab" for="${prefix}-${k}">${esc(lo)} or ${esc(hi.toLowerCase())}</label><div class="ends"><span>${END_IC[lo] ? ART.I[END_IC[lo]] : ''}${esc(lo)}</span><span>${esc(hi)}${END_IC[hi] ? ART.I[END_IC[hi]] : ''}</span></div><input class="dial-r" type="range" min="0" max="100" step="5" id="${prefix}-${k}" value="${v}" data-sl="${role}" data-k="${k}" data-p="${prefix}" style="--v:${v}%" aria-valuetext="${v} of 100"><div class="says" id="says-${prefix}-${k}">${esc(says(role, k, v, lo, hi))}</div></div>`; }).join('');
  const rules = D.ru.map(([k, l, opts]) => { const cv = String(m[k]), ci = Math.max(0, opts.findIndex(o => o[0] === cv));
    if (opts.length <= 4 && opts.every(o => o[1].length <= 14)) return `<div class="rule"><span class="rl">${esc(l)}</span><div class="seg wide">${opts.map(o => `<button class="${cv === o[0] ? 'on' : ''}" data-a="ru-set" data-r="${role}" data-k="${k}" data-v="${o[0]}" data-p="${prefix}">${esc(o[1])}</button>`).join('')}</div></div>`;
    return `<div class="stepper"><span class="rl">${esc(l)}</span><div class="ctl"><button class="iconbtn" data-a="ru-set" data-r="${role}" data-k="${k}" data-v="${opts[Math.max(0, ci - 1)][0]}" data-p="${prefix}" ${ci === 0 ? 'disabled' : ''} aria-label="Previous option">${ART.I.back}</button><b>${esc(opts[ci][1])}</b><button class="iconbtn" data-a="ru-set" data-r="${role}" data-k="${k}" data-v="${opts[Math.min(opts.length - 1, ci + 1)][0]}" data-p="${prefix}" ${ci === opts.length - 1 ? 'disabled' : ''} aria-label="Next option">${ART.I.chev}</button></div></div>`; }).join('');
  return `${preset}<div class="sec">How they work</div>${dials}${rules ? `<div class="sec">Hard rules</div>${rules}` : ''}`;
}
function staffHead(role) { const s = F.staff(role); if (!s) return ''; const L = F.LEAN[role]; const trait = s.lean >= 60 ? L[2] : s.lean <= 40 ? L[1] : 'No strong view'; return `<div class="staffhead"><div class="portrait">${ART.staffFace(role)}</div><div><b>${esc(s.name)}</b><span class="small">${esc(F.ROLE[role].t)}</span><div class="traits"><span>${esc(trait)}</span>${s.p.ego >= 14 ? '<span>Big ego</span>' : ''}${s.p.risk >= 14 ? '<span>Risk-taker</span>' : s.p.risk <= 6 ? '<span>Careful</span>' : ''}${s.p.loy >= 15 ? '<span>Loyal</span>' : ''}</div></div></div>`; }
function leanNote(role, m) { const s = F.staff(role); if (!s) return ''; const L = F.LEAN[role], k = L[0], d = Math.abs(m[k] - s.lean); return d > 40 ? `<p class="small bad" style="margin:4px 0">This mandate goes against ${esc(s.name.split(' ')[0])}'s instincts. Expect friction.</p>` : d < 20 ? `<p class="small good" style="margin:4px 0">${esc(s.name.split(' ')[0])} agrees with this direction.</p>` : ''; }
function vSetupMandates() {
  const g = G(), al = F.alignment(), roles = F.ROLES.filter(r => g.staff[r.id]), open = U.mandOpen || roles[0].id;
  return `<div class="setup"><div class="sumhead"><h1>Mandates</h1><span class="chip" style="margin-left:auto">Club fit ${al}%</span></div>
  <p class="small" style="margin:0 0 12px">Your staff work on their own, inside the mandate you give them. Pick a style or tune the dials. Later, changing a mandate costs an action.</p>
  <div class="mtabs">${roles.map(r => `<button class="${open === r.id ? 'on' : ''}" data-a="mand-tab" data-r="${r.id}" aria-label="${esc(r.t)}"><span class="mface">${ART.staffFace(r.id)}</span><small>${esc(F.ROLE[r.id].s)}</small></button>`).join('')}</div>
  ${staffHead(open)}${leanNote(open, g.mand[open])}${sliderRows(open, g.mand[open], 'su-' + open)}
  <div class="trayspace" style="--tray:110px"></div></div>${trayHtml('', `<button class="btn" data-a="mand-done">Issue mandates</button>`, `${roles.length} staff members, all reviewed in one go`)}`;
}
function recPlanBlock() {
  const pl = F.recView().plan, sug = F.recPlanSuggest(), ap = F.man('dof', 'approve');
  const all = sug.concat(F.POSW_KEYS().filter(k => !sug.some(x => x.pos === k)).map(pos => ({ pos, kind: 'proven', why: '' })));
  const row = o => { const on = pl.prios.find(x => x.pos === o.pos); return `<div class="prio ${on ? 'on' : ''}"><button class="prio-h" data-a="rec-prio" data-p="${o.pos}" data-k="${o.kind}" aria-pressed="${!!on}"><b>${F.POS_L[o.pos]}</b><span class="small">${esc(o.why) || 'Optional'}</span></button>${on ? `<div class="seg">${Object.entries(F.REC_KINDS).map(([k, l]) => `<button class="${on.kind === k ? 'on' : ''}" data-a="rec-kind" data-p="${o.pos}" data-k="${k}">${l}</button>`).join('')}</div>` : ''}</div>`; };
  return `<h3>Priorities <span class="small">${pl.prios.length} of 3</span></h3><div class="prios">${all.slice(0, U.prioAll ? 8 : sug.length).map(row).join('')}</div>${!U.prioAll ? '<button class="btn ghost sm" data-a="prio-all">Show all positions</button>' : ''}
  <h3 style="margin-top:16px">Which deals come to you?</h3><div class="seg wrap">${[['0', 'Every deal'], ['25', 'Above 25% of budget'], ['50', 'Above 50% of budget'], ['999', 'None']].map(([v, l]) => `<button class="${ap === v ? 'on' : ''}" data-a="rec-appr" data-v="${v}">${l}</button>`).join('')}</div>
  <p class="small">More approvals means more control and more inbox items. The DoF's fee, wage and age limits still apply: change them in his mandate.</p>`;
}
