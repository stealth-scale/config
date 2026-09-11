import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { preload } from "#build/preload.ts";

test("ships no polyfill, every browser the build targets supporting the hint already", () => {
  const held = (preload().config as UserConfig).build?.modulePreload as { polyfill: boolean };

  expect(held.polyfill).toBe(false);
});

test("keeps the hints themselves, which are what make a chunk arrive before it is asked for", () => {
  expect((preload().config as UserConfig).build?.modulePreload).not.toBe(false);
});

test("names itself, so a build reaching older browsers can take the layer back", () => {
  expect(preload().name).toBe("build.preload");
});
