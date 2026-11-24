// Balance research: what does each department lever return, per division? (local tool, not part of the fast suite)
// One job = one division, one seed: the same world and the same club are played once per scenario, one lever differs.
//   node tests/balance-roi.js <tier> <seed> <seasons> <outfile.json>
// The default game is measured: ENGINE_BASE (L1/L2). The chairman's AGM vote is off so that a dismissal does not hide the effect.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {ENGINE_BASE}=require('../build.js');
const [TIER,SEED,N,OUT]=[+process.argv[2],+process.argv[3],+process.argv[4]||6,process.argv[5]];
function load(){const src=ENGINE_BASE.map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
  const ctx={console};vm.createContext(ctx);vm.runInContext(src+'\n;this.__get=()=>S;',ctx,{filename:'engine.js'});return ctx}
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
function run(apply){
  const E=load();E.newWorld(SEED);const S=E.__get();
  const ids=E.tierIds(TIER).slice().sort((a,b)=>E.teamStrength(a)-E.teamStrength(b)),id=ids[Math.floor(ids.length/2)]; /* the median club of the division */
  S.seats=[id];E.chooseClub(id);S.agmOff=true;apply(E,id);
  const pts=[],pos=[],lines={},inj=[],growth=[],str=[],members=[],cashEnd=[];
  for(let s=0;s<N;s++){
    while(!E.seasonOver())E.advanceWeek();
    pts.push(S.tbl[id].pts);pos.push(E.posOf(id));const L=S.fin[id].season;for(const k in L)(lines[k]=lines[k]||[]).push(L[k]);
    const st=S.stats[id];inj.push(st.injWeeks);growth.push(st.youthGrowth);str.push(E.teamStrength(id));members.push(E.M(id).count);cashEnd.push(S.fin[id].cash);
    E.closeSeason();if(S.phase==='choose')break;E.advanceWeek();
  }
  const L={};for(const k in lines)L[k]=Math.round(avg(lines[k])*10)/10;
  return{pts:avg(pts),pos:avg(pos),inj:avg(inj),growth:avg(growth),str:avg(str),members:avg(members),cash:cashEnd[cashEnd.length-1],cashStart:cashEnd[0],lines:L,seasons:pts.length};
}
const depts=['training','medical','academy','scouting','commercial','community','matchday','grounds'];
const scen={base:()=>{}};
const DEFAULT_STAFF=[3,2,1,1,1][TIER]; /* a lever equal to the division's default is the baseline: skip it */
for(const d of depts)for(const lv of [1,5])if(lv!==DEFAULT_STAFF)scen[d+':'+lv]=(E,id)=>{E.cmd('SetDeptStaff',id,{dept:d,level:lv})};
const out={tier:TIER,seed:SEED,seasons:N,runs:{}};
for(const [name,fn] of Object.entries(scen)){if(process.env.ONLY&&!process.env.ONLY.split(',').includes(name))continue;out.runs[name]=run(fn);process.stderr.write('.')}
fs.writeFileSync(OUT,JSON.stringify(out));console.error(' done',OUT);
