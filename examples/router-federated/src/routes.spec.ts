import { describe, expect, it } from "vitest";

import { routeHref, routeMap } from "@stealthscale/provider-router";
import { routerOver } from "@stealthscale/testing-router";

import { declarations } from "#declarations.ts";
import { buildTree, routed } from "#routes.ts";

describe("buildTree", () => {
  it("routes its own page and the one the other deployment declared", async () => {
    const router = routed(await declarations());

    expect(Object.keys(router.routesById)).toStrictEqual(["__root__", "/", "/reports"]);
  });

  it("mounts the other deployment's page where that deployment asked", async () => {
    const tree = buildTree(await declarations());

    routerOver(tree);

    expect(routeHref(routeMap(tree), "remote.dashboard")).toBe("/reports");
  });

  it("names its own page beside the one that arrived", async () => {
    expect([...routeMap(buildTree(await declarations())).keys()].toSorted()).toStrictEqual([
      "app.home",
      "remote.dashboard",
    ]);
  });

  it("routes its own page where the other deployment declares nothing", () => {
    expect(Object.keys(routed([]).routesById)).toStrictEqual(["__root__", "/"]);
  });

  it("builds a router of its own each time", async () => {
    const found = await declarations();

    expect(routed(found)).not.toBe(routed(found));
  });
});
