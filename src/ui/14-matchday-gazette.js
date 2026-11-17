/* ---------- match day: preview, match, gazette (full screens) ---------- */
const MDPAL = ['#1d4ed8', '#b91c1c', '#15803d', '#111', '#f59e0b', '#7c3aed', '#0e7490', '#be185d'];
const mdOppCols = id => [MDPAL[(id * 7 + 3) % MDPAL.length], '#fff'];
const mdClean = t => String(t || '').replace(/\s*\(xG [\d.]+\)/, '');
const mdP = id => { const g = G(); return g.squad.find(x => x.id === id) || (g.academy || []).find(x => x.id === id) || null; };
F.storyOf = p => storyOf(p)[0];
// Text-mode match preview deliberately generates no stadium or pitch drawings.
function mdStadium() { return ''; }
function mdPitch() { return ''; }
const MD_BALL = '';
const mdForm = arr => `<span class="mdform">${(arr || []).slice(-5).map(r => `<i class="f${r}">${r}</i>`).join('') || '<small>no games yet</small>'}</span>`;
function mdPreview() {
  const g = G(), P = F.mtPreview();
  if (!P) { U.md = null; return vInbox(); }
  const S = F.mdStories(), coach = F.staff('coach');
  const box = inboxItems().filter(isBox).length, BG = F.goalView ? F.goalView() : null;
  const ours = P.home ? g.club.name : P.name, opp = P.home ? P.name : g.club.name;
  const stake = P.rival ? 'A derby. More than three points for the supporters.' :
    P.odds === 'Favourites' ? 'The pressure is on us to win.' :
    P.odds === 'Underdogs' ? 'A result here would surprise the division.' :
    Math.abs(P.pos - P.mine) <= 3 ? 'A direct contest with a team close in the table.' :
    'An ordinary fixture, but an important step in the season.';
  const form = a => (a || []).slice(-5).join(' ') || 'No results yet';
  const coachLine = !coach ? '' : P.odds === 'Underdogs' ?
    'We know our job. Let the football do the talking.' :
    'We have prepared. The players know what matters.';
  return `<div class="mds mdpv fo-matchday">
    <div class="fo-match-banner"><span>MATCH PREVIEW · WEEK ${g.week}</span>
      <h1>${esc(ours)} <small>vs</small> ${esc(opp)}</h1>
      <p>${esc(F.TIERS[g.club.tier])} · ${P.home ? 'At home' : 'Away'} · ${esc(P.odds)}</p>
    </div>
    <div class="fo-match-comparison">
      <div><small>Our position</small><b>${F.ord(P.mine)}</b><span>${esc(form(g.form))}</span></div>
      <div><small>Opposition</small><b>${F.ord(P.pos)}</b><span>${esc(form(P.fm))}</span></div>
    </div>
    <section class="fo-match-context"><h2>What is at stake?</h2><p>${esc(stake)}</p>
      ${BG && BG.done == null ? `<p class="small">${esc(BG.t)} target: ${BG.got}/${BG.need} points. ${BG.left} matches remaining.</p>` : ''}
    </section>
    ${P.star ? `<section class="fo-match-context"><h2>Opposition watch</h2>
      <p><b>${esc(P.star.name)}</b> · ${esc(P.sty.t)}. ${esc(P.sty.d)}</p></section>` : ''}
    ${S.length ? `<section class="fo-match-context"><h2>Stories before kick-off</h2>
      ${S.map(x => {const p = mdP(x.pid); return p ?
        `<button class="fo-match-story" data-a="player" data-id="${p.id}">
          <b>${esc(p.name)} · ${esc(x.tag)}</b><span>${esc(x.t)}</span></button>` : '';}).join('')}
    </section>` : ''}
    ${coach ? `<section class="fo-match-context"><h2>From the manager</h2>
      <p>“${esc(coachLine)}”</p><small>${esc(coach.name)}, head coach</small></section>` : ''}
    ${box ? `<p class="fo-match-note">${box} item${box === 1 ? '' : 's'} still in your Red Box. Staff will act within their authority if you continue.</p>` : ''}
    <div class="fo-preview-actions">
      <button class="fo-secondary-action" data-a="md-close">Back to desk</button>
      <button class="fo-primary-action" data-a="md-kick">Kick off</button>
    </div></div>`;
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
  } else foot = `<div class="mdfeed" aria-label="Live match events"><div class="mdnow" aria-live="polite"></div><ul class="mdpast"></ul></div><div class="mdctl"><button data-a="md-speed">2x speed</button><button data-a="md-skip">Simulate to full time</button></div>`;
  return `<div class="mds mdm ${ft ? 'ft' : ''}"><div class="mdbug"><div class="mdbt">${crest(L.c, L.s, 30)}<b>${esc(L.s)}</b></div><div class="mdbs"><b class="mdsc">${sc}</b><span class="mdclk">${ft ? (m.pens || m.ev.some(e => e.m > 95) ? 'AET' : 'FT') : "0'"}</span></div><div class="mdbt r"><b>${esc(R.s)}</b>${crest(R.c, R.s, 30)}</div></div>
  <div class="mdprog"><b style="width:${ft ? 100 : 0}%"></b></div>
  <div class="ceo-match-head"><b>${ft ? 'FINAL WHISTLE' : 'LIVE MATCH COMMENTARY'}</b><span>${esc(m.comp || 'League')} · ${esc(m.oppName)}</span></div>
  ${foot}</div>`;
}
/* the live match: a small player that animates the existing DOM, no re-render */
const MDP = {
  start() {
    const s = U.md, m = s.m, root = document.querySelector('.mdm'); if (!root || s.ft || this.cur === s.m) return; this.cur = s.m;
    Object.assign(this, { root, m, i: 0, min: 0, mom: [], fast: false, paused: false, home: m.home, end: Math.max(...m.ev.map(e => e.m), 90) });
    // Commentary runs from existing match events; no animated 22-player pitch.
    this.loop();
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
    // One actual engine event per tick, rather than 90 frames of visual movement.
    clearTimeout(this.t);
    this.t = setTimeout(() => {
      if (!this.alive()) return this.lost();
      if (this.paused) return;
      const e = this.m.ev[this.i++];
      if (!e) return this.finish();
      this.min = e.m; this.clock(e.m); this.fire(e);
    }, this.fast ? 110 : 650);
  },
  clock(mm) { mm = mm || this.min; const c = this.root.querySelector('.mdclk'); if (c) c.textContent = (mm > 90 && mm <= 95 && this.end <= 96 ? '90+' + (mm - 90) : mm) + "'"; const p = this.root.querySelector('.mdprog b'); if (p) p.style.width = Math.min(100, mm / this.end * 100) + '%'; },
  push(v) { const last = this.mom.length ? this.mom[this.mom.length - 1] : 0; this.mom.push(last * .82 + v); this.draw(); },
  paths() { const n = this.end, pts = this.mom.map((v, i) => [i / n * 360, 27 - Math.max(-25, Math.min(25, v * 14))]); if (!pts.length) return ['', '']; const e = pts[pts.length - 1][0].toFixed(1); return ['M0 27 ' + pts.map(p => `L${p[0].toFixed(1)} ${Math.min(27, p[1]).toFixed(1)}`).join(' ') + ` L${e} 27Z`, 'M0 27 ' + pts.map(p => `L${p[0].toFixed(1)} ${Math.max(27, p[1]).toFixed(1)}`).join(' ') + ` L${e} 27Z`]; },
  draw() { const [a, b] = this.paths(), u = this.root.querySelector('.mu'), t = this.root.querySelector('.mt'); if (u) { u.setAttribute('d', a); t.setAttribute('d', b); } },
  fire(e) {
    // All match outcomes and timings were generated by the engine in mdKick().
    // Presentation only: update the score and append a plain commentary line.
    if (e.k === 'ft') return this.finish();
    if (e.k === 'info' && /^Half-time/.test(e.t)) return this.half(e);
    if (e.k === 'goal' && e.sc) {
      const sc = this.root.querySelector('.mdsc');
      if (sc) {
        const a = this.home ? e.sc[0] : e.sc[1], b = this.home ? e.sc[1] : e.sc[0];
        sc.textContent = a + '–' + b;
      }
    }
    this.card(e);
    this.loop();
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

