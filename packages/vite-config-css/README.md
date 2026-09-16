# @stealthscale/vite-config-css

Checks a stylesheet against four rule sets, during the build that compiles it. Depends on
[`@stealthscale/vite-config-core`](../vite-config-core) alone. It produces layers and names no Vite
key of its own, so installing it pulls in the kernel and nothing else.

```bash
pnpm add -D @stealthscale/vite-config-css @stealthscale/vite-config-core
```

## In a package

A package extends a tier from `@stealthscale/vite-config` and adds `layers()` beside it:

```ts
import { defineConfig } from "@stealthscale/vite-config/preset/web";
import * as css from "@stealthscale/vite-config-css";

export default defineConfig(import.meta.dirname, {
  extends: [css.layers()],
});
```

`layers()` composes to one layer, `css.check`, which runs Stylelint as part of the build and fails
it on what it finds. `layers()` takes the same record `check` does: `also` and `except` for globs,
and `rules` for what the repository answers to beyond the shared set.

## At a workspace root

`workspace()` composes to no layers. A stylesheet is checked while the package that imports it is
built, and nothing about that is read from the root. The function exists so a root's config has one
shape whichever add-ons it lists.

## Exports

| Export      | What it does                                                      |
| ----------- | ----------------------------------------------------------------- |
| `layers`    | The check, as a layer beside a tier                               |
| `warn`      | Takes the check back by name and puts a reporting one in place    |
| `workspace` | Nothing, for a root's config to have one shape                    |
| `rules`     | `all`, `ANIMATION`, `CASCADE`, `ORDER`, `SELECTOR`, the rule sets |

## The rule sets

| Set         | Holds                                                 |
| ----------- | ----------------------------------------------------- |
| `ANIMATION` | Refuses properties that cannot be composited          |
| `CASCADE`   | Nesting, and what may be written at which depth       |
| `ORDER`     | The order declarations are written in                 |
| `SELECTOR`  | What a selector may reach and how specific it may get |

`rules.all()` is the four together, which is what the check uses.

## Failing versus reporting

`css.check` fails the build. `warn` reports and carries on, which is what a repository adopting the
rule sets on an existing stylesheet wants until the backlog is gone. It takes a reason, because it
is a departure from the house answer.

```ts
import * as css from "@stealthscale/vite-config-css";

css.warn({ because: "the theme package has 40 violations to work through" });
```

## Peers

Stylelint and its plugins are peers rather than dependencies, so a repository picks its own
versions: `stylelint`, `stylelint-config-standard`, `stylelint-high-performance-animation`,
`stylelint-order`, `stylelint-use-nesting` and `vite-plugin-stylelint`.

## Licence

MIT
