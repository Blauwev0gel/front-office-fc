"""
De Voorzitter: game-loop simulator. One shared football-club world; seven interaction models.
Models differ ONLY in interaction structure (what the chairman sees, when he decides, what happens if he does not).
All randomness is common random numbers keyed by (seed, purpose, season, week, ...), so a counterfactual branch
(one decision changed) shares every other random draw with the original run.
Run: python3 sim.py  (writes results/*.json, results/*.csv)
"""
import hashlib, random, math, json, copy

def R(*keys):
    h = hashlib.blake2b(repr(keys).encode(), digest_size=8).digest()
    return random.Random(int.from_bytes(h, 'little'))

def clamp(x, a, b): return max(a, min(b, x))

AXES = ['results', 'prudence', 'tradition', 'ambition']
GROUP_POOL = {
    'Ultras':    {'results': .5, 'prudence': -.1, 'tradition': .4, 'ambition': .3},
    'Families':  {'results': .3, 'prudence': .3, 'tradition': .3, 'ambition': 0},
    'Business':  {'results': .2, 'prudence': .6, 'tradition': -.1, 'ambition': .3},
    'Old Guard': {'results': .2, 'prudence': .3, 'tradition': .6, 'ambition': -.2},
    'The Pit':   {'results': .4, 'prudence': 0, 'tradition': .1, 'ambition': .5},
}
FOOTBALL_CATS = {'player', 'coach', 'match', 'youth', 'transfer', 'staff'}

DEFAULT_PARAMS = dict(issue_scale=1.0, results_weight=1.0, decay=0.30, staff_var=1.0, text_power=1.0,
                      seasons=3, size_factor=1.0, weeks=30,
                      cards_min=2, cards_max=4, tokens=3, crisis_scale=1.8, proj_gain=1.0, esc_cap=1, m5_texts=1)

# --------------------------------------------------------------------------------------------------
# world
# --------------------------------------------------------------------------------------------------
def new_world(seed, P):
    r = R(seed, 'init')
    groups = []
    names = r.sample(list(GROUP_POOL), 4)
    raw = [r.uniform(15, 40) for _ in names]
    tot = sum(raw)
    for n, x in zip(names, raw):
        groups.append({'name': n, 'share': x / tot, 'mood': r.gauss(58, 4), 'pref': GROUP_POOL[n]})
    players = []
    for i, nm in enumerate(['Holt', 'Kershaw', 'Waddington', 'Thackeray', 'Rees']):
        players.append({'name': nm, 'q': r.gauss(12, 1.2), 'morale': r.gauss(60, 6), 'local': r.random() < .4,
                        'age': r.randint(19, 32), 'sold': False})
    W = {
        'seed': seed, 'season': 1, 'week': 0, 'groups': groups, 'players': players,
        'strength': r.gauss(50, 1.5), 'morale': 60.0, 'cash': 60.0, 'debt': 0.0,
        'coach': {'q': clamp(r.gauss(.5, .15 * P['staff_var']), .05, .95), 'loy': 6.0, 'stub': r.random(), 'id': 0},
        'td': {'eye': clamp(r.gauss(.5, .15 * P['staff_var']), .05, .95)},
        'fin': {'comp': clamp(r.gauss(.55, .15 * P['staff_var']), .05, .95)},
        'others': sorted([r.gauss(50, 5) for _ in range(15)]),
        'delayed': [], 'escalated': [], 'log': [], 'mandate': {'prudence': 0, 'youth': 0, 'sales': 0},
        'promises': [], 'season_stats': [], 'alive': True, 'reason': None,
        'points': 0, 'opp_points': [0] * 15, 'results': [], 'support_hist': [], 'youth_promoted': 0,
        'key_sold': 0, 'derby_pts': 0, 'cash_start': 60.0, 'fired': 0,
    }
    return W

def support(W):
    return sum(g['share'] * g['mood'] for g in W['groups'])

def axes_to_groups(W, ax, scale=1.0):
    """apply an axes delta {axis: v} to every group's mood through its preferences; returns support delta"""
    before = support(W)
    for g in W['groups']:
        d = sum(g['pref'].get(a, 0) * v for a, v in ax.items()) * scale
        g['mood'] = clamp(g['mood'] + d, 0, 100)
    return support(W) - before

def axes_support_estimate(W, ax, scale=1.0):
    return sum(g['share'] * sum(g['pref'].get(a, 0) * v for a, v in ax.items()) * scale for g in W['groups'])

# --------------------------------------------------------------------------------------------------
# effects: immediate (visible) + delayed (hidden)
# --------------------------------------------------------------------------------------------------
def apply_effect(W, e, P, who=None):
    s = P['issue_scale']
    if 'gamble' in e:
        win = R(W['seed'], 'gamble', W['season'], W['week'], who).random() < .5
        apply_effect(W, e['gamble'][0] if win else e['gamble'][1], P, who); return
    if 'ax' in e: axes_to_groups(W, e['ax'], s)
    if 'group' in e:
        gi, d = e['group']; W['groups'][gi]['mood'] = clamp(W['groups'][gi]['mood'] + d * s, 0, 100)
        if 'others' in e:
            for j, g in enumerate(W['groups']):
                if j != gi: g['mood'] = clamp(g['mood'] + e['others'] * s, 0, 100)
    if 'cash' in e: W['cash'] += e['cash'] * (1 if e.get('raw_cash') else s)
    if 'morale' in e: W['morale'] = clamp(W['morale'] + e['morale'] * s, 0, 100)
    if 'strength' in e: W['strength'] += e['strength'] * s
    if 'coach_loy' in e: W['coach']['loy'] = clamp(W['coach']['loy'] + e['coach_loy'], 0, 10)
    if 'pm' in e and who is not None:
        p = W['players'][who]; p['morale'] = clamp(p['morale'] + e['pm'] * s, 0, 100)
    if e.get('sell') is not None:
        p = W['players'][e['sell']]
        if not p['sold']:
            p['sold'] = True; W['strength'] -= p['q'] / 4.0; W['key_sold'] += 1
    if e.get('youth'): W['youth_promoted'] += 1
    if e.get('fire'):
        rr = R(W['seed'], 'newcoach', W['season'], W['week'], W['fired'])
        W['coach'] = {'q': clamp(rr.gauss(.5, .15 * P['staff_var']), .05, .95), 'loy': 6.0, 'stub': rr.random(),
                      'id': W['coach']['id'] + 1}
        W['fired'] += 1
    if 'debt' in e: W['debt'] += e['debt']

def schedule(W, opt, who):
    for lag, eff, prob, cond in opt.get('delayed', []):
        W['delayed'].append({'at': (W['season'], W['week'] + lag), 'eff': eff, 'prob': prob, 'cond': cond,
                             'who': who, 'key': len(W['log'])})

def run_delayed(W, P):
    keep = []
    for d in W['delayed']:
        s, wk = d['at']
        if (W['season'], W['week']) >= (s, wk) or W['season'] > s:
            rr = R(W['seed'], 'delay', d['key'], s, wk)
            ok = rr.random() < d['prob']
            if ok and d['cond']:
                ok = eval_cond(W, d['cond'])
            if ok: apply_effect(W, d['eff'], P, d['who'])
        else:
            keep.append(d)
    W['delayed'] = keep

def eval_cond(W, c):
    if c == 'coach_good': return W['coach']['q'] > .5
    if c == 'coach_bad': return W['coach']['q'] <= .5
    if c == 'coach_better_than_td': return W['coach']['q'] > W['td']['eye']
    if c == 'td_better_than_coach': return W['td']['eye'] >= W['coach']['q']
    return True

# --------------------------------------------------------------------------------------------------
# issues: generated from the world state (identical for every model)
# --------------------------------------------------------------------------------------------------
def gen_issues(W, P):
    r = R(W['seed'], 'issues', W['season'], W['week'])
    out = []
    live = [i for i, p in enumerate(W['players']) if not p['sold']]
    if live:
        cdw = W.setdefault('cd', {}); now = W['season'] * 100 + W['week']
        avail = [i for i in live if cdw.get(('player', i), -1) < now]
        unhappy = [i for i in avail if W['players'][i]['morale'] < 45]
        if avail and (unhappy or r.random() < .06):
            i = unhappy[0] if unhappy else r.choice(avail); p = W['players'][i]
            val = round(4 + (p['q'] - 10) * 6)
            out.append({'type': 'player_unhappy', 'cat': 'player', 'who': i, 'urg': 2 + (45 - p['morale']) / 10, 'opts': [
                {'t': 'Leave it to the coach', 'e': {'coach_loy': .3}, 'delayed': [(3, {'pm': -10, 'strength': -.8}, .5, None)]},
                {'t': f'Talk to {p["name"]} yourself', 'e': {'pm': 15, 'coach_loy': -.5}, 'delayed': [(6, {'strength': .8}, .5, None)]},
                {'t': f'Sell {p["name"]}', 'e': {'cash': val, 'sell': i, 'ax': {'tradition': -2 if p['local'] else 0, 'ambition': -1.5}}},
            ], 'fan': 1}),
    if W['cash'] < 20 or r.random() < .03:
        out.append({'type': 'money_squeeze', 'cat': 'money', 'urg': 3 if W['cash'] < 0 else 1.5, 'opts': [
            {'t': 'Cut costs quietly', 'e': {'morale': -5, 'cash': 10}, 'delayed': [(8, {'strength': -1}, .6, None)]},
            {'t': 'Borrow from the bank', 'e': {'cash': 30, 'ax': {'prudence': -3}, 'debt': 30}, 'delayed': [(12, {'cash': -36}, 1.0, None)]},
            {'t': 'Raise ticket prices', 'e': {'cash': 15, 'ax': {'prudence': 1, 'tradition': -3}}},
        ], 'fan': 0})
    cdw = W.setdefault('cd', {}); now = W['season'] * 100 + W['week']
    low = [i for i, g in enumerate(W['groups']) if g['mood'] < 45 and cdw.get(('group', i), -1) < now]
    if (low or r.random() < .07) and any(cdw.get(('group', j), -1) < now for j in range(len(W['groups']))):
        gi = low[0] if low else r.choice([j for j in range(len(W['groups'])) if cdw.get(('group', j), -1) < now])
        out.append({'type': 'fan_demand', 'cat': 'members', 'gi': gi, 'urg': 2 + (45 - W['groups'][gi]['mood']) / 8, 'opts': [
            {'t': 'Refuse politely', 'e': {'group': (gi, -3)}},
            {'t': 'Give them what they want', 'e': {'group': (gi, 6), 'others': -1, 'cash': -8}},
            {'t': 'Invite them to a meeting', 'e': {'group': (gi, 2)}, 'delayed': [(4, {'group': (gi, 3)}, .6, None)]},
        ], 'fan': 1})
    last4 = W['results'][-4:]
    if len(last4) == 4 and sum(3 if x == 'W' else 1 if x == 'D' else 0 for x in last4) <= 3 and r.random() < .7 and cdw.get('coach', -1) < now:
        out.append({'type': 'coach_slump', 'cat': 'coach', 'urg': 3.5, 'reserved': True, 'opts': [
            {'t': 'Back the coach publicly', 'e': {'coach_loy': 1, 'ax': {'results': -2}},
             'delayed': [(6, {'strength': 1.5}, 1, 'coach_good'), (6, {'strength': -1.0}, 1, 'coach_bad')]},
            {'t': 'Give him an ultimatum', 'e': {'coach_loy': -1, 'morale': 3}, 'delayed': [(4, {'strength': 1.0}, .5, None)]},
            {'t': 'Sack the coach', 'e': {'cash': -15, 'morale': -6, 'ax': {'results': 4, 'ambition': 2}, 'fire': True}},
        ], 'fan': 0})
    if r.random() < .05:
        out.append({'type': 'sponsor_offer', 'cat': 'money', 'urg': 1, 'opts': [
            {'t': 'Decline', 'e': {'ax': {'tradition': 1}}},
            {'t': 'Accept the betting firm', 'e': {'cash': 20, 'ax': {'tradition': -4, 'prudence': 2}}},
        ], 'fan': 0})
    if r.random() < .05:
        out.append({'type': 'youth_talent', 'cat': 'youth', 'urg': 1.2, 'opts': [
            {'t': 'Keep him in the youth team', 'e': {}},
            {'t': 'Promote him now', 'e': {'ax': {'tradition': 3}, 'youth': True},
             'delayed': [(2, {'strength': -.5}, 1, None), (15, {'strength': 2.0}, .6, None)]},
            {'t': 'Sell him to a big club', 'e': {'cash': 25, 'ax': {'tradition': -3}}},
        ], 'fan': 1})
    if live and W['strength'] > 49 and r.random() < .05:
        i = max(live, key=lambda k: W['players'][k]['q']); p = W['players'][i]; val = round(6 + (p['q'] - 10) * 7)
        out.append({'type': 'rival_bid', 'cat': 'transfer', 'who': i, 'urg': 2, 'opts': [
            {'t': f'Refuse: {p["name"]} stays', 'e': {'pm': -8, 'ax': {'ambition': 1}}},
            {'t': 'Accept the bid', 'e': {'cash': val, 'sell': i, 'ax': {'tradition': -2, 'results': -1}}},
            {'t': 'Ask for more', 'e': {'gamble': ({'cash': round(val * 1.5), 'sell': i, 'ax': {'tradition': -2}}, {'pm': -12})}},
        ], 'fan': 0})
    if (len(last4) >= 3 and last4[-3:].count('L') == 3) or r.random() < .04:
        out.append({'type': 'press_storm', 'cat': 'media', 'urg': 1.5, 'opts': [
            {'t': 'Say nothing', 'e': {'ax': {'results': -1}}},
            {'t': 'Back the players', 'e': {'morale': 4, 'coach_loy': .3}},
            {'t': 'Criticise the team', 'e': {'morale': -6, 'ax': {'ambition': 2, 'results': 1}}, 'delayed': [(3, {'strength': .5}, .4, None)]},
        ], 'fan': 1})
    if r.random() < .03:
        out.append({'type': 'stadium', 'cat': 'club', 'urg': 1, 'opts': [
            {'t': 'Patch it', 'e': {'cash': -5}, 'delayed': [(15, {'cash': -12}, .4, None)]},
            {'t': 'Fix it properly', 'e': {'cash': -18}},
        ], 'fan': 0})
    if r.random() < .04:
        out.append({'type': 'staff_conflict', 'cat': 'staff', 'urg': 1.8, 'opts': [
            {'t': 'Side with the coach', 'e': {'coach_loy': 1},
             'delayed': [(8, {'strength': .7}, 1, 'coach_better_than_td'), (8, {'strength': -.7}, 1, 'td_better_than_coach')]},
            {'t': 'Side with the director', 'e': {'coach_loy': -1},
             'delayed': [(8, {'strength': .7}, 1, 'td_better_than_coach'), (8, {'strength': -.7}, 1, 'coach_better_than_td')]},
        ], 'fan': 0})
    return out

# value of an option: visible part (immediate) and true expected part (immediate + delayed, incl. hidden conditions)
def opt_value(W, iss, opt, P, include_hidden):
    e = opt['e']; s = P['issue_scale']
    if 'gamble' in e:
        return .5 * opt_value(W, iss, {'e': e['gamble'][0]}, P, include_hidden) + .5 * opt_value(W, iss, {'e': e['gamble'][1]}, P, include_hidden)
    v = 0.0
    if 'ax' in e: v += axes_support_estimate(W, e['ax'], s)
    if 'group' in e:
        gi, d = e['group']; v += W['groups'][gi]['share'] * d * s
        if 'others' in e: v += e['others'] * s * (1 - W['groups'][gi]['share'])
    cashw = 0.35 if W['cash'] < 15 else 0.12
    v += cashw * e.get('cash', 0) / 2
    v += 0.06 * e.get('morale', 0) * s + 1.2 * e.get('strength', 0) * s + 0.35 * e.get('coach_loy', 0)
    if e.get('sell') is not None: v -= 1.2 * W['players'][e['sell']]['q'] / 4
    if 'pm' in e: v += 0.04 * e['pm'] * s
    if include_hidden:
        for lag, eff, prob, cond in opt.get('delayed', []):
            if cond and not eval_cond(W, cond): continue
            sub = {'e': eff}
            v += prob * (0.92 ** (lag / 4)) * opt_value(W, iss, sub, P, False)
        if e.get('fire'):
            v += 1.2 * (0.5 - W['coach']['q']) * 6   # expected gain from a new coach of average quality
    return v

# --------------------------------------------------------------------------------------------------
# chairman policies (the same in every model)
# --------------------------------------------------------------------------------------------------
class Policy:
    def __init__(self, kind, seed): self.kind, self.seed = kind, seed
    def rng(self, W, n): return R(self.seed, 'pol', self.kind, n)

    def choose(self, W, iss, P, n):
        opts = iss['opts']
        k = self.kind
        if k == 'passive': return 0
        if k == 'random': return self.rng(W, n).randrange(len(opts))
        if k == 'fan':
            # loyal to people and tradition: talk to players, promote youth, back the coach, give fans what they want
            pref = {'player_unhappy': 1, 'youth_talent': 1, 'coach_slump': 0, 'fan_demand': 1, 'press_storm': 1,
                    'rival_bid': 0, 'sponsor_offer': 0, 'money_squeeze': 0, 'stadium': 1, 'staff_conflict': 0}
            return min(pref.get(iss['type'], 0), len(opts) - 1)
        if k == 'greedy_visible':
            vals = [opt_value(W, iss, o, P, False) for o in opts]
        elif k == 'informed':
            vals = [opt_value(W, iss, o, P, True) for o in opts]
        elif k == 'fixed1':
            return min(1, len(opts) - 1)
        else:
            raise ValueError(k)
        return max(range(len(opts)), key=lambda i: vals[i])

    def text(self, W, sug, P, n):
        k = self.kind
        if k == 'passive': return len(sug) - 1  # say nothing
        if k == 'random': return self.rng(W, n).randrange(len(sug))
        if k == 'fan': return next((i for i, s in enumerate(sug) if s['k'] in ('youth', 'star')), len(sug) - 1)
        if k == 'fixed1': return 0
        noise = 0.0 if k == 'informed' else 0.6
        rr = self.rng(W, n)
        return max(range(len(sug)), key=lambda i: sug[i]['vis'] + rr.gauss(0, noise))

    def spend_token(self, W, iss, staff_choice, P, n):
        k = self.kind
        if k in ('passive', 'fixed1'): return None
        if k == 'random': return self.rng(W, n).randrange(len(iss['opts'])) if self.rng(W, n + 7).random() < .15 else None
        if k == 'fan':
            return 1 if iss['type'] in ('player_unhappy', 'youth_talent') and staff_choice != 1 else None
        best = self.choose(W, iss, P, n)
        hidden = k == 'informed'
        gain = opt_value(W, iss, iss['opts'][best], P, hidden) - opt_value(W, iss, iss['opts'][staff_choice], P, hidden)
        return best if gain > 1.0 else None

    def promises(self, W, n):
        allp = ['top_half', 'balance', 'youth', 'derby', 'no_sale']
        k = self.kind
        if k == 'passive': return allp[:3]
        if k == 'random': return self.rng(W, n).sample(allp, 3)
        if k == 'fan': return ['youth', 'derby', 'no_sale']
        if k == 'fixed1': return allp[1:4]
        # optimisers: pick what looks achievable
        sc = {'top_half': (W['strength'] - 48) / 3, 'balance': (W['cash'] - 30) / 20, 'youth': .4, 'derby': 0, 'no_sale': .3}
        return sorted(allp, key=lambda x: -sc[x])[:3]

    def mandate(self, W, n):
        k = self.kind
        if k == 'passive': return {'prudence': 0, 'youth': 0, 'sales': 0}
        if k == 'random':
            rr = self.rng(W, n); return {a: rr.choice([-1, 0, 1]) for a in ('prudence', 'youth', 'sales')}
        if k == 'fan': return {'prudence': 0, 'youth': 1, 'sales': -1}
        if k == 'fixed1': return {'prudence': 1, 'youth': 0, 'sales': 0}
        return {'prudence': 1 if W['cash'] < 40 else 0, 'youth': 0, 'sales': 1 if W['cash'] < 20 else 0}

    def attention(self, W, projects, issues, n):
        k = self.kind
        if k == 'passive': return 'A'
        if k == 'random': return self.rng(W, n).choice(['A', 'B', 'people'])
        if k == 'fan': return 'people' if issues else 'A'
        if k == 'fixed1': return 'B'
        if issues and max(i['urg'] for i in issues) >= 2.5: return 'people'
        a, b = projects
        return 'A' if a['prog'] <= b['prog'] else 'B'

    def projects(self, W, n):
        allp = ['academy', 'stadium', 'finance', 'push', 'community']
        k = self.kind
        if k == 'passive': return allp[:2]
        if k == 'random': return self.rng(W, n).sample(allp, 2)
        if k == 'fan': return ['academy', 'community']
        if k == 'fixed1': return ['stadium', 'finance']
        if W['cash'] < 30: return ['finance', 'community']
        return ['push', 'community']

    def stance(self, W, kind, n):
        k = self.kind
        if k == 'passive': return 2
        if k == 'random': return self.rng(W, n).randrange(3)
        if k == 'fan': return 0
        if k == 'fixed1': return 1
        if kind == 'pre': return 0 if W['coach']['loy'] < 6 else (1 if W['morale'] < 50 else 2)
        return 1 if W['results'] and W['results'][-1] == 'L' else 2

# --------------------------------------------------------------------------------------------------
# staff: resolves issues autonomously (competence = chance to pick the truly best option; biased by mandate & self-interest)
# --------------------------------------------------------------------------------------------------
STAFF_OF = {'player': 'coach', 'coach': 'coach', 'media': 'coach', 'match': 'coach', 'transfer': 'td', 'youth': 'td',
            'staff': 'td', 'money': 'fin', 'club': 'fin', 'members': 'fin'}

def staff_choice(W, iss, P, n):
    who = STAFF_OF[iss['cat']]
    comp = {'coach': W['coach']['q'], 'td': W['td']['eye'], 'fin': W['fin']['comp']}[who]
    rr = R(W['seed'], 'staff', W['season'], W['week'], iss['type'], iss.get('who'), iss.get('gi'))
    opts = iss['opts']
    if iss.get('reserved'): return 0          # the staff never sacks itself
    vals = [opt_value(W, iss, o, P, True) for o in opts]
    m = W['mandate']
    for i, o in enumerate(opts):
        t = o['t'].lower()
        if m['prudence'] > 0 and ('borrow' in t or 'give them' in t): vals[i] -= 1.5
        if m['youth'] > 0 and 'promote' in t: vals[i] += 1.5
        if m['sales'] < 0 and ('sell' in t or 'accept the bid' in t): vals[i] -= 2
        if m['sales'] > 0 and ('sell' in t or 'accept the bid' in t): vals[i] += 1
        if who == 'coach' and 'coach_loy' in o['e']: vals[i] += o['e']['coach_loy'] * 0.8   # self-interest
    if rr.random() < comp: return max(range(len(opts)), key=lambda i: vals[i])
    return rr.randrange(len(opts))

# --------------------------------------------------------------------------------------------------
# matches
# --------------------------------------------------------------------------------------------------
def text_suggestions(W, rr):
    tired = rr.random() < .5; star = rr.random() < .5; leading = rr.random() < .4
    s = []
    s.append({'k': 'tired', 't': 'Take off the tired man', 'true': 1.0 if tired else -.3, 'vis': (1.0 if tired else -.3) + rr.gauss(0, .5)})
    s.append({'k': 'star', 't': 'Get the ball to the star', 'true': 1.0 if star else -.2, 'vis': (1.0 if star else -.2) + rr.gauss(0, .5)})
    s.append({'k': 'youth', 't': 'Give the kid a chance', 'true': -.4, 'vis': -.4 + rr.gauss(0, .3), 'ax': {'tradition': 1}})
    s.append({'k': 'tight', 't': 'Keep it tight', 'true': .6 if leading else -.6, 'vis': (.6 if leading else -.6) + rr.gauss(0, .5)})
    s.append({'k': 'none', 't': 'Say nothing', 'true': 0, 'vis': 0})
    return s

def play_match(W, P, model, pol, ctx):
    wk, se = W['week'], W['season']
    rr = R(W['seed'], 'match', se, wk)
    opp = W['others'][(wk * 7 + se * 3) % 15]
    derby = wk in (8, 23)
    big = derby or wk % 5 == 0
    bonus = 0.0
    n_texts = {'M1': 2, 'M0': 2, 'M5': P['m5_texts'], 'M6': 1 if big else 0}.get(model, 0)
    if model == 'M5':
        st = ctx.decide('stance', lambda n: pol.stance(W, 'pre', n), 3, cat='match')
        rep_ = W.setdefault('stance_rep', {}); same = rep_.get('pre') == st; rep_['pre'] = st
        damp = .4 if same else 1.0                                   # saying the same thing every week wears off
        room = 1.0 if W['morale'] < 65 else 0.0                      # no free morale above 65
        if st == 0:   # back the coach in the programme notes: coach +, impatient members -
            W['coach']['loy'] = clamp(W['coach']['loy'] + .2 * damp, 0, 10); axes_to_groups(W, {'results': -.4 * damp}, 1)
        elif st == 1: # demand a win: short morale lift, coach loyalty -, a loss hurts more
            W['morale'] = clamp(W['morale'] + 3 * damp * room, 0, 100); W['coach']['loy'] = clamp(W['coach']['loy'] - .3, 0, 10); W['demanded'] = True
    for t in range(n_texts):
        sug = text_suggestions(W, R(W['seed'], 'sug', se, wk, t))
        i = ctx.decide('text', lambda n: pol.text(W, sug, P, n), len(sug), cat='match')
        if model == 'M0': i = len(sug) - 1
        s = sug[i]
        if s['k'] == 'none': continue
        W['coach']['loy'] = clamp(W['coach']['loy'] - .08, 0, 10)   # meddling
        pf = clamp(.3 + .06 * W['coach']['loy'] - .2 * W['coach']['stub'], .1, .9)
        if R(W['seed'], 'follow', se, wk, t).random() < pf:
            bonus += s['true'] * .045 * P['text_power']
            if 'ax' in s: axes_to_groups(W, s['ax'], 1)
            ctx.count('text_followed')
        else:
            W['coach']['loy'] = clamp(W['coach']['loy'] - .05, 0, 10)
    eff = W['strength'] + (W['morale'] - 55) * .08 + (W['coach']['q'] - .5) * 6
    pw = clamp(.38 + (eff - opp) * .022 + bonus, .06, .82); pd = .26
    x = rr.random()
    res = 'W' if x < pw else 'D' if x < pw + pd else 'L'
    W['results'].append(res)
    pts = 3 if res == 'W' else 1 if res == 'D' else 0
    W['points'] += pts
    if derby: W['derby_pts'] += pts
    for j, s in enumerate(W['others']):
        q = R(W['seed'], 'oth', se, wk, j).random()
        p = clamp(.36 + (s - 50) * .02, .1, .7)
        W['opp_points'][j] += 3 if q < p else 1 if q < p + .27 else 0
    rw = P['results_weight'] * (2 if derby else 1)
    d = {'W': 1.7, 'D': -.2, 'L': -1.8}[res] * rw
    axes_to_groups(W, {'results': d * 2, 'ambition': d * .5}, 1)
    W['morale'] = clamp(W['morale'] + {'W': 4, 'D': 0, 'L': -4}[res], 0, 100)
    if W.pop('demanded', False) and res == 'L':
        W['morale'] = clamp(W['morale'] - 3, 0, 100); axes_to_groups(W, {'results': -1}, 1)
    if model == 'M5':
        st = ctx.decide('stance', lambda n: pol.stance(W, 'post', n), 3, cat='media')
        if st == 0 and res == 'L': W['coach']['loy'] = clamp(W['coach']['loy'] - 1, 0, 10); axes_to_groups(W, {'results': 1}, 1)
        elif st == 1:
            rep_ = W.setdefault('stance_rep', {}); damp = .4 if rep_.get('post') == 1 else 1.0; rep_['post'] = st
            W['morale'] = clamp(W['morale'] + 2 * damp * (1.0 if W['morale'] < 65 else 0), 0, 100); W['coach']['loy'] = clamp(W['coach']['loy'] + .1, 0, 10)
    return res

def position(W):
    return 1 + sum(1 for p in W['opp_points'] if p > W['points'])

# --------------------------------------------------------------------------------------------------
# decision context: numbering, counterfactual forcing, logging
# --------------------------------------------------------------------------------------------------
class Ctx:
    def __init__(self, W, forced=None):
        self.W, self.forced, self.n = W, forced or {}, 0
        self.decisions = []; self.counts = {}
    def decide(self, kind, fn, nopts, cat=None, vis=None):
        n = self.n; self.n += 1
        if n in self.forced:
            i = self.forced[n] % nopts
        else:
            i = fn(n)
        self.decisions.append({'n': n, 'kind': kind, 'cat': cat, 'season': self.W['season'], 'week': self.W['week'],
                               'nopts': nopts, 'choice': i, 'vis': vis})
        return i
    def count(self, k, v=1): self.counts[k] = self.counts.get(k, 0) + v

# --------------------------------------------------------------------------------------------------
# interaction models
# --------------------------------------------------------------------------------------------------
PROJECTS = {
    'academy':   {'done': {'ax': {'tradition': 4}}, 'late': (20, {'strength': 2.5})},
    'stadium':   {'done': {'cash': -20}, 'late': (10, {'cash': 40})},
    'finance':   {'done': {'cash': 25, 'morale': -3}, 'late': None},
    'push':      {'done': {'strength': 2.0, 'cash': -15}, 'late': None},
    'community': {'done': {'ax': {'tradition': 2, 'prudence': 1}}, 'late': (6, {'ax': {'tradition': 2}})},
}

def resolve(W, iss, idx, P, ctx, by):
    opt = iss['opts'][idx]
    cd = W.setdefault('cd', {}); now = W['season'] * 100 + W['week']
    if iss['type'] == 'coach_slump': cd['coach'] = now + 6
    if iss['type'] == 'fan_demand': cd[('group', iss['gi'])] = now + 3
    if iss['type'] == 'player_unhappy': cd[('player', iss['who'])] = now + 4
    apply_effect(W, opt['e'], P, iss.get('who'))
    schedule(W, opt, iss.get('who'))
    W['log'].append((W['season'], W['week'], iss['type'], idx, by))
    ctx.count('resolved_' + by)
    if by == 'chairman': ctx.count('chair_cat_' + iss['cat'])

def week_issues(W, P, model, pol, ctx):
    issues = gen_issues(W, P)
    # escalated cards from last week come back bigger
    for e in W['escalated']:
        e2 = copy.deepcopy(e); e2['urg'] += 1
        for o in e2['opts']:
            for k in ('cash', 'morale', 'strength'):
                if k in o['e'] and o['e'][k] < 0: o['e'][k] *= 1.5
            if 'ax' in o['e']: o['e']['ax'] = {a: (v * 1.5 if v < 0 else v) for a, v in o['e']['ax'].items()}
        e2['escalations'] = e.get('escalations', 0) + 1
        issues.append(e2)
    W['escalated'] = []
    issues.sort(key=lambda i: -i['urg'])
    rw = R(W['seed'], 'cards', W['season'], W['week'])

    if model in ('M1', 'M0'):
        ncard = P['cards_min'] + rw.randrange(P['cards_max'] - P['cards_min'] + 1)
        shown, rest = issues[:ncard], issues[ncard:]
        for iss in shown:
            vis = [opt_value(W, iss, o, P, False) for o in iss['opts']]
            if pol.kind == 'passive' and model == 'M1':
                if iss.get('escalations', 0) < 1: W['escalated'].append(iss); ctx.count('ignored'); continue
                lo = min(range(len(W['groups'])), key=lambda j: W['groups'][j]['mood'])
                W['groups'][lo]['mood'] = clamp(W['groups'][lo]['mood'] - 2, 0, 100)
                resolve(W, iss, staff_choice(W, iss, P, ctx.n), P, ctx, 'staff'); continue
            i = ctx.decide('card', lambda n: pol.choose(W, iss, P, n), len(iss['opts']), cat=iss['cat'], vis=vis)
            if model == 'M0':
                resolve(W, iss, staff_choice(W, iss, P, ctx.n), P, ctx, 'staff'); continue
            resolve(W, iss, i, P, ctx, 'chairman')
        for iss in rest:
            if iss.get('reserved'): continue
            resolve(W, iss, staff_choice(W, iss, P, ctx.n), P, ctx, 'staff')
        return

    if model == 'M2':
        for iss in issues:
            if iss.get('reserved'):
                if W['week'] % 4 == 0:   # only in the monthly report
                    vis = [opt_value(W, iss, o, P, False) for o in iss['opts']]
                    i = ctx.decide('report', lambda n: pol.choose(W, iss, P, n), len(iss['opts']), cat=iss['cat'], vis=vis)
                    resolve(W, iss, i, P, ctx, 'chairman')
                continue
            sc = staff_choice(W, iss, P, ctx.n)
            if W['tokens'] > 0:
                ov = ctx.decide('token', lambda n: (lambda t: 0 if t is None else 1 + t)(pol.spend_token(W, iss, sc, P, n)), len(iss['opts']) + 1, cat=iss['cat'])
                if ov > 0:
                    W['tokens'] -= 1; resolve(W, iss, ov - 1, P, ctx, 'chairman'); continue
            resolve(W, iss, sc, P, ctx, 'staff')
        return

    if model == 'M3':
        crisis = (W['cash'] < 0 or min(g['mood'] for g in W['groups']) < 38 or W['morale'] < 38
                  or any(i['type'] in ('coach_slump', 'rival_bid') for i in issues))
        done = False
        for iss in issues:
            if crisis and not done:
                big = copy.deepcopy(iss)
                for o in big['opts']:
                    cs = P['crisis_scale']
                    o['e'] = {k: (v * cs if isinstance(v, (int, float)) and not isinstance(v, bool) and k not in ('sell',) else v) for k, v in o['e'].items()}
                    if 'ax' in o['e']: o['e']['ax'] = {a: v * cs for a, v in o['e']['ax'].items()}
                vis = [opt_value(W, big, o, P, False) for o in big['opts']]
                i = ctx.decide('crisis', lambda n: pol.choose(W, big, P, n), len(big['opts']), cat=big['cat'], vis=vis)
                resolve(W, big, i, P, ctx, 'chairman'); done = True; continue
            if iss.get('reserved'): continue
            resolve(W, iss, staff_choice(W, iss, P, ctx.n), P, ctx, 'staff')
        return

    if model == 'M4':
        prj = W['proj']
        a = ctx.decide('attention', lambda n: ['A', 'B', 'people'].index(pol.attention(W, prj, issues, n)), 3, cat='project')
        took = None
        if a == 2 and issues:
            iss = issues[0]
            vis = [opt_value(W, iss, o, P, False) for o in iss['opts']]
            i = ctx.decide('card', lambda n: pol.choose(W, iss, P, n), len(iss['opts']), cat=iss['cat'], vis=vis)
            resolve(W, iss, i, P, ctx, 'chairman'); took = iss
        elif a in (0, 1):
            p = prj[a]
            comp = (W['td']['eye'] + W['fin']['comp']) / 2
            p['prog'] += (12 + 10 * comp) * P['proj_gain']
        for p in prj:
            p['prog'] += 2 + 3 * W['fin']['comp']   # staff work on projects on their own
            if p['prog'] >= 100 and not p['done']:
                p['done'] = True; d = PROJECTS[p['k']]
                apply_effect(W, d['done'], P)
                if d['late']: W['delayed'].append({'at': (W['season'], W['week'] + d['late'][0]), 'eff': d['late'][1], 'prob': 1, 'cond': None, 'who': None, 'key': -len(W['log']) - 1})
                ctx.count('project_done')
        for iss in issues:
            if iss is took or iss.get('reserved'): continue
            resolve(W, iss, staff_choice(W, iss, P, ctx.n), P, ctx, 'staff')
        return

    if model == 'M5':
        for iss in issues:
            if iss.get('reserved'): continue
            resolve(W, iss, staff_choice(W, iss, P, ctx.n), P, ctx, 'staff')
        return

    if model == 'M7':   # POST-HOC (not pre-registered): delegation + crisis moments + monthly report, no cards, no texts
        crisis = (W['cash'] < 0 or min(g['mood'] for g in W['groups']) < 38 or W['morale'] < 38
                  or any(i['type'] in ('coach_slump', 'rival_bid') for i in issues))
        done = False
        for iss in issues:
            if iss.get('reserved') and not crisis:
                if W['week'] % 4 == 0:
                    vis = [opt_value(W, iss, o, P, False) for o in iss['opts']]
                    i = ctx.decide('report', lambda n: pol.choose(W, iss, P, n), len(iss['opts']), cat=iss['cat'], vis=vis)
                    resolve(W, iss, i, P, ctx, 'chairman')
                continue
            if crisis and not done:
                vis = [opt_value(W, iss, o, P, False) for o in iss['opts']]
                i = ctx.decide('crisis', lambda n: pol.choose(W, iss, P, n), len(iss['opts']), cat=iss['cat'], vis=vis)
                resolve(W, iss, i, P, ctx, 'chairman'); done = True; continue
            sc = staff_choice(W, iss, P, ctx.n)
            if W['tokens'] > 0:
                ov = ctx.decide('token', lambda n: (lambda t: 0 if t is None else 1 + t)(pol.spend_token(W, iss, sc, P, n)), len(iss['opts']) + 1, cat=iss['cat'])
                if ov > 0:
                    W['tokens'] -= 1; resolve(W, iss, ov - 1, P, ctx, 'chairman'); continue
            resolve(W, iss, sc, P, ctx, 'staff')
        return

    if model == 'M6':
        sent = 0
        for iss in issues:
            if iss.get('reserved'):
                if W['week'] % 4 == 0:
                    vis = [opt_value(W, iss, o, P, False) for o in iss['opts']]
                    i = ctx.decide('report', lambda n: pol.choose(W, iss, P, n), len(iss['opts']), cat=iss['cat'], vis=vis)
                    resolve(W, iss, i, P, ctx, 'chairman')
                continue
            who = STAFF_OF[iss['cat']]
            comp = {'coach': W['coach']['q'], 'td': W['td']['eye'], 'fin': W['fin']['comp']}[who]
            rr = R(W['seed'], 'esc', W['season'], W['week'], iss['type'])
            vals = sorted(opt_value(W, iss, o, P, True) for o in iss['opts'])
            unsure = rr.random() > comp + .15                     # staff unsure
            contested = len(vals) > 1 and vals[-1] - vals[-2] < .6 # options close: staff disagree
            uncovered = iss['type'] in ('sponsor_offer', 'staff_conflict', 'fan_demand') and W['mandate']['prudence'] == 0
            if sent < P['esc_cap'] and (unsure or contested or uncovered):
                vis = [opt_value(W, iss, o, P, False) for o in iss['opts']]
                i = ctx.decide('escalated', lambda n: pol.choose(W, iss, P, n), len(iss['opts']), cat=iss['cat'], vis=vis)
                resolve(W, iss, i, P, ctx, 'chairman'); sent += 1; continue
            resolve(W, iss, staff_choice(W, iss, P, ctx.n), P, ctx, 'staff')
        return
    raise ValueError(model)

TIME = {'card': 6, 'report': 15, 'token': 4, 'crisis': 15, 'attention': 3, 'text': 4, 'stance': 3, 'escalated': 10,
        'promises': 10, 'mandate': 8, 'projects': 10}

def simulate(seed, model, pkind, P=None, forced=None, horizon=None):
    P = dict(DEFAULT_PARAMS, **(P or {}))
    W = new_world(seed, P)
    pol = Policy(pkind, seed)
    ctx = Ctx(W, forced)
    seasons = horizon or P['seasons']
    checkpoints = {}
    for se in range(1, seasons + 1):
        W['season'] = se; W['week'] = 0
        W['points'] = 0; W['opp_points'] = [0] * 15; W['results'] = []; W['derby_pts'] = 0; W['key_sold'] = 0
        W['youth_promoted'] = 0; W['cash_start'] = W['cash']; W['tokens'] = P['tokens']
        prom_all = ['top_half', 'balance', 'youth', 'derby', 'no_sale']
        pr = (Policy('passive', seed) if model == 'M0' else pol).promises(W, -se)
        ctx.decide('promises', lambda n: 0, 1, cat='club')
        W['promises'] = pr
        if model in ('M2', 'M6') or True:
            md = (Policy('passive', seed) if model == 'M0' else pol).mandate(W, -100 - se)
            W['mandate'] = md
            ctx.decide('mandate', lambda n: 0, 1, cat='club')
        if model == 'M4':
            pk = pol.projects(W, -200 - se)
            W['proj'] = [{'k': k, 'prog': 0, 'done': False} for k in pk]
            ctx.decide('projects', lambda n: 0, 1, cat='project')
        # the director's summer: budget from the mandate, signings by his eye
        rr = R(seed, 'summer', se)
        budget = clamp(W['cash'] * (0.35 - 0.15 * W['mandate']['prudence']), 0, 60)
        W['cash'] -= budget
        W['strength'] += budget / 12 * (0.4 + W['td']['eye']) + rr.gauss(0, .8) - 0.6   # ageing
        smin, cmin = 999, 999
        for wk in range(1, P['weeks'] + 1):
            W['week'] = wk
            run_delayed(W, P)
            week_issues(W, P, model, pol, ctx)
            play_match(W, P, model, pol, ctx)
            # money, mood decay, morale drift
            income = 10 + (support(W) - 50) * .08 + (2 if wk % 2 else 0)
            wages = 11 + (W['strength'] - 50) * .12
            W['cash'] += income - wages
            for g in W['groups']: g['mood'] = clamp(g['mood'] - P['decay'] * P['size_factor'], 0, 100)
            W['morale'] += (55 - W['morale']) * .05
            for p in W['players']: p['morale'] += (58 - p['morale']) * .04
            sp = support(W); W['support_hist'].append(sp)
            smin = min(smin, sp); cmin = min(cmin, W['cash'])
            checkpoints[(se, wk)] = {'support': sp, 'points': W['points'], 'cash': W['cash'], 'strength': W['strength']}
            if W['cash'] < -60:
                W['alive'] = False; W['reason'] = 'bankrupt'; break
        pos = position(W)
        kept = {'top_half': pos <= 8, 'balance': W['cash'] >= W['cash_start'] - 5, 'youth': W['youth_promoted'] >= 1,
                'derby': W['derby_pts'] >= 3, 'no_sale': W['key_sold'] == 0}
        pscore = sum(2 if kept[p] else -3 for p in W['promises'])
        agm = support(W) + pscore + R(seed, 'agm', se).gauss(0, 1.5)
        alive = W['alive'] and agm >= 50
        W['season_stats'].append({'season': se, 'agm': agm, 'support_end': support(W), 'points': W['points'], 'pos': pos,
                                  'cash': W['cash'], 'strength': W['strength'], 'smin': smin, 'cmin': cmin,
                                  'promises_kept': sum(kept[p] for p in W['promises']), 'alive': alive,
                                  'coach_q': W['coach']['q'], 'td_eye': W['td']['eye'], 'fin_comp': W['fin']['comp'],
                                  'fired': W['fired']})
        if not alive:
            if W['alive']: W['reason'] = 'voted_out'
            W['alive'] = False
            break
        for g in W['groups']: g['mood'] = clamp(g['mood'] + (58 - g['mood']) * .3, 0, 100)   # summer: a fresh start, partly
    return {'seed': seed, 'model': model, 'policy': pkind, 'seasons': W['season_stats'], 'alive': W['alive'],
            'reason': W['reason'], 'decisions': ctx.decisions, 'counts': ctx.counts, 'checkpoints': checkpoints,
            'log': W['log'], 'hist': W['support_hist']}
