/* ---------- render ---------- */

/* ---------- inbox home (1.6) ---------- */
const isRead = k => !!((G().read || {})[k]);
function markRead(k) { const g = G(); g.read = g.read || {}; if (!g.read[k]) g.read[k] = F.absWeek(); const keep = F.absWeek() - 6; for (const x in g.read) if (g.read[x] < keep) delete g.read[x]; }
const first = t => { t = String(t || ''); const i = t.search(/[.!?](\s|$)/); return i > 0 ? t.slice(0, i + 1) : t; };
function inboxItems() {
  const g = G(), out = [], wk = g.week, se = g.season;
  for (const m of g.inbox.filter(m => !m.done)) { const v = F.msgView(m), dz = /^dos_/.test(m.ev) && m.ctx && m.ctx.part != null; out.push({ key: 'm' + m.id, kind: 'need', fold: 'need', label: dz ? `Dossier ${m.ctx.part + 1}/3` : /^pw_/.test(m.ev) ? 'Agreement' : m.fu ? 'Follow-up' : 'Needs you', role: v.role, from: v.from.split(',')[0], subj: v.title, prev: m.fu && m.fu !== 'an earlier decision' ? `After: ${m.fu}. ${first(v.body)}` : first(v.body), ref: m, t: 'msg', pri: /^vote_|cash_crisis|fin_alarm|board_warning|coach_authority/.test(m.ev) ? 3 : m.fu ? 2 : 1 }); }
  const mt = g.meeting;
  if (mt && !mt.pre && mt.week === wk && mt.season === se) mt.items.forEach((it, i) => { const v = F.proposalView(it); out.push({ key: `p${se}_${wk}_${i}`, kind: it.status === 'open' ? 'need' : 'done', fold: it.status === 'open' ? 'need' : 'done', label: it.status === 'open' ? 'Meeting' : cap(it.status), role: it.owner, from: v.owner, subj: v.title, prev: `${money(v.cost)} now, ${v.dur} weeks, his confidence ${Math.round(v.pc * 100)}%`, ref: i, t: 'prop' }); });
  for (const b of g.briefs || []) { const v = F.briefView(b); out.push({ pl: b.ctx && b.ctx.pid ? g.squad.find(p => p.id === b.ctx.pid) : undefined, key: 'b' + b.id, kind: b.done ? 'done' : 'upd', fold: b.t === 'coach_debrief' || b.t === 'stake_match' ? 'match' : 'staff', bt: b.t, label: b.del ? 'Staff call' : b.done ? 'Handled' : F.OPP_IDS && F.OPP_IDS.has(b.t) ? 'Opportunity' : 'Update', role: v.role || 'club', from: v.who.split(',')[0], subj: v.title, prev: b.done ? `${v.opts[v.choice].l}. ${v.out}` : first(v.text), ref: b, t: 'brief' }); }
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
/* B52: one way to show a backer on every screen: a name, a mood, a direction and a state colour. Old saves may carry the old names. */
function bkT(t) { return t === 'Supporters' ? 'Fans' : t === 'Dressing room' ? 'Squad' : t; }
function bkSt(v) { return v <= 20 ? 'lo' : v < 55 ? 'mid' : 'ok'; }
function bkArrow(d) { return d > 0 ? '<i class="up" aria-hidden="true">↑</i>' : d < 0 ? '<i class="dn" aria-hidden="true">↓</i>' : ''; }
function bkDir(d) { return d > 0 ? ', rising' : d < 0 ? ', falling' : ''; }
function backersHtml() {
  if (!F.backers) return ''; const B = F.backers();
  /* B51: the backers are felt, not read: a mood and a direction, the numbers only in the sheet */
  return `<button class="bkrs" data-a="sheet" data-s="backers" aria-label="Your backers: ${B.map(b => `${bkT(b.t)} ${b.mood.toLowerCase()}${bkDir(b.d)}`).join('; ')}">${B.map(b => `<span class="bk ${b.danger ? 'lo' : ''}"><small>${ART.I[b.ic] || ''}${esc(bkT(b.t))}</small><b class="mood">${esc(b.mood)}${b.d > 0 ? '<i class="up" aria-hidden="true">↑</i>' : b.d < 0 ? '<i class="dn" aria-hidden="true">↓</i>' : ''}</b></span>`).join('')}</button>`;
}
function comingHtml() {
  if (!F.comingUp) return ''; const C = (F.stillRunning ? F.stillRunning() : []).concat(F.comingUp().filter(c => c.ic !== 'league')); if (!C.length) return ''; // promises first; the next match has its own card on the desk
  return `<section class="cup2"><h3>Still running</h3>${C.map(c => `<div class="cu ${c.hot ? 'hot' : ''} ${c.bad ? 'bad' : ''}"><span>${ART.I[c.ic] || ART.I.info}</span><p><b>${esc(c.t)}</b>${esc(c.s)}</p></div>`).join('')}</section>`;
}
const BKT = { board: 'Board', fans: 'Fans', press: 'Press', room: 'Squad' };
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
    ${V.stage === 'run' && A ? `<div class="sec">Change course</div><p class="small">Explain a change before the evaluation and it is not a broken promise.</p><div class="pwch">${V.routes.filter(r => r.k !== A.route).map(r => `<button class="btn ghost" data-a="pw-change" data-k="${r.k}" ${G().ap < 1 ? 'disabled' : ''}>${esc(r.t)}</button>`).join('')}</div>` : ''}</div>`;
}
function credHtml() {
  if (!F.credView) return ''; const C = F.credView(); if (!C.log.length) return '';
  return `<div class="sec">Academy credibility <span class="small">${Math.round(C.youth)}</span></div><div class="panel2"><p class="small" style="margin:0 0 6px">Judged on what the club does, not what it says.</p>${C.log.slice(0, 6).map(l => `<div class="crl"><b class="${l.d > 0 ? 'good' : l.d < 0 ? 'bad' : ''}">${l.d > 0 ? '+' : ''}${l.d || '±0'}</b><span>${esc(l.t)}<small> Season ${l.s}, week ${l.w}</small></span></div>`).join('')}</div>`;
}
function caseHtml(c) {
  if (!c) return ''; return `<dl class="xcase"><div><dt>Limit</dt><dd>${esc(c.limit)}</dd></div><div><dt>Why</dt><dd>${esc(c.why)}</dd></div><div><dt>Alternatives</dt><dd>${esc(c.alt)}</dd></div><div><dt>Likely effect</dt><dd>${esc(c.effect)}</dd></div></dl>`;
}
function fdHtml(fd) {
  if (!fd || !F.BACKERS) return ''; const T = BKT;
  return `<div class="fdrow" aria-label="How your backers reacted">${Object.entries(fd).map(([k, d]) => `<span class="${d > 0 ? 'up' : 'dn'}" aria-label="${T[k]} ${d > 0 ? 'up' : 'down'}">${T[k]} ${d > 0 ? '↑' : '↓'}${Math.abs(d) >= 6 ? (d > 0 ? '↑' : '↓') : ''}</span>`).join('')}</div>`;
}
const FOLDERS = [['all', 'Inbox', 'inbox'], ['need', 'Needs you', 'bulb'], ['match', 'Matches', 'play'], ['staff', 'Staff', 'staff'], ['reports', 'Reports', 'info'], ['press', 'Press', 'press'], ['players', 'Players', 'squad'], ['dos', 'Dossiers', 'info'], ['done', 'Decided', 'trust']];
const FOLD_T = Object.assign(Object.fromEntries(FOLDERS.map(f => [f[0], f[1]])), { every: 'All messages', done: 'Decided this week' });
function isDis(k) { const g = G(); return !!(g.dis && g.dis[k]); }
function rowThumb(i) {
  if (i.t === 'paper') return `<span class="av paper">${ART.I.press}</span>`;
  if (i.t === 'digest') return `<span class="av rep">${ART.I.info}</span>`;
  return `<span class="av ${i.kind}">${i.pl ? ART.playerFace(i.pl, 'happy') : ART.staffFace(i.role)}</span>`;
}
function rowHtml(i) { const unread = i.kind !== 'done' && !isRead(i.key), dis = i.kind === 'info'; return `<li class="ir ${i.kind} ${unread ? 'unread' : ''} ${dis ? 'dis' : ''}" data-a="open" data-k="${i.key}" role="button" tabindex="0">${rowThumb(i)}<span class="ib"><span class="it"><b>${esc(i.from)}</b><em class="lab ${i.kind}">${esc(i.label)}</em></span><span class="is">${esc(i.subj)}</span><span class="ip">${esc(i.prev)}</span></span>${unread ? '<i class="dot" aria-label="unread"></i>' : ''}</li>`; }
const isBox = i => i.kind === 'need' || (i.kind === 'upd' && i.bt !== 'coach_debrief');
function boxRow(i, lead) {
  const rt = ROLE_T[i.role] && ROLE_T[i.role] !== i.from ? ROLE_T[i.role] : '';
  const tag = lead ? 'Main issue' : i.kind === 'upd' ? 'Free' : i.label === 'Needs you' ? 'Your call' : i.label;
  return `<button class="rbr${lead ? ' lead' : ''}" data-a="open" data-k="${i.key}"><span class="rbf">${i.pl ? ART.playerFace(i.pl) : i.role === 'player' ? '' : ART.staffFace(i.role || 'club')}</span><span class="rbm"><span class="rbt"><b>${esc(i.from)}</b>${rt ? `<small>${esc(rt)}</small>` : ''}<em class="${i.kind === 'upd' ? 'free' : ''}">${esc(tag)}</em></span><b class="rbs">${esc(i.subj)}</b><span class="rbp">${esc(i.prev || '')}</span></span></button>`;
}
function deskRow(i) { return `<button class="dkr" data-a="open" data-k="${i.key}"><span class="dkl">${esc(i.label)}</span><span class="dkm"><b>${esc(i.subj)}</b><small>${esc(i.from)}${i.prev ? ': ' + esc(clip2(i.prev)[0]) : ''}</small></span>${ART.I.chev}</button>`; }
/* ---------- the CEO's weekly desk (UX-1): this week, your team at work, the red box, the next match ---------- */
const ROLE_N = { coach: 'Head coach', dof: 'Director of Football', scout: 'Chief scout', acad: 'Academy', com: 'Commercial', mkt: 'Marketing', fin: 'Finance', board: 'The board', fans: 'Supporters', press: 'Press', club: 'The club' };
const sent = t => { t = String(t || ''); const i = t.search(/[.!?](\s|$)/); return i > 0 ? t.slice(0, i + 1) : t; };
// what happens if the CEO leaves it: true to the code (messages resolve at the end of the week with the owner's default)
function ifLeft(i) {
  const g = G();
  if (i.key[0] === 'm') { const m = g.inbox.find(x => 'm' + x.id === i.key); if (!m) return ''; const v = F.msgView(m), e = F.EV[m.ev] || {}, idx = F.autoIndex(m), who = e.from === 'board' ? 'the board' : F.ROLE[e.from] ? (F.staff(e.from) ? F.staff(e.from).name.split(' ')[0] : 'nobody') : 'the club office'; return `Sunday: ${who} picks "${(v.opts[idx] || {}).l || 'the default'}".`; }
  if (i.key[0] === 'b') { const b = (g.briefs || []).find(x => 'b' + x.id === i.key), f = b && F.briefFate ? F.briefFate(b) : null; return !f || f.lapse ? 'Sunday: it lapses if you leave it.' : `Sunday: ${f.who} decides: "${f.opt}".`; }
  if (i.key[0] === 'p') return 'Sunday: it lapses. He may bring it back later.';
  return '';
}
function weekLine() { // what changed since last week, facts only
  const g = G(), lm = g.lastMatch; if (!lm || g.week <= 1) return '';
  const res = lm.ug > lm.tg ? 'won' : lm.ug < lm.tg ? 'lost' : 'drew', f = g.form.slice(-4).join(' ');
  return `Last week: ${res} ${lm.ug}–${lm.tg} ${lm.home ? 'at home to' : 'away at'} ${lm.oppName}. ${g.form.length >= 3 ? 'Form: ' + f + '.' : ''}`;
}
function topic2() { // the existing week topic, plus a bad or good run from the results (no invented causes)
  const g = G(), T = F.weekTopic ? F.weekTopic() : null, L4 = g.form.slice(-4), A = F.analysis();
  if ((!T || T.k === 'quiet' || T.k === 'block') && L4.length === 4 && L4.filter(r => r === 'L').length >= 3) {
    const B = F.backers ? F.backers() : [], bd = B.find(b => b.t === 'Board'), fn = B.find(b => b.t === 'Fans');
    return { k: 'crisis', t: 'A difficult run', s: `${L4.filter(r => r === 'L').length} defeats in four. ${bd ? `The board is ${bd.mood.toLowerCase()}` : ''}${fn ? `, the fans ${fn.mood.toLowerCase()}.` : '.'}` };
  }
  if ((!T || T.k === 'quiet') && L4.length === 4 && L4.every(r => r !== 'L')) return { k: 'good', t: 'Unbeaten in four', s: A.g ? `${F.ord(A.pos)}, against a target of ${F.ord(A.target)}.` : '' };
  if (T && T.k === 'quiet') return { k: 'quiet', t: g.week <= 3 ? 'The club is settling' : 'A quiet week', s: T.s };
  return T;
}
function nextCard() {
  const g = G(), pv = F.mtPreview ? F.mtPreview() : null; if (!pv || g.phase !== 'season') return '';
  const A = F.analysis(), fm = a => (a || []).slice(-5).map(r => `<i class="f${r}">${r}</i>`).join(''), T = F.weekTopic ? F.weekTopic() : null;
  const stake = T && T.k === 'stake' ? T.t : pv.rival ? 'Derby' : g.cup.alive && g.cup.weeks.includes(g.week) ? 'Cup week' : '';
  return `<button class="dk-next" data-a="play"><span class="dk-k">Next match${stake ? ` · <b>${esc(stake)}</b>` : ''}</span>
    <span class="dk-o">${pv.home ? 'vs' : 'at'} ${esc(pv.name)}</span>
    <span class="dk-t"><span><small>Them</small>${F.ord(pv.pos)} <span class="mdform">${fm(pv.fm)}</span></span><span><small>Us</small>${F.ord(pv.mine)} <span class="mdform">${fm(g.form)}</span></span></span>
    <span class="dk-s">${esc(pv.odds)}${pv.star ? ` · watch ${esc(pv.star.name || pv.star)}` : ''}${A.g ? ` · target ${F.ord(A.target)}` : ''}</span>
    <span class="dk-go">Preview ${ART.I.chev}</span></button>`;
}
function vInbox() {
  if (U.open) return vOpen();
  const g = G(), items = inboxItems(), f = FOLD_T[U.filt] ? U.filt : 'all';
  if (f !== 'all') {
    const shown = f === 'need' ? items.filter(isBox) : f === 'every' ? items : items.filter(i => i.fold === f);
    return `<button class="linkbtn dk-back" data-a="filt" data-v="all">${ART.I.chev} The desk</button><div class="dk-fh"><h2>${esc(FOLD_T[f])}</h2></div><ul class="inbox">${shown.map(rowHtml).join('') || `<li class="empty">${f === 'dos' ? '<b>No open dossiers.</b> Storylines in three parts land here when they start.' : 'Nothing here this week.'}</li>`}</ul>`;
  }
  const T = topic2(), wl = weekLine(), A = F.analysis(), st = A.pos <= A.target ? 'good' : A.pos <= A.target + 2 ? 'warn' : 'bad';
  const box = items.filter(isBox).map((x, i) => [x, i]).sort((a, b) => (b[0].pri || 0) - (a[0].pri || 0) || a[1] - b[1]).map(x => x[0]);
  const now = box.filter(i => i.kind === 'need'), later = box.filter(i => i.kind !== 'need');
  const team = F.teamWork ? F.teamWork() : [], pap = items.find(x => x.t === 'paper'), done = items.filter(i => i.kind === 'done');
  const row = (i, lead) => `<button class="dk-rb${lead ? ' lead' : ''}" data-a="open" data-k="${i.key}"><span class="rbf">${i.pl ? ART.playerFace(i.pl) : ART.staffFace(i.role || 'club')}</span><span class="dk-rm"><small>${esc(i.from)}${ROLE_N[i.role] && ROLE_N[i.role] !== i.from ? ' · ' + esc(ROLE_N[i.role]) : ''}</small><b>${esc(i.subj)}</b><em>${esc(ifLeft(i))}</em></span>${ART.I.chev}</button>`;
  return `${tourCard('inbox')}
  <section class="dk-week ${T ? T.k : ''}"><small>Week ${g.week}${A.g ? ` · <b class="${st}">${F.ord(A.pos)}</b>, target ${F.ord(A.target)} · ${money(g.club.cash)}` : ` · ${money(g.club.cash)} in the bank`}</small>
    <h2>${esc(T ? T.t : 'This week')}</h2>${T && T.s ? `<p>${esc(T.s)}</p>` : ''}${wl ? `<p class="dk-wl">${esc(wl)}</p>` : ''}</section>
  ${backersHtml()}
  <section class="dk-team"><div class="dk-h"><h3>Your team at work</h3>${done.length ? `<button class="linkbtn" data-a="filt" data-v="done">All ${done.length} calls ${ART.I.chev}</button>` : ''}</div>
    ${team.map(l => `<button class="dk-tl${l.bad ? ' bad' : ''}${l.quiet ? ' quiet' : ''}" data-a="${/^[mb]\d/.test(l.k) ? 'open' : 'tab'}" data-k="${l.k}" data-t="${l.r === 'player' ? 'squad' : 'staff'}"><span class="rbf">${l.pl ? ART.playerFace(l.pl, 'happy') : ART.staffFace(l.r)}</span><span class="dk-tx"><small>${esc(l.role)} · ${esc(l.n)}</small><b>${esc(l.t)}</b></span>${l.lab ? `<em class="dk-lab${l.bad ? ' bad' : ''}">${esc(l.lab)}</em>` : ''}</button>`).join('')}${(() => { const b = [], sn = r => F.staff(r) ? F.staff(r).name.split(' ').slice(-1)[0] : '', L3 = g.form.slice(-3);
      const sig = F.iniSignal ? F.iniSignal() : null; if (sig) b.push(`<button class="dk-ask" data-a="ini-open">${ART.staffFace('dof')}<span>${esc(sig.t[0].toUpperCase() + sig.t.slice(1))}: call in the coach and the DoF</span>${ART.I.chev}</button>`);
      if (!sig && F.agrTopics && F.agrTopics('dof').some(t => t.id === 't_squad')) b.push(`<button class="dk-ask" data-a="cv-open" data-r="dof">${ART.staffFace('dof')}<span>Ask ${esc(sn('dof'))} where we are short</span>${ART.I.chev}</button>`);
      if (!sig && F.staff('coach') && L3.length === 3 && L3.filter(r => r === 'L').length >= 2) b.push(`<button class="dk-ask" data-a="ft-talk">${ART.staffFace('coach')}<span>Talk to ${esc(sn('coach'))} about the results</span>${ART.I.chev}</button>`);
      return b.length ? `<div class="dk-asks"><small>Raise it yourself</small>${b.join('')}</div>` : ''; })()}</section>
  <section class="redbox" aria-label="The red box"><div class="rbh"><h2>The red box</h2><span>${now.length ? `${now.length} to decide this week` : 'Nothing to sign'}</span></div>
    <div class="rbl">${now.length ? now.map((x, i) => row(x, i === 0 && now.length > 1 && (x.pri || 0) >= 2)).join('') : '<p class="rbe"><b>Nothing needs your signature.</b> The club runs on what you set up.</p>'}
    ${later.length ? `<div class="dk-later"><small>Your say, if you want it</small>${later.map(x => row(x)).join('')}</div>` : ''}</div></section>
  ${nextCard()}
  ${pap && !isDis(pap.key) ? `<button class="paperpin" data-a="open" data-k="${pap.key}"><span class="ppm">THE ${esc(g.club.city.toUpperCase())} GAZETTE</span><b>${esc((F.edView(0) || {}).head || g.paper.headline)}</b><small>${isRead(pap.key) ? 'Read' : 'Today\'s edition'} ${ART.I.chev}</small></button>` : ''}
  ${comingHtml()}
  <div class="dk-more"><button class="linkbtn" data-a="filt" data-v="reports">Weekly report</button><button class="linkbtn" data-a="filt" data-v="match">Matches</button><button class="linkbtn" data-a="filt" data-v="dos">Dossiers</button><button class="linkbtn" data-a="filt" data-v="every">All messages</button></div>`;
}
