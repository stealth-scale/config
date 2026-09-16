# @stealthscale/vite-config-plain

## 0.2.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`0329828`](https://github.com/stealth-scale/config/commit/032982862d632ccab5fc0478469056c13bf0c3e3) Thanks [@stealth-admin](https://github.com/stealth-admin)! - vite-config-plain: publish the configuration the kernel and the plugins are packed under
  
  - `plain` is one `UserConfig` with the `pack`, `resolve`, `ssr` and `test` blocks the node tier
    states.
  - `vite-config-core`, `vite-plugin-base` and `vite-plugin-sbom` import it. Each carried a copy
    before.
  - `README.md` ships in the tarball, covering the four blocks `plain` sets and the two the node tier
    adds on top of them.
  - `description` is a sentence naming what the package does.
