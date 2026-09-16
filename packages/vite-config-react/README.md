# @stealthscale/vite-config-react

What a package that renders adds beside a tier from [`@stealthscale/vite-config`](../vite-config):
the JSX transform, a document for rendering tests, the React lint rules, and React as a federation
singleton.

```bash
pnpm add -D @stealthscale/vite-config-react @stealthscale/vite-config
```

## In a package

A package extends a tier from `@stealthscale/vite-config` and adds `layers()` beside it:

```ts
import { defineConfig } from "@stealthscale/vite-config/preset/web";
import * as react from "@stealthscale/vite-config-react";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers()],
});
```

`layers()` composes to three layers, each named for the call that produces it on its own:

| Layer                  | What it does                                    |
| ---------------------- | ----------------------------------------------- |
| `react.plugin.refresh` | Compiles JSX and refreshes a component in place |
| `react.test.cleanup`   | Empties the document after every test           |
| `react.test.document`  | Gives the runner a document to draw into        |

A removal takes any one of them back by that name.

## At a workspace root

A root adds `workspace()`, because the formatter and the linter read the root config only:

```ts
import { defineConfig } from "@stealthscale/vite-config/preset/workspace";
import * as react from "@stealthscale/vite-config-react";

export default defineConfig(import.meta.dirname, {
  extends: [react.workspace()],
});
```

`workspace()` composes to `react.fmt.imports`, `react.lint.plugins(react)`,
`react.lint.plugins(jsx-a11y)`, `react.lint.rules`, `react.lint.runtime`, `react.lint.rendered` and
`react.lint.fixtures`. A removal takes any one of them back by that name.

## Blocks

Each layer is also reachable on its own, under the block it belongs to.

| Namespace    | Exports                                               | What it does                                            |
| ------------ | ----------------------------------------------------- | ------------------------------------------------------- |
| `plugin`     | `refresh`, `FACTORY`, `Refreshed`                     | The React plugin and fast refresh                       |
| `lint`       | `plugins`, `fixtures`, `rendered`, `rules`, `runtime` | The React and a11y rule sets, and what they excuse      |
| `fmt`        | `imports`                                             | Where React imports sort                                |
| `test`       | `cleanup`, `document`                                 | A document to render into, emptied between tests        |
| `federation` | `shared`, `installed`                                 | React and React DOM as singletons across federated apps |

## Federation

Two copies of React in one page keep separate dispatchers, so a component from a remote calling
`useState` reaches the copy that did not render it and React reports that hooks may only be called
inside a function component.

```ts
import { federation } from "@stealthscale/vite-config-react";

federation.shared(); // react and react-dom as singletons, both at the installed range
```

The range is read from the installed React rather than written down, so a major upgrade needs no
edit here. `react` and `react-dom` are peers of this package, which is what makes the installed copy
resolvable.

## Types for a page

`web.json` is a fragment that adds the JSX option. A consumer lists the tier first and the fragment
after it:

```json
{
  "extends": [
    "@stealthscale/vite-config-typescript/web.json",
    "@stealthscale/vite-config-react/web.json"
  ]
}
```

## Licence

MIT
