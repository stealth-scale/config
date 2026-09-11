import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { order } from "#test/order.ts";

test("runs in a different order every time, so a test cannot lean on the one before it", () => {
  const held = (order().config as UserConfig).test?.sequence;

  expect(held?.shuffle).toBe(true);
});
