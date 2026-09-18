# @stealthscale/example-app-ssr

A server renders this example's markup before a browser receives it, and the browser then hydrates
that markup instead of drawing the tree a second time. One source tree produces two bundles. A
dependency that imports its own stylesheet has to go into the server bundle, because node cannot
load a stylesheet import.

## Run it

```bash
pnpm --filter @stealthscale/example-app-ssr dev
pnpm --filter @stealthscale/example-app-ssr build
pnpm --filter @stealthscale/example-app-ssr test
```

The build runs twice. `vp build` writes the client bundle, and a second pass named in the same
script writes the server bundle:

```bash
vp build --ssr src/server.ts --outDir dist/server
```

The development server listens on port 4600 and the preview server on port 4601, so the source and
the build can run beside each other.

## The configuration

One configuration serves both passes. It starts at `@stealthscale/vite-config/preset/app` and lists
four calls beside it.

- `react.layers()` contributes the plugin that compiles JSX, a setup file that empties the document
  between tests, and the happy-dom environment the runner loads.
- `ssr.bundle()` adds `@stealthscale/example-lib-ui` to `ssr.noExternal` and records the reason on
  the layer for whoever later takes it back. Every dependency in `deps` becomes a layer of its own,
  so one can be taken back without restating the rest.
- `server.port(4600)` pins the development server and fails its start on a taken port.
- `preview.port(4601)` pins the preview server and leaves the development server's own port alone. A
  configuration that fixes the development port alone leaves the preview inheriting it.

## The bundled dependency

`@stealthscale/example-lib-ui` imports its own stylesheet from the component it exports. The node
runtime has no way to load that import. A dependency left on the externals list is loaded by the
server runtime as it stands, so the server pass fails on the stylesheet. While the package is linked
into this workspace the builder bundles it either way. The layer is what keeps the server pass
working once that package arrives from a registry instead of from the workspace.
