/* ---------- match day: preview, match, gazette (full screens) ---------- */
const MDPAL = ['#1d4ed8', '#b91c1c', '#15803d', '#111', '#f59e0b', '#7c3aed', '#0e7490', '#be185d'];
const mdOppCols = id => [MDPAL[(id * 7 + 3) % MDPAL.length], '#fff'];
const mdClean = t => String(t || '').replace(/\s*\(xG [\d.]+\)/, '');
const mdP = id => { const g = G(); return g.squad.find(x => x.id === id) || (g.academy || []).find(x => x.id === id) || null; };
F.storyOf = p => storyOf(p)[0];
function mdStadium(home, oc, night, rain, fill) {
  const g = G(), c1 = g.club.colors[0], c2 = g.club.colors[1], sky = night ? ['#1b2440', '#3b3a62'] : rain ? ['#8e9aa6', '#c9d0d4'] : ['#a9d3ee', '#e7f1f2'], fl = fill == null ? 1 : fill;
  let crowd = ''; for (let r = 0; r < 4; r++) for (let i = 0; i < 46; i++) { const x = 6 + i * 8.4 + (r % 2) * 4, y = 74 + r * 9, away = home ? i > 38 : i < 30; if (((i * 37 + r * 11) % 100) / 100 >= fl) continue; crowd += `<circle cx="${x}" cy="${y}" r="3.1" fill="${away ? oc[0] : (i + r) % 3 ? c1 : c2}"/>`; }
  return `<svg viewBox="0 0 390 170" width="100%" class="mdstad" aria-hidden="true"><defs><linearGradient id="mdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient><radialGradient id="mdglow"><stop offset="0" stop-color="#fff7cf" stop-opacity=".9"/><stop offset="1" stop-color="#fff7cf" stop-opacity="0"/></radialGradient></defs>
  <rect width="390" height="170" fill="url(#mdsky)"/>${night ? '<circle cx="320" cy="26" r="9" fill="#f4efd8"/>' : rain ? '' : '<circle cx="320" cy="28" r="14" fill="#f3d36b" stroke="#16201b" stroke-width="2.5"/>'}${rain ? Array.from({ length: 40 }, (_, k) => `<path d="M${(k * 47) % 390} ${(k * 29) % 60}l-4 10" stroke="#e8eef2" stroke-width="1.5" opacity=".7"/>`).join('') : ''}
  ${[24, 366].map(x => `<g><rect x="${x - 2}" y="14" width="4" height="56" fill="#16201b"/><rect x="${x - 12}" y="8" width="24" height="10" rx="2" fill="#e8e4d6" stroke="#16201b" stroke-width="2"/>${night ? `<circle cx="${x}" cy="13" r="34" fill="url(#mdglow)"/>` : ''}</g>`).join('')}
  <path d="M0 64h390v52H0z" fill="#2b3440" stroke="#16201b" stroke-width="3"/><path d="M0 64h390v6H0z" fill="${c1}"/>${crowd}
  <path d="M0 114h390v56H0z" fill="#3d7a4f"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${i * 70} 114h35v56h-35z" fill="#468a5a"/>`).join('')}<path d="M0 114h390" stroke="#16201b" stroke-width="3"/><path d="M195 114v56M155 170a40 22 0 0 1 80 0" stroke="#f4f4ec" stroke-width="2.5" fill="none" opacity=".85"/></svg>`;
}
const mdForm = arr => `<span class="mdform">${(arr || []).slice(-5).map(r => `<i class="f${r}">${r}</i>`).join('') || '<small>no games yet</small>'}</span>`;
function mdPreview() {
  const g = G(), P = F.mtPreview(); if (!P) { U.md = null; return vInbox(); }
  const oc = mdOppCols(P.id), us = [g.club.colors, g.club.short], them = [oc, oppShort(P.name)], L = P.home ? us : them, R = P.home ? them : us;
  const S = F.mdStories(), coach = F.staff('coach'), box = inboxItems().filter(isBox).length, BG = F.goalView ? F.goalView() : null;
  const gap = P.pos - P.mine, WX = F.wxFor ? F.wxFor(g.season, g.week, P.id) : {}, FILL = P.home && g.club.cap ? Math.min(1, F.attendance() / g.club.cap) : 0.75;
  const sky = `${WX.night ? 'Evening kick-off' : 'Afternoon kick-off'}${WX.rain ? ', rain forecast' : ''}${P.home && g.club.cap ? `. Expected crowd ${Math.round(FILL * 100)}% of capacity` : ''}.`;
  const stake = P.rival ? 'Derby day. Bragging rights for a year.' : P.odds === 'Favourites' ? 'We are expected to win this. Anything less will be noticed.' : P.odds === 'Underdogs' ? 'Nobody expects anything from us. A point would be a good day.' : Math.abs(gap) <= 3 && P.pos < P.mine ? 'They are just above us. Win and we could go past them.' : 'An even game on paper. Small things will decide it.';
  const cl = !coach ? '' : P.odds === 'Underdogs' ? (coach.p.ego > 14 ? '"Everyone writes us off. Good."' : '"We are not favourites. We will make it hard for them."') : P.odds === 'Favourites' ? '"We should win this. No complacency."' : '"Fine margins. Whoever wants it more."';
  return `<div class="mds mdpv"><div class="mdscr">
  <header class="mdpvh">${mdStadium(P.home, oc, WX.night, WX.rain, FILL)}<div class="mdpvb"><div class="mdpvt">${crest(L[0], L[1], 50)}<b>${esc(L[1])}</b></div><div class="mdpvv"><span>${P.home ? 'HOME' : 'AWAY'}</span><b>vs</b><small>Week ${g.week}</small></div><div class="mdpvt">${crest(R[0], R[1], 50)}<b>${esc(R[1])}</b></div></div></header>
  <div class="mdpad"><div class="mdkick"><span>Matchday, week ${g.week}</span><span>${esc(F.TIERS[g.club.tier])}</span></div>
  <h1 class="mdpvn">${esc(P.home ? g.club.name : P.name)} <i>v</i> ${esc(P.home ? P.name : g.club.name)}</h1>
  <div class="mdtbl"><div><small>Us</small><b>${F.ord(P.mine)}</b>${mdForm(g.form)}</div><div><small>${esc(P.name)}</small><b>${F.ord(P.pos)}</b>${mdForm(P.fm)}</div></div>
  <p class="mdsky small">${esc(sky)}</p><p class="mdstake"><b>At stake.</b> ${esc(stake)}${BG && BG.done == null ? ` ${esc(BG.t)} goal: ${BG.got} of ${BG.need} points, ${BG.left} game${BG.left === 1 ? '' : 's'} left.` : ''}</p>
  ${S.length ? `<h2 class="mdsh">Our story this week</h2><div class="mdstories">${S.map((x, i) => { const p = mdP(x.pid); if (!p) return ''; return `<button class="mdstory" style="--d:${i * 90}ms" data-a="player" data-id="${p.id}" aria-label="Open profile of ${esc(p.name)}"><span class="mdsf">${ART.playerFace(p)}</span><span class="mdst"><em>${esc(x.tag)}</em><b>${esc(p.name)}<small>${esc(F.POS_L[p.pos])}, ${p.age}</small></b><span>${esc(x.t)}</span></span></button>`; }).join('')}</div>` : ''}
  ${P.star ? `<div class="mddanger"><span class="mddg">!</span><p><b>Watch out for ${esc(P.star.name)}.</b> ${esc(P.sty.t)} side: ${esc(P.sty.d.toLowerCase())}.</p></div>` : ''}
  ${coach ? `<div class="mdcoach"><span class="mdcf">${ART.staffFace('coach')}</span><p>${esc(cl)}<small>${esc(coach.name)}, head coach</small></p></div>` : ''}
  </div></div><div class="mdfoot">${box ? `<p class="mdboxw"><b>${box} still in your red box.</b> Kick off and your staff answer ${box === 1 ? 'it' : 'them'}.</p>` : ''}<div class="mdrow"><button class="mdback" data-a="md-close" aria-label="Back to the inbox">${ART.I.back}</button><button class="mdko" data-a="md-kick">Kick off</button></div></div></div>`;
}
function mdTeams(m) { const g = G(), oc = mdOppCols(m.opp), us = { c: g.club.colors, s: g.club.short }, th = { c: oc, s: oppShort(m.oppName) }; return m.home ? [us, th] : [th, us]; }
/* ---------- the match screen (B53): score bars with scorers, status, the one-line ticker, possession, panels, info band ----------
   Every block has a fixed height; only the text inside changes. The beats come from F.matchBeats (commentary.js); key events are added
   when the ticker tells their outcome, so the list never runs ahead of the commentary. */
function mwSide(m, us) { return us ? 'us' : 'them'; }
function mdMatch() {
  const g = G(), s = U.md, m = s.m, H = m.home, [L, R] = mdTeams(m), nm = n => (n || '').split(' ')[0];
  const HN = H ? g.club.name : m.oppName, AN = H ? m.oppName : g.club.name, bar = (c, n, id) => `<div class="mw-sb" style="background:${c[0]};color:${c[1] || '#fff'}"><span class="n">${esc(nm(n))}</span><span class="g" id="${id}" style="border-color:${c[0]}">0</span></div>`;
  const wx = m.wx || {}, info = `<span>Ref: ${esc(m.referee || 'The referee')}</span><span>${m.home && m.att ? 'Crowd: ' + Math.round(m.att).toLocaleString('en-GB') : 'Away day'}</span><span>${wx.rain ? 'Rain' : 'Dry'}, ${wx.night ? 'evening' : 'afternoon'}</span>`;
  return `<div class="mds mdm mw" id="mw" style="--mw-h:${L.c[0]};--mw-a:${R.c[0]}">
  <div class="mw-bars" aria-label="Score">${bar(L.c, HN, 'mw-hg')}${bar(R.c, AN, 'mw-ag')}</div>
  <div class="mw-scr" aria-label="Scorers"><div id="mw-hs"></div><div id="mw-as"></div></div>
  <div class="mw-stt"><b id="mw-clk">0'</b><span id="mw-half">First half</span><span class="r" id="mw-cmp">${esc(m.comp === 'Cup' ? 'National Cup' + (m.rd ? ', ' + m.rd : '') : F.TIERS[g.club.tier])}</span></div>
  <div class="mw-tk" id="mw-tk" aria-live="polite"><i class="side" id="mw-side"></i><p id="mw-tl"></p></div>
  <div class="mw-ps" aria-label="Possession, last five minutes"><small>Last 5 mins</small><div class="mw-pb" id="mw-pb"><span id="mw-ph" style="background:${L.c[0]};color:${L.c[1] || '#fff'}"></span><span id="mw-pa" style="background:${R.c[0]};color:${R.c[1] || '#fff'}"></span></div></div>
  <div class="mw-tabs" role="tablist">${['Key events', 'Stats', 'Report'].map((t, i) => `<button role="tab" data-a="mw-tab" data-i="${i}" id="mw-t${i}" aria-selected="${i === (s.tab || 0)}">${t}</button>`).join('')}</div>
  <div class="mw-pn"><div id="mw-p0"${(s.tab || 0) === 0 ? '' : ' hidden'}></div><div id="mw-p1"${s.tab === 1 ? '' : ' hidden'}></div><div id="mw-p2"${s.tab === 2 ? '' : ' hidden'}></div></div>
  <div class="mw-inf">${info}</div>
  <div class="mw-ctl" id="mw-ctl"></div>
  <div class="mw-ven">${esc(m.home ? g.club.city + ', home' : nm(m.oppName) + ', away')}</div></div>`;
}
const MDP = {
  start() {
    const s = U.md, m = s.m, root = document.getElementById('mw'); if (!root) return;
    const fresh = this.cur !== m || this.again; this.again = false;
    if (fresh) { clearTimeout(this.t); this.lastStep = { m: 0, t: 'The teams are out. Kick-off is moments away.', side: null }; this.htq = false; this.htNow = false; this.cur = m; this.build(m); this.i = 0; this.min = 0; this.paused = false; this.done = false; this.shownKeys = []; this.sh = { us: 0, them: 0 }; this.sot = { us: 0, them: 0 }; this.xg = { us: 0, them: 0 }; this.goalsShown = []; }
    this.root = root; this.paint();
    if (s.ft) { this.finish(true); return; }
    if (fresh) this.t = setTimeout(() => this.step(), 300); else if (!this.done && !this.paused) { clearTimeout(this.t); this.t = setTimeout(() => this.step(), 120); }
  },
  build(m) {
    const g = G(), H = m.home, stories = ((g.mdS && g.mdS.list) || []).map(x => { const p = mdP(x.pid); return p ? { name: p.name, tag: x.tag, t: x.t } : null; }).filter(Boolean);
    const B = F.matchBeats ? F.matchBeats(m, { stories }) : []; this.m = m; this.H = H; this.hS = H ? 'us' : 'them'; this.aS = H ? 'them' : 'us';
    const KEY = (m.feed || []).filter(e => ['goal', 'red', 'yellow', 'sub', 'injury', 'ht'].includes(e.k)), used = new Set(), steps = [];
    const keyFor = mo => { const e = KEY.find(e => !used.has(e) && e.m === mo.m && e.k === mo.k && (e.k === 'ht' || e.side === mo.side)); if (e) used.add(e); return e || null; };
    for (const mo of B) { if (mo.k === 'ft') continue; const ke = keyFor(mo); let given = false;
      for (const b of mo.beats) { if (b.k === 'pause') { steps.push({ m: mo.m, pause: true, hold: b.hold }); continue; } const parts = b.t.length > 48 ? b.t.split(/(?<=[.!?])\s+(?=[A-Z"'])/).flatMap(t => t.length > 50 && /: /.test(t) ? [t.replace(/: .*/, '.'), t.replace(/^[^:]*: /, '').replace(/^./, c => c.toUpperCase())] : [t]) : [b.t]; // one line in the ticker: a long two-sentence beat becomes two lines
        parts.forEach((t, j) => { const last = j === parts.length - 1, st = { m: mo.m, t, side: mo.side, goal: !!b.goal && last, red: mo.k === 'red' && b.k === 'out', after: b.k === 'after', hold: Math.round((b.hold || 600) * (parts.length > 1 ? 0.75 : 1)), ht: mo.k === 'ht' && last }; if (last && ke && !given && b.k === 'out') { st.key = ke; given = true; } steps.push(st); }); } }
    const has = new Set(B.map(x => x.m)), poss = m.poss || [], nm = n => n.split(' ')[0];
    for (let mm = 2; mm <= 93; mm += 4) { if ([0, 1, 2, 3].some(k => has.has(mm + k))) continue; const p = poss[Math.min(poss.length - 1, Math.floor((mm - 1) / 5))] || 50, us = p >= 50, T = us ? nm(g.club.name) : nm(m.oppName);
      steps.push({ m: mm, t: [`${T} keep the ball in midfield.`, `${T} pass it across the back.`, `A spell of possession for ${T}.`, `${T} probe, looking for an opening.`][mm % 4], side: us ? 'us' : 'them', hold: 450 }); }
    steps.sort((a, b) => a.m - b.m); this.steps = steps; const est = steps.reduce((a, x) => a + (x.hold || 0), 0) * 0.8 + 94 * 75; this.k = Math.max(0.65, Math.min(1.2, 40000 / est)); // every match lasts about 40 seconds this.orphan = KEY.filter(e => !used.has(e)); this.KEY = KEY;
  },
  sp(ms) { return MAIL_RM ? Math.min(ms, 120) : ms * (this.fast ? 0.4 : 0.8) * (this.k || 1); },
  sc2(s) { return this.H ? [s.us, s.them] : [s.them, s.us]; },
  $(id) { return document.getElementById(id); },
  paint() { // put the current state into a freshly rendered screen
    this.ctl(); this.clock(Math.max(0, this.min)); this.poss(Math.max(1, this.min)); this.stats(); this.report(); this.scorers();
    const [h, a] = this.sc2(this.score()); if (this.$('mw-hg')) { this.$('mw-hg').textContent = h; this.$('mw-ag').textContent = a; }
    const p0 = this.$('mw-p0'); if (p0) { p0.innerHTML = this.shownKeys.length ? '' : '<div class="mw-empty">Goals, cards and changes appear here as they happen.</div>'; for (const e of this.shownKeys) p0.appendChild(this.keyRow(e)); p0.scrollTop = p0.scrollHeight; }
    if (this.lastStep) this.ticker(this.lastStep, true);
  },
  score() { const gs = this.goalsShown; return { us: gs.filter(e => e.side === 'us').length, them: gs.filter(e => e.side === 'them').length }; },
  ctl() { const c = this.$('mw-ctl'); if (!c) return; const s = U.md;
    if (this.htq) { c.innerHTML = `<button data-a="md-ht" data-v="in">Go in</button><button data-a="md-ht" data-v="out">Leave it to ${esc(F.staff('coach') ? F.staffName('coach').split(' ')[0] : 'the coach')}</button><span></span>`; return; }
    if (this.done) { c.innerHTML = `<button class="k" data-a="md-after">${s.replay ? 'Back' : s.cup ? 'To the cup tie' : 'Read the Gazette'}</button><button data-a="mw-again">Watch again</button><span></span>`; return; }
    c.innerHTML = `<button data-a="mw-pause">${this.paused ? 'Resume' : 'Pause'}</button><button data-a="md-speed">${this.fast ? 'Normal' : '2× speed'}</button><button class="k" data-a="md-skip">Full time</button>`; },
  clock(mm) { const c = this.$('mw-clk'); if (!c) return; c.textContent = (mm > 90 ? '90+' + (mm - 90) : mm) + "'"; const h = this.$('mw-half'); if (h && !this.done) h.textContent = this.htNow ? 'Half-time' : mm <= 45 ? 'First half' : mm <= 90 ? 'Second half' : 'Stoppage time';
    const ht = this.KEY.find(e => e.k === 'ht'), cmp = this.$('mw-cmp'); if (cmp && ht && mm > 45 && !/HT /.test(cmp.textContent)) cmp.textContent += ' · HT ' + this.sc2(ht.score).join('–'); },
  poss(mm) { const p = (this.m.poss || [50])[Math.min((this.m.poss || [50]).length - 1, Math.floor((Math.max(1, mm) - 1) / 5))], h = this.H ? p : 100 - p, pb = this.$('mw-pb'); if (!pb) return; pb.style.gridTemplateColumns = `${h}fr ${100 - h}fr`; this.$('mw-ph').textContent = h + '%'; this.$('mw-pa').textContent = (100 - h) + '%'; },
  stats() { const el = this.$('mw-p1'); if (!el) return; const r = (l, k) => { const [a, b] = this.sc2(k); return `<b>${a}</b><span>${l}</span><b class="r">${b}</b>`; }, poss = (this.m.poss || []).slice(0, Math.max(1, Math.ceil(this.min / 5))), pu = Math.round(poss.reduce((a, b) => a + b, 0) / Math.max(1, poss.length));
    el.innerHTML = `<div class="mw-sx">${r('Shots', this.sh)}${r('On target', this.sot)}${r('Expected goals', { us: this.xg.us.toFixed(1), them: this.xg.them.toFixed(1) })}${r('Possession', { us: pu + '%', them: (100 - pu) + '%' })}</div>`; },
  report() { const el = this.$('mw-p2'); if (!el) return; const m = this.m, g = G();
    if (!this.done) { el.innerHTML = '<div class="mw-rp"><h4>Match report</h4><p>Why we won or lost follows at full time.</p></div>'; return; }
    const res = m.cupWin != null ? (m.cupWin ? 'A win' : 'A defeat') : m.ug > m.tg ? 'A win' : m.ug < m.tg ? 'A defeat' : 'A draw', motm = g.squad.find(p => p.name === m.motm), out = (U.md && U.md.out) || [];
    el.innerHTML = `<div class="mw-rp"><h4>${res}, ${this.sc2({ us: m.ug, them: m.tg }).join('–')}${m.pens ? ', ' + esc(m.pens) : ''}</h4>${motm ? `<p><b>${m.ug < m.tg ? 'Our best player' : 'Player of the match'}:</b> ${esc(motm.name)}${motm.lastRat ? ', ' + motm.lastRat.toFixed(1) : ''}</p>` : ''}${m.why && m.why.length ? `<ul>${m.why.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}${out.length ? `<h4>How the stories ended</h4><ul>${out.map(o => `<li>${esc(o.t)}</li>`).join('')}</ul>` : ''}</div>`; },
  scorers() { const m = this.m, sur = n => n ? n.split(' ').slice(-1)[0] : '', by = side => this.goalsShown.filter(e => e.side === side).reduce((o, e) => { (o[sur(e.who)] = o[sur(e.who)] || []).push(e.m > 90 ? '90+' + (e.m - 90) : e.m); return o; }, {});
    const f = o => Object.entries(o).map(([n, ms]) => `<b>${esc(n)}</b> <span>${ms.join(', ')}</span>`).join(' · '), hs = this.$('mw-hs'); if (!hs) return; hs.innerHTML = f(by(this.hS)); this.$('mw-as').innerHTML = f(by(this.aS)); },
  keyRow(e) { const sur = n => n ? n.split(' ').slice(-1)[0] : '', row = document.createElement('div');
    if (e.k === 'ht') { row.className = 'mw-row ht'; row.innerHTML = `<span>HALF-TIME, ${this.sc2(e.score).join('–')}</span>`; return row; }
    if (e.k === 'et') { row.className = 'mw-row ht'; row.innerHTML = `<span>${esc(e.t)}</span>`; return row; }
    const home = e.side === this.hS, ic = e.k === 'yellow' ? '<i class="ic yc"></i>' : e.k === 'red' ? '<i class="ic rc"></i>' : e.k === 'goal' ? '⚽' : e.k === 'sub' ? '⇄' : '✚';
    const txt = e.k === 'goal' ? `<span class="gl">${esc(sur(e.who))}</span> ${this.sc2(e.score).join('–')}` : e.k === 'sub' ? `<span class="sub">${esc(sur(e.inn))} for ${esc(sur(e.out))}</span>` : e.k === 'injury' ? `<span class="sub">${esc(sur(e.who))} injured</span>` : esc(sur(e.who));
    row.className = 'mw-row'; row.innerHTML = home ? `<span class="h">${txt} ${ic}</span><span class="mn">${e.m > 90 ? '90+' + (e.m - 90) : e.m}'</span><span class="a"></span>` : `<span class="h"></span><span class="mn">${e.m > 90 ? '90+' + (e.m - 90) : e.m}'</span><span class="a">${ic} ${txt}</span>`; return row; },
  addKey(e) { if (this.shownKeys.includes(e)) return; this.shownKeys.push(e); if (e.k === 'goal') { this.goalsShown.push(e); this.scorers(); } const p0 = this.$('mw-p0'); if (!p0) return; const em = p0.querySelector('.mw-empty'); if (em) em.remove(); p0.appendChild(this.keyRow(e)); p0.scrollTop = p0.scrollHeight; },
  count(mm) { for (const e of (this.m.feed || []).filter(e => e.m === mm)) if (['goal', 'save', 'miss', 'block'].includes(e.k)) { this.sh[e.side]++; this.xg[e.side] += e.xg || 0; if (e.k === 'goal' || e.k === 'save') this.sot[e.side]++; } this.stats(); },
  ticker(s, quiet) { const tk = this.$('mw-tk'); if (!tk) return; tk.className = 'mw-tk' + (s.goal ? ' goal' : s.red ? ' red' : s.after ? ' after' : ''); this.$('mw-side').className = 'side ' + (s.side ? (s.side === 'us') === this.H ? 'h' : 'a' : '');
    const p = this.$('mw-tl'); p.innerHTML = `<span class="m">${s.m > 90 ? '90+' + (s.m - 90) : s.m}'</span>${esc(s.t)}`; p.style.fontSize = ''; let f = parseFloat(getComputedStyle(p).fontSize); while (p.scrollWidth > p.clientWidth && f > 12) { f -= 1; p.style.fontSize = f + 'px'; }
    if (!quiet && s.goal) { const sc = this.score(), [h, a] = this.sc2(sc); this.$('mw-hg').textContent = h; this.$('mw-ag').textContent = a; const el = s.side === this.hS ? this.$('mw-hg') : this.$('mw-ag'); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); ART.SND[s.side === 'us' ? 'cheer' : 'bad'](); if (s.side === 'us') ART.vib([80, 40, 80]); } },
  alive() { return this.root && this.root.isConnected && U.md && U.md.m === this.m && !U.md.ft; },
  step() {
    if (this.done) return; if (!this.alive()) return; if (this.paused || this.htq) { this.t = setTimeout(() => this.step(), 200); return; }
    const s = this.steps[this.i]; if (!s) return this.finish();
    if (s.m > this.min) { this.min++; this.htNow = false; this.clock(this.min); this.count(this.min); this.poss(this.min); for (const e of this.orphan.filter(e => e.m === this.min)) this.addKey(e); this.t = setTimeout(() => this.step(), this.sp(this.steps[this.i] && this.steps[this.i].m > this.min + 1 ? 45 : 95)); return; }
    this.i++; if (s.pause) { const p = this.$('mw-tl'); if (p && !/…$/.test(p.textContent)) { p.innerHTML += ' …'; if (p.scrollWidth > p.clientWidth) p.innerHTML = p.innerHTML.slice(0, -2); } this.t = setTimeout(() => this.step(), this.sp(s.hold)); return; }
    if (s.key) this.addKey(s.key); this.lastStep = s; this.ticker(s);
    if (s.ht) { this.htNow = true; this.clock(45); ART.SND.whistle(); if (s.key && !U.md.htDone && F.mdHtOffer && F.mdHtOffer(this.m)) { this.htq = true; this.ctl(); return; } }
    this.t = setTimeout(() => this.step(), this.sp(s.hold));
  },
  resume() { this.htq = false; this.paused = false; this.ctl(); if (!this.done) { clearTimeout(this.t); this.t = setTimeout(() => this.step(), 200); } },
  finish(still) { clearTimeout(this.t); if (!U.md || U.md.m !== this.m) return; const m = this.m;
    for (let k = this.i; k < this.steps.length; k++) if (this.steps[k].key) { const e = this.steps[k].key; if (!this.shownKeys.includes(e)) { this.shownKeys.push(e); if (e.k === 'goal') this.goalsShown.push(e); } }
    for (let mm = this.min + 1; mm <= 94; mm++) { this.count(mm); for (const e of this.orphan.filter(e => e.m === mm)) if (!this.shownKeys.includes(e)) this.shownKeys.push(e); }
    if (m.pens && !this.shownKeys.some(e => e.k === 'et')) this.shownKeys.push({ k: 'et', t: (m.pens || '').toUpperCase() });
    this.i = this.steps.length; this.min = 94; this.done = true; this.htq = false; this.htNow = false;
    if (!still) { ART.SND.whistle(); U.md.ft = true; render(); return; }
    this.lastStep = { m: 94, t: `Full time. ${this.sc2({ us: m.ug, them: m.tg }).join('–')}${m.pens ? ', ' + m.pens : ''}.`, side: null };
    this.goalsShown = this.shownKeys.filter(e => e.k === 'goal'); const h = this.$('mw-half'); if (h) h.textContent = 'Full time';
    this.paint(); const [hh, aa] = this.sc2({ us: m.ug, them: m.tg }); this.$('mw-hg').textContent = hh; this.$('mw-ag').textContent = aa; this.clock(94); const hf = this.$('mw-half'); if (hf) hf.textContent = 'Full time'; },
  skip() { this.finish(); },
  ctlBack() { this.htq = false; this.ctl(); }
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
  ${sec(latest ? 'Your backers after the match' : 'Your backers that week', ed.bk.length ? `<div class="mdbks">${ed.bk.map(b => `<div><small>${esc(bkT(b.t))}</small><b>${esc(b.mood || F.backerMood(b.v))}</b><i class="${b.d > 0 ? 'up' : b.d < 0 ? 'dn' : ''}">${b.d > 0 ? '↑' : b.d < 0 ? '↓' : '='}</i></div>`).join('')}</div>` : '')}
  ${mode === 'inbox' && F.edCount() > 1 ? `<section class="mdnsec"><h3>Earlier editions</h3><div class="mdarch">${(g.eds || []).map((e, k) => `<button class="${k === (idx || 0) ? 'on' : ''}" data-a="ed-open" data-i="${k}" aria-pressed="${k === (idx || 0)}"><span>Week ${e.w}${e.s !== g.season ? `, season ${e.s}` : ''}</span><b>${esc(e.head || 'The Gazette')}</b></button>`).join('')}</div></section>` : ''}
  </div>`;
}
function mdPaper() {
  const g = G();
  return `<div class="mds mdnp"><div class="mdscr">${gzEdition(F.edView(0), 'flow', 0)}</div><div class="mdfoot"><button class="mdko" data-a="md-done">${g.phase === 'season' ? `Start week ${g.week}` : g.phase === 'sacked' ? 'Continue' : 'To the season review'}</button></div></div>`;
}
function vMatchday() { const s = U.md; return s.phase === 'preview' ? mdPreview() : s.phase === 'match' ? mdMatch() : mdPaper(); }
// the winter window opens once the last match screen before week 17 is closed (B50)
function mdWinter() { if (F.winterDue && F.winterDue() && F.winterOpen()) { clearTimeout(U.ddT); U.tab = 'inbox'; saveGame(); window.scrollTo(0, 0); } }
function mdKick() {
  const g = G(), wk = g.week, se = g.season, prevPos = F.myPos();
  const dec = g.inbox.filter(m => m.done && m.by === 'you' && m.season === se && m.week === wk).map(m => { const v = F.msgView(m); return { t: v.title, c: v.opts[v.choice].l }; });
  U.sheet = null; ART.SND.whistle();
  const res = F.endWeek(); if (!res) { U.md = null; return; } saveGame();
  U.tab = 'inbox'; U.open = null; U.flash = ''; U.filt = 'all';
  const first = res.ours || res.cup; if (!first) { U.md = null; mdWinter(); return; }
  if (res.cup && !res.ours) res.cup.cupWin = g.cup.log.length ? g.cup.log[g.cup.log.length - 1].win : null;
  if (res.cup && res.ours) res.cup.cupWin = g.cup.log.length ? g.cup.log[g.cup.log.length - 1].win : null;
  U.md = { phase: 'match', m: first, lg: res.ours || res.cup, cup: res.ours ? res.cup : null, out: res.ours ? (F.mdOutcomesShort || F.mdOutcomes)(res.ours) : [], tp: res.ours ? F.mdTurning(res.ours) : null, prevPos, dec, week: wk, ft: false };
  window.scrollTo(0, 0);
}

