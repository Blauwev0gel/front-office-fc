/* ---------- new game ---------- */
function newGame(seed) {
  G = { v: VERSION, rs: seed || (Date.now() % 2147483647), nid: 1, phase: 'dna', season: 1, week: 1, ap: AP_FREE, dna: {}, staff: {}, cands: {}, mand: {}, squad: [], academy: [], inbox: [], queue: [], cd: {}, talks: {}, push: {}, promises: [], form: [], history: [], trophies: [], flags: {}, st: { fans: 55, spons: 50, press: 50 }, board: { conf: 60, obj: [], warned: false }, fin: { last: null, revSum: 0, revW: 0, hist: [] }, ss: newSeasonStats(), cup: null, paper: { headline: '', sub: '', stories: [] } };
  return G;
}
function setDNA(d, name, short, city, colors) {
  const c = G.club = { perks: {}, name, short, city, colors, dna: d, tier: 8, drift: 0, brand: 25, fanbase: 900, cap: 2500, rent: 0, debt: 0, deals: [], fac: { train: 2, youth: 2 }, facProg: 0, ownerOn: d.money === 'owner', lastAtt: 0, net: {} };
  for (const k in REGIONS) c.net[k] = k === 'dom' ? 25 : 5;
  let cash = 60000;
  if (d.origin === 'phoenix') { cash *= 0.6; G.st.fans = 72; c.fanbase = 1150; }
  if (d.origin === 'investor') { cash *= 2.2; G.st.fans = 42; c.fanbase = 700; }
  if (d.origin === 'works') { c.deals.push({ name: c.city + ' Works', type: 'shirt', wk: 1800, weeks: 200 }); G.st.spons = 65; }
  if (d.origin === 'merger') { cash *= 1.2; c.fanbase = 1100; G.flags.merger = true; }
  if (d.money === 'debt') { cash += 80000; c.debt = 80000; }
  if (d.identity === 'brand') { c.brand = 35; G.st.spons += 5; G.st.fans -= 3; }
  if (d.identity === 'ideals') { G.st.press = 60; }
  if (d.identity === 'community') { G.st.fans += 4; }
  if (d.ground === 'muni') { c.cap = 6000; c.rent = 900; }
  if (d.ground === 'new') { c.cap = 12000; c.debt += 150000; c.fac.train = 3; }
  if (!c.deals.length) c.deals.push({ name: pick(['Hollis Builders', 'Greenway Motors', 'The Crown & Anchor', 'Marlow Dental', 'Fenwick Print']), type: 'shirt', wk: 650, weeks: 68 });
  if (d.talent === 'academy') c.fac.youth = 4;
  c.cash = cash; c.kitty = 0; G.board.conf = d.origin === 'investor' ? 55 : 62;
  G.mand = dnaMandates(d);
  // squad
  for (const pos in REQ) for (let i = 0; i < REQ[pos]; i++) G.squad.push(genPlayer({ pos, wageMul: 0.8, ca: tierAvg(8) + gauss() * 1.1 + (d.talent === 'proven' ? 0.3 : 0) - (i >= REQ[pos] - 1 ? 0.6 : 0), age: d.talent === 'academy' && chance(0.4) ? ri(17, 20) : undefined }));
  if (HOOK.acadInit) HOOK.acadInit(); else for (let i = 0; i < 4; i++) { const p = genPlayer({ age: ri(15, 17), ca: tierAvg(8) - 3.5 + gauss() * 0.9, academy: true, paBonus: 0.5 }); p.wage = 40; p.contract = 3; G.academy.push(p); }
  for (const r of ROLES) G.cands[r.id] = genCands(r.id);
  genWorld();
  G.cup = { alive: true, weeks: [5, 11, 17, 23, 29, 33], names: ['first round', 'second round', 'third round', 'quarter-final', 'semi-final', 'final'], log: [], won: 0 };
  c.kitty = kittyFor(0); snapStart();
  G.phase = 'staff';
}
function staffBudget() { return Math.round(M(2400) * (G.club.dna.money === 'owner' ? 1.25 : G.club.dna.origin === 'investor' ? 1.35 : 1)); }
function finishStaff() { G.phase = 'mandates'; }
function finishMandates() { setObjectives(); if (HOOK.summerStart) HOOK.summerStart(); else setupPreseason(); }
/* ---------- pre-season planning (1.4) ---------- */
const FOCUS = [
  { k: 'fanbase', t: () => `Grow the supporter base to ${Math.round(G.club.fanbase * 1.1).toLocaleString('en-GB')}`, d: 'Marketing and results drive this.', target: () => Math.round(G.club.fanbase * 1.1) },
  { k: 'grads', t: () => 'Give two academy players a debut', d: 'Needs the coach to trust youth.', target: () => 2 },
  { k: 'wagecap', t: () => 'Keep player wages under the cap all season', d: 'Restrains the Director of Football.', target: () => 0 },
  { k: 'brand', t: () => `Grow brand strength to ${Math.min(95, Math.round(G.club.brand + 8))}`, d: 'Marketing spend and campaigns.', target: () => Math.min(95, Math.round(G.club.brand + 8)) },
  { k: 'profit', t: () => 'Make a profit on transfers', d: 'Sell well, buy smart.', target: () => 0 },
  { k: 'fill', t: () => 'Fill the stadium to 80% on average', d: 'Prices, form and fan base.', target: () => 0.8 },
  { k: 'topxg', t: () => 'Create more than we concede (xG)', d: 'A performance goal, not a results goal.', target: () => 0 },
];
function setupPreseason() {
  if (over()) return;
  const lg = G.board.obj.find(o => o.k === 'league');
  G.pre = { base: lg.target, deal: null, focus: [], step: 0 };
  G.meeting = null; genMeeting(3); if (G.meeting) { G.meeting.pre = true; G.meeting.week = 0; }
  G.phase = 'preseason';
}
function preTargets() { const b = G.pre.base; return [
  { k: 'safe', target: Math.min(16, b + 2), t: 'Play it safe', d: 'A lower target the board will accept, grudgingly.', fx: 'Board confidence −5. Transfer kitty −20%.' },
  { k: 'accept', target: b, t: "Accept the board's target", d: 'The expectation that fits our squad and ambition.', fx: 'No change.' },
  { k: 'bold', target: Math.max(1, b - 2), t: 'Aim higher', d: 'Promise more and the board will fund it.', fx: 'Board confidence +5. Transfer kitty +30%. Missing it hurts more.' }]; }
function preSetTarget(k) {
  const o = G.board.obj.find(o => o.k === 'league'), opt = preTargets().find(x => x.k === k), prev = G.pre.deal;
  if (prev === 'safe') { G.board.conf += 5; G.club.kitty = Math.round(G.club.kitty / 0.8); } if (prev === 'bold') { G.board.conf -= 5; G.club.kitty = Math.round(G.club.kitty / 1.3); }
  if (k === 'safe') { G.board.conf -= 5; G.club.kitty = Math.round(G.club.kitty * 0.8); } if (k === 'bold') { G.board.conf += 5; G.club.kitty = Math.round(G.club.kitty * 1.3); }
  G.board.conf = clamp(G.board.conf, 0, 100); o.target = opt.target; o.t = `Finish ${ord(o.target)} or higher`; o.bold = k === 'bold'; G.pre.deal = k;
}
function preToggleFocus(k) { const f = G.pre.focus; const i = f.indexOf(k); if (i >= 0) f.splice(i, 1); else if (f.length < 2) f.push(k); }
function budgetCosts() { const bud = r => (0.3 + man(r, 'budget') / 100 * 1.4); return { scouting: staff('scout') ? M(300) * bud('scout') : 0, academy: Math.round(M(380) * (staff('acad') ? bud('acad') : 0.5) * (1 + G.club.fac.youth * 0.08)), marketing: staff('mkt') ? M(250) * bud('mkt') : 0, facilities: Math.round(M(320) * man('fin', 'invest') / 100) }; }
function weekForecast() { const b = budgetCosts(); const out = playerWages() + staffWages() + b.scouting + b.academy + b.marketing + b.facilities + Math.round(G.club.cap * 0.12 + G.club.rent + G.club.fac.train * M(40)) + Math.round((G.club.debt || 0) * 0.0012) + projWeekly(); return { rev: Math.round(revenueAvg()), cost: Math.round(out) }; }
function finishPreseason() {
  if (over()) return;
  for (const k of G.pre.focus) { const f = FOCUS.find(x => x.k === k); G.board.obj.push({ k, target: f.target(), t: f.t(), soft: true }); }
  if (G.meeting) for (const it of G.meeting.items) if (it.status === 'open') it.status = 'lapsed';
  G.meeting = null; G.phase = 'press'; G.press = pressQuestions().map(q => q.id);
}
function finishPress() {
  if (over()) return;
  G.pressDone = true; G.phase = 'season';
  if (G.season === 1 && G.week === 1 && !G.inbox.length) { G.paper = { headline: `A new club is born`, sub: `${G.club.name} open their account in the ${TIERS[8]}. The CEO has set out the plan; now the staff must deliver it.`, stories: [] }; }
  genMessages(); genBriefs();
}

