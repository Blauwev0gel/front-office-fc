// L3, your people (D-L3-1, D-L3-2): staff come to the chairman with real situations, and what the chairman decides about
// people changes what happens next. Usage: node tests/l3-people-test.js
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE}=require('../build.js');
const js=ENGINE.map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const ok=m=>console.log('ok  ',m);
const game=()=>vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,MOMENTS,momentChoose,P,CL,tdOf,coachOf,mandateOf,advanceWeek,preState,WINTER_WEEK,setWeek:w=>{S.week=w}})');
function open(g,key,who){const S=g.getS(),id=S.my,m=g.MOMENTS[key];S.moment={key,at:S.season*100+S.week,...m.make(id,who)};return S.moment}

/* a bigger club comes for your coach: let them go, and a vacancy with real candidates follows; appoint one */
{const g=game();g.newWorld(7001);g.chooseClub(g.getS().seats[2]);const S=g.getS(),id=S.my;g.setWeek(10);
 const co=g.coachOf(id);co.loy=30;co.pro.q=Math.max(co.pro.q,12);
 const who=g.MOMENTS.poach.when(id);assert(who&&who.role,'a disloyal, good coach can be poached');
 const mo=open(g,'poach',who);const cash=S.fin[id].cash;g.momentChoose(mo.opts.findIndex(o=>o.act==='releaseStaff'));
 const now=g.P(g.CL(id).cast[who.role]);assert(now.pro.caretaker,'a caretaker steps in when they leave');assert(S.fin[id].cash>=cash,'the club receives compensation');
 const v=g.MOMENTS.hire.when(id);assert(v&&v.c.length,'a vacancy brings candidates');const h=open(g,'hire',v);
 g.momentChoose(0);const hired=g.P(g.CL(id).cast[v.role]);assert(!hired.pro.caretaker,'the chosen candidate is appointed');
 assert((hired.mem||[]).some(m=>/appointed by you/.test(m.t)),'and remembers who appointed them');
 ok('poached: let them go, a caretaker steps in, compensation is paid, you appoint a successor from real candidates');}

/* keeping them costs wages and earns loyalty */
{const g=game();g.newWorld(7002);g.chooseClub(g.getS().seats[2]);const S=g.getS(),id=S.my;g.setWeek(12);
 const td=g.tdOf(id);td.loy=30;td.pro.q=Math.max(td.pro.q,12);g.coachOf(id).loy=80;
 const who=g.MOMENTS.poach.when(id);assert(who&&who.role==='td','the director can be poached');const w0=td.pro.wage;
 const mo=open(g,'poach',who);g.momentChoose(mo.opts.findIndex(o=>o.act==='keepStaff'));
 assert(td.pro.wage>w0&&td.pro.contract===3&&td.loy>30,'a new deal: more wages, three seasons, more loyalty');
 ok('poached: matching the offer costs 25% more wages and buys three seasons and loyalty');}

/* the director asks for a bigger mandate after losing a target above the limit */
{const g=game();g.newWorld(7003);g.chooseClub(g.getS().seats[1]);const S=g.getS(),id=S.my;g.setWeek(3);
 S.fin[id].policy.mandate={deals:'small'};S.ops=S.ops||{};S.ops.missed=[{s:S.season,status:'above',name:'Jay Test',fee:40}];
 const who=g.MOMENTS.tdmandate.when(id);assert(who,'a missed target above the limit makes the director ask');const l0=g.tdOf(id).loy??50;
 const mo=open(g,'tdmandate',who);g.momentChoose(0);
 assert(g.mandateOf(id).deals==='medium'&&(g.tdOf(id).loy)>l0,'raised: the limit goes up and the director is grateful');
 ok('mandate: the director asks after losing a target; raising it changes the limit and their loyalty');}

/* coach and director fall out over a summer signing: back the coach and he is sold in the winter window */
{const g=game();g.newWorld(7004);g.chooseClub(g.getS().seats[1]);const S=g.getS(),id=S.my;
 const pl=S.squads[id][0];S.pre=g.preState();S.pre.deals.push({pid:pl.id,name:pl.name,stage:'signed',fee:10});pl.sApps=0;g.setWeek(9);
 const who=g.MOMENTS.clash.when(id);assert(who&&who.id===pl.id,'an unused summer signing causes a clash');const tl=g.tdOf(id).loy??50;
 const mo=open(g,'clash',who);g.momentChoose(0);
 assert((S.sellNext||[]).includes(pl.id)&&g.tdOf(id).loy<tl,'backing the coach puts him on the winter list and costs the director’s trust');
 g.setWeek(g.WINTER_WEEK-2);const W=g.preState();assert(W.kind==='winter'&&W.list.includes(pl.id),'the winter window opens with him on the list');
 ok('clash: backing the coach puts the signing on the winter list; the director remembers');}

console.log('l3-people-test: all checks passed');
