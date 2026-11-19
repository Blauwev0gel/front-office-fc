/* ================= Words ================= */
function band(l){return l==null?'Unknown':l<2?'Broken':l<4?'Distant':l<6?'Businesslike':l<8?'Warm':'Devoted'}
function bandIdx(l){return l<2?0:l<4?1:l<6?2:l<8?3:4}
function moodWord(p){return p<25?'Furious':p<40?'Angry':p<50?'Wary':p<65?'Content':'Thrilled'}
function moneyWord(c){return c>=100?'Comfortable':c>=40?'Tight':c>=0?'Stretched':'In the red'}
function weighted(){return C().groups.reduce((s,g)=>s+g.share/100*g.mood,0)}
function grpOf(k){return C().groups.find(g=>g.k===k)}
