// Joins the modules in a fixed order into one standalone HTML file. Usage: node build.js
// dist/northmarch-layered.html is the playable game. tests/load.js loads ENGINE without the UI.
const fs=require('fs'),path=require('path');
const ENGINE=[
  'core/content.js','core/rng.js','core/bus.js','core/layers.js',                       // core: content, rng, events and commands
  'world/world.js','world/league.js','world/foreign.js','world/awards.js','world/rivalry.js',                                  // world: clubs, people, divisions, cup
  'football/players.js','football/match.js','football/market.js','football/life.js',      // football: squads, matches, market
  'club/ground.js','club/finance.js','club/members.js','club/staff.js','club/commercial.js','club/projects.js','club/journal.js','club/recruitment.js','club/youth.js','club/legacy.js',                                  // club: ground and money
  'sim/ai.js','sim/clock.js','club/staffops.js','sim/commentary.js',
  'layers/autonomy/director-deals.js','layers/autonomy/director-accountability.js','core/save.js'                            // simulation: boards, the clock; saves
];
const UI=['ui/week-brief.js','ui/render.js','ui/club.js','ui/depts.js','ui/members.js','ui/staff.js','ui/commercial.js','ui/history.js','ui/board.js','ui/decide.js','ui/recruit.js','layers/autonomy/director-deals-ui.js','layers/autonomy/director-accountability-ui.js','ui/youth.js','ui/live.js','ui/upgrades.js','ui/act.js','ui/ext-v17-journey.js','ui/ext-v18-club-ux.js','ui/ext-v181-decisions.js','ui/ext-v182-open-sim.js','ui/ext-v183-matchday-echo.js','ui/ext-test-tools.js','ui/ext-v185-home.js','ui/ext-v187-upgrades.js','ui/game.js'];
const ENGINE_BASE=ENGINE.filter(f=>!f.startsWith('layers/autonomy/'));
const UI_BASE=UI.filter(f=>!f.startsWith('layers/autonomy/'));
const ENGINE_WITHOUT_ACCOUNTABILITY=ENGINE.filter(f=>!f.includes('director-accountability'));
const UI_WITHOUT_ACCOUNTABILITY=UI.filter(f=>!f.includes('director-accountability'));
module.exports={ENGINE,UI,ENGINE_BASE,UI_BASE,ENGINE_WITHOUT_ACCOUNTABILITY,UI_WITHOUT_ACCOUNTABILITY};
if(require.main===module){
  const S=p=>fs.readFileSync(path.join(__dirname,'src',p),'utf8');
  // Basisspel V1 is the default artifact. L3 is an explicit opt-in development build.
  const autonomy=process.env.NORTHMARCH_BUILD_MODE==='autonomy';
  const files=(autonomy?ENGINE:ENGINE_BASE).concat(autonomy?UI:UI_BASE);
  const CSS=S('style/main.css')+S('style/extensions.css')+S('style/game.css'); /* base rules first, V19 extensions after: the order is the cascade */
  const js=files.map(f=>`/* ---- ${f} ---- */\n`+S(f)).join('\n');
  const html=`<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n${S('head.html')}<style>\n${CSS}</style>\n</head>\n<body>\n${S('test-tools.html')}<div id="app"></div>\n<script>\n${js}\n</script>\n</body>\n</html>\n`;
  fs.mkdirSync(path.join(__dirname,'dist'),{recursive:true});
  fs.writeFileSync(path.join(__dirname,'dist/northmarch-layered.html'),html);
  // artifact.html: the same game without document skeleton, for a private claude.ai page
  fs.writeFileSync(path.join(__dirname,'dist/artifact.html'),`${S('head.html')}<style>\n${CSS}</style>\n${S('test-tools.html')}<div id="app"></div>\n<script>\n${js}\n</script>\n`);
  console.log('built',files.length,autonomy?'autonomy':'base','modules,',Math.round(html.length/1024),'KB');
}
