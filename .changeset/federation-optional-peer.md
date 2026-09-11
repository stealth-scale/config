---
"@stealthscale/vite-config": patch
---

Import `@module-federation/vite` at the moment a config asks for the plugin. The package is declared
an optional peer, and `federation.host()` and `federation.remote()` imported it at the top of their
modules — which the barrel re-exports, so loading `@stealthscale/vite-config` at all failed for a
repository that federates nothing and had never installed it. Only a config stating a host or a
remote needs it now.

Where it is genuinely missing, the error names it and says why it is optional. What the plugin
itself refuses is passed through untouched, rather than reported as a package to go and install.
