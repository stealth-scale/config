# @stealthscale/theme-steel

`@stealthscale/theme-steel` states Steel: an enterprise product on plain greys with a cobalt blue,
square corners and IBM Plex. The pages are white and near black, the layers alternate between them,
the corners are square, and the primary button is a cobalt blue.

## Install

```bash
pnpm add @stealthscale/theme-steel
```

The theme peers on `@stealthscale/theme` and depends on `@fontsource-variable/ibm-plex-sans` and
`@fontsource/ibm-plex-mono`, which the application's stylesheet imports. An application lists it in
`theme.config.ts` and a page switches to it with `data-theme="steel"`.

## The values

- Every ramp has ten steps, keyed 10 to 100 and read in both modes. The neutral ramp includes
  `white` as its first step.
- The semantic palettes point at the hues: accent at teal, error at red, info at blue, neutral at
  gray, primary at blue, secondary at purple, success at green, warning at yellow. The status
  palettes point at the hues the support colors are drawn in: blue for information, green for
  success, yellow for a warning and red for an error.
- The face is IBM Plex Sans from `@fontsource-variable/ibm-plex-sans` and the code face is IBM Plex
  Mono from `@fontsource/ibm-plex-mono`.
- The corners are square: every radius is zero.
- The shadows are the foundation's, cast in a neutral grey.
- The indigo ramp is the foundation's.

## The gate

`vp test` runs each theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 4.5:1 and every line and ring at
3:1. The text ratio is WCAG 1.4.3, the level the theme is drawn to, and the foundation itself is
checked at 7:1. Each role is placed on a step of its ramp. Where a pair does not reach the ratio at
that step, the role is placed one step along the ramp, away from the page.

## Variants

- `steel-gray` (`steelGray`): Steel on grey pages, with white and charcoal layers lifting off them.

Each variant is derived from Steel with `extends` and states what differs: its ramps, its surfaces
and its role tables.
