/* ================= Core: events and commands =================
   Events are facts other layers may read (S.ev, newest last). Commands are the only way a player, an AI club,
   a staff member or (later) the story layer changes the world. Every command validates first, then runs inside
   the domain that owns the state. Contract: docs/ARCHITECTURE.md. */
const EV_KEEP=900;
function emit(type,club,text,data){
  const e={t:type,c:club||null,s:S.season,w:S.week,text:text||'',...(data||{})};
  S.ev.push(e);if(S.ev.length>EV_KEEP)S.ev.splice(0,S.ev.length-EV_KEEP);
  return e;
}
function eventsFor(club,o={}){return S.ev.filter(e=>(!club||e.c===club||(e.c2&&e.c2===club))&&(o.s==null||e.s===o.s)&&(o.w==null||e.w===o.w)&&(!o.types||o.types.includes(e.t)))}

const COMMANDS={}; // name -> {who:[actors], check(club,args)->error|null, run(club,args)->result}
function defCommand(name,def){COMMANDS[name]=def}
/* actor: 'player' | 'ai' | 'td' | 'story'. The player may only command their own club. */
function cmd(name,club,args,actor){
  const d=COMMANDS[name];if(!d)return{ok:false,err:'Unknown command '+name};
  actor=actor||'player';args=args||{};
  if(d.who&&!d.who.includes(actor))return{ok:false,err:`${actor} may not ${name}`};
  if(actor==='player'&&club!==S.my)return{ok:false,err:'Not your club'};
  if(!CL(club))return{ok:false,err:'No such club'};
  const err=d.check?d.check(club,args):null;
  if(err)return{ok:false,err};
  const res=d.run(club,args);
  if(actor==='player')emit('Command',club,'',{cmd:name,args,actor});
  return{ok:true,res};
}
