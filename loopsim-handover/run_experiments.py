"""Runs every experiment and writes raw results. Usage: python3 run_experiments.py [--quick]"""
import json, os, sys, time
from multiprocessing import Pool
import sim

MODELS = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7']
POLICIES = ['passive', 'random', 'fan', 'greedy_visible', 'informed', 'fixed1']
QUICK = '--quick' in sys.argv
N_MAIN = 20 if QUICK else 200
N_CF = 10 if QUICK else 60
N_SENS = 10 if QUICK else 40
OUT = 'results'
SENS = {
    'base': {},
    'issues_x0.7': {'issue_scale': .7}, 'issues_x1.3': {'issue_scale': 1.3},
    'results_x0.6': {'results_weight': .6}, 'results_x1.4': {'results_weight': 1.4},
    'decay_x0.5': {'decay': .15}, 'decay_x1.5': {'decay': .45},
    'staffvar_x0.5': {'staff_var': .5}, 'staffvar_x1.6': {'staff_var': 1.6},
    'texts_x2': {'text_power': 2.0},
    # model-internal knobs: each model also in a weaker and a stronger configuration
    'M1_cards1-2': {'cards_min': 1, 'cards_max': 2}, 'M1_cards3-5': {'cards_min': 3, 'cards_max': 5},
    'M2_tokens1': {'tokens': 1}, 'M2_tokens6': {'tokens': 6},
    'M3_crisis1.0': {'crisis_scale': 1.0}, 'M3_crisis1.4': {'crisis_scale': 1.4},
    'M4_proj0.6': {'proj_gain': .6}, 'M4_proj1.5': {'proj_gain': 1.5},
    'M5_texts2': {'m5_texts': 2},
    'M7_tokens1': {'tokens': 1}, 'M7_tokens6': {'tokens': 6},
    'M6_esc2': {'esc_cap': 2}, 'M6_esc3': {'esc_cap': 3},
}

def summarise(r):
    ss = r['seasons']
    chair = [d for d in r['decisions'] if d['nopts'] > 1]
    return {'seed': r['seed'], 'model': r['model'], 'policy': r['policy'], 'alive': r['alive'], 'reason': r['reason'],
            'seasons_survived': sum(1 for s in ss if s['alive']), 'seasons': ss,
            'n_decisions': len(chair), 'decision_kinds': [d['kind'] for d in chair], 'decision_cats': [d['cat'] for d in chair],
            'counts': r['counts'], 'hist': [round(x, 2) for x in r['hist']]}

def main_job(a):
    seed, m, p, params, tag = a
    s = summarise(sim.simulate(seed, m, p, params)); s['tag'] = tag; return s

def outcome_at(run, se, wk):
    cp = run['checkpoints']
    if (se, wk) in cp: return cp[(se, wk)]
    keys = sorted(cp); prior = [k for k in keys if k <= (se, wk)]
    return cp[prior[-1]] if prior else cp[keys[0]]

def cf_job(a):
    seed, m, p, prm, tag = a
    base = sim.simulate(seed, m, p, prm)
    cands = [d for d in base['decisions'] if d['nopts'] > 1]
    rr = sim.R(seed, 'cfpick', m, p)
    picks = rr.sample(cands, min(4, len(cands))) if cands else []
    out = []
    for d in picks:
        alt = (d['choice'] + 1 + rr.randrange(d['nopts'] - 1)) % d['nopts']
        br = sim.simulate(seed, m, p, prm, forced={d['n']: alt})
        se, wk = d['season'], d['week']
        b4, f4 = outcome_at(base, se, min(wk + 4, 30)), outcome_at(br, se, min(wk + 4, 30))
        be, fe = outcome_at(base, se, 30), outcome_at(br, se, 30)
        bs = next((s for s in base['seasons'] if s['season'] == se), None); fs = next((s for s in br['seasons'] if s['season'] == se), None)
        vis_d = None
        if d.get('vis'): vis_d = d['vis'][alt] - d['vis'][d['choice']] if alt < len(d['vis']) else None
        out.append({'tag': tag, 'seed': seed, 'model': m, 'policy': p, 'kind': d['kind'], 'cat': d['cat'], 'season': se, 'week': wk,
                    'd_support_4w': f4['support'] - b4['support'], 'd_support_end': fe['support'] - be['support'],
                    'd_points_end': fe['points'] - be['points'],
                    'd_agm': (fs['agm'] if fs else 0) - (bs['agm'] if bs else 0) if (fs and bs) else None,
                    'd_seasons_survived': sum(s['alive'] for s in br['seasons']) - sum(s['alive'] for s in base['seasons']),
                    'flip_alive': br['alive'] != base['alive'], 'vis_delta': vis_d})
    return out

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True); t0 = time.time()
    jobs = [(1000 + i * 37, m, p, {}, 'base') for m in MODELS for p in POLICIES for i in range(N_MAIN)]
    for tag, prm in SENS.items():
        if tag == 'base': continue
        jobs += [(5000 + i * 41, m, p, prm, tag) for m in MODELS for p in ('passive', 'random', 'greedy_visible', 'informed') for i in range(N_SENS)]
    cfj = [(1000 + i * 37, m, p, {}, 'base') for m in MODELS for p in ('random', 'greedy_visible', 'fan') for i in range(N_CF)]
    for tag, m in (('M7_tokens1', 'M7'), ('M3_crisis1.0', 'M3'), ('M3_crisis1.4', 'M3'), ('M1_cards1-2', 'M1'), ('M6_esc3', 'M6'), ('M2_tokens6', 'M2')):
        cfj += [(1000 + i * 37, m, p, SENS[tag], tag) for p in ('random', 'greedy_visible', 'fan') for i in range(N_CF)]
    with Pool(os.cpu_count()) as pool:
        main = pool.map(main_job, jobs, chunksize=8)
        cf = [x for xs in pool.map(cf_job, cfj, chunksize=2) for x in xs]
    with open(f'{OUT}/runs.jsonl', 'w') as f:
        for r in main: f.write(json.dumps(r) + '\n')
    with open(f'{OUT}/counterfactuals.jsonl', 'w') as f:
        for r in cf: f.write(json.dumps(r) + '\n')
    print(f'runs {len(main)}  counterfactual branches {len(cf)}  in {time.time() - t0:.0f}s')
