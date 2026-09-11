# @stealthscale/vite-config-css

Checks a stylesheet against four rule sets, during the build that compiles it. Depends on
[`@stealthscale/vite-config-core`](../vite-config-core) alone — it mints layers and names no Vite
key of its own, so installing it pulls in the kernel and nothing else.

```bash
pnpm add -D @stealthscale/vite-config-css @stealthscale/vite-config-core
```

```ts
import { plugin } from "@stealthscale/vite-config-css";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [plugin.check()],
});
```

## Exports

| Namespace  | Exports                                            | What it does                          |
| ---------- | -------------------------------------------------- | ------------------------------------- |
| `plugin`   | `check`, `Checked`                                 | Runs Stylelint as part of the build   |
| `rules`    | `all`, `ANIMATION`, `CASCADE`, `ORDER`, `SELECTOR` | The four rule sets, together or apart |
| `override` | `warn`                                             | Reports instead of failing            |

## The rule sets

| Set         | Holds                                                 |
| ----------- | ----------------------------------------------------- |
| `ANIMATION` | Refuses properties that cannot be composited          |
| `CASCADE`   | Nesting, and what may be written at which depth       |
| `ORDER`     | The order declarations are written in                 |
| `SELECTOR`  | What a selector may reach and how specific it may get |

`rules.all()` is the four together, which is what `plugin.check()` uses.

## Failing versus reporting

`plugin.check()` fails the build. `override.warn()` reports and carries on, which is what a
repository adopting the rule sets on an existing stylesheet wants until the backlog is gone.

```ts
import { override } from "@stealthscale/vite-config-css";

override.warn(); // same rules, exit code unchanged
```

## Peers

Stylelint and its plugins are peers rather than dependencies, so a repository picks its own
versions: `stylelint`, `stylelint-config-standard`, `stylelint-high-performance-animation`,
`stylelint-order`, `stylelint-use-nesting` and `vite-plugin-stylelint`.

## Licence

MIT
