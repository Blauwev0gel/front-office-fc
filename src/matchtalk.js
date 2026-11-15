/* The Front Office · match identity and commentary
   Opponents get a style, a form line and a dangerous player; commentary is drawn from banks that
   depend on the minute, the score, the size of the chance and the crowd. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const hs = x => { let h = 2166136261; for (const c of String(x)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; };
const STY = {
  direct: { t: 'Direct', d: 'Long balls, few but big chances', vol: 0.9, oxg: 1.15 },
  possession: { t: 'Possession', d: 'Lots of the ball, patient', vol: 1.08, oxg: 0.9 },
  defensive: { t: 'Defensive', d: 'Deep block, tight games', vol: 0.85, oxg: 1 },
  pressing: { t: 'Pressing', d: 'High tempo, open games', vol: 1.12, oxg: 1.02 }
};
const FN = ['Danny', 'Marcus', 'Jamie', 'Lewis', 'Callum', 'Ryan', 'Tyler', 'Kieran', 'Jordan', 'Reece', 'Liam', 'Ashley', 'Dominic', 'Femi', 'Kwame', 'Mateo', 'Tomasz', 'Jonas'];
const LN = ['Holloway', 'Pritchard', 'Okafor', 'Brennan', 'Mallory', 'Sutton', 'Ferris', 'Adebayo', 'Kowalski', 'Lindqvist', 'Rowe', 'Gallagher', 'Mbeki', 'Doherty', 'Varela', 'Thornton', 'Akande', 'Hendry'];
function opp(id) {
  const c = g().clubs[id]; if (!c) return null;
  if (!c.sty) { const h = hs(c.name + id); c.sty = Object.keys(STY)[h % 4]; c.star = { name: FN[(h >>> 3) % FN.length] + ' ' + LN[(h >>> 7) % LN.length], pos: ['ST', 'W', 'AM', 'ST'][(h >>> 11) % 4] }; }
  return c;
}
H.oppStyle = id => { const c = opp(id); return c ? STY[c.sty] : { vol: 1, oxg: 1 }; };
const P = a => a[Math.floor(F.rnd() * a.length)];
const sur = n => n.split(' ').slice(-1)[0];
const crowd = () => { const c = g().club; return c.cap ? Math.min(1, (c.lastAtt || 0) / c.cap) : 0; };
H.say = (k, x) => {
  const G = g(), my = G.club.short;
  if (k === 'ko') { const c = opp(x.opp), r = G.rival === x.opp; return (r ? 'Derby day. ' : '') + (x.home ? P([`Kick-off at home against ${x.opName}.`, `We are under way against ${x.opName}.`, `${x.opName} get us started.`]) : P([`Kick-off away at ${x.opName}.`, `Under way at ${x.opName}'s ground.`])) + (c ? ` They play ${STY[c.sty].t.toLowerCase()}, watch ${c.star.name}.` : ''); }
  if (k === 'goal_us') {
    const s = x.sh.name, a = x.as ? x.as.name : null, late = x.m >= 85, lvl = x.ug === x.tg, lead = x.ug - x.tg, home = x.home && crowd() > 0.5;
    const open = late && (lvl || lead === 1) ? P([`LATE GOAL ${my}!`, `${my} SCORE AT THE DEATH!`, `It's in, deep in stoppage time!`]) : lead === 1 && x.ug + x.tg === 1 ? P([`GOAL ${my}! The opener.`, `${my} lead!`, `GOAL! First blood to ${my}.`]) : lvl ? P([`${my} are level!`, `GOAL ${my}! All square.`, `Equaliser for ${my}!`]) : P([`GOAL ${my}!`, `Another for ${my}!`, `GOAL! ${my} pull away.`]);
    const how = x.xg > 0.4 ? P([`${s} taps in${a ? ' after ' + sur(a) + ' squares it' : ''}`, `${s} cannot miss from there${a ? ', ' + sur(a) + ' with the assist' : ''}`]) : x.xg < 0.08 ? P([`${s} from distance, what a strike`, `${s} bends one into the top corner`, `${s} lets fly and it flies in`]) : P([`${s} finishes${a ? ' from ' + sur(a) + "'s pass" : ' on his own'}`, `${s} heads home${a ? ' from ' + sur(a) + "'s cross" : ''}`, `${s} slots it low${a ? ' after a fine ball from ' + sur(a) : ''}`, `${s} turns and scores`]);
    return `${open} ${how}.${home ? ' ' + P(['The home end erupts.', 'The stands are bouncing.', 'What a noise from the crowd.']) : ''}`;
  }
  if (k === 'ch_us') {
    const s = x.sh.name;
    if (x.big) return P([`Huge chance! ${s} should score but the keeper saves.`, `${s} is clean through... and hits the post!`, `How has ${s} missed that? Wide from six yards.`, `${s} skies a sitter.`, `Point-blank save denies ${s}.`, `${s} takes one touch too many and it's gone.`]);
    const late = x.m > 80 && x.ug <= x.tg;
    return late ? P([`${s} tries his luck, pushing for a goal.`, `${my} throw bodies forward, ${s} shoots wide.`, `Pressure from ${my}, ${s} sees it blocked.`]) : P([`${s} drives wide from distance.`, `${s} forces a save.`, `${s} heads over.`, `${s} curls one just past the post.`, `${s} sees his shot blocked.`, `Decent move, ${s} finishes it weakly.`, `${s} snatches at it.`, `${s} shoots straight at the keeper.`, `Corner cleared, ${s} volleys over.`, `${s} wins a free kick and sends it into the wall.`, `${s} lashes at it, high and wide.`, `Neat one-two, but ${s} drags it wide.`, `${s} goes for the far corner, the keeper holds.`, `${s} tries a chip, too much on it.`, `Half-chance for ${s}, blocked at the last.`, `${s} from the edge of the box, it deflects behind.`, `${s} looks for the bottom corner, just wide.`, `Good pressure, ${s} fires into the side netting.`]);
  }
  if (k === 'goal_them') {
    const c = opp(x.opp), star = c && F.rnd() < 0.4 ? c.star.name : null, late = x.m >= 85;
    const how = star ? P([`${star} again, he finishes coolly.`, `${star} punishes us.`, `${star} with a clinical finish.`]) : x.xg > 0.4 ? P(['A tap-in at the back post.', 'Left completely unmarked.', 'A defensive mix-up punished.']) : x.xg < 0.08 ? P(['A long-range screamer.', 'Out of nothing, a stunning strike.']) : P(['A header from a corner.', 'A low drive into the corner.', 'Cut back and swept home.', 'A deflection wrong-foots the keeper.']);
    return `${late ? 'Late heartbreak. ' : ''}Goal ${x.opName}. ${how}`;
  }
  if (k === 'ch_them') { const kp = x.kp ? x.kp.name : null; return kp ? P([`${kp} with a big save to deny ${x.opName}.`, `${kp} spreads himself and blocks.`, `Fingertip save from ${kp}!`, `${x.opName} hit the bar, ${sur(kp)} beaten.`]) : `${x.opName} miss a sitter.`; }
  if (k === 'sub') { const d = x.ug - x.tg; return d < 0 && x.m > 60 ? P([`Changes to chase it: ${x.inn.name} on for ${x.out.name}.`, `${x.inn.name} comes on to add punch, ${x.out.name} off.`]) : d > 0 && x.m > 70 ? P([`Fresh legs to see it out: ${x.inn.name} for ${x.out.name}.`, `${x.out.name} off, ${x.inn.name} on to shore it up.`]) : P([`Substitution: ${x.inn.name} replaces ${x.out.name}.`, `${x.inn.name} on, ${x.out.name} off.`, `A change: ${x.out.name} makes way for ${x.inn.name}.`]); }
  return '';
};
function preview() {
  const G = g(), fx = G.divs[G.club.tier] && G.divs[G.club.tier].fix[G.week - 1]; if (!fx) return null;
  const f = fx.find(x => x[0] === 0 || x[1] === 0); if (!f) return null; const home = f[0] === 0, id = home ? f[1] : f[0], c = opp(id); if (!c) return null;
  const tab = F.sortTable(G.club.tier), pos = tab.indexOf(id) + 1, mine = F.myPos(), str = c.str - F.teamStrength();
  return { id, name: F.cname(id), home, pos, mine, sty: STY[c.sty], star: c.star, fm: (c.fm || []).slice(-5), rival: G.rival === id, odds: str > 0.6 ? 'Underdogs' : str < -0.6 ? 'Favourites' : 'Even' };
}
// a CEO moment before some home games: who do you host in the boardroom?
F.defineBrief('pre_box', { role: 'board', cd: 5,
  check: () => { const p = preview(); return p && p.home && F.rnd() < 0.45 ? { score: 2, opp: p.name, rival: p.rival } : null; },
  title: c => c.rival ? `Derby day: who sits with you in the boardroom?` : `Saturday's boardroom: ${c.opp} come to town`,
  text: c => `Twelve seats in the boardroom on Saturday. Who you invite says something about the club.`,
  opts: [
    { l: 'Host our sponsors', h: () => `+${F.money(Math.round(F.M(400) / 10) * 10)} · sponsors ↑`, f: () => { const G = g(); G.club.cash += Math.round(F.M(400) / 10) * 10; G.st.spons = F.clamp(G.st.spons + 3, 0, 100); return 'Handshakes, a good lunch and a hint of a new deal.'; } },
    { l: 'Invite the supporters\' club', h: 'Fans ↑ · loyalty ↑', f: () => { const G = g(); G.st.fans = F.clamp(G.st.fans + 3, 0, 100); if (G.mk) G.mk.loyalty = F.clamp(G.mk.loyalty + 4, 0, 100); return 'They post photos all evening. The forum is full of it.'; } },
    { l: 'A quiet one, no distractions', h: 'Coach appreciates it', f: () => { const s = F.staff('coach'); if (s) s.rel = F.clamp(s.rel + 2, 0, 100); return 'The coach thanks you for keeping the circus away.'; } }] });
Object.assign(F, { mtOpp: opp, mtPreview: preview, MT_STY: STY });
})(FO);
