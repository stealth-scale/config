# @stealthscale/theme-graphite

## 0.1.0

### Minor Changes

- [#32](https://github.com/stealth-scale/config/pull/32) [`74f058f`](https://github.com/stealth-scale/config/commit/74f058f72bc61f672a46f671fc0d36e9e3f68d35) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme-graphite: add the theme with its dimmed and high-contrast variants
  
  - A developer's product on cool greys with a blue accent, a green call to action and Mona Sans.
  - `graphite-dimmed` redraws the dark ramps for a softer dark page, and `graphite-contrast` redraws
    every ramp in both modes.
  - Every ramp is written in OKLCH and keyed by its own steps, and every role sits on a step of its
    ramp. The theme's specification runs it through `violations` at 4.5:1 for text and 3:1 for lines
    and rings, in both modes.

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/config/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0
