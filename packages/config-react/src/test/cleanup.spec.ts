import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";

import { cleanup } from "#test/cleanup.ts";

test("appends to the runner's setup files rather than replacing them", () => {
  expect(cleanup().at).toBe("test.setupFiles");
});

test("points at a file that this package actually ships", () => {
  expect(existsSync(cleanup().item as string)).toBe(true);
});

test("is named so a repository using a testing library can take it back", () => {
  expect(cleanup().name).toBe("react.cleanup");
});

test("publishes the setup file after packing, which the packer would otherwise drop", () => {
  const held = JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url).pathname, "utf8"),
  ) as { exports: Record<string, unknown>; files: string[] };

  expect(held.files, "vitest.setup.ts is not shipped").toContain("vitest.setup.ts");
  expect(Object.keys(held.exports), "vitest.setup.ts is not exported").toContain(
    "./vitest.setup.ts",
  );
});
