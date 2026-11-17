/* The Front Office · your team at work
   What the heads did this week, told as people: one concrete act, in their own voice, with the result the game computed.
   Nothing is invented. Lines come from desk decisions, briefs a head handled, what changed in the weekly reports,
   and player milestones. The voice follows the head's character (risk, ego, ambition). At most three lines, one per head. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { staff, money } = F;
const ROLE_N = { coach: 'Head coach', dof: 'Director of Football', scout: 'Chief scout', acad: 'Academy', com: 'Commercial', mkt: 'Marketing', fin: 'Finance' };
const sur = n => String(n || '').split(' ').slice(-1)[0];
const sent = t => { t = String(t || '').trim(); const i = t.search(/[.!?](\s|$)/); return i > 0 ? t.slice(0, i + 1) : t; };
const low = t => t ? t[0].toLowerCase() + t.slice(1) : '';
const trivial = t => !t || t.length < 14 || /^(filed|noted|ok|fine|on to the next one|nothing to add|window closed)\b/i.test(t);
function temper(s) { const P = (s && s.p) || {}; return { bold: P.risk >= 14, safe: P.risk <= 8, proud: P.ego >= 14, humble: P.ego <= 8, keen: P.amb >= 14 }; }
function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
// pick a phrasing: fixed for this week and head, and not one he used in the last four weeks
function pick(key, list) {
  const G = g(), now = F.absWeek(); G.twUsed = G.twUsed || {}; const start = hash(key + now) % list.length;
  for (let k = 0; k < list.length; k++) { const i = (start + k) % list.length, id = key + ':' + i; if (!(G.twUsed[id] > now - 4)) { G.twUsed[id] = now; return list[i]; } }
  return list[start];
}

/* ---------- a head's own decision (desk) ---------- */
function decision(m) {
  const e = F.EV[m.ev] || {}, r = e.from === 'scout' ? 'dof' : e.from, s = staff(r); if (!s) return null; // the head of the department decides (a scout's request goes to the DoF)
  const v = F.msgView(m), opt = (v.opts[m.choice] || {}).l || '', N = sur(s.name), T = temper(s), title = String(v.title || '').replace(/[.!?]$/, '');
  const out = sent(String(m.outcome || '').replace(/\s*\S+ (misjudged it|gambled with|went for more)[^.]*\.?/g, '').trim());
  const err = !!m.err, won = /paid off/.test(m.outcome || ''), head = title.length <= 70 ? title + '. ' : '';
  const forms = T.proud ? [`${head}"${opt}," says ${N}. No need to ask you.`, `${head}${N} settled it himself: "${opt}."`, `${head}"${opt}." ${N} didn't need your view.`]
    : T.safe ? [`${head}${N} played it safe: "${opt}."`, `${head}${N} kept it simple: "${opt}."`, `${head}${N} took the careful line: "${opt}."`]
    : T.bold ? [`${head}${N} didn't wait for you: "${opt}."`, `${head}"${opt}," says ${N}. He backs himself.`, `${head}${N} called it quickly: "${opt}."`]
    : [`${head}${N}: "${opt}."`, `${head}${N} made the call: "${opt}."`, `${head}${N} decided: "${opt}."`];
  let t = pick(r + ':dec', forms); if (out && !trivial(out) && (t + ' ' + out).length <= 170) t += ' ' + out;
  if (err) t += pick(r + ':err', [' He got it wrong.', ' It backfired on him.', ' Not his best call.']);
  if (won) t += pick(r + ':won', [' The gamble paid off.', ' It came off.']);
  return { r, n: s.name, w: err || won ? 5 : 3, bad: err, lab: err ? 'Went wrong' : won ? 'Paid off' : '', t, k: 'm' + m.id };
}

/* ---------- a brief the head handled himself ---------- */
function brief(b) {
  const d = F.BR[b.t] || {}, r = d.role, s = staff(r); if (!s || b.t === 'coach_debrief') return null;
  const N = sur(s.name), T = temper(s), out = String(b.out || ''), c = b.ctx || {};
  let t = '', lab = '', w = 2;
  if (b.t === 'com_offer') { const m = out.match(/^(.+?) signed\. (£[\d.,k]+) a week/); if (m) { t = pick('com:offer', T.keen ? [`${N} closed ${m[1]} himself. "The first of many."`, `${N} brought in ${m[1]}. He wants bigger names next.`] : [`${N} took the safe deal: ${m[1]}.`, `${N} signed ${m[1]} without fuss.`]); lab = m[2] + '/wk'; w = 3.5; } else if (/declin|pass/i.test(out)) t = `${N} turned a sponsor down. ${sent(out)}`; }
  else if (b.t === 'rec_report') { const m = (F.briefView(b).title || '').match(/Report: (.+?), grade (\w)/); if (m) { t = /drop/i.test(out) ? pick('dof:rep', [`${N} read the report on ${m[1]} (grade ${m[2]}) and let him go.`, `${N} passed on ${m[1]}, a grade ${m[2]} report.`]) : `${N} keeps ${m[1]} (grade ${m[2]}) on the list.`; w = 1.5; } }
  else if (b.t === 'fin_wage' || b.t === 'fin_runway') { t = pick('fin:act', T.bold ? [`${N} acted first: ${low(sent(out))} "Better now than in March."`, `${N} didn't wait: ${low(sent(out))}`] : [`${N} flags it early: ${low(sent(out))}`, `${N} moved quietly: ${low(sent(out))}`]); w = 3; }
  else if (b.t === 'ac_ready') { const p = c.name || ''; t = /joins/i.test(out) ? `${N} sent ${p || 'a youngster'} up to the first team. The coach decides his minutes.` : `${N} keeps ${p || 'him'} in the academy a while longer.`; w = 3; }
  else if (b.t === 'com_prices') t = /stay/i.test(out) ? pick('com:pr', [`${N} kept ticket prices where they are.`, `${N} left prices alone. "Fill the stand first."`]) : `${N} changed ticket prices. ${sent(out)}`;
  else if (b.t === 'injury_blow') t = `${N} sorted the medical side. ${sent(out)}`;
  else { const o = sent(out); if (trivial(o)) return null; t = `${N}: ${o}`; w = 1.5; }
  if (!t) return null; return { r, n: s.name, w, lab, t, k: 'b' + b.id };
}

/* ---------- what changed in the weekly reports ---------- */
function reports() {
  const G = g(), prev = G.twPrev || {}, out = [], L4 = (G.form || []).slice(-4), crisis = L4.length === 4 && L4.filter(x => x === 'L').length >= 3, res = (G.form || []).slice(-1)[0];
  for (const x of G.reports || []) {
    const s = staff(x.role); if (!s) continue; const N = sur(s.name), T = temper(s), was = prev[x.role] || '';
    if (x.role === 'coach') { const m = x.t.match(/^(Pleased|Frustrated|Mixed feelings): we created ([\d.]+) xG and allowed ([\d.]+)\. (.+?) stood out\./); if (!m) continue; const [, mood, a, b, star] = m, S = sur(star);
      const t = mood === 'Pleased' ? pick('coach:ok', T.proud ? [`"${a} against ${b}. That's how we play," says ${N}. ${S} was his man.`, `${N} liked what he saw: ${a} xG for, ${b} against. ${S} stood out.`, `"Told you," says ${N}. ${S} was the best on the pitch.`] : [`"We'll take it," says ${N}. ${S} stood out.`, `${N} was pleased with the shape. ${S} was the best of them.`, `"Good lads," says ${N}. He singles out ${S}.`])
        : mood === 'Frustrated' ? pick('coach:bad', T.proud ? [`"${a} against ${b}. Not good enough," says ${N}.`, `${N} is blunt about it: ${a} xG for, ${b} against.`, `"I want a reaction," says ${N}. Only ${S} gets a pass.`] : [`${N} isn't hiding from it: ${a} xG for, ${b} against.`, `"We have to be better," says ${N}. ${S} was the one bright spot.`, `"We go again," says ${N}.`, `"My responsibility," says ${N}. ${S} was the exception.`])
        : pick('coach:mix', [`"Some good, some bad," says ${N}. ${S} stood out.`, `${N} calls it a mixed afternoon. ${S} did his part.`, `"A point is a point," says ${N}.`.replace('A point is a point', res === 'D' ? 'A point is a point' : 'We take the lessons')]);
      out.push({ r: 'coach', n: s.name, w: crisis ? 4.5 : res === 'L' ? 2.5 : 0.8, t, lab: '', k: 'rep' }); continue; }
    if (x.t === was) continue; // nothing new from him this week
    if (x.role === 'fin') { const st = t => /over the cap/.test(t) ? 'over' : /close to the cap/.test(t) ? 'close' : 'ok', m = x.t.match(/wages at (\d+)% of revenue \(cap (\d+)%\)/); if (!m || st(x.t) === st(was) || !was) continue;
      const now = st(x.t); out.push({ r: 'fin', n: s.name, w: now === 'over' ? 3.5 : 2, lab: now === 'over' ? 'Over cap' : now === 'close' ? 'Near cap' : 'Under cap', k: 'rep',
        t: now === 'ok' ? `${N}: wages back to ${m[1]}% of revenue, under the cap.` : pick('fin:cap', T.bold ? [`${N} flags it: wages jumped to ${m[1]}% of revenue${now === 'over' ? ', over your cap' : ''}.`, `"${m[1]}% of revenue on wages," says ${N}. "${now === 'over' ? 'Over the line.' : 'Close to the line.'}"`] : [`${N} flags it early: wages at ${m[1]}%, against a cap of ${m[2]}%.`, `${N} is watching the wage bill: ${m[1]}% of revenue now.`]) }); continue; }
    if (x.role === 'com') { const n = t => { const m = t.match(/Sponsorship at (£[\d.,k]+)\/wk/); return m ? m[1] : null; }; if (!was || n(x.t) === n(was) || !n(x.t)) continue; out.push({ r: 'com', n: s.name, w: 2, lab: n(x.t) + '/wk', k: 'rep', t: T.keen ? `${N} has sponsorship up to ${n(x.t)} a week. He wants more.` : `${N}: sponsorship now ${n(x.t)} a week.` }); continue; }
    if (x.role === 'mkt') { const m = x.t.match(/\(([+-−]?\d+) this week\)/); const d = m ? parseInt(m[1].replace('−', '-'), 10) : 0; if (Math.abs(d) < 10) continue; out.push({ r: 'mkt', n: s.name, w: 1.5, lab: (d > 0 ? '+' : '') + d + ' fans', k: 'rep', t: d > 0 ? pick('mkt:up', [`${N}'s campaign is working: ${d} new supporters this week.`, `${d} more supporters this week. ${N} is pleased.`]) : `${N} is worried: ${-d} supporters lost this week.` }); continue; }
    if (x.role === 'acad') { const m = x.t.match(/(.+?) \((\d+)\) is the standout/), mw = was.match(/(.+?) \((\d+)\) is the standout/); if (!m || !was || (mw && sur(mw[1]) === sur(m[1].split('. ').pop()))) continue; const p = m[1].split('. ').pop(); out.push({ r: 'acad', n: s.name, w: 1.8, lab: '', k: 'rep', t: `${N} has a new name to watch: ${p}, ${m[2]}.` }); continue; }
    if (x.role === 'dof') { if (!was) continue; const m = x.t.match(/signed ([^.]+?)\./); if (m) out.push({ r: 'dof', n: s.name, w: 3.5, lab: 'Signed', k: 'rep', t: T.bold ? `${N} moved fast and signed ${m[1]}.` : `${N} signed ${m[1]} after weighing the options.` }); else if (!/Window closed|no business/i.test(x.t)) out.push({ r: 'dof', n: s.name, w: 1.2, lab: '', k: 'rep', t: `${N}: "${sent(x.t)}"` }); continue; }
    if (x.role === 'scout') { const m = x.t.match(/Watched (\d+) matches\. Added (.+?) \(/); if (m) out.push({ r: 'scout', n: s.name, w: 1.6, lab: '', k: 'rep', t: `${N} watched ${m[1]} games and came back with ${m[2]}.` }); continue; }
  }
  return out;
}

/* ---------- milestones: one line, however many ---------- */
function milestones() {
  const G = g(), M = (G.msNew || []).map(ms => ({ ms, p: G.squad.find(x => x.id === ms.pid) })).filter(x => x.p); if (!M.length) return [];
  if (M.length === 1) return [{ r: 'player', pl: M[0].p, n: M[0].p.name, w: 2, t: M[0].ms.t, lab: '', k: 'ms' }];
  const kind = t => /^Debut/.test(t) ? 'debut' : /First goal/.test(t) ? 'goal' : /Man of the match/.test(t) ? 'motm' : 'other', by = {}; for (const x of M) (by[kind(x.ms.t)] = by[kind(x.ms.t)] || []).push(sur(x.p.name));
  const and = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a[0], parts = []; if (by.motm) parts.push(by.motm.length > 1 ? `top ratings for ${and(by.motm)}` : `${by.motm[0]} man of the match`); if (by.goal) parts.push(`first goal${by.goal.length > 1 ? 's' : ''} for ${and(by.goal)}`); if (by.debut) parts.push(by.debut.length > 3 ? `${by.debut.length} debuts` : `debut${by.debut.length > 1 ? 's' : ''} for ${and(by.debut)}`); if (by.other) parts.push(`${by.other.length} more`);
  const t = parts.join('; '); return [{ r: 'player', pl: M[0].p, n: `${M.length} players`, w: 2, t: t[0].toUpperCase() + t.slice(1) + '.', lab: '', k: 'ms' }];
}

/* ---------- the three lines of the week ---------- */
function teamWork() {
  const G = g(); if (!G) return []; const now = F.absWeek(), se = G.season, wk = G.week;
  if (G.tw && G.tw.w === now && G.tw.n === G.inbox.length) return G.tw.lines;
  const all = []
    .concat(G.inbox.filter(m => m.done && m.del && m.season === se && m.week === wk).map(decision))
    .concat((G.briefs || []).filter(b => b.del).map(brief))
    .concat(reports(), milestones()).filter(Boolean).sort((a, b) => b.w - a.w);
  const seen = new Set(), lines = [];
  for (const l of all) { if (lines.length >= 3) break; if (l.r !== 'player' && seen.has(l.r)) continue; seen.add(l.r); lines.push(Object.assign(l, { role: ROLE_N[l.r] || 'Milestone' })); }
  if (!lines.length) { const h = ['fin', 'dof', 'coach'].map(r => [r, staff(r)]).find(x => x[1]); if (h) { const N = sur(h[1].name), T = temper(h[1]);
    lines.push({ r: h[0], n: h[1].name, role: ROLE_N[h[0]], w: 0, quiet: 1, lab: '', k: 'rep', t: T.keen || T.bold ? `"Nothing to report. I'd rather have something to report," says ${N}.` : `"Quiet week," says ${N}. "That's how I like it."` }); } }
  G.tw = { w: now, n: G.inbox.length, lines }; return lines;
}
// last week's reports, kept to see what changed
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = o => { if (prevAfter) prevAfter(o); const G = g(); G.twPrev = Object.fromEntries((G.reports || []).map(r => [r.role, r.t])); G.tw = null; };
Object.assign(F, { teamWork });
})(FO);
