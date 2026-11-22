// Integrated PR #8: test the DEFAULT L1/L2 build, not the opt-in L3 build.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {ENGINE_BASE,UI_BASE,ENGINE,UI}=require('../build.js');
const scripts=ENGINE_BASE.concat(UI_BASE).map(p=>fs.readFileSync(path.join(__dirname,'..','src',p),'utf8')).join('\n');
const E={console};vm.createContext(E);vm.runInContext(scripts+'\n;this.__get=()=>S;',E);
let errors=0;const ok=(v,msg)=>{console.log((v?'ok   ':'FAIL ')+msg);if(!v)errors++};
ok(UI_BASE[0]==='ui/week-brief.js','briefing is loaded before render.js in the default build');
ok(!ENGINE_BASE.some(x=>x.startsWith('layers/autonomy/'))&&!UI_BASE.some(x=>x.startsWith('layers/autonomy/')),
  'no L3 autonomy included in default engine or UI');
ok(ENGINE.length>ENGINE_BASE.length&&UI.length>UI_BASE.length,'L3 remains opt-in, not deleted');
E.newWorld(61053);
E.chooseClub(E.__get().seats[0]);
let S=E.__get();S.agmOff=true;
ok(S.week===0,'club starts in pre-season');
let b=E.chairmanBriefingData();
ok(b.week===0&&b.weeklyNet===null&&b.cash===S.fin[S.my].cash,'pre-season reads genuine finances');
ok(typeof b.focus.text==='string'&&b.focus.act&&typeof b.focus.cta==='string','optional focus leads to a real action');
ok(E.chairmanBriefingView().includes('Chairman'), 'briefing renders in the real UI');
const before=E.serialize();for(let k=0;k<3;k++)E.chairmanBriefingView();
ok(E.serialize()===before,'repeated UI renders are pure: no simulation mutation');
E.cmd('SetDues',S.my,{delta:1});b=E.chairmanBriefingData();
ok(b.decision?.text.includes('Dues')&&b.decision.metric?.label==='Members','real board decision and observed metric');
const signal=E.signals(S.my)[0],focus=E.chairmanFocus();
if(signal&&signal.lv>=2)ok(focus.text===signal.text&&focus.act===signal.act&&focus.arg===signal.arg,'real urgent signal takes priority');
E.advanceWeek();S=E.__get();b=E.chairmanBriefingData();
ok(S.week===1&&b.week===1,'one real week advances the display exactly once');
ok(b.weeklyNet===S.fin[S.my].last.net,'weekly net cash comes from real finance ledger');
ok(b.position===E.posOf(S.my),'live league position used');
const match=E.myMatches()[0];
if(match){const ours=match.h===S.my?match.gh:match.ga;ok(b.match?.ours===ours,'score derived from actual match engine')}
ok(E.chairmanBriefingView().includes('Last decision'),'decision remains visible after week');
const saved=E.serialize();E.deserialize(saved);S=E.__get();
ok(E.chairmanBriefingData().weeklyNet===S.fin[S.my].last.net,'save/load preserves briefing facts without duplicate state');
let fatal=null;
try{for(let w=1;w<30;w++)E.advanceWeek();E.closeSeason();S=E.__get();
  ok(S.season===2&&S.week===0,'season closes and next pre-season starts');
  ok(E.chairmanBriefingData().week===0,'next season never invents last-week result');
  E.advanceWeek();ok(E.chairmanBriefingData().week===1,'briefing renders in second season');
}catch(e){fatal=e}
ok(!fatal,'full season, season boundary and second-season check: '+(fatal||'no runtime error'));
console.log(errors?`base-briefing-test: ${errors} failed`:'base-briefing-test: all checks passed');
process.exit(errors?1:0);
