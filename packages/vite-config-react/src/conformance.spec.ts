import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/vite-config-react", () => {
  it("keeps the config package contract", async () => {
    await expect(
      violations({
        at: join(import.meta.dirname, ".."),
        kind: "config",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
