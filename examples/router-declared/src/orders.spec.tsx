import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { catalogue } from "#catalogue.ts";
import { buildTree } from "#routes.ts";

/**
 * Opens the orders page.
 *
 * @returns The page, for a case to read out of.
 */
async function opened(): Promise<HTMLElement> {
  const { result } = await mountRoute(buildTree(await catalogue()), "/app/orders");

  return result.getByRole("main");
}

describe("Orders", () => {
  it("lists an order per row", async () => {
    expect(within(await opened()).getAllByRole("listitem")).toHaveLength(2);
  });

  it("links a row to that order by its declared id", async () => {
    const page = await opened();

    expect(within(page).getByRole("link", { name: "Order 8801" }).getAttribute("href")).toBe(
      "/app/orders/8801",
    );
  });

  it("draws inside the frame its declaration named", async () => {
    const page = await opened();
    const frame = page.closest("[aria-label='Sales']");

    expect(frame).not.toBeNull();
  });

  it("draws nothing in its outlet until an address names an order", async () => {
    expect(within(await opened()).queryByRole("article")).toBeNull();
  });
});
