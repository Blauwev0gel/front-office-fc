// Joins the modules in a fixed order into one standalone HTML file. Usage: node build.js
// dist/northmarch-layered.html is the playable game. tests/load.js loads ENGINE without the UI.
const fs=require('fs'),path=require('path');
const ENGINE=[
  'core/content.js','core/rng.js','core/bus.js',                       // core: content, rng, events and commands
  'world/world.js','world/league.js',                                  // world: clubs, people, divisions, cup
  'football/players.js','football/match.js','football/market.js','football/life.js',      // football: squads, matches, market
  'club/ground.js','club/finance.js','club/members.js','club/staff.js','club/commercial.js','club/projects.js',                                  // club: ground and money
  'sim/ai.js','sim/clock.js','core/save.js'                            // simulation: boards, the clock; saves
];
const UI=['ui/render.js','ui/club.js','ui/depts.js','ui/members.js','ui/staff.js','ui/commercial.js','ui/history.js','ui/act.js'];
module.exports={ENGINE,UI};
if(require.main===module){
  const S=p=>fs.readFileSync(path.join(__dirname,'src',p),'utf8');
  const js=ENGINE.concat(UI).map(f=>`/* ---- ${f} ---- */\n`+S(f)).join('\n');
  const html=`<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n${S('head.html')}<style>\n${S('style/main.css')}</style>\n</head>\n<body>\n<div id="app"></div>\n<script>\n${js}\n</script>\n</body>\n</html>\n`;
  fs.mkdirSync(path.join(__dirname,'dist'),{recursive:true});
  fs.writeFileSync(path.join(__dirname,'dist/northmarch-layered.html'),html);
  // artifact.html: the same game without document skeleton, for a private claude.ai page
  fs.writeFileSync(path.join(__dirname,'dist/artifact.html'),`${S('head.html')}<style>\n${S('style/main.css')}</style>\n<div id="app"></div>\n<script>\n${js}\n</script>\n`);
  console.log('built',ENGINE.length+UI.length,'modules,',Math.round(html.length/1024),'KB');
}
