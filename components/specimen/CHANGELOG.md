# @stealthscale/specimen

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
