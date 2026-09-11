import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { cache } from "#run/cache.ts";

test("caches a script the same way it caches a task, both being a command with inputs", () => {
  const held = (cache().config as UserConfig).run?.cache as { scripts: boolean; tasks: boolean };

  expect(held.scripts).toBe(true);
  expect(held.tasks).toBe(true);
});

test("names itself, so a workspace that cannot cache can take the layer back", () => {
  expect(cache().name).toBe("run.cache");
});
