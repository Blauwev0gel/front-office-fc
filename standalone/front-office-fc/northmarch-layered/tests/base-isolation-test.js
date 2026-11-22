// L1/L2 release gate: the normal standalone game has NO L3 command, panel,
// deal limit, staffing autonomy report or hidden mandate requirement.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {ENGINE_BASE,UI_BASE,ENGINE,UI}=require('../build.js');
const root=path.join(__dirname,'..','src');
let fails=0;
function ok(c,msg){console.log((c?'ok   ':'FAIL ')+msg);if(!c)fails++}
function instance(files){
  const ctx={console};vm.createContext(ctx);
  vm.runInContext(files.map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n')+'\n;this.__get=()=>S;',ctx);
  return ctx;
}
ok(ENGINE_BASE.every(f=>!f.startsWith('layers/'))&&UI_BASE.every(f=>!f.startsWith('layers/')),
  'published build has no autonomy-layer module');
ok(ENGINE.length>ENGINE_BASE.length&&UI.length>UI_BASE.length,
  'autonomy extensions are available only in explicitly selected alternate build');
const E=instance(ENGINE_BASE.concat(UI_BASE));
E.newWorld(20261122);E.chooseClub(E.__get().seats[1]);
let S=E.__get(),id=S.my;S.agmOff=true;
ok(S.phase==='season'&&S.week===0,'chairman chooses a club and starts the base season');
ok(!S.fin[id].policy.mandate&&!S.ops.missed&&!S.ops.reports,
  'default club has no hidden mandates, missed targets or director-accountability state');
ok(E.featureRule('dealCap',id,Infinity)===Infinity,'ordinary transfer market has no deal-mandate cap');
ok(E.featurePanel('recruitment:beforePolicy')===''&&E.featurePanel('recruitment:afterPolicy')==='',
  'optional L3 interface slots are empty');
ok(!E.cmd('SetMandate',id,{deals:'small'}).ok,'base game cannot change an L3-only mandate');
let uiError=null,played=0;
try{
  let html=E.recruitPanels();
  ok(html.includes('Recruitment')&&!html.includes('director\'s mandate')&&!html.includes('above your limit'),
    'base recruitment UI remains playable without L3');
  // Real club budget and sporting choices remain available, without individual transfer approval.
  ok(E.cmd('SetSquadPolicy',id,{recruit:'youth'}).ok,'core youth recruitment strategy can be selected');
  ok(E.cmd('SetSquadPolicy',id,{spend:.25}).ok,'core transfer spending policy can be selected');
  for(let s=0;s<3;s++){
    for(let w=0;w<30;w++){E.advanceWeek();played++;}
    ok(S.week===30,'complete season '+(s+1)+' advanced normally');
    E.closeSeason();S=E.__get();
    if(S.phase==='choose')throw new Error('Chairman unexpectedly removed in base simulation');
    if(s<2)ok(S.week===0&&S.season===s+2,'season boundary '+(s+1)+' proceeds to next season');
  }
  const save=E.serialize();
  E.deserialize(save);S=E.__get();
  ok(S.week===0&&S.season===4&&S.my===id,'three-season baseline survives save/load');
  ok(!S.fin[id].policy.mandate&&!S.ops.reports,'baseline save/load never adds L3 state');
  ok(typeof E.recruitPanels()==='string'&&E.recruitPanels().includes('Recruitment'),
    'base Football screen still works after a multi-season save/load');
}catch(e){uiError=e}
ok(!uiError,'three full base seasons, transfer windows, reports and UI without L3 '+(uiError||''));
ok(played===90,'ninety weekly transitions completed in baseline');
console.log(fails?`base-isolation-test: ${fails} failed`:'base-isolation-test: all checks passed');
process.exit(fails?1:0);
