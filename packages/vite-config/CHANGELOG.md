# @stealthscale/vite-config

## 0.1.3

### Patch Changes

- [`832b1fc`](https://github.com/stealth-scale/config/commit/832b1fc81046254fa62560e6deeb91125c177073) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Stop `require-jsdoc` writing docblocks. Its fixer inserts an empty block — `/**`, ` *`, ` */` —
  which satisfies nothing: it fails the formatter, it fails `no-blank-blocks` and
  `require-description`, and it takes the report away from the one rule that said what was missing.
  Running `vp check --fix` over a repository that had not documented much filled it with them, and
  each run left the tree in a state the next check reported differently. A docblock is the one fix a
  machine cannot write, so the author writes it.

## 0.1.2

### Patch Changes

- [`ab5f551`](https://github.com/stealth-scale/config/commit/ab5f5515a0631589b1b6e6736b65b6890069c3e8) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Import `@module-federation/vite` at the moment a config asks for the plugin. The package is declared
  an optional peer, and `federation.host()` and `federation.remote()` imported it at the top of their
  modules — which the barrel re-exports, so loading `@stealthscale/vite-config` at all failed for a
  repository that federates nothing and had never installed it. Only a config stating a host or a
  remote needs it now.
  
  Where it is genuinely missing, the error names it and says why it is optional. What the plugin
  itself refuses is passed through untouched, rather than reported as a package to go and install.

## 0.1.1

### Patch Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - The readme installs with pnpm, which is what this repository is built and released under. No layer
  and no export changes.
- Updated dependencies [[`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b), [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b)]:
  - @stealthscale/vite-config-core@0.2.0
  - @stealthscale/vite-plugin-sbom@0.2.0
