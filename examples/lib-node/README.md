# @stealthscale/example-lib-node

The node tier supplies this package's whole configuration, and `vite.config.ts` adds nothing to it.
The one function here, `listed`, joins a list of names into the phrase an English sentence would
use: `Ada, Grace and Barbara`. Naming a tier states where a library runs rather than what its code
imports.

## Run it

```bash
pnpm --filter @stealthscale/example-lib-node build
pnpm --filter @stealthscale/example-lib-node test
```

`vp test` collects `src/index.spec.ts` and runs it in the node environment this tier names.
`vp pack` writes `dist/index.mjs` and the declaration file a consumer's type checker reads.

## The configuration

The file picks the tier and hands it this package's directory:

```ts
import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
```

The node tier adds `lint.node` and `test.environment(node)` to what the base tier composes.

- `lint.node` declares node's globals and leaves the browser's undeclared. A reference to `document`
  is a lint error here rather than a failure at whoever installs the package.
- `test.environment(node)` runs every test file in the runner's own process, where a test uses the
  file system and the network directly.

Everything the packer does is what the base tier does. `pack.published` reads the `stealth-source`
condition in `package.json` and builds `src/index.ts` from it. `pack.declarations` emits the types
beside it, and `pack.quality` reads the result back as a package manager and a type checker will.

## The packer and the tier

The packer already resolves for node, so the node group of pack layers returns the base group
unchanged. The tier moves what the linter and the test runner assume about the runtime. It also
records the target where a reader of the configuration finds it, which keeps that choice visible on
the day it changes.
