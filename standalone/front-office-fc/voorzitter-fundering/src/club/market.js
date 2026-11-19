/* ================= Club foundation: the player market =================
   A persistent pool of free agents in the region (released, out of contract, back from abroad).
   Free agents cost no fee, only wages, and can be signed in any week. The pool refreshes every summer. */
function faNew(n){const out=[];for(let i=0;i<n;i++){const pos=pick(POS),age=ri(21,34);const p=newPlayer(pos,{age,q:Math.round((9+rnd()*3.6-(age>=32?.6:0))*10)/10,contract:0});p.free=true;p.why=pick(['released in the summer','out of contract','back from a spell abroad','released after a long injury','left a club that went bust']);out.push(p)}return out}
function faInit(){S.fa=faNew(48)}
function faSummer(){
  // other clubs sign about a third; new names arrive; our own leavers join the pool
  S.fa=(S.fa||[]).filter(()=>rnd()>.35);for(const p of S.fa)p.age++;S.fa=S.fa.filter(p=>p.age<=35);S.fa.push(...faNew(22));
}
function faRelease(p){if(!S.fa||p.age>=35||p.loanIn)return;const c=JSON.parse(JSON.stringify(p));c.free=true;c.contract=0;c.why='released by '+(S.clubs[S.cf.club]?S.clubs[S.cf.club].name:'a club');c.captain=false;S.fa.push(c)}
function faFor(pos){return (S.fa||[]).filter(p=>p.pos===pos)}
function faSign(p,years){S.fa.splice(S.fa.indexOf(p),1);p.free=false;p.contract=years||ri(1,2);p.joined=S.season;p.apps=0;p.goals=0;p.sApps=0;p.sGoals=0;S.cf.squad.push(p);return p}
