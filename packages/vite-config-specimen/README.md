# @stealthscale/vite-config-specimen

`@stealthscale/vite-config-specimen` configures an application that shows a catalogue of specimens,
and the workspace root the specimens sit under.

## Install

```bash
pnpm add -D @stealthscale/vite-config-specimen
```

The package peers on `@stealthscale/vite-plugin-specimen`, `@stealthscale/vite-config`,
`@stealthscale/vite-config-core` and `vite`.

## The application

Add `specimen.layers()` to whichever tier the application already builds on.

```ts
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";
import * as specimen from "@stealthscale/vite-config-specimen";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),
    specimen.layers({ patterns: ["../../components/*/src/**/*.specimen.tsx"] }),
  ],
});
```

`patterns` has no default. A pattern resolves against the application root, and an application that
shows a catalogue of a workspace's components sits beside those components rather than above them.

`layers()` adds two things: the index plugin, and every specimen as an entry the dependency scan
walks before the server starts. A specimen is reached through a dynamic import the scan does not
follow, so without the entries the first page a reader opens re-optimises and reloads the catalogue.

Naming the entries disables Vite's own inference, which is why `**/*.html` is named beside them.

## The workspace root

Add `specimen.workspace()` to the root configuration.

```ts
import * as specimen from "@stealthscale/vite-config-specimen";
import { defineConfig } from "./packages/vite-config/src/preset/workspace.ts";

export default defineConfig(import.meta.dirname, { extends: [specimen.workspace()] });
```

The linter runs from the workspace root and reads the root's configuration and no other, so a
relaxation stated in the application would compose, merge, and never be read.

Four rules come off `**/*.specimen.tsx`:

| Rule                           | Why                                                              |
| ------------------------------ | ---------------------------------------------------------------- |
| `no-default-export`            | A specimen is read through its default export                    |
| Doc comments and the size caps | A specimen is as long as the scenes it takes to show a component |
| `react/only-export-components` | The default export is a page description, not a component        |
| `react/no-multi-comp`          | A scene is built from the components that arrange it             |

Pass a list to cover different files: `workspace(["components/**/*.specimen.tsx"])`.

## Licence

MIT. See [LICENSE](LICENSE).
