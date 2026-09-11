import { expect, test } from "vite-plus/test";

import { applies, contribute, override, preset, remove } from "#layer.ts";

/**
 * The environment a build is read in.
 */
const BUILDING = { command: "build", mode: "production" } as const;

test("marks each kind, so the pipeline can tell them apart", () => {
  expect(preset({ config: {}, name: "a" }).kind).toBe("preset");
  expect(contribute({ at: "x", because: "b", item: 1, name: "a" }).kind).toBe("contribution");
  expect(remove({ because: "b", name: "a", target: "t" }).kind).toBe("removal");
  expect(override({ because: "b", name: "a", refine: (c) => c }).kind).toBe("override");
});

test("keeps what it was stated with", () => {
  const held = contribute({
    at: "test.setupFiles",
    because: "a reason",
    item: "./a.ts",
    name: "s",
  });

  expect(held).toMatchObject({ at: "test.setupFiles", because: "a reason", item: "./a.ts" });
});

test("takes part everywhere when it says nothing about where", () => {
  expect(applies(preset({ config: {}, name: "a" }), BUILDING)).toBe(true);
});

test("takes part in the command it names, and no other", () => {
  expect(applies(preset({ apply: "build", config: {}, name: "a" }), BUILDING)).toBe(true);
  expect(applies(preset({ apply: "serve", config: {}, name: "a" }), BUILDING)).toBe(false);
});

test("asks a predicate, where it was given one", () => {
  const held = preset({ apply: (env) => env.mode === "production", config: {}, name: "a" });

  expect(applies(held, BUILDING)).toBe(true);
  expect(applies(held, { command: "build", mode: "test" })).toBe(false);
});
