# Action callsite inventory — source literal controls

Derived from literal data-a attributes in numbered UI fragments. **This does not catch dynamic property-based construction, JS-generated event dispatch or controls built outside UI fragments.** The full handler registry is 10-ACTION-REGISTRY.md. An action can be referenced in several source modules.

## UI modules 00–07

| Action attribute | Source modules with literal reference |
|---|---|
| acad-close | src/ui/05-pitches-squad-money.js |
| ag | src/ui/05-pitches-squad-money.js |
| close | src/ui/06-sheets-ticker.js |
| col | src/ui/02-setup.js |
| continue | src/ui/02-setup.js |
| db-talk | src/ui/03-summer-preseason-press.js |
| dd-dec | src/ui/03-summer-preseason-press.js |
| dd-pause | src/ui/03-summer-preseason-press.js |
| dd-skip | src/ui/03-summer-preseason-press.js |
| dept-go | src/ui/05-pitches-squad-money.js, src/ui/07-club-league.js |
| dept-plan | src/ui/06-sheets-ticker.js |
| dhire | src/ui/06-sheets-ticker.js |
| dna | src/ui/02-setup.js |
| end | src/ui/06-sheets-ticker.js |
| fire | src/ui/06-sheets-ticker.js |
| fo-squad | src/ui/05-pitches-squad-money.js |
| found | src/ui/02-setup.js |
| ft-sack | src/ui/06-sheets-ticker.js |
| hire | src/ui/06-sheets-ticker.js |
| hire-all | src/ui/02-setup.js |
| hire-tab | src/ui/02-setup.js |
| lfull | src/ui/07-club-league.js |
| lt | src/ui/07-club-league.js |
| mand-done | src/ui/02-setup.js |
| mand-save | src/ui/06-sheets-ticker.js |
| mand-tab | src/ui/02-setup.js |
| mt-ans | src/ui/03-summer-preseason-press.js |
| new | src/ui/02-setup.js |
| pick | src/ui/02-setup.js |
| player | src/ui/03-summer-preseason-press.js, src/ui/05-pitches-squad-money.js |
| pre-acad | src/ui/03-summer-preseason-press.js |
| pre-advice | src/ui/03-summer-preseason-press.js |
| pre-done | src/ui/03-summer-preseason-press.js |
| pre-step | src/ui/03-summer-preseason-press.js |
| pre-target | src/ui/03-summer-preseason-press.js |
| preset | src/ui/02-setup.js |
| press | src/ui/03-summer-preseason-press.js |
| press-next | src/ui/03-summer-preseason-press.js |
| prio-all | src/ui/02-setup.js |
| prop | src/ui/05-pitches-squad-money.js |
| push | src/ui/06-sheets-ticker.js |
| quick | src/ui/06-sheets-ticker.js |
| rec-appr | src/ui/02-setup.js |
| rec-kind | src/ui/02-setup.js |
| rec-prio | src/ui/02-setup.js |
| recplan | src/ui/05-pitches-squad-money.js |
| review | src/ui/06-sheets-ticker.js |
| ru-set | src/ui/02-setup.js |
| s-back | src/ui/02-setup.js |
| s-next | src/ui/02-setup.js |
| s2-finish | src/ui/03-summer-preseason-press.js |
| s2-step | src/ui/03-summer-preseason-press.js |
| sheet | src/ui/02-setup.js, src/ui/04-masthead-news.js, src/ui/05-pitches-squad-money.js, src/ui/06-sheets-ticker.js, src/ui/07-club-league.js |
| tab | src/ui/04-masthead-news.js, src/ui/05-pitches-squad-money.js, src/ui/07-club-league.js |
| tab-close | src/ui/06-sheets-ticker.js |
| talk-do | src/ui/06-sheets-ticker.js |
| talk-who | src/ui/06-sheets-ticker.js |
| target | src/ui/03-summer-preseason-press.js, src/ui/05-pitches-squad-money.js |
| tick-close | src/ui/06-sheets-ticker.js |
| tick-skip | src/ui/06-sheets-ticker.js |
| tick-speed | src/ui/06-sheets-ticker.js |
| tk-ans | src/ui/03-summer-preseason-press.js |
| tk-pause | src/ui/03-summer-preseason-press.js |
| tk-skip | src/ui/03-summer-preseason-press.js |
| tour-reset | src/ui/06-sheets-ticker.js |
| unpick | src/ui/02-setup.js |
| veil | src/ui/06-sheets-ticker.js |
| ysack | src/ui/05-pitches-squad-money.js |

## UI modules 08–16

| Action attribute | Source modules with literal reference |
|---|---|
| acad-close | src/ui/09-firstteam-review.js |
| ag | src/ui/09-firstteam-review.js |
| auth | src/ui/08-departments.js |
| biz-lv | src/ui/08-departments.js |
| biz-prop | src/ui/08-departments.js |
| brief | src/ui/12-scenes-cards.js |
| close-open | src/ui/12-scenes-cards.js |
| com-exp | src/ui/08-departments.js |
| com-offer | src/ui/08-departments.js |
| com-price | src/ui/08-departments.js |
| com-promo | src/ui/08-departments.js |
| dcand | src/ui/08-departments.js |
| dept | src/ui/08-departments.js, src/ui/09-firstteam-review.js |
| dept-go | src/ui/12-scenes-cards.js |
| dept-meeting | src/ui/08-departments.js |
| dinbox | src/ui/08-departments.js |
| dismiss | src/ui/12-scenes-cards.js |
| dletgo | src/ui/08-departments.js |
| dtab | src/ui/08-departments.js |
| ed-open | src/ui/14-matchday-gazette.js |
| filt | src/ui/10-inbox.js |
| ft-ans | src/ui/09-firstteam-review.js |
| ft-buy | src/ui/09-firstteam-review.js |
| ft-cancel | src/ui/09-firstteam-review.js |
| ft-sackq | src/ui/08-departments.js, src/ui/09-firstteam-review.js |
| ft-talk | src/ui/08-departments.js, src/ui/09-firstteam-review.js |
| ft-talk-close | src/ui/09-firstteam-review.js |
| mchoose | src/ui/13-redbox-render.js |
| md-after | src/ui/14-matchday-gazette.js |
| md-close | src/ui/14-matchday-gazette.js |
| md-done | src/ui/14-matchday-gazette.js |
| md-kick | src/ui/14-matchday-gazette.js |
| md-resume | src/ui/14-matchday-gazette.js |
| md-skip | src/ui/14-matchday-gazette.js |
| md-speed | src/ui/14-matchday-gazette.js |
| mk-camp | src/ui/08-departments.js |
| mk-comm | src/ui/08-departments.js |
| mnext | src/ui/13-redbox-render.js |
| next-season | src/ui/09-firstteam-review.js |
| open | src/ui/10-inbox.js, src/ui/12-scenes-cards.js |
| play | src/ui/10-inbox.js |
| player | src/ui/08-departments.js, src/ui/09-firstteam-review.js, src/ui/12-scenes-cards.js, src/ui/14-matchday-gazette.js |
| ptab | src/ui/11-players.js |
| pw-ask | src/ui/10-inbox.js |
| pw-change | src/ui/10-inbox.js |
| pw-open | src/ui/08-departments.js |
| replay | src/ui/12-scenes-cards.js, src/ui/14-matchday-gazette.js |
| restart | src/ui/09-firstteam-review.js |
| rx-focus | src/ui/08-departments.js |
| rx-invest | src/ui/08-departments.js |
| second | src/ui/13-redbox-render.js |
| sheet | src/ui/08-departments.js, src/ui/09-firstteam-review.js, src/ui/10-inbox.js |
| squad-plan-ask | src/ui/08-departments.js |
| squad-plan-open | src/ui/13-redbox-render.js |
| tab | src/ui/09-firstteam-review.js, src/ui/10-inbox.js, src/ui/13-redbox-render.js |
| tour-ok | src/ui/13-redbox-render.js |

## Reconciliation rule

Compare these literal callsites with all 125 switch cases in 10-ACTION-REGISTRY.md. No source literal alone proves accessibility or successful execution; handlers with no literal callsite may be dynamically constructed or dead. All must be explicitly classified by implementation, including event-specific dynamic routes.
