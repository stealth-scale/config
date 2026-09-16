---
"@stealthscale/vite-config-typescript": minor
---

vite-config-typescript: name the toolchain in types, and include vite.layers.ts

- `base.json` names `vite-plus` in `types`. That entry loads the toolchain's augmentation of Vite's
  `UserConfig`, so a package imports `vite` and still sees `pack`, `lint`, `fmt`, `run`, `staged`
  and `test`.
- `node.json` and `web.json` keep that entry beside their own.
- `base.json` includes `vite.layers.ts` beside `src` and `vite.config.ts`.
- `engines.node` is `>=26.0.0`.
