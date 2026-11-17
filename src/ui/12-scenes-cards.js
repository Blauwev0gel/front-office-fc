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
    ${lm.feed ? '<button class="linkbtn" data-a="replay" style="margin:6px auto 0;display:flex">Replay the match</button>' : ''}</section>${whyPanel(lm)}
  ${v ? `<div class="stage" style="margin-top:14px"><div class="portrait" style="width:56px;height:56px">${ART.staffFace('coach', res === 'W' ? 'happy' : res === 'L' ? 'worried' : null)}</div><div class="who"><b>${esc(v.who.split(',')[0])}</b><span>Head coach</span></div></div><div class="bubble">${esc(sp.say)}</div>${sp.rest ? `<details class="more"><summary>Details ${ART.I.chev}</summary><p>${esc(sp.rest)}</p></details>` : ''}${cardOpts(b, v)}` : ''}`;
}
function weekReport() {
  const g = G(), A = F.analysis(), O = F.deptOverview(), au = g.paper.stories.filter(s => s.auto);
  const rep = role => ((g.reports || []).find(r => r.role === role) || {}).t || '';
  const tiles = O.map(o => { const v = F.deptView(o.k), k = v.kpi, cur = k[k.length - 1], prv = k[k.length - 2], up = prv != null && cur !== prv ? (o.k === 'first' ? cur < prv : cur > prv) : null;
    return `<button class="wtile ${o.status.st}" data-a="dept-go" data-k="${o.k}"><span class="wtf">${o.s ? ART.staffFace(o.head) : ART.I.staff}</span><small>${esc(o.t)}</small><b>${cur != null ? kfmt(o.k, cur) : '–'}${up != null ? `<i class="${up ? 'up' : 'dn'}">${up ? '▲' : '▼'}</i>` : ''}</b><span>${esc(clip2(rep(o.head) || v.kpiL[0])[0].split('. ')[0])}</span></button>`; }).join('');
  const wd = g.wkDelta || {}, BG = F.goalView ? F.goalView() : null, last = (g.bgLog || []).slice(-1)[0];
  const thisWk = F.backers ? `<div class="sec">This week</div><div class="wkd">${F.backers().map(b => `<span class="${(wd[b.k] || 0) > 0 ? 'up' : (wd[b.k] || 0) < 0 ? 'dn' : ''}"><small>${esc(bkT(b.t))}</small><b>${esc(b.mood)}</b><i>${wd[b.k] > 0 ? '↑' : wd[b.k] < 0 ? '↓' : '='}</i></span>`).join('')}</div>${BG && BG.done == null ? `<p class="small">${esc(BG.t)} goal: ${BG.got} of ${BG.need} points, ${BG.left} game${BG.left === 1 ? '' : 's'} left.</p>` : last && last.s === g.season && BG && BG.done != null ? `<p class="small ${last.ok ? 'good' : 'bad'}">${esc(last.t)} goal ${last.ok ? 'reached' : 'missed'}: ${last.got} of ${last.need} points.</p>` : ''}` : '';
  return `<h2 class="oh">Week ${g.week - 1 || 1} in the club</h2>${thisWk}${A.g ? `<div class="wpos ${A.pos <= A.target ? 'good' : 'bad'}"><b>${F.ord(A.pos)}</b><span>target ${F.ord(A.target)}</span>${A.behind && A.causes.length ? `<small>${esc(clip2(A.causes[0].t)[0])}</small>` : ''}</div>` : ''}
  <div class="wgrid">${tiles}</div>
  ${au.length ? `<div class="sec">Handled by your staff</div><div class="panel2">${au.map(st => `<div class="notice"><span class="nst">${ART.I.trust}</span><span><b>${esc(st.h.replace(' handled it', ''))}</b><small>${esc(clip2(st.t)[0])}</small></span></div>`).join('')}</div>` : ''}`;
}
function msStrip(i) {
  return `<h2 class="oh">Milestones this week</h2><div class="msrow">${i.mss.map(({ ms, p }) => { const ic = /debut/i.test(ms.t) ? 'star' : /hat/i.test(ms.t) ? 'league' : /goal/i.test(ms.t) ? 'play' : /injur/i.test(ms.t) ? 'risk' : /games|appear/i.test(ms.t) ? 'trust' : 'star'; return `<button class="mscard" data-a="player" data-id="${p.id}"><span class="msb">${ART.I[ic]}</span><span class="msf">${ART.playerFace(p, /injur/i.test(ms.t) ? 'worried' : 'happy')}</span><b>${esc(p.name.split(' ').slice(-1)[0])}</b><small>${esc(ms.t)}</small></button>`; }).join('')}</div><p class="small" style="text-align:center">Tap a player for his story.</p>`;
}
function gazette() { return gzEdition(F.edView(U.edI || 0), 'inbox', U.edI || 0); }
