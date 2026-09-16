/**
 * Holds this package to the contract every published library here keeps.
 *
 * @remarks
 *   The manifest and the entry point are checked together, so an export the
 *   package declares but does not deliver fails here rather than in the first
 *   consumer to install it.
 */

import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/vite-plugin-base", () => {
  it("keeps the library package contract", async () => {
    await expect(
      violations({
        at: join(import.meta.dirname, ".."),
        kind: "library",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
