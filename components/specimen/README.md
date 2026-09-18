# @stealthscale/specimen

`@stealthscale/specimen` is both halves of a catalogue: what a specimen file is written with, and
what draws the pages an application indexed.

## Install

```bash
pnpm add -D @stealthscale/specimen
```

The package peers on `@stealthscale/component-actions`, `@stealthscale/component-layout`,
`@stealthscale/component-typography`, `@stealthscale/provider-i18n`,
`@stealthscale/vite-plugin-specimen` and `react`. A package writing specimens does not declare it,
the way a package writing specifications does not declare the testing kits: a specimen runs in the
catalogue and resolves through the workspace root.

## The catalogue

The package publishes routes and a frame, and builds no router. An application compiles them beneath
one of its own routes.

```ts
import { compileRoutes } from "@stealthscale/provider-router";
import { declarations, layouts } from "@stealthscale/specimen";
import { pages } from "virtual:specimen-index";

const under = createRoute({ getParentRoute: () => root, path: "/pages" });
const compiled = [...declarations(pages), ...whateverElseYouWrote()];

under.addChildren([...compileRoutes(compiled, { layouts: layouts(compiled), parent: under })]);
```

`declarations` gives one route per page, addressed by the identifier the page declares and carrying
no leading slash. Every page hangs beneath whatever parent it is compiled under, so mounting that
parent at `/docs` serves the button at `/docs/actions/button`. The prefix stays with the
application.

The pages are passed in rather than imported, so this package draws a catalogue without the build
plugin in its own graph and a specification renders one without a build at all.

## The rail

`Rail` reads declarations, not the index. Anything compiled into the catalogue that carries an entry
is listed, so a page an application wrote itself appears beside a page the plugin found.

```ts
const overview: RouteDeclaration = {
  component: Overview,
  id: "docs.theming.overview",
  layout: [FRAME],
  navigation: { group: "Theming", label: "Overview" },
  path: "theming/overview",
};
```

`Entry` is that shape and `entryOf` reads it, because the router types `navigation` as `unknown` and
a declaration the catalogue did not write could carry anything under that name. A declaration
carrying no entry is left out, which is what a page in no rail looks like.

`grouped` sorts those into the tree the rail draws: groups by name, pages by the words their entry
carries, and pages naming no group under a heading of their own, last. `routeId` names a page for a
link, turning slashes into dots: `specimen.actions.button`.

## The frame

`Catalogue` is the simple frame, a rail beside the page, and `layouts` hands it to `compileRoutes`
under `FRAME`. A pathless route draws it, so it adds no segment to any address and the rail is
rendered once above every page.

An application wanting a top bar, a search or a switcher writes its own frame, passes it under
`FRAME` instead of calling `layouts`, and places `Rail` wherever it likes inside it. Nothing else in
this package reaches `Catalogue`.

`Page` loads a page's module and draws its scenes, which is the first time that component reaches
the browser. `declared` and `parted` are the shaping behind it. `parted` splits what a page's parts
accept into the variants a theme moves and the options a caller sets, each row carrying the members
of every named type it refers to, with the dropped counts beside them.

## The words

Every word the catalogue writes itself is a key under the `specimen` namespace, in
`locales/en/specimen.json`. An application overriding one declares the same key under the same
namespace: the plugin reads packages deepest first and the application last, so the application
wins.

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
