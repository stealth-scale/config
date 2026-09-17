import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { runtime } from "#ssr/runtime.ts";

describe("runtime", () => {
  it("builds for a worker runtime", () => {
    expect((runtime().config as UserConfig).ssr?.target).toBe("webworker");
  });

  it("names the runtime", () => {
    expect(runtime().name).toBe("ssr.runtime(webworker)");
  });
});
