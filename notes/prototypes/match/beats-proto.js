/* Prototype commentary engine: every moment becomes a short run of beats (build-up, tension, a pause, the outcome, sometimes an echo),
   plus a context line that knows the score, the minute, the pressure and the stories of the week. The outcome is never in the build-up. */
module.exports = function beats(M, X = {}, seed = 3) {
  let s = seed >>> 0; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const used = new Set();
  const say = (bank, c) => { const all = bank.map(f => f), free = all.filter(f => !used.has(f)); const pool = free.length ? free : all; const f = pool[Math.floor(rnd() * pool.length)]; used.add(f); return f(c); };
  const sur = n => n ? n.split(' ').slice(-1)[0] : '';
  const US = M.club.name.split(' ')[0], THEM = M.opp.name, TS = THEM.split(' ')[0];
  const H = M.home, full = H && M.fill > 0.8;
  const scr = x => H ? `${x.us}–${x.them}` : `${x.them}–${x.us}`;
  const story = {}; for (const st of X.stories || []) story[st.name] = st;
  const BANK = {
    build: [c => `${sur(c.from)} wins it back and looks up.`, c => `${sur(c.from)} carries it forward${c.side === 'us' ? '' : ' for ' + TS}.`, c => `${c.flank === 'centre' ? 'Through the middle' : 'Down the ' + c.flank} for ${c.side === 'us' ? US : TS}.`, c => `${sur(c.from)} finds ${sur(c.by)} in space.`, c => `${c.side === 'us' ? 'We' : TS} break at speed.`],
    tensionCross: [c => `${sur(c.by)} whips it in from the ${c.flank}…`, c => `${sur(c.by)} gets to the byline, and crosses…`, c => `A cross from ${sur(c.by)}… ${sur(c.who)} is waiting…`],
    tensionPass: [c => `${sur(c.by)} slides it through for ${sur(c.who)}…`, c => `${sur(c.by)} lays it off to ${sur(c.who)}…`, c => `${sur(c.who)} is in on goal…`, c => `It falls to ${sur(c.who)}…`],
    tensionFar: [c => `${sur(c.who)} lines one up from distance…`, c => `${sur(c.by)} rolls it to ${sur(c.who)}, twenty-five yards out…`],
    goalUs: [c => `GOAL! ${c.who} ${c.kind === 'header' ? 'heads it in' : c.kind === 'distance' ? 'and it flies in' : c.kind === 'close' ? 'cannot miss' : 'finishes it'}.`, c => `IT'S IN! ${c.who}!`, c => `GOAL! ${c.who} ${c.kind === 'header' ? 'rises above everyone' : 'buries it'}.`],
    goalThem: [c => `${c.who} scores. ${TS} ${c.after.them > c.after.us ? 'lead' : 'are level'}.`, c => `In. ${c.who} ${c.kind === 'header' ? 'with a header' : c.kind === 'distance' ? 'from range' : 'at the far post'}.`, c => `${c.who} finishes. That hurts.`],
    save: [c => `Saved! ${c.keeper} ${c.big ? 'at full stretch' : 'gathers it'}.`, c => `${c.keeper} gets a hand to it!`, c => `Straight at ${sur(c.keeper)}.`],
    small: [c => `${sur(c.who)} ${c.kind === 'header' ? 'heads wide' : c.kind === 'distance' ? 'tries from distance, well over' : 'shoots wide'}.`, c => `${sur(c.who)} snatches at it. Wide.`, c => `Half a chance for ${sur(c.who)}, over the bar.`, c => `${sur(c.who)} has a go. Never troubling the keeper.`, c => c.k === 'block' ? `${sur(c.who)}'s shot is blocked by ${sur(c.stop)}.` : `${sur(c.who)} lifts it over.`],
    miss: [c => `Wide!`, c => `Over the bar.`, c => `${c.kind === 'header' ? 'He heads it' : 'He drags it'} past the post.`, c => `Off target.`],
    post: [c => `Off the post!`, c => `Against the bar!`],
    block: [c => `Blocked by ${sur(c.stop)}!`, c => `${sur(c.stop)} throws himself in the way.`],
    echoGoalUs: [c => full ? 'The home end erupts.' : `${US} ${c.after.us > c.after.them ? 'lead' : 'are level'}, ${scr(c.after)}.`, c => c.goalsN >= 2 ? `That is his ${c.goalsN === 2 ? 'second' : 'third'} of the afternoon.` : `${scr(c.after)}.`, c => c.story ? `${c.story}` : `${scr(c.after)}, and the bench is on its feet.`],
    echoGoalThem: [c => c.star ? 'The man we were warned about. Of course it was.' : `${scr(c.after)}. The ${H ? 'home' : 'away'} end goes quiet.`, c => `${scr(c.after)}.`],
    echoMiss: [c => c.shotN >= 3 ? `That is his ${c.shotN === 3 ? 'third' : c.shotN + 'th'} chance today.` : c.side === 'us' ? 'He knows he should have scored.' : 'A let-off.', c => c.side === 'us' ? 'Heads in hands on the bench.' : 'We got away with that.'],
    red: [c => `Red card. ${c.who} is off.`, c => `Straight red for ${c.who}.`],
    echoRed: [c => `${c.side === 'us' ? 'We' : TS} play the last ${Math.max(1, 90 - c.m)} minutes with ten.`],
    yellow: [c => `${sur(c.who)} goes into the book.`, c => `A booking for ${sur(c.who)}.`],
    sub: [c => `${sur(c.inn)} on, ${sur(c.out)} off${c.tired < 55 ? ', out on his feet' : ''}.`, c => `Change for ${c.side === 'us' ? US : TS}: ${sur(c.inn)} for ${sur(c.out)}.`],
    injury: [c => `${sur(c.who)} is down, and it looks bad.${c.inn ? ` ${sur(c.inn)} warms up.` : ''}`],
    spellUs: [c => 'We keep the ball. They sit deep.', c => 'Patient from us. No way through yet.', c => 'Plenty of the ball, not much in front of goal.'],
    spellThem: [c => `${TS} have it now. We hold our shape.`, c => `${TS} pass it around. We wait.`, c => `A spell of pressure from ${TS}.`],
    cluster: [c => c.side === 'us' ? `We keep coming: ${c.n} efforts in a few minutes, none on target.` : `${TS} keep coming: ${c.n} efforts, none on target.`]
  };
  const out = []; const push = (m, side, size, k, bts) => out.push({ m, side, size, k, beats: bts });
  // a few context facts, computed as the match goes (from events up to that minute)
  const ev = M.ev.slice().sort((a, b) => a.m - b.m);
  for (let i = 0; i < ev.length; i++) {
    const e = ev[i], st = e.whoId != null ? null : null;
    const c = { ...e, after: e.score || {}, story: story[e.who] ? story[e.who].t : null };
    const shotKinds = ['goal', 'save', 'miss', 'block'];
    if (e.k === 'ko') {
      const lu = X.lineup ? `${US}: ${X.lineup.join(', ')}.` : '';
      push(0, null, 'big', 'ko', [{ k: 'out', t: `${M.rival ? 'Derby day. ' : ''}${H ? `${M.club.name} v ${THEM}` : `${THEM} v ${M.club.name}`}. ${M.wx.rain ? 'Rain, a heavy pitch.' : full ? 'A full house.' : 'Kick-off.'}`, hold: 1400 }, ...(X.danger ? [{ k: 'after', t: `Watch ${X.danger}, their dangerous man.`, hold: 1200 }] : []), ...(lu ? [{ k: 'after', t: lu, hold: 1200 }] : [])]);
      continue;
    }
    if (e.k === 'ht' || e.k === 'ft') { const sh = { us: 0, them: 0 }; for (const x of ev) if (x.m <= e.m && shotKinds.includes(x.k)) sh[x.side]++;
      const who = sh.us > sh.them + 2 ? 'We have had the better of it' : sh.them > sh.us + 2 ? `${TS} have had the better of it` : 'Not much between the sides';
      push(e.m, null, 'big', e.k, [{ k: 'out', t: `${e.k === 'ht' ? 'Half-time' : 'Full time'}. ${scr(e.score)}.`, hold: 1100 }, { k: 'after', t: `${who}: ${H ? sh.us : sh.them} shots to ${H ? sh.them : sh.us}.`, hold: 1000 }]); continue; }
    if (shotKinds.includes(e.k)) {
      // three or more small efforts from one side within six minutes become one quiet line
      if (e.k !== 'goal' && !e.big && e.w < 0.8) { let j = i, n = 0; while (j < ev.length && ev[j].side === e.side && ['miss', 'block'].includes(ev[j].k) && !ev[j].big && ev[j].m - e.m <= 6) { n++; j++; }
        if (n >= 3) { push(ev[j - 1].m, e.side, 'small', 'cluster', [{ k: 'out', t: say(BANK.cluster, { side: e.side, n }), hold: 550 }]); i = j - 1; continue; } }
      const big = e.k === 'goal' || e.big, bts = [];
      const tension = e.kind === 'distance' ? BANK.tensionFar : e.wide ? BANK.tensionCross : BANK.tensionPass;
      if (big && e.from && e.from !== e.by && e.from !== e.who) bts.push({ k: 'build', t: say(BANK.build, c), hold: 550 });
      if (big || e.w >= 0.8) bts.push({ k: 'tension', t: say(tension, c), hold: big ? 700 : 600 });
      if (big) bts.push({ k: 'pause', t: '', hold: 250 + Math.round((e.xg || 0.1) * 1300) });
      const o = e.k === 'goal' ? say(e.side === 'us' ? BANK.goalUs : BANK.goalThem, c) : e.k === 'save' ? say(BANK.save, c) : e.k === 'block' ? say(BANK.block, c) : (big && rnd() < 0.25 ? say(BANK.post, c) : say(BANK.miss, c));
      if (!bts.length && e.k !== 'goal') { push(e.m, e.side, 'small', e.k, [{ k: 'out', t: say(BANK.small, c), hold: 450 }]); continue; }
      bts.push({ k: 'out', t: o, hold: e.k === 'goal' ? 1800 : big ? 900 : 600, goal: e.k === 'goal' });
      if (e.k === 'goal') bts.push({ k: 'after', t: say(e.side === 'us' ? BANK.echoGoalUs : BANK.echoGoalThem, c), hold: 1000 });
      else if (big && (e.shotN >= 3 || rnd() < 0.5)) bts.push({ k: 'after', t: say(BANK.echoMiss, c), hold: 750 });
      push(e.m, e.side, e.k === 'goal' ? 'goal' : big ? 'big' : 'normal', e.k, bts); continue;
    }
    if (e.k === 'red') { push(e.m, e.side, 'big', 'red', [{ k: 'out', t: say(BANK.red, c), hold: 1500 }, { k: 'after', t: say(BANK.echoRed, c), hold: 1100 }]); continue; }
    if (e.k === 'yellow') { push(e.m, e.side, 'small', 'yellow', [{ k: 'out', t: say(BANK.yellow, c), hold: 450 }]); continue; }
    if (e.k === 'sub') { push(e.m, e.side, 'small', 'sub', [{ k: 'out', t: say(BANK.sub, c), hold: 450 }]); continue; }
    if (e.k === 'injury') { push(e.m, e.side, 'normal', 'injury', [{ k: 'out', t: say(BANK.injury, c), hold: 1100 }]); continue; }
    if (e.k === 'spell') { push(e.m, e.side, 'small', 'spell', [{ k: 'out', t: say(e.side === 'us' ? BANK.spellUs : BANK.spellThem, c), hold: 500 }]); continue; }
    if (e.k === 'trace') { push(e.m, 'us', 'normal', 'trace', [{ k: 'out', t: e.t === 'fitness' ? 'The fitness work shows. We are finishing stronger than they are.' : 'The intense week of training shows. We are first to every ball.', hold: 1200 }]); continue; }
  }
  // the context line for each moment: pressure in the last ten minutes, the expected goals so far, a story, the stakes
  for (const mo of out) {
    const m = mo.m, recent = { us: 0, them: 0 }, xg = { us: 0, them: 0 };
    for (const x of ev) { if (x.m > m) break; if (['goal', 'save', 'miss', 'block'].includes(x.k)) { xg[x.side] += x.xg || 0; if (m - x.m <= 10) recent[x.side]++; } }
    const st = mo.beats.map(b => b.t).join(' '); const sto = Object.values(story).find(z => st.includes(sur(z.name)));
    if (mo.k === 'ht' || mo.k === 'ft') { mo.ctx = `Expected goals: ${(H ? xg.us : xg.them).toFixed(1)} – ${(H ? xg.them : xg.us).toFixed(1)}`; continue; }
    mo.ctx = recent.them >= 4 ? `${TS} pressing: ${recent.them} shots in ten minutes` : recent.us >= 4 ? `We are pressing: ${recent.us} shots in ten minutes` : sto ? `${sur(sto.name)}: ${sto.tag.toLowerCase()}` : m >= 80 && Math.abs((mo.beats.find(b => b.goal) ? 0 : 0)) === 0 && m < 94 ? `${94 - m} minute${94 - m === 1 ? '' : 's'} left` : m > 0 ? `Expected goals so far: ${(H ? xg.us : xg.them).toFixed(1)} – ${(H ? xg.them : xg.us).toFixed(1)}` : (X.stake || 'Kick-off');
  }
  return out;
};
