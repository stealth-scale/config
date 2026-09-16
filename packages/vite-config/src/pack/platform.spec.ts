import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { platform } from "#pack/platform.ts";

describe("platform", () => {
  it("builds for the platform it was given", () => {
    const held = (platform("browser").config as UserConfig).pack as { platform: string };

    expect(held.platform).toBe("browser");
  });

  it("names the platform", () => {
    expect(platform("node").name).toBe("pack.platform(node)");
    expect(platform("neutral").name).toBe("pack.platform(neutral)");
  });
});
