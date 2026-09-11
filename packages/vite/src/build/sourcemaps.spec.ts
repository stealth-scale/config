import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { sourcemaps } from "#build/sourcemaps.ts";

test("emits maps, so a production stack trace names a line somebody wrote", () => {
  expect((sourcemaps().config as UserConfig).build?.sourcemap).toBeTruthy();
});

test("hides them, so the bundle points at nothing and a browser fetches nothing", () => {
  expect((sourcemaps().config as UserConfig).build?.sourcemap).toBe("hidden");
});

test("names itself, so a build that must not emit them can take the layer back", () => {
  expect(sourcemaps().name).toBe("build.sourcemaps");
});
