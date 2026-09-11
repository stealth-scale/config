import { expect, test } from "vite-plus/test";

import { preset } from "#layer.ts";
import { why, wrote } from "#provenance.ts";

/**
 * One layer, since only its name and kind are read here.
 */
const BASE = preset({ config: {}, name: "base" });

test("reports only what changed", () => {
  const before = { mode: "test", run: { cache: true } };
  const after = { ...before, mode: "production" };

  expect(wrote(before, after, BASE).map((one) => one.at)).toEqual(["mode"]);
});

test("reports a value that appeared", () => {
  expect(wrote({}, { test: { environment: "node" } }, BASE).map((one) => one.at)).toEqual([
    "test.environment",
  ]);
});

test("names the layer and how it decided", () => {
  const [held] = wrote({}, { mode: "x" }, BASE);

  expect(held).toMatchObject({ kind: "preset", name: "base" });
});

test("carries no reason for a preset, because a preset states none", () => {
  expect(wrote({}, { mode: "x" }, BASE)[0]?.because).toBeUndefined();
});

test("answers what decided one path", () => {
  const sources = [
    { at: "mode", kind: "preset" as const, name: "base" },
    { at: "test.environment", kind: "preset" as const, name: "other" },
  ];

  expect(why(sources, "mode").map((one) => one.name)).toEqual(["base"]);
});

test("answers for everything under a path asked about by its root", () => {
  const sources = [
    { at: "test.environment", kind: "preset" as const, name: "a" },
    { at: "test.setupFiles", kind: "preset" as const, name: "b" },
    { at: "mode", kind: "preset" as const, name: "c" },
  ];

  expect(why(sources, "test").map((one) => one.name)).toEqual(["a", "b"]);
});
