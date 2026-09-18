# @stealthscale/example-lib-ui

`app-host`, `app-remote`, `app-ssr` and `router-federated` all import `Panel` from this package.
React is a peer dependency rather than a dependency, so each of them renders the component against
the copy of React the application itself installed. The example covers a browser library that
publishes a stylesheet. It also covers a coverage departure written at the workspace root on the
package's behalf.

## Run it

```bash
pnpm --filter @stealthscale/example-lib-ui test
```

`vp test` renders `Panel` through `renderToStaticMarkup`. That call produces markup without a
document and settles in one pass. `Panel` renders from its props alone, so the test asserts on
markup rather than on anything a browser schedules.

```bash
pnpm --filter @stealthscale/example-lib-ui build
pnpm --filter @stealthscale/example-lib-ui check
```

`build` writes `dist/index.js` and collects the `#panel.css` import that `src/panel.tsx` makes into
`dist/style.css`. The manifest publishes that file as `./style.css`, which a consumer loads once for
the whole library. `check` lints and type-checks the package.

## The configuration

```ts
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers()] });
```

`preset/web` supplies four groups of layers:

- The house group formats doc comments, imports, manifests and stylesheets, wraps a paragraph
  outside code to the width code uses, and resolves an import of a workspace package to that
  package's TypeScript through the `stealth-source` condition.
- The lint group declares the browser's globals and withholds node's, with the markup rules added on
  top. `.spec.tsx` and `.fixtures.tsx` are excused from doc comments here and in no other tier.
- The pack group builds one entry per subpath whose conditions name a source file, and fixes the
  platform at `neutral`. `pack.carry` puts `./style.css` back into the published export map, since
  the packer replaces that map with what it built and a stylesheet has no source to build from.
  `pack.quality` then reads the output back, leaving `.css` entry points out of the type check. A
  stylesheet has no declaration file, and the check reads a missing declaration as a broken entry
  point.
- The test group collects `**/*.spec.tsx` alongside `**/*.spec.ts` and requires 100% coverage of
  `src/`.

`react.layers()` adds three layers beside the tier:

- `react.plugin.refresh` compiles `.ts`, `.tsx`, `.js`, `.jsx` and `.mdx` through the automatic JSX
  runtime, leaves `/node_modules/` alone, and lets the React compiler memoise a component.
- `react.test.cleanup` appends a setup file that replaces the children of `document.body` after each
  test, so one test never reads markup another test mounted.
- `react.test.document` sets `test.environment` to happy-dom.

Note: `react.test.document` is a preset, so it replaces the environment the tier set rather than
adding to it. Both name happy-dom. A package that needs another implementation takes the layer back
by name.

## The layer the workspace root reads

`vite.layers.ts` states one layer. The file writes the reason out in full, and this listing cuts it
short.

```ts
import { type Extendable, test } from "@stealthscale/vite-config";

export const layers: readonly Extendable[] = [
  test.omit({
    because: "the JSX runtime marks every element call `@__PURE__`",
    files: ["examples/lib-ui/src/panel.tsx"],
  }),
];
```

The workspace root imports that array under a name of its own and lists it last among its own
layers.

```ts
import { layers as exampleLibUi } from "./examples/lib-ui/vite.layers.ts";
```

Coverage is measured once across the whole workspace, so a file taken out of the count has to be
named in a glob written from the root. `test.omit` returns one contribution per glob, appended to
`test.coverage.exclude` under the name `test.omit(<glob>)`, which points a report at the glob rather
than at the list it joined. Keeping the call in this file puts the reason beside the code it
excuses.

`src/panel.tsx` is excused because the JSX runtime marks every element call `@__PURE__`. The marker
tells a bundler it may drop the call where nothing reads its result, and the coverage counter reads
it as a branch. No test can take that branch: either the component rendered or it was never rendered
at all. A component whose root element has more than one child reports one of them.

The shared tsconfig compiles `${configDir}/vite.layers.ts` beside `src` and `vite.config.ts`, so the
file is type-checked wherever a package writes one.
