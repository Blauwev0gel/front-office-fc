/* The Front Office · phase 2: dossiers and pressure
   A dossier is a storyline in three parts that lands on the CEO's desk weeks apart.
   Every answer cools it down or heats it up; the ending depends on the heat you built.
   Small things grow: some dossiers start from how you handled an earlier message.
   Pressure on the club rises with defeats, wrong calls and open crises, and makes dossiers start
   more often and end harder. It shows as signals, never as a number. */
(function (F) {
'use strict';
const g = () => F.G, H = F.HOOK;
const { clamp, chance, pick, staff, money, M } = F;
const bk = (k, d) => { if (F.backerAdd) F.backerAdd(k, d); }; /* shown scale, see loop.js */
const cash = v => { g().club.cash += v; };
const rel = (r, n) => { const s = staff(r); if (s) s.rel = clamp(s.rel + n, 0, 100); };
const nm = r => { const s = staff(r); return s ? s.name.split(' ')[0] : 'Nobody'; };
const star = () => g().squad.slice().sort((a, b) => b.ca - a.ca)[0];
const kid = () => g().academy.slice().sort((a, b) => b.pa - a.pa)[0];

/* ---------- pressure ---------- */
function press(d) { const G = g(); G.pressure = clamp((G.pressure || 20) + d, 0, 100); }
const pv = () => g().pressure == null ? 20 : g().pressure;
const PSIG = [[80, 'The club feels under siege. Every small thing becomes a big thing.'], [60, 'The pressure is building. People are looking for someone to blame.'], [40, 'Some tension around the club. Nothing that cannot be handled.'], [0, '']];
const pSignal = () => PSIG.find(x => pv() >= x[0])[1];

/* ---------- dossier registry ---------- */
const DOS = {};
const defineDossier = (id, d) => { DOS[id] = { id, ...d }; };
const HEAT_T = ['Calm', 'Simmering', 'Hot', 'Burning'];
const heatT = h => HEAT_T[clamp(h, 0, 3)];

defineDossier('parking', { t: 'The parking war', who: 'fans', touches: ['fans', 'press', 'board'], w: () => 1,
  cond: () => g().week >= 3, setup: () => ({}),
  parts: [
    { t: 'Neighbours complain about matchday parking', b: () => 'Residents on Mill Lane say supporters block their driveways every home game. A local councillor has started asking questions.',
      o: [{ l: 'Pay for stewards on match days', h: c => `−${money(M(800))} · fans ↑`, heat: -1, f: () => { cash(-M(800)); bk('fans', 1); return 'Stewards in yellow jackets, every home game.'; } },
        { l: 'Write a friendly letter to the street', h: 'Free', heat: 0, f: () => 'A polite letter goes through every door on Mill Lane.' },
        { l: 'Say it is the council\'s problem', h: 'Press ↓', heat: 1, f: () => { bk('press', -2); return 'The councillor writes that down.'; } }] },
    { t: c => c.heat > 0 ? 'Mill Lane starts a petition' : 'Mill Lane asks for a meeting', b: c => c.heat > 0 ? 'Four hundred signatures against matchday parking, and the Gazette has a photo of a blocked ambulance. It is not a good photo.' : 'The residents want to sit down with someone senior. They seem reasonable, for now.',
      o: [{ l: 'Meet them yourself', h: 'One evening · press ↑', heat: -1, f: () => { bk('press', 2); return 'Tea, biscuits and a long list of complaints.'; } },
        { l: 'Offer free tickets to the street', h: 'Fans ↓ a little', heat: 0, f: () => { bk('fans', -1); return 'Some take the tickets. Some take offence.'; } },
        { l: 'Send the club lawyer', h: 'Press ↓ · board ↑', heat: 1, f: () => { bk('press', -3); bk('board', 1); return 'The lawyer is very precise. Nobody likes it.'; } }] },
    { t: 'The council decides on the stand licence', b: c => c.heat > 1 ? 'The council links the parking war to our ground licence. One vote could cap the crowd.' : 'The council wants a parking plan before it renews our licence. It looks like a formality.',
      o: [{ l: 'Fund a park-and-ride bus', h: c => `−${money(M(3000))}`, heat: -2, f: () => { cash(-M(3000)); return 'Buses from the retail park, every home game.'; } },
        { l: 'Promise a plan and hope', h: 'Free', heat: 0, f: () => 'A plan is promised. Its details are vague.' },
        { l: 'Mobilise the supporters at the meeting', h: 'Fans ↑ · press ↓', heat: 1, f: () => { bk('fans', 3); bk('press', -2); return 'Two hundred scarves in the council chamber.'; } }] }],
  end: { good: { t: 'Licence renewed. Mill Lane sends a Christmas card.', f: () => { bk('fans', 3); bk('press', 3); } },
    mixed: { t: 'Licence renewed with conditions. Nobody is happy, nobody is furious.', f: () => { } },
    bad: { t: 'The council caps the crowd for the rest of the season.', f: () => { const c = g().club; c.capCut = Math.round(c.cap * 0.1); c.cap -= c.capCut; bk('board', -6); bk('fans', -4); } } } });

defineDossier('sponsor', { t: 'Sponsor under fire', who: 'com', touches: ['press', 'fans', 'board'], w: () => 1,
  cond: () => !!staff('com') && g().club.deals.length > 0, setup: () => { const d = g().club.deals[0]; return { s: d.name || 'our main sponsor' }; },
  parts: [
    { t: c => `${c.s}: the boss in the papers`, b: c => `The chief executive of ${c.s} is accused of dodging tax. Our logo is on every photo of the story.`,
      o: [{ l: 'Say nothing for now', h: 'Free', heat: 0, f: () => 'The club declines to comment.' },
        { l: 'Ask the sponsor for an explanation', h: 'Press ↑ a little', heat: -1, f: () => { bk('press', 1); return 'A private call. A promise of clarity.'; } },
        { l: 'Defend our partner in public', h: 'Board ↑ · press ↓', heat: 1, f: () => { bk('board', 1); bk('press', -3); return 'Loyalty, the club says. The papers call it something else.'; } }] },
    { t: c => c.heat > 0 ? 'Supporters want the logo off the shirt' : 'The story will not go away', b: c => c.heat > 0 ? 'Banners in the home end and a hashtag that trends locally. They want the shirt deal gone.' : `More details come out about ${c.s}. ${nm('com')} says the money still matters.`,
      o: [{ l: 'Suspend the logo, keep the talks', h: 'Income on hold · fans ↑', heat: -1, f: () => { bk('fans', 2); return 'A plain shirt for two games.'; } },
        { l: 'Leave it to Commercial', h: 'Free', heat: 0, f: () => { rel('com', 2); return `${nm('com')} handles it quietly.`; } },
        { l: 'Double down: sign an extension', h: c => `+${money(M(2000))} · fans ↓`, heat: 2, f: () => { cash(M(2000)); bk('fans', -4); return 'The extension is signed. The home end notices.'; } }] },
    { t: 'The sponsor threatens to sue', b: c => c.heat > 1 ? 'They want compensation for "reputational damage" we caused. The lawyers smell money on both sides.' : 'They want to leave quietly with a settlement. It could be worse.',
      o: [{ l: 'Settle and walk away', h: c => `−${money(M(2500))}`, heat: -1, f: () => { cash(-M(2500)); return 'A cheque, a statement, a handshake.'; } },
        { l: 'Find a new sponsor first', h: 'Commercial ↑', heat: 0, f: () => { rel('com', 3); return `${nm('com')} starts calling round.`; } },
        { l: 'Fight it in court', h: 'Board ↓ · risky', heat: 2, f: () => { bk('board', -3); return 'The club hires a barrister.'; } }] }],
  end: { good: { t: 'A cleaner sponsor signs. The shirt is ours again.', f: () => { bk('fans', 4); bk('press', 3); cash(M(1500)); } },
    mixed: { t: 'The deal ends quietly. Less money, less noise.', f: () => { bk('board', -1); } },
    bad: { t: 'A long legal fight and a big bill. The Gazette prints the costs.', f: () => { cash(-M(6000)); bk('board', -6); bk('press', -5); } } } });

defineDossier('wonderkid', { t: 'The wonderkid\'s agent', who: 'acad', touches: ['fans', 'board', 'room'], w: () => 1,
  cond: () => !!kid() && kid().pa >= F.tierAvg(g().club.tier) + 1 && !!staff('acad'), setup: () => { const p = kid(); return { pid: p.id, n: p.name }; },
  parts: [
    { t: c => `An agent circles ${c.n}`, b: c => `A well-known agent has been seen at academy games, talking to ${c.n}'s parents. ${nm('acad')} is worried.`,
      o: [{ l: 'Offer the family a first pro contract', h: c => `−${money(M(600))}/season`, heat: -1, f: () => { cash(-M(600)); return 'The family listens. The agent smiles.'; } },
        { l: 'Let the academy handle it', h: 'Free', heat: 0, f: () => { rel('acad', 2); return `${nm('acad')} keeps an eye on things.`; } },
        { l: 'Ban the agent from the training ground', h: 'Fans ↑ · risky', heat: 1, f: () => { bk('fans', 1); return 'Security gets a photo of the agent.'; } }] },
    { t: c => c.heat > 0 ? `A big club wants ${c.n}` : `${c.n} is unsettled`, b: c => c.heat > 0 ? `A top-flight academy has made an approach. The boy's head is turned.` : `${c.n} has missed two sessions. His father talks about "options".`,
      o: [{ l: 'Promise first-team minutes', h: 'Coach ↓ · room ↓ a little', heat: -1, f: () => { rel('coach', -3); bk('room', -1); return 'A promise you will have to keep.'; } },
        { l: 'Talk to the boy, not the agent', h: 'Free', heat: 0, f: () => 'An honest hour in the canteen.' },
        { l: 'Tell them to make an offer', h: 'Academy ↓', heat: 1, f: () => { rel('acad', -4); return 'The academy staff look at the floor.'; } }] },
    { t: c => `Decision day for ${c.n}`, b: c => c.heat > 1 ? 'The other club sends a formal bid. If we say no, the family might force a tribunal.' : 'The family wants a decision about his future. He would still rather stay.',
      o: [{ l: 'A long contract and a clear pathway', h: c => `−${money(M(1200))}`, heat: -1, f: () => { cash(-M(1200)); return 'Signed, sealed, photographed.'; } },
        { l: 'Sell, with a sell-on clause', h: c => `+${money(M(7000))} · fans ↓`, heat: 1, f: c => { cash(M(7000)); const G = g(), i = G.academy.findIndex(p => p.id === c.pid); if (i >= 0) G.academy.splice(i, 1); bk('fans', -3); return 'He goes. A percentage of his future stays.'; } },
        { l: 'Let him choose', h: 'Free', heat: 0, f: () => 'You put it in his hands.' }] }],
  end: { good: { t: c => `${c.n} stays and becomes the face of the academy.`, f: c => { const p = g().academy.find(p => p.id === c.pid); if (p) p.pa = Math.min(20, p.pa + 0.5); bk('fans', 4); rel('acad', 4); } },
    mixed: { t: c => `${c.n}'s story ends without drama. For now.`, f: () => { } },
    bad: { t: c => `${c.n} leaves on bad terms. The academy's name suffers.`, f: c => { const G = g(), i = G.academy.findIndex(p => p.id === c.pid); if (i >= 0) G.academy.splice(i, 1); bk('fans', -4); rel('acad', -6); } } } });

defineDossier('nightout', { t: 'A night out', who: 'coach', touches: ['press', 'room', 'fans'], w: () => 1,
  cond: () => !!staff('coach') && g().week >= 4, setup: () => { const p = star(); return { pid: p.id, n: p.name }; },
  parts: [
    { t: c => `${c.n} filmed at 3am`, b: c => `A video of ${c.n} dancing on a table, two days before a match, is doing the rounds.`,
      o: [{ l: 'Fine him quietly', h: 'Room ↓ a little', heat: -1, f: () => { bk('room', -1); return 'A week\'s wages. No statement.'; } },
        { l: 'Leave it to the coach', h: 'Free', heat: 0, f: () => { rel('coach', 2); return `${nm('coach')} has a word.`; } },
        { l: 'Make an example of him in public', h: 'Board ↑ · room ↓', heat: 1, f: () => { bk('board', 2); bk('room', -4); return 'A statement about standards. The squad reads it too.'; } }] },
    { t: c => c.heat > 0 ? 'The dressing room splits' : 'The tabloids dig deeper', b: c => c.heat > 0 ? `Half the squad thinks ${c.n} was hung out to dry. The other half thinks he got off lightly.` : `The Gazette has more photos and more names. Two other players were there.`,
      o: [{ l: 'Clear the air with the captains', h: 'Room ↑', heat: -1, f: () => { bk('room', 3); return 'A long meeting. Some shouting. Then pizza.'; } },
        { l: 'Give the press nothing', h: 'Press ↓', heat: 0, f: () => { bk('press', -2); return 'No comment, on repeat.'; } },
        { l: 'Drop all three players', h: 'Board ↑ · room ↓ · weaker team', heat: 1, f: () => { bk('board', 2); bk('room', -3); return 'Three names missing from the team sheet.'; } }] },
    { t: c => `${c.n}'s future`, b: c => c.heat > 1 ? `${c.n} has asked to leave. His agent says the club "betrayed" him.` : `${c.n} wants to put it behind him. The fans are not sure yet.`,
      o: [{ l: 'A fresh start, with conditions', h: 'Free', heat: -1, f: () => 'A clean slate, in writing.' },
        { l: 'Let the fans decide with their voices', h: 'Fans ↑ · press ↑', heat: 0, f: () => { bk('fans', 1); bk('press', 1); return 'His name is read out before kick-off. Mostly cheers.'; } },
        { l: 'Put him on the transfer list', h: 'Room ↓', heat: 1, f: () => { bk('room', -3); return 'The list goes up. He does not train.'; } }] }],
  end: { good: { t: c => `${c.n} scores, points to the fans and the story is over.`, f: c => { const p = g().squad.find(p => p.id === c.pid); if (p) p.morale = 80; bk('room', 4); bk('press', 2); } },
    mixed: { t: 'The story fades. The video does not.', f: () => { bk('press', -1); } },
    bad: { t: c => `${c.n} sulks for weeks and the dressing room takes sides.`, f: c => { const p = g().squad.find(p => p.id === c.pid); if (p) p.morale = 25; bk('room', -7); bk('press', -3); } } } });

defineDossier('kits', { t: 'The kit that never came', who: 'com', touches: ['fans', 'press', 'board'], w: () => 0.8,
  cond: () => !!staff('com') && g().week >= 2, setup: () => ({}),
  parts: [
    { t: 'The new shirts are six weeks late', b: () => 'Supporters paid in advance. The supplier blames a factory, a ship and the weather.',
      o: [{ l: 'Refund anyone who asks', h: c => `−${money(M(900))} · fans ↑`, heat: -1, f: () => { cash(-M(900)); bk('fans', 2); return 'Refunds go out by the end of the week.'; } },
        { l: 'Apologise and wait', h: 'Free', heat: 0, f: () => 'A sorry on the website.' },
        { l: 'Blame the supplier in public', h: 'Fans ↑ · supplier angry', heat: 1, f: () => { bk('fans', 1); return 'The supplier reads it too.'; } }] },
    { t: c => c.heat > 0 ? 'The shirts arrive. They fall apart.' : 'The shirts arrive, mostly', b: c => c.heat > 0 ? 'The badge peels off in the first wash. Photos everywhere.' : 'Some sizes are missing and the colour is "a bit off", say the fans.',
      o: [{ l: 'Replace every faulty shirt', h: c => `−${money(M(1500))}`, heat: -1, f: () => { cash(-M(1500)); return 'An exchange desk in the club shop.'; } },
        { l: 'Make it a joke on social media', h: 'Press ↑ · risky', heat: 0, f: () => { bk('press', 2); return 'The club admin posts a peeling badge emoji.'; } },
        { l: 'Deny there is a problem', h: 'Fans ↓', heat: 1, f: () => { bk('fans', -3); return 'The denial ages badly.'; } }] },
    { t: 'Keep the supplier or switch?', b: c => c.heat > 1 ? 'The contract has two years left. Breaking it costs money; keeping it costs face.' : 'The supplier offers a discount on next season to make up for it.',
      o: [{ l: 'Switch to a local maker', h: c => `−${money(M(2000))} · fans ↑`, heat: -1, f: () => { cash(-M(2000)); bk('fans', 3); return 'Made in town, from next season.'; } },
        { l: 'Take the discount', h: c => `+${money(M(1000))}`, heat: 0, f: () => { cash(M(1000)); return 'Cheaper shirts next year. Hopefully better ones.'; } },
        { l: 'Sue for the losses', h: 'Board ↓ · slow', heat: 1, f: () => { bk('board', -2); return 'Letters between lawyers.'; } }] }],
  end: { good: { t: 'The new shirt sells out. People even wear it to work.', f: () => { cash(M(2500)); bk('fans', 4); } },
    mixed: { t: 'The kit saga ends. Nobody wants to talk about it again.', f: () => { } },
    bad: { t: 'The shirt becomes a running joke in the league.', f: () => { bk('fans', -4); bk('press', -4); cash(-M(1500)); } } } });

defineDossier('safety', { t: 'The safety certificate', who: 'fin', touches: ['board', 'fans', 'press'], w: () => 0.8,
  cond: () => !!staff('fin') && g().week >= 6, setup: () => ({}),
  parts: [
    { t: 'An inspector finds cracks in the old stand', b: () => 'Nothing dangerous yet, says the report. But the inspector will be back in a month.',
      o: [{ l: 'Repair it now', h: c => `−${money(M(2500))}`, heat: -1, f: () => { cash(-M(2500)); return 'Scaffolding goes up on Monday.'; } },
        { l: 'Get a second opinion', h: c => `−${money(M(400))}`, heat: 0, f: () => { cash(-M(400)); return 'Another engineer, another invoice.'; } },
        { l: 'Paint over it until the summer', h: 'Free · risky', heat: 2, f: () => 'A fresh coat of club colours.' }] },
    { t: c => c.heat > 1 ? 'The Gazette gets the report' : 'The inspector returns', b: c => c.heat > 1 ? '"Cracks in the stand, club does nothing", says the front page. Season ticket holders are phoning.' : 'The inspector wants to see progress. Finance wants to see the bill first.',
      o: [{ l: 'Close the stand until it is fixed', h: 'Gate income ↓ · press ↑', heat: -1, f: () => { bk('press', 2); cash(-M(1200)); return 'The old stand is taped off.'; } },
        { l: 'Let Finance find the money', h: 'Free', heat: 0, f: () => { rel('fin', 2); return `${nm('fin')} moves some budgets around.`; } },
        { l: 'Challenge the report', h: 'Board ↓ · press ↓', heat: 1, f: () => { bk('board', -2); bk('press', -2); return 'The club says the report is "exaggerated".'; } }] },
    { t: 'The certificate is up for renewal', b: c => c.heat > 1 ? 'Without it, we play behind closed doors. The board wants to know who is responsible.' : 'A formality, if the work is done.',
      o: [{ l: 'Pay for a full refurbishment', h: c => `−${money(M(5000))} · fans ↑`, heat: -2, f: () => { cash(-M(5000)); bk('fans', 2); return 'New steel, new seats, new paint.'; } },
        { l: 'Do the minimum', h: c => `−${money(M(1500))}`, heat: 0, f: () => { cash(-M(1500)); return 'Enough to pass. Probably.'; } },
        { l: 'Ask the council for an extension', h: 'Free · risky', heat: 1, f: () => 'A letter asking for "flexibility".' }] }],
  end: { good: { t: 'Certificate renewed. The old stand will see out another decade.', f: () => { bk('board', 3); bk('fans', 2); } },
    mixed: { t: 'Certificate renewed, with a list of conditions.', f: () => { cash(-M(1000)); } },
    bad: { t: 'Two home games behind closed doors. The board is furious.', f: () => { cash(-M(5000)); bk('board', -8); bk('fans', -5); bk('press', -4); } } } });

defineDossier('column', { t: 'The coach\'s column', who: 'coach', touches: ['press', 'board', 'room'], w: () => 0.8,
  cond: () => !!staff('coach') && staff('coach').p.ego >= 10 && g().week >= 5, setup: () => ({}),
  parts: [
    { t: () => `${nm('coach')} writes a newspaper column`, b: () => `In the Gazette, ${nm('coach')} says the club "lacks ambition above the dressing room". Everyone knows who he means.`,
      o: [{ l: 'Call him in for a quiet word', h: 'Coach ↓ a little', heat: -1, f: () => { rel('coach', -2); return 'Five minutes, door closed.'; } },
        { l: 'Ignore it', h: 'Free', heat: 0, f: () => 'You do not read the Gazette on Saturdays anyway.' },
        { l: 'Reply with your own column', h: 'Press ↑ · coach ↓', heat: 1, f: () => { bk('press', 2); rel('coach', -5); return 'Two columns, one page apart.'; } }] },
    { t: c => c.heat > 0 ? 'Column two: the gloves are off' : 'The column becomes weekly', b: c => c.heat > 0 ? `This week he names the transfer budget. The board chairman has rung you twice.` : `The Gazette has given him a weekly slot. It sells papers.`,
      o: [{ l: 'Agree a "no club matters" rule', h: 'Coach ↓ a little · board ↑', heat: -1, f: () => { rel('coach', -2); bk('board', 2); return 'He signs. He sulks.'; } },
        { l: 'Give him what he asks for', h: 'Coach ↑ · board ↓', heat: 0, f: () => { rel('coach', 5); bk('board', -2); return 'A bigger kitty and a smaller column.'; } },
        { l: 'Leak your side of the story', h: 'Press ↑ · room ↓', heat: 1, f: () => { bk('press', 1); bk('room', -2); return 'An "anonymous club source" briefs the paper.'; } }] },
    { t: () => `You or ${nm('coach')}`, b: c => c.heat > 1 ? 'The board says one of you has to go. The players are watching.' : 'He wants a clear show of support before the run-in.',
      o: [{ l: 'Back him publicly', h: 'Coach ↑ · board ↓', heat: -1, f: () => { rel('coach', 6); bk('board', -2); return 'Shoulder to shoulder in front of the cameras.'; } },
        { l: 'Final warning, in writing', h: 'Coach ↓', heat: 0, f: () => { rel('coach', -4); return 'A letter. He reads it twice.'; } },
        { l: 'Let the board decide', h: 'Board ↑ · risky', heat: 1, f: () => { bk('board', 2); return 'The board meets on Tuesday.'; } }] }],
  end: { good: { t: () => `${nm('coach')} drops the column and the results do the talking.`, f: () => { rel('coach', 4); bk('room', 3); } },
    mixed: { t: 'An uneasy truce. The column still runs, more politely.', f: () => { } },
    bad: { t: () => `${nm('coach')} and the club are at war in print. The dressing room is tired of it.`, f: () => { rel('coach', -10); bk('room', -5); bk('board', -4); } } } });

defineDossier('trust', { t: 'Fans want a seat at the table', who: 'fans', touches: ['fans', 'board', 'press'], w: () => 0.8,
  cond: () => g().week >= 8, setup: () => ({}),
  parts: [
    { t: 'The supporters\' trust wants a board seat', b: () => 'They have money from a share scheme and a petition with three thousand names. The board is not keen.',
      o: [{ l: 'Open talks', h: 'Fans ↑ · board ↓ a little', heat: -1, f: () => { bk('fans', 2); bk('board', -1); return 'A first meeting is in the diary.'; } },
        { l: 'Offer an advisory panel instead', h: 'Free', heat: 0, f: () => 'A panel, with tea and no vote.' },
        { l: 'Say no', h: 'Board ↑ · fans ↓', heat: 1, f: () => { bk('board', 2); bk('fans', -3); return 'A short, polite no.'; } }] },
    { t: c => c.heat > 0 ? 'The trust takes it public' : 'The board asks for your view', b: c => c.heat > 0 ? 'A "Our Club" campaign: flyers, banners, a radio phone-in. It is well organised.' : 'Two directors are open to it. The chairman is not.',
      o: [{ l: 'Back the fans in the boardroom', h: 'Fans ↑ · board ↓', heat: -1, f: () => { bk('fans', 3); bk('board', -3); return 'You make the case, around a very long table.'; } },
        { l: 'Stay neutral', h: 'Free', heat: 0, f: () => 'Not your fight, you say.' },
        { l: 'Brief against the trust', h: 'Board ↑ · press ↓', heat: 2, f: () => { bk('board', 2); bk('press', -3); return 'Someone leaks the trust\'s accounts.'; } }] },
    { t: 'The vote on a supporter director', b: c => c.heat > 1 ? 'Emotions run high. Whatever happens, someone will feel betrayed.' : 'The board will vote this week. It could go either way.',
      o: [{ l: 'Propose a compromise: one seat, no veto', h: 'Both a little happy', heat: -1, f: () => { bk('fans', 1); bk('board', 1); return 'A seat, a nameplate and limits.'; } },
        { l: 'Let the board vote freely', h: 'Free', heat: 0, f: () => 'Hands go up around the table.' },
        { l: 'Threaten to resign if they say no', h: 'Fans ↑ · board ↓↓', heat: 1, f: () => { bk('fans', 3); bk('board', -5); return 'The room goes very quiet.'; } }] }],
  end: { good: { t: 'A supporter joins the board. Season ticket renewals jump.', f: () => { bk('fans', 6); g().club.fanbase = Math.round(g().club.fanbase * 1.03); } },
    mixed: { t: 'An advisory panel, no seat. The trust will be back.', f: () => { bk('fans', -1); } },
    bad: { t: 'The trust walks out and calls a boycott of the next home game.', f: () => { bk('fans', -7); bk('press', -3); cash(-M(1500)); } } } });

/* ---------- seeds: small things become dossiers ---------- */
const SEEDS = { bet_sponsor: { 0: 'sponsor' }, sponsor_morals: { 0: 'sponsor' }, ticket_protest: { 1: 'trust', 2: 'trust' }, player_ego: { 1: 'nightout' }, transfer_request: { 1: 'nightout' }, agent_youth: { 1: 'wonderkid', 2: 'wonderkid' }, stand_objection: { 1: 'parking' } };

/* ---------- engine ---------- */
function D() { const G = g(); G.dos = G.dos || { open: {}, arch: [], last: -99, done: {} }; return G.dos; }
function start(id, why) {
  const X = D(), d = DOS[id]; if (!d || X.open[id] || Object.keys(X.open).length >= 2) return false;
  if (X.done[id] && F.absWeek() - X.done[id] < 60) return false;
  let c; try { if (d.cond && !d.cond()) return false; c = d.setup ? d.setup() : {}; } catch (e) { return false; } if (!c) return false;
  c.heat = 0; X.open[id] = { id, part: 0, c, log: [], next: F.absWeek(), started: F.absWeek(), why: why || null }; X.last = F.absWeek();
  F.queueEvent('dos_' + id, { dos: id, part: 0 }); press(2);
  return true;
}
function stepDone(id, j) {
  const X = D(), st = X.open[id], d = DOS[id]; if (!st) return '';
  const o = d.parts[st.part].o[j]; let r = ''; try { r = o.f(st.c) || ''; } catch (e) { }
  let dh = o.heat; if (dh >= 0 && pv() >= 60 && chance(0.3)) dh += 1; // pressure makes things worse
  st.c.heat = clamp(st.c.heat + dh, -2, 4); st.log.push({ part: st.part, l: o.l, heat: st.c.heat }); press(dh > 0 ? 2 : dh < 0 ? -1 : 0);
  st.part++;
  if (st.part >= d.parts.length) {
    const h = st.c.heat, k = h <= -1 ? 'good' : h <= 1 ? 'mixed' : 'bad', E = d.end[k], scale = 1 + pv() / 200;
    const t = typeof E.t === 'function' ? E.t(st.c) : E.t;
    const snapB = {}; F.BACKERS.forEach(b => snapB[b.k] = b.get());
    try { E.f(st.c); } catch (e) { }
    if (scale > 1 && k === 'bad') F.BACKERS.forEach(b => { const dd = b.get() - snapB[b.k]; if (dd < 0) b.put(clamp(b.get() + dd * (scale - 1), 0, 100)); });
    press(k === 'good' ? -8 : k === 'bad' ? 8 : -2);
    X.arch.unshift({ id, t: d.t, s: g().season, w: g().week, k, line: t, log: st.log }); X.arch = X.arch.slice(0, 30); X.done[id] = F.absWeek(); delete X.open[id];
    g().paper.stories.unshift({ h: `Dossier closed: ${d.t}`, t });
    return `${r} ${t}`.trim();
  }
  st.next = F.absWeek() + clamp(3 - st.c.heat, 2, 4);
  return r;
}
// one generic message type per dossier, so the inbox, desk and labels work as usual
for (const id in DOS) {
  const d = DOS[id], cur = c => { const st = D().open[c.dos], i = c.part != null ? c.part : st ? st.part : 0; return d.parts[Math.min(i, d.parts.length - 1)]; }, sc = c => (D().open[c.dos] || { c: { heat: 0 } }).c;
  F.defineEvent('dos_' + id, { forced: 1, ceo: 1, from: d.who === 'fans' || d.who === 'board' || d.who === 'press' ? d.who : d.who, dept: 'board', cd: 1, w: () => 0,
    why: c => { const st = D().open[c.dos]; return st ? `Dossier "${d.t}", part ${(c.part != null ? c.part : st.part) + 1} of ${d.parts.length}. It is ${heatT(st.c.heat).toLowerCase()}.` : 'A dossier.'; },
    setup: () => null,
    title: c => { const p = cur(c); return typeof p.t === 'function' ? p.t(sc(c)) : p.t; },
    body: c => { const p = cur(c); return typeof p.b === 'function' ? p.b(sc(c)) : p.b; },
    opts: [0, 1, 2].map(j => ({ l: c => cur(c).o[j].l, h: c => { const h = cur(c).o[j].h; return typeof h === 'function' ? h(sc(c)) : h; }, f: c => { const st = D().open[c.dos]; if (!st || (c.part != null && c.part !== st.part)) return 'This has moved on.'; return stepDone(c.dos, j); } })),
    auto: c => { const o = cur(c).o; const i = o.findIndex(x => x.heat === 0); return i < 0 ? 1 : i; }, vacant: 1 });
}

/* ---------- weekly ---------- */
const prevAfter = H.seasonAfterMatch;
H.seasonAfterMatch = ours => {
  if (prevAfter) prevAfter(ours);
  const G = g(); if (G.phase !== 'season') return; const X = D(), now = F.absWeek();
  // pressure
  if (ours) press(ours.result === 'L' ? 3 : ours.result === 'W' ? -2.5 : 0.5);
  press(-0.6); if (F.backers) press(F.backers().filter(b => b.danger).length * 1.5);
  if (G.desk && G.desk.err > (G._errSeen || 0)) { press((G.desk.err - (G._errSeen || 0)) * 2); G._errSeen = G.desk.err; }
  const lb = (G.bgLog || []).slice(-1)[0]; if (lb && lb !== G._bgSeen) { press(lb.ok ? -5 : 5); G._bgSeen = lb; }
  // seeds from this week's decisions
  for (const m of G.inbox) if (!F.PARK.dos && m.done && !m.seedSeen && m.choice != null) { m.seedSeen = 1; const s = SEEDS[m.ev]; if (s && s[m.choice] && chance(0.7)) start(s[m.choice], 'It started with how the club handled an earlier message.'); }
  // next parts
  for (const id in X.open) { const st = X.open[id]; if (st.part > 0 && now >= st.next && !G.inbox.some(m => !m.done && m.ev === 'dos_' + id) && !G.queue.some(q => q.id === 'dos_' + id)) F.queueEvent('dos_' + id, { dos: id, part: st.part }); }
  // new dossiers: more often under pressure
  if (!F.PARK.dos && Object.keys(X.open).length < 2 && now - X.last >= 4 && G.week <= 33 && chance(0.07 + pv() / 500)) {
    const ids = Object.keys(DOS).filter(id => !X.open[id] && !(X.done[id] && now - X.done[id] < 60) && (() => { try { return DOS[id].cond(); } catch (e) { return false; } })());
    if (ids.length) start(pick(ids));
  }
};

function dosView() {
  const X = D(), now = F.absWeek();
  const open = Object.values(X.open).map(st => { const d = DOS[st.id], pend = g().inbox.find(m => !m.done && m.ev === 'dos_' + st.id); return { id: st.id, t: d.t, who: d.who, touches: d.touches, part: st.part, n: d.parts.length, heat: st.c.heat, heatT: heatT(st.c.heat), pending: pend ? pend.id : null, inW: pend ? 0 : Math.max(0, st.next - now), log: st.log.map(l => ({ ...l, t: (() => { const p = d.parts[l.part]; return typeof p.t === 'function' ? p.t(st.c) : p.t; })() })), why: st.why }; });
  return { open, arch: X.arch, signal: pSignal(), pressure: pv() };
}

Object.assign(F, { DOS, dosView, defineDossier });
})(FO);
