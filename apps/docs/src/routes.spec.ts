import { describe, expect, it } from "vitest";

import { type Indexed } from "@stealthscale/specimen";
import { mountRoute, routerOver } from "@stealthscale/testing-router";

import { buildTree } from "#routes.tsx";

function entry(id: string, group: string, title: string): Indexed {
  return {
    about: "",
    group,
    id,
    load: () => Promise.resolve({}),
    package: "@stealthscale/component-actions",
    path: `src/${id}.specimen.tsx`,
    source: () => Promise.resolve({ default: "" }),
    title,
  };
}

const LISTED = [entry("actions/button", "Actions", "Button"), entry("data/badge", "Data", "Badge")];

describe("buildTree", () => {
  it("draws every indexed page beneath this application's own route", () => {
    const router = routerOver(buildTree(LISTED));
    const found = Object.keys(router.routesById).filter((id) => id.startsWith("/pages"));

    expect(found).toStrictEqual([
      "/pages",
      "/pages/_specimen.catalogue",
      "/pages/_specimen.catalogue/actions/button",
      "/pages/_specimen.catalogue/data/badge",
    ]);
  });

  it("sends the site root to the first page the index holds", async () => {
    const router = routerOver(buildTree(LISTED));

    await router.navigate({ to: "/" });
    await router.load();

    expect(router.state.location.pathname).toBe("/pages/actions/button");
  });

  it("sends the site root to the mount where the index found no page", async () => {
    const router = routerOver(buildTree([]));

    await router.navigate({ to: "/" });
    await router.load();

    expect(router.state.location.pathname).toBe("/pages");
  });

  it("draws the rail above the page the address names", async () => {
    const { result } = await mountRoute(buildTree(LISTED), "/pages/actions/button");

    expect(result.getByRole("navigation", { name: "Pages" })).toBeDefined();
  });

  it("addresses a page under the mount", async () => {
    const { result } = await mountRoute(buildTree(LISTED), "/pages/actions/button");

    expect(result.getByRole("link", { name: "Badge" }).getAttribute("href")).toBe(
      "/pages/data/badge",
    );
  });
});
