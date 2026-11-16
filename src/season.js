/* The Front Office · season rhythm, module 4 part 2
   Season blocks with a decision each, board reviews, high-stakes matches, a smaller winter window,
   loans in and out, signing evaluations and a balance pass on rival clubs. Plugs into engine hooks. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { ri, pick, chance, clamp, money, M, staff, man, tierAvg, gauss } = F;
const sq = () => g().squad, N = r => F.staffName(r), ord = F.ord;
const fx = (k, v) => { const G = g(); if (k === 'conf') G.board.conf = clamp(G.board.conf + v, 0, 100); else if (k === 'fans') G.st.fans = clamp(G.st.fans + v, 0, 100); else if (k === 'cash') G.club.cash += v; };
const tgt = () => { const o = g().board.obj.find(o => o.k === 'league'); return o ? o.target : 9; };

/* ---------- blocks ---------- */
const BLOCKS = [
  { k: 'opening', t: 'Opening', a: 1, b: 6, d: 'New players settle, the first verdicts form.' },
  { k: 'autumn', t: 'Autumn', a: 7, b: 15, d: 'The long middle. Hold the course.' },
  { k: 'winter', t: 'Winter', a: 16, b: 19, d: 'Mid-season review and a short window.' },
  { k: 'runin', t: 'Run-in', a: 20, b: 29, d: 'The table takes shape. Contracts come into view.' },
  { k: 'finale', t: 'Finale', a: 30, b: 34, d: 'Every match counts.' }];
const blockOf = w => BLOCKS.find(b => w >= b.a && w <= b.b) || BLOCKS[4];
F.BLOCKS = BLOCKS; F.blockOf = blockOf;

/* ---------- balance: rival clubs ---------- */
function ambitions() {
  const G = g();
  for (let t = 1; t <= 8; t++) {
    const ids = G.divs[t].clubs.filter(i => i !== 0);
    for (const id of ids) { const c = G.clubs[id]; if (c.amb == null) c.amb = gauss() * 0.5; }
    if (!ids.some(id => G.clubs[id].big)) ids.slice().sort(() => F.rnd() - 0.5).slice(0, 4).forEach(id => { const c = G.clubs[id]; c.big = true; c.amb += 1.4; c.str = Math.max(c.str, tierAvg(t) + F.orgOf(c) + c.amb); });
    for (const id of ids) { const c = G.clubs[id]; c.str += (tierAvg(c.tier) + F.orgOf(c) + c.amb - c.str) * 0.35; }
  }
  const mine = G.divs[G.club.tier].clubs.filter(i => i !== 0);
  if (!G.rival || !mine.includes(G.rival)) G.rival = pick(mine);
}
const s0 = H.summerStart; H.summerStart = () => { ambitions(); loansBack(); s0(); };

/* ---------- weekly ---------- */
function upcoming() {
  const G = g(), r = G.divs[G.club.tier].fix[G.week - 1]; if (!r) return null; const f = r.find(x => x[0] === 0 || x[1] === 0); if (!f) return null;
  const opp = f[0] === 0 ? f[1] : f[0], tab = F.sortTable(G.club.tier), op = tab.indexOf(opp) + 1, me = F.myPos();
  let kind = null;
  if (opp === G.rival) kind = 'derby';
  else if (G.week >= 20 && Math.abs(op - me) <= 2 && ((me <= 6 && op <= 6) || (me >= 13 && op >= 13))) kind = me <= 6 ? 'top' : 'bottom';
  else if (G.week >= 30 && Math.abs(op - me) <= 3) kind = 'late';
  return kind ? { opp, kind, op, home: f[0] === 0, week: G.week } : null;
}
H.seasonWeekly = () => {
  const G = g(); if (G.phase !== 'season') return;
  G.stake = upcoming();
  if ([10, 19, 29].includes(G.week)) F.queueEvent('board_review', { w: G.week });
  if (G.week === 19) { const r = G.rec; if (r) for (const x of r.pipe.filter(x => x.stage === 'negotiating' || x.stage === 'approach')) { if (x.stage === 'approach') { x.apAsked = false; F.recSetStage(x, 'recommended', 'Window closed before you decided. Back on the list.'); } else F.recSetStage(x, 'lost', 'The winter window closed.'); } G.paper.stories.push({ h: 'Window shut', t: 'The winter window has closed. The next chance to sign players is the summer.' }); if (G.winterPrev) { G.mand.dof.maxFee = G.winterPrev; delete G.winterPrev; } }
  if (G.week === 7 && G.openTarget) { const t0 = G.openTarget; const tab = G.divs[G.club.tier].tab[0], ppg = (tab.pts - t0.pts) / Math.max(1, tab.p - t0.p); G.paper.stories.push({ h: 'Six-week verdict', t: ppg >= 1.6 ? `The board's points target for the opening weeks is met: ${ppg.toFixed(2)} a game.` : `The opening target is missed: ${ppg.toFixed(2)} points a game.` }); fx('conf', ppg >= 1.6 ? 4 : -5); G.openTarget = null; }
};
H.seasonAfterMatch = ours => {
  const G = g(), st = G.stake; if (!ours || !st || st.week !== G.week) return; const res = ours.result, opp = F.cname(st.opp);
  if (st.kind === 'derby') { fx('fans', res === 'W' ? 5 : res === 'L' ? -5 : 0); if (res === 'L') fx('conf', -2); G.paper.stories.unshift({ h: res === 'W' ? 'Derby day joy' : res === 'L' ? 'Derby day misery' : 'Derby honours even', t: `${G.club.name} ${res === 'W' ? 'beat' : res === 'L' ? 'lose to' : 'draw with'} ${opp}. ${res === 'W' ? 'The town is ours for a week.' : res === 'L' ? 'Supporters will not forget this one quickly.' : 'Nobody gets bragging rights.'}` }); }
  else { fx('conf', res === 'W' ? 2 : res === 'L' ? -2 : 0); G.paper.stories.unshift({ h: st.kind === 'bottom' ? 'Survival clash' : st.kind === 'top' ? 'Top-of-table clash' : 'Big match', t: `${res === 'W' ? 'A vital win' : res === 'L' ? 'A painful defeat' : 'A draw'} against ${opp}, a direct rival in the table.` }); }
  if (G.winBonus && res === 'W') fx('cash', -M(250));
  G.stake = null; G.matchEdge = null;
};

/* ---------- block decisions (briefings) ---------- */
const B = F.defineBrief, done = k => (g().blockDone = g().blockDone || {})[g().season + k];
const markDone = k => { (g().blockDone = g().blockDone || {})[g().season + k] = 1; };
const blockBrief = (k, role, title, text, opts) => B('block_' + k, { role, cd: 1,
  check: () => { const G = g(), b = BLOCKS.find(b => b.k === k); if (G.phase !== 'season' || G.week < b.a || G.week > b.a + 1 || done(k)) return null; return { score: 4 }; },
  title, text, opts: opts.map(o => ({ ...o, f: c => { markDone(k); return o.f(c); } })) });
blockBrief('opening', 'coach', 'The opening weeks', () => `${N('coach')}: "The first six weeks set the tone. How do you want to handle them?"`, [
  { l: 'Give the new signings time', h: 'Unsettled players settle faster · board −1', f: () => { sq().forEach(p => { if (!p.settle && chance(0.6)) { p.settle = true; p.morale = 62; } }); fx('conf', -1); return 'No pressure on the new faces for now.'; } },
  { l: 'Promise 1.6 points a game', h: 'Board +3 now · checked in week 7', f: () => { const t = g().divs[g().club.tier].tab[0]; g().openTarget = { pts: t.pts, p: t.p }; fx('conf', 3); return 'The board will check after six games.'; } },
  { l: 'Leave it to the coach', h: '', f: () => 'The coach sets his own pace.' }]);
blockBrief('autumn', null, 'The long middle', () => 'Ten weeks without a window. Where should the club put its energy?', [
  { l: 'Back the academy', h: 'Academy backing for three weeks', f: () => { g().push.academy = 3; return 'The academy has your attention.'; } },
  { l: 'Back the first team', h: 'Sporting backing for three weeks', f: () => { g().push.sporting = 3; return 'The first team has your attention.'; } },
  { l: 'Back the business side', h: 'Running costs −5% for three weeks', f: () => { g().push.business = 3; return 'The business side has your attention.'; } }]);
blockBrief('winter', 'dof', 'Winter window: weeks 17 and 18', () => `${N('dof')}: "The window opens next week, for two weeks only. Prices go up in winter. How much do we do?"`, [
  { l: 'Back him with extra cash', h: c => `Transfer kitty +${money(M(3000))} from cash`, f: () => { g().club.kitty = (g().club.kitty || 0) + M(3000); fx('cash', -M(3000)); return 'He has more to spend this winter.'; } },
  { l: 'Only fix urgent gaps', h: 'Normal limits', f: () => 'Normal business.' },
  { l: 'No winter spending', h: 'Fee limit: free agents only until summer', f: () => { g().winterPrev = g().mand.dof.maxFee; g().mand.dof.maxFee = '0'; return 'Free agents only this winter.'; } }]);
blockBrief('runin', 'dof', 'The run-in', () => { const n = sq().filter(p => p.contract <= 1).length; return `${N('dof')}: "${n} contract${n === 1 ? '' : 's'} run out this summer. We can start talks now or wait."`; }, [
  { l: 'Start talks with key players now', h: 'Best expiring players renew at today\'s price', f: () => { const med = sq().map(p => p.ca).sort((a, b) => a - b)[Math.floor(sq().length / 2)]; const ks = sq().filter(p => p.contract <= 1 && p.ca >= med && !p.loan); ks.slice(0, 3).forEach(p => { p.wage = Math.round(Math.max(p.wage, F.wageFor(p.ca)) * 1.05 / 5) * 5; p.contract = 1 + ri(2, 3); }); return ks.length ? `${ks.slice(0, 3).map(p => p.name).join(', ')} sign early.` : 'Nobody key is out of contract.'; } },
  { l: 'Wait until the summer', h: 'Cheaper now, riskier later', f: () => { sq().filter(p => p.contract <= 1).forEach(p => p.talkLater = true); return 'Talks wait for the summer. Some may ask for more.'; } }]);
blockBrief('finale', 'coach', 'The final five', () => `${N('coach')}: "Five games left. ${F.myPos() <= tgt() ? 'We are on target.' : 'We are behind target.'} A win bonus would sharpen the players."`, [
  { l: 'Pay a bonus for every win', h: c => `${money(M(250))} per win · small edge in each game`, f: () => { g().winBonus = true; return 'The bonus is on.'; } },
  { l: 'No bonus', h: '', f: () => 'The players play for the shirt.' }]);

/* ---------- stake matches (replaces big_game) ---------- */
if (F.BR.big_game) F.BR.big_game.check = () => null;
const KIND_T = { derby: 'Derby', top: 'Top-of-table clash', bottom: 'Survival clash', late: 'Big match' };
B('stake_match', { role: 'coach', cd: 1,
  check: () => { const s = g().stake; return s && s.week === g().week ? { ...s, score: 3.5 } : null; },
  title: c => `${KIND_T[c.kind]}: ${F.cname(c.opp)} ${c.home ? 'at home' : 'away'}`,
  text: c => c.kind === 'derby' ? `The game the town cares about most. Win and the supporters are behind us for weeks. Lose and it stings.` : `${F.cname(c.opp)} are ${ord(c.op)}, we are ${ord(F.myPos())}. Points here count double in the table and in the boardroom.`,
  opts: [
    { l: 'Win bonus for this game', h: c => `${money(M(400))} · small edge`, f: () => { fx('cash', -M(400)); g().matchEdge = { w: g().week, v: 0.25 }; return 'The players know what is on the line.'; } },
    { l: 'Visit the dressing room', h: 'Morale +3', f: () => { sq().forEach(p => p.morale = clamp(p.morale + 3, 0, 100)); return 'A short speech. The room listens.'; } },
    { l: 'Keep it normal', h: '', f: () => 'Just another game, says the coach.' }] });
const bw = H.seasonAfterMatch; H.seasonAfterMatch = ours => { bw(ours); if (g().winBonus && g().week >= 29) g().matchEdge = { w: g().week + 1, v: 0.12 }; };

/* ---------- board reviews ---------- */
function verdict() { const me = F.myPos(), t = tgt(), d = t - me; return d >= 2 ? 'ahead' : d >= -1 ? 'on' : 'behind'; }
F.defineEvent('board_review', { forced: 1, from: 'board', dept: 'board', cd: 2, why: c => `The board reviews the season in weeks 10, 19 and 29. This is week ${c.w}.`,
  setup: () => ({ w: g().week }),
  title: c => { c.v = c.v || verdict(); return `Board review, week ${c.w}: ${c.v === 'ahead' ? 'ahead of target' : c.v === 'on' ? 'on track' : 'behind target'}`; },
  body: c => { c.v = c.v || verdict(); const me = F.myPos(), plan = g().recovery; return `We are ${ord(me)}, the target is ${ord(tgt())}. Board confidence ${Math.round(g().board.conf)}.${plan && c.v === 'behind' ? ' You promised a recovery at the last review. It has not come.' : ''} ${c.v === 'ahead' ? 'The chairman is pleased and open to ideas.' : c.v === 'on' ? 'The chairman wants more of the same.' : 'The chairman wants to know what you will do about it.'}`; },
  opts: [
    { l: c => c.v === 'ahead' ? 'Ask for a bigger transfer kitty' : c.v === 'on' ? 'Ask for a small top-up' : 'Present a recovery plan', h: c => c.v === 'ahead' ? `Kitty +${money(M(4000))} · board −1` : c.v === 'on' ? `Kitty +${money(M(2000))} · board −2` : 'Board +5 now · −8 if still behind next review', f: c => { const v = c.v || verdict(); if (v === 'ahead') { g().club.kitty = (g().club.kitty || 0) + M(4000); fx('conf', -1); return 'The board releases more money.'; } if (v === 'on') { g().club.kitty = (g().club.kitty || 0) + M(2000); fx('conf', -2); return 'A small top-up, reluctantly.'; } if (g().recovery) fx('conf', -8); g().recovery = true; fx('conf', 5); return 'The board gives you the benefit of the doubt. Once.'; } },
    { l: c => c.v === 'ahead' ? 'Raise our own target' : c.v === 'on' ? 'Steady as she goes' : 'Ask for patience', h: c => c.v === 'ahead' ? 'Target one place higher · board +6' : c.v === 'on' ? 'Board +2' : 'Depends on how much credit you have', f: c => { const v = c.v || verdict(); if (v === 'ahead') { const o = g().board.obj.find(o => o.k === 'league'); o.target = Math.max(1, o.target - 1); o.t = `Finish ${ord(o.target)} or higher`; fx('conf', 6); return `New target: ${ord(o.target)}.`; } if (v === 'on') { fx('conf', 2); return 'Noted with approval.'; } if (g().recovery) fx('conf', -8); if (chance(g().board.conf / 100)) { fx('conf', 2); return 'The board agrees to wait.'; } fx('conf', -4); return 'Patience is running out.'; } },
    { l: c => c.v === 'behind' ? 'Offer cost cuts' : 'Bank the goodwill', h: c => c.v === 'behind' ? 'Scouting and marketing budgets −15 · board +4' : 'Board +4', f: c => { const v = c.v || verdict(); if (v === 'behind') { if (g().recovery) fx('conf', -8); g().recovery = false; for (const r of ['scout', 'mkt']) if (g().mand[r]) g().mand[r].budget = clamp((g().mand[r].budget || 45) - 15, 0, 100); fx('conf', 4); return 'Cuts announced. The board likes discipline.'; } fx('conf', 4); return 'The board notes your restraint.'; } }],
  auto: c => (c.v || verdict()) === 'behind' ? 1 : 2, vacant: 2 });
const bwk = H.seasonWeekly; H.seasonWeekly = () => { bwk(); const G = g(); if (G.week === 11 || G.week === 20 || G.week === 30) { if (G.recovery && verdict() !== 'behind') G.recovery = false; } };

/* ---------- winter deadline ---------- */
B('winter_deadline', { role: 'dof', cd: 2,
  check: () => { const G = g(); if (G.week !== 18) return null; const live = (G.rec ? G.rec.pipe : []).filter(x => x.stage === 'negotiating'); return live.length ? { n: live.length, score: 3.2 } : null; },
  title: c => `The winter window shuts this week`, text: c => `${N('dof')}: "${c.n} deal${c.n === 1 ? ' is' : 's are'} still open. Anything not done by Sunday dies."`,
  opts: [
    { l: 'Give him 15% more room', h: 'Higher ceiling on open deals', f: () => { (g().rec.pipe || []).filter(x => x.stage === 'negotiating' && x.deal).forEach(x => x.deal.cap = Math.round(x.deal.cap * 1.15 / 100) * 100); return 'More room to close.'; } },
    { l: 'Stick to the limits', h: '', f: () => 'The limits stay.' }] });

/* ---------- loans ---------- */
F.recLoan = x => {
  const r = g().rec, p = r.pool[x.pid]; if (!p) return;
  const wage = Math.round(p.wageAsk * 0.5 / 5) * 5, from = p.club, fromN = from != null && g().clubs[from] ? F.cname(from) : 'a bigger club';
  F.recForceSign(x.pid, 0, wage, `Season-long loan from ${fromN}. We pay half his wages.`);
  p.loan = true; p.loanFrom = from; p.loanUntil = g().season;
  g().paper.stories.push({ h: 'Loan signing', t: `${p.name} joins on loan from ${fromN} until the end of the season.` });
};

function loansBack() {
  const G = g(), back = [];
  for (const p of (G.loanedOut || [])) { const w = F.POSW[p.pos]; for (const a in w) p.a[a] = clamp(p.a[a] + Math.max(0, p.pa - p.ca) * 0.3 + 0.2, 1, 20); F.upd(p); delete p.loanOut; G.squad.push(p); back.push(p.name); }
  G.loanedOut = [];
  const ret = sq().filter(p => p.loan && p.loanUntil < G.season); for (const p of ret) { G.squad = G.squad.filter(x => x !== p); }
  if (back.length || ret.length) G.paper.stories.push({ h: 'Loans', t: `${back.length ? back.join(', ') + ' back from loan. ' : ''}${ret.length ? ret.map(p => p.name).join(', ') + ' return to their clubs.' : ''}` });
}

/* ---------- signing evaluations ---------- */
F.recEval = season => {
  const r = g().rec; if (!r) return [];
  return r.log.filter(l => l.s === season).map(l => {
    const p = sq().find(q => q.name === l.name && q.pos === l.pos), st = p && ((p.st && p.st.apps) || !p.lastSeason ? p.st : p.lastSeason);
    if (!p) return { ...l, gone: true, verdict: 'Gone', cls: '' };
    const apps = st.apps, rat = apps ? st.rat / apps : 0, est = l.est != null ? F.stars(l.est) : null, now = F.stars(p.ca), share = apps / Math.max(1, g().ss.lg || g().week - 1);
    const v = apps < 3 && g().week > 12 ? 'Miss' : rat >= 6.9 || (share >= 0.6 && rat >= 6.6) ? 'Hit' : rat && rat < 6.3 ? 'Miss' : 'Fair';
    return { ...l, p, apps, rat, est, now, loan: !!p.loan, verdict: v, cls: v === 'Hit' ? 'good' : v === 'Miss' ? 'bad' : '' };
  });
};
B('signing_review', { role: 'dof', cd: 30,
  check: () => { const G = g(); if (G.week !== 19 && G.week !== 33) return null; const ev = F.recEval(G.season).filter(e => !e.gone); return ev.length >= 2 ? { score: 2.6, hit: ev.filter(e => e.verdict === 'Hit').length, miss: ev.filter(e => e.verdict === 'Miss').length, n: ev.length } : null; },
  title: c => `Recruitment review: ${c.hit} hit${c.hit === 1 ? '' : 's'}, ${c.miss} miss${c.miss === 1 ? '' : 'es'}`,
  text: c => `${N('dof')} goes through the ${c.n} signings of this season with you. The full list is on the Recruitment page.`,
  opts: [
    { l: 'Praise the scouts', h: 'Chief Scout trust +4', f: () => { const s = staff('scout'); if (s) s.rel = clamp(s.rel + 4, 0, 100); return 'The scouts appreciate it.'; } },
    { l: 'Question the misses', h: 'DoF trust −3 · he wants surer reports before he recommends', f: c => { const d = staff('dof'); if (d) d.rel = clamp(d.rel - 3, 0, 100); g().mand.dof.data = clamp((g().mand.dof.data || 50) + 10, 0, 100); return 'He will lean more on data.'; } },
    { l: 'Note it and move on', h: '', f: () => 'Noted.' }] });

/* ---------- season end: undo winter freeze ---------- */
const rs = H.recSeason; H.recSeason = rep => { rs(rep); const G = g(); if (G.winterPrev) { G.mand.dof.maxFee = G.winterPrev; delete G.winterPrev; } if (G.freezePrev) { G.mand.dof.maxFee = G.freezePrev; delete G.freezePrev; } G.winBonus = false; G.recovery = false; G.openTarget = null; rep.signings = F.recEval(G.season); };
})(FO);
