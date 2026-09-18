# @stealthscale/theme-prism

`@stealthscale/theme-prism` states Prism: a creative tool on cool greys with an indigo-blue accent,
eight-pixel corners and Source Sans. The pages are white and near black, the layers are steps of a
thirteen-step grey ramp, and an indigo-blue is used for the accent, links and the primary button.

## Install

```bash
pnpm add @stealthscale/theme-prism
```

The theme peers on `@stealthscale/theme` and depends on `@fontsource-variable/source-sans-3` and
`@fontsource-variable/source-code-pro`, which the application's stylesheet imports. An application
lists it in `theme.config.ts` and a page switches to it with `data-theme="prism"`.

## The values

- Every hue has sixteen steps keyed 100 to 1600, and the neutral ramp thirteen keyed 25 to 1000.
  Each hue has a light ramp and a dark one, nested under it.
- The semantic palettes point at the hues: accent at indigo, error at red, info at blue, neutral at
  gray, primary at blue, secondary at purple, success at green, warning at orange. The accent and
  information are the blue, success the green, a warning the orange and an error the red. The
  secondary palette is the purple and the accent's neighbour the indigo.
- The face is Source Sans 3 from `@fontsource-variable/source-sans-3` and the code face is Source
  Code Pro from `@fontsource-variable/source-code-pro`, each over a system stack.
- The corners are 4, 8 and 10 pixels.
- The shadows are the foundation's, cast in a neutral grey.
- Every hue of the contract has a ramp of its own.

## The gate

`vp test` runs each theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 4.5:1 and every line and ring at
3:1. The text ratio is WCAG 1.4.3, the level the theme is drawn to, and the foundation itself is
checked at 7:1. Each role is placed on a step of its ramp. Where a pair does not reach the ratio at
that step, the role is placed one step along the ramp, away from the page.
