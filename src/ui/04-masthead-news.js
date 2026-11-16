function masthead() { const g = G(), c = g.club; return `<header class="hd">${crest(c.colors, c.short, 26)}<b>${esc(c.name)}</b><span class="wk" title="${F.blockOf ? esc(F.blockOf(g.week).t) : ''}">Wk ${Math.min(g.week, F.SEASON_WEEKS)}</span><button class="snd" data-a="sheet" data-s="help" aria-label="Help">?</button></header>`; }
function tabs() { return `<nav class="tabs">${[['desk', 'Desk'], ['news', 'News'], ['club', 'Club'], ['staff', 'Staff'], ['squad', 'Squad'], ['league', 'League']].map(([k, l]) => `<button class="${U.tab === k ? 'on' : ''}" data-a="tab" data-t="${k}">${l}</button>`).join('')}</nav>`; }

const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '';
function vNews() { return `<article class="om gzwrap">${gazette()}</article>`; }
