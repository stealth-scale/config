import { describe, expect, it } from "vitest";

import { createAppRootRoute, createRoute } from "@stealthscale/provider-router";
import { mountRoute, mountRouter } from "@stealthscale/testing-router";

import { summary } from "#catalogue.ts";
import { Page } from "#page.tsx";
import { routed } from "#routes.ts";
import { ANONYMOUS } from "#session.ts";

describe("Page", () => {
  it("names the declaration it was compiled from", async () => {
    const { result } = await mountRouter(routed(ANONYMOUS), "/summary");

    expect(result.getByRole("article").textContent).toBe(summary.id);
  });

  it("names nothing on a route nobody named", async () => {
    const root = createAppRootRoute()({});
    const unnamed = createRoute({ component: Page, getParentRoute: () => root, path: "/" });
    const { result } = await mountRoute(root.addChildren([unnamed]));

    expect(result.getByRole("article").textContent).toBe("none");
  });
});
