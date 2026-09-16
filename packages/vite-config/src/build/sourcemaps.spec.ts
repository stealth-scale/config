import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { sourcemaps } from "#build/sourcemaps.ts";

describe("sourcemaps", () => {
  it("emits maps", () => {
    expect((sourcemaps().config as UserConfig).build?.sourcemap).toBeTruthy();
  });

  it("hides them", () => {
    expect((sourcemaps().config as UserConfig).build?.sourcemap).toBe("hidden");
  });

  it("names the layer so a repository can remove it", () => {
    expect(sourcemaps().name).toBe("build.sourcemaps");
  });
});
