# @stealthscale/vite-config-typescript

Three tsconfigs to extend: a base that says nothing about where code runs, and one each for the
console and the browser.

```bash
pnpm add -D @stealthscale/vite-config-typescript
```

```json
{
  "extends": "@stealthscale/vite-config-typescript/node.json",
  "include": ["src"]
}
```

| Config        | Adds                                       |
| ------------- | ------------------------------------------ |
| `./base.json` | Everything but the environment             |
| `./node.json` | `types: ["node"]`                          |
| `./web.json`  | `lib: dom, dom.iterable` and `vite/client` |

## Why the split

`types` in the base is deliberately empty. Left out, every `@types/*` anywhere in `node_modules` is
in scope, and a browser package silently sees node's globals — so `process.env` type-checks and then
fails in somebody's browser. Each of the two environment configs adds exactly one set, which is what
makes the split mean anything.

The names match the sets the lint configuration calls `node` and `web`, so a file is held to one
environment by both tools rather than to two by accident.

## The base

`strict`, plus the four checks it leaves off: `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature` and
`noUncheckedSideEffectImports`. `verbatimModuleSyntax` and `erasableSyntaxOnly` keep the emit
predictable, and `module: "preserve"` leaves module resolution to the bundler.

`customConditions` is `["stealth-source"]`, the condition a stealth repository resolves its own
packages through. It has to match the `SOURCE` constant in `@stealthscale/vite-config`, and a
specification there asserts that it does.

A package reaches its own source through the `#*` subpath its manifest declares, read from
`package.json` rather than named here.

## Licence

MIT
