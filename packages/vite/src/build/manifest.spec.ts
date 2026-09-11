import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { manifest } from "#build/manifest.ts";

test("writes the map from a source path to the hashed file it became", () => {
  expect((manifest().config as UserConfig).build?.manifest).toBe(true);
});

test("names itself, so a build nothing reads the output of can take the layer back", () => {
  expect(manifest().name).toBe("build.manifest");
});
