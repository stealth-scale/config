---
"@stealthscale/testing-theme": minor
---

testing-theme: add the distinctness, status and ramp checks and the report

- `distinct.surfaces`, `distinct.inks`, `distinct.lines` and `distinct.fills` report two consecutive
  steps closer than 0.01 in OKLab lightness, in either mode. The pairs of a palette are a quiet fill
  and the next, the solid and its hover, the ink and the muted one, and the line and its hover.
- `status.distinct` reports two status solids closer than 0.05 in OKLab.
- `ramp.monotonic` reports a ramp under `tokens.colors` whose lightness turns back between two
  steps, and `ramp.hue` a step that drifts more than 45 degrees from the ramp's median hue.
- `options.thresholds` takes `distinct`, `status` and `hue` beside the three ratios.
- `report(theme, options)` measures the margins of each class of pair, the lightness between
  consecutive steps, the distance between the statuses for typical vision and under protanopia,
  deuteranopia and tritanopia, and the steps outside sRGB. `formatReport` writes it as Markdown.
- `colorAt`, `rampsOf`, `outsideGamut`, `gamut`, `statusPairs`, `distance`, `distanceFor`,
  `simulated`, `written` and `DEFICIENCIES` are readers a theme specification can build its own
  cases on.
