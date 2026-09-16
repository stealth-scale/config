import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { preload } from "#build/preload.ts";

describe("preload", () => {
  it("ships no polyfill", () => {
    const held = (preload().config as UserConfig).build?.modulePreload as { polyfill: boolean };

    expect(held.polyfill).toBe(false);
  });

  it("keeps the hints themselves", () => {
    expect((preload().config as UserConfig).build?.modulePreload).not.toBe(false);
  });

  it("names the layer so a repository can remove it", () => {
    expect(preload().name).toBe("build.preload");
  });
});
