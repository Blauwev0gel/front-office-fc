/* The Front Office · Academy as a department you run
   A trial day where you pick the intake, the "is he ready?" call, and a pyramid view.
   The academy director and department staff now feed the youth staff (see academy.js yv). */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { ri, chance, clamp, money, M, staff, man, tierAvg, absStars } = F;
function T() { const G = g(); if (!G.acadX) G.acadX = { trial: null, readyAsked: {}, log: [] }; return G.acadX; }

/* ---------- trial day: the intake becomes a choice ---------- */
const prevIntake = H.acadIntake;
H.acadIntake = () => {
  const G = g(), before = new Set(G.academy.map(p => p.id));
  prevIntake();
  const got = G.academy.filter(p => !before.has(p.id));
  const extra = []; for (let i = 0; i < 3; i++) { const p = F.acadGenYouth(ri(12, 13)); F.acadBand(p); extra.push(p); }
  G.academy = G.academy.filter(p => before.has(p.id));
  const list = got.concat(extra).sort(() => F.rnd() - 0.5);
  const staffPick = list.slice().sort((a, b) => (b.band ? b.band[1] : 0) - (a.band ? a.band[1] : 0)).slice(0, got.length).map(p => p.id);
  T().trial = { s: G.season, w: G.week, list, picks: got.length, chosen: staffPick.slice(), staffPick, until: F.absWeek() + 2 };
};
// the CEO sets what the recruiters look for, never the children themselves (P1)
const CRIT = {
  ceiling: { l: 'Trust the recruiters', t: 'highest ceiling', d: 'Their own list: the highest ceiling', f: p => (p.band ? p.band[1] : 0) },
  local: { l: 'Local lads first', t: 'local lads', d: 'More local boys, a lower ceiling', f: p => (p.region === 'dom' ? 10 : 0) + (p.band ? p.band[1] : 0) },
  ready: { l: 'Ready soonest', t: 'ready soonest', d: 'Closest to the first team, a lower ceiling', f: p => p.ca + (p.band ? p.band[0] * 0.2 : 0) } };
function pickBy(crit) {
  const X = T().trial; if (!X || !CRIT[crit]) return;
  X.chosen = X.list.slice().sort((a, b) => CRIT[crit].f(b) - CRIT[crit].f(a)).slice(0, X.picks).map(p => p.id); X.crit = crit;
  return confirm(false);
}
function confirm(auto) {
  const G = g(), X = T().trial; if (!X) return;
  const take = X.list.filter(p => X.chosen.includes(p.id)), local = take.filter(p => p.region === 'dom').length;
  for (const p of take) G.academy.push(p);
  const c = CRIT[X.crit || 'ceiling'];
  T().log.unshift({ w: G.week, s: G.season, t: `Trial day: ${take.length} youngsters signed, focus on ${c.t}. ${local} local, best potential ${Math.max(0, ...take.map(p => p.band ? p.band[1] : 0)).toFixed(1)}★.` });
  T().trial = null;
  return { out: `${take.length} youngsters join the academy. The recruiters went for ${c.t}.` };
}
/* ---------- weekly ---------- */
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => { if (prevAfter) prevAfter(ours); const X = T(); if (X.trial && F.absWeek() >= X.trial.until) confirm(true); };

/* ---------- briefs ---------- */
/* ---------- the weekly U18 match: a short word as the mentor (B38, B48) ---------- */
// Opt-in: it runs without you. Unanswered, the boy just plays on. Every choice costs something (welfare, or a harder season), none is tactics.
F.defineBrief('ac_match', { role: 'acad', cd: 2,
  check: () => { const a = g().acad, L = a && a.lg && a.lg.U18 && a.lg.U18.last, X = T(); if (!L || !L.pid || F.absWeek() - L.at > 1 || X.matchAt === L.at) return null; const p = g().academy.find(x => x.id === L.pid); if (!p || p.loanOut) return null;
    X.matchAt = L.at; return { score: 2.2, pid: p.id, name: p.name, age: p.age, us: L.us, them: L.them, opp: L.opp, home: L.home, tired: (p.wel || 70) < 55 }; },
  title: c => `U18: ${c.us > c.them ? 'won' : c.us < c.them ? 'lost' : 'drew'} ${c.us}–${c.them} ${c.home ? 'against' : 'at'} ${c.opp}`,
  text: c => `${c.name} (${c.age}) was the best of ours. ${c.tired ? 'He looks tired, though, and the coaches say so.' : c.us > c.them ? 'The lads are buzzing.' : 'He still wants the ball every time.'} A word from you would mean something.`,
  opts: [
    { l: c => c.tired ? 'Give him a rest' : 'Praise him in front of the group', h: c => c.tired ? 'Welfare ↑ · slower this week' : 'Morale ↑ · welfare ↑', f: c => { const p = g().academy.find(x => x.id === c.pid); if (!p) return 'He has moved on.'; if (c.tired) { p.wel = clamp((p.wel || 60) + 8, 0, 100); return `${c.name} gets a quiet week. The coaches approve.`; } p.wel = clamp((p.wel || 60) + 4, 0, 100); p.morale = clamp((p.morale || 65) + 6, 0, 100); return `${c.name} walks taller. So do the lads around him.`; } },
    { l: 'Push him: play up with the older boys', h: 'Develops faster this season · welfare ↓', f: c => { const p = g().academy.find(x => x.id === c.pid); if (!p) return 'He has moved on.'; p.playUp = true; p.wel = clamp((p.wel || 60) - 3, 0, 100); return `${c.name} trains with the older group from Monday. He says he can handle it. He is ${c.age}.`; } },
    { l: 'Leave him be', h: 'Free', f: () => 'The academy gets on with it.' }] });

F.defineBrief('ac_trial', { role: 'acad', cd: 30,
  check: () => { const X = T().trial; return X && !X.briefed ? (X.briefed = true, { score: 3.5 }) : null; },
  title: () => 'Trial day: pick the intake',
  text: () => { const X = T().trial; return X ? `${X.list.length} youngsters on trial, room for ${X.picks}. What should the recruiters look for?` : 'The trial day is over.'; },
  opts: [
    { l: 'Trust the recruiters', h: 'The highest ceiling', f: () => (pickBy('ceiling') || {}).out || 'Done.' },
    { l: 'Local lads first', h: 'More local boys · lower ceiling', f: () => (pickBy('local') || {}).out || 'Done.' },
    { l: 'Ready soonest', h: 'Closest to the first team · lower ceiling', f: () => (pickBy('ready') || {}).out || 'Done.' }] });
F.defineBrief('ac_ready', { role: 'acad', cd: 6,
  check: () => { const G = g(), X = T(), thr = tierAvg(G.club.tier) - 0.5; const p = G.academy.filter(p => p.age >= 17 && p.ca >= thr && !X.readyAsked[p.id]).sort((a, b) => b.ca - a.ca)[0]; if (!p || G.squad.length >= 27) return null; X.readyAsked[p.id] = G.season; return { score: 2.5, pid: p.id, name: p.name, age: p.age, pos: p.pos, st: absStars(p.ca).toFixed(1) }; },
  title: c => `Is ${c.name} ready?`,
  text: c => `${c.name} (${c.age}, ${c.pos}) plays at ${c.st}★ already. ${staff('acad') ? staff('acad').name.split(' ')[0] : 'The academy'} thinks he can train with the first team.`,
  opts: [
    { l: 'Promote him now', h: 'First-team squad · coach decides minutes', f: c => { const p = g().academy.find(x => x.id === c.pid); if (!p) return 'He has moved on.'; F.acadPromote(p); p.morale = clamp((p.morale || 60) + 10, 0, 100); return `${p.name} joins the first-team squad. The coach's youth mandate decides how much he plays.`; } },
    { l: 'One more season', h: 'Keeps developing here', f: c => { const p = g().academy.find(x => x.id === c.pid); if (p) p.keep = true; return 'He stays in the academy for now.'; } },
    { l: 'Loan him out', h: 'Faster growth, out of sight', f: c => { const p = g().academy.find(x => x.id === c.pid); if (p) { p.loanOut = true; p.loanCEO = true; } return 'Off on loan for regular football, until he is ready.'; } }] });

function view() { const G = g(), X = T(), groups = ['U14', 'U16', 'U18', 'U21'].map(k => ({ k, ps: G.academy.filter(p => F.acadGrp(p) === k).sort((a, b) => (b.band ? b.band[1] : 0) - (a.band ? a.band[1] : 0)) })); return { groups, grads: G.squad.filter(p => p.academy), trial: X.trial, log: X.log.slice(0, 6), lvl: F.acadTierLvl() }; }
Object.assign(F, { acView: view, acTrialPick: pickBy, AC_CRIT: CRIT });
})(FO);
