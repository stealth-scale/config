---
"@stealthscale/vite-config-react": minor
---

vite-config-react: export layers() and workspace(), and name every layer for its call

- `layers()` replaces the `preset/app` and `preset/web` subpaths. A package extends a tier from
  `@stealthscale/vite-config` and adds `react.layers()` beside it.
- `workspace()` replaces `preset.workspace()`.
- `web.json` is a fragment with the JSX option and no `extends`. A tsconfig lists
  `@stealthscale/vite-config-typescript/web.json` first and this file second.
- `lint.fixtures()` relaxes `react/no-multi-comp` for rendered specifications and fixtures.
- `peerDependencies` names `vite` and `vitest` from the peer catalog. `vite-plus` is not a peer.
- `engines.node` is `>=26.0.0`.

| Before                                               | After                       |
| ---------------------------------------------------- | --------------------------- |
| `react/react.refresh`                                | `react.plugin.refresh`      |
| `react/react.cleanup`                                | `react.test.cleanup`        |
| `react/test.environment(happy-dom)`                  | `react.test.document`       |
| `react/fmt.group(react)`                             | `react.fmt.imports`         |
| `react/react.plugin(react)`                          | `react.lint.plugins(react)` |
| `react/lint.relax(**/*.spec.tsx, **/*.fixtures.tsx)` | `react.lint.rendered`       |
| `react/lint.enforce(**/*.{ts,tsx})`                  | `react.lint.rules`          |
