import { expect, test } from "vite-plus/test";

import { ORDER } from "#rules/order.ts";

test("sorts declarations, the same as every other list whose order carries no meaning", () => {
  expect(ORDER["order/properties-alphabetical-order"]).toBe(true);
});
