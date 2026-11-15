/* The Front Office · engine (module 1)
   Pure game logic. No DOM. Runs in the browser and in Node for tests. */
var FO = (function () {
'use strict';
let G = null;
const VERSION = 3;
const HOOK = {};
const SEASON_WEEKS = 34;

/* ---------- rng & utils ---------- */
function rnd() { let a = G.rs = (G.rs + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = a => a[Math.floor(rnd() * a.length)];
const chance = p => rnd() < p;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) * 1.73;
function wpick(arr, wf) { let tot = 0; const ws = arr.map(x => { const w = Math.max(0, wf(x)); tot += w; return w; }); if (tot <= 0) return arr[0]; let r = rnd() * tot; for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; } return arr[arr.length - 1]; }
function poisson(l) { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const uid = () => (G.nid = (G.nid || 1) + 1);
const ord = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
const absWeek = () => (G.season - 1) * SEASON_WEEKS + G.week;

/* ---------- world constants ---------- */
const TIERS = [null, 'The Premiership', 'First Division', 'Second Division', 'Third Division', 'National Conference', 'Regional Premier', 'County Senior League', 'County League'];
const tierAvg = t => 5 + (8 - t) * 1.4;
const S = t => Math.pow(1.38, (8 - t) * 1.4);
const sc = () => S(G.club.tier);
const M = x => { const v = x * sc(); const m = v >= 1e6 ? 10000 : v >= 1e5 ? 1000 : v >= 1e4 ? 100 : 10; return Math.round(v / m) * m; };
function money(v) { const s = v < 0 ? '−' : ''; v = Math.abs(v); if (v >= 1e6) return s + '£' + (v / 1e6).toFixed(v >= 1e7 ? 1 : 2) + 'm'; if (v >= 1e3) return s + '£' + (v / 1e3).toFixed(v >= 1e5 ? 0 : 1).replace(/\.0$/, '') + 'k'; return s + '£' + Math.round(v); }
const CAPREQ = { 1: 20000, 2: 12000, 3: 7000, 4: 4500, 5: 3000 };

const TOWN_A = ['Ash', 'Bram', 'Carl', 'Dun', 'Elm', 'Fen', 'Glen', 'Hart', 'Ivel', 'King', 'Lang', 'Mill', 'North', 'Oak', 'Pen', 'Queens', 'Raven', 'Stan', 'Thorn', 'Wey', 'Whit', 'Ald', 'Bex', 'Cray', 'Dray', 'Eas', 'Frome', 'Gort', 'Hol', 'Kel', 'Lyn', 'Mar', 'Ned', 'Orr', 'Pres', 'Rud', 'Sel', 'Tad', 'Wil', 'Brack', 'Cold', 'Har', 'Lud', 'Sax'];
const TOWN_B = ['ford', 'ley', 'ton', 'bridge', 'wick', 'field', 'mouth', 'by', 'ham', 'stead', 'worth', 'gate', 'pool', 'haven', 'borough', 'well', 'moor', 'combe'];
const SUFFIX = ['United', 'Town', 'Athletic', 'Rovers', 'City', 'Albion', 'Wanderers', 'FC', 'Borough', 'Villa', 'Rangers', 'Sporting'];

const MORE_DOM = ['Ashworth', 'Bramley', 'Carver', 'Dunmore', 'Ellison', 'Fairley', 'Gaskell', 'Hollins', 'Ingham', 'Jessop', 'Kenworthy', 'Lockett', 'Mabry', 'Nuttall', 'Oakes', 'Pendle', 'Quarry', 'Rowntree', 'Sutcliffe', 'Tindall', 'Underwood', 'Varley', 'Whitlock', 'Yardley', 'Aldridge', 'Birtles', 'Cropper', 'Denholm', 'Eccles', 'Fowler', 'Garside', 'Hesketh', 'Kitchen', 'Lightfoot', 'Midgley', 'Norbury', 'Ormerod', 'Pickup', 'Ramsden', 'Shackleton', 'Thwaite', 'Wardle'];
const MORE_FIRST = ['Adam', 'Billy', 'Charlie', 'Ethan', 'Finley', 'George', 'Isaac', 'Jake', 'Kyle', 'Leo', 'Mason', 'Noah', 'Oscar', 'Rhys', 'Toby', 'Will', 'Zach', 'Alex', 'Ellis', 'Jordan'];
const REGIONS = {
  dom: { name: 'Domestic', cost: 1.0, adapt: 0, first: ['Jack', 'Harry', 'Callum', 'Liam', 'Ryan', 'Ben', 'Tom', 'Josh', 'Kieran', 'Owen', 'Lewis', 'Dan', 'Sam', 'Connor', 'Jamie', 'Alfie', 'Reece', 'Nathan'], last: ['Hart', 'Walsh', 'Barker', 'Cole', 'Fenton', 'Dawson', 'Price', 'Holt', 'Marsh', 'Reid', 'Shaw', 'Tanner', 'Webb', 'Doyle', 'Pike', 'Lowe', 'Croft', 'Ashby', 'Norris', 'Quinn'] },
  low: { name: 'Low Countries', cost: 0.9, adapt: 0.06, first: ['Daan', 'Joost', 'Ruben', 'Sem', 'Milan', 'Thijs', 'Lars', 'Bram', 'Jesse', 'Wout', 'Niels', 'Koen'], last: ['de Vries', 'Bakker', 'Visser', 'Smit', 'Mulder', 'de Boer', 'Peeters', 'Janssens', 'Maes', 'Kok', 'Hendriks', 'Verbeek'] },
  sca: { name: 'Scandinavia', cost: 0.85, adapt: 0.06, first: ['Erik', 'Magnus', 'Oskar', 'Anders', 'Sindre', 'Elias', 'Jonas', 'Mikkel', 'Viktor', 'Aksel'], last: ['Lindqvist', 'Hansen', 'Berg', 'Nyström', 'Dahl', 'Eriksen', 'Holm', 'Solberg', 'Strand', 'Lund'] },
  ibe: { name: 'Iberia', cost: 0.95, adapt: 0.1, first: ['Pablo', 'Diego', 'Iker', 'Rui', 'Tiago', 'Álvaro', 'Sergio', 'Nuno', 'Marcos', 'Hugo'], last: ['García', 'Ferreira', 'Moreno', 'Santos', 'Ruiz', 'Costa', 'Navarro', 'Pires', 'Ortega', 'Vidal'] },
  sam: { name: 'South America', cost: 0.7, adapt: 0.22, first: ['Mateo', 'Thiago', 'Lautaro', 'Bruno', 'Facundo', 'Gabriel', 'Nicolás', 'Felipe', 'Joaquín', 'Enzo'], last: ['Silva', 'Pereyra', 'Gómez', 'Rodrigues', 'Acosta', 'Medina', 'Rojas', 'Cabral', 'Benítez', 'Souza'] },
  waf: { name: 'West Africa', cost: 0.6, adapt: 0.2, first: ['Kwame', 'Ibrahim', 'Moussa', 'Kofi', 'Seydou', 'Emeka', 'Yaw', 'Abdoulaye', 'Chidi', 'Mamadou'], last: ['Mensah', 'Diallo', 'Traoré', 'Okafor', 'Boateng', 'Koné', 'Sarr', 'Adeyemi', 'Camara', 'Owusu'] },
  eeu: { name: 'Eastern Europe', cost: 0.75, adapt: 0.14, first: ['Luka', 'Marek', 'Andrei', 'Dmytro', 'Petar', 'Tomasz', 'Bogdan', 'Filip', 'Nikola', 'Pavel'], last: ['Novak', 'Kowalski', 'Popescu', 'Horvat', 'Petrov', 'Kovač', 'Nowak', 'Ionescu', 'Marić', 'Bondar'] },
};
REGIONS.dom.last.push(...MORE_DOM); REGIONS.dom.first.push(...MORE_FIRST);
const MORE_LAST = { low: ['Wouters', 'Claes', 'Meijer', 'Dekker', 'Brouwer', 'Vos', 'Jacobs', 'Willems'], sca: ['Aas', 'Bakke', 'Ek', 'Lie', 'Moen', 'Sand', 'Vik', 'Wik'], ibe: ['Pinto', 'Ramos', 'Cruz', 'Lopes', 'Ortega', 'Rocha', 'Vidal', 'Serra'], sam: ['Rojas', 'Acosta', 'Medina', 'Vargas', 'Herrera', 'Ríos', 'Castro', 'Sosa'], waf: ['Owusu', 'Koné', 'Bamba', 'Sarr', 'Adeyemi', 'Boateng', 'Camara', 'Okafor'], eeu: ['Horvat', 'Kovač', 'Lis', 'Marin', 'Babić', 'Zając', 'Ionescu', 'Petrov'] };
for (const k in MORE_LAST) if (REGIONS[k]) REGIONS[k].last.push(...MORE_LAST[k]);

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
function upd(p) { p.ca = calcCA(p); const af = p.age <= 21 ? 1.4 : p.age <= 24 ? 1.2 : p.age <= 28 ? 1 : p.age <= 31 ? 0.6 : 0.3; p.value = Math.round(wageFor(p.ca) * 62 * af * (1 + Math.max(0, p.pa - p.ca) * 0.08) / 100) * 100; return p; }
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

/* ---------- staff ---------- */
const ROLES = [
  { id: 'dof', t: 'Director of Football', s: 'DoF', dept: 'sporting', at: ['Judgement', 'Negotiation', 'Network'] },
  { id: 'coach', t: 'Head Coach', s: 'Coach', dept: 'first team', at: ['Tactics', 'Man-management', 'Development'] },
  { id: 'scout', t: 'Chief Scout', s: 'Scout', dept: 'scouting', at: ['Judging ability', 'Judging potential', 'Network'] },
  { id: 'acad', t: 'Academy Director', s: 'Academy', dept: 'academy', at: ['Development', 'Recruitment', 'Discipline'] },
  { id: 'com', t: 'Commercial Director', s: 'Commercial', dept: 'commercial', at: ['Negotiation', 'Network', 'Creativity'] },
  { id: 'mkt', t: 'Head of Marketing', s: 'Marketing', dept: 'marketing', at: ['Creativity', 'Media savvy', 'Community'] },
  { id: 'fin', t: 'Finance Director', s: 'Finance', dept: 'business', at: ['Accuracy', 'Prudence', 'Negotiation'] },
];
const ROLE = Object.fromEntries(ROLES.map(r => [r.id, r]));
const REG_OPTS = Object.keys(REGIONS).map(k => [k, REGIONS[k].name]);
const MAND = {
  dof: { sl: [['youth', 'Experience', 'Youth', 50], ['data', "Scout's eye", 'Data', 50], ['sell', 'Keep the core', 'Sell for profit', 40], ['depth', 'Lean squad', 'Deep squad', 50], ['hard', 'Soft negotiator', 'Hard negotiator', 50]],
    ru: [['maxFee', 'Max fee per signing', [['0', 'Free agents only'], ['25', '25% of budget'], ['50', '50% of budget'], ['100', 'Whole budget']], '50'], ['maxAge', 'Max age at signing', [['21', '21'], ['24', '24'], ['28', '28'], ['32', '32'], ['99', 'No limit']], '28'], ['maxWage', 'Max wage per player', [['100', 'Squad average'], ['150', '1.5× average'], ['200', '2× average'], ['999', 'No limit']], '200'], ['approve', 'CEO approves deals above', [['0', 'Every deal'], ['25', '25% of budget'], ['50', '50% of budget'], ['999', 'Never']], '50'], ['clauses', 'Clauses the DoF may use', [['none', 'None'], ['sellon', 'Sell-on clauses'], ['all', 'Sell-on and instalments']], 'sellon']] },
  coach: { sl: [['attack', 'Defensive', 'Attacking', 50], ['youthMins', 'Trust veterans', 'Blood youngsters', 40], ['rotation', 'Settled XI', 'Heavy rotation', 35], ['intensity', 'Light training', 'Intense training', 55]],
    ru: [['style', 'Playing style', [['dna', 'Club style'], ['own', "Coach's own style"]], 'dna']] },
  scout: { sl: [['potential', 'Proven', 'Potential', 50], ['data', "Scout's eye", 'Data', 50], ['budget', 'Lean spend', 'Lavish spend', 45]],
    ru: [['reg1', 'Main region', REG_OPTS, 'dom'], ['reg2', 'Second region', REG_OPTS, 'low']] },
  acad: { sl: [['pace', 'Patient', 'Fast-track', 50], ['technical', 'Physical', 'Technical', 50], ['local', 'Recruit widely', 'Local kids only', 50], ['budget', 'Lean spend', 'Lavish spend', 45], ['philosophy', 'Develop players', 'Win youth games', 35], ['welfare', 'Push hard', 'Protect the kids', 55]],
    ru: [['minGrads', 'Academy players protected in squad', [['0', 'None'], ['1', '1'], ['2', '2'], ['3', '3']], '1'], ['playUp', 'Play the best kids an age group up', [['none', 'Never'], ['best', 'Only the very best'], ['many', 'Regularly']], 'best'], ['loans', 'Loan out under-21s', [['never', 'Never'], ['some', 'The ones who need games'], ['all', 'All of them']], 'some'], ['mentors', 'First-team mentors for scholars', [['yes', 'Yes'], ['no', 'No']], 'yes']] },
  com: { sl: [['tickets', 'Cheap tickets', 'Premium tickets', 45], ['selectivity', 'Any money', 'Values first', 50], ['merch', 'Low-key', 'Hard sell', 50]],
    ru: [['betting', 'Betting sponsors', [['ban', 'Banned'], ['ok', 'Allowed']], 'ok']] },
  mkt: { sl: [['reach', 'Local community', 'Global audience', 40], ['tone', 'Safe', 'Edgy', 35], ['budget', 'Lean spend', 'Lavish spend', 45]],
    ru: [['consult', 'Big changes', [['yes', 'Consult fans first'], ['no', 'Club decides']], 'yes']] },
  fin: { sl: [['risk', 'Cautious', 'Aggressive', 35], ['transfer', 'Hold cash', 'Fund transfers', 50], ['invest', 'Cut costs', 'Invest in facilities', 40]],
    ru: [['wageCap', 'Player wage-to-revenue cap', [['50', '50%'], ['60', '60%'], ['70', '70%'], ['85', '85%']], '60']] },
};
const LEAN = { dof: ['data', "Trusts the scout's eye", 'Swears by data'], coach: ['attack', 'Pragmatic, defence first', 'Attack-minded idealist'], scout: ['potential', 'Wants ready-made players', 'Hunts raw potential'], acad: ['pace', 'Patient developer', 'Wants kids in the first team early'], com: ['selectivity', 'Takes any money on the table', 'Protects the brand'], mkt: ['tone', 'Plays it safe', 'Loves a provocative campaign'], fin: ['risk', 'Ultra cautious', 'Comfortable with debt'] };
const STYLES = { possession: 'Possession', pressing: 'High press', counter: 'Counter-attack', direct: 'Direct' };
const STAFF_FIRST = ['Mark', 'Paul', 'Stefan', 'Emre', 'Gareth', 'Ivo', 'Tomás', 'Rufus', 'Hendrik', 'Clive', 'Dele', 'Martin', 'Graham', 'Arjen', 'Viktor', 'Sean', 'Pranav', 'Lennart', 'Ross', 'Joaquim', 'Femi', 'Hamish', 'Neil', 'Carlos'];
const STAFF_LAST = ['Ashby', 'Benn', 'Corrigan', 'Dalton', 'Everett', 'Farrow', 'Goodall', 'Hayward', 'Iles', 'Jarvis', 'Kemp', 'Lyle', 'Monroe', 'Nash', 'Orme', 'Pryor', 'Rourke', 'Stroud', 'Tait', 'Upton', 'Voss', 'Wilde', 'Yates', 'Brennan', 'Okoro', 'Vance', 'Lindgren', 'Moreau', 'Achterberg', 'Kerr', 'Duarte', 'Feld', 'Whitlock', 'Abara', 'Szabo', 'Rourke', 'Haddad', 'Pryce', 'Calloway', 'Nyberg', 'Esteves', 'Garrick', 'Mbeki', 'Thorne', 'Varga', 'Ellison', 'Kowal'];
const BIOS = {
  dof: ['Built a recruitment department at a fallen giant', 'Former agent who switched sides', 'Spent a decade in a big club\'s loan department', 'Ex-player turned sporting director', 'Analytics lead at a title-winning club'],
  coach: ['Promoted twice with a part-time side', 'Long-time assistant stepping up', 'Former international midfielder', 'Youth coach with a cult following', 'Sacked last season, hungry to prove a point'],
  scout: ['Knows every second-tier ground on the continent', 'Former video analyst', 'Discovered two internationals as teenagers', 'Ran a scouting network abroad', 'Data scientist who loves the touchline'],
  acad: ['Ran a renowned schoolboy programme', 'Former PE teacher with a famous eye', 'Built a category-one academy from scratch', 'Ex-pro who coached the national youth team', 'Sports psychologist turned academy boss'],
  com: ['Sold sponsorships for a motorsport team', 'Grew revenue at a rugby club fivefold', 'Ex-brand manager at a drinks company', 'Local business owner with a big network', 'Former agency dealmaker'],
  mkt: ['Ran the social channels of a viral club', 'Award-winning ad creative', 'Community organiser from the area', 'Former sports journalist', 'Growth marketer from a startup'],
  fin: ['Former auditor at a big firm', 'Rescued a club from administration', 'Banker who wanted a passion project', 'Accountant at the club for 15 years', 'Ex-CFO of a retailer'],
};

function genStaff(role, tier, q) {
  const ovr = clamp(tierAvg(tier) + (q || 0) + gauss() * 1.3, 2, 19.5);
  const at = [0, 1, 2].map(() => clamp(Math.round(ovr + gauss() * 1.8), 1, 20));
  const p = { ego: ri(3, 19), loy: ri(3, 19), risk: ri(3, 19), amb: ri(3, 19) };
  const ov = (at[0] + at[1] + at[2]) / 3;
  const sTaken = new Set(G && G.staff ? Object.values(G.staff).filter(Boolean).map(x => x.name.split(' ').slice(-1)[0]).concat(G.cands ? Object.values(G.cands).flat().filter(Boolean).map(x => x.name.split(' ').slice(-1)[0]) : []) : []);
  let snm = pick(STAFF_FIRST) + ' ' + pick(STAFF_LAST); for (let t = 0; t < 12 && sTaken.has(snm.split(' ').slice(-1)[0]); t++) snm = pick(STAFF_FIRST) + ' ' + pick(STAFF_LAST);
  const s = { id: uid(), role, name: snm, age: ri(32, 64), at, p, bio: pick(BIOS[role]), lean: ri(5, 95), rel: 55, perf: 50, boost: 0, boostW: 0, contract: ri(1, 3), tenure: 0 };
  s.wage = Math.round(230 * Math.pow(1.38, ov - 5) * (0.85 + rnd() * 0.3) * (1 + (p.ego - 10) * 0.02) / 5) * 5;
  if (role === 'coach') s.style = pick(Object.keys(STYLES));
  return s;
}
const ovr = s => (s.at[0] + s.at[1] + s.at[2]) / 3;
const staff = r => G.staff[r] || null;
function eff(r, i) { const s = staff(r); if (!s) return 4; const base = i == null ? ovr(s) : s.at[i]; return clamp(base + s.boost / 3 + (s.rel - 50) / 50 + (HOOK.effBonus ? HOOK.effBonus(r, i) : 0), 1, 22); }
function man(r, k) { const m = G.mand[r]; if (m && m[k] != null) return m[k]; const d = MAND[r]; for (const x of d.sl) if (x[0] === k) return x[3]; for (const x of d.ru) if (x[0] === k) return x[3]; return 50; }
function defaultMandate(r) { const o = {}; for (const x of MAND[r].sl) o[x[0]] = x[3]; for (const x of MAND[r].ru) o[x[0]] = x[3]; return o; }

/* ---------- DNA ---------- */
const DNA = [
  { k: 'origin', q: 'How was the club born?', o: [
    { v: 'phoenix', l: 'Phoenix club', d: 'Reformed by supporters after the old club went bust. Loyal fans, thin wallet.', e: 'Fans ++ · Cash −' },
    { v: 'investor', l: 'Investor project', d: 'A wealthy backer funds the vision and expects a return. Deep pockets, impatient board.', e: 'Cash ++ · Fans − · Board patience −' },
    { v: 'works', l: 'Works team', d: 'Founded by the town\'s biggest employer. A sponsor for life, if you keep them happy.', e: 'Sponsors ++' },
    { v: 'merger', l: 'Merger of two village clubs', d: 'Two rival villages, one badge. A bigger catchment and old grudges.', e: 'Fans + · Cash + · Internal friction' }] },
  { k: 'style', q: 'What does our football look like?', o: [
    { v: 'possession', l: 'Possession', d: 'Patient build-up, the ball is ours. Needs technical players.', e: 'Coach fit matters' },
    { v: 'pressing', l: 'High press', d: 'Win it back in their half. Demands fitness and intense training.', e: 'Coach fit matters' },
    { v: 'counter', l: 'Counter-attack', d: 'Compact, then lethal on the break. Pace is everything.', e: 'Coach fit matters' },
    { v: 'direct', l: 'Direct', d: 'Get it forward, win the second ball. Honest and effective low down.', e: 'Coach fit matters' }] },
  { k: 'talent', q: 'Where do our players come from?', o: [
    { v: 'academy', l: 'Our own academy', d: 'We grow our own. Slow, cheap and beloved when it works.', e: 'Academy-first mandates · Board wants debuts' },
    { v: 'smart', l: 'Smart market', d: 'Undervalued players found through data. Buy low, sell high.', e: 'Data-led mandates' },
    { v: 'proven', l: 'Proven professionals', d: 'Experienced players who deliver now. Expensive, reliable.', e: 'Experience-led mandates' }] },
  { k: 'money', q: 'How is the club funded?', o: [
    { v: 'self', l: 'Self-sustaining', d: 'We spend what we earn. Slow but safe.', e: 'Low risk' },
    { v: 'owner', l: 'Owner-backed', d: 'The owner tops up the accounts every week, for now.', e: 'Weekly injection · Board watches results' },
    { v: 'debt', l: 'Leveraged growth', d: 'A bank loan to accelerate. Interest bites every week.', e: 'Cash ++ · Debt ++' }] },
  { k: 'identity', q: 'What do we stand for?', o: [
    { v: 'community', l: 'Community club', d: 'Affordable tickets, local faces, part of the town.', e: 'Fans value prices and locals' },
    { v: 'brand', l: 'Commercial brand', d: 'A modern club built to grow revenue and reach.', e: 'Sponsors + · Fans expect less' },
    { v: 'ideals', l: 'Principled club', d: 'No betting money, fair prices, values before revenue.', e: 'Press + · Some deals off-limits' }] },
  { k: 'ambition', q: 'How fast do we climb?', o: [
    { v: 'patient', l: 'Patient', d: 'A ten-year plan. The board accepts slow progress.', e: 'Mild targets' },
    { v: 'steady', l: 'Steady', d: 'Progress every season, no wild swings.', e: 'Fair targets' },
    { v: 'rocket', l: 'Rocket', d: 'Promotion every year, or heads roll.', e: 'Brutal targets · Big hype' }] },
  { k: 'ground', q: 'Where do we play?', o: [
    { v: 'old', l: 'The old town ground', d: '2,500 capacity, crumbling stands, real atmosphere. Cheap to run.', e: 'Small · Cheap' },
    { v: 'muni', l: 'Shared municipal stadium', d: '6,000 seats owned by the council. Weekly rent.', e: 'Medium · Rent' },
    { v: 'new', l: 'A new-build stadium', d: '12,000 seats on the edge of town, paid for with a construction loan.', e: 'Large · Big loan' }] },
];

function dnaMandates(d) {
  const m = {}; for (const r of ROLES) m[r.id] = defaultMandate(r.id);
  if (d.talent === 'academy') { m.dof.youth = 75; m.dof.maxAge = '24'; m.coach.youthMins = 70; m.acad.pace = 70; m.acad.minGrads = '2'; m.acad.budget = 65; m.acad.philosophy = 20; m.acad.playUp = 'many'; }
  if (d.talent === 'smart') { m.dof.data = 80; m.scout.data = 75; m.scout.potential = 60; m.dof.sell = 65; m.scout.reg2 = 'sca'; }
  if (d.talent === 'proven') { m.dof.youth = 25; m.dof.maxAge = '32'; m.scout.potential = 25; m.dof.maxWage = '999'; }
  if (d.identity === 'community') { m.com.tickets = 30; m.mkt.reach = 20; m.acad.local = 70; }
  if (d.identity === 'brand') { m.com.tickets = 65; m.com.merch = 75; m.mkt.reach = 80; m.mkt.tone = 55; m.com.selectivity = 30; }
  if (d.identity === 'ideals') { m.com.betting = 'ban'; m.com.selectivity = 85; m.com.tickets = 25; m.mkt.tone = 20; }
  if (d.money === 'self') { m.fin.risk = 20; m.fin.transfer = 40; m.fin.wageCap = '50'; }
  if (d.money === 'owner') { m.fin.risk = 50; m.fin.transfer = 65; }
  if (d.money === 'debt') { m.fin.risk = 80; m.fin.transfer = 70; m.fin.wageCap = '70'; }
  if (d.style === 'pressing') m.coach.intensity = 75;
  if (d.style === 'possession' || d.style === 'counter') m.coach.attack = d.style === 'possession' ? 60 : 40;
  if (d.style === 'direct') m.coach.attack = 55;
  return m;
}

function alignment() {
  const d = G.club.dna, c = [];
  const ge = (v, t) => v >= t ? 1 : clamp(1 - (t - v) / 50, 0, 1), le = (v, t) => v <= t ? 1 : clamp(1 - (v - t) / 50, 0, 1);
  if (d.talent === 'academy') c.push(ge(man('dof', 'youth'), 55), ge(man('coach', 'youthMins'), 50), ge(man('acad', 'pace'), 45));
  if (d.talent === 'smart') c.push(ge(man('dof', 'data'), 60), ge(man('scout', 'data'), 55));
  if (d.talent === 'proven') c.push(le(man('dof', 'youth'), 50), +man('dof', 'maxAge') >= 28 ? 1 : 0.4);
  if (d.identity === 'community') c.push(le(man('com', 'tickets'), 55), le(man('mkt', 'reach'), 50));
  if (d.identity === 'brand') c.push(ge(man('com', 'merch'), 55), ge(man('mkt', 'reach'), 50));
  if (d.identity === 'ideals') c.push(man('com', 'betting') === 'ban' ? 1 : 0, ge(man('com', 'selectivity'), 60), le(man('com', 'tickets'), 50));
  if (d.money === 'self') c.push(le(man('fin', 'risk'), 50));
  const co = staff('coach'); c.push(!co || man('coach', 'style') === 'dna' || co.style === d.style ? 1 : 0.2);
  const base = c.reduce((a, b) => a + b, 0) / c.length * 100;
  return clamp(Math.round(base - G.club.drift), 0, 100);
}

/* ---------- world ---------- */
function townName(used) { for (let i = 0; i < 200; i++) { const n = pick(TOWN_A) + pick(TOWN_B); if (!used.has(n)) { used.add(n); return n; } } return 'Newtown' + uid(); }
function roundRobin(ids) {
  const a = shuffle(ids.slice()), n = a.length, rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const pr = []; for (let i = 0; i < n / 2; i++) { const h = a[i], w = a[n - 1 - i]; pr.push(r % 2 === 0 ? [h, w] : [w, h]); }
    rounds.push(pr); a.splice(1, 0, a.pop());
  }
  return rounds.concat(rounds.map(pr => pr.map(([h, w]) => [w, h])));
}
const blankRow = () => ({ p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
function buildFixtures() {
  for (let t = 1; t <= 8; t++) { const dv = G.divs[t]; dv.fix = roundRobin(dv.clubs); dv.tab = {}; for (const id of dv.clubs) dv.tab[id] = blankRow(); }
  if (G.club.deduct) { G.divs[G.club.tier].tab[0].pts = -G.club.deduct; G.club.deduct = 0; }
}
function genWorld() {
  const used = new Set([G.club.city]); G.clubs = {}; G.divs = {};
  for (let t = 1; t <= 8; t++) {
    const ids = [];
    for (let i = 0; i < 18; i++) {
      if (t === 8 && i === 0) { G.clubs[0] = { id: 0, name: G.club.name, short: G.club.short, tier: 8, me: true }; ids.push(0); continue; }
      const id = uid(); const town = townName(used);
      G.clubs[id] = { id, name: town + ' ' + pick(SUFFIX), short: town.slice(0, 3).toUpperCase(), tier: t, str: tierAvg(t) + gauss() * 1.1 };
      ids.push(id);
    }
    G.divs[t] = { clubs: ids };
  }
  buildFixtures();
}
function sortTable(t) { const dv = G.divs[t]; return dv.clubs.slice().sort((a, b) => { const x = dv.tab[a], y = dv.tab[b]; return y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf || cname(a).localeCompare(cname(b)); }); }
const cname = id => id === 0 ? G.club.name : G.clubs[id].name;
const myPos = () => sortTable(G.club.tier).indexOf(0) + 1;
function expectedRank() { const t = G.club.tier, me = teamStrength(); const xs = G.divs[t].clubs.filter(i => i !== 0).map(i => G.clubs[i].str); return 1 + xs.filter(s => s > me).length; }

/* ---------- squad & selection ---------- */
const squadAvail = () => G.squad.filter(p => p.inj <= 0 && p.susp <= 0);
function fit(p, slot) { return p.pos === slot ? 1 : NEAR[p.pos].includes(slot) ? 0.85 : slot === 'GK' || p.pos === 'GK' ? 0.3 : 0.6; }
const ordWord = n => ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'][n] || n + 'th';
const cact = k => HOOK.coachAct ? HOOK.coachAct(k) : man('coach', k);
function pickXI(noise) {
  const av = squadAvail().slice(), xi = [], ym = cact('youthMins') / 100, rot = cact('rotation') / 100;
  const sel = p => p.ca + (p.age <= 21 ? ym * 1.6 - 0.4 : 0) + (noise ? rot * rnd() * 1.8 : 0) + (p.settle ? 0 : -0.8) + (HOOK.selBonus ? HOOK.selBonus(p) : 0);
  for (const slot of SLOTS) {
    let best = null, bv = -99;
    for (const p of av) { if (xi.some(x => x.p === p)) continue; const v = sel(p) * fit(p, slot); if (v > bv) { bv = v; best = p; } }
    if (best) xi.push({ p: best, slot });
  }
  const bench = av.filter(p => !xi.some(x => x.p === p)).sort((a, b) => b.ca - a.ca).slice(0, 5);
  return { xi, bench };
}
function strengthParts(lineup) {
  const L = lineup || pickXI(false), P = { squad: tierAvg(G.club.tier) - 4, coach: 0, style: 0, morale: 0, extra: 0 };
  if (!L.xi.length) return P;
  let q = 0; for (const x of L.xi) q += x.p.ca * fit(x.p, x.slot) * (x.p.settle ? 1 : 0.94);
  P.squad = q / 11 - (11 - L.xi.length) * 0.6;
  const co = staff('coach'); P.coach = (eff('coach', 0) - 10) * 0.05;
  if (co) { const st = man('coach', 'style') === 'dna' ? G.club.dna.style : co.style; P.style = st === co.style ? (co.style === G.club.dna.style ? 0.3 : 0.2) : -0.1; } else P.style = -0.2;
  const mor = G.squad.reduce((a, p) => a + p.morale, 0) / Math.max(1, G.squad.length);
  P.morale = (mor - 60) / 40 * 0.35 + (eff('coach', 1) - 10) * 0.02; P.moraleAvg = mor;
  P.extra = (G.push.sporting > 0 ? 0.1 : 0) + (perk('analyst') ? 0.15 : 0) + (G.week <= 4 && G.phase === 'season' ? (G.preEdge || 0) : 0) + (G.matchEdge && G.matchEdge.w === G.week ? G.matchEdge.v : 0) + (HOOK.ftExtra ? HOOK.ftExtra() : 0);
  return P;
}
function teamStrength(lineup) { const P = strengthParts(lineup); return P.squad + P.coach + P.style + P.morale + P.extra; }

/* ---------- match simulation ---------- */
function expRand(m) { return -Math.log(1 - rnd()) * m; }
function simOurMatch(oppId, home, comp) {
  const opp = G.clubs[oppId], L = pickXI(true), me = teamStrength(L), os = opp.str + gauss() * 0.3;
  const d = me - os + (HOOK.homeEdge ? HOOK.homeEdge(home) : (home ? 0.35 : -0.35));
  const att = cact('attack') / 100, intn = cact('intensity') / 100, vol = 0.8 + 0.45 * att, share = 1 / (1 + Math.exp(-0.6 * d));
  let redUs = 0, redThem = 0;
  const OS = HOOK.oppStyle ? HOOK.oppStyle(oppId) : { vol: 1, oxg: 1 };
  const n = poisson(22.5 * vol * OS.vol), ev = [], onPitch = L.xi.map(x => x.p), mins = new Map(onPitch.map(p => [p.id, 0])), start = new Map(onPitch.map(p => [p.id, 0]));
  const ps = new Map(); const S2 = p => { if (!ps.has(p.id)) ps.set(p.id, { g: 0, a: 0, xg: 0, xa: 0, yc: 0, rc: 0 }); return ps.get(p.id); };
  let ug = 0, tg = 0, uxg = 0, txg = 0;
  const gk = L.xi.find(x => x.slot === 'GK');
  const chances = []; for (let i = 0; i < n; i++) chances.push({ m: rnd() < 0.46 ? ri(1, 47) : ri(46, 90) });
  for (let i = 0; i < 2; i++) if (rnd() < 0.55) chances.push({ m: ri(88, 95), late: 1 });
  // subs
  const subs = []; const bench = L.bench.slice(); const nsub = Math.min(3, bench.length);
  for (let i = 0; i < nsub; i++) subs.push({ m: ri(55, 82) });
  // cards & injuries
  const cards = []; const ny = ri(0, 3); for (let i = 0; i < ny; i++) cards.push({ m: ri(10, 90), red: chance(0.04) });
  const injP = 0.010 * (0.6 + cact('intensity') / 100 * 0.8) * (G.push.medical > 0 ? 0.6 : 1) * (perk('sci') ? 0.7 : 1) * (HOOK.ftInj ? HOOK.ftInj() : 1);
  const timeline = [...chances.map(c => ({ ...c, k: 'ch' })), ...subs.map(s => ({ ...s, k: 'sub' })), ...cards.map(c => ({ ...c, k: 'card' }))].sort((a, b) => a.m - b.m);
  const opName = opp.name, my = G.club.short;
  const live = () => onPitch.filter(Boolean);
  const pickW = (arr, f) => wpick(arr, f);
  ev.push({ m: 0, k: 'info', t: HOOK.say ? HOOK.say('ko', { home, opName, opp: oppId, comp }) : home ? `Kick-off at home against ${opName}.` : `Kick-off away at ${opName}.` });
  let ht = false;
  for (const e of timeline) {
    if (!ht && e.m > 45) { ht = true; ev.push({ m: 45, k: 'info', t: `Half-time: ${home ? ug + '–' + tg : tg + '–' + ug}.` }); }
    const lp = live(); if (!lp.length) break;
    if (e.k === 'ch') {
      { // the game reacts: score, red cards, mandate and fatigue shift who gets the chance
        const diff = ug - tg; let adj = -1.0 * redUs + 1.0 * redThem;
        if (diff < 0) adj += (0.25 + att * 0.3) * (e.m > 60 ? 1.3 : 1); else if (diff > 0) adj -= (0.25 + (e.m > 65 ? (1 - att) * 0.25 : 0)) * (e.m > 60 ? 1.3 : 1);
        if (e.m < 60) adj += (intn - 0.5) * 0.25; else if (e.m > 70) adj -= (intn - 0.5) * 0.3 * (HOOK.ftInj && HOOK.ftInj() < 1 ? 0.4 : 1);
        if (e.late && diff === 0) adj += (att - 0.5) * 0.4;
        e.us = rnd() < 1 / (1 + Math.exp(-0.6 * (d + adj))); e.push = diff;
      }
      if (e.us) {
        const sh = pickW(lp, p => ({ FW: 3, MF: 1.4, DF: 0.35, GK: 0 }[LINE[p.pos]]) * (p.a.fin + 2) * (HOOK.storyW ? HOOK.storyW(p) : 1));
        let xg = clamp(expRand(0.112) * (1 + 0.05 * (sh.a.fin - os)) * (e.push > 0 ? 1.15 : 1), 0.02, 0.78);
        const goal = rnd() < xg * (1 + (sh.a.com - 10) * 0.015);
        const as = chance(0.72) ? pickW(lp.filter(p => p !== sh), p => (p.a.pas + p.a.vis + (p.pos === 'W' || p.pos === 'FB' ? p.a.cro : 0)) * (LINE[p.pos] === 'GK' ? 0.1 : 1)) : null;
        S2(sh).xg += xg; uxg += xg; if (as) S2(as).xa += xg;
        if (goal) { ug++; S2(sh).g++; if (as) S2(as).a++; ev.push({ m: e.m, k: 'goal', us: 1, pid: sh.id, aid: as ? as.id : null, t: (HOOK.say ? HOOK.say('goal_us', { sh, as, m: e.m, home, ug, tg, xg, my }) : `GOAL ${my}! ${sh.name} finishes${as ? ' from ' + as.name + "'s pass" : ' on his own'}.`) + ` (xG ${xg.toFixed(2)})`, sc: [ug, tg] }); }
        else ev.push({ m: e.m, k: 'ch', us: 1, pid: sh.id, t: HOOK.say ? HOOK.say('ch_us', { sh, xg, m: e.m, big: xg > 0.3, ug, tg }) + ` (xG ${xg.toFixed(2)})` : xg > 0.3 ? `Huge chance! ${sh.name} should score but ${pick(['the keeper saves', 'drags it wide', 'hits the post', 'skies it'])}. (xG ${xg.toFixed(2)})` : `${sh.name} ${pick(['drives wide from distance', 'forces a save', 'heads over', 'curls one just past the post', 'sees his shot blocked'])}. (xG ${xg.toFixed(2)})` });
      } else {
        const ourDef = L.xi.filter(x => LINE[x.slot] === 'DF').reduce((a, x) => a + x.p.ca, 0) / 4 || 5;
        let xg = clamp(expRand(0.112) * (1 + 0.05 * (os - ourDef)) * (e.push < 0 ? 1.15 : 1) * (1 + (att - 0.5) * 0.2) * OS.oxg, 0.02, 0.78);
        const kp = gk ? gk.p : null;
        const goal = rnd() < xg * (1 - (kp ? (kp.a.ref - os) * 0.03 : -0.3));
        txg += xg;
        if (goal) { tg++; ev.push({ m: e.m, k: 'goal', us: 0, t: (HOOK.say ? HOOK.say('goal_them', { opp: oppId, opName, m: e.m, xg, ug, tg, home }) : `Goal ${opName}. ${pick(['A header from a corner', 'A low drive into the corner', 'A defensive mix-up punished', 'A tap-in at the back post', 'A long-range screamer'])}.`) + ` (xG ${xg.toFixed(2)})`, sc: [ug, tg] }); }
        else if (xg > 0.25) ev.push({ m: e.m, k: 'ch', us: 0, pid: kp ? kp.id : null, t: (HOOK.say ? HOOK.say('ch_them', { kp, opp: oppId, opName, m: e.m, xg }) : kp ? `${kp.name} with a big save to deny ${opName}.` : `${opName} miss a sitter.`) + ` (xG ${xg.toFixed(2)})` });
      }
    } else if (e.k === 'sub' && bench.length) {
      const outs = lp.filter(p => p.pos !== 'GK'); if (!outs.length) continue;
      const out = outs.sort((a, b) => a.ca - b.ca + (rnd() - 0.5) * 3)[0]; const inn = bench.shift();
      const i = onPitch.indexOf(out); onPitch[i] = inn; mins.set(out.id, e.m - start.get(out.id)); start.set(inn.id, e.m); mins.set(inn.id, 0);
      ev.push({ m: e.m, k: 'sub', us: 1, pid: inn.id, t: HOOK.say ? HOOK.say('sub', { inn, out, m: e.m, ug, tg }) : `Substitution: ${inn.name} replaces ${out.name}.` });
    } else if (e.k === 'card') {
      const usCard = chance(0.5);
      if (usCard) { const p = pick(lp.filter(x => x.pos !== 'GK').length ? lp.filter(x => x.pos !== 'GK') : lp); if (e.red || (p.pers.temp > 16 && chance(0.15))) { S2(p).rc++; p.susp = 2; const i = onPitch.indexOf(p); mins.set(p.id, e.m - start.get(p.id)); onPitch[i] = null; redUs++; ev.push({ m: e.m, k: 'card', us: 1, red: 1, t: `Red card! ${p.name} is sent off.` }); } else { S2(p).yc++; ev.push({ m: e.m, k: 'card', us: 1, t: pick([`Yellow card for ${p.name}.`, `${p.name} goes into the book.`, `A late tackle, ${p.name} is booked.`, `${p.name} booked for dissent.`]) }); } }
      else if (e.red) { redThem++; ev.push({ m: e.m, k: 'card', us: 0, red: 1, t: `Red card for ${opName}! They are down to ten.` }); } else ev.push({ m: e.m, k: 'card', us: 0, t: pick([`${opName} player booked.`, `Yellow for ${opName} after a cynical foul.`, `${opName} pick up a booking.`, `The referee books one of ${opName}.`]) });
    }
  }
  if (!ht) ev.push({ m: 45, k: 'info', t: `Half-time: ${home ? ug + '–' + tg : tg + '–' + ug}.` });
  // minutes, injuries & stats
  for (const p of onPitch) if (p) mins.set(p.id, 90 - start.get(p.id));
  const result = ug > tg ? 'W' : ug < tg ? 'L' : 'D';
  const out = [];
  for (const [id, mn] of mins) {
    const p = G.squad.find(x => x.id === id); if (!p) continue;
    const s = ps.get(id) || { g: 0, a: 0, xg: 0, xa: 0, yc: 0, rc: 0 };
    const f = mn / 90;
    const prg = poisson(f * (p.a.pas + p.a.vis) / 6 * (LINE[p.pos] === 'GK' ? 0.2 : 1) * (0.7 + share * 0.6));
    const dt = poisson(f * (LINE[p.pos] === 'FW' ? 7 : LINE[p.pos] === 'GK' ? 1 : 9));
    let dw = 0; const pw = clamp(0.3 + (p.a.tac + p.a.str - 2 * os) / 60 + 0.18, 0.15, 0.85); for (let i = 0; i < dt; i++) if (rnd() < pw) dw++;
    let rat = 6.2 + s.g * 0.9 + s.a * 0.55 + (s.xg + s.xa) * 0.6 + (result === 'W' ? 0.35 : result === 'L' ? -0.35 : 0) + (dt ? (dw / dt - 0.5) * 0.8 : 0) + prg * 0.03 - s.rc * 1.5 + gauss() * 0.35;
    if ((LINE[p.pos] === 'DF' || p.pos === 'GK') && tg === 0 && mn > 60) rat += 0.5;
    if ((LINE[p.pos] === 'DF' || p.pos === 'GK')) rat -= tg * 0.15;
    rat = clamp(rat, 4, 10);
    const st = p.st; st.apps++; st.mins += mn; st.g += s.g; st.a += s.a; st.xg += s.xg; st.xa += s.xa; st.prg += prg; st.dw += dw; st.dt += dt; st.rat += rat; st.yc += s.yc; st.rc += s.rc;
    p.car.apps++; p.car.g += s.g; p.car.a += s.a; p.lastRat = rat; p.rats = (p.rats || []).concat(rat).slice(-4);
    { p.capps = (p.capps || 0) + 1; const ms = t => { (p.ms = p.ms || []).push({ s: G.season, w: G.week, t }); (G.msNew = G.msNew || []).push({ pid: p.id, t }); };
      if (p.capps === 1 && !p.academy) ms(`Debut for the club against ${opName}${s.g ? ', and scores' : ''}.`);
      else if (s.g && !p.fg) ms(`First goal for the club, against ${opName}.`);
      if (s.g) p.fg = true;
      if (s.g >= 3) ms(`Hat-trick against ${opName}.`);
      else if (rat >= 8.6) ms(`Man of the match against ${opName}, rated ${rat.toFixed(1)}.`);
      if (p.capps === 50 || p.capps === 100) ms(`${p.capps} games for the club.`); }
    if (p.academy && !p.debut) { p.debut = true; G.ss.grads++; G.paper.stories.push({ h: 'Academy debut', t: `${p.name} (${p.age}) becomes the latest academy graduate to play for the first team.` }); G.st.fans = clamp(G.st.fans + 2, 0, 100); }
    if (mn > 0 && chance(injP * f)) { p.inj = ri(1, 7); out.push(p); ev.push({ m: ri(20, 88), k: 'inj', us: 1, t: `${p.name} pulls up injured.` }); if (p.inj >= 4) { (p.ms = p.ms || []).push({ s: G.season, w: G.week, t: `Injured against ${opName}, out for ${p.inj} weeks.` }); (G.msNew = G.msNew || []).push({ pid: p.id, t: `Injured, out for ${p.inj} weeks.` }); } }
    p.yc = (p.yc || 0) + s.yc; if (p.yc >= 5) { p.yc = 0; p.susp = Math.max(p.susp, 1); }
  }
  ev.sort((a, b) => a.m - b.m);
  ev.push({ m: 90, k: 'ft', t: `Full time. ${home ? G.club.name + ' ' + ug + '–' + tg + ' ' + opName : opName + ' ' + tg + '–' + ug + ' ' + G.club.name}.` });
  const motm = [...mins.keys()].map(id => G.squad.find(x => x.id === id)).filter(Boolean).sort((a, b) => b.lastRat - a.lastRat)[0];
  return { comp, home, opp: oppId, oppName: opName, ug, tg, uxg, txg, ev, result, dpre: +(me - os).toFixed(2), edge: +(d - (me - os)).toFixed(2), reds: [redUs, redThem], xi: L.xi.map(x => x.p.id), injured: out, motm: motm ? motm.name : '', att: home ? attendance() : 0 };
}
function quickSim(h, a) { const d = G.clubs[h].str - G.clubs[a].str + 0.3; return [poisson(1.48 * Math.exp(0.22 * d)), poisson(1.17 * Math.exp(-0.22 * d))]; }
function applyResult(t, h, a, hg, ag) { if (G.clubs[h]) G.clubs[h].fm = (G.clubs[h].fm || []).concat(hg > ag ? 'W' : hg < ag ? 'L' : 'D').slice(-5); if (G.clubs[a]) G.clubs[a].fm = (G.clubs[a].fm || []).concat(ag > hg ? 'W' : ag < hg ? 'L' : 'D').slice(-5); const tab = G.divs[t].tab, H = tab[h], A = tab[a]; H.p++; A.p++; H.gf += hg; H.ga += ag; A.gf += ag; A.ga += hg; if (hg > ag) { H.w++; A.l++; H.pts += 3; } else if (hg < ag) { A.w++; H.l++; A.pts += 3; } else { H.d++; A.d++; H.pts++; A.pts++; } }

/* ---------- finance ---------- */
const playerWages = () => G.squad.reduce((a, p) => a + p.wage, 0);
const staffWages = () => ROLES.reduce((a, r) => a + (G.staff[r.id] ? G.staff[r.id].wage : 0), 0);
const ticketPrice = () => Math.round(14 * (0.6 + man('com', 'tickets') / 100) * (1 + (8 - G.club.tier) * 0.12) * 2) / 2;
function attendance() {
  if (HOOK.attendance) return HOOK.attendance();
  const pf = 0.6 + man('com', 'tickets') / 100, form = G.form.slice(-5).reduce((a, r) => a + (r === 'W' ? 1 : r === 'L' ? -1 : 0), 0);
  const turn = clamp(0.58 + (G.st.fans - 50) / 180 + form * 0.025 - (pf - 1.05) * 0.35, 0.25, 1);
  return Math.round(Math.min(G.club.cap, G.club.fanbase * turn));
}
function revenueAvg() { const f = G.fin; return f.revW >= 4 ? f.revSum / f.revW : f.lastRev ? f.lastRev / SEASON_WEEKS : estRevenue(); }
function estRevenue() { const c = G.club; return (950 * sc() + sponsorIncome() + attendance() * ticketPrice() / 2 + c.fanbase * 0.25 * (0.5 + man('com', 'merch') / 100) * (0.6 + c.brand / 100 * 0.8)) * 1.3; }
function sponsorIncome() { const c = G.club; const deals = c.deals.reduce((a, d) => a + d.wk, 0); return Math.round(deals + 620 * sc() * (0.5 + G.st.spons / 100) * (0.8 + eff('com', 1) / 50)); }
function wageRatio() { return playerWages() / Math.max(1, revenueAvg()); }
function transferBudget() {
  const wk = playerWages() + staffWages(); const reserveW = 8 - man('fin', 'risk') / 100 * 10;
  const avail = G.club.cash - reserveW * wk; const share = staff('fin') ? 0.25 + 0.6 * man('fin', 'transfer') / 100 : 0.4;
  const kit = (G.club.kitty || 0) * (staff('fin') ? 0.6 + 0.8 * man('fin', 'transfer') / 100 : 0.8);
  return Math.max(0, Math.round(Math.min(Math.max(0, G.club.cash), kit + Math.max(0, avail * share)) / 100) * 100);
}
function weeklyFinance(home) {
  const c = G.club, i = {}, o = {};
  if (home) i.gate = HOOK.gate ? HOOK.gate() : Math.round(c.lastAtt * ticketPrice() * (perk('ticket') ? 1.08 : 1));
  i.tv = Math.round(950 * sc());
  i.sponsors = sponsorIncome();
  i.merch = Math.round((perk('store') ? 1.3 : 1) * c.fanbase * 0.25 * (0.5 + man('com', 'merch') / 100) * (0.6 + c.brand / 100 * 0.8) * (0.85 + eff('com', 2) / 70));
  if (c.dna.money === 'owner' && c.ownerOn) i.owner = M(1200);
  if (HOOK.acadIncome) { const ai = HOOK.acadIncome(); if (ai) i.academy = ai; }
  o.playerWages = playerWages(); o.staffWages = staffWages();
  const bud = k => (0.3 + man(k, 'budget') / 100 * 1.4);
  o.scouting = (staff('scout') ? M(300) * bud('scout') : 0) + (HOOK.recCost ? HOOK.recCost() : 0);
  o.academy = Math.round(M(380) * (staff('acad') ? bud('acad') : 0.5) * (1 + c.fac.youth * 0.08)) + (HOOK.acadCost ? HOOK.acadCost() : 0);
  o.marketing = staff('mkt') ? M(250) * bud('mkt') : 0;
  o.ground = Math.round(c.cap * 0.12 + c.rent + c.fac.train * M(40));
  o.facilities = Math.round(M(320) * man('fin', 'invest') / 100);
  if (c.debt > 0) o.interest = Math.round(c.debt * (c.rate || 0.0012));
  const pw = projWeekly(); if (pw) o.projects = pw;
  if (HOOK.ftCost) { const fc = HOOK.ftCost(); if (fc) o.firstTeam = fc; }
  if (HOOK.deptCost) { const dc = HOOK.deptCost(); for (const k in dc) if (dc[k]) o[k] = dc[k]; }
  if (HOOK.merchMult) i.merch = Math.round(i.merch * HOOK.merchMult());
  let disc = (1 - (eff('fin', 1) - 10) * 0.015 - (G.push.business > 0 ? 0.05 : 0)) * (HOOK.costDisc ? HOOK.costDisc() : 1); if (!staff('fin')) disc = 1.08;
  for (const k of ['scouting', 'academy', 'marketing', 'ground', 'staffWages', 'deptStaff', 'firstBudget', 'comBudget', 'matchday', 'community', 'facilities']) if (o[k]) o[k] = Math.round(o[k] * disc);
  const tin = Object.values(i).reduce((a, b) => a + b, 0), tout = Object.values(o).reduce((a, b) => a + b, 0);
  c.cash += tin - tout;
  G.fin.last = { i, o, tin, tout }; G.fin.revSum += tin - (i.owner || 0); G.fin.revW++;
  G.ss.rev += tin; G.ss.exp += tout;
  c.facProg += o.facilities / M(320) * 0.06;
  if (c.facProg >= 1) { c.facProg -= 1; if (c.fac.train < 10) { c.fac.train++; G.paper.stories.push({ h: 'Training ground', t: `Facility investment pays off: the training ground is upgraded to level ${c.fac.train}.` }); } }
  G.fin.hist.push(Math.round(c.cash)); if (G.fin.hist.length > 120) G.fin.hist.shift();
}

/* ---------- transfers ---------- */
const window_ = () => G.phase === 'summer' || (HOOK.summerStart ? G.week <= 2 : G.week <= 4) || (G.week >= 17 && G.week <= (HOOK.seasonWeekly ? 18 : 19));
function squadNeeds() { const need = []; for (const pos in REQ) { const n = G.squad.filter(p => p.pos === pos).length; if (n < REQ[pos]) need.push(pos); } return need; }
function weakestPos() { let wp = null, wv = 99; for (const pos in REQ) { const ps = G.squad.filter(p => p.pos === pos).sort((a, b) => b.ca - a.ca); const v = ps.length ? ps[0].ca : 0; if (v < wv) { wv = v; wp = pos; } } return wp; }
function genTarget(pos, free) {
  const reg = staff('scout') ? (chance(0.62) ? man('scout', 'reg1') : man('scout', 'reg2')) : 'dom';
  const pot = man('scout', 'potential') / 100;
  const age = clamp(Math.round(pot > 0.6 ? ri(17, 24) : pot < 0.35 ? ri(24, 33) : ri(19, 30)), 16, 35);
  const net = (G.club.net[reg] || 0) / 100;
  const ca = tierAvg(G.club.tier) + gauss() * 1.5 + (eff('scout', 0) - 10) * 0.07 + net * 0.8 + man('scout', 'budget') / 100 * 0.4 - (free ? 1.3 : 0) + (age > 29 ? 0.4 : 0) - (age < 21 ? 1 : 0);
  const p = genPlayer({ pos, age, ca, region: reg, paBonus: (eff('scout', 1) - 10) * 0.05 + (pot - 0.5) });
  p.fee = free ? 0 : Math.round(p.value * REGIONS[reg].cost * (1 - (eff('dof', 1) - 10) * 0.02) * (0.85 + rnd() * 0.35) / 100) * 100;
  p.wage = Math.round(wageFor(p.ca) * (1 + (age > 28 ? 0.15 : 0)) * (0.95 + rnd() * 0.2) / 5) * 5;
  const dataW = clamp((man('dof', 'data') + man('scout', 'data')) / 200 + (perk('data') ? 0.35 : 0), 0, 1.2);
  const nCA = clamp(2.6 - (eff('scout', 0) + eff('dof', 0)) / 20 - dataW * 0.7, 0.35, 3), nPA = clamp(3 - eff('scout', 1) / 10 - (1 - dataW) * 0.8, 0.5, 3.5);
  p.pCA = p.ca + gauss() * nCA; p.pPA = Math.max(p.pCA, p.pa + gauss() * nPA);
  return p;
}
function scoreTarget(p) { const y = man('dof', 'youth') / 100; return (p.prio ? 1.2 : 0) + p.pCA * (1 - y * 0.45) + p.pPA * y * 0.45 + (p.age <= 23 ? y * 0.6 : 0) - (p.age >= 30 ? y * 0.8 : 0); }
function allowed(p, budget) {
  const avgW = playerWages() / Math.max(1, G.squad.length);
  const r = { fee: p.fee <= (man('dof', 'maxFee') === '0' ? 0 : budget * (+man('dof', 'maxFee')) / 100) && p.fee <= budget, age: p.age <= +man('dof', 'maxAge'), wage: p.wage <= avgW * (+man('dof', 'maxWage')) / 100 + 1, cap: (playerWages() + p.wage) / Math.max(1, revenueAvg()) <= +man('fin', 'wageCap') / 100 + 0.05 };
  r.ok = r.fee && r.age && r.wage && r.cap; return r;
}
function sign(p, viaRule) {
  G.club.cash -= p.fee; p.contract = ri(2, 4); p.morale = 72; p.joined = G.season; p.st = newStats();
  if (chance(REGIONS[p.region].adapt * (staff('acad') ? 1 : 1))) { p.settle = false; p.morale = 45; }
  p.scoutStars = p.pCA != null ? stars(p.pCA) : null; (G.signLog = G.signLog || []).push({ pid: p.id, name: p.name, fee: p.fee, wage: p.wage, season: G.season, est: p.scoutStars, rule: !!viaRule });
  G.club.kitty = Math.max(0, (G.club.kitty || 0) - p.fee); G.shortlist = (G.shortlist || []).filter(x => x !== p);
  delete p.pCA; delete p.pPA; G.squad.push(p); G.ss.signings++; G.ss.spent += p.fee; G.dofSigned = p.name;
  G.paper.stories.push({ h: 'Signing', t: `${staffName('dof')} ${viaRule ? 'gets his exception and signs' : 'signs'} ${p.name} (${p.age}, ${POS_L[p.pos]}) from ${REGIONS[p.region].name} ${p.fee ? 'for ' + money(p.fee) : 'on a free'}. Wage ${money(p.wage)}/wk.` });
}
function staffName(r) { const s = staff(r); return s ? s.name : 'Nobody'; }
function protectedIds() {
  const ids = new Set(G.promises.filter(x => x.k === 'keep' && x.status === 'open').map(x => x.pid));
  G.squad.forEach(p => { if (p.noSell) ids.add(p.id); });
  const n = +man('acad', 'minGrads'); G.squad.filter(p => p.academy).sort((a, b) => b.pa - a.pa).slice(0, n).forEach(p => ids.add(p.id));
  return ids;
}
function administration() {
  const t = G.club.tier, tab = G.divs[t] && G.divs[t].tab && G.divs[t].tab[0]; if (tab) tab.pts -= 10;
  const prot = new Set(protectedIds()), sold = [];
  for (const p of G.squad.filter(x => !prot.has(x.id)).sort((a, b) => b.value - a.value).slice(0, 2)) { const fee = Math.round(p.value * 0.6 / 100) * 100; sellPlayer(p, fee, null); sold.push(p.name); }
  if (G.club.cash < M(5000)) { G.club.debt = (G.club.debt || 0) + (M(5000) - G.club.cash); G.club.cash = M(5000); }
  G.board.conf = clamp(Math.min(G.board.conf, 40) - 10, 12, 100); G.st.fans = clamp(G.st.fans - 12, 0, 100);
  G.flags.adminAt = G.season; G.flags.insolvent = 0; G.ss.admin = true;
  for (const r of ['scout', 'acad', 'mkt']) if (G.mand[r]) G.mand[r] = Object.assign({}, G.mand[r], { budget: 10 });
  if (G.paper) G.paper.stories.unshift({ h: 'Club enters administration', t: `Ten points deducted. ${sold.length ? sold.join(' and ') + ' sold to raise cash.' : ''} The administrators keep you on, for now. A second time and you are gone.` });
}
function sellPlayer(p, fee, how) {
  if (p.academy && HOOK.acadSale) HOOK.acadSale(p, fee);
  G.squad = G.squad.filter(x => x !== p); G.club.cash += fee; G.ss.sales++; G.ss.earned += fee;
  for (const pr of G.promises) if (pr.k === 'keep' && pr.pid === p.id && pr.status === 'open') { pr.status = 'broken'; G.st.fans = clamp(G.st.fans - 12, 0, 100); G.st.press = clamp(G.st.press - 8, 0, 100); G.board.conf = clamp(G.board.conf - 4, 0, 100); G.paper.stories.push({ h: 'Promise broken', t: `You promised ${p.name} was not for sale. Supporters have not forgotten.` }); }
  G.paper.stories.push({ h: fee ? 'Sale' : 'Release', t: how || `${p.name} leaves ${fee ? 'for ' + money(fee) : 'on a free'}.` });
}
function dofWork() {
  G.dofNote = null; const d = staff('dof'); if (!d || !window_()) return;
  const depth = 20 + Math.round(man('dof', 'depth') / 100 * 6), prot = protectedIds();
  // flagged for sale by the CEO
  const flag = G.squad.find(p => p.sellFlag && !prot.has(p.id)); if (flag && chance(0.6)) { const fee = Math.round(flag.value * (0.55 + rnd() * 0.3) / 100) * 100; flag.sellFlag = false; sellPlayer(flag, fee, `${d.name} sells ${flag.name} for ${money(fee)}, as you asked.`); }
  // trim
  if (G.squad.length > depth + 2) {
    const over = Object.keys(REQ).filter(pos => G.squad.filter(p => p.pos === pos).length > REQ[pos] + 1);
    const cand = G.squad.filter(p => !prot.has(p.id) && over.includes(p.pos) && p.joined < G.season).sort((a, b) => a.ca - b.ca)[0];
    if (cand && chance(0.5)) { const n = G.squad.filter(p => p.pos === cand.pos).length, fee = Math.round(cand.value * (0.45 + rnd() * 0.25) / 100) * 100; sellPlayer(cand, fee, `${d.name} sells ${cand.name} for ${money(fee)}: our ${ordWord(n)} ${POS_L[cand.pos].toLowerCase()}, surplus to needs.`); }
  }
  // incoming bids for our players
  const sellable = G.squad.filter(p => p.joined < G.season || G.phase !== 'summer' && p.joined < G.season + 1 && G.week > 19);
  if (chance(0.2) && G.squad.length > 16 && sellable.length) {
    const p = pick(sellable); const fee = Math.round(p.value * (0.85 + rnd() * 0.45) / 100) * 100; const top = G.squad.slice().sort((a, b) => b.ca - a.ca).slice(0, 3).includes(p);
    if (top || prot.has(p.id)) queueEvent('bid_star', { pid: p.id, fee, club: pick(G.divs[Math.max(1, G.club.tier - ri(0, 2))].clubs.filter(x => x !== 0)) });
    else if (rnd() < man('dof', 'sell') / 100 * 0.7 + (fee / p.value - 1)) sellPlayer(p, fee, `${d.name} accepts a ${money(fee)} bid for ${p.name}.`);
  }
  // signings
  if (HOOK.recWeekly) return;
  const need = squadNeeds(), full = G.squad.length >= depth + 1 && !need.length;
  if (!chance(G.squad.length < depth ? 0.75 : full ? 0.3 : 0.4)) return;
  const pos = G.dofPrio && chance(0.7) ? G.dofPrio : need.length ? pick(need) : chance(0.5) ? weakestPos() : pick(Object.keys(REQ));
  const budget = transferBudget(), free = man('dof', 'maxFee') === '0';
  const listed = (G.shortlist || []).filter(p => p.pos === pos), pool = listed.slice(); const nt = Math.max(2, 3 + Math.round(eff('dof', 2) / 6) - listed.length); for (let i = 0; i < nt; i++) pool.push(genTarget(pos, free || chance(0.25)));
  const worst = G.squad.filter(p => p.pos === pos).sort((a, b) => a.ca - b.ca)[0];
  const ok = pool.filter(p => allowed(p, budget).ok).sort((a, b) => scoreTarget(b) - scoreTarget(a));
  const best = ok[0], bestAny = pool.filter(p => p.fee <= Math.max(budget * 1.6, G.club.cash * 0.6)).sort((a, b) => scoreTarget(b) - scoreTarget(a))[0];
  if (bestAny && (!best || scoreTarget(bestAny) > scoreTarget(best) + 1.3) && (d.p.risk >= 11 || d.p.ego >= 13) && !pendingOf('dof_rule')) {
    const why = allowed(bestAny, budget); queueEvent('dof_rule', { player: bestAny, why: Object.keys(why).filter(k => k !== 'ok' && !why[k]) }); return;
  }
  G.dofSigned = null;
  if (best && (!worst || need.includes(pos) || scoreTarget(best) > worst.ca + 0.4)) { if (chance(0.55 + eff('dof', 1) / 40)) { sign(best); if (full && worst && !protectedIds().has(worst.id)) { const fee = Math.round(worst.value * 0.5 / 100) * 100; sellPlayer(worst, fee, `${d.name} moves ${worst.name} on ${fee ? 'for ' + money(fee) : 'on a free'} to make room.`); } } }
  const blk = new Set(); for (const p of pool.filter(p => !allowed(p, budget).ok && scoreTarget(p) > (best ? scoreTarget(best) : 0))) { const w = allowed(p, budget); for (const k of ['fee', 'age', 'wage', 'cap']) if (!w[k]) blk.add({ fee: 'fee limit', age: 'age limit', wage: 'wage limit', cap: 'wage cap' }[k]); }
  G.dofNote = { pos, n: pool.length, listed: listed.length, signed: G.dofSigned, blocked: [...blk] };
}

/* ---------- academy ---------- */
function academyIntake() {
  const c = G.club, n = clamp(2 + Math.round(c.fac.youth / 3 + eff('acad', 1) / 8), 2, 7), loc = man('acad', 'local') / 100, tech = man('acad', 'technical') / 100;
  const got = [];
  for (let i = 0; i < n; i++) {
    const reg = chance(loc) ? 'dom' : pick(Object.keys(REGIONS));
    const p = genPlayer({ age: ri(15, 17), ca: tierAvg(c.tier) - 3.5 - (8 - c.tier) * 0.25 + gauss() * 0.9 + c.fac.youth * 0.08, region: reg, academy: true, tech: tech > 0.6, phys: tech < 0.4, paBonus: (perk('partner') ? 0.6 : 0) + (eff('acad', 1) - 10) * 0.12 + c.fac.youth * 0.25 + (1 - loc) * 0.6 + (G.push.academy > 0 ? 0.5 : 0) });
    p.wage = Math.round(M(40) / 5) * 5; p.contract = 3; got.push(p); G.academy.push(p);
  }
  const best = got.sort((a, b) => b.pa - a.pa)[0];
  G.paper.stories.push({ h: 'Academy intake', t: `${got.length} new youngsters join the academy. ${staffName('acad')} rates ${best.name} (${best.pos}) highest.` });
  if (stars(best.pa) >= 4) queueEvent('wonderkid', { pid: best.id });
}

/* ---------- weekly systems ---------- */
function develop(p, mult) {
  if (p.age < 24 && p.ca < p.pa) {
    const minsF = p.academy && !G.squad.includes(p) ? 0.5 : clamp(p.st.mins / Math.max(1, G.week * 90), 0, 1);
    const devF = 0.55 + eff('coach', 2) / 20 * 0.5 + G.club.fac.train * 0.03 + minsF * 0.4 + cact('intensity') / 100 * 0.2 + (p.pers.prof - 10) * 0.02 + (HOOK.ftDev ? HOOK.ftDev() : 0);
    const g = (p.pa - p.ca) * 0.0055 * devF * mult;
    const w = POSW[p.pos]; for (const k in w) p.a[k] = clamp(p.a[k] + g * (0.6 + rnd() * 0.8), 1, 20);
  } else if (p.age >= 30) { for (const k of ['pac', 'sta', 'str']) p.a[k] = clamp(p.a[k] - 0.012 * (p.age - 29) * rnd() * 2, 1, 20); }
  upd(p);
}
function staffWeekly() {
  const form = G.form.slice(-6), ppg = form.length ? form.reduce((a, r) => a + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0) / form.length : 1.3;
  const sqAvg = G.squad.slice().sort((a, b) => b.ca - a.ca).slice(0, 14).reduce((a, p) => a + p.ca, 0) / 14;
  const netAvg = Object.values(G.club.net).reduce((a, b) => a + b, 0) / 7;
  const acadPA = G.academy.length ? G.academy.reduce((a, p) => a + stars(p.pa), 0) / G.academy.length : 2;
  const cashTrend = G.fin.hist.length > 4 ? G.fin.hist[G.fin.hist.length - 1] - G.fin.hist[G.fin.hist.length - 5] : 0;
  const tgt = { dof: 50 + (sqAvg - tierAvg(G.club.tier)) * 12, coach: 20 + ppg * 25 + (expectedRank() - myPos()) * 1.5, scout: 25 + netAvg * 0.9, acad: 20 + acadPA * 15 + G.club.fac.youth * 2, com: G.st.spons, mkt: (G.st.fans + G.club.brand) / 2, fin: 50 + clamp(cashTrend / Math.max(1, M(800)), -30, 30) };
  for (const r of ROLES) {
    const s = staff(r.id); if (!s) continue;
    s.perf = clamp(s.perf + ((tgt[r.id] || 50) + s.boost - s.perf) * 0.3, 0, 100);
    if (s.boostW > 0 && --s.boostW === 0) s.boost = 0;
    const lk = LEAN[r.id][0], dist = Math.abs(man(r.id, lk) - s.lean);
    if (dist > 40) s.rel -= 0.25 * (1 + (s.p.ego - 10) / 15);
    s.rel += (55 - s.rel) * 0.02;
    if (r.id === 'coach' && man('coach', 'style') === 'dna' && s.style !== G.club.dna.style && s.p.ego > 12) s.rel -= 0.3;
    s.rel = clamp(s.rel, 0, 100); s.tenure++;
    if (s.rel < 22 && s.p.ego > 11 && chance(0.12)) queueEvent('staff_leak', { role: r.id });
    if (s.rel < 15 && chance(0.15)) queueEvent('staff_quit', { role: r.id });
    if (s.perf > 72 && s.p.amb > 12 && chance(0.03)) queueEvent('staff_poach', { role: r.id });
  }
}
function kpiWeekly(res) {
  const c = G.club, st = G.st;
  // fans
  const fanTarget = 900 * Math.pow(sc(), 1.1) * (0.7 + c.brand / 100 * 0.6) * (c.dna.identity === 'community' ? 1.1 : 1);
  if (HOOK.fanWeekly) HOOK.fanWeekly(fanTarget); else c.fanbase = Math.round(c.fanbase + (fanTarget - c.fanbase) * 0.025 + (G.push.marketing > 0 ? fanTarget * 0.004 : 0));
  let df = (55 - st.fans) * 0.07;
  if (res) df += res === 'W' ? 1.8 : res === 'L' ? -2.4 : -0.3;
  if (man('com', 'tickets') > 65) df -= 0.5;
  if (c.dna.identity === 'community' && man('com', 'tickets') > 55) df -= 0.4;
  const al = alignment(); if (al < 60) df -= 0.5;
  st.fans = clamp(st.fans + df, 0, 100);
  st.spons = clamp(st.spons + (50 + c.brand * 0.2 - st.spons) * 0.04 + (res === 'W' ? 0.5 : 0) + (G.push.commercial > 0 ? 1.5 : 0), 0, 100);
  st.press = clamp(st.press + (50 - st.press) * 0.05 + (res === 'W' ? 0.6 : res === 'L' ? -0.6 : 0), 0, 100);
  const brandT = 25 + eff('mkt', 0) * 1.6 + eff('mkt', 1) * 0.8 + man('mkt', 'budget') * 0.15 + man('mkt', 'reach') * 0.08 + (8 - c.tier) * 3;
  c.brand = clamp(c.brand + (brandT - c.brand) * 0.03 + (G.push.marketing > 0 ? 1 : 0), 0, 100);
  // scouting network
  if (staff('scout')) { for (const k in c.net) { const focus = k === man('scout', 'reg1') ? 1 : k === man('scout', 'reg2') ? 0.6 : 0; const g = focus * (0.25 + eff('scout', 2) / 40 + man('scout', 'budget') / 200 + (G.push.scouting > 0 ? 1.2 : 0)); c.net[k] = clamp(c.net[k] + g - 0.08, 0, 100); } }
  else for (const k in c.net) c.net[k] = clamp(c.net[k] - 0.2, 0, 100);
  c.drift = Math.max(0, c.drift - 0.4);
  // deals
  for (const d of c.deals) d.weeks--; const ended = c.deals.filter(d => d.weeks <= 0); c.deals = c.deals.filter(d => d.weeks > 0);
  for (const d of ended) G.paper.stories.push({ h: 'Sponsorship', t: `The ${d.name} deal has run out.` });
  for (const k in G.push) if (G.push[k] > 0) G.push[k]--;
}
function boardWeekly(res) {
  const b = G.board; let d = 0;
  const exp = expectedRank(), pos = myPos();
  if (res) d += res === 'W' ? 0.8 : res === 'L' ? -1.3 * (exp <= 6 ? 1.2 : 0.9) : 0;
  d += (55 - b.conf) * 0.04;
  if (b.promiseWeek && absWeek() >= b.promiseWeek) { b.promiseWeek = 0; if (myPos() >= (G.flags.turnaround || 99)) { d -= 12; G.paper.stories.push({ h: 'Boardroom', t: 'The promised turnaround has not come. The board is furious.' }); } else { d += 4; G.paper.stories.push({ h: 'Boardroom', t: 'The board acknowledges the turnaround you promised.' }); } }
  const obj = b.obj.find(o => o.k === 'league');
  if (G.week > 8 && obj) d += pos > obj.target + 3 ? -0.7 : pos <= obj.target ? 0.35 : -0.1;
  if (G.club.cash < 0) d -= G.club.dna.money === 'owner' ? 0.6 : 1.4;
  if (G.st.fans < 30) d -= 0.5;
  if (alignment() < 50) d -= 0.4;
  if (G.club.dna.ambition === 'patient') d = d > 0 ? d : d * 0.75; if (G.club.dna.ambition === 'rocket' || G.club.dna.origin === 'investor') d = d < 0 ? d * 1.25 : d;
  b.conf = clamp(b.conf + d, 0, 100);
  if (b.conf <= 22 && !b.warned) { b.warned = true; queueEvent('board_warning', {}); }
  if (b.conf > 40) b.warned = false;
}

/* ---------- events & inbox ---------- */
const EV = {}; // filled by events.js
function defineEvent(id, def) { def.id = id; EV[id] = def; }
function queueEvent(id, ctx) { if (!EV[id]) return; if (G.queue.some(q => q.id === id) || pendingOf(id)) return; G.queue.push({ id, ctx: ctx || {} }); }
function pendingOf(id) { return G.inbox.some(m => m.ev === id && !m.done); }
function addMsg(id, ctx) { const e = EV[id]; const c = ctx || (e.setup ? e.setup() : {}); if (c === null) return false; const m = { id: uid(), ev: id, ctx: c, season: G.season, week: G.week, done: false }; G.inbox.unshift(m); G.cd[id] = absWeek() + (e.cd || 8); if (HOOK.desk) { try { HOOK.desk(e, m); } catch (err) { } } return true; }
const safe = f => { try { return f(); } catch (e) { return false; } };
function genMessages() {
  const forced = G.queue.splice(0, 4); for (const q of forced) addMsg(q.id, q.ctx);
  const ok = e => !e.forced && e.mode !== 'off' && (G.cd[e.id] || 0) <= absWeek() && !pendingOf(e.id) && (!e.cond || safe(e.cond));
  let slots = Math.max(0, (chance(0.55) ? 1 : 2) - forced.length), tries = 0;
  while (slots > 0 && tries++ < 10) { const el = Object.values(EV).filter(e => ok(e) && e.mode !== 'auto'); if (!el.length) break; const e = wpick(el, e => (e.w ? safe(e.w) || 0.5 : 1)); if (addMsg(e.id)) slots--; }
  let n = ri(1, 2); tries = 0;
  while (n > 0 && tries++ < 10) { const el = Object.values(EV).filter(e => ok(e) && e.mode === 'auto'); if (!el.length) break; const e = wpick(el, e => (e.w ? safe(e.w) || 0.5 : 1) * (G.push[e.dept] > 0 ? 2 : 1)); autoEvent(e); n--; }
  if (isMeeting(G.week)) genMeeting();
}
function autoEvent(e) {
  let c; try { c = e.setup ? e.setup() : {}; } catch (err) { return; } if (c === null) return;
  G.cd[e.id] = absWeek() + (e.cd || 8);
  const m = { ev: e.id, ctx: c }, idx = autoIndex(m), who = e.from === 'board' ? 'The board' : ROLE[e.from] ? (staff(e.from) ? staff(e.from).name : 'Nobody in charge') : 'The club office';
  let r, lab = '', title = ''; try { r = e.opts[idx].f(c); lab = typeof e.opts[idx].l === 'function' ? e.opts[idx].l(c) : e.opts[idx].l; title = typeof e.title === 'function' ? e.title(c) : e.title; } catch (err) { return; }
  G.paper.stories.push({ h: `${ROLE[e.from] ? ROLE[e.from].s : 'Club'} handled it`, t: `${title}. ${who}: ${lab}. ${r || ''}`, auto: 1 });
}
function secondOpinion(msgId) {
  const m = G.inbox.find(x => x.id === msgId); if (!m || m.done) return null; const e = EV[m.ev]; if (!e.second) return { err: 'No second opinion available.' };
  const r = e.second.r; if (!staff(r)) return { err: `There is no ${ROLE[r].t} to ask.` }; if (m.second) return { err: 'Already asked.' }; if (G.ap < 1) return { err: 'No action points left this week.' };
  G.ap--; let t = ''; try { t = e.second.t(m.ctx); } catch (err) { t = 'He has nothing useful to add.'; } m.second = `${staff(r).name} (${ROLE[r].t}): ${t}`; return { out: m.second };
}

/* ---------- management meeting & projects (1.2) ---------- */
const PROP = {};
function defineProposal(id, d) { d.id = id; PROP[id] = d; }
const isMeeting = w => w === 17;
function nextMeeting() { for (let x = G.week; x <= SEASON_WEEKS; x++) if (isMeeting(x)) return x; return null; }
function genMeeting(nForce) {
  const active = G.projects || [], done = G.projDone || [];
  G.propCd = G.propCd || {}; const pool = Object.values(PROP).filter(d => (G.propCd[d.id] || 0) <= absWeek() && (d.repeat || !done.includes(d.id)) && !active.some(p => p.id === d.id) && (!d.cond || safe(d.cond)));
  const items = [];
  const nItems = nForce || 2;
  while (items.length < nItems && pool.length) {
    const d = wpick(pool, d => d.w ? safe(d.w) || 0.3 : 1); pool.splice(pool.indexOf(d), 1);
    const own = typeof d.owner === 'function' ? d.owner() : d.owner, st = staff(own); if (!st) continue;
    let c; try { c = d.setup ? d.setup() : {}; } catch (err) { continue; } if (c === null) continue; c.scale = 1;
    const p = clamp(d.p(c) + (eff(own, 0) - 10) * 0.015, 0.1, 0.95), bias = (st.p.ego - 10) * 0.018 + (st.p.risk - 10) * 0.01;
    const pc = clamp(p + bias + gauss() * clamp(0.22 - eff(own, 0) / 100, 0.04, 0.2), 0.08, 0.97);
    items.push({ id: d.id, ctx: c, owner: own, cost: Math.round(d.cost(c) / 100) * 100, wk: d.wk ? Math.round(d.wk(c)) : 0, dur: d.dur, p, pc, status: 'open', second: null, revised: false });
  }
  G.meeting = { week: G.week, season: G.season, items };
}
function proposalView(it) {
  const d = PROP[it.id], c = it.ctx, val = v => { try { return typeof v === 'function' ? v(c) : v; } catch (e) { return ''; } };
  const s = staff(it.owner);
  return { title: val(d.title), pitch: val(d.pitch), benefit: val(d.benefit), owner: staffName(it.owner), ownerRole: ROLE[it.owner].t, track: s && s.track ? s.track : { ok: 0, fail: 0 }, impact: d.impact ? (() => { try { return d.impact(c); } catch (e) { return []; } })() : [], cost: it.cost, wk: it.wk, dur: it.dur, pc: it.pc, status: it.status, second: it.second, revised: it.revised, secondRole: (d.second && d.second !== it.owner) ? d.second : (it.owner === 'fin' ? 'dof' : 'fin') };
}
function meetingPot() { const wk = playerWages() + staffWages(); return Math.max(0, Math.round((G.club.cash - (3 - man('fin', 'risk') / 100 * 3) * wk) / 100) * 100); }
function decideProposal(i, choice) {
  const it = G.meeting && G.meeting.items[i]; if (!it || it.status !== 'open') return { err: 'Already decided.' };
  const d = PROP[it.id], s = staff(it.owner);
  if (choice === 'second') {
    const r = proposalView(it).secondRole; if (!staff(r)) return { err: `There is no ${ROLE[r].t} to ask.` }; if (it.second) return { err: 'Already asked.' }; if (!G.meeting.pre && G.ap < 1) return { err: 'No action points left this week.' };
    if (!G.meeting.pre) G.ap--; const est = clamp(it.p + gauss() * clamp(0.18 - eff(r, 0) / 120, 0.03, 0.15), 0.05, 0.97);
    it.second = { name: staff(r).name, role: ROLE[r].t, est, t: est < it.pc - 0.12 ? 'thinks the pitch is optimistic' : est > it.pc + 0.08 ? 'is more positive than the pitch' : 'broadly agrees with the pitch' };
    return { out: `${staff(r).name} gives it ${Math.round(est * 100)}% and ${it.second.t}.` };
  }
  if (choice === 'revise') { if (it.revised) return { err: 'Already revised once.' }; it.revised = true; it.cost = Math.round(it.cost * 0.6 / 100) * 100; it.wk = Math.round(it.wk * 0.6); it.ctx.scale = 0.6; it.p = clamp(it.p + 0.08, 0, 0.97); it.pc = clamp(it.pc + 0.05, 0, 0.97); if (s) s.rel = clamp(s.rel - 1, 0, 100); return { out: 'Sent back for a slimmed-down version: cheaper and safer, with a smaller payoff.' }; }
  if (choice === 'reject') { it.status = 'rejected'; (G.propCd = G.propCd || {})[it.id] = absWeek() + 10; if (s) s.rel = clamp(s.rel - (s.p.ego > 13 ? 5 : 2), 0, 100); return { out: `${staffName(it.owner)} takes the rejection ${s && s.p.ego > 13 ? 'badly' : 'in his stride'}.` }; }
  if (choice === 'approve') {
    it.status = 'approved'; G.club.cash -= it.cost;
    (G.projects = G.projects || []).push({ id: it.id, ctx: it.ctx, owner: it.owner, ownerId: s ? s.id : null, start: absWeek(), due: absWeek() + it.dur, wk: it.wk, p: it.p, cost: it.cost });
    if (s) s.rel = clamp(s.rel + 3, 0, 100); if (d.onStart) safe(() => d.onStart(it.ctx));
    return { out: `Approved. ${money(it.cost)} committed. ${staffName(it.owner)} expects to deliver in ${it.dur} weeks.` };
  }
}
function lapseMeeting() { if (!G.meeting || G.meeting.pre || G.meeting.week !== G.week || G.meeting.season !== G.season) return; for (const it of G.meeting.items) if (it.status === 'open') { it.status = 'lapsed'; (G.propCd = G.propCd || {})[it.id] = absWeek() + 8; const s = staff(it.owner); if (s) s.rel = clamp(s.rel - 2, 0, 100); } }
function projectsWeekly() {
  G.projDone = G.projDone || []; G.projLog = G.projLog || [];
  for (const pr of (G.projects || []).slice()) {
    if (absWeek() < pr.due) continue; const d = PROP[pr.id], ok = rnd() < pr.p; let t = ''; try { t = d.done(pr.ctx, ok); } catch (e) { t = ''; }
    G.projects = G.projects.filter(x => x !== pr); if (!d.repeat) G.projDone.push(pr.id); else (G.propCd = G.propCd || {})[pr.id] = absWeek() + 12;
    const s = staff(pr.owner); if (s && s.id === pr.ownerId) { s.track = s.track || { ok: 0, fail: 0 }; s.track[ok ? 'ok' : 'fail']++; s.rel = clamp(s.rel + (ok ? 4 : -3), 0, 100); }
    if (!ok) G.board.conf = clamp(G.board.conf - (pr.cost > M(8000) ? 3 : 1), 0, 100);
    let title = ''; try { title = typeof d.title === 'function' ? d.title(pr.ctx) : d.title; } catch (e) { }
    G.projLog.unshift({ title, ok, season: G.season, week: G.week, t }); G.projLog = G.projLog.slice(0, 20);
    G.paper.stories.unshift({ h: ok ? 'Project delivered' : 'Project fails', t: `${title}: ${t}` });
  }
}
const projWeekly = () => (G.projects || []).reduce((a, p) => a + (p.wk || 0), 0);
const perk = k => !!(G.club.perks && G.club.perks[k]);

function msgView(m) {
  const e = EV[m.ev], c = m.ctx; const val = v => { try { return typeof v === 'function' ? v(c) : v; } catch (err) { return ''; } };
  const from = e.from === 'board' ? 'The board' : e.from === 'fans' ? 'Supporters\' trust' : e.from === 'press' ? 'The press' : staff(e.from) ? staff(e.from).name + ', ' + ROLE[e.from].t : ROLE[e.from] ? ROLE[e.from].t + ' (vacant)' : e.from;
  const ai = autoIndex(m);
  return { from, role: e.from, dept: e.dept, title: val(e.title) || 'A matter for your desk', body: val(e.body) || 'The people involved have moved on. Any choice will close the file.', opts: e.opts.map(o => ({ l: val(o.l) || 'Close the file', h: val(o.h) })), auto: ai, autoWho: e.from === 'board' ? 'the board' : ROLE[e.from] ? (staff(e.from) ? staff(e.from).name : 'nobody, the role is vacant, so it falls to chance and') : 'the club office', done: m.done, choice: m.choice, outcome: m.outcome, by: m.by, del: !!m.del, err: !!m.err, esc: !!m.esc, why: m.why || val(e.why) || (e.forced ? 'A consequence of an earlier decision, or something your staff cannot settle alone.' : 'It falls outside what your mandates let staff decide alone.'), second: e.second ? { role: ROLE[e.second.r].t, avail: !!staff(e.second.r), name: staffName(e.second.r), text: m.second || null } : null };
}
function autoIndex(m) { const e = EV[m.ev]; if (!ROLE[e.from] || staff(e.from)) return e.auto ? clamp(e.auto(m.ctx), 0, e.opts.length - 1) : 0; return e.vacant != null ? e.vacant : e.opts.length - 1; }
function resolve(m, idx, by) {
  const e = EV[m.ev]; m.done = true; m.choice = idx; m.by = by;
  let r; try { r = e.opts[idx].f(m.ctx); } catch (err) { r = 'The situation resolved itself.'; } m.outcome = r || 'Done.';
  if (by !== 'you') { let lab = ''; try { lab = typeof e.opts[idx].l === 'function' ? e.opts[idx].l(m.ctx) : e.opts[idx].l; } catch (err) { } G.paper.stories.push({ h: by === 'The board' ? 'Board decision' : by === 'The club office' ? 'Club decision' : 'Staff decision', t: `${by}: ${lab}. ${m.outcome}` }); }
  return m.outcome;
}
function respond(msgId, idx) { if (over()) return { err: 'You no longer run the club.' }; const m = G.inbox.find(x => x.id === msgId); if (!m || m.done) return null; if (G.ap < 1) return { err: 'No action points left this week.' }; G.ap--; return { out: resolve(m, idx, 'you') }; }

/* ---------- player actions ---------- */
function talk(role, tone) {
  const s = staff(role); if (!s) return { err: 'That position is vacant.' }; if (G.ap < 1) return { err: 'No action points left this week.' };
  if (tone === 'review' && record(role).early) return { err: 'Too early in the season: there are not enough numbers to review yet.' };
  G.ap--; const recent = (G.talks[role] || -99) > absWeek() - 3; G.talks[role] = absWeek(); const k = recent ? 0.5 : 1;
  const { ego, amb, loy } = s.p; let rel = 0, boost = 0, t = '';
  if (tone === 'review') { const rc = record(role); if (rc.score >= 62) { rel = 6; boost = 5; t = `The numbers back him up (${rc.verdict.toLowerCase()}). ${s.name} appreciates that you have done your homework.`; } else if (rc.score <= 40) { rel = ego > 15 ? -6 : -2; boost = 6; t = ego > 15 ? `${s.name} disputes every figure, but he knows they are bad. Expect a reaction.` : `Hard to argue with the data. ${s.name} accepts the review and commits to fixing it.`; } else { rel = 1; boost = 2; t = `A useful, unspectacular review. The numbers are mixed and ${s.name} knows it.`; } }
  if (tone === 'praise') { if (s.perf >= 55) { rel = 6; boost = 4; t = `${s.name} appreciates the recognition and pushes on.`; } else if (ego > 13) { rel = 3; boost = -3; t = `${s.name} takes the praise as licence to coast.`; } else { rel = 4; boost = 1; t = `${s.name} is grateful, if a little surprised.`; } }
  if (tone === 'challenge') { if (amb >= 12) { rel = -1; boost = 7; t = `${s.name} relishes the challenge and raises his standards.`; } else if (ego >= 13) { rel = -8; boost = -2; t = `${s.name} bristles. He does not like being told how to do his job.`; } else { rel = -3; boost = 3; t = `${s.name} nods and gets to work, a little stung.`; } }
  if (tone === 'reassure') { if (s.perf < 45) { rel = 5; boost = 3; t = `${s.name} looks relieved. Your backing steadies him.`; } else { rel = 1; boost = 0; t = `${s.name} wonders why you seem worried.`; } }
  if (tone === 'warn') { if (s.perf < 40) { rel = -6; boost = 6; t = `${s.name} gets the message. Results had better improve.`; if (loy < 8 && s.rel < 40 && chance(0.4)) queueEvent('staff_quit', { role }); } else { rel = -10; boost = -1; t = `${s.name} feels the warning is unfair. Trust has taken a hit.`; } }
  s.rel = clamp(s.rel + rel * k, 0, 100); s.boost = clamp(s.boost + boost * k, -10, 12); s.boostW = 4;
  if (recent) t += ' (A second talk so soon has less effect.)';
  return { out: t };
}
const PUSH = { sporting: ['First team', 'coach', 'dof'], scouting: ['Scouting', 'scout', null], academy: ['Academy', 'acad', 'dof'], commercial: ['Commercial', 'com', 'mkt'], marketing: ['Marketing', 'mkt', 'com'], business: ['Business', 'fin', null], medical: ['Medical', 'coach', null] };
function push(dept) {
  if (G.ap < 1) return { err: 'No action points left this week.' }; G.ap--; G.push[dept] = 3;
  const [l, own, rival] = PUSH[dept]; if (staff(own)) staff(own).rel = clamp(staff(own).rel + 3, 0, 100); if (rival && staff(rival)) staff(rival).rel = clamp(staff(rival).rel - 2, 0, 100);
  return { out: `${l} has your full backing for three weeks.${rival && staff(rival) ? ' ' + staff(rival).name + ' notices where your attention is going.' : ''}` };
}
function setMandate(role, m, free) {
  const old = G.mand[role]; if (!free) { if (G.ap < 1) return { err: 'No action points left this week.' }; G.ap--; }
  G.mand[role] = Object.assign({}, m); const s = staff(role); let t = 'New mandate issued.';
  if (s && !free) { let dist = 0; for (const x of MAND[role].sl) dist += Math.abs((m[x[0]] || 0) - (old[x[0]] || 0)); for (const x of MAND[role].ru) if (m[x[0]] !== old[x[0]]) dist += 25;
    if (dist > 90) { s.rel = clamp(s.rel - 4 - (s.p.ego - 10) * 0.4, 0, 100); t = `${s.name} accepts the new mandate but finds the change of course hard to explain to his department.`; }
    const lk = LEAN[role][0]; if (Math.abs(m[lk] - s.lean) < 20) { s.rel = clamp(s.rel + 3, 0, 100); t += ` ${s.name} likes this direction.`; } }
  return { out: t };
}
function fire(role) {
  const s = staff(role); if (!s) return { err: 'Vacant.' }; if (G.ap < 1) return { err: 'No action points left this week.' }; G.ap--;
  const cost = Math.round(s.wage * Math.max(8, s.contract * 20)); G.club.cash -= cost; G.staff[role] = null; G.cands[role] = genCands(role);
  G.st.press = clamp(G.st.press - 2, 0, 100); for (const r of ROLES) if (G.staff[r.id]) G.staff[r.id].rel = clamp(G.staff[r.id].rel - 2, 0, 100);
  if (role === 'coach' && G.week > 2) G.board.conf = clamp(G.board.conf + (myPos() > expectedRank() ? 3 : -4), 0, 100);
  G.paper.stories.push({ h: 'Dismissal', t: `${s.name} has left the club as ${ROLE[role].t}. Compensation: ${money(cost)}.` });
  return { out: `${s.name} is gone. Compensation paid: ${money(cost)}.` };
}
function genCands(role) { const t = G.club.tier; return [genStaff(role, t, 1.2), genStaff(role, t, 0), genStaff(role, t, -1)].sort((a, b) => b.wage - a.wage); }
function hire(role, idx) { const s = G.cands[role][idx]; if (!s) return; G.staff[role] = s; s.rel = 60; G.cands[role] = null; if (G.phase === 'season') G.paper.stories.push({ h: 'Appointment', t: `${s.name} is appointed ${ROLE[role].t}.` }); return s; }

/* ---------- press ---------- */
const PRESS = [
  { id: 'goal', q: () => 'What is the target this season?', a: [['We are going up. Promotion, nothing less.', 'promo', { fans: 8, press: 4, board: 3 }], ['Top half and steady growth.', 'tophalf', { fans: 2 }], ['No targets. We build quietly.', null, { press: -4, fans: -2 }]] },
  { id: 'youth', q: () => 'Will local kids get a chance at this club?', a: [['Three academy debuts this season. I guarantee it.', 'youth', { fans: 6 }], ['If they are good enough, yes.', null, {}], ['We need results, not projects.', null, { fans: -3, press: 2 }]] },
  { id: 'star', q: () => `Is ${bestPlayer().name} for sale?`, a: [() => [`${bestPlayer().name} is not for sale. Full stop.`, 'keep', { fans: 5 }], ['Every player has a price.', null, { fans: -4, press: 3 }], ['That is a question for our Director of Football.', null, { press: -2 }]] },
  { id: 'tickets', q: () => 'Supporters worry about ticket prices. Your view?', a: [['Prices stay affordable. That is a promise.', 'tickets', { fans: 6, spons: -2 }], ['Prices follow the market.', null, { fans: -4, spons: 3 }], ['We will consult the supporters.', null, { fans: 2 }]] },
  { id: 'style', q: () => 'What will supporters see on the pitch?', a: [['Attacking football. We will score goals.', 'attack', { fans: 5, press: 3 }], ['A team that is hard to beat.', null, {}], ['Whatever wins.', null, { fans: -2, press: 2 }]] },
  { id: 'money', q: () => 'Is the club financially sound?', a: [['We will not spend money we do not have.', 'nodebt', { spons: 3, board: 4 }], ['Ambition costs money. We will invest.', null, { fans: 3, board: -2 }], ['I will not discuss finances.', null, { press: -4 }]] },
  { id: 'coach', q: () => `Why ${staffName('coach')} as head coach?`, a: [['He has my full trust. He is the right man.', null, { rel: ['coach', 6] }], ['He knows what is expected of him.', null, { board: 2, rel: ['coach', -2] }], ['Results will decide his future.', null, { press: 3, rel: ['coach', -7] }]] },
];
const PROMISE_T = { promo: 'Win promotion this season', tophalf: 'Finish in the top half', youth: 'Give three academy players a debut', keep: p => `Keep ${p} at the club`, tickets: 'Keep ticket prices affordable', attack: 'Score 50+ league goals', nodebt: 'Finish the season with cash in the bank' };
function bestPlayer() { return G.squad.slice().sort((a, b) => b.ca - a.ca)[0]; }
function pressQuestions() { const ids = G.season === 1 && G.week === 1 && !G.pressDone ? ['goal', 'youth', 'tickets', 'coach'] : shuffle(['goal', 'youth', 'star', 'tickets', 'style', 'money', 'coach'].filter(i => i !== 'coach' || staff('coach'))).slice(0, 3); return ids.map(id => PRESS.find(p => p.id === id)).filter(p => p.id !== 'coach' || staff('coach')); }
function pressView(q) { return { id: q.id, q: q.q(), a: q.a.map(a => typeof a === 'function' ? a() : a).map(a => ({ t: a[0], promise: !!a[1], fx: a[2] || {} })) }; }
function pressAnswer(qid, i) {
  const q = PRESS.find(p => p.id === qid); let a = q.a[i]; if (typeof a === 'function') a = a(); const [t, pk, fx] = a;
  if (fx.fans) G.st.fans = clamp(G.st.fans + fx.fans, 0, 100); if (fx.press) G.st.press = clamp(G.st.press + fx.press, 0, 100); if (fx.spons) G.st.spons = clamp(G.st.spons + fx.spons, 0, 100); if (fx.board) G.board.conf = clamp(G.board.conf + fx.board, 0, 100);
  if (fx.rel && staff(fx.rel[0])) staff(fx.rel[0]).rel = clamp(staff(fx.rel[0]).rel + fx.rel[1], 0, 100);
  if (pk) { const pr = { k: pk, season: G.season, status: 'open' }; if (pk === 'keep') { const b = bestPlayer(); pr.pid = b.id; pr.t = PROMISE_T.keep(b.name); } else pr.t = PROMISE_T[pk]; G.promises.push(pr); }
  return t;
}

/* ---------- season ---------- */
function setObjectives() {
  const d = G.club.dna, exp = expectedRank(); let target;
  if (d.ambition === 'rocket') target = 3; else if (d.ambition === 'steady') target = clamp(exp - 1, 2, 14); else target = clamp(exp + 2, 3, 15);
  if (G.club.tier === 1) target = Math.min(target, 10);
  const o = [{ k: 'league', target, t: `Finish ${ord(target)} or higher` }];
  o.push(d.money === 'debt' ? { k: 'cashmin', target: -M(20000), t: `Keep cash above ${money(-M(20000))}` } : { k: 'cash', target: 0, t: 'Finish the season with cash in the bank' });
  if (d.talent === 'academy') o.push({ k: 'grads', target: 3, t: 'Give three academy players a debut' });
  else if (d.identity === 'community') o.push({ k: 'fans', target: 55, t: 'Keep supporter mood at 55 or higher' });
  else if (d.identity === 'brand') o.push({ k: 'brand', target: Math.min(90, Math.round(G.club.brand + 8)), t: `Grow brand strength to ${Math.min(90, Math.round(G.club.brand + 8))}` });
  else o.push({ k: 'align', target: 70, t: 'Keep DNA alignment at 70 or higher' });
  G.board.obj = o;
}
function objMet(o) { const pos = myPos(); switch (o.k) { case 'league': return pos <= o.target; case 'cash': return G.club.cash >= 0; case 'cashmin': return G.club.cash >= o.target; case 'grads': return G.ss.grads >= o.target; case 'fans': return G.st.fans >= o.target; case 'brand': return G.club.brand >= o.target; case 'align': return alignment() >= o.target; case 'fanbase': return G.club.fanbase >= o.target; case 'wagecap': return wageRatio() * 100 <= +man('fin', 'wageCap'); case 'profit': return G.ss.earned >= G.ss.spent; case 'fill': return (G.ss.attN ? G.ss.attSum / G.ss.attN : 0) >= o.target; case 'topxg': return G.ss.xgf >= G.ss.xga; } if (HOOK.objMet) return HOOK.objMet(o); return false; }
function promiseMet(p) { const pos = myPos(); switch (p.k) { case 'promo': return pos <= 3 && G.club.tier > 1; case 'tophalf': return pos <= 9; case 'youth': return G.ss.grads >= 3; case 'keep': return G.squad.some(x => x.id === p.pid); case 'tickets': return G.ss.maxTicket <= 50; case 'attack': return G.divs[G.club.tier].tab[0].gf >= 50; case 'nodebt': return G.club.cash >= 0; } return false; }

function endSeason() {
  if (G.phase === 'sacked') return G.lastReport || null;
  const t = G.club.tier, pos = myPos(), rep = { season: G.season, tier: t, pos, tierName: TIERS[t], objectives: [], promises: [], moves: [], prize: 0 };
  rep.prize = Math.round((19 - pos) * 900 * sc() / 100) * 100; G.club.cash += rep.prize;
  let bd = 0;
  for (const o of G.board.obj) { const met = objMet(o); rep.objectives.push({ t: o.t, met }); bd += met ? (o.bold ? 7 : 4) : o.k === 'league' ? -(8 + Math.max(0, pos - o.target) * 1.5) * (o.bold ? 1.3 : 1) : o.soft ? -3 : -7; }
  for (const p of G.promises.filter(p => p.season === G.season)) { if (p.status === 'open') p.status = promiseMet(p) ? 'kept' : 'broken'; rep.promises.push({ t: p.t, kept: p.status === 'kept' }); if (p.status === 'kept') { G.st.fans = clamp(G.st.fans + 5, 0, 100); G.st.press = clamp(G.st.press + 4, 0, 100); } else { G.st.fans = clamp(G.st.fans - 8, 0, 100); G.st.press = clamp(G.st.press - 6, 0, 100); bd -= 3; } }
  G.board.conf = clamp(G.board.conf + bd, 0, 100); rep.boardDelta = Math.round(bd);
  if (G.club.cash < 0 && G.club.dna.money !== 'debt') { G.club.deduct = 6; rep.deduct = 6; G.board.conf = clamp(G.board.conf - 6, 0, 100); }
  // promotion/relegation across pyramid
  const up = {}, down = {};
  for (let tt = 1; tt <= 8; tt++) { const tab = sortTable(tt); up[tt] = tt > 1 ? tab.slice(0, 3) : []; down[tt] = tt < 8 ? tab.slice(-3) : []; if (tt === t) rep.table = tab.map(id => ({ id, n: cname(id), ...G.divs[tt].tab[id] })); rep.champions = rep.champions || {}; rep.champions[tt] = cname(tab[0]); }
  for (let tt = 1; tt <= 8; tt++) { for (const id of up[tt]) move(id, tt, tt - 1); for (const id of down[tt]) move(id, tt, tt + 1); }
  function move(id, from, to) { const a = G.divs[from].clubs; a.splice(a.indexOf(id), 1); G.divs[to].clubs.push(id); if (id === 0) { G.club.tier = to; G.clubs[0].tier = to; rep.moves.push(to < from ? 'promoted' : 'relegated'); } else G.clubs[id].tier = to; }
  rep.newTier = G.club.tier;
  if (G.club.tier < t) { G.board.conf = clamp(G.board.conf + 12, 0, 100); G.st.fans = clamp(G.st.fans + 12, 0, 100); G.club.stepUp = G.season + 1; }
  if (G.club.tier > t) { G.board.conf = clamp(G.board.conf - 15, 0, 100); G.st.fans = clamp(G.st.fans - 10, 0, 100); if (G.board.conf < 30 && G.season - (G.board.second || -99) >= 4) { G.board.second = G.season; G.board.conf = 32; rep.second = true; } }
  if (CAPREQ[G.club.tier] && G.club.cap < CAPREQ[G.club.tier]) { const cost = Math.round((CAPREQ[G.club.tier] - G.club.cap) * 12 * sc() / 100) * 100; G.club.cash -= cost; G.club.cap = CAPREQ[G.club.tier]; rep.licence = `Licensing: temporary stands to reach ${CAPREQ[G.club.tier].toLocaleString('en-GB')} seats cost ${money(cost)}.`; }
  for (const id in G.clubs) { const c = G.clubs[id]; if (c.me) continue; c.str += (tierAvg(c.tier) - c.str) * 0.3 + gauss() * 0.45; }
  // players
  rep.leavers = []; rep.renewed = [];
  const med = G.squad.map(p => p.ca).sort((a, b) => a - b)[Math.floor(G.squad.length / 2)] || 0;
  for (const p of G.squad.slice()) {
    p.age++; p.contract--; p.lastSeason = { ...p.st }; p.st = newStats(); p.yc = 0; if (!p.settle && chance(0.7)) { p.settle = true; p.morale = 60; }
    if (p.contract <= 0 && HOOK.summerStart) { p.contract = 0; p.expiring = true; }
    else if (p.contract <= 0) {
      const want = p.ca >= med - 0.3 || (p.age <= 22 && p.pa > p.ca + 1.5);
      const newW = Math.round(Math.max(p.wage, wageFor(p.ca)) * 1.1 / 5) * 5, avgW = playerWages() / G.squad.length;
      if (want && staff('dof') && newW <= avgW * (+man('dof', 'maxWage')) / 100 * 1.1 && !(p.pers.amb > 16 && p.ca > med + 1.5 && chance(0.4))) { p.wage = newW; p.contract = ri(2, 3); rep.renewed.push(p.name); }
      else { G.squad = G.squad.filter(x => x !== p); rep.leavers.push(p.name); }
    }
    if (p.age >= 36 || (p.age >= 33 && chance(0.25))) { if (G.squad.includes(p)) { G.squad = G.squad.filter(x => x !== p); rep.leavers.push(p.name + ' (retires)'); } }
    upd(p);
  }
  // academy
  rep.promoted = [];
  if (HOOK.acadSeason) HOOK.acadSeason(rep); else {
  const thr = tierAvg(G.club.tier) - 1.6 - man('acad', 'pace') / 100 * 1.2;
  for (const p of G.academy.slice()) { p.age++; upd(p); if (p.age >= 17 && (p.ca >= thr || (p.age >= 18 && stars(p.pa) >= 3.5)) && G.squad.length < 28) { G.academy = G.academy.filter(x => x !== p); p.contract = 2; p.wage = Math.round(wageFor(p.ca) * 0.6 / 5) * 5; p.st = newStats(); G.squad.push(p); rep.promoted.push(p.name); } else if (p.age >= 19) G.academy = G.academy.filter(x => x !== p); }
  }
  // staff contracts
  rep.staff = [];
  for (const r of ROLES) { const s = staff(r.id); if (!s) continue; s.contract--; if (s.contract <= 0) { if (s.rel >= 38) { s.contract = ri(1, 3); s.wage = Math.round(s.wage * 1.08 / 5) * 5; rep.staff.push(`${s.name} signs a new contract.`); } else { G.staff[r.id] = null; G.cands[r.id] = genCands(r.id); rep.staff.push(`${s.name} (${r.t}) leaves as his contract expires.`); } } }
  if (HOOK.recSeason) HOOK.recSeason(rep);
  G.lastReport = rep; G.history.push({ season: G.season, tier: t, pos, pts: G.divs[G.club.tier] && rep.table ? rep.table.find(x => x.id === 0).pts : 0 });
  if (G.board.conf <= 0 && HOOK.seasonReprieve && HOOK.seasonReprieve()) { /* one last chance */ }
  else if (G.board.conf <= 0) { sack('The board has lost all confidence after a dismal season.', 'season'); return rep; }
  if (over()) return rep;
  G.phase = 'review';
  return rep;
}
function startSeason() {
  if (over()) return;
  G.season++; G.week = 1; G.ap = 3; G.form = []; G.inbox = G.inbox.filter(m => !m.done).slice(0, 5); G.queue = [];
  G.fin.lastRev = G.ss.rev; G.ss = newSeasonStats(); G.fin.revSum = 0; G.fin.revW = 0; G.club.kitty = kittyFor(G.fin.lastRev);
  if (G.club.dna.money === 'owner' && G.club.ownerOn) G.club.cash += M(15000);
  G.paper = { stories: [] }; let filled = 0;
  while (!HOOK.summerStart && G.squad.length < 18) { const need = squadNeeds(), pos = need.length ? need[0] : weakestPos(); const p = genTarget(pos, true); p.fee = 0; sign(p); filled++; }
  const fillStories = G.paper.stories;
  buildFixtures(); setObjectives(); snapStart(); G.pressDone = false; if (HOOK.summerStart) HOOK.summerStart(); else setupPreseason();
  G.paper = { headline: `Season ${G.season} begins`, sub: `${G.club.name} start life in the ${TIERS[G.club.tier]}.${filled ? ` ${filled} free agents were signed over the summer to fill a threadbare squad.` : ''}`, stories: fillStories };
}
const newSeasonStats = () => ({ grads: 0, signings: 0, sales: 0, spent: 0, earned: 0, rev: 0, exp: 0, maxTicket: 0, lg: 0, xgf: 0, xga: 0, attSum: 0, attN: 0, start: null });

/* ---------- staff work, records & chains (1.1) ---------- */
function later(id, ctx, a, b) { (G.later = G.later || []).push({ at: absWeek() + ri(a, b), id, ctx: ctx || {} }); }
function kittyFor(rev) { const d = G.club.dna; let k = Math.max(M(7000), (rev || 0) * 0.1); k *= { self: 0.7, owner: 1.4, debt: 1.2 }[d.money] || 1; if (d.origin === 'investor') k *= 1.4; return Math.round(k / 100) * 100; }
function snapStart() { G.ss.start = { spons: sponsorIncome(), fanbase: G.club.fanbase, cash: G.club.cash, brand: G.club.brand }; }
function scoutWork() {
  const s = staff('scout'); G.shortlist = (G.shortlist || []).filter(p => absWeek() - p.found < 12);
  if (!s) { G.scoutNote = null; return; }
  const games = 2 + Math.round(man('scout', 'budget') / 25 + eff('scout', 2) / 6);
  const n = chance(0.35 + man('scout', 'budget') / 200) ? (chance(0.3) ? 2 : 1) : 0, need = squadNeeds(), added = [];
  for (let i = 0; i < n; i++) { const pos = need.length && chance(0.6) ? pick(need) : chance(0.5) ? weakestPos() : pick(Object.keys(REQ)); const cands = [0, 1, 2].map(() => genTarget(pos, chance(0.2))).sort((a, b) => scoreTarget(b) - scoreTarget(a)); const p = cands[0]; const worst = G.squad.filter(x => x.pos === pos).sort((a, b) => a.ca - b.ca)[0]; if (worst && p.pCA < worst.ca - 0.3 && !need.includes(pos)) continue; p.found = absWeek(); G.shortlist.push(p); added.push(p); }
  G.shortlist = G.shortlist.slice(-8);
  G.scoutNote = { games, added: added.map(p => ({ name: p.name, age: p.age, pos: p.pos, reg: p.region, s: stars(p.pCA), ps: stars(p.pPA) })) };
}
function buildReports(o) {
  const R = [], add = (role, t) => R.push({ role, t }), dn = G.dofNote, sn = G.scoutNote;
  for (const r of ROLES) if (!staff(r.id)) add(r.id, `Nobody is running ${r.dept}. Decisions there fall to chance.`);
  if (staff('dof')) add('dof', dn ? (dn.signed ? `Weighed ${dn.n} options for ${POS_L[dn.pos].toLowerCase()} (${dn.listed} from the scouts' shortlist) and signed ${dn.signed}.` : dn.blocked.length ? `Weighed ${dn.n} options for ${POS_L[dn.pos].toLowerCase()}. The best ones broke your rules: ${dn.blocked.join(', ')}.` : `Weighed ${dn.n} options for ${POS_L[dn.pos].toLowerCase()}; nobody good enough at the right price.`) : window_() ? 'Happy with the squad; no business this week.' : `Window closed. ${G.squad.filter(p => p.contract <= 1).length} contracts expire this summer.`);
  if (staff('scout') && sn) add('scout', `Watched ${sn.games} matches. ${sn.added.length ? 'Added ' + sn.added.map(p => `${p.name} (${p.age}, ${p.pos}, ${REGIONS[p.reg].name}, rated ${p.s}★ now, ${p.ps}★ potential)`).join(' and ') + ' to the shortlist.' : 'Nobody new worth a shortlist place.'} Shortlist: ${G.shortlist.length}.`);
  if (staff('coach') && o) { const best = G.squad.filter(p => p.lastRat).sort((a, b) => b.lastRat - a.lastRat)[0], inj = G.squad.filter(p => p.inj > 0).length; add('coach', `${o.result === 'W' ? 'Pleased' : o.result === 'L' ? 'Frustrated' : 'Mixed feelings'}: we created ${o.uxg.toFixed(1)} xG and allowed ${o.txg.toFixed(1)}.${best ? ' ' + best.name + ' stood out.' : ''} ${inj ? inj + ' injured.' : 'Fully fit squad.'}`); }
  if (staff('acad')) { const top = G.academy.slice().sort((a, b) => b.pa - a.pa)[0]; add('acad', top ? `${G.academy.length} in the academy. ${top.name} (${top.age}) is the standout: ${stars(top.ca)}★ now, ${stars(top.pa)}★ potential.` : 'The academy is empty until the intake in week 28.'); }
  if (staff('com')) add('com', `Sponsorship at ${money(sponsorIncome())}/wk.${o && o.home ? ` Crowd ${o.att.toLocaleString('en-GB')} of ${G.club.cap.toLocaleString('en-GB')} at ${money(ticketPrice())} a ticket.` : ''}`);
  if (staff('mkt')) { const d = G.club.fanbase - (G.prevFan || G.club.fanbase); add('mkt', `Supporter base ${G.club.fanbase.toLocaleString('en-GB')} (${d >= 0 ? '+' : ''}${d} this week), brand strength ${Math.round(G.club.brand)}.`); }
  if (staff('fin')) { const L = G.fin.last, wr = Math.round(wageRatio() * 100), cp = +man('fin', 'wageCap'); add('fin', `Week result ${L.tin - L.tout >= 0 ? '+' : ''}${money(L.tin - L.tout)}. Player wages at ${wr}% of revenue (cap ${cp}%)${wr > cp ? ', over the cap' : wr > cp - 5 ? ', close to the cap' : ''}. Transfer budget ${money(transferBudget())}.`); }
  G.reports = R;
}
const avgRat = p => p.st.apps ? p.st.rat / p.st.apps : null;
function squadAvgRat() { const r = G.squad.map(avgRat).filter(x => x != null); return r.length ? r.reduce((a, b) => a + b, 0) / r.length : 6.5; }
function record(role) {
  const L = [], ss = G.ss, s0 = ss.start || {}, add = (l, v, g) => L.push([l, v, g]); let sc = 50;
  const early = ss.lg < 4;
  if (role === 'dof') {
    const sig = (G.signLog || []).filter(x => x.season === G.season).map(x => ({ x, p: G.squad.find(p => p.id === x.pid) }));
    const rated = sig.filter(o => o.p && o.p.st.apps >= 3), sa = squadAvgRat(), ar = rated.length ? rated.reduce((a, o) => a + avgRat(o.p), 0) / rated.length : null, flops = rated.filter(o => avgRat(o.p) < 6.4).length;
    add('Signings this season', sig.length, null);
    add('Average rating of signings', ar ? `${ar.toFixed(2)} (squad ${sa.toFixed(2)})` : 'Too early', ar ? ar >= sa : null);
    add('Flops, rating under 6.4', rated.length ? `${flops} of ${rated.length}` : '–', rated.length ? flops === 0 : null);
    add('Spent / recouped', `${money(ss.spent)} / ${money(ss.earned)}`, ss.spent || ss.earned ? ss.earned >= ss.spent : null);
    sc = 50 + (ar ? (ar - sa) * 60 : 0) - flops * 8 + (ss.earned > ss.spent ? 6 : 0);
  } else if (role === 'coach') {
    const g = ss.lg, t = G.divs[G.club.tier].tab[0], ppg = g ? (t.w * 3 + t.d) / g : 0, xgd = g ? (ss.xgf - ss.xga) / g : 0, over = (t.gf - t.ga) - (ss.xgf - ss.xga);
    const tm = G.squad.reduce((a, p) => a + p.st.mins, 0), ym = G.squad.filter(p => p.age <= 21).reduce((a, p) => a + p.st.mins, 0);
    add('Points per game', g ? ppg.toFixed(2) : '–', g ? (ppg >= 1.6 ? true : ppg < 1.1 ? false : null) : null);
    add('xG difference per game', g ? (xgd >= 0 ? '+' : '') + xgd.toFixed(2) : '–', g ? (xgd > 0.2 ? true : xgd < -0.2 ? false : null) : null);
    add('Results vs performances', !g ? '–' : over > 2.5 ? `Running hot: ${over.toFixed(1)} goals better than xG` : over < -2.5 ? `Unlucky: ${(-over).toFixed(1)} goals worse than xG` : 'In line with xG', null);
    add('Under-21 minutes', tm ? Math.round(ym / tm * 100) + '%' : '–', null);
    sc = 50 + (g ? (ppg - 1.35) * 30 + xgd * 35 : 0);
  } else if (role === 'scout') {
    const sl = G.shortlist || [], foc = ((G.club.net[man('scout', 'reg1')] || 0) + (G.club.net[man('scout', 'reg2')] || 0)) / 2;
    const ch = (G.signLog || []).map(x => ({ x, p: G.squad.find(p => p.id === x.pid) })).filter(o => o.p && o.x.est != null), acc = ch.length ? ch.reduce((a, o) => a + Math.abs(o.x.est - stars(o.p.ca)), 0) / ch.length : null;
    add('Shortlist', `${sl.length} players`, null);
    add('Average potential on shortlist', sl.length ? (sl.reduce((a, p) => a + stars(p.pPA), 0) / sl.length).toFixed(1) + '★' : '–', null);
    add('Network in focus regions', Math.round(foc) + ' / 100', foc >= 40 ? true : foc < 15 ? false : null);
    add('Rating accuracy on signings', acc == null ? '–' : acc <= 0.5 ? `Sharp (off by ${acc.toFixed(1)}★)` : `Off by ${acc.toFixed(1)}★`, acc == null ? null : acc <= 0.5);
    sc = 35 + foc * 0.45 + (acc != null ? (1 - acc) * 20 : 5);
  } else if (role === 'acad') {
    const pot = G.academy.length ? G.academy.reduce((a, p) => a + stars(p.pa), 0) / G.academy.length : 0, gr = G.squad.filter(p => p.academy).length;
    add('Prospects', G.academy.length, null); add('Average potential', pot ? pot.toFixed(1) + '★' : '–', pot ? pot >= 3 : null); add('Debuts this season', ss.grads, ss.grads >= 2 ? true : null); add('Graduates in first-team squad', gr, null);
    sc = 30 + pot * 10 + ss.grads * 6 + gr * 2;
  } else if (role === 'com') {
    const sp = sponsorIncome(), d = s0.spons ? sp / s0.spons - 1 : 0, att = ss.attN ? ss.attSum / ss.attN : null;
    add('Sponsorship per week', `${money(sp)} (${d >= 0 ? '+' : ''}${Math.round(d * 100)}% this season)`, d > 0.05 ? true : d < -0.05 ? false : null);
    add('Average stadium fill', att == null ? '–' : Math.round(att * 100) + '%', att == null ? null : att >= 0.7 ? true : att < 0.4 ? false : null);
    add('Ticket price', money(ticketPrice()), null);
    sc = 50 + d * 120 + (att != null ? (att - 0.55) * 50 : 0);
  } else if (role === 'mkt') {
    const fd = s0.fanbase ? (G.club.fanbase / s0.fanbase - 1) * 100 : 0, bd = G.club.brand - (s0.brand || G.club.brand);
    add('Supporter base', `${G.club.fanbase.toLocaleString('en-GB')} (${fd >= 0 ? '+' : ''}${fd.toFixed(1)}%)`, fd > 2 ? true : fd < -2 ? false : null);
    add('Brand strength', `${Math.round(G.club.brand)} (${bd >= 0 ? '+' : ''}${Math.round(bd)})`, bd > 2 ? true : bd < -2 ? false : null);
    add('Supporter mood', Math.round(G.st.fans), G.st.fans >= 60 ? true : G.st.fans < 35 ? false : null);
    sc = 50 + fd * 2 + bd * 2 + (G.st.fans - 50) * 0.3;
  } else if (role === 'fin') {
    const wr = wageRatio() * 100, cp = +man('fin', 'wageCap'), cd = G.club.cash - (s0.cash || 0);
    add('Player wages vs revenue', `${Math.round(wr)}% (cap ${cp}%)`, wr <= cp);
    add('Cash this season', (cd >= 0 ? '+' : '') + money(cd), cd >= 0);
    add('Revenue / costs', `${money(ss.rev)} / ${money(ss.exp)}`, ss.rev ? ss.rev >= ss.exp : null);
    sc = 50 + (cp - wr) * 1.2 + clamp(cd / Math.max(1, M(600)), -20, 20);
  }
  sc = clamp(Math.round(sc), 0, 100);
  return { lines: L, score: sc, verdict: early ? 'Too early' : sc >= 62 ? 'Strong' : sc <= 40 ? 'Poor' : 'Mixed', early };
}

/* ---------- analysis & scorecards (1.3) ---------- */
function xPts(a, b) { const pmf = (l, k) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return Math.exp(-l) * Math.pow(l, k) / f; }; let w = 0, d = 0; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) { const pr = pmf(a, i) * pmf(b, j); if (i > j) w += pr; else if (i === j) d += pr; } return 3 * w + d; }
function forecast() {
  const t = G.club.tier, dv = G.divs[t], left = SEASON_WEEKS - (G.week - 1);
  const proj = dv.clubs.map(id => { const r = dv.tab[id]; const ppg = r.p ? r.pts / r.p : (id === 0 ? 1.3 : 1.3); return { id, pts: r.pts + ppg * Math.max(0, SEASON_WEEKS - r.p) }; }).sort((a, b) => b.pts - a.pts);
  return proj.findIndex(x => x.id === 0) + 1;
}
function analysis() {
  const t = G.club.tier, pos = myPos(), obj = G.board.obj.find(o => o.k === 'league'), target = obj ? obj.target : 9, tab = sortTable(t), dv = G.divs[t];
  const me = dv.tab[0] || { pts: 0, gf: 0, ga: 0 }, tgtPts = (dv.tab[tab[Math.min(tab.length, target) - 1]] || me).pts, gap = tgtPts - me.pts, g = G.ss.lg || 0;
  const P = strengthParts(), ours = P.squad, others = dv.clubs.filter(i => i !== 0).map(i => G.clubs[i].str).sort((a, b) => b - a);
  const divAvg = others.reduce((a, b) => a + b, 0) / others.length, topT = others.slice(0, Math.max(1, target)).reduce((a, b) => a + b, 0) / Math.max(1, target);
  const qRank = 1 + others.filter(x => x > ours + P.coach + P.style + P.morale + P.extra).length;
  const luck = g ? me.pts - (G.ss.xpts || 0) : 0, xgd = g ? (G.ss.xgf - G.ss.xga) / g : 0, expXgd = (ours + P.coach + P.style - divAvg) * 0.55;
  const inj = G.squad.filter(p => p.inj > 0).length, co = staff('coach');
  const causes = [], levers = [], add = (k, sev, t) => causes.push({ k, sev, t }), lv = (t, a, x) => levers.push({ t, a, x });
  const bars = [
    { l: 'Squad quality', v: ours - divAvg, note: `Starting XI rated ${ours.toFixed(1)} against a division average of ${divAvg.toFixed(1)}.` },
    { l: 'Coaching', v: P.coach + P.style, note: co ? `Tactics ${co.at[0]}/20. ${P.style >= 0.2 ? 'Style fits.' : P.style < 0 ? 'Forced to play a style that is not his.' : 'Playing his own style.'}` : 'No head coach.' },
    { l: 'Morale', v: P.morale, note: `Average morale ${Math.round(P.moraleAvg)}.` },
    { l: 'Luck', v: g ? luck / Math.max(1, g) * 2 : 0, note: g ? `${me.pts} points from chances worth ${(G.ss.xpts || 0).toFixed(1)}.` : 'No games yet.' },
  ];
  if (qRank > target) { add('quality', qRank - target, `The squad is not good enough for the target. Squad and coaching together rank about ${ord(qRank)} in the division; finishing ${ord(target)} needs roughly a top-${target} squad, which is ${(topT - ours).toFixed(1)} points better per player.`);
    lv(`Loosen the Director of Football's fee and wage limits so he can buy better players.`, 'mand', 'dof'); lv('Raise the share of cash Finance releases for transfers.', 'mand', 'fin'); if (!(G.week <= 4 || (G.week >= 17 && G.week <= 19))) lv(`The next transfer window opens in week ${G.week < 17 ? 17 : 1}. Until then, only free agents.`, null); lv('Back scouting so the shortlist improves before the window.', 'push', 'scouting'); }
  if (co && man('coach', 'style') === 'dna' && co.style !== G.club.dna.style) { add('style', 2, `${co.name} is forced to play ${STYLES[G.club.dna.style].toLowerCase()} football, but his own style is ${STYLES[co.style].toLowerCase()}. That costs performance.`); lv('Let the coach play his own style (costs DNA alignment), or appoint a coach who fits the club style.', 'mand', 'coach'); }
  if (g >= 6 && xgd < expXgd - 0.3) { add('coach', 2, `The team underperforms its squad: xG difference ${xgd >= 0 ? '+' : ''}${xgd.toFixed(2)} per game where this squad should manage about ${expXgd >= 0 ? '+' : ''}${expXgd.toFixed(2)}. That points at the coaching.`); lv('Review the numbers with the coach (one-to-one).', 'talk', 'coach'); lv('Replace the coach if it does not improve.', 'tab', 'staff'); }
  if (P.moraleAvg < 55) { add('morale', 1, `Morale is low (${Math.round(P.moraleAvg)}). Results and unhappy players feed each other.`); lv('Back the first team for three weeks.', 'push', 'sporting'); lv('Praise or reassure the coach.', 'talk', 'coach'); }
  if (inj >= 3) { add('injuries', 1, `${inj} players injured.`); lv('Back the medical department.', 'push', 'medical'); if (!perk('sci')) lv('Approve a sports science unit at the next management meeting.', null); }
  if (g >= 5 && luck <= -4) add('luck', -1, `Bad luck: ${(-luck).toFixed(0)} points fewer than the chances created deserve. Performances are better than the table.`);
  if (g >= 5 && luck >= 4) add('luck+', 1, `Good fortune: ${luck.toFixed(0)} points more than the chances deserve. Expect results to drop unless performances improve.`);
  if (g >= 5 && luck <= -4) lv('Hold your nerve. Performances deserve more; drastic changes now are likely a mistake.', null);
  causes.sort((a, b) => b.sev - a.sev);
  return { pos, target, gap, g, fc: g ? forecast() : null, qRank, causes, levers, bars, behind: pos > target, xpts: G.ss.xpts || 0, pts: me.pts };
}
function scorecard() {
  const c = G.club, ss = G.ss, s0 = ss.start || {}, P = strengthParts(), g = ss.lg || 0;
  const others = G.divs[c.tier].clubs.filter(i => i !== 0).map(i => G.clubs[i].str), divAvg = others.reduce((a, b) => a + b, 0) / others.length;
  const inj = G.squad.filter(p => p.inj > 0).length, att = ss.attN ? ss.attSum / ss.attN : null, wr = wageRatio() * 100, cp = +man('fin', 'wageCap');
  const L = G.fin.last, runway = L && L.tin < L.tout ? Math.floor(c.cash / (L.tout - L.tin)) : null;
  const sig = (G.signLog || []).filter(x => x.season === G.season).map(x => G.squad.find(p => p.id === x.pid)).filter(p => p && p.st.apps >= 3), sa = squadAvgRat(), ar = sig.length ? sig.reduce((a, p) => a + avgRat(p), 0) / sig.length : null;
  const foc = ((c.net[man('scout', 'reg1')] || 0) + (c.net[man('scout', 'reg2')] || 0)) / 2;
  const ch = (G.signLog || []).map(x => ({ x, p: G.squad.find(p => p.id === x.pid) })).filter(o => o.p && o.x.est != null), acc = ch.length ? ch.reduce((a, o) => a + Math.abs(o.x.est - stars(o.p.ca)), 0) / ch.length : null;
  const pot = G.academy.length ? G.academy.reduce((a, p) => a + stars(p.pa), 0) / G.academy.length : 0;
  const S = (l, v, ref, ok) => ({ l, v, ref, ok });
  return [
    { k: 'first', t: 'First team', head: 'coach', rows: [S('Squad quality', P.squad.toFixed(1), `division average ${divAvg.toFixed(1)}`, P.squad >= divAvg + 0.3 ? true : P.squad < divAvg - 0.3 ? false : null), S('Points per game', g ? ((G.divs[c.tier].tab[0].w * 3 + G.divs[c.tier].tab[0].d) / g).toFixed(2) : '–', 'promotion pace about 2.0', null), S('xG difference per game', g ? ((ss.xgf - ss.xga) / g >= 0 ? '+' : '') + ((ss.xgf - ss.xga) / g).toFixed(2) : '–', 'above 0 is good', g ? (ss.xgf > ss.xga) : null), S('Injured', inj, perk('sci') ? 'sports science active' : 'no sports science unit', inj >= 3 ? false : null), S('Training ground', `level ${c.fac.train}`, 'out of 10', null)] },
    { k: 'recruit', t: 'Recruitment', head: 'dof', rows: [S('Transfer budget', money(transferBudget()), 'set by Finance', null), S('Signings rated vs squad', ar ? `${ar.toFixed(2)} vs ${sa.toFixed(2)}` : '–', 'higher is better', ar ? ar >= sa : null), S('Scouting network, focus', `${Math.round(foc)} / 100`, `${REGIONS[man('scout', 'reg1')].name}, ${REGIONS[man('scout', 'reg2')].name}`, foc >= 40 ? true : foc < 15 ? false : null), S('Scouting accuracy', acc == null ? '–' : `±${acc.toFixed(1)}★`, perk('data') ? 'data department active' : 'no data department', acc == null ? null : acc <= 0.5), S('Shortlist', `${(G.shortlist || []).length} players`, '', null)] },
    { k: 'academy', t: 'Academy', head: 'acad', rows: [S('Facilities', `level ${c.fac.youth}`, 'out of 10', null), S('Prospects', G.academy.length, `next intake week 28`, null), S('Average potential', pot ? pot.toFixed(1) + '★' : '–', 'relative to your division', null), S('Debuts this season', ss.grads, '', null)] },
    { k: 'commercial', t: 'Commercial', head: 'com', rows: [S('Sponsorship', money(sponsorIncome()) + '/wk', s0.spons ? `${money(s0.spons)}/wk at season start` : '', s0.spons ? sponsorIncome() >= s0.spons : null), S('Stadium fill', att == null ? '–' : Math.round(att * 100) + '%', `${c.cap.toLocaleString('en-GB')} seats`, att == null ? null : att >= 0.85 ? true : att < 0.45 ? false : null), S('Ticket price', money(ticketPrice()), perk('ticket') ? 'dynamic pricing' : '', null), S('Merchandise', L ? money(L.i.merch || 0) + '/wk' : '–', perk('store') ? 'megastore open' : '', null)] },
    { k: 'marketing', t: 'Marketing', head: 'mkt', rows: [S('Supporter base', c.fanbase.toLocaleString('en-GB'), s0.fanbase ? `${s0.fanbase.toLocaleString('en-GB')} at season start` : '', s0.fanbase ? c.fanbase >= s0.fanbase : null), S('Brand strength', Math.round(c.brand), s0.brand != null ? `${Math.round(s0.brand)} at season start` : '', s0.brand != null ? c.brand >= s0.brand : null), S('Supporter mood', Math.round(G.st.fans), 'below 35 means protests', G.st.fans >= 60 ? true : G.st.fans < 35 ? false : null)] },
    { k: 'business', t: 'Business', head: 'fin', rows: [S('Player wages vs revenue', Math.round(wr) + '%', `cap ${cp}%`, wr <= cp), S('Last week', L ? (L.tin - L.tout >= 0 ? '+' : '') + money(L.tin - L.tout) : '–', '', L ? L.tin >= L.tout : null), S('Cash runway', runway == null ? 'Not burning cash' : `${runway} weeks`, 'at last week\'s burn', runway == null ? true : runway < 10 ? false : null), S('Debt', money(c.debt), c.debt ? `interest ${money(Math.round(c.debt * 0.0012))}/wk` : '', null)] },
  ];
}

/* ---------- weekly briefings (1.5) ---------- */
const BR = {};
function defineBrief(id, d) { d.id = id; BR[id] = d; }
function genBriefs() {
  G.bcd = G.bcd || {}; const cand = [];
  for (const d of Object.values(BR)) {
    if ((G.bcd[d.id] || 0) > absWeek()) continue; if (d.role && ROLE[d.role] && !staff(d.role)) continue;
    let c; try { c = d.check(); } catch (e) { c = null; } if (!c) continue;
    cand.push({ d, c, sc: (c.score || 1) + rnd() * 0.5 });
  }
  cand.sort((a, b) => b.sc - a.sc); const used = new Set(), out = [];
  for (const x of cand) { if (out.length >= 3) break; const key = x.d.role || x.d.id; if (used.has(key)) continue; used.add(key); out.push(x); }
  G.briefs = out.map(x => { G.bcd[x.d.id] = absWeek() + (x.d.cd || 4); return { id: uid(), t: x.d.id, ctx: x.c, done: false, out: null }; });
  if (HOOK.deskBriefs) { try { HOOK.deskBriefs(G.briefs); } catch (err) { } }
}
function briefView(b) {
  const d = BR[b.t], c = b.ctx, val = v => { try { return typeof v === 'function' ? v(c) : v; } catch (e) { return ''; } };
  const role = d.role || (c && ROLE[c.role] ? c.role : null); return { role, who: ROLE[role] ? staffName(role) + ', ' + ROLE[role].s : 'Office of the CEO', why: b.why || null, del: !!b.del, by: b.by || null, title: val(d.title), text: val(d.text), opts: d.opts.map(o => ({ l: val(o.l), h: val(o.h) })), done: b.done, out: b.out, choice: b.choice };
}
function answerBrief(id, i) {
  if (over()) return { err: 'You no longer run the club.' };
  const b = (G.briefs || []).find(x => x.id === id); if (!b || b.done) return null; const o = BR[b.t].opts[i];
  if (o.ap && G.ap < 1) return { err: 'No action points left this week.' }; if (o.ap) G.ap--;
  let r = ''; try { r = o.f(b.ctx) || 'Noted.'; } catch (e) { r = 'Noted.'; } b.done = true; b.choice = i; b.out = r; return { out: r };
}

/* ---------- the week ---------- */
// dismissal is final: one place sets it, nothing after it can undo it
function sack(reason, cause) {
  if (G.phase === 'sacked') return false;
  G.phase = 'sacked'; G.sackReason = reason; G.queue = []; G.briefs = [];
  G.over = { reason, cause: cause || 'board', season: G.season, week: G.week, pos: (G.divs && G.divs[G.club.tier]) ? myPos() : null, tier: G.club.tier, conf: Math.round(G.board.conf) };
  return true;
}
const over = () => G.phase === 'sacked';
function endWeek() {
  if (G.phase !== 'season') return null;
  G.paper = { headline: '', sub: '', stories: [] }; G.msNew = [];
  G.prev = { cash: G.club.cash, conf: G.board.conf, fans: G.st.fans, pos: myPos() }; G.prevFan = G.club.fanbase;
  for (const m of G.inbox.filter(m => !m.done)) { const e = EV[m.ev]; const who = e.from === 'board' ? 'The board' : ROLE[e.from] ? (staff(e.from) ? staff(e.from).name : 'Nobody in charge') : 'The club office'; resolve(m, autoIndex(m), who); }
  if (over()) return { sacked: true };
  lapseMeeting();
  if (HOOK.recWeekly) { dofWork(); HOOK.recWeekly(); } else { scoutWork(); dofWork(); }
  // matches
  const t = G.club.tier, round = G.divs[t] && G.divs[t].fix[G.week - 1];
  let ours = null;
  for (let tt = 1; tt <= 8; tt++) { const r = G.divs[tt].fix[G.week - 1]; if (!r) continue; for (const [h, a] of r) { if (h === 0 || a === 0) { const home = h === 0; G.club.lastAtt = home ? attendance() : G.club.lastAtt; ours = simOurMatch(home ? a : h, home, 'League'); applyResult(tt, h, a, home ? ours.ug : ours.tg, home ? ours.tg : ours.ug); } else { const [hg, ag] = quickSim(h, a); applyResult(tt, h, a, hg, ag); } } }
  let cup = null;
  if (G.cup.alive && G.cup.weeks.includes(G.week)) {
    const rd = G.cup.weeks.indexOf(G.week), oppTier = clamp(G.club.tier - Math.floor(rd / 2) + ri(-1, 1), 1, 8), opp = pick(G.divs[oppTier].clubs.filter(x => x !== 0));
    cup = simOurMatch(opp, chance(0.5), 'Cup'); let win = cup.ug > cup.tg; if (cup.ug === cup.tg) { const dd = teamStrength() - G.clubs[opp].str;
      cup.ev = cup.ev.filter(e => e.k !== 'ft');
      cup.ev.push({ m: 90, k: 'info', t: `Full time ${cup.ug}–${cup.tg}. Extra time.` });
      if (chance(0.45)) { const us = chance(1 / (1 + Math.exp(-0.6 * dd))); if (us) cup.ug++; else cup.tg++; win = us; cup.pens = 'after extra time'; cup.ev.push({ m: ri(95, 120), k: 'goal', us: us ? 1 : 0, t: us ? `GOAL ${G.club.short} in extra time!` : `${cup.oppName} score in extra time.`, sc: [cup.ug, cup.tg] }); }
      else { win = chance(0.5 + dd * 0.05); const a = ri(3, 5), b = win ? a - ri(1, 2) : a + 1; cup.pens = win ? `won ${a}–${Math.max(0, b)} on penalties` : `lost ${Math.max(0, a - 1)}–${a} on penalties`; cup.ev.push({ m: 120, k: 'info', t: `Penalties... ${win ? `${G.club.short} win the shoot-out!` : `${cup.oppName} win the shoot-out.`}` }); }
      cup.ev.push({ m: 120, k: 'ft', t: `Final whistle. ${win ? 'Through to the next round.' : 'Out of the cup.'}` }); }
    cup.rd = G.cup.names[rd];
    if (win) { const prize = M(1500 * (rd + 1)); G.club.cash += prize; G.st.fans = clamp(G.st.fans + 2 + rd, 0, 100); cup.prize = prize; if (rd === G.cup.weeks.length - 1) { G.cup.alive = false; G.cup.won = G.season; G.board.conf = clamp(G.board.conf + 10, 0, 100); G.st.fans = clamp(G.st.fans + 10, 0, 100); G.trophies.push(`National Cup ${G.season}`); } }
    else G.cup.alive = false;
    G.cup.log.push({ rd: cup.rd, opp: cup.oppName, s: `${cup.ug}–${cup.tg}${cup.pens ? ' (' + cup.pens + ')' : ''}`, win });
  }
  if (ours) { G.form.push(ours.result); G.lastMatch = ours; G.ss.xpts = (G.ss.xpts || 0) + xPts(ours.uxg, ours.txg); G.ss.lg++; G.ss.xgf += ours.uxg; G.ss.xga += ours.txg; if (ours.home) { G.ss.attSum += ours.att / G.club.cap; G.ss.attN++; } }
  G.lastCup = cup;
  G.ss.maxTicket = Math.max(G.ss.maxTicket, man('com', 'tickets'));
  weeklyFinance(ours && ours.home); projectsWeekly();
  for (const p of G.squad) { develop(p, 1); if (p.inj > 0) p.inj -= G.push.medical > 0 ? 2 : 1; if (p.susp > 0 && !(ours && ours.ev.some(e => e.red && e.t.includes(p.name)))) p.susp--; p.morale = clamp(p.morale + (ours ? (ours.result === 'W' ? 3 : ours.result === 'L' ? -3 : 0) : 0) + (65 - p.morale) * 0.05 + (G.push.sporting > 0 ? 1.5 : 0) - (p.st.apps < G.week / 3 && p.pers.amb > 14 && G.week > 6 ? 1 : 0), 0, 100); }
  if (HOOK.acadWeekly) HOOK.acadWeekly(); else for (const p of G.academy) develop(p, (0.7 + eff('acad', 0) / 25 + G.club.fac.youth * 0.05) * (G.push.academy > 0 ? 1.5 : 1));
  if (G.week === 28) { if (HOOK.acadIntake) HOOK.acadIntake(); else academyIntake(); }
  kpiWeekly(ours && ours.result); staffWeekly(); boardWeekly(ours && ours.result);
  if (HOOK.seasonAfterMatch) HOOK.seasonAfterMatch(ours);
  if (over()) { buildPaper(ours, cup); if (HOOK.edition) HOOK.edition(ours, cup); return { ours, cup, sacked: true }; }
  if (G.club.cash < -M(4000) && !G.flags.crisisWeek) { queueEvent('cash_crisis', {}); G.flags.crisisWeek = true; } if (G.club.cash > 0) G.flags.crisisWeek = false;
  if (G.club.cash < -M(60000)) G.flags.insolvent = (G.flags.insolvent || 0) + 1; else G.flags.insolvent = 0;
  // paper
  buildPaper(ours, cup); buildReports(ours); if (HOOK.edition) HOOK.edition(ours, cup);
  if (G.board.conf <= 0) { sack('The board has run out of patience and relieved you of your duties.', 'board'); return { ours, cup, sacked: true }; }
  if (G.flags.insolvent >= 4) {
    if (G.flags.adminAt != null && G.season - G.flags.adminAt < 3) { sack('The club has entered administration for the second time. The administrators have dismissed you.', 'admin'); return { ours, cup, sacked: true }; }
    administration();
  }
  G.week++; G.ap = 3;
  if (G.week > SEASON_WEEKS) { endSeason(); return { ours, cup, seasonOver: true }; }
  if (G.week === 9) { const p = G.promises.find(x => x.k === 'tickets' && x.status === 'open'); if (p && man('com', 'tickets') > 50) G.paper.stories.push({ h: 'Promise watch', t: 'Supporters note that ticket prices have crept above what was promised.' }); }
  if (G.later) { const due = G.later.filter(l => l.at <= absWeek()); G.later = G.later.filter(l => l.at > absWeek()); for (const l of due) queueEvent(l.id, l.ctx); }
  if (HOOK.seasonWeekly) HOOK.seasonWeekly();
  genMessages(); genBriefs();
  G.inbox = G.inbox.filter((m, i) => !m.done || i < 40);
  return { ours, cup };
}
function buildPaper(o, cup) {
  const P = G.paper, me = G.club.name;
  if (o) {
    const gd = o.ug - o.tg, opp = o.oppName.split(' ')[0];
    const H = o.result === 'W' ? (gd >= 3 ? [`${G.club.short} run riot against ${opp}`, `${opp} swept aside`, `Statement win for ${me}`] : [`${me} edge past ${opp}`, `Narrow win keeps ${G.club.short} rolling`, `${opp} beaten`]) : o.result === 'D' ? [`Honours even with ${opp}`, `${me} held by ${opp}`, `Stalemate against ${opp}`] : (gd <= -3 ? [`Humbled by ${opp}`, `${opp} hand ${me} a hiding`, `Night to forget for ${G.club.short}`] : [`${me} fall to ${opp}`, `${opp} sting ${G.club.short}`, `Defeat at ${opp}`]);
    P.headline = pick(H);
    P.sub = `${o.home ? me + ' ' + o.ug + '–' + o.tg + ' ' + o.oppName : o.oppName + ' ' + o.tg + '–' + o.ug + ' ' + me}. xG ${o.uxg.toFixed(1)}–${o.txg.toFixed(1)}. ${o.motm ? 'Player of the match: ' + o.motm + '.' : ''}${o.att ? ' Crowd: ' + o.att.toLocaleString('en-GB') + '.' : ''} ${G.club.name} sit ${ord(myPos())} in the ${TIERS[G.club.tier]}.`;
  }
  if (cup) P.stories.unshift({ h: `Cup ${cup.rd}`, t: `${cup.ug}–${cup.tg} against ${cup.oppName}${cup.pens ? ', ' + cup.pens : ''}. ${G.cup.alive || G.cup.won === G.season ? (G.cup.won === G.season ? 'The National Cup is ours!' : 'Into the next round' + (cup.prize ? ', worth ' + money(cup.prize) : '') + '.') : 'Out of the cup.'}` });
  if (o && o.injured.length) P.stories.push({ h: 'Injury', t: o.injured.map(p => `${p.name} (${p.inj} wk)`).join(', ') + ' added to the treatment room.' });
  if (G.board.conf < 30) P.stories.push({ h: 'Boardroom', t: 'Sources close to the board describe the mood as "deeply concerned".' });
}

/* ---------- new game ---------- */
function newGame(seed) {
  G = { v: VERSION, rs: seed || (Date.now() % 2147483647), nid: 1, phase: 'dna', season: 1, week: 1, ap: 3, dna: {}, staff: {}, cands: {}, mand: {}, squad: [], academy: [], inbox: [], queue: [], cd: {}, talks: {}, push: {}, promises: [], form: [], history: [], trophies: [], flags: {}, st: { fans: 55, spons: 50, press: 50 }, board: { conf: 60, obj: [], warned: false }, fin: { last: null, revSum: 0, revW: 0, hist: [] }, ss: newSeasonStats(), cup: null, paper: { headline: '', sub: '', stories: [] } };
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

/* ---------- save ---------- */
function save() { return JSON.stringify(G); }
function load(s) { const g = JSON.parse(s); if (!g || g.v > VERSION) return false; G = g; if (G.v < 2) { G.v = 2; if (HOOK.acadMigrate) HOOK.acadMigrate(); } if (G.v < 3) { G.v = 3; if (HOOK.recMigrate) HOOK.recMigrate(); } return true; }

return {
  get G() { return G; }, set G(v) { G = v; }, HOOK, absStars, newStats,
  VERSION, SEASON_WEEKS, TIERS, REGIONS, ATTR, ATTR_L, POSW, POS_L, LINE, ROLES, ROLE, MAND, LEAN, STYLES, DNA, PRESS, PUSH, CAPREQ,
  rnd, ri, pick, chance, clamp, gauss, wpick, uid, ord, money, M, sc, S, tierAvg, stars, upd, wageFor, genPlayer, genStaff, ovr, staff, eff, man, staffName,
  sack, newGame, setDNA, staffBudget, finishStaff, finishMandates, finishPress, hire, genCands, fire, setMandate, talk, push, respond, msgView, endWeek, startSeason,
  pressView, pressAnswer, PRESS_IDS: () => G.press,
  sortTable, cname, myPos, expectedRank, teamStrength, pickXI, alignment, transferBudget, wageRatio, revenueAvg, playerWages, staffWages, ticketPrice, attendance, sponsorIncome,
  EV, BR, cact, defineEvent, defineProposal, resolve, autoIndex, addMsg, setupPreseason, dofWork, REQ, POSW_KEYS: () => Object.keys(POSW), protectedIds, window_: () => window_(), defineBrief, BR, genBriefs, briefView, answerBrief, scoreTarget, squadNeeds, weakestPos, FOCUS, preTargets, preSetTarget, preToggleFocus, budgetCosts, weekForecast, finishPreseason, analysis, scorecard, strengthParts, xPts, forecast, PROP, queueEvent, later, secondOpinion, decideProposal, proposalView, meetingPot, nextMeeting, isMeeting, projWeekly, perk, record, avgRat, squadAvgRat, EV, sellPlayer, sign, genTarget, allowed, staffWeeklyFn: staffWeekly, objMet, promiseMet, bestPlayer, absWeek, save, load,
};
})();
if (typeof module !== 'undefined') module.exports = FO;
