"""Computes the pre-registered metrics from results/*.jsonl and writes results/metrics.json + results/metrics.md"""
import json, math, random, statistics as st
from collections import Counter, defaultdict
import sim

MODELS = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7']
NAMES = {'M0': 'Placebo', 'M1': 'Kaartloop (SPELLOOP v1.0)', 'M2': 'Mandaat & delegatie', 'M3': 'Crisisgedreven',
         'M4': 'Projecten & aandacht', 'M5': 'Wedstrijdgericht', 'M6': 'Escalatie (hybride)', 'M7': 'Delegatie + crisismomenten (achteraf)'}
FOOT = sim.FOOTBALL_CATS

runs = [json.loads(l) for l in open('results/runs.jsonl')]
cfs_all = [json.loads(l) for l in open('results/counterfactuals.jsonl')]
cfs = [x for x in cfs_all if x.get('tag', 'base') == 'base']

def sel(tag='base', m=None, p=None):
    return [r for r in runs if r['tag'] == tag and (m is None or r['model'] == m) and (p is None or r['policy'] == p)]

def mean(xs): xs = [x for x in xs if x is not None]; return sum(xs) / len(xs) if xs else float('nan')

def spearman(a, b):
    if len(a) < 5: return float('nan')
    ra = {i: r for r, i in enumerate(sorted(range(len(a)), key=lambda i: a[i]))}
    rb = {i: r for r, i in enumerate(sorted(range(len(b)), key=lambda i: b[i]))}
    x = [ra[i] for i in range(len(a))]; y = [rb[i] for i in range(len(b))]
    mx, my = mean(x), mean(y)
    num = sum((p - mx) * (q - my) for p, q in zip(x, y)); den = math.sqrt(sum((p - mx) ** 2 for p in x) * sum((q - my) ** 2 for q in y))
    return num / den if den else float('nan')

def entropy(c):
    t = sum(c.values()); return -sum(v / t * math.log2(v / t) for v in c.values() if v) if t else 0.0

def surv(m, p, tag='base'): rs = sel(tag, m, p); return mean([r['alive'] for r in rs])
def seas(m, p, tag='base'): rs = sel(tag, m, p); return mean([r['seasons_survived'] for r in rs])

def bucket(h):
    if len(h) < 10: return 'short'
    a, lo, z = h[0], min(h), h[-1]
    return ('up' if z > a + 3 else 'down' if z < a - 3 else 'flat') + ('-dip' if lo < a - 6 else '')

M = {}
for m in MODELS:
    d = {}
    for p in ('passive', 'random', 'fan', 'greedy_visible', 'informed', 'fixed1'):
        d[f'surv_{p}'] = surv(m, p); d[f'seasons_{p}'] = seas(m, p)
    d['skill_gap'] = d['surv_informed'] - d['surv_random']
    d['skill_gap_visible'] = d['surv_greedy_visible'] - d['surv_random']
    d['depth'] = d['surv_informed'] - d['surv_greedy_visible']
    d['dominant_ratio'] = max(d['surv_passive'], d['surv_fixed1']) / d['surv_informed'] if d['surv_informed'] > 0 else float('nan')
    c = [x for x in cfs if x['model'] == m]
    d['n_cf'] = len(c)
    d['impact_4w'] = mean([abs(x['d_support_4w']) for x in c])
    d['impact_season'] = mean([abs(x['d_support_end']) for x in c])
    d['impact_points'] = mean([abs(x['d_points_end']) for x in c])
    d['impact_horizon'] = mean([abs(x['d_seasons_survived']) for x in c])
    d['flip_rate'] = mean([x['flip_alive'] for x in c])
    d['persistence'] = d['impact_season'] / d['impact_4w'] if d['impact_4w'] > 1e-9 else float('nan')
    vv = [(x['vis_delta'], x['d_support_end']) for x in c if x['vis_delta'] is not None]
    d['readability'] = spearman([a for a, _ in vv], [b for _, b in vv]) if len(vv) >= 5 else float('nan')
    d['n_readability'] = len(vv)
    foot = [x for x in c if x['cat'] in FOOT]
    d['impact_points_football'] = mean([abs(x['d_points_end']) for x in foot])
    base = sel('base', m, None)
    act = [r for r in base if r['policy'] in ('greedy_visible', 'informed', 'fan')]
    seasons_all = [s for r in act for s in r['seasons']]
    d['tension'] = mean([(s['smin'] < 52 or s['cmin'] < 0 or abs(s['agm'] - 50) < 6) for s in seasons_all])
    d['close_agm'] = mean([abs(s['agm'] - 50) < 6 for s in seasons_all])
    cats = Counter(c_ for r in act for c_ in r['decision_cats'] if c_ not in ('club', 'project') or True)
    real = Counter({k: v for k, v in cats.items()})
    d['decision_entropy'] = entropy(real)
    tot_seasons = sum(len(r['seasons']) for r in act) or 1
    d['decisions_per_season'] = sum(r['n_decisions'] for r in act) / tot_seasons
    fc = sum(v for k, v in real.items() if k in FOOT); d['football_share'] = fc / sum(real.values()) if real else 0
    traj = Counter(bucket(r['hist'][i * 30:(i + 1) * 30]) for r in act for i in range(len(r['seasons'])))
    d['trajectory_entropy'] = entropy(traj)
    ch = sum(r['counts'].get('resolved_chairman', 0) for r in act); stf = sum(r['counts'].get('resolved_staff', 0) for r in act)
    d['staff_share'] = stf / (ch + stf) if ch + stf else 0
    pas = [s for r in sel('base', m, 'passive') + sel('base', m, 'greedy_visible') for s in r['seasons']]
    d['staff_quality_corr'] = spearman([(s['coach_q'] + s['td_eye'] + s['fin_comp']) for s in pas], [s['agm'] for s in pas])
    staffdec = [x for x in c if x['cat'] in ('coach', 'staff') or x['kind'] in ('token', 'report')]
    d['impact_staff_decisions'] = mean([abs(x['d_support_end']) for x in staffdec]) if staffdec else float('nan')
    # time per season (seconds): decisions, matches watched, weekly overhead, monthly reports
    secs = 0.0; n = 0
    for r in act:
        for k in r['decision_kinds']: secs += sim.TIME.get(k, 5)
        watch = {'M1': 30 * 20, 'M0': 30 * 20, 'M5': 30 * 20, 'M6': 12 * 20}.get(m, 30 * 3)
        reports = {'M2': 7 * 15, 'M6': 7 * 15, 'M7': 7 * 15}.get(m, 0)
        secs += (watch + 30 * 4 + reports) * len(r['seasons']); n += len(r['seasons'])
    d['minutes_per_season'] = secs / 60 / max(1, n)
    M[m] = d

# ----- robustness: random weights over desirability scores (models M1-M6) -----
def desir(d):
    band = lambda x, lo, hi, w: 1.0 if lo <= x <= hi else max(0.0, 1 - min(abs(x - lo), abs(x - hi)) / w)
    return {
        'skill': clamp01(d['skill_gap'] / .6),
        'not_solved': band(d['surv_informed'], .5, .9, .3),
        'impact': clamp01(d['impact_season'] / 4),
        'long_term': clamp01(d['impact_horizon'] / .5),
        'readability': clamp01((d['readability'] if d['readability'] == d['readability'] else 0) / .6),
        'depth': band(d['depth'], .05, .3, .2),
        'no_dominant': clamp01(1 - d['dominant_ratio']),
        'tension': band(d['tension'], .35, .7, .3),
        'variety': clamp01((d['decision_entropy'] / 3 + d['trajectory_entropy'] / 2.5) / 2),
        'football': clamp01(d['football_share'] / .7),
        'autonomy': clamp01((d['staff_share'] + max(0, d['staff_quality_corr'] if d['staff_quality_corr'] == d['staff_quality_corr'] else 0)) / 1.3),
        'time': band(d['minutes_per_season'], 8, 30, 20),
    }
def clamp01(x): return max(0.0, min(1.0, x))

D = {m: desir(M[m]) for m in MODELS}
keys = list(D['M1'])
rr = random.Random(7); wins = Counter(); top2 = Counter()
for _ in range(10000):
    w = [rr.expovariate(1) for _ in keys]
    sc = {m: sum(wi * D[m][k] for wi, k in zip(w, keys)) for m in MODELS if m != 'M0'}
    order = sorted(sc, key=lambda m: -sc[m]); wins[order[0]] += 1; top2[order[0]] += 1; top2[order[1]] += 1
equal = {m: mean([D[m][k] for k in keys]) for m in MODELS}

# ----- sensitivity: does the survival-skill ranking hold across parameter variants? -----
tags = sorted(set(r['tag'] for r in runs) - {'base'})
sens = {}
for t in tags:
    sens[t] = {m: {'skill_gap': surv(m, 'informed', t) - surv(m, 'random', t), 'surv_informed': surv(m, 'informed', t),
                   'surv_passive': surv(m, 'passive', t), 'surv_greedy_visible': surv(m, 'greedy_visible', t)} for m in MODELS}
# equal-weight desirability is base-only (counterfactuals are base-only); report skill rank stability
rank_base = sorted([m for m in MODELS if m != 'M0'], key=lambda m: -M[m]['skill_gap'])

json.dump({'metrics': M, 'desirability': D, 'wins': wins, 'top2': top2, 'equal_weight': equal, 'sensitivity': sens,
           'rank_skill_base': rank_base}, open('results/metrics.json', 'w'), indent=1, default=float)

def f(x, n=2):
    return '–' if x is None or x != x else (f'{x:.{n}f}')
L = []
L.append('| Meting | ' + ' | '.join(MODELS) + ' |'); L.append('|---|' + '---|' * len(MODELS))
rows = [('Overleving passief', 'surv_passive'), ('Overleving willekeurig', 'surv_random'), ('Overleving fan', 'surv_fan'),
        ('Overleving optimalisator (zichtbaar)', 'surv_greedy_visible'), ('Overleving optimalisator (alwetend)', 'surv_informed'),
        ('Overleving vaste regel (optie 1)', 'surv_fixed1'),
        ('Speelvaardigheid (alwetend − willekeurig)', 'skill_gap'), ('Diepte (alwetend − zichtbaar)', 'depth'),
        ('Dominante-strategie-ratio', 'dominant_ratio'),
        ('Impact per keuze, +4 weken (|Δ steun|)', 'impact_4w'), ('Impact per keuze, einde seizoen', 'impact_season'),
        ('Impact per keuze, punten', 'impact_points'), ('Impact per keuze, horizon (Δ seizoenen)', 'impact_horizon'),
        ('Kans dat één keuze overleving omslaat', 'flip_rate'), ('Persistentie (seizoen / 4 weken)', 'persistence'),
        ('Leesbaarheid (Spearman zichtbaar ↔ echt)', 'readability'),
        ('Spanning (seizoenen met bijna-mislukking)', 'tension'), ('Krappe ALV (±6)', 'close_agm'),
        ('Beslissingen per seizoen', 'decisions_per_season'), ('Entropie beslissingssoorten', 'decision_entropy'),
        ('Entropie steunverloop', 'trajectory_entropy'), ('Aandeel voetbalbeslissingen', 'football_share'),
        ('Impact voetbalbeslissingen op punten', 'impact_points_football'),
        ('Aandeel issues door staf opgelost', 'staff_share'), ('Verband stafkwaliteit ↔ ALV', 'staff_quality_corr'),
        ('Impact stafbeslissingen voorzitter', 'impact_staff_decisions'), ('Minuten per seizoen (schatting)', 'minutes_per_season')]
for lab, k in rows: L.append(f'| {lab} | ' + ' | '.join(f(M[m][k]) for m in MODELS) + ' |')
L.append(''); L.append('| Robuustheid | ' + ' | '.join(m for m in MODELS if m != 'M0') + ' |'); L.append('|---|' + '---|' * (len(MODELS) - 1))
L.append('| Winst in 10.000 willekeurige wegingen | ' + ' | '.join(f'{wins[m] / 100:.1f}%' for m in MODELS if m != 'M0') + ' |')
L.append('| Top-2 in 10.000 wegingen | ' + ' | '.join(f'{top2[m] / 100:.1f}%' for m in MODELS if m != 'M0') + ' |')
L.append('| Gelijke weging (gem. wenselijkheid) | ' + ' | '.join(f(equal[m]) for m in MODELS if m != 'M0') + ' |')
L.append(''); L.append('Wenselijkheid per criterium (0–1):'); L.append('')
L.append('| Criterium | ' + ' | '.join(m for m in MODELS if m != 'M0') + ' |'); L.append('|---|' + '---|' * (len(MODELS) - 1))
for k in keys: L.append(f'| {k} | ' + ' | '.join(f(D[m][k]) for m in MODELS if m != 'M0') + ' |')
L.append(''); L.append('Gevoeligheid: speelvaardigheid (alwetend − willekeurig) per parametervariant:'); L.append('')
L.append('| Variant | ' + ' | '.join(MODELS) + ' |'); L.append('|---|' + '---|' * len(MODELS))
for t in tags: L.append(f'| {t} | ' + ' | '.join(f(sens[t][m]['skill_gap']) for m in MODELS) + ' |')
L.append(''); L.append('Gevoeligheid: overleving alwetende optimalisator per variant:'); L.append('')
L.append('| Variant | ' + ' | '.join(MODELS) + ' |'); L.append('|---|' + '---|' * len(MODELS))
for t in tags: L.append(f'| {t} | ' + ' | '.join(f(sens[t][m]['surv_informed']) for m in MODELS) + ' |')
open('results/metrics.md', 'w').write('\n'.join(L) + '\n')
print('\n'.join(L))

# ----- impact by decision kind (base counterfactuals) and by model-knob variant -----
K = ['## Impact per soort beslissing (counterfactual, basis)', '', '| Model | Soort | n | Δ steun einde seizoen | Δ punten | Δ seizoenen overleefd |', '|---|---|---|---|---|---|']
for m in MODELS:
    kinds = sorted(set(x['kind'] for x in cfs if x['model'] == m))
    for k in kinds:
        xs = [x for x in cfs if x['model'] == m and x['kind'] == k]
        K.append(f"| {m} | {k} | {len(xs)} | {f(mean([abs(x['d_support_end']) for x in xs]))} | {f(mean([abs(x['d_points_end']) for x in xs]))} | {f(mean([abs(x['d_seasons_survived']) for x in xs]), 3)} |")
K += ['', '## Impact per keuze bij modelvarianten', '', '| Variant | Model | n | Δ steun einde seizoen | Δ seizoenen | omslag overleving |', '|---|---|---|---|---|---|']
for t in sorted(set(x.get('tag', 'base') for x in cfs_all)):
    for m in MODELS:
        xs = [x for x in cfs_all if x.get('tag', 'base') == t and x['model'] == m]
        if xs and (t != 'base' or m in ('M1', 'M2', 'M3', 'M6', 'M7')):
            K.append(f"| {t} | {m} | {len(xs)} | {f(mean([abs(x['d_support_end']) for x in xs]))} | {f(mean([abs(x['d_seasons_survived']) for x in xs]), 3)} | {f(mean([x['flip_alive'] for x in xs]), 3)} |")
open('results/metrics.md', 'a').write('\n' + '\n'.join(K) + '\n')
print('\n'.join(K))
