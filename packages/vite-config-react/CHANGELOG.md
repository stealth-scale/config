# @stealthscale/vite-config-react

## 0.2.0

### Minor Changes

- [`9ce239c`](https://github.com/stealth-scale/config/commit/9ce239c615561f89c6050c2df118867bf4ea3d71) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Stop enabling the `react-perf` lint plugin. Every rule it carries asks for a value to be memoised by
  hand — an array, an object, a function or an element passed as a prop — and this package turns the
  React Compiler on by default, which memoises all four. A repository taking `react.workspace()` got
  both, so it was told to write out memoisation the compiler had already done, giving the compiler
  more to reason about for an answer it had reached on its own. A repository that turns the compiler
  off wants those rules and contributes the plugin to `lint.plugins` itself.

## 0.1.1

### Patch Changes

- [`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - The readme installs with pnpm, which is what this repository is built and released under. No layer
  and no export changes.
- Updated dependencies [[`906a7ba`](https://github.com/stealth-scale/config/commit/906a7ba7b462da21e62d693b01902c042f41788b)]:
  - @stealthscale/vite-config@0.1.1
