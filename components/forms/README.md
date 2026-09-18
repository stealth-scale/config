# @stealthscale/component-forms

Draws what a person fills in: fields, choices and the controls that gather them. Every component
binds a recipe and draws nothing of its own, so a theme moves all of them by extending the recipe.
The preset under `./theme` registers the recipes with an application's compiler.

Every value a theme can move on a component is an axis of its recipe, so a caller reaches it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-forms
```

The package peers on `react`, `@stealthscale/hooks` and `@stealthscale/theme`. An application lists
the preset under `./theme` among the presets its compiler installs.

## Input

Draws a box a person types one line into. The surface, the edge, the ink, the placeholder, the focus
ring and every state a field enters come from the theme, so a theme decides what a field looks like
once for every field. The size reads the control scale, so a field lines up with a button of the
same name beside it.

```tsx
import { Input } from "@stealthscale/component-forms";

<label htmlFor="email">Email</label>
<Input id="email" type="email" />;
<Input aria-label="Search invoices" size="sm" variant="subtle" />;
<Input aria-invalid placeholder="name@example.com" />;
```

| Axis      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`      |
| `variant` | `outline`, `subtle`, `flushed`                    | `outline` |

The field carries no label of its own. Point a `label` at it, or state `aria-label` where the page
has drawn the name elsewhere. A field with neither is announced as `edit text` and nothing more.

A field that is wrong states `aria-invalid`, which is the attribute the recipe's invalid styling
reads and the one a screen reader reads too. There is no separate prop for it, so the two cannot
disagree.

The focus ring is drawn inside the box, because a ring outside it is clipped where a field sits
flush against the edge of a panel.

## SearchInput

Draws a field a person searches from, with a control at its end that empties it.

```tsx
import { SearchInput } from "@stealthscale/component-forms";

<SearchInput aria-label="Search invoices" clearIndicator={<CloseIcon />} />;
<SearchInput
  aria-label="Search"
  clearIndicator={<CloseIcon />}
  onValueChange={setQuery}
  size="sm"
  value={query}
/>;
```

| Axis   | Values                                            | Default |
| ------ | ------------------------------------------------- | ------- |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` | `md`    |

It takes `value` and `defaultValue`, so one component serves a caller that drives it and a caller
that wants it to look after itself. `onValueChange` hears the contents each time they change.

The control appears only where the field holds something and a caller has handed over something to
draw in it. A control that is always there and does nothing half the time is one a reader learns to
pass over. Clearing puts focus back in the field, because a person who has just emptied a search is
about to type another one. Name the control with `clearLabel`, which defaults to `Clear search`.

The field reserves room at its end exactly the width of the control, both read off the control
scale. One name moves both, so the typing never runs underneath at any size.

The field's own surface, edge and size are the text field's recipe. This one writes the room, the
position and the control, and restates none of it.

## Licence

MIT. See [LICENSE](LICENSE).
