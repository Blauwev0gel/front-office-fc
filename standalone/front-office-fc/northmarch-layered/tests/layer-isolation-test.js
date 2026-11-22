// Architecture gate: S3.2 is an optional module, never required for the baseline game.
// The existing L3.1 mandate coupling is documented technical debt and not yet isolated.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {ENGINE,UI,ENGINE_WITHOUT_ACCOUNTABILITY,UI_WITHOUT_ACCOUNTABILITY}=require('../build.js');
let failed=0;
function ok(assertion,label){console.log((assertion?'ok   ':'FAIL ')+label);if(!assertion)failed++}
function context(files){
  const c={console};
  vm.createContext(c);
  const script=files.map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
  vm.runInContext(script+'\n;this.__get=()=>S;',c,{filename:'layer-isolation.js'});
  return c;
}
const base=context(ENGINE_WITHOUT_ACCOUNTABILITY.concat(UI_WITHOUT_ACCOUNTABILITY));
const complete=context(ENGINE.concat(UI));
ok(ENGINE_WITHOUT_ACCOUNTABILITY.every(f=>!f.startsWith('layers/autonomy/')),
  'baseline source list excludes L3 S3.2 implementation');
ok(UI_WITHOUT_ACCOUNTABILITY.every(f=>!f.startsWith('layers/autonomy/')),
  'baseline UI excludes L3 S3.2 panels');
ok(vm.runInContext('typeof directorTrust',base)==='undefined','baseline has no director trust module');
ok(vm.runInContext('featurePanel("directorAccountability")',base)==='','unregistered features render nothing');
const seed=83037;base.newWorld(seed);complete.newWorld(seed);
const club=base.__get().seats[0];
base.chooseClub(club);complete.chooseClub(club);
let error=null;
try{
  for(let w=0;w<3;w++){base.advanceWeek();complete.advanceWeek();}
  // The UI is evaluated without the L3 feature: the club's Football screen must still render.
  const html=vm.runInContext('recruitPanels()',base);
  ok(typeof html==='string'&&html.includes('Recruitment')&&!html.includes('Trust in the director'),
    'baseline Football screen renders without accountability');
}catch(e){error=e}
ok(!error,'baseline gameplay advances normally with no accountability code '+(error||''));
const a=base.__get(),b=complete.__get();
ok(a.week===3&&b.week===3&&a.season===b.season,
  'both configurations run the same season clock');
ok(JSON.stringify(a.tbl)===JSON.stringify(b.tbl)&&JSON.stringify(a.fin)===JSON.stringify(b.fin),
  'an optional accountability layer does not alter match results or finances');
ok(!a.ops.reports&&b.ops.reports?.length===1,
  'accountability owns its reports; core owns no report storage');
const clock=fs.readFileSync(path.join(__dirname,'..','src/sim/clock.js'),'utf8');
const view=fs.readFileSync(path.join(__dirname,'..','src/ui/recruit.js'),'utf8');
ok(!/directorAuditWeek\s*\(/.test(clock)&&!/directorReviewPanel\s*\(/.test(view),
  'core clock and baseline recruitment UI do not directly invoke L3 S3.2');
console.log(failed?`layer-isolation-test: ${failed} failed`:'layer-isolation-test: all checks passed');
process.exit(failed?1:0);
