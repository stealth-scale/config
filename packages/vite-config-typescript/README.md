# @stealthscale/vite-config-typescript

`@stealthscale/vite-config-typescript` publishes the TypeScript settings every stealth package
compiles under. `base.json` sets the compiler options and says nothing about where the code runs.
`node.json` and `web.json` each add one environment on top of it. A package extends one of the three
and states nothing further unless its layout differs.

## Install

```bash
pnpm add -D @stealthscale/vite-config-typescript
```

TypeScript reads the three JSON files directly. The package has no dependencies and no peers.

## Usage

Extend the tier for the environment your package runs in. A package the console runs extends
`node.json` and stops there:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@stealthscale/vite-config-typescript/node.json"
}
```

A package the browser runs extends `web.json`. Extend `base.json` where the source uses the language
alone.

`@stealthscale/vite-config-react` publishes a `web.json` of its own, and a package that renders
React extends both. The React file is a fragment rather than a tier: it sets `jsx` to `react-jsx`
and extends nothing. List the tier first and the fragment second, in the array form.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": [
    "@stealthscale/vite-config-typescript/web.json",
    "@stealthscale/vite-config-react/web.json"
  ]
}
```

## Reference

| Config      | Extends     | What it sets                                                                                  |
| ----------- | ----------- | --------------------------------------------------------------------------------------------- |
| `base.json` | Nothing     | Every option in the following table, and the `include` list                                   |
| `node.json` | `base.json` | `types`, as `["vite-plus", "node"]`                                                           |
| `web.json`  | `base.json` | `lib`, as `["es2023", "dom", "dom.iterable"]`, and `types`, as `["vite-plus", "vite/client"]` |

`base.json` sets the options below. Every option written without a value is `true`.

| Group           | Options                                                                                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language level  | `target: esnext`, `lib: ["es2023"]`, `module: preserve`, `moduleDetection: force`                                                                                                                                |
| Resolution      | `customConditions: ["stealth-source"]`, `types: ["vite-plus"]`, `resolveJsonModule`, `allowImportingTsExtensions`, `allowArbitraryExtensions`, `noUncheckedSideEffectImports`                                    |
| Erasable syntax | `verbatimModuleSyntax`, `erasableSyntaxOnly`                                                                                                                                                                     |
| Strictness      | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `allowUnreachableCode: false` |
| Output          | `noEmit`, `skipLibCheck`                                                                                                                                                                                         |

`types` is the one place a stealth `tsconfig.json` names the toolchain, and source files import
`vite`. The toolchain's types augment Vite's `UserConfig` with `pack`, `lint`, `fmt`, `run`,
`staged` and `test`, so a `vite.config.ts` that writes any of those keys type-checks only while
`vite-plus` is in scope. Leaving `types` out altogether puts every `@types/*` package anywhere in
`node_modules` in scope instead.

Note: `extends` replaces an array rather than adding to it. A `tsconfig.json` that states its own
`types` drops `vite-plus` and everything the toolchain declares. Name it again in any `types` array
you write, as `node.json` and `web.json` both do.

## Source resolution

`customConditions` lists one condition, `stealth-source`. Each stealth repository resolves its own
packages through it, and the string matches the `SOURCE` constant in `@stealthscale/vite-config`.
Publish that condition in a workspace package's `exports` beside `default`, pointing at
`./src/index.ts`, and the compiler reads the TypeScript source instead of the build output. Within a
single package, the `#*` subpath in its own manifest does the same job, and these files never name
it.

## What gets compiled

`include` covers `${configDir}/src`, `${configDir}/vite.config.ts`, `${configDir}/vite.layers.ts`,
and the theme statement an application writes beside its configuration,
`${configDir}/theme.config.ts` with `${configDir}/theme.config.spec.ts`. `${configDir}` resolves
against the `tsconfig.json` that does the extending rather than against the file it extends, and
that is what lets one list serve every package. A relative path in its place would point at this
package rather than at yours. A package whose layout differs writes its own `include`, which
replaces the inherited list.

## Licence

MIT. See [LICENSE](LICENSE).
