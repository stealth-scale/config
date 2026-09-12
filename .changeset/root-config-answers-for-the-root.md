---
"@stealthscale/vite-config-core": patch
---

The root's configuration answers for the root when read from a package that states a configuration
of its own. `vp check` and `vp lint` read it from wherever they run, and a root tier that packs was
reading the package's manifest instead, refusing an application for publishing nothing.
