---
"@stealthscale/testing": minor
---

testing: drive a plugin's hooks from a specification

- `configured`, `started`, `resolved`, `loaded`, `transformed`, `updated` and `generated` call one
  hook each, the way a bundler would, and return what the hook produced.
- `hookContext` builds the context a hook reads `this` from, and records what the hook asked to
  watch, reported and invalidated.
- The package peers on `vite` for the plugin type.
