# @stealthscale/specimen

## 0.2.0

### Minor Changes

- [#34](https://github.com/stealth-scale/config/pull/34) [`6990b94`](https://github.com/stealth-scale/config/commit/6990b94cfcab5367951c5feb18e59104cfcd5051) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - publish the catalogue, not only what a specimen is written with
  
  - `Catalogue`, `Rail` and `Page` draw the pages a build indexed, and `grouped`, `declared` and
    `parted` are the shaping behind them.
  - `Catalogue` takes the pages as a prop rather than importing `virtual:specimen-index`, so the
    package draws a catalogue without the build plugin in its own graph and a specification renders
    one without a build.
  - `parted` splits what a part accepts into the variants a theme moves and the options a caller sets,
    each row carrying the members of every named type it refers to, with the dropped counts beside
    them.
  - The catalogue's own words are keys under the `specimen` namespace in `locales/en/specimen.json`.
    An application renames one by declaring the same key, because the plugin reads packages deepest
    first and the application last.
  - The package peers on `@stealthscale/component-actions`, `@stealthscale/provider-i18n` and
    `@stealthscale/vite-plugin-specimen` beside what it already peered on.
  
  86 tests, 100% on all four metrics.

- [#34](https://github.com/stealth-scale/config/pull/34) [`447426a`](https://github.com/stealth-scale/config/commit/447426a6f4806535a258a70d608c5bc12c7ac441) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - publish the routes a catalogue is built from, and list the rail from them
  
  - `declarations` gives one route per indexed page, carrying no leading slash, so every page hangs
    beneath whatever parent an application compiles them under. A parent at `/docs` serves the button
    at `/docs/actions/button` and the package never states the prefix.
  - `Rail` reads declarations rather than the index, so a page an application wrote is listed beside a
    page the plugin found. `Entry` is the shape a declaration carries for it and `entryOf` reads it,
    because the router types `navigation` as `unknown` and a declaration the catalogue did not write
    could hold anything under that name.
  - `grouped` takes declarations and returns the tree the rail draws: groups sorted by name, pages
    sorted by the words their entry carries, and pages naming no group under a heading of their own,
    last.
  - `Catalogue` is the simple frame and takes `declarations` in place of `listed`. An application
    wanting a top bar, a search or a switcher passes its own frame under `FRAME` and places `Rail`
    inside it.
  - `layouts`, `FRAME` and `routeId` are the wiring. The package builds no router and states no
    address of its own.
  
  111 tests, 100% on all four metrics.

### Patch Changes

- Updated dependencies [[`a4b1d24`](https://github.com/stealth-scale/config/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`d577ce3`](https://github.com/stealth-scale/config/commit/d577ce3a013b0af1f6cd2dce358f496382a58616), [`a4b1d24`](https://github.com/stealth-scale/config/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`e94c22a`](https://github.com/stealth-scale/config/commit/e94c22a6c39e1c13d8f99b46334ae8ecc7b65192)]:
  - @stealthscale/component-layout@0.2.0
  - @stealthscale/component-typography@0.2.0
  - @stealthscale/component-actions@0.1.1
  - @stealthscale/vite-plugin-specimen@0.2.0
  - @stealthscale/provider-i18n@0.1.0
  - @stealthscale/provider-router@0.1.0

## 0.1.0

### Minor Changes

- [#29](https://github.com/stealth-scale/config/pull/29) [`dd8f5e8`](https://github.com/stealth-scale/config/commit/dd8f5e823522d0becdd3218f1a2076fa6ad696d4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - add what a specimen is written with
  
  - `specimen()` and `scene()` declare a page and the things drawn on it. The index plugin parses the
    call out of the source and never evaluates it.
  - `Matrix` draws one captioned cell per value of an axis, with `of`, `knob` and `label` describing
    the axis and `direction` the arrangement.
  - Draw the arrangement as `Stack` and the caption as `Text`, so the package states no recipe and
    registers no preset.
  - Write both arrangements out rather than forwarding `direction` to one stack, because the compiler
    extracts a JSX literal and not a value read from a prop.
  
  27 tests, 100% on all four metrics.
