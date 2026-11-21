# L1/L2 — Screen & Action Inventory (audit, vóór herontwerp)

Gemeten op commit `d94fcf3`, 390×844 px, nieuw spel (Pell United), week 4. Hoogte = volledige paginalengte.

| # | Scherm | Bereikbaar via | Toont | Acties (cmd) | Hoogte | Problemen |
|---|---|---|---|---|---|---|
| 1 | Titel | start | rol, nieuw/doorgaan | — | 1 | Rol in één zin; geen uitleg van verantwoordelijkheden |
| 2 | Clubkeuze | Titel → New game; na wegstemmen | 3 stoelen: divisie, selectie, aanhang, geld | `chooseClub` | 1 | Goed |
| 3 | Week | tab Week | Echo-verslag, signalen, voorbeschouwing, doelen, hub Ground/Money, **Play** | `advanceWeek`, `closeSeason` | 1,9 | **Play-knop onder de vouw** (y=1445); signalen mengen urgent en informatief; geen positieverandering na de wedstrijd; verwachte goals (lh/la) niet getoond |
| 4 | Voorbeschouwing/uitslag | in Week | stand, sterkte, vorm, kansen; score, doelpuntenmakers, publiek | — | — | Bij twee duels in een week alleen eerste kop; geen "verdiend?"-inzicht |
| 5 | Competitie, beker, markt, historie | tab Tables (6 subtabs) | 3 standen, beker, transfers, erelijst | club openen | 1,4 | Zes knoppen in twee rijen; naam "Tables" dekt Market/History niet |
| 6 | Selectie + spelersprofiel | tab Squad, tik speler | sterkte, loonsom, gaten, kaderverwijzing, spelers per positie | `ReleasePlayer` | 3,4 | Lang, maar functioneel; kader verwijst naar Money |
| 7 | Trainer en directeur | Club → blok → overlay | huidige man, kandidaten, kosten | `HireStaff`, `SackStaff`, `RenewStaff` | — | Diep in lange Club-tab; geen vergelijking kandidaat vs huidige; effect niet uitgelegd |
| 8 | Acht afdelingen | Club → kaart → overlay | prestatie vs divisie, personeel, budget, werkwijze, faciliteit | `SetDeptStaff`, `SetDeptBudget`, `SetDeptCourse`, `StartProject` | — | Kaarten tonen kosten/volgende stap; **wanneer effect** alleen bij personeel; structurele kosten per keuze ontbreken grotendeels |
| 9 | Stadion, faciliteiten, bouw | Club → knop of Week-hub → overlay (4 tabs) | zijden, complex, bouwcatalogus, reparaties, grote projecten | `StartProject`, `Repair`, `BuyPlot`, `StartStadium` | — | Overlay in overlay-logica; **twee routes** (Week-hub, Club-knop); bouwcatalogus lang; geen effect op exploitatie |
| 10 | Begroting/prognose | Money → Overview/Budget | kas, schuld, prognose, posten; plan vs koers, kader | `SetSquadPolicy` | 1,2 | Zes subtabs; begroting en overzicht overlappen |
| 11 | Transfers en selectiebeleid | Money → Budget (kader); Tables → Market | loonlimiet, transferdeel, verhuur | `SetSquadPolicy` | — | Kader staat onder Money, markt onder Tables: logisch per functie, maar onvindbaar als "transfers" |
| 12 | Sponsors | Money → Sponsors | contract, naamrecht, aanbiedingen | `SignSponsor` | — | Waarde van een aanbod over de looptijd niet getoond |
| 13 | Financiering | Money → Funding | leningen, obligatie, inzameling, grond | `TakeLoan`, `RepayLoan`, `IssueBond`, `Fundraise`, `SellGround`, `BuyBackGround` | — | Weekbetaling/totale rente van een nieuwe lening niet zichtbaar |
| 14 | Leden, contributie, vertrouwen | Club → bovenaan | leden, vertrouwen, contributie, oorzaken | `SetDues` | — | Effect van contributie op leden/inkomen niet voorspeld |
| 15 | ALV en seizoensreview | na week 30 → Close | stemming, oorzaken, stand, geld, zomer | `closeSeason` | 1,5 | Doelen gehaald/gemist niet per doel; volgende seizoen (doelen, begroting, lopende projecten) niet getoond |
| 16 | Clubhistorie, wereldhistorie | Club → knop; Tables → History | erelijst, records, grafiek, seizoenen, loopbaan | — | — | Knop onderaan lange Club-tab |

**Kernbevindingen schermen:** de Club-tab is een lange stapel (3,9 schermen) van leden, staf, acht afdelingen, grond, vergelijking, historie en lagen zonder overzicht bovenaan; er is geen bestuurlijk overzicht in één oogopslag; de belangrijkste knop (Play) staat onder de vouw; Money en Tables hebben zes subtabs.
