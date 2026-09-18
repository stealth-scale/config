# @stealthscale/specimen

`@stealthscale/specimen` is what a specimen file is written with: the declaration a catalogue reads,
and the arrangement that draws a component once per value of an axis.

## Install

```bash
pnpm add -D @stealthscale/specimen
```

The package peers on `@stealthscale/component-layout`, `@stealthscale/component-typography` and
`react`. A package writing specimens does not declare it, the way a package writing specifications
does not declare the testing kits: a specimen runs in the catalogue and resolves through the
workspace root.

## specimen

A specimen file's default export declares the page. The index plugin parses the call out of the
source and never evaluates the module, so nothing here runs at build time.

```tsx
import { Matrix, type Scene, specimen } from "@stealthscale/specimen";

import { Button } from "#button/index.ts";

const SIZES = ["sm", "md", "lg"] as const;

export const sizes: Scene = {
  about: "The three steps every control in the library shares.",
  draw: () => (
    <Matrix direction="row" knob="size" of={SIZES}>
      {(size) => <Button size={size}>Press</Button>}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about: "The element a person presses.",
  group: "Actions",
  id: "actions/button",
  scenes: [sizes],
});
```

| Field    | What it declares                                                    |
| -------- | ------------------------------------------------------------------- |
| `id`     | The address of the page, required and unique across the catalogue   |
| `scenes` | The scenes, in the order they are drawn                             |
| `title`  | The page heading. The last segment of the identifier when absent    |
| `group`  | The group a navigation rail lists the page under. Empty when absent |
| `about`  | The sentence or two the page opens with. Empty when absent          |

The scenes are listed rather than gathered from the file's exports, because a module returns its
names in alphabetical order and a page written Variants, States, Anatomy would be read back Anatomy,
States, Variants.

`draw` is a component rather than a node, so a scene that holds state declares its hooks in its own
render.

## Matrix

`Matrix` draws one captioned cell per value of an axis.

| Prop        | What it does                                                        |
| ----------- | ------------------------------------------------------------------- |
| `of`        | The values, in the order the cells are drawn                        |
| `knob`      | The prop the axis turns, written before each value in the muted ink |
| `label`     | Converts a value into the name its cell is captioned with           |
| `direction` | Which way the cells run, `column` or `row`. `column` by default     |

Two axes at once are one matrix inside another, with the inner one running across.

```tsx
<Matrix knob="variant" of={VARIANTS}>
  {(variant) => (
    <Matrix direction="row" knob="size" of={SIZES}>
      {(size) => <Button size={size} variant={variant} />}
    </Matrix>
  )}
</Matrix>
```

## No recipe of its own

Every part a matrix draws is a component of the library: the arrangement is `Stack`, the caption is
`Text`. The package therefore states no recipe and registers no preset, and a theme that moves the
stack or the paragraph moves the catalogue with them.

Both arrangements are written out rather than forwarded to one stack, because the compiler extracts
a value written as a JSX literal and nothing it reads from a prop.

## Types

`Axis<Value>` describes an axis: `of`, `knob` and `label`. `MatrixProps<Value>` extends it with
`children` and `direction`. `Specimen` and `Scene` describe what a page declares.

## Licence

MIT. See [LICENSE](LICENSE).
