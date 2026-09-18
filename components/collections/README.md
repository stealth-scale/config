# @stealthscale/component-collections

Draws a set of records: the lists, tables and grids that render many of one thing. Every component
binds a recipe and draws nothing of its own, so a theme restyles all of them by extending the
recipe. The preset under `./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-collections
```

The package peers on `react` and `@stealthscale/theme`.
