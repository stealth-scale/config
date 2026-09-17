# @stealthscale/component-disclosure

Draws what is shown and hidden on the reader's say-so. Every component binds a recipe and draws
nothing of its own, so a theme moves all of them by extending the recipe. The preset under `./theme`
registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-disclosure
```

The package peers on `react` and `@stealthscale/theme`.
