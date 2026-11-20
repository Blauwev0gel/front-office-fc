// Laadt de samengevoegde engine in een eigen vm-context.
const fs=require('fs'),path=require('path'),vm=require('vm');
module.exports=function(){
  require('child_process').execSync('node build.js',{cwd:path.join(__dirname,'..')});
  const ctx={console};vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/engine.js'),'utf8')+'\n;this.E={newState,save,load,tick,run,onPhase,emit,signal,logBook,PHASES,PLOTS,DEPARTMENTS,BUILDINGS,POTS,CAL,rnd};',ctx);
  return ctx.E;
};
