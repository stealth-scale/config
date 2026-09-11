import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";

import { runtime } from "#lint/runtime.ts";

/**
 * Reads the tsconfig this package ships.
 *
 * @returns Its compiler options.
 */
function shipped(): Record<string, unknown> {
  const source = readFileSync(new URL("../../web.json", import.meta.url).pathname, "utf8");
  const held = JSON.parse(source) as { compilerOptions: Record<string, unknown> };

  return held.compilerOptions;
}

test("stops asking for React in scope", () => {
  const held = runtime().item as { rules: Record<string, unknown> };

  expect(held.rules["react/react-in-jsx-scope"]).toBe("off");
});

test("is paired with the tsconfig that makes it obsolete, and fails if either moves", () => {
  expect(shipped()["jsx"]).toBe("react-jsx");
});

test("relaxes rather than enforces, so the direction is in the name", () => {
  expect(runtime().name).toContain("lint.relax");
});
