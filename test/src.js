// Reads a source module the way build.py does: src/<name>.js, or the numbered parts in src/<name>/ joined in order.
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '../src');
module.exports = function read(name) {
  const f = path.join(SRC, name);
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const d = path.join(SRC, name.replace(/\.js$/, ''));
  return fs.readdirSync(d).filter(x => x.endsWith('.js')).sort().map(x => fs.readFileSync(path.join(d, x), 'utf8')).join('');
};
