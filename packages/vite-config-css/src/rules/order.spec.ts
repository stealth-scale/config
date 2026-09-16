/**
 * Pins the one rule the order set carries, and the value it is set to.
 */

import { describe, expect, it } from "vitest";

import { ORDER } from "#rules/order.ts";

describe("order", () => {
  it("sorts declarations", () => {
    expect(ORDER["order/properties-alphabetical-order"]).toBe(true);
  });
});
