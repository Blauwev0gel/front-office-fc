// Rewrites the generated part of CODEMAP.md: per source file its purpose, size, hooks, functions and state keys.
// Run after moving code: node tools/codemap.js
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '../src');
const ORDER = fs.readFileSync(path.join(__dirname, '../build.py'), 'utf8').match(/\['engine\.js'[^\]]*\]/)[0].match(/'[^']+'/g).map(s => s.slice(1, -1));
const files = [];
for (const name of ORDER) {
  const f = path.join(SRC, name);
  if (fs.existsSync(f)) files.push(name);
  else { const d = name.replace(/\.js$/, ''); for (const p of fs.readdirSync(path.join(SRC, d)).sort()) files.push(d + '/' + p); }
}
const uniq = a => [...new Set(a)];
const kb = n => (n / 1024).toFixed(0) + ' KB';
const out = ['| File | Size | Purpose | Hooks set | Hooks called | State `G.*` written |', '|---|---|---|---|---|---|'];
const detail = [];
for (const name of files) {
  const s = fs.readFileSync(path.join(SRC, name), 'utf8');
  const head = (s.match(/\/\*([\s\S]*?)\*\//) || ['', ''])[1].replace(/\s+/g, ' ').replace(/^ ?The Front Office · ?/, '').trim();
  const sect = uniq([...s.matchAll(/\/\* -{3,} (.+?) -{3,} \*\//g)].map(m => m[1])).join('; ');
  const purpose = (name.includes('/') ? sect : head.split('. ')[0]).slice(0, 110);
  const set = uniq([...s.matchAll(/\b(?:H|HOOK)\.([a-zA-Z]+)\s*=(?!=)/g)].map(m => m[1]));
  const called = uniq([...s.matchAll(/\b(?:H|HOOK)\.([a-zA-Z]+)\s*\(/g)].map(m => m[1])).filter(x => !set.includes(x));
  const state = uniq([...s.matchAll(/\b(?:G|g\(\))\.([a-zA-Z]+)\s*(?:=(?!=)|\|\|=)/g)].map(m => m[1]));
  out.push(`| \`${name}\` | ${kb(s.length)} | ${purpose.replace(/\|/g, '/')} | ${set.join(', ')} | ${called.join(', ')} | ${state.join(', ')} |`);
  const fns = uniq([...s.matchAll(/^(?:function\s+([A-Za-z_$][\w$]*)|const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\([^)]*\)|[a-z]\w*)\s*=>)/gm)].map(m => m[1] || m[2]));
  const ex = uniq([...s.matchAll(/\bF\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)].map(m => m[1]).concat(...[...s.matchAll(/Object\.assign\(F, \{([^}]*)\}/g)].map(m => m[1].split(',').map(x => x.split(':')[0].trim()).filter(Boolean))));
  detail.push(`### \`${name}\`\n- Functions: ${fns.join(', ') || '—'}\n` + (ex.length ? `- Exports on \`F\`: ${ex.join(', ')}\n` : ''));
}
const gen = out.join('\n') + '\n\n## Functions per file\n\n' + detail.join('\n');
const mapFile = path.join(__dirname, '../CODEMAP.md'), map = fs.readFileSync(mapFile, 'utf8');
const A = '<!-- generated:start -->', B = '<!-- generated:end -->';
fs.writeFileSync(mapFile, map.slice(0, map.indexOf(A) + A.length) + '\n' + gen + '\n' + map.slice(map.indexOf(B)));
console.log('CODEMAP.md updated');
