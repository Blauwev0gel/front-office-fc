/* The Front Office · event library (module 1)
   Each event: from (role|board|fans|press), dept, cd (cooldown weeks), cond, w (weight), setup -> ctx,
   title/body (string or fn(ctx)), opts [{l, h, f(ctx) -> outcome}], auto(ctx) -> option index the staff member picks. */
(function (F) {
'use strict';
const g = () => F.G;
const { ri, pick, chance, clamp, money, M, staff, man, staffName } = F;
function adj(k, n) { const G = g(); if (k === 'fans' || k === 'spons' || k === 'press') G.st[k] = clamp(G.st[k] + n, 0, 100); else if (k === 'board') G.board.conf = clamp(G.board.conf + n, 0, 100); else if (k === 'brand') G.club.brand = clamp(G.club.brand + n, 0, 100); else if (k === 'cash') G.club.cash += n; else if (k === 'drift') G.club.drift += n; else if (k === 'morale') G.squad.forEach(p => p.morale = clamp(p.morale + n, 0, 100)); }
const fx = o => { for (const k in o) adj(k, o[k]); };
const rel = (r, n) => { const s = staff(r); if (s) s.rel = clamp(s.rel + n, 0, 100); };
const boost = (r, n, w) => { const s = staff(r); if (s) { s.boost = clamp(s.boost + n, -10, 12); s.boostW = w || 4; } };
const P = id => g().squad.find(p => p.id === id) || g().academy.find(p => p.id === id);
const N = r => staffName(r);
const E = F.defineEvent;
const lean = r => staff(r) ? staff(r).lean : 50;
const ego = r => staff(r) ? staff(r).p.ego : 10;
const sq = () => g().squad;
const randP = f => { const a = sq().filter(f || (() => true)); return a.length ? pick(a) : null; };
const dna = () => g().club.dna;
const week = () => g().week;
const pos = () => F.myPos();

/* ===================== SPORTING (DoF) ===================== */
E('dof_rule', { forced: 1, from: 'dof', dept: 'sporting', cd: 4,
  title: c => `DoF wants an exception for ${c.player.name}`,
  body: c => `"I know the mandate. But ${c.player.name} (${c.player.age}, ${F.POS_L[c.player.pos]}, ${REG(c)}) is the best player I have seen this window. My read: ${F.stars(c.player.pCA)}★ now, ${F.stars(c.player.pPA)}★ potential." He breaks: ${c.why.map(w => ({ fee: 'the fee limit', age: 'the age limit', wage: 'the wage limit', cap: 'the wage-to-revenue cap' })[w]).join(', ')}. Fee ${money(c.player.fee)}, wage ${money(c.player.wage)}/wk.`,
  opts: [
    { l: 'Approve the exception', h: 'Signs the player · DoF trust ↑ · your rules mean less', f: c => { F.sign(c.player, true); F.later('exception_review', { pid: c.player.id, name: c.player.name, fee: c.player.fee }, 8, 12); rel('dof', 6); staff('dof') && (staff('dof').p.risk = clamp(staff('dof').p.risk + 1, 1, 20)); return `${c.player.name} signs. ${N('dof')} will remember you backed him, and that the rules bend.`; } },
    { l: 'Hold the line', h: 'No signing · DoF trust ↓', f: c => { rel('dof', -4 - Math.max(0, ego('dof') - 12)); return `${N('dof')} accepts it, through gritted teeth.`; } },
    { l: 'Negotiate within the rules', h: 'Chance he gets it done cheaper', f: c => { if (chance(0.25 + F.eff('dof', 1) / 50)) { c.player.fee = Math.round(c.player.fee * 0.7); c.player.wage = Math.round(c.player.wage * 0.85); F.sign(c.player); rel('dof', 3); return `A hard negotiation, but ${c.player.name} signs on adjusted terms.`; } rel('dof', -1); return `The selling club will not budge. The deal is dead.`; } }],
  auto: () => 1 });
function REG(c) { return F.REGIONS[c.player.region].name; }

E('bid_star', { forced: 1, from: 'dof', dept: 'sporting', cd: 3,
  title: c => `${F.cname(c.club)} bid ${money(c.fee)} for ${P(c.pid) ? P(c.pid).name : 'a player'}`,
  body: c => { const p = P(c.pid); if (!p) return 'The player has already left.'; const pr = g().promises.find(x => x.k === 'keep' && x.pid === c.pid && x.status === 'open'); return `${p.name} (${p.age}, ${F.stars(p.ca)}★) is one of our key players. Our valuation: ${money(p.value)}. ${pr ? 'You publicly promised he was not for sale.' : ''} ${p.pers.amb > 14 ? 'He is ambitious and knows about the interest.' : ''}`; },
  opts: [
    { l: 'Accept the bid', h: c => `+${money(c.fee)} · squad weaker · fans may object`, f: c => { const p = P(c.pid); if (!p || !sq().includes(p)) return 'He has already gone.'; F.sellPlayer(p, c.fee, `${p.name} joins ${F.cname(c.club)} for ${money(c.fee)}.`); adj('fans', -3); return `${p.name} is sold for ${money(c.fee)}.`; } },
    { l: 'Reject it', h: 'Keeps the player · may unsettle him', f: c => { const p = P(c.pid); if (!p) return 'He has already gone.'; if (p.pers.amb > 14) { p.morale = clamp(p.morale - 15, 0, 100); return `${p.name} is unhappy to be denied the move.`; } adj('fans', 2); return `Bid rejected. Supporters approve.`; } },
    { l: 'Let the DoF push for more', h: 'Chance of a better fee, or they walk away', f: c => { const p = P(c.pid); if (!p || !sq().includes(p)) return 'He has already gone.'; if (chance(0.3 + F.eff('dof', 1) / 40)) { const fee = Math.round(c.fee * 1.25 / 100) * 100; F.sellPlayer(p, fee, `${N('dof')} squeezes ${money(fee)} out of ${F.cname(c.club)} for ${p.name}.`); return `Sold for ${money(fee)}.`; } return `${F.cname(c.club)} walk away. ${p.name} stays.`; } }],
  auto: c => { const pr = g().promises.some(x => x.k === 'keep' && x.pid === c.pid && x.status === 'open'); if (pr) return 1; return man('dof', 'sell') > 65 ? 2 : man('dof', 'sell') > 40 ? 2 : 1; } });

E('raise_demand', { from: 'dof', dept: 'sporting', cd: 6, cond: () => sq().length > 12 && week() > 3,
  setup: () => { const p = randP(p => p.ca > F.tierAvg(g().club.tier) && p.wage < F.wageFor(p.ca) * 1.05); if (!p) return null; return { pid: p.id, name: p.name, ask: Math.round(F.wageFor(p.ca) * 1.3 / 5) * 5 }; },
  title: c => `${c.name} wants a new contract`, body: c => { const p = P(c.pid); return p ? `His agent says ${c.name} is underpaid at ${money(p.wage)}/wk and wants ${money(c.ask)}/wk. He has been one of our better players.` : 'He has left.'; },
  opts: [
    { l: 'Pay him', h: c => `Wage to ${money(c.ask)}/wk · morale ↑`, f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.wage = c.ask; p.contract = Math.max(p.contract, 3); p.morale = clamp(p.morale + 15, 0, 100); return `${c.name} signs a new deal.`; } },
    { l: 'Refuse', h: 'Saves money · he may sulk', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.morale = clamp(p.morale - 18, 0, 100); if (p.pers.amb > 13) { F.later('transfer_request', { pid: p.id, name: p.name }, 2, 5); return `${c.name} is furious. Expect a transfer request.`; } return `${c.name} accepts it, for now.`; } },
    { l: 'Meet halfway', h: 'Compromise, chance he accepts', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; if (chance(0.55 + F.eff('dof', 1) / 60)) { p.wage = Math.round((p.wage + c.ask) / 2 / 5) * 5; p.contract = Math.max(p.contract, 2); return `A compromise is found.`; } p.morale -= 10; return `Talks break down.`; } }],
  auto: c => { const p = P(c.pid); if (!p) return 1; return c.ask <= F.playerWages() / sq().length * (+man('dof', 'maxWage')) / 100 ? 2 : 1; } });

E('coach_dof_clash', { from: 'coach', dept: 'sporting', cd: 12, cond: () => staff('coach') && staff('dof') && g().ss.signings > 0, w: () => 1 + (100 - (staff('coach').rel + staff('dof').rel) / 2) / 40,
  title: () => `Coach and DoF clash over signings`,
  body: () => `${N('coach')} says the new players "are not what I asked for" and wants a veto on recruitment. ${N('dof')} calls it "a coach covering for results". The dressing room is starting to notice.`,
  opts: [
    { l: 'Back the coach', h: 'Coach ↑ · DoF ↓', f: () => { rel('coach', 8); rel('dof', -9); return `${N('coach')} gets more say. ${N('dof')} feels undermined.`; } },
    { l: 'Back the Director of Football', h: 'DoF ↑ · coach ↓', f: () => { rel('dof', 8); rel('coach', -9); boost('coach', -2); return `The structure stands. ${N('coach')} is unhappy.`; } },
    { l: 'Lock them in a room', h: 'Mediation: both small ±, could backfire', f: () => { if (chance(0.55)) { rel('coach', 3); rel('dof', 3); return 'They leave with a shared shortlist and a handshake.'; } rel('coach', -4); rel('dof', -4); return 'The meeting ends in shouting. Nothing is solved.'; } }],
  auto: () => 2 });

E('free_veteran', { from: 'dof', dept: 'sporting', cd: 14, cond: () => week() < 22,
  setup: () => { const t = g().club.tier; const p = F.genPlayer({ age: ri(32, 35), ca: F.tierAvg(t) + 1.8, pos: pick(['CB', 'CM', 'ST', 'AM']) }); p.wage = Math.round(F.wageFor(p.ca) * 1.6 / 5) * 5; p.fee = 0; return { player: p }; },
  title: c => `Former international ${c.player.name} is available`, body: c => `${c.player.name} (${c.player.age}, ${F.POS_L[c.player.pos]}) is a free agent and would "love a final project". He is clearly better than what we have (${F.stars(c.player.ca)}★) but wants ${money(c.player.wage)}/wk. Supporters would love it.`,
  opts: [
    { l: 'Sign him', h: c => `${money(c.player.wage)}/wk · fans ↑ · squad ↑ short-term`, f: c => { F.sign(c.player); fx({ fans: 5, press: 3 }); return `${c.player.name} signs. The town is buzzing.`; } },
    { l: 'Pass', h: 'Stick to the plan', f: () => { return 'The DoF lets him go elsewhere.'; } }],
  auto: c => +man('dof', 'maxAge') >= c.player.age && man('dof', 'youth') < 45 ? 0 : 1 });

E('scout_gem', { from: 'scout', dept: 'scouting', cd: 10, cond: () => !!staff('scout') && F.G.week <= 20,
  setup: () => { const regs = Object.keys(F.REGIONS).filter(r => r !== man('scout', 'reg1') && r !== man('scout', 'reg2')); return { reg: pick(regs), cost: M(1500) }; },
  title: c => `${N('scout')} wants to scout ${F.REGIONS[c.reg].name}`, body: c => `"I keep hearing about a teenager in ${F.REGIONS[c.reg].name}. It is outside my mandate, but I would like a week there. Cost: ${money(c.cost)}."`,
  opts: [
    { l: 'Approve the trip', h: c => `−${money(c.cost)} · network grows · chance of a gem`, f: c => { adj('cash', -c.cost); g().club.net[c.reg] = clamp(g().club.net[c.reg] + 15, 0, 100); rel('scout', 4); if (chance(0.5)) { const p = F.genPlayer({ age: ri(17, 19), ca: F.tierAvg(g().club.tier) - 0.8, region: c.reg, paBonus: 2.5 }); p.fee = Math.round(p.value * 0.5); F.G.academy.push(Object.assign(p, { academy: true, wage: M(60), contract: 3 })); return `He comes back with ${p.name}, who joins the academy for ${money(p.fee)}. "One for the future."`; } return 'The trip builds contacts, but the teenager has already signed elsewhere.'; } },
    { l: 'Stick to the mandate', h: 'Saves money · scout ↓', f: () => { rel('scout', -3); return 'He grumbles but stays on task.'; } }],
  auto: () => 1 });

E('data_vs_eye', { from: 'scout', dept: 'scouting', cd: 14, cond: () => !!staff('scout'),
  title: () => 'The analysts and the scouts disagree', body: () => `The data team rates a target highly; ${N('scout')}'s scouts say he "goes missing in big moments". Recruitment is split down the middle.`,
  opts: [
    { l: 'Trust the data', h: 'Data mandates nudged up', f: () => { const m = F.G.mand; m.dof.data = clamp(m.dof.data + 10, 0, 100); m.scout.data = clamp(m.scout.data + 10, 0, 100); rel('scout', lean('scout') > 50 ? 2 : -3); return 'The club leans further into analytics.'; } },
    { l: 'Trust the scouts', h: 'Data mandates nudged down', f: () => { const m = F.G.mand; m.dof.data = clamp(m.dof.data - 10, 0, 100); m.scout.data = clamp(m.scout.data - 10, 0, 100); rel('scout', 3); return 'The scouts feel heard.'; } }],
  auto: () => man('scout', 'data') >= 50 ? 0 : 1 });

E('deadline_day', { from: 'dof', dept: 'sporting', cd: 15, cond: () => week() === 4 || week() === 19,
  setup: () => { const need = Object.keys(F.POSW).find(p => sq().filter(x => x.pos === p).length < 2) || pick(['CB', 'ST', 'CM']); return { pos: need, fee: M(ri(5000, 9000)) }; },
  title: c => 'Deadline day: the squad is thin', body: c => `${N('dof')} flags a gap at ${F.POS_L[c.pos].toLowerCase()}. A panic option is available for ${money(c.fee)}: not great, but bodies are bodies.`,
  opts: [
    { l: 'Panic buy', h: c => `−${money(c.fee)} · depth ↑`, f: c => { const p = F.genPlayer({ pos: c.pos, ca: F.tierAvg(g().club.tier) - 0.3, age: ri(25, 31) }); p.fee = c.fee; F.sign(p); return `${p.name} arrives at the last minute.`; } },
    { l: 'Promote from the academy', h: 'Free · youth gets a chance', f: c => { const a = F.G.academy.sort((x, y) => y.ca - x.ca)[0]; if (!a) return 'There is nobody ready.'; F.G.academy = F.G.academy.filter(x => x !== a); a.contract = 2; a.wage = M(80); F.G.squad.push(a); return `${a.name} is promoted to the first-team squad.`; } },
    { l: 'Trust the squad', h: 'No cost · risk if injuries hit', f: () => 'The window closes quietly.' }],
  auto: () => man('dof', 'youth') > 60 ? 1 : man('fin', 'risk') > 55 ? 0 : 2 });

E('agent_fee', { from: 'dof', dept: 'sporting', cd: 25, cond: () => week() <= 4 || (week() >= 17 && week() <= 19),
  title: () => 'An agent offers "a little arrangement"', body: () => `A well-known agent offers ${N('dof')} a cut of future fees if the club favours his players. ${N('dof')} has brought it to you, which is something.`,
  opts: [
    { l: 'Report it to the FA', h: 'Press ↑ · agents wary of us', f: () => { fx({ press: 6, board: 2 }); return 'The story makes the papers. The club looks clean.'; } },
    { l: 'Quietly decline', h: 'No fuss', f: () => 'The agent shrugs and moves on.' },
    { l: 'Hear him out', h: 'Cheaper deals now · scandal risk later', f: () => { adj('cash', M(4000)); if (chance(0.55)) F.later('agent_scandal', {}, 5, 12); return 'Some deals get cheaper. Nobody finds out. Yet.'; } }],
  auto: () => staff('dof') && staff('dof').p.risk > 15 ? 2 : 1 });

/* ===================== FIRST TEAM (Coach) ===================== */
E('dressing_room', { from: 'coach', dept: 'first team', cd: 10, cond: () => !!staff('coach') && sq().some(p => p.age >= 28),
  setup: () => { const p = randP(p => p.age >= 28); return p ? { pid: p.id, name: p.name } : null; },
  title: c => `${c.name} clashes with ${N('coach')}`, body: c => `Senior player ${c.name} challenged the coach's methods in front of the squad. Others are watching to see what happens.`,
  opts: [
    { l: 'Back the coach publicly', h: 'Coach ↑ · player morale ↓', f: c => { rel('coach', 6); const p = P(c.pid); if (p) p.morale = clamp(p.morale - 20, 0, 100); return `${N('coach')}'s authority is restored. ${c.name} is sulking.`; } },
    { l: 'Side with the player', h: 'Squad morale ↑ · coach ↓↓', f: () => { rel('coach', -12); adj('morale', 3); F.later('coach_authority', {}, 3, 6); return 'The players feel heard. The coach feels undermined.'; } },
    { l: 'Let them sort it out', h: 'Depends on the coach', f: c => { if (F.eff('coach', 1) > 11 || chance(0.4)) { adj('morale', 2); return `${N('coach')} handles it well. Clear air.`; } adj('morale', -4); return 'It festers.'; } }],
  auto: () => 2 });

E('losing_streak', { from: 'board', dept: 'first team', cd: 8, cond: () => g().form.slice(-4).filter(r => r === 'L').length >= 3 && !!staff('coach'),
  title: () => `Pressure mounts on ${N('coach')}`, body: () => `${g().form.slice(-4).filter(r => r === 'L').length} defeats in four. The board wants to know what you intend to do about the head coach.`,
  opts: [
    { l: 'Public vote of confidence', h: 'Coach ↑ · board ↓ if it continues', f: () => { rel('coach', 8); boost('coach', 3); adj('board', -2); return 'You stand by him. Now he has to deliver.'; } },
    { l: 'Private ultimatum', h: 'Coach boosted but tense', f: () => { boost('coach', 5); rel('coach', -5); return 'He knows the next few games decide his future.'; } },
    { l: 'Sack the coach', h: 'Compensation · new appointment needed', f: () => { const s = staff('coach'); if (!s) return 'No coach to sack.'; const cost = Math.round(s.wage * Math.max(8, s.contract * 20)); adj('cash', -cost); F.G.staff.coach = null; F.G.cands.coach = F.genCands('coach'); adj('board', 3); return `${s.name} is dismissed (${money(cost)}). Appoint a successor from the Staff tab.`; } }],
  auto: () => 0 });

E('coach_poached', { from: 'coach', dept: 'first team', cd: 30, cond: () => staff('coach') && staff('coach').perf > 62 && staff('coach').p.amb > 10,
  setup: () => ({ club: pick(F.G.divs[Math.max(1, g().club.tier - 2)].clubs.filter(x => x !== 0)), comp: Math.round(staff('coach').wage * 30 / 100) * 100 }),
  title: c => `${F.cname(c.club)} want ${N('coach')}`, body: c => `A club two levels higher have approached our coach. They would pay ${money(c.comp)} compensation. He wants to talk to them.`,
  opts: [
    { l: 'Offer him a raise to stay', h: 'Wage +25% · stays happy', f: () => { const s = staff('coach'); s.wage = Math.round(s.wage * 1.25 / 5) * 5; s.contract = Math.max(s.contract, 3); rel('coach', 8); return `${s.name} commits his future to the club.`; } },
    { l: 'Let him go, take the money', h: c => `+${money(c.comp)} · need a new coach`, f: c => { const s = staff('coach'); adj('cash', c.comp); F.G.staff.coach = null; F.G.cands.coach = F.genCands('coach'); return `${s.name} leaves with our blessing. Appoint a successor from the Staff tab.`; } },
    { l: 'Block the approach', h: 'He stays, unhappily', f: () => { rel('coach', -15); boost('coach', -3); return 'He stays, but his heart is elsewhere.'; } }],
  auto: () => 0 });

E('injury_crisis', { from: 'coach', dept: 'first team', cd: 10, cond: () => sq().filter(p => p.inj > 0).length >= 3,
  setup: () => ({ cost: M(3000) }), title: () => 'Injury crisis', body: c => `${sq().filter(p => p.inj > 0).length} players in the treatment room. The medical team asks for ${money(c.cost)} for extra physio staff and equipment.`,
  opts: [
    { l: 'Fund the medical team', h: c => `−${money(c.cost)} · faster recovery, fewer injuries (3 wk)`, f: c => { adj('cash', -c.cost); F.G.push.medical = 3; return 'Extra physios arrive on Monday.'; } },
    { l: 'Push through', h: 'No cost', f: () => 'The squad will have to cope.' }],
  auto: () => man('fin', 'risk') > 40 || F.G.club.cash > M(20000) ? 0 : 1 });

E('youth_debut', { from: 'acad', dept: 'academy', cd: 8, cond: () => F.G.academy.some(p => p.age >= 16) && !!staff('coach'),
  setup: () => { const p = F.G.academy.slice().sort((a, b) => b.pa - a.pa)[0]; return p ? { pid: p.id, name: p.name } : null; },
  title: c => `${N('acad')} says ${c.name} is ready`, body: c => { const p = P(c.pid); return p ? `${c.name} (${p.age}, potential ${p.band ? p.band[0] + '–' + p.band[1] : F.absStars(p.pa)}★) has been outstanding for the under-18s. ${N('coach')} is not convinced he is ready.` : 'He has moved on.'; },
  opts: [
    { l: 'Promote him to the first team', h: 'Academy ↑ · coach ↓', f: c => { const p = P(c.pid); if (!p || !F.G.academy.includes(p)) return 'He has moved on.'; F.G.academy = F.G.academy.filter(x => x !== p); p.contract = 3; p.wage = M(90); p.st = { apps: 0, mins: 0, g: 0, a: 0, xg: 0, xa: 0, prg: 0, dw: 0, dt: 0, rat: 0, yc: 0, rc: 0 }; F.G.squad.push(p); rel('acad', 6); rel('coach', -3); fx({ fans: 2 }); return `${c.name} joins the first-team squad.`; } },
    { l: "Respect the coach's judgement", h: 'Coach ↑ · academy ↓', f: () => { rel('coach', 3); rel('acad', -5); return 'He stays with the youth team for now.'; } }],
  auto: () => man('acad', 'pace') >= 55 || man('coach', 'youthMins') >= 60 ? 0 : 1 });

E('training_complaint', { from: 'coach', dept: 'first team', cd: 12, cond: () => man('coach', 'intensity') > 65,
  title: () => 'Players complain about training', body: () => `The senior players have asked the captain to tell you training is "brutal". ${N('coach')} says that is the point.`,
  opts: [
    { l: 'Ease off', h: 'Intensity −15 · morale ↑ · coach ↓', f: () => { F.G.mand.coach.intensity -= 15; adj('morale', 5); rel('coach', -4); return 'Training is lightened.'; } },
    { l: 'Back the regime', h: 'Morale ↓ · fitness stays', f: () => { adj('morale', -4); rel('coach', 4); return 'The players are told to get on with it.'; } }],
  auto: () => 1 });

E('style_drift', { from: 'coach', dept: 'first team', cd: 15, cond: () => !!staff('coach') && staff('coach').style !== dna().style && g().form.slice(-5).filter(r => r === 'L').length >= 2,
  title: () => `${N('coach')} wants to abandon the club style`, body: () => `After poor results, the coach wants to play his own ${staff('coach') ? F.STYLES[staff('coach').style].toLowerCase() : ''} football instead of our ${F.STYLES[dna().style].toLowerCase()} identity. "Let me do it my way."`,
  opts: [
    { l: 'Enforce the club style', h: 'DNA kept · coach ↓', f: () => { F.G.mand.coach.style = 'dna'; rel('coach', -6); return 'The identity is non-negotiable.'; } },
    { l: 'Allow pragmatism', h: 'Coach ↑ · DNA alignment ↓', f: () => { F.G.mand.coach.style = 'own'; rel('coach', 6); adj('drift', 6); return 'He gets his way. The purists are uneasy.'; } }],
  auto: () => man('coach', 'style') === 'dna' ? 0 : 1 });

E('captain', { from: 'coach', dept: 'first team', cd: 99, cond: () => week() >= 2 && F.G.season === 1,
  setup: () => { const v = sq().slice().sort((a, b) => b.age - a.age)[0], b = F.bestPlayer(), l = sq().find(p => p.region === 'dom' && p !== v && p !== b) || sq()[0]; return { v: v.id, vn: v.name, b: b.id, bn: b.name, l: l.id, ln: l.name }; },
  title: () => 'Who should be captain?', body: c => `${N('coach')} asks for your input on the captaincy. The options: the veteran ${c.vn}, our best player ${c.bn}, or local lad ${c.ln}.`,
  opts: [
    { l: c => `The veteran, ${c.vn}`, h: 'Steady dressing room', f: c => { adj('morale', 4); const p = P(c.v); if (p) p.captain = true; return `${c.vn} gets the armband.`; } },
    { l: c => `The best player, ${c.bn}`, h: 'Star happy · some resentment', f: c => { const p = P(c.b); if (p) { p.morale = clamp(p.morale + 15, 0, 100); p.captain = true; } adj('morale', -1); return `${c.bn} is the new captain.`; } },
    { l: c => `The local lad, ${c.ln}`, h: 'Fans ↑', f: c => { fx({ fans: 5 }); const p = P(c.l); if (p) p.captain = true; return `${c.ln} will lead the side. The town loves it.`; } }],
  auto: () => 0 });

/* ===================== ACADEMY ===================== */
E('wonderkid', { forced: 1, from: 'acad', dept: 'academy', cd: 20,
  setup: () => null,
  title: c => `Big clubs circle ${P(c.pid) ? P(c.pid).name : 'our prospect'}`, body: c => { const p = P(c.pid); return p ? `${p.name} (${p.age}) is the best prospect the academy has seen (potential ${p.band ? p.band[0] + '–' + p.band[1] : F.absStars(p.pa)}★). A top-flight academy offers ${money(M(12000))} now. His family is tempted.` : 'He has gone.'; },
  opts: [
    { l: 'Sell him', h: () => `+${money(M(12000))} · fans ↓`, f: c => { const p = P(c.pid); if (!p) return 'Gone.'; F.G.academy = F.G.academy.filter(x => x !== p); adj('cash', M(12000)); adj('fans', -3); rel('acad', -6); return `${p.name} leaves for the big time.`; } },
    { l: 'Offer the family a scholarship package', h: () => `−${money(M(2500))} · good chance he stays`, f: c => { const p = P(c.pid); if (!p) return 'Gone.'; adj('cash', -M(2500)); if (chance(0.75)) { rel('acad', 5); p.loyalty = true; return `${p.name}'s family commits to the club.`; } F.G.academy = F.G.academy.filter(x => x !== p); return `They take the package and still leave. A painful lesson.`; } },
    { l: 'Do nothing', h: 'Risky', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; if (chance(0.5)) { F.G.academy = F.G.academy.filter(x => x !== p); adj('fans', -4); return `${p.name} leaves for a token fee. Supporters are furious.`; } return 'The interest cools. He stays, for now.'; } }],
  auto: () => man('acad', 'budget') > 50 ? 1 : man('dof', 'sell') > 60 ? 0 : 2 });

E('acad_facility', { from: 'acad', dept: 'academy', cd: 20, cond: () => g().club.fac.youth < 10,
  setup: () => ({ cost: M(6000 + g().club.fac.youth * 2500) }), title: () => 'Proposal: upgrade the academy facilities', body: c => `${N('acad')} wants new pitches and a classroom block. Cost ${money(c.cost)}. Better facilities mean better intakes and faster development.`,
  opts: [
    { l: 'Approve', h: c => `−${money(c.cost)} · academy level +1`, f: c => { adj('cash', -c.cost); g().club.fac.youth++; rel('acad', 6); return `Academy facilities upgraded to level ${g().club.fac.youth}.`; } },
    { l: 'Not now', h: 'Academy ↓', f: () => { rel('acad', -4); return 'The plans go back in the drawer.'; } }],
  auto: c => man('fin', 'invest') > 55 && g().club.cash > c.cost * 2 ? 0 : 1 });

E('parents', { from: 'acad', dept: 'academy', cd: 18, cond: () => man('acad', 'pace') > 60 || man('coach', 'intensity') > 70,
  title: () => 'Parents complain about pressure', body: () => 'A group of academy parents say their children are being pushed too hard, too early. A local paper is interested.',
  opts: [
    { l: 'Meet them personally', h: 'Fans ↑ · costs you nothing but time', f: () => { fx({ fans: 2, press: 2 }); rel('acad', -1); return 'The meeting calms things down.'; } },
    { l: 'Back the academy director', h: 'Academy ↑ · press ↓', f: () => { rel('acad', 4); fx({ press: -4 }); return 'The story runs. "Win at all costs academy" says the headline.'; } }],
  auto: () => 1 });

E('school_partner', { from: 'acad', dept: 'academy', cd: 30,
  setup: () => ({ cost: M(1200) }), title: () => 'Partnership offer from local schools', body: c => `Five local schools want a coaching partnership. Cost ${money(c.cost)} a season. Great for the community and the scouting net.`,
  opts: [
    { l: 'Sign up', h: c => `−${money(c.cost)} · fans ↑ · local intake ↑`, f: c => { adj('cash', -c.cost); fx({ fans: 4, press: 3 }); g().club.fac.youth = Math.min(10, g().club.fac.youth + (chance(0.4) ? 1 : 0)); return 'Club coaches are in schools from Monday.'; } },
    { l: 'Decline', h: 'Saves money', f: () => 'Not this year.' }],
  auto: () => man('acad', 'local') > 50 || dna().identity === 'community' ? 0 : 1 });

E('youth_coach_leaving', { from: 'acad', dept: 'academy', cd: 30,
  setup: () => ({ cost: M(1500) }), title: () => 'Top youth coach headhunted', body: c => `Our best under-16s coach has an offer from a bigger club. Matching it costs ${money(c.cost)}.`,
  opts: [
    { l: 'Match the offer', h: c => `−${money(c.cost)}`, f: c => { adj('cash', -c.cost); rel('acad', 3); return 'He stays.'; } },
    { l: 'Let him go', h: 'Academy development slows briefly', f: () => { F.G.academy.forEach(p => { p.pa = Math.max(p.ca, p.pa - 0.2); }); rel('acad', -4); return 'He leaves. The under-16s will feel it.'; } }],
  auto: () => man('acad', 'budget') > 45 ? 0 : 1 });

/* ===================== COMMERCIAL ===================== */
E('bet_sponsor', { from: 'com', dept: 'commercial', cd: 20,
  setup: () => ({ wk: M(ri(1100, 1600)) }), title: c => `Betting firm offers ${money(c.wk)}/week`, body: c => `QuickOdds want their logo on our shirt: ${money(c.wk)} a week for a season. ${dna().identity === 'ideals' ? 'It goes against everything we said we stand for.' : 'Some supporters will not like it.'}`,
  opts: [
    { l: 'Take the money', h: c => `+${money(c.wk)}/wk · fans ↓ · identity risk`, f: c => { g().club.deals.push({ name: 'QuickOdds', type: 'shirt', wk: c.wk, weeks: 34 }); if (dna().identity !== 'brand') F.later('fan_boycott', {}, 3, 7); fx({ fans: dna().identity === 'ideals' ? -12 : -4, press: dna().identity === 'ideals' ? -8 : -1, drift: dna().identity === 'ideals' ? 15 : 3 }); return 'The deal is signed.'; } },
    { l: 'Turn it down', h: 'Press ↑ if principled', f: () => { fx({ press: dna().identity === 'ideals' ? 4 : 1 }); return 'QuickOdds go to a rival.'; } }],
  auto: () => man('com', 'betting') === 'ban' || man('com', 'selectivity') > 65 ? 1 : 0 });

E('naming_rights', { from: 'com', dept: 'commercial', cd: 40, cond: () => !g().club.deals.some(d => d.type === 'stadium'),
  setup: () => ({ wk: M(ri(900, 1400)), firm: pick(['Brightline Energy', 'Halden Insurance', 'Nordica Foods', 'Copperfield Homes']) }),
  title: c => `${c.firm} want to rename the stadium`, body: c => `Three-year naming rights deal: ${money(c.wk)} a week. The old name has history.`,
  opts: [
    { l: 'Sign the deal', h: c => `+${money(c.wk)}/wk · fans ↓`, f: c => { g().club.deals.push({ name: c.firm + ' (stadium)', type: 'stadium', wk: c.wk, weeks: 102 }); fx({ fans: dna().identity === 'community' ? -8 : -3, drift: dna().identity === 'community' ? 6 : 0 }); return `Welcome to the ${c.firm} Arena.`; } },
    { l: 'Keep the name', h: 'Fans ↑', f: () => { fx({ fans: 3 }); return 'Some things are not for sale.'; } },
    { l: 'Counter: name a stand only', h: 'Half the money, less backlash', f: c => { g().club.deals.push({ name: c.firm + ' Stand', type: 'stand', wk: Math.round(c.wk / 2), weeks: 102 }); fx({ fans: -1 }); return `The ${c.firm} Stand it is.`; } }],
  auto: () => man('com', 'selectivity') > 60 ? 2 : 0 });

E('ticket_protest', { from: 'fans', dept: 'commercial', cd: 10, cond: () => man('com', 'tickets') > 60,
  title: () => 'Supporters protest ticket prices', body: () => `Banners at the last home game: "Football without fans is nothing". The supporters' trust demands a price cut. Current price ${money(F.ticketPrice())}.`,
  opts: [
    { l: 'Cut prices', h: 'Ticket slider −20 · fans ↑', f: () => { F.G.mand.com.tickets = clamp(F.G.mand.com.tickets - 20, 0, 100); fx({ fans: 6 }); rel('com', -3); return 'Prices come down.'; } },
    { l: 'Hold firm', h: 'Fans ↓', f: () => { fx({ fans: -6, press: -2 }); return 'The protests will continue.'; } },
    { l: 'Freeze prices, add a youth discount', h: 'Fans ↑ a little', f: () => { fx({ fans: 3 }); return 'A compromise that buys some goodwill.'; } }],
  auto: () => 2 });

E('local_deal', { from: 'com', dept: 'commercial', cd: 8,
  setup: () => ({ wk: M(ri(200, 420)), firm: pick(['Baxter\'s Butchers', 'Riverside Garage', 'The Old Mill Brewery', 'Lark Accountancy', 'Pemberton Plumbing', 'Sunny Side Café']) }),
  title: c => `${c.firm} want to sponsor the club`, body: c => `A small local deal: ${money(c.wk)} a week for a season, sleeve and programme ads.`,
  opts: [
    { l: 'Accept', h: c => `+${money(c.wk)}/wk · community ↑`, f: c => { g().club.deals.push({ name: c.firm, type: 'local', wk: c.wk, weeks: 34 }); fx({ fans: 1 }); return 'Signed with a handshake.'; } },
    { l: 'Hold out for bigger partners', h: 'Brand protected', f: () => 'Politely declined.' }],
  auto: () => man('com', 'selectivity') > 80 && dna().identity === 'brand' ? 1 : 0 });

E('crypto', { from: 'com', dept: 'commercial', cd: 30,
  setup: () => ({ cash: M(ri(9000, 14000)) }), title: c => `A crypto platform offers ${money(c.cash)} up front`, body: c => `MoonVault Token want to be "Official Digital Asset Partner". ${money(c.cash)} paid immediately. Their reputation is... volatile.`,
  opts: [
    { l: 'Take it', h: c => `+${money(c.cash)} now · scandal risk`, f: c => { adj('cash', c.cash); fx({ press: -3 }); if (chance(0.5)) F.later('crypto_collapse', { cash: c.cash }, 4, 10); return 'The money clears. So far so good.'; } },
    { l: 'Walk away', h: 'Sponsors ↑', f: () => { fx({ spons: 2 }); return 'Wise, says the finance department.'; } }],
  auto: () => man('com', 'selectivity') < 35 && man('fin', 'risk') > 50 ? 0 : 1 });

E('kit_deal', { from: 'com', dept: 'commercial', cd: 99, cond: () => week() >= 3 && week() <= 30,
  title: () => 'Choose a kit supplier', body: () => 'Two offers: a budget brand that pays a flat fee, or a premium brand that pays less but sells far more shirts.',
  opts: [
    { l: 'Budget brand, guaranteed fee', h: () => `+${money(M(6000))} now`, f: () => { adj('cash', M(6000)); return 'Functional, cheap, fine.'; } },
    { l: 'Premium brand, better merch', h: 'Brand ↑ · merch income ↑', f: () => { fx({ brand: 6 }); F.G.mand.com.merch = clamp(F.G.mand.com.merch + 10, 0, 100); return 'The new shirts look sharp.'; } }],
  auto: () => man('com', 'merch') > 55 ? 1 : 0 });

E('hospitality', { from: 'com', dept: 'commercial', cd: 30,
  setup: () => ({ cost: M(8000) }), title: () => 'Build corporate hospitality boxes', body: c => `${N('com')} wants to convert part of the main stand into hospitality boxes. Cost ${money(c.cost)}, then roughly ${money(M(350))} a week.`,
  opts: [
    { l: 'Build them', h: c => `−${money(c.cost)} · +${money(M(350))}/wk · a few hundred seats lost`, f: c => { adj('cash', -c.cost); g().club.deals.push({ name: 'Hospitality boxes', type: 'hosp', wk: M(350), weeks: 400 }); g().club.cap = Math.max(1500, g().club.cap - 200); fx({ fans: dna().identity === 'community' ? -3 : 0 }); return 'The boxes open next month.'; } },
    { l: 'Not now', h: 'Commercial ↓', f: () => { rel('com', -3); return 'Shelved.'; } }],
  auto: c => man('fin', 'invest') > 50 && g().club.cash > c.cost * 1.5 ? 0 : 1 });

E('tour', { from: 'com', dept: 'commercial', cd: 99, cond: () => week() >= 30 && g().club.tier <= 6,
  setup: () => ({ cash: M(9000) }), title: () => 'Pre-season tour offer', body: c => `An agency offers a pre-season tour abroad: ${money(c.cash)} and global exposure. The coach worries about fatigue.`,
  opts: [
    { l: 'Book the tour', h: c => `+${money(c.cash)} · brand ↑ · coach ↓`, f: c => { adj('cash', c.cash); fx({ brand: 6 }); rel('coach', -4); return 'Bags packed for the summer.'; } },
    { l: 'Stay home', h: 'Coach ↑', f: () => { rel('coach', 3); return 'A quiet pre-season at the training ground.'; } }],
  auto: () => man('mkt', 'reach') > 55 ? 0 : 1 });

E('sponsor_morals', { from: 'com', dept: 'commercial', cd: 25, cond: () => g().club.deals.length > 0,
  setup: () => { const d = pick(g().club.deals); return { name: d.name }; }, title: c => `Sponsor ${c.name} in the news`, body: c => `${c.name} are accused of unpaid wages to their own staff. Fans ask whether the club should be associated with them.`,
  opts: [
    { l: 'Terminate the deal', h: 'Lose the income · press ↑', f: c => { g().club.deals = g().club.deals.filter(d => d.name !== c.name); fx({ press: 5, fans: 3 }); return 'The contract is terminated.'; } },
    { l: 'Stand by them', h: 'Keep the income · press ↓', f: () => { fx({ press: -5, fans: -2 }); return 'The club says it "awaits the facts".'; } }],
  auto: () => man('com', 'selectivity') > 60 ? 0 : 1 });

/* ===================== MARKETING ===================== */
E('viral', { from: 'mkt', dept: 'marketing', cd: 15,
  setup: () => { const p = randP(); return p ? { pid: p.id, name: p.name } : null; }, title: c => `${c.name}'s celebration goes viral`, body: c => `A video of ${c.name}'s goal celebration has millions of views. ${N('mkt')} wants to build a campaign around it. ${N('coach')} wants the focus on football.`,
  opts: [
    { l: 'Lean into it', h: 'Brand ↑↑ · coach ↓', f: c => { fx({ brand: 7, fans: 3 }); rel('coach', -3); rel('mkt', 4); F.later('player_ego', { pid: c.pid, name: c.name }, 4, 8); return 'Merch with his face on it sells out in a day.'; } },
    { l: 'Keep it low-key', h: 'Coach ↑', f: () => { fx({ brand: 2 }); rel('coach', 2); rel('mkt', -2); return 'A single post, then back to business.'; } }],
  auto: () => man('mkt', 'tone') > 45 || man('mkt', 'reach') > 55 ? 0 : 1 });

E('social_gaffe', { from: 'mkt', dept: 'marketing', cd: 15, w: () => 0.4 + man('mkt', 'tone') / 50,
  title: () => 'Social media post backfires', body: () => 'A cheeky post mocking a rival has been called "disrespectful" by their supporters and picked up by national media.',
  opts: [
    { l: 'Apologise publicly', h: 'Press ↑ · brand ↓ a little', f: () => { fx({ press: 3, brand: -2 }); return 'The apology is accepted.'; } },
    { l: 'Double down', h: 'Brand ↑ or big backlash', f: () => { if (chance(0.5)) { fx({ brand: 6, fans: 2 }); return 'The internet decides it is funny. Followers surge.'; } fx({ press: -8, spons: -5 }); return 'A sponsor calls to "express concern".'; } },
    { l: 'Delete and say nothing', h: 'Small press hit', f: () => { fx({ press: -2 }); return 'It blows over.'; } }],
  auto: () => man('mkt', 'tone') > 65 ? 1 : 0 });

E('documentary', { from: 'mkt', dept: 'marketing', cd: 99, cond: () => F.G.season >= 1 && week() > 5,
  setup: () => ({ cash: M(7000) }), title: () => 'A streaming documentary wants access', body: c => `A streaming service offers ${money(c.cash)} for a behind-the-scenes series. Cameras in the dressing room, the boardroom, everywhere.`,
  opts: [
    { l: 'Full access', h: c => `+${money(c.cash)} · brand ↑↑ · dressing-room risk`, f: c => { adj('cash', c.cash); fx({ brand: 10 }); F.later('doc_episode', { cash: c.cash }, 4, 8); return 'Filming starts next week. The crew is everywhere.'; } },
    { l: 'Limited access', h: 'Half the money, no dressing room', f: c => { adj('cash', Math.round(c.cash / 2)); fx({ brand: 4 }); return 'A tasteful series. Modest numbers.'; } },
    { l: 'Decline', h: 'Coach ↑', f: () => { rel('coach', 2); return 'Not for us.'; } }],
  auto: () => man('mkt', 'reach') > 55 ? 0 : 1 });

E('rebrand', { from: 'mkt', dept: 'marketing', cd: 99, cond: () => week() > 8,
  setup: () => ({ cost: M(3000) }), title: () => 'Proposal: a modern crest', body: c => `${N('mkt')} has commissioned a sleek new badge. Cost ${money(c.cost)}. "The old one does not work on a phone screen."`,
  opts: [
    { l: 'Launch it', h: c => `−${money(c.cost)} · brand ↑ · fans ↓`, f: c => { adj('cash', -c.cost); fx({ brand: 8, fans: man('mkt', 'consult') === 'yes' ? -2 : -8 }); return man('mkt', 'consult') === 'yes' ? 'After a fan vote, a tweaked version is launched.' : 'Launched without consultation. The traditionalists are livid.'; } },
    { l: 'Put it to a fan vote', h: 'Fans ↑ · outcome uncertain', f: c => { fx({ fans: 3 }); if (chance(0.5)) { adj('cash', -c.cost); fx({ brand: 5 }); return 'The fans vote yes, narrowly.'; } return 'The fans keep the old crest.'; } },
    { l: 'Keep the old crest', h: 'Marketing ↓', f: () => { rel('mkt', -4); return 'The proposal is binned.'; } }],
  auto: () => man('mkt', 'consult') === 'yes' ? 1 : 0 });

E('community_day', { from: 'mkt', dept: 'marketing', cd: 14,
  setup: () => ({ cost: M(1000) }), title: () => 'Open day at the stadium', body: c => `A free family day with player signings and a kids' tournament. Cost ${money(c.cost)}.`,
  opts: [
    { l: 'Run it', h: c => `−${money(c.cost)} · fans ↑ · fanbase ↑`, f: c => { adj('cash', -c.cost); fx({ fans: 5 }); g().club.fanbase = Math.round(g().club.fanbase * 1.04); return 'Thousands turn up. A lovely day.'; } },
    { l: 'Skip it', h: 'Saves money', f: () => 'Maybe next year.' }],
  auto: () => man('mkt', 'reach') < 55 ? 0 : 1 });

E('trust_seat', { from: 'fans', dept: 'marketing', cd: 60, cond: () => week() > 6,
  title: () => "Fans want a seat on the board", body: () => 'The trust wants a voice in big decisions. The board is wary.',
  opts: [
    { l: 'Give them a seat', h: 'Fans ↑↑ · board ↓', f: () => { fx({ fans: 10, board: -5 }); F.G.mand.mkt.consult = 'yes'; return 'A supporter takes a seat at the boardroom table.'; } },
    { l: 'Offer a fan advisory panel', h: 'Fans ↑', f: () => { fx({ fans: 4 }); return 'A compromise that satisfies most.'; } },
    { l: 'Refuse', h: 'Board ↑ · fans ↓', f: () => { fx({ fans: -6, board: 2 }); return 'The trust promises to keep campaigning.'; } }],
  auto: () => 2 });

E('rival_banter', { from: 'mkt', dept: 'marketing', cd: 20,
  setup: () => ({ club: pick(F.G.divs[g().club.tier].clubs.filter(x => x !== 0)) }), title: c => `${F.cname(c.club)} mock us in a billboard campaign`, body: c => `"Founded yesterday, forgotten tomorrow" reads a billboard near our ground. ${N('mkt')} has a reply ready.`,
  opts: [
    { l: 'Fire back', h: 'Brand ↑ · rivalry heats up', f: () => { fx({ brand: 4, fans: 3 }); return 'Our reply is shared everywhere.'; } },
    { l: 'Rise above it', h: 'Press ↑', f: () => { fx({ press: 3 }); return 'The club says it will "let the football talk".'; } }],
  auto: () => man('mkt', 'tone') > 45 ? 0 : 1 });

E('press_interview', { from: 'press', dept: 'marketing', cd: 12,
  title: () => 'The Gazette wants a long interview', body: () => `The paper wants to know how the CEO sees the club's direction. ${pos() <= 6 ? 'Things are going well.' : 'Results have been mixed.'}`,
  opts: [
    { l: 'Be bold: "We\'re going up"', h: 'Fans ↑ · raises expectations', f: () => { fx({ fans: 4, press: 2 }); F.G.board.conf -= 1; return 'Big words. The board noticed.'; } },
    { l: 'Be honest about the challenges', h: 'Press ↑ · board ↑', f: () => { fx({ press: 4, board: 2 }); return 'A thoughtful piece. Well received.'; } },
    { l: 'Decline the interview', h: 'Press ↓', f: () => { fx({ press: -4 }); return '"The CEO declined to comment."'; } }],
  auto: () => 2, vacant: 2 });

/* ===================== BUSINESS & FINANCE ===================== */
E('tax_bill', { from: 'fin', dept: 'business', cd: 30,
  setup: () => ({ amt: M(ri(3000, 6000)) }), title: c => `Unexpected tax bill: ${money(c.amt)}`, body: c => `An audit finds an error in last season's accounts. ${money(c.amt)} is due. ${N('fin')} thinks it could be disputed.`,
  opts: [
    { l: 'Pay it', h: c => `−${money(c.amt)}`, f: c => { adj('cash', -c.amt); return 'Paid. Lesson learned.'; } },
    { l: 'Dispute it', h: 'Win and pay nothing, or pay 150%', f: c => { if (chance(0.3 + F.eff('fin', 0) / 40)) return 'The dispute succeeds. Nothing to pay.'; adj('cash', -Math.round(c.amt * 1.5)); return `The dispute fails. Penalties take the bill to ${money(Math.round(c.amt * 1.5))}.`; } }],
  auto: () => man('fin', 'risk') > 55 ? 1 : 0, vacant: 0 });

E('investor', { from: 'board', dept: 'business', cd: 60, cond: () => F.G.season >= 1 && week() > 10,
  setup: () => ({ cash: M(ri(25000, 40000)) }), title: c => `An investor offers ${money(c.cash)} for a minority stake`, body: c => `A private equity group wants 20% of the club for ${money(c.cash)}. They would want a seat on the board and "a clear growth path".`,
  opts: [
    { l: 'Accept the investment', h: c => `+${money(c.cash)} · board more demanding`, f: c => { adj('cash', c.cash); F.G.board.investor = true; F.later('investor_demands', {}, 6, 12); fx({ fans: dna().identity === 'community' ? -6 : -2, board: 4 }); return 'The deal is done. New faces at the board table.'; } },
    { l: 'Decline', h: 'Independence kept', f: () => { fx({ fans: 2 }); return 'The club stays in current hands.'; } }],
  auto: () => 1 });

E('stadium_expansion', { from: 'fin', dept: 'business', cd: 30, cond: () => F.attendance() >= g().club.cap * 0.92,
  setup: () => ({ cost: M(15000), seats: Math.round(g().club.cap * 0.35 / 100) * 100 }), title: c => `We are selling out: expand by ${c.seats.toLocaleString('en-GB')} seats?`, body: c => `Home games are close to capacity. A new stand would cost ${money(c.cost)}. A bank loan is possible.`,
  opts: [
    { l: 'Build it with cash', h: c => `−${money(c.cost)} · capacity +${c.seats}`, f: c => { adj('cash', -c.cost); g().club.cap += c.seats; return 'Construction starts in the summer.'; } },
    { l: 'Build it with a loan', h: c => `Debt +${money(c.cost)} · interest weekly`, f: c => { g().club.debt += c.cost; g().club.cap += c.seats; return 'Financed by the bank.'; } },
    { l: 'Not yet', h: 'Lost ticket revenue', f: () => 'Supporters will keep queueing.' }],
  auto: c => g().club.cash > c.cost * 2 ? 0 : man('fin', 'risk') > 60 ? 1 : 2, vacant: 2 });

E('pitch', { from: 'fin', dept: 'business', cd: 25,
  setup: () => ({ cost: M(2500) }), title: () => 'The pitch is waterlogged', body: c => `A home game was nearly called off. New drainage costs ${money(c.cost)}. Without it, more postponements and injuries.`,
  opts: [
    { l: 'Fix the drainage', h: c => `−${money(c.cost)}`, f: c => { adj('cash', -c.cost); return 'The new drainage works perfectly.'; } },
    { l: 'Patch it up', h: 'Cheap, injury risk', f: () => { adj('cash', -M(500)); if (chance(0.5)) { const p = randP(); if (p) { p.inj = 4; return `${p.name} injures himself on the boggy surface.`; } } return 'It holds, for now.'; } }],
  auto: () => man('fin', 'invest') > 40 ? 0 : 1, vacant: 1 });

E('wage_cap', { from: 'fin', dept: 'business', cd: 10, cond: () => F.G.fin.revW > 4 && F.wageRatio() > +man('fin', 'wageCap') / 100,
  title: () => 'Wages are over the cap', body: () => `${N('fin')} reports wages at ${Math.round(F.wageRatio() * 100)}% of revenue, above the ${man('fin', 'wageCap')}% cap you set.`,
  opts: [
    { l: 'Sell the highest earner', h: 'Wages ↓ · squad weaker', f: () => { const p = sq().slice().sort((a, b) => b.wage - a.wage)[0]; if (!p) return 'Nothing to sell.'; F.sellPlayer(p, Math.round(p.value * 0.8 / 100) * 100, `${p.name} is sold to bring wages under control.`); return `${p.name} is sold.`; } },
    { l: 'Raise the cap by 10 points', h: 'Finance ↓ · more risk', f: () => { const opts = ['50', '60', '70', '85']; const i = Math.min(3, opts.indexOf(man('fin', 'wageCap')) + 1); F.G.mand.fin.wageCap = opts[i]; rel('fin', -5); return `Cap raised to ${opts[i]}%.`; } },
    { l: 'Freeze recruitment', h: 'No new wages', f: () => { if (F.G.mand.dof.maxFee !== '0') F.G.freezePrev = F.G.mand.dof.maxFee || '50'; F.G.mand.dof.maxFee = '0'; rel('dof', -4); return 'The DoF is told: free agents only until the summer.'; } }],
  auto: () => 2, vacant: 1 });

E('council_land', { from: 'fin', dept: 'business', cd: 99, cond: () => week() > 10 && g().club.fac.train < 8,
  setup: () => ({ cost: M(12000) }), title: () => 'The council offers land for a training ground', body: c => `Former playing fields on the edge of town for ${money(c.cost)}, well below market value. A proper training base would improve player development.`,
  opts: [
    { l: 'Buy it', h: c => `−${money(c.cost)} · training facilities +2`, f: c => { adj('cash', -c.cost); g().club.fac.train = Math.min(10, g().club.fac.train + 2); fx({ press: 3 }); return 'Diggers move in next month.'; } },
    { l: 'Buy it with a loan', h: c => `Debt +${money(c.cost)} · facilities +2`, f: c => { g().club.debt += c.cost; g().club.fac.train = Math.min(10, g().club.fac.train + 2); return 'Financed by the bank.'; } },
    { l: 'Decline', h: 'Council ↓', f: () => { fx({ press: -2 }); return 'The land goes to a housing developer.'; } }],
  auto: c => g().club.cash > c.cost * 1.5 ? 0 : man('fin', 'risk') > 60 ? 1 : 2, vacant: 2 });

E('energy', { from: 'fin', dept: 'business', cd: 40,
  setup: () => ({ cost: M(4000) }), title: () => 'Energy bills are soaring', body: c => `Floodlight and heating costs have doubled. Solar panels on the stand roof cost ${money(c.cost)} and would pay for themselves in about two seasons.`,
  opts: [
    { l: 'Install solar', h: c => `−${money(c.cost)} · costs ↓ long-term · press ↑`, f: c => { adj('cash', -c.cost); g().club.rent = Math.max(0, g().club.rent - M(60)); fx({ press: 3 }); return 'The roof goes green.'; } },
    { l: 'Absorb the costs', h: 'Ground costs ↑', f: () => { g().club.rent += M(40); return 'The bills keep coming.'; } }],
  auto: () => man('fin', 'invest') > 45 ? 0 : 1, vacant: 1 });

E('loan_offer', { from: 'fin', dept: 'business', cd: 40, cond: () => g().club.cash < M(15000),
  setup: () => ({ amt: M(20000) }), title: () => 'The bank offers a credit line', body: c => `A ${money(c.amt)} loan at reasonable terms. Useful breathing room, but debt is debt.`,
  opts: [
    { l: 'Take the loan', h: c => `+${money(c.amt)} cash · debt +${money(c.amt)}`, f: c => { adj('cash', c.amt); g().club.debt += c.amt; return 'The money is in the account.'; } },
    { l: 'No thanks', h: 'Stay lean', f: () => 'Declined.' }],
  auto: () => man('fin', 'risk') > 55 ? 0 : 1, vacant: 1 });

E('cash_crisis', { forced: 1, from: 'fin', dept: 'business', cd: 6,
  title: () => 'Cash crisis', body: () => `The bank balance is ${money(g().club.cash)}. Wages are due on Friday. ${N('fin')} needs a decision.`,
  opts: [
    { l: 'Sell our most valuable player', h: 'Cash ↑↑ · squad ↓', f: () => { const p = sq().slice().sort((a, b) => b.value - a.value)[0]; if (!p) return 'Nobody to sell.'; const fee = Math.round(p.value * 0.85 / 100) * 100; F.sellPlayer(p, fee, `Fire sale: ${p.name} goes for ${money(fee)}.`); fx({ fans: -5 }); return `${p.name} is sold for ${money(fee)}.`; } },
    { l: 'Emergency loan', h: () => `+${money(M(25000))} · debt ↑`, f: () => { adj('cash', M(25000)); g().club.debt += M(28000); fx({ board: -3 }); return 'The bank helps, at a price.'; } },
    { l: 'Slash all department budgets', h: 'Budgets to minimum · staff ↓', f: () => { for (const r of ['scout', 'acad', 'mkt']) F.G.mand[r].budget = 10; F.G.mand.fin.invest = 0; ['scout', 'acad', 'mkt', 'fin'].forEach(r => rel(r, -5)); return 'Every department is cut to the bone.'; } }],
  auto: () => man('fin', 'risk') > 50 ? 1 : 2, vacant: 1 });

/* ===================== PEOPLE & POLITICS ===================== */
E('staff_raise', { from: 'board', dept: 'business', cd: 12, cond: () => F.ROLES.some(r => staff(r.id) && staff(r.id).perf > 60),
  setup: () => { const r = pick(F.ROLES.filter(r => staff(r.id) && staff(r.id).perf > 60)); return { role: r.id, name: staff(r.id).name }; },
  title: c => `${c.name} asks for a raise`, body: c => { const s = staff(c.role); return s ? `${c.name} (${F.ROLE[c.role].t}) feels his work deserves recognition and wants 20% more than his ${money(s.wage)}/wk.` : 'He has left.'; },
  opts: [
    { l: 'Give him the raise', h: 'Wage +20% · trust ↑', f: c => { const s = staff(c.role); if (!s) return 'Gone.'; s.wage = Math.round(s.wage * 1.2 / 5) * 5; s.contract = Math.max(s.contract, 2); rel(c.role, 10); return `${c.name} is delighted.`; } },
    { l: 'Offer a performance bonus instead', h: 'Cheaper · chance he accepts', f: c => { const s = staff(c.role); if (!s) return 'Gone.'; if (chance(0.6)) { s.wage = Math.round(s.wage * 1.07 / 5) * 5; rel(c.role, 3); return 'He accepts the bonus structure.'; } rel(c.role, -6); return 'He feels undervalued.'; } },
    { l: 'Refuse', h: 'Trust ↓', f: c => { rel(c.role, -10); if (staff(c.role) && staff(c.role).p.loy < 11) F.later('staff_quit', { role: c.role }, 4, 8); return `${c.name} leaves the meeting without a word.`; } }],
  auto: () => 1 });

E('staff_leak', { forced: 1, from: 'press', dept: 'marketing', cd: 10,
  title: c => 'Boardroom details leaked', body: c => `The Gazette has details of private discussions. Everyone suspects ${staffName(c.role)} (${F.ROLE[c.role].t}), whose relationship with you has broken down.`,
  opts: [
    { l: 'Confront him', h: 'Could clear the air or end it', f: c => { const s = staff(c.role); if (!s) return 'He has already left.'; if (chance(0.5)) { rel(c.role, 10); return `${s.name} denies it, then apologises. A fragile truce.`; } F.G.staff[c.role] = null; F.G.cands[c.role] = F.genCands(c.role); fx({ press: -3 }); return `${s.name} storms out and resigns. Appoint a replacement from the Staff tab.`; } },
    { l: 'Ignore it', h: 'Press ↓', f: () => { fx({ press: -4, board: -2 }); return 'More stories will follow.'; } }],
  auto: () => 1, vacant: 1 });

E('staff_quit', { forced: 1, from: 'board', dept: 'business', cd: 10,
  title: c => `${staffName(c.role)} is threatening to resign`, body: c => `The ${F.ROLE[c.role].t.toLowerCase()} says he cannot work like this any more.`,
  opts: [
    { l: 'Persuade him to stay', h: 'Costs a raise · trust ↑', f: c => { const s = staff(c.role); if (!s) return 'Already gone.'; s.wage = Math.round(s.wage * 1.15 / 5) * 5; rel(c.role, 20); return `${s.name} agrees to stay, with a raise.`; } },
    { l: 'Accept his resignation', h: 'Position becomes vacant', f: c => { const s = staff(c.role); if (!s) return 'Already gone.'; F.G.staff[c.role] = null; F.G.cands[c.role] = F.genCands(c.role); return `${s.name} has left. Appoint a replacement from the Staff tab.`; } }],
  auto: () => 1 });

E('staff_poach', { forced: 1, from: 'board', dept: 'business', cd: 20,
  title: c => `A bigger club wants ${staffName(c.role)}`, body: c => `Our ${F.ROLE[c.role].t.toLowerCase()} has done excellent work and is wanted elsewhere. He would accept a new deal at +30%.`,
  opts: [
    { l: 'Match it', h: 'Wage +30%', f: c => { const s = staff(c.role); if (!s) return 'Gone.'; s.wage = Math.round(s.wage * 1.3 / 5) * 5; s.contract = 3; rel(c.role, 8); return `${s.name} stays.`; } },
    { l: 'Let him go', h: () => `+${money(M(2000))} compensation`, f: c => { const s = staff(c.role); if (!s) return 'Gone.'; adj('cash', M(2000)); F.G.staff[c.role] = null; F.G.cands[c.role] = F.genCands(c.role); return `${s.name} moves on. Appoint a replacement from the Staff tab.`; } }],
  auto: () => 1 });

E('com_mkt_clash', { from: 'com', dept: 'commercial', cd: 14, cond: () => staff('com') && staff('mkt'),
  title: () => `${N('com')} and ${N('mkt')} fight over budget`, body: () => `Commercial wants more spend on sponsor hospitality, Marketing wants it for a fan campaign. Both have come to you.`,
  opts: [
    { l: 'Side with Commercial', h: 'Sponsors ↑ · marketing ↓', f: () => { fx({ spons: 5 }); rel('com', 5); rel('mkt', -6); return 'Sponsors get the red carpet.'; } },
    { l: 'Side with Marketing', h: 'Fans ↑ · commercial ↓', f: () => { fx({ fans: 4, brand: 2 }); rel('mkt', 5); rel('com', -6); return 'The fan campaign goes ahead.'; } },
    { l: 'Split it down the middle', h: 'Nobody fully happy', f: () => { fx({ spons: 2, fans: 1 }); rel('com', -1); rel('mkt', -1); return 'A compromise.'; } }],
  auto: () => 2 });

E('board_pet', { from: 'board', dept: 'sporting', cd: 25, cond: () => week() > 4,
  setup: () => { const p = F.genPlayer({ age: ri(19, 23), ca: F.tierAvg(g().club.tier) - 1.2, pos: pick(['W', 'ST', 'AM']) }); p.fee = 0; p.wage = Math.round(F.wageFor(p.ca) * 1.2 / 5) * 5; return { player: p }; },
  title: c => 'A board member wants his nephew signed', body: c => `"Just give the lad a contract." ${c.player.name} (${c.player.age}) is not good enough (${F.stars(c.player.ca)}★). ${N('dof')} is appalled.`,
  opts: [
    { l: 'Sign him to keep the peace', h: 'Board ↑ · DoF ↓ · wasted wage', f: c => { F.sign(c.player); fx({ board: 5 }); rel('dof', -8); F.later('nephew', { pid: c.player.id, name: c.player.name }, 6, 10); return 'The nephew has a contract. The DoF has a headache.'; } },
    { l: 'Refuse politely', h: 'Board ↓', f: () => { fx({ board: -4 }); rel('dof', 3); return 'The board member is not pleased.'; } }],
  auto: () => 0 });

E('fan_protest', { from: 'fans', dept: 'marketing', cd: 8, cond: () => g().st.fans < 35,
  title: () => 'Supporters march on the stadium', body: () => 'Hundreds of fans protest outside the main entrance. Banners demand "a plan, not excuses".',
  opts: [
    { l: 'Go out and talk to them', h: 'Fans ↑ · risky', f: () => { if (chance(0.65)) { fx({ fans: 8, press: 3 }); return 'You win some respect by facing them.'; } fx({ fans: -3, press: -3 }); return 'The meeting turns ugly.'; } },
    { l: 'Issue a statement', h: 'Small fans ↑', f: () => { fx({ fans: 2 }); return 'The statement is read out at the next home game.'; } },
    { l: 'Ignore it', h: 'Fans ↓', f: () => { fx({ fans: -5, board: -3 }); return 'The protests grow.'; } }],
  auto: () => 2 });

E('board_warning', { forced: 1, from: 'board', dept: 'business', cd: 10,
  title: () => 'The board summons you', body: () => `Board confidence is at ${Math.round(g().board.conf)}%. The chairman wants a clear plan, or a scalp.`,
  opts: [
    { l: 'Promise a turnaround', h: 'Confidence ↑ now · big drop if it fails', f: () => { fx({ board: 10 }); F.G.board.promiseWeek = F.absWeek() + 8; F.G.flags.turnaround = F.myPos(); return 'You buy yourself eight weeks.'; } },
    { l: 'Sacrifice the head coach', h: 'Confidence ↑ · new coach needed', f: () => { const s = staff('coach'); if (!s) { fx({ board: -3 }); return 'There is no coach to blame.'; } F.G.staff.coach = null; F.G.cands.coach = F.genCands('coach'); fx({ board: 8 }); return `${s.name} pays the price. Appoint a successor from the Staff tab.`; } },
    { l: 'Hold a crisis press conference', h: 'Press and fans swing either way', f: () => { if (chance(0.5)) { fx({ press: 8, fans: 6, board: 5 }); return 'A commanding performance at the podium.'; } fx({ press: -6, board: -2 }); return 'The press conference goes badly.'; } }],
  auto: () => 0 });

E('derby', { from: 'mkt', dept: 'marketing', cd: 17, cond: () => week() > 2,
  setup: () => ({ club: pick(F.G.divs[g().club.tier].clubs.filter(x => x !== 0)), cost: M(1200) }), title: c => `Derby week against ${F.cname(c.club)}`, body: c => `The whole town is talking about it. ${N('mkt')} wants ${money(c.cost)} for a matchday spectacle; the police want extra stewards.`,
  opts: [
    { l: 'Go big: tifo, fireworks, the lot', h: c => `−${money(c.cost)} · fans ↑ · brand ↑`, f: c => { adj('cash', -c.cost); fx({ fans: 4, brand: 3 }); adj('morale', 3); return 'The atmosphere is electric.'; } },
    { l: 'Safety first, extra stewards', h: 'Small cost · press ↑', f: () => { adj('cash', -M(400)); fx({ press: 2 }); return 'A safe, well-run day.'; } }],
  auto: () => man('mkt', 'budget') > 50 ? 0 : 1 });

E('merger_grudge', { from: 'fans', dept: 'marketing', cd: 30, cond: () => !!F.G.flags.merger,
  title: () => 'Old village rivalries resurface', body: () => 'Supporters from one of the two founding villages say "their side" is ignored: the matchday programme, the club shop, even the team photo.',
  opts: [
    { l: 'Play at the old ground', h: () => `−${money(M(1500))} · fans ↑`, f: () => { adj('cash', -M(1500)); fx({ fans: 6 }); return 'A sold-out friendly at the old ground heals some wounds.'; } },
    { l: 'Ignore it', h: 'Fans ↓', f: () => { fx({ fans: -5 }); return 'The grumbling continues.'; } }],
  auto: () => 1 });

E('player_unsettled', { from: 'coach', dept: 'first team', cd: 10, cond: () => sq().some(p => !p.settle),
  setup: () => { const p = randP(p => !p.settle); return p ? { pid: p.id, name: p.name, reg: F.REGIONS[p.region].name } : null; },
  title: c => `${c.name} is struggling to settle`, body: c => `The new signing from ${c.reg} is homesick and playing poorly. The coach suggests support for him and his family.`,
  opts: [
    { l: 'Fund a relocation package', h: () => `−${money(M(800))} · likely to settle`, f: c => { adj('cash', -M(800)); const p = P(c.pid); if (p && chance(0.75)) { p.settle = true; p.morale = 70; return `${c.name} starts to feel at home.`; } return 'It helps a little.'; } },
    { l: 'He has to adapt himself', h: 'Free · may not work', f: c => { const p = P(c.pid); if (p && chance(0.3)) { p.settle = true; return `${c.name} toughs it out.`; } return 'No improvement.'; } }],
  auto: () => F.G.club.cash > M(5000) ? 0 : 1 });

E('owner_doubts', { from: 'board', dept: 'business', cd: 40, cond: () => dna().money === 'owner' && g().club.ownerOn && (pos() > 12 || g().board.conf < 40),
  title: () => 'The owner questions his weekly top-ups', body: () => 'With results disappointing, the owner wonders if he is "throwing good money after bad".',
  opts: [
    { l: 'Present a five-year plan', h: 'Chance he keeps funding', f: () => { if (chance(0.6)) { fx({ board: 4 }); return 'He is reassured, for now.'; } g().club.ownerOn = false; fx({ board: -4 }); return 'He stops the weekly injections.'; } },
    { l: 'Offer to cut costs', h: 'Funding kept · budgets cut', f: () => { for (const r of ['scout', 'acad', 'mkt']) F.G.mand[r].budget = Math.max(10, F.G.mand[r].budget - 20); return 'Budgets are trimmed across the board.'; } }],
  auto: () => 1 });

E('coach_staff_request', { from: 'coach', dept: 'first team', cd: 20,
  setup: () => ({ cost: M(250) }), title: () => `${N('coach')} wants an analyst`, body: c => `"I need a video analyst. ${money(c.cost)} a week and we will see things nobody else sees."`,
  opts: [
    { l: 'Hire the analyst', h: c => `+${money(c.cost)}/wk costs · coach ↑ · tactics ↑`, f: c => { g().club.rent += c.cost; boost('coach', 4, 10); rel('coach', 5); return 'The analyst starts on Monday.'; } },
    { l: 'Refuse', h: 'Coach ↓', f: () => { rel('coach', -4); return 'He will have to make do.'; } }],
  auto: () => man('fin', 'invest') > 50 ? 0 : 1 });

E('loan_youngster', { from: 'dof', dept: 'sporting', cd: 15, cond: () => F.G.week <= 4 || (F.G.week >= 17 && F.G.week <= 19),
  setup: () => { const p = F.genPlayer({ age: ri(18, 20), ca: F.tierAvg(g().club.tier) + 0.6, pos: pick(['CM', 'W', 'ST', 'CB']) }); p.fee = 0; p.wage = Math.round(F.wageFor(p.ca) * 0.3 / 5) * 5; p.loan = true; return { player: p, club: pick(F.G.divs[1].clubs) }; },
  title: c => `${F.cname(c.club)} offer us a loan player`, body: c => `Top-flight ${F.cname(c.club)} will loan us ${c.player.name} (${c.player.age}, ${F.POS_L[c.player.pos]}, ${F.stars(c.player.ca)}★) and pay most of his wages, on condition that he plays regularly.`,
  opts: [
    { l: 'Accept the loan', h: 'Cheap quality · must play him', f: c => { F.sign(c.player); c.player.contract = 1; F.later('loan_minutes', { pid: c.player.id, name: c.player.name, club: c.club }, 6, 9); return `${c.player.name} arrives on loan.`; } },
    { l: 'Decline', h: 'Minutes stay with our own players', f: () => { rel('acad', 2); return 'Declined.'; } }],
  auto: () => man('dof', 'youth') > 70 && man('coach', 'youthMins') > 70 ? 1 : 0 });


/* ===================== FOLLOW-UPS (delayed consequences) ===================== */
const ratingOf = p => p && p.st.apps ? p.st.rat / p.st.apps : null;
E('exception_review', { forced: 1, from: 'dof', dept: 'sporting', cd: 2,
  title: c => `Review: was ${c.name} worth breaking the rules for?`,
  body: c => { const p = P(c.pid); if (!p || !sq().includes(p)) return `${c.name} has already left the club. ${money(c.fee)} for very little.`; const r = ratingOf(p), sa = F.squadAvgRat(); return r == null ? `${c.name} has barely played since arriving for ${money(c.fee)}. The numbers say nothing yet, which says something.` : `Since you approved the exception: ${p.st.apps} games, average rating ${r.toFixed(2)} against a squad average of ${sa.toFixed(2)}, ${p.st.g} goals, ${(p.st.xg + p.st.xa).toFixed(1)} xG plus xA. ${r >= sa ? 'The gamble is paying off.' : 'So far, it looks like a mistake.'}`; },
  opts: [
    { l: 'Credit the DoF publicly', h: 'DoF ↑ · board reacts to the numbers', f: c => { const p = P(c.pid), r = ratingOf(p); rel('dof', 6); if (r != null && r >= F.squadAvgRat()) { fx({ board: 3, press: 2 }); return 'The board nods. Good call, well made.'; } fx({ board: -3 }); return 'The board wonders what exactly you are crediting.'; } },
    { l: 'Tighten his mandate', h: 'Max fee one step lower · DoF ↓', f: () => { const o = ['0', '25', '50', '100'], i = Math.max(0, o.indexOf(man('dof', 'maxFee')) - 1); F.G.mand.dof.maxFee = o[i]; rel('dof', -5); return `Max fee per signing cut to ${o[i] === '0' ? 'free agents only' : o[i] + '% of budget'}.`; } },
    { l: 'Let it go', h: 'No change', f: () => 'Filed and forgotten.' }],
  auto: () => 2 });
E('coach_authority', { forced: 1, from: 'coach', dept: 'first team', cd: 4,
  title: () => `Coach: "They don't listen anymore"`, body: () => `Since you sided with the players, ${N('coach')} says training has turned into a negotiation. He wants a public show of support, or he will consider his position.`,
  opts: [
    { l: 'Back him publicly now', h: 'Coach ↑↑ · squad morale ↓', f: () => { rel('coach', 12); adj('morale', -4); return 'Your statement restores his authority, at a cost.'; } },
    { l: 'Let him win them back', h: 'Coach boosted but cooler', f: () => { boost('coach', 4); rel('coach', -6); return 'He leaves determined, and a little colder.'; } },
    { l: 'Accept that it is over', h: 'Coach leaves · compensation', f: () => { const s = staff('coach'); if (!s) return 'He is already gone.'; adj('cash', -Math.round(s.wage * 10)); F.G.staff.coach = null; F.G.cands.coach = F.genCands('coach'); return `${s.name} departs by mutual consent. Appoint a successor from the Staff tab.`; } }],
  auto: () => 1 });
E('transfer_request', { forced: 1, from: 'dof', dept: 'sporting', cd: 4,
  title: c => `${c.name} hands in a transfer request`, body: c => { const p = P(c.pid); return p && sq().includes(p) ? `Still angry about the refused raise, ${c.name} wants out. Valuation ${money(p.value)}. His morale is ${Math.round(p.morale)}.` : 'He has already left.'; },
  opts: [
    { l: 'Sell him', h: c => { const p = P(c.pid); return p ? `About ${money(Math.round(p.value * 0.9))}` : ''; }, f: c => { const p = P(c.pid); if (!p || !sq().includes(p)) return 'Already gone.'; const fee = Math.round(p.value * 0.9 / 100) * 100; F.sellPlayer(p, fee, `${p.name} gets his move, for ${money(fee)}.`); return `Sold for ${money(fee)}.`; } },
    { l: 'Refuse: he is under contract', h: 'Player sulks · squad morale ↓', f: c => { const p = P(c.pid); if (p) p.morale = clamp(p.morale - 20, 0, 100); adj('morale', -2); return 'The request is rejected. The atmosphere sours.'; } },
    { l: 'Give him the raise after all', h: 'Wage ↑ · you look weak', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.wage = Math.round(F.wageFor(p.ca) * 1.3 / 5) * 5; p.morale = 70; fx({ press: -2 }); return 'He withdraws the request. Others will have noticed.'; } }],
  auto: () => man('dof', 'sell') > 50 ? 0 : 1 });
E('agent_scandal', { forced: 1, from: 'press', dept: 'sporting', cd: 4,
  title: () => 'The agent emails have leaked', body: () => `The Gazette has the correspondence between ${N('dof')} and the agent you chose to hear out. The phrase "a little arrangement" is on the front page.`,
  opts: [
    { l: 'Dismiss the Director of Football', h: 'Press ↑ · vacancy', f: () => { const s = staff('dof'); F.G.staff.dof = null; F.G.cands.dof = F.genCands('dof'); fx({ press: 4, board: -4 }); return s ? `${s.name} is dismissed. Appoint a successor from the Staff tab.` : 'The post was already vacant.'; } },
    { l: 'Full transparency', h: 'Painful now, cleaner later', f: () => { fx({ press: -4, board: -6, fans: -3 }); F.G.club.drift = Math.max(0, F.G.club.drift - 5); return 'You publish everything. Bruising, but the story dies quickly.'; } },
    { l: 'Deny everything', h: 'Gamble', f: () => { if (chance(0.4)) return 'The story fizzles out.'; fx({ press: -15, board: -10, fans: -6, drift: 10 }); return 'More emails surface. A full-blown scandal.'; } }],
  auto: () => 1, vacant: 1 });
E('crypto_collapse', { forced: 1, from: 'press', dept: 'commercial', cd: 4,
  title: () => 'MoonVault collapses', body: c => `Our "Official Digital Asset Partner" has gone under, taking supporters' savings with it. Journalists ask whether we will return the ${money(c.cash)}.`,
  opts: [
    { l: 'Donate the fee to affected fans', h: c => `−${money(c.cash)} · press and fans ↑`, f: c => { adj('cash', -c.cash); fx({ press: 6, fans: 5 }); return 'A costly but respected gesture.'; } },
    { l: 'Say nothing', h: 'Press ↓↓ · sponsors ↓', f: () => { fx({ press: -10, fans: -6, spons: -8, board: -4 }); return "The club's name is in every story."; } }],
  auto: () => 1, vacant: 1 });
E('fan_boycott', { forced: 1, from: 'fans', dept: 'commercial', cd: 4,
  title: () => 'Supporters boycott the QuickOdds shirt', body: () => 'Fans are wearing old shirts and turning their backs at kick-off. The trust says the boycott will continue until the betting deal goes.',
  opts: [
    { l: 'End the betting deal', h: 'Lose the income · fans ↑', f: () => { g().club.deals = g().club.deals.filter(d => d.name !== 'QuickOdds'); fx({ fans: 6, press: 3 }); return 'QuickOdds are gone. The boycott ends.'; } },
    { l: 'Ride it out', h: 'Fans ↓ · fewer shirts sold', f: () => { fx({ fans: -7, brand: -3 }); return 'The boycott drags on.'; } }],
  auto: () => 1 });
E('doc_episode', { forced: 1, from: 'mkt', dept: 'marketing', cd: 4,
  title: () => 'Episode three is a problem', body: () => `The documentary shows ${N('coach')}'s furious half-time rant, swearing at named players. It is the most-watched episode yet.`,
  opts: [
    { l: 'Back the coach', h: 'Coach ↑ · squad morale ↓', f: () => { rel('coach', 5); adj('morale', -5); return 'The players feel exposed.'; } },
    { l: 'Apologise to the players', h: 'Morale ↑ · coach ↓', f: () => { adj('morale', 3); rel('coach', -8); return 'The players appreciate it. The coach does not.'; } },
    { l: 'Pull the rest of the series', h: c => `Repay ${money(Math.round(c.cash / 2))} · brand ↓`, f: c => { adj('cash', -Math.round(c.cash / 2)); fx({ brand: -4 }); rel('coach', 3); return 'The remaining episodes are shelved.'; } }],
  auto: () => 0 });
E('player_ego', { forced: 1, from: 'coach', dept: 'first team', cd: 4,
  title: c => `Fame has gone to ${c.name}'s head`, body: c => `Since the viral campaign, ${c.name} turns up late, films content in the dressing room and wants a new contract "that reflects my profile".`,
  opts: [
    { l: 'Give him a better deal', h: 'Wage ↑ · squad resentment', f: c => { const p = P(c.pid); if (!p) return 'He has left.'; p.wage = Math.round(p.wage * 1.5 / 5) * 5; adj('morale', -3); return 'He signs, beaming. The rest of the squad do the maths.'; } },
    { l: 'Let the coach handle him', h: 'Coach ↑ · player morale ↓', f: c => { const p = P(c.pid); if (p) p.morale = clamp(p.morale - 15, 0, 100); rel('coach', 4); return 'Dropped for a week. Message received.'; } }],
  auto: () => 1 });
E('nephew', { forced: 1, from: 'board', dept: 'sporting', cd: 4,
  title: c => `Why is ${c.name} not playing?`, body: c => { const p = P(c.pid); return p && sq().includes(p) ? `${c.name} has played ${p.st.mins} minutes. His uncle wants that to change, and he has a vote on your future.` : 'He has already left.'; },
  opts: [
    { l: 'Ask the coach to play him', h: 'Board ↑ · coach ↓↓', f: () => { rel('coach', -9); fx({ board: 4 }); F.G.mand.coach.youthMins = clamp(F.G.mand.coach.youthMins + 10, 0, 100); return 'The coach complies, furious.'; } },
    { l: 'Release him', h: 'Board ↓ · wage saved', f: c => { const p = P(c.pid); if (p && sq().includes(p)) F.sellPlayer(p, 0, `${p.name} is released.`); fx({ board: -6 }); rel('dof', 4); return 'You have made an enemy on the board.'; } },
    { l: 'Defend the coach\'s decision', h: 'Board ↓ a little', f: () => { fx({ board: -3 }); rel('coach', 4); return 'The board member backs off, for now.'; } }],
  auto: () => 0 });
E('investor_demands', { forced: 1, from: 'board', dept: 'business', cd: 4,
  title: () => 'The investors want a return', body: () => 'Your new minority shareholders demand higher ticket prices and a harder commercial push. "This is a business."',
  opts: [
    { l: 'Agree', h: 'Ticket and merch sliders +15 · fans ↓ · board ↑', f: () => { const m = F.G.mand.com; m.tickets = clamp(m.tickets + 15, 0, 100); m.merch = clamp(m.merch + 15, 0, 100); fx({ fans: -5, board: 5 }); return 'Prices go up.'; } },
    { l: 'Compromise', h: 'Smaller rises', f: () => { const m = F.G.mand.com; m.tickets = clamp(m.tickets + 7, 0, 100); fx({ fans: -2, board: 1 }); return 'A modest increase.'; } },
    { l: 'Refuse', h: 'Board ↓↓', f: () => { fx({ board: -7, fans: 2 }); return 'The investors are not used to hearing no.'; } }],
  auto: () => 1 });
E('loan_minutes', { forced: 1, from: 'dof', dept: 'sporting', cd: 4,
  title: c => `${F.cname(c.club)} check on ${c.name}`, body: c => { const p = P(c.pid); if (!p || !sq().includes(p)) return 'He has already gone back.'; const share = p.st.mins / Math.max(1, F.G.ss.lg * 90); return `${c.name} has played ${Math.round(share * 100)}% of available league minutes (rating ${ratingOf(p) ? ratingOf(p).toFixed(2) : '–'}). ${share < 0.5 ? 'That is not what was agreed. They threaten to recall him.' : 'They are happy and would extend the loan.'}`; },
  opts: [
    { l: 'Promise him more minutes', h: 'Coach youth minutes +15 · coach ↓', f: () => { F.G.mand.coach.youthMins = clamp(F.G.mand.coach.youthMins + 15, 0, 100); rel('coach', -3); return 'The coach is told. He is not pleased.'; } },
    { l: 'Let them recall him', h: 'Player leaves', f: c => { const p = P(c.pid); if (p && sq().includes(p)) F.sellPlayer(p, 0, `${p.name} returns to ${F.cname(c.club)}.`); return 'He goes back.'; } },
    { l: 'Keep things as they are', h: 'Risky if minutes are low', f: c => { const p = P(c.pid); if (!p || !sq().includes(p)) return 'Gone.'; if (p.st.mins / Math.max(1, F.G.ss.lg * 90) < 0.5 && chance(0.6)) { F.sellPlayer(p, 0, `${F.cname(c.club)} recall ${p.name}.`); return 'They recall him.'; } p.contract = Math.max(p.contract, 1); return 'The loan continues.'; } }],
  auto: () => 2 });
})(FO);
