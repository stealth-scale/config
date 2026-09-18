# @stealthscale/theme-asphalt

`@stealthscale/theme-asphalt` states Asphalt: a mobility product in black and white, with a blue
accent, eight-pixel corners and Inter. The primary button is black on white and light grey on near
black, the accent is blue, and every surface is a plain grey.

## Install

```bash
pnpm add @stealthscale/theme-asphalt
```

The theme peers on `@stealthscale/theme` and depends on `@fontsource-variable/inter`, which the
application's stylesheet imports. An application lists it in `theme.config.ts` and a page switches
to it with `data-theme="asphalt"`.

## The values

- Every ramp has ten steps keyed 50 to 900. The neutral ramp includes `white` and `black` at its
  ends, and the hues with a dark ramp of their own nest it under the light one. Each hue has a light
  ramp and a dark one, nested under it.
- The semantic palettes point at the hues: accent at blue, error at red, info at blue, neutral at
  gray, primary at gray, secondary at blue, success at green, warning at yellow. The primary palette
  is the neutral one, so the primary button is black on white. The accent and the secondary palette
  are the blue.
- The face is Inter from `@fontsource-variable/inter` over a system stack, and the code face is a
  system monospace stack.
- The corners are 4, 8 and 12 pixels.
- The shadows are four heights of a single soft shadow, the same in both modes.
- The cyan ramp is the foundation's.

## The gate

`vp test` runs each theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 4.5:1 and every line and ring at
3:1. The text ratio is WCAG 1.4.3, the level the theme is drawn to, and the foundation itself is
checked at 7:1. Each role is placed on a step of its ramp. Where a pair does not reach the ratio at
that step, the role is placed one step along the ramp, away from the page.
