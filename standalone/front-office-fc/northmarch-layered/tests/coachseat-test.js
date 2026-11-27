// The coach's seat (MB-38): pressure builds from results against expectations, shows as a word and makes the Echo; on the
// brink the vote of confidence comes to the chairman; after a sacking a shortlist with profiles; a new coach brings a bounce.
// Usage: node tests/coachseat-test.js
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE,UI}=require('../build.js');
const js=ENGINE.concat(UI).map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const ok=m=>console.log('ok  ',m);
const g=vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,cmd,coachHeat,heatStage,coachShortlist,coachVacant,coachOf,agendaTopics,advanceWeek,MOMENTS,posOf,weekView,UI})');
g.newWorld(5151);const S=g.getS();g.chooseClub(S.seats[2]);const id=S.my;S.agmOff=true;S.welcomed=true;
for(let i=0;i<8;i++)g.advanceWeek();
const c=g.coachOf(id);c.pro.sinceW=0;c.pro.sinceS=S.season-1;
S.tbl[id].form=['W','W','W','D','W'];const good=g.coachHeat(id);
S.tbl[id].form=['L','L','D','L','L'];const bad=g.coachHeat(id);
assert(bad>good+25,`losses raise the pressure (${good} → ${bad})`);
assert(g.heatStage(10).word==='Safe'&&g.heatStage(80).word==='On the brink','four words from safe to the brink');
ok(`results move the pressure: five wins ${good} (${g.heatStage(good).word}), five defeats ${bad} (${g.heatStage(bad).word})`);
S.members[id].conf=20;S.clubs[id].expect=1;const lg=(S.members[id].goals||[]).find(x=>x.k==='league');if(lg)lg.target=1;const brink=g.coachHeat(id);assert(brink>=75,'bottom of expectations, angry members: on the brink');
assert(g.MOMENTS.coach.when(id),'on the brink the vote of confidence comes to the chairman');
ok(`on the brink (${brink}) the vote of confidence comes to the chairman`);
const t=g.agendaTopics(id).find(x=>x.k==='coach');assert(t&&t.urgent&&t.opts.some(o=>o.k==='sack'),'under pressure the chairman can also sack him from the week');
assert(g.cmd('Meet',id,{topic:'coach',opt:'sack'}).ok&&g.coachVacant(id),'sacked: a caretaker has the team');
const L=g.coachShortlist(id);assert(L.length>=3&&L.every(x=>x.style&&x.stars>=1&&x.wage>0),'a shortlist with style, level and price');
g.UI.title=false;g.UI.tab='week';g.UI.v183Stage='preview';const html=g.weekView();assert(html.includes('VACANCY · HEAD COACH'),'the week shows the vacancy');
ok(`sacked from the week; shortlist: ${L.map(x=>`${x.name} (${x.style}, ${'★'.repeat(x.stars)})`).join('; ')}`);
const m0=S.squads[id].reduce((a,p)=>a+(p.morale??60),0);assert(g.cmd('HireStaff',id,{role:'coach',pid:L[0].pid}).ok,'appointed');
assert(S.squads[id].reduce((a,p)=>a+(p.morale??60),0)>m0,'a new coach lifts the dressing room');
assert(g.coachHeat(id)<brink-30,'and has a honeymoon, judged on his own games');
ok(`${L[0].name} appointed: the dressing room lifts and the pressure resets (${g.coachHeat(id)})`);
/* the caretaker can be given the job until the summer */
{const h=vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,cmd,coachVacant,coachHeat,advanceWeek})');h.newWorld(5152);const T=h.getS();h.chooseClub(T.seats[1]);T.agmOff=true;for(let i=0;i<3;i++)h.advanceWeek();
 assert(h.cmd('SackStaff',T.my,{role:'coach'}).ok&&h.coachVacant(T.my),'vacant');assert(h.cmd('KeepCaretaker',T.my,{}).ok&&!h.coachVacant(T.my)&&h.coachHeat(T.my)!=null,'the caretaker keeps the job and is judged from now on');
 ok('the caretaker can be given the job until the summer, and is judged from then on')}
console.log('coachseat-test: all checks passed');
