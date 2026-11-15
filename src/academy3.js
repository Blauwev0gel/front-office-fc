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
function confirm(auto) {
  const G = g(), X = T().trial; if (!X) return;
  const take = X.list.filter(p => X.chosen.includes(p.id));
  for (const p of take) G.academy.push(p);
  const yourOwn = take.filter(p => !X.staffPick.includes(p.id)).length;
  T().log.unshift({ w: G.week, t: `${take.length} youngsters signed at the trial day${yourOwn ? `, ${yourOwn} against the recruiters' advice` : ''}.` });
  T().trial = null;
  return { out: auto ? 'The recruiters picked the intake.' : `${take.length} youngsters join the academy.` };
}
/* ---------- weekly ---------- */
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => { if (prevAfter) prevAfter(ours); const X = T(); if (X.trial && F.absWeek() >= X.trial.until) confirm(true); };

/* ---------- briefs ---------- */
F.defineBrief('ac_trial', { role: 'acad', cd: 30,
  check: () => { const X = T().trial; return X && !X.briefed ? (X.briefed = true, { score: 3.5 }) : null; },
  title: () => 'Trial day: pick the intake',
  text: () => { const X = T().trial; return X ? `${X.list.length} youngsters on trial, room for ${X.picks}. The recruiters have a list; you can overrule them on the academy page.` : 'The trial day is over.'; },
  opts: [
    { l: 'Go with the recruiters', h: 'Their picks', f: () => (confirm(true) || {}).out || 'Done.' },
    { l: 'I will choose myself', h: 'Open the academy', f: () => { const X = T().trial; if (X) X.until = F.absWeek() + 2; return 'The list waits for you on the academy page, under Decisions.'; } }] });
F.defineBrief('ac_ready', { role: 'acad', cd: 6,
  check: () => { const G = g(), X = T(), thr = tierAvg(G.club.tier) - 0.5; const p = G.academy.filter(p => p.age >= 17 && p.ca >= thr && !X.readyAsked[p.id]).sort((a, b) => b.ca - a.ca)[0]; if (!p || G.squad.length >= 27) return null; X.readyAsked[p.id] = G.season; return { score: 2.5, pid: p.id, name: p.name, age: p.age, pos: p.pos, st: absStars(p.ca).toFixed(1) }; },
  title: c => `Is ${c.name} ready?`,
  text: c => `${c.name} (${c.age}, ${c.pos}) plays at ${c.st}★ already. ${staff('acad') ? staff('acad').name.split(' ')[0] : 'The academy'} thinks he can train with the first team.`,
  opts: [
    { l: 'Promote him now', h: 'First-team squad · coach decides minutes', f: c => { const p = g().academy.find(x => x.id === c.pid); if (!p) return 'He has moved on.'; F.acadPromote(p); p.morale = clamp((p.morale || 60) + 10, 0, 100); return `${p.name} joins the first-team squad. The coach's youth mandate decides how much he plays.`; } },
    { l: 'One more season', h: 'Keeps developing here', f: c => { const p = g().academy.find(x => x.id === c.pid); if (p) p.keep = true; return 'He stays in the academy for now.'; } },
    { l: 'Loan him out', h: 'Faster growth, out of sight', f: c => { const p = g().academy.find(x => x.id === c.pid); if (p) p.loanOut = true; return 'Off on loan for regular football.'; } }] });

function view() { const G = g(), X = T(), groups = ['U14', 'U16', 'U18', 'U21'].map(k => ({ k, ps: G.academy.filter(p => F.acadGrp(p) === k).sort((a, b) => (b.band ? b.band[1] : 0) - (a.band ? a.band[1] : 0)) })); return { groups, grads: G.squad.filter(p => p.academy), trial: X.trial, log: X.log.slice(0, 6), lvl: F.acadTierLvl() }; }
Object.assign(F, { acView: view });
})(FO);
