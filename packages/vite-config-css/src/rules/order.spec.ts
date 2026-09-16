import { describe, expect, it } from "vitest";

import { ORDER } from "#rules/order.ts";

describe("order", () => {
  it("sorts declarations", () => {
    expect(ORDER["order/properties-alphabetical-order"]).toBe(true);
  });
});
