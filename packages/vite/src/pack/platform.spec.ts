import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { platform } from "#pack/platform.ts";

test("builds for the platform it was given", () => {
  const held = (platform("browser").config as UserConfig).pack as { platform: string };

  expect(held.platform).toBe("browser");
});

test("names the platform, so a package on two tiers keeps one answer rather than both", () => {
  expect(platform("node").name).toBe("pack.platform(node)");
  expect(platform("neutral").name).toBe("pack.platform(neutral)");
});
