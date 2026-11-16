/* ---------- match simulation ---------- */
function expRand(m) { return -Math.log(1 - rnd()) * m; }
function simOurMatch(oppId, home, comp) {
  const opp = G.clubs[oppId], L = pickXI(true), me = teamStrength(L), os = opp.str + gauss() * 0.3;
  const d = me - os + (HOOK.homeEdge ? HOOK.homeEdge(home) : (home ? 0.35 : -0.35));
  const att = cact('attack') / 100, intn = cact('intensity') / 100, vol = 0.85 + 0.3 * att, share = 1 / (1 + Math.exp(-0.6 * d));
  const wx = { rain: chance(0.25), night: chance(0.3) }; /* weather: rain means fewer and poorer chances */
  let redUs = 0, redThem = 0;
  const OS = HOOK.oppStyle ? HOOK.oppStyle(oppId) : { vol: 1, oxg: 1 };
  const n = poisson(27 * vol * OS.vol * (wx.rain ? 0.92 : 1)), ev = [], onPitch = L.xi.map(x => x.p), mins = new Map(onPitch.map(p => [p.id, 0])), start = new Map(onPitch.map(p => [p.id, 0]));
  const ps = new Map(); const S2 = p => { if (!ps.has(p.id)) ps.set(p.id, { g: 0, a: 0, xg: 0, xa: 0, yc: 0, rc: 0 }); return ps.get(p.id); };
  let ug = 0, tg = 0, uxg = 0, txg = 0;
  const gk = L.xi.find(x => x.slot === 'GK');
  const chances = []; for (let i = 0; i < n; i++) chances.push({ m: rnd() < 0.46 ? ri(1, 47) : ri(46, 90) });
  for (let i = 0; i < 2; i++) if (rnd() < 0.55) chances.push({ m: ri(88, 95), late: 1 });
  // subs
  const subs = []; const bench = L.bench.slice(); const nsub = Math.min(3, bench.length);
  for (let i = 0; i < nsub; i++) subs.push({ m: ri(55, 82) });
  // cards & injuries
  const cards = []; const ny = ri(0, 3); for (let i = 0; i < ny; i++) cards.push({ m: ri(10, 90), red: chance(0.065) });
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
        let xg = clamp(expRand(0.112) * (1 + 0.05 * (sh.a.fin - os)) * (e.push > 0 ? 1.15 : 1) * (1 + (att - 0.5) * 0.08) * (wx.rain ? 0.95 : 1), 0.02, 0.78);
        const goal = rnd() < xg * (1 + (sh.a.com - 10) * 0.015);
        const as = chance(0.72) ? pickW(lp.filter(p => p !== sh), p => (p.a.pas + p.a.vis + (p.pos === 'W' || p.pos === 'FB' ? p.a.cro : 0)) * (LINE[p.pos] === 'GK' ? 0.1 : 1)) : null;
        S2(sh).xg += xg; uxg += xg; if (as) S2(as).xa += xg;
        if (goal) { ug++; S2(sh).g++; if (as) S2(as).a++; ev.push({ m: e.m, k: 'goal', us: 1, pid: sh.id, aid: as ? as.id : null, t: (HOOK.say ? HOOK.say('goal_us', { sh, as, m: e.m, home, ug, tg, xg, my }) : `GOAL ${my}! ${sh.name} finishes${as ? ' from ' + as.name + "'s pass" : ' on his own'}.`) + ` (xG ${xg.toFixed(2)})`, sc: [ug, tg] }); }
        else ev.push({ m: e.m, k: 'ch', us: 1, pid: sh.id, t: HOOK.say ? HOOK.say('ch_us', { sh, xg, m: e.m, big: xg > 0.3, ug, tg }) + ` (xG ${xg.toFixed(2)})` : xg > 0.3 ? `Huge chance! ${sh.name} should score but ${pick(['the keeper saves', 'drags it wide', 'hits the post', 'skies it'])}. (xG ${xg.toFixed(2)})` : `${sh.name} ${pick(['drives wide from distance', 'forces a save', 'heads over', 'curls one just past the post', 'sees his shot blocked'])}. (xG ${xg.toFixed(2)})` });
      } else {
        const ourDef = L.xi.filter(x => LINE[x.slot] === 'DF').reduce((a, x) => a + x.p.ca, 0) / 4 || 5;
        let xg = clamp(expRand(0.112) * (1 + 0.05 * (os - ourDef)) * (e.push < 0 ? 1.15 : 1) * (1 + (att - 0.5) * 0.2) * OS.oxg * (wx.rain ? 0.95 : 1), 0.02, 0.78);
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
    if (mn > 0 && chance(injP * f)) { p.inj = ri(1, 7); out.push(p); const st0 = start.get(p.id) || 0; ev.push({ m: clamp(st0 + ri(1, Math.max(1, mn)), 1, 90), k: 'inj', us: 1, t: `${p.name} pulls up injured.` }); if (p.inj >= 4) { (p.ms = p.ms || []).push({ s: G.season, w: G.week, t: `Injured against ${opName}, out for ${p.inj} weeks.` }); (G.msNew = G.msNew || []).push({ pid: p.id, t: `Injured, out for ${p.inj} weeks.` }); } }
    p.yc = (p.yc || 0) + s.yc; if (p.yc >= 5) { p.yc = 0; p.susp = Math.max(p.susp, 1); }
  }
  ev.sort((a, b) => a.m - b.m);
  ev.push({ m: 90, k: 'ft', t: `Full time. ${home ? G.club.name + ' ' + ug + '–' + tg + ' ' + opName : opName + ' ' + tg + '–' + ug + ' ' + G.club.name}.` });
  const motm = [...mins.keys()].map(id => G.squad.find(x => x.id === id)).filter(Boolean).sort((a, b) => b.lastRat - a.lastRat)[0];
  const why = whyLines({ me, os, home, ug, tg, uxg, txg, reds: [redUs, redThem], L, att, result });
  return { why, wx, fill: home && G.club.cap ? Math.min(1, attendance() / G.club.cap) : null, comp, home, opp: oppId, oppName: opName, ug, tg, uxg, txg, ev, result, dpre: +(me - os).toFixed(2), edge: +(d - (me - os)).toFixed(2), reds: [redUs, redThem], xi: L.xi.map(x => x.p.id), injured: out, motm: motm ? motm.name : '', att: home ? attendance() : 0 };
}
// why we won or lost, in two or three plain lines from the real factors (B26)
function whyLines(o) {
  const out = [], P = strengthParts(o.L), q = P.squad - (o.os - (P.coach + P.style + P.morale + P.extra)), gap = o.me - o.os;
  if (o.ug - o.uxg >= 0.9) out.push([2, `We were clinical: ${o.ug} goal${o.ug === 1 ? '' : 's'} from ${o.uxg.toFixed(1)} expected.`]);
  else if (o.uxg - o.ug >= 0.9) out.push([2, `We were wasteful in front: ${o.uxg.toFixed(1)} expected goals, ${o.ug} scored.`]);
  if (o.tg - o.txg >= 0.9) out.push([1.8, `They scored more than their chances deserved.`]);
  else if (o.txg - o.tg >= 0.9) out.push([1.4, `Our keeper and defence kept them out: ${o.txg.toFixed(1)} expected, ${o.tg} conceded.`]);
  if (gap > 0.5) out.push([1.2, 'We had the better players on the pitch.']); else if (gap < -0.5) out.push([1.5, 'They simply had better players.']);
  if (o.reds[0]) out.push([2.5, 'Our red card changed the game.']); if (o.reds[1]) out.push([2.2, 'Their red card opened the game up.']);
  if (o.home && G.club.cap && attendance() / G.club.cap > 0.85 && o.result !== 'L') out.push([1.3, 'A full house pushed us on.']);
  if (P.moraleAvg < 50) out.push([1.4, 'Morale is low, and it showed.']);
  const kids = o.L.xi.filter(x => x.p.age <= 21).length; if (kids >= 5 && o.result === 'L') out.push([1.6, `Five or more under-21s started: they learned the hard way.`]);
  if (o.att > 0.65 && o.tg >= 3) out.push([1.6, 'Going for goals left gaps at the back.']); if (o.att < 0.35 && o.result !== 'L' && o.tg === 0) out.push([1.3, 'Compact and patient: the defensive plan worked.']);
  return out.sort((a, b) => b[0] - a[0]).slice(0, 3).map(x => x[1]);
}
function quickSim(h, a) { const d = G.clubs[h].str - G.clubs[a].str + 0.3; return [poisson(1.48 * Math.exp(0.22 * d)), poisson(1.17 * Math.exp(-0.22 * d))]; }
function applyResult(t, h, a, hg, ag) { if (G.clubs[h]) G.clubs[h].fm = (G.clubs[h].fm || []).concat(hg > ag ? 'W' : hg < ag ? 'L' : 'D').slice(-5); if (G.clubs[a]) G.clubs[a].fm = (G.clubs[a].fm || []).concat(ag > hg ? 'W' : ag < hg ? 'L' : 'D').slice(-5); const tab = G.divs[t].tab, H = tab[h], A = tab[a]; H.p++; A.p++; H.gf += hg; H.ga += ag; A.gf += ag; A.ga += hg; if (hg > ag) { H.w++; A.l++; H.pts += 3; } else if (hg < ag) { A.w++; H.l++; A.pts += 3; } else { H.d++; A.d++; H.pts++; A.pts++; } }

