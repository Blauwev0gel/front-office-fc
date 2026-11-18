/* The Front Office · desk 2.0 configuration, proposals and storylines (1.2) */
(function (F) {
'use strict';
const g = () => F.G, EV = F.EV;
const { ri, pick, chance, clamp, money, M, staff, man, staffName, gauss } = F;
const P = id => g().squad.find(p => p.id === id) || g().academy.find(p => p.id === id);
const sq = () => g().squad, dna = () => g().club.dna, N = r => staffName(r);
const fx = o => { const G = g(); for (const k in o) { const n = o[k]; if (k === 'board') G.board.conf = clamp(G.board.conf + n, 0, 100); else if (k === 'brand') G.club.brand = clamp(G.club.brand + n, 0, 100); else if (k === 'cash') G.club.cash += n; else G.st[k] = clamp(G.st[k] + n, 0, 100); } };
const avgW = () => F.playerWages() / Math.max(1, sq().length);
const wageLim = () => man('dof', 'maxWage') === '999' ? Infinity : avgW() * (+man('dof', 'maxWage')) / 100;
const R = k => F.REGIONS[k].name;

/* ---------- 1. what reaches the desk, and what staff handle themselves ---------- */
['free_veteran', 'deadline_day', 'injury_crisis', 'training_complaint', 'captain', 'parents', 'school_partner', 'youth_coach_leaving', 'local_deal', 'crypto', 'kit_deal', 'tour', 'sponsor_morals', 'viral', 'social_gaffe', 'community_day', 'rival_banter', 'tax_bill', 'pitch', 'loan_offer', 'derby', 'player_unsettled', 'loan_youngster', 'dressing_room']
  .forEach(id => { if (EV[id]) EV[id].mode = 'auto'; });
['data_vs_eye', 'acad_facility', 'hospitality', 'stadium_expansion', 'council_land', 'energy', 'coach_staff_request'].forEach(id => { if (EV[id]) EV[id].mode = 'off'; });

// tighter, state-driven conditions for escalations
EV.raise_demand.setup = () => { const lim = wageLim(); const p = pick(sq().filter(p => p.ca > F.tierAvg(g().club.tier) && p.wage < F.wageFor(p.ca) * 1.05 && F.wageFor(p.ca) * 1.3 > lim)); return p ? { pid: p.id, name: p.name, ask: Math.round(F.wageFor(p.ca) * 1.3 / 5) * 5 } : null; };
EV.raise_demand.cond = () => g().week > 3 && sq().some(p => p.ca > F.tierAvg(g().club.tier) && F.wageFor(p.ca) * 1.3 > wageLim());
EV.coach_dof_clash.cond = () => staff('coach') && staff('dof') && g().ss.signings > 0 && (Math.abs(man('coach', 'youthMins') - man('dof', 'youth')) > 35 || (staff('coach').rel + staff('dof').rel) / 2 < 45);
EV.youth_debut.cond = () => staff('coach') && g().academy.some(p => p.age >= 16) && man('acad', 'pace') - man('coach', 'youthMins') > 25;
EV.bet_sponsor.cond = () => man('com', 'betting') === 'ok' && (dna().identity !== 'brand' || man('com', 'selectivity') > 55);
EV.naming_rights.cond = () => g().week > 6 && !g().club.deals.some(d => d.type === 'stadium');
EV.com_mkt_clash.cond = () => staff('com') && staff('mkt') && ((man('com', 'tickets') > 60 && man('mkt', 'reach') < 45) || (man('com', 'merch') > 65 && man('mkt', 'tone') < 30) || (staff('com').rel + staff('mkt').rel) / 2 < 45);
EV.merger_grudge.cond = () => !!g().flags.merger && g().st.fans < 65;
EV.press_interview.cond = () => g().week > 4;
EV.staff_raise.cond = () => F.ROLES.some(r => staff(r.id) && staff(r.id).perf > 62 && staff(r.id).p.amb > 10);

const WHY = {
  dof_rule: 'Your transfer rules block this signing. Only you can make an exception.',
  bid_star: 'Key players, and players you have promised to keep, are never sold without you.',
  raise_demand: () => `His demand is above the wage limit you set for the Director of Football (${money(Math.round(wageLim()))}/wk).`,
  coach_dof_clash: () => Math.abs(man('coach', 'youthMins') - man('dof', 'youth')) > 35 ? `Your mandates contradict each other: the coach is told ${man('coach', 'youthMins') > 50 ? 'to blood youngsters' : 'to trust veterans'}, the DoF ${man('dof', 'youth') > 50 ? 'to recruit youth' : 'to recruit experience'}.` : 'Their working relationship has broken down.',
  scout_gem: () => `The trip falls outside the regions in his mandate (${R(man('scout', 'reg1'))} and ${R(man('scout', 'reg2'))}).`,
  agent_fee: 'Integrity questions always go to the CEO.',
  losing_streak: 'The board wants to hear it from you.',
  coach_poached: 'Contracts of senior staff are yours to decide.',
  youth_debut: 'Your mandates clash: the academy is told to fast-track, the coach to trust experience.',
  style_drift: 'Your mandate tells the coach to play the club style. Only you can change that.',
  wonderkid: 'A sale like this touches the academy identity of the club.',
  bet_sponsor: () => `Commercial is allowed to take betting money, but it clashes with ${dna().identity === 'ideals' ? 'the principles in your club DNA' : dna().identity === 'community' ? 'your community identity' : 'the values-first line in the Commercial mandate'}.`,
  naming_rights: 'The stadium name is part of the club identity.',
  ticket_protest: () => `Supporters address the CEO directly. Your Commercial mandate sets prices at ${man('com', 'tickets')} on the premium scale.`,
  documentary: 'Access to the dressing room and the boardroom is your call.',
  rebrand: 'The crest is part of the club DNA.',
  trust_seat: 'Governance questions are for the CEO.',
  press_interview: 'The press wants the CEO, not a spokesperson.',
  investor: 'Changes in ownership need the CEO.',
  wage_cap: () => `Player wages have crossed the ${man('fin', 'wageCap')}% cap in your Finance mandate.`,
  cash_crisis: 'The club cannot pay its bills. That is always the CEO\'s problem.',
  staff_raise: 'Staff pay is yours to manage.', staff_leak: 'Trust within the leadership team is yours to manage.', staff_quit: 'Senior staff resignations land with you.', staff_poach: 'Contracts of senior staff are yours to decide.',
  com_mkt_clash: 'Their mandates pull against each other. Only you can set the priority.',
  board_pet: 'A board member is leaning on you personally.',
  fan_protest: 'Supporter mood has dropped below 35.',
  board_warning: 'Board confidence has fallen below 22%.',
  merger_grudge: 'Both founding communities look to the CEO.',
  owner_doubts: 'The owner talks to you and nobody else.',
};
for (const id in WHY) if (EV[id]) EV[id].why = WHY[id];

const SECOND = {
  dof_rule: { r: 'scout', t: c => { const est = c.player.ca + gauss() * 0.45; return `"I have him at ${F.stars(est)}★ now. ${est < c.player.pCA - 0.5 ? 'The DoF is seeing what he wants to see.' : est > c.player.pCA + 0.5 ? 'If anything, the DoF undersells him.' : 'The DoF\'s read is fair.'}"`; } },
  bid_star: { r: 'coach', t: c => { const p = P(c.pid); if (!p) return 'He has gone already.'; const rank = sq().slice().sort((a, b) => b.ca - a.ca).indexOf(p) + 1; return `"He is our ${F.ord(rank)} best player. ${rank <= 2 ? 'Selling him now costs us points, no question.' : 'We would miss him, but we can cope.'}"`; } },
  raise_demand: { r: 'fin', t: c => { const pct = Math.round((F.playerWages() + c.ask - (P(c.pid) ? P(c.pid).wage : 0)) / Math.max(1, F.revenueAvg()) * 100); return `"Paying ${money(c.ask)} puts player wages at ${pct}% of revenue, against your cap of ${man('fin', 'wageCap')}%."`; } },
  wonderkid: { r: 'acad', t: c => { const p = P(c.pid); if (!p) return 'He has gone.'; return p.pa - p.ca > 4 ? '"He is the real thing. Sell him now and we will regret it for a decade."' : '"Between us: he has developed early. The ceiling may be lower than the hype."'; } },
  coach_dof_clash: { r: 'scout', t: () => { const sa = F.squadAvgRat(), sig = (g().signLog || []).filter(x => x.season === g().season).map(x => P(x.pid)).filter(p => p && p.st.apps >= 3); const ar = sig.length ? sig.reduce((a, p) => a + p.st.rat / p.st.apps, 0) / sig.length : null; return ar == null ? '"Too early to judge the new signings."' : `"The new signings average ${ar.toFixed(2)} against ${sa.toFixed(2)} for the squad. ${ar >= sa ? 'The coach has a weak case.' : 'The coach has a point.'}"`; } },
  bet_sponsor: { r: 'mkt', t: () => dna().identity === 'ideals' ? '"Our supporters chose us because we are different. This would hurt us for years."' : '"Some noise for a few weeks, then most fans will forget."' },
  star_unrest: { r: 'coach', t: c => { const p = P(c.pid); if (!p) return 'He has gone.'; return p.pers.loy > 12 ? '"Deep down he loves this club. Show him a plan and he stays."' : '"He has one foot out of the door. A raise only delays it."'; } },
  sponsor_renewal: { r: 'fin', t: c => `"That deal is ${Math.round(c.wk / Math.max(1, F.revenueAvg()) * 100)}% of our weekly revenue. We cannot afford to lose it without a replacement."` },
};
for (const id in SECOND) if (EV[id]) EV[id].second = SECOND[id];

/* ---------- 2. storylines ---------- */
const E = F.defineEvent;
E('star_unrest', { from: 'dof', dept: 'sporting', cd: 40, why: 'A key player wants to leave. How that ends is your call.',
  cond: () => { const b = F.bestPlayer(); return b && g().week > 6 && b.pers.amb > 13 && F.stars(b.ca) >= 3.5 && !b.unrest; },
  setup: () => { const b = F.bestPlayer(); b.unrest = g().season; return { pid: b.id, name: b.name }; },
  title: c => `${c.name} wants a bigger club`, body: c => { const p = P(c.pid); return p ? `Our best player (${F.stars(p.ca)}★, ${p.st.g} goals this season) feels he has outgrown the club. ${p.contract <= 1 ? 'His contract runs out this summer.' : `He has ${p.contract} years left.`} Valuation ${money(p.value)}.` : 'He has gone.'; },
  opts: [
    { l: 'Offer a new contract', h: 'Wage ×1.5 · he may still go', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.wage = Math.round(p.wage * 1.5 / 5) * 5; p.contract = 3; if (p.pers.loy > 10 || chance(0.4)) { p.morale = 75; return `${c.name} signs. "The project convinced me."`; } F.later('transfer_request', { pid: p.id, name: p.name }, 4, 8); return `He signs, but his agent is still talking to other clubs.`; } },
    { l: 'Tell him he stays', h: 'Free · risk of a transfer request', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; p.morale = clamp(p.morale - 15, 0, 100); F.later('transfer_request', { pid: p.id, name: p.name }, 3, 6); return 'He is not happy.'; } },
    { l: 'Let the DoF find a buyer', h: 'Expect a big bid soon', f: c => { const p = P(c.pid); if (!p) return 'Gone.'; F.later('bid_star', { pid: p.id, fee: Math.round(p.value * 1.3 / 100) * 100, club: pick(g().divs[Math.max(1, g().club.tier - 2)].clubs.filter(x => x !== 0)) }, 1, 3); return 'The DoF lets it be known that offers will be considered.'; } }],
  auto: () => 1 });
E('sponsor_renewal', { from: 'com', dept: 'commercial', cd: 30, why: 'Your biggest commercial deal is up for renewal.',
  cond: () => g().club.deals.some(d => d.type === 'shirt' && d.weeks <= 6 && !d.renewing),
  setup: () => { const d = g().club.deals.filter(d => d.type === 'shirt' && d.weeks <= 6).sort((a, b) => b.wk - a.wk)[0]; d.renewing = true; return { name: d.name, wk: d.wk }; },
  title: c => `${c.name} want to renew, for less`, body: c => `Our shirt deal (${money(c.wk)}/wk) expires within weeks. ${c.name} offer to renew at ${money(Math.round(c.wk * 0.85))}/wk. ${N('com')} thinks he can get more, or find someone better.`,
  opts: [
    { l: 'Accept the lower renewal', h: c => `${money(Math.round(c.wk * 0.85))}/wk for two seasons`, f: c => { const d = g().club.deals.find(x => x.name === c.name); if (!d) return 'The deal has already lapsed.'; d.wk = Math.round(d.wk * 0.85); d.weeks += 68; d.renewing = false; return 'Renewed. Security over upside.'; } },
    { l: 'Push for a raise', h: 'Commercial negotiates · could lose the deal', f: c => { const d = g().club.deals.find(x => x.name === c.name); if (!d) return 'Lapsed.'; d.renewing = false; if (chance(0.3 + F.eff('com', 0) / 40)) { d.wk = Math.round(d.wk * 1.15); d.weeks += 68; return `${N('com')} lands a better deal: ${money(d.wk)}/wk.`; } g().club.deals = g().club.deals.filter(x => x !== d); return `${c.name} walk away. We need a new shirt sponsor.`; } },
    { l: 'Go to market', h: 'Let it lapse · new sponsor search', f: c => { const d = g().club.deals.find(x => x.name === c.name); if (d) d.weeks = Math.min(d.weeks, 1); return 'The search for a new partner starts at the next management meeting.'; } }],
  auto: () => man('com', 'selectivity') > 60 ? 2 : 0 });
const stand = () => (g().projects || []).find(p => p.id === 'new_stand');
E('stand_objection', { forced: 1, from: 'fin', dept: 'business', cd: 4, why: 'A follow-up to the stand you approved.',
  title: () => 'Residents object to the new stand', body: () => 'A residents\' group says the stand will block light and bring traffic. The council could delay planning permission.',
  opts: [
    { l: 'Compensate the residents', h: () => `−${money(M(2000))} · smoother process`, f: () => { const s = stand(); fx({ cash: -M(2000), press: 2 }); if (s) s.p = clamp(s.p + 0.08, 0, 0.97); F.later('stand_delay', {}, 4, 7); return 'Double glazing for the street. Objections withdrawn.'; } },
    { l: 'Fight it at the council', h: 'Win and save money, or lose months', f: () => { const s = stand(); if (chance(0.5)) { F.later('stand_delay', {}, 4, 7); return 'The council backs the club.'; } if (s) s.due += 6; fx({ press: -3 }); return 'The council sides with the residents. Six weeks lost.'; } },
    { l: 'Redesign it smaller', h: 'Fewer seats · faster', f: () => { const s = stand(); if (s) { s.ctx.seats = Math.round(s.ctx.seats * 0.7 / 100) * 100; s.due -= 2; s.p = clamp(s.p + 0.1, 0, 0.97); } return 'A smaller stand, waved through.'; } }],
  auto: () => 0 });
E('stand_delay', { forced: 1, from: 'fin', dept: 'business', cd: 4, why: 'A follow-up to the stand you approved.',
  title: () => 'The builders are behind schedule', body: () => 'Steel deliveries are late. The contractor wants overtime money to stay on schedule.',
  opts: [
    { l: 'Pay for overtime', h: () => `−${money(M(3000))}`, f: () => { fx({ cash: -M(3000) }); return 'Work continues around the clock.'; } },
    { l: 'Accept the delay', h: 'Five weeks later', f: () => { const s = stand(); if (s) s.due += 5; return 'The opening slips.'; } },
    { l: 'Switch to a cheaper contractor', h: 'Saves money · more risk', f: () => { const s = stand(); fx({ cash: M(1500) }); if (s) s.p = clamp(s.p - 0.12, 0.05, 0.97); return 'A new contractor takes over. Fingers crossed.'; } }],
  auto: () => 1 });

/* ---------- 3. proposals for the management meeting ---------- */
const D = F.defineProposal, perks = () => g().club.perks;
const regionPick = () => { const c = g().club, foc = [man('scout', 'reg1'), man('scout', 'reg2')]; return Object.keys(F.REGIONS).filter(k => !foc.includes(k)).sort((a, b) => c.net[a] - c.net[b])[0]; };
D('scout_office', { owner: 'scout', dur: 6, repeat: 1, cond: () => !!staff('scout') && (g().club.offices || 0) < 3, cost: () => M(7000), wk: () => M(120), p: () => 0.75, second: 'dof',
  setup: () => ({ reg: regionPick() }), title: c => `Open a scouting office in ${R(c.reg)}`,
  pitch: c => `"Two local scouts, a permanent base. Our network there is ${Math.round(g().club.net[c.reg])} out of 100. Within months we would see players nobody else sees, at prices nobody else pays."`,
  benefit: c => `Network in ${R(c.reg)} up sharply; it becomes the second focus region.`,
  done: (c, ok) => { const n = g().club.net; if (ok) { n[c.reg] = clamp(n[c.reg] + 35 * c.scale, 0, 100); g().mand.scout.reg2 = c.reg; g().club.offices = (g().club.offices || 0) + 1; return `The ${R(c.reg)} office is open and already sending reports.`; } n[c.reg] = clamp(n[c.reg] + 8, 0, 100); return 'Local contacts never materialised. The office is a desk and a phone.'; } });
D('data_dept', { owner: () => staff('dof') ? 'dof' : 'scout', dur: 8, cost: () => M(6000), wk: () => M(180), p: () => 0.7, second: 'scout', cond: () => !perks().data,
  title: 'Build a data department', pitch: '"Two analysts and a proper database. We stop guessing about players and start knowing."', benefit: 'Scouting estimates become far more accurate. Fewer expensive mistakes.',
  done: (c, ok) => { if (ok) { perks().data = true; return 'The analysts are embedded with the scouts. Estimates are sharper.'; } return 'The analysts and the scouts never learn to work together. Money spent, little gained.'; } });
D('new_stand', { owner: 'fin', dur: 14, repeat: 1, cost: c => c.seats * 12, p: () => 0.65, second: 'com', w: () => 3,
  cond: () => F.attendance() >= g().club.cap * 0.85 || (F.CAPREQ[g().club.tier - 1] && g().club.cap < F.CAPREQ[g().club.tier - 1]),
  setup: () => ({ seats: Math.max(1000, Math.round(g().club.cap * 0.4 / 100) * 100) }), onStart: () => F.later('stand_objection', {}, 3, 5),
  title: c => `Build a new stand: ${c.seats.toLocaleString('en-GB')} seats`, pitch: c => `"We sell out. Every week we turn people away. ${F.CAPREQ[g().club.tier - 1] ? `And the ${F.TIERS[g().club.tier - 1]} requires ${F.CAPREQ[g().club.tier - 1].toLocaleString('en-GB')} seats.` : ''}"`,
  benefit: c => `Capacity +${c.seats.toLocaleString('en-GB')}. More ticket income, and it covers licensing for promotion.`,
  done: (c, ok) => { const s = Math.round(c.seats * c.scale); if (ok) { g().club.cap += s; return `The new stand opens: capacity now ${g().club.cap.toLocaleString('en-GB')}.`; } g().club.cap += Math.round(s / 2); return 'Overruns and a structural problem: only half the stand opens.'; } });
D('youth_fac', { owner: 'acad', dur: 8, repeat: 1, cost: () => M(6000 + g().club.fac.youth * 2500), p: () => 0.8, cond: () => g().club.fac.youth < 10,
  title: 'Upgrade the academy facilities', pitch: () => `"New pitches and a classroom block. We are at level ${g().club.fac.youth}. Better facilities attract better kids."`, benefit: 'Academy level +1: better intakes, faster development.',
  done: (c, ok) => { if (ok) { g().club.fac.youth++; return `Academy facilities now level ${g().club.fac.youth}.`; } return 'Drainage problems ruin the new pitches. Back to square one.'; } });
D('train_ground', { owner: 'coach', dur: 12, repeat: 1, cost: () => M(10000 + g().club.fac.train * 2000), p: () => 0.75, second: 'fin', cond: () => false, /* B58: replaced by the training-base trajectory (projects.js) */
  title: 'Build a proper training ground', pitch: () => `"We train on a council pitch at level ${g().club.fac.train}. Give me a real base and I will give you better players."`, benefit: 'Training facilities +2: every player develops faster.',
  done: (c, ok) => { const add = Math.max(1, Math.round(2 * c.scale)); if (ok) { g().club.fac.train = Math.min(10, g().club.fac.train + add); return `Training ground now level ${g().club.fac.train}.`; } g().club.fac.train = Math.min(10, g().club.fac.train + 1); return 'Planning trouble: only half the complex is built.'; } });
D('sports_sci', { owner: 'coach', dur: 6, cost: () => M(4000), wk: () => M(200), p: () => 0.8, cond: () => !perks().sci,
  title: 'Create a sports science unit', pitch: '"Load monitoring, recovery, nutrition. Our injury record is costing us points."', benefit: 'Injuries drop by about a third, permanently.',
  done: (c, ok) => { if (ok) { perks().sci = true; return 'The sports science unit is up and running.'; } return 'The specialists we hired leave within weeks.'; } });
D('analyst', { owner: 'coach', dur: 4, cost: () => M(1500), wk: () => M(250), p: () => 0.75, cond: () => !perks().analyst,
  title: 'Hire a video analyst', pitch: '"Opposition reports, set pieces, our own patterns. Small margins win leagues."', benefit: 'A permanent tactical edge on the pitch.',
  done: (c, ok) => { if (ok) { perks().analyst = true; return 'The analyst\'s set-piece work already shows.'; } return 'The analyst and the coach clash. He leaves.'; } });
D('hospitality', { owner: 'com', dur: 10, cost: () => M(8000), p: () => 0.7, second: 'fin', cond: () => !perks().hosp,
  title: 'Build hospitality boxes', pitch: () => `"Local businesses want somewhere to bring clients. We have nothing to sell them."`, benefit: () => `About ${money(M(380))}/wk in extra income. Some supporters lose their seats.`,
  done: (c, ok) => { perks().hosp = true; g().club.cap = Math.max(1500, g().club.cap - 200); const wk = Math.round(M(380) * c.scale * (ok ? 1 : 0.4)); g().club.deals.push({ name: 'Hospitality boxes', type: 'hosp', wk, weeks: 400 }); if (dna().identity === 'community') fx({ fans: -3 }); return ok ? `The boxes sell out: ${money(wk)}/wk.` : `Demand is weak: ${money(wk)}/wk.`; } });
D('sponsor_drive', { owner: 'com', dur: 6, repeat: 1, cost: () => M(1500), p: () => 0.45 + F.eff('com', 1) / 50, cond: () => !g().club.deals.some(d => d.type === 'shirt' && d.weeks > 10), w: () => 3,
  title: 'Run a search for a new shirt sponsor', pitch: '"An agency, a pitch deck, a list of fifty companies. I will find us a proper partner."', benefit: () => `A shirt deal around ${money(M(1800))}/wk for two seasons, if it works.`,
  done: (c, ok) => { const n = pick(['Northgate Logistics', 'Vale Energy', 'Arden Bank', 'Crestline Motors', 'Bluewater Foods']); if (ok) { const wk = Math.round(M(ri(1400, 2200)) * (0.7 + c.scale * 0.3)); g().club.deals.push({ name: n, type: 'shirt', wk, weeks: 68 }); return `${n} sign as shirt sponsor: ${money(wk)}/wk.`; } const wk = M(500); g().club.deals.push({ name: 'Local consortium', type: 'shirt', wk, weeks: 34 }); return `Only a local consortium bites: ${money(wk)}/wk.`; } });
D('community', { owner: 'mkt', dur: 6, repeat: 1, cost: () => M(2500), wk: () => M(80), p: () => 0.8,
  title: 'Launch a community programme', pitch: '"Players in schools, walking football, a food bank at every home game. People support clubs that show up."', benefit: 'Supporter mood and fan base up.',
  done: (c, ok) => { if (ok) { fx({ fans: Math.round(6 * c.scale), press: 2 }); g().club.fanbase = Math.round(g().club.fanbase * (1 + 0.06 * c.scale)); return 'The programme is a hit in town.'; } fx({ fans: 1 }); return 'Low turnout. Nice idea, little impact.'; } });
D('global_campaign', { owner: 'mkt', dur: 8, repeat: 1, cost: () => M(5000), p: () => 0.6 - (man('mkt', 'tone') > 60 ? 0.15 : 0), cond: () => man('mkt', 'reach') > 45,
  title: 'Run an international digital campaign', pitch: '"Short-form video, a few creators, subtitles in four languages. The audience is out there."', benefit: 'Brand strength up sharply, fan base grows.',
  done: (c, ok) => { if (ok) { fx({ brand: Math.round(12 * c.scale) }); g().club.fanbase = Math.round(g().club.fanbase * 1.04); return 'The campaign travels. Followers from three continents.'; } fx({ brand: -3, press: -3 }); return 'The campaign is mocked as "trying too hard".'; } });
D('acad_partner', { owner: 'acad', dur: 10, cost: () => M(4000), wk: () => M(100), p: () => 0.7, cond: () => !perks().partner,
  setup: () => ({ reg: pick(['waf', 'sam', 'sca', 'eeu']) }), title: c => `Partner with an academy in ${R(c.reg)}`, pitch: c => `"First option on their best teenagers, coaching exchanges both ways. ${R(c.reg)} is full of talent nobody watches."`, benefit: 'Higher-potential players in every intake.',
  done: (c, ok) => { if (ok) { perks().partner = c.reg; return `The ${R(c.reg)} partnership is signed.`; } return 'The partner academy signs with a bigger club instead.'; } });
D('solar', { owner: 'fin', dur: 6, cost: () => M(4000), p: () => 0.85, second: 'com', cond: () => !perks().solar,
  title: 'Install solar panels on the stand roofs', pitch: '"Energy is our fastest-rising cost. This pays for itself in two seasons."', benefit: () => `Running costs down about ${money(M(60))}/wk. Good press.`,
  done: (c, ok) => { perks().solar = true; if (ok) { g().club.rent = Math.max(0, g().club.rent - M(60)); fx({ press: 3 }); return 'The panels are live.'; } g().club.rent = Math.max(0, g().club.rent - M(20)); return 'The roof needed reinforcing first. Savings are modest.'; } });
D('refinance', { owner: 'fin', dur: 4, cost: () => M(1500), p: () => 0.6, second: 'com', cond: () => g().club.debt > M(30000) && !perks().refi,
  title: 'Refinance the club debt', pitch: () => `"We pay too much interest on ${money(g().club.debt)}. Rates have moved. Let me renegotiate."`, benefit: 'Debt reduced by about 15%.',
  done: (c, ok) => { perks().refi = true; if (ok) { g().club.debt = Math.round(g().club.debt * (1 - 0.15 * c.scale)); return `New terms agreed. Debt now ${money(g().club.debt)}.`; } return 'The banks will not move.'; } });
D('megastore', { owner: 'com', dur: 10, cost: () => M(9000), p: () => 0.7, second: 'mkt', cond: () => !perks().store && g().club.fanbase > 1300,
  title: 'Open a club megastore and web shop', pitch: '"Our shop is a cupboard with a till. Supporters want to buy; we make it hard."', benefit: 'Merchandise income up about 30%.',
  done: (c, ok) => { if (ok) { perks().store = true; return 'The megastore opens to queues around the block.'; } return 'Supplier problems: the store opens half-empty and closes again.'; } });
D('ticket_tech', { owner: 'com', dur: 6, cost: () => M(3000), p: () => 0.75, second: 'mkt', cond: () => !perks().ticket,
  title: 'Introduce dynamic ticket pricing', pitch: '"Big games cost more, quiet games less. Airlines have done it for decades."', benefit: 'Matchday income up about 8%. Supporters dislike it.',
  done: (c, ok) => { perks().ticket = true; fx({ fans: dna().identity === 'community' ? -6 : -3 }); return ok ? 'The system works. Income up, grumbling too.' : 'Glitches on launch day. The fans are not impressed.'; } });

/* ---------- 4. impact of each proposal in plain numbers (1.3) ---------- */
const rankWith = d => { const P = F.strengthParts(), me = P.squad + P.coach + P.style + P.morale + P.extra + d; return 1 + g().divs[g().club.tier].clubs.filter(i => i !== 0).filter(i => g().clubs[i].str > me).length; };
const homeGate = () => F.attendance() * F.ticketPrice();
const pay = (cost, perWk) => perWk > 0 ? `Pays back in about ${Math.ceil(cost / perWk)} weeks` : null;
const IMP = {
  scout_office: c => [['Network in ' + R(c.reg), Math.round(g().club.net[c.reg]), Math.min(100, Math.round(g().club.net[c.reg] + 35 * c.scale))], ['Focus regions', `${R(man('scout', 'reg1'))}, ${R(man('scout', 'reg2'))}`, `${R(man('scout', 'reg1'))}, ${R(c.reg)}`]],
  data_dept: () => [['Scouting estimate error', '±1.0★ typical', '±0.5★ typical'], ['Bad signings', 'more likely', 'fewer']],
  new_stand: c => { const seats = Math.round(c.seats * c.scale), extra = Math.min(seats, Math.max(0, g().club.fanbase * 0.8 - g().club.cap)), wk = Math.round(extra * F.ticketPrice() / 2); return [['Capacity', g().club.cap.toLocaleString('en-GB'), (g().club.cap + seats).toLocaleString('en-GB')], ['Ticket income', '', `about +${money(wk)}/wk at current demand`], ...(pay(c.seats * 12, wk) ? [['Payback', '', pay(c.seats * 12, wk)]] : [])]; },
  youth_fac: () => [['Academy level', g().club.fac.youth, g().club.fac.youth + 1], ['Intake potential', '', '+0.25★ per youngster'], ['Intake size', '', 'slightly bigger']],
  train_ground: c => { const a = Math.max(1, Math.round(2 * c.scale)); return [['Training level', g().club.fac.train, Math.min(10, g().club.fac.train + a)], ['Player development', '', `about +${a * 3}% faster`]]; },
  sports_sci: () => [['Injury rate', '100%', '70%'], ['Injured now', g().squad.filter(p => p.inj > 0).length, '']],
  analyst: () => [['Team strength', '', '+0.15'], ['Expected league position', F.ord(rankWith(0)), F.ord(rankWith(0.15))]],
  hospitality: c => { const wk = Math.round(M(380) * c.scale); return [['Income', '', `+${money(wk)}/wk`], ['Capacity', g().club.cap.toLocaleString('en-GB'), (g().club.cap - 200).toLocaleString('en-GB')], ['Payback', '', pay(M(8000) * c.scale, wk)]]; },
  sponsor_drive: c => { const cur = g().club.deals.filter(d => d.type === 'shirt').reduce((a, d) => a + d.wk, 0); return [['Shirt sponsorship', money(cur) + '/wk', `about ${money(M(1800))}/wk if it works`]]; },
  community: c => [['Supporter mood', Math.round(g().st.fans), Math.min(100, Math.round(g().st.fans + 6 * c.scale))], ['Supporter base', g().club.fanbase.toLocaleString('en-GB'), Math.round(g().club.fanbase * (1 + 0.06 * c.scale)).toLocaleString('en-GB')]],
  global_campaign: c => [['Brand strength', Math.round(g().club.brand), Math.min(100, Math.round(g().club.brand + 12 * c.scale))], ['If it fails', '', 'brand −3, press −3']],
  acad_partner: c => [['Intake potential', '', '+0.5★ per youngster'], ['Talent pool', '', R(c.reg)]],
  solar: () => [['Running costs', '', `−${money(M(60))}/wk`], ['Payback', '', pay(M(4000), M(60))]],
  refinance: c => [['Debt', money(g().club.debt), money(Math.round(g().club.debt * (1 - 0.15 * c.scale)))], ['Interest', money(Math.round(g().club.debt * 0.0012)) + '/wk', money(Math.round(g().club.debt * (1 - 0.15 * c.scale) * 0.0012)) + '/wk']],
  megastore: () => { const m = (g().fin.last && g().fin.last.i.merch) || 0; return [['Merchandise', money(m) + '/wk', money(Math.round(m * 1.3)) + '/wk'], ['Payback', '', pay(M(9000), m * 0.3)]]; },
  ticket_tech: () => [['Ticket income per home game', money(homeGate()), money(Math.round(homeGate() * 1.08))], ['Supporter mood', Math.round(g().st.fans), Math.round(g().st.fans - (dna().identity === 'community' ? 6 : 3))]],
};
for (const k in IMP) if (F.PROP[k]) F.PROP[k].impact = c => IMP[k](c).filter(r => r && r[2] != null);

/* ---------- 5. the board asks for a plan when you fall behind (1.3) ---------- */
E('behind_target', { from: 'board', dept: 'business', cd: 9, why: () => { const o = g().board.obj.find(o => o.k === 'league'); return `You are ${F.ord(F.myPos())}; the board's target is ${F.ord(o.target)}. Open the analysis on your desk to see why.`; },
  cond: () => { const o = g().board.obj.find(o => o.k === 'league'); return o && g().week >= 9 && g().week <= 30 && F.myPos() > o.target + 2; },
  title: () => 'The board wants a plan', body: () => { const A = F.analysis(); return `We are ${F.ord(A.pos)}, ${A.gap} points off ${F.ord(A.target)}. At this rate we finish around ${A.fc ? F.ord(A.fc) : 'mid-table'}. ${A.causes.length ? 'Main issue, according to the club analysts: ' + A.causes[0].t : ''}`; },
  opts: [
    { l: 'Invest in the squad', h: 'Finance releases more cash · DoF limits loosened', f: () => { const m = g().mand; m.fin.transfer = clamp(m.fin.transfer + 25, 0, 100); const o = ['0', '25', '50', '100']; m.dof.maxFee = o[Math.min(3, o.indexOf(m.dof.maxFee) + 1)]; const w = ['100', '150', '200', '999']; m.dof.maxWage = w[Math.min(3, w.indexOf(m.dof.maxWage) + 1)]; g().club.kitty = (g().club.kitty || 0) + M(5000); fx({ board: 4 }); return 'Transfer budget up, rules loosened. The DoF has room to act.'; } },
    { l: 'Stay the course', h: 'Board reacts to the evidence (xPts)', f: () => { const A = F.analysis(); if (A.xpts - A.pts >= 3) { fx({ board: 5 }); return `The board accepts the numbers: ${A.pts} points from chances worth ${A.xpts.toFixed(0)}.`; } fx({ board: -6 }); return 'The numbers do not back you. The board is unconvinced.'; } },
    { l: 'Replace the head coach', h: 'Compensation · new appointment', f: () => { const s = staff('coach'); if (!s) return 'There is no coach to replace.'; fx({ cash: -Math.round(s.wage * Math.max(8, s.contract * 20)), board: 4 }); g().staff.coach = null; g().cands.coach = F.genCands('coach'); return `${s.name} is dismissed. Appoint a successor from the Staff tab.`; } },
    { l: 'Reset expectations publicly', h: 'Target 3 places lower · fans and board ↓', f: () => { const o = g().board.obj.find(o => o.k === 'league'); o.target = Math.min(15, o.target + 3); o.t = `Finish ${F.ord(o.target)} or higher`; fx({ board: -5, fans: -5, press: -3 }); return `New target: ${F.ord(o.target)}. Nobody is pleased, but it is realistic.`; } }],
  auto: () => 1 });
})(FO);
