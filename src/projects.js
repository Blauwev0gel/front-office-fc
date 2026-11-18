/* The Front Office · projects as trajectories (B58), first type: a training base of our own
   OPPORTUNITY (the council has land, or the CEO asks for it) → RESEARCH (Finance, one week) → ROUTE (buy / lease with
   community use / with the investor) → TALKS (two or three rounds with the council: one interest, one card) → BOARD (debt or
   a seat) → BUILD (Finance, setbacks from his character) → AN ASSET WITH OBLIGATIONS (quality drives player development;
   rent, community hours or an investor's seat keep working). The other bidder does not wait. Stored in G.agr (k: 'traj'). */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, { clamp, money, M, staff, chance, rnd } = F;
const sur = n => String(n || '').split(' ').slice(-1)[0];
const list = () => { const G = g(); G.agr = G.agr || []; return G.agr; };
const live = () => list().find(a => a.k === 'traj' && a.type === 'base' && !a.res);
const C = () => F.parties().council, I = () => F.parties().investor;
const lvl = () => staff('fin') ? F.eff('fin') - F.tierAvg(g().club.tier) : -3;
const free = () => { const G = g(), wk = F.playerWages() + F.staffWages(); return G.club.cash - 6 * wk; }; // cash beyond six weeks of wages
function say2(say, who, t) { say(who, t); }

/* ---------- the conversation, on Finance's desk ---------- */
const prevT = F.agrTopics;
F.agrTopics = role => { const t = prevT ? prevT(role) : []; if (role !== 'fin' || g().phase !== 'season') return t; const A = live(), S = F.councilSite(), base = g().club.assets && g().club.assets.base;
  if (A && ['route', 'talks'].includes(A.stage)) return [{ id: 't_base', t: A.stage === 'talks' ? 'Back to the council talks' : 'The training base: what are our options?', fx: 'Finance has looked into it' }].concat(t);
  if (!A && S && !S.taken) return [{ id: 't_base', t: `Look into ${S.name}`, fx: 'Finance researches it for a week' }].concat(t);
  if (!A && !S && !base) return [{ id: 't_meet', t: 'Ask the council for land for a training base', fx: 'They may have something, or not' }].concat(t);
  return t; };
const prevA = F.agrAnswer;
F.agrAnswer = (id, T, say, note) => {
  if (!/^(t_base|t_meet|b_)/.test(id)) return prevA ? prevA(id, T, say, note) : false;
  const G = g(), fin = staff('fin'), N = fin ? sur(fin.name) : 'Finance'; T.ini = 1;
  if (id === 't_meet') { const r = F.councilAsk(); say('council', r.t); if (r.ok) note('The council has a site. Look into it with Finance.'); T.opts = []; return true; }
  let A = live();
  if (id === 't_base' && !A) { const S = F.councilSite(); if (!S) { T.opts = []; return true; } S.engaged = 1;
    A = { id: F.uid(), k: 'traj', type: 'base', owner: 'fin', t: 'A training base of our own', stage: 'research', site: S.name, mw: G.week, made: F.absWeek(), by: F.absWeek(), log: [] }; list().push(A); // research is done at the end of this week
    say('fin', fin && fin.p.risk <= 8 ? 'Give me a week. I want the real numbers before anyone gets excited.' : 'Give me a week. I will find out what it costs and what the council really wants.'); note('Research: one week'); T.opts = []; return true; }
  if (!A) return false;
  if (id === 't_base' && A.stage === 'route') { const f = A.find; say('fin', `The land is ${money(f.price)}, building ${money(f.build)}. We can spare ${money(Math.max(0, f.free))} without touching wages.${f.price + f.build > f.free ? ' Buying outright means a loan.' : ''}`);
    say('council', `The council ${F.COUNCIL_TRAITS[f.trait]}. ${f.trait === 'community' ? 'A lease with the pitches open to local children would suit them.' : f.trait === 'money' ? 'They want the best price.' : 'They want building to start soon.'}`);
    if (staff('com')) say('com', f.inv ? `${f.inv} would put up half if his name goes on it and he gets a seat on the board.` : 'Nobody is offering to share the cost right now.');
    if (staff('coach')) say('coach', 'A proper base changes how fast players improve. I would take it in any shape.');
    T.opts = [{ id: 'b_buy', t: 'Buy the land and build', fx: f.price + f.build > f.free ? 'A loan · the board must agree' : `${money(f.price + f.build)} from the bank` },
      { id: 'b_lease', t: 'Lease it, open to the community', fx: 'Rent every week · pitches shared' }, f.inv ? { id: 'b_inv', t: `Build it with ${f.inv}`, fx: 'Half the cost · his name · a board seat' } : null,
      { id: 'b_wait', t: 'Not now', fx: 'The other bidder keeps going' }].filter(Boolean); return true; }
  if (id === 'b_wait') { A.res = 'dropped'; A.out = 'You let it go.'; say('fin', 'Understood. I will keep an eye on it.'); T.opts = []; return true; }
  if (['b_buy', 'b_lease', 'b_inv'].includes(id)) { A.route = id.slice(2); A.stage = 'talks'; A.round = 0; A.deal = openTerms(A); return round(A, T, say, null); }
  if (id === 't_base' && A.stage === 'talks') return round(A, T, say, null, true);
  if (['b_price', 'b_comm', 'b_time'].includes(id)) return round(A, T, say, id.slice(2));
  if (id === 'b_deal') return close(A, T, say, note);
  if (id === 'b_walk') { A.res = 'walked'; A.out = 'You walked away from the council.'; C().trust = clamp(C().trust - 6, 0, 100); C().memory.push({ w: F.absWeek(), t: 'the club walked away' }); say('council', 'Then we will talk to the other party.'); T.opts = []; return true; }
  return false;
};
function openTerms(A) { const f = A.find, c = C(); const k = 1.1 - c.trust / 500; // trust lowers the asking price
  return { price: Math.round(f.price * k / 100) * 100, build: f.build, rent: A.route === 'lease' ? Math.round(f.price / 70 / 10) * 10 : 0, comm: A.route === 'lease' ? 6 : 0, share: A.route === 'inv' ? 0.5 : 0, hold: 0 }; }
// one round: the council names its interest, the CEO plays one card; trust, the card's fit and the other bidder decide
function round(A, T, say, card, resume) {
  const c = C(), S = F.councilSite(), d = A.deal, fin = staff('fin'), N = fin ? sur(fin.name) : 'Finance';
  if (!S || S.taken) { A.res = 'lost'; A.out = 'The land went elsewhere.'; say('council', 'I am sorry. It has gone.'); T.opts = []; return true; }
  if (card) { A.round++; const fit = { price: c.trait === 'money' ? -0.25 : 0.05, comm: c.trait === 'community' ? 0.3 : c.trait === 'growth' ? -0.05 : -0.15, time: c.trait === 'growth' ? -0.3 : 0 }[card];
    const score = c.trust / 100 + fit + (1 - S.dev) * 0.35 + rnd() * 0.2, yes = score >= 0.78;
    if (card === 'price') { if (yes) { d.price = Math.round(d.price * 0.85 / 100) * 100; d.rent = Math.round(d.rent * 0.85 / 10) * 10; say('council', `We can move on the price: ${money(A.route === 'lease' ? d.rent : d.price)}${A.route === 'lease' ? ' a week' : ''}.`); } else { say('council', 'The price is the price. The other party is not haggling.'); c.trust = clamp(c.trust - 2, 0, 100); } }
    if (card === 'comm') { d.comm = (d.comm || 0) + 4; if (yes) { d.price = Math.round(d.price * 0.8 / 100) * 100; d.rent = Math.round(d.rent * 0.8 / 10) * 10; c.trust = clamp(c.trust + 4, 0, 100); say('council', `${d.comm} hours a week for local teams? That changes things. We will come down.`); } else say('council', 'Kind, but it does not pay for the roads.'); }
    if (card === 'time') { if (yes) { d.hold = 4; S.hold = F.absWeek() + 4; say('council', 'Four weeks. We will tell the other party to wait.'); } else { say('council', 'We cannot hold it. The other party is ready to sign.'); S.dev = clamp(S.dev + 0.1, 0, 1); } }
    if (staff('academy') || staff('acad')) if (card === 'comm' && d.comm >= 8) say('acad', 'That many hours means my lads lose pitch time. Not ideal.');
  } else if (!resume) say('council', A.route === 'lease' ? `A lease at ${money(d.rent)} a week, with ${d.comm} hours a week for local teams.` : `${money(d.price)} for the land.${A.route === 'inv' ? ' Who builds it is your business.' : ''}`);
  if (S.dev >= 0.85) say('fin', `${N}: the other bidder is close. Decide soon.`);
  const used = A.used = A.used || []; if (card) used.push(card);
  T.opts = [{ id: 'b_deal', t: 'Agree these terms', fx: termsTxt(A) }].concat(A.round >= 3 ? [] : [['price', 'Push on the price', 'Risk: trust ↓'], ['comm', 'Offer pitch time for local teams', 'Cheaper · your academy loses hours'], ['time', 'Ask for more time', 'The other bidder may not wait']].filter(x => !used.includes(x[0])).map(x => ({ id: 'b_' + x[0], t: x[1], fx: x[2] }))).concat([{ id: 'b_walk', t: 'Walk away', fx: 'Council trust ↓' }]);
  return true; }
function termsTxt(A) { const d = A.deal, total = A.route === 'lease' ? d.build : (d.price + d.build) * (1 - d.share); return `${A.route === 'lease' ? `Rent ${money(d.rent)} a week · building costs ${money(d.build)}` : `Costs the club ${money(total)}`}${d.comm ? ` · ${d.comm} community hours` : ''}${A.route === 'inv' ? ` · ${I().name}'s name and seat` : ''}`; }
function close(A, T, say, note) {
  const d = A.deal, cost = A.route === 'lease' ? d.build : Math.round((d.price + d.build) * (1 - d.share)), loan = Math.max(0, cost - Math.max(0, free())), G = g();
  A.cost = cost; A.loan = loan; C().trust = clamp(C().trust + 3, 0, 100); F.councilSite().hold = F.absWeek() + 12; // agreed: the council takes it off the market
  if (loan > 0 || A.route === 'inv') { A.stage = 'board'; F.queueEvent('base_board', { id: A.id, cost, loan, route: A.route, inv: A.route === 'inv' ? I().name : '' }); say('fin', `Agreed in principle. ${loan ? `We need a loan of ${money(loan)}` : `${I().name} gets a seat`}, so it goes to the board.`); note('To the board'); }
  else { start(A); say('fin', 'Agreed. I will start this week.'); note(`Agreed · ${money(cost)} · building starts`); }
  T.opts = []; return true; }
function start(A) { const G = g(), fin = staff('fin'); A.stage = 'build'; if (A.loan) { G.club.debt += A.loan; G.club.cash += A.loan; } G.club.cash -= A.cost; // the loan comes in, the cost goes out: settled once
  const L = lvl(); A.weeks = Math.round(clamp(10 - L * 0.5 - (fin && fin.p.risk >= 14 ? 2 : 0), 5, 13)); A.bw = 0; A.log.push({ w: G.week, t: `Building starts. ${A.weeks} weeks planned.` }); }

/* ---------- every week: research, build, setbacks, obligations ---------- */
function week(A) {
  const G = g(), fin = staff('fin'), N = fin ? sur(fin.name) : 'Finance', S = F.councilSite();
  if (A.stage === 'research' && F.absWeek() >= A.by) { if (!S || S.taken) return;
    A.find = { price: S.price, build: S.build, free: Math.round(free()), trait: C().trait, inv: I().active && !I().seat ? I().name : null }; A.stage = 'route';
    A.log.push({ w: G.week, t: `${N} has the numbers: land ${money(S.price)}, building ${money(S.build)}.` }); if (F.deskNote) F.deskNote('fin', 'The training base', `Researched: land ${money(S.price)}, building ${money(S.build)}.`, 0); return; }
  if (A.stage !== 'build') return; A.bw++;
  const L = lvl(), risky = fin && fin.p.risk >= 14, p = clamp(0.05 + (risky ? 0.04 : 0) - L * 0.006, 0.01, 0.12);
  if (!A.setback && chance(p)) { A.setback = 1; const extra = Math.round(A.cost * 0.15 / 100) * 100; if (G.club.cash > extra * 2) { G.club.cash -= extra; A.log.push({ w: G.week, t: `Costs overrun by ${money(extra)}. ${risky ? `${N} pushed the pace and it showed.` : 'The ground was worse than the survey said.'}` }); } else { A.weeks += 3; A.log.push({ w: G.week, t: `Costs overrun and there is no money: three weeks' delay.` }); } }
  if (A.route === 'inv' && !A.invPulled) { const f = (G.form || []).slice(-6), pts = f.reduce((a, r) => a + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0); if (f.length >= 6 && pts <= 3) { A.invPulled = 1; A.weeks += 4; I().interest = clamp(I().interest - 0.3, 0, 1); A.log.push({ w: G.week, t: `${I().name} slows his payments while the team struggles. Four weeks' delay.` }); } }
  if (A.bw < A.weeks) { if (A.bw % 3 === 0) A.log.push({ w: G.week, t: `Week ${A.bw} of ${A.weeks}. On schedule.` }); return; }
  finish(A); }
function finish(A) {
  const G = g(), d = A.deal, L = lvl(), q = clamp(Math.round(5 + (A.route === 'lease' ? -1 : 0) + clamp(L / 3, -1, 1) + (A.route === 'inv' ? 1 : 0)), 3, 8);
  const named = A.route === 'inv' ? `The ${sur(I().name)} Training Centre` : null; if (A.route === 'inv') { I().seat = true; I().memory.push({ w: F.absWeek(), t: 'joined the board' }); }
  G.club.assets = G.club.assets || {}; G.club.assets.base = { site: A.site, quality: q, held: A.route === 'lease' ? 'lease' : 'own', rent: d.rent || 0, community: d.comm || 0, namedBy: named, since: G.season };
  G.club.rent = (G.club.rent || 0) + (d.rent || 0); applyBase(); A.res = 'done'; A.stage = 'done';
  A.out = `${named || 'The new training base'} opens at ${A.site}: quality ${q}${d.comm ? `, ${d.comm} hours a week for local teams` : ''}${d.rent ? `, ${money(d.rent)} a week rent` : ''}.`; A.log.push({ w: G.week, t: A.out });
  if (G.paper) G.paper.stories.push({ h: 'A base of our own', t: A.out }); if (F.deskNote) F.deskNote('fin', 'The training base', `Delivered. ${A.out}`, 0);
  if (d.comm) { G.st.fans = clamp(G.st.fans + 3, 0, 100); C().trust = clamp(C().trust + 5, 0, 100); } }
// the base drives the existing development effect; shared pitches cost a little of it
function applyBase() { const G = g(), B = G.club.assets && G.club.assets.base; if (!B) return; G.club.fac.train = clamp(B.quality - (B.community >= 8 ? 1 : 0), 1, 10); }
const prev = H.seasonAfterMatch;
H.seasonAfterMatch = o => { if (prev) prev(o); const A = live(); if (A) week(A); };
F.trajLost = S => { const A = live(); if (A && A.site === S.name && !['build', 'done'].includes(A.stage)) { A.res = 'lost'; A.out = `${S.name[0].toUpperCase() + S.name.slice(1)} went to ${S.by === 'rival' ? 'a rival club' : 'a housing developer'} first.`; A.log.push({ w: g().week, t: A.out }); } };
F.trajElection = trait => { const B = g().club.assets && g().club.assets.base; if (B && B.held === 'lease' && trait === 'money') { const up = Math.round(B.rent * 0.2 / 10) * 10; B.rent += up; g().club.rent += up; if (g().paper) g().paper.stories.push({ h: 'Council raises the rent', t: `The new leader wants more for the training base: ${money(up)} a week extra.` }); } };

/* the board: debt or a seat for an outsider */
F.defineEvent('base_board', { forced: 1, from: 'board', dept: 'board', ceo: 1, cd: 1, why: 'A loan or a new board member needs the board.',
  title: c => c.route === 'inv' ? `${c.inv} on the board?` : 'A loan for the training base',
  body: c => `${money(c.cost)} for the club${c.loan ? `, of which ${money(c.loan)} borrowed` : ''}.${c.inv ? ` ${c.inv} wants a seat and his name on the building.` : ''} ${staff('fin') ? sur(staff('fin').name) + ': "' + (staff('fin').p.risk >= 14 ? 'It is worth it.' : 'It is affordable, just.') + '"' : ''}`,
  opts: [{ l: 'Make the case to the board', h: 'They decide on confidence and the numbers', f: c => { const G = g(), A = list().find(a => a.id === c.id); if (!A || A.res) return 'It is gone.'; const yes = G.board.conf + (staff('fin') ? F.eff('fin') : 5) * 2 - (c.loan / M(1000)) >= 55;
      if (yes) { start(A); return 'The board agrees. Building starts.'; } A.stage = 'route'; A.log.push({ w: G.week, t: 'The board said no to this route.' }); return 'The board says no. Choose another route, or let it go.'; } },
    { l: 'Withdraw it', h: 'Back to the routes', f: c => { const A = list().find(a => a.id === c.id); if (A && !A.res) { A.stage = 'route'; A.log.push({ w: g().week, t: 'Withdrawn before the board.' }); } return 'Withdrawn.'; } }],
  auto: () => 1 });

F.baseView = () => ({ A: live() || list().filter(a => a.k === 'traj').slice(-1)[0] || null, site: F.councilSite(), base: g().club.assets && g().club.assets.base, council: F.parties ? F.parties().council : null });
F.trajRunning = () => { const A = live(); if (!A) return []; const last = (A.log || []).slice(-1)[0]; return [{ ic: 'board', t: `${A.t}: ${A.stage === 'research' ? 'Finance is researching' : A.stage === 'route' ? 'choose a route' : A.stage === 'talks' ? 'talks with the council' : A.stage === 'board' ? 'with the board' : 'being built'}`, s: last ? last.t : `${A.site}.` }]; };
F.baseApply = applyBase; H.baseApply = applyBase;
})(FO);
