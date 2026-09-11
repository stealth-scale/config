import { expect, test } from "vite-plus/test";

import { GENERATED } from "#ignore/generated.ts";

test("walks past what a tool wrote, by either conventional spelling", () => {
  expect(GENERATED).toEqual(["**/*.gen.*", "**/generated/**"]);
});

test("names neither node_modules nor a build directory, which are walked past already", () => {
  for (const held of GENERATED) {
    expect(held).not.toContain("node_modules");
    expect(held).not.toContain("dist");
  }
});
