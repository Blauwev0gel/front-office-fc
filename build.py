import pathlib
s=pathlib.Path('src')
def read(name):
    # A module is either src/<name> or a folder src/<stem>/ whose numbered parts are joined in order.
    # The parts are fragments of one file: they are only valid JS/CSS once joined.
    f=s/name
    if f.exists(): return f.read_text(encoding='utf-8')
    stem,ext=name.rsplit('.',1)
    return ''.join(p.read_text(encoding='utf-8') for p in sorted((s/stem).glob('*.'+ext)))
t=(s/'index.html').read_text(encoding='utf-8')
import json
js='\n'.join(read(f) for f in json.load(open(s/'modules.json')))
t=t.replace('/*CSS*/',read('style.css')).replace('/*JS*/',js)
pathlib.Path('dist').mkdir(exist_ok=True)
pathlib.Path('dist/index.html').write_text(t, encoding='utf-8'); print(len(t))
