import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { runtime } from "#ssr/runtime.ts";

test("builds for a worker runtime, which has no node built-ins to fall back on", () => {
  expect((runtime().config as UserConfig).ssr?.target).toBe("webworker");
});

test("names the runtime, so a config says why a server build resolves as it does", () => {
  expect(runtime().name).toBe("ssr.runtime(webworker)");
});
