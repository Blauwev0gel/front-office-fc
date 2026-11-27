// The chairman's week (MB-36): midweek people bring real matters from the club's state, the chairman sees one; on Saturday
// he chooses a seat; every choice changes the game and comes back in Sunday's recap. Usage: node tests/agenda-test.js
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE,UI}=require('../build.js');
const js=ENGINE.concat(UI).map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const ok=m=>console.log('ok  ',m);
const g=vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,cmd,agendaTopics,agendaSeats,agendaRecap,AG,advanceWeek,coachOf,summerMeeting,signBrief,preWeek})');
g.newWorld(3131);const S=g.getS();g.chooseClub(S.seats[1]);const id=S.my;S.agmOff=true;
g.cmd('SealManifest',id,{});const mt=g.summerMeeting(id);g.signBrief(id,mt.plan.goals.slice(0,3),mt.plan.budget);for(let i=0;i<4;i++)g.preWeek();g.advanceWeek();g.advanceWeek();
const ts=g.agendaTopics(id);assert(ts.length>=4,'four or more people at the door');assert(['coach','td','money','fans','scout'].every(k=>ts.some(t=>t.k===k)),'coach, director, treasurer, supporters and scout');
assert(ts.every(t=>t.opts.length>=1&&t.title&&t.line),'every matter has a title, a line and answers');
ok(`${ts.length} people at the door: ${ts.map(t=>t.role).join(', ')}`);
/* a losing run makes the coach urgent */
S.tbl[id].form=['W','L','L','L'];const c=g.agendaTopics(id).find(t=>t.k==='coach');assert(c.urgent&&/defeats/.test(c.title),'after defeats the coach is urgent');
const m0=S.squads[id].reduce((a,p)=>a+(p.morale??60),0),l0=g.coachOf(id).loy??50;
assert(g.cmd('Meet',id,{topic:'coach',opt:'back'}).ok,'the chairman backs the coach');
assert(S.squads[id].reduce((a,p)=>a+(p.morale??60),0)>m0&&(g.coachOf(id).loy)>l0,'squad morale and coach loyalty rise');
assert(g.cmd('Meet',id,{topic:'fans',opt:'listen'}).ok===false,'one meeting a week');
ok('backing the coach after defeats lifts morale and loyalty; one meeting a week');
const seats=g.agendaSeats(id);assert(seats.length>=2,'a choice of seats on Saturday');
assert(g.cmd('Seat',id,{seat:seats[0].k}).ok,'a seat is chosen');assert(g.cmd('Seat',id,{seat:seats[1].k}).ok===false,'one seat');
ok(`Saturday: ${seats.map(s=>s.t).join(' / ')}`);
g.advanceWeek();const r=g.agendaRecap();assert(r.length>=2,'Sunday recap has the meeting and the seat');
ok('Sunday: '+r.join(' | '));
/* a key contract: backing a new deal keeps the player */
for(let i=0;i<3;i++)g.advanceWeek();const td=g.agendaTopics(id).find(t=>t.k==='td'&&t.pid);
if(td){const p=S.squads[id].find(x=>x.id===td.pid);assert(g.cmd('Meet',id,{topic:'td',opt:'renew'}).ok&&p.contract===3,'a new deal on the chairman’s word');ok(`${p.name} renewed for three years on the chairman’s word`)}
console.log('agenda-test: all checks passed');
