# @stealthscale/pandacss-compiler

`@stealthscale/pandacss-compiler` renames a compiled Panda CSS stylesheet and its generated runtime
into the readable scheme of `@stealthscale/pandacss-naming`. The compiler is a native binary that
offers no hook into the names it writes, so the two are rewritten after it ran: every class selector
in the stylesheet through one parse, and the template lines of the runtime that write a class.

## Install

```bash
pnpm add @stealthscale/pandacss-compiler
```

The package the generated runtime is written into depends on `@stealthscale/pandacss-naming`, which
the rewritten runtime imports.

## Usage

A build step runs codegen, rewrites the runtime it wrote, and renames the stylesheet it compiled:

```ts
import { createNodeDriver } from "@pandacss/compiler";
import { renameSelectors, rewriteRuntime } from "@stealthscale/pandacss-compiler";

const driver = await createNodeDriver({ configPath: "panda.config.ts", cwd: root });

driver.parseFiles();
driver.codegen({ cwd: root, outdir: generated });
rewriteRuntime(generated);

const { css, diagnostics } = renameSelectors(driver.cssgen().css, {
  recipes: [{ axes: ["loading", "size"], className: "button" }],
  separator: "-",
});
```

`diagnostics` lists an error for each pair of classes that renamed to one name, and one warning for
the classes kept under a raw selector or at-rule condition.

## Reference

### `rewriteRuntime(dir)`

Rewrites two files under `dir`, the directory codegen wrote the runtime into, and prepends an import
of the naming package to each:

| File              | Line                                                     | Rewritten as                                                          |
| ----------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| `helpers`         | `parts.join(":")`                                        | `atomicClass(parts.join(":"))`                                        |
| `helpers`         | `set.add(name)`                                          | `if (name !== "") set.add(name)`                                      |
| `recipes/runtime` | `` `${className}--${prop}-${withoutSpace(value)}` ``     | `variantClass(className, prop, value)`                                |
| `recipes/runtime` | ``return classPrefix ? `${classPrefix}-${next}` : next`` | ``return atomicClass(classPrefix ? `${classPrefix}-${next}` : next)`` |

Each line is matched once, as `@pandacss/compiler` 2.0.0-beta.17 writes it. A compiler release that
moves a line throws here, which is the version pin. The files are read under the `mjs` extension, or
under `js` where the compiler was configured for that. A second run changes nothing.

### `renameSelectors(css, config)`

| Step        | Does                                                                                                                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rename      | Each class in each selector goes through `rename` of the naming package, with `config.recipes` and `config.separator`, once per class                                                                                      |
| Remove      | A selector that needs the class of a boolean axis at `false` is removed, since no element carries it. Inside `:is()`, `:where()` or `:has()` only that entry goes. `:not()` of it matches everything and is written as `*` |
| Prune       | A rule or a block the removal leaves empty goes with it                                                                                                                                                                    |
| Collision   | Classes that renamed to one name are reported as `naming/collision`, an error naming each                                                                                                                                  |
| Raw         | The classes kept under a raw selector or at-rule condition are reported once as `naming/raw-condition`, a warning listing them                                                                                             |
| Leave alone | A keyframe step, a rule that names no class, and a layer order statement                                                                                                                                                   |

The diagnostics take the compiler's own `Diagnostic` shape, so a reporter written for the compiler's
prints them unchanged.

The scheme reads a class as the compiler writes it with `hash` off and no `prefix`. A hashed class
has no structure to read, and a prefix is not read from a recipe's class.

## Licence

MIT. See [LICENSE](LICENSE).
