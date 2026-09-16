/**
 * Checks that the setup file the layer points at exists and is published with the package.
 */

import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { cleanup } from "#test/cleanup.ts";

describe("cleanup", () => {
  it("appends to the runner's setup files rather than replacing them", () => {
    expect(cleanup().at).toBe("test.setupFiles");
  });

  it("points at a file that this package actually ships", () => {
    expect(existsSync(cleanup().item as string)).toBe(true);
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(cleanup().name).toBe("react.test.cleanup");
  });

  it("publishes the setup file after packing", () => {
    const held = JSON.parse(
      readFileSync(new URL("../../package.json", import.meta.url).pathname, "utf8"),
    ) as { exports: Record<string, unknown>; files: string[] };

    expect(held.files, "vitest.setup.ts is not shipped").toContain("vitest.setup.ts");
    expect(Object.keys(held.exports), "vitest.setup.ts is not exported").toContain(
      "./vitest.setup.ts",
    );
  });
});
