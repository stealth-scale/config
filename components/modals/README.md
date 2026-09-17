# @stealthscale/component-modals

Draws what the page waits for: a dialog, a drawer, a palette, a tour. Every component binds a recipe
and draws nothing of its own, so a theme moves all of them by extending the recipe. The preset under
`./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-modals
```

The package peers on `react` and `@stealthscale/theme`.
