#!/usr/bin/env python3
"""Keeps the generated parts of OVERZICHT.md honest, and can dump the same data for the overview artifact.

Usage:
  node tools/codemap.js            # refresh CODEMAP.md first
  python3 tools/overview.py        # rewrite the generated blocks in OVERZICHT.md
  python3 tools/overview.py --json out.json   # also write the structured data (hooks, modules, state)
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CODEMAP = (ROOT / 'CODEMAP.md').read_text(encoding='utf-8')
DOC = ROOT / 'OVERZICHT.md'

# What each hook means, from where the engine calls it. Hooks not listed here show "zie de aanroep".
MEANING = {
    'effBonus': 'extra effectiviteit van een staflid (afdelingsperks, desk)',
    'coachAct': 'wat de coach echt doet (kan afwijken van je mandaat)',
    'selBonus': 'extra score in de elftalselectie (voorkeuren van de coach, pathway)',
    'ftExtra': 'extra teamsterkte in punten (pushes, analist, voorseizoen, step-up straf, turnaround)',
    'ftInj': 'factor op de blessurekans',
    'ftDev': 'extra bij de ontwikkeling van spelers',
    'ftCost': 'wekelijkse kosten van het eerste elftal (afdeling)',
    'homeEdge': 'thuisvoordeel in de wedstrijd (stadion, sfeer)',
    'oppStyle': 'stijl van de tegenstander (volume en kwaliteit van kansen)',
    'say': 'commentaartekst tijdens de wedstrijd',
    'storyW': 'gewicht van verhalen over eigen spelers in de wedstrijd',
    'attendance': 'opkomst per thuiswedstrijd (commercial)',
    'gate': 'recette per thuiswedstrijd',
    'merchMult': 'factor op merchandise-inkomsten',
    'costDisc': 'korting of toeslag op kosten (finance)',
    'deptCost': 'wekelijkse kosten per afdeling',
    'fanWeekly': 'wekelijkse update van de fanbase (marketingtrechter)',
    'acadInit': 'start de academie bij een nieuw spel', 'acadMigrate': 'migratie van academiestate bij een oude save',
    'acadWeekly': 'wekelijkse academie (ontwikkeling, welzijn, competitie)', 'acadIntake': 'jaarlijkse instroom van de academie (week 28)',
    'acadSeason': 'academie aan het seizoenseinde', 'acadIncome': 'inkomsten van de academie', 'acadCost': 'kosten van de academie', 'acadSale': 'verkoop van een academiespeler',
    'recWeekly': 'wekelijkse scouting en DoF-pipeline', 'recCost': 'scoutingkosten', 'recSeason': 'recruitment aan het seizoenseinde', 'recMigrate': 'migratie van recruitment-state',
    'seasonAfterMatch': 'na elke eigen wedstrijd (veel modules: tevredenheid, doelen, gesprekken, verhaallijnen)',
    'seasonWeekly': 'eenmaal per week aan het einde van de weeklus, voor de nieuwe berichten',
    'edition': 'bouwt de Gazette-editie van de week', 'summerStart': 'start van de zomer (ketting: season, summer, summer2)', 'sumMigrate': 'migratie van de zomerstate',
    'objMet': 'beoordeelt extra bestuursdoelen aan het seizoenseinde', 'seasonReprieve': 'één laatste kans als het bestuursvertrouwen op nul staat',
    'lastChance': 'laatste kans bij een vertrouwensstemming', 'evWeight': 'gewicht van een gebeurtenis bij het trekken van berichten (situatie)',
    'desk': 'de afdeling beslist routinezaken zelf binnen de bevoegdheid', 'deskBriefs': 'het bureau voegt korte briefings toe',
}

def parse():
    rows = []
    gen = CODEMAP.split('<!-- generated:start -->')[1].split('<!-- generated:end -->')[0]
    for line in gen.splitlines():
        if not line.startswith('| `'):
            continue
        c = [x.strip() for x in line.strip().strip('|').split('|')]
        if len(c) < 6:
            continue
        rows.append({'file': c[0].strip('`'), 'kb': int(re.sub(r'\D', '', c[1]) or 0), 'purpose': c[2],
                     'sets': [x.strip() for x in c[3].split(',') if x.strip()], 'calls': [x.strip() for x in c[4].split(',') if x.strip()],
                     'state': [x.strip() for x in c[5].split(',') if x.strip()]})
    return rows

def hooks(rows):
    H = {}
    for r in rows:
        for h in r['sets']: H.setdefault(h, {'set': [], 'call': []})['set'].append(r['file'])
        for h in r['calls']: H.setdefault(h, {'set': [], 'call': []})['call'].append(r['file'])
    return H

def block(name, text):
    return f'<!-- generated:{name}:start -->\n{text}\n<!-- generated:{name}:end -->'

def render_hooks(H):
    out = ['| Hook | Wat het doet | Gezet door (modules) | Aangeroepen door (engine) |', '|---|---|---|---|']
    for h in sorted(H, key=lambda k: (-len(H[k]['set']), k)):
        out.append(f"| `{h}` | {MEANING.get(h, 'zie de aanroep')} | {', '.join('`'+x+'`' for x in H[h]['set']) or '–'} | {', '.join('`'+x+'`' for x in H[h]['call']) or '–'} |")
    return '\n'.join(out)

def render_state(rows):
    out = ['| Bestand | Schrijft in `G` |', '|---|---|']
    for r in rows:
        if r['state']:
            out.append(f"| `{r['file']}` | {', '.join('`'+s+'`' for s in r['state'])} |")
    return '\n'.join(out)

def render_files(rows):
    tot = sum(r['kb'] for r in rows)
    out = [f"{len(rows)} bronbestanden, samen ongeveer {tot} KB.", '', '| Bestand | KB | Doel |', '|---|---|---|']
    for r in rows:
        out.append(f"| `{r['file']}` | {r['kb']} | {r['purpose'][:110].rstrip()} |")
    return '\n'.join(out)

def main():
    rows = parse(); H = hooks(rows)
    if '--json' in sys.argv:
        path = sys.argv[sys.argv.index('--json') + 1]
        pathlib.Path(path).write_text(json.dumps({'modules': rows, 'hooks': {k: {**v, 'meaning': MEANING.get(k, '')} for k, v in H.items()}}, ensure_ascii=False), encoding='utf-8')
        print('data written', path, len(rows), 'modules', len(H), 'hooks')
    if DOC.exists():
        s = DOC.read_text(encoding='utf-8')
        for name, text in [('hooks', render_hooks(H)), ('state', render_state(rows)), ('files', render_files(rows))]:
            pat = re.compile(rf'<!-- generated:{name}:start -->.*?<!-- generated:{name}:end -->', re.S)
            if pat.search(s): s = pat.sub(lambda m: block(name, text), s)
        DOC.write_text(s, encoding='utf-8'); print('OVERZICHT.md refreshed')

if __name__ == '__main__':
    main()
