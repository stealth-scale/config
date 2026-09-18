import { fireEvent, type RenderResult, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mountRouter } from "@stealthscale/testing-router";

import { routed } from "#routes.ts";
import { ANONYMOUS, signedInAs } from "#session.ts";

/**
 * Opens the application at one address, for somebody who has not signed in.
 *
 * @param at - The address to open.
 * @returns The render, for a case to read the frame out of.
 */
async function drawn(at: string): Promise<RenderResult> {
  signedInAs(ANONYMOUS);

  const { result } = await mountRouter(routed(), at);

  return result;
}

describe("Shell", () => {
  it("draws a link per page the catalogue declares", async () => {
    const menu = (await drawn("/summary")).getByRole("navigation", { name: "Pages" });

    expect(
      within(menu)
        .getAllByRole("link")
        .map((one) => one.textContent),
    ).toStrictEqual(["Summary", "Mine", "Audit"]);
  });

  it("links to where this application mounted the page", async () => {
    const menu = (await drawn("/summary")).getByRole("navigation", { name: "Pages" });

    expect(within(menu).getByRole("link", { name: "Audit" }).getAttribute("href")).toBe("/audit");
  });

  it("lists a page the reader would be refused", async () => {
    const menu = (await drawn("/summary")).getByRole("navigation", { name: "Pages" });

    expect(within(menu).getByRole("link", { name: "Mine" }).getAttribute("href")).toBe("/mine");
  });

  it("marks the reader the session is set to", async () => {
    const controls = (await drawn("/summary")).getByRole("group", { name: "Reading as" });

    expect(within(controls).getByRole("button", { pressed: true }).textContent).toBe("Anonymous");
  });

  it("marks the reader a person chooses instead", async () => {
    const controls = (await drawn("/summary")).getByRole("group", { name: "Reading as" });

    fireEvent.click(within(controls).getByRole("button", { name: "Auditor" }));

    expect(within(controls).getByRole("button", { pressed: true }).textContent).toBe("Auditor");
  });
});
