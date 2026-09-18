# @stealthscale/theme-pebble

`@stealthscale/theme-pebble` states Pebble: a web application in plain neutrals with a black primary
button, ten-pixel corners and Geist. The pages are white and near black, the surfaces are steps of a
neutral ramp, the primary button is the inverse of the page, and every hue has a ramp of its own.

## Install

```bash
pnpm add @stealthscale/theme-pebble
```

The theme peers on `@stealthscale/theme` and depends on `@fontsource-variable/geist` and
`@fontsource-variable/geist-mono`, which the application's stylesheet imports. An application lists
it in `theme.config.ts` and a page switches to it with `data-theme="pebble"`.

## The values

- Every ramp has eleven steps keyed 50 to 950, written in OKLCH and read in both modes. The neutral
  ramp includes `white` and `black` at its ends.
- The semantic palettes point at the hues: accent at blue, error at red, info at blue, neutral at
  gray, primary at gray, secondary at blue, success at green, warning at orange. The primary palette
  is the neutral one. The accent and the secondary palette are the blue.
- The face is Geist from `@fontsource-variable/geist` and the code face is Geist Mono from
  `@fontsource-variable/geist-mono`, each over a system stack.
- The corners are 6, 8 and 10 pixels.
- The shadows are six heights of a soft double shadow, the same in both modes, with an inner shadow.
- Every hue of the contract has a ramp of its own.

## The gate

`vp test` runs each theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 4.5:1 and every line and ring at
3:1. The text ratio is WCAG 1.4.3, the level the theme is drawn to, and the foundation itself is
checked at 7:1. Each role is placed on a step of its ramp. Where a pair does not reach the ratio at
that step, the role is placed one step along the ramp, away from the page.
