# @stealthscale/component-screen

Lays an application out on whatever screen it is opened on: the shell, the page, the toolbar and the
sidebar, each folding on its own as the screen narrows. Every component binds a recipe and draws
nothing of its own, so a theme restyles all of them by extending the recipe. The preset under
`./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-screen
```

The package peers on `react` and `@stealthscale/theme`.
