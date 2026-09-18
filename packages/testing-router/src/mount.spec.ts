import { createElement, type ReactNode } from "react";

import { describe, expect, it } from "vitest";

import {
  type AnyRoute,
  createAppRootRoute,
  createRoute,
  namedRoute,
  Outlet,
  RouteLink,
  type RoutesContext,
} from "@stealthscale/provider-router";

import { mountRoute, mountRouter, routerOver } from "#mount.ts";

/**
 * Draws the list of invoices, and whatever route is open beneath it.
 *
 * @returns The list and the outlet.
 */
function Invoices(): ReactNode {
  return createElement(
    "main",
    null,
    createElement(RouteLink, { params: { id: "42" }, to: "app.invoice" }, "Open 42"),
    createElement(Outlet),
  );
}

/**
 * Draws one invoice.
 *
 * @returns The invoice.
 */
function Invoice(): ReactNode {
  return createElement("article", null, "One invoice");
}

/**
 * Builds a tree with a list and one invoice beneath it.
 *
 * @returns The tree.
 */
function tree(): AnyRoute {
  const root = createAppRootRoute()({ component: Outlet });
  const invoices = createRoute({
    ...namedRoute("app.invoices"),
    component: Invoices,
    getParentRoute: () => root,
    path: "/invoices",
  });
  const invoice = createRoute({
    ...namedRoute("app.invoice"),
    component: Invoice,
    getParentRoute: () => invoices,
    path: "$id",
  });

  return root.addChildren([invoices.addChildren([invoice])]);
}

describe("routerOver", () => {
  it("opens the router at the path it was given", () => {
    expect(routerOver(tree(), "/invoices").state.location.pathname).toBe("/invoices");
  });

  it("opens the router at the site root where nothing states a path", () => {
    expect(routerOver(tree()).state.location.pathname).toBe("/");
  });

  it("builds a router of its own each time", () => {
    const built = tree();

    expect(routerOver(built)).not.toBe(routerOver(built));
  });

  it("puts the map every link resolves through in the router context", () => {
    const built: { options: { context: RoutesContext } } = routerOver(tree());

    expect(built.options.context.routes?.size).toBe(2);
  });
});

describe("mountRoute", () => {
  it("draws the page the path matches", async () => {
    const { result } = await mountRoute(tree(), "/invoices");

    expect(result.getByRole("main")).toBeTruthy();
  });

  it("draws a page nested under the one the path names", async () => {
    const { result } = await mountRoute(tree(), "/invoices/42");

    expect(result.getByRole("article").textContent).toBe("One invoice");
  });

  it("resolves a link by the id the route is named under", async () => {
    const { result } = await mountRoute(tree(), "/invoices");

    expect(result.getByRole("link").getAttribute("href")).toBe("/invoices/42");
  });

  it("returns the router the page was drawn from", async () => {
    const { router } = await mountRoute(tree(), "/invoices");

    expect(router.state.location.pathname).toBe("/invoices");
  });
});

describe("mountRouter", () => {
  it("draws the page the router is already on", async () => {
    const { result } = await mountRouter(routerOver(tree(), "/invoices/42"));

    expect(result.getByRole("article").textContent).toBe("One invoice");
  });

  it("navigates before it draws where a path is given", async () => {
    const { result } = await mountRouter(routerOver(tree(), "/invoices"), "/invoices/42");

    expect(result.getByRole("article").textContent).toBe("One invoice");
  });

  it("leaves the router where it is where no path is given", async () => {
    const { router } = await mountRouter(routerOver(tree(), "/invoices"));

    expect(router.state.location.pathname).toBe("/invoices");
  });
});
