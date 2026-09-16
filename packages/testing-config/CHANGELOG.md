# @stealthscale/testing-config

## 0.3.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`df4a6eb`](https://github.com/stealth-scale/config/commit/df4a6eb98d387e86c7c38b7629eab42399789af3) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-config: walk namespaces in plugin.named and require configResolved only
  
  - A factory inside a namespace is called, and its plugin is asked to be named for the dotted path,
    so `theme.runtime()` is asked for `stealth:theme.runtime`.
  - A plugin is asked for `configResolved` and for no other hook. A plugin that serves at `load`
    passes without `generateBundle`.

## 0.2.0

### Minor Changes

- [#17](https://github.com/stealth-scale/config/pull/17) [`cfe3dd7`](https://github.com/stealth-scale/config/commit/cfe3dd7291e7576f1637c7a438415a8ad065586c) Thanks [@stealth-admin](https://github.com/stealth-admin)! - testing-config: publish the conformance suite for config and plugin packages
  
  - `violations({ at, kind, module })` reads a package and returns each part of the house contract it
    breaks, as one sentence per breach.
  - Thirteen checks cover the manifest, the barrel, the README block table, the layers each factory
    returns, the tiers, and a plugin's name and peer.
  - `arguments` supplies what a factory with required parameters is called with. `skip` turns a check
    off with a reason, and `only` narrows a run.
  - `README.md` ships in the tarball, listing all thirteen checks against what each one reports.
  - `description` names the `library` kind beside `config` and `plugin`.
