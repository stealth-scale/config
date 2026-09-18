import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { catalogue } from "#catalogue.ts";
import { buildTree } from "#routes.ts";
import { shellOf } from "#shell.tsx";

describe("shellOf", () => {
  it("builds a component of its own for each set of declarations", async () => {
    const declarations = await catalogue();

    expect(shellOf(declarations)).not.toBe(shellOf(declarations));
  });

  it("draws the menu above whatever page the address named", async () => {
    const { result } = await mountRoute(buildTree(await catalogue()), "/app/orders");

    expect(result.getByRole("navigation", { name: "Pages" })).toBeDefined();
    expect(result.getByRole("main")).toBeDefined();
  });
});
