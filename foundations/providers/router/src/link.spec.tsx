import { type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { compileRoutes } from "#compile.ts";
import { RouteLink, type RouteLinkProps } from "#link.tsx";
import { routeMap } from "#map.ts";
import { routerOptions } from "#options.ts";
import { createAppRootRoute } from "#root.ts";
import {
  createMemoryHistory,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "#tanstack.ts";

/**
 * Draws nothing, standing in for a page a declaration names.
 *
 * @returns Nothing.
 */
function Page(): null {
  return null;
}

/**
 * Renders a link to a declared route inside a router that knows the declarations.
 *
 * @remarks
 *   The link is drawn by the root route rather than by a page, because the root matches whatever
 *   the router opened. That is what lets one case read the link from a page the route it names is
 *   not on.
 * @param to - The declared id the link names.
 * @param params - The parameters the declared path names, where it names any.
 * @param over - Anything else to hand the link, which the library's own `Link` reads.
 * @param at - The path to open.
 * @returns Nothing. The caller reads the screen.
 */
async function linked(
  to: string,
  params?: Readonly<Record<string, string>>,
  over: Partial<RouteLinkProps> = {},
  at = "/",
): Promise<void> {
  /**
   * Draws the link above whatever page the router opened.
   *
   * @returns The link and the outlet.
   */
  function Chrome(): ReactNode {
    return (
      <div>
        <RouteLink params={params} to={to} {...over}>
          Open
        </RouteLink>
        <Outlet />
      </div>
    );
  }

  const root = createAppRootRoute()({ component: Chrome });
  const home = createRoute({ component: Page, getParentRoute: () => root, path: "/" });
  const plugins = createRoute({ getParentRoute: () => root, path: "/app" });
  const compiled = compileRoutes(
    [
      { component: Page, id: "acme.list", path: "/invoices" },
      { component: Page, id: "acme.one", path: "/invoices/$id" },
    ],
    { parent: plugins },
  );
  const tree = root.addChildren([home, plugins.addChildren([...compiled])]);
  const router = createRouter({
    ...routerOptions({ routes: routeMap(tree) }),
    history: createMemoryHistory({ initialEntries: [at] }),
    routeTree: tree,
  });

  await router.load();

  render(<RouterProvider router={router} />);
}

describe("RouteLink", () => {
  it("links to the path a declared id resolves to", async () => {
    await linked("acme.list");

    expect(screen.getByRole("link").getAttribute("href")).toBe("/app/invoices");
  });

  it("fills in what the declared path names", async () => {
    await linked("acme.one", { id: "42" });

    expect(screen.getByRole("link").getAttribute("href")).toBe("/app/invoices/42");
  });

  it("reads whatever it was given", async () => {
    await linked("acme.list");

    expect(screen.getByRole("link").textContent).toBe("Open");
  });

  it("carries the library's own active state onto a declared link", async () => {
    await linked("acme.list", undefined, {}, "/app/invoices");

    const link = screen.getByRole("link");

    expect(link.dataset["status"]).toBe("active");
    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("stays active on a page below the route it names", async () => {
    await linked("acme.list", undefined, {}, "/app/invoices/42");

    expect(screen.getByRole("link").dataset["status"]).toBe("active");
  });

  it("is not active where the page is elsewhere", async () => {
    await linked("acme.list", undefined, {}, "/");

    expect(screen.getByRole("link").dataset["status"]).toBeUndefined();
  });

  it("hands the library everything else it was given", async () => {
    await linked("acme.list", undefined, { className: "menu", title: "Invoices" });

    const link = screen.getByRole("link");

    expect(link.getAttribute("class")).toBe("menu");
    expect(link.getAttribute("title")).toBe("Invoices");
  });
});
