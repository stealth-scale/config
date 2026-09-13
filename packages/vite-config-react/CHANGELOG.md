# @stealthscale/vite-config-react

## 0.5.1

### Patch Changes

- Updated dependencies [[`99feb93`](https://github.com/stealth-scale/config/commit/99feb93aba0cd59be739827e54409cb6e2381a5a)]:
  - @stealthscale/vite-config@0.3.0

## 0.5.0

### Minor Changes

- [`2fefebb`](https://github.com/stealth-scale/config/commit/2fefebb771539403c4990ddcf40da8d62e9e07e1) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Keep an application's page where Vite looks for it
  
  `layout.page` set the build input and nothing else, so the two halves of an application disagreed:
  the dev server reads `index.html` from the project root, which no layer moved. An application laid
  out the way the house asked for it served a 404 at the URL the dev server printed, and one laid out
  so that development worked could not be built at all.
  
  Both are gone, along with `react.override.page`, which existed only to move the same directory. An
  application keeps `index.html` beside its config, where Vite looks for it and where every other Vite
  project keeps it. A build writes `dist/index.html` rather than `dist/page/index.html`.
  
  **Moving an application over:** move `page/index.html` up to the package root and change the script
  path inside it from `../src/…` to `./src/…`. Drop any `layout.page(…)` or `react.override.page(…)`
  from the config. Whatever serves the build now points at the output directory rather than a
  directory inside it.

### Patch Changes

- Updated dependencies [[`2fefebb`](https://github.com/stealth-scale/config/commit/2fefebb771539403c4990ddcf40da8d62e9e07e1)]:
  - @stealthscale/vite-config@0.2.0

## 0.4.1

### Patch Changes

- [`2c6a7f1`](https://github.com/stealth-scale/config/commit/2c6a7f1c3025c450648ddb1df2e4458cc9856213) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - State the test environment from the tiers rather than from the workspace preset. The previous
  release put `test.document()` at the root on the reasoning that the runner reads its environment
  from the root config, and that is wrong: `test.projects` makes every package a project of its own,
  and a project is configured by its own config rather than by the root's. A rendering specification
  still met `document is not defined`, which is what the root layer was added to prevent.
  
  `test.cleanup()` was already in the tiers for exactly this reason, and the two belong together: a
  package that needs a document to draw into is the same package that needs it emptied afterwards.

## 0.4.0

### Minor Changes

- [`a1e8a24`](https://github.com/stealth-scale/config/commit/a1e8a245ee7c31c7036bb018cb3530ccdea33ffb) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Give the runner a document to draw into. A workspace holding anything that renders needs one
  everywhere, and the runner takes its environment from the root config — so every repository taking
  this package had to know to state `test.environment` itself, and one that did not met
  `document is not defined` on its first rendering specification. That reads as a broken test rather
  than as a missing setting.
  
  `happy-dom` rather than jsdom, because a theme follows the reader's colour-mode preference and jsdom
  has never implemented media queries. It is now a peer of this package rather than an optional one of
  the toolchain, since a repository that renders is not optional about having somewhere to render. A
  repository testing against something else takes `test.environment(happy-dom)` back by name.

### Patch Changes

- Updated dependencies [[`a1e8a24`](https://github.com/stealth-scale/config/commit/a1e8a245ee7c31c7036bb018cb3530ccdea33ffb)]:
  - @stealthscale/vite-config@0.1.5

## 0.3.0

### Minor Changes

- [`a9a46cf`](https://github.com/stealth-scale/config/commit/a9a46cfa1c2960e84cfb3fe505632b4dc3dfbb58) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Excuse a specification written as markup the docblock rules, as the toolchain already excuses one
  written as plain TypeScript. `lint.preset.web()` had the globs for it, but `lint` is read from the
  root config and nowhere else, and a root takes the node tier whatever its packages render — so the
  tier holding that answer was never the one the linter read. A `.spec.tsx` was therefore held to a
  standard the same file in `.ts` is excused, which in a component library is every specification
  there is.

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
