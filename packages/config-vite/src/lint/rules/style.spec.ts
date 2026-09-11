import { expect, test } from "vite-plus/test";

import { STYLE } from "#lint/rules/style.ts";

test("settles each choice one way, so none is argued per file", () => {
  for (const [rule, severity] of Object.entries(STYLE)) {
    expect(severity, `${rule} is neither required nor refused`).toBeDefined();
    expect(severity).not.toBe("off");
  }
});

test("asks for a return type, which is what lets a package publish types without checking them", () => {
  expect(STYLE["explicit-function-return-type"]).toBe("error");
});
