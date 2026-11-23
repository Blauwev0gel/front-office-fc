# Northmarch V18.3 — gecontroleerde release

- Release: **V18.3 — Matchday & The Northmarch Echo**
- Publieke URL: https://blauwev0gel.github.io/front-office-fc/northmarch/
- Artefact: `releases/northmarch/v18.3.html` (zelfstandige, speelbare HTML)
- SHA-256 van aangeleverde artefact: `faefa3df588b42a40fa6cc63da5ae7b409ec90f2ae82210107f1ba15fb2f784d`
- Bestandsgrootte: 496510 bytes.
- Geautoriseerde kandidaat: ChatGPT Space `page_2062335ca3288191be57840790450571`.
- Herkomst: gebaseerd op bestaande V18.2.1-release uit `slimline-main`; V18.3 is een standalone gameplay-kandidaat, **niet** een nieuwe deterministische `build.js`-build van `src/`.
- Wijzigingen: wedstrijd centraal; voorbeschouwing, full-time resultaat, wekelijkse Northmarch Echo; krantenarchief; clubverbeteropties.
- Vorige tests (afzonderlijke kandidaat): weekviewer, krantenarchief, vier weken spelen, save/load en oude V18.2.1-save openen geslaagd.
- Beperking: visuele iPhone-/390px-browsertest was niet uitgevoerd vóór publicatie; geen claim van volledige mobiele QA.
- Publicatiemethode: één push op `main` activeert de bestaande `Publish game versions` GitHub Pages-workflow, zonder nieuwe workflow en zonder Slimline-CI-push.
- `slimline-main` blijft intact. De workflow pinnt `/northmarch/` bewust op dit releasebestand totdat een volgende release expliciet wordt goedgekeurd.
