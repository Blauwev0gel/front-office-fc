/* ================= Club foundation: players and the squad =================
   This layer knows nothing about the chairman. It reads core and world only.
   Positions, neighbouring positions and the minimum per position come from claude-game (engine/03-players.js). */
const POS=['GK','CB','FB','DM','CM','AM','W','ST'];
const POS_L={GK:'Goalkeepers',CB:'Centre-backs',FB:'Full-backs',DM:'Holding midfield',CM:'Central midfield',AM:'Attacking midfield',W:'Wingers',ST:'Strikers'};
const POS_ONE={GK:'goalkeeper',CB:'centre-back',FB:'full-back',DM:'holding midfielder',CM:'central midfielder',AM:'attacking midfielder',W:'winger',ST:'striker'};
const NEAR={GK:[],CB:['FB','DM'],FB:['CB','W'],DM:['CM','CB'],CM:['DM','AM'],AM:['CM','W','ST'],W:['AM','FB','ST'],ST:['W','AM']};
const REQ={GK:2,CB:4,FB:3,DM:2,CM:3,AM:2,W:3,ST:3};
const XI_SLOTS=['GK','FB','CB','CB','FB','DM','CM','AM','W','ST','W'];
const PTRAITS=['leader','professional','temperamental','injury-prone','local hero','quiet'];
const PFIRST=['Kyle','Bradley','Ryan','Nathan','Mo','Femi','Josh','Connor','Jamie','Callum','Kieran','Liam','Marcus','Jordan','Sam','Tyler','Ellis','Dean','Reece','Harvey','Aaron','Lewis','Theo','Ollie','Kofi','Jakub','Matty','Ethan','Joe','Danny','Brandon','Cian','Ruben','Isaac','Noah','Alfie','Zach','Billy','Jay','Ashley'];
const PLAST=['Agyeman','Rowntree','Whitlock','Dunleavy','Corrigan','Sefton','Pickles','Fairclough','Ashworth','Barraclough','Cawthorne','Dearden','Entwistle','Fenton','Greenhalgh','Hepworth','Illingworth','Jowett','Kershaw','Lockwood','Midgley','Nolan','Ormerod','Priestley','Ramsden','Sutcliffe','Thackeray','Uttley','Varley','Waddington','Yeadon','Okonjo','Mensah','Kowalczyk','Brannigan','Hussain','Achterberg','Doherty','Lomax','Tetley'];
function pname(){const used=new Set((S.cf&&S.cf.squad||[]).map(p=>p.name));for(let i=0;i<20;i++){const n=`${pick(PFIRST)} ${pick(PLAST)}`;if(!used.has(n))return n}return `${pick(PFIRST)} ${pick(PLAST)}`}
function wageFor(q){return Math.round((200+(q-8)*95)/10)*10}
function newPlayer(pos,o={}){
  const age=o.age??ri(18,33),q=o.q??Math.round((9+rnd()*5)*10)/10;
  const head=age<=19?1.5+rnd()*4:age<=22?rnd()*2.5:age<=24?rnd():0;
  return{id:'pl'+(S.pc++),name:o.name||pname(),pos,age,q,pa:Math.round((q+head)*10)/10,contract:o.contract??ri(1,3),
    wage:Math.round(wageFor(q)*(0.85+rnd()*.3)/10)*10,form:ri(55,75),inj:0,trait:o.trait||pick(PTRAITS),academy:!!o.academy,loan:false,apps:0,goals:0,joined:S.season};
}
function playerValue(p){return Math.max(1,Math.round((p.q-7)*(p.q-7)*1.6*(p.age<=21?1.6:p.age<=25?1.3:p.age<=29?1:p.age<=31?.6:.35)*(1+Math.max(0,p.pa-p.q)*.12)))}
function qWord(q){return q<9?'Poor':q<10.5?'Squad player':q<12?'Solid':q<13.5?'Key player':'Star'}
function phaseWord(p){return p.age<=23&&p.pa>p.q+1?'rising':p.age>=31?'fading':'at their peak'}
function genSquad(clubStr){
  // A club's squad matches its strength: str 50 ~ average quality 11.5
  const base=11.5+(clubStr-50)/4,sq=[];
  for(const pos of POS)for(let i=0;i<REQ[pos];i++)sq.push(newPlayer(pos,{q:Math.round((base-1.2+rnd()*2.6)*10)/10}));
  // the dice leave real holes: one position short, two academy kids, one extra midfielder
  const short=pick(['FB','CB','W','DM']);sq.splice(sq.findIndex(p=>p.pos===short),1);
  sq.push(newPlayer(pick(['CM','ST','W']),{q:Math.round((base-.8+rnd()*1.6)*10)/10}));
  sq.push(newPlayer(pick(['ST','W','CM']),{age:ri(17,18),q:Math.round((base-3+rnd())*10)/10,academy:true,contract:2}));
  sq.push(newPlayer(pick(['CB','FB','AM']),{age:ri(17,18),q:Math.round((base-3+rnd())*10)/10,academy:true,contract:2}));
  return sq;
}
function fitFor(p,slot){return p.pos===slot?1:NEAR[p.pos].includes(slot)?.85:(slot==='GK'||p.pos==='GK')?.3:.6}
function available(sq){return sq.filter(p=>p.inj<=0&&!p.loan)}
function pickXI(sq,youthBias){
  const av=available(sq),xi=[];
  const score=p=>p.q+(p.form-65)/40+(youthBias&&p.age<=21?youthBias*.9:0);
  for(const slot of XI_SLOTS){let b=null,bv=-99;for(const p of av){if(xi.some(x=>x.p===p))continue;const v=score(p)*fitFor(p,slot);if(v>bv){bv=v;b=p}}if(b)xi.push({p:b,slot})}
  return xi;
}
function squadQuality(sq,youthBias){const xi=pickXI(sq,youthBias);if(!xi.length)return 8;return xi.reduce((a,x)=>a+x.p.q*fitFor(x.p,x.slot),0)/11-(11-xi.length)*.6}
function qualityToStr(q){return 50+(q-11.5)*4}
function squadGaps(sq){
  const out=[];
  for(const pos of POS){const n=available(sq).filter(p=>p.pos===pos).length;if(n<REQ[pos])out.push({pos,kind:'short',text:`Only ${n} fit ${POS_ONE[pos]}${n===1?'':'s'}; we need ${REQ[pos]}`})}
  const xi=pickXI(sq,0);for(const x of xi)if(x.p.pos!==x.slot)out.push({pos:x.slot,kind:'oop',text:`${x.p.name} plays ${POS_ONE[x.slot]} out of position`});
  for(const p of sq)if(p.contract===1&&!p.loan&&p.q>=11)out.push({pos:p.pos,kind:'contract',text:`${p.name}'s contract ends in June`});
  return out;
}
