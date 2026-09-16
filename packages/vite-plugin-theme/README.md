# @stealthscale/vite-plugin-theme

`@stealthscale/vite-plugin-theme` publishes two plugins. `theme.runtime()` generates the styling
runtime a design-system package publishes, from the preset that package publishes.
`theme.stylesheet()` compiles an application's stylesheet from the themes the application states and
the presets of every package on its dependency graph. A component package and a theme package add no
plugin: each writes its preset or its theme by hand.

## Install

```bash
pnpm add -D @stealthscale/vite-plugin-theme
```

The package peers on `@stealthscale/vite-plugin-base`, `vite` and `vitest`. Install all three beside
it. `engines.node` is `>=26.0.0`.

## Usage

The design-system package adds `theme.runtime()`. It publishes its preset under the `./theme`
subpath, and the plugin generates `generated/` from it as soon as the configuration resolves, so the
package's own source can import the runtime under a type checker, a packer or a test runner.

```ts
import { theme } from "@stealthscale/vite-plugin-theme";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [theme.runtime()],
});
```

An application adds `theme.stylesheet()` and states its themes in `theme.config.ts`:

```ts
import { abyss } from "@acme/theme-abyss";
import { fathom } from "@acme/theme-fathom";

export default { static: "*", themes: [fathom, abyss] };
```

The first theme is the default. Every theme is compiled under `[data-theme=<name>]`, the first
included, so a subtree can wear any theme. The application imports the stylesheet through the system
package's `styles.css` subpath, and the plugin appends the compiled rules to whichever stylesheet
declares the cascade order.

## Options

Both factories take the same options. Every field is optional.

| Option          | Type                        | Default                 | Effect                                                                                              |
| --------------- | --------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| `include`       | `readonly string[]`         | `["src/**/*.{ts,tsx}"]` | Globs the compiler scans, relative to the application, beside every workspace package it depends on |
| `layers`        | `Partial<StylesheetLayers>` | Each role's own name    | The name each cascade layer goes by, in the compiler and in the stylesheet alike                    |
| `systemPackage` | `string`                    | `@stealthscale/theme`   | The package that publishes the foundation and generates the runtime                                 |

Everything else is a convention rather than an option: the statement is `theme.config.ts`, a preset
is published under `./theme`, the runtime goes to `generated/`, and the rendered configurations go
to `node_modules/.theme/`.

## Reference

| Export             | Signature                       | What it returns                                                             |
| ------------------ | ------------------------------- | --------------------------------------------------------------------------- |
| `theme.runtime`    | `(options?: Options) => Plugin` | `stealth:theme.runtime`, which generates the runtime of the system package  |
| `theme.stylesheet` | `(options?: Options) => Plugin` | `stealth:theme.stylesheet`, which compiles the stylesheet of an application |

| Type               | What it describes                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `Application`      | What an application states: `themes`, the first being the default, and an optional `static` |
| `Theme`            | A theme as a theme package exports it: `name`, `variant`, an optional `preset` and `fonts`  |
| `Options`          | The three options above                                                                     |
| `Switchable`       | A theme read for its `name` and its `preset`                                                |
| `SwitchablePreset` | A preset read for its `name`, its `presets` and the extensions under `theme.extend`         |
| `Extension`        | What a theme changes about one recipe: `base`, `variants` and `compoundVariants`            |
| `Extensions`       | A theme's extensions, under `recipes` and `slotRecipes`                                     |

## The compilation

The statement and every contributor's preset are imported through Vite, under the export conditions
the application resolves with, so a workspace package resolves to its source. Under a dev server the
import goes through the server's runner and joins its module graph. Every value is then written into
the compiler's configuration as a literal, because the compiler's own loader resolves a workspace
package to built output. The one import the rendered configuration keeps is the compiler's base
preset, by absolute path.

A contributor is a package on the application's dependency graph that publishes `./theme`. The
system package is installed first, and each other package after the packages it depends on, so a
package building on another can extend it. A theme's extensions are nested under
`[data-theme=<name>] &`, one preset per level of the theme's lineage, so the compiler emits a rule
that wins while the attribute is set and matches nothing while it is not.

The compiler emits the theme attribute under its own name and signs the root element. Both are
rewritten before the rules reach the stylesheet, so nothing a page sees names the compiler.

## What is watched

A change to the statement, a theme, a preset or a manifest restarts the compiler. A change to a
scanned source file is handed to the running compiler. Anything else is left to Vite. A stylesheet
the rules were appended to is invalidated on either, so the next request retransforms it.

## Diagnostics

What the compiler could not make sense of is reported through the bundler as one warning per
compile, with the severity, the code, the message, the file and the help the compiler offered. An
application whose graph names no package publishing a preset beside the system package is warned
about too, because its stylesheet carries the foundation's values and no component's rules.

## Licence

MIT. See [LICENSE](LICENSE).
