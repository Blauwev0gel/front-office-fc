// Audit: playstyles, counterfactual levers, decision spread, text repetition.
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = ['engine.js', 'events.js', 'events2.js', 'events3.js', 'briefs.js', 'academy.js', 'academy2.js', 'recruit.js', 'summer.js', 'season.js', 'summer2.js', 'firstteam.js', 'depts.js', 'levers.js', 'commercial.js', 'marketing.js', 'business.js', 'academy3.js', 'recruitx.js', 'matchtalk.js', 'desk.js', 'talks.js', 'weekflow.js', 'weekloop.js'].map(f => require('./src.js')(f)).join('\n');
function boot() { const ctx = { console, module: undefined }; vm.createContext(ctx); vm.runInContext(src + '\n;this.FO=FO;', ctx); return ctx.FO; }

function run(seed, style, opts = {}) {
  const FO = boot(); FO.newGame(seed); const pick = a => a[Math.floor(FO.rnd() * a.length)];
  const d = {}; for (const q of FO.DNA) d[q.k] = q.o[(seed >> 2) % q.o.length].v;
  FO.setDNA(d, 'Test United', 'TST', 'Testford', ['#123', '#fff']);
  for (const role of FO.ROLES) FO.hire(role.id, (opts.hire || {})[role.id] != null ? opts.hire[role.id] : 1); if (opts.dofAt != null && FO.G.staff.dof) FO.G.staff.dof.at = FO.G.staff.dof.at.map(() => opts.dofAt); FO.finishStaff(); FO.finishMandates();
  const out = { seasons: [], ev: {}, evChoice: {}, paper: {}, briefs: {}, weeks: 0, msgs: 0, briefN: 0, sacked: 0, cashMin: 1e9, words: [] };
  const doPre = () => {
    if (FO.G.phase === 'summer') { FO.sumView(); FO.sumPlanner(); FO.sumAuto(FO.rnd, style !== 'passive'); return; }
    FO.preSetTarget(style === 'risky' ? 'bold' : style === 'passive' ? 'accept' : 'accept');
    FO.G.meeting && FO.G.meeting.items.forEach((it, i) => FO.decideProposal(i, style === 'passive' ? 'approve' : style === 'risky' ? 'approve' : (FO.rnd() < 0.6 ? 'approve' : 'reject')));
    FO.finishPreseason();
  };
  doPre(); for (const id of FO.G.press) FO.pressAnswer(id, style === 'risky' ? 0 : 1); FO.finishPress();
  if (opts.staffAll) for (const dd of FO.DEPTS) { for (let i = 0; i < 2; i++) { const v = FO.deptView(dd.k); if (v.open.length) { FO.G.club.cash += 1e5; FO.deptHire(dd.k, v.open[0].role, 0); FO.G.club.cash -= 1e5; } } }
  if (opts.firstBud != null) { FO.deptEnsure(); FO.G.deptB.first = opts.firstBud; }
  for (let s = 0; s < (opts.seasons || 5); s++) {
    while (FO.G.phase === 'season') {
      const g = FO.G;
      if (opts.firstBud != null) g.deptB.first = opts.firstBud;
      if (opts.mand) Object.assign(g.mand.coach, opts.mand);
      for (const m of g.inbox.filter(m => !m.done)) {
        const v = FO.msgView(m); out.msgs++; out.words.push((v.body || '').split(/\s+/).length);
        out.ev[m.ev] = (out.ev[m.ev] || 0) + 1;
        if (style === 'passive' || opts.noInbox || g.ap < 1) continue;
        const i = style === 'active' ? v.auto : style === 'risky' ? v.opts.length - 1 : Math.floor(FO.rnd() * v.opts.length);
        (out.evChoice[m.ev] = out.evChoice[m.ev] || []).push(i); FO.respond(m.id, i);
      }
      if (g.meeting && g.meeting.week === g.week && g.meeting.season === g.season) g.meeting.items.forEach((it, i) => FO.decideProposal(i, opts.props || (style === 'passive' ? 'reject' : 'approve')));
      (g.briefs || []).forEach(b => { out.briefN++; out.briefs[b.t] = (out.briefs[b.t] || 0) + 1; if (style !== 'passive' && !opts.noBrief && !b.done) { const v = FO.briefView(b); FO.answerBrief(b.id, style === 'risky' ? v.opts.length - 1 : 0); } });
      if (style === 'active' && !opts.noTalk && g.ap > 0 && g.week % 4 === 0 && g.staff.coach) { FO.ftTalkStart(); let n = 0; while (g.ft.talk && !g.ft.talk.done && n++ < 5) FO.ftTalkAnswer(g.ft.talk.opts[0].id); FO.ftTalkClose(); }
      const res = FO.endWeek(); out.weeks++; out.proj = (out.proj || 0) + ((g.projects || []).length ? 0 : 0); out.meet = (out.meet || 0) + (g.meeting && g.meeting.week === g.week ? 1 : 0);
      for (const st of (g.paper && g.paper.stories) || []) out.paper[st.h] = (out.paper[st.h] || 0) + 1;
      for (const role of FO.ROLES) if (!g.staff[role.id] && g.cands[role.id]) FO.hire(role.id, 1);
      out.cashMin = Math.min(out.cashMin, g.club.cash);
      if (out.weeks > 600) break;
    }
    if (FO.G.phase === 'sacked') { out.sacked = 1; out.sackS = FO.G.season; out.sackWhy = FO.G.sackReason; out.sackCash = Math.round(FO.G.club.cash); break; }
    const rep = FO.G.lastReport; const pts = FO.G.history[FO.G.history.length - 1].pts;
    out.seasons.push({ tier: rep.tier, pos: rep.pos, pts, up: rep.moves.some(m => /promot/i.test(m)), down: rep.moves.some(m => /relegat/i.test(m)), cash: Math.round(FO.G.club.cash), conf: Math.round(FO.G.board.conf) });
    if (FO.G.phase !== 'review') break;
    FO.startSeason(); doPre(); for (const id of FO.G.press) FO.pressAnswer(id, 1); FO.finishPress();
  }
  out.endTier = FO.G.club.tier; return out;
}
const N = +process.argv[2] || 20, S = +process.argv[3] || 5;
const agg = {};
for (const style of ['passive', 'active', 'random', 'risky']) {
  const R = []; for (let i = 0; i < N; i++) R.push(run(1000 + i * 7919, style, { seasons: S }));
  const ss = R.flatMap(r => r.seasons);
  agg[style] = { sacked: R.filter(r => r.sacked).length / N, sackS: R.filter(r => r.sacked).map(r => r.sackS), up: ss.filter(s => s.up).length / ss.length, down: ss.filter(s => s.down).length / ss.length, ppg: (ss.reduce((a, s) => a + s.pts, 0) / ss.length / 34).toFixed(2), endTier: (R.reduce((a, r) => a + r.endTier, 0) / N).toFixed(2), cashMinNeg: R.filter(r => r.cashMin < 0).length / N, msgsPerWk: (R.reduce((a, r) => a + r.msgs, 0) / R.reduce((a, r) => a + r.weeks, 0)).toFixed(2), briefsPerWk: (R.reduce((a, r) => a + r.briefN, 0) / R.reduce((a, r) => a + r.weeks, 0)).toFixed(2), words: Math.round(R.flatMap(r => r.words).reduce((a, b) => a + b, 0) / Math.max(1, R.flatMap(r => r.words).length)), posDist: ss.map(s => s.pos) };
  if (style === 'random') {
    const ev = {}, pap = {}, br = {}; R.forEach(r => { for (const k in r.ev) ev[k] = (ev[k] || 0) + r.ev[k]; for (const k in r.paper) pap[k] = (pap[k] || 0) + r.paper[k]; for (const k in r.briefs) br[k] = (br[k] || 0) + r.briefs[k]; });
    const seasonsN = ss.length;
    agg.repeat = { events: Object.entries(ev).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => k + ' ' + (v / seasonsN).toFixed(1) + '/season'), distinctEvents: Object.keys(ev).length, paper: Object.entries(pap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => k + ' ' + (v / seasonsN).toFixed(1)), briefs: Object.entries(br).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => k + ' ' + (v / seasonsN).toFixed(1)) };
  }
  if (style === 'active') { const ch = {}; R.forEach(r => { for (const k in r.evChoice) (ch[k] = ch[k] || []).push(...r.evChoice[k]); }); agg.autoPickSpread = Object.entries(ch).filter(([k, v]) => v.length > 10).map(([k, v]) => k + ': ' + [0, 1, 2, 3].map(i => Math.round(v.filter(x => x === i).length / v.length * 100)).join('/')).slice(0, 15); }
}
// counterfactual levers on matched seeds (passive CEO, 3 seasons)
const lev = {};
const base = (o) => { const R = []; for (let i = 0; i < N; i++) R.push(run(5000 + i * 104729, 'active', Object.assign({ seasons: 3 }, o))); const ss = R.flatMap(r => r.seasons); return { ppg: +(ss.reduce((a, s) => a + s.pts, 0) / ss.length / 34).toFixed(3), up: +(ss.filter(s => s.up).length / ss.length).toFixed(2), sack: R.filter(r => r.sacked).length, cash: Math.round(ss.reduce((a, s) => a + s.cash, 0) / ss.length) }; };
lev.baseline = base({});
lev.allDeptStaff = base({ staffAll: true });
lev.firstBud0 = base({ firstBud: 0 });
lev.firstBud100 = base({ firstBud: 100 });
lev.attack90 = base({ mand: { attack: 90 } });
lev.attack10 = base({ mand: { attack: 10 } });
lev.youth90 = base({ mand: { youthMins: 90 } });
lev.intensity90 = base({ mand: { intensity: 90 } });
console.log(JSON.stringify({ agg, lev }, null, 1));
