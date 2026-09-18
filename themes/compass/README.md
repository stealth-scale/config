# @stealthscale/theme-compass

`@stealthscale/theme-compass` states Compass: a team product on soft neutrals with a bright blue, a
lime success and small corners. The pages are white and near black, the surfaces are steps of a
neutral ramp, and the blue is used for links, selection and the primary button.

## Install

```bash
pnpm add @stealthscale/theme-compass
```

The theme peers on `@stealthscale/theme` and depends on `@fontsource-variable/ubuntu-sans` and
`@fontsource-variable/ubuntu-sans-mono`, which the application's stylesheet imports. An application
lists it in `theme.config.ts` and a page switches to it with `data-theme="compass"`.

## The values

- Every hue ramp runs 100 to 1000 with half steps at 250 and 850, read in both modes. The neutral
  ramp has a light scale of twelve steps and a dark one of fifteen. Each hue has a light ramp and a
  dark one, nested under it.
- The semantic palettes point at the hues: accent at teal, error at red, info at blue, neutral at
  gray, primary at blue, secondary at purple, success at green, warning at orange. Success is the
  lime, a warning is the orange, an error is the red, information is the blue and discovery is the
  purple.
- The face is Ubuntu Sans from `@fontsource-variable/ubuntu-sans` and the code face is Ubuntu Sans
  Mono from `@fontsource-variable/ubuntu-sans-mono`, each over a system stack.
- The corners are 4, 6 and 8 pixels.
- The shadows are the foundation's, cast in the neutral's own cool hue.
- The cyan, indigo ramps are the foundation's.

## The gate

`vp test` runs each theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 4.5:1 and every line and ring at
3:1. The text ratio is WCAG 1.4.3, the level the theme is drawn to, and the foundation itself is
checked at 7:1. Each role is placed on a step of its ramp. Where a pair does not reach the ratio at
that step, the role is placed one step along the ramp, away from the page.

## Variants

- `compass-contrast` (`compassContrast`): Compass at increased contrast in both modes.

Each variant is derived from Compass with `extends` and states what differs: its ramps, its surfaces
and its role tables.
