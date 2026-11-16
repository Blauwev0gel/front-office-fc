/* The Front Office · match day
   Before kick-off: three stories about our own players. After the match: how each story ended,
   the turning point and the facts the preview, the match screen and the Gazette need. No DOM. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const MS_G = [10, 25, 50, 100, 150, 200], MS_A = [50, 100, 150, 200, 250, 300, 400];
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
function lastInjury(p) { const G = g(), l = (p.ms || []).slice().reverse().find(m => /Injured/.test(m.t)); if (!l) return null; const ago = (G.season - l.s) * 46 + (G.week - l.w); return ago > 0 && ago <= 10 && p.inj <= 0 ? l : null; }
function storyFor(p) {
  const G = g(), out = [], first = p.name.split(' ')[0], car = p.car || { apps: 0, g: 0 }, st = p.st || {};
  if (p.academy && !(car.apps > 0)) out.push({ sc: 10, tag: 'Academy debut', t: `${p.name} could make his first senior appearance at ${p.age}. One of our own.` });
  const ng = MS_G.find(n => car.g === n - 1); if (ng && F.LINE && F.LINE[p.pos] !== 'GK') out.push({ sc: 8, tag: `One from ${ng}`, ms: 'g' + ng, t: `${first} is one goal away from ${ng} in his career.` });
  const na = MS_A.find(n => car.apps === n - 1); if (na) out.push({ sc: 7, tag: `${na} games`, ms: 'a' + na, t: `${first} is set to play his ${na}th game.` });
  const inj = lastInjury(p); if (inj) out.push({ sc: 8, tag: 'Back from injury', t: `${first} is fit again after ${(inj.t.match(/out for (\d+)/) || [])[1] || 'a few'} weeks out.` });
  if (!p.academy && p.joined === G.season && !(st.apps > 0) && G.week > 1) out.push({ sc: 7, tag: 'New signing', t: `${p.name} is in line for his first game since signing.` });
  const r = (p.rats || []).slice(-3); if (r.length === 3 && avg(r) >= 7.3) out.push({ sc: 5, tag: 'In form', t: `${first} has averaged ${avg(r).toFixed(1)} over his last three games.` });
  if (r.length === 3 && avg(r) <= 5.8) out.push({ sc: 3, tag: 'Under pressure', t: `${first} has struggled lately. This is a chance to answer back.` });
  if (p.contract <= 1 && p.age < 30 && G.week > 6) out.push({ sc: 4, tag: 'Contract running out', t: `${first}'s contract ends this summer. Other clubs are watching.` });
  if ((st.g || 0) >= 3 && G.squad.every(q => q === p || (q.st && q.st.g || 0) < st.g)) out.push({ sc: 5, tag: 'Top scorer', t: `${first} leads our scoring with ${st.g} goals.` });
  if (!out.length && F.storyOf) { const o = F.storyOf(p); if (o) out.push({ sc: 1, tag: 'Who he is', t: o }); }
  if (!out.length) out.push({ sc: 0.5, tag: 'In the side', t: `${first} has played ${st.apps || 0} game${st.apps === 1 ? '' : 's'} this season${st.g ? `, with ${st.g} goal${st.g === 1 ? '' : 's'}` : ''}.` });
  return out.sort((a, b) => b.sc - a.sc)[0] || null;
}
// three stories, our players first; stored on the fixture so they survive a reload
function mdStories() {
  const G = g(); if (!G || G.phase !== 'season') return [];
  if (G.mdS && G.mdS.s === G.season && G.mdS.w === G.week) return G.mdS.list;
  const L = F.pickXI(false), xi = L.xi.map(x => x.p), bench = L.bench || [];
  const cand = xi.concat(bench.filter(p => p.academy)).map(p => { const s = storyFor(p); return s ? { pid: p.id, ...s, sc: s.sc + (xi.includes(p) ? 1 : 0) + F.rnd() * 0.5 } : null; }).filter(Boolean).sort((a, b) => b.sc - a.sc);
  const used = new Set(), list = [];
  const take = c => list.push({ pid: c.pid, tag: c.tag, t: c.t, ms: c.ms || null });
  for (const c of cand) { if (list.length >= 3) break; if (used.has(c.tag) && c.sc < 6) continue; used.add(c.tag); take(c); }
  for (const c of cand) { if (list.length >= 3) break; if (!list.some(x => x.pid === c.pid)) take(c); }
  G.mdS = { s: G.season, w: G.week, list };
  return list;
}
// a story player is a little more likely to get the chance; never enough to change the odds of the result
H.storyW = p => { const G = g(); return G.mdS && G.mdS.s === G.season && G.mdS.w === G.week && G.mdS.list.some(x => x.pid === p.id) ? 1.25 : 1; };
function mdOutcomes(m) {
  const G = g(); if (!m || !G.mdS) return [];
  return G.mdS.list.map(s => {
    const p = G.squad.find(x => x.id === s.pid) || (G.academy || []).find(x => x.id === s.pid); if (!p) return { pid: s.pid, tag: s.tag, t: 'He has left the club.' };
    const first = p.name.split(' ')[0], played = m.xi.includes(p.id) || m.ev.some(e => e.k === 'sub' && e.t.includes(p.name));
    const goals = m.ev.filter(e => e.k === 'goal' && e.us && e.pid === p.id).length, ast = m.ev.filter(e => e.k === 'goal' && e.us && e.aid === p.id).length, rat = p.lastRat;
    const red = m.ev.some(e => e.k === 'card' && e.red && e.us && e.t.includes(p.name)), save = m.ev.some(e => e.k === 'ch' && !e.us && e.pid === p.id);
    if (!played) return { pid: p.id, tag: s.tag, t: `${first} did not get on. ${s.tag === 'Academy debut' ? 'His debut will have to wait.' : 'His moment will come.'}`, mood: 'worried' };
    let t;
    if (goals) t = `${first} scored${goals > 1 ? ' twice' : ''}${s.ms && s.ms[0] === 'g' ? `: that is ${s.ms.slice(1)} in his career` : ''}${ast ? ' and set one up' : ''}.`;
    else if (ast) t = `${first} set up a goal${s.tag === 'Academy debut' ? ' on his debut' : ''}.`;
    else if (red) t = `${first} was sent off. Not the day he wanted.`;
    else if (save && rat >= 7) t = `${first} made the big saves.`;
    else t = `${first} ${s.tag === 'Academy debut' ? 'made his debut' : s.ms && s.ms[0] === 'a' ? `played his ${s.ms.slice(1)}th game` : 'played'}${rat >= 7.5 ? ' and was outstanding' : rat >= 6.8 ? ' and did well' : ', a quiet day'}.`;
    return { pid: p.id, tag: s.tag, quiet: /a quiet day/.test(t), t: t + (rat ? ` Rated ${rat.toFixed(1)}.` : ''), mood: goals || ast || rat >= 7 ? 'happy' : red || rat < 6.2 ? 'worried' : 'neutral' };
  });
}
// several quiet days read as one line instead of the same sentence three times
const mdOutcomes0 = mdOutcomes;
function mdOutcomesShort(m) { const L = mdOutcomes0(m), q = L.filter(o => o.quiet); if (q.length < 2) return L; const names = q.map(o => { const p = g().squad.find(x => x.id === o.pid); return p ? p.name.split(' ')[0] : ''; }).filter(Boolean); return L.filter(o => !o.quiet).concat([{ pid: q[0].pid, t: `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} played: a quiet day for all of them.`, mood: 'neutral' }]); }
function turningPoint(m) {
  if (!m) return null; const ev = m.ev, res = m.result;
  const red = ev.find(e => e.k === 'card' && e.red); if (red) return { m: red.m, t: red.t };
  const goals = ev.filter(e => e.k === 'goal');
  if (goals.length && Math.abs(m.ug - m.tg) === 1) { const last = goals[goals.length - 1]; return { m: last.m, t: last.t.replace(/\s*\(xG [\d.]+\)/, '') }; }
  const miss = ev.filter(e => e.k === 'ch' && e.us && /xG 0\.([4-9])/.test(e.t)).pop(); if (miss && res !== 'W') return { m: miss.m, t: miss.t.replace(/\s*\(xG [\d.]+\)/, '') };
  if (goals.length) return { m: goals[0].m, t: goals[0].t.replace(/\s*\(xG [\d.]+\)/, '') };
  return null;
}
Object.assign(F, { mdStories, mdOutcomes: mdOutcomesShort, mdTurning: turningPoint });
})(FO);
/* The Gazette: one edition per week, made once at the end of the week and kept for the archive */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK, KEEP = 8;
function matchSum(m) {
  if (!m) return null; const G = g(), P = id => G.squad.find(x => x.id === id) || (G.academy || []).find(x => x.id === id);
  return { comp: m.comp, rd: m.rd || null, home: m.home, opp: m.opp, oppName: m.oppName, ug: m.ug, tg: m.tg, pens: m.pens || null, att: m.att || 0, motm: m.motm || '', result: m.result,
    motmId: (G.squad.find(p => p.name === m.motm) || {}).id || null,
    goals: m.ev.filter(e => e.k === 'goal' && e.us && e.pid).map(e => ({ n: (P(e.pid) || { name: '' }).name, m: e.m })),
    rat: m.xi.map(id => { const p = P(id); return p ? { id, n: p.name, r: p.lastRat ? +p.lastRat.toFixed(1) : null } : null; }).filter(Boolean) };
}
H.edition = (ours, cup) => {
  const G = g(), P = G.paper || { stories: [] }, se = G.season, wk = G.week;
  const tab = F.sortTable(G.club.tier), me = tab.indexOf(0), lo = Math.max(0, Math.min(me - 2, tab.length - 5));
  const coach = ((G.reports || []).find(r => r.role === 'coach') || {}).t || '';
  const dec = G.inbox.filter(m => m.done && m.by === 'you' && m.season === se && m.week === wk).map(m => { try { const v = F.msgView(m); return { t: v.title, c: v.opts[v.choice].l }; } catch (e) { return null; } }).filter(Boolean);
  const ed = { s: se, w: wk, head: P.headline || '', sub: P.sub || '', stories: P.stories.filter(x => !x.auto).map(x => ({ h: x.h, t: x.t })), notices: P.stories.filter(x => x.auto).map(x => ({ h: x.h, t: x.t })),
    match: matchSum(ours), cup: matchSum(cup), tp: ours && F.mdTurning ? F.mdTurning(ours) : null, outs: ours && F.mdOutcomes ? F.mdOutcomes(ours) : [],
    coach: coach ? { t: coach, by: F.staffName ? F.staffName('coach') : '' } : null, dec,
    table: tab.slice(lo, lo + 5).map((id, k) => ({ p: lo + k + 1, n: F.cname(id), pts: G.divs[G.club.tier].tab[id].pts, me: id === 0 })), pos: me + 1, prevPos: G.prev ? G.prev.pos : null, tier: F.TIERS[G.club.tier],
    bk: F.backers ? F.backers().map(b => ({ t: b.t, v: b.v, d: b.d })) : [] };
  G.eds = [ed].concat(G.eds || []).slice(0, KEEP);
  return ed;
};
// the edition to show: the stored one, or for old saves and week one, one made from today's paper
function edView(i) {
  const G = g(), list = G.eds || [];
  if (list[i || 0]) { const ed = list[i || 0]; if (i > 0) return ed; const known = new Set(ed.stories.concat(ed.notices).map(x => x.h + x.t)); return { ...ed, late: (G.paper && G.paper.stories || []).filter(x => !known.has(x.h + x.t)).map(x => ({ h: x.h, t: x.t, auto: !!x.auto })) }; }
  const P = G.paper || { stories: [] }; if (!P.headline && !P.stories.length) return null;
  return { s: G.season, w: Math.max(1, G.week - 1), head: P.headline || 'The desk is open', sub: P.sub || '', stories: P.stories.filter(x => !x.auto), notices: P.stories.filter(x => x.auto), match: matchSum(G.lastMatch && G.lastMatch.xi ? G.lastMatch : null), cup: null, tp: null, outs: [], coach: null, dec: [], table: [], bk: [], legacy: true };
}
Object.assign(F, { edView, edCount: () => (g().eds || []).length });
})(FO);
