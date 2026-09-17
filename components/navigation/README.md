# @stealthscale/component-navigation

Draws the ways a person moves between places: links, tabs, breadcrumbs and rails. Every component
binds a recipe and draws nothing of its own, so a theme moves all of them by extending the recipe.
The preset under `./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-navigation
```

The package peers on `react` and `@stealthscale/theme`.
