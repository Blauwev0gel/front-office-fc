#!/usr/bin/env python3
from pathlib import Path
import json
root=Path(__file__).resolve().parent
manifest=json.loads((root/'manifest.json').read_text(encoding='utf-8'))
js=''.join((root/p).read_text(encoding='utf-8') for p in manifest)
html=(root/'src/template.html').read_text(encoding='utf-8').replace('/* NORTHMARCH_CSS */',(root/'src/style.css').read_text(encoding='utf-8')).replace('/* NORTHMARCH_JS */',js)
out=root/'dist/index.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html,encoding='utf-8')
print(f'Northmarch built: {len(html.encode("utf-8"))} bytes')
