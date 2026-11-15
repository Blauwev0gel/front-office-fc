import pathlib
s=pathlib.Path('src'); t=(s/'index.html').read_text()
js='\n'.join((s/f).read_text() for f in ['engine.js','events.js','events2.js','briefs.js','academy.js','academy2.js','recruit.js','summer.js','season.js','summer2.js','faces.js','firstteam.js','depts.js','levers.js','commercial.js','marketing.js','business.js','academy3.js','recruitx.js','matchtalk.js','desk.js','loop.js','dossiers.js','pathway.js','matchday.js','ui.js'])
t=t.replace('/*CSS*/',(s/'style.css').read_text()).replace('/*JS*/',js)
pathlib.Path('dist/index.html').write_text(t); print(len(t))
