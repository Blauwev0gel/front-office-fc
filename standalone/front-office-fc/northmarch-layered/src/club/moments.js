/* ================= Moments and agreements (milestone M3, layers L3/L4) =================
   The story core: a few times a season the world puts a person in front of the chairman (the head coach under pressure,
   a star who wants out, the opposition, an investor, the captain). Each moment ends in an AGREEMENT with clear terms —
   You give · They give · Tested · If it fails — or in a visible "no agreement". Agreements stay on the table, are tested
   against the real season and are kept or broken, with consequences through existing levers only (members' confidence,
   a person's loyalty, wants-out, wages, reputation, the coach's job). One moment is open at a time, shared with family moments.
   Owns S.moment (the open club moment) and S.pacts[] (agreements). No DOM. */
const MOM_GAP=5,MOM_DEADLINE=2;
const momNow=()=>S.season*100+S.week;
function momLast(){return Math.max(S.momentLast??-99,S.family?.last??-99)}
function pactsOpen(){return(S.pacts||[]).filter(p=>p.status==='open')}
function pactAdd(p){S.pacts=S.pacts||[];S.pacts.push({...p,s:S.season,w:S.week,status:'open'});if(S.pacts.length>30)S.pacts.shift()}
function ptsNow(id){return S.tbl[id]?S.tbl[id].pts:0}
function homeNext(id){for(let w=S.week+1;w<=SEASON_WEEKS;w++){const f=fixtureOf(id,w);if(f&&f.home)return w}return null}

/* ----- the catalogue: when a moment arises, and what can be agreed ----- */
const MOMENTS={
  coach:{when:id=>{const f=(S.tbl[id]?.form||[]).slice(-3).join(''),exp=CL(id).expect||8,c=P(CL(id).cast.coach);const f5=(S.tbl[id]?.form||[]).slice(-5);return c&&!c.pro?.caretaker&&S.week>=6&&S.week<=26&&(f==='LLL'||posOf(id)>=exp+3||f5.length===5&&f5.filter(r=>r==='W').length===0)&&!pactsOpen().some(p=>p.key==='coach')?c:null},
    make:(id,c)=>({who:c.name,role:'Head coach',title:`${c.name} is under pressure`,text:`${(S.tbl[id]?.form||[]).slice(-5).join(' ')||'Poor results'}: ${ord(posOf(id))} in the table. ${c.name} asks whether you still back him.`,
      opts:[{label:'Back him in public',give:'Your word, in public',get:'He keeps his job and his nerve',test:'7 points from the next 5 games',fail:'The members turn on you (−6 confidence)',pact:{key:'coach',kind:'points',need:7,weeks:5,okConf:3,failConf:-6,okLoy:10,person:c.id}},
        {label:'An ultimatum',give:'Nothing but time',get:'A last chance',test:'Win 2 of the next 4 games',fail:'He is sacked automatically',pact:{key:'coach',kind:'wins',need:2,weeks:4,failSack:true,person:c.id}},
        {label:'Sack him now',give:'His settlement',get:'A caretaker and a fresh start',test:'—',fail:'—',act:'sack'}],dflt:1})},
  star:{when:id=>{const p=topThree(id).find(x=>x.wantsOut);return p&&!pactsOpen().some(x=>x.key==='star'&&x.pid===p.id)?p:null},
    make:(id,p)=>({who:p.name,role:'Your star player',title:`${p.name} wants to leave`,text:`${p.name} (${POS_ONE[p.pos]}, ${p.age}) is one of your three best players. His agent says he wants a bigger stage.`,
      opts:[{label:'A better contract',give:'A 20% pay rise, now',get:'He stays and plays with a smile',test:'You keep him through the next window',fail:'If you sell him after all, your word is worth less (reputation)',pact:{key:'star',kind:'keep',pid:p.id,raise:.2,person:null}},
        {label:'Promise him a move next summer',give:'A promise to sell if a fair bid comes',get:'Full effort until then',test:'You accept the first fair bid next summer',fail:'He downs tools and the dressing room notices',pact:{key:'star',kind:'release',pid:p.id}},
        {label:'No promises',give:'Nothing',get:'Nothing',test:'—',fail:'He stays unhappy and may sulk',act:'none'}],dflt:2})},
  opposition:{when:id=>{const m=M(id),o=P(CL(id).cast.opp);return o&&S.week>=8&&S.week<=25&&m.conf<58&&!pactsOpen().some(p=>p.key==='opp')?o:null},
    make:(id,o)=>({who:o.name,role:'Leader of the opposition',title:`${o.name} is gathering signatures`,text:`Members' confidence is ${Math.round(M(id).conf)}. ${o.name} talks of standing against you at the AGM.`,
      opts:[{label:'Offer a seat on the board',give:'Power: a seat at your table',get:'They stop campaigning (+6 now)',test:'Confidence stays above 40 until the AGM',fail:'They walk out loudly (−8)',pact:{key:'opp',kind:'conf',min:40,nowConf:6,failConf:-8,person:o.id}},
        {label:'Promise a home win',give:'A public promise',get:'A crowd behind you',test:'Win the next home game',fail:'Laughed at in the stands (−6)',pact:{key:'opp',kind:'homewin',okConf:6,failConf:-6,person:o.id}},
        {label:'Ignore them',give:'Nothing',get:'Nothing',test:'—',fail:'The campaign grows (−3 now)',act:'ignore'}],dflt:2})},
  investor:{when:id=>{const f=F(id),inc=estSeasonIncome(id);return S.week>=5&&S.week<=24&&(f.cash<inc*.15||debt(id)>inc*.6)&&!(S.momentDone||{})['investor'+S.season]?{name:`${pick(FIRST)} ${pick(LAST)}`}:null},
    make:(id,x)=>{const sum=Math.max(20,Math.round(estSeasonIncome(id)*.25/5)*5);return{who:x.name,role:'A local businessman',title:`${x.name} offers £${sum}k`,text:`The bank is nervous. ${x.name} offers £${sum}k now, for a say in how the club is run.`,
      opts:[{label:`Take the £${sum}k`,give:'Influence: he joins the board',get:`£${sum}k in the bank today`,test:'No more than one loss-making month for the rest of the season',fail:'He goes public: the members hear who really runs the club (−8)',pact:{key:'inv',kind:'cash',sum,failConf:-8,nowConf:-3}},
        {label:'Take half, no seat',give:'A thank-you and a box at the ground',get:`£${Math.round(sum/2)}k`,test:'—',fail:'—',act:'half',sum:Math.round(sum/2)},
        {label:'Say no',give:'Nothing',get:'Your independence',test:'—',fail:'The money problem stays yours',act:'none'}],dflt:2}}},
  contract:{when:id=>{const p=topThree(id).find(x=>x.contract<=1&&!x.wantsOut);return p&&S.week>=10&&S.week<=22&&!(S.momentDone||{})['contract'+S.season]?p:null},
    make:(id,p)=>{const raise=Math.round(p.wage*.3/5)*5;return{who:p.name,role:'Your star player',title:`${p.name}'s contract runs out`,text:`${p.name} (${POS_ONE[p.pos]}, ${p.age}) has a year left. Clubs are circling; his agent wants an answer.`,
      opts:[{label:'Offer a new deal now',give:`£${raise} a week more, for three years`,get:'His best years at your club',test:'He keeps his place: 10 games before the season ends',fail:'An expensive bench-warmer (the members notice the wage bill)',pact:{key:'contract',kind:'apps',pid:p.id,need:10,raise:.3,failConf:-3,okConf:2}},
        {label:'Let it run, decide in the summer',give:'Uncertainty',get:'Money saved for now',test:'—',fail:'He may leave for nothing',act:'none'},
        {label:'Sell him in the winter',give:'A star, mid-season',get:'A fee while he still has value',test:'He is sold in the winter window',fail:'He walks for free next summer',pact:{key:'contract',kind:'sellwinter',pid:p.id,failConf:-2}}],dflt:1}}},
  sponsor:{when:id=>S.week>=6&&S.week<=14&&!(S.momentDone||{})['sponsor'+S.season]&&F(id).sponsor?{name:F(id).sponsor.name}:null,
    make:(id,x)=>{const b=Math.max(5,Math.round(estSeasonIncome(id)*.06/5)*5),half=Math.ceil(tierIds(CL(id).tier).length/2);return{who:x.name,role:'Main sponsor',title:`${x.name} want a performance clause`,text:`Your sponsor offers a bonus of £${b}k if you finish in the top half. If you do not, they pay £${Math.round(b/2)}k less next season.`,
      opts:[{label:'Sign the clause',give:`A risk of £${Math.round(b/2)}k`,get:`£${b}k if it works`,test:`Finish ${ord(half)} or higher`,fail:`£${Math.round(b/2)}k less`,pact:{key:'sponsor',kind:'finish',pos:half,bonus:b,penalty:Math.round(b/2)}},
        {label:'Keep the deal as it is',give:'Nothing',get:'Certainty',test:'—',fail:'—',act:'none'}],dflt:1}}},
  captain:{when:id=>{const c=P(CL(id).cast.captain),sold=(S.pre&&S.pre.s===S.season?S.pre.sold:[]).length;return c&&S.week>=3&&S.week<=WINTER_WEEK-1&&sold>=1&&!(S.momentDone||{})['captain'+S.season]?c:null},
    make:(id,c)=>({who:c.name,role:'Captain',title:`${c.name} asks for a word`,text:`The captain is worried: good players left this summer. He wants to know the squad will not be stripped in the winter.`,
      opts:[{label:'No sales in the winter',give:'Your word: nobody leaves in the winter window',get:'A united dressing room',test:'No first-team player sold in the winter window',fail:'The captain loses faith in you',pact:{key:'cap',kind:'nosale',person:c.id}},
        {label:'Tell him the truth',give:'Honesty: sales are part of the plan',get:'Respect, if not happiness',test:'—',fail:'—',act:'truth'}],dflt:1})}
};
/* ----- weekly: test the agreements, and maybe open a moment ----- */
function momentsWeek(){
  const id=S.my;if(!id||S.phase!=='season'||!S.week)return;
  for(const p of pactsOpen())pactTest(id,p);
  if(S.moment){if(momNow()-S.moment.at>=MOM_DEADLINE)momentChoose(S.moment.dflt,true);return}
  if(S.family&&S.family.moment)return;if(momNow()-momLast()<MOM_GAP)return;
  for(const key of ['coach','star','opposition','investor','contract','captain','sponsor']){const who=MOMENTS[key].when(id);if(who){S.moment={key,at:momNow(),...MOMENTS[key].make(id,who)};S.momentLast=momNow();(S.momentDone=S.momentDone||{})[key+S.season]=true;emit('Moment',id,S.moment.title);return}}
}
function momentChoose(i,silent){
  const id=S.my,mo=S.moment;if(!mo)return{ok:false,err:'Nothing to decide'};const o=mo.opts[i];if(!o)return{ok:false,err:'Unknown option'};S.moment=null;let note=o.label;
  if(o.pact){const p={...o.pact,title:mo.title,who:mo.who,give:o.give,get:o.get,test:o.test,fail:o.fail,label:o.label,pts0:ptsNow(id),w0:S.week};
    if(p.kind==='homewin')p.hw=homeNext(id);
    if(p.kind==='keep'){const pl=S.squads[id].find(x=>x.id===p.pid);if(pl){pl.wage=Math.round(pl.wage*(1+p.raise)/5)*5;pl.wantsOut=false;pl.contract=Math.max(pl.contract,3)}}
    if(p.kind==='release'){const pl=S.squads[id].find(x=>x.id===p.pid);if(pl)pl.wantsOut=false}
    if(p.kind==='apps'){const pl=S.squads[id].find(x=>x.id===p.pid);if(pl){pl.wage=Math.round(pl.wage*(1+p.raise)/5)*5;pl.contract=3;p.apps0=pl.sApps||0}}
    if(p.kind==='cash'){book(id,'loanIn',p.sum);if(p.nowConf)confLog(id,p.nowConf,'An investor on the board')}
    if(p.nowConf&&p.kind!=='cash')confLog(id,p.nowConf,mo.title);
    pactAdd(p);note=`Agreed: ${o.label}. Tested: ${o.test}.`}
  else if(o.act==='sack'){const r=cmd('SackStaff',id,{role:'coach'});note=r.ok===false?r.err:`${mo.who} is sacked. A caretaker takes over.`}
  else if(o.act==='ignore'){confLog(id,-3,'The opposition campaign grows');note='You ignore them. The campaign grows.'}
  else if(o.act==='half'){book(id,'loanIn',o.sum);note=`£${o.sum}k in the bank, no strings.`}
  else if(o.act==='truth'){const c=P(CL(id).cast.captain);if(c)c.loy=clamp((c.loy??50)+3,0,100);note='The captain respects your honesty.'}
  else note='No agreement.';
  (S.momentLog=S.momentLog||[]).push({s:S.season,w:S.week,title:mo.title,choice:o.label,silent:!!silent});if(S.momentLog.length>40)S.momentLog.shift();
  emit('MomentChoice',id,(silent?'You said nothing: ':'')+note);return{ok:true,note};
}
/* ----- an agreement is tested against the real season ----- */
function pactClose(id,p,kept,why){
  p.status=kept?'kept':'broken';p.closed=[S.season,S.week];p.why=why;const per=p.person&&P(p.person);
  if(kept){if(p.okConf)confLog(id,p.okConf,`Kept: ${p.title}`);if(per&&p.okLoy)per.loy=clamp((per.loy??50)+p.okLoy,0,100)}
  else{if(p.failConf)confLog(id,p.failConf,`Broken: ${p.title}`);if(per)per.loy=clamp((per.loy??50)-12,0,100);
    if(p.failSack){const r=cmd('SackStaff',id,{role:'coach'});why+=r.ok===false?'':' He is sacked.'}
    if(p.key==='star'&&p.kind==='keep')S.rep=r1((S.rep||0)-1);
    if(p.key==='star'&&p.kind==='release'){const pl=S.squads[id].find(x=>x.id===p.pid);if(pl)pl.wantsOut=true}
    if(p.key==='cap'){const c=per;if(c)c.loy=clamp((c.loy??50)-10,0,100)}}
  emit('PactClosed',id,`${kept?'Kept':'Broken'}: ${p.label} (${p.who}). ${why}`);
}
function pactTest(id,p){
  const gone=S.week-p.w0,pts=ptsNow(id)-p.pts0;
  if(p.kind==='points'){if(pts>=p.need)return pactClose(id,p,true,`${pts} points in ${gone} games.`);if(gone>=p.weeks)return pactClose(id,p,false,`Only ${pts} points in ${gone} games.`)}
  if(p.kind==='wins'){const wins=(S.tbl[id]?.form||[]).slice(-Math.max(1,gone)).filter(r=>r==='W').length;if(wins>=p.need)return pactClose(id,p,true,`${wins} wins in ${gone} games.`);if(gone>=p.weeks)return pactClose(id,p,false,`${wins} win${wins===1?'':'s'} in ${gone} games.`)}
  if(p.kind==='conf'){if(M(id).conf<p.min)return pactClose(id,p,false,`Confidence fell to ${Math.round(M(id).conf)}.`);if(S.week>=SEASON_WEEKS)return pactClose(id,p,true,'They stood by you to the AGM.')}
  if(p.kind==='homewin'&&!p.hw&&S.week>=SEASON_WEEKS)return pactClose(id,p,true,'No home game left: the promise lapses.');
  if(p.kind==='homewin'&&p.hw&&S.week>=p.hw){const m=(S.matches||[]).find(x=>x.h===id&&x.comp!=='cup');const won=m?m.gh>m.ga:false;return pactClose(id,p,won,won?'The home win came.':'No home win.')}
  if(p.kind==='keep'){const f=findPlayer(p.pid);if(!f||f.club!==id)return pactClose(id,p,false,'He was sold after all.');const through=p.s===S.season&&p.w<=WINTER_WEEK?S.week>WINTER_WEEK+1:S.season>p.s&&S.week>=1;if(through)return pactClose(id,p,true,'He stayed through the window.')}
  if(p.kind==='cash'){const L=F(id).last;if(S.week%4===0){p.bad=(p.bad||0)+(L&&L.net<0?1:0);if(p.bad>1)return pactClose(id,p,false,'Two loss-making months.')}if(S.week>=SEASON_WEEKS)return pactClose(id,p,true,'The books held.')}
  if(p.kind==='apps'){const f=findPlayer(p.pid);if(!f||f.club!==id)return pactClose(id,p,false,'He left the club.');const a=(f.p.sApps||0)-(p.apps0||0);if(a>=p.need)return pactClose(id,p,true,`${a} games since the new deal.`);if(S.week>=SEASON_WEEKS)return pactClose(id,p,false,`Only ${a} games since the new deal.`)}
  if(p.kind==='sellwinter'){const f=findPlayer(p.pid);if(!f||f.club!==id)return pactClose(id,p,true,'He was sold.');if(S.week>WINTER_WEEK+1)return pactClose(id,p,false,'Nobody bought him in the winter.')}
  if(p.kind==='finish'&&S.week>=SEASON_WEEKS){const ok=posOf(id)<=p.pos;book(id,'sponsors',ok?p.bonus:-p.penalty);return pactClose(id,p,ok,ok?`Finished ${ord(posOf(id))}: £${p.bonus}k bonus.`:`Finished ${ord(posOf(id))}: £${p.penalty}k less.`)}
  if(p.kind==='nosale'){const sold=(S.mb||[]).some(r=>r.so===S.season&&r.out>0&&r.qOut>=squadQuality(S.squads[id])-1&&(S.week>=WINTER_WEEK));if(sold)return pactClose(id,p,false,'A first-team player was sold.');if(S.week>WINTER_WEEK+2)return pactClose(id,p,true,'Nobody left in the winter.')}
}
onWeek(momentsWeek);
/* the summer window honours or breaks a promised move: called from club/window.js */
function pactRelease(pid,accepted){const p=pactsOpen().find(x=>x.kind==='release'&&x.pid===pid);if(p)pactClose(S.my,p,accepted,accepted?'You let him go, as promised.':'You refused the bid you promised to accept.')}
function pactReleasePid(){const p=pactsOpen().find(x=>x.kind==='release');return p?p.pid:null}
