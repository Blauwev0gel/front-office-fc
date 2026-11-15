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
    ru: [['minGrads', 'Academy players the DoF may not sell', [['0', 'None'], ['1', '1'], ['2', '2'], ['3', '3']], '1'], ['playUp', 'Play the best kids an age group up', [['none', 'Never'], ['best', 'Only the very best'], ['many', 'Regularly']], 'best'], ['loans', 'Loan out under-21s', [['never', 'Never'], ['some', 'The ones who need games'], ['all', 'All of them']], 'some'], ['mentors', 'First-team mentors for scholars', [['yes', 'Yes'], ['no', 'No']], 'yes']] },
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

