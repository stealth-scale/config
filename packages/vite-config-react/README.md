# @stealthscale/vite-config-react

A package that renders extends `@stealthscale/vite-config-react` beside its tier from
`@stealthscale/vite-config`. One call adds the JSX transform, the document its tests render into,
and the emptying of that document between them. A second call, written once at the repository root,
turns on the React and accessibility rules and gives React an import group of its own.

## Install

```bash
pnpm add -D @stealthscale/vite-config-react
```

The package peers on `@stealthscale/vite-config`, `@testing-library/react`, `@vitejs/plugin-react`,
`happy-dom`, `oxc-transform-react`, `react`, `react-dom`, `vite` and `vitest`. Install all nine. It
runs on Node 26 and later.

## Usage

Extend the tier a package already uses and write `layers()` beside it. Both `preset/app` and
`preset/web` compose the same three layers.

```ts
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, { extends: [react.layers()] });
```

`layers()` states no rule and no format. A linter and a formatter read the root configuration only.
A package that repeats them lints nothing extra and slows its own build down. `workspace()` declares
the rules. A repository root resolves it once for every package under it.

```ts
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/workspace";

export default defineConfig(import.meta.dirname, { extends: [react.workspace()] });
```

## Reference

Each factory named here returns a layer under the name of the call that produced it. A consumer
drops one layer by name and keeps the rest.

### Blocks

| Block        | What it configures                                                          |
| ------------ | --------------------------------------------------------------------------- |
| `federation` | React and its renderer, shared between a host and its remotes as one copy   |
| `fmt`        | The import group React and its renderer sort into                           |
| `lint`       | The linter plugins, the React rules, and the files excused from one of them |
| `plugin`     | The JSX transform, and the refresh that replaces a component in place       |
| `test`       | The document a component renders into, and the emptying of it between tests |

### Layers

| Export                 | Signature                                 | What it returns                                                               |
| ---------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| `layers`               | `() => readonly Layer[]`                  | `react.plugin.refresh`, `react.test.cleanup` and `react.test.document`        |
| `workspace`            | `() => readonly Layer[]`                  | Seven lint and format layers, every rule ordered ahead of every relaxation    |
| `federation.installed` | `(read?: () => unknown) => string`        | The version string React's own manifest declares                              |
| `federation.shared`    | `(version?: string) => federation.Shared` | `react` and `react-dom` as singletons, at the range of the installed major    |
| `fmt.imports`          | `() => Override`                          | An override sorting React ahead of every other import group                   |
| `lint.fixtures`        | `() => Contribution`                      | A relaxation lifting `react/no-multi-comp` from a specification               |
| `lint.plugins`         | `() => readonly Contribution[]`           | One contribution per plugin, `react` first and `jsx-a11y` second              |
| `lint.rendered`        | `() => Contribution`                      | A relaxation excusing `.spec.tsx` and `.fixtures.tsx` from the docblock rules |
| `lint.rules`           | `() => Contribution`                      | Six React rules, declared over `**/*.{ts,tsx}`                                |
| `lint.runtime`         | `() => Contribution`                      | A relaxation switching `react/react-in-jsx-scope` off                         |
| `plugin.refresh`       | `(stated?: Refreshed) => Contribution`    | The React plugin, appended to whatever plugins the tier built                 |
| `test.cleanup`         | `() => Contribution`                      | The absolute path of `./vitest.setup.ts`, appended to `test.setupFiles`       |
| `test.document`        | `() => Preset`                            | A preset setting `test.environment` to `happy-dom`                            |

Note: a preset replaces the environment a tier set rather than adding to it. `react.test.document`
is a preset. A package that needs another document implementation takes the layer back by name with
`remove()` from `@stealthscale/vite-config`.

### The transform

`plugin.refresh()` compiles `.ts`, `.tsx`, `.js`, `.jsx` and `.mdx`. It leaves `/node_modules/`
alone and selects the automatic JSX runtime. Each field of `Refreshed` widens or narrows one of
those defaults. A field left undefined keeps the default.

| Field      | Type                | Default                                                        |
| ---------- | ------------------- | -------------------------------------------------------------- |
| `also`     | `readonly RegExp[]` | Empty. Each pattern compiles beside the five kinds listed here |
| `compiler` | `boolean`           | `true`, which lets the React compiler memoise a component      |
| `except`   | `readonly RegExp[]` | Empty. Each pattern joins `/node_modules/`                     |
| `from`     | `string`            | `react`, also exported as `plugin.FACTORY`                     |

Note: the automatic runtime imports the factory itself. No file under this transform needs React in
scope. `web.json` selects the default factory for the type checker, so a package that changes `from`
states the matching `jsxImportSource` in its own tsconfig.

## The tsconfig fragment and the setup file

`./web.json` is a tsconfig fragment rather than a tier. It sets one compiler option,
`"jsx": "react-jsx"`. List it after the tier in the array form of `extends`, as
`["@stealthscale/vite-config-typescript/web.json", "@stealthscale/vite-config-react/web.json"]`. The
fragment then cannot be extended without its base by mistake.

`./vitest.setup.ts` does two things. It sets `IS_REACT_ACT_ENVIRONMENT`, which React reads before it
processes an update inside `act`. It also registers one `afterEach` that unmounts every root Testing
Library rendered and then replaces the children of `document.body`, so an effect's cleanup runs and
one test never reads markup another test mounted. Reach the file through `test.cleanup()` rather
than by path. That layer resolves it by package name, and the same layer works from a workspace link
and from an installed copy.

Warning: a package that calls `act` without this setup file loads no such global. React then logs
`The current testing environment is not configured to support act(...)` on every update inside an
`act` scope, and the warning that reports an update outside `act` never fires at all.

## Federated applications

`federation.shared()` reads the version of the React installed beside this package. It widens that
version to the whole major and marks `react` and `react-dom` as singletons at the resulting range.
Pass the result to `federation.host()` or `federation.remote()`.

```ts
federation.host({
  name: "host",
  remotes: ["remote"],
  shared: react.federation.shared(),
});
```

The range covers the major rather than the exact version. Applications on two different patches of
one major share a dispatcher safely. A narrower range would make a host refuse a remote it can in
fact run. Pass a version string to pin the result. `federation.installed()` reads the installed
version on its own.

Warning: two copies of React on one page keep separate dispatchers. A component from a remote then
calls a hook on the copy that did not render it, and React reports the call as illegal.

## Licence

MIT. See [LICENSE](LICENSE).
