import { expect, test } from "vite-plus/test";

import { appended } from "#path.ts";

test("appends to a list that is already there", () => {
  expect(appended({ test: { setupFiles: ["./a.ts"] } }, "test.setupFiles", "./b.ts")).toEqual({
    test: { setupFiles: ["./a.ts", "./b.ts"] },
  });
});

test("makes the list, and everything above it, where absent", () => {
  expect(appended({}, "test.setupFiles", "./a.ts")).toEqual({ test: { setupFiles: ["./a.ts"] } });
});

test("leaves what it did not walk untouched, so a config is not rebuilt per contribution", () => {
  const untouched = { environment: "node" };
  const held = appended({ lint: {}, test: untouched }, "lint.layers", "one");

  expect(held["test"]).toBe(untouched);
});

test("replaces what is at the path where it is not a list, rather than walking into it", () => {
  expect(appended({ test: { setupFiles: "./a.ts" } }, "test.setupFiles", "./b.ts")).toEqual({
    test: { setupFiles: ["./b.ts"] },
  });
});

test("appends at the top where the path names one step and no deeper", () => {
  expect(appended({}, "plugins", "one")).toEqual({ plugins: ["one"] });
});
