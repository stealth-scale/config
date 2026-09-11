import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { task } from "#run/task.ts";

test("names a command under what it does", () => {
  const held = (task("lint", "vp check").config as UserConfig).run?.tasks;

  expect(held?.["lint"]).toBe("vp check");
});

test("takes a task that says what it reads and what it leaves behind", () => {
  const held = (
    task("docs", { command: "typedoc", input: ["src/**"], output: ["docs/**"] })
      .config as UserConfig
  ).run?.tasks;

  expect(held?.["docs"]).toEqual({ command: "typedoc", input: ["src/**"], output: ["docs/**"] });
});

test("names the task it carries, so one can be taken back without the rest", () => {
  expect(task("docs", "typedoc").name).toBe("run.task(docs)");
});
