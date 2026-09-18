import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { routed } from "#routes.ts";
import { type Tab } from "#tab.ts";

/**
 * Opens one invoice, on the tab a case names.
 *
 * @remarks
 *   The path, the parameter and the search key are all checked against the registered router, so a
 *   case naming a tab this application has none of fails to compile.
 * @param id - The invoice to open.
 * @param tab - The tab to open it on. The lines where a case names none.
 * @returns Nothing. The caller reads the screen.
 */
async function opened(id: string, tab?: Tab): Promise<void> {
  const router = routed();

  await router.navigate({ params: { id }, search: { tab: tab ?? "lines" }, to: "/invoices/$id" });
  await router.load();

  render(<RouterProvider router={router} />);
}

describe("Invoice", () => {
  it("names the invoice the address asked for", async () => {
    await opened("4102");

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Invoice 4102");
  });

  it("shows the lines where the search names no tab", async () => {
    await opened("4102");

    expect(screen.getByText("Showing the lines.")).toBeDefined();
  });

  it("shows the tab the search names", async () => {
    await opened("4102", "history");

    expect(screen.getByText("Showing the history.")).toBeDefined();
  });

  it("marks the tab the page is on", async () => {
    await opened("4102", "history");

    expect(screen.getByRole("link", { name: "History" }).dataset["status"]).toBe("active");
  });
});
