import { expect, test } from "vite-plus/test";

import { ANIMATION } from "#rules/animation.ts";

test("refuses an animation the browser cannot run on the compositor", () => {
  expect(ANIMATION["plugin/no-low-performance-animation-properties"]).toBe(true);
});
