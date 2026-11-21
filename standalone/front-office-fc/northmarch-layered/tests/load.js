// Loads the engine modules (no UI) into one VM context, the same order as the build. Returns the context.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {ENGINE}=require('../build.js');
function loadEngine(){
  const src=ENGINE.map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
  const ctx={console};vm.createContext(ctx);
  vm.runInContext(src+'\n;this.__get=()=>S;this.__set=v=>{S=v};',ctx,{filename:'engine.js'});
  return ctx;
}
module.exports={loadEngine};
