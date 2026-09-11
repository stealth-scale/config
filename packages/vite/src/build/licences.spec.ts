import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { licences } from "#build/licences.ts";

test("writes the licence of everything the build bundled", () => {
  expect((licences().config as UserConfig).build?.license).toBe(true);
});

test("names itself, so an application bundling nothing to credit can take the layer back", () => {
  expect(licences().name).toBe("build.licences");
});
