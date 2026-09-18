import { describe, expect, it } from "vitest";

import { routeHref, routeMap } from "@stealthscale/provider-router";
import { routerOver } from "@stealthscale/testing-router";

import { catalogue, order, orders, shipping } from "#catalogue.ts";
import { buildTree, routed } from "#routes.ts";

describe("buildTree", () => {
  it("draws every declared page beneath this application's own shell", async () => {
    const router = routed(await catalogue());

    expect(Object.keys(router.routesById).filter((id) => id.startsWith("/app"))).toStrictEqual([
      "/app",
      "/app/_sales",
      "/app/_sales/orders",
      "/app/_sales/orders/$order",
      "/app/_sales/shipping",
    ]);
  });

  it("sends the site root to the shell", async () => {
    const router = routed(await catalogue());

    await router.navigate({ to: "/" });
    await router.load();

    expect(router.state.location.pathname).toBe("/app");
  });

  it("leaves a layout out of the address", async () => {
    const tree = buildTree(await catalogue());
    const named = routeMap(tree);

    routerOver(tree);

    expect(named.get(orders.id)?.fullPath).toBe("/app/orders");
    expect(named.get(shipping.id)?.fullPath).toBe("/app/shipping");
  });

  it("nests a declaration beneath the one it names", async () => {
    const tree = buildTree(await catalogue());

    routerOver(tree);

    expect(routeMap(tree).get(order.id)?.fullPath).toBe("/app/orders/$order");
  });

  it("resolves a declared page from its id", async () => {
    const tree = buildTree(await catalogue());

    routerOver(tree);

    expect(routeHref(routeMap(tree), order, { order: "8801" })).toBe("/app/orders/8801");
  });

  it("names this application's own route beside the ones that arrived", async () => {
    expect([...routeMap(buildTree(await catalogue())).keys()].toSorted()).toStrictEqual([
      "app.shell",
      "sales.order",
      "sales.orders",
      "sales.shipping",
    ]);
  });

  it("builds two trees sharing no route", async () => {
    const declarations = await catalogue();

    expect(routeMap(buildTree(declarations)).get(orders.id)).not.toBe(
      routeMap(buildTree(declarations)).get(orders.id),
    );
  });
});
