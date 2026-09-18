import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { routed } from "#routes.ts";

/**
 * Opens the application at a path and draws it.
 *
 * @param at - The path to open.
 * @returns Nothing. The caller reads the screen.
 */
async function opened(at: string): Promise<void> {
  const router = routed();

  await router.navigate({ to: at });
  await router.load();

  render(<RouterProvider router={router} />);
}

describe("Invoices", () => {
  it("lists an invoice per row", async () => {
    await opened("/invoices");

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("links each row to that invoice's own address", async () => {
    await opened("/invoices");

    expect(screen.getByRole("link", { name: "Invoice 4102" }).getAttribute("href")).toBe(
      "/invoices/4102?tab=lines",
    );
  });

  it("draws nothing in its outlet until an address names an invoice", async () => {
    await opened("/invoices");

    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
  });
});
