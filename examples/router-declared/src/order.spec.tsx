import { type RenderResult } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { catalogue } from "#catalogue.ts";
import { buildTree } from "#routes.ts";

/**
 * Opens one order.
 *
 * @param number - The order to open.
 * @returns What was rendered.
 */
async function opened(number: string): Promise<RenderResult> {
  const { result } = await mountRoute(buildTree(await catalogue()), `/app/orders/${number}`);

  return result;
}

describe("Order", () => {
  it("names the order the address asked for", async () => {
    expect((await opened("8802")).getByRole("article").textContent).toBe("Order 8802");
  });

  it("draws beside the list it was declared under", async () => {
    const page = await opened("8802");

    expect(page.getByRole("main").contains(page.getByRole("article"))).toBe(true);
  });

  it("draws inside the frame the list named", async () => {
    expect((await opened("8802")).getAllByRole("region", { name: "Sales" })).toHaveLength(1);
  });
});
