# @stealthscale/vite-config-i18n

`@stealthscale/vite-config-i18n` configures a package or an application that ships catalogues. It
adds two layers: the plugin that finds and types every catalogue, and the setup file that puts the
fallback language in scope for the specifications.

## Install

```bash
pnpm add -D @stealthscale/vite-config-i18n
```

The package peers on `@stealthscale/provider-i18n`, `@stealthscale/vite-plugin-i18n`,
`@stealthscale/vite-config-core`, `vite` and `vitest`.

## Usage

Add `i18n.layers()` to whichever tier the package already builds on.

```ts
import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), i18n.layers()],
});
```

Every plugin option passes through. `layers({ fallback: "nl" })` defines the keys in Dutch.
`layers({ eager: true })` inlines every language rather than fetching all but the fallback.

## The two layers

`catalogued()` appends the plugin to `plugins`. The plugin walks the dependency graph, reads every
`locales/<language>/<namespace>.json` it finds, serves `virtual:i18n`, and writes
`src/i18n.gen.d.ts` with the keys typed.

`worded()` appends `@stealthscale/provider-i18n/testing` to `test.setupFiles`. That file assigns the
global i18next instance from the catalogues the plugin found, in the fallback language. A
specification rendering a component outside a provider then reads real strings rather than the key.

Add either contribution on its own when a package wants only one of them.

## Licence

MIT. See [LICENSE](LICENSE).
