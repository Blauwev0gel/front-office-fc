// Plakt de modules in vaste volgorde tot één script. Gebruik: node build.js
const fs=require('fs'),path=require('path');
const ORDER=['core/rng.js','data/tables.js','core/state.js','core/tick.js'];
const js=ORDER.map(f=>`/* ---- ${f} ---- */\n`+fs.readFileSync(path.join(__dirname,'src',f),'utf8')).join('\n');
fs.mkdirSync(path.join(__dirname,'dist'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'dist/engine.js'),js);
console.log('built',ORDER.length,'modules,',Math.round(js.length/1024*10)/10,'KB');
module.exports={ORDER};
