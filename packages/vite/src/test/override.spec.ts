import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { covering, globalSetup, uncounted } from "#test/override.ts";

test("stops counting one glob at a time, so a later module can take back exactly one", () => {
  const held = uncounted({ because: "a shim", files: ["a/**", "b/**"] });

  expect(held.map((one) => one.item)).toEqual(["a/**", "b/**"]);
});

test("appends to what the tier already leaves out rather than replacing it", () => {
  for (const held of uncounted({ because: "a shim", files: ["a/**"] })) {
    expect(held.at).toBe("test.coverage.exclude");
  }
});

test("names each uncounted glob, which is what a removal asks for", () => {
  expect(uncounted({ because: "a shim", files: ["a/**"] })[0]?.name).toBe("test.uncounted(a/**)");
});

test("lowers only what it names, leaving the rest at the house answer", () => {
  const held = (covering({ branches: 70 }).config as UserConfig).test?.coverage?.thresholds;

  expect(held).toEqual({ branches: 70 });
});

test("names what it lowered, so a repository can see the promise it made", () => {
  expect(covering({ branches: 70, lines: 90 }).name).toBe("test.covering(branches, lines)");
});

test("runs a file once around the whole suite rather than once per test file", () => {
  const held = globalSetup({ because: "a database", files: ["/a/db.ts"] });

  expect(held[0]?.at).toBe("test.globalSetup");
});

test("contributes one file at a time, so a later module can take back exactly one", () => {
  const held = globalSetup({ because: "a database", files: ["/a/db.ts", "/a/queue.ts"] });

  expect(held.map((one) => one.name)).toEqual([
    "test.globalSetup(/a/db.ts)",
    "test.globalSetup(/a/queue.ts)",
  ]);
});
