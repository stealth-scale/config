import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { licences } from "#build/licences.ts";

describe("licences", () => {
  it("writes the licence of everything the build bundled", () => {
    expect((licences().config as UserConfig).build?.license).toBe(true);
  });

  it("names the layer so a repository can remove it", () => {
    expect(licences().name).toBe("build.licences");
  });
});
