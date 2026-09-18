# @stealthscale/theme-lantern

`@stealthscale/theme-lantern` states Lantern: an enterprise product on a light grey page with a
daybreak blue, six-pixel corners and a system face. The page is a light grey with white panels, near
black with charcoal panels in dark mode, and a daybreak blue is used for links and the primary
button. The button hovers lighter and presses darker.

## Install

```bash
pnpm add @stealthscale/theme-lantern
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="lantern"`.

## The values

- Every hue has ten steps keyed 1 to 10, with a dark ramp nested under the light one. The neutral
  ramp is keyed from 1 at the lightest step, fourteen steps in light mode and fourteen in dark. Each
  hue has a light ramp and a dark one, nested under it.
- The semantic palettes point at the hues: accent at cyan, error at red, info at blue, neutral at
  gray, primary at blue, secondary at indigo, success at green, warning at yellow. Information is
  the blue, success the green, a warning the gold and an error the red. The secondary palette is the
  geek blue and the accent the cyan.
- The face is the system stack, and so is the code face.
- The corners are 4, 6 and 8 pixels.
- The shadows are three heights of a triple soft shadow in each mode.
- The teal ramp is the foundation's.

## The gate

`vp test` runs each theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 4.5:1 and every line and ring at
3:1. The text ratio is WCAG 1.4.3, the level the theme is drawn to, and the foundation itself is
checked at 7:1. Each role is placed on a step of its ramp. Where a pair does not reach the ratio at
that step, the role is placed one step along the ramp, away from the page.
