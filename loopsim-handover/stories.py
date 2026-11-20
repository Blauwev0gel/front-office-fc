"""Writes one season per model as a readable log: what the chairman decided, what the staff did, what happened on the pitch.
Usage: python3 stories.py > results/stories.md"""
import sim
SEED, POL = 1259, 'greedy_visible'
MODELS = ['M1', 'M2', 'M3', 'M6', 'M7']
NAMES = {'M1': 'Kaartloop (SPELLOOP v1.0)', 'M2': 'Mandaat & delegatie', 'M3': 'Crisisgedreven', 'M6': 'Escalatie (hybride)', 'M7': 'Delegatie + crisismomenten (achteraf)'}

def season_log(model):
    r = sim.simulate(SEED, model, POL, horizon=1)
    W = sim.new_world(SEED, sim.DEFAULT_PARAMS)
    # rebuild the issue option texts from the log (type, option index, who)
    out = [f'## {model}: {NAMES[model]}', '']
    s = r['seasons'][0]
    out.append(f"Seizoen 1: {s['points']} punten, {sim.position.__name__ and s['pos']}e plaats, ALV {s['agm']:.1f}% ({'herkozen' if s['alive'] else 'weggestemd'}). "
               f"Beslissingen voorzitter: {sum(1 for d in r['decisions'] if d['nopts'] > 1)}; door de staf opgelost: {r['counts'].get('resolved_staff', 0)}.")
    out.append('')
    by_week = {}
    for se, wk, typ, idx, by in r['log']:
        by_week.setdefault(wk, []).append((typ, idx, by))
    texts = {}
    for d in r['decisions']:
        if d['kind'] == 'text': texts[d['week']] = texts.get(d['week'], 0) + 1
    hist = r['hist']
    for wk in range(1, 31):
        ev = by_week.get(wk, [])
        chair = [f"**{t}** → optie {i}" for t, i, b in ev if b == 'chairman']
        staff = [f"{t} → optie {i}" for t, i, b in ev if b == 'staff']
        line = f"- Week {wk:>2}: steun {hist[wk - 1]:.1f}%"
        if chair: line += ' · voorzitter: ' + ', '.join(chair)
        if staff: line += ' · staf: ' + ', '.join(staff)
        if texts.get(wk): line += f" · {texts[wk]} sms aan de trainer"
        out.append(line)
    return '\n'.join(out)

print('# Eén seizoen per model, zelfde wereld (seed %d), zelfde speler (%s)\n' % (SEED, POL))
for m in MODELS: print(season_log(m) + '\n')
