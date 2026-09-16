# @stealthscale/example-lib-core

`@stealthscale/example-lib-core` adds two amounts of money and refuses a mixed pair. Every call in
the source is to the language itself, which is the condition the base tier is written for. The same
file loads in a worker, in an edge runtime and on a server.

## Run it

```bash
pnpm --filter @stealthscale/example-lib-core build
pnpm --filter @stealthscale/example-lib-core test
```

The runner measures coverage on every run. A run that leaves any line, branch, function or statement
uncovered fails. `src/money.spec.ts` covers a matching pair, a negative amount and the refusal.

## The configuration

`vite.config.ts` imports `defineConfig` from `@stealthscale/vite-config/preset/base` and calls it
with this package's directory:

```ts
import { defineConfig } from "@stealthscale/vite-config/preset/base";

export default defineConfig(import.meta.dirname);
```

The directory is declared rather than discovered. A configuration is bundled into a temporary file
outside its own package before it runs, and `import.meta.dirname` is the one spelling that still
names this directory from there.

The tier composes three groups of layers beside the formatting and resolution layers every tier
shares.

- `lint.base` omits the `env` block. The node tier declares node's globals there, and the web tier
  declares the browser's. A package using `process` or `document` extends one of those two.
- The test layers omit `test.environment`, so the runner falls back to its own default. `test.files`
  collects `**/*.spec.ts`. `test.coverage` sets the thresholds and `test.order` shuffles the files.
- `pack.published` derives one entry per subpath whose `stealth-source` condition names a source
  file. `package.json` is then the only place this package states what it publishes.
  `pack.declarations` emits the types, and `pack.quality` reads the output back through publint and
  are-the-types-wrong. `pack.inventory` writes the bill of materials.

## Adding two amounts

```ts
added({ cents: 150, currency: "EUR" }, { cents: 275, currency: "EUR" });
// { cents: 425, currency: "EUR" }
```

An `Amount` counts minor units as a whole number. 1.50 EUR is `{ cents: 150, currency: "EUR" }`, and
the arithmetic stays exact where a fractional major unit would not. A currency whose minor unit is
not a hundredth is counted in that unit, and nothing here divides by 100. `added` throws on two
different currencies. A conversion needs a rate, and this package has none.
