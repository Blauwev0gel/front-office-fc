// Long-run measurement: plays N careers x M seasons with the full module list and a random CEO, and writes per-message
// and per-season data to a JSON file. Usage: node tools/longrun.js [runs=12] [seasons=10] [out.json]
// Read it with: node tools/longrun-analyze.js out.json   (see notes/longevity-2026-11.md)
// Headless simulation: plays N seasons with random CEO behaviour and checks invariants.
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = ['engine.js', 'events.js', 'events2.js', 'events3.js', 'briefs.js', 'academy.js', 'academy2.js', 'recruit.js', 'summer.js', 'season.js', 'summer2.js', 'firstteam.js', 'depts.js', 'levers.js', 'commercial.js', 'marketing.js', 'business.js', 'academy3.js', 'recruitx.js', 'world.js', 'matchtalk.js', 'desk.js', 'talks.js', 'weekflow.js', 'weekloop.js', 'loop.js', 'dossiers.js', 'pathway.js'].map(f => require(require('path').join(__dirname, '..', 'test', 'src.js'))(f)).join('\n');
function boot() { const ctx = { console, module: undefined }; vm.createContext(ctx); vm.runInContext(src + '\n;this.FO=FO;', ctx); return ctx.FO; }
const runs = +process.argv[2] || 6, seasons = +process.argv[3] || 3;
const summary = []; const OUT = {runs: []};
for (let r = 0; r < runs; r++) {
  const FO = boot();
  // CEO style: random (default), absent (never answers anything), staff (always takes the head's own pick)
  const POLICY = process.env.LONGRUN_POLICY || 'random';
  if (POLICY === 'absent') for (const k of ['respond', 'answerBrief', 'talk', 'push', 'ftTalkStart', 'decideProposal', 'secondOpinion', 'pressAnswer']) if (k !== 'pressAnswer') FO[k] = () => null;
  if (POLICY === 'staff') { const r0 = FO.respond; FO.respond = (id, idx) => { const m = FO.G.inbox.find(x => x.id === id), e = m && FO.EV[m.ev]; let a = idx; try { if (e && e.auto) a = e.auto(m.ctx); } catch (err) { } return r0(id, a); }; } const G = FO.newGame(1000 + r * 7919);
  const pick = a => a[Math.floor(FO.rnd() * a.length)];
  const d = {}; for (const q of FO.DNA) d[q.k] = pick(q.o).v;
  FO.setDNA(d, 'Test United', 'TST', 'Testford', ['#123', '#fff']);
  const HIRE = process.env.LONGRUN_HIRE || 'default'; // default: candidate 1, best, worst: by overall rating
  const hireIdx = r => { const c = FO.G.cands[r] || []; if (HIRE === 'default' || !c.length) return 1; let b = 0; c.forEach((x, i) => { if (HIRE === 'best' ? FO.ovr(x) > FO.ovr(c[b]) : FO.ovr(x) < FO.ovr(c[b])) b = i; }); return b; };
  for (const role of FO.ROLES) FO.hire(role.id, hireIdx(role.id));
  FO.finishStaff(); FO.finishMandates();
  const doPre = () => { if (FO.G.phase === 'summer') { FO.sumView(); FO.sumPlanner(); FO.sumAuto(FO.rnd, r % 2 === 1); FO.G.lastSum = FO.G.lastSummer; return; } FO.preSetTarget(pick(['safe','accept','bold'])); const fo = FO.FOCUS.filter(f => !FO.G.board.obj.some(o => o.k === f.k)); FO.preToggleFocus(pick(fo).k); FO.preToggleFocus(pick(fo).k); FO.G.meeting && FO.G.meeting.items.forEach((it,i) => { FO.proposalView(it); if (FO.rnd()<0.3) FO.decideProposal(i,'second'); FO.decideProposal(i, FO.rnd()<0.5?'approve':'reject'); }); FO.weekForecast(); FO.finishPreseason(); };
  doPre();
  const doPress = () => { for (const id of FO.G.press) { const q = FO.PRESS.find(p => p.id === id); FO.pressAnswer(id, Math.floor(FO.rnd() * q.a.length)); } FO.finishPress(); };
  doPress();
  let weeks = 0, errs = [], log = []; const R = { r, dna: d, seen: new Set(), msgs: [], seasons: [], quiet: 0, weeksN: 0, perWeek: [], sacked: null, briefs: {} };

  outer: for (let s = 0; s < seasons; s++) {
    while (FO.G.phase === 'season') {
      const g = FO.G;
      // act
      for (const m of g.inbox.filter(m => !m.done)) { if (g.ap < 1) break; if (FO.rnd() < 0.6) { const v = FO.msgView(m); FO.respond(m.id, Math.floor(FO.rnd() * v.opts.length)); } }
      if (g.meeting && g.meeting.week === g.week && g.meeting.season === g.season) g.meeting.items.forEach((it, i) => { if (FO.rnd() < 0.3 && g.ap > 0) FO.decideProposal(i, 'second'); FO.decideProposal(i, FO.rnd() < 0.5 ? 'approve' : 'reject'); });
      for (const m of g.inbox.filter(m => !m.done)) if (g.ap > 0 && FO.rnd() < 0.2) FO.secondOpinion(m.id);
      (g.briefs || []).forEach(b => { const v = FO.briefView(b); if (FO.rnd() < 0.7) FO.answerBrief(b.id, Math.floor(FO.rnd() * v.opts.length)); });
      g.bstat = g.bstat || {}; (g.briefs || []).forEach(b => g.bstat[b.t] = (g.bstat[b.t] || 0) + 1); g.bcount = (g.bcount || 0) + (g.briefs || []).length; g.wcount = (g.wcount || 0) + 1;
      if (g.ap > 0 && FO.rnd() < 0.5) FO.talk(pick(FO.ROLES).id, pick(['praise', 'challenge', 'reassure', 'warn']));
      if (g.ap > 0 && FO.rnd() < 0.4) FO.push(pick(Object.keys(FO.PUSH)));
      if (g.ap > 0 && FO.rnd() < 0.25 && FO.G.staff.coach) { FO.ftTalkStart(); let n = 0; while (g.ft.talk && !g.ft.talk.done && n++ < 6) { const o = g.ft.talk.opts; FO.ftAnswer = FO.ftTalkAnswer(pick(o).id); } FO.ftTalkClose(); }
      if (FO.rnd() < 0.05) { const dk = pick(FO.DEPTS).k, v = FO.deptView(dk); if (v.open.length && v.used < v.slots) FO.deptHire(dk, pick(v.open).role, Math.floor(FO.rnd() * 2)); }
      if (FO.rnd() < 0.01) { const dk = pick(FO.DEPTS).k, v = FO.deptView(dk); if (v.staff.length) FO.deptLetGo(dk, pick(v.staff).id); }
      if (FO.rnd() < 0.05) { const b = FO.deptBudView(); const r = pick(b.rows); FO.deptBudSet(r.k, r.v + (FO.rnd() < 0.5 ? 10 : -10)); }
      FO.DEPTS.forEach(d => FO.deptView(d.k)); FO.deptOverview(); FO.deptBudView();
      if (FO.rnd() < 0.005 && g.ap > 0 && FO.G.staff.coach) FO.ftSack();
      FO.ftView();
      for (const role of FO.ROLES) if (!g.staff[role.id] && g.cands[role.id]) FO.hire(role.id, hireIdx(role.id));
      // views must not throw
      g.inbox.forEach(m => FO.msgView(m)); FO.analysis(); FO.scorecard(); if (g.meeting) g.meeting.items.forEach(it => FO.proposalView(it));
      const nSeen = R.seen.size; const res = FO.endWeek(); weeks++; R.weeksN++; { let n = 0; for (const m of g.inbox) { if (!R.seen.has(m.id)) { R.seen.add(m.id); R.msgs.push({ s: g.season, w: m.week, ev: m.ev, from: (FO.EV[m.ev] || {}).from, dept: (FO.EV[m.ev] || {}).dept }); n++; } } R.perWeek.push(n); if (n === 0) R.quiet++; }
      const bad = [g.club.cash, g.board.conf, g.st.fans, g.club.brand, g.club.fanbase].some(v => !Number.isFinite(v)) || g.squad.some(p => !Number.isFinite(p.ca) || !Number.isFinite(p.value));
      if (bad) { errs.push(`NaN at s${g.season} w${g.week}`); break outer; }
      if (g.squad.length < 14 && g.phase === 'season') errs.push(`thin squad ${g.squad.length} s${g.season}w${g.week}`);
      if (weeks > 500) break outer;
    }
    { const rep = FO.G.lastReport || {}; R.seasons.push({ s: rep.season, tier: rep.tier, pos: rep.pos, cash: FO.G.club.cash, conf: FO.G.board.conf, fans: FO.G.st.fans, sq: FO.G.squad.length, str: +FO.teamStrength().toFixed(2), tavg: +FO.tierAvg(FO.G.club.tier).toFixed(2), wages: FO.playerWages(), parts: (() => { try { const P = FO.strengthParts(), t = FO.G.club.tier, xs = FO.G.divs[t].clubs.filter(i => i !== 0).map(i => FO.G.clubs[i].str); return { squad: +P.squad.toFixed(2), coach: +P.coach.toFixed(2), style: +P.style.toFixed(2), morale: +P.morale.toFixed(2), extra: +P.extra.toFixed(2), rivalAvg: +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2), rivalMax: +Math.max(...xs).toFixed(2), tavg: +FO.tierAvg(t).toFixed(2) }; } catch (e) { return null; } })(), core: FO.G.squad.slice().sort((x, y) => y.ca - x.ca).slice(0, 14).map(x => [x.id, +x.ca.toFixed(2), x.age, x.wage]) }); }
    if (FO.G.phase === 'sacked') { R.sacked = FO.G.season; log.push('SACKED s' + FO.G.season + ' w' + FO.G.week + ': ' + FO.G.sackReason); break; }
    const rep = FO.G.lastReport; log.push(`rev ${FO.money(FO.G.ss.rev)} exp ${FO.money(FO.G.ss.exp)} earned ${FO.money(FO.G.ss.earned)} spent ${FO.money(FO.G.ss.spent)} prize ${FO.money(rep.prize)} || S${rep.season} tier${rep.tier} pos${rep.pos} ${rep.moves.join(',')} cash ${FO.money(FO.G.club.cash)} conf ${Math.round(FO.G.board.conf)} squad ${FO.G.squad.length} acad ${FO.G.academy.length} fans ${Math.round(FO.G.st.fans)} cap ${FO.G.club.cap} signings ${FO.G.ss.signings} proj ${(FO.G.projDone||[]).length}/${(FO.G.projects||[]).length} perks ${Object.keys(FO.G.club.perks).length}`);
    if (FO.G.phase !== 'review') break;
    FO.startSeason(); doPre(); doPress();
  }
  { const R = FO.G.rec; const st = {}; R.pipe.forEach(x => st[x.stage] = (st[x.stage]||0)+1); console.log('  wl', FO.recView().wageLimit|0, 'asks', R.pipe.filter(x=>x.blocked&&R.pool[x.pid]).map(x=>R.pool[x.pid].wageAsk+'@'+R.pool[x.pid].ca.toFixed(1)).join(' '), 'sq', FO.G.squad.map(p=>p.wage+(p.academy?'a':'')).join(' '));console.log('  dof', !!FO.G.staff.dof, 'blocked', R.pipe.filter(x=>x.blocked).map(x=>x.blocked.join('/')).join(' '), 'budget', FO.money(FO.transferBudget()), 'wk', FO.G.week, 'phase', FO.G.phase); console.log('  summer', JSON.stringify(FO.G.lastSummer && { in: FO.G.lastSummer.in.length, out: FO.G.lastSummer.out.length, ren: FO.G.lastSummer.renewed, rel: FO.G.lastSummer.released })); console.log('  rec pool', Object.keys(R.pool).length, 'know', Object.keys(R.know).length, 'scouts', R.scouts.length, 'pipe', JSON.stringify(st), 'log', R.log.length, R.log.slice(0,4).map(l => l.name+' '+FO.money(l.fee)+' est '+l.est).join('; ')); }
  console.log('  dept', FO.DEPTS.map(d => d.k + ':' + FO.G.dept[d.k].staff.map(x=>x.role).join('/')).join(' '), 'bud', JSON.stringify(FO.deptBudView().rows.map(r=>r.v)), 'cap', FO.deptBudView().cap, 'effB coach', FO.HOOK.effBonus('coach',0).toFixed(2));
  console.log('  ft', JSON.stringify({ comp: FO.ftCompliance().toFixed(2), pref: FO.ftPref(), mand: FO.G.mand.coach, deal: FO.G.ft && FO.G.ft.deal && FO.G.ft.deal.k, last: FO.G.ft && FO.G.ft.last}));
  console.log('  briefs/week', (FO.G.bcount / FO.G.wcount).toFixed(2), JSON.stringify(FO.G.bstat));
  OUT.runs.push({ ...R, seen: undefined, bstat: FO.G.bstat, dos: { arch: (FO.G.dos&&FO.G.dos.arch||[]).map(a=>[a.id||a.k||a.t, a.s||a.season]), done: Object.keys((FO.G.dos&&FO.G.dos.done)||{}), open: Object.keys((FO.G.dos&&FO.G.dos.open)||{}) }, hist: FO.G.history.length, pw: !!(FO.G.pw), archKeys: Object.keys(FO.G.paper||{}) }); require('fs').writeFileSync((process.argv[4] || 'longrun.json'), JSON.stringify(OUT));
  // save/load roundtrip
  const s = FO.save(); if (!FO.load(s)) errs.push('load failed');
  console.log(`run ${r} dna ${JSON.stringify(d)}\n  ` + log.join('\n  ') + (errs.length ? '\n  ERR ' + [...new Set(errs)].slice(0, 5).join(' | ') : ''));
}
