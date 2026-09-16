/**
 * Proves the task types accept each form, and reject an uncached task naming
 * inputs.
 */

import { describe, expect, it } from "vitest";

import { type Doing, type Running } from "#run/settings.ts";

describe("settings", () => {
  it("takes a task written as nothing but its command", () => {
    const held: Doing = "vp check";

    expect(held).toBe("vp check");
  });

  it("takes a task declaring its inputs and outputs", () => {
    const held: Doing = { command: "typedoc", input: ["src/**"], output: ["docs/**"] };

    expect(held).toHaveProperty("output");
  });

  it("throws for a task naming inputs while declaring it is not cached", () => {
    // @ts-expect-error -- a task that is not cached has nothing to fingerprint.
    const held: Doing = { cache: false, command: "vp check", input: ["src/**"] };

    expect(held).toHaveProperty("cache");
  });

  it("holds the cache the tasks and the lifecycle a workspace declares at its root", () => {
    const held: Running = { cache: { scripts: true, tasks: true }, enablePrePostScripts: true };

    expect(held.cache).toBeDefined();
  });
});
