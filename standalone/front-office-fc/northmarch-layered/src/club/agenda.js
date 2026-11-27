/* ================= The chairman's week (MB-36): who you see, where you sit, what came of it =================
   Midweek, people knock on the chairman's door, each with a real matter drawn from the club as it is now: the head coach
   after a bad run, the director with a key contract running out, the treasurer, the unhappiest supporters' group with its
   demand, the commercial manager with a sponsor's offer, the chief scout with a trip. The chairman sees one of them; the
   others wait (and some matters go away). On Saturday the chairman chooses where to sit: at home in the boardroom with the
   visiting chairman, in the sponsors' lounge or on the terrace; away with the team or at a youth game. Every choice has an
   effect on the real game (morale, loyalty, members' mood, money, contracts, a scouting tip) and a line in Sunday's Echo.
   Scarcity comes from the calendar, not from points: one big meeting a week, one seat on Saturday (MB-03/04).
   Owns S.agenda = {w, met, seat, log[], sponsor, done{}}. Seeded by ARNG per week, so the world's stream is untouched. */
function AG(){if(!S.agenda)S.agenda={w:-1,met:null,seat:null,log:[],done:{}};const A=S.agenda,w=S.season*100+S.week;if(A.w!==w){A.w=w;A.met=null;A.seat=null;A.today=[]}return A}
function agLog(t){const A=AG();A.today.push(t);A.log.push({s:S.season,w:S.week,t});if(A.log.length>60)A.log.shift()}
function squadMorale(id,d){for(const p of S.squads[id])p.morale=clamp((p.morale??60)+d,0,100)}
function lastResults(id){return((S.tbl[id]&&S.tbl[id].form)||[]).slice(-3)}
function unhappiestGroup(id){return CL(id).groups.slice().sort((a,b)=>a.mood-b.mood)[0]}
/* the matters on the chairman's desk this week, each with two or three answers */
function agendaTopics(id){
  const A=AG(),r=ARNG(id+':ag:'+S.season+':'+S.week),out=[],co=coachOf(id),td=tdOf(id),form=lastResults(id),losses=form.filter(x=>x==='L').length,sq=S.squads[id];
  /* the head coach */
  const heat=typeof coachHeat==='function'?coachHeat(id):null,hs=heat!=null?heatStage(heat):null;
  if(co&&!co.pro?.caretaker){if(S.week>=2&&(losses>=2||heat>=55))out.push({k:'coach',who:co.name,role:'Head coach',urgent:true,title:hs&&heat>=55?`${hs.word}: ${losses} defeat${losses===1?'':'s'} in three`:`${losses} defeats in three`,line:'The dressing room is quiet. I need to know where you stand.',opts:[
      {k:'back',t:'Back the coach in public',fx:'Squad morale +4 · coach loyalty +8 · members −1 if it goes on',run:()=>{squadMorale(id,4);co.loy=clamp((co.loy??50)+8,0,100);confLog(id,-1,'The chairman backs a losing coach');agLog(`You backed ${co.name} in public after ${losses} defeats: the squad responded.`)}},
      {k:'demand',t:'Demand a reaction',fx:'Squad morale +2 now · coach loyalty −8',run:()=>{squadMorale(id,2);co.loy=clamp((co.loy??50)-8,0,100);agLog(`You told ${co.name} you expect a reaction. The training ground got louder.`)}},
      {k:'quiet',t:'Say nothing',fx:'Nothing changes',run:()=>agLog(`You left ${co.name} to it.`)},
      ...(heat>=55?[{k:'sack',t:'Sack him',fx:`£${settlement(co.id)}k settlement · a caretaker takes over · you choose the next man`,run:()=>{const r=cmd('SackStaff',id,{role:'coach'});agLog(r.ok===false?r.err:`You sacked ${co.name}. A caretaker takes the team on Saturday.`)}}]:[])]});
    else out.push({k:'coach',who:co.name,role:'Head coach',title:'The squad',line:form.length&&form.every(x=>x==='W')?'They are flying. A word from you would keep it going.':'Give the young lads a chance, or keep it tight?',opts:[
      {k:'visit',t:'Visit the training ground',fx:'Squad morale +3',run:()=>{squadMorale(id,3);agLog('You spent a morning at the training ground. The players noticed.')}},
      {k:'kids',t:'Ask for minutes for the young players',fx:'Young players’ morale +6 · coach loyalty −3',run:()=>{for(const p of sq)if(p.age<=21)p.morale=clamp((p.morale??60)+6,0,100);co.loy=clamp((co.loy??50)-3,0,100);agLog(`You asked ${co.name} to give the youngsters minutes.`)}}]})}
  /* the director: a key player's contract */
  const key=sq.filter(p=>!p.loan&&p.contract<=1&&p.q>=squadQuality(sq)-.3&&!(A.done['renew'+p.id])).sort((a,b)=>b.q-a.q)[0];
  if(td&&key){const med=sq.slice().sort((a,b)=>a.q-b.q)[sq.length>>1].q,ask=Math.round(Math.max(key.wage,wageFor(key.q)*clubWageF(id)*1.1)/5)*5;
    out.push({k:'td',who:td.name,role:'Director of football',urgent:S.week>=8,title:`${key.name}'s contract runs out`,line:`One of our best (${POS_ONE[key.pos]}, ${key.age}). He wants £${n0(ask)} a week to stay; now £${n0(key.wage)}.`,pid:key.id,opts:[
      {k:'renew',t:`Back a new deal: £${n0(ask)}/w for three years`,fx:`Wages +£${n0(ask-key.wage)}/w · he stays`,run:()=>{key.wage=ask;key.contract=3;key.morale=clamp((key.morale??60)+8,0,100);A.done['renew'+key.id]=1;emit('Contract',id,`${key.name} signs a new three-year deal at ${CL(id).name}.`,{pid:key.id});agLog(`${key.name} signed a new three-year deal on your word.`)}},
      {k:'wait',t:'Let it run, decide in the summer',fx:'He may leave for nothing',run:()=>{key.morale=clamp((key.morale??60)-5,0,100);A.done['renew'+key.id]=1;agLog(`You let ${key.name}'s contract run. He has noticed.`)}}]})}
  else if(td)out.push({k:'td',who:td.name,role:'Director of football',title:S.week<WINTER_WEEK?'The winter window':'The summer ahead',line:`I am watching ${preTargets(id).length||'no'} position${preTargets(id).length===1?'':'s'} for the next window.`,opts:[
      {k:'brief',t:'Talk through the targets',fx:'Director loyalty +4',run:()=>{td.loy=clamp((td.loy??50)+4,0,100);agLog(`An evening with ${td.name} over the targets for the next window.`)}}]});
  /* the treasurer */
  const b=books(id),tr=deptHeadName(id,'finance');
  if(b.tight)out.push({k:'money',who:tr,role:'Treasurer',urgent:true,title:'The money runs out',line:`We reach ${k1v(b.low)} around week ${b.lowW}; the bank allows ${k1v(-b.lim)}.`,opts:[
      {k:'loan',t:'Take a three-year loan',fx:'Cash now, interest every season',run:()=>{const amt=Math.max(10,Math.min(maxNewLoan(id),Math.ceil((-b.low+b.lim*.5)/5)*5));const x=cmd('TakeLoan',id,{amount:amt,years:3});agLog(x.ok===false?'The bank said no.':`You took a £${amt}k loan over three years.`)}},
      {k:'price',t:'Raise ticket prices',fx:'More at the gate · families −4',run:()=>{cmd('SetPrice',id,{kind:'terrace',delta:1});cmd('SetPrice',id,{kind:'seated',delta:1});agmMood(id,{families:-4,students:-3},'Ticket prices up');agLog('You raised ticket prices. The families are not pleased.')}}]});
  else out.push({k:'money',who:tr,role:'Treasurer',title:'Ticket prices',line:`We end the season around ${k1v(b.end)}. Wages are ${b.wr}% of turnover.`,opts:[
      {k:'up',t:'Raise prices a little',fx:'More at the gate · families −3',run:()=>{cmd('SetPrice',id,{kind:'terrace',delta:1});agmMood(id,{families:-3,students:-2},'Ticket prices up');agLog('You put the terrace price up by a pound.')}},
      {k:'down',t:'Cut prices for the families',fx:'Less at the gate · families +4',run:()=>{cmd('SetPrice',id,{kind:'terrace',delta:-1});agmMood(id,{families:4,students:3},'Ticket prices down');agLog('You cut the terrace price by a pound. The families noticed.')}}]});
  /* the unhappiest supporters' group */
  const g=unhappiestGroup(id);if(g&&ARCH[g.k]){const gn=groupName(id,g),cost=Math.max(2,Math.round(estSeasonIncome(id)*.006));
    out.push({k:'fans',who:gn,role:`Supporters · ${g.share}% of the members`,urgent:g.mood<35,title:`${gn} want to be heard`,line:`“${ARCH[g.k].wants}” Their mood: ${Math.round(g.mood)}/100.`,opts:[
      {k:'listen',t:'Meet them and listen',fx:`${gn} +5`,run:()=>{agmMood(id,{[g.k]:5},'The chairman listened');agLog(`You met ${gn} and listened. Their mood rose.`)}},
      {k:'gesture',t:`A gesture: £${cost}k for their cause`,fx:`${gn} +12 · −£${cost}k`,run:()=>{book(id,'events',-cost);agmMood(id,{[g.k]:12},'A gesture from the chairman');agLog(`You put £${cost}k into what ${gn} asked for. They will remember it at the AGM.`)}}]})}
  /* the commercial manager: a sponsor's offer, now and then */
  if(r()<.45||A.sponsor&&A.sponsor.w===S.week){const firms=[['a local builders’ merchant',null],['a betting company',{families:-5,oldguard:-4}],['an energy firm',{newcomers:-3}],['a brewery',{families:-2}],['a car dealer',null],['a regional bank',{workers:-3}]],[f,fx]=apick(r,firms),amt=Math.max(3,Math.round(estSeasonIncome(id)*(.02+r()*.03)));
    out.push({k:'sponsor',who:deptHeadName(id,'commercial'),role:'Commercial manager',title:`£${amt}k from ${f}`,line:`For the shirt sleeve, this season.${fx?' Not everyone will like the name on our shirt.':''}`,opts:[
      {k:'yes',t:`Accept £${amt}k`,fx:fx?`+£${amt}k · ${Object.entries(fx).map(([k,v])=>`${ARCH[k]?.n||k} ${v}`).join(', ')}`:`+£${amt}k`,run:()=>{book(id,'sponsors',amt);if(fx)agmMood(id,fx,'A sponsor on the sleeve');agLog(`You signed ${f} on the sleeve for £${amt}k.`)}},
      {k:'more',t:'Ask for more',fx:'Half the time +25%, else they walk',run:()=>{if(r()<.5){const a2=Math.round(amt*1.25);book(id,'sponsors',a2);if(fx)agmMood(id,fx,'A sponsor on the sleeve');agLog(`You pushed ${f} up to £${a2}k. Done.`)}else agLog(`You asked ${f} for more. They walked away.`)}}]})}
  /* the chief scout: a trip (the existing scouting trips) */
  out.push({k:'scout',who:deptHeadName(id,'scouting'),role:'Chief scout',title:'Come and see a player with me',line:'Two days on the road. We find, the director decides.',trip:true,opts:Object.entries(REGIONS).slice(0,4).map(([rk,R])=>({k:'trip:'+rk,t:R.n,fx:`£${R.cost}k travel · ${R.d}`,run:()=>{const x=chairTrip(id,rk);agLog(x.ok===false?x.err:x.found&&x.found.length?`On the road with the chief scout: ${x.found.map(f=>f.name).join(', ')}. Recommend them under Running.`:'On the road with the chief scout: nobody worth the money.')}}))});
  return out.sort((a,b)=>(b.urgent?1:0)-(a.urgent?1:0));
}
defCommand('Meet',{check:(id,a)=>{const A=AG();if(A.met)return'You have had your meeting this week';const t=agendaTopics(id).find(x=>x.k===a.topic);if(!t)return'Nobody is waiting with that';if(!t.opts.some(o=>o.k===a.opt))return'Not an option';return null},
  run:(id,a)=>{const A=AG(),t=agendaTopics(id).find(x=>x.k===a.topic),o=t.opts.find(x=>x.k===a.opt);A.met={topic:t.k,who:t.who,title:t.title,opt:o.t};o.run();return A.met}});
/* Saturday: where the chairman sits */
function agendaSeats(id){const fx=fixtureOf(id,S.week+1);if(!fx)return[];const opp=fx.opp,oc=CL(opp),home=fx.home;
  if(home)return[
    {k:'board',t:`The boardroom with ${oc.name}’s chairman`,fx:'A contact · a tip about one of their players',run:()=>{const sq=S.squads[opp],xi=new Set(pickXI(sq).map(x=>x.p.id)),p=sq.filter(x=>!x.loan&&!xi.has(x.id)&&x.age<=27).sort((a,b)=>b.q-a.q)[0];
      (S.contacts=S.contacts||[]).push({club:opp,s:S.season,w:S.week});if(S.contacts.length>30)S.contacts.shift();
      if(p&&typeof gemRecord==='function'){gemRecord(id,{p,from:opp},'low',scoutNoise(id),'boardroom');agLog(`In the boardroom ${oc.name}’s chairman let slip that ${p.name} (${POS_ONE[p.pos]}, ${p.age}) could go. He is under Running.`)}else agLog(`An afternoon in the boardroom with ${oc.name}’s chairman. A contact for later.`)}},
    {k:'lounge',t:'The sponsors’ lounge',fx:'Commercial income for the day',run:()=>{const amt=Math.max(1,Math.round(estSeasonIncome(id)*.004));book(id,'sponsors',amt);agLog(`You worked the sponsors’ lounge: £${amt}k in new hospitality.`)}},
    {k:'terrace',t:'On the terrace with the fans',fx:'The loudest group +4',run:()=>{const g=CL(id).groups.slice().sort((a,b)=>b.share-a.share)[0];agmMood(id,{[g.k]:4},'The chairman on the terrace');agLog(`You watched from the terrace with ${groupName(id,g)}. They will talk about it all week.`)}}];
  return[
    {k:'travel',t:`Travel with the team to ${oc.ground}`,fx:'Squad morale +3 · £1k',run:()=>{squadMorale(id,3);book(id,'travel',-1);agLog(`You travelled with the team to ${oc.ground}.`)}},
    {k:'youth',t:'Watch the U18s at home',fx:'Academy staff morale · a youngster in the spotlight',run:()=>{const A=typeof ACAD==='function'?ACAD():null,k=A&&A.kids.filter(x=>x.age>=15).sort((a,b)=>b.pa-a.pa)[0];if(k){k.moment=`The chairman watched him against ${oc.name}’s U18s.`;k.form=(k.form||0)+.1}agLog(k?`You watched the U18s instead: ${k.name} caught your eye.`:'You watched the U18s instead.')}}]}
defCommand('Seat',{check:(id,a)=>{const A=AG();if(A.seat)return'You have chosen your seat';if(!agendaSeats(id).some(x=>x.k===a.seat))return'Not an option this week';return null},
  run:(id,a)=>{const A=AG(),s=agendaSeats(id).find(x=>x.k===a.seat);A.seat={k:s.k,t:s.t};s.run();return A.seat}});
/* what the chairman did last week, for Sunday's Echo */
function agendaRecap(){const A=S.agenda;if(!A)return[];const w=S.week;return A.log.filter(x=>x.s===S.season&&x.w===w-1).map(x=>x.t)}
