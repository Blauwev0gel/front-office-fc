/* ================= Core: savegames with a schema version and migrations =================
   The whole world is one JSON object S. A save carries S.v; load() runs every migration from that version up to
   VERSION, in order. Rule: no VERSION bump without a migration and a test (tests/save-test.js). */
const MIGRATIONS={
  // 1: first layered schema. Example of the pattern for later versions:
  // 2: s=>{for(const id in s.fin)s.fin[id].newField??=default; s.v=2;}
};
function migrate(s){
  if(!s||typeof s.v!=='number'||s.v<1)throw new Error('Not a Northmarch layered save');
  if(s.v>VERSION)throw new Error('This save comes from a newer version of the game');
  while(s.v<VERSION){const m=MIGRATIONS[s.v+1];if(!m)throw new Error('No migration to version '+(s.v+1));m(s);}
  return s;
}
function serialize(){return JSON.stringify(S)}
function deserialize(txt){S=migrate(JSON.parse(txt));return S}
function save(){if(!HAS_DOM)return false;try{localStorage.setItem(SAVE_KEY,serialize());return true}catch(e){return false}}
function hasSave(){if(!HAS_DOM)return false;try{return!!localStorage.getItem(SAVE_KEY)}catch(e){return false}}
function load(){if(!HAS_DOM)return false;try{const t=localStorage.getItem(SAVE_KEY);if(!t)return false;deserialize(t);return true}catch(e){return false}}
