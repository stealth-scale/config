# @stealthscale/example-router-declared

Draws routes that arrive as data. The pages, their addresses, the frames drawn around them and the
menu entries they carry all come from a catalogue this application reads rather than writes.

```bash
pnpm --filter @stealthscale/example-router-declared dev
```

The server listens on <http://localhost:4941>. This application mounts everything it draws under
`/app`, so the site root redirects there and the menu is drawn above whichever page is open.

## The pieces it uses

`catalogue.ts` stands in for whatever a real application fetches at boot. Every page is stated as an
importer and the export it is published under. The bundle holding a page loads on the first
navigation to it rather than at boot.

```ts
{
  component: { export: "Orders", load: () => import("#orders.tsx") },
  id: "sales.orders",
  layout: ["sales"],
  navigation: { label: "Orders", order: 1 },
  path: "/orders",
}
```

The tree is built by a function of the declarations rather than held in a module constant. Two calls
return two trees sharing no route, which is what lets one process serve two sets. Compiling into a
tree a router has already been built from would not allow that.

```ts
const compiled = compileRoutes(declarations, { layouts: LAYOUTS, parent: shell });

return root.addChildren([shell.addChildren([...compiled])]);
```

The shell carries its own id through `namedRoute`, the same way the compiler writes one onto a
declared route. `routeMap` then reads the assembled tree and finds both, so a link resolves through
one map whatever the route came from and this application carries one value rather than a pair.

```ts
const router = createRouter({ ...routerOptions({ routes: routeMap(tree) }), routeTree: tree });
```

## Linking without a path

A declared page does not know where it was mounted, so it cannot write a path. `orders.tsx` links to
one order by the reference the catalogue exports instead. That reference's type checks that `order`
is the parameter to fill.

```tsx
<RouteLink params={{ order: number }} to={order}>{`Order ${number}`}</RouteLink>
```

`order.tsx` reads that parameter back the same way. A compiled route is outside the tree this
application registered, so the library types a match's parameters as a union over the routes it did
register. `useRouteParams` reads them off the match and the reference names them.

## A frame takes no address

A layout is a pathless route. `sales.orders` and `sales.shipping` both name `sales`. They share one
frame, and neither `/app/orders` nor `/app/shipping` carries a segment for it.

The order page states no layout at all. Nesting beneath the orders page already puts it inside that
page's frames. Naming one again is refused, because the frame would otherwise be drawn twice.

## The menu reads declarations

`menu.tsx` draws from the declarations rather than from the router. A page in no menu is common, and
the router holds nothing about which pages a person should be offered.

`entry.ts` checks what `navigation` holds rather than trusting it. The compiler writes that value
onto the route without reading it. Its shape is therefore this application's to decide and this
application's to check.
