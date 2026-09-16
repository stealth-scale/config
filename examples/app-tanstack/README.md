# @stealthscale/example-app-tanstack

TanStack Router draws `/` from this application's own bundle and `/reports` from `remote/Dashboard`,
a module `@stealthscale/example-app-remote` serves. `@stealthscale/example-app-host` mounts that
same module straight onto a page rather than under a route, because a remote decides nothing about
where a host puts it.

## Run it

Run the routed application on its own:

```bash
pnpm --filter @stealthscale/example-app-tanstack dev
```

The development server answers on port 4404 and the preview server on port 4405. Both admit
`app2.stealthscale.dev` beside loopback, and `STEALTH_HOSTS` replaces that list on a machine that
has arranged something else.

## The configuration

`extends` composes four calls, over the layers `preset/app` already supplies.

| Call                         | What it configures                                          |
| ---------------------------- | ----------------------------------------------------------- |
| `react.layers()`             | The JSX transform, and the document a test renders into     |
| `federation.host(...)`       | The federation plugins, the remotes named, and the stand-in |
| `server.address(4404, ...)`  | The development server's port, host names and bind address  |
| `preview.address(4405, ...)` | The same three settings for the preview server              |

`react.layers()` contributes the React plugin and two settings the test runner reads, and a package
drops any one of the three by name.

`federation.host` records the name `remote` and no address for it. The name starts out pointed at
`https://federation.invalid`, a reserved domain that resolves nowhere, so the real address has to be
registered at run time before a route imports from a remote. `react.federation.shared()` supplies
the `shared` argument, marking `react` and `react-dom` as singletons at the range of the installed
major version.

The test runner has no second deployment to fetch from, so `stubs` aliases `remote/Dashboard` to
`src/remote.fixtures.tsx` under `test.alias` and nowhere else. Both `src/reports.spec.tsx` and
`src/routes.spec.tsx` reach a module that imports the specifier. `src/remotes.d.ts` declares the
same module for the type checker, which is all the compiler ever learns about what the other
deployment exposes.

## The routes

`src/routes.tsx` puts each page at an address and builds the router over the tree. The root route
renders `Outlet` and nothing else, so the matched page renders straight into the document body and a
remote module draws its own frame.

`routed()` hands back a new router on every call, with its own history and its own matched route.
One test cannot move another between routes.

`src/main.tsx` subscribes to `vite:preloadError` before the router exists, because the route a
visitor reaches first can be the one whose chunk has gone. The listener in `src/stale.ts` reloads
the page once per session and lets every later failure through. A deployment that is broken rather
than merely newer puts its error in front of somebody instead of drawing reloads from every open
page.
