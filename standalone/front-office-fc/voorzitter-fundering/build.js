// Plakt de lagen in vaste volgorde tot één HTML-bestand. Gebruik: node build.js
// dist/index.html is volledig (repo, offline); dist/artifact.html is zonder doctype (voor publicatie).
const fs=require('fs'),path=require('path');const S=p=>fs.readFileSync(path.join(__dirname,'src',p),'utf8');
const ORDER=[
  'core/content.js','core/rng.js',          // basis: inhoud, rng, helpers
  'world/identity.js','world/world.js','world/football.js','world/news.js', // de regio
  'core/words.js',
  'club/players.js','club/stories.js','club/finance.js','club/market.js','club/td.js','club/summer.js','club/club.js','club/feed.js',         // de fundering (weet niets van de voorzitter)
  'chairman/state.js','chairman/promises.js','chairman/cards.js','chairman/situations.js','chairman/meeting.js','chairman/reactions.js','chairman/transfer.js','chairman/opening.js','chairman/flow.js', // de voorzitterslaag
  'ui/render.js','ui/transfer.js','ui/opening.js','ui/boot.js'               // schermen
];
const js=ORDER.map(f=>`/* ---- ${f} ---- */\n`+S(f)).join('\n');
const body=`${S('head.html')}\n<style>\n${S('style/main.css')}</style>\n\n<div id="app"></div>\n\n<script>\n${js}\n</script>\n`;
fs.mkdirSync(path.join(__dirname,'dist'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'dist/artifact.html'),body);
fs.writeFileSync(path.join(__dirname,'dist/index.html'),`<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n</head>\n<body>\n${body}</body>\n</html>\n`);
console.log('built',ORDER.length,'modules,',Math.round(body.length/1024),'KB');
