# @stealthscale/example-app-web

The browser runs this example without a framework. One module writes the package name and version
into the page, and the development server forwards every request under `/api` to another origin.

## Run it

```bash
pnpm --filter @stealthscale/example-app-web dev
pnpm --filter @stealthscale/example-app-web build
pnpm --filter @stealthscale/example-app-web preview
```

The development server answers on port 4200 and forwards `/api` to port 8787. That port is free in
this repository, so a request through the proxy fails at the connection rather than in the browser.
`preview` serves the built output once `build` has written it.

## The configuration

A browser application takes its tier from `@stealthscale/vite-config/preset/app`. This file names
three layers beside it, and every module under `src/` is plain TypeScript.

- `define.manifest()` substitutes `__NAME__` and `__VERSION__` into the bundle as string literals,
  so the page shows both without reading a manifest at run time. `tsconfig.json` lists
  `@stealthscale/vite-config/globals` under `types`, which is where the type checker finds them.
- `server.port(4200)` pins the development server and fails its start on a taken port. Vite
  otherwise searches upward until a port is free, and a proxy rule written against a number still
  points at the old one.
- `server.proxy("/api", "http://localhost:8787")` sends every request under that prefix on to the
  named origin. The layer is named for its path, so two modules adding different routes both
  compose. A path that two layers name resolves to the later one.

## The single origin

A page served from port 4200 requests `/api` on its own origin. The browser treats that as a
same-origin request and skips the preflight. The development server forwards the request to
port 8787. The service there answers without CORS headers of its own. Vite reads the same proxy
table in a preview server, so the built output gets the route as well.
