import { join } from "node:path";
import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

describe("@stealthscale/testing-config", () => {
  it("keeps the library package contract", async () => {
    await expect(
      published.violations({
        at: join(import.meta.dirname, ".."),
        kind: "library",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
