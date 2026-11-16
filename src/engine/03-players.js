/* ---------- players ---------- */
const ATTR = ['fin', 'pas', 'dri', 'cro', 'tac', 'mar', 'hea', 'pac', 'sta', 'str', 'vis', 'com', 'han', 'ref'];
const ATTR_L = { fin: 'Finishing', pas: 'Passing', dri: 'Dribbling', cro: 'Crossing', tac: 'Tackling', mar: 'Marking', hea: 'Heading', pac: 'Pace', sta: 'Stamina', str: 'Strength', vis: 'Vision', com: 'Composure', han: 'Handling', ref: 'Reflexes' };
const POSW = { GK: { han: 3, ref: 3, com: 2, hea: 1, pas: 1, str: 1 }, CB: { tac: 3, mar: 3, hea: 2, str: 2, com: 1, pac: 1 }, FB: { tac: 2, mar: 2, pac: 2, sta: 2, cro: 2, pas: 1 }, DM: { tac: 3, pas: 2, sta: 2, mar: 2, vis: 1, str: 1 }, CM: { pas: 3, vis: 2, sta: 2, tac: 1, com: 1, dri: 1 }, AM: { pas: 2, vis: 3, dri: 2, fin: 2, com: 1 }, W: { pac: 3, dri: 3, cro: 2, fin: 1, pas: 1 }, ST: { fin: 3, com: 2, hea: 1, pac: 2, dri: 1, str: 1 } };
const POS_L = { GK: 'Goalkeeper', CB: 'Centre-back', FB: 'Full-back', DM: 'Defensive mid', CM: 'Central mid', AM: 'Attacking mid', W: 'Winger', ST: 'Striker' };
const LINE = { GK: 'GK', CB: 'DF', FB: 'DF', DM: 'MF', CM: 'MF', AM: 'MF', W: 'FW', ST: 'FW' };
const NEAR = { GK: [], CB: ['FB', 'DM'], FB: ['CB', 'W'], DM: ['CM', 'CB'], CM: ['DM', 'AM'], AM: ['CM', 'W', 'ST'], W: ['AM', 'FB', 'ST'], ST: ['W', 'AM'] };
const REQ = { GK: 2, CB: 4, FB: 3, DM: 2, CM: 3, AM: 2, W: 3, ST: 3 };
const SLOTS = ['GK', 'FB', 'CB', 'CB', 'FB', 'DM', 'CM', 'AM', 'W', 'ST', 'W'];

function calcCA(p) { const w = POSW[p.pos]; let s = 0, n = 0; for (const k in w) { s += p.a[k] * w[k]; n += w[k]; } return s / n; }
const wageFor = ca => 250 * Math.pow(1.38, ca - 5);
function upd(p) { p.ca = calcCA(p); const af = p.age <= 21 ? 1.4 : p.age <= 24 ? 1.2 : p.age <= 28 ? 1 : p.age <= 31 ? 0.6 : 0.3; p.value = Math.round(wageFor(p.ca) * 62 * af * Math.pow(1.38, Math.max(0, p.pa - p.ca) * 0.5) / 100) * 100; return p; } // B37: potential is priced on the same scale as wages (half the expected growth), so young talent is no free lunch
const newStats = () => ({ apps: 0, mins: 0, g: 0, a: 0, xg: 0, xa: 0, prg: 0, dw: 0, dt: 0, rat: 0, yc: 0, rc: 0 });
function absStars(v) { return clamp(Math.round((0.5 + (v - 3) / 3) * 2) / 2, 0.5, 5); }
function stars(v) { return clamp(Math.round((2.5 + (v - tierAvg(G.club.tier)) * 0.8) * 2) / 2, 0.5, 5); }

function genPlayer(o) {
  const region = o.region || 'dom', R = REGIONS[region];
  const age = o.age || ri(18, 32), pos = o.pos || pick(Object.keys(POSW));
  const ca = clamp(o.ca, 1.5, 19), a = {}, w = POSW[pos];
  for (const k of ATTR) {
    let b;
    if (w[k]) b = ca + gauss() * 1.1 + (w[k] - 1.5) * 0.5;
    else if (k === 'han' || k === 'ref') b = pos === 'GK' ? ca : ri(1, 4);
    else b = ca - 2.5 + gauss() * 2 - (pos === 'GK' ? 3 : 0);
    if (o.tech && ['pas', 'dri', 'vis', 'com'].includes(k)) b += 1;
    if (o.phys && ['pac', 'sta', 'str'].includes(k)) b += 1;
    a[k] = clamp(b, 1, 20);
  }
  const taken = new Set(G && G.squad ? [...G.squad, ...(G.academy || [])].map(x => x.name.split(' ').slice(-1)[0]) : []);
  let nm = pick(R.first) + ' ' + pick(R.last); for (let t = 0; t < 10 && taken.has(nm.split(' ').slice(-1)[0]); t++) nm = pick(R.first) + ' ' + pick(R.last);
  const p = { id: uid(), name: nm, region, age, pos, a, pers: { prof: ri(4, 19), loy: ri(3, 19), temp: ri(3, 19), amb: ri(3, 19) }, morale: 65, inj: 0, susp: 0, contract: ri(1, 3), academy: !!o.academy, debut: false, joined: G.season || 1, st: newStats(), car: { apps: 0, g: 0, a: 0 }, settle: true };
  const diff = ca - calcCA(p); for (const k in w) p.a[k] = clamp(p.a[k] + diff, 1, 20);
  const head = age <= 17 ? 2 + rnd() * 7 : age <= 19 ? 1.5 + rnd() * 6 : age <= 21 ? 1 + rnd() * 4.5 : age <= 24 ? rnd() * 2.5 : 0;
  p.pa = clamp(calcCA(p) + head + (o.paBonus || 0), 1, 20);
  upd(p);
  p.wage = Math.round(wageFor(p.ca) * (0.8 + rnd() * 0.4) * (o.wageMul || 1) / 5) * 5;
  return p;
}

