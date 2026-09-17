# @stealthscale/component-typography

Draws the components that are text: a heading, a paragraph, a snippet of code, a key a reader is
asked to press. Every component binds a recipe and draws nothing of its own, so a theme moves all of
them by extending the recipe. The preset under `./theme` registers the recipes with an application's
compiler.

## Install

```bash
pnpm add @stealthscale/component-typography
```

The package peers on `react` and `@stealthscale/theme`.
