# @stealthscale/vite-config-typescript

## 0.2.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`2a0aaf2`](https://github.com/stealth-scale/config/commit/2a0aaf2f41b67bcee797d637f83a41a5d4840257) Thanks [@stealth-admin](https://github.com/stealth-admin)! - vite-config-typescript: name the toolchain in types, and include vite.layers.ts
  
  - `base.json` names `vite-plus` in `types`. That entry loads the toolchain's augmentation of Vite's
    `UserConfig`, so a package imports `vite` and still sees `pack`, `lint`, `fmt`, `run`, `staged`
    and `test`.
  - `node.json` and `web.json` keep that entry beside their own.
  - `base.json` includes `vite.layers.ts` beside `src` and `vite.config.ts`.
  - `engines.node` is `>=26.0.0`.
  - `README.md` ships in the tarball, listing every compiler option the three configurations set and
    what each one is for.
  - `description` is a sentence naming what the package does.

## 0.1.1

### Patch Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - The readme installs with pnpm, which is what this repository is built and released under. The three
  configs are unchanged.
