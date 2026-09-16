/**
 * Holds this package to the library contract every published package in the repository meets.
 *
 * @remarks
 *   The checks read the manifest on disk, the README and the module as it is exported. A package
 *   whose shape the repository does not allow fails in its own spec run rather than at an install.
 */

import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/testing", () => {
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
