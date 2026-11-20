"""Checks that the measuring chain measures the game, not itself. Run: python3 test_sim.py"""
import sim
fails = 0
def check(ok, t):
    global fails
    print(('ok   ' if ok else 'FAIL ') + t)
    if not ok: fails += 1

# 1. determinism
a, b = sim.simulate(1037, 'M1', 'greedy_visible'), sim.simulate(1037, 'M1', 'greedy_visible')
check(a['seasons'] == b['seasons'] and a['hist'] == b['hist'], 'same seed, same model, same policy: identical run')
# 2. forcing a decision to the option it already took changes nothing (common random numbers hold)
for m in ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7']:
    base = sim.simulate(1074, m, 'greedy_visible')
    ds = [d for d in base['decisions'] if d['nopts'] > 1]
    if ds:
        d = ds[len(ds) // 2]
        same = sim.simulate(1074, m, 'greedy_visible', forced={d['n']: d['choice']})
        check(same['hist'] == base['hist'], f'{m}: forcing the same choice reproduces the run exactly')
# 3. placebo: no policy can change anything
outs = {p: [s['agm'] for s in sim.simulate(1111, 'M0', p)['seasons']] for p in ('passive', 'random', 'fan', 'greedy_visible', 'informed', 'fixed1')}
check(len({tuple(v) for v in outs.values()}) == 1, 'placebo M0: every policy gets the identical result')
# 4. the world is the same across models before the first decision
w1 = sim.new_world(2020, sim.DEFAULT_PARAMS); w2 = sim.new_world(2020, sim.DEFAULT_PARAMS)
check(w1['groups'] == w2['groups'] and w1['coach'] == w2['coach'], 'the starting world depends only on the seed')
# 5. an option the visible optimiser cannot see (delayed) is valued by the informed one
W = sim.new_world(1, sim.DEFAULT_PARAMS)
opt = {'e': {}, 'delayed': [(4, {'strength': 2}, 1, None)]}
check(sim.opt_value(W, {}, opt, sim.DEFAULT_PARAMS, False) == 0 and sim.opt_value(W, {}, opt, sim.DEFAULT_PARAMS, True) > 0,
      'hidden delayed effects are invisible to the visible optimiser and known to the informed one')
print(f'{fails} failure(s)' if fails else 'all checks passed')
