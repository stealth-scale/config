import { expect, test } from "vite-plus/test";

import { rules } from "#lint/rules.ts";

/**
 * Reads the rules the contribution carries.
 *
 * @returns Each rule against what the linter should do about it.
 */
function stated(): Record<string, unknown> {
  const held = rules().item as { rules: Record<string, unknown> };

  return held.rules;
}

test("allows JSX in a TypeScript file, which the rule does not know about on its own", () => {
  expect(stated()["react/jsx-filename-extension"]).toEqual([
    "error",
    { extensions: [".jsx", ".tsx"] },
  ]);
});

test("refuses markup assigned as a string, the same as anywhere else", () => {
  expect(stated()["react/no-danger"]).toBe("error");
});

test("holds a file to one component, which the folder layout already assumes", () => {
  expect(stated()["react/no-multi-comp"]).toBe("error");
});

test("keeps a file refreshable, by refusing an export beside the component", () => {
  expect(stated()["react/only-export-components"]).toBe("error");
});

test("asks more rather than less, so it reads as an enforcement", () => {
  expect(rules().name).toContain("lint.enforce");
  for (const held of Object.values(stated())) expect(held).not.toBe("off");
});
