# @stealthscale/vite-config-react

What a package that renders adds on top of [`@stealthscale/vite-config`](../vite-config): the JSX
transform, the React lint rules, the page directory, and React as a federation singleton.

```bash
bun add -D @stealthscale/vite-config-react @stealthscale/vite-config
```

## Tiers

Two subpath exports, each the matching `@stealthscale/vite-config` tier plus what React needs.

```ts
import { defineConfig } from "@stealthscale/vite-config-react/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [],
});
```

| Tier           | For                                |
| -------------- | ---------------------------------- |
| `./preset/web` | A component library that publishes |
| `./preset/app` | An application that is deployed    |

## Blocks

| Namespace    | Exports                           | What it does                                            |
| ------------ | --------------------------------- | ------------------------------------------------------- |
| `plugin`     | `refresh`, `FACTORY`, `Refreshed` | The React plugin and fast refresh                       |
| `lint`       | `plugins`, `rules`, `runtime`     | The React, hooks and a11y rule sets                     |
| `fmt`        | `imports`                         | Where React imports sort                                |
| `test`       | `cleanup`                         | Unmounts between tests                                  |
| `federation` | `shared`, `installed`             | React and React DOM as singletons across federated apps |
| `preset`     | `workspace`                       | What a workspace root adds for React                    |
| `override`   | `page`                            | Moves the page directory                                |

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

```json
{ "extends": "@stealthscale/vite-config-react/web.json" }
```

## Licence

MIT
