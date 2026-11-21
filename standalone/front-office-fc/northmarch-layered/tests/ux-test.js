// L1/L2 UX completion: engine-side guarantees behind the screens (decision journal, signals, season review data).
const {loadEngine}=require('./load.js');
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
E.newWorld(41000);const S=E.__get();E.chooseClub('pell');const id=S.my;
// 1. the journal notes player decisions with a measure taken at that moment, and only player decisions
E.cmd('SetDeptStaff',id,{dept:'medical',level:4});E.cmd('SetPrice',id,{kind:'terrace',delta:1});E.cmd('SetPrice',id,{kind:'terrace',delta:1});E.cmd('SetDues',id,{delta:1});
E.cmd('SetDeptBudget','corden',{dept:'training',level:'tight'},'ai');
const j=S.journal;ok(j.length===3,`three decisions noted; repeated price steps merge into one (${j.length})`);
ok(j.every(x=>x.club===id&&x.key&&Number.isFinite(x.before)),'each entry carries the measure it is meant to move, taken at that moment');
ok(!j.some(x=>x.club==='corden'),'computer boards do not write in the player\'s journal');
for(let i=0;i<10;i++)E.advanceWeek();const rows=E.journalRows(5);ok(rows.every(r=>!r.key||(r.m&&Number.isFinite(r.m.v))),'later, every entry can show the measure now');
// 2. signals are sorted by urgency and each points at an action
S.members[id].conf=30;const sg=E.signals(id);ok(sg.length&&sg.every((x,i)=>!i||sg[i-1].lv>=x.lv)&&sg.every(x=>x.act),'signals are sorted by urgency and each has a place to act');
// 3. the season review knows every target's outcome and the next season's plan exists
S.members[id].conf=70;while(!E.seasonOver())E.advanceWeek();const h=E.closeSeason();
ok(h.agm.goals&&h.agm.goals.length===3&&h.agm.goals.every(g=>typeof g.met==='boolean'),'the AGM keeps each season target with met or missed');
ok(S.fin[id].budget.s===S.season&&S.members[id].goals.length===3,'the new season has a budget plan and new targets before week 1');
// 4. the journal survives a save and load
const before=S.journal.length;E.deserialize(E.serialize());ok(E.__get().journal.length===before,'the journal is saved with the game');
console.log(fails?`${fails} check(s) failed`:'ux-test: all checks passed');process.exit(fails?1:0);
