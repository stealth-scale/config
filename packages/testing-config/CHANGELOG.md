# @stealthscale/testing-config

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
