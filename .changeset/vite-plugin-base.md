---
"@stealthscale/vite-plugin-base": minor
---

vite-plugin-base: add the readers and writers a generating plugin needs

- `locked` reads what the workspace lockfile pinned for each installed package, moved here from the
  sbom plugin with the `yaml` dependency.
- `dependencies` walks every package reachable through `dependencies` from a manifest, each once,
  placed after what it depends on. `packageAt` resolves one package's directory from its dependent,
  and `resolvedOnGraph` resolves a package's entry from the root or from any package on the graph.
- `exportTarget` reads the target an export map names for a subpath under a set of conditions.
- `imported` loads a module through Vite under the application's export conditions, through a
  running dev server's runner where there is one, and lists the files behind it.
- `literal` writes a value as the source that reproduces it, for a generated file.
- `writeIfChanged` writes a generated file only when its content differs, and `emptyDir` clears a
  generated directory.
