import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { manifest } from "#build/manifest.ts";

describe("manifest", () => {
  it("writes the map from a source path to the hashed file it became", () => {
    expect((manifest().config as UserConfig).build?.manifest).toBe(true);
  });

  it("names the layer so a repository can remove it", () => {
    expect(manifest().name).toBe("build.manifest");
  });
});
