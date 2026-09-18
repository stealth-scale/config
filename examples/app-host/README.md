# @stealthscale/example-app-host

The bundler fixes the name `remote` while this application is compiled, and leaves the address out.
`src/endpoints.ts` reads the URL behind that name from `public/remotes.json` when the page starts,
so one artefact is promoted through staging and production without a rebuild. This application picks
up a redeployment of the other one on the next page load.

## Run it

Start the remote first, because this application fetches its entry module on the first render:

```bash
pnpm --filter @stealthscale/example-app-remote build
pnpm --filter @stealthscale/example-app-remote preview
```

In a second shell, build and serve the host:

```bash
pnpm --filter @stealthscale/example-app-host build
pnpm --filter @stealthscale/example-app-host preview
```

The host listens on port 4401, and `public/remotes.json` sends it to the remote on port 4403. The
development server listens on port 4400.

Note: the remote admits `http://localhost:4401` and `https://host.stealthscale.dev` as origins, so a
page served by the development server on port 4400 is refused the remote's entry module.

## The configuration

`extends` lists four calls, over the layers `preset/app` gives every deployed browser application.

- `react.layers()` adds three layers, and a package can drop any one of them by name:
  - the React plugin that compiles JSX through the automatic runtime,
  - the setup file that empties the document between tests,
  - the happy-dom environment the test runner swaps in.
- `federation.host(...)` adds the federation plugins and names `remote` without giving it an
  address. That name starts out pointed at `https://federation.invalid`, a reserved domain that
  resolves nowhere, so a host that skips registration fails on the fetch rather than loading
  something else.
- `server.address(4400, ...)` pins the development server to port 4400 and admits
  `host.stealthscale.dev` beside loopback. A server reached under a name binds the loopback address,
  because something else forwards to it.
- `preview.address(4401, ...)` sets the same three things on the preview server, which takes an
  address of its own so both servers can run at once.

`react.federation.shared()` fills in the `shared` argument, marking `react` and `react-dom` as
singletons at the range of the installed major version. That collapses the host and every remote it
loads onto one copy of React, so a hook called from a remote runs against the dispatcher that
rendered it.

The test runner cannot resolve `remote/Dashboard`, because the federation plugin invents that
specifier during a build and a development server. The `stubs` argument aliases it to
`src/remote.fixtures.tsx` under `test.alias` alone, which is also the only place to fix what the
remote returns.

## The manifest

`public/remotes.json` names each remote and the URL its entry module is fetched from:

```json
[{ "name": "remote", "entry": "http://localhost:4403/remoteEntry.js" }]
```

`src/endpoints.ts` fetches that file and drops any entry missing a name or a URL. It registers what
is left with `force: true`, over whatever address the build defaulted to. Any status but a success
throws, which separates a deployment that fails to serve the file from one whose file names nothing.

`src/main.tsx` awaits registration before the first render. An import that runs earlier is fetched
from the placeholder address, which on a deployment is a machine that is not there.

Each chunk is named for its contents, so a deployment serves names the previous build never used. A
page left open across one requests a file that has gone. `src/main.tsx` subscribes the listener from
`src/stale.ts` to `vite:preloadError` before anything else runs. That listener fetches the page
again on the first such failure of a session and does nothing on the next, which keeps one bad
release from turning every open page into a load test.
