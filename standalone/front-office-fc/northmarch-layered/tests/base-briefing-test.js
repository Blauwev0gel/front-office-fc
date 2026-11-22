// Basisspel V1: weekly management information must be factual, actionable and read-only.
// No L3 director accountability is needed in this branch.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {ENGINE,UI}=require('../build.js');
const scripts=ENGINE.concat(UI).map(p=>fs.readFileSync(path.join(__dirname,'..','src',p),'utf8')).join('\n');
const E={console};vm.createContext(E);vm.runInContext(scripts+'\n;this.__get=()=>S;',E);
let errors=0;const ok=(v,msg)=>{console.log((v?'ok   ':'FAIL ')+msg);if(!v)errors++};
E.newWorld(61053);
E.chooseClub(E.__get().seats[0]);
let S=E.__get();S.agmOff=true;
ok(S.week===0,'club starts in pre-season');
let b=E.chairmanBriefingData();
ok(b.week===0&&b.weeklyNet===null&&b.cash===S.fin[S.my].cash,'pre-season briefing contains the real club finances');
ok(typeof b.focus.text==='string'&&b.focus.act&&typeof b.focus.cta==='string','pre-season has a useful optional action');
ok(E.chairmanBriefingView().includes('Chairman'), 'briefing renders in the actual UI');
const before=E.serialize();for(let k=0;k<3;k++)E.chairmanBriefingView();
ok(E.serialize()===before,'repeated UI renders do not mutate the simulation');
E.cmd('SetDues',S.my,{delta:1});b=E.chairmanBriefingData();
ok(b.decision?.text.includes('Dues')&&b.decision.metric?.label==='Members','the last real chairman decision is visible with an observed measure');
const signal=E.signals(S.my)[0],focus=E.chairmanFocus();
if(signal&&signal.lv>=2)ok(focus.text===signal.text&&focus.act===signal.act&&focus.arg===signal.arg,'recommended action comes from the real priority signal');
E.advanceWeek();S=E.__get();b=E.chairmanBriefingData();
ok(S.week===1&&b.week===1,'advancing one week advances the displayed week');
ok(b.weeklyNet===S.fin[S.my].last.net,'briefing reports last real net cash movement');
ok(b.position===E.posOf(S.my),'briefing uses the live league table');
const lastMatch=E.myMatches()[0];
if(lastMatch){const ours=lastMatch.h===S.my?lastMatch.gh:lastMatch.ga;
  ok(b.match?.ours===ours&&E.chairmanBriefingView().includes('result'),'match score is taken from the real engine and shown first');}
ok(E.chairmanBriefingView().includes('Last decision'),'the decision remains visible after a played week');
const saved=E.serialize();
E.deserialize(saved);S=E.__get();
ok(E.chairmanBriefingData().weeklyNet===S.fin[S.my].last.net,'save/load retains factual briefing values without storing duplicated UI state');
let fatal=null;
try{for(let w=1;w<30;w++)E.advanceWeek();const h=E.closeSeason();S=E.__get();
  ok(!!h&&S.season===2&&S.week===0,'season closes and new pre-season briefing works');
  ok(E.chairmanBriefingData().week===0,'new season does not invent a last-week result');
  E.advanceWeek();
  ok(E.chairmanBriefingData().week===1,'briefing works in second season');
}catch(e){fatal=e}
ok(!fatal,'full season has no new briefing runtime failures '+(fatal||''));
console.log(errors?`base-briefing-test: ${errors} failed`:'base-briefing-test: all checks passed');
process.exit(errors?1:0);
