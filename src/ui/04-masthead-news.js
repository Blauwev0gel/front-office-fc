/* FRONT OFFICE · unified information architecture
   Four destinations. Football has two deliberate views: squad and league.
   All routes keep their existing action IDs and save-game contracts. */
const FO_SECTIONS = [
  { key: 'inbox', label: 'Desk', title: 'Your desk', description: 'Decisions and the week ahead' },
  { key: 'squad', label: 'Football', title: 'Football', description: 'Squad, league and results' },
  { key: 'club', label: 'Club', title: 'The club', description: 'Finance, board and ambitions' },
  { key: 'staff', label: 'People', title: 'Your people', description: 'Heads, mandates and conversations' }
];
function foRoot(k) {
  if (k === 'league' || k === 'squad') return 'squad';
  if (k === 'staff') return 'staff';
  if (k === 'club' || k === 'money') return 'club';
  return 'inbox';
}
function foSection() {
  const root = foRoot(U.tab);
  return FO_SECTIONS.find(x => x.key === root) || FO_SECTIONS[0];
}
function masthead() {
  const g = G(), c = g.club, where = foSection(), deep = U.open || U.dept;
  const label = U.dept ? 'Department' : U.open ? 'Correspondence' :
    U.tab === 'league' ? 'League table' : U.tab === 'squad' ? 'First team' : where.title;
  return `<header class="fo-header">
    <button class="fo-brand" data-a="tab" data-t="inbox" aria-label="Return to your desk">
      <span class="fo-monogram">${esc(c.short || 'FC')}</span>
      <span><b>${esc(c.name)}</b><small>Season ${g.season} · Week ${Math.min(g.week, F.SEASON_WEEKS)}</small></span>
    </button>
    <button class="fo-help" data-a="sheet" data-s="help" aria-label="Help">?</button>
  </header>
  <div class="fo-location">
    <div><span class="fo-eyebrow">${deep ? esc(where.title) + ' / ' : 'THE FRONT OFFICE / '}${esc(label)}</span>
      <h1>${deep ? (U.dept ? 'Department details' : 'Your correspondence') : where.title}</h1>
      <p>${deep ? 'Review the information and choose what happens next.' : where.description}</p></div>
  </div>`;
}
function foLocalMenu() {
  if (foRoot(U.tab) !== 'squad') return '';
  return `<nav class="fo-local" aria-label="Football views">
    <button class="${U.tab === 'squad' ? 'on' : ''}" aria-current="${U.tab === 'squad' ? 'page' : 'false'}" data-a="tab" data-t="squad">Squad & players</button>
    <button class="${U.tab === 'league' ? 'on' : ''}" aria-current="${U.tab === 'league' ? 'page' : 'false'}" data-a="tab" data-t="league">League & results</button>
  </nav>`;
}
// Keep legacy function for other UI code that may request navigation.
function tabs() { return foLocalMenu(); }
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '';
function vNews() { return `<article class="om gzwrap">${gazette()}</article>`; }
