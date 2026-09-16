import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/vite-plugin-sbom", () => {
  it("keeps the plugin package contract", async () => {
    await expect(
      violations({
        at: join(import.meta.dirname, ".."),
        kind: "plugin",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
