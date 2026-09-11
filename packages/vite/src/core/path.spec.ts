import { expect, test } from "vite-plus/test";

import { appended, at, leaves } from "#core/path.ts";

test("reads what sits at a path", () => {
  expect(at({ test: { environment: "node" } }, "test.environment")).toBe("node");
});

test("reads nothing where the path names nothing", () => {
  expect(at({ test: {} }, "test.missing.deeper")).toBeUndefined();
});

test("appends to a list that is already there", () => {
  expect(appended({ test: { setupFiles: ["./a.ts"] } }, "test.setupFiles", "./b.ts")).toEqual({
    test: { setupFiles: ["./a.ts", "./b.ts"] },
  });
});

test("makes the list, and everything above it, where absent", () => {
  expect(appended({}, "test.setupFiles", "./a.ts")).toEqual({ test: { setupFiles: ["./a.ts"] } });
});

test("leaves what it did not walk untouched, so provenance can compare by identity", () => {
  const untouched = { environment: "node" };
  const held = appended({ lint: {}, test: untouched }, "lint.layers", "one");

  expect(held["test"]).toBe(untouched);
});

test("counts an array as a leaf rather than walking into it", () => {
  const held = leaves({ mode: "test", resolve: { conditions: ["a", "b"] } });

  expect([...held].toSorted()).toEqual(["mode", "resolve.conditions"]);
});

test("appends at the top where the path names one step and no deeper", () => {
  expect(appended({}, "plugins", "one")).toEqual({ plugins: ["one"] });
});
