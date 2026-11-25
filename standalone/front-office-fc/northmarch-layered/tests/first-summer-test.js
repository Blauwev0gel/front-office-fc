// The first summer (MB-05, D-G6, bible §7.1–7.2): the manifest is signed before the market and its targets stay fixed;
// the director's plan reads the manifest; after deadline day there is no second market for the player's club.
// Usage: node tests/first-summer-test.js
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE_BASE}=require('../build.js');
const js=ENGINE_BASE.map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const ok=m=>console.log('ok  ',m);
function game(){return vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,cmd,M,signBrief,summerMeeting,preWeek,advanceWeek,eventsSince,summerPlayed,serialize,deserialize,setS:v=>{S=v}})')}
function summer(g,lv){
  const S=g.getS(),id=S.my;
  if(lv!=null)assert.notEqual(g.cmd('SetManifest',id,{k:'league',lv}).ok,false);
  assert.notEqual(g.cmd('SealManifest',id,{}).ok,false,'the manifest can be signed in the pre-season');
  const m=g.summerMeeting(id);assert.notEqual(g.signBrief(id,m.plan.goals.slice(0,3),m.plan.budget).ok,false);
  for(let i=0;i<4;i++)g.preWeek();
  return id;
}

/* 1. the manifest is signed before the summer and its targets do not move */
{const g=game();g.newWorld(4242);g.chooseClub(g.getS().seats[0]);const id=summer(g,2);
 const before=JSON.stringify(g.M(id).goals.map(x=>[x.text,x.target]));
 assert.equal(g.cmd('SetManifest',id,{k:'money',lv:0}).ok,false,'a signed manifest cannot be changed');
 g.advanceWeek();
 assert.equal(JSON.stringify(g.M(id).goals.map(x=>[x.text,x.target])),before,'the targets stay as signed after the season start');
 ok('the manifest is signed before the market, cannot change and its targets stay fixed');}

/* 2. the director's plan reads the manifest */
{const BL=['cautious','normal','allin'];let up=0,n=0;
 for(const seed of [11,12,13,14,15,16]){const a=game();a.newWorld(seed);a.chooseClub(a.getS().seats[1]);const id=a.getS().my;
   a.cmd('SetManifest',id,{k:'league',lv:0});const safe=BL.indexOf(a.summerMeeting(id).plan.budget);
   a.cmd('SetManifest',id,{k:'league',lv:2});const bold=a.summerMeeting(id).plan;
   assert(BL.indexOf(bold.budget)>=safe,'a bold promise never gets a smaller budget than a safe one');n++;if(BL.indexOf(bold.budget)>safe){up++;assert(bold.why||bold.budget==="allin","the plan says why it follows the manifest, unless the director spends all anyway")}}
 assert(up===n,`a bold promise asks for a bigger budget than a safe one (${up}/${n})`);
 ok(`the director's plan follows the manifest: bold spends more than safe in ${up} of ${n} worlds`);}

/* 3. no second market for the player's club after deadline day: nobody joins or leaves except by the league's safety rule */
{let checked=0;
 for(const seed of [1,2,3,4,5,6,7,8,9,10]){const g=game();g.newWorld(seed);g.chooseClub(g.getS().seats[seed%5]);const id=summer(g);
   assert(g.summerPlayed(),'the summer was played');
   const S=g.getS(),mark=S.evn,safety=()=>new Set(S.pre.safety||[]);g.advanceWeek();
   const moves=g.eventsSince(mark).filter(e=>['Transfer','Signing'].includes(e.t)&&(e.c===id||e.c2===id));
   for(const e of moves)assert(safety().has(e.text),`seed ${seed}: hidden move after the deadline: ${e.text}`);
   checked++}
 ok(`no hidden transfers for the player's club at the season start (${checked} worlds)`);}

/* 4. headless runs that never open the summer keep the director's normal window */
{const g=game();g.newWorld(77);g.chooseClub(g.getS().seats[0]);assert(!g.summerPlayed(),'no brief, no played summer');g.advanceWeek();
 ok('without a played summer the season start runs the normal window');}

/* 5. the signature survives save and load */
{const g=game();g.newWorld(31);g.chooseClub(g.getS().seats[2]);const id=g.getS().my;g.cmd('SealManifest',id,{});
 const t=g.serialize();g.setS(g.deserialize(t));assert.equal(g.M(id).sealed,g.getS().season,'sealed is saved');
 assert.equal(g.cmd('SetManifest',id,{k:'league',lv:2}).ok,false,'still signed after loading');
 ok('a signed manifest is saved and loaded');}

console.log('first-summer-test: all checks passed');
