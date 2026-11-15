/* The Front Office · First team department
   The coach's own instincts vs your mandate, support staff you can fund, talks as short scenes,
   agreements with deadlines, and a sacking with a price tag. Plugs into engine hooks. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { ri, chance, clamp, money, M, staff, man, tierAvg } = F;
const KEYS = ['attack', 'youthMins', 'rotation', 'intensity'];
const hs = (x) => { let h = 7; for (const c of String(x)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };

/* ---------- state ---------- */
function ft() {
  const G = g(); if (!G.ft) G.ft = { res: {}, games: [], pos: [], comp: 0, compW: 0, deal: null, talk: null, pushP: {}, gapW: 0, gapNote: 0, season: G.season, xiPrev: null, rotN: 0, rotSum: 0, u21: 0, played: 0 };
  return G.ft;
}

/* ---------- the coach's instincts ---------- */
function pref(s) {
  if (!s) return null;
  if (!s.pref) {
    const P = s.p, h = hs(s.id + s.name);
    s.pref = {
      attack: Math.round(clamp(s.lean, 5, 95)),
      youthMins: Math.round(clamp(48 + (s.at[2] - 10) * 3 - (P.amb - 10) * 2.5 + (h % 17) - 8, 5, 95)),
      rotation: Math.round(clamp(35 + (P.risk - 10) * 2.5 + ((h >>> 5) % 15) - 7, 5, 95)),
      intensity: Math.round(clamp(55 + (P.amb - 10) * 2 + (P.ego - 10) * 1.2 + ((h >>> 9) % 15) - 7, 5, 95))
    };
  }
  return s.pref;
}
// how closely he follows the mandate, 0.35 to 1
function compliance() {
  const s = staff('coach'); if (!s) return 1; const S = ft();
  let c = 0.72 + (s.rel - 50) / 200 - (s.p.ego - 10) * 0.025 + (s.p.loy - 10) * 0.008;
  if (S.compW > 0) c += S.comp;
  if (S.deal && S.deal.agreed) c += 0.04;
  return clamp(c, 0.35, 1);
}
function act(k) {
  const s = staff('coach'), m = man('coach', k); if (!s) return m; const P = pref(s); if (!P || P[k] == null) return m;
  const c = compliance(); return Math.round(m * c + P[k] * (1 - c));
}
H.coachAct = k => KEYS.includes(k) ? act(k) : man('coach', k);

/* ---------- support staff ---------- */
const RES = {
  asst: { t: 'Assistant coach', d: 'Better development and sharper match preparation.', wk: 260, fee: 1500, setup: 3, ic: 'staff' },
  fit: { t: 'Fitness coach', d: 'Fewer injuries. Lets the team train hard safely.', wk: 220, fee: 1200, setup: 2, ic: 'up' },
  ana: { t: 'Match analyst', d: 'A small edge in every match.', wk: 240, fee: 2000, setup: 3, ic: 'bulb' },
  psy: { t: 'Sports psychologist', d: 'Steadier morale. Helps unhappy players.', wk: 200, fee: 1000, setup: 2, ic: 'trust' }
};
const tierK = () => Math.max(1, (9 - g().club.tier) * 0.55);
const resCost = k => ({ wk: Math.round(M(RES[k].wk) * tierK() / 10) * 10, fee: Math.round(M(RES[k].fee) * tierK() / 100) * 100 });
const live = k => { if (F.deptHas) return F.deptHas('first', k); const r = ft().res[k]; return !!(r && r.left <= 0); };
H.ftCost = () => { let c = 0; for (const k in ft().res) c += resCost(k).wk; return c; };
H.ftInj = () => live('fit') ? 0.65 : 1;
H.ftDev = () => live('asst') ? 0.1 : 0;
H.ftExtra = () => (live('ana') ? 0.12 : 0) + (live('asst') ? 0.05 : 0);
H.selBonus = p => { const w = ft().pushP[p.id]; return w && w > 0 ? 1.1 : 0; };
function resBuy(k) {
  const G = g(), S = ft(); if (!RES[k] || S.res[k]) return { err: 'Already in place.' };
  const c = resCost(k); if (G.club.cash < c.fee) return { err: 'Not enough cash for the set-up fee.' };
  G.club.cash -= c.fee; S.res[k] = { left: RES[k].setup, since: F.absWeek() };
  const s = staff('coach'); if (s) s.rel = clamp(s.rel + 3, 0, 100);
  return { out: `${RES[k].t} hired. Up and running in ${RES[k].setup} weeks.` };
}
function resCancel(k) { const S = ft(); if (!S.res[k]) return; delete S.res[k]; const s = staff('coach'); if (s) s.rel = clamp(s.rel - 3, 0, 100); return { out: `${RES[k].t} let go.` }; }

/* ---------- weekly ---------- */
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g(), S = ft();
  if (S.season !== G.season) { S.season = G.season; S.games = []; S.pos = []; S.rotN = 0; S.rotSum = 0; S.u21 = 0; S.played = 0; S.xiPrev = null; S.injS = 0; }
  for (const k in S.res) if (S.res[k].left > 0) S.res[k].left--;
  if (S.compW > 0 && --S.compW === 0) S.comp = 0;
  for (const id in S.pushP) if (--S.pushP[id] <= 0) delete S.pushP[id];
  if (live('psy')) for (const p of G.squad) p.morale = clamp(p.morale + (70 - p.morale) * 0.06, 0, 100);
  if (ours) {
    S.games.push({ r: ours.result, ug: ours.ug, tg: ours.tg, ux: +ours.uxg.toFixed(2), tx: +ours.txg.toFixed(2), o: ours.oppName, h: ours.home ? 1 : 0 });
    if (S.games.length > 40) S.games.shift();
    const xi = ours.xi || [];
    S.played++; S.u21 += xi.filter(id => { const p = G.squad.find(q => q.id === id); return p && p.age <= 21; }).length;
    if (S.xiPrev) { S.rotN++; S.rotSum += xi.filter(id => !S.xiPrev.includes(id)).length; }
    S.xiPrev = xi; S.injS = (S.injS || 0) + (ours.injured ? ours.injured.length : 0);
  }
  if (G.phase === 'season') S.pos.push(F.myPos());
  // mandate friction
  const s = staff('coach');
  if (s && ours) {
    const gap = biggestGap();
    if (gap && gap.d >= 15) { S.gapW++; s.rel = clamp(s.rel - 0.3 * (gap.d / 15), 0, 100); } else S.gapW = 0;
  }
  // agreement check
  if (S.deal && s) {
    const D = S.deal, ok = dealMet(D);
    if (ok !== null || G.week >= D.by) {
      const met = ok === true || (ok === null && dealMet(D, true) === true);
      if (met) { s.rel = clamp(s.rel + 8, 0, 100); s.boost = clamp(s.boost + 4, -10, 12); s.boostW = 4; G.board.conf = clamp(G.board.conf + 3, 0, 100); }
      else { s.rel = clamp(s.rel - 4, 0, 100); G.board.conf = clamp(G.board.conf - 4, 0, 100); s.perf = clamp(s.perf - 6, 0, 100); }
      if (G.paper) G.paper.stories.push({ h: met ? 'Coach hits his target' : 'Coach misses his target', t: met ? `${s.name}: "${D.t}. Done, as I said."` : `${s.name}: "${D.t}. We fell short. I know what that means."` });
      S.last = { t: D.t, met }; S.deal = null;
    }
  }
};
function dealMet(D, final) {
  const G = g(), pos = F.myPos();
  if (D.k === 'top6') return final ? pos <= 6 : null;
  if (D.k === 'tophalf') return final ? pos <= 9 : null;
  if (D.k === 'top2') return final ? pos <= 2 : null;
  if (D.k === 'unbeaten') { const since = ft().games.slice(D.g0); if (since.some(x => x.r === 'L')) return false; return since.length >= 5 ? true : null; }
  if (D.k === 'youth') { const S = ft(), n = S.played - D.p0; return final ? (n > 0 && (S.u21 - D.u0) / n >= 1.5) : null; }
  return null;
}

/* ---------- mandate vs reality ---------- */
const MLAB = { attack: ['Defensive', 'Attacking'], youthMins: ['Trust veterans', 'Blood youngsters'], rotation: ['Settled XI', 'Heavy rotation'], intensity: ['Light training', 'Intense training'] };
const KNAME = { attack: 'attacking football', youthMins: 'minutes for youngsters', rotation: 'rotation', intensity: 'training intensity' };
function biggestGap() { let b = null; for (const k of KEYS) { const d = Math.abs(act(k) - man('coach', k)); if (!b || d > b.d) b = { k, d, dir: act(k) > man('coach', k) ? 1 : -1 }; } return b; }
function why(k, dir, s) {
  const P = s.p, n = s.name.split(' ')[0];
  const T = {
    attack: dir > 0 ? ['I want us on the front foot. Sitting back loses games slowly.', 'Fans pay to see goals. So do I.'] : ['You win leagues with clean sheets. I will not apologise for that.', 'Attack when it is on, defend when it is not.'],
    youthMins: dir > 0 ? ['The kids are hungry. Hunger wins duels.', 'Give them a run and they repay you.'] : ['I get judged on Saturdays, not on potential.', 'Kids learn in training. Points come from men.'],
    rotation: dir > 0 ? ['Fresh legs win the last twenty minutes.', 'Everyone needs to feel part of it.'] : ['A team needs rhythm. You do not get it by changing six players a week.', 'My best eleven plays. Simple.'],
    intensity: dir > 0 ? ['If we are not fitter than them, what are we?', 'Hard sessions, easy games.'] : ['Tired players get injured. I protect them.', 'Quality over quantity in training.']
  };
  const arr = T[k]; return arr[hs(s.id + k) % arr.length] + (P.ego > 14 ? ' I know this job.' : '');
}
function mandateRows() {
  const s = staff('coach'), S = ft();
  return KEYS.map(k => {
    const you = man('coach', k), him = act(k), d = him - you;
    let fact = '';
    if (k === 'youthMins') fact = S.played ? `${(S.u21 / S.played).toFixed(1)} under-21s start per match` : 'No matches yet';
    if (k === 'rotation') fact = S.rotN ? `${(S.rotSum / S.rotN).toFixed(1)} changes per match` : 'No matches yet';
    if (k === 'attack') { const gm = S.games; fact = gm.length ? `${(gm.reduce((a, x) => a + x.ux + x.tx, 0) / gm.length).toFixed(1)} xG per match, both sides` : 'No matches yet'; }
    if (k === 'intensity') fact = `${S.injS || 0} injuries this season`;
    return { k, l: MLAB[k], name: KNAME[k], you, him, d, fact, why: s && Math.abs(d) >= 12 ? why(k, Math.sign(d), s) : '' };
  });
}

/* ---------- the squad through his eyes ---------- */
function squadEyes() {
  const G = g(), sq = G.squad, S = ft();
  const starts = p => (p.st && p.st.starts != null ? p.st.starts : p.st ? p.st.apps : 0) || 0;
  const xi = new Set(S.xiPrev || []);
  const core = sq.filter(p => xi.has(p.id)).sort((a, b) => starts(b) - starts(a) || b.ca - a.ca).slice(0, 6);
  const out = sq.filter(p => !xi.has(p.id) && p.inj <= 0 && p.pos !== 'GK' && p.ca >= tierAvg(G.club.tier) - 0.4).sort((a, b) => b.ca - a.ca).slice(0, 4);
  const inj = sq.filter(p => p.inj > 0).sort((a, b) => b.inj - a.inj);
  const sad = sq.filter(p => p.morale < 45).sort((a, b) => a.morale - b.morale).slice(0, 4);
  return { core, out, inj, sad };
}

/* ---------- the coach's opening line ---------- */
function line() {
  const s = staff('coach'); if (!s) return '';
  const G = g(), f = G.form.slice(-5), w = f.filter(x => x === 'W').length, l = f.filter(x => x === 'L').length, P = s.p, gap = biggestGap(), S = ft();
  const opts = [];
  if (!f.length) opts.push(P.ego > 14 ? 'Give me the players and the time. The results will follow.' : 'Pre-season is done. Now we find out what we are.');
  else if (w >= 4) opts.push(P.ego > 14 ? 'Told you. This is what my football looks like.' : 'The lads are flying. I just try not to get in the way.');
  else if (l >= 3) opts.push(P.risk < 7 ? 'We are leaking. I will tighten it up before I try anything clever.' : P.ego > 14 ? 'A bad run. It happens to every great side.' : 'I own this run. We are working on it every day.');
  else opts.push(P.amb > 14 ? 'Fine is not good enough. I want more from this group.' : 'Steady. Not spectacular, but steady.');
  if (gap && gap.d >= 20 && hs(s.name + G.week) % 2) opts.push(`About the ${KNAME[gap.k]}: I am doing it my way for now.`);
  if (S.deal) opts.push(`The target stands: ${S.deal.t.toLowerCase()}.`);
  return opts.slice(0, 2).join(' ');
}

/* ---------- talks ---------- */
// G.ft.talk = { step, topic, log:[{who,t}], opts:[{t,id,fx}], done }
const say = (who, t) => ft().talk.log.push({ who, t });
const BOOST = (s, b, w) => { s.boost = clamp(s.boost + b, -10, 12); s.boostW = Math.max(s.boostW, w || 4); };
function talkStart() {
  const G = g(), s = staff('coach'); if (!s) return { err: 'There is no head coach.' }; if (G.ap < 1) return { err: 'No action points left this week.' };
  const S = ft(); if (S.talk && !S.talk.done) return {};
  G.ap--; const recent = (G.talks.coach || -99) > F.absWeek() - 3; G.talks.coach = F.absWeek();
  S.talk = { step: 0, log: [], k: recent ? 0.5 : 1, fx: [] };
  say('coach', hs(s.name + G.week) % 2 ? 'You wanted a word?' : 'Door is open. What is on your mind?');
  S.talk.opts = topics();
  return {};
}
function topics() {
  const S = ft(), gap = biggestGap(), o = [
    { id: 'back', t: 'You have my backing', fx: 'Relationship up' },
    { id: 'push', t: 'I need more from this team', fx: 'Boost, risk on relationship' },
    { id: 'player', t: 'Let us talk about a player', fx: 'Selection' }];
  if (gap && gap.d >= 12) o.unshift({ id: 'mandate', t: `About the ${KNAME[gap.k]}`, fx: 'The mandate' });
  if (!S.deal) o.push({ id: 'target', t: 'Let us agree a target', fx: 'Agreement' });
  return o.slice(0, 4);
}
function fxNote(t) { ft().talk.fx.push(t); }
function talkAnswer(id) {
  const G = g(), S = ft(), T = S.talk, s = staff('coach'); if (!T || T.done || !s) return;
  const opt = T.opts.find(o => o.id === id); if (!opt) return;
  say('you', opt.t); const P = s.p, k = T.k, n = s.name.split(' ')[0];
  const rel = v => { s.rel = clamp(s.rel + v * k, 0, 100); if (v) fxNote(`Relationship ${v > 0 ? '+' : ''}${Math.round(v * k)}`); };
  const boost = (v, w) => { BOOST(s, v * k, w); if (v) fxNote(v > 0 ? 'Coach fired up' : 'Coach deflated'); };
  const end = () => { T.done = true; T.opts = []; };
  switch (id) {
    case 'back':
      if (s.perf < 45) { say('coach', 'That means a lot right now. Honestly.'); rel(6); boost(3, 4); }
      else if (P.ego > 14) { say('coach', 'Good. You hired the right man.'); rel(3); boost(-1, 3); }
      else { say('coach', 'Appreciated. We will keep building.'); rel(4); boost(2, 4); }
      T.opts = [{ id: 'back_pub', t: 'I will say it in public too', fx: 'Press, board' }, { id: 'back_priv', t: 'Keep it between us', fx: 'Nothing more' }]; break;
    case 'back_pub': say('coach', 'The players will read that. It helps.'); rel(3); G.st.press = clamp(G.st.press + 1, 0, 100); if (F.myPos() > F.expectedRank() + 3) { G.board.conf = clamp(G.board.conf - 2, 0, 100); fxNote('Board −2'); } else fxNote('Press +1'); end(); break;
    case 'back_priv': say('coach', 'Fine by me.'); end(); break;
    case 'push':
      if (P.amb >= 13) { say('coach', 'Good. So do I. Watch this week.'); rel(-1); boost(7, 5); }
      else if (P.ego >= 14) { say('coach', 'With respect, you run the club. I run the team.'); rel(-8); boost(-2, 4); }
      else { say('coach', 'Understood. I will push them harder.'); rel(-3); boost(4, 4); }
      T.opts = [{ id: 'target', t: 'Then let us put a number on it', fx: 'Agreement' }, { id: 'push_end', t: 'That is all', fx: '' }]; break;
    case 'push_end': say('coach', 'Right.'); end(); break;
    case 'mandate': {
      const gap = biggestGap(); T.gk = gap.k; say('coach', why(gap.k, gap.dir, s));
      T.opts = [
        { id: 'm_mine', t: 'Do it the way we agreed', fx: 'He follows the mandate, relationship down' },
        { id: 'm_half', t: 'Meet me halfway', fx: 'Mandate moves halfway' },
        { id: 'm_his', t: 'Fair enough, your way', fx: 'Mandate follows him, relationship up' }]; break; }
    case 'm_mine': { const hard = P.ego > 14 && s.rel < 50;
      if (hard) { say('coach', 'Fine. But if it goes wrong, it is on you.'); rel(-7); S.comp = 0.22; S.compW = 8; }
      else { say('coach', 'Okay. Your club, your call.'); rel(-3); S.comp = 0.28; S.compW = 8; }
      fxNote('He follows the mandate for 8 weeks'); end(); break; }
    case 'm_half': { const m = Object.assign({}, g().mand.coach), p = pref(s); m[T.gk] = Math.round((m[T.gk] + p[T.gk]) / 2); g().mand.coach = m; S.comp = 0.12; S.compW = 6; say('coach', 'I can work with that.'); rel(3); fxNote('Mandate adjusted'); end(); break; }
    case 'm_his': { const m = Object.assign({}, g().mand.coach), p = pref(s); m[T.gk] = p[T.gk]; g().mand.coach = m; say('coach', P.ego > 14 ? 'Glad we see it the same way.' : 'Thanks. I will not let you down.'); rel(6); boost(2, 4); fxNote('Mandate changed'); end(); break; }
    case 'player': {
      const E = squadEyes(), pool = [...E.out.slice(0, 2), ...E.sad.filter(p => !E.out.includes(p)).slice(0, 1), ...g().squad.filter(p => p.age <= 20 && p.pa - p.ca > 1.2).sort((a, b) => b.pa - a.pa).slice(0, 1)].filter((p, i, a) => a.indexOf(p) === i).slice(0, 3);
      if (!pool.length) { say('coach', 'Everyone is where they should be right now.'); end(); break; }
      say('coach', 'Who?'); T.opts = pool.map(p => ({ id: 'pl_' + p.id, t: p.name, fx: `${F.POS_L ? p.pos : p.pos}, ${p.age}` })); break; }
    case 'target': {
      say('coach', 'Go on then.'); const exp = F.expectedRank(), o = [];
      o.push({ id: 't_unbeaten', t: 'No defeats in the next five', fx: 'Short term' });
      if (exp <= 12) o.push({ id: 't_tophalf', t: 'Top half by the winter break', fx: 'By week 19' });
      if (exp <= 9) o.push({ id: 't_top6', t: 'Top six by the winter break', fx: 'By week 19' });
      if (exp <= 5) o.push({ id: 't_top2', t: 'Top two by the end of the season', fx: 'By week 38' });
      o.push({ id: 't_youth', t: 'Start more youngsters', fx: '1.5 under-21s per match' });
      T.opts = o.slice(0, 4); break; }
    default:
      if (id.startsWith('pl_')) {
        const p = g().squad.find(x => x.id === +id.slice(3)); if (!p) { end(); break; }
        const better = g().squad.filter(q => q.pos === p.pos && q.ca > p.ca && q.inj <= 0).length;
        say('coach', p.inj > 0 ? `${p.name.split(' ')[1] || p.name} is injured. Nothing to discuss until he is fit.` : better >= 2 ? `There are ${better} ahead of him. He has to earn it in training.` : p.morale < 45 ? 'His head is not right. I am handling it.' : p.age <= 20 ? 'Talented. I do not want to burn him out.' : 'He is in my plans. Patience.');
        T.pid = p.id; T.opts = [{ id: 'pp_push', t: 'Give him minutes', fx: 'He plays more for 6 weeks' }, { id: 'pp_ok', t: 'Your call', fx: 'Relationship up' }];
      } else if (id === 'pp_push') {
        S.pushP[T.pid] = 6; if (P.ego > 14) { say('coach', 'I will look at it. No promises.'); rel(-4); } else { say('coach', 'Fair. He gets his chance.'); rel(-1); }
        const p = g().squad.find(x => x.id === T.pid); if (p) p.morale = clamp(p.morale + 8, 0, 100); fxNote('More minutes for 6 weeks'); end();
      } else if (id === 'pp_ok') { say('coach', 'Thanks for trusting me.'); rel(2); end(); }
      else if (id.startsWith('t_')) {
        const kk = id.slice(2), lab = (T.opts.find(o => o.id === id) || {}).t || '', G2 = g();
        const by = kk === 'unbeaten' ? G2.week + 5 : kk === 'top2' ? 38 : kk === 'youth' ? Math.min(38, G2.week + 10) : Math.max(19, G2.week + 4);
        const exp = F.expectedRank(), hard = (kk === 'top6' && exp > 6) || (kk === 'top2' && exp > 3) || (kk === 'tophalf' && exp > 10);
        if (hard && P.ego < 12 && P.amb < 12) { say('coach', 'That is a stretch with this squad. But fine, I will sign up to it.'); rel(-2); }
        else say('coach', P.amb > 14 ? 'Done. Write it down.' : 'Agreed.');
        S.deal = { k: kk, t: lab, by, agreed: 1, g0: S.games.length, p0: S.played, u0: S.u21, w0: G2.week };
        boost(3, 5); fxNote('Target agreed'); end();
      }
  }
  if (T.step++ >= 3 && !T.done) end();
  return {};
}
function talkClose() { const S = ft(); if (S.talk && S.talk.done) S.talk = null; }

/* ---------- sacking ---------- */
function sackQuote() {
  const s = staff('coach'); if (!s) return null; const G = g(), pos = F.myPos(), exp = F.expectedRank(), under = pos > exp + 2;
  const cost = Math.round(s.wage * Math.max(8, s.contract * 20));
  return { cost, under, fans: under ? 2 : -5, press: under ? 0 : -4, board: G.week <= 2 ? 0 : under ? 3 : -4, squad: s.rel > 60 ? -6 : -2 };
}
function sack() {
  const q = sackQuote(); if (!q) return { err: 'Vacant.' }; const G = g();
  const r = F.fire('coach'); if (r && r.err) return r;
  G.st.fans = clamp(G.st.fans + q.fans, 0, 100); G.st.press = clamp(G.st.press + q.press, 0, 100);
  for (const p of G.squad) p.morale = clamp(p.morale + q.squad, 0, 100);
  const S = ft(); S.deal = null; S.comp = 0; S.compW = 0; S.talk = null; S.pushP = {};
  return r;
}

/* ---------- view ---------- */
function view() {
  const G = g(), s = staff('coach'), S = ft();
  return {
    s, line: line(), games: S.games.slice(-6), pos: S.pos.slice(), exp: F.expectedRank(), rows: s ? mandateRows() : [], comp: compliance(),
    eyes: squadEyes(), res: Object.keys(RES).map(k => ({ k, ...RES[k], ...resCost(k), on: !!S.res[k], left: S.res[k] ? S.res[k].left : 0 })),
    deal: S.deal, last: S.last, talk: S.talk, injRisk: Math.round((0.6 + act('intensity') / 100 * 0.8) * H.ftInj() * 50), injS: S.injS || 0
  };
}

Object.assign(F, { ftView: view, ftTalkStart: talkStart, ftTalkAnswer: talkAnswer, ftTalkClose: talkClose, ftResBuy: resBuy, ftResCancel: resCancel, ftSackQuote: sackQuote, ftSack: sack, ftPref: () => pref(staff('coach')), ftCompliance: compliance, FT_RES: RES });
})(FO);
