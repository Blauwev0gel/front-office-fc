// Balance research: do investment strategies give logical outcomes? (local tool, not in the fast suite)
//   node tests/balance-strategies.js <tier> <seed> <seasons> <out.json>
// Same world, same median club of the division, one strategy per run. AGM vote off so a dismissal does not hide the effect.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {ENGINE_BASE}=require('../build.js');
const [TIER,SEED,N,OUT]=[+process.argv[2],+process.argv[3],+process.argv[4]||8,process.argv[5]];
function load(){const src=ENGINE_BASE.map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
  const ctx={console};vm.createContext(ctx);vm.runInContext(src+'\n;this.__get=()=>S;this.__cl=id=>CL(id);this.__ei=id=>estSeasonIncome(id);',ctx,{filename:'engine.js'});return ctx}
const DEPTS=['training','medical','academy','scouting','commercial','community','matchday','grounds'];
function setAll(E,id,staff,budget){for(const d of DEPTS){E.cmd('SetDeptBudget',id,{dept:d,level:budget});try{E.cmd('SetDeptStaff',id,{dept:d,level:staff})}catch(e){}}}
/* build whatever is affordable, cheapest useful first; reserve = cash that must stay */
function build(E,S,id,reserve,groups){
  const g=S.grounds[id];if(g.projects.filter(p=>p.phase!=='done').length>=2)return;
  const cat=E.projectCatalog(id).filter(o=>!o.busy&&groups.some(k=>o.key.startsWith(k))).sort((a,b)=>a.cost-b.cost);
  for(const o of cat){if(S.fin[id].cash-o.cost>reserve){E.cmd('StartProject',id,{key:o.key,offer:'standard'});break}}
}
const STRAT={
  hold:{init:()=>{},tick:()=>{}},                                   // maintenance only: defaults, no projects
  cut:{init:(E,id)=>setAll(E,id,1,'tight'),tick:()=>{}},            // passive/penny-pinching
  boost:{init:(E,id)=>setAll(E,id,4,'normal'),tick:()=>{}},         // more staff, no building
  smart:{init:()=>{},tick:(E,S,id)=>build(E,S,id,Math.max(60,E.__ei(id)*.4),['plot:','fac:'])}, // build with a cash reserve
  max:{init:(E,id)=>setAll(E,id,5,'generous'),tick:(E,S,id)=>build(E,S,id,0,['plot:','fac:','side:','pitch:'])}, // everything, ignoring cash
};
function run(name){
  const E=load();E.newWorld(SEED);const S=E.__get();
  const ids=E.tierIds(TIER).slice().sort((a,b)=>E.teamStrength(a)-E.teamStrength(b)),id=ids[Math.floor(ids.length/2)];
  S.seats=[id];E.chooseClub(id);S.agmOff=true;const st=STRAT[name];st.init(E,id);
  const r={pts:[],pos:[],cash:[],str:[],inj:[],income:[],tier:[]};
  for(let s=0;s<N;s++){
    let w=0;while(!E.seasonOver()){E.advanceWeek();if(++w%4===0)st.tick(E,S,id)}
    r.pts.push(S.tbl[id]?S.tbl[id].pts:0);r.pos.push(E.posOf(id));r.cash.push(Math.round(S.fin[id].cash));r.str.push(+E.teamStrength(id).toFixed(2));r.inj.push(S.stats[id].injWeeks);r.tier.push(E.__cl(id).tier);
    E.closeSeason();if(S.phase==='choose')break;E.advanceWeek();
  }
  return r;
}
const out={tier:TIER,seed:SEED,seasons:N,runs:{}};
for(const n of Object.keys(STRAT)){if(process.env.ONLY&&!process.env.ONLY.split(',').includes(n))continue;out.runs[n]=run(n);process.stderr.write('.')}
fs.writeFileSync(OUT,JSON.stringify(out));console.error(' done',OUT);
