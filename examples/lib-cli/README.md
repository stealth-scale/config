# @stealthscale/example-lib-cli

`tally` adds up money amounts and prints the sum. This example shows a package that installs a
command under a name of its own choosing, built from a source file the package also exports as a
module. One layer in the Vite configuration keeps the two names apart.

## Run it

```bash
node examples/lib-cli/src/bin/tally.ts 150EUR 275EUR
```

Node strips the types and runs the file, so the command works before anything is built. The total
goes to stdout. Any explanation goes to stderr, which lets a pipeline read the number on its own. A
refused argument exits 1 and says which argument it refused.

```bash
pnpm --filter @stealthscale/example-lib-cli build
pnpm --filter @stealthscale/example-lib-cli test
pnpm --filter @stealthscale/example-lib-cli check
```

`build` runs `vp pack`, which writes `dist/index.mjs` and `dist/bin/tally.mjs`. `test` runs the
seven cases in `src/totals.spec.ts`. `check` lints and type-checks the package.

## The configuration

```ts
import { pack } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname, {
  extends: [pack.command({ tally: "src/bin/tally.ts" })],
});
```

`preset/node` composes four groups of layers:

- The house group formats doc comments, imports, manifests and stylesheets, and wraps a paragraph
  outside code to the width code uses. It also states `resolve.source`, which puts the
  `stealth-source` condition ahead of Vite's own defaults so an import of a workspace package
  reaches that package's TypeScript.
- The lint group declares node's globals and withholds the browser's, with the type-aware rules on.
  A reference to `document` is a lint error here rather than a failure in whoever installs the
  package.
- The pack group derives the build from the manifest. `pack.published` builds one entry per subpath
  whose conditions name a source file, `pack.declarations` emits a declaration file beside each
  entry, `pack.quality` reads the output back through publint and a type check, and `pack.inventory`
  writes a CycloneDX bill of materials to `dist/cyclonedx/bom.json`.
- The test group collects `**/*.spec.ts`, runs each file in the runner's own process, and requires
  100% coverage of `src/`. Files under `src/bin/` are not counted.

`pack.command` writes its argument into `pack.exports.bin`, which tells the packer to build
`src/bin/tally.ts` and publish it as `tally`. Drop the layer and the packer names the command after
the package with its scope stripped, so an install would put `example-lib-cli` on the path instead.

## The command and the module

The manifest declares two subpaths. `.` reaches `src/index.ts`, which re-exports `tally`.
`./bin/tally` reaches `src/bin/tally.ts`, which reads `process.argv`, calls `tally` and chooses the
exit code. Importing the package never runs the argument parsing, so a consumer importing the
function alone pays nothing for the command.

```ts
import { tally } from "@stealthscale/example-lib-cli";

tally(["150EUR", "275EUR"]);
```

An amount is whole cents followed by a three-letter upper-case currency, with no separator between
the two. Both `1.50EUR` and `150eur` are refusals rather than guesses. `tally` parses the whole list
before it adds any of it, so one unreadable argument is reported on its own and never as a partial
total. An empty list has no currency to report a zero in and is refused as well.
