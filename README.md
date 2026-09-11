# @stealthscale/config

Every configuration a stealth repository is built, checked, tested and released under, composed out
of layers rather than copied between repositories.

A repository states what it is built on and what is true only of itself:

```ts
import { defineConfig } from "@stealthscale/config-vite/preset/web";
import { define, server } from "@stealthscale/config-vite";

export default defineConfig({
  extends: [define.manifest(import.meta.dirname), server.port(3000)],
});
```

What you extend composes; what you write beside it wins. That is the whole contract, and it is the
one `tsconfig.json` already taught everybody.

## The packages

| Package             | What it decides                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `config-typescript` | The tsconfigs every package compiles under, split into base, node and web                |
| `config-vite`       | The layer kernel, and a block for each part of a Vite+ config                            |
| `config-react`      | What a package that renders adds: the JSX transform, the React rules, the page directory |
| `config-css`        | What a stylesheet is checked against and how it is built, whichever tools do it          |

## Working on it

```bash
bun install
bun run ready     # bootstrap, then check, test and build
```

`ready` starts with `bootstrap`, which packs the config packages before anything else runs. It has
to: every example and every package imports the config by name, so each one resolves through `dist`,
exactly as a repository installing from npm does. A clean checkout has no `dist`, and `vp run -r`
reads every config in the workspace before it runs a single task.

Note: `lint` and `fmt` are read from the workspace root and nowhere else. A layer from either block
put in a package's own config is composed, merged, and then never seen. Where a package needs an
answer of its own, the glob says which files it reaches.

## Adding a layer

Four kinds, and each says something the others cannot:

| Kind         | What it does                 | When it runs                |
| ------------ | ---------------------------- | --------------------------- |
| `preset`     | Sets a block                 | First, ordered by `enforce` |
| `contribute` | Appends one item to a list   | In the order written        |
| `remove`     | Takes any layer back by name | Reaches what is above it    |
| `override`   | Rewrites the merged config   | Last                        |

A name and a reason go with each one, which is what lets a repository read its own configuration,
see which package decided a value, and take that one back without restating the rest.
