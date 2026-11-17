/* ---------- render ---------- */

/* ---------- inbox home (1.6) ---------- */
const isRead = k => !!((G().read || {})[k]);
function markRead(k) { const g = G(); g.read = g.read || {}; if (!g.read[k]) g.read[k] = F.absWeek(); const keep = F.absWeek() - 6; for (const x in g.read) if (g.read[x] < keep) delete g.read[x]; }
const first = t => { t = String(t || ''); const i = t.search(/[.!?](\s|$)/); return i > 0 ? t.slice(0, i + 1) : t; };
function inboxItems() {
  const g = G(), out = [], wk = g.week, se = g.season;
  for (const m of g.inbox.filter(m => !m.done)) { const v = F.msgView(m), dz = /^dos_/.test(m.ev) && m.ctx && m.ctx.part != null; out.push({ key: 'm' + m.id, kind: 'need', fold: 'need', label: /^story_/.test(m.ev) ? 'Club story' : dz ? `Dossier ${m.ctx.part + 1}/3` : /^pw_/.test(m.ev) ? 'Agreement' : 'Needs you', role: v.role, from: v.from.split(',')[0], subj: v.title, prev: first(v.body), ref: m, t: 'msg' }); }
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
  const mood = v => v <= F.VOTE_AT ? 'CRISIS' : v <= 20 ? 'AT RISK' : v < 45 ? 'UNEASY' : v < 75 ? 'STABLE' : 'SUPPORTIVE';
  return `<button class="bkrs" data-a="sheet" data-s="backers" aria-label="Stakeholder confidence; open for explanations">${B.map(b => `<span class="bk ${b.danger ? 'lo' : ''}"><small>${ART.I[b.ic] || ''}${esc(b.t === 'Dressing room' ? 'Room' : b.t === 'Supporters' ? 'Fans' : b.t)}</small><b>${b.v}${b.d ? `<i class="${b.d > 0 ? 'up' : 'dn'}">${b.d > 0 ? '+' : ''}${b.d}</i>` : ''}</b><small class="bkstatus">${mood(b.v)}</small><em><u style="width:${b.v}%"></u></em></span>`).join('')}</button>`;
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
    ${V.stage === 'run' && A ? `<div class="sec">Change course</div><p class="small">Explain a change before the evaluation. The staff will adapt the agreement.</p><div class="pwch">${V.routes.filter(r => r.k !== A.route).map(r => `<button class="btn ghost" data-a="pw-change" data-k="${r.k}" >${esc(r.t)}</button>`).join('')}</div>` : ''}</div>`;
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
const FOLDERS = [['all', 'Inbox', 'inbox'], ['need', 'Needs you', 'bulb'], ['match', 'Matches', 'play'], ['staff', 'Staff', 'staff'], ['reports', 'Reports', 'info'], ['press', 'Press', 'press'], ['players', 'Players', 'squad'], ['dos', 'Dossiers', 'info'], ['done', 'Decided', 'trust']];
const FOLD_T = Object.fromEntries(FOLDERS.map(f => [f[0], f[1]]));
FOLD_T.records = 'Club records';
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
/* ---------- Desk V2: football week, decisions, people, ongoing club matters ---------- */
function deskWeekHeader(g, A, nf, box, advisory) {
  const recent = (g.form || []).slice(-5);
  const form = recent.length ? recent.map(r =>
    '<span class="dw-result '+esc(r)+'">'+esc(r)+'</span>').join('') :
    '<span class="dw-empty">Season not yet underway</span>';
  const risks = [];
  if (g.club.cash < 0) risks.push('<button data-a="tab" data-t="club"><b>Financial pressure</b><span>Club cash is below zero. Review the club outlook →</span></button>');
  if (F.backers) for (const b of F.backers().filter(x=>x.v<=20)) risks.push(
    '<button data-a="sheet" data-s="backers"><b>'+esc(b.t)+' confidence is low</b>'+
    '<span>'+b.v+'/100 · Review the club response →</span></button>');
  return '<section class="dw-week" aria-label="Your football week">'+
    '<div class="dw-week-top"><div><span class="dw-kicker">SEASON '+g.season+' / WEEK '+g.week+'</span>'+
    '<h2>The week at '+esc(g.club.name)+'</h2></div>'+
    '<span class="dw-attention">'+(box.length ? box.length+' for decision' : 'Club operating')+'</span></div>'+
    '<div class="dw-scoreboard">'+
      '<button data-a="tab" data-t="league" class="dw-stat"><small>League</small><b>'+
      (A.g ? F.ord(A.pos) : '—')+'</b><span>Goal '+F.ord(A.target)+'</span></button>'+
      '<div class="dw-stat dw-form"><small>Recent form</small><div class="dw-results">'+form+'</div></div>'+
      '<button data-a="tab" data-t="club" class="dw-stat"><small>Club cash</small><b>'+
      money(g.club.cash)+'</b><span>Open finance →</span></button>'+
    '</div>'+(risks.length ? '<div class="dw-risk-list">'+risks.join('')+'</div>':'')+'</section>';
}
function deskNextMatch(g, nf, pv) {
  if (g.phase !== 'season') return '';
  const match = pv || (F.mtPreview ? F.mtPreview() : null);
  if (!match && !nf) return '<section class="dw-fixture"><span class="dw-kicker">THIS WEEK</span><p>No fixture is scheduled this week.</p><button class="dw-match-cta" data-a="play">Continue week →</button></section>';
  const who = match ? match.name : nf.name, home = match ? match.home : nf.home;
  const rank = match ? match.pos : nf.pos, isDerby = !!(match && match.rival);
  const note = isDerby ? 'Derby' : match ? match.odds : '';
  const objective = F.goalView ? F.goalView() : null;
  return '<section class="dw-fixture" aria-label="Next match">'+
    '<div class="dw-heading"><span>NEXT FIXTURE'+(isDerby?' · DERBY':'')+'</span>'+
    '<button data-a="tab" data-t="league">Full table →</button></div>'+
    '<div class="dw-opponent"><small>'+esc(home?'HOME':'AWAY')+'</small>'+
    '<b>'+esc(home?'vs '+who:'at '+who)+'</b><span>'+esc(F.ord(rank))+
    ' in the league'+(note?' · '+esc(note):'')+'</span></div>'+
    (objective && objective.done == null ? '<p class="dw-match-goal">'+
      esc(objective.t)+': '+objective.got+'/'+objective.need+
      ' pts with '+objective.left+' match'+(objective.left===1?'':'es')+' left</p>' : '')+
    '<button class="dw-match-cta" data-a="play">Match preview →</button></section>';
}
function deskDecisionCard(i, optional) {
  const source = ROLE_T[i.role] || i.from;
  const intro = i.prev ? clip2(i.prev)[0] : '';
  return '<button class="dw-decision" data-a="open" data-k="'+esc(i.key)+'" aria-label="Review '+esc(i.subj)+'">'+
    '<span class="dw-decision-source">'+esc(i.from)+(source && source !== i.from ? ' · '+esc(source) : '')+'</span>'+
    '<b>'+esc(i.subj)+'</b>'+
    (intro ? '<span class="dw-decision-desc">'+esc(intro)+'</span>' : '')+
    '<strong>'+(optional?'Read and respond':'Review decision')+' →</strong></button>';
}
function deskMatters(items, core, storyState) {
  const dos = F.dosView ? F.dosView() : null, PV = F.pwView ? F.pwView() : null;
  const active = [];
  const seen = new Set();
  const add = (key, title, detail, destination) => {
    const norm = String(title || '').trim().toLowerCase();
    if (!norm || seen.has(norm)) return;
    seen.add(norm); active.push({key,title,detail,destination});
  };
  if (dos && dos.open) for(const d of dos.open) add('dos_'+d.id,d.t,
    d.pending ? 'Your response is requested' : 'Next chapter in '+d.inW+' week'+(d.inW===1?'':'s'),
    'open');
  if (PV && PV.stage !== 'closed') add('pathway','The '+PV.tname+' question',
    PV.ag ? 'Evaluation week '+PV.ag.evalWeek : 'Club departments are discussing the pathway','open');
  if (storyState && storyState.active) for(const x of storyState.active) add('story_'+x.kind,x.title,
    x.latest || 'Active story'+(x.next!=null?' · next review in '+x.next+' weeks':''),'story');
  if (core && core.decisions) for(const x of core.decisions.filter(y=>!y.review)) add(
    'decision_'+x.id,x.label,'Decision review pending · season '+x.season+', week '+x.week,'decision');
  const entries = active.map(x => x.destination==='open'
    ? '<button class="dw-matter" data-a="open" data-k="'+esc(x.key)+'"><b>'+esc(x.title)+'</b><small>'+esc(x.detail)+'</small></button>'
    : '<div class="dw-matter"><b>'+esc(x.title)+'</b><small>'+esc(x.detail)+'</small></div>');
  const delegated = core && core.delegated || [];
  const history = storyState && storyState.history || [];
  const lastDecisions = core && core.decisions || [];
  if (!entries.length && !delegated.length && !lastDecisions.length && !history.length) return '';
  return '<section class="dw-matters" aria-label="Ongoing club matters">'+
    '<div class="dw-heading"><h2>Club matters</h2><span>'+active.length+' ongoing</span></div>'+
    (entries.length ? entries.slice(0,3).join('') : '<p class="dw-muted">No outstanding matters.</p>')+
    (entries.length>3 ? '<details class="dw-fold"><summary>All ongoing matters ('+entries.length+')</summary>'+
      entries.slice(3).join('')+'</details>' : '')+
    (delegated.length || lastDecisions.length || history.length ? '<details class="dw-fold">'+
      '<summary>Decisions, delegated work & history</summary>'+
      (lastDecisions.length ? '<h3>Your instructions</h3>'+lastDecisions.map(x =>
        '<div class="dw-record"><b>'+esc(x.label)+'</b><small>Season '+x.season+
        ' · week '+x.week+'</small><p>'+esc(x.review||'Awaiting an evidence review')+'</p></div>').join('') : '')+
      (delegated.length ? '<h3>Decisions taken by your staff</h3>'+delegated.map(x =>
        '<div class="dw-record"><b>'+esc(x.who+': '+x.choice)+'</b>'+
        '<p>'+esc(x.reason)+'</p><small>'+esc(x.outcome)+'</small></div>').join('') : '')+
      (history.length ? '<h3>Completed club stories</h3>'+history.map(x =>
        '<div class="dw-record"><b>'+esc(x.kind)+'</b><p>'+esc(x.verdict)+'</p></div>').join('') : '')+
    '</details>' : '')+'</section>';
}
function deskArchive(items) {
  const shown = [['records','All'],['need','Decisions'],['staff','Staff'],['match','Football'],['dos','Matters']];
  const f = FOLD_T[U.filt] ? U.filt : 'records';
  const subset = f==='records' ? items.filter(x=>x.kind!=='done') :
    f==='need' ? items.filter(isBox) : items.filter(x=>x.fold===f);
  const intro = '<button class="dw-back" data-a="filt" data-v="all">← Back to Desk</button>'+
    '<header class="dw-archive-title"><span>CLUB RECORDS</span><h2>'+esc(FOLD_T[f]||'All records')+'</h2>'+
    '<p>Browse reports, club matters and previous decisions. Reading is optional.</p></header>';
  const tabs = '<nav class="dw-archive-nav" aria-label="Browse club records">'+
    shown.map(([k,label])=>'<button data-a="filt" data-v="'+k+'" aria-current="'+
    (k===f?'page':'false')+'" class="'+(k===f?'on':'')+'">'+label+'</button>').join('')+'</nav>';
  const secondary = '<details class="dw-fold dw-archive-extra"><summary>Other records</summary>'+
    [['reports','Reports'],['press','Press'],['players','Players'],['done','Resolved']].map(([k,label])=>
      '<button class="dw-textlink" data-a="filt" data-v="'+k+'">'+label+' →</button>').join('')+'</details>';
  return intro+tabs+'<ul class="inbox dw-archive-list">'+
    (subset.map(rowHtml).join('') || '<li class="empty">No records in this category.</li>')+'</ul>'+
    secondary+(f==='dos'?archiveHtml():'');
}
function vInbox() {
  if (U.open) return vOpen();
  const g = G(), items = inboxItems(), f = FOLD_T[U.filt] ? U.filt : 'all';
  if (f !== 'all') return deskArchive(items);
  const A = F.analysis(), nf = nextFix(), pv = F.mtPreview ? F.mtPreview() : null;
  const critical = items.filter(x=>x.kind==='need' && !isDis(x.key));
  const optional = items.filter(x=>x.kind==='upd' && x.bt!=='coach_debrief' && !isDis(x.key));
  const status = items.filter(x=>x.kind==='info' || x.kind==='upd' && x.bt==='coach_debrief')
    .filter(x=>!isDis(x.key) && x.t!=='preview' && x.t!=='paper' && x.t!=='dossier' && x.t!=='pathway');
  const pap = items.find(x=>x.t==='paper' && !isDis(x.key));
  const core = F.ceoCoreView ? F.ceoCoreView() : null, story = F.storyView ? F.storyView() : null;
  const staff = status.filter(x=>x.t==='digest'||x.fold==='staff'||x.fold==='reports');
  const football = status.filter(x=>x.fold==='match'||x.fold==='players');
  const remaining = status.filter(x=>!staff.includes(x)&&!football.includes(x));
  const updates = [...staff,...football,...remaining].slice(0,4);
  const allUpdateCount = staff.length+football.length+remaining.length;
  const deskView = F.deskView ? F.deskView() : null;
  return tourCard('inbox')+
    deskWeekHeader(g,A,nf,critical,optional)+
    '<section class="dw-decisions" aria-label="CEO decisions">'+
      '<div class="dw-heading"><h2>Needs your attention</h2><span>'+
        (critical.length ? critical.length+' decision'+(critical.length===1?'':'s') : 'NO DECISIONS')+'</span></div>'+
      (critical.length ? critical.slice(0,2).map(x=>deskDecisionCard(x,false)).join('')+
        (critical.length>2 ? '<details class="dw-fold"><summary>'+ (critical.length-2)+
        ' additional decision'+(critical.length===3?'':'s')+'</summary>'+
        critical.slice(2).map(x=>deskDecisionCard(x,false)).join('')+'</details>' : '') :
        '<p class="dw-no-decision"><b>Nothing requires your approval.</b> '+
        'Your people can continue working within their mandates.</p>')+
      (optional.length ? '<details class="dw-fold dw-advice"><summary>'+
        optional.length+' staff update'+(optional.length===1?'':'s')+' with optional responses</summary>'+
        optional.map(x=>deskDecisionCard(x,true)).join('')+'</details>' : '')+
    '</section>'+
    deskNextMatch(g,nf,pv)+
    '<section class="dw-people" aria-label="Updates from the club">'+
      '<div class="dw-heading"><h2>From the club</h2><span>'+
        (allUpdateCount ? allUpdateCount+' updates' : 'OPERATING NORMALLY')+'</span></div>'+
      (updates.length ? updates.map(x=>'<button class="dw-update" data-a="open" data-k="'+esc(x.key)+'">'+
        '<small>'+esc(x.from)+'</small><b>'+esc(x.subj)+'</b>'+
        (x.prev?'<span>'+esc(clip2(x.prev)[0])+'</span>':'')+'</button>').join('') :
        '<p class="dw-muted">No new reports. Department heads are carrying out their work.</p>')+
      (deskView && deskView.n ? '<p class="dw-staff-note">'+deskView.n+
        ' decision'+(deskView.n===1?'':'s')+' handled by your staff.</p>' : '')+
      (allUpdateCount>updates.length ? '<button class="dw-textlink" data-a="filt" data-v="records">View all updates →</button>' : '')+
    '</section>'+
    deskMatters(items,core,story)+
    (pap ? '<button class="dw-gazette" data-a="open" data-k="'+esc(pap.key)+'">'+
      '<span>THE '+esc(g.club.city.toUpperCase())+' GAZETTE</span><b>'+
      esc((F.edView(0)||{}).head||g.paper.headline)+'</b><small>Read the latest edition →</small></button>' : '')+
    '<section class="dw-records"><div class="dw-heading"><h2>Club records</h2></div>'+
      '<p class="dw-muted">Messages, results, reports and earlier decisions remain available.</p>'+
      '<button class="dw-textlink" data-a="filt" data-v="records">Browse club records →</button>'+
      (items.some(x=>x.kind==='done') ? '<button class="dw-textlink" data-a="filt" data-v="done">Resolved this week →</button>' : '')+
    '</section>';
}
