import { type RenderResult } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { catalogue } from "#catalogue.ts";
import { buildTree } from "#routes.ts";

/**
 * Opens the shipping settings.
 *
 * @returns What was rendered.
 */
async function opened(): Promise<RenderResult> {
  const { result } = await mountRoute(buildTree(await catalogue()), "/app/shipping");

  return result;
}

describe("Shipping", () => {
  it("draws the settings", async () => {
    expect((await opened()).getByRole("article").textContent).toBe("Shipping settings");
  });

  it("shares the frame the orders page names", async () => {
    expect((await opened()).getAllByRole("region", { name: "Sales" })).toHaveLength(1);
  });
});
