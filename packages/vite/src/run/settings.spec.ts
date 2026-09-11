import { expect, test } from "vite-plus/test";

import { type Doing, type Running } from "#run/settings.ts";

test("takes a task written as nothing but its command", () => {
  const held: Doing = "vp check";

  expect(held).toBe("vp check");
});

test("takes a task that says what it reads and what it leaves behind", () => {
  const held: Doing = { command: "typedoc", input: ["src/**"], output: ["docs/**"] };

  expect(held).toHaveProperty("output");
});

test("refuses a task naming inputs while saying it is not cached", () => {
  // @ts-expect-error -- a task that is not cached has nothing to fingerprint.
  const held: Doing = { cache: false, command: "vp check", input: ["src/**"] };

  expect(held).toHaveProperty("cache");
});

test("holds the cache, the tasks and the lifecycle a workspace states at its root", () => {
  const held: Running = { cache: { scripts: true, tasks: true }, enablePrePostScripts: true };

  expect(held.cache).toBeDefined();
});
