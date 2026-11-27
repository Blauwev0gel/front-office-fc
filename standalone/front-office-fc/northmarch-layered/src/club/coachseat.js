/* ================= The coach's seat (MB-38): pressure that builds, a vote of confidence, a vacancy =================
   Domain Sporting × moment Event (bible §14). Every week the head coach's position is weighed the way a football club does:
   where we stand against what was expected, the last five results, the members' mood, how the coach and the chairman get
   on, and a honeymoon for a new man. It shows as one of four words (Safe, Watched, Under pressure, On the brink), it makes
   the Echo when it gets worse, and on the brink the vote of confidence comes to the chairman (the existing coach moment).
   After a sacking a caretaker takes the team and the chairman chooses from a shortlist with real profiles; a new coach brings
   a bounce. The chairman never picks the team. Owns S.heat = {pid, stage, hist[]}. No DOM. */
const HEAT_STAGE=[[35,'Safe','safe'],[55,'Watched','watch'],[75,'Under pressure','press'],[101,'On the brink','brink']];
const COACH_STYLE={attacking:{n:'Attacking football',fans:{students:4,ultras:3}},defensive:{n:'Organised, hard to beat',fans:{oldguard:3,retirees:2}},results:{n:'Wins ugly, gets results',fans:{oldguard:3,business:2}},development:{n:'Brings young players on',fans:{families:4,volunteers:2}}};
/* the club judges its coach against the target it set itself: the league promise in the chairman's manifest */
function coachTarget(id){const g=id===S.my&&(M(id).goals||[]).find(x=>x.k==='league');return g?g.target:(CL(id).expect||Math.ceil(tierIds(CL(id).tier).length/2))}
function coachWeeks(c){return((S.season-(c.pro.sinceS??S.season))*SEASON_WEEKS)+S.week-(c.pro.sinceW??0)}
function coachHeat(id){const c=coachOf(id);if(!c||!c.pro||c.pro.caretaker)return null;
  const wk=coachWeeks(c),exp=coachTarget(id),pos=S.week?posOf(id):exp,f=wk>0?((S.tbl[id]&&S.tbl[id].form)||[]).slice(-Math.min(5,wk)):[]; /* a new man is judged on his own games */
  const ppg=f.length?f.reduce((a,r)=>a+(r==='W'?3:r==='D'?1:0),0)/f.length:1.4;
  let h=35+(pos-exp)*(wk<6?2:4.5)+(1.4-ppg)*20+(50-M(id).conf)*.25-((c.loy??50)-50)*.1;
  if(wk<6)h-=(6-wk)*5;if(S.week<4)h=Math.min(h,45);
  return Math.round(clamp(h,0,100))}
function heatStage(h){if(h==null)return null;const s=HEAT_STAGE.find(x=>h<x[0]);return{word:s[1],k:s[2]}}
/* why: the facts behind the word, in football terms */
function heatWhy(id){const exp=coachTarget(id),pos=posOf(id),c=coachOf(id),wk=c&&c.pro?coachWeeks(c):5,f=((S.tbl[id]&&S.tbl[id].form)||[]).slice(-Math.max(1,Math.min(5,wk))),w=f.filter(r=>r==='W').length,l=f.filter(r=>r==='L').length;
  return`${S.week?ord(pos):'—'} (target ${ord(exp)}) · ${wk<5?`since he came: ${w}W ${f.length-w-l}D ${l}L`:f.length?`${w}W ${l}L in the last ${f.length}`:'no games yet'}`}
function heatWeek(){const id=S.my;if(!id||S.phase!=='season')return;const c=coachOf(id),h=coachHeat(id);
  if(!S.heat||S.heat.pid!==(c&&c.id))S.heat={pid:c&&c.id,stage:null,hist:[]};if(h==null)return;
  const H=S.heat,st=heatStage(h),order=HEAT_STAGE.map(x=>x[2]),was=H.stage?order.indexOf(H.stage):0,now=order.indexOf(st.k);
  H.hist.push({s:S.season,w:S.week,h});if(H.hist.length>12)H.hist.shift();
  if(now>was&&now>=1)emit('Club',id,[null,`Questions about ${c.name}: ${heatWhy(id)}.`,`Pressure mounts on ${c.name}: ${heatWhy(id)}.`,`${c.name} on the brink: the terraces turn. ${heatWhy(id)}.`][now],{pid:c.id});
  if(now<was&&was>=2)emit('Club',id,`${c.name} eases the pressure: ${heatWhy(id)}.`,{pid:c.id});
  if(now===3){const g=CL(id).groups.find(x=>x.k==='ultras')||CL(id).groups.slice().sort((a,b)=>b.share-a.share)[0];if(g)agmMood(id,{[g.k]:-2},'Chants against the coach')}
  H.stage=st.k}
onWeek(heatWeek);
/* the shortlist after a sacking: four names with a style, a level, a price, and who among the members would cheer */
function coachShortlist(id){return staffCandidates(id,'coach').slice(0,4).map(c=>{const p=P(c.pid),st=COACH_STYLE[p.pro.spec]||{n:p.pro.spec,fans:{}},fan=Object.keys(st.fans).find(k=>CL(id).groups.some(g=>g.k===k));
  return{pid:c.pid,name:p.name,age:p.age,from:c.from,comp:c.comp,wage:staffWage('coach',p.pro.q),stars:staffStars(staffEstimate(c.pid)),style:st.n,spec:p.pro.spec,cheer:fan?(ARCH[fan]?.n||groupName(id,{k:fan})):null}})}
function coachVacant(id){const c=coachOf(id);return !!(c&&c.pro&&c.pro.caretaker)}
/* a new man: a bounce in the dressing room, a honeymoon, and the members who like his style */
function coachArrives(id,pid){const p=P(pid);p.pro.sinceW=S.week;p.pro.sinceS=S.season;if(id!==S.my)return;squadMorale(id,5);const st=COACH_STYLE[p.pro.spec];if(st)agmMood(id,st.fans,'A new head coach');S.heat={pid,stage:'safe',hist:[]}}

/* the caretaker gets the job until the summer: cheap, usually weaker, and judged like any coach from now on */
defCommand('KeepCaretaker',{check:id=>!coachVacant(id)?'There is no caretaker':null,run:id=>{const c=coachOf(id);c.pro.caretaker=false;c.pro.contract=1;c.pro.sinceW=S.week;c.pro.sinceS=S.season;S.heat={pid:c.id,stage:'safe',hist:[]};
  emit('StaffHired',id,`${c.name} is given the job until the summer.`,{pid:c.id,role:'coach'});return c}});
function caretakerRecord(id){const v=S.heat&&S.heat.vacW;if(v==null)return null;const n=S.week-v,f=n>0?((S.tbl[id]&&S.tbl[id].form)||[]).slice(-n):[];return{n,w:f.filter(r=>r==='W').length,d:f.filter(r=>r==='D').length,l:f.filter(r=>r==='L').length}}
