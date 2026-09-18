# @stealthscale/testing-router

`@stealthscale/testing-router` mounts a route tree and renders the page a path matches. A
specification reads a screen rather than a route tree, and the order a router has to be driven in is
written once here rather than in every file.

## Install

```bash
pnpm add -D @stealthscale/testing-router
```

The package peers on `@stealthscale/provider-router`, `@testing-library/react` and `react`. Install
all three.

## Usage

```ts
import { mountRoute } from "@stealthscale/testing-router";
import { expect, it } from "vitest";

import { tree } from "#routes.ts";

it("draws the invoice the address names", async () => {
  const { result } = await mountRoute(tree(), "/invoices/42");

  expect(result.getByRole("article").textContent).toBe("Invoice 42");
});
```

`mountRoute` builds a router over the tree and reads the map every link resolves through out of the
same tree. It waits for everything the path loads before it renders. Preloading is off, so a link in
the rendered page fetches nothing on its own.

## Driving a router the application built

`mountRouter` takes a router instead of a tree. Use it where the application decides what the router
holds, such as one built for a session.

```ts
const { result, router } = await mountRouter(routed(ANONYMOUS), "/orders");

await router.navigate({ to: "/orders/8802" });
```

`routerOver` builds the router without rendering it, for a case that reads `routesById` or the
resolved paths rather than a screen.

## Navigate, load, then render

A router loads its matches before anything renders them. Rendering first draws the page the router
was on rather than the page the path names, and no error is reported. Each helper does the three
steps in that order.
