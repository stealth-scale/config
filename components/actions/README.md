# @stealthscale/component-actions

Draws what a person presses: a button, a toggle, and the triggers that carry an action. Every
component binds a recipe and draws nothing of its own, so a theme moves all of them by extending the
recipe. The preset under `./theme` registers the recipes with an application's compiler.

Every value a theme can move on a component is an axis of its recipe, so a caller reaches it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-actions
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Button

Draws the element a person presses, in a look, a size and a status, with a glow where a page asks.
The element is `button`, and `type` defaults to `button` so one inside a form does not send it.

```tsx
import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";

<Button size="lg" variant="outline">
  Save
</Button>;
<Button as="a">Read on</Button>;
<ButtonPropsProvider value={{ size: "sm", variant: "subtle" }}>
  <Button>Cancel</Button>
  <Button variant="solid">Save</Button>
</ButtonPropsProvider>;
```

`ButtonPropsProvider` sets the variants of every button below it. A prop on the button itself
overrides the provider's.

The `glass` look is translucent, so the contrast of its label depends on what sits behind it. The
theme's contrast gate measures the opaque looks alone, and a page puts a glass button on a surface
it has checked.

| Axis      | Values                                                             | Default |
| --------- | ------------------------------------------------------------------ | ------- |
| `variant` | `solid`, `subtle`, `surface`, `outline`, `ghost`, `plain`, `glass` | `solid` |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`                  | `md`    |
| `status`  | `info`, `success`, `warning`, `error`                              | primary |
| `shape`   | `square`                                                           | none    |
| `effect`  | `glow`                                                             | none    |

## IconButton

Draws a button that holds one glyph and no words. It binds the button's recipe with the square shape
as its default, so it takes every axis a button takes and a theme that moves the button moves it
too. A glyph names nothing, so the props require an accessible name: `aria-label`, or
`aria-labelledby` pointing at the element that holds the words. The type refuses an icon button
without one.

```tsx
import { IconButton } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";

<IconButton aria-label="Close" variant="ghost">
  <Icon>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
</IconButton>;
```

## Licence

MIT. See [LICENSE](LICENSE).
