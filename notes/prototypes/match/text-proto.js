/* Prototype text engine: turns match events into lines with a weight, variety without repeats, and summaries of quiet spells. */
module.exports = function protoText(M, seed = 1) {
  let s = seed >>> 0; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const used = new Set();
  // pick a template not used yet in this match
  const say = (bank, ctx) => { const free = bank.map((t, i) => [t, i]).filter(([t]) => !used.has(t)); const pool = free.length ? free : bank.map((t, i) => [t, i]); const [t] = pool[Math.floor(rnd() * pool.length)]; used.add(t); return t(ctx); };
  const sur = n => n ? n.split(' ').slice(-1)[0] : '';
  const US = M.club.short, THEM = M.opp.name, crowd = M.home && M.fill > 0.75;
  const team = side => side === 'us' ? US : THEM;
  const scr = x => x ? (M.home ? `${x.us}–${x.them}` : `${x.them}–${x.us}`) : '';
  const lines = [];
  const B = {
    ko: [c => `${M.rival ? 'Derby day. ' : ''}${M.home ? `${THEM} get us under way.` : `We kick off away at ${THEM}.`}${M.wx.rain ? ' The rain is coming down.' : ''}`, c => `${M.home ? (crowd ? 'A full house, and we are off.' : 'We are under way at home.') : `Away at ${THEM}, and we are off.`}`],
    goal_us: [c => `GOAL! ${c.who} ${c.kind === 'header' ? 'heads in' : c.kind === 'close' ? 'cannot miss from there' : c.kind === 'distance' ? 'from distance, and it flies in' : 'finishes it'}${c.by ? `, ${sur(c.by)} with the ${c.kind === 'header' ? 'cross' : 'pass'}` : ''}.`, c => `${c.who} scores! ${c.from && c.from !== c.by ? `${sur(c.from)} started it, ` : ''}${sur(c.by)} found him${c.kind === 'header' ? ' at the far post' : ''}.`, c => `It's in! ${c.who}${c.kind === 'distance' ? ' from twenty-five yards' : ''}. ${c.by ? `Lovely work from ${sur(c.by)}.` : ''}`],
    goal_them: [c => `${c.star ? `${c.who} again. The man we were warned about.` : `Goal ${THEM}. ${c.who} ${c.kind === 'header' ? 'heads in from the cross' : c.kind === 'distance' ? 'from range' : 'gets on the end of it'}.`}`, c => `${THEM} score. ${sur(c.by)} plays it in, ${c.who} does the rest.`, c => `${c.who} punishes us${c.kind === 'header' ? ' in the air' : ''}.`],
    save_us: [c => `${c.who} ${c.big ? 'should score' : 'tries his luck'}, but ${c.keeper} saves.`, c => `Good work from ${sur(c.by)}, ${c.who}'s shot is held by ${c.keeper}.`, c => `${c.big ? 'Huge chance! ' : ''}${c.keeper} gets down to stop ${c.who}.`],
    save_them: [c => `${c.keeper} with ${c.big ? 'a big save' : 'a comfortable save'} from ${c.who}.`, c => `${c.who} shoots, ${c.keeper} is there.`, c => `${c.big ? 'Fingertips! ' : ''}${c.keeper} keeps out ${c.who}.`],
    miss_us: [c => `${c.who} ${c.kind === 'header' ? 'heads over' : c.kind === 'distance' ? 'shoots wide from distance' : 'drags it wide'}.`, c => `${c.big ? 'How has he missed that? ' : ''}${c.who}, wide.`, c => `${sur(c.by)} picks out ${c.who}, but the shot is off target.`, c => `${c.who} ${c.kind === 'header' ? 'gets his head to it, just over' : 'curls it past the post'}.`],
    miss_them: [c => `${c.who} ${c.kind === 'header' ? 'heads wide' : 'shoots wide'} for ${THEM}.`, c => `${c.big ? 'Let off! ' : ''}${c.who} misses for ${THEM}.`, c => `${c.who} ${c.kind === 'distance' ? 'tries from range, well over' : 'snatches at it'}.`, c => `Over the bar from ${c.who}.`, c => `${sur(c.by)} finds ${sur(c.who)}, who scuffs it.`],
    block_us: [c => `${c.who}'s shot is blocked by ${c.stop}.`], block_them: [c => `${c.stop} throws himself in front of ${c.who}'s shot.`, c => `Blocked by ${c.stop}. Good defending.`],
    red_us: [c => `Red card. ${c.who} is off, and we are down to ten.`], red_them: [c => `Red card for ${c.who}! ${THEM} are down to ten.`],
    yellow: [c => `${c.who} is booked.`, c => `A yellow card for ${c.who}.`],
    sub_us: [c => `${c.inn} on for ${c.out}${c.tired < 55 ? ', who is out on his feet' : ''}.`], sub_them: [c => `${THEM} change: ${c.inn} for ${c.out}.`],
    injury_us: [c => `${c.who} goes down and cannot continue.${c.inn ? ` ${sur(c.inn)} comes on.` : ' We have no changes left.'}`], injury_them: [c => `${c.who} is hurt and goes off for ${THEM}.`],
    corner: [c => `Corner to ${team(c.side)}.`],
    spell_us: [c => 'A long spell on the ball for us. Nothing clear yet.', c => 'We keep it, probe, and keep it again.', c => 'Patient stuff from us, no way through.'],
    spell_them: [c => `${THEM} have the ball for a while. We hold our shape.`, c => `Pressure from ${THEM}, but nothing on target.`, c => `We are pinned back. ${THEM} cannot find the opening.`],
    trace_fitness: [c => 'The fitness work shows: we are finishing stronger than they are.'], trace_intensity: [c => 'The intense week of training shows. We are first to every ball.'],
    ht: [c => `Half-time: ${scr(c.score)}.`], ft: [c => `Full time: ${scr(c.score)}.`]
  };
  for (const e of M.ev) {
    let key = e.k; if (['goal', 'save', 'miss', 'block', 'red', 'sub', 'injury', 'spell'].includes(e.k)) key = e.k + '_' + (e.side === 'us' ? 'us' : 'them'); if (e.k === 'trace') key = 'trace_' + e.t;
    if (e.k === 'lost') continue; // carried by the momentum, not by text
    if (e.k === 'corner' && rnd() < 0.6) continue;
    const bank = B[key]; if (!bank) continue;
    const score = e.score ? (M.home ? e.score : e.score) : null;
    let t = say(bank, { ...e, score: e.score }); if (e.k === 'goal') t += ` ${scr(e.score)}.`;
    // the weight decides how big a line is: 3 = headline, 2 = big, 1 = normal, below = small
    const size = e.w >= 4 ? 'goal' : e.w >= 2 ? 'big' : e.w >= 0.8 ? 'normal' : 'small';
    lines.push({ m: Math.min(e.m, 94), side: e.side || null, k: e.k, size, t, who: e.whoId || null, score: e.score || null });
  }
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.size === 'small' && ['miss', 'block', 'corner'].includes(l.k) && l.side) {
      const run = [l]; let j = i + 1; while (j < lines.length && lines[j].size === 'small' && lines[j].side === l.side && ['miss', 'block', 'corner'].includes(lines[j].k) && lines[j].m - l.m <= 6) run.push(lines[j++]);
      if (run.length >= 3) { const shotsN = run.filter(x => x.k !== 'corner').length; out.push({ m: run[run.length - 1].m, side: l.side, k: 'cluster', size: 'small', t: l.side === 'us' ? `${shotsN} efforts from us in a few minutes, none on target.` : `${THEM} keep coming: ${shotsN} efforts in a few minutes, none on target.` }); i = j - 1; continue; }
    }
    out.push(l);
  }
  return out;
};
