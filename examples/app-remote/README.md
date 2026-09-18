# @stealthscale/example-app-remote

`@stealthscale/example-app-remote` exposes one React component for another application to fetch and
render, and serves that same component as a page of its own. The build sets no `base`, so the
federation plugin resolves this application's chunks against wherever `remoteEntry.js` was fetched
from. One artefact runs under any origin, and moving it between environments costs no rebuild.

## Run it

Build the remote and serve the built output:

```bash
pnpm --filter @stealthscale/example-app-remote build
pnpm --filter @stealthscale/example-app-remote preview
```

The preview server listens on port 4403 and serves `remoteEntry.js` from its root. The development
server runs the same application as an ordinary page on port 4402:

```bash
pnpm --filter @stealthscale/example-app-remote dev
```

Note: the preview server reflects back `https://host.stealthscale.dev` and `http://localhost:4401`
and no other origin. A browser refuses the entry module to a host reached on anything else.

## The configuration

Each call in `extends` adds to what `preset/app` already supplies.

| Call                         | What it configures                                         |
| ---------------------------- | ---------------------------------------------------------- |
| `react.layers()`             | The JSX transform, and the document a test renders into    |
| `federation.remote(...)`     | The plugins that build this package into a loadable remote |
| `server.address(4402, ...)`  | The development server's port, host names and bind address |
| `preview.address(4403, ...)` | The same three settings for the preview server             |
| `preview.shared(...)`        | The origins the preview server names in its CORS header    |

`react.layers()` contributes the React plugin that compiles JSX through the automatic runtime. It
also adds a setup file that empties the document between tests, and the happy-dom environment the
test runner renders into.

The `shared` argument comes from `react.federation.shared()`, which marks `react` and `react-dom` as
singletons at the range of the installed major version. A page with two copies of React keeps two
dispatchers, and a hook called from a remote runs against the dispatcher that did not render it.
Declaring the singleton is what collapses the host and every remote it loads onto one copy.

`STEALTH_HOSTS` replaces the host list outright, and `STEALTH_ORIGINS` replaces the origin list.
Either variable is a comma-separated list. Setting one discards what the configuration declared
rather than adding to it.

## What it exposes

`federation.remote` maps `./Dashboard` onto `src/dashboard.tsx`. A host writes that specifier as
`remote/Dashboard`, against the name this application registered itself under. The entry manifest is
written as `remoteEntry.js` with no content hash in the filename, so a host resolving it by URL is
never pinned to one build of this application.

`mount` in `src/mount.ts` draws the dashboard into an element and returns the React root.
`src/main.tsx` calls it against `#root`, which is what lets you run and specify this application
with no host involved. The element is emptied on the first render, so a caller that passes one with
markup already in it loses that markup.
