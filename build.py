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
js='\n'.join(read(f) for f in ['engine.js','events.js','events2.js','briefs.js','academy.js','academy2.js','recruit.js','summer.js','season.js','summer2.js','faces.js','firstteam.js','depts.js','levers.js','commercial.js','marketing.js','business.js','academy3.js','recruitx.js','matchtalk.js','desk.js','talks.js','loop.js','dossiers.js','pathway.js','matchday.js','ui.js'])
t=t.replace('/*CSS*/',read('style.css')).replace('/*JS*/',js)
pathlib.Path('dist').mkdir(exist_ok=True)
pathlib.Path('dist/index.html').write_text(t, encoding='utf-8'); print(len(t))
