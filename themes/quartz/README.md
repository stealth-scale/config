# @stealthscale/theme-quartz

`@stealthscale/theme-quartz` states Quartz: a productivity suite on plain greys with a deep blue
brand, four-pixel corners and Roboto. The pages are white and a deep grey, the surfaces are steps of
a fifty-step grey ramp, and the brand blue is used for links, selection and the primary button.

## Install

```bash
pnpm add @stealthscale/theme-quartz
```

The theme peers on `@stealthscale/theme` and depends on `@fontsource-variable/roboto`, which the
application's stylesheet imports. An application lists it in `theme.config.ts` and a page switches
to it with `data-theme="quartz"`.

## The values

- The brand ramp is keyed 160 to 10 from light to dark, the neutral ramp 2 to 98 with `white` and
  `black` at its ends, and each shared hue `tint60` to `shade50`.
- The semantic palettes point at the hues: accent at teal, error at red, info at blue, neutral at
  gray, primary at blue, secondary at purple, success at green, warning at orange. The status
  palettes point at the hues the status colors are drawn in: green for success, orange for a warning
  and the cranberry red for an error.
- The face is Roboto from `@fontsource-variable/roboto` over a system stack, and the code face is a
  system monospace stack.
- The corners are 4, 6 and 8 pixels.
- The shadows are six heights of a soft double shadow in each mode.
- The indigo ramp is the foundation's.

## The gate

`vp test` runs each theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 4.5:1 and every line and ring at
3:1. The text ratio is WCAG 1.4.3, the level the theme is drawn to, and the foundation itself is
checked at 7:1. Each role is placed on a step of its ramp. Where a pair does not reach the ratio at
that step, the role is placed one step along the ramp, away from the page.
