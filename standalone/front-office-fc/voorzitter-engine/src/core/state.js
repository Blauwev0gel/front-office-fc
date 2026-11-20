// Toestand van de always-on laag. Elke laag bezit alleen zijn eigen tak (regel 1 lagenmodel).
const VERSION=1;
function newState(seed){
  const S={v:VERSION,rs:(seed>>>0)||1,week:1,season:1,
    sig:{},          // signalen van deze week: 'laag.naam' -> waarde (regel 2: lagen praten alleen zo)
    log:[],          // clubboek: {season,week,layer,text}
    l1:{plots:Array.from({length:PLOTS},(_,i)=>({id:i,state:'empty',building:null})),
        buildings:{},// id -> {id,type,plot,level,condition,upkeep}
        departments:{},
        projects:[], // {id,type,plot,phase:'permit'|'build'|'handover',weeksLeft,cost,spent}
        nextId:1},
    l2:{cash:0,debt:0,creditLine:0,rate:0,
        prices:{terrace:0,seated:0,business:0,seasonTicket:0},
        sponsors:[],offers:[],
        pots:Object.fromEntries(POTS.map(p=>[p,0])),
        covenants:[],health:'healthy',
        ledger:[],   // per week: {season,week,in:{},out:{},cash}
        forecast:[]}
  };
  for(const k in DEPARTMENTS)S.l1.departments[k]={budget:'normal',course:DEPARTMENTS[k].courses[0],pendingCourse:null,settleWeeks:0};
  return S;
}
function save(S){return JSON.stringify(S)}
function load(str){
  const S=JSON.parse(str);
  if(!S||typeof S!=='object')return null;
  // migraties komen hier zodra VERSION omhoog gaat
  if(S.v!==VERSION)S.v=VERSION;
  return S;
}
