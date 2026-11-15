/* The Front Office · UI (module 1) */
{
const F = FO, $ = s => document.querySelector(s), app = $('#app');
// Preview versions share an origin, so keep each branch's save separate.
const previewBranch = location.pathname.match(/\/front-office-fc\/(chatgpt|claude)(?:\/|$)/)?.[1];
const KEY = 'frontoffice_save_v1' + (previewBranch ? '_' + previewBranch : '');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const money = v => F.money(v), r0 = v => Math.round(v);
const PALETTES = [['#7a1e2b', '#f4e9d8', 'Claret & cream'], ['#0e3b2e', '#f2c14e', 'Green & gold'], ['#1b3a6b', '#ffffff', 'Navy & white'], ['#111111', '#e8e8e8', 'Black & white'], ['#c8102e', '#ffffff', 'Red & white'], ['#4b2a7b', '#e6c35c', 'Purple & gold'], ['#d9601a', '#1a1a1a', 'Orange & black'], ['#2b6cb0', '#f6e05e', 'Sky & yellow']];
const U = { tab: 'inbox', open: null, filt: 'all', flash: '', sheet: null, setup: { step: 0, name: '', short: '', city: '', col: 0, dna: {} }, hire: {}, pressI: 0, quote: null, sq: 'profile', lt: null, ticker: null, toast: '', draft: null, mandOpen: 'dof', talkRole: null, talkOut: null };
const G = () => F.G;

function saveGame() { try { if (G() && G().club) localStorage.setItem(KEY, F.save()); } catch (e) { } }
function hasSave() { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } }
function loadGame() { try { const s = localStorage.getItem(KEY); return s ? F.load(s) : false; } catch (e) { return false; } }
function wipe() { try { localStorage.removeItem(KEY); } catch (e) { } }
function toast(t) { U.toast = t; render(); clearTimeout(toast.h); toast.h = setTimeout(() => { U.toast = ''; render(); }, 3200); }
function setClub(c) { const r = document.documentElement.style; r.setProperty('--club', c[0]); r.setProperty('--club2', c[1]); const l = lum(c[0]); r.setProperty('--on', l > 0.55 ? '#111' : '#fff'); r.setProperty('--accL', l > 0.7 ? '#1f1715' : c[0]); r.setProperty('--accD', l < 0.4 ? c[1] : c[0]); }
function lum(h) { const n = parseInt(h.slice(1), 16), rr = (n >> 16) / 255, gg = (n >> 8 & 255) / 255, bb = (n & 255) / 255; return 0.299 * rr + 0.587 * gg + 0.114 * bb; }

/* ---------- atoms ---------- */
const stars = v => `<span class="stars" style="--v:${v}" aria-label="${v} stars"></span>`;
const bar = (v, max = 100, cls = '') => `<div class="bar ${cls}"><i style="width:${Math.max(0, Math.min(100, v / max * 100))}%"></i></div>`;
const meter = (l, v, max = 100, txt) => `<div class="meter"><span>${l}</span>${bar(v, max)}<span class="num">${txt != null ? txt : r0(v)}</span></div>`;
function crest(cols, short, size = 52) {
  const [a, b] = cols || ['#333', '#eee'];
  return `<svg class="crest" viewBox="0 0 52 60" width="${size}" height="${size * 60 / 52}" aria-hidden="true"><path d="M4 4h44v24c0 15-10 24-22 29C14 52 4 43 4 28z" fill="${a}" stroke="currentColor" stroke-width="1.5"/><path d="M4 22h44v8H4z" fill="${b}"/><path d="M8 8h36v12H8z" fill="none" stroke="${b}" stroke-width="1.2"/><text x="26" y="47" text-anchor="middle" font-family="Oswald,Impact,sans-serif" font-size="13" font-weight="600" fill="${b}">${esc((short || '').slice(0, 3))}</text></svg>`;
}
const apPips = n => `<span class="ap" aria-label="${n} actions left">${[0, 1, 2].map(i => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
const sign = v => v > 0 ? '+' + v : '' + v;

/* ---------- base club: skip the founding ---------- */
const BASE_DNA = { origin: 'phoenix', style: 'possession', talent: 'academy', money: 'self', identity: 'community', ambition: 'steady', ground: 'old' };
function quickStart(toSeason) {
  F.newGame(); const g = G(), dna = {};
  for (const q of F.DNA) dna[q.k] = q.o.some(o => o.v === BASE_DNA[q.k]) ? BASE_DNA[q.k] : q.o[0].v;
  F.setDNA(dna, 'Harwick Athletic', 'HAR', 'Harwick', PALETTES[0]); setClub(PALETTES[0]);
  // staff: the cheapest of each role, then upgrade in order of importance while the budget allows
  const budget = F.staffBudget(), pick = {}; for (const r of F.ROLES) { const c = g.cands[r.id]; pick[r.id] = c.reduce((b, x, i) => x.wage < c[b].wage ? i : b, 0); }
  const cost = () => Object.entries(pick).reduce((a, [r, i]) => a + g.cands[r][i].wage, 0);
  for (const r of ['coach', 'dof', 'fin', 'com', 'acad', 'scout', 'mkt']) { if (!g.cands[r]) continue; const order = g.cands[r].map((c, i) => i).sort((a, b) => F.ovr(g.cands[r][b]) - F.ovr(g.cands[r][a])); for (const i of order) { const old = pick[r]; pick[r] = i; if (cost() <= budget) break; pick[r] = old; } }
  for (const r in pick) F.hire(r, pick[r]); F.finishStaff(); F.finishMandates();
  if (toSeason) {
    try { if (g.phase === 'summer') F.sumAuto(F.rnd, true); } catch (e) { }
    try { if (F.preSetTarget) F.preSetTarget('accept'); if (g.meeting) g.meeting.items.forEach((it, i) => F.decideProposal(i, 'approve')); if (F.finishPreseason) F.finishPreseason(); } catch (e) { }
    try { for (const id of (g.press || [])) F.pressAnswer(id, 1); if (F.finishPress) F.finishPress(); } catch (e) { }
  }
  U.title = false; U.setup = null; U.hire = {}; U.sheet = null; U.tab = 'inbox'; U.pressI = 0; U.quote = null; window.scrollTo(0, 0);
}

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
/* ---------- the summer (M4) ---------- */
const STATUS_L = { need: ['Need', 'bad'], weak: ['Weak', 'warn'], ageing: ['Ageing', 'warn'], thin: ['Thin', ''], ok: ['Covered', 'good'] };
const FEED_K = { in: 'In', out: 'Out', rec: 'Scouts', talk: 'Talks', lost: 'Off', quiet: '', else: 'Elsewhere', dec: 'Decision', end: 'Shut' };
function sumMsg(m) {
  const v = F.msgView(m);
  if (m.done) return `<div class="smsg done"><b>${esc(v.title)}</b><p class="small">${esc(m.out || m.outcome || '')}</p></div>`;
  return `<div class="smsg"><div class="kick">${esc(v.from)}</div><b>${esc(v.title)}</b><p class="small">${esc(v.body)}</p><div class="ch">${v.opts.map((o, j) => `<button class="cbtn ${j === v.auto ? 'def' : ''}" data-a="sum-ans" data-m="${m.id}" data-i="${j}"><b>${esc(o.l)}</b>${o.h ? `<span>${esc(o.h)}</span>` : ''}${j === v.auto ? '<em>Staff pick</em>' : ''}</button>`).join('')}</div></div>`;
}
function vSummer() {
  const g = G(), V = F.sumView(), S = V.s, st = S.step, STEPS = F.SUM_STEPS;
  const nav = `<div class="steps">${STEPS.map((l, i) => `<button class="${i === st ? 'on' : ''}" data-a="sum-step" data-i="${i}" ${i > st + 1 || (i > st && !F.sumCanAdvance()) ? 'disabled' : ''}>${i + 1}. ${l}</button>`).join('')}</div>`;
  const next = (l, dis) => `<div class="row" style="margin-top:18px">${st ? `<button class="btn ghost" data-a="sum-step" data-i="${st - 1}">Back</button>` : ''}<button class="btn" data-a="sum-step" data-i="${st + 1}" ${dis ? 'disabled' : ''}>${l}</button></div>`;
  let body = '';
  if (st === 0) {
    const cs = V.contracts, pl = F.sumPlanner();
    body = `<h2>Contracts</h2>${cs.length ? `<p class="small">${cs.length} contract${cs.length > 1 ? 's' : ''} expired. ${esc(F.staffName('dof'))} has given his advice. Anything you leave open follows his advice.</p>
    ${cs.some(o => !o.c.out) ? `<button class="btn ghost sm" data-a="sum-ctr-all">Follow the DoF's advice on all open contracts</button>` : ''}${cs.map(({ p, c }) => `<div class="ctr ${c.out ? 'done' : ''}"><div class="spread"><span><b>${esc(p.name)}</b> <span class="pos">${p.pos}</span><span class="small rsub">${p.age}, ${stars(F.stars(p.ca))}, now ${money(p.wage)}/wk</span></span><span class="small" style="text-align:right">DoF: <b>${c.advice === 'renew' ? 'keep' : 'let go'}</b></span></div>
    ${c.out ? `<p class="small outc">${esc(c.out)}</p>` : `<div class="seg wrap" style="margin-top:8px"><button data-a="sum-ctr" data-id="${p.id}" data-v="renew">Offer ${c.demand.years}y at ${money(c.demand.wage)}</button><button data-a="sum-ctr" data-id="${p.id}" data-v="release">Release</button></div>`}</div>`).join('')}` : '<p class="note">No contracts expired this summer.</p>'}
    <h2 style="margin-top:22px">Squad planner</h2><p class="small">Where we stand per position after these decisions. It feeds the recruitment priorities below.</p>
    <div class="scroll"><table class="plan"><thead><tr><th>Position</th><th>Players</th><th>Best</th><th>Age</th><th></th></tr></thead><tbody>${pl.map(r => `<tr><td>${F.POS_L[r.pos]}</td><td class="num">${r.n}/${r.req}</td><td>${r.best ? stars(r.best) : '–'}</td><td class="num">${r.age || '–'}</td><td class="${STATUS_L[r.status][1]}">${STATUS_L[r.status][0]}</td></tr>`).join('')}</tbody></table></div>
    ${V.sell.length ? `<h3 style="margin-top:16px">Available for transfer</h3><p class="small">The DoF suggests these players could go. Mark them and he will sell when a fair offer comes.</p><div class="prios">${V.sell.map(p => `<button class="prio-h prio ${p.sellFlag ? 'on' : ''}" data-a="sum-sell" data-id="${p.id}" aria-pressed="${!!p.sellFlag}"><span><b>${esc(p.name)}</b> <span class="pos">${p.pos}</span></span><span class="small">${p.age}, ${money(p.wage)}/wk, ${p.sellFlag ? 'listed' : 'tap to list'}</span></button>`).join('')}</div>` : ''}
    ${F.loanOutCands && F.loanOutCands().length ? `<h3 style="margin-top:16px">Send out on loan</h3><p class="small">Young players behind two others in their position. A season of games elsewhere speeds up their development and saves their wages.</p><div class="prios">${F.loanOutCands().map(p => `<button class="prio-h prio" data-a="loan-out" data-id="${p.id}"><span><b>${esc(p.name)}</b> <span class="pos">${p.pos}</span></span><span class="small">${p.age}, ${stars(F.stars(p.ca))}, tap to loan out</span></button>`).join('')}</div>` : ''}
    <h2 style="margin-top:22px">Recruitment plan</h2>${recPlanBlock()}${next('Next: board and budget')}`;
  } else if (st === 1) {
    const P = g.pre, b = F.budgetCosts(), wf = F.weekForecast(), net = wf.rev - wf.cost;
    const row = (role, k, l, cost, note) => F.staff(role) || role === 'fin' ? `<div class="sl"><div class="spread"><label for="pb-${role}-${k}">${l}</label><span class="num">${cost != null ? money(cost) + '/wk' : ''}</span></div><input type="range" min="0" max="100" step="5" id="pb-${role}-${k}" value="${F.man(role, k)}" data-sl="${role}" data-k="${k}" data-p="pb"><div class="ends"><span>${note[0]}</span><span>${note[1]}</span></div></div>` : '';
    body = `<h2>The board's target</h2><p>The board expects us to finish <b>${F.ord(P.base)}</b> in the ${F.TIERS[g.club.tier]}. On paper the squad ranks ${F.ord(F.expectedRank())}. Promise more and the board adds to the transfer kitty.</p>
    <div class="choice">${F.preTargets().map(o => `<button class="card ${P.deal === o.k ? 'on' : ''}" data-a="pre-target" data-k="${o.k}"><b>${esc(o.t)}: finish ${F.ord(o.target)}</b>${esc(o.d)}<div class="e">${esc(o.fx)}</div></button>`).join('')}</div>
    <h2 style="margin-top:22px">Budget</h2><p class="small">Department spending for the season, and how much cash Finance releases for the market that opens next.</p>
    ${row('scout', 'budget', 'Scouting', b.scouting, ['Lean', 'Lavish'])}${row('acad', 'budget', 'Academy', b.academy, ['Lean', 'Lavish'])}${row('mkt', 'budget', 'Marketing', b.marketing, ['Lean', 'Lavish'])}${row('fin', 'invest', 'Facility investment', b.facilities, ['Cut costs', 'Invest'])}${row('fin', 'transfer', 'Cash released for transfers', null, ['Hold cash', 'Fund transfers'])}
    <dl class="figs"><div><dt>Transfer budget</dt><dd>${money(F.transferBudget())}</dd></div><div><dt>Weekly result</dt><dd class="${net < 0 ? 'bad' : 'good'}">${net >= 0 ? '+' : ''}${money(net)}</dd></div><div><dt>Cash</dt><dd>${money(g.club.cash)}</dd></div><div><dt>Wage limit</dt><dd>${F.recWageLimit() === Infinity ? 'none' : money(Math.round(F.recWageLimit())) + '/wk'}</dd></div></dl>
    ${next('Open the market', !P.deal)}${P.deal ? '' : '<p class="small">Agree a target with the board first.</p>'}`;
  } else if (st === 2) {
    const R = F.SUM_ROUNDS, V2 = F.recView(), pend = F.sumPending(), deals = V2.rows.filter(o => ['negotiating', 'approach', 'agreed'].includes(o.x.stage));
    body = `<div class="clock"><div><div class="kick">The market</div><b>${S.round < R.length ? R[S.round] : 'Market closing'}</b></div><div class="pips">${R.map((l, i) => `<i class="${i < S.round ? 'on' : ''}" title="${l}"></i>`).join('')}</div></div>
    <dl class="figs"><div><dt>Budget left</dt><dd>${money(V2.budget)}</dd></div><div><dt>Squad</dt><dd>${g.squad.length}</dd></div><div><dt>In / out</dt><dd>${S.log.filter(l => l.k === 'in').length} / ${S.log.filter(l => l.k === 'out').length}</dd></div></dl>
    ${pend.length ? `<h3 class="rh">Needs you <span class="small">${pend.length}</span></h3>${pend.map(sumMsg).join('')}` : ''}
    ${(() => { const bl = V2.rows.filter(o => o.x.blocked && o.x.stage === 'recommended'); if (!bl.length) return ''; const c = {}; bl.forEach(o => o.x.blocked.forEach(b => c[b] = (c[b] || 0) + 1)); const top = Object.keys(c).sort((a, b) => c[b] - c[a])[0]; return `<p class="note">${bl.length} recommended player${bl.length > 1 ? 's are' : ' is'} blocked by your rules, mostly the ${top}. <button class="link" data-a="sheet" data-s="mand" data-r="${top === 'wage cap' ? 'fin' : 'dof'}">Change the mandate</button></p>`; })()}
    ${deals.length ? `<h3 class="rh">Live deals</h3>${deals.map(recRow).join('')}` : ''}
    ${S.feed.length ? `<h3 class="rh">What happened</h3>${S.feed.map(f => `<div class="fblock"><div class="kick">${R[f.round]}</div><ul class="feedl">${f.lines.map(l => `<li class="fk-${l.k}">${FEED_K[l.k] ? `<span class="fk">${FEED_K[l.k]}</span>` : ''}${esc(l.t)}</li>`).join('')}</ul></div>`).join('')}` : `<p class="note">${esc(F.staffName('dof'))} and the scouts start work when you move the clock forward. Approvals and bids arrive here. Anything you leave open, the staff decide.</p>`}
    <div class="row" style="margin-top:18px"><button class="btn ghost" data-a="sum-step" data-i="1">Back</button>${S.round < R.length ? `<button class="btn" data-a="sum-round">${S.round === 0 ? 'Start the summer' : `Move on to ${R[S.round].toLowerCase()}`}</button>` : `<button class="btn" data-a="sum-step" data-i="3">Next: pre-season</button>`}</div>
    <p class="small"><button class="link" data-a="sqv-rec">Open the full recruitment list</button></p>`;
  } else if (st === 3) {
    const P = g.pre, fr = S.fr || [], fo = F.FOCUS.filter(f => !g.board.obj.some(o => o.k === f.k && !o.soft) || P.focus.includes(f.k));
    body = `<h2>Friendlies</h2><ul class="list">${fr.map(f => `<li><span>${esc(f.opp)} <span class="small">${F.TIERS[f.tier]}</span><br><span class="small">${esc(f.note)}</span></span><b class="num ${f.res === 'W' ? 'good' : f.res === 'L' ? 'bad' : ''}">${f.ug}–${f.tg}</b></li>`).join('')}</ul>
    <p class="small">${fr.filter(f => f.res === 'W').length >= 2 ? 'A sharp pre-season: a small edge in the opening weeks.' : 'Mixed results. New signings have had time to settle.'}</p>
    <h2 style="margin-top:22px">Two focus goals</h2><p class="small">Extra goals for the season. Met: board confidence up. Missed: a small dent.</p>
    <div class="cards2">${fo.map(f => `<button class="card ${P.focus.includes(f.k) ? 'on' : ''}" data-a="pre-focus" data-k="${f.k}"><b style="font-size:17px">${esc(f.t())}</b><span class="small">${esc(f.d)}</span></button>`).join('')}</div>
    ${F.ACAD_PLANS ? `<h2 style="margin-top:22px">Academy plan</h2><div class="cards2">${F.ACAD_PLANS.map(a => `<button class="card ${P.acad === a.k ? 'on' : ''}" data-a="pre-acad" data-k="${a.k}"><b style="font-size:17px">${esc(a.t())}</b><span class="small">${esc(a.d)}</span></button>`).join('')}</div>` : ''}
    ${g.meeting && g.meeting.items.length ? `<div style="margin-top:22px">${meetingBlock(g.meeting, 'Summer planning meeting')}</div>` : ''}
    ${next('Next: deadline day', P.focus.length !== 2)}${P.focus.length === 2 ? '' : '<p class="small">Choose two focus goals.</p>'}`;
  } else {
    const d = S.dd, dec = F.ddDecision(), H = F.DD_HOURS;
    body = `<div class="ddclock"><div><div class="kick">Deadline day</div><b class="num">${d ? H[Math.max(0, d.t)] : '08:00'}</b></div><div class="small" style="text-align:right">Window shuts<br><span class="num" style="font-size:20px">23:00</span></div></div>
    <div class="ddbar"><i style="width:${d ? Math.max(0, d.t) / (H.length - 1) * 100 : 0}%"></i></div>
    ${dec ? `<div class="smsg dd" aria-live="assertive"><div class="kick">Decide now</div><b>${esc(dec.title)}</b><p class="small">${esc(dec.body)}</p><div class="cd"><i style="animation-duration:${Math.max(0, (U.ddDecEnd || Date.now() + 12000) - Date.now())}ms" key="${dec.id}"></i></div><div class="ch">${dec.opts.map((o, j) => `<button class="cbtn" data-a="dd-dec" data-i="${j}"><b>${esc(o.l)}</b>${o.h ? `<span>${esc(o.h)}</span>` : ''}</button>`).join('')}</div><p class="small">No answer and ${esc(F.staffName('dof'))} decides.</p></div>` : ''}
    ${d ? `<ul class="feedl dd">${d.feed.map(l => `<li class="fk-${l.k || 'quiet'}"><span class="fk num">${l.h}</span>${esc(l.t)}</li>`).join('')}</ul>` : `<p>The last day of the window. ${esc(F.staffName('dof'))} tries to close open deals, clubs come in for our players and late chances appear. Some calls need an answer within seconds.</p>`}
    <div class="row" style="margin-top:18px">${!d ? `<button class="btn" data-a="dd-start">Start deadline day</button><button class="btn ghost" data-a="dd-skip">Let the staff handle it</button>` : d.done ? `<button class="btn" data-a="sum-finish">Close the summer and meet the press</button>` : `<button class="btn ghost" data-a="dd-pause">${d.run ? 'Pause' : 'Resume'}</button><button class="btn ghost" data-a="dd-skip">Skip to 23:00</button>`}</div>`;
  }
  return `<div class="setup" style="max-width:860px"><div class="step">Summer before season ${g.season}. ${F.TIERS[g.club.tier]}.</div><h1 style="font-size:40px;margin:6px 0 12px">The summer</h1>${nav}${body}</div>`;
}
/* ---------- the summer, version 2 ---------- */
const WHO = r => r === 'you' ? 'You' : r === 'board' ? 'The chairman' : `${F.staffName(r)}${F.ROLE[r] ? ', ' + F.ROLE[r].s : ''}`;
function ddBlock(doneBtn) {
  const g = G(), S = g.sum, d = S.dd, dec = F.ddDecision(), H = F.DD_HOURS;
  return `<div class="ddclock"><div><div class="kick">Deadline day</div><b class="num">${d ? H[Math.max(0, d.t)] : '08:00'}</b></div><div class="small" style="text-align:right">Window shuts<br><span class="num" style="font-size:20px">23:00</span></div></div>
    <div class="ddbar"><i style="width:${d ? Math.max(0, d.t) / (H.length - 1) * 100 : 0}%"></i></div>
    ${dec ? `<div class="smsg dd" aria-live="assertive"><div class="kick">Exception: your call</div><b>${esc(dec.title)}</b><p class="small">${esc(dec.body)}</p>${caseHtml(F.ddCase ? F.ddCase() : null)}<div class="cd"><i style="animation-duration:${Math.max(0, (U.ddDecEnd || Date.now() + 12000) - Date.now())}ms"></i></div><div class="ch">${dec.opts.map((o, j) => `<button class="cbtn" data-a="dd-dec" data-i="${j}"><b>${esc(o.l)}</b>${o.h ? `<span>${esc(o.h)}</span>` : ''}</button>`).join('')}</div><p class="small">No answer and ${esc(F.staffName('dof'))} decides.</p></div>` : ''}
    ${d ? `<ul class="feedl dd">${d.feed.map(l => `<li class="fk-${l.k || 'quiet'}"><span class="fk num">${l.h}</span>${esc(l.t)}</li>`).join('')}</ul>` : ''}
    <div class="row" style="margin-top:18px">${d && d.done ? doneBtn : d ? `<button class="btn ghost" data-a="dd-pause">${d.run ? 'Pause' : 'Resume'}</button><button class="btn ghost" data-a="dd-skip">Skip to 23:00</button>` : ''}</div>`;
}
function mtCard(it) {
  const g = G(), S = g.sum, mt = S.mt, R = g.rec;
  if (it === 'club') {
    const pl = F.sumPlanner(), cs = F.sumView().contracts, L = g.lastReport;
    return `<section class="dcard">${L && L.table ? `<dl class="figs"><div><dt>Finished</dt><dd>${F.ord(L.pos)}</dd></div><div><dt>Goals</dt><dd>${L.table.find(x => x.id === 0).gf}–${L.table.find(x => x.id === 0).ga}</dd></div><div><dt>Squad</dt><dd>${g.squad.length}</dd></div></dl>` : ''}
    <div class="scroll"><table class="plan"><thead><tr><th>Position</th><th>Players</th><th>Best</th><th>Age</th><th></th></tr></thead><tbody>${pl.map(r => `<tr><td>${F.POS_L[r.pos]}</td><td class="num">${r.n}/${r.req}</td><td>${r.best ? stars(r.best) : '–'}</td><td class="num">${r.age || '–'}</td><td class="${STATUS_L[r.status][1]}">${STATUS_L[r.status][0]}</td></tr>`).join('')}</tbody></table></div>
    ${cs.length ? `<h3 style="margin-top:10px">Contract package</h3><ul class="list">${cs.map(({ p, c }) => `<li><span>${esc(p.name)} <span class="pos">${p.pos}</span><br><span class="small">${p.age}, ${F.stars(p.ca)}★, asks ${money(c.demand.wage)}/wk for ${c.demand.years}y${c.demand.refuse ? ', may refuse' : ''}</span></span><b class="${(c.choice || c.advice) === 'renew' ? 'good' : 'bad'}">${c.out ? (c.choice === 'release' || (!c.choice && c.advice === 'release') ? 'Released' : 'Done') : (c.choice || c.advice) === 'renew' ? 'Keep' : 'Let go'}</b></li>`).join('')}</ul>` : ''}</section>`;
  }
  if (it === 'money') {
    const b = F.budgetCosts(), wf = F.weekForecast(), net = wf.rev - wf.cost, cap = +F.man('fin', 'wageCap');
    const row = (role, k, l, cost, note) => F.staff(role) || role === 'fin' ? `<div class="sl"><div class="spread"><label for="pb-${role}-${k}">${l}</label><span class="num">${cost != null ? money(cost) + '/wk' : ''}</span></div><input type="range" min="0" max="100" step="5" id="pb-${role}-${k}" value="${F.man(role, k)}" data-sl="${role}" data-k="${k}" data-p="pb"><div class="ends"><span>${note[0]}</span><span>${note[1]}</span></div></div>` : '';
    return `<section class="dcard"><dl class="figs"><div><dt>Transfer budget</dt><dd>${money(F.transferBudget())}</dd></div><div><dt>Wages / revenue</dt><dd class="${F.wageRatio() * 100 > cap ? 'bad' : ''}">${r0(F.wageRatio() * 100)}% of ${cap}%</dd></div><div><dt>Cash</dt><dd>${money(g.club.cash)}</dd></div><div><dt>Weekly result</dt><dd class="${net < 0 ? 'bad' : 'good'}">${net >= 0 ? '+' : ''}${money(net)}</dd></div></dl>
    <details class="fold"><summary>Department budgets</summary>${row('scout', 'budget', 'Scouting', b.scouting, ['Lean', 'Lavish'])}${row('acad', 'budget', 'Academy', b.academy, ['Lean', 'Lavish'])}${row('mkt', 'budget', 'Marketing', b.marketing, ['Lean', 'Lavish'])}${row('fin', 'invest', 'Facility investment', b.facilities, ['Cut costs', 'Invest'])}</details></section>`;
  }
  if (it === 'needs') {
    const p = mt.plan; if (!p) return '';
    return `<section class="dcard"><div class="spread"><b>${p.approach === 'star' ? 'Approach: one big signing' : 'Approach: spread the money'}</b><span class="small">${money(F.transferBudget())}</span></div>
    ${p.prios.map((pos, i) => `<h3 style="margin-top:10px">${i + 1}. ${F.POS_L[pos]}</h3>${(p.lists[pos] || []).length ? (p.lists[pos] || []).map((id, j) => { const pl = R.pool[id], k = R.know[id]; return pl ? `<button class="rrow" data-a="target" data-id="${id}"><span class="gr g${k.grade}">${k.grade}</span><span class="rmain"><b>${esc(pl.name)}</b> <span class="small">${j === 0 ? 'plan A' : j === 1 ? 'plan B' : 'option'}</span><span class="small rsub">${pl.age}, ${F.REGIONS[pl.region].name}, ${F.recBand(k)}, ${pl.club ? money(pl.ask) : 'free agent'}</span></span></button>` : ''; }).join('') : '<p class="small">No names yet. The scouts keep looking.</p>'}`).join('')}
    ${p.sell.length || p.keep.length ? `<h3 style="margin-top:10px">Squad</h3><p class="small">${p.sell.length ? 'Can go: ' + p.sell.map(id => (g.squad.find(x => x.id === id) || {}).name).filter(Boolean).join(', ') + '. ' : ''}${p.keep.length ? 'Not for sale: ' + p.keep.map(id => (g.squad.find(x => x.id === id) || {}).name).filter(Boolean).join(', ') + '.' : ''}</p>` : ''}</section>`;
  }
  if (it === 'brief') {
    const B = mt.brief; if (!B) return '';
    return `<section class="dcard brief"><div class="kick">Summer brief, season ${g.season}</div><h3>Priorities</h3><p>${B.prios.map(x => F.POS_L[x]).join(', ')}. ${B.approach === 'star' ? 'One big signing.' : 'Spread across positions.'}</p>
    <h3>Money and limits</h3><p>Budget ${money(B.budget)}. You approve ${B.approve === '999' ? 'no deals' : B.approve === '0' ? 'every deal' : 'deals above ' + money(Math.round(B.budget * (+B.approve) / 100))}.${B.keep.length ? ' Not for sale: ' + B.keep.map(id => (g.squad.find(x => x.id === id) || {}).name).filter(Boolean).join(', ') + '.' : ''}${B.sell.length ? ' Can go: ' + B.sell.map(id => (g.squad.find(x => x.id === id) || {}).name).filter(Boolean).join(', ') + '.' : ''}</p>
    <h3>The DoF will be judged on</h3><ol>${B.kpis.map(k => `<li>${esc(k.t)}</li>`).join('')}</ol><div class="sigs"><span>${esc(F.staffName('dof'))}</span><span>${U.signing ? '<i class="sig">CEO</i>' : '<em>Your signature</em>'}</span></div>${U.signing ? '<div class="stampx">SIGNED</div>' : ''}</section>`;
  }
  return '';
}
function vSummer2() {
  const g = G(), S = g.sum, st = S.step, STEPS = F.SUM2_STEPS;
  const nav = `<div class="steps">${STEPS.map((l, i) => `<span class="stp ${i === st ? 'on' : i < st ? 'done' : ''}">${i + 1}. ${l}</span>`).join('')}</div>`;
  let body = '';
  if (st === 0) {
    const mt = S.mt, items = Object.keys(F.SUM2_ITEMS), it = items[mt.item], resp = F.sum2Responses();
    const agenda = `<ol class="agenda">${items.map((k, i) => `<li class="${i === mt.item ? 'on' : i < mt.item ? 'done' : ''}">${F.SUM2_ITEMS[k]}</li>`).join('')}</ol>`;
    const log = mt.log.filter(l => l.i === mt.item), last = log[log.length - 1], prev = log[log.length - 2];
    const who = { club: ['board', 'dof', 'coach'], money: ['board', 'fin', 'dof'], needs: ['coach', 'scout', 'dof'], brief: ['board', 'dof'] }[it];
    const moods = mt.moods || {}, speaker = last && last.who !== 'you' ? last.who : 'dof', d = F.staff('dof');
    const seats = who.map(w => `<div class="seat ${w === speaker ? 'talk' : ''}"><div class="sface">${ART.staffFace(w, moods[w])}</div><span class="nm">${esc(w === 'board' ? 'Chairman' : (F.staffName(w) || '').split(' ').slice(-1)[0])}</span></div>`).join('');
    const fx = mt.fx && mt.fx.n !== U.fxSeen ? (U.fxSeen = mt.fx.n, `<span class="fxf ${mt.fx.bad ? 'bad' : 'good'}">${esc(mt.fx.t)}</span>`) : '';
    body = `<div class="progress-l">${F.SUM2_ITEMS[it]}</div><div class="progress">${items.map((k, i) => `<i class="${i === mt.item ? 'on' : i < mt.item ? 'done' : ''}"></i>`).join('')}</div><div class="scene"><div class="table"></div>${seats}${fx}</div>
    ${prev && prev.who === 'you' ? `<p class="you-said">You: ${esc(prev.t)}</p>` : ''}
    ${last ? `<div class="bubble ${last.who === 'you' ? 'me' : ''} ${last.k === 'plan' ? 'plan' : ''}"><div class="who">${esc(WHO(last.who))}</div>${esc(last.t)}${last.who !== 'you' && last.who !== 'board' && ticOf(last.who, last.t) ? `<span class="tic">${esc(ticOf(last.who, last.t))}</span>` : ''}</div>` : ''}
    ${d ? `<div class="trustm">${ART.I.trust}<span>${esc(d.name.split(' ').slice(-1)[0])}'s trust</span><i><b style="width:${r0(d.rel)}%"></b></i><span class="num">${r0(d.rel)}</span></div>` : ''}
    ${mtCard(it)}
    ${log.length > 2 ? `<details class="fold minutes"><summary>Meeting notes (${log.length})</summary>${log.map(l => `<p><b>${esc(WHO(l.who))}:</b> ${esc(l.t)}</p>`).join('')}</details>` : ''}
    ${trayHtml(`<span>${it === 'brief' ? 'Sign it' : 'Your response'}</span><span>${mt.item + 1} of ${items.length}</span>`, resp.map((o, j) => o.k === 'sign' ? `<button class="btn" data-a="mt-ans" data-i="${j}" data-k="sign" ${U.signing ? 'disabled' : ''}>Sign the summer brief</button>` : choiceHtml(o, j, `data-a="mt-ans" data-i="${j}" data-k="${o.k}"`, false, U.signing)).join(''), '')}<div class="trayspace" style="--tray:${80 + resp.length * 66}px"></div>`;
  } else if (st === 1) {
    const tk = S.tk;
    if (tk.phase === 'dd') body = ddBlock(`<button class="btn" data-a="s2-step" data-i="2">Read the summer edition</button>`);
    else {
      const call = F.tkCall(), lines = tk.lines.slice(0, tk.shown).reverse(), W = F.SUM2_WEEKS, board = F.recPlanBoard();
      const plan = `<div class="planboard">${board.map(r => `<${r.pid ? `button data-a="target" data-id="${r.pid}"` : 'div'} class="pl ${r.st}"><i class="dot"></i>${F.POS_L[r.pos]}<span>${esc(r.who)}</span></${r.pid ? 'button' : 'div'}>`).join('')}</div>`;
      let callH = '';
      if (call) {
        const c = call.m.ctx || {}, R = g.rec, tp = c.pid && R.pool[c.pid], tk2 = tp && R.know[c.pid];
        const chips = tp ? `<div class="chips3"><div><small>Asking</small><b>${tp.club ? money(c.counter || tp.ask) : 'Free'}</b></div><div><small>Wage</small><b>${money(tp.wageAsk)}</b></div><div><small>Budget</small><b>${money(F.transferBudget())}</b></div></div>` : '';
        callH = `<div class="callhead"><div class="portrait">${ART.staffFace(F.EV[call.m.ev].from || 'dof')}</div><div><b>${esc(call.v.from.split(',')[0])}</b><span><i class="ringdot"></i>is calling</span></div><span class="phoneic">${ART.I.phone}</span></div>
        <h2 class="ask">${esc(call.v.title)}</h2>${tp ? pcard(tp, { k: tk2 }) : ''}${chips}
        <details class="more"><summary>Details ${ART.I.chev}</summary><p>${esc(call.v.body)}</p><p>${esc(call.v.why)}</p></details>`;
        U.tkTray = trayHtml('<span>Your call</span><span>His advice is marked</span>', call.v.opts.map((o, j) => `<button class="cho ${j === call.ai ? 'pick' : ''}" data-a="tk-ans" data-i="${j}">${j === call.ai ? '<span class="pk">His advice</span>' : ''}<b>${esc(o.l)}</b><span class="fx">${ART.fx(o.h)}</span></button>`).join(''), '');
      } else U.tkTray = '';
      const line = l => `<li class="fk-${l.k || 'quiet'}"><span class="fk">${esc(l.h)}</span>${l.pid && (g.squad.find(q => q.id === l.pid) || (g.rec.pool[l.pid])) ? `<button class="lnk" data-a="${g.squad.some(q => q.id === l.pid) ? 'player' : 'target'}" data-id="${l.pid}"><span class="mf">${(() => { const q = g.squad.find(q => q.id === l.pid) || g.rec.pool[l.pid]; return q.pool ? ART.poolFace(q) : ART.playerFace(q); })()}</span>${esc(l.t)}</button>` : esc(l.t)}</li>`;
      body = `<div class="clock"><div><div class="kick">The summer</div><b>${tk.wk < 0 ? 'Before the window' : W[Math.min(tk.wk, W.length - 1)] + ' of ' + W.length}</b></div><div class="pips">${W.map((l, i) => `<i class="${i <= tk.wk ? 'on' : ''}"></i>`).join('')}</div></div>
      ${callH || `<div class="sec" style="margin-top:8px">The plan, live</div>${plan}<div class="minifigs"><span>${ART.I.money}${money(F.transferBudget())} left</span><span>${ART.I.squad}${g.squad.length} players</span><span>${ART.I.chev}${S.log.filter(l => l.k === 'in').length} in, ${S.log.filter(l => l.k === 'out').length} out</span></div>`}
      <ul class="feedl dd">${lines.map(line).join('') || `<li class="fk-quiet"><span class="fk"></span>${esc(F.staffName('dof'))} picks up the phone.</li>`}</ul>
      ${call ? U.tkTray + `<div class="trayspace" style="--tray:${90 + call.v.opts.length * 60}px"></div>` : `<div class="row" style="margin-top:14px"><button class="btn ghost" data-a="tk-pause">${tk.run ? 'Pause' : 'Resume'}</button><button class="btn ghost" data-a="tk-skip">Skip to deadline day</button></div>`}`;
    }
  } else if (st === 2) {
    const E = F.sum2Edition(), R = g.rec;
    const card = l => { const p = g.squad.find(q => q.name === l.name && (!l.pos || q.pos === l.pos)); const lg = R.log.find(x => x.name === l.name && x.s === g.season); const sur = lg && lg.surplus; return p ? `<button class="inc ${sur ? 'flag' : ''}" data-a="player" data-id="${p.id}"><span class="pf">${ART.playerFace(p, 'happy')}</span><span><b>${esc(p.name.split(' ').slice(-1)[0])}</b><small>${p.pos}, ${lg && lg.fee ? money(lg.fee) : 'free'}${p.loan ? ', loan' : ''}${sur ? ', surplus' : ''}</small></span></button>` : ''; };
    const grp = { Keeper: ['GK'], Defence: ['CB', 'FB'], Midfield: ['DM', 'CM', 'AM'], Attack: ['W', 'ST'] };
    const bars = Object.entries(grp).map(([l, ps]) => { const rs = E.rows.filter(r => ps.includes(r.pos)), b = Math.max(0, ...rs.map(r => r.b)), a = Math.max(0, ...rs.map(r => r.a)); return `<div class="pb">${l}<i><u style="width:${b * 20}%"></u><b style="width:${a * 20}%"></b></i><em class="${a > b ? 'up' : a < b ? 'dn' : ''}">${a > b ? '+' + (a - b) : a < b ? '−' + (b - a) : '='}</em></div>`; }).join('');
    const outs = E.outs.map(o => (o.t || o.name || '').replace(/^.*?(sells|offloads)\s/, '').replace(/,? as you asked\.?|\.$/g, '')).slice(0, 5);
    body = `<article class="paper"><div class="mast">THE ${esc(g.club.city.toUpperCase())} GAZETTE <small>Summer edition</small></div><div class="gstamp g${E.grade}">${E.grade}<small>SUMMER</small></div>
    <h2 class="ehead2">${esc(E.head)}</h2><p class="esub2">${E.ins.length} in, ${E.outs.length} out, net spend ${money(E.net)}</p>
    <div class="ins">${E.ins.map(card).join('') || '<p class="small">Nobody came in.</p>'}</div>
    ${outs.length ? `<p class="outs">Out: ${esc(outs.join('; '))}</p>` : ''}
    <div class="sec2">The brief</div><div class="planboard">${E.ev.map(e => `<div class="pl ${e.met ? 'done' : 'open'}"><i class="dot"></i>${esc(e.t)}<span>${e.met ? 'Met' : 'Missed'}</span></div>`).join('')}</div>
    <div class="sec2">Best player per line, May → now</div><div class="posbars">${bars}</div>
    <div class="quote"><span class="pf">${ART.staffFace('coach', E.xi > 0.15 ? 'happy' : E.xi < -0.1 ? 'worried' : null)}</span>${esc(E.coach)}</div>
    <div class="quote"><span class="pf">${ART.staffFace('board', E.met >= 2 ? 'happy' : 'worried')}</span>${esc(E.board)}</div></article>
    ${trayHtml('', `<button class="btn" data-a="s2-step" data-i="3">Debrief with ${esc(F.staffName('dof'))}</button>`, '')}<div class="trayspace" style="--tray:100px"></div>`;
  } else if (st === 3) {
    const D = F.sum2Debrief();
    body = `<h2>Debrief</h2><div class="meet"><div class="say"><div class="who">${esc(WHO('dof'))}</div><p>${esc(D.intro)} ${D.lines.map(esc).join(' ')}</p></div>${D.done ? `<div class="say me"><div class="who">You</div><p>${esc({ praise: '"Good work this summer."', probe: '"Walk me through what went wrong."', warn: '"This is not good enough."', tighten: '"From now on, every deal comes through me."', loosen: '"You have earned more freedom."' }[D.done.k])}</p></div><div class="say"><div class="who">${esc(WHO('dof'))}</div><p>${esc(D.done.t)}</p></div>` : ''}</div>
    ${D.done ? `<div class="row" style="margin-top:14px"><button class="btn" data-a="s2-step" data-i="4">Next: season goals</button></div>` : `<div class="ch">${[['praise', 'Praise his work', 'Trust up, more so if he delivered'], ['probe', 'Ask what went wrong', 'He explains, slightly defensive'], ['warn', 'Warn him', D.met < D.ev.length ? 'Sharpens him, counts as a strike' : 'Unfair after a good summer'], [D.met >= 2 ? 'loosen' : 'tighten', D.met >= 2 ? 'Give him more freedom' : 'Every deal through you from now on', D.met >= 2 ? 'You approve only big deals' : 'More control, less trust']].map(([k, l, h]) => `<button class="cbtn" data-a="db-talk" data-k="${k}"><b>${l}</b><span>${h}</span></button>`).join('')}</div><p class="small"><button class="link" data-a="s2-step" data-i="4">Skip the debrief</button></p>`}`;
  } else {
    const P = g.pre, fo = F.FOCUS.filter(f => !g.board.obj.some(o => o.k === f.k && !o.soft) || P.focus.includes(f.k));
    body = `<h2>Two focus goals</h2><p class="small">Extra goals for the season. Met: board confidence up. Missed: a small dent.</p>
    <div class="cards2">${fo.map(f => `<button class="card ${P.focus.includes(f.k) ? 'on' : ''}" data-a="pre-focus" data-k="${f.k}"><b style="font-size:17px">${esc(f.t())}</b><span class="small">${esc(f.d)}</span></button>`).join('')}</div>
    ${F.ACAD_PLANS ? `<h2 style="margin-top:22px">Academy plan</h2><div class="cards2">${F.ACAD_PLANS.map(a => `<button class="card ${P.acad === a.k ? 'on' : ''}" data-a="pre-acad" data-k="${a.k}"><b style="font-size:17px">${esc(a.t())}</b><span class="small">${esc(a.d)}</span></button>`).join('')}</div>` : ''}
    ${g.meeting && g.meeting.items.length ? `<div style="margin-top:22px">${meetingBlock(g.meeting, 'Projects for the season')}</div>` : ''}
    <div class="row" style="margin-top:18px"><button class="btn" data-a="s2-finish" ${P.focus.length === 2 ? '' : 'disabled'}>Meet the press</button>${P.focus.length === 2 ? '' : '<span class="small">Choose two focus goals.</span>'}</div>`;
  }
  return `<div class="setup" style="max-width:760px"><div class="sumhead">${crest(g.club.colors, g.club.short, 26)}<h1>The summer</h1><span class="chip" style="margin-left:auto">Step ${st + 1} of ${STEPS.length}</span></div>${body}</div>`;
}
function ddSchedule() {
  clearTimeout(U.ddT); const g = G(); if (!g || g.phase !== 'summer' || !g.sum) return;
  if (g.sum.v2 && g.sum.step === 1 && g.sum.tk && g.sum.tk.phase !== 'dd') { const tk = g.sum.tk; if (tk.call && U.rang !== tk.call) { U.rang = tk.call; ART.SND.ring(); ART.vib([60, 40, 60]); } if (tk.run && !tk.call) U.ddT = setTimeout(() => { F.tkStep(); saveGame(); render(); }, tk.shown < tk.lines.length ? 900 : 1300); return; }
  if (g.sum.step !== (g.sum.v2 ? 1 : 4)) return; const d = g.sum.dd; if (!d || !d.run || d.done) return;
  if (d.dec) { if (!U.ddDecEnd || U.ddDecId !== d.dec.id) { U.ddDecEnd = Date.now() + 12000; U.ddDecId = d.dec.id; render(); return; } U.ddT = setTimeout(() => { F.ddDecide(-1); saveGame(); render(); }, Math.max(0, U.ddDecEnd - Date.now())); }
  else U.ddT = setTimeout(() => { F.ddTick(); saveGame(); render(); }, 1700);
}
function vPreseason() {
  const g = G(), P = g.pre, st = P.step, lg = g.board.obj.find(o => o.k === 'league');
  const steps = ['Goals', 'Budget', 'Recruitment', 'Projects'];
  const nav = `<div class="steps">${steps.map((l, i) => `<button class="${i === st ? 'on' : ''}" data-a="pre-step" data-i="${i}">${i + 1}. ${l}</button>`).join('')}</div>`;
  let body = '';
  if (st === 0) {
    const fo = F.FOCUS.filter(f => !g.board.obj.some(o => o.k === f.k && !o.soft) || P.focus.includes(f.k));
    body = `<h2>The board's target</h2><p>The board expects us to finish <b>${F.ord(P.base)}</b> in the ${F.TIERS[g.club.tier]}. Our squad ranks about ${F.ord(F.expectedRank())} on paper. You can negotiate.</p>
    <div class="choice">${F.preTargets().map(o => `<button class="card ${P.deal === o.k ? 'on' : ''}" data-a="pre-target" data-k="${o.k}"><b>${esc(o.t)}: finish ${F.ord(o.target)}</b>${esc(o.d)}<div class="e">${esc(o.fx)}</div></button>`).join('')}</div>
    <h2 style="margin-top:22px">Two focus goals</h2><p class="small">Pick two extra goals for the season. Met: board confidence up. Missed: a small dent. Already set by the board: ${esc(g.board.obj.filter(o => o.k !== 'league' && !o.soft).map(o => o.t.toLowerCase()).join('; '))}.</p>
    <div class="cards2">${fo.map(f => `<button class="card ${P.focus.includes(f.k) ? 'on' : ''}" data-a="pre-focus" data-k="${f.k}"><b style="font-size:17px">${esc(f.t())}</b><span class="small">${esc(f.d)}</span></button>`).join('')}</div>
    ${F.ACAD_PLANS ? `<h2 style="margin-top:22px">Academy plan</h2><p class="small">Optional: one goal for the academy this season. Same reward as a focus goal.</p><div class="cards2">${F.ACAD_PLANS.map(a => `<button class="card ${P.acad === a.k ? 'on' : ''}" data-a="pre-acad" data-k="${a.k}"><b style="font-size:17px">${esc(a.t())}</b><span class="small">${esc(a.d)}</span></button>`).join('')}</div>` : ''}
    <div class="row" style="margin-top:18px"><button class="btn" data-a="pre-step" data-i="1" ${P.deal && P.focus.length === 2 ? '' : 'disabled'}>Next: budget</button>${P.deal && P.focus.length === 2 ? '' : '<span class="small">Choose a target and two focus goals.</span>'}</div>`;
  } else if (st === 1) {
    const b = F.budgetCosts(), wf = F.weekForecast(), net = wf.rev - wf.cost;
    const row = (role, k, l, cost, note) => F.staff(role) || role === 'fin' ? `<div class="sl"><div class="spread"><label for="pb-${role}-${k}">${l}</label><span class="num">${cost != null ? money(cost) + '/wk' : ''}</span></div><input type="range" min="0" max="100" step="5" id="pb-${role}-${k}" value="${F.man(role, k)}" data-sl="${role}" data-k="${k}" data-p="pb"><div class="ends"><span>${note[0]}</span><span>${note[1]}</span></div></div>` : '';
    body = `<h2>Budget round</h2><p class="small">Set how much each department may spend this season, and how much cash Finance releases for transfers. You can change these later through the mandates.</p>
    ${row('scout', 'budget', 'Scouting', b.scouting, ['Lean', 'Lavish'])}${row('acad', 'budget', 'Academy', b.academy, ['Lean', 'Lavish'])}${row('mkt', 'budget', 'Marketing', b.marketing, ['Lean', 'Lavish'])}${row('fin', 'invest', 'Facility investment', b.facilities, ['Cut costs', 'Invest'])}${row('fin', 'transfer', 'Cash released for transfers', null, ['Hold cash', 'Fund transfers'])}
    <dl class="figs"><div><dt>Expected revenue</dt><dd>${money(wf.rev)}/wk</dd></div><div><dt>Expected costs</dt><dd>${money(wf.cost)}/wk</dd></div><div><dt>Weekly result</dt><dd class="${net < 0 ? 'bad' : 'good'}">${net >= 0 ? '+' : ''}${money(net)}</dd></div><div><dt>Transfer budget</dt><dd>${money(F.transferBudget())}</dd></div><div><dt>Cash</dt><dd>${money(g.club.cash)}</dd></div></dl>
    <div class="row" style="margin-top:18px"><button class="btn ghost" data-a="pre-step" data-i="0">Back</button><button class="btn" data-a="pre-step" data-i="2">Next: recruitment</button></div>`;
  } else if (st === 2) {
    body = `<h2>Recruitment plan</h2><p class="small">Tell ${esc(F.staffName('dof'))} where to look. The scouts work to these priorities; the DoF uses your limits when he negotiates.</p>${recPlanBlock()}
    <div class="row" style="margin-top:18px"><button class="btn ghost" data-a="pre-step" data-i="1">Back</button><button class="btn" data-a="pre-step" data-i="3">Next: projects</button></div>`;
  } else {
    body = `${g.meeting && g.meeting.items.length ? meetingBlock(g.meeting, 'Pre-season planning meeting') : '<p class="note">No proposals this summer.</p>'}
    <div class="row" style="margin-top:18px"><button class="btn ghost" data-a="pre-step" data-i="2">Back</button><button class="btn" data-a="pre-done">Lock the plan and meet the press</button></div>`;
  }
  return `<div class="setup" style="max-width:860px"><div class="step">Pre-season, season ${g.season}. ${F.TIERS[g.club.tier]}.</div><h1 style="font-size:40px;margin:6px 0 12px">Plan the season</h1>${nav}${body}</div>`;
}
function vPress() {
  const g = G(), ids = g.press, i = U.pressI, first = g.season === 1 && !g.pressDone;
  const prog = `<div class="progress">${ids.map((_, k) => `<i class="${k === i && !U.quote ? 'on' : k < i ? 'done' : ''}"></i>`).join('')}</div>`;
  const crowd = `<div class="presshall"><div class="mics">${[9101, 9102, 9103, 9104].map((sd, k) => `<span class="jface ${k === (i % 4) ? 'ask' : ''}">${ART.face(sd + i * 3, { role: 'press', age: 28 + k * 7, bg: '#dfe9f5', emo: k === (i % 4) ? 'surprised' : null })}</span>`).join('')}</div><div class="podium">${crest(g.club.colors, g.club.short, 34)}<b>${first ? 'Unveiling' : 'Press conference'}</b></div></div>`;
  if (U.quote) return `<div class="setup">${prog}${crowd}<article class="paper qpaper"><div class="mast">THE ${esc(g.club.city.toUpperCase())} GAZETTE <small>Tomorrow</small></div><h2 class="ehead2" style="max-width:none">"${esc(U.quote)}"</h2><p class="esub2">The new CEO, speaking to the press.</p>${U.quoteP ? '<div class="promise">PROMISE: checked at the end of the season</div>' : ''}</article>
    <div class="trayspace" style="--tray:100px"></div></div>${trayHtml('', `<button class="btn" data-a="press-next">${i >= ids.length ? (first ? 'Start the season' : 'Back to work') : 'Next question'}</button>`, '')}`;
  const q = F.pressView(F.PRESS.find(p => p.id === ids[i])), FXI = { fans: 'fans', press: 'press', spons: 'money', board: 'board' };
  return `<div class="setup">${prog}${crowd}<div class="bubble" style="margin-top:18px"><div class="who">A reporter asks</div>${esc(q.q)}</div>
  <div class="trayspace" style="--tray:${80 + q.a.length * 66}px"></div></div>${trayHtml('<span>Your answer</span><span>On the record</span>', q.a.map((a, j) => `<button class="cho" data-a="press" data-q="${q.id}" data-i="${j}">${a.promise ? '<span class="pk" style="background:#d9472b;color:#fff">Promise</span>' : ''}<b>"${esc(a.t)}"</b><span class="fx">${Object.entries(a.fx).filter(([k]) => FXI[k]).map(([k, v]) => `<span class="eff ${v > 0 ? 'up' : 'dn'}">${ART.I[FXI[k]]}${v > 0 ? '+' : '−'}${Math.abs(v)}</span>`).join('')}</span></button>`).join(''), '')}`;
}
function masthead() { const g = G(), c = g.club; return `<header class="hd">${crest(c.colors, c.short, 26)}<b>${esc(c.name)}</b><span class="wk" title="${F.blockOf ? esc(F.blockOf(g.week).t) : ''}">Wk ${Math.min(g.week, F.SEASON_WEEKS)}</span><button class="snd" data-a="sheet" data-s="help" aria-label="Help">?</button><button class="snd" data-a="sound" aria-label="Sound ${ART.SND.on() ? 'on' : 'off'}" aria-pressed="${ART.SND.on()}">${ART.SND.on() ? ART.I.sound : ART.I.mute}</button></header>`; }
function dl(now, k, fmt) { const p = G().prev; if (!p || p[k] == null) return ''; const prev = k === 'pos' ? -p.pos : p[k], d = now - prev; if (Math.abs(d) < (k === 'cash' ? 1 : 0.5)) return ''; return ` <small class="${d > 0 ? 'good' : 'bad'}">${d > 0 ? '▲' : '▼'}${fmt ? fmt(Math.abs(d)) : r0(Math.abs(d))}</small>`; }
function tabs() { return `<nav class="tabs">${[['desk', 'Desk'], ['news', 'News'], ['club', 'Club'], ['staff', 'Staff'], ['squad', 'Squad'], ['league', 'League']].map(([k, l]) => `<button class="${U.tab === k ? 'on' : ''}" data-a="tab" data-t="${k}">${l}</button>`).join('')}</nav>`; }

function vMsg(m) {
  const v = F.msgView(m);
  if (v.done) return `<article class="msg done"><div class="kick">${esc(cap(v.dept))}</div><h3>${esc(v.title)}</h3><div class="from">${esc(v.from)}</div><div class="outcome"><b>${v.by === 'you' ? 'You' : esc(v.by)}: ${esc(v.opts[v.choice].l)}.</b> ${esc(v.outcome)}</div></article>`;
  return `<article class="msg"><div class="kick">${esc(cap(v.dept))}</div><h3>${esc(v.title)}</h3><div class="from">${esc(v.from)}</div><div class="body">${esc(v.body)}</div>
  <p class="why"><b>On your desk because</b> ${esc(v.why)}</p>
  ${v.second ? (v.second.text ? `<p class="second">${esc(v.second.text)}</p>` : v.second.avail ? `<button class="btn ghost small" style="margin-bottom:10px" data-a="second" data-m="${m.id}" ${G().ap < 1 ? 'disabled' : ''}>Ask ${esc(v.second.name)} (${esc(v.second.role)}) for a second opinion: 1 action</button>` : '') : ''}
  <div class="opts">${v.opts.map((o, i) => `<button class="opt ${i === v.auto ? 'auto' : ''}" data-a="opt" data-m="${m.id}" data-i="${i}" ${G().ap < 1 ? 'disabled' : ''}><b>${esc(o.l)}</b><span>${esc(o.h)}</span></button>`).join('')}</div>
  <div class="foot">Costs one action. If you leave it, ${esc(v.autoWho)} will choose: "${esc(v.opts[v.auto].l)}" (dashed).</div></article>`;
}
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '';
function vNews() { return `<article class="om gzwrap">${gazette()}</article>`; }
function tile(l, v, sub, cls, k) { return `<div class="tile"><span class="tl">${l}</span><b class="${cls || ''}">${v}</b>${k || ''}<span class="ts">${sub || ''}</span></div>`; }
function vDesk() {
  const g = G(), c = g.club, pend = g.inbox.filter(m => !m.done), doneW = g.inbox.filter(m => m.done && m.season === g.season && m.week === g.week), A = F.analysis(), lm = g.lastMatch;
  const st = A.pos <= A.target ? 'good' : A.pos <= A.target + 2 ? 'warn' : 'bad';
  const last = lm ? `${lm.result === 'W' ? 'Won' : lm.result === 'L' ? 'Lost' : 'Drew'} ${lm.home ? lm.ug + '–' + lm.tg : lm.tg + '–' + lm.ug} ${lm.home ? 'v' : 'at'} ${lm.oppName}` : '';
  return `<section class="stats">
    ${tile('Position', F.ord(A.pos), `target ${F.ord(A.target)}${A.g ? ', forecast ' + F.ord(A.fc) : ''}`, st, dl(-F.myPos(), 'pos', v => Math.abs(v)))}
    ${tile('Board', r0(g.board.conf) + '%', 'confidence', g.board.conf < 30 ? 'bad' : '', dl(g.board.conf, 'conf'))}
    ${tile('Supporters', r0(g.st.fans), 'mood', g.st.fans < 35 ? 'bad' : '', dl(g.st.fans, 'fans'))}
    ${tile('Cash', money(c.cash), `budget ${money(F.transferBudget())}`, c.cash < 0 ? 'bad' : '', dl(c.cash, 'cash', money))}
  </section>
  <div class="deskbar">${lm ? `<button class="linkish" data-a="tab" data-t="news">${esc(last)}. Read the paper</button>` : '<span class="small">Week one. Your staff are waiting for direction.</span>'}${A.g ? `<button class="linkish" data-a="sheet" data-s="analysis">${A.behind ? 'Why are we behind?' : 'Performance analysis'}</button>` : ''}</div>
  ${!g.flags.howto ? `<div class="note">Your staff handle everything their mandates allow. Only decisions that need you appear here, each with the reason. Leave one and the staff member decides (dashed option). You have three actions a week. The big choices were made in pre-season; there is one review meeting in week 17. <button class="linkish" data-a="howto">Got it</button></div>` : ''}
  ${vMeeting()}
  ${vBriefs()}
  <div class="deskhead"><h2>Decisions${pend.length ? ' (' + pend.length + ')' : ''}</h2><span class="row" style="gap:6px"><button class="btn ghost small" data-a="sheet" data-s="talk" ${g.ap < 1 ? 'disabled' : ''}>One-to-one</button><button class="btn ghost small" data-a="sheet" data-s="push" ${g.ap < 1 ? 'disabled' : ''}>Back a department</button></span></div>
  ${pend.length ? pend.map(vMsg).join('') : `<p class="note">Nothing needs you this week. Your staff are working within their mandates.${F.nextMeeting() && F.nextMeeting() !== g.week ? ` Next management meeting: week ${F.nextMeeting()}.` : ''}</p>`}
  ${doneW.length ? `<h3 style="margin:18px 0 6px">Decided this week</h3><ul class="list">${doneW.map(m => { const v = F.msgView(m); return `<li style="display:block"><b>${esc(v.title)}</b><div class="small">${v.by === 'you' ? 'You' : esc(v.by)}: ${esc(v.opts[v.choice].l)}. ${esc(v.outcome)}</div></li>`; }).join('')}</ul>` : ''}`;
}
function vBriefs() {
  const g = G(), B = g.briefs || []; if (!B.length) return '';
  return `<div class="deskhead"><h2>This week</h2><span class="small">Quick responses, no action cost</span></div><div class="briefs">${B.map(b => { const v = F.briefView(b); return `<article class="brief ${v.done ? 'done' : ''}"><div class="kick">${esc(v.who)}</div><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p>${v.done ? `<p class="outcome"><b>${esc(v.opts[v.choice].l)}.</b> ${esc(v.out)}</p>` : `<div class="chipsrow">${v.opts.map((o, i) => `<button class="chipbtn" data-a="brief" data-b="${b.id}" data-i="${i}"><b>${esc(o.l)}</b>${o.h ? `<span>${esc(o.h)}</span>` : ''}</button>`).join('')}</div>`}</article>`; }).join('')}</div>`;
}
function vPlayBar() {
  const g = G(), pend = g.inbox.filter(m => !m.done).length + (g.meeting && g.meeting.week === g.week && g.meeting.season === g.season ? g.meeting.items.filter(i => i.status === 'open').length : 0);
  return `<div class="playbar"><div class="pb-in"><div class="pb-txt">${apPips(g.ap)} <span>${pend ? `${pend} open, staff decide if you play on` : 'All clear'}</span><small>${nextFixture()}</small></div><button class="btn" data-a="end">Play week ${g.week}</button></div></div>`;
}
function vStand() {
  const g = G(), A = F.analysis(); if (!A.g) return '';
  const st = A.pos <= A.target ? 'good' : A.pos <= A.target + 2 ? 'warn' : 'bad';
  return `<section class="stand ${st}"><div class="spread"><div><div class="kick">Where we stand</div><h3 style="font-size:22px">${F.ord(A.pos)} <span class="small">target ${F.ord(A.target)}</span></h3></div><button class="btn ghost small" data-a="sheet" data-s="analysis">Why? See the analysis</button></div>
  <p class="small" style="margin:6px 0 0">${A.pos <= A.target ? 'On target.' : `${A.gap} point${A.gap === 1 ? '' : 's'} off ${F.ord(A.target)}.`} Forecast: ${A.fc ? F.ord(A.fc) : '–'}. Points ${A.pts}, deserved on chances ${A.xpts.toFixed(0)}.${A.causes.length && A.behind ? ' Main issue: ' + esc(A.causes[0].t.split('.')[0]) + '.' : ''}</p></section>`;
}
function vMeeting() {
  const g = G(), mt = g.meeting; if (!mt || mt.pre || mt.week !== g.week || mt.season !== g.season || !mt.items.length) return '';
  return meetingBlock(mt, 'Mid-season review');
}
/* ---------- project pitches: one at a time, swipe or tap ---------- */
function pitchCard(it, i, mt) {
  const v = F.proposalView(it), pot = F.meetingPot(), tot = v.track.ok + v.track.fail, sp = splitSay(v.pitch);
  const imp = v.impact.slice(0, 2), why = v.impact.length && v.impact[0][1] !== '' ? `${v.impact[0][0]} is ${v.impact[0][1]} today.` : v.benefit;
  return `<div class="pcard swipe" data-i="${i}" tabindex="0" aria-label="Pitch: ${esc(v.title)}. Swipe right to approve, left to reject.">
    <span class="stampR">APPROVE</span><span class="stampL">REJECT</span>
    <div class="phd"><div class="portrait">${ART.staffFace(it.owner, v.pc > .7 ? 'happy' : null)}</div><div><b>${esc(v.owner)}</b><span class="small">${esc(v.ownerRole)}${tot ? `, delivered ${v.track.ok} of ${tot}` : ''}</span></div></div>
    <h3 class="ptitle">${esc(v.title)}</h3>
    <p class="ppitch">${esc(sp.say)}</p>
    ${why ? `<div class="why">${ART.I.bulb}<span><b>Why now:</b> ${esc(why)}</span></div>` : ''}
    ${imp.length ? `<div class="imp2">${imp.map(r => `<div><small>${esc(r[0])}</small><b>${esc(r[1])}${r[1] !== '' ? ' → ' : ''}<em>${esc(r[2])}</em></b></div>`).join('')}</div>` : ''}
    <div class="cost"><span class="${it.cost > pot ? 'bad' : ''}">${ART.I.money}${money(v.cost)}</span><span>${ART.I.wage}${v.wk ? money(v.wk) + '/wk' : 'none'}</span><span>${ART.I.time}${v.dur} wk</span><span>${ART.I.trust}${Math.round(v.pc * 100)}%</span></div>
    ${v.second ? `<p class="second2"><b>${esc(v.second.name)}:</b> ${esc(v.second.t)} (${Math.round(v.second.est * 100)}%)</p>` : ''}
  </div>`;
}
function pitchDeck(mt, kick, inTray) {
  const g = G(), pot = F.meetingPot(), items = mt.items.map((it, i) => ({ it, i })), open = items.filter(o => o.it.status === 'open'), done = items.filter(o => o.it.status !== 'open');
  const cur = open[0], cost = cur ? cur.it.cost : 0;
  const meter = `<div class="pmeter"><div class="row"><span>Available to invest</span><b>${money(pot)}</b></div><div class="bar"><u style="width:${pot ? Math.min(100, cost / pot * 100) : 0}%" class="${cost > pot ? 'over' : ''}"></u></div><small>${cur ? (cost > pot ? 'This pitch costs more than Finance can release.' : `This pitch uses ${money(cost)}. ${money(pot - cost)} left.`) : 'All pitches decided.'}</small></div>`;
  const deck = cur ? `<div class="deck">${open.length > 2 ? '<div class="pcard back2"></div>' : ''}${open.length > 1 ? '<div class="pcard back"></div>' : ''}${pitchCard(cur.it, cur.i, mt)}</div><div class="swipehint"><span>${ART.I.back} Reject</span><span>Approve ${ART.I.chev}</span></div>` : '';
  const v = cur ? F.proposalView(cur.it) : null;
  const btns = cur ? `<div class="row3"><button class="btn ghost no" data-a="prop" data-i="${cur.i}" data-c="reject">Reject</button>${!v.revised ? `<button class="btn ghost" data-a="prop" data-i="${cur.i}" data-c="revise">Cheaper</button>` : ''}<button class="btn" data-a="prop" data-i="${cur.i}" data-c="approve" ${cur.it.cost > pot ? 'disabled' : ''}>Approve</button></div>${!v.second ? `<button class="linkbtn" data-a="prop" data-i="${cur.i}" data-c="second" ${!mt.pre && g.ap < 1 ? 'disabled' : ''}>Ask for a second opinion${mt.pre ? '' : ' (1 action)'}</button>` : ''}` : '';
  const doneList = done.length ? `<div class="decided">${done.map(o => { const v2 = F.proposalView(o.it); return `<span class="${o.it.status === 'approved' ? 'good' : 'bad'}">${o.it.status === 'approved' ? '✓' : '✕'} ${esc(v2.title)}</span>`; }).join('')}</div>` : '';
  return `<section class="pitches"><div class="spread"><h2 class="itemh" style="margin:0">${esc(kick)}</h2><span class="chip">${cur ? `${done.length + 1} of ${items.length}` : 'Done'}</span></div>${meter}${deck}${doneList}${inTray ? '' : btns}</section>${inTray && cur ? (U.tray = trayHtml('', btns, ''), U.trayH = 130, '') : ''}`;
}
function meetingBlock(mt, kick) { return pitchDeck(mt, kick, false); }
function nextFixture() { const g = G(), r = g.divs[g.club.tier].fix[g.week - 1]; if (!r) return ''; const f = r.find(x => x[0] === 0 || x[1] === 0); const home = f[0] === 0, opp = home ? f[1] : f[0]; const cup = g.cup.alive && g.cup.weeks.includes(g.week) ? ` Midweek: National Cup ${g.cup.names[g.cup.weeks.indexOf(g.week)]}.` : ''; return `${home ? 'Home to' : 'Away at'} ${esc(F.cname(opp))} (${F.ord(F.sortTable(g.club.tier).indexOf(opp) + 1)}).${cup}`; }

function vClub() {
  const g = G(), c = g.club, al = F.alignment();
  const lab = (k, v) => F.DNA.find(q => q.k === k).o.find(o => o.v === v).l;
  const deals = c.deals.map(d => `<li><span>${esc(d.name)}</span><span class="num">${money(d.wk)}/wk, ${d.weeks > 150 ? 'long term' : d.weeks + ' wk'}</span></li>`).join('');
  const nets = Object.keys(F.REGIONS).map(k => meter(F.REGIONS[k].name, c.net[k])).join('');
  const SC = F.scorecard();
  return `<h2 style="font-size:28px;margin-bottom:4px">Departments</h2><p class="small" style="margin-top:0">The key numbers per department, with a reference point. Green is good, red needs attention. Projects change these numbers.</p>
  <div class="cards">${SC.map(d => `<section class="sc"><div class="spread"><h3 style="font-size:19px">${esc(d.t)}</h3><span class="small">${esc(F.staffName(d.head))}</span></div>${d.rows.map(r => `<div class="scr"><span>${esc(r.l)}</span><b class="${r.ok === true ? 'good' : r.ok === false ? 'bad' : ''}">${esc(r.v)}</b>${r.ref ? `<small>${esc(r.ref)}</small>` : ''}</div>`).join('')}</section>`).join('')}</div>
  <div class="grid2" style="margin-top:22px">
  <section class="panel"><div class="row">${crest(c.colors, c.short, 64)}<div><h2 style="margin:0">${esc(c.name)}</h2><div class="small">Founded in ${esc(c.city)}, season 1.</div></div></div>
    <h3>Club DNA</h3><div class="chips">${F.DNA.map(q => `<span class="chip">${esc(lab(q.k, c.dna[q.k]))}</span>`).join('')}</div>
    ${meter('DNA alignment', al)}<p class="small">How closely your mandates and decisions match the DNA. Below 60, supporters and the board lose faith.</p>
    <h3>Stakeholders</h3>${meter('Board', g.board.conf)}${meter('Supporters', g.st.fans)}${meter('Sponsors', g.st.spons)}${meter('Press', g.st.press)}${meter('Brand', c.brand)}
    ${g.trophies.length ? `<h3>Honours</h3><ul class="list">${g.trophies.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}</section>
  <section class="panel"><h2>Board objectives</h2><ul class="list">${g.board.obj.map(o => `<li><span>${esc(o.t)}</span><b class="${F.objMet(o) ? 'good' : 'bad'}">${F.objMet(o) ? 'On track' : 'Off track'}</b></li>`).join('')}</ul>
    <h3>Your public promises</h3>${g.promises.filter(p => p.season === g.season).length ? `<ul class="list">${g.promises.filter(p => p.season === g.season).map(p => `<li><span>${esc(p.t)}</span><b class="${p.status === 'broken' ? 'bad' : F.promiseMet(p) ? 'good' : 'warn'}">${p.status === 'broken' ? 'Broken' : F.promiseMet(p) ? 'On track' : 'At risk'}</b></li>`).join('')}</ul>` : '<p class="small">No promises this season.</p>'}
    ${g.history.length ? `<h3>History</h3><ul class="list">${g.history.map(h => `<li><span>Season ${h.season}</span><span class="num">${F.ord(h.pos)}, ${F.TIERS[h.tier]}</span></li>`).join('')}</ul>` : ''}</section>
  <section class="panel"><h2>Scouting</h2><p class="small">Network strength per region. ${esc(F.staffName('scout'))} focuses on ${esc(F.REGIONS[F.man('scout', 'reg1')].name)} and ${esc(F.REGIONS[F.man('scout', 'reg2')].name)}. Stronger networks mean better targets.</p>${nets}
    <h3>Shortlist</h3>${(g.shortlist || []).length ? `<ul class="list">${g.shortlist.slice().reverse().map(p => `<li><span>${esc(p.name)} <span class="small">${p.pos}, ${p.age}, ${esc(F.REGIONS[p.region].name)}${p.fee ? ', ' + money(p.fee) : ', free'}</span></span><span>${stars(F.stars(p.pCA))} ${stars(F.stars(p.pPA))}</span></li>`).join('')}</ul><p class="small">Your scouts' estimates, not the truth. The Director of Football picks from this list first. Accuracy depends on the scout, the network and the data slider.</p>` : '<p class="small">Empty. Scouts add names as they watch matches.</p>'}</section>
  <section class="panel"><h2>Academy</h2>${(() => { const v = F.acadView(); return `<dl class="kv"><dt>Pipeline U14 / U16 / U18 / U21</dt><dd>${v.groups.map(x => x.players.length).join(' / ')}</dd><dt>Facilities</dt><dd>level ${c.fac.youth}</dd><dt>Reputation</dt><dd>${Math.round(v.a.rep)}</dd><dt>Graduates in squad</dt><dd>${v.grads.length}</dd></dl>`; })()}<button class="btn small" style="margin-top:10px" data-a="acad-open">Open the academy</button></section>
  <section class="panel"><h2>Commercial</h2><dl class="kv"><dt>Ticket price</dt><dd>${money(F.ticketPrice())}</dd><dt>Last home crowd</dt><dd>${(c.lastAtt || 0).toLocaleString('en-GB')} / ${c.cap.toLocaleString('en-GB')}</dd><dt>Sponsorship income</dt><dd>${money(F.sponsorIncome())}/wk</dd></dl><h3>Deals</h3><ul class="list">${deals || '<li class="small">No deals.</li>'}</ul></section>
  <section class="panel"><h2>Projects</h2>${(g.projects || []).length ? `<ul class="list">${g.projects.map(pr => { const v = F.PROP[pr.id]; let t = ''; try { t = typeof v.title === 'function' ? v.title(pr.ctx) : v.title; } catch (e) { } const left = pr.due - F.absWeek(), tot = pr.due - pr.start; return `<li style="display:block"><div class="spread"><span>${esc(t)}</span><span class="small">${left > 0 ? left + ' wk left' : 'due'}</span></div>${bar(tot - Math.max(0, left), tot)}<div class="small">${esc(F.staffName(pr.owner))}${pr.wk ? ', ' + money(pr.wk) + '/wk' : ''}</div></li>`; }).join('')}</ul>` : '<p class="small">No projects running. Approve proposals at the management meeting.</p>'}
    ${(g.projLog || []).length ? `<h3>Completed</h3><ul class="list">${g.projLog.slice(0, 8).map(l => `<li><span>${esc(l.title)}</span><b class="${l.ok ? 'good' : 'bad'}">${l.ok ? 'Delivered' : 'Failed'}</b></li>`).join('')}</ul>` : ''}</section>
  <section class="panel"><h2>Marketing and business</h2><dl class="kv"><dt>Supporter base</dt><dd>${c.fanbase.toLocaleString('en-GB')}</dd><dt>Brand strength</dt><dd>${r0(c.brand)}</dd><dt>Stadium capacity</dt><dd>${c.cap.toLocaleString('en-GB')}</dd><dt>Training ground</dt><dd>Level ${c.fac.train} of 10</dd><dt>Debt</dt><dd>${money(c.debt)}</dd></dl>${F.CAPREQ[c.tier - 1] ? `<p class="small">Licensing: the ${F.TIERS[c.tier - 1]} requires ${F.CAPREQ[c.tier - 1].toLocaleString('en-GB')} seats.</p>` : ''}</section>
  </div>`;
}
function vAcademy() {
  const g = G(), v = F.acadView(), a = v.a, c = g.club, sel = U.ag || 'U18', grpD = v.groups.find(x => x.k === sel), last = a.lastSeason;
  const maxN = Math.max(10, a.found.n / 4);
  const funnel = [{ l: 'Foundation', n: a.found.n, t: `${a.found.n} kids, quality ${Math.round(a.found.q)}`, w: a.found.n / 4 }, ...v.groups.map(x => ({ l: x.k, n: x.players.length, t: `${x.players.length} players${x.players[0] ? ', best ' + x.players[0].band[0] + '–' + x.players[0].band[1] + '★' : ''}. Coaching ${x.lv.toFixed(1)}`, w: x.players.length })), { l: 'First team', n: v.grads.length, t: `${v.grads.length} graduates in the squad`, w: v.grads.length }];
  const flag = p => [p.playUp ? 'plays up' : '', p.loanOut ? 'on loan' : '', p.mentor ? 'mentor' : '', p.lateJoin ? 'late join' : ''].filter(Boolean).join(', ');
  return `<button class="linkish" data-a="acad-close">Back to the club</button>
  <div class="spread" style="margin:6px 0 4px"><div><div class="kick">Youth academy</div><h2 style="font-size:32px">${esc(c.name)} Academy</h2></div><div class="row"><button class="btn small" data-a="sheet" data-s="mand" data-r="acad" ${F.staff('acad') ? '' : 'disabled'}>Academy mandate</button></div></div>
  <p class="small">Run by ${esc(F.staffName('acad'))}. Facilities level ${c.fac.youth}, reputation ${Math.round(a.rep)}, costs ${money(v.cost + (g.fin.last ? 0 : 0))}/wk on top of the academy budget. Our division plays at about ${v.tierLvl}★ on the absolute scale.</p>
  <div class="grid2"><section class="panel"><h2>${esc(F.acadCatName(v.cat))}</h2>${v.catScore.parts.map(p => `<div class="meter" style="grid-template-columns:110px minmax(0,1fr) 54px"><span>${p[0]}</span>${bar(p[1], p[2])}<span class="num">${Math.round(p[1])}/${p[2]}</span></div>`).join('')}
    <p class="small">Score ${Math.round(v.catScore.total)}. Category 3 from 55, category 2 from 75, category 1 from 95. Audit in week 30. A better category means better intakes, a grant, international recruitment and higher fees when rivals poach.</p></section>
  <section class="panel"><h2>${v.diag.length ? 'Why the academy is held back' : 'Academy health'}</h2>${v.diag.length ? v.diag.map(d => `<div class="lever"><p>${esc(d.t)}</p>${d.a === 'mand' ? `<button class="btn ghost small" data-a="sheet" data-s="mand" data-r="${d.x}" ${F.staff(d.x) ? '' : 'disabled'}>Open ${esc(F.ROLE[d.x].t)} mandate</button>` : d.a === 'tab' ? `<button class="btn ghost small" data-a="tab" data-t="${d.x}">Go to ${esc(d.x)}</button>` : ''}</div>`).join('') : '<p>No structural problems. Budget, coaching, welfare and the pathway are all in decent shape.</p>'}
    <h3>Return on investment</h3><dl class="kv"><dt>Spent since founding</dt><dd>${money(v.roi.spent)}</dd><dt>Earned (sales, fees, grants)</dt><dd>${money(v.roi.earned)}</dd><dt>Value of graduates in squad</dt><dd>${money(v.roi.val)}</dd><dt>Net</dt><dd class="${v.roi.net >= 0 ? 'good' : 'bad'}">${v.roi.net >= 0 ? '+' : ''}${money(v.roi.net)}</dd><dt>Cost per graduate</dt><dd>${v.roi.perGrad ? money(v.roi.perGrad) : '–'}</dd></dl></section></div>
  <section class="panel" style="margin-top:18px"><h2>Pipeline</h2>${funnel.map(f => `<div class="fun"><span>${f.l}</span><div class="bar"><i style="width:${Math.min(100, f.w / maxN * 100)}%"></i></div><span class="small">${esc(f.t)}</span></div>`).join('')}
  <p class="small">Potential is shown on the absolute scale, as a range: the better your coaches and recruiters, and the older the player, the narrower the range.</p></section>
  <section class="panel" style="margin-top:18px"><div class="spread"><h2>Players</h2><div class="seg">${['U14', 'U16', 'U18', 'U21'].map(k => `<button class="${sel === k ? 'on' : ''}" data-a="ag" data-v="${k}">${k}</button>`).join('')}</div></div>
  <div class="scroll"><table><thead><tr><th>Player</th><th>Age</th><th>Now</th><th>Potential</th><th>School</th><th>Welfare</th><th>Notes</th></tr></thead><tbody>${grpD.players.map(p => `<tr data-a="player" data-id="${p.id}"><td>${esc(p.name)}<span class="pos">${p.pos}</span></td><td>${p.age}</td><td>${stars(F.absStars(p.ca))}</td><td class="num">${p.band[0]}–${p.band[1]}★</td><td class="${p.edu < 40 ? 'bad' : ''}">${Math.round(p.edu)}</td><td class="${p.wel < 45 ? 'bad' : ''}">${Math.round(p.wel)}</td><td class="small">${esc(flag(p))}</td></tr>`).join('') || `<tr><td colspan="7" class="small">No players in the ${sel} group.</td></tr>`}</tbody></table></div>
  <p class="small">Coaching level ${grpD.lv.toFixed(1)} out of 10. School and welfare drive drop-outs: below 40 to 45 is a warning sign.</p></section>
  <div class="grid2" style="margin-top:18px">${['U18', 'U21'].map(k => { const t = v.lg[k], me = t.findIndex(x => x.id === 0); const last = k === 'U18' ? v.lg.lastU18 : v.lg.lastU21; return `<section class="panel"><h2>${k} league</h2>${last ? `<p class="small">Last: ${last.us > last.them ? 'won' : last.us < last.them ? 'lost' : 'drew'} ${last.us}–${last.them} against ${esc(last.opp)}${last.star ? '. ' + esc(last.star) + ' stood out' : ''}.</p>` : ''}<table><thead><tr><th>Team</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>${t.map((x, i) => i < 4 || Math.abs(i - me) <= 1 ? `<tr class="${x.id === 0 ? 'me' : ''}"><td>${i + 1}. ${esc(x.n)}</td><td>${x.p}</td><td>${sign(x.gf - x.ga)}</td><td>${x.pts}</td></tr>` : '').join('')}</tbody></table></section>`; }).join('')}</div>
  <section class="panel" style="margin-top:18px"><h2>Youth Cup</h2>${v.cup && v.cup.log.length ? `<ul class="list">${v.cup.log.map(l => `<li><span>${cap(l.rd)}: ${esc(l.opp)}</span><b class="${l.win ? 'good' : 'bad'}">${l.win ? 'Won' : 'Lost'}</b></li>`).join('')}</ul>` : '<p class="small">First round in week 9.</p>'}${v.honours.length ? `<p class="small">Honours: ${esc(v.honours.join(', '))}.</p>` : ''}</section>
  <div class="grid2" style="margin-top:18px"><section class="panel"><h2>Academy staff</h2>${v.staff.map(({ r, s }) => s ? `<div class="ystaff"><div class="spread"><div><div class="role">${esc(r.t)}</div><b>${esc(s.name)}</b></div><span class="small">${money(s.wage)}/wk</span></div><div class="small">${esc(s.bio)}.</div>${r.at.map((l, i) => `<div class="attr"><span>${l}</span>${bar(s.at[i], 20, 'ink')}<span class="num">${s.at[i]}</span></div>`).join('')}<button class="linkish" data-a="ysack" data-r="${r.id}">Ask the Director to replace him (${money(s.wage * 10)})</button></div>` : `<div class="ystaff"><div class="role">${esc(r.t)}</div><p class="small">Vacant. The Academy Director fills it at season end${F.staff('acad') ? '' : ', once there is a Director'}.</p></div>`).join('')}</section>
  <section class="panel"><h2>Last season</h2>${last ? `<div class="kvs">${[['Promoted to first team', last.promoted], ['New scholars', last.scholars], ['Kept as under-21s', last.u21], ['On loan', last.loans], ['Growth spurts', last.spurts], ['Late bloomers', last.bloom], ['Released', last.released], ['Dropped out', last.dropped]].map(([l, a]) => `<p><b>${l}</b> ${esc(a.join(', ') || 'none')}</p>`).join('')}</div>` : '<p class="small">The first review comes at the end of this season.</p>'}
  <h3>Graduates</h3>${a.log.length ? `<ul class="list">${a.log.slice().reverse().slice(0, 10).map(l => `<li><span>${esc(l.name)} <span class="small">${l.pos}, season ${l.season}</span></span><span class="num">${l.pot}★ potential</span></li>`).join('')}</ul>` : '<p class="small">No graduates yet.</p>'}</section></div>`;
}
function vStaff() {
  const g = G();
  return `<p class="small">Your only levers: who holds each job, the mandate they work to, and how you talk to them. Changing a mandate, a one-to-one and a dismissal each cost one action.</p><div class="grid2">${F.ROLES.map(r => {
    const s = g.staff[r.id];
    if (!s) return `<div class="staff vacant"><div class="role">${r.t}</div><h3>Vacant</h3><p class="small">Decisions in ${r.dept} fall to chance, and the department underperforms.</p><button class="btn small" data-a="sheet" data-s="cands" data-r="${r.id}">See candidates</button></div>`;
    return staffCard(s, r.id, { live: true, actions: `<div class="row" style="margin-top:6px"><button class="btn small" data-a="sheet" data-s="mand" data-r="${r.id}">Mandate</button><button class="btn ghost small" data-a="sheet" data-s="talk" data-r="${r.id}" ${g.ap < 1 ? 'disabled' : ''}>Talk</button><button class="btn ghost small" data-a="sheet" data-s="fire" data-r="${r.id}">Dismiss</button></div>` });
  }).join('')}</div>`;
}
function p90(v, m) { return m ? (v / m * 90).toFixed(2) : '–'; }
const STG_L = { identified: 'Identified', scouted: 'Scouted', recommended: 'Recommended', approach: 'Awaiting approval', negotiating: 'In talks', agreed: 'Agreed', signed: 'Signed', lost: 'Dropped' };
const GRADE_D = { A: 'Clear upgrade', B: 'Good addition', C: 'Squad level', D: 'Not for us' };
function squadSeg() { return `${tourCard('squad')}<div class="seg" style="margin-bottom:14px"><button class="${!U.sqTable ? 'on' : ''}" data-a="sqtable" data-v="0">Pitch</button><button class="${U.sqTable ? 'on' : ''}" data-a="sqtable" data-v="1">Stats table</button></div>`; }
function recRow(o) {
  const { x, p, k } = o, d = x.deal, note = x.blocked ? `Blocked by ${x.blocked.join(', ')}` : x.stage === 'negotiating' && d && d.rounds.length ? d.rounds[d.rounds.length - 1] : (x.log || []).slice(-1)[0] || '';
  return `<button class="rrow" data-a="target" data-id="${x.pid}"><span class="gr g${k ? k.grade : 'D'}">${k ? k.grade : '?'}</span><span class="rmain"><b>${esc(p.name)}</b> <span class="pos">${p.pos}</span><span class="small rsub">${p.age}, ${F.REGIONS[p.region].name}${p.pool ? (p.club ? ', ' + money(p.ask) : ', free agent') : ''}${k ? `, ${F.recBand(k)}, ${k.conf} confidence` : ''}</span>${note ? `<span class="small rnote ${x.blocked ? 'warn' : ''}">${esc(note)}</span>` : ''}</span></button>`;
}
function vRecruit() {
  const g = G(), V = F.recView(), R = V.r, groups = ['negotiating', 'approach', 'recommended', 'scouted', 'identified'];
  const thr = V.threshold === Infinity ? 'never' : V.threshold === 0 ? 'every deal' : 'above ' + money(Math.round(V.threshold));
  const pr = V.plan.prios.length ? V.plan.prios.map(x => `<span class="chip">${F.POS_L[x.pos]}: ${F.REC_KINDS[x.kind].toLowerCase()}</span>`).join('') : '<span class="small">No priorities set. The DoF follows squad needs.</span>';
  const live = V.rows.filter(o => groups.includes(o.x.stage)), done = V.rows.filter(o => !groups.includes(o.x.stage)).slice(-6).reverse();
  const sect = st => { const rs = live.filter(o => o.x.stage === st).sort((a, b) => (a.k ? a.k.grade : 'Z').localeCompare(b.k ? b.k.grade : 'Z')); return rs.length ? `<h3 class="rh">${STG_L[st]} <span class="small">${rs.length}</span></h3>${rs.slice(0, st === 'scouted' ? 6 : 10).map(recRow).join('')}${rs.length > (st === 'scouted' ? 6 : 10) ? `<p class="small">And ${rs.length - (st === 'scouted' ? 6 : 10)} more.</p>` : ''}` : ''; };
  const scouts = V.scouts.map(s => { const acc = F.recScoutAcc(s); return `<li><span><b>${esc(s.name)}</b>${s === F.staff('scout') ? ' <span class="small">Chief Scout</span>' : ''}<br><span class="small">${s.assign ? esc(s.assign.label) : 'Between assignments'}. Knows ${F.REGIONS[s.home || 'dom'].name} best. ${s.reports || 0} reports filed${acc ? `, signings off by ${acc.err.toFixed(1)}★ on average (${acc.n})` : ''}.</span></span></li>`; }).join('');
  return `<div class="spread"><div><h2 style="font-size:26px">Recruitment</h2><div class="small">${F.staffName('dof')} runs the list. Your scouts feed it. You set the plan and the limits.</div></div></div>
  <dl class="figs"><div><dt>Transfer budget</dt><dd>${money(V.budget)}</dd></div><div><dt>Window</dt><dd>${V.inWin ? (g.phase === 'summer' ? 'Summer' : `Shuts after week ${g.week <= 2 ? 2 : 18}`) : g.week < 17 ? 'Opens week 17' : 'Opens in summer'}</dd></div><div><dt>You approve</dt><dd>${thr}</dd></div><div><dt>Wage limit</dt><dd>${V.wageLimit === Infinity ? 'none' : money(Math.round(V.wageLimit)) + '/wk'}</dd></div></dl>
  <div class="spread" style="margin:6px 0 2px"><h3>Plan</h3><button class="btn ghost sm" data-a="recplan">Edit plan</button></div><div class="chips">${pr}</div>
  ${live.length ? groups.map(sect).join('') : `<p class="note">${V.scouts.length ? 'Nobody on the list right now. The scouts file new reports every week.' : 'Nobody on the list, and no Chief Scout to find anyone.'}</p>`}
  ${done.length ? `<h3 class="rh">Recent outcomes</h3>${done.map(recRow).join('')}` : ''}
  <h3 class="rh">Scouts</h3><ul class="list">${scouts || '<li>No Chief Scout. Nobody is watching players.</li>'}</ul>
  ${(() => { const ev = F.recEval ? F.recEval(g.season) : []; return ev.length ? `<h3 class="rh">This season's signings</h3><div class="scroll"><table><thead><tr><th>Player</th><th>Fee</th><th>Scouted, now</th><th>Apps</th><th>Rating</th><th></th></tr></thead><tbody>${ev.map(e => `<tr><td>${esc(e.name)} <span class="pos">${e.pos}</span>${e.loan ? ' <span class="small">loan</span>' : ''}</td><td class="num">${e.fee ? money(e.fee) : 'Free'}</td><td class="num">${e.est != null ? e.est + '★' : '–'}, ${e.now != null ? e.now + '★' : '–'}</td><td class="num">${e.apps != null ? e.apps : '–'}</td><td class="num">${e.rat ? e.rat.toFixed(2) : '–'}</td><td class="${e.cls}">${e.verdict}</td></tr>`).join('')}</tbody></table></div><p class="small">Hit: a regular with good ratings. Miss: rarely plays or rates poorly. Scouted against now shows how accurate the scouts were.</p>` : ''; })()}
  ${R.log.length ? `<h3 class="rh">Signed by this department</h3><ul class="list">${R.log.slice(0, 8).map(l => `<li><span>${esc(l.name)} <span class="pos">${l.pos}</span><br><span class="small">Season ${l.s}, week ${l.w}</span></span><span class="num">${l.fee ? money(l.fee) : 'Free'}</span></li>`).join('')}</ul>` : ''}
  <p class="small">Grades: A clear upgrade, B good addition, C squad level, D not for us. Ratings are ranges: more reports and better scouts make them narrower.</p>`;
}
function vRecruit2() {
  const g = G(), V = F.recView(), R = V.r, groups = ['identified', 'scouted', 'recommended', 'approach', 'negotiating'];
  const thr = V.threshold === Infinity ? 'Never' : V.threshold === 0 ? 'Every deal' : 'Over ' + money(Math.round(V.threshold));
  const live = V.rows.filter(o => groups.includes(o.x.stage)), done = V.rows.filter(o => !groups.includes(o.x.stage)).slice(-6).reverse();
  const cnt = st => live.filter(o => o.x.stage === st).length, mx = Math.max(1, ...groups.map(cnt));
  const funnel = `<div class="funnel">${groups.map(st => `<div class="fstep"><b>${cnt(st)}</b><i style="height:${8 + cnt(st) / mx * 40}px"></i><small>${esc(STG_L[st])}</small></div>`).join('')}</div>`;
  const sect = st => { const rs = live.filter(o => o.x.stage === st).sort((a, b) => (a.k ? a.k.grade : 'Z').localeCompare(b.k ? b.k.grade : 'Z')), lim = st === 'scouted' || st === 'identified' ? 5 : 8; return rs.length ? `<div class="sub2">${esc(STG_L[st])} <span>${rs.length}</span></div>${rs.slice(0, lim).map(recRow).join('')}${rs.length > lim ? `<p class="small" style="margin:4px 0">And ${rs.length - lim} more.</p>` : ''}` : ''; };
  const pr = V.plan.prios.length ? `<div class="traits">${V.plan.prios.map(x => `<span>${F.POS_L[x.pos]}: ${esc(F.REC_KINDS[x.kind].toLowerCase())}</span>`).join('')}</div>` : '<p class="small" style="margin:0">No priorities set. The DoF follows squad needs.</p>';
  const scouts = V.scouts.map(sc => { const acc = F.recScoutAcc(sc), chief = sc === F.staff('scout'); return `<div class="pcard2 ${chief ? 'senior' : ''}"><span class="pf">${ART.face(sc.id * 31 + 3, { role: 'scout', age: sc.age || 40, bg: '#fff' })}</span><span class="pm"><b>${esc(sc.name)}</b><small>${chief ? 'Chief scout. ' : ''}${sc.assign ? esc(sc.assign.label) : 'Between assignments'}</small><small class="pw">Knows ${esc(F.REGIONS[sc.home || 'dom'].name)} best. ${sc.reports || 0} reports${acc ? `, off by ${acc.err.toFixed(1)}★ on average` : ''}</small></span><span></span></div>`; }).join('');
  const ev = F.recEval ? F.recEval(g.season) : [];
  const evs = ev.map(e => `<div class="scr2"><span>${esc(e.name)} <small>${e.pos}${e.loan ? ', loan' : ''}, ${e.fee ? money(e.fee) : 'free'}. Scouted ${e.est != null ? e.est + '★' : '–'}, now ${e.now != null ? e.now + '★' : '–'}, ${e.apps != null ? e.apps : 0} apps</small></span><b class="vchip ${e.cls}">${esc(e.verdict)}</b></div>`).join('');
  return `<div class="kgrid"><div class="kt"><small>Transfer budget</small><b>${money(V.budget)}</b></div><div class="kt ${V.inWin ? 'good' : ''}"><small>Window</small><b>${V.inWin ? 'Open' : 'Closed'}</b><span>${V.inWin ? (g.phase === 'summer' ? 'Summer' : `Shuts after week ${g.week <= 2 ? 2 : 18}`) : g.week < 17 ? 'Opens week 17' : 'Opens in summer'}</span></div><div class="kt"><small>You approve</small><b>${thr}</b></div><div class="kt"><small>Wage limit</small><b>${V.wageLimit === Infinity ? 'None' : money(Math.round(V.wageLimit))}</b>${V.wageLimit === Infinity ? '' : '<span>per week</span>'}</div></div>
  <div class="sec">Plan <button class="linkbtn" data-a="recplan" style="margin:0 0 0 auto">Edit plan</button></div><div class="panel2">${pr}</div>
  <div class="sec">The list</div><div class="panel2">${funnel}${live.length ? groups.slice().reverse().map(sect).join('') : `<p class="small">${V.scouts.length ? 'Nobody on the list right now. The scouts file new reports every week.' : 'Nobody on the list, and no chief scout to find anyone.'}</p>`}</div>
  ${done.length ? `<div class="sec">Recent outcomes</div><div class="panel2">${done.map(recRow).join('')}</div>` : ''}
  ${evs ? `<div class="sec">This season's signings</div><div class="panel2">${evs}<p class="small" style="margin:6px 0 0">Hit: a regular with good ratings. Miss: rarely plays or rates poorly.</p></div>` : ''}
  ${R.log.length ? `<div class="sec">Signed by the department</div><div class="panel2">${R.log.slice(0, 8).map(l => `<div class="scr2"><span>${esc(l.name)} <small>${l.pos}, season ${l.s}, week ${l.w}</small></span><b>${l.fee ? money(l.fee) : 'Free'}</b></div>`).join('')}</div>` : ''}
  <div class="sec">Scouts</div>${scouts || '<p class="small">No chief scout. Nobody is watching players.</p>'}
  <p class="small">Grades: A clear upgrade, B good addition, C squad level, D not for us. More reports and better scouts make the ranges narrower.</p>`;
}
function vMoney2() {
  const g = G(), c = g.club, L = g.fin.last, cap0 = +F.man('fin', 'wageCap'), wr = F.wageRatio() * 100, run = F.finRunway ? F.finRunway() : null;
  const LBL = { gate: 'Matchday tickets', tv: 'TV and prize pool', sponsors: 'Sponsorship', merch: 'Merchandise', owner: 'Owner top-up', playerWages: 'Player wages', staffWages: 'Staff wages', scouting: 'Scouting', academy: 'Academy', marketing: 'Marketing', ground: 'Stadium and running costs', facilities: 'Facility investment', interest: 'Loan interest', firstTeam: 'First-team support', projects: 'Projects', deptStaff: 'Department staff', firstBudget: 'First-team budget', comBudget: 'Commercial budget' };
  const mx = L ? Math.max(...Object.values(L.i), ...Object.values(L.o), 1) : 1;
  const rows = (o, cls) => Object.entries(o).filter(([, v]) => v).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="frow"><span>${esc(LBL[k] || k)}</span><i class="${cls}"><b style="width:${v / mx * 100}%"></b></i><em>${money(v)}</em></div>`).join('');
  const lw = L ? L.tin - L.tout : 0;
  return `<div class="kgrid"><div class="kt ${c.cash < 0 ? 'bad' : ''}"><small>Cash</small><b>${money(c.cash)}</b>${lw < 0 && c.cash > 0 ? `<span class="bad">${Math.floor(c.cash / -lw)} weeks at last week's rate</span>` : run != null ? `<span class="bad">${run} weeks left on forecast</span>` : '<span>Not burning cash</span>'}</div><div class="kt ${lw < 0 ? 'bad' : 'good'}"><small>Last week</small><b>${lw >= 0 ? '+' : ''}${money(lw)}</b></div><div class="kt ${wr > cap0 ? 'bad' : 'good'}"><small>Wages vs revenue</small><b>${r0(wr)}%</b><span>cap ${cap0}%</span></div><div class="kt ${(c.debt || 0) > 0 ? '' : 'good'}"><small>Debt</small><b>${money(c.debt || 0)}</b></div></div>
  <div class="sec">Cash over time</div><div class="panel2">${spark(g.fin.hist)}</div>
  <div class="sec">Last week</div><div class="panel2">${L ? `<div class="sub2" style="margin-top:0">Income <span>${money(L.tin)}</span></div>${rows(L.i, 'in')}<div class="sub2">Costs <span>${money(L.tout)}</span></div>${rows(L.o, 'out')}` : '<p class="small">Play a week to see the breakdown.</p>'}</div>
  <div class="sec">This season</div><div class="panel2"><div class="scr2"><span>Revenue</span><b>${money(g.ss.rev)}</b></div><div class="scr2"><span>Costs</span><b>${money(g.ss.exp)}</b></div><div class="scr2"><span>Transfers in / out</span><b>${money(g.ss.spent)} / ${money(g.ss.earned)}</b></div><div class="scr2"><span>Transfer budget, set by Finance</span><b>${money(F.transferBudget())}</b></div></div>`;
}
const PITCH = { GK: [[50, 90]], FB: [[14, 70], [86, 70]], CB: [[36, 74], [64, 74]], DM: [[50, 56]], CM: [[30, 44]], AM: [[70, 44]], W: [[16, 22], [84, 22]], ST: [[50, 14]] };
function vPitch() {
  const g = G(), L = F.pickXI(false), used = {}, nm = n => esc(n.split(' ').slice(-1)[0]);
  const spots = L.xi.map(x => { const arr = PITCH[x.slot] || [[50, 50]], i = used[x.slot] = (used[x.slot] || 0) + 1, pt = arr[Math.min(i - 1, arr.length - 1)]; return `<button class="pspot" style="left:${pt[0]}%;top:${pt[1]}%" data-a="player" data-id="${x.p.id}" aria-label="${esc(x.p.name)}, ${F.POS_L[x.slot]}"><span class="pf">${ART.playerFace(x.p)}</span><b>${nm(x.p.name)}</b><small>${F.stars(x.p.ca)}★${x.p.inj > 0 ? ' · inj' : ''}</small></button>`; }).join('');
  const rest = g.squad.filter(p => !L.xi.some(x => x.p === p)).sort((a, b) => b.ca - a.ca);
  return `${squadSeg()}<div class="spread" style="margin:0 0 8px"><h2 style="font-size:22px;margin:0">First team</h2><button class="linkbtn" data-a="dept-go" data-k="recruit" data-v="data" style="margin:0">Recruitment</button></div>
  <div class="pitch"><div class="lines"></div>${spots}</div>
  <p class="small" style="margin:8px 0">The coach's likely eleven. Squad strength ranks ${F.ord(F.expectedRank())} in the division. Tap a player.</p>
  <div class="sec">Bench and squad (${rest.length})</div><div class="pcards">${rest.map(p => pcard(p, { meta: `${p.age}, ${F.POS_L[p.pos]}${p.inj > 0 ? ', injured' : ''}${p.loan ? ', on loan' : ''}` })).join('')}</div>`;
}
function vSquad() {
  if (!U.sqTable) return vPitch();
  const g = G(), sq = g.squad.slice().sort((a, b) => 'GK CB FB DM CM AM W ST'.indexOf(a.pos) - 'GK CB FB DM CM AM W ST'.indexOf(b.pos) || b.ca - a.ca);
  const avgW = F.playerWages() / Math.max(1, sq.length);
  const prof = `<table><thead><tr><th>Player</th><th>Age</th><th>Ability</th><th>Potential</th><th>Morale</th><th>Wage</th><th>Contract</th><th>Value</th></tr></thead><tbody>${sq.map(p => `<tr data-a="player" data-id="${p.id}"><td>${esc(p.name)}<span class="pos">${p.pos}</span>${p.inj > 0 ? ' <span class="bad small">inj ' + p.inj + 'w</span>' : ''}${p.susp > 0 ? ' <span class="warn small">susp</span>' : ''}${p.academy ? ' <span class="small">academy</span>' : ''}${p.loan ? ' <span class="small">loan</span>' : ''}</td><td>${p.age}</td><td>${stars(F.stars(p.ca))}</td><td>${stars(F.stars(p.pa))}</td><td>${r0(p.morale)}</td><td>${money(p.wage)}</td><td>${p.contract}y</td><td>${money(p.value)}</td></tr>`).join('')}</tbody></table>`;
  const mb = `<table><thead><tr><th>Player</th><th>Mins</th><th>G</th><th>A</th><th>xG</th><th>xA</th><th>xG/90</th><th>xA/90</th><th>PrgP/90</th><th>Duels</th><th>Rating</th><th>Wage value</th></tr></thead><tbody>${sq.map(p => { const s = p.st, rat = s.apps ? s.rat / s.apps : 0, wv = s.apps ? (F.stars(p.ca) / 2.5) / (p.wage / avgW) * 100 : 0; return `<tr data-a="player" data-id="${p.id}"><td>${esc(p.name)}<span class="pos">${p.pos}</span></td><td>${s.mins}</td><td>${s.g}</td><td>${s.a}</td><td>${s.xg.toFixed(1)}</td><td>${s.xa.toFixed(1)}</td><td>${p90(s.xg, s.mins)}</td><td>${p90(s.xa, s.mins)}</td><td>${p90(s.prg, s.mins)}</td><td>${s.dt ? r0(s.dw / s.dt * 100) + '%' : '–'}</td><td class="${rat >= 7 ? 'good' : rat && rat < 6.4 ? 'bad' : ''}">${rat ? rat.toFixed(2) : '–'}</td><td class="${wv >= 120 ? 'good' : wv && wv < 80 ? 'bad' : ''}">${wv ? r0(wv) : '–'}</td></tr>`; }).join('')}</tbody></table>`;
  return `${squadSeg()}<div class="spread" style="margin-bottom:10px"><div><h2 style="font-size:26px">First-team squad</h2><div class="small">${sq.length} players. Squad strength ranks ${F.ord(F.expectedRank())} in the division. Wage bill ${money(F.playerWages())}/wk.</div></div><div class="seg"><button class="${U.sq === 'profile' ? 'on' : ''}" data-a="sq" data-v="profile">Profile</button><button class="${U.sq === 'mb' ? 'on' : ''}" data-a="sq" data-v="mb">Moneyball</button></div></div>
  <div class="scroll">${U.sq === 'mb' ? mb : prof}</div>
  <p class="small">${U.sq === 'mb' ? 'Wage value: ability per pound of wages, 100 is squad average. PrgP: progressive passes. Duels: share won.' : 'Stars are relative to your current division. Tap a player for the full profile. You cannot buy, sell or pick players: that is the job of your Director of Football and Head Coach.'}</p>`;
}
function vLeague() {
  const g = G(), t = U.lt || g.club.tier, tab = F.sortTable(t), dv = g.divs[t];
  return `<div class="tiers">${[1, 2, 3, 4, 5, 6, 7, 8].map(i => `<button class="${t === i ? 'on' : ''}" data-a="lt" data-t="${i}">${i}. ${F.TIERS[i]}</button>`).join('')}</div>
  <h2 style="font-size:28px;margin:6px 0">${F.TIERS[t]}</h2><p class="small">Top three ${t > 1 ? 'promoted' : 'are champions and runners-up'}, bottom three ${t < 8 ? 'relegated' : 'stay put: this is the bottom of the pyramid'}.</p>
  <div class="scroll"><table><thead><tr><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>${tab.map((id, i) => { const r = dv.tab[id]; return `<tr class="${id === 0 ? 'me' : ''} ${i < 3 && t > 1 ? 'zone-up' : ''} ${i >= 15 && t < 8 ? 'zone-down' : ''}"><td>${i + 1}. ${esc(F.cname(id))}</td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${sign(r.gf - r.ga)}</td><td><b>${r.pts}</b></td></tr>`; }).join('')}</tbody></table></div>
  ${t === g.club.tier ? `<h3 style="margin-top:18px">Form</h3><p class="num" style="font-size:20px;letter-spacing:4px">${g.form.slice(-10).map(r => `<span class="${r === 'W' ? 'good' : r === 'L' ? 'bad' : ''}">${r}</span>`).join('') || '–'}</p>` : ''}
  <h3 style="margin-top:14px">National Cup</h3>${g.cup.log.length ? `<ul class="list">${g.cup.log.map(l => `<li><span>${cap(l.rd)}: ${esc(l.opp)}</span><b class="${l.win ? 'good' : 'bad'}">${esc(l.s)}</b></li>`).join('')}</ul>` : '<p class="small">First round in week 5.</p>'}${!g.cup.alive && g.cup.won !== g.season && g.cup.log.length ? '<p class="small">Eliminated.</p>' : ''}`;
}
function spark(h) {
  if (h.length < 2) return '';
  const W = 600, H = 110, mn = Math.min(0, ...h), mx = Math.max(...h, 1), x = i => i / (h.length - 1) * W, y = v => H - 8 - (v - mn) / (mx - mn || 1) * (H - 16);
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:110px;display:block" aria-label="Cash over time"><line x1="0" x2="${W}" y1="${y(0)}" y2="${y(0)}" stroke="currentColor" stroke-opacity=".3" stroke-dasharray="4 4"/><polyline fill="none" stroke="var(--acc)" stroke-width="2.5" vector-effect="non-scaling-stroke" points="${h.map((v, i) => x(i) + ',' + y(v)).join(' ')}"/></svg>`;
}
function vMoney() {
  const g = G(), c = g.club, L = g.fin.last, cap0 = +F.man('fin', 'wageCap'), wr = F.wageRatio() * 100;
  const LBL = { gate: 'Matchday tickets', tv: 'TV and prize pool', sponsors: 'Sponsorship', merch: 'Merchandise', owner: 'Owner top-up', playerWages: 'Player wages', staffWages: 'Staff wages', scouting: 'Scouting', academy: 'Academy', marketing: 'Marketing', ground: 'Stadium and running costs', facilities: 'Facility investment', interest: 'Loan interest', firstTeam: 'First-team support', projects: 'Projects', deptStaff: 'Department staff', firstBudget: 'First-team budget', comBudget: 'Commercial budget' };
  const rows = (o, mx, cls) => Object.entries(o).filter(([, v]) => v).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="meter" style="grid-template-columns:150px minmax(0,1fr) 70px"><span>${LBL[k] || k}</span><div class="bar ${cls}"><i style="width:${v / mx * 100}%"></i></div><span class="num" style="text-align:right">${money(v)}</span></div>`).join('');
  const mx = L ? Math.max(...Object.values(L.i), ...Object.values(L.o), 1) : 1;
  return `<div class="grid2"><section class="panel"><h2>Cash ${money(c.cash)}</h2>${spark(g.fin.hist)}
    <dl class="kv"><dt>Transfer budget (set by Finance)</dt><dd>${money(F.transferBudget())}</dd><dt>Player wage-to-revenue</dt><dd class="${wr > cap0 ? 'bad' : ''}">${r0(wr)}% (cap ${cap0}%)</dd><dt>Debt</dt><dd>${money(c.debt)}</dd><dt>Season revenue</dt><dd>${money(g.ss.rev)}</dd><dt>Season costs</dt><dd>${money(g.ss.exp)}</dd><dt>Transfers in / out</dt><dd>${money(g.ss.spent)} / ${money(g.ss.earned)}</dd></dl></section>
  <section class="panel"><h2>Last week ${L ? `<span class="${L.tin - L.tout < 0 ? 'bad' : 'good'}">${L.tin - L.tout < 0 ? '' : '+'}${money(L.tin - L.tout)}</span>` : ''}</h2>${L ? `<h3>Income ${money(L.tin)}</h3>${rows(L.i, mx, '')}<h3>Costs ${money(L.tout)}</h3>${rows(L.o, mx, 'ink')}` : '<p class="small">Play a week to see the breakdown.</p>'}</section></div>`;
}

/* ---------- sheets ---------- */
function vSheet() {
  const s = U.sheet; if (!s) return ''; const g = G(); let h = '';
  if (s.t === 'player') {
    const p = g.squad.find(x => x.id === s.id) || g.academy.find(x => x.id === s.id) || (g.loanedOut || []).find(x => x.id === s.id); if (!p) return '';
    h = `<div class="sheethead"><span class="chip">${g.academy.includes(p) ? 'Academy' : 'First team'}</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>${profileHtml(p, null, null)}`;
  }
  if (s.t === 'dcand') {
    const R = F.DEPT_ROLES[s.k][s.r], C = F.deptCands(s.k, s.r), d = F.DEPT[s.k];
    h = `<div class="sheethead"><span class="chip">${esc(R[0])}</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div><p class="small" style="margin:0 0 10px">${esc(R[1])}. Two candidates. A signing-on fee of four weeks' wages.</p>
    <div class="cands">${C.map((c, i) => `<button class="cand" data-a="dhire" data-k="${s.k}" data-r="${s.r}" data-i="${i}"><span class="cf">${ART.face(c.id * 17 + 5, { role: d.face, age: c.age, bg: '#fff' })}</span><span class="cm"><b>${esc(c.name)}</b><small>${c.age}</small><span class="traits"><span>${esc(c.trait)}</span></span></span><span class="cr"><small>${money(c.wage)}/wk</small><small>Fee ${money(c.wage * 4)}</small></span></button>`).join('')}</div>`;
  }
  if (s.t === 'actions') {
    h = `<div class="sheethead"><span class="chip">Actions</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
    <div class="kbig">${g.ap}<small class="small"> of 3 left this week</small></div><div style="margin:6px 0 12px">${apPips(g.ap)}</div>
    <p>Each decision you take yourself costs one action: answering a decision, a talk with staff or sacking someone. Updates are free. You get three new actions every week.</p>
    <p class="small">Leave a decision and your staff take their pick. That is fine, but only decisions you take yourself build your grip.</p>`;
  }
  if (s.t === 'help') {
    h = `<div class="sheethead"><span class="chip">How it works</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
    <p style="margin-top:0">You are the CEO. You hire the people, set their mandates and make the calls they bring you. You never pick the team or buy players yourself.</p>
    <div class="panel2">${Object.entries(TOUR).map(([k, t]) => `<div class="helpr"><span class="hic">${ART.I[k]}</span><span><b>${esc(t[0])}</b><small>${esc(t[1])}</small></span></div>`).join('')}</div>
    <div class="sec">Reading the screen</div><div class="panel2">
      <div class="helpr"><span class="hic">${apPips(3)}</span><span><b>Actions</b><small>Three per week. A decision you take yourself costs one.</small></span></div>
      <div class="helpr"><span class="hic"><span class="gripchip hi" style="margin:0;min-width:0"><b>Grip</b></span></span><span><b>Grip</b><small>How firmly you steer the club. It lifts or drags every head of department.</small></span></div>
      <div class="helpr"><span class="hic"><i class="lg good"></i></span><span><b>Green</b><small>On track or good.</small></span></div>
      <div class="helpr"><span class="hic"><i class="lg mid"></i></span><span><b>Grey</b><small>Steady, nothing to do.</small></span></div>
      <div class="helpr"><span class="hic"><i class="lg bad"></i></span><span><b>Red</b><small>Needs attention.</small></span></div>
      <div class="helpr"><span class="hic"><em class="nbadge">2</em></span><span><b>Badges</b><small>Something waits for you on that tab.</small></span></div></div>
    <button class="btn ghost wide" data-a="tour-reset" style="margin-top:12px">Show the tab tips again</button>`;
  }
  if (s.t === 'grip') {
    const gr = Math.round(g.grip == null ? 60 : g.grip), bon = (gr - 50) / 14, L = (g.gripLog || []).slice(-12);
    h = `<div class="sheethead"><span class="chip">Your grip on the club</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
    <div class="kbig">${gr}<small class="small"> of 100</small></div><div class="budbar"><b class="${gr < 30 ? 'over' : ''}" style="width:${gr}%"></b></div>
    <p>A club drifts when nobody steers it. Every decision you take yourself, a talk, a press answer or a call in the summer, builds grip. Each week without them, it slips.</p>
    <div class="panel2"><div class="scr2"><span>Effect on every head of department</span><b class="${bon >= 0 ? 'good' : 'bad'}">${bon >= 0 ? '+' : '−'}${Math.abs(bon).toFixed(1)} on their skills</b></div><div class="scr2"><span>Most you can gain in a week</span><b>16</b></div><div class="scr2"><span>Lost every week</span><b>5</b></div>${gr < 25 ? '<div class="scr2"><span>Board and staff</span><b class="bad">Losing faith every week</b></div>' : ''}</div>
    ${L.length > 1 ? `<div class="sec">Last weeks</div><div class="panel2">${spark(L)}</div>` : ''}`;
  }
  if (s.t === 'sack') {
    const q = F.ftSackQuote(), c = F.staff('coach'); if (!q || !c) { U.sheet = null; return ''; }
    const fx = (l, v) => `<span class="eff ${v > 0 ? 'up' : v < 0 ? 'dn' : ''}">${l} ${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v)}</span>`;
    h = `<div class="sheethead"><span class="chip">Sack the coach</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>
    <div class="stage"><div class="portrait">${ART.staffFace('coach', 'worried')}</div><div class="who"><b>${esc(c.name)}</b><span>${q.under ? 'Results are below what the squad should do.' : 'Results are on or above par.'}</span></div></div>
    <div class="panel2" style="margin:12px 0"><div class="scr2"><span>Compensation</span><b class="bad">${money(q.cost)}</b></div><div class="scr2"><span>Reaction</span><b>${fx('Fans', q.fans)}${fx('Press', q.press)}${fx('Board', q.board)}</b></div><div class="scr2"><span>Dressing room</span><b>${fx('Morale', q.squad)}</b></div></div>
    <p class="small">You will need to appoint a new head coach. Until then the team runs without one.</p>
    <div class="sheetfoot"><button class="btn ghost" data-a="close">Keep him</button><button class="btn danger" data-a="ft-sack" ${G().ap < 1 ? 'disabled' : ''}>Sack ${esc(c.name.split(' ').slice(-1)[0])}</button></div>`;
  }
  if (s.t === 'target') {
    const { p, k, x } = F.recPlayer(s.id); if (!p) { const sp = g.squad.find(q => q.id === s.id); if (sp) { U.sheet = { t: 'player', id: sp.id }; return vSheet(); } return `<div class="sheethead"><span class="chip">Gone</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div><p>He is no longer available.</p>`; }
    const live = x && ['negotiating', 'agreed', 'signed', 'lost', 'approach'].includes(x.stage), d = x && x.deal;
    h = `<div class="sheethead"><span class="chip">${x ? esc(STG_L[x.stage]) : 'Target'}</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>${profileHtml(p, k, x)}
    ${d && d.rounds.length ? `<details class="more"><summary>Talks so far (${d.rounds.length}) ${ART.I.chev}</summary>${d.rounds.map(r => `<p>${esc(r)}</p>`).join('')}</details>` : ''}
    ${x && x.blocked ? `<p class="small bad">Blocked by ${esc(x.blocked.join(', '))}.</p>` : x && x.hold ? '<p class="small">On hold: that position is covered.</p>' : ''}
    ${U.recMsg ? `<p class="note">${esc(U.recMsg)}</p>` : ''}
    ${!live ? `<p class="small note">${esc(F.staffName ? F.staffName('dof') : 'The DoF')} decides whether to pursue him, within your mandate. Change priorities or limits in the recruitment mandate.</p>` : ''}`;
  }
  if (s.t === 'reclist') { h = `<div class="spread"><div class="kick">The list</div><button class="x" data-a="close" aria-label="Close">×</button></div>${vRecruit().replace(squadSeg(), '')}`; }
  if (s.t === 'recplan') { h = `<div class="spread"><div><div class="kick">Recruitment plan</div><h2>What should we look for?</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>${recPlanBlock()}<div class="row" style="margin-top:12px"><button class="btn" data-a="close">Done</button></div>`; }
  if (s.t === 'mand') {
    const r = s.r, st = F.staff(r), m = U.draft; const al = previewAlign(r, m);
    h = `<div class="sheethead"><span class="chip">Mandate · club fit ${al}%</span><button class="iconbtn" data-a="close" aria-label="Close">${ART.I.close}</button></div>${staffHead(r)}${leanNote(r, m)}<div id="mand">${sliderRows(r, m, 'md')}</div>
    <div class="sheetfoot"><button class="btn ghost" data-a="close">Cancel</button><button class="btn" data-a="mand-save" ${g.ap < 1 ? 'disabled' : ''}>Save mandate<small>Costs 1 action</small></button></div>`;
  }
  if (s.t === 'talk') {
    const roles = F.ROLES.filter(r => g.staff[r.id]);
    const sel = U.talkRole;
    h = `<div class="spread"><div><div class="kick">One-to-one, costs one action</div><h2>Who do you want to see?</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <div class="choice">${roles.map(r => { const s2 = g.staff[r.id]; return `<button class="card ${sel === r.id ? 'on' : ''}" data-a="talk-who" data-r="${r.id}"><b>${esc(s2.name)}</b>${r.t}. Relationship ${r0(s2.rel)}. The numbers: ${F.record(r.id).verdict.toLowerCase()}.<div class="e">${s2.p.ego > 14 ? 'Big ego. ' : ''}${s2.p.amb > 14 ? 'Very ambitious. ' : ''}${s2.p.loy < 7 ? 'Not very loyal.' : ''}</div></button>`; }).join('')}</div>
    ${sel ? `<h3>How do you approach it?</h3><div class="choice">${[['review', 'Go through the numbers', 'Evidence, not opinion. Good numbers earn real credit; bad ones are hard to argue with.'], ['praise', 'Praise his work', 'Builds trust. Some take it as licence to coast.'], ['challenge', 'Challenge him to do more', 'Ambitious people respond. Proud people bristle.'], ['reassure', 'Reassure him', 'Steadies someone who is struggling.'], ['warn', 'Warn him', 'Sharpens minds when results are poor. Unfair otherwise.']].map(([k, l, d]) => `<button class="card" data-a="talk-do" data-t="${k}"><b>${l}</b>${d}</button>`).join('')}</div>` : ''}
    ${U.talkOut ? `<div class="quote" style="font-size:22px">${esc(U.talkOut)}</div>` : ''}`;
  }
  if (s.t === 'push') {
    h = `<div class="spread"><div><div class="kick">Costs one action, lasts three weeks</div><h2>Back a department</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <p class="small">Your visible backing lifts that department and its head. Rival departments notice.</p>
    <div class="choice">${Object.entries({ sporting: 'Squad morale up, a small edge on the pitch.', scouting: 'Network grows faster in the focus regions.', academy: 'Prospects develop faster; a better intake if it falls in the window.', commercial: 'Sponsor mood up; more commercial opportunities arrive.', marketing: 'Fan base and brand grow faster.', business: 'Running costs down five percent.', medical: 'Fewer injuries, faster recovery.' }).map(([k, d]) => `<button class="card" data-a="push" data-d="${k}"><b>${F.PUSH[k][0]}</b>${d}${g.push[k] > 0 ? `<div class="e">Already backed: ${g.push[k]} week${g.push[k] > 1 ? 's' : ''} left.</div>` : ''}</button>`).join('')}</div>`;
  }
  if (s.t === 'cands') {
    const r = s.r; if (!g.cands[r]) g.cands[r] = F.genCands(r);
    h = `<div class="spread"><div><div class="kick">Appointment</div><h2>${F.ROLE[r].t}</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div><div class="choice">${g.cands[r].map((c, i) => staffCard(c, r, { actions: `<button class="btn small" data-a="hire" data-r="${r}" data-i="${i}">Appoint ${esc(c.name.split(' ')[0])}</button>` })).join('')}</div>`;
  }
  if (s.t === 'fire') {
    const st = F.staff(s.r), cost = Math.round(st.wage * Math.max(8, st.contract * 20));
    h = `<div class="spread"><h2>Dismiss ${esc(st.name)}?</h2><button class="x" data-a="close" aria-label="Close">×</button></div>${numbers(s.r)}<p>Compensation: <b class="num">${money(cost)}</b>. The rest of the staff will be unsettled, and the role stays vacant until you appoint someone. Costs one action.</p><div class="row"><button class="btn" data-a="fire" data-r="${s.r}" ${g.ap < 1 ? 'disabled' : ''}>Dismiss</button><button class="btn ghost" data-a="close">Keep him</button></div>`;
  }
  if (s.t === 'quick') {
    h = `<div class="spread"><div><div class="kick">Skip the founding</div><h2>Base club</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <p>Harwick Athletic: a phoenix club at the old town ground, possession football, own academy, self-sustaining, community club, steady ambition. Staff are hired within budget and mandates follow the club DNA.</p>
    ${hasSave() ? '<p class="small bad">This replaces the club saved in this browser.</p>' : ''}
    <div class="row" style="flex-direction:column;gap:8px;margin-top:12px"><button class="btn" data-a="quick" data-v="summer">Start in the summer</button><button class="btn ghost" data-a="quick" data-v="season">Straight to week 1</button></div>
    <p class="small" style="margin-top:8px">Week 1 skips the summer window, pre-season and the first press day: your staff handle them.</p>`;
  }
  if (s.t === 'backers') {
    const B = F.backers(), D = { board: 'Owns your contract. Results against the target, money and promises.', fans: 'Results, ticket prices, community and respect for the club\'s identity.', press: 'Stories, access and how you handle scandals.', room: 'Morale of the first-team squad: playing time, bonuses, the coach.' };
    h = `<div class="spread"><div><div class="kick">Four groups hold your fate</div><h2>Your backers</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <p class="small">Let one fall below ${F.VOTE_AT} and you face a vote of confidence. Survive it and you get one more chance this season, not two.</p>
    ${B.map(b => `<div class="bkrow ${b.danger ? 'lo' : ''}"><div class="spread"><b>${ART.I[b.ic] || ''} ${esc(b.t)}</b><span class="num">${b.v}${b.d ? ` <small class="${b.d > 0 ? 'good' : 'bad'}">${b.d > 0 ? '+' : ''}${b.d} this week</small>` : ''}</span></div><em><u style="width:${b.v}%"></u></em><p><i>${esc(b.voice)}</i> ${esc(D[b.k])}</p></div>`).join('')}`;
  }
  if (s.t === 'analysis') {
    const A = F.analysis(), mx = Math.max(0.5, ...A.bars.map(b => Math.abs(b.v)));
    const lev = l => { if (l.a === 'mand') return `<button class="btn ghost small" data-a="sheet" data-s="mand" data-r="${l.x}">Open ${esc(F.ROLE[l.x].t)} mandate</button>`; if (l.a === 'push') return `<button class="btn ghost small" data-a="push" data-d="${l.x}" ${g.ap < 1 ? 'disabled' : ''}>Back ${esc(F.PUSH[l.x][0].toLowerCase())} (1 action)</button>`; if (l.a === 'talk') return `<button class="btn ghost small" data-a="sheet" data-s="talk" data-r="${l.x}" ${g.ap < 1 ? 'disabled' : ''}>One-to-one</button>`; if (l.a === 'tab') return `<button class="btn ghost small" data-a="tab-close" data-t="${l.x}">Go to ${esc(l.x)}</button>`; return ''; };
    h = `<div class="spread"><div><div class="kick">Performance analysis</div><h2>Why we are ${F.ord(A.pos)}</h2></div><button class="x" data-a="close" aria-label="Close">×</button></div>
    <dl class="figs"><div><dt>Position</dt><dd>${F.ord(A.pos)}</dd></div><div><dt>Board target</dt><dd>${F.ord(A.target)}</dd></div><div><dt>Gap</dt><dd class="${A.gap > 0 ? 'bad' : 'good'}">${A.gap > 0 ? A.gap + ' pts' : 'none'}</dd></div><div><dt>Forecast</dt><dd>${A.fc ? F.ord(A.fc) : '–'}</dd></div><div><dt>Points vs deserved</dt><dd>${A.pts} / ${A.xpts.toFixed(1)}</dd></div></dl>
    <h3 style="margin-top:14px">What drives our results</h3><p class="small">Compared with an average side in this division. Right of the line helps, left hurts.</p>
    ${A.bars.map(b => `<div class="drv"><span>${esc(b.l)}</span><div class="axis"><i class="${b.v >= 0 ? 'pos' : 'neg'}" style="width:${Math.abs(b.v) / mx * 50}%"></i></div><span class="small">${esc(b.note)}</span></div>`).join('')}
    <h3 style="margin-top:14px">Diagnosis</h3>${A.causes.length ? A.causes.map(c => `<p class="cause ${c.sev < 0 ? 'luck' : ''}">${esc(c.t)}</p>`).join('') : '<p>No structural problems. The squad and staff are performing to their level.</p>'}
    <h3 style="margin-top:14px">What you can do</h3>${A.levers.length ? A.levers.map(l => `<div class="lever"><p>${esc(l.t)}</p>${lev(l)}</div>`).join('') : '<p class="small">Keep going. Revisit if results turn.</p>'}`;
  }
  if (s.t === 'confirm') { const n = inboxItems().filter(i => i.kind === 'need').length; h = `<h2>Play week ${g.week}?</h2><p>${n} decision${n === 1 ? '' : 's'} will be taken by your staff, following their mandates.</p><div class="row"><button class="btn" data-a="end">Play anyway</button><button class="btn ghost" data-a="review">Review first</button></div>`; }
  if (s.t === 'ticker') return vTicker();
  return `<div class="veil" data-a="veil"><div class="sheet" role="dialog" aria-modal="true">${h}</div></div>`;
}
function previewAlign(r, m) { const g = G(), old = g.mand[r]; g.mand[r] = m; const a = F.alignment(); g.mand[r] = old; return a; }

/* ---------- ticker ---------- */
function vTicker() {
  const T = U.ticker, m = T.match, g = G(), shown = m.ev.slice(0, T.i);
  const last = shown.filter(e => e.sc).pop(), sc = last ? last.sc : [0, 0], min = shown.length ? shown[shown.length - 1].m : 0, done = T.i >= m.ev.length;
  const oS = (() => { const n = (m.oppName || 'OPP').toUpperCase().replace(/[^A-Z ]/g, ''); let t = n.replace(/ /g, '').slice(0, 3); if (t === g.club.short) { const w = n.split(' '); t = w.length > 1 ? (w[0].slice(0, 2) + w[1][0]) : (n[0] + n.slice(1).replace(/[AEIOU]/g, '').slice(0, 2)); } if (t === g.club.short) t = n[0] + n.slice(-2); return t; })();
  const home = m.home, hn = home ? g.club.short : oS, an = home ? oS : g.club.short, hg = home ? sc[0] : sc[1], ag = home ? sc[1] : sc[0];
  const xgOf = e => { const x = (e.t.match(/xG ([\d.]+)/) || [])[1]; return x ? +x : e.k === 'goal' ? 0.35 : 0.15; };
  let ux = 0, tx = 0; const shots = shown.map((e, k) => { if (e.k !== 'goal' && e.k !== 'ch') return ''; const xg = xgOf(e); if (e.us) ux += xg; else tx += xg; const h = (k * 2654435761 >>> 0) % 1000 / 1000, us = !!e.us, x = us ? 72 + h * 22 : 6 + h * 22, y = 18 + ((k * 40503 >>> 0) % 1000) / 1000 * 64; return `<i class="shot ${e.k} ${us ? 'us' : 'them'} ${k === shown.length - 1 ? 'new' : ''}" style="left:${x}%;top:${y}%;--s:${10 + xg * 30}px"></i>`; }).join('');
  const lastE = shown[shown.length - 1], goalNow = lastE && lastE.k === 'goal' && !done && T.flashI !== T.i ? lastE : null;
  if (goalNow) { T.flashI = T.i; if (goalNow.us) { ART.SND.cheer(); ART.vib([80, 40, 80]); } else ART.SND.bad(); }
  const IC = { goal: '<i class="evi goal">●</i>', ch: '<i class="evi ch">○</i>', card: '<i class="evi ecard"></i>', sub: '<i class="evi sub">⇄</i>', inj: '<i class="evi inj">+</i>', info: '<i class="evi info">·</i>', ft: '<i class="evi info">■</i>' };
  return `<div class="veil"><div class="sheet live" role="dialog" aria-modal="true" aria-label="Live match">
  <div class="bug"><span class="team ${home ? 'mine' : ''}">${esc(hn)}</span><span class="sc">${hg}<i>–</i>${ag}</span><span class="team ${!home ? 'mine' : ''}">${esc(an)}</span><span class="min">${done ? 'FT' : min + "'"}</span></div>
  <div class="bugsub">${m.comp === 'Cup' ? 'National Cup' + (m.rd ? ', ' + esc(m.rd) : '') : F.TIERS[g.club.tier]}${m.att ? ', crowd ' + m.att.toLocaleString('en-GB') : ''}${done && m.pens ? ', ' + esc(m.pens) : ''}</div>
  <div class="mbar"><b style="width:${Math.min(100, min / 90 * 100)}%"></b></div>
  <div class="mpitch"><div class="ml"></div>${shots}${goalNow ? `<div class="goalflash ${goalNow.us ? 'us' : 'them'}">GOAL${goalNow.us ? '!' : ''}</div>` : ''}<span class="dir l">${esc(home ? an : hn)} attack</span><span class="dir r">${esc(g.club.short)} attack</span></div>
  ${(() => { const rec = shown.filter(e => (e.k === 'goal' || e.k === 'ch') && e.m > min - 15); let a = 0, b = 0; for (const e of rec) { const x = xgOf(e) + (e.k === 'goal' ? 0.3 : 0); if (e.us) a += x; else b += x; } const tot = a + b, sh = tot ? a / tot : 0.5, lft = home ? sh : 1 - sh; return `<div class="mom" aria-label="Momentum"><span>${esc(hn)}</span><i><b style="width:${Math.round(lft * 100)}%"></b></i><span>${esc(an)}</span></div><div class="small" style="text-align:center;margin:-2px 0 6px;color:#9fb0c6">Momentum, last 15 minutes</div>`; })()}
  <div class="xgbar"><span>${home ? ux.toFixed(1) : tx.toFixed(1)}</span><i><b style="width:${(home ? ux : tx) / Math.max(0.1, ux + tx) * 100}%"></b></i><span>${home ? tx.toFixed(1) : ux.toFixed(1)}</span></div><div class="small" style="text-align:center;margin-top:-2px">Expected goals</div>
  <ul class="feed2" aria-live="polite">${shown.slice().reverse().map(e => { const p = e.pid && e.us && (e.k === 'goal' || e.k === 'ch') ? g.squad.find(x => x.id === e.pid) : null; const ht = e.k === 'info' && /^Half-time/.test(e.t); return ht ? `<li class="htc"><b>Half-time</b><span>${esc(e.t.replace('Half-time: ', ''))}</span></li>` : `<li class="k-${e.k} ${e.us ? 'us' : ''} ${e.red ? 'red' : ''}"><span class="m">${e.m}'</span>${p && e.k === 'goal' ? `<span class="fpf">${ART.playerFace(p, 'happy')}</span>` : IC[e.k] || IC.info}<span>${esc(e.t.replace(/\s*\(xG [\d.]+\)/, ''))}</span></li>`; }).join('')}</ul>
  <div class="row2 live-btns">${done ? `<button class="btn" data-a="tick-close">${T.next ? 'To the cup tie' : 'Back to the office'}</button>` : `<button class="btn ghost" data-a="tick-speed">${T.fast ? 'Normal speed' : 'Faster'}</button><button class="btn ghost" data-a="tick-skip">Skip to full time</button>`}</div></div></div>`;
}
function startTicker(match, next) {
  U.ticker = { match, i: 0, fast: false, next }; U.sheet = { t: 'ticker' }; render(); tick();
}
function tick() { clearTimeout(tick.h); const T = U.ticker; if (!T || T.i >= T.match.ev.length) return; T.i++; const live = document.querySelector('.veil .sheet.live'); if (live && U.sheet && U.sheet.t === 'ticker') live.closest('.veil').outerHTML = vTicker(); else render(); const nx = T.match.ev[T.i]; tick.h = setTimeout(tick, T.fast ? 260 : nx && (nx.k === 'goal' || (nx.k === 'ch' && /Huge|big save/.test(nx.t))) ? 1700 : 1100); }

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
/* ---------- departments ---------- */
function spark(arr, inv, W = 320, H = 70) {
  if (!arr || arr.length < 2) return '<p class="small">Not enough weeks yet.</p>';
  const mn = Math.min(...arr), mx = Math.max(...arr), sp = mx - mn || 1, x = i => 6 + i / (arr.length - 1) * (W - 12), y = v => inv ? 6 + (v - mn) / sp * (H - 12) : H - 6 - (v - mn) / sp * (H - 12);
  return `<svg class="ftrend" viewBox="0 0 ${W} ${H}" role="img" aria-label="Trend"><polyline points="${arr.map((v, i) => x(i) + ',' + y(v)).join(' ')}"/><circle cx="${x(arr.length - 1)}" cy="${y(arr[arr.length - 1])}" r="4"/></svg>`;
}
const kfmt = (k, v) => k === 'commercial' || k === 'business' ? money(v) : k === 'first' ? F.ord(v) : String(v);
function vDepts() {
  const g = G(), O = F.deptOverview(), B = F.deptBudView();
  const tiles = O.map(o => `<button class="dtile2" data-a="dept" data-k="${o.k}"><span class="dface ${o.s ? '' : 'empty'}">${o.s ? ART.staffFace(o.head) : ART.I.staff}</span><span class="dt"><small>${esc(o.t)}</small><b>${o.s ? esc(o.s.name) : 'Vacant'}</b><span class="sdots">${Array.from({ length: o.slots }, (_, i) => `<i class="${i < o.staffOn ? 'on' : i < o.used ? 'half' : ''}"></i>`).join('')}<em>${o.used} of ${o.slots} staff</em></span></span><span class="dstat ${o.s ? o.status.st : 'bad'}">${o.s ? o.status.l : 'Hire'}</span>${ART.I.chev}</button>`).join('');
  const bud = `<div class="budcard">${planCard()}</div>`;
  const bad = O.filter(o => !o.s || o.status.st === 'bad').length;
  return `${tourCard('staff')}<div class="dhead"><b>${O.length} departments</b><span class="${bad ? 'bad' : 'good'}">${bad ? bad + ' need attention' : 'All running'}</span></div><div class="dtiles">${tiles}</div><div class="sec">Money per department</div>${bud}`;
}
function headLine(role, s) {
  const rc = F.record(role), P = s.p, v = rc.verdict;
  if (rc.early) return P.ego > 14 ? 'Give it time. You will see what I can do.' : 'Early days. We are setting things up the right way.';
  if (v === 'Strong') return P.ego > 14 ? 'The numbers speak for themselves.' : 'Things are going well. Credit to the team.';
  if (v === 'Poor') return P.risk < 7 ? 'Not good enough, I know. I am fixing it step by step.' : 'A rough patch. I have a plan.';
  return P.amb > 14 ? 'Decent, but I want more.' : 'Steady progress. No complaints.';
}
function headCard(k, v) {
  const d = v.d, s = v.head, role = d.head;
  if (!s) return `<section class="fthero vacant"><div class="fth1"><div class="ftface empty">${ART.I.staff}</div><div class="fthm"><b>No ${esc(F.ROLE[role].t.toLowerCase())}</b><span class="small">The department runs on chance until you appoint someone.</span></div></div><button class="btn wide" data-a="sheet" data-s="cands" data-r="${role}">Hire a ${esc(F.ROLE[role].t.toLowerCase())}</button></section>`;
  if (role === 'coach') { const P = vFirst(true); if (typeof P === 'object') return P.hero + headBtns(role, s); }
  const line = headLine(role, s), tic = ticOf(role, line), rc = F.record(role);
  return `<section class="fthero"><div class="fth1"><div class="ftface">${ART.staffFace(role)}</div><div class="fthm"><b>${esc(s.name)}</b><span class="small">${esc(F.ROLE[role].t)}, ${s.age}. ${s.contract} season${s.contract === 1 ? '' : 's'} left</span>${starsTxt(F.stars(F.ovr(s)))}</div></div>
    ${mrow('trust', 'Relationship', s.rel, 100, r0(s.rel), s.rel < 35 ? 'lo' : '')}${mrow('star', 'Form', s.perf, 100, rc.verdict, s.perf < 35 ? 'lo' : '')}
    <div class="bubble">${esc(line)}${tic ? `<span class="tic">${esc(tic)}</span>` : ''}</div></section>${headBtns(role, s)}`;
}
function authHtml(role) {
  if (!F.authView || !F.DESK_HEADS.includes(role)) return ''; const A = F.authView(role), s = A.head; if (!s) return '';
  return `<div class="authb"><div class="authh"><span>${ART.I.trust}</span><b>Authority</b><small>${A.rec.n ? `${A.rec.n} staff calls, ${A.rec.err} against your mandate` : 'No calls yet'}</small></div>
    <div class="seg wide" role="radiogroup" aria-label="Authority for ${esc(s.name)}">${A.opts.map((t, i) => `<button role="radio" aria-checked="${A.a === i}" class="${A.a === i ? 'on' : ''}" data-a="auth" data-r="${role}" data-v="${i}">${esc(t)}</button>`).join('')}</div>
    <p class="small">${esc(A.s)} Signs off alone up to ${money(A.lim)} a week. Wrong calls: ${A.err >= 18 ? 'frequent' : A.err >= 8 ? 'occasional' : 'rare'}.</p></div>`;
}
function headBtns(role, s) {
  const g = G(), sur = s.name.split(' ').slice(-1)[0];
  const PV = F.pwView ? F.pwView() : null, agChip = PV && PV.ag && PV.stage !== 'closed' && ['coach', 'dof', 'acad'].includes(role) ? `<button class="agchip" data-a="pw-open"><span>${ART.I.info}</span><b>Agreement: the ${esc(PV.tname)} question</b><small>${role === PV.ag.owner || (role === 'coach' && PV.ag.owner === PV.ag.owner && PV.ag.ownerName === s.name) ? 'Responsible' : 'Involved'} · evaluation week ${PV.ag.evalWeek}</small></button>` : '';
  return agChip + authHtml(role) + `<div class="hbtns"><button class="btn small" ${role === 'coach' ? 'data-a="ft-talk"' : `data-a="sheet" data-s="talk" data-r="${role}"`} ${g.ap < 1 ? 'disabled' : ''}>${ART.I.phone} Talk</button><button class="btn ghost small" data-a="sheet" data-s="mand" data-r="${role}">Mandate</button><button class="btn ghost small danger" ${role === 'coach' ? 'data-a="ft-sackq"' : `data-a="sheet" data-s="fire" data-r="${role}"`} ${g.ap < 1 ? 'disabled' : ''}>Sack</button></div>`;
}
function instinctRow(role) {
  const s = F.staff(role); if (!s) return ''; const L = F.LEAN[role], k = L[0], m = F.man(role, k), MD = F.MAND[role].sl.find(x => x[0] === k); if (!MD) return '';
  const d = Math.abs(m - s.lean);
  return `<div class="mvr"><div class="mvl"><span>${esc(MD[1])}</span><span>${esc(MD[2])}</span></div><div class="mvt"><i class="you" style="left:${m}%"></i><i class="him ${d > 40 ? 'off' : ''}" style="left:${s.lean}%">${ART.staffFace(role)}</i></div><div class="mvf"><span>Your mandate vs ${esc(s.name.split(' ')[0])}'s instinct</span><b class="${d > 40 ? 'bad' : d < 20 ? 'good' : ''}">${d > 40 ? 'Friction' : d < 20 ? 'Aligned' : 'Some distance'}</b></div></div>`;
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
  return `<div class="plan2">${!only ? `<div class="spread"><b>Season budget</b><span class="small ${V.ok ? 'good' : 'bad'}">${money(V.spend)} of ${money(V.env)}/wk</span></div><div class="budbar"><b class="${V.ok ? '' : 'over'}" style="width:${Math.min(100, V.env ? V.spend / V.env * 100 : 100)}%"></b></div><p class="small" style="margin:4px 0 8px">${V.ok ? 'Within what revenue covers.' : 'Above what revenue covers: cash goes down.'} Forecast ±${V.err}%.</p>` : ''}
  ${rows.map(r => `<div class="plrow"><span><b>${esc(r.t)}</b><small>${money(r.cost)}/wk</small></span><div class="seg3" role="group" aria-label="${esc(r.t)} budget">${V.levels.map(([k, l], i) => `<button class="${r.lv === k ? 'on' : ''}" data-a="biz-lv" data-k="${r.k}" data-v="${k}" aria-pressed="${r.lv === k}">${l}<small>${money(r.costs[i])}</small></button>`).join('')}</div></div>`).join('')}
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
function acOverview(V) {
  const best = V.groups.flatMap(x => x.ps).sort((a, b) => (b.band ? b.band[1] : 0) - (a.band ? a.band[1] : 0))[0];
  return `<div class="sec">The pathway</div><div class="panel2">${acPyramid(V)}${best ? `<button class="pchip" data-a="player" data-id="${best.id}" style="margin-top:8px"><span>${ART.playerFace(best, 'happy')}</span>${esc(best.name)}<small>best prospect, ${best.age}</small></button>` : ''}<p class="small" style="margin:8px 0 0">The director and the academy staff decide how good the intake is and how fast the kids grow.</p></div>`;
}
function acDecisions(V) {
  const X = V.trial; if (!X) return `<div class="sec">Trial day</div><div class="panel2"><p class="small" style="margin:0">Next trial day in week 28. The academy picks who joins.</p></div>`;
  return `<div class="sec">Trial day <span class="small">${X.chosen.length} of ${X.picks} picked</span></div><div class="trials">${X.list.map(p => { const on = X.chosen.includes(p.id), rec = X.staffPick.includes(p.id); return `<div class="trial ${on ? 'on' : ''}" role="listitem"><span class="tf">${ART.playerFace(p, on ? 'happy' : null)}</span><b>${esc(p.name.split(' ').slice(-1)[0])}</b><small>${p.age}, ${esc(F.POS_L[p.pos])}</small><em>${p.band ? p.band[0].toFixed(1) + '–' + p.band[1].toFixed(1) : '?'}★</em>${rec ? '<i class="rec">Recruiters\' pick</i>' : ''}</div>`; }).join('')}</div><p class="small">The academy chooses the intake. You set its objectives, budget and protection in the academy mandate. Potential is a range: better recruiters make it narrower.</p>`;
}
function rxOverview(V) {
  const mx = Math.max(30, ...V.regions.map(r => r.net));
  return `<div class="sec">Scouting network</div><div class="panel2"><div class="netgrid">${V.regions.map(r => `<div class="netc ${r.focus ? 'f' + r.focus : ''}"><span class="nb" style="--s:${18 + r.net / mx * 34}px"></span><b>${esc(r.t)}</b><small>${r.net}${r.focus === 1 ? ', main focus' : r.focus === 2 ? ', second focus' : ''}</small></div>`).join('')}</div><p class="small" style="margin:6px 0 0">A stronger network finds better players and sharper reports. Focus and trips grow it.</p></div>
  <div class="sec">The DoF's record <span class="small">${V.hits} hit${V.hits === 1 ? '' : 's'}, ${V.misses} miss${V.misses === 1 ? '' : 'es'}</span></div><div class="panel2">${V.rec.length ? `<div class="hmstrip">${V.rec.slice(-16).map(x => `<button class="hm ${x.v === 'Hit' ? 'h' : 'm'}" ${x.pid ? `data-a="player" data-id="${x.pid}"` : ''} aria-label="${esc(x.name)}: ${x.v}">${x.v === 'Hit' ? '✓' : '✗'}</button>`).join('')}</div><p class="small" style="margin:6px 0 0">Each signing after half a season: a regular with good ratings is a hit. His record moves your trust in him.</p>` : '<p class="small" style="margin:0">No verdicts yet. Signings are judged once they have played.</p>'}</div>`;
}
function rxDecisions(V) {
  return `<div class="sec">Where the scouts look</div><div class="panel2"><div class="regchips">${V.regions.map(r => `<button class="${r.focus ? 'on f' + r.focus : ''}" data-a="rx-focus" data-k="${r.k}">${esc(r.t)}${r.focus ? `<small>${r.focus === 1 ? 'main' : 'second'}</small>` : ''}</button>`).join('')}</div><p class="small" style="margin:6px 0 0">Tap a region to make it the main focus. The old main focus becomes the second.</p></div>
  <div class="sec">Scouting trip</div><div class="panel2"><p class="small" style="margin:0 0 8px">A trip of the scouting team grows one network fast. ${money(V.cost)}, once every 8 weeks.</p><div class="regchips">${V.regions.map(r => `<button data-a="rx-invest" data-k="${r.k}" ${V.investIn ? 'disabled' : ''}>${esc(r.t)}<small>${r.net}</small></button>`).join('')}</div>${V.investIn ? `<p class="small" style="margin:6px 0 0">Next trip in ${V.investIn} wk.</p>` : ''}</div>`;
}
function vDept(k) {
  const g = G(), v = F.deptView(k), d = v.d, tab = U.dtab || 'over';
  const head = `<div class="ohead"><button class="iconbtn" data-a="dept" data-k="" aria-label="Back to departments">${ART.I.back}</button><span class="pos">${esc(d.t)}</span><span class="dstat ${v.status.st}">${v.status.l}</span></div>`;
  if (k === 'first' && v.head) { const T = F.ftView(); if (T.talk) return head + ftTalkHtml(T); }
  const FP = k === 'first' && v.head ? vFirst(true) : null;
  const tabs = `<div class="dtabs" role="tablist">${[['over', 'Overview'], ['people', 'People'], ['data', 'Data'], ['dec', 'Decisions']].map(([t, l]) => `<button role="tab" class="${tab === t ? 'on' : ''}" data-a="dtab" data-v="${t}">${l}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'over') {
    const kpis = `<div class="kgrid">${v.status.rows.slice(0, 4).map(r => `<div class="kt ${r.ok === true ? 'good' : r.ok === false ? 'bad' : ''}"><small>${esc(r.l)}</small><b>${esc(r.v)}</b>${r.ref ? `<span>${esc(r.ref)}</span>` : ''}</div>`).join('')}</div>`;
    const vis = k === 'recruit' && F.rxView ? rxOverview(F.rxView()) : k === 'academy' && F.acView ? acOverview(F.acView()) : k === 'business' && F.bizView ? bizOverview() : k === 'commercial' && F.comView ? comOverview(F.comView()) : k === 'marketing' && F.mkView ? mkOverview(F.mkView()) : FP ? `<div class="sec">Form</div><div class="panel2">${FP.form}${FP.trend}</div>` : `<div class="sec">${esc(v.kpiL[0])}</div><div class="panel2"><div class="kbig">${v.kpi.length ? kfmt(k, v.kpi[v.kpi.length - 1]) : '–'}</div>${spark(v.kpi, v.kpiL[1])}</div>`;
    const mand = FP ? `<div class="sec">Your mandate vs what he does</div><div class="panel2">${FP.rows}${FP.gapBig ? `<button class="btn ghost wide" data-a="ft-talk" style="margin-top:8px">Raise it with ${esc(FP.sur)}</button>` : ''}</div>` : v.head ? `<div class="sec">Direction</div><div class="panel2">${instinctRow(d.head)}</div>` : '';
    body = kpis + vis + mand;
  }
  if (tab === 'people') {
    const scoutC = d.also ? (() => { const sc = v.also; return sc ? `<div class="pcard2 senior"><span class="pf">${ART.staffFace(d.also)}</span><span class="pm"><b>${esc(sc.name)}</b><small>Chief scout, ${starsTxt(F.stars(F.ovr(sc)))}</small></span><span class="pb"><button class="linkbtn" data-a="sheet" data-s="mand" data-r="scout">Mandate</button><button class="linkbtn" data-a="sheet" data-s="talk" data-r="scout" ${g.ap < 1 ? 'disabled' : ''}>Talk</button></span></div>` : `<div class="pcard2 senior"><span class="pf empty">${ART.I.staff}</span><span class="pm"><b>No chief scout</b><small>Scouting runs on luck</small></span><button class="btn small" data-a="sheet" data-s="cands" data-r="scout">Hire</button></div>`; })() : '';
    const cards = v.staff.map(st => `<div class="pcard2 ${st.on ? '' : 'pending'}"><span class="pf">${ART.face(st.id * 17 + 5, { role: d.face, age: st.age, bg: '#fff' })}</span><span class="pm"><b>${esc(st.name)}</b><small>${esc(st.title)}</small><span class="traits"><span title="${esc(st.tdesc)}">${esc(st.trait)}</span></span><small class="pw">${esc(st.what)}. ${money(st.wage)}/wk</small>${st.on ? '' : `<small class="pw">Starts in ${st.left} wk</small>`}</span><button class="linkbtn" data-a="dletgo" data-k="${k}" data-id="${st.id}">Let go</button></div>`).join('');
    const open = v.used < v.slots ? `<div class="sec">Open roles <span class="small">${v.slots - v.used} free</span></div><div class="oroles">${v.open.map(o => `<button class="orole" data-a="dcand" data-k="${k}" data-r="${o.role}"><b>${esc(o.title)}</b><small>${esc(o.what)}</small><em>from ${money(o.wage)}/wk</em></button>`).join('')}</div>` : `<p class="small">All ${v.slots} staff roles are filled. More room comes with a higher division.</p>`;
    body = `${scoutC}<div class="sec">Staff <span class="small">${v.used} of ${v.slots}</span></div>${cards || '<p class="small">Nobody yet. The head does everything alone.</p>'}${open}`;
  }
  if (tab === 'data') {
    if (k === 'academy') body = g.academy ? vAcademy2().replace(/<div class="ohead">[\s\S]*?<\/div>/, '') : '';
    else if (FP) body = `<div class="sec">The squad, through his eyes</div><div class="panel2">${FP.squad || '<p class="small">Nothing yet.</p>'}</div><div class="sec">Fitness</div>${FP.fit}`;
    else if (k === 'recruit') body = vRecruit2();
    else if (k === 'commercial') body = secCommercial() + `<div class="sec">${esc(v.kpiL[0])}</div><div class="panel2">${spark(v.kpi)}</div>`;
    else if (k === 'marketing') body = secMarketing() + `<div class="sec">Fans over time</div><div class="panel2">${spark(F.mkView ? F.mkView().hist : v.kpi)}</div>` + (F.mkView && F.mkView().log.length ? `<div class="sec">Recently</div><div class="panel2">${F.mkView().log.map(l => `<p class="small" style="margin:3px 0">Wk ${l.w}: ${esc(l.t)}</p>`).join('')}</div>` : '');
    else if (k === 'business') body = vMoney2();
    else body = `<div class="sec">${esc(v.kpiL[0])}</div><div class="panel2">${spark(v.kpi, v.kpiL[1])}</div>`;
    if (k !== 'academy') body += `<div class="sec">All numbers</div><div class="panel2">${v.status.rows.map(r => `<div class="scr2"><span>${esc(r.l)}${r.ref ? `<small>${esc(r.ref)}</small>` : ''}</span><b class="${r.ok === true ? 'good' : r.ok === false ? 'bad' : ''}">${esc(r.v)}</b></div>`).join('')}</div>`;
  }
  if (tab === 'dec') {
    const items = inboxItems().filter(i => i.kind === 'need' && (i.role === d.head || (d.also && i.role === d.also)));
    const inbox = items.length ? `<div class="sec">Waiting for you</div>${items.map(i => `<button class="dinb" data-a="dinbox" data-key="${i.key}"><b>${esc(i.subj)}</b><small>${esc(i.label)}</small>${ART.I.chev}</button>`).join('')}` : '';
    const bud = v.bud ? `<div class="sec">Budget</div><div class="budcard">${planCard(k)}</div>` : `<div class="sec">Budget</div><div class="budcard">${planCard()}</div>`;
    const fac = v.fac ? `<div class="sec">Facilities</div><div class="panel2">${mrow('stadium', esc(v.fac.l), v.fac.lv, 10, 'Level ' + v.fac.lv)}<p class="small" style="margin:6px 0 0">Upgrades come through projects in the board meeting.</p></div>` : '';
    const proj = v.projects.length ? `<div class="sec">Projects</div><div class="panel2">${v.projects.map(pr => { const P = F.PROP[pr.id]; let t = ''; try { t = typeof P.title === 'function' ? P.title(pr.ctx) : P.title; } catch (e) { } const left = pr.due - F.absWeek(); return `<div class="proj"><span>${esc(t)}</span><em>${Math.max(0, left)} wk</em></div>`; }).join('')}</div>` : '';
    const log = v.log.length ? `<div class="sec">Recently</div><div class="panel2">${v.log.map(l => `<p class="small" style="margin:3px 0">Wk ${l.w}: ${esc(l.t)}</p>`).join('')}</div>` : '';
    body = inbox + (k === 'recruit' && F.rxView ? rxDecisions(F.rxView()) : '') + (k === 'academy' && F.acView ? acDecisions(F.acView()) : '') + (k === 'commercial' && F.comView ? comDecisions(F.comView()) : '') + (k === 'marketing' && F.mkView ? mkDecisions(F.mkView()) : '') + (FP ? `<div class="sec">Target</div>${FP.deal}` : '') + bud + fac + proj + log;
  }
  const mini = v.head ? `<div class="hmini"><span class="dface">${ART.staffFace(d.head)}</span><span class="dt"><b>${esc(v.head.name)}</b><small>${esc(F.ROLE[d.head].t)}</small></span>${headBtns(d.head, v.head).replace('class="hbtns"', 'class="hbtns in"')}</div>` : headCard(k, v);
  return `${head}${tab === 'over' ? headCard(k, v) : mini}${tabs}${body}`;
}
/* ---------- first team department ---------- */
function vFirst(parts) {
  const g = G(), v = F.ftView(), s = v.s;
  const head = `<div class="ohead"><button class="iconbtn" data-a="dept" data-k="" aria-label="Back to departments">${ART.I.back}</button><span class="pos">First team</span><button class="iconbtn" data-a="sheet" data-s="mand" data-r="coach" ${s ? '' : 'disabled'} aria-label="Coach mandate">${ART.I.staff}</button></div>`;
  if (!s) return `${head}<div class="empty2"><p>There is no head coach. The team picks itself, badly.</p><button class="btn" data-a="tab" data-t="staff">Hire a coach</button></div>`;
  if (v.talk) return head + ftTalkHtml(v);
  const sur = s.name.split(' ').slice(-1)[0], hero = `<section class="fthero"><div class="fth1"><div class="ftface">${ART.staffFace('coach')}</div><div class="fthm"><b>${esc(s.name)}</b><span class="small">Head coach, ${s.age}. ${s.contract} season${s.contract === 1 ? '' : 's'} left</span>${starsTxt(F.stars(F.ovr(s)))}</div></div>
    ${mrow('trust', 'Relationship', s.rel, 100, r0(s.rel), s.rel < 35 ? 'lo' : '')}${mrow('board', 'Follows mandate', v.comp * 100, 100, Math.round(v.comp * 100) + '%', v.comp < 0.65 ? 'lo' : '')}${s.boostW > 0 ? `<p class="small ${s.boost >= 0 ? 'good' : 'bad'}" style="margin:4px 0 0">${s.boost >= 0 ? 'Fired up after your last talk.' : 'Deflated after your last talk.'} ${s.boostW} wk left</p>` : ''}
    <div class="bubble">${esc(v.line)}${ticOf('coach', v.line) ? `<span class="tic">${esc(ticOf('coach', v.line))}</span>` : ''}</div></section>`;
  // form
  const G6 = v.games, mx = Math.max(1.5, ...G6.map(x => Math.max(x.ux, x.tx)));
  const form = G6.length ? `<div class="ftform">${G6.map(x => `<div class="fg"><span class="res ${x.r}">${x.r}</span><b>${x.ug}–${x.tg}</b><span class="xgs"><i class="u" style="height:${x.ux / mx * 100}%"></i><i class="t" style="height:${x.tx / mx * 100}%"></i></span><small>${esc(x.o.split(' ')[0])}</small></div>`).join('')}</div><p class="small" style="margin:4px 0 0">Bars: expected goals for (green) and against (red).</p>` : '<p class="small">No matches yet.</p>';
  const P = v.pos, n = g.divs[g.club.tier].clubs.length;
  const trend = P.length > 1 ? (() => { const W = 320, H = 80, x = i => 8 + i / (P.length - 1) * (W - 16), y = r => 6 + (r - 1) / (n - 1) * (H - 12); return `<svg class="ftrend" viewBox="0 0 ${W} ${H}" role="img" aria-label="League position by week"><line x1="8" x2="${W - 8}" y1="${y(v.exp)}" y2="${y(v.exp)}" class="exp"/><text x="${W - 8}" y="${y(v.exp) - 3}" text-anchor="end">expected ${F.ord(v.exp)}</text><polyline points="${P.map((r, i) => x(i) + ',' + y(r)).join(' ')}"/><circle cx="${x(P.length - 1)}" cy="${y(P[P.length - 1])}" r="4"/></svg>`; })() : '';
  // mandate vs reality
  const rows = v.rows.map(r => `<div class="mvr"><div class="mvl"><span>${esc(r.l[0])}</span><span>${esc(r.l[1])}</span></div><div class="mvt"><i class="you" style="left:${r.you}%" title="You"></i><i class="him ${Math.abs(r.d) >= 15 ? 'off' : ''}" style="left:${r.him}%">${ART.staffFace('coach')}</i></div><div class="mvf"><span>${esc(r.fact)}</span>${Math.abs(r.d) >= 8 ? `<b class="${Math.abs(r.d) >= 15 ? 'bad' : ''}">${r.d > 0 ? '+' : '−'}${Math.abs(r.d)} vs your mandate</b>` : '<b class="good">As agreed</b>'}</div>${r.why ? `<p class="mvq">"${esc(r.why)}"</p>` : ''}</div>`).join('');
  const gapBig = v.rows.some(r => Math.abs(r.d) >= 12);
  // squad
  const E = v.eyes, chip = (p, extra) => `<button class="pchip" data-a="player" data-id="${p.id}"><span>${ART.playerFace(p)}</span>${esc(p.name.split(' ').slice(-1)[0])}<small>${p.pos}${extra ? ', ' + extra : ''}</small></button>`;
  const grp = (t, arr, ex) => arr.length ? `<div class="pgrp"><div class="pgl">${t}</div><div class="pchips">${arr.map(p => chip(p, ex ? ex(p) : '')).join('')}</div></div>` : '';
  const squad = grp('Picks every week', E.core, p => p.st ? p.st.apps + ' apps' : '') + grp('Left out', E.out, p => p.ca.toFixed(1) + ' rating') + grp('Injured', E.inj, p => p.inj + ' wk') + grp('Unhappy', E.sad, p => 'morale ' + Math.round(p.morale));
  // deal
  const deal = v.deal ? `<div class="ftdeal"><span class="ic2">${ART.I.trust}</span><div><b>${esc(v.deal.t)}</b><span class="small">Agreed in week ${v.deal.w0}. Deadline: week ${v.deal.by}</span></div></div>` : `<div class="ftdeal none"><div><b>No target agreed</b><span class="small">${v.last ? `Last one: ${esc(v.last.t)}. ${v.last.met ? 'Met.' : 'Missed.'}` : 'Agree one in a talk. Met targets lift trust, missed ones cost it.'}</span></div></div>`;
  // fitness
  const fit = `<div class="panel2">${mrow('risk', 'Injury risk', v.injRisk, 100, v.injRisk < 45 ? 'Low' : v.injRisk < 62 ? 'Normal' : 'High', v.injRisk >= 62 ? 'lo' : '')}<p class="small" style="margin:6px 0 0">${v.injS} injur${v.injS === 1 ? 'y' : 'ies'} this season. Training intensity drives this; a fitness coach cuts it.</p></div>`;
  // resources
  const res = `<div class="ftres">${v.res.map(r => `<div class="rcard ${r.on ? (r.left > 0 ? 'setup' : 'on') : ''}"><span class="ric">${ART.I[r.ic] || ''}</span><b>${esc(r.t)}</b><span class="small">${esc(r.d)}</span><span class="rcost">${money(r.wk)}/wk${r.on ? '' : `, ${money(r.fee)} to set up`}</span>${r.on ? (r.left > 0 ? `<span class="rstat">Starts in ${r.left} wk</span>` : `<span class="rstat good">Active</span>`) + `<button class="linkbtn" data-a="ft-cancel" data-k="${r.k}">Let go</button>` : `<button class="btn small" data-a="ft-buy" data-k="${r.k}" ${g.club.cash < r.fee ? 'disabled' : ''}>Hire</button>`}</div>`).join('')}</div>`;
  if (parts) return { hero, form, trend, rows, gapBig, squad, deal, fit, sur };
  return `${head}${hero}
  <div class="sec">Form</div><div class="panel2">${form}${trend}</div>
  <div class="sec">Your mandate vs what he does</div><div class="panel2">${rows}${gapBig ? `<button class="btn ghost wide" data-a="ft-talk" style="margin-top:8px">Raise it with ${esc(sur)}</button>` : ''}</div>
  <div class="sec">The squad, through his eyes</div><div class="panel2">${squad || '<p class="small">Nothing to show yet.</p>'}</div>
  <div class="sec">Target</div>${deal}
  <div class="sec">Fitness</div>${fit}
  <div class="sec">Support staff</div>${res}
  <div class="ftacts"><button class="btn" data-a="ft-talk" ${g.ap < 1 ? 'disabled' : ''}>${ART.I.phone} Talk to ${esc(sur)}</button><button class="btn ghost danger" data-a="ft-sackq">Sack</button></div><p class="small" style="text-align:center">A talk costs one action. ${g.ap} left this week.</p>`;
}
function ftTalkHtml(v) {
  const T = v.talk, s = v.s, last = T.log.slice(-3);
  const emo = T.done ? (T.fx.some(x => /down|deflated|−/i.test(x)) ? 'worried' : 'happy') : null;
  U.tray = T.done ? trayHtml('', `<button class="btn" data-a="ft-talk-close">Back to the first team</button>`, '') : trayHtml(`<span>You say</span>${apPips(G().ap)}`, T.opts.map((o, j) => choiceHtml({ l: o.t, h: o.fx }, j, `data-a="ft-ans" data-id="${o.id}"`, false, false)).join(''), '');
  U.trayH = T.done ? 90 : 60 + T.opts.length * 66;
  return `<div class="ftalk">${sceneHtml('coach', s.name, 'talk', 'In his office', '', emo)}${last.map((l, i) => l.who === 'you' ? `<p class="you-said">You: ${esc(l.t)}</p>` : `<div class="bubble ${i < last.length - 1 ? 'old' : ''}">${esc(l.t)}${ticOf('coach', l.t) ? `<span class="tic">${esc(ticOf('coach', l.t))}</span>` : ''}</div>`).join('')}${T.done && T.fx.length ? `<div class="fxrow">${T.fx.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>` : ''}</div><div class="trayspace" style="--tray:${U.trayH}px"></div>`;
}
function vAcademy2() {
  const g = G(), v = F.acadView(), a = v.a, c = g.club, sel = U.ag || 'U18', grpD = v.groups.find(x => x.k === sel);
  const sc = Math.round(v.catScore.total), ring = Math.min(100, sc);
  return `<div class="ohead"><button class="iconbtn" data-a="acad-close" aria-label="Back to the club">${ART.I.back}</button><span class="pos">Youth academy</span><button class="iconbtn" data-a="sheet" data-s="mand" data-r="acad" ${F.staff('acad') ? '' : 'disabled'} aria-label="Academy mandate">${ART.I.staff}</button></div>
  <section class="clubhero"><div class="ch1"><div class="ring" style="--p:${ring}"><b>${v.cat}</b><small>CAT</small></div><div><h2>${esc(c.name)} Academy</h2><span class="small">Run by ${esc(F.staffName('acad'))}. Score ${sc}, next category at ${sc < 55 ? 55 : sc < 75 ? 75 : 95}. Audit week 30.</span></div></div></section>
  ${v.diag.length ? `<div class="sec">Holding it back</div><div class="planboard">${v.diag.slice(0, 3).map(d => `<${d.a === 'mand' ? `button data-a="sheet" data-s="mand" data-r="${d.x}"` : 'div'} class="pl open"><i class="dot"></i>${esc(clip2(d.t)[0])}<span>${d.a === 'mand' ? 'Fix' : ''}</span></${d.a === 'mand' ? 'button' : 'div'}>`).join('')}</div>` : ''}
  <div class="sec">Pipeline</div><div class="panel2">${mrow('youth', 'Foundation', Math.min(40, a.found.n), 40, a.found.n)}${v.groups.map(x => mrow('academy', x.k, x.players.length, 14, x.players.length)).join('')}</div>
  <div class="sec">Players</div><div class="seg wide" style="margin-bottom:8px">${['U14', 'U16', 'U18', 'U21'].map(k => `<button class="${sel === k ? 'on' : ''}" data-a="ag" data-v="${k}">${k}</button>`).join('')}</div>
  <div class="pcards">${grpD.players.map(p => `<button class="pcd" data-a="player" data-id="${p.id}"><span class="pf">${ART.face(p.id * 17 + 11, { role: 'youth', age: p.age, region: p.region, c1: c.colors[0], c2: c.colors[1], bg: '#fff', emo: p.wel < 40 ? 'worried' : null })}</span><span class="pm"><b>${esc(p.name)}</b><small>${p.age}, ${F.POS_L[p.pos]}${p.playUp ? ', plays up' : ''}${p.loanOut ? ', on loan' : ''}</small><span class="strengths">${strengths(p)}</span></span><span class="pr"><span class="stx">${F.absStars(p.ca)}★</span><small class="small">pot ${p.band[0]}–${p.band[1]}★</small>${p.wel < 40 || p.edu < 40 ? '<small class="bad">at risk</small>' : ''}</span></button>`).join('') || '<p class="small">No players in this group.</p>'}</div>
  <div class="sec">Return on investment</div><div class="money1 panel2"><div><small>Spent</small><b>${money(v.roi.spent)}</b></div><div><small>Earned</small><b>${money(v.roi.earned)}</b></div><div><small>Net</small><b class="${v.roi.net >= 0 ? 'good' : 'bad'}">${v.roi.net >= 0 ? '+' : ''}${money(v.roi.net)}</b></div></div>
  <details class="more" style="margin-top:14px"><summary>Full academy report ${ART.I.chev}</summary>${vAcademy().replace(/<button class="linkish" data-a="acad-close">Back to the club<\/button>/, '')}</details>`;
}
function vReview2() {
  const g = G(), r = g.lastReport, up = r.moves.includes('promoted'), down = r.moves.includes('relegated');
  const head = up ? `${g.club.name} are going up` : down ? `Relegation for ${g.club.name}` : r.pos <= 3 && r.tier === 1 ? 'Champions' : `${F.ord(r.pos)} place`;
  const me = r.table.find(x => x.id === 0) || {};
  return `<div class="setup"><article class="paper"><div class="mast">THE ${esc(g.club.city.toUpperCase())} GAZETTE <small>Season ${r.season} review</small></div>
    ${up || down ? `<div class="gstamp ${up ? '' : 'gE'}">${up ? '↑' : '↓'}<small>${up ? 'PROMOTED' : 'RELEGATED'}</small></div>` : `<div class="gstamp gC">${r.pos}<small>FINISH</small></div>`}
    <h1 class="ehead2">${esc(head)}</h1><p class="esub2">${F.ord(r.pos)} in the ${esc(r.tierName)}${up || down ? `. Next: the ${F.TIERS[r.newTier]}` : ''}.</p>
    ${r.second ? `<p class="quote" style="margin:8px 0">The board gives you one more season. Bounce back, or the next relegation is your last.</p>` : ''}
    <div class="statrow"><div><small>Points</small><b>${me.pts || 0}</b></div><div><small>Goals</small><b>${me.gf || 0}–${me.ga || 0}</b></div><div><small>Prize</small><b>${money(r.prize)}</b></div><div><small>Board</small><b>${r0(g.board.conf)}%</b></div></div>
    <div class="sec2">Objectives</div><div class="planboard">${r.objectives.map(o => `<div class="pl ${o.met ? 'done' : 'open'}"><i class="dot"></i>${esc(o.t)}<span>${o.met ? 'Met' : 'Missed'}</span></div>`).join('')}${r.promises.map(o => `<div class="pl ${o.kept ? 'done' : 'open'}"><i class="dot"></i>Promise: ${esc(o.t)}<span>${o.kept ? 'Kept' : 'Broken'}</span></div>`).join('')}</div>
    ${r.signings && r.signings.length ? `<div class="sec2">Signings rated</div><div class="ins">${r.signings.filter(e => e.p).map(e => `<button class="inc ${e.verdict === 'Miss' ? 'flag' : ''}" data-a="player" data-id="${e.p.id}"><span class="pf">${ART.playerFace(e.p, e.verdict === 'Hit' ? 'happy' : e.verdict === 'Miss' ? 'worried' : null)}</span><span><b>${esc(e.name.split(' ').slice(-1)[0])}</b><small>${e.verdict}${e.rat ? ', ' + e.rat.toFixed(2) : ''}</small></span></button>`).join('')}</div>` : ''}
    ${r.promoted && r.promoted.length ? `<div class="sec2">From the academy</div><p class="outs">${esc(r.promoted.join(', '))}</p>` : ''}
    ${r.licence ? `<p class="note">${esc(r.licence)}</p>` : ''}${r.deduct ? `<p class="note bad">In the red: a ${r.deduct}-point deduction next season.</p>` : ''}
    <details class="more"><summary>Final table ${ART.I.chev}</summary><div class="ltab">${r.table.map((x, i) => `<div class="lr ${x.id === 0 ? 'me' : ''} ${i < 3 && r.tier > 1 ? 'up' : ''} ${i >= 15 && r.tier < 8 ? 'dn' : ''}"><span>${i + 1}</span><span class="cn">${esc(x.n)}</span><span>${x.p}</span><span>${x.gf - x.ga > 0 ? '+' : ''}${x.gf - x.ga}</span><b>${x.pts}</b></div>`).join('')}</div></details></article>
  ${trayHtml('', `<button class="btn" data-a="next-season">Start the summer</button>`, '')}<div class="trayspace" style="--tray:100px"></div></div>`;
}
function vReview() {
  const g = G(), r = g.lastReport;
  const head = r.moves.includes('promoted') ? `${g.club.name} are going up` : r.moves.includes('relegated') ? `Relegation for ${g.club.name}` : r.pos <= 3 && r.tier === 1 ? 'Champions of the Premiership' : `Season ${r.season}: ${F.ord(r.pos)} place`;
  return `<div class="setup"><div class="kick">Season review</div><div class="hero" style="padding:20px 0"><h1 style="font-size:clamp(40px,9vw,80px)">${esc(head)}</h1><p>${F.ord(r.pos)} in the ${r.tierName}. ${r.moves.includes('promoted') ? 'Next season: the ' + F.TIERS[r.newTier] + '.' : r.moves.includes('relegated') ? 'Next season: the ' + F.TIERS[r.newTier] + '.' : ''} Prize money ${money(r.prize)}. Board confidence ${sign(r.boardDelta)} on objectives and promises, now ${r0(g.board.conf)}%.</p></div>
  <div class="grid2" style="margin-top:16px"><section class="panel"><h2>Board objectives</h2><ul class="list">${r.objectives.map(o => `<li><span>${esc(o.t)}</span><b class="${o.met ? 'good' : 'bad'}">${o.met ? 'Met' : 'Missed'}</b></li>`).join('')}</ul>
  <h3>Promises</h3>${r.promises.length ? `<ul class="list">${r.promises.map(o => `<li><span>${esc(o.t)}</span><b class="${o.kept ? 'good' : 'bad'}">${o.kept ? 'Kept' : 'Broken'}</b></li>`).join('')}</ul>` : '<p class="small">None made.</p>'}
  ${r.licence ? `<p class="note">${esc(r.licence)}</p>` : ''}${r.deduct ? `<p class="note bad">You ended the season in the red: a ${r.deduct}-point deduction applies next season.</p>` : ''}</section>
  <section class="panel"><h2>Comings and goings</h2>${r.renewed.length ? `<h3>Contracts renewed by the DoF</h3><p>${esc(r.renewed.join(', '))}</p>` : '<p class="small">Expiring contracts are decided in the summer clear-out.</p>'}<h3>Leaving</h3><p>${esc(r.leavers.join(', ') || 'Nobody.')}</p>${r.signings && r.signings.length ? `<h3>Signings rated</h3><ul class="list">${r.signings.map(e => `<li><span>${esc(e.name)} <span class="pos">${e.pos}</span></span><b class="${e.cls}">${e.verdict}</b></li>`).join('')}</ul>` : ''}<h3>Promoted from the academy</h3><p>${esc(r.promoted.join(', ') || 'Nobody this year.')}</p><h3>Staff</h3><p>${esc(r.staff.join(' ') || 'No contract changes.')}</p></section>
  <section class="panel"><h2>Final table</h2><div class="scroll"><table><thead><tr><th>Club</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>${r.table.map((x, i) => `<tr class="${x.id === 0 ? 'me' : ''} ${i < 3 && r.tier > 1 ? 'zone-up' : ''} ${i >= 15 && r.tier < 8 ? 'zone-down' : ''}"><td>${i + 1}. ${esc(x.n)}</td><td>${x.p}</td><td>${sign(x.gf - x.ga)}</td><td>${x.pts}</td></tr>`).join('')}</tbody></table></div></section></div>
  <div class="row" style="margin:26px 0"><button class="btn" data-a="next-season">Start season ${g.season + 1}</button></div></div>`;
}
function vSacked() {
  const g = G();
  const o = g.over || {}, CAUSE = { board: 'Board confidence ran out', season: 'Season review by the board', admin: 'Second administration', 'vote:board': 'Lost a vote of confidence: the board', 'vote:fans': 'Lost a vote of confidence: the supporters', 'vote:press': 'Lost a vote of confidence: the press storm', 'vote:room': 'Lost a vote of confidence: the dressing room' };
  const facts = [['Cause', CAUSE[o.cause] || 'Dismissed'], ['When', o.season ? `Season ${o.season}, week ${o.week}` : `Season ${g.season}`], ['League position', o.pos ? `${F.ord(o.pos)} in the ${F.TIERS[o.tier || g.club.tier]}` : F.TIERS[g.club.tier]], ...(F.backers ? F.backers().map(b => [b.t, String(b.v)]) : [])];
  return `<div class="setup"><div class="hero"><div class="kick">Final edition</div><h1>CEO dismissed</h1><p>${esc(g.sackReason)} You leave ${esc(g.club.name)} after ${g.season} season${g.season > 1 ? 's' : ''}.</p>
  <dl class="figs endfig">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>${g.trophies.length ? `<p>Honours: ${esc(g.trophies.join(', '))}.</p>` : ''}
  <div class="row" style="margin-top:18px"><button class="btn" data-a="restart">Found a new club</button><button class="btn ghost" data-a="sheet" data-s="quick">Base club</button></div></div></div>`;
}

/* ---------- render ---------- */

/* ---------- inbox home (1.6) ---------- */
const ROLEI = { dof: 'DoF', coach: 'HC', scout: 'SC', acad: 'AC', com: 'CO', mkt: 'MK', fin: 'FI', board: 'BD', fans: 'FN', press: 'PR', club: 'FO' };
const isRead = k => !!((G().read || {})[k]);
function markRead(k) { const g = G(); g.read = g.read || {}; if (!g.read[k]) g.read[k] = F.absWeek(); const keep = F.absWeek() - 6; for (const x in g.read) if (g.read[x] < keep) delete g.read[x]; }
const first = t => { t = String(t || ''); const i = t.search(/[.!?](\s|$)/); return i > 0 ? t.slice(0, i + 1) : t; };
function inboxItems() {
  const g = G(), out = [], wk = g.week, se = g.season;
  for (const m of g.inbox.filter(m => !m.done)) { const v = F.msgView(m), dz = /^dos_/.test(m.ev) && m.ctx && m.ctx.part != null; out.push({ key: 'm' + m.id, kind: 'need', fold: 'need', label: dz ? `Dossier ${m.ctx.part + 1}/3` : /^pw_/.test(m.ev) ? 'Agreement' : 'Needs you', role: v.role, from: v.from.split(',')[0], subj: v.title, prev: first(v.body), ref: m, t: 'msg' }); }
  const mt = g.meeting;
  if (mt && !mt.pre && mt.week === wk && mt.season === se) mt.items.forEach((it, i) => { const v = F.proposalView(it); out.push({ key: `p${se}_${wk}_${i}`, kind: it.status === 'open' ? 'need' : 'done', fold: it.status === 'open' ? 'need' : 'done', label: it.status === 'open' ? 'Meeting' : cap(it.status), role: it.owner, from: v.owner, subj: v.title, prev: `${money(v.cost)} now, ${v.dur} weeks, his confidence ${Math.round(v.pc * 100)}%`, ref: i, t: 'prop' }); });
  for (const b of g.briefs || []) { const v = F.briefView(b); out.push({ key: 'b' + b.id, kind: b.done ? 'done' : 'upd', fold: b.t === 'coach_debrief' || b.t === 'stake_match' ? 'match' : 'staff', bt: b.t, label: b.del ? 'Staff call' : b.done ? 'Handled' : 'Update', role: v.role || 'club', from: v.who.split(',')[0], subj: v.title, prev: b.done ? `${v.opts[v.choice].l}. ${v.out}` : first(v.text), ref: b, t: 'brief' }); }
  { const mss = (g.msNew || []).map(ms => ({ ms, p: g.squad.find(x => x.id === ms.pid) })).filter(x => x.p); if (mss.length) out.push({ key: `msw${se}_${wk}`, kind: 'info', fold: 'players', label: 'Milestones', role: 'player', pl: mss[0].p, from: mss.length === 1 ? mss[0].p.name : `${mss.length} players`, subj: mss.length === 1 ? mss[0].ms.t : `${mss.length} milestones this week`, prev: mss.map(x => x.p.name.split(' ').slice(-1)[0]).join(', '), t: 'ms', mss }); }
  if (F.pwView) { const PV = F.pwView(); if (PV && PV.stage !== 'closed') out.push({ key: 'pathway', kind: 'info', fold: 'dos', label: PV.stage === 'run' ? 'Running' : PV.stage === 'eval' ? 'Evaluation' : 'Open', role: 'acad', from: 'Agreement', subj: `The ${PV.tname} question`, prev: PV.ag ? `${PV.ag.routeT}. Evaluation week ${PV.ag.evalWeek}.` : 'Three departments, one youngster.', ref: PV, t: 'pathway' }); }
  if (F.dosView) { const DV = F.dosView(); for (const d of DV.open) out.push({ key: `dos_${d.id}`, kind: 'info', fold: 'dos', label: d.pending ? 'Needs you' : d.heatT, role: d.who, from: `Dossier · part ${Math.min(d.part + 1, d.n)} of ${d.n}`, subj: d.t, prev: d.pending ? 'The next part is on your desk.' : `Next part in ${d.inW} week${d.inW === 1 ? '' : 's'}. ${d.heatT}.`, ref: d, t: 'dossier' }); }
  const A = F.analysis();
  const pv = F.mtPreview ? F.mtPreview() : null;
  if (pv && g.phase === 'season') out.push({ key: `pv${se}_${wk}`, kind: 'info', fold: 'match', label: pv.rival ? 'Derby' : 'Preview', role: 'coach', from: 'Next match', subj: `${pv.home ? 'vs' : 'at'} ${pv.name}`, prev: `${F.ord(pv.pos)} in the table, ${pv.sty.t.toLowerCase()}. ${pv.odds}.`, t: 'preview' });
  const hasDeb = (g.briefs || []).some(b => b.t === 'coach_debrief');
  if (g.lastMatch && !hasDeb && g.week > 1) { const lm = g.lastMatch; out.push({ key: `mt${se}_${wk}`, kind: 'info', fold: 'match', label: 'Result', role: 'coach', from: lm.comp === 'Cup' ? 'National Cup' : 'Last match', subj: `${lm.home ? g.club.short : (lm.oppName || '').slice(0, 14)} ${lm.home ? lm.ug : lm.tg}–${lm.home ? lm.tg : lm.ug} ${lm.home ? (lm.oppName || '').slice(0, 14) : g.club.short}`, prev: `xG ${lm.uxg.toFixed(1)} vs ${lm.txg.toFixed(1)}${lm.motm ? ', best: ' + lm.motm : ''}`, t: 'match' }); }
  if (g.paper && g.paper.headline) out.push({ key: `n${se}_${wk}`, kind: 'info', fold: 'press', label: 'Paper', role: 'press', from: 'The Gazette', subj: g.paper.headline, prev: first(g.paper.sub), t: 'paper' });
  if ((g.reports || []).length) { const au = g.paper.stories.filter(s => s.auto).length; out.push({ key: `d${se}_${wk}`, kind: 'info', fold: 'reports', label: 'Report', role: 'club', from: 'Weekly report', subj: A.g && A.behind ? `The week: ${F.ord(A.pos)}, target ${F.ord(A.target)}` : 'The week in six departments', prev: `${g.reports.length} departments report in${au ? ', and ' + au + ' things your staff handled' : ''}.`, t: 'digest' }); }
  for (const m of g.inbox.filter(m => m.done && m.season === se && m.week === wk)) { const v = F.msgView(m); out.push({ key: 'm' + m.id, kind: 'done', fold: 'done', label: m.del ? (m.err ? 'Wrong call' : 'Staff call') : 'Handled', role: v.role, from: v.from.split(',')[0], subj: v.title, prev: `${v.by === 'you' ? 'You' : v.by}: ${v.opts[v.choice].l}.`, ref: m, t: 'msg' }); }
  const order = { need: 0, upd: 1, info: 2, done: 3 }; return out.sort((a, b) => order[a.kind] - order[b.kind]);
}
function nextFix() { const g = G(), r = g.divs[g.club.tier].fix[g.week - 1]; if (!r) return null; const f = r.find(x => x[0] === 0 || x[1] === 0); const home = f[0] === 0, opp = home ? f[1] : f[0]; return { name: F.cname(opp), short: F.cname(opp).split(' ')[0], home, pos: F.sortTable(g.club.tier).indexOf(opp) + 1 }; }
function backersHtml() {
  if (!F.backers) return ''; const B = F.backers();
  return `<button class="bkrs" data-a="sheet" data-s="backers" aria-label="Your backers: ${B.map(b => b.t + ' ' + b.v).join(', ')}">${B.map(b => `<span class="bk ${b.danger ? 'lo' : ''}"><small>${ART.I[b.ic] || ''}${esc(b.t === 'Dressing room' ? 'Room' : b.t === 'Supporters' ? 'Fans' : b.t)}</small><b>${b.v}${b.d ? `<i class="${b.d > 0 ? 'up' : 'dn'}">${b.d > 0 ? '+' : ''}${b.d}</i>` : ''}</b><em><u style="width:${b.v}%"></u></em></span>`).join('')}</button>`;
}
function comingHtml() {
  if (!F.comingUp) return ''; const C = F.comingUp(); if (!C.length) return '';
  return `<section class="cup2"><h3>Coming up</h3>${C.map(c => `<div class="cu ${c.hot ? 'hot' : ''} ${c.bad ? 'bad' : ''}"><span>${ART.I[c.ic] || ART.I.info}</span><p><b>${esc(c.t)}</b>${esc(c.s)}</p></div>`).join('')}</section>`;
}
const BKT = { board: 'Board', fans: 'Supporters', press: 'Press', room: 'Dressing room' };
function dossierCard(d) {
  const dots = Array.from({ length: d.n }, (_, k) => `<i class="${k < d.part ? 'done' : k === d.part ? 'now' : ''}"></i>`).join('');
  return `<div class="dosc"><div class="dosh"><span class="dface">${ART.staffFace(d.who)}</span><div><small>Dossier</small><h2>${esc(d.t)}</h2></div></div>
    <div class="dosm"><span class="dosdots" aria-label="Part ${Math.min(d.part + 1, d.n)} of ${d.n}">${dots}</span><span class="heat h${Math.max(0, Math.min(3, d.heat))}">${esc(d.heatT)}</span></div>
    <p class="small">Touches: ${d.touches.map(k => BKT[k]).join(', ')}.${d.why ? ' ' + esc(d.why) : ''}</p>
    ${d.log.length ? `<ol class="doslog">${d.log.map(l => `<li><b>${esc(l.t)}</b><span>You: ${esc(l.l)}</span></li>`).join('')}</ol>` : ''}
    ${d.pending ? `<button class="btn" data-a="open" data-k="m${d.pending}">Open part ${Math.min(d.part + 1, d.n)}</button>` : `<p class="small">Next part in ${d.inW} week${d.inW === 1 ? '' : 's'}. Calm answers cool a dossier down; hard ones heat it up.</p>`}</div>`;
}
function archiveHtml() {
  if (!F.dosView) return ''; const A = F.dosView().arch; if (!A.length) return '';
  const K = { good: ['good', 'Ended well'], mixed: ['', 'Ended'], bad: ['bad', 'Ended badly'] };
  return `<section class="arch"><h3>Club archive</h3>${A.slice(0, 10).map(a => `<div class="arw"><span class="${K[a.k][0]}">${K[a.k][1]}</span><b>${esc(a.t)}</b><small>Season ${a.s}, week ${a.w}. ${esc(a.line)}</small></div>`).join('')}</section>`;
}
function pwMeetHtml(V) {
  if (!V) return ''; const ROLEN = { acad: 'acad', coach: 'coach', dof: 'dof' };
  return `<section class="pwm"><h3>Where they stand</h3>${V.stances.map(([r, t, x]) => `<div class="pws"><span class="pwf">${ART.staffFace(r)}</span><p><b>${esc(t)}</b>${esc(x)}</p></div>`).join('')}
    <h3>Ask before you decide <small>free</small></h3>${V.questions.map(q => q.a ? `<div class="pwq done"><b>${esc(q.q)}</b><p>${esc(q.a)}</p></div>` : `<button class="pwq" data-a="pw-ask" data-r="${q.r}"><b>${esc(q.q)}</b><span>${ART.I.chev}</span></button>`).join('')}
    <h3>The routes</h3>${V.routes.map(r => `<div class="pwr"><b>${esc(r.t)}</b><p>${esc(r.s)}</p></div>`).join('')}
    <p class="small">You agree a direction. The coach still picks the team and the DoF still does the deals.</p></section>`;
}
function pwEvalHtml(V) {
  if (!V || !V.ev) return ''; const E = V.ev;
  return `<section class="pwm"><h3>Four questions</h3>${E.lens.map(l => `<div class="pwl ${l.ok === false ? 'bad' : l.ok ? 'ok' : ''}"><b>${esc(l.k)}</b><p>${esc(l.t)}</p></div>`).join('')}<p class="pwv"><b>Verdict:</b> ${esc(E.verdict)}</p></section>`;
}
function agreementHtml(A) {
  if (!A) return ''; const row = (k, v) => v ? `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>` : '';
  return `<dl class="agr">${row('Why', A.cause)}${row('Responsible', A.owner)}${row('Direction', A.routeT)}${row('Means and limits', A.means)}${row('Evaluation', `Week ${A.evalWeek}${A.weeksLeft != null ? ` (${A.weeksLeft} wk)` : ''}`)}${row('Judged on', A.ind.map(i => i.t).join('; '))}${row('Objections', A.obj.length ? A.obj.join(' ') : 'None recorded')}${A.delegated ? row('Decided by', 'The staff, within your mandates') : ''}</dl>`;
}
function pathwayCard(V) {
  if (!V) return '<p class="small">This storyline has ended.</p>';
  const A = V.ag, stage = { signal: 'Signal', data: 'Gathering data', meet: 'Meeting', run: 'Agreement running', eval: 'Evaluation due', closed: 'Closed' }[V.stage];
  return `<div class="dosc"><div class="dosh"><span class="dface">${ART.staffFace('acad')}</span><div><small>Agreement · ${esc(stage)}</small><h2>The ${esc(V.tname)} question</h2></div></div>
    <p class="small">${esc(V.tname)}${V.tage ? ' (' + V.tage + ')' : ''}, ${esc((V.tpos || '').toLowerCase())}. The regular in his position: ${esc(V.bname)}.</p>
    ${A ? agreementHtml(A) + (A.share != null ? `<p class="small">So far: started ${A.started} of ${A.games} league games.</p>` : '') : '<p class="small">No agreement yet.</p>'}
    ${V.log.length ? `<div class="sec">What the staff did</div><ol class="doslog">${V.log.map(l => `<li><span>Week ${l.w}: ${esc(l.t)}</span></li>`).join('')}</ol>` : ''}
    ${V.stage === 'run' && A ? `<div class="sec">Change course</div><p class="small">Explain a change before the evaluation and it is not a broken promise. One action.</p><div class="pwch">${V.routes.filter(r => r.k !== A.route).map(r => `<button class="btn ghost" data-a="pw-change" data-k="${r.k}" ${G().ap < 1 ? 'disabled' : ''}>${esc(r.t)}</button>`).join('')}</div>` : ''}</div>`;
}
function credHtml() {
  if (!F.credView) return ''; const C = F.credView(); if (!C.log.length) return '';
  return `<div class="sec">Academy credibility <span class="small">${Math.round(C.youth)}</span></div><div class="panel2"><p class="small" style="margin:0 0 6px">Judged on what the club does, not what it says.</p>${C.log.slice(0, 6).map(l => `<div class="crl"><b class="${l.d > 0 ? 'good' : l.d < 0 ? 'bad' : ''}">${l.d > 0 ? '+' : ''}${l.d || '±0'}</b><span>${esc(l.t)}<small> Season ${l.s}, week ${l.w}</small></span></div>`).join('')}</div>`;
}
function caseHtml(c) {
  if (!c) return ''; return `<dl class="xcase"><div><dt>Limit</dt><dd>${esc(c.limit)}</dd></div><div><dt>Why</dt><dd>${esc(c.why)}</dd></div><div><dt>Alternatives</dt><dd>${esc(c.alt)}</dd></div><div><dt>Likely effect</dt><dd>${esc(c.effect)}</dd></div></dl>`;
}
function fdHtml(fd) {
  if (!fd || !F.BACKERS) return ''; const T = { board: 'Board', fans: 'Supporters', press: 'Press', room: 'Dressing room' };
  return `<div class="fdrow" aria-label="How your backers reacted">${Object.entries(fd).map(([k, d]) => `<span class="${d > 0 ? 'up' : 'dn'}">${T[k]} ${d > 0 ? '+' : ''}${d}</span>`).join('')}</div>`;
}
function vTiles() {
  const g = G(), c = g.club, A = F.analysis(), st = A.pos <= A.target ? 'good' : A.pos <= A.target + 2 ? 'warn' : 'bad', nf = nextFix();
  const T = (l, v, cls, act, extra) => `<button class="mt" ${act}><span>${l}</span><b class="${cls || ''}">${v}</b>${extra || ''}</button>`;
  return `<div class="tiles2">${T('Position', F.ord(A.pos), st, 'data-a="sheet" data-s="analysis"', `<small>target ${F.ord(A.target)}</small>`)}${(() => { const run = F.finRunway ? F.finRunway() : null; return T('Cash', money(c.cash), c.cash < 0 || (run != null && run <= 8) ? 'bad' : '', 'data-a="tab" data-t="staff"', run != null && run <= 12 ? `<small class="bad">${run} wk left</small>` : c.debt > 0 ? `<small>debt ${money(c.debt)}</small>` : dl(c.cash, 'cash', money)); })()}${nf ? T('Next', esc(nf.short), '', 'data-a="tab" data-t="league"', `<small>${nf.home ? 'home' : 'away'}, ${F.ord(nf.pos)}</small>`) : ''}</div>`;
}
const FOLDERS = [['all', 'Inbox', 'inbox'], ['need', 'Needs you', 'bulb'], ['match', 'Matches', 'play'], ['staff', 'Staff', 'staff'], ['reports', 'Reports', 'info'], ['press', 'Press', 'press'], ['players', 'Players', 'squad'], ['dos', 'Dossiers', 'info'], ['done', 'Decided', 'trust']];
const FOLD_T = Object.fromEntries(FOLDERS.map(f => [f[0], f[1]]));
function isDis(k) { const g = G(); return !!(g.dis && g.dis[k]); }
function rowThumb(i) {
  if (i.t === 'paper') return `<span class="av paper">${ART.I.press}</span>`;
  if (i.t === 'digest') return `<span class="av rep">${ART.I.info}</span>`;
  return `<span class="av ${i.kind}">${i.pl ? ART.playerFace(i.pl, 'happy') : ART.staffFace(i.role)}</span>`;
}
function rowHtml(i) { const unread = i.kind !== 'done' && !isRead(i.key), dis = i.kind === 'info'; return `<li class="ir ${i.kind} ${unread ? 'unread' : ''} ${dis ? 'dis' : ''}" data-a="open" data-k="${i.key}" role="button" tabindex="0">${rowThumb(i)}<span class="ib"><span class="it"><b>${esc(i.from)}</b><em class="lab ${i.kind}">${esc(i.label)}</em></span><span class="is">${esc(i.subj)}</span><span class="ip">${esc(i.prev)}</span></span>${unread ? '<i class="dot" aria-label="unread"></i>' : ''}</li>`; }
const isBox = i => i.kind === 'need' || (i.kind === 'upd' && i.bt !== 'coach_debrief');
function boxRow(i) {
  const rt = ROLE_T[i.role] && ROLE_T[i.role] !== i.from ? ROLE_T[i.role] : '';
  const tag = i.kind === 'upd' ? 'Free' : i.label === 'Needs you' ? 'Your call' : i.label;
  return `<button class="rbr" data-a="open" data-k="${i.key}"><span class="rbf">${i.role === 'player' ? '' : ART.staffFace(i.role || 'club')}</span><span class="rbm"><span class="rbt"><b>${esc(i.from)}</b>${rt ? `<small>${esc(rt)}</small>` : ''}<em class="${i.kind === 'upd' ? 'free' : ''}">${esc(tag)}</em></span><b class="rbs">${esc(i.subj)}</b><span class="rbp">${esc(i.prev || '')}</span></span></button>`;
}
function deskRow(i) { return `<button class="dkr" data-a="open" data-k="${i.key}"><span class="dkl">${esc(i.label)}</span><span class="dkm"><b>${esc(i.subj)}</b><small>${esc(i.from)}${i.prev ? ': ' + esc(clip2(i.prev)[0]) : ''}</small></span>${ART.I.chev}</button>`; }
function vInbox() {
  if (U.open) return vOpen();
  const g = G(), items = inboxItems(), f = FOLD_T[U.filt] ? U.filt : 'all';
  const pap = items.find(x => x.t === 'paper');
  const folders = `<div class="folders" role="tablist">${FOLDERS.map(([k, l, ic]) => { const n = k === 'need' ? items.filter(isBox).length : 0; return `<button role="tab" class="${f === k ? 'on' : ''}" data-a="filt" data-v="${k}"><span>${ART.I[ic]}</span>${k === 'need' ? 'Red box' : l}${n ? `<b>${n}</b>` : ''}</button>`; }).join('')}</div>`;
  if (f !== 'all') {
    const shown = f === 'need' ? items.filter(isBox) : items.filter(i => i.fold === f);
    return `${backersHtml()}${folders}<ul class="inbox">${shown.map(rowHtml).join('') || `<li class="empty">${f === 'need' ? '<b>The red box is empty.</b> Nothing needs your signature this week.' : f === 'dos' ? '<b>No open dossiers.</b> Storylines in three parts land here when they start.' : 'Nothing in this folder this week.'}</li>`}</ul>${f === 'dos' ? archiveHtml() : ''}`;
  }
  const A = F.analysis(), nf = nextFix(), box = items.filter(isBox), desk = items.filter(i => !isBox(i) && i.kind !== 'done' && i.t !== 'paper' && !isDis(i.key));
  const done = items.filter(i => i.kind === 'done'), st = A.pos <= A.target ? 'good' : A.pos <= A.target + 2 ? 'warn' : 'bad';
  const strip = `<div class="rstrip"><button class="rsp" data-a="sheet" data-s="analysis"><b class="${A.g ? st : ''}">${A.g ? F.ord(A.pos) : '–'}</b><small>target ${F.ord(A.target)}</small></button><button class="rsp" data-a="tab" data-t="staff"><b>${money(g.club.cash)}</b><small>in the bank</small></button>${nf ? `<button class="rsp" data-a="tab" data-t="league"><b>${esc(nf.short)}</b><small>${nf.home ? 'home' : 'away'}, ${F.ord(nf.pos)}</small></button>` : ''}</div>`;
  return `${tourCard('inbox')}${strip}${backersHtml()}
  <section class="redbox" aria-label="The red box"><div class="rbh"><h2>The red box</h2><span>${box.length ? `${box.length} to answer this week` : 'All signed'}</span></div>
  <div class="rbl">${box.map(boxRow).join('') || `<p class="rbe"><b>Nothing needs your signature.</b> ${F.deskView && F.deskView().n ? `Your staff took ${F.deskView().n} decision${F.deskView().n === 1 ? '' : 's'} themselves.` : 'Your staff work within their mandates.'}</p>`}</div></section>
  ${desk.length ? `<div class="dkh"><h3>On your desk</h3><small>${desk.length} running</small></div><div class="dkl2">${desk.map(deskRow).join('')}</div>` : ''}
  ${pap && !isDis(pap.key) ? `<button class="paperpin" data-a="open" data-k="${pap.key}"><span class="ppm">THE ${esc(g.club.city.toUpperCase())} GAZETTE</span><b>${esc((F.edView(0) || {}).head || g.paper.headline)}</b><small>${isRead(pap.key) ? 'Read' : 'Today\'s edition'} ${ART.I.chev}</small></button>` : ''}
  ${done.length ? `<button class="dkdone" data-a="filt" data-v="done">${done.length} handled this week ${ART.I.chev}</button>` : ''}${comingHtml()}${folders}`;
}

/* ---------- players: cards, profiles, stories ---------- */
const STR_P = { fin: 'Clinical finisher', pas: 'Precise passer', dri: 'Beats his man', cro: 'Dangerous crosses', tac: 'Wins the ball', mar: 'Tight marker', hea: 'Strong in the air', pac: 'Rapid', sta: 'Tireless', str: 'Physically strong', vis: 'Sees the pass', com: 'Calm under pressure', han: 'Safe hands', ref: 'Sharp reflexes' };
const STR_N = { fin: 'Wasteful in front of goal', pas: 'Loose passing', dri: 'Poor on the ball', cro: 'Weak crossing', tac: 'Soft in the tackle', mar: 'Loses his man', hea: 'Weak in the air', pac: 'Lacks pace', sta: 'Tires late on', str: 'Lightweight', vis: 'Limited vision', com: 'Nervous', han: 'Spills shots', ref: 'Slow to react' };
function strengths(p, k) {
  const w = F.POSW[p.pos], keys = Object.keys(w), val = a => k && k.attr ? (k.attr[a][0] + k.attr[a][1]) / 2 : p.a[a];
  const base = F.tierAvg(G().club.tier);
  const sorted = keys.slice().sort((a, b) => val(b) * (1 + w[b] / 10) - val(a) * (1 + w[a] / 10)), lo = keys.slice().sort((a, b) => val(a) - val(b))[0];
  const out = sorted.slice(0, 2).filter(a => val(a) >= base + 1.2).map(a => `<span>${STR_P[a]}</span>`);
  if (val(lo) <= base - 1.2) out.push(`<span class="neg">${STR_N[lo]}</span>`);
  return out.join('');
}
function roleOf(p) { const g = G(); if (!g.squad.includes(p)) return ''; const L = F.pickXI(false); if (L.xi.some(x => x.p === p)) return 'First choice'; if (L.bench.includes(p)) return 'Bench'; return p.age <= 21 ? 'Prospect' : 'Squad player'; }
function starsTxt(v) { return `<span class="stx">${v}★</span>`; }
function pcard(p, o) {
  o = o || {}; const k = o.k, face = p.pool ? ART.poolFace(p) : ART.playerFace(p), meta = o.meta || `${p.age}, ${F.POS_L[p.pos]}${p.pool ? (p.club ? ', ' + F.cname(p.club) : ', free agent') : ''}`;
  const lvl = k ? F.recBand(k) : starsTxt(F.stars(p.ca));
  return `<button class="pcd ${o.cls || ''}" data-a="${p.pool ? 'target' : 'player'}" data-id="${p.id}" aria-label="Open profile of ${esc(p.name)}"><span class="pf">${face}</span><span class="pm"><b>${esc(p.name)}</b><small>${esc(meta)}</small>${o.noStr ? '' : `<span class="strengths">${strengths(p, k)}</span>`}</span><span class="pr">${lvl}${k ? `<i class="gr g${k.grade}">${k.grade}</i>` : ''}</span></button>`;
}
function hashN(n) { let x = (n * 2654435761) >>> 0; x = (x ^ (x >>> 13)) >>> 0; return x; }
const ORIGIN = { dom: ['Grew up two streets from a lower-league ground.', 'Came through a local Sunday league side.', 'Was a ball boy at his hometown club.'], low: ['Learned the game on the street pitches of a port city.', 'Released at 18, rebuilt his career in the second tier.'], sca: ['Played futsal through the winters.', 'Combined football with a forestry course.'], ibe: ['Raised on endless rondos at a famous street academy.', 'Left home at 15 for a club academy.'], sam: ['Grew up playing barefoot on a dirt pitch.', 'Sold fruit at the market before training.'], waf: ['Found by a local coach at a school tournament.', 'Moved countries alone at 17.'], eeu: ['Learned his trade in a strict state academy.', 'Worked nights in a factory to pay for boots.'] };
const DRIVE = ['Wants to play at a higher level within two years.', 'Plays for his family back home.', 'Says he still has a point to prove to the club that released him.', 'Loves the club and its supporters.', 'A quiet professional, first in at training.', 'Thrives on big occasions.'];
function storyOf(p) {
  const r = hashN(p.id), o = ORIGIN[p.region] || ORIGIN.dom, lines = [o[r % o.length], DRIVE[(r >> 3) % DRIVE.length]];
  const R = G().rec, l = R && R.log.find(x => x.pid === p.id || (x.name === p.name && x.pos === p.pos));
  if (l) { const sc = (F.recScouts ? F.recScouts() : []).find(s => s.id === l.by); lines.push(`Signed in season ${l.s} for ${l.fee ? money(l.fee) : 'nothing'}${sc ? `, found by ${sc.name}` : ''}.`); }
  if (p.academy) lines.push('An academy graduate: one of our own.');
  return lines.concat((p.ms || []).slice(-6).map(m => `S${m.s} W${m.w}: ${m.t}`));
}
function attrGroups(p, k) {
  const v = a => k && k.attr ? k.attr[a] : null, val = a => k && k.attr ? Math.round((k.attr[a][0] + k.attr[a][1]) / 2) : Math.round(p.a[a]);
  const G3 = p.pos === 'GK' ? [['Keeping', ['han', 'ref', 'com']], ['Physical', ['pac', 'str', 'sta']], ['Ball', ['pas', 'hea', 'vis']]] : [['Attack', ['fin', 'dri', 'cro', 'vis']], ['Defence', ['tac', 'mar', 'hea']], ['Physical', ['pac', 'sta', 'str', 'pas', 'com']]];
  const key = Object.keys(F.POSW[p.pos]);
  return `<div class="groups">${G3.map(([t, as]) => `<div class="grp"><h5>${t}</h5>${as.filter(a => !k || (k.attr && k.attr[a])).map(a => `<div class="att"><span>${F.ATTR_L[a].slice(0, 4)}</span><i><b class="${val(a) >= F.tierAvg(G().club.tier) + 2 ? 'hi' : val(a) <= F.tierAvg(G().club.tier) - 1.5 ? 'lo' : ''}" style="width:${Math.min(100, val(a) / (F.tierAvg(G().club.tier) + 6) * 100)}%"></b></i><em>${v(a) ? (v(a)[0] === v(a)[1] ? v(a)[0] : v(a)[0] + '–' + v(a)[1]) : val(a)}</em></div>`).join('') || '<p class="small">Not scouted</p>'}</div>`).join('')}</div>`;
}
function formBars(p) { const rs = p.rats || []; if (!rs.length) return '<p class="small">No games yet.</p>'; return `<div class="form">${rs.map(r => `<i class="${r >= 7 ? '' : r >= 6.4 ? 'mid' : 'low'}" style="height:${Math.max(15, (r - 5) / 4 * 100)}%" title="${r.toFixed(1)}"></i>`).join('')}</div>`; }
function profileHtml(p, k, x) {
  const g = G(), pool = !!p.pool, st = p.st || {}, rat = st.apps ? (st.rat / st.apps).toFixed(2) : '–', tab = U.ptab || 'over', role = pool ? (x ? STG_L[x.stage] : 'Target') : roleOf(p) || (g.academy.includes(p) ? 'Academy' : '');
  const now = k ? F.recBand(k) : starsTxt(g.academy.includes(p) ? F.absStars(p.ca) : F.stars(p.ca)), pot = k ? F.recPot(k) : starsTxt(g.academy.includes(p) && p.band ? p.band[1] : F.stars(p.pa));
  const head = `<div class="ph"><div class="portrait">${pool ? ART.poolFace(p) : ART.playerFace(p)}</div><div><b>${esc(p.name)}</b><div class="pmeta">${p.age}, ${F.POS_L[p.pos].toLowerCase()}, ${F.REGIONS[p.region].name}<br>${pool ? (p.club ? esc(F.cname(p.club)) + ', asking ' + money(p.ask) : 'Free agent') : money(p.wage) + '/wk, ' + p.contract + 'y left'}</div>${role ? `<span class="rolebadge">${esc(role)}</span>` : ''}</div></div>
  <div class="lvls"><span>Now ${now}</span><span>Potential ${pot}</span>${k ? `<i class="gr g${k.grade}">${k.grade}</i>` : ''}</div><div class="strengths">${strengths(p, k)}</div>
  <div class="tabs3">${[['over', 'Overview'], ['stats', 'Stats'], ['story', 'Story']].map(([t, l]) => `<button class="${tab === t ? 'on' : ''}" data-a="ptab" data-v="${t}">${l}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'over') {
    body = attrGroups(p, k);
    if (k) { const sc = (F.recScouts ? F.recScouts() : []).find(s => s.id === k.byId) || null; body += `<div class="scoutrep"><div class="mini">${sc ? ART.face(sc.id * 31 + 3, { role: 'scout', age: sc.age, bg: '#efe7d2' }) : ART.staffFace('scout')}</div><div><p>"${esc(scoutLine(p, k))}"</p><small>${esc(k.by)}, ${k.n} report${k.n === 1 ? '' : 's'}, ${k.conf} confidence</small></div></div>`; }
    else body += `<div class="statrow"><div><small>Apps</small><b>${st.apps || 0}</b></div><div><small>${p.pos === 'GK' ? 'Rating' : 'Goals'}</small><b>${p.pos === 'GK' ? rat : st.g || 0}</b></div><div><small>Morale</small><b>${r0(p.morale || 0)}</b></div><div><small>Value</small><b>${money(p.value)}</b></div></div><div class="sec">Form</div>${formBars(p)}`;
  } else if (tab === 'stats') {
    body = pool ? `<p class="small">No reliable stats for players at other clubs. The scouts' view is on the overview.</p>` : `<div class="statrow"><div><small>Apps</small><b>${st.apps}</b></div><div><small>Minutes</small><b>${st.mins}</b></div><div><small>Goals</small><b>${st.g}</b></div><div><small>Assists</small><b>${st.a}</b></div><div><small>xG</small><b>${st.xg.toFixed(1)}</b></div><div><small>xA</small><b>${st.xa.toFixed(1)}</b></div><div><small>Rating</small><b>${rat}</b></div><div><small>Duels</small><b>${st.dt ? Math.round(st.dw / st.dt * 100) + '%' : '–'}</b></div></div><div class="sec">Form, last games</div>${formBars(p)}<p class="small" style="margin-top:8px">Career: ${p.car.apps} games, ${p.car.g} goals.</p>`;
  } else {
    body = `<div class="story"><ul>${storyOf(p).map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>`;
  }
  return head + body;
}
function scoutLine(p, k) {
  const s = strengths(p, k).replace(/<[^>]+>/g, '|').split('|').filter(Boolean);
  const good = s.filter((_, i) => i < 2), bad = s[2];
  return `${good.length ? good.join(', ') + '.' : 'Nothing special yet.'} ${bad ? bad + '.' : ''} ${k.grade === 'A' ? 'Would improve us now.' : k.grade === 'B' ? 'A good addition.' : 'Squad level at best.'}`.trim();
}

/* ---------- game UI helpers ---------- */
const ROLE_T = { dof: 'Director of Football', coach: 'Head coach', scout: 'Chief Scout', acad: 'Academy director', com: 'Commercial', mkt: 'Marketing', fin: 'Finance', board: 'The board', press: 'The press', fans: 'Supporters', club: 'Club office' };
function sentEnds(t) { const out = [], re = /[.!?]+["')]?(?=\s|$)/g; let m; while ((m = re.exec(t))) { const i = m.index; if (t[i] === '.' && /\d/.test(t[i - 1] || '') && /\d/.test(t[i + 1] || '')) continue; out.push(i + m[0].length); } return out; }
function clip2(t) { t = String(t || ''); const e = sentEnds(t); if (e.length <= 2) return [t.trim(), '']; return [t.slice(0, e[1]).trim(), t.slice(e[1]).trim()]; }
function splitSay(body) {
  const b = String(body || '').trim(), m = b.match(/^(?:[A-Z][\w .'-]{1,30}:\s*)?"([^"]{4,220})"\s*(.*)$/s);
  if (m) { const [x, y] = clip2(m[1]); return { say: '"' + x + '"', rest: (y ? y + ' ' : '') + m[2] }; }
  if (b.length > 190) { const e = sentEnds(b).find(x => x >= 20 && x <= 175); if (e) return { say: b.slice(0, e).trim(), rest: b.slice(e).trim() }; }
  return { say: b, rest: '' };
}
function trayHtml(q, choices, foot) {
  return `<div class="tray" role="region" aria-label="Your decision"><div class="in">${q ? `<div class="q">${q}</div>` : ''}${choices}${foot ? `<div class="foot">${foot}</div>` : ''}</div></div>`;
}
function choiceHtml(o, j, attrs, pick, dis) {
  return `<button class="cho ${pick ? 'pick' : ''}" ${attrs} ${dis ? 'disabled' : ''}>${pick ? '<span class="pk">Staff pick</span>' : ''}<b>${esc(o.l)}</b><span class="fx">${ART.fx(o.h)}</span></button>`;
}
const TICS = {
  ego: ['Trust me on this one.', 'I have seen this a hundred times.', 'You hired me for a reason.'],
  humble: ['Happy to be told otherwise.', 'Your call, of course.', 'I could be wrong here.'],
  risk: ['Fortune favours the brave.', 'Let us not play it safe.', 'No risk, no story.'],
  careful: ['Let us not rush this.', 'Slowly does it.', 'I would rather be sure.'],
  loyal: ['For the club, always.', 'I am in this for the long run.', 'The badge comes first.'],
  merc: ['Business is business.', 'Make sure it is worth my while.', 'Nothing personal.'],
  amb: ['We can aim higher than this.', 'This league is a stepping stone.', 'Think bigger.']
};
function ticOf(role, say) {
  const s = F.staff && F.staff(role); if (!s || !s.p || !say) return '';
  const P = s.p, keys = [P.ego > 14 && 'ego', P.ego < 7 && 'humble', P.risk > 14 && 'risk', P.risk < 7 && 'careful', P.loy > 14 && 'loyal', P.loy < 7 && 'merc', P.amb > 14 && 'amb'].filter(Boolean);
  if (!keys.length) return ''; let h = 7; for (const c of s.name + say) h = (h * 31 + c.charCodeAt(0)) >>> 0; if (h % 3) return '';
  const k = keys[h % keys.length], arr = TICS[k]; return arr[(h >>> 3) % arr.length];
}
function sceneHtml(role, from, kind, label, say, emo) {
  const tic = ticOf(role, say);
  return `<div class="stage"><div class="portrait">${ART.staffFace(role, emo)}</div><div class="who"><b>${esc(from)}</b>${ROLE_T[role] && ROLE_T[role] !== from ? `<span>${esc(ROLE_T[role])}</span>` : ''}<br><em class="lab ${kind}">${esc(label)}</em></div></div>${say ? `<div class="bubble">${esc(say)}${tic ? `<span class="tic">${esc(tic)}</span>` : ''}</div>` : ''}`;
}
function vOpen() {
  const g = G(), items = inboxItems(), idx = items.findIndex(i => i.key === U.open);
  if (idx < 0) { U.open = null; return vInbox(); }
  const i = items[idx]; markRead(i.key);
  const f = FOLD_T[U.filt] ? U.filt : 'all', pool = items.filter(x => f === 'all' ? !isDis(x.key) || x.key === i.key : x.fold === f), pi = pool.findIndex(x => x.key === i.key), nx = pool[pi + 1];
  U.tray = '';
  let body = '';
  if (i.t === 'paper') body = gazette();
  else if (i.t === 'digest') body = weekReport();
  else if (i.t === 'prop') body = propHtml(i.ref, i);
  else if (i.t === 'msg') body = msgHtml(i.ref, i);
  else if (i.t === 'brief') body = i.bt === 'coach_debrief' ? matchCard(i.ref) : briefHtml(i.ref, i);
  else if (i.t === 'match') body = matchCard(null);
  else if (i.t === 'preview') body = previewCard();
  else if (i.t === 'dossier') body = dossierCard(i.ref);
  else if (i.t === 'pathway') body = pathwayCard(F.pwView());
  else if (i.t === 'ms') body = msStrip(i);
  const head = `<div class="ohead"><button class="iconbtn" data-a="close-open" aria-label="Back to ${esc(FOLD_T[f])}">${ART.I.back}</button><span class="pos">${esc(FOLD_T[f])}</span>${i.kind === 'info' ? `<button class="archbtn" data-a="dismiss" data-k="${i.key}">Archive</button>` : ''}<button class="iconbtn" data-a="open" data-k="${nx ? nx.key : ''}" ${nx ? '' : 'disabled'} aria-label="Next">${ART.I.chev}</button></div>`;
  return `${head}${i.t === 'msg' || (i.t === 'brief' && i.bt !== 'coach_debrief') ? bkStrip() : ''}<article class="om">${body}</article>${U.tray ? '<div class="trayspace" style="--tray:' + U.trayH + 'px"></div>' : ''}`;
}
const BICON = { crowd_low: 'stadium', u18_report: 'academy', acad_flying: 'academy', youth_cup: 'league', stake_match: 'league', fin_runway: 'money', project_check: 'bulb', form_player: 'star', scouts_watching: 'scout' };
function cardOpts(b, v) {
  if (v.done) return `<div class="bstamp"><span>${ART.I.trust}</span><b>${v.del ? esc(v.by.split(' ')[0]) + ' decided: ' : ''}${esc(v.opts[v.choice].l)}</b><small>${esc(v.out || '')}</small></div>`;
  const why = v.why ? `<div class="whyr"><span>${ART.I.bulb}</span><p><b>Why it is yours</b>${esc(v.why)}</p></div>` : '';
  return why + `<div class="bopts">${v.opts.map((o, j) => `<button class="bopt" data-a="brief" data-b="${b.id}" data-i="${j}"><b>${esc(o.l)}</b>${o.h ? `<span class="fx">${ART.fx(o.h)}</span>` : ''}</button>`).join('')}</div><p class="small" style="margin:6px 0 0;text-align:center">Free. Leave it and nothing changes.</p>`;
}
function oppShort(name) { const g = G(), n = (name || 'OPP').toUpperCase().replace(/[^A-Z ]/g, ''); let t = n.replace(/ /g, '').slice(0, 3); if (t === g.club.short) { const w = n.split(' '); t = w.length > 1 ? (w[0].slice(0, 2) + w[1][0]) : (n[0] + n.slice(1).replace(/[AEIOU]/g, '').slice(0, 2)); } if (t === g.club.short) t = n[0] + n.slice(-2); return t; }
function fstrip(arr) { return `<span class="fstrip">${(arr || []).map(r => `<i class="f${r}">${r}</i>`).join('') || '<small>no games yet</small>'}</span>`; }
function previewCard() {
  const g = G(), P = F.mtPreview(); if (!P) return '<p class="small">No match this week.</p>';
  const PALS = ['#1d4ed8', '#b91c1c', '#15803d', '#111', '#f59e0b', '#7c3aed', '#0e7490', '#be185d'], oc = [PALS[(P.id * 7 + 3) % PALS.length], '#fff'];
  const crowdN = P.home && F.comView ? Object.values(F.comView().D).reduce((a, x) => a + x.att, 0) : null;
  const s = F.staff('coach'), line = !s ? '' : P.odds === 'Underdogs' ? (s.p.ego > 14 ? 'Everyone writes us off. Good.' : 'We are not favourites. We will make it hard for them.') : P.odds === 'Favourites' ? 'We should win this. No complacency.' : 'Fine margins. Whoever wants it more.';
  const us = [g.club.colors, g.club.short], them = [oc, oppShort(P.name)], L = P.home ? us : them, R = P.home ? them : us;
  return `<section class="mcard pv"><div class="mchead"><span>${P.rival ? 'DERBY DAY' : F.TIERS[g.club.tier]}</span><em class="res ${P.odds === 'Favourites' ? 'W' : P.odds === 'Underdogs' ? 'L' : 'D'}">${P.odds}</em></div>
    <div class="mcscore"><div class="mct">${crest(L[0], L[1], 44)}<b>${esc(L[1])}</b></div><div class="mcs vs">${P.home ? 'HOME' : 'AWAY'}</div><div class="mct">${crest(R[0], R[1], 44)}<b>${esc(R[1])}</b></div></div>
    <div class="pvrow"><span>Table</span><b>${F.ord(P.mine)} vs ${F.ord(P.pos)}</b></div><div class="pvrow"><span>${esc(P.name)} form</span>${fstrip(P.fm)}</div><div class="pvrow"><span>Our form</span>${fstrip(g.form.slice(-5))}</div>
    <div class="pvrow"><span>Their style</span><b>${esc(P.sty.t)}<small> ${esc(P.sty.d.toLowerCase())}</small></b></div><div class="pvrow"><span>Watch</span><b>${esc(P.star.name)}<small> ${P.star.pos}</small></b></div>${crowdN ? `<div class="pvrow"><span>Expected crowd</span><b>${crowdN.toLocaleString('en-GB')}</b></div>` : ''}</section>
  ${s ? `<div class="stage" style="margin-top:14px"><div class="portrait" style="width:56px;height:56px">${ART.staffFace('coach')}</div><div class="who"><b>${esc(s.name)}</b><span>Head coach</span></div></div><div class="bubble">${esc(line)}</div>` : ''}`;
}
function whyPanel(lm) {
  if (!lm || lm.dpre == null) return '';
  const R = [];
  if (lm.reds && lm.reds[0]) R.push(['bad', 'Down to ten men', 'The red card changed the game.']);
  if (lm.reds && lm.reds[1]) R.push(['good', 'They lost a man', 'We had the extra player.']);
  if (lm.dpre > 0.5) R.push(['good', 'Stronger squad', 'On paper we were the better side.']); else if (lm.dpre < -0.5) R.push(['bad', 'Weaker squad', 'They had the better players.']); else R.push(['mid', 'Evenly matched', 'Little between the sides on paper.']);
  const lu = lm.ug - lm.uxg, lt = lm.tg - lm.txg;
  if (lu > 0.8) R.push(['good', 'Clinical', `${lm.ug} goals from ${lm.uxg.toFixed(1)} xG.`]); else if (lu < -0.8) R.push(['bad', 'Wasteful', `${lm.ug} from ${lm.uxg.toFixed(1)} xG.`]);
  if (lt > 0.8) R.push(['bad', 'They took their chances', `${lm.tg} from ${lm.txg.toFixed(1)} xG.`]); else if (lt < -0.8) R.push(['good', 'Lucky escape', `They had ${lm.txg.toFixed(1)} xG and scored ${lm.tg}.`]);
  if (lm.home && lm.edge > 0.45) R.push(['good', 'The crowd', 'A full, loud ground pushed us on.']); else if (lm.home && lm.edge < 0.25) R.push(['bad', 'A quiet ground', 'Empty seats, little help from the stands.']);
  return `<div class="sec">Why it went this way</div><div class="why">${R.slice(0, 3).map(([c, t, d]) => `<div class="wy ${c}"><b>${esc(t)}</b><small>${esc(d)}</small></div>`).join('')}</div>`;
}
function matchCard(b) {
  const g = G(), lm = g.lastMatch; if (!lm) return '<p class="small">No match yet.</p>';
  const v = b ? F.briefView(b) : null, sp = v ? splitSay(v.text) : null;
  const us = { n: g.club.short, c: g.club.colors, g: lm.ug, x: lm.uxg }, th = { n: oppShort(lm.oppName), c: ['#475569', '#f1f5f9'], g: lm.tg, x: lm.txg };
  const L = lm.home ? us : th, R = lm.home ? th : us, res = lm.ug > lm.tg ? 'W' : lm.ug < lm.tg ? 'L' : 'D';
  const mx = Math.max(1.5, lm.uxg, lm.txg), mp = lm.motm ? g.squad.find(p => p.name === lm.motm) : null;
  const inj = (lm.injured || []).map(x => typeof x === 'object' ? x : g.squad.find(p => p.id === x || p.name === x)).filter(Boolean);
  return `<section class="mcard ${res}"><div class="mchead"><span>${lm.comp === 'Cup' ? 'National Cup' + (lm.rd ? ', ' + esc(lm.rd) : '') : F.TIERS[g.club.tier]}</span><em class="res ${res}">${res === 'W' ? 'Win' : res === 'L' ? 'Defeat' : 'Draw'}</em></div>
    <div class="mcscore"><div class="mct">${crest(L.c, L.n, 44)}<b>${esc(L.n)}</b></div><div class="mcs">${L.g}<i>–</i>${R.g}</div><div class="mct">${crest(R.c, R.n, 44)}<b>${esc(R.n)}</b></div></div>
    <div class="mcxg"><span>${L.x.toFixed(1)}</span><i><b class="l" style="width:${L.x / mx * 50}%"></b><b class="r" style="width:${R.x / mx * 50}%"></b></i><span>${R.x.toFixed(1)}</span></div><div class="small" style="text-align:center">Expected goals</div>
    ${mp || inj.length ? `<div class="mcfoot">${mp ? `<button class="motm" data-a="player" data-id="${mp.id}"><span>${ART.playerFace(mp, 'happy')}</span><small>Best player</small><b>${esc(mp.name.split(' ').slice(-1)[0])}</b></button>` : ''}${inj.length ? `<div class="minj"><small>Injured</small>${inj.map(p => `<button class="pchip" data-a="player" data-id="${p.id}"><span>${ART.playerFace(p, 'worried')}</span>${esc(p.name.split(' ').slice(-1)[0])}</button>`).join('')}</div>` : ''}</div>` : ''}
    ${lm.ev ? '<button class="linkbtn" data-a="replay" style="margin:6px auto 0;display:flex">Replay the match</button>' : ''}</section>${whyPanel(lm)}
  ${v ? `<div class="stage" style="margin-top:14px"><div class="portrait" style="width:56px;height:56px">${ART.staffFace('coach', res === 'W' ? 'happy' : res === 'L' ? 'worried' : null)}</div><div class="who"><b>${esc(v.who.split(',')[0])}</b><span>Head coach</span></div></div><div class="bubble">${esc(sp.say)}</div>${sp.rest ? `<details class="more"><summary>Details ${ART.I.chev}</summary><p>${esc(sp.rest)}</p></details>` : ''}${cardOpts(b, v)}` : ''}`;
}
function briefCard(b, it) {
  const v = F.briefView(b), role = v.role || (it && it.role) || 'club', [t1, t2] = clip2(v.text), ic = BICON[b.t] || 'info';
  const num = (v.title.match(/£?[\d,.]+[k%]?/) || [])[0];
  return `<section class="bcard"><div class="bchead"><span class="bcic">${ART.I[ic]}</span><span class="bcf">${ART.staffFace(role)}</span><span class="bcw"><b>${esc(v.who.split(',')[0])}</b><small>${esc(ROLE_T[role] || '')}</small></span></div>
    ${num ? `<div class="bcnum">${esc(num)}</div>` : ''}<h2 class="otitle" style="margin:4px 0 6px">${esc(v.title)}</h2><p class="obody">${esc(t1)}</p>${t2 ? `<details class="more"><summary>Details ${ART.I.chev}</summary><p>${esc(t2)}</p></details>` : ''}</section>${cardOpts(b, v)}`;
}
function weekReport() {
  const g = G(), A = F.analysis(), O = F.deptOverview(), au = g.paper.stories.filter(s => s.auto);
  const rep = role => ((g.reports || []).find(r => r.role === role) || {}).t || '';
  const tiles = O.map(o => { const v = F.deptView(o.k), k = v.kpi, cur = k[k.length - 1], prv = k[k.length - 2], up = prv != null && cur !== prv ? (o.k === 'first' ? cur < prv : cur > prv) : null;
    return `<button class="wtile ${o.status.st}" data-a="dept-go" data-k="${o.k}"><span class="wtf">${o.s ? ART.staffFace(o.head) : ART.I.staff}</span><small>${esc(o.t)}</small><b>${cur != null ? kfmt(o.k, cur) : '–'}${up != null ? `<i class="${up ? 'up' : 'dn'}">${up ? '▲' : '▼'}</i>` : ''}</b><span>${esc(clip2(rep(o.head) || v.kpiL[0])[0].split('. ')[0])}</span></button>`; }).join('');
  const wd = g.wkDelta || {}, BG = F.goalView ? F.goalView() : null, last = (g.bgLog || []).slice(-1)[0];
  const thisWk = F.backers ? `<div class="sec">This week</div><div class="wkd">${F.backers().map(b => `<span class="${(wd[b.k] || 0) > 0 ? 'up' : (wd[b.k] || 0) < 0 ? 'dn' : ''}"><small>${esc(b.t)}</small><b>${b.v}</b><i>${wd[b.k] ? (wd[b.k] > 0 ? '+' : '') + wd[b.k] : '='}</i></span>`).join('')}</div>${BG && BG.done == null ? `<p class="small">${esc(BG.t)} goal: ${BG.got} of ${BG.need} points, ${BG.left} game${BG.left === 1 ? '' : 's'} left.</p>` : last && last.s === g.season && BG && BG.done != null ? `<p class="small ${last.ok ? 'good' : 'bad'}">${esc(last.t)} goal ${last.ok ? 'reached' : 'missed'}: ${last.got} of ${last.need} points.</p>` : ''}` : '';
  return `<h2 class="oh">Week ${g.week - 1 || 1} in the club</h2>${thisWk}${A.g ? `<div class="wpos ${A.pos <= A.target ? 'good' : 'bad'}"><b>${F.ord(A.pos)}</b><span>target ${F.ord(A.target)}</span>${A.behind && A.causes.length ? `<small>${esc(clip2(A.causes[0].t)[0])}</small>` : ''}</div>` : ''}
  <div class="wgrid">${tiles}</div>
  ${au.length ? `<div class="sec">Handled by your staff</div><div class="panel2">${au.map(st => `<div class="notice"><span class="nst">${ART.I.trust}</span><span><b>${esc(st.h.replace(' handled it', ''))}</b><small>${esc(clip2(st.t)[0])}</small></span></div>`).join('')}</div>` : ''}`;
}
function msStrip(i) {
  return `<h2 class="oh">Milestones this week</h2><div class="msrow">${i.mss.map(({ ms, p }) => { const ic = /debut/i.test(ms.t) ? 'star' : /hat/i.test(ms.t) ? 'league' : /goal/i.test(ms.t) ? 'play' : /injur/i.test(ms.t) ? 'risk' : /games|appear/i.test(ms.t) ? 'trust' : 'star'; return `<button class="mscard" data-a="player" data-id="${p.id}"><span class="msb">${ART.I[ic]}</span><span class="msf">${ART.playerFace(p, /injur/i.test(ms.t) ? 'worried' : 'happy')}</span><b>${esc(p.name.split(' ').slice(-1)[0])}</b><small>${esc(ms.t)}</small></button>`; }).join('')}</div><p class="small" style="text-align:center">Tap a player for his story.</p>`;
}
function gazette() { return gzEdition(F.edView(U.edI || 0), 'inbox', U.edI || 0); }
/* ---------- the red box: an email you answer on one screen ---------- */
const mFirst = n => /trust|board|press|office|the /i.test(n) ? n : n.split(' ')[0];
function mailParas(t) { let rest = String(t || '').trim(), out = []; while (rest && out.length < 6) { const [a, b] = clip2(rest); out.push(a); rest = b; } return out.map(p => `<p>${esc(p)}</p>`).join(''); }
function mailTop(role, name, roleT, title, tag, body, emo) {
  const g = G();
  return `<div class="mail"><div class="mtagr">${tag}</div><h2 class="msubj">${esc(title)}</h2>
  <div class="mfrom"><span class="mav">${ART.staffFace(role, emo)}</span><div class="mfm"><div class="mfr"><b>${esc(name)}</b><time>Week ${g.week}</time></div><div class="mto">To: You</div></div></div>
  <div class="mbody">${mailParas(body)}<p class="msign">${esc(mFirst(name))}</p><div class="msig"><span class="mcrest">${esc(g.club.short || 'FC')}</span><span><b>${esc(name)}</b><br>${esc(roleT ? roleT + ', ' : '')}${esc(g.club.name)}</span></div></div></div>`;
}
const MSV = d => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const MAILI = { reply: MSV('<path d="M10 8L4 13l6 5"/><path d="M4 13h10a6 6 0 0 1 6 6"/>'), send: MSV('<path d="M12 19V5M5 12l7-7 7 7"/>'), env: MSV('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 7l9 6 9-6"/>'), x: MSV('<path d="M6 6l12 12M18 6L6 18"/>') };
function mailRows(k, id, opts, auto, dis) {
  return `<div class="slist" role="group" aria-label="Suggested replies">${opts.map((o, j) => `<button class="srow ${j === auto ? 'isadv' : ''}" data-a="mcomp" data-k="${k}" data-id="${id}" data-i="${j}" ${dis ? 'disabled' : ''}><span class="sk">${esc(o.l)}${j === auto ? '<small>Advised</small>' : ''}</span><span class="sfx">${ART.fx(o.h)}</span></button>`).join('')}</div>`;
}
function mailDock(inner, cls) { return `<div class="mdock ${cls || ''}" role="region" aria-label="Your reply"><div class="in">${inner}</div></div>`; }
function mailBanner() {
  const b = U.bn; if (!b || b.n === U.bnShown) return ''; U.bnShown = b.n;
  return `<div class="mbn" role="status"><span class="mbav">${ART.staffFace(b.role, 'happy')}</span><div><div class="mbt"><b>${esc(b.name)}</b><span>now</span></div><small>Re: ${esc(b.subj)}</small><p>${esc(clip2(b.txt)[0])}</p></div></div>`;
}
function mailCompose(k, id, title, role, name, opts, auto, i, big, leave) {
  const n = opts.length, o = opts[i];
  return mailDock(`<div class="mch"><button class="mxb" data-a="mclose" aria-label="Discard reply">${MAILI.x}</button><span class="mcs">Re: ${esc(title)}</span></div>
  <div class="mcf"><span>To</span><span class="mpc"><span class="mpa">${ART.staffFace(role)}</span>${esc(name)}</span></div>
  <div class="mseg ${n > 3 ? 'g2' : ''}" role="group" aria-label="Suggested replies"><i class="mseg-i"></i>${opts.map((x, j) => `<button class="sg ${j === i ? 'on' : ''}" data-a="mpick" data-i="${j}" aria-pressed="${j === i}">${esc(x.l)}${j === auto ? '<em class="adot" aria-label="advised"></em>' : ''}</button>`).join('')}</div>
  <div class="mcb"><p class="mhi">Hi ${esc(mFirst(name))},</p><p class="mln">${o ? `<span class="typed" data-full="${esc(o.l)}." data-key="${k}${id}-${i}"></span>` : '<span class="mph">Pick a reply above and it writes itself.</span>'}<span class="caret"></span></p></div>
  ${o && o.h ? `<div class="mprev"><span class="sfx">${ART.fx(o.h)}</span></div>` : ''}
  <div class="mrow"><p class="mlv">${esc(leave)}</p><button class="msend ${o ? 'live' : ''} ${big ? 'hold' : ''}" ${big ? '' : 'data-a="msend"'} data-k="${k}" data-id="${id}" data-i="${i}" ${o ? '' : 'disabled'}>${MAILI.send}<span>${big ? 'Hold to send' : 'Send'}</span><i class="mfill"></i></button></div>`, 'open');
}
function mailSending() { return mailDock(`<div class="msending"><span class="mspin"></span>Sending…</div><div class="mundo" role="status"><span>Sent</span><button data-a="mundo">Undo</button><i></i></div>`, 'sending'); }
function mailSent(name, line, out) {
  return mailDock(`<div class="msent"><div class="msh"><span class="mok">${ART.I.trust}</span><b>Sent to ${esc(mFirst(name))}</b></div><p class="msaid">${esc(line)}</p><p class="mout">${esc(clip2(out)[0])}</p></div><button class="mnext" data-a="mnext">Next email ${ART.I.chev}</button>`, 'sent') + mailBanner();
}
function bkStrip() {
  if (!F.backers) return ''; const B = F.backers(), from = U.bkFrom;
  return `<div class="mbk" aria-label="Your backers">${B.map((b, j) => { const d = from && from[j] != null ? b.v - from[j] : 0; return `<span class="mbkb ${d ? 'bump ' + (d > 0 ? 'g' : 'r') : ''} ${b.danger ? 'lo' : ''}"><small>${esc(b.t === 'Dressing room' ? 'Room' : b.t === 'Supporters' ? 'Fans' : b.t)}</small><em><u style="width:${b.v}%"></u></em>${d ? `<i class="mfl ${d > 0 ? 'up' : 'dn'}">${d > 0 ? '+' : ''}${d}</i>` : ''}</span>`; }).join('')}</div>`;
}
function msgHtml(m, it) {
  const v = F.msgView(m), g = G(), role = v.role || (it && it.role) || 'club', name = v.from.split(',')[0], roleT = v.from.split(', ')[1] || ROLE_T[role] || '';
  const emo = /refuse|angry|furious|appalled|protest|demand/i.test(v.body) ? 'angry' : /worr|concern|pressure|injur|risk/i.test(v.body) ? 'worried' : null;
  const big = /^vote_/.test(m.ev), key = 'm' + m.id;
  const tag = v.done ? `<span class="mtg ok">${ART.I.trust}${v.by === 'you' ? 'Replied' : v.del ? (v.err ? 'Wrong call' : 'Staff call') : 'Handled'}</span>` : `<span class="mtg ${big ? 'big' : ''}">${big ? 'Big decision' : esc((it && it.label) || 'Your call')}</span>`;
  let h = mailTop(role, name, roleT, v.title, tag, v.body, emo);
  if (v.done) {
    if (U.sentK === key && v.by === 'you') { U.tray = mailSent(name, v.opts[v.choice].l + '.', v.outcome); U.trayH = 210; return h + fdHtml(m.fd); }
    return h + (v.del ? `<div class="whyr ${v.err ? 'bad' : 'ok'}"><span>${ART.I[v.err ? 'risk' : 'trust']}</span><p><b>${v.err ? 'A wrong call by your staff' : 'Decided by your staff'}</b>${v.err ? 'It went against your mandate. Too many of these and the board notices.' : 'Within the authority you gave the department. You did not need to act.'}</p></div>` : '') + `<div class="outc"><b>${v.by === 'you' ? 'You' : esc(v.by)}: ${esc(v.opts[v.choice].l)}.</b> ${esc(v.outcome)}</div>` + fdHtml(m.fd);
  }
  h += `<p class="mwhy"><b>Why it is yours.</b> ${esc(v.why)}</p>`;
  if (m.ev === 'pw_meet' && F.pwView) h += pwMeetHtml(F.pwView());
  if (m.ev === 'pw_eval' && F.pwView) h += pwEvalHtml(F.pwView());
  if (v.second) h += v.second.text ? `<details class="more" open><summary>Second opinion ${ART.I.chev}</summary><p>${esc(v.second.text)}</p></details>` : v.second.avail ? `<details class="more"><summary>Second opinion: ${esc(v.second.name)} <span class="small">1 action</span></summary><p><button class="btn ghost small" data-a="second" data-m="${m.id}" ${g.ap < 1 ? 'disabled' : ''}>Ask ${esc(v.second.name.split(' ')[0])}</button></p></details>` : '';
  const leave = `One action. Leave it and ${v.autoWho} sends the advised reply.`;
  if (U.pend && U.pend.k === 'm' && U.pend.id === m.id) { U.tray = mailSending(); U.trayH = 90; }
  else if (U.mc && U.mc.k === 'm' && U.mc.id === m.id) { U.tray = mailCompose('m', m.id, v.title, role, name, v.opts, v.auto, U.mc.i, big, leave); U.trayH = 430; }
  else { U.tray = mailDock(`<div class="slh"><b>Suggested replies</b>${apPips(g.ap)}</div>${mailRows('m', m.id, v.opts, v.auto, g.ap < 1)}<div class="mrow"><button class="mrb" data-a="mcomp" data-k="m" data-id="${m.id}" data-i="-1" ${g.ap < 1 ? 'disabled' : ''}>${MAILI.reply}Reply</button><p class="mlv">${g.ap < 1 ? 'No actions left this week. Your staff will decide.' : esc(leave)}</p></div>`); U.trayH = 130 + v.opts.length * 58; }
  return h;
}
function briefHtml(b, it) {
  const v = F.briefView(b), role = v.role || (it && it.role) || 'club', name = v.who.split(',')[0], roleT = v.who.split(', ')[1] || '', key = 'b' + b.id;
  const tag = v.done ? `<span class="mtg ok">${ART.I.trust}${v.del ? 'Staff call' : 'Replied'}</span>` : '<span class="mtg upd">Update</span>';
  let h = mailTop(role, name, roleT, v.title, tag, v.text, null);
  if (v.done) {
    if (U.sentK === key && !v.del) { U.tray = mailSent(name, v.opts[v.choice].l + '.', v.out); U.trayH = 210; return h + fdHtml(b.fd); }
    return h + `<div class="outc"><b>${v.del ? esc(v.by) + ': ' : ''}${esc(v.opts[v.choice].l)}.</b> ${esc(v.out)}</div>` + fdHtml(b.fd);
  }
  if (v.why) h += `<p class="mwhy"><b>Why it is yours.</b> ${esc(v.why)}</p>`;
  const leave = 'Free. Leave it and nothing changes.';
  if (U.pend && U.pend.k === 'b' && U.pend.id === b.id) { U.tray = mailSending(); U.trayH = 90; }
  else if (U.mc && U.mc.k === 'b' && U.mc.id === b.id) { U.tray = mailCompose('b', b.id, v.title, role, name, v.opts, -1, U.mc.i, false, leave); U.trayH = 430; }
  else { U.tray = mailDock(`<div class="slh"><b>Suggested replies</b><span>Free</span></div>${mailRows('b', b.id, v.opts, -1, false)}<div class="mrow"><button class="mrb" data-a="mcomp" data-k="b" data-id="${b.id}" data-i="-1">${MAILI.reply}Reply</button><p class="mlv">${leave}</p></div>`); U.trayH = 130 + v.opts.length * 58; }
  return h;
}
function mailCommit(p) {
  const bk0 = F.backers ? F.backers().map(b => b.v) : null;
  const r = p.k === 'm' ? F.respond(p.id, p.i) : F.answerBrief(p.id, p.i);
  if (!r || r.err) { if (r && r.err) toast(r.err); return; }
  let role = 'club', name = 'Club office', subj = '';
  if (p.k === 'm') { const m = G().inbox.find(x => x.id === p.id), v = F.msgView(m); role = v.role || 'club'; name = v.from.split(',')[0]; subj = v.title; }
  else { const b = (G().briefs || []).find(x => x.id === p.id), v = F.briefView(b); role = v.role || 'club'; name = v.who.split(',')[0]; subj = v.title; }
  U.sentK = p.k + p.id; U.bkFrom = bk0; U.bn = { role, name, subj, txt: r.out, n: (U.bn ? U.bn.n : 0) + 1 };
  ART.SND.card(); ART.vib(big(p) ? [20, 40, 30] : 15);
  clearTimeout(mailCommit.t); mailCommit.t = setTimeout(() => { U.bkFrom = null; }, 1500);
}
function big(p) { if (p.k !== 'm') return false; const m = G().inbox.find(x => x.id === p.id); return !!(m && /^vote_/.test(m.ev)); }
function mailSend(d) {
  const p = { k: d.k, id: +d.id, i: +d.i }; U.mc = null; U.pend = p; U.mfly = (U.mfly || 0) + 1;
  clearTimeout(mailSend.t); mailSend.t = setTimeout(() => { if (U.pend !== p) return; U.pend = null; mailCommit(p); render(); }, MAIL_RM ? 60 : 3000);
}
const MAIL_RM = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
function mailAfter() {
  const t = document.querySelector('#app .typed[data-full]');
  if (t) { const full = t.dataset.full, k = t.dataset.key; if (U.typedKey === k || MAIL_RM) t.textContent = full; else { U.typedKey = k; let n = 0; const tick = () => { if (!t.isConnected) return; t.textContent = full.slice(0, ++n); if (n < full.length) setTimeout(tick, 16); }; tick(); } }
  const seg = document.querySelector('#app .mseg'); if (seg) { const on = seg.querySelector('.sg.on'), ind = seg.querySelector('.mseg-i'); if (on && ind) { Object.assign(ind.style, { left: on.offsetLeft + 'px', top: on.offsetTop + 'px', width: on.offsetWidth + 'px', height: on.offsetHeight + 'px' }); seg.classList.add('has'); } }
  if (U.mfly && U.mfly !== U.mflyShown) { U.mflyShown = U.mfly; const e = document.createElement('span'); e.className = 'mfly'; e.innerHTML = MAILI.env; document.body.appendChild(e); setTimeout(() => e.remove(), 900); }
}
let MH = null;
document.addEventListener('pointerdown', e => { const b = e.target.closest('.msend.hold'); if (!b || b.disabled) return; e.preventDefault(); b.classList.add('holding'); MH = setTimeout(() => { b.classList.remove('holding'); MH = null; ART.vib([30, 30, 60]); mailSend(b.dataset); render(); }, MAIL_RM ? 10 : 1100); });
['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => document.addEventListener(ev, e => { if (!MH) return; clearTimeout(MH); MH = null; document.querySelectorAll('.msend.holding').forEach(b => b.classList.remove('holding')); }, true));

function propHtml(idx, row) { return pitchDeck(G().meeting, 'Project pitches', true); }
function digestHtml() {
  const g = G(), au = g.paper.stories.filter(s => s.auto), other = g.paper.stories.filter(s => !s.auto);
  return `<h2 class="oh">This week in the club</h2><div class="reports">${(g.reports || []).map(r => `<p class="rep"><b>${esc(F.ROLE[r.role].s)}</b> ${esc(r.t)}</p>`).join('')}</div>
  ${au.length ? `<h3 style="margin-top:14px">Handled by your staff</h3>${au.map(s => `<p class="rep">${esc(s.t)}</p>`).join('')}` : ''}
  ${other.length ? `<h3 style="margin-top:14px">Around the club</h3>${other.map(s => `<p class="rep"><b>${esc(s.h)}</b> ${esc(s.t)}</p>`).join('')}` : ''}`;
}
const TOUR = {
  inbox: ['This week', 'What needs you this week. Decisions cost an action and build your grip; leave them and your staff decide.'],
  club: ['Your club', 'How the club is doing: who backs you, the board\'s objectives, the money and your projects.'],
  squad: ['Your squad', 'The coach\'s likely eleven and the rest of the squad. Tap any player for his profile. You never pick the team yourself.'],
  league: ['The league', 'Where you stand, who is next and how the cup is going. Top three go up, bottom three go down.'],
  staff: ['Your departments', 'Each department has a head with staff underneath. Open one to see its numbers, people and decisions.']
};
function tourCard(k) { const g = G(), t = TOUR[k]; if (!t || (g.flags.tour || {})[k]) return ''; return `<div class="tourc"><b>${esc(t[0])}</b><p>${esc(t[1])}</p><button class="btn small" data-a="tour-ok" data-k="${k}">Got it</button></div>`; }
function tabBadge(k) {
  const g = G();
  if (k === 'inbox') { const n = inboxItems().filter(isBox).length; return n ? `<em class="nbadge">${n}</em>` : ''; }
  if (k === 'club') { const run = F.finRunway ? F.finRunway() : null; return (g.grip != null && g.grip < 30) || (run != null && run <= 8) || g.board.conf < 30 ? '<em class="nbadge warn">!</em>' : ''; }
  if (k === 'squad') return (g.msNew || []).length ? `<em class="nbadge dot"></em>` : '';
  if (k === 'staff') { const n = F.deptOverview().filter(o => !o.s).length; return n ? '<em class="nbadge warn">!</em>' : ''; }
  return '';
}
function vBar() {
  const g = G(), open = inboxItems().filter(i => i.kind === 'need').length, gr = Math.round(g.grip == null ? 60 : g.grip);
  return `<div class="bar2"><div class="b2play"><span class="b2l"><button class="aplab" data-a="sheet" data-s="actions" aria-label="${g.ap} actions left this week">${apPips(g.ap)}<small>${g.ap} action${g.ap === 1 ? '' : 's'}</small></button><button class="gripchip ${gr < 30 ? 'lo' : gr >= 70 ? 'hi' : ''}" data-a="sheet" data-s="grip" aria-label="Your grip on the club: ${gr}"><i style="width:${gr}%"></i><b>Grip ${gr}</b></button></span><button class="btn" data-a="play">${ART.I.play}${F.mtPreview && F.mtPreview() ? 'Next match' : 'Play week ' + g.week}${open ? ` <em class="cnt" aria-label="${open} need you">${open}</em>` : ''}</button></div><nav class="b2nav">${[['inbox', 'Inbox'], ['club', 'Club'], ['squad', 'Squad'], ['league', 'League'], ['staff', 'Depts']].map(([k, l]) => `<button class="${U.tab === k ? 'on' : ''}" data-a="tab" data-t="${k}" aria-label="${l}"><span class="nic">${ART.I[k]}${tabBadge(k)}</span>${l}</button>`).join('')}</nav></div>`;
}
function advance() { const nx = inboxItems().find(x => (x.kind === 'need' || x.kind === 'upd') && x.key !== U.open); if (nx) U.open = nx.key; else U.flash = ''; }
function markFresh() { U.seenB = U.seenB || new Set(); for (const b of document.querySelectorAll('#app .bubble')) { const k = b.textContent.slice(0, 80); if (!U.seenB.has(k)) { b.classList.add('anim'); U.seenB.add(k); } } if (U.seenB.size > 400) U.seenB = new Set(); }
function render() {
  const g = G(); const y = window.scrollY; let h = '';
  if (!g || U.title) h = vTitle();
  else if (g.phase === 'dna') h = vSetupDNA();
  else if (g.phase === 'staff') h = vSetupStaff();
  else if (g.phase === 'mandates') h = vSetupMandates();
  else if (g.phase === 'summer') { F.sum2Ensure && F.sum2Ensure(); h = g.sum && g.sum.v2 ? vSummer2() : vSummer(); }
  else if (g.phase === 'preseason') h = vPreseason();
  else if (g.phase === 'press') h = vPress();
  else if (U.md) h = vMatchday();
  else if ((g.phase === 'review' || g.phase === 'sacked') && U.ticker) h = '';
  else if (g.phase === 'review') h = vReview2();
  else if (g.phase === 'sacked') h = vSacked();
  else { U.tray = ''; h = masthead() + ({ inbox: vInbox, desk: vInbox, news: vNews, club: vClub2, staff: () => U.dept ? vDept(U.dept) : vDepts(), squad: vSquad, league: vLeague2, money: vMoney })[U.tab](); h += ((U.tab === 'inbox' && U.open) || (U.tab === 'staff' && U.dept === 'first')) && U.tray ? U.tray : vBar(); }
  app.innerHTML = h + vSheet() + (U.toast ? `<div class="toast" role="status">${esc(U.toast)}</div>` : '') + (U.flash && U.flashN !== U.flashShown ? (U.flashShown = U.flashN, `<div class="fxtoast" role="status">${esc(U.flash)}</div>`) : '');
  markFresh(); mailAfter(); if (U.md && U.md.phase === 'match' && !U.md.ft) MDP.start();
  window.scrollTo(0, y); ddSchedule();
}

/* ---------- match day: preview, match, gazette (full screens) ---------- */
const MDPAL = ['#1d4ed8', '#b91c1c', '#15803d', '#111', '#f59e0b', '#7c3aed', '#0e7490', '#be185d'];
const mdOppCols = id => [MDPAL[(id * 7 + 3) % MDPAL.length], '#fff'];
const mdClean = t => String(t || '').replace(/\s*\(xG [\d.]+\)/, '');
const mdP = id => { const g = G(); return g.squad.find(x => x.id === id) || (g.academy || []).find(x => x.id === id) || null; };
F.storyOf = p => storyOf(p)[0];
function mdStadium(home, oc, night) {
  const g = G(), c1 = g.club.colors[0], c2 = g.club.colors[1], sky = night ? ['#1b2440', '#3b3a62'] : ['#a9d3ee', '#e7f1f2'];
  let crowd = ''; for (let r = 0; r < 4; r++) for (let i = 0; i < 46; i++) { const x = 6 + i * 8.4 + (r % 2) * 4, y = 74 + r * 9, away = home ? i > 38 : i < 30; crowd += `<circle cx="${x}" cy="${y}" r="3.1" fill="${away ? oc[0] : (i + r) % 3 ? c1 : c2}"/>`; }
  return `<svg viewBox="0 0 390 170" width="100%" class="mdstad" aria-hidden="true"><defs><linearGradient id="mdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient><radialGradient id="mdglow"><stop offset="0" stop-color="#fff7cf" stop-opacity=".9"/><stop offset="1" stop-color="#fff7cf" stop-opacity="0"/></radialGradient></defs>
  <rect width="390" height="170" fill="url(#mdsky)"/>${night ? '<circle cx="320" cy="26" r="9" fill="#f4efd8"/>' : '<circle cx="320" cy="28" r="14" fill="#f3d36b" stroke="#16201b" stroke-width="2.5"/>'}
  ${[24, 366].map(x => `<g><rect x="${x - 2}" y="14" width="4" height="56" fill="#16201b"/><rect x="${x - 12}" y="8" width="24" height="10" rx="2" fill="#e8e4d6" stroke="#16201b" stroke-width="2"/>${night ? `<circle cx="${x}" cy="13" r="34" fill="url(#mdglow)"/>` : ''}</g>`).join('')}
  <path d="M0 64h390v52H0z" fill="#2b3440" stroke="#16201b" stroke-width="3"/><path d="M0 64h390v6H0z" fill="${c1}"/>${crowd}
  <path d="M0 114h390v56H0z" fill="#3d7a4f"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${i * 70} 114h35v56h-35z" fill="#468a5a"/>`).join('')}<path d="M0 114h390" stroke="#16201b" stroke-width="3"/><path d="M195 114v56M155 170a40 22 0 0 1 80 0" stroke="#f4f4ec" stroke-width="2.5" fill="none" opacity=".85"/></svg>`;
}
function mdPitch() {
  let st = ''; for (let i = 0; i < 10; i++) st += `<rect x="${i * 36}" y="0" width="18" height="220" fill="#468a5a"/>`;
  return `<svg viewBox="0 0 360 220" class="mdpitch" aria-hidden="true"><rect width="360" height="220" fill="#3d7a4f"/>${st}<g fill="none" stroke="#f4f4ec" stroke-width="2.2" opacity=".9"><rect x="8" y="8" width="344" height="204"/><path d="M180 8v204"/><circle cx="180" cy="110" r="28"/><rect x="8" y="58" width="44" height="104"/><rect x="308" y="58" width="44" height="104"/><rect x="8" y="88" width="16" height="44"/><rect x="336" y="88" width="16" height="44"/><path d="M52 88a26 26 0 0 1 0 44M308 88a26 26 0 0 0 0 44"/></g><rect x="0" y="92" width="8" height="36" fill="#f4f4ec" opacity=".35"/><rect x="352" y="92" width="8" height="36" fill="#f4f4ec" opacity=".35"/><circle cx="180" cy="110" r="2.5" fill="#f4f4ec"/></svg>`;
}
const MD_BALL = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="#fff" stroke="#16201b" stroke-width="2"/><path d="M10 5.5l3.5 2.6-1.3 4.1H7.8L6.5 8.1z" fill="#16201b"/></svg>';
const mdForm = arr => `<span class="mdform">${(arr || []).slice(-5).map(r => `<i class="f${r}">${r}</i>`).join('') || '<small>no games yet</small>'}</span>`;
function mdPreview() {
  const g = G(), P = F.mtPreview(); if (!P) { U.md = null; return vInbox(); }
  const oc = mdOppCols(P.id), us = [g.club.colors, g.club.short], them = [oc, oppShort(P.name)], L = P.home ? us : them, R = P.home ? them : us;
  const S = F.mdStories(), coach = F.staff('coach'), box = inboxItems().filter(isBox).length, BG = F.goalView ? F.goalView() : null;
  const gap = P.pos - P.mine;
  const stake = P.rival ? 'Derby day. Bragging rights for a year.' : P.odds === 'Favourites' ? 'We are expected to win this. Anything less will be noticed.' : P.odds === 'Underdogs' ? 'Nobody expects anything from us. A point would be a good day.' : Math.abs(gap) <= 3 && P.pos < P.mine ? 'They are just above us. Win and we could go past them.' : 'An even game on paper. Small things will decide it.';
  const cl = !coach ? '' : P.odds === 'Underdogs' ? (coach.p.ego > 14 ? '"Everyone writes us off. Good."' : '"We are not favourites. We will make it hard for them."') : P.odds === 'Favourites' ? '"We should win this. No complacency."' : '"Fine margins. Whoever wants it more."';
  return `<div class="mds mdpv"><div class="mdscr">
  <header class="mdpvh">${mdStadium(P.home, oc, false)}<div class="mdpvb"><div class="mdpvt">${crest(L[0], L[1], 50)}<b>${esc(L[1])}</b></div><div class="mdpvv"><span>${P.home ? 'HOME' : 'AWAY'}</span><b>vs</b><small>Week ${g.week}</small></div><div class="mdpvt">${crest(R[0], R[1], 50)}<b>${esc(R[1])}</b></div></div></header>
  <div class="mdpad"><div class="mdkick"><span>Matchday, week ${g.week}</span><span>${esc(F.TIERS[g.club.tier])}</span></div>
  <h1 class="mdpvn">${esc(P.home ? g.club.name : P.name)} <i>v</i> ${esc(P.home ? P.name : g.club.name)}</h1>
  <div class="mdtbl"><div><small>Us</small><b>${F.ord(P.mine)}</b>${mdForm(g.form)}</div><div><small>${esc(P.name)}</small><b>${F.ord(P.pos)}</b>${mdForm(P.fm)}</div></div>
  <p class="mdstake"><b>At stake.</b> ${esc(stake)}${BG && BG.done == null ? ` ${esc(BG.t)} goal: ${BG.got} of ${BG.need} points, ${BG.left} game${BG.left === 1 ? '' : 's'} left.` : ''}</p>
  ${S.length ? `<h2 class="mdsh">Our story this week</h2><div class="mdstories">${S.map((x, i) => { const p = mdP(x.pid); if (!p) return ''; return `<button class="mdstory" style="--d:${i * 90}ms" data-a="player" data-id="${p.id}" aria-label="Open profile of ${esc(p.name)}"><span class="mdsf">${ART.playerFace(p)}</span><span class="mdst"><em>${esc(x.tag)}</em><b>${esc(p.name)}<small>${esc(F.POS_L[p.pos])}, ${p.age}</small></b><span>${esc(x.t)}</span></span></button>`; }).join('')}</div>` : ''}
  ${P.star ? `<div class="mddanger"><span class="mddg">!</span><p><b>Watch out for ${esc(P.star.name)}.</b> ${esc(P.sty.t)} side: ${esc(P.sty.d.toLowerCase())}.</p></div>` : ''}
  ${coach ? `<div class="mdcoach"><span class="mdcf">${ART.staffFace('coach')}</span><p>${esc(cl)}<small>${esc(coach.name)}, head coach</small></p></div>` : ''}
  </div></div><div class="mdfoot">${box ? `<p class="mdboxw"><b>${box} still in your red box.</b> Kick off and your staff answer ${box === 1 ? 'it' : 'them'}.</p>` : ''}<div class="mdrow"><button class="mdback" data-a="md-close" aria-label="Back to the inbox">${ART.I.back}</button><button class="mdko" data-a="md-kick">Kick off</button></div></div></div>`;
}
function mdTeams(m) { const g = G(), oc = mdOppCols(m.opp), us = { c: g.club.colors, s: g.club.short }, th = { c: oc, s: oppShort(m.oppName) }; return m.home ? [us, th] : [th, us]; }
function mdMatch() {
  const g = G(), s = U.md, m = s.m, [L, R] = mdTeams(m), ft = s.ft, hs = m.home ? m.ug : m.tg, as = m.home ? m.tg : m.ug;
  const sc = ft ? `${hs}<i>–</i>${as}` : '0<i>–</i>0';
  let foot;
  if (ft) {
    const us = m.ug, th = m.tg, res = m.cupWin != null ? (m.cupWin ? 'W' : 'L') : us > th ? 'W' : us < th ? 'L' : 'D', motm = g.squad.find(p => p.name === m.motm);
    foot = `<section class="mdft r${res}"><div class="mdfth"><span>${m.comp === 'Cup' ? 'National Cup' + (m.rd ? ', ' + esc(m.rd) : '') : 'Full time'}${m.pens ? ', ' + esc(m.pens) : ''}</span><b>${res === 'W' ? 'A win' : res === 'L' ? 'A defeat' : 'A draw'}</b></div>
    ${motm ? `<div class="mdmotm"><span class="mdmf">${ART.playerFace(motm, 'happy')}</span><div><em>Player of the match</em><b>${esc(motm.name)}</b>${motm.lastRat ? `<span class="mdrt">${motm.lastRat.toFixed(1)}</span>` : ''}</div></div>` : ''}
    ${s.out && s.out.length ? `<h3>How the stories ended</h3><ul class="mdouts">${s.out.map(o => { const p = mdP(o.pid); return `<li>${p ? `<span class="mdsf sm">${ART.playerFace(p, o.mood)}</span>` : ''}<p>${esc(o.t)}</p></li>`; }).join('')}</ul>` : ''}
    <button class="mdko" data-a="md-after">${s.replay ? 'Back to the Gazette' : s.cup ? 'To the cup tie' : 'Read the Gazette'}</button></section>`;
  } else foot = `<div class="mdfeed"><div class="mdnow"></div><ul class="mdpast" aria-live="polite"></ul></div><div class="mdctl"><button data-a="md-speed">2x speed</button><button data-a="md-skip">Skip to full time</button></div>`;
  return `<div class="mds mdm ${ft ? 'ft' : ''}"><div class="mdbug"><div class="mdbt">${crest(L.c, L.s, 30)}<b>${esc(L.s)}</b></div><div class="mdbs"><b class="mdsc">${sc}</b><span class="mdclk">${ft ? (m.pens || m.ev.some(e => e.m > 95) ? 'AET' : 'FT') : "0'"}</span></div><div class="mdbt r"><b>${esc(R.s)}</b>${crest(R.c, R.s, 30)}</div></div>
  <div class="mdprog"><b style="width:${ft ? 100 : 0}%"></b></div>
  <div class="mdpw">${mdPitch()}<span class="mdball">${MD_BALL}</span><div class="mdgf"></div><span class="mddir l">${esc(L.s)} attack</span><span class="mddir r">${esc(R.s)} attack</span></div>
  <div class="mdmom"><svg viewBox="0 0 360 54" preserveAspectRatio="none"><path class="mu" d="${ft ? s.momTop || '' : ''}"/><path class="mt" d="${ft ? s.momBot || '' : ''}"/><path d="M0 27h360" stroke="currentColor" stroke-opacity=".25"/><path d="M180 0v54" stroke="currentColor" stroke-opacity=".15" stroke-dasharray="3 3"/></svg><div class="mdmoml"><span>${esc(L.s)}</span><small>Momentum</small><span>${esc(R.s)}</span></div></div>
  ${foot}</div>`;
}
/* the live match: a small player that animates the existing DOM, no re-render */
const MDP = {
  start() {
    const s = U.md, m = s.m, root = document.querySelector('.mdm'); if (!root || s.ft || this.cur === s.m) return; this.cur = s.m;
    Object.assign(this, { root, m, i: 0, min: 0, mom: [], fast: false, paused: false, home: m.home, end: Math.max(...m.ev.map(e => e.m), 90) });
    this.players(); this.ball(50, 50, 0); ART.SND.whistle(); this.loop();
  },
  side(us) { return this.home ? !!us : !us; },
  players() {
    const s = U.md, [L, R] = mdTeams(s.m), w = this.root.querySelector('.mdpw'), F4 = [[5, 50], [20, 18], [18, 39], [18, 61], [20, 82], [38, 16], [36, 40], [36, 60], [38, 84], [48, 38], [48, 62]]; this.pl = [];
    F4.forEach(([x, y], i) => [0, 1].forEach(side => { const el = document.createElement('i'), c = side ? R.c : L.c; el.className = 'mdpl'; el.style.background = i === 0 ? '#f3d36b' : c[0]; const bx = side ? 100 - x : x; el.style.left = bx + '%'; el.style.top = y + '%'; w.appendChild(el); this.pl.push({ el, bx, by: y, gk: !i }); }));
  },
  ball(x, y, ms) {
    const b = this.root.querySelector('.mdball'); if (!b) return; const tr = MAIL_RM ? 'none' : `left ${ms}ms cubic-bezier(.3,.7,.3,1),top ${ms}ms cubic-bezier(.3,.7,.3,1)`;
    b.style.transition = tr; b.style.left = x + '%'; b.style.top = y + '%';
    (this.pl || []).forEach(p => { const k = p.gk ? .08 : .38; p.el.style.transition = tr; p.el.style.left = Math.max(3, Math.min(97, p.bx + (x - 50) * k + (Math.random() - .5) * 3)) + '%'; p.el.style.top = Math.max(6, Math.min(94, p.by + (y - p.by) * (p.gk ? .1 : .18))) + '%'; });
  },
  alive() { return this.root && this.root.isConnected && U.md && U.md.m === this.m && !U.md.ft; },
  loop() {
    const step = MAIL_RM ? 30 : this.fast ? 150 : 360;
    clearTimeout(this.t); this.t = setTimeout(() => {
      if (!this.alive()) return this.lost(); if (this.paused) return;
      this.min++; const e = this.m.ev[this.i]; if (!e) return this.finish();
      if (e.m > this.min) { if (this.min % 2 === 0) { const lean = e.us != null && e.k !== 'info' ? (this.side(e.us) ? 1 : -1) : 0; this.ball(50 + lean * 12 + (Math.random() - .5) * 36, 22 + Math.random() * 56, step * 2); } this.clock(); this.push(e.us != null && e.k !== 'info' ? (this.side(e.us) ? .25 : -.25) : 0); return this.loop(); }
      this.i++; this.clock(e.m); this.fire(e);
    }, step);
  },
  clock(mm) { mm = mm || this.min; const c = this.root.querySelector('.mdclk'); if (c) c.textContent = (mm > 90 && mm <= 95 && this.end <= 96 ? '90+' + (mm - 90) : mm) + "'"; const p = this.root.querySelector('.mdprog b'); if (p) p.style.width = Math.min(100, mm / this.end * 100) + '%'; },
  push(v) { const last = this.mom.length ? this.mom[this.mom.length - 1] : 0; this.mom.push(last * .82 + v); this.draw(); },
  paths() { const n = this.end, pts = this.mom.map((v, i) => [i / n * 360, 27 - Math.max(-25, Math.min(25, v * 14))]); if (!pts.length) return ['', '']; const e = pts[pts.length - 1][0].toFixed(1); return ['M0 27 ' + pts.map(p => `L${p[0].toFixed(1)} ${Math.min(27, p[1]).toFixed(1)}`).join(' ') + ` L${e} 27Z`, 'M0 27 ' + pts.map(p => `L${p[0].toFixed(1)} ${Math.max(27, p[1]).toFixed(1)}`).join(' ') + ` L${e} 27Z`]; },
  draw() { const [a, b] = this.paths(), u = this.root.querySelector('.mu'), t = this.root.querySelector('.mt'); if (u) { u.setAttribute('d', a); t.setAttribute('d', b); } },
  fire(e) {
    const right = e.us != null ? this.side(e.us) : true, gx = right ? 94 : 6; let wait = this.fast ? 500 : 1100;
    if (e.k === 'info' && /^Half-time/.test(e.t)) { this.ball(50, 50, 600); ART.SND.whistle(); return this.half(e); }
    if (e.k === 'ft') return this.finish();
    if (e.k === 'ch') { this.ball(right ? 80 : 20, 35 + Math.random() * 30, 420); setTimeout(() => this.alive() && this.ball(gx + (right ? -4 : 4), 44 + Math.random() * 12, 260), 420); this.push(right ? 1.2 : -1.2); }
    if (e.k === 'goal') {
      this.ball(right ? 82 : 18, 50, 380); setTimeout(() => this.alive() && this.ball(gx + (right ? 3 : -3), 50, 220), 380);
      setTimeout(() => { if (!this.alive()) return; const sc = this.root.querySelector('.mdsc'), hs = this.home ? e.sc[0] : e.sc[1], as = this.home ? e.sc[1] : e.sc[0]; if (sc) { sc.innerHTML = `${hs}<i>–</i>${as}`; sc.classList.remove('pop'); void sc.offsetWidth; sc.classList.add('pop'); }
        const gf = this.root.querySelector('.mdgf'), p = e.us && e.pid ? mdP(e.pid) : null; if (gf) { gf.className = 'mdgf on ' + (e.us ? 'us' : 'them'); gf.innerHTML = e.us ? `${p ? `<span class="mdgface">${ART.playerFace(p, 'happy')}</span>` : ''}<b>GOAL!</b>${p ? `<small>${esc(p.name)}</small>` : ''}` : `<b>${esc(oppShort(this.m.oppName))} score</b>`; setTimeout(() => { gf.className = 'mdgf'; }, this.fast ? 900 : 1800); }
        if (e.us) { ART.SND.cheer(); ART.vib([80, 40, 80]); } else ART.SND.bad(); }, 600);
      this.push(right ? 2 : -2); wait = this.fast ? 1300 : 2500;
    }
    this.card(e); clearTimeout(this.t); this.t = setTimeout(() => this.loop(), MAIL_RM ? 150 : wait);
  },
  card(e) {
    const now = this.root.querySelector('.mdnow'), past = this.root.querySelector('.mdpast'); if (!now) return;
    const prev = now.firstElementChild; if (prev && prev.dataset.t) { const li = document.createElement('li'); li.className = 'mdpli k-' + prev.dataset.k; li.innerHTML = `<span>${prev.dataset.m}'</span>${esc(prev.dataset.t)}`; past.prepend(li); }
    const p = e.pid ? mdP(e.pid) : null, t = mdClean(e.t), ic = { goal: '●', ch: '○', card: '', sub: '⇄', inj: '+', info: '·' }[e.k] || '·';
    const fc = p ? `<span class="mdmf">${ART.playerFace(p, e.k === 'goal' ? 'happy' : e.k === 'card' || e.k === 'inj' ? 'worried' : 'neutral')}</span>` : e.k === 'goal' && !e.us ? `<span class="mdmi">${crest(mdOppCols(this.m.opp), oppShort(this.m.oppName), 30)}</span>` : `<span class="mdmi k-${e.k} ${e.red ? 'red' : ''}">${ic}</span>`;
    now.innerHTML = `<div class="mdcard k-${e.k} ${e.us ? 'us' : e.us === 0 ? 'them' : ''}" data-t="${esc(t)}" data-m="${e.m}" data-k="${e.k}">${fc}<div><span class="mdmm">${e.m}'</span><p>${esc(t)}</p></div></div>`;
  },
  half(e) {
    const m = this.m, sc = e.t.replace(/^Half-time:\s*/, '').replace(/\.$/, ''), coach = F.staff('coach'), [a, b] = sc.split('–').map(Number), us = this.home ? a : b, th = this.home ? b : a;
    const line = us > th ? '"Good half. Keep doing the simple things."' : us < th ? '"Not good enough. We can still turn this."' : '"Tight. We need a bit more in the final third."';
    this.card({ k: 'info', m: 45, t: 'Half-time.' });
    const now = this.root.querySelector('.mdnow'); now.innerHTML = `<div class="mdht"><div class="mdhth"><b>Half-time</b><span>${esc(sc)}</span></div>${coach ? `<div class="mdhtc"><span class="mdcf">${ART.staffFace('coach')}</span><p>${esc(line)}<small>${esc(coach.name)}</small></p></div>` : ''}<button data-a="md-resume">Second half</button></div>`;
    this.paused = true; clearTimeout(this.t); this.t = setTimeout(() => this.resume(), MAIL_RM ? 200 : this.fast ? 2500 : 5500);
  },
  resume() { if (!this.paused) return; this.paused = false; ART.SND.whistle(); const now = this.root.querySelector('.mdnow'); if (now) now.innerHTML = ''; this.loop(); },
  finish() { clearTimeout(this.t); if (!U.md || U.md.m !== this.m) return; ART.SND.whistle(); this.momAll(); const [a, b] = this.paths(); U.md.momTop = a; U.md.momBot = b; U.md.ft = true; this.cur = null; render(); },
  momAll() { // the whole match, so a skipped match still shows its shape
    const ev = this.m.ev, v = []; let cur = 0, j = 0;
    for (let mm = 1; mm <= this.end; mm++) { while (j < ev.length && ev[j].m < mm) j++; const here = ev.filter(e => e.m === mm), nx = ev[j]; let push = nx && nx.us != null && nx.k !== 'info' ? (this.side(nx.us) ? .25 : -.25) : 0;
      for (const e of here) if (e.k === 'ch') push += this.side(e.us) ? 1.2 : -1.2; else if (e.k === 'goal') push += this.side(e.us) ? 2 : -2;
      cur = cur * .82 + push; v.push(cur); }
    this.mom = v;
  },
  lost() { clearTimeout(this.t); if (U.md && U.md.m === this.m && !U.md.ft && document.querySelector('.mdm')) { this.cur = null; this.start(); } },
  skip() { this.finish(); }
};
/* ---------- the Gazette: one design, opened after the match and from the inbox ---------- */
function gzEdition(ed, mode, idx) {
  const g = G(); if (!ed) return '<p class="small">No edition yet. The first paper comes out after your first match.</p>';
  const m = ed.match || ed.cup, oc = m ? mdOppCols(m.opp) : null, us = { c: g.club.colors, s: g.club.short }, th = m ? { c: oc, s: oppShort(m.oppName) } : null, L = m && m.home ? us : th, R = m && m.home ? th : us;
  const hs = m ? (m.home ? m.ug : m.tg) : 0, as = m ? (m.home ? m.tg : m.ug) : 0, hero = m && m.motmId ? mdP(m.motmId) : null, mv = ed.prevPos && ed.pos ? ed.prevPos - ed.pos : 0;
  const latest = !(idx > 0), late = (ed.late || []).filter(x => !x.auto), lateN = (ed.late || []).filter(x => x.auto);
  const stories = ed.stories.concat(late), notices = ed.notices.concat(lateN), canReplay = mode === "inbox" && latest && m && g.lastMatch && g.lastMatch.oppName === m.oppName && g.lastMatch.ug === m.ug && g.lastMatch.tg === m.tg;
  const sec = (t, inner) => inner ? `<section class="mdnsec"><h3>${t}</h3>${inner}</section>` : '';
  return `<div class="mdnews gz-${mode}">
  <header class="mdmast"><span>Season ${ed.s}, week ${ed.w}</span><h1>The ${esc(g.club.city)} Gazette</h1><span>Price: one honest opinion</span></header>
  <h2 class="mdnh">${esc(ed.head || 'The desk is open')}</h2>${ed.sub ? `<p class="mdndek">${esc(ed.sub)}</p>` : ''}
  ${m ? `<div class="mdnsc"><div>${crest(L.c, L.s, 40)}<b>${esc(m.home ? g.club.name : m.oppName)}</b></div><strong>${hs}–${as}</strong><div>${crest(R.c, R.s, 40)}<b>${esc(m.home ? m.oppName : g.club.name)}</b></div></div>
  <p class="mdnscr">${m.comp === 'Cup' ? `National Cup${m.rd ? ', ' + esc(m.rd) : ''}${m.pens ? ', ' + esc(m.pens) : ''}. ` : ''}${esc(g.club.short)} scorers: ${esc(m.goals.map(x => `${x.n.split(' ').slice(-1)[0]} ${x.m}'`).join(', ') || 'none')}${m.att ? `. Crowd ${m.att.toLocaleString('en-GB')}` : ''}.</p>` : ''}
  ${hero ? `<figure class="mdnfig"><span class="mdnf">${ART.playerFace(hero, 'happy')}</span><figcaption>${esc(hero.name)}, player of the match${(m.rat.find(r => r.id === hero.id) || {}).r ? `, rated ${m.rat.find(r => r.id === hero.id).r.toFixed(1)}` : ''}</figcaption></figure>` : ''}
  ${ed.tp ? `<p class="mdnrep"><b>The turning point, ${ed.tp.m}'.</b> ${esc(mdClean(ed.tp.t))}</p>` : ''}
  ${canReplay ? `<button class="mdreplay" data-a="replay">${ART.I.play}Watch the match again</button>` : ''}
  ${sec('The stories', ed.outs && ed.outs.length ? `<ul>${ed.outs.map(o => `<li>${esc(o.t)}</li>`).join('')}</ul>` : '')}
  ${m && m.rat.length ? `<div class="mdncols"><section><h3>Ratings</h3><ol class="mdrats">${m.rat.map(r => `<li class="${r.n === m.motm ? 'star' : ''}"><span>${esc(r.n.split(' ').slice(-1)[0])}</span><b class="${r.r >= 7.5 ? 'hi' : r.r != null && r.r < 6 ? 'lo' : ''}">${r.r != null ? r.r.toFixed(1) : '–'}</b></li>`).join('')}</ol></section>
  <section>${ed.coach ? `<h3>The coach</h3><blockquote>"${esc(clip2(ed.coach.t)[0])}"<cite>${esc(ed.coach.by)}</cite></blockquote>` : ''}${ed.table.length ? `<h3>The table</h3><ol class="mdntab">${ed.table.map(r => `<li class="${r.me ? 'me' : ''}"><span>${r.p}</span><b>${esc(r.n)}</b><em>${r.pts}</em><i class="${r.me && mv > 0 ? 'up' : r.me && mv < 0 ? 'dn' : ''}">${r.me && mv ? (mv > 0 ? '▲' : '▼') : ''}</i></li>`).join('')}</ol>` : ''}</section></div>` : ''}
  ${ed.match && ed.cup ? sec('Also this week', `<p>National Cup${ed.cup.rd ? ', ' + esc(ed.cup.rd) : ''}: ${ed.cup.ug}–${ed.cup.tg} against ${esc(ed.cup.oppName)}${ed.cup.pens ? ', ' + esc(ed.cup.pens) : ''}.</p>`) : ''}
  ${sec('Around the club this week', ed.dec.length || stories.length ? `<ul>${ed.dec.map(d => `<li>${esc(d.t)}: you chose ${esc(d.c.toLowerCase())}.</li>`).join('')}${stories.map(x => `<li><b>${esc(x.h)}.</b> ${esc(clip2(x.t)[0])}</li>`).join('')}</ul>` : '')}
  ${sec('Club notices', notices.length ? `<ul class="mdnot">${notices.map(x => `<li>${esc(clip2(x.t)[0])}</li>`).join('')}</ul>` : '')}
  ${sec(latest ? 'Your backers after the match' : 'Your backers that week', ed.bk.length ? `<div class="mdbks">${ed.bk.map(b => `<div><small>${esc(b.t === 'Dressing room' ? 'Room' : b.t === 'Supporters' ? 'Fans' : b.t)}</small><b>${b.v}</b><i class="${b.d > 0 ? 'up' : b.d < 0 ? 'dn' : ''}">${b.d > 0 ? '+' + b.d : b.d < 0 ? b.d : '='}</i><em><u style="width:${b.v}%"></u></em></div>`).join('')}</div>` : '')}
  ${mode === 'inbox' && F.edCount() > 1 ? `<section class="mdnsec"><h3>Earlier editions</h3><div class="mdarch">${(g.eds || []).map((e, k) => `<button class="${k === (idx || 0) ? 'on' : ''}" data-a="ed-open" data-i="${k}" aria-pressed="${k === (idx || 0)}"><span>Week ${e.w}${e.s !== g.season ? `, season ${e.s}` : ''}</span><b>${esc(e.head || 'The Gazette')}</b></button>`).join('')}</div></section>` : ''}
  </div>`;
}
function mdPaper() {
  const g = G();
  return `<div class="mds mdnp"><div class="mdscr">${gzEdition(F.edView(0), 'flow', 0)}</div><div class="mdfoot"><button class="mdko" data-a="md-done">${g.phase === 'season' ? `Start week ${g.week}` : g.phase === 'sacked' ? 'Continue' : 'To the season review'}</button></div></div>`;
}
function vMatchday() { const s = U.md; return s.phase === 'preview' ? mdPreview() : s.phase === 'match' ? mdMatch() : mdPaper(); }
function mdKick() {
  const g = G(), wk = g.week, se = g.season, prevPos = F.myPos();
  const dec = g.inbox.filter(m => m.done && m.by === 'you' && m.season === se && m.week === wk).map(m => { const v = F.msgView(m); return { t: v.title, c: v.opts[v.choice].l }; });
  U.sheet = null; ART.SND.whistle();
  const res = F.endWeek(); if (!res) { U.md = null; return; } saveGame();
  U.tab = 'inbox'; U.open = null; U.flash = ''; U.filt = 'all';
  const first = res.ours || res.cup; if (!first) { U.md = null; return; }
  if (res.cup && !res.ours) res.cup.cupWin = g.cup.log.length ? g.cup.log[g.cup.log.length - 1].win : null;
  if (res.cup && res.ours) res.cup.cupWin = g.cup.log.length ? g.cup.log[g.cup.log.length - 1].win : null;
  U.md = { phase: 'match', m: first, lg: res.ours || res.cup, cup: res.ours ? res.cup : null, out: res.ours ? F.mdOutcomes(res.ours) : [], tp: res.ours ? F.mdTurning(res.ours) : null, prevPos, dec, week: wk, ft: false };
  window.scrollTo(0, 0);
}

/* ---------- actions ---------- */
function readSetup() { const v = id => { const e = $('#' + id); return e ? e.value.trim() : ''; }; const s = U.setup; if ($('#f-city')) { s.city = v('f-city'); s.name = v('f-name'); s.short = v('f-short').toUpperCase(); } }
function act(a, d, el) {
  const g = G(); let r;
  switch (a) {
    case 'quick': quickStart(d.v === 'season'); break;
    case 'new': U.title = false; F.newGame(); U.setup = { step: 0, name: '', short: '', city: '', col: 0, dna: {} }; U.hire = {}; break;
    case 'continue': if (loadGame()) { U.title = false; setClub(G().club.colors); } break;
    case 'restart': wipe(); U.title = true; F.G = null; break;
    case 'col': readSetup(); U.setup.col = +d.i; break;
    case 's-next': readSetup(); if (U.setup.step === 0) { const s = U.setup; if (!s.city) s.city = 'Harwick'; if (!s.name) s.name = s.city + ' Athletic'; if (!s.short) s.short = s.city.slice(0, 3).toUpperCase(); setClub(PALETTES[s.col]); } U.setup.step++; window.scrollTo(0, 0); break;
    case 's-back': readSetup(); U.setup.step = Math.max(0, U.setup.step - 1); break;
    case 'dna': U.setup.dna[d.k] = d.v; break;
    case 'found': { const s = U.setup; F.setDNA(Object.assign({}, s.dna), s.name, s.short, s.city, PALETTES[s.col]); setClub(PALETTES[s.col]); window.scrollTo(0, 0); break; }
    case 'pick': U.hire[d.r] = +d.i; ART.SND.card(); { const ix = F.ROLES.findIndex(r => r.id === d.r), nx = F.ROLES.slice(ix + 1).find(r => U.hire[r.id] == null); if (nx) setTimeout(() => { U.hireRole = nx.id; render(); window.scrollTo(0, 0); }, 450); } break;
    case 'hire-tab': U.hireRole = d.r; window.scrollTo(0, 0); break;
    case 'unpick': delete U.hire[d.r]; break;
    case 'hire-all': for (const k in U.hire) F.hire(k, U.hire[k]); F.finishStaff(); window.scrollTo(0, 0); break;
    case 'mand-done': F.finishMandates(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break;
    case 'press': { const q = F.PRESS.find(p => p.id === d.q); let ans = q.a[+d.i]; if (typeof ans === 'function') ans = ans(); U.quote = F.pressAnswer(d.q, +d.i); U.quoteP = !!ans[1]; U.pressI++; break; }
    case 'press-next': U.quote = null; if (U.pressI >= g.press.length) { F.finishPress(); U.tab = 'inbox'; window.scrollTo(0, 0); } break;
    case 'tab': U.tab = d.t; U.sub = null; U.dept = null; if (d.t === 'inbox') { U.open = null; U.flash = ''; } window.scrollTo(0, 0); break;
    case 'mcomp': U.mc = { k: d.k, id: +d.id, i: +d.i }; ART.SND.card && ART.SND.card(); break;
    case 'mpick': if (U.mc) U.mc.i = +d.i; break;
    case 'mclose': U.mc = null; break;
    case 'msend': mailSend(d); break;
    case 'mundo': if (U.pend) { U.mc = { k: U.pend.k, id: U.pend.id, i: U.pend.i }; U.pend = null; U.typedKey = U.mc.k + U.mc.id + '-' + U.mc.i; } break;
    case 'mnext': U.sentK = null; U.mc = null; advance(); window.scrollTo(0, 0); break;
    case 'opt': r = F.respond(+d.m, +d.i); if (r && r.err) toast(r.err); else if (r && U.open) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.card(); ART.vib(15); advance(); } break;
    case 'open': if (!d.k) break; if (d.k.startsWith('an') && false) { markRead(d.k); U.sheet = { t: 'analysis' }; break; } if (d.k.startsWith('ms') && !d.k.startsWith('msw')) { markRead(d.k); const it = inboxItems().find(x => x.key === d.k); if (it) { U.ptab = 'story'; U.sheet = { t: 'player', id: it.pid }; } break; } U.open = d.k; U.flash = ''; U.mc = null; U.sentK = null; U.edI = 0; window.scrollTo(0, 0); break;
    case 'close-open': U.open = null; U.flash = ''; break;
    case 'dismiss': g.dis = g.dis || {}; g.dis[d.k] = F.absWeek(); for (const x in g.dis) if (g.dis[x] < F.absWeek() - 6) delete g.dis[x]; markRead(d.k); if (U.open === d.k) U.open = null; ART.SND.click(); break;
    case 'filt': U.filt = d.v; break;
    case 'md-kick': mdKick(); break;
    case 'md-close': U.md = null; break;
    case 'md-speed': MDP.fast = !MDP.fast; el.closest('button').textContent = MDP.fast ? 'Normal speed' : '2x speed'; return;
    case 'md-skip': MDP.skip(); return;
    case 'md-resume': clearTimeout(MDP.t); MDP.resume(); return;
    case 'md-after': if (U.md.replay) { U.md = null; window.scrollTo(0, 0); break; } if (U.md.cup) { U.md.m = U.md.cup; U.md.cup = null; U.md.ft = false; U.md.out = []; U.md.momTop = U.md.momBot = ''; } else U.md.phase = 'paper'; window.scrollTo(0, 0); break;
    case 'md-done': { const k = inboxItems().find(i => i.t === 'paper'); if (k) markRead(k.key); U.md = null; window.scrollTo(0, 0); break; }
    case 'play': if (G().phase === 'season' && F.mtPreview && F.mtPreview() && !U.md) { ART.SND.whistle(); U.md = { phase: 'preview' }; U.sheet = null; window.scrollTo(0, 0); break; } ART.SND.whistle(); if (inboxItems().some(i => i.kind === 'need')) U.sheet = { t: 'confirm' }; else { act('end', {}); return; } break;
    case 'review': { U.sheet = null; U.tab = 'inbox'; const f = inboxItems().find(i => i.kind === 'need'); U.open = f ? f.key : null; U.flash = ''; break; }
    case 'pw-ask': F.pwAsk(d.r); break;
    case 'pw-open': U.tab = 'inbox'; U.dept = null; U.open = 'pathway'; window.scrollTo(0, 0); break;
    case 'pw-change': r = F.pwChange(d.k); if (r && r.err) toast(r.err); else if (r) U.flash = r.out; break;
    case 'auth': r = F.setAuth(d.r, +d.v); if (r && r.err) toast(r.err); else if (r && r.out) toast(r.out); break;
    case 'second': r = F.secondOpinion(+d.m); if (r && r.err) toast(r.err); break;
    case 'brief': r = F.answerBrief(+d.b, +d.i); if (r && r.err) toast(r.err); else if (r && U.open) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.card(); ART.vib(15); advance(); } break;
    case 'prop': r = F.decideProposal(+d.i, d.c); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; if (U.open && (d.c === 'approve' || d.c === 'reject') && !(g.meeting.items.some(x => x.status === 'open'))) advance(); } break;
    case 'end': if (G().phase === 'season') { mdKick(); break; } { U.sheet = null; const res = F.endWeek(); if (!res) break; saveGame(); U.tab = 'inbox'; U.open = null; U.flash = ''; U.filt = 'all'; window.scrollTo(0, 0); if (res.ours) startTicker(res.ours, res.cup); else if (res.cup) startTicker(res.cup); return; }
    case 'replay': if (g.lastMatch) { U.md = { phase: 'match', m: g.lastMatch, replay: true, out: [], ft: false }; MDP.cur = null; window.scrollTo(0, 0); } break;
    case 'ed-open': U.edI = +d.i; window.scrollTo(0, 0); break;
    case 'tick-skip': U.ticker.i = U.ticker.match.ev.length; clearTimeout(tick.h); break;
    case 'tick-speed': U.ticker.fast = !U.ticker.fast; break;
    case 'tick-close': { const nx = U.ticker.next; clearTimeout(tick.h); U.ticker = null; U.sheet = null; if (nx) { startTicker(nx, null); return; } window.scrollTo(0, 0); break; }
    case 'sheet': U.sheet = { t: d.s, r: d.r }; if (d.s === 'mand') U.draft = Object.assign({}, g.mand[d.r]); if (d.s === 'talk') { U.talkRole = d.r || null; U.talkOut = null; } break;
    case 'close': U.sheet = null; break;
    case 'tab-close': U.sheet = null; U.tab = d.t; window.scrollTo(0, 0); break;
    case 'veil': if (el === document.querySelector('.veil')) U.sheet = null; else return; break;
    case 'player': U.ptab = 'over'; U.sheet = { t: 'player', id: +d.id }; break;
    case 'mt-ans': if (d.k === 'sign') { U.signing = true; ART.SND.stamp(); ART.vib(40); setTimeout(() => { U.signing = false; F.sum2Answer(+d.i); saveGame(); render(); window.scrollTo(0, 0); }, 900); break; } ART.SND.card(); F.sum2Answer(+d.i); break;
    case 'sound': ART.SND.toggle(); break;
    case 'tk-ans': F.tkAnswer(+d.i); break;
    case 'tk-pause': G().sum.tk.run = !G().sum.tk.run; break;
    case 'tk-skip': F.tkSkip(); window.scrollTo(0, 0); break;
    case 's2-step': F.sum2Step(+d.i); window.scrollTo(0, 0); break;
    case 'db-talk': F.sum2Talk(d.k); break;
    case 's2-finish': clearTimeout(U.ddT); F.sum2Finish(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break;
    case 'mand-tab': U.mandOpen = d.r; break;
    case 'ptab': U.ptab = d.v; break;
    case 'lfull': U.lfull = !U.lfull; break;
    case 'sub': if (d.v === 'academy' || d.v === 'first') { U.tab = 'staff'; U.dept = d.v; U.dtab = d.v === 'academy' ? 'data' : 'over'; } else U.sub = d.v || null; U.tray = ''; window.scrollTo(0, 0); break;
    case 'dept': U.dept = d.k || null; U.dtab = d.v || 'over'; U.tray = ''; window.scrollTo(0, 0); break;
    case 'dtab': U.dtab = d.v; window.scrollTo(0, 0); break;
    case 'dbud': { const rr = F.deptBudSet(d.k, F.deptBudView().rows.find(x => x.k === d.k).v + (+d.v)); if (rr && rr.capped && +d.v > 0) toast('Over the limit Finance allows. Cut another department first.'); ART.SND.click(); break; }
    case 'dcand': U.sheet = { t: 'dcand', k: d.k, r: d.r }; break;
    case 'dhire': r = F.deptHire(d.k, d.r, +d.i); U.sheet = null; if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); ART.vib(30); } break;
    case 'dletgo': r = F.deptLetGo(d.k, +d.id); if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; } break;
    case 'dinbox': U.tab = 'inbox'; U.open = d.key; U.dept = null; window.scrollTo(0, 0); break;
    case 'ft-talk': r = F.ftTalkStart(); if (r && r.err) { toast(r.err); return; } U.tab = 'staff'; U.dept = 'first'; ART.SND.ring(); window.scrollTo(0, 0); break;
    case 'ft-ans': F.ftTalkAnswer(d.id); ART.SND.card(); ART.vib(15); break;
    case 'ft-talk-close': F.ftTalkClose(); U.tray = ''; window.scrollTo(0, 0); break;
    case 'ft-buy': r = F.ftResBuy(d.k); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); } break;
    case 'ft-cancel': r = F.ftResCancel(d.k); if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; } break;
    case 'ft-sackq': U.sheet = { t: 'sack' }; break;
    case 'ft-sack': r = F.ftSack(); U.sheet = null; if (r && r.err) toast(r.err); else { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); U.dtab = 'over'; window.scrollTo(0, 0); } break;
    case 'sqtable': U.sqTable = d.v != null ? d.v === '1' : !U.sqTable; break;
    case 'com-offer': r = F.comOffer(d.k); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND[d.k === 'reject' ? 'click' : 'stamp'](); } break;
    case 'com-price': F.comSetPrice(d.k, +d.v); ART.SND.click(); break;
    case 'com-exp': r = d.v === 'up' ? F.comExpUp() : F.comExpDown(); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); } break;
    case 'rx-focus': r = F.rxFocus(d.k); if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; } ART.SND.click(); break;
    case 'rx-invest': r = F.rxInvest(d.k); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); } break;
    case 'ac-pick': r = F.acToggle(+d.id); if (r && r.err) toast(r.err); ART.SND.click(); break;
    case 'ac-confirm': r = F.acConfirm(); if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); } break;
    case 'biz-lv': r = F.bizSetLevel(d.k, d.v); ART.SND.click(); break;
    case 'biz-prop': F.bizPropose(); r = F.bizApply(); U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); break;
    case 'mk-camp': r = F.mkCamp(d.k); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; ART.SND.stamp(); } break;
    case 'mk-comm': F.mkComm(+d.v); ART.SND.click(); break;
    case 'com-promo': r = F.comPromo(); if (r && r.err) toast(r.err); else if (r) { U.flash = r.out; U.flashN = (U.flashN || 0) + 1; } break;
    case 'dept-go': U.tab = 'staff'; U.dept = d.k; U.dtab = d.v || 'over'; U.tray = ''; window.scrollTo(0, 0); break;
    case 'tour-reset': g.flags.tour = {}; U.sheet = null; break;
    case 'tour-ok': g.flags.tour = Object.assign({}, g.flags.tour, { [d.k]: 1 }); if (d.k === 'inbox') g.flags.howto = true; break;
    case 'preset': { const vals = PRESETS[d.r][+d.i][1], tgt = d.p === 'md' ? U.draft : g.mand[d.r]; Object.assign(tgt, vals); ART.SND.card(); break; }
    case 'ru-set': { const tgt = d.p === 'md' ? U.draft : g.mand[d.r]; tgt[d.k] = d.v; ART.SND.click(); break; }
    case 'sum-step': F.sumStep(+d.i); window.scrollTo(0, 0); break;
    case 'sum-ctr': F.sumContract(+d.id, d.v); break;
    case 'sum-ctr-all': for (const o of F.sumView().contracts) if (!o.c.out) F.sumContract(o.p.id, o.c.advice); break;
    case 'loan-out': F.loanOut(+d.id); break;
    case 'sum-sell': F.sumToggleSell(+d.id); break;
    case 'sum-round': F.sumRound(); window.scrollTo(0, 0); break;
    case 'sum-ans': F.sumAnswer(+d.m, +d.i); break;
    case 'sqv-rec': U.sheet = { t: 'reclist' }; break;
    case 'dd-start': F.ddStart(); break;
    case 'dd-dec': F.ddDecide(+d.i); U.ddDecEnd = null; break;
    case 'dd-pause': G().sum.dd.run = !G().sum.dd.run; break;
    case 'dd-skip': F.ddSkip(); break;
    case 'sum-finish': clearTimeout(U.ddT); F.sumFinish(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break;
    case 'sqv': if (d.v === 'rec') { U.tab = 'staff'; U.dept = 'recruit'; U.dtab = 'data'; } window.scrollTo(0, 0); break;
    case 'target': U.recMsg = ''; U.ptab = 'over'; U.sheet = { t: 'target', id: +d.id }; break;
    case 'recact': U.recMsg = F.recAction(+d.id, d.v); break;
    case 'recplan': U.sheet = { t: 'recplan' }; break;
    case 'rec-prio': F.recTogglePrio(d.p, d.k); break;
    case 'rec-kind': F.recSetKind(d.p, d.k); break;
    case 'rec-appr': g.mand.dof = g.mand.dof || {}; g.mand.dof.approve = d.v; break;
    case 'prio-all': U.prioAll = true; break;
    case 'mand-save': r = F.setMandate(U.sheet.r, U.draft); if (r.err) toast(r.err); else { U.sheet = null; toast(r.out); } break;
    case 'talk-who': U.talkRole = d.r; U.talkOut = null; break;
    case 'talk-do': r = F.talk(U.talkRole, d.t); if (r.err) toast(r.err); else U.talkOut = r.out; break;
    case 'push': r = F.push(d.d); if (r.err) toast(r.err); else { U.sheet = null; toast(r.out); } break;
    case 'hire': F.hire(d.r, +d.i); U.sheet = null; toast(`${F.staff(d.r).name} appointed. Check the mandate.`); break;
    case 'fire': r = F.fire(d.r); U.sheet = null; if (r.err) toast(r.err); else toast(r.out); break;
    case 'sq': U.sq = d.v; break;
    case 'acad-open': U.sub = 'academy'; window.scrollTo(0, 0); break;
    case 'acad-close': U.dept = null; window.scrollTo(0, 0); break;
    case 'ag': U.ag = d.v; break;
    case 'ysack': { const ns = F.acadSack(d.r); toast(ns ? `${ns.name} takes over.` : 'Replaced. The post stays vacant until a Director is appointed.'); break; }
    case 'pre-step': g.pre.step = +d.i; window.scrollTo(0, 0); break;
    case 'pre-target': F.preSetTarget(d.k); break;
    case 'pre-focus': F.preToggleFocus(d.k); break;
    case 'pre-acad': g.pre.acad = g.pre.acad === d.k ? null : d.k; break;
    case 'pre-done': F.finishPreseason(); U.pressI = 0; U.quote = null; window.scrollTo(0, 0); break;
    case 'howto': g.flags.howto = true; break;
    case 'lt': U.lt = +d.t; break;
    case 'next-season': F.startSeason(); U.pressI = 0; U.quote = null; U.lt = null; window.scrollTo(0, 0); break;
  }
  saveGame(); render();
}
let SW = null, SR = null, noClick = 0;
document.addEventListener('pointerdown', e => { const r = e.target.closest('.ir.dis'); if (!r) return; SR = { r, x0: e.clientX, y0: e.clientY, dx: 0 }; });
document.addEventListener('pointermove', e => { if (!SR) return; const dx = e.clientX - SR.x0; if (Math.abs(e.clientY - SR.y0) > 24 && Math.abs(dx) < 20) { SR = null; return; } SR.dx = Math.min(0, dx); if (SR.dx < -8) { SR.r.style.transform = `translateX(${SR.dx}px)`; SR.r.style.opacity = String(1 + SR.dx / 300); } });
const srEnd = () => { if (!SR) return; const { r, dx } = SR; SR = null; r.style.transition = 'transform .2s, opacity .2s'; if (dx < -90) { noClick = Date.now(); r.style.transform = 'translateX(-110%)'; r.style.opacity = '0'; setTimeout(() => act('dismiss', { k: r.dataset.k }), 180); } else { if (dx < -8) noClick = Date.now(); r.style.transform = ''; r.style.opacity = ''; } };
document.addEventListener('pointerup', srEnd); document.addEventListener('pointercancel', srEnd);
document.addEventListener('pointerdown', e => { const c = e.target.closest('.swipe'); if (!c || e.target.closest('button')) return; SW = { c, x0: e.clientX, dx: 0 }; c.setPointerCapture(e.pointerId); c.style.transition = 'none'; });
document.addEventListener('pointermove', e => { if (!SW) return; SW.dx = e.clientX - SW.x0; SW.c.style.transform = `translateX(${SW.dx}px) rotate(${SW.dx / 18}deg)`; const R = SW.c.querySelector('.stampR'), L = SW.c.querySelector('.stampL'); if (R) R.style.opacity = Math.max(0, SW.dx / 90); if (L) L.style.opacity = Math.max(0, -SW.dx / 90); });
const swEnd = () => { if (!SW) return; const { c, dx } = SW; SW = null; c.style.transition = 'transform .28s'; if (Math.abs(dx) > 110) { c.style.transform = `translateX(${dx > 0 ? 480 : -480}px) rotate(${dx > 0 ? 22 : -22}deg)`; ART.SND[dx > 0 ? 'stamp' : 'click'](); ART.vib(25); const i = c.dataset.i; setTimeout(() => act('prop', { i, c: dx > 0 ? 'approve' : 'reject' }), 220); } else { c.style.transform = ''; c.querySelectorAll('.stampR,.stampL').forEach(x => x.style.opacity = 0); } };
document.addEventListener('pointerup', swEnd); document.addEventListener('pointercancel', swEnd);
document.addEventListener('keydown', e => { const c = e.target.closest && e.target.closest('.swipe'); if (!c) return; if (e.key === 'ArrowRight') act('prop', { i: c.dataset.i, c: 'approve' }); if (e.key === 'ArrowLeft') act('prop', { i: c.dataset.i, c: 'reject' }); });
document.addEventListener('click', e => { const t = e.target.closest('[data-a]'); if (!t) return; if (t.disabled) return; if (Date.now() - noClick < 350 && t.matches('.ir')) return; act(t.dataset.a, t.dataset, e.target); });
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button][data-a]')) { e.preventDefault(); act(e.target.dataset.a, e.target.dataset, e.target); } if (e.key === 'Escape' && U.sheet && U.sheet.t !== 'ticker') { U.sheet = null; render(); } });
document.addEventListener('input', e => {
  const t = e.target; if (!t.dataset.sl) return; const v = +t.value, role = t.dataset.sl, k = t.dataset.k, lab = document.getElementById('v-' + t.dataset.p + '-' + k); if (lab) lab.textContent = v;
  t.style.setProperty('--v', v + '%'); const sy = document.getElementById('says-' + t.dataset.p + '-' + k); if (sy) { const D = F.MAND[role].sl.find(x => x[0] === k); sy.textContent = says(role, k, v, D[1], D[2]); }
  if (t.dataset.p === 'md') { U.draft[k] = v; const m = document.querySelector('.sheet .meter .num'), b = document.querySelector('.sheet .meter .bar i'); const al = previewAlign(role, U.draft); if (m) { m.textContent = al; b.style.width = al + '%'; } }
  else { G().mand[role][k] = v; const m = document.querySelector('.setup .meter .num'), b = document.querySelector('.setup .meter .bar i'); const al = F.alignment(); if (m) { m.textContent = al; b.style.width = al + '%'; } }
});
document.addEventListener('change', e => {
  const t = e.target; if (t.dataset.sl && t.dataset.p === 'pb') { saveGame(); render(); return; } if (t.dataset.sl && t.dataset.p !== 'md') { saveGame(); return; } if (!t.dataset.ru) return; const role = t.dataset.ru, k = t.dataset.k;
  if (t.dataset.p === 'md') { U.draft[k] = t.value; render(); } else { G().mand[role][k] = t.value; U.mandOpen = role; saveGame(); render(); }
});

/* ---------- boot ---------- */
U.title = true;
if (hasSave()) { /* offer continue on the title page */ }
render();
}
