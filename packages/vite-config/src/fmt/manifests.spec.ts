import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { manifests } from "#fmt/manifests.ts";

describe("manifests", () => {
  it("sorts a manifest into the conventional order rather than the order it was typed", () => {
    expect((manifests().config as UserConfig).fmt?.sortPackageJson).toBe(true);
  });

  it("declares the order rather than inheriting it", () => {
    expect((manifests().config as UserConfig).fmt).toHaveProperty("sortPackageJson");
  });
});
