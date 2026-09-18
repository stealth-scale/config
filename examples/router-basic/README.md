# @stealthscale/example-router-basic

Routes an application whose every address is known when it is built. Two pages, one nested under the
other, with the invoice's number in its path and the open tab in its search string.

```bash
pnpm --filter @stealthscale/example-router-basic dev
```

## It uses TanStack Router and nothing else

This application imports no foundation. Every route is written in code, so the library types each
path, parameter and search key on its own, and there is nothing for `@stealthscale/provider-router`
to add.

```ts
const router = createRouter({ defaultPreload: "intent", routeTree, scrollRestoration: true });
```

`useParams({ from: "/invoices/$id" })` returns `id` as a string and `useSearch` returns `tab` as one
of the two the validator allows, both worked out from the router type this application registers. A
`Link` is checked the same way. Writing a path this application does not serve is a compile error
rather than a blank page, and no id, map or reference is involved.

## register.d.ts

`register.d.ts` holds the augmentation the library resolves every path against. The statement is
type-only and erases to nothing, so a declaration file is the right home for it.

```ts
import { type Routed } from "#routes.ts";

declare module "@tanstack/react-router" {
  interface Register {
    router: Routed;
  }
}
```

Keep the import. Without it the file has no import and no export, `declare module` becomes an
ambient declaration, and that replaces the library's types rather than adding to them. Every import
of `Link` or `RouterProvider` then fails to resolve, which is noisy and quick to diagnose.

The quiet failure is the file dropping out of the program. Nothing imports it at run time, so `Link`
falls back to accepting any string and no error is reported anywhere. `routes.spec.ts` asserts the
registered route ids, and that assertion stops compiling if the registration goes.

```ts
type Served = "__root__" | "/invoices" | "/invoices/$id";

expectTypeOf<RouteIds<RegisteredRouter["routeTree"]>>().toEqualTypeOf<Served>();
```

## Addresses decided at run time

`@stealthscale/provider-router` compiles routes that are not in the build: pages another deployment
declares, pages a condition decides, pages a host mounts under a path it chooses when it starts.
None of those can be typed from a route tree, because the tree is not known until the application
runs. Each is shown by another `router-*` example.

Use the foundation when an address is decided at run time. Until then `routes.ts` is the whole of
what routing costs.
