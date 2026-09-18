# @stealthscale/component-surfaces

Draws the surface under a thing, and the rule between two of them. Every component binds a recipe
and draws nothing of its own, so a theme restyles all of them by extending the recipe. The preset
under `./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-surfaces
```

The package peers on `react` and `@stealthscale/theme`.
