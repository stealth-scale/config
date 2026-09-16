---
"@stealthscale/vite-config-css": minor
---

vite-config-css: export layers(), workspace() and warn(), and name every layer for its call

- `layers()` replaces `plugin.check()`. A package extends a tier from `@stealthscale/vite-config`
  and adds `css.layers()` beside it.
- `workspace()` returns an empty array, so a root's config has the same shape whichever add-ons it
  lists.
- `warn({ because, ...checked })` replaces `override.warn(checked)`. The `override` namespace is
  removed.
- `peerDependencies` names `vite` from the peer catalog. `vite-plus` is not a peer.
- `engines.node` is `>=26.0.0`.
- `README.md` ships in the tarball, covering the three exports, the `Checked` fields and every rule
  the four sets declare.
- `description` is a sentence naming what the package does.

| Before            | After       |
| ----------------- | ----------- |
| `stylelint.check` | `css.check` |
| `stylelint.warn`  | `css.warn`  |
