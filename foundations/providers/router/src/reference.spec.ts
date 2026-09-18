import { describe, expect, it } from "vitest";

import { idOf, type RouteRef } from "#reference.ts";

describe("idOf", () => {
  it("reads the id a reference carries", () => {
    const invoice: RouteRef<{ invoice: string }> = { id: "acme/invoice" };

    expect(idOf(invoice)).toBe("acme/invoice");
  });

  it("takes a bare id as the id", () => {
    expect(idOf("acme/invoice")).toBe("acme/invoice");
  });

  it("takes a reference carrying more than this package reads", () => {
    const marker = { id: "acme/invoice", kind: "route", path: "/invoices/:invoice" };

    expect(idOf(marker)).toBe("acme/invoice");
  });
});
