# @stealthscale/example-lib-tokens

A build hook writes `dist/tokens.css` from the palette declared in `src/palette.ts`, and a second
layer adds the subpath that publishes it. The stylesheet appears in no source tree. Those two layers
are all a package needs to generate part of what it publishes.

## Run it

```bash
pnpm --filter @stealthscale/example-lib-tokens build
```

The hook writes `dist/tokens.css`, one `:root` rule declaring `--ink`, `--paper` and `--rule`. The
packer writes `dist/index.js`, which exports the same three colours as a TypeScript record. A
consumer that reads a custom property and one that reads a string take their values from one
definition.

```bash
pnpm --filter @stealthscale/example-lib-tokens test
pnpm --filter @stealthscale/example-lib-tokens check
```

`test` runs `src/palette.spec.ts` against the text `stylesheet()` returns, with nothing built.
`check` lints and type-checks the package.

## The configuration

```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { pack } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

import { stylesheet, TOKEN_EXPORTS } from "./src/palette.ts";

const OUT = join(import.meta.dirname, "dist");

export default defineConfig(import.meta.dirname, {
  extends: [
    pack.buildBefore({
      because: "a custom property is not a module, so the palette has to reach a browser as text",
      runs: (): void => {
        mkdirSync(OUT, { recursive: true });
        writeFileSync(join(OUT, "tokens.css"), stylesheet());
      },
    }),

    pack.subpaths(TOKEN_EXPORTS),
  ],
});
```

`preset/web` brings four groups of layers:

- The house group formats doc comments, imports, manifests and stylesheets, wraps a paragraph
  outside code to the width code uses, and resolves an import of a workspace package to that
  package's TypeScript through the `stealth-source` condition.
- The lint group declares the browser's globals, withholds node's, and adds the markup rules on top
  of what every tier runs.
- The pack group derives the entries from the manifest, emits a declaration file for each one,
  writes a CycloneDX bill of materials, and reads the output back through publint and a type check.
  It fixes the platform at `neutral`, so a dependency resolves against neither node's conditions nor
  the browser's. Each of those two brings its own export conditions and its own built-in modules,
  and `neutral` brings neither, which is what one file loading in both places has to use.
- The test group collects `**/*.spec.ts`, runs each file against a happy-dom document, and requires
  100% coverage of `src/`.

`pack.buildBefore` schedules the hook at the packer's `build:before` moment, which is the first one
after the packer empties `dist`. A file written at `build:prepare`, the moment before, is deleted
before anything looks for it. The hook then runs once per output format, so a package publishing two
formats writes the stylesheet twice.

`pack.subpaths` adds each subpath it is given to the export map the packer produced, over whatever
else put one there. It applies `pack.carry` first, so a subpath the manifest points straight at a
file is kept as well, and a subpath both name resolves to the stated one.

## The generated stylesheet

`PALETTE` in `src/palette.ts` declares every custom property, keyed by its own name. `stylesheet()`
turns that record into a `:root` rule ending in a newline. Putting every declaration on `:root` is
what makes a custom property inherited by every element, and it leaves a consumer free to override
one on a narrower selector.

```ts
import "@stealthscale/example-lib-tokens/tokens.css";

import { PALETTE } from "@stealthscale/example-lib-tokens";
```

`TOKEN_EXPORTS`, beside the palette, maps `./tokens.css` onto `./dist/tokens.css` and is what
`pack.subpaths` reads. The hook names the same output file separately, so renaming it means editing
both.

Warning: nothing is escaped. A token name or a colour containing a brace produces a stylesheet that
does not parse.
