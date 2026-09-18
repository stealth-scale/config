# @stealthscale/vite-plugin-specimen

`@stealthscale/vite-plugin-specimen` indexes specimen files from their source. A catalogue lists
every page it holds and loads a page's components only when somebody opens it.

## Install

```bash
pnpm add -D @stealthscale/vite-plugin-specimen
```

The package peers on `vite` and `@stealthscale/vite-plugin-base`. Most repositories reach it through
`@stealthscale/vite-config-specimen` rather than adding it by hand.

```ts
import { specimens } from "@stealthscale/vite-plugin-specimen";

export default defineConfig({ plugins: [specimens({ patterns: ["src/**/*.specimen.tsx"] })] });
```

`patterns` has no default. A pattern resolves against the project root, and an application that
shows a catalogue of a workspace's components sits beside those components rather than above them.

## What a specimen declares

A specimen's default export is a call taking one object literal. The plugin reads `id`, `group`,
`title` and `about` out of the source text, so nothing in the file is evaluated at build time.

```tsx
export const sizes = { draw: () => <Badge size="sm" />, title: "Sizes" };

export default specimen({
  about: "A small label that marks a status.",
  group: "Data",
  id: "data/badge",
  scenes: [sizes],
});
```

`id` is required and unique. `title` defaults to the last segment of the identifier, with hyphens
read as spaces. `group` and `about` default to empty.

Neither the callee's name nor the module it came from is checked, so a repository supplies its own
`specimen` function.

## virtual:specimen-index

```ts
import { pages } from "virtual:specimen-index";
```

`pages` carries one entry per file, sorted by path. Each entry holds the metadata the file declares,
the name of the package the file belongs to, and three loaders: `load` for the scenes, `source` for
the file's text, and `fragments` for the scenes as source. Every loader is a dynamic import, so the
bundler emits one chunk per specimen.

Add the types with a triple-slash directive from a file the project already compiles.

```ts
/// <reference types="@stealthscale/vite-plugin-specimen/client" />
```

## virtual:specimen-fragments

```ts
const { fragments } = await import("virtual:specimen-fragments/data/badge");
```

`fragments` holds one snippet per scene, keyed by the scene's title. A snippet carries the scene's
declaration, every top-level declaration it references, and only the import specifiers those use, so
it compiles on its own.

## Unreadable files

A file that matched a pattern and declares no page is still listed, under its path, with the reason
as its opening and a loader that rejects with the same reason. A build throws instead, naming every
unreadable file in one error.

Two files declaring one identifier are the same fault. The second is refused and names the first.

## Hot updates

A page appearing, disappearing, or changing the metadata it declares reloads the index. An edit that
changes only a scene reloads that page and leaves the index alone.

The directories the patterns start in are added to the watcher, including those outside the project
root, because a dev server watches its own root and nothing above it.

## Licence

MIT. See [LICENSE](LICENSE).
