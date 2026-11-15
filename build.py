import pathlib
s=pathlib.Path('src'); t=(s/'index.html').read_text(encoding='utf-8')
js='\n'.join((s/f).read_text(encoding='utf-8') for f in ['engine.js','events.js','events2.js','briefs.js','academy.js','academy2.js','recruit.js','summer.js','season.js','summer2.js','faces.js','firstteam.js','depts.js','levers.js','commercial.js','marketing.js','business.js','academy3.js','recruitx.js','matchtalk.js','desk.js','loop.js','dossiers.js','pathway.js','matchday.js','ui.js'])
t=t.replace('/*CSS*/',(s/'style.css').read_text(encoding='utf-8')).replace('/*JS*/',js)
pathlib.Path('dist').mkdir(exist_ok=True)
pathlib.Path('dist/index.html').write_text(t, encoding='utf-8'); print(len(t))
