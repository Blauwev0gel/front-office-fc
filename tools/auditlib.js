// Audit: playstyles, counterfactual levers, decision spread, text repetition.
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = ['engine.js', 'events.js', 'events2.js', 'events3.js', 'briefs.js', 'academy.js', 'academy2.js', 'recruit.js', 'summer.js', 'season.js', 'summer2.js', 'firstteam.js', 'depts.js', 'levers.js', 'commercial.js', 'marketing.js', 'business.js', 'academy3.js', 'recruitx.js', 'matchtalk.js', 'desk.js', 'talks.js', 'weekflow.js', 'weekloop.js', 'loop.js', 'dossiers.js', 'pathway.js', 'matchday.js'].map(f => require('../test/src.js')(f)).join('\n');
function boot() { const ctx = { console, module: undefined }; vm.createContext(ctx); vm.runInContext(src + '\n;this.FO=FO;', ctx); return ctx.FO; }

function run(seed, style, opts = {}) {
  const FO = boot(); FO.newGame(seed); const pick = a => a[Math.floor(FO.rnd() * a.length)];
  const d = {}; for (const q of FO.DNA) d[q.k] = q.o[(seed >> 2) % q.o.length].v; if (opts.dna) Object.assign(d, opts.dna);
  FO.setDNA(d, 'Test United', 'TST', 'Testford', ['#123', '#fff']);
  for (const role of FO.ROLES) { let ix = (opts.hire || {})[role.id] != null ? opts.hire[role.id] : 1; const cs = FO.G.cands[role.id]; if (opts.hireMode === 'cheap') ix = cs.reduce((b, x, i) => x.wage < cs[b].wage ? i : b, 0); if (opts.hireMode === 'best') ix = cs.reduce((b, x, i) => FO.ovr(x) > FO.ovr(cs[b]) ? i : b, 0); FO.hire(role.id, ix); } if (opts.dofAt != null && FO.G.staff.dof) FO.G.staff.dof.at = FO.G.staff.dof.at.map(() => opts.dofAt); if (opts.headAt) for (const r in opts.headAt) if (FO.G.staff[r]) FO.G.staff[r].at = FO.G.staff[r].at.map(() => opts.headAt[r]); FO.finishStaff(); FO.finishMandates(); if (opts.auth != null) { FO.G.auth = {}; for (const h of ['coach','dof','acad','com','mkt','fin']) FO.G.auth[h] = opts.auth; }
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
  if (opts.recStaff) { FO.G.club.cash += 1e5; for (const r of ['sc', 'data', 'neg']) { FO.G.dept.recruit.staff.length = Math.min(FO.G.dept.recruit.staff.length, 3); const c = FO.deptCands('recruit', r)[0]; c.left = 0; c.since = 1; FO.G.dept.recruit.staff.push(c); } FO.G.club.cash -= 1e5; }
  for (let s = 0; s < (opts.seasons || 5); s++) {
    while (FO.G.phase === 'season') {
      const g = FO.G;
      if (opts.firstBud != null) g.deptB.first = opts.firstBud;
      if (opts.mand) Object.assign(g.mand.coach, opts.mand);
      if (opts.mk && FO.mkView) { const X = FO.mkView().X; if (opts.mk.comm != null) X.comm = opts.mk.comm; if (opts.mk.camp && !X.camp) { g.club.cash += 5000; FO.mkCamp(opts.mk.camp); g.club.cash -= 5000; } }
      if (opts.rxInvest && FO.rxInvest && g.week % 8 === 1) { g.club.cash += 5000; FO.rxInvest(g.mand.scout.reg1); g.club.cash -= 5000; }
      if (opts.biz && FO.bizSetLevel) FO.BIZ_DK.forEach(k => FO.bizSetLevel(k, opts.biz));
      if (opts.com && FO.comView) { const X = FO.comView().X; if (opts.com.exp) X.exp = opts.com.exp; if (opts.com.pf) for (const k in X.pf) X.pf[k] = opts.com.pf; }
      { const need = g.inbox.filter(m => !m.done).length + (g.briefs || []).filter(b => !b.done).length; const stake = (g.briefs || []).some(b => b.t === 'stake_match' || /^block_/.test(b.t)) || g.inbox.some(m => m.ev === 'board_review' || /^vote_/.test(m.ev) || (/^dos_/.test(m.ev) && !m.done)); const B = FO.goalView ? FO.goalView() : null; const live = B && B.done == null && B.possible && B.left <= 2; const dz = FO.backers ? FO.backers().some(b => b.danger) : false; out.wk = out.wk || { n: 0, dead0: 0, dead1: 0 }; out.wk.n++; const base = need <= 1 && !stake; if (base) out.wk.dead0++; if (base && !live && !dz) out.wk.dead1++; }
      for (const m of g.inbox.filter(m => !m.done)) {
        const v = FO.msgView(m); out.msgs++; out.words.push((v.body || '').split(/\s+/).length);
        out.ev[m.ev] = (out.ev[m.ev] || 0) + 1; out.needM = (out.needM || 0) + 1; out.evNeed = out.evNeed || {}; out.evNeed[m.ev] = (out.evNeed[m.ev] || 0) + 1;
        if (style === 'passive' || opts.noInbox || g.ap < 1) continue;
        const i = style === 'active' ? v.auto : style === 'risky' ? v.opts.length - 1 : Math.floor(FO.rnd() * v.opts.length);
        (out.evChoice[m.ev] = out.evChoice[m.ev] || []).push(i); FO.respond(m.id, i);
      }
      if (g.meeting && g.meeting.week === g.week && g.meeting.season === g.season) g.meeting.items.forEach((it, i) => FO.decideProposal(i, opts.props || (style === 'passive' ? 'reject' : 'approve')));
      (g.briefs || []).forEach(b => { out.briefN++; if (!b.done) out.needB = (out.needB || 0) + 1; out.briefs[b.t] = (out.briefs[b.t] || 0) + 1; if (style !== 'passive' && !opts.noBrief && !b.done) { const v = FO.briefView(b); FO.answerBrief(b.id, style === 'risky' ? v.opts.length - 1 : 0); } });
      if (style === 'active' && !opts.noTalk && g.ap > 0 && g.week % 4 === 0 && g.staff.coach) { FO.ftTalkStart(); let n = 0; while (g.ft.talk && !g.ft.talk.done && n++ < 5) FO.ftTalkAnswer(g.ft.talk.opts[0].id); FO.ftTalkClose(); }
      const res = FO.endWeek(); out.weeks++; out.gs = (out.gs || 0) + (g.grip || 0); out.gn = (out.gn || 0) + 1; { const sq = g.squad.slice().sort((x, y) => y.ca - x.ca).slice(0, 18); (out.fs = out.fs || []).push([g.board.conf, g.st.fans, g.st.press, sq.reduce((t, p) => t + p.morale, 0) / Math.max(1, sq.length)]); } { const lm = g.lastMatch; if (lm && lm.home && lm.att && g.club.cap) { out.fill = (out.fill || 0) + lm.att / g.club.cap; out.fillN = (out.fillN || 0) + 1; } } out.proj = (out.proj || 0) + ((g.projects || []).length ? 0 : 0); out.meet = (out.meet || 0) + (g.meeting && g.meeting.week === g.week ? 1 : 0);
      for (const st of (g.paper && g.paper.stories) || []) out.paper[st.h] = (out.paper[st.h] || 0) + 1;
      for (const role of FO.ROLES) if (!g.staff[role.id] && g.cands[role.id]) FO.hire(role.id, 1);
      out.cashMin = Math.min(out.cashMin, g.club.cash);
      if (out.weeks > 600) break;
    }
    if (FO.G.phase === 'sacked') { out.sacked = 1; out.sackS = FO.G.season; out.sackWhy = FO.G.sackReason; out.sackCash = Math.round(FO.G.club.cash); break; }
    const rep = FO.G.lastReport; const pts = FO.G.history[FO.G.history.length - 1].pts;
    const fillAvg = (FO.G.ft && FO.G.ft.fillN) ? FO.G.ft.fill / FO.G.ft.fillN : 0;
    out.seasons.push({ fans: FO.G.club.fanbase, brand: Math.round(FO.G.club.brand), spons: FO.sponsorIncome(), acadPA: FO.G.academy.length ? +(FO.G.academy.reduce((x, p) => x + p.pa, 0) / FO.G.academy.length).toFixed(2) : 0, grads: FO.G.squad.filter(p => p.grad || p.academy).length, sqCA: +(FO.G.squad.reduce((x, p) => x + p.ca, 0) / FO.G.squad.length).toFixed(2), tier: rep.tier, pos: rep.pos, pts, up: rep.moves.some(m => /promot/i.test(m)), down: rep.moves.some(m => /relegat/i.test(m)), cash: Math.round(FO.G.club.cash), conf: Math.round(FO.G.board.conf) });
    if (FO.G.phase !== 'review') break;
    FO.startSeason(); doPre(); for (const id of FO.G.press) FO.pressAnswer(id, 1); FO.finishPress();
  }
  out.u21 = FO.G.ft && FO.G.ft.played ? FO.G.ft.u21 / FO.G.ft.played : 0; out.pw = FO.G.pw ? { stage: FO.G.pw.stage, route: FO.G.pw.ag && FO.G.pw.ag.route, ev: FO.G.pw.ev && FO.G.pw.ev.verdict } : null; out.pwLog = FO.G.pwLog || []; out.cred = FO.G.cred; out.dos = FO.G.dos; out.pressure = FO.G.pressure; out.bg = FO.G.bgLog || []; out.voteEv = Object.keys(out.ev || {}).filter(k => /^vote_/.test(k)).reduce((a, k) => a + out.ev[k], 0); out.sackWhy = FO.G.sackReason || ''; out.desk = FO.G.desk || {}; out.drift = FO.G.club.drift; out.rel = Object.values(FO.G.staff).filter(Boolean).reduce((a, x) => a + x.rel, 0) / Math.max(1, Object.values(FO.G.staff).filter(Boolean).length); out.gripAvg = out.gn ? out.gs / out.gn : 0; out.seasons.forEach(x => x.ppg = x.pts / 38); out.endTier = FO.G.club.tier; out.fillAvg = out.fillN ? out.fill / out.fillN : 0; return out;
}
module.exports=run;