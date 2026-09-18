# @stealthscale/theme-graphite

`@stealthscale/theme-graphite` states Graphite: a developer's product on cool greys, with a blue
accent, a green call to action and Mona Sans. The pages are cool greys, links and selection are
blue, the primary button is green, and every surface is a step of the neutral ramp.

## Install

```bash
pnpm add @stealthscale/theme-graphite
```

The theme peers on `@stealthscale/theme` and depends on `@fontsource-variable/mona-sans`, which the
application's stylesheet imports. An application lists it in `theme.config.ts` and a page switches
to it with `data-theme="graphite"`.

## The values

- The neutral ramp has fourteen steps and each hue ten, keyed 0 to 13 and 0 to 9. A dark ramp has
  one more step, `tint`, for the quiet fill of a palette on a dark page. Each hue has a light ramp
  and a dark one, nested under it.
- The semantic palettes point at the hues: accent at green, error at red, info at blue, neutral at
  gray, primary at blue, secondary at purple, success at green, warning at yellow. The primary
  button is green, so the accent palette is the green one, and the blue is the primary palette, as
  it is for links and selection.
- The face is Mona Sans from `@fontsource-variable/mona-sans`, over a system stack, and the code
  face is a system monospace stack.
- The corners are 3, 6 and 12 pixels.
- The shadows are two resting shadows and three floating ones in each mode, with an inset line.
- The cyan, indigo, teal ramps are the foundation's.

## The gate

`vp test` runs each theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 4.5:1 and every line and ring at
3:1. The text ratio is WCAG 1.4.3, the level the theme is drawn to, and the foundation itself is
checked at 7:1. Each role is placed on a step of its ramp. Where a pair does not reach the ratio at
that step, the role is placed one step along the ramp, away from the page.

## Variants

- `graphite-dimmed` (`graphiteDimmed`): Graphite with a dimmed dark mode: a softer dark page for
  long sessions.
- `graphite-contrast` (`graphiteContrast`): Graphite at high contrast in both modes.

Each variant is derived from Graphite with `extends` and states what differs: its ramps, its
surfaces and its role tables.
