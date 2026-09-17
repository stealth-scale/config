# @stealthscale/component-forms

Composes controls into something a person submits, and reports what is wrong with it. Every
component binds a recipe and draws nothing of its own, so a theme moves all of them by extending the
recipe. The preset under `./theme` registers the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-forms
```

The package peers on `react` and `@stealthscale/theme`.
