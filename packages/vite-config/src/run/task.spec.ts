import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { task } from "#run/task.ts";

describe("task", () => {
  it("names a command under what it does", () => {
    const held = (task("lint", "vp check").config as UserConfig).run?.tasks;

    expect(held?.["lint"]).toBe("vp check");
  });

  it("takes a task declaring its inputs and outputs", () => {
    const held = (
      task("docs", { command: "typedoc", input: ["src/**"], output: ["docs/**"] })
        .config as UserConfig
    ).run?.tasks;

    expect(held?.["docs"]).toStrictEqual({
      command: "typedoc",
      input: ["src/**"],
      output: ["docs/**"],
    });
  });

  it("names the task it holds", () => {
    expect(task("docs", "typedoc").name).toBe("run.task(docs)");
  });
});
