/**
 * Proves the runner caches a script as readily as a task.
 */

import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { cache } from "#run/cache.ts";

describe("cache", () => {
  it("caches a script the same way it caches a task", () => {
    const held = (cache().config as UserConfig).run?.cache as { scripts: boolean; tasks: boolean };

    expect(held.scripts).toBe(true);
    expect(held.tasks).toBe(true);
  });

  it("names the layer so a repository can remove it", () => {
    expect(cache().name).toBe("run.cache");
  });
});
