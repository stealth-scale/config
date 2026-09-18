import { type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { compileRoutes } from "#compile.ts";
import { type RouteDeclaration } from "#declaration.ts";
import { declaredOf, useDeclaredRoute, useRouteParams } from "#declared.ts";
import { routeMap } from "#map.ts";
import { type RouteRef } from "#reference.ts";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorComponentProps,
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
 * Draws whatever the deepest declared route is, so a case can read it off the screen.
 *
 * @returns The declared id, or nothing where no declared route is matched.
 */
function Reading(): ReactNode {
  const declared = useDeclaredRoute();

  return (
    <div>
      <span data-testid="declared">{declared === undefined ? "none" : declared.id}</span>
      <Outlet />
    </div>
  );
}

/**
 * Draws why a page refused to render, so a case can read it off the screen.
 *
 * @param props - What the library hands an error component.
 * @returns The message.
 */
function Failed({ error }: ErrorComponentProps): ReactNode {
  return <span data-testid="failed">{String(error)}</span>;
}

/**
 * Opens a host at a path, with one declared route and one route written in code.
 *
 * @param at - The path to open.
 * @param declarations - The routes to compile.
 * @returns Nothing. The caller reads the screen.
 */
async function opened(at: string, declarations: readonly RouteDeclaration[]): Promise<void> {
  const root = createRootRoute({ component: Reading });
  const shell = createRoute({
    component: () => <Outlet />,
    getParentRoute: () => root,
    path: "/app",
  });
  const written = createRoute({ component: Page, getParentRoute: () => shell, path: "/home" });
  const routes = compileRoutes(declarations, { errorComponent: () => Failed, parent: shell });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [at] }),
    routeTree: root.addChildren([shell.addChildren([written, ...routes])]),
  });

  await router.load();

  render(<RouterProvider router={router} />);
}

describe("declaredOf", () => {
  it("reads the declaration a compiled route carries", () => {
    const root = createRootRoute({});
    const compiled = compileRoutes(
      [{ component: Page, id: "acme.one", navigation: { order: 2 }, path: "/one" }],
      { parent: root },
    );
    const named = routeMap(root.addChildren([...compiled]));

    expect(
      declaredOf({ staticData: named.get("acme.one")?.options.staticData ?? {} }),
    ).toStrictEqual({
      id: "acme.one",
      navigation: { order: 2 },
    });
  });

  it("returns nothing for a match carrying no declaration", () => {
    expect(declaredOf({ staticData: {} })).toBeUndefined();
  });

  it("reads a declaration that carried no menu entry", () => {
    expect(declaredOf({ staticData: { declared: { id: "acme.one" } } })).toStrictEqual({
      id: "acme.one",
    });
  });

  it("returns nothing where the static data carries something else", () => {
    expect(declaredOf({ staticData: { declared: "a string" } })).toBeUndefined();
    expect(declaredOf({ staticData: { declared: { order: 2 } } })).toBeUndefined();
  });
});

describe("useDeclaredRoute", () => {
  it("returns the declaration of the page a person is on", async () => {
    await opened("/app/one", [{ component: Page, id: "acme.one", path: "/one" }]);

    expect(screen.getByTestId("declared").textContent).toBe("acme.one");
  });

  it("returns the deepest declaration where one nests under another", async () => {
    await opened("/app/one/two", [
      { component: Page, id: "acme.one", path: "/one" },
      { component: Page, id: "acme.two", parent: "acme.one", path: "/two" },
    ]);

    expect(screen.getByTestId("declared").textContent).toBe("acme.two");
  });

  it("returns nothing on a page drawn from a route nobody named", async () => {
    await opened("/app/home", [{ component: Page, id: "acme.one", path: "/one" }]);

    expect(screen.getByTestId("declared").textContent).toBe("none");
  });
});

describe("useRouteParams", () => {
  /**
   * The reference a plugin SDK hands back for the route below.
   */
  const invoice: RouteRef<{ invoice: string }> = { id: "acme.one" };

  /**
   * Draws the parameter the reference says the route names.
   *
   * @returns The parameter, by name.
   */
  function Invoice(): ReactNode {
    return <span data-testid="read">{useRouteParams(invoice).invoice}</span>;
  }

  it("returns the parameters the route named under the names the reference carries", async () => {
    await opened("/app/invoices/42", [
      { component: Invoice, id: "acme.one", path: "/invoices/$invoice" },
    ]);

    expect(screen.getByTestId("read").textContent).toBe("42");
  });

  it("throws where the page being drawn is another route", async () => {
    await opened("/app/other", [
      { component: Invoice, id: "acme.other", path: "/other" },
      { component: Page, id: "acme.one", path: "/invoices/$invoice" },
    ]);

    expect(screen.getByTestId("failed").textContent).toContain(
      "The page being drawn is not acme.one",
    );
  });
});
