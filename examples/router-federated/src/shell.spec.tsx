import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { declarations } from "#declarations.ts";
import { buildTree } from "#routes.ts";

/**
 * Opens the application, whose shell draws the menu above whatever page is open.
 *
 * @param declared - The pages the other deployment contributes.
 * @returns The menu, for a case to read the links out of.
 */
async function drawn(declared: Awaited<ReturnType<typeof declarations>>): Promise<HTMLElement> {
  const { result } = await mountRoute(buildTree(declared));

  return result.getByRole("navigation", { name: "Pages" });
}

describe("shellOf", () => {
  it("draws this application's page beside the ones that arrived", async () => {
    const menu = await drawn(await declarations());

    expect(
      within(menu)
        .getAllByRole("link")
        .map((one) => one.textContent),
    ).toStrictEqual(["Home", "Reports"]);
  });

  it("links to where the other deployment asked its page to go", async () => {
    const menu = await drawn(await declarations());

    expect(within(menu).getByRole("link", { name: "Reports" }).getAttribute("href")).toBe(
      "/reports",
    );
  });

  it("draws this application's page alone where the other declared nothing", async () => {
    const menu = await drawn([]);

    expect(
      within(menu)
        .getAllByRole("link")
        .map((one) => one.textContent),
    ).toStrictEqual(["Home"]);
  });
});
