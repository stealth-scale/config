import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { catalogue } from "#catalogue.ts";
import { buildTree } from "#routes.ts";

/**
 * Opens the application, whose shell draws the menu above whatever page is open.
 *
 * @returns The menu, for a case to read the links out of.
 */
async function drawn(): Promise<HTMLElement> {
  const { result } = await mountRoute(buildTree(await catalogue()), "/app/orders");

  return result.getByRole("navigation", { name: "Pages" });
}

describe("Menu", () => {
  it("draws a link per listed declaration", async () => {
    expect(within(await drawn()).getAllByRole("link")).toHaveLength(2);
  });

  it("orders the links by what each declaration states", async () => {
    const listed = within(await drawn()).getAllByRole("link");

    expect(listed.map((one) => one.textContent)).toStrictEqual(["Orders", "Shipping"]);
  });

  it("links to where this application mounted the page", async () => {
    const menu = await drawn();

    expect(within(menu).getByRole("link", { name: "Shipping" }).getAttribute("href")).toBe(
      "/app/shipping",
    );
  });

  it("marks the link to the page a person is on", async () => {
    const menu = await drawn();

    expect(within(menu).getByRole("link", { name: "Orders" }).dataset["status"]).toBe("active");
  });
});
